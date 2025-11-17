import { Problem, ProblemSeverity } from "@/shared/model/types";
import analyze from "../lib/analyze";
import lex from "../lib/lex";
import parse, { ASTNode_Card, ASTNodeType } from "../lib/parse";
import { InterpreterStatus, Mill } from "./types";
import { createStore, produce, SetStoreFunction } from "solid-js/store";
import { Accessor, createSignal, Setter } from "solid-js";
import playBell from "@/shared/lib/playBell";
import wrap from "@/shared/lib/wrap";
import handleVariableCard from "../lib/handleVariableCard";

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

  status: Accessor<InterpreterStatus>;
  #setStatus: Setter<InterpreterStatus>;

  #animateTimeoutId?: number = undefined;
  #executeIdleCallbackId?: number = undefined;

  #toLoadIngressAxis1: boolean = true;

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

    [this.status, this.#setStatus] = createSignal<InterpreterStatus>(
      InterpreterStatus.Halted,
    );
  }

  prepare(lines: string[]) {
    if (this.status() !== InterpreterStatus.Halted) return [];

    const problems: Problem[] = [];

    // 1. lexical analysis -> syntax analysis -> semantic analysis
    const cards = parse(lex(lines, problems), problems);
    analyze(cards, problems);

    this.chain =
      problems.find((v) => v.severity === ProblemSeverity.Error) === undefined
        ? cards
        : [];
    return problems;
  }

  mount() {
    if (this.status() !== InterpreterStatus.Halted) return;

    this.#setStatus(InterpreterStatus.Paused);
  }

  execute(breakpts: Accessor<Set<number>>) {
    if (this.status() !== InterpreterStatus.Paused) return;

    const callback = () => {
      // Break into smaller chunks for "smoothness"
      for (
        let i = 0;
        i <= 128 && this.status() === InterpreterStatus.Running;
        i++
      )
        this.step(breakpts());

      if (this.status() === InterpreterStatus.Running)
        this.#executeIdleCallbackId = requestIdleCallback(callback, {
          timeout: 1023,
        });
    };

    this.#setStatus(InterpreterStatus.Running);
    this.#executeIdleCallbackId = requestIdleCallback(callback, {
      timeout: 1023,
    });
  }

  animate(breakpts: Accessor<Set<number>>, timeout = 250) {
    if (this.status() !== InterpreterStatus.Paused) return;

    const callback = () => {
      this.step(breakpts());

      if (this.status() === InterpreterStatus.Running)
        this.#animateTimeoutId = setTimeout(callback, timeout);
    };

    this.#setStatus(InterpreterStatus.Running);
    callback();
  }

  step(breakpts: Set<number>) {
    const card = this.chain[this.readerPosition()];

    // For the machine to read, it would have to move reader
    this.#setReaderPosition((prev) => (prev + 1) % this.chain.length);

    switch (card.type) {
      case ASTNodeType.NumberCard:
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
            return;
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
        this.#toLoadIngressAxis1 = handleVariableCard(
          card,
          this.mill,
          this.#setMill,
          this.store,
          this.#setStore,
          this.#toLoadIngressAxis1,
        );
        break;
    }

    if (breakpts.has(this.chain[this.readerPosition()].ln)) this.pause();
  }

  pause() {
    if (this.status() !== InterpreterStatus.Running) return;

    clearTimeout(this.#animateTimeoutId);
    if (this.#executeIdleCallbackId)
      cancelIdleCallback(this.#executeIdleCallbackId);

    this.#setStatus(InterpreterStatus.Paused);
  }

  /**
   * Halts the interpreter if it isn't already halted.
   */
  halt() {
    if (this.status() === InterpreterStatus.Halted) return;

    clearTimeout(this.#animateTimeoutId);
    if (this.#executeIdleCallbackId)
      cancelIdleCallback(this.#executeIdleCallbackId);

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
    this.#setStatus(InterpreterStatus.Halted);

    this.#toLoadIngressAxis1 = true;
  }

  clearPrintingApparatus() {
    this.#setPrintingApparatus("");
  }
}
