import playBell from "@/shared/lib/playBell";
import { Problem, ProblemSeverity } from "@/shared/model/types";
import { Accessor, Setter, createSignal, batch } from "solid-js";
import { SetStoreFunction, createStore, produce } from "solid-js/store";
import analyze from "../lib/analyze";
import handleVariableCard from "../lib/handleVariableCard";
import lex from "../lib/lex";
import parse from "../lib/parse";
import { Mill, InterpreterStatus } from "./types";
import { ASTNode_Card, ASTNodeType } from "../lib/parse/types";

export default class Interpreter {
  readonly mill: Mill;
  #setMill: SetStoreFunction<Mill>;
  readonly store: number[];
  #setStore: SetStoreFunction<number[]>;
  readonly readerPosition: Accessor<number>;
  #setReaderPosition: Setter<number>;
  readonly printingApparatus: Accessor<string>;
  #setPrintingApparatus: Setter<string>;

  get chain(): ReadonlyArray<ASTNode_Card> {
    return this.#chain;
  }
  #chain: ASTNode_Card[] = [];

  readonly status: Accessor<InterpreterStatus>;
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

  compile(lines: string[]) {
    if (this.status() !== InterpreterStatus.Halted) return [];

    const problems: Problem[] = [];

    // lexical analysis -> syntax analysis -> semantic analysis
    const cards = parse(lex(lines, problems), problems);
    analyze(cards, problems);

    this.#chain =
      problems.length === 0 || problems[0].severity !== ProblemSeverity.Error
        ? cards
        : [];

    return problems;
  }

  load() {
    if (this.status() !== InterpreterStatus.Halted || this.#chain.length === 0)
      return;

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

    this.#setStatus(InterpreterStatus.Paused);
  }

  execute(breakpts: Accessor<Set<number>>) {
    if (this.status() !== InterpreterStatus.Paused) return;

    const runChunk = (chunkSize: number) => {
      batch(() => {
        const brkpts = breakpts();

        const start = performance.now();
        for (
          let i = 0;
          i < chunkSize && this.status() === InterpreterStatus.Running;
          i++
        )
          this.step(brkpts);

        if (this.status() === InterpreterStatus.Running) {
          const nextChunkSize = Math.max(
            64,
            Math.round((chunkSize * 32) / (performance.now() - start)),
          );

          this.#executeIdleCallbackId = requestIdleCallback(
            () => runChunk(nextChunkSize),
            { timeout: 1000 },
          );
        }
      });
    };

    this.#setStatus(InterpreterStatus.Running);
    runChunk(512);
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
    if (this.status() === InterpreterStatus.Halted) return;

    const card = this.#chain[this.readerPosition()];

    // For the machine to read, it would have to move reader
    this.#setReaderPosition((prev) => prev + 1);

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
          this.#setReaderPosition(
            (prev) => prev + card.skips * (card.direction === "F" ? 1 : -1),
          );
        }
        break;
      case ASTNodeType.VariableCard:
        this.#toLoadIngressAxis1 = handleVariableCard(
          this.#toLoadIngressAxis1,
          card,
          this.mill,
          this.#setMill,
          this.store,
          this.#setStore,
        );
        break;
    }

    if (this.readerPosition() >= this.#chain.length) this.halt();
    else if (breakpts.has(this.#chain[this.readerPosition()].ln)) this.pause();
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

    this.#setStatus(InterpreterStatus.Halted);

    this.#toLoadIngressAxis1 = true;
  }

  clearPrintingApparatus() {
    this.#setPrintingApparatus("");
  }
}
