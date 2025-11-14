import { Problem, ProblemSeverity } from "@/shared/model/types";
import analyze from "../lib/analyze";
import lex from "../lib/lex";
import parse, { ASTNode_Card, ASTNodeType } from "../lib/parse";
import { Mill } from "./types";
import { createStore, produce, SetStoreFunction } from "solid-js/store";
import { Accessor, createSignal, Setter } from "solid-js";
import playBell from "@/shared/lib/playBell";
import wrap from "@/shared/lib/wrap";

export default class Interpreter {
  mill: Mill;
  #setMill: SetStoreFunction<Mill>;
  store: number[];
  #setStore: SetStoreFunction<number[]>;

  chain: ASTNode_Card[] = [];
  readerPosition: Accessor<number>;
  #setReaderPosition: Setter<number>;

  printingApparatus: Accessor<string>;
  #setPrintingApparatus: Setter<string>;

  isMounted: Accessor<boolean>;
  #setIsMounted: Setter<boolean>;

  #toLoadIngressAxis1: boolean = true;

  isAnimated: Accessor<boolean>;
  #setIsAnimated: Setter<boolean>;
  #animateTimeoutId?: number = undefined;

  constructor() {
    [this.mill, this.#setMill] = createStore<Mill>({
      operation: "",
      runUpLever: false,
      ingressAxis1: 0,
      ingressAxis2: 0,
      egressAxis: 0,
    });
    [this.store, this.#setStore] = createStore(new Array<number>(1000).fill(0));

    [this.readerPosition, this.#setReaderPosition] = createSignal<number>(0);

    [this.printingApparatus, this.#setPrintingApparatus] =
      createSignal<string>("");

    [this.isMounted, this.#setIsMounted] = createSignal<boolean>(false);

    [this.isAnimated, this.#setIsAnimated] = createSignal<boolean>(false);
  }

  prepare(lines: string[]) {
    if (this.isMounted()) return [];

    const problems: Problem[] = [];

    // 1. lexical analysis
    const tokens = lex(lines, problems);

    // 2. syntax analysis
    const cards = parse(tokens, problems);

    // 3. semantic analysis
    analyze(cards, problems);

    this.chain =
      problems.find((v) => v.severity === ProblemSeverity.Error) === undefined
        ? cards
        : [];

    return problems;
  }

  mount() {
    this.#setIsMounted(this.chain.length !== 0);
  }

  run() {
    while (!this.step());
  }

  animate(timeout = 250) {
    const stepDelay = () => {
      if (this.step()) {
        this.#setIsAnimated(false);
        return;
      }

      this.#animateTimeoutId = setTimeout(stepDelay, timeout);
    };

    stepDelay();
    this.#setIsAnimated(true);
  }

  pause() {
    clearTimeout(this.#animateTimeoutId);
    this.#setIsAnimated(false);
  }

  /**
   * @returns True if the program halted, false if not.
   */
  step() {
    if (!this.isMounted()) return true;

    const card = this.chain[this.readerPosition()];

    // For the machine to read, it would have to move reader
    this.#setReaderPosition((prev) => (prev + 1) % this.chain.length);

    switch (card.type) {
      case ASTNodeType.NumberCard:
        // Assume we don't have errors regarding multiple defintions
        this.#setStore(card.address, card.number.value);
        break;
      case ASTNodeType.OperationCard:
        this.#setMill("operation", card.operation);
        break;
      case ASTNodeType.ActionCard:
        switch (card.action) {
          case "P":
            this.#setPrintingApparatus(
              (prev) => prev + `${this.mill.egressAxis}\n`,
            );
            break;
          case "H":
            this.halt();
            return true;
          case "B":
            playBell();
            break;
        }

        break;
      case ASTNodeType.CombinatorialCard:
        if (card.condition === "+" || this.mill.runUpLever) {
          this.#setReaderPosition((prev) =>
            wrap(
              prev + card.skips * (card.direction === "F" ? 1 : -1),
              this.chain.length,
            ),
          );
        }
        break;
      case ASTNodeType.VariableCard:
        if (card.action == "L") {
          if (this.#toLoadIngressAxis1) {
            this.#setMill("ingressAxis1", this.store[card.address]);
          } else {
            this.#setMill("ingressAxis2", this.store[card.address]);

            switch (this.mill.operation) {
              case "+":
                this.#setMill(
                  "egressAxis",
                  this.mill.ingressAxis1 + this.mill.ingressAxis2,
                );
                this.#setMill(
                  "runUpLever",
                  sign(this.mill.egressAxis) !== sign(this.mill.ingressAxis1),
                );
                break;
              case "-":
                this.#setMill(
                  "egressAxis",
                  this.mill.ingressAxis1 - this.mill.ingressAxis2,
                );
                this.#setMill(
                  "runUpLever",
                  sign(this.mill.egressAxis) !== sign(this.mill.ingressAxis1),
                );
                break;
              case "*":
                this.#setMill(
                  "egressAxis",
                  this.mill.ingressAxis1 * this.mill.ingressAxis2,
                );
                this.#setMill("runUpLever", false);
                break;
              case "/":
                if (this.mill.ingressAxis2 === 0) {
                  this.#setMill("runUpLever", true);
                  break;
                }

                this.#setMill(
                  "egressAxis",
                  this.mill.ingressAxis1 / this.mill.ingressAxis2,
                );
                this.#setMill("runUpLever", false);
                break;
            }
          }

          this.#toLoadIngressAxis1 = !this.#toLoadIngressAxis1;
        } else if (card.action === "S") {
          this.#setStore(card.address, this.mill.egressAxis);
        }
        break;
    }

    return false;
  }

  halt() {
    this.#setMill(
      produce((state) => {
        state.operation = "";
        state.runUpLever = false;
        state.ingressAxis1 = 0;
        state.ingressAxis2 = 0;
        state.egressAxis = 0;
      }),
    );

    this.#setStore(produce((state) => state.fill(0)));

    this.#setReaderPosition(0);

    this.#setIsMounted(false);

    this.#toLoadIngressAxis1 = true;
  }

  clearPrintingApparatus() {
    this.#setPrintingApparatus("");
  }
}

function sign(num: number) {
  return num === 0 ? 1 : Math.sign(num);
}
