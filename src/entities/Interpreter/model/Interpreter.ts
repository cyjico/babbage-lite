import { Problem, ProblemSeverity } from "@/shared/model/types";
import analyze from "../lib/analyze";
import lex from "../lib/lex";
import parse, { ASTNode_Card } from "../lib/parse";
import { Mill } from "./types";
import { createStore, SetStoreFunction } from "solid-js/store";
import { Accessor, createSignal, Setter } from "solid-js";

export default class Interpreter {
  mill: Mill;
  #setMill: SetStoreFunction<Mill>;
  store: Array<number>;
  #setStore: SetStoreFunction<Array<number>>;

  chain: ASTNode_Card[] = [];
  readerPosiiton: Accessor<number>;
  #setReaderPosition: Setter<number>;

  constructor() {
    [this.mill, this.#setMill] = createStore<Mill>({
      operation: "",
      runUpLever: false,
      ingressAxis1: 0,
      ingressAxis2: 0,
      egressAxis: 0,
    });

    [this.store, this.#setStore] = createStore(new Array<number>(999).fill(0));

    [this.readerPosiiton, this.#setReaderPosition] = createSignal<number>(0);
  }

  prepare(lines: string[]) {
    const problems: Problem[] = [];

    // 1. lexical analysis
    const tokens = lex(lines, problems);

    // 2. syntax analysis
    const cards = parse(tokens, problems);

    // 3. semantic analysis
    analyze(cards, problems);

    if (!problems.find((v) => v.severity === ProblemSeverity.Error)) {
      this.chain = cards;
    } else {
      this.chain = [];
    }

    this.#setReaderPosition(0);

    return problems;
  }

  step() {
    if (this.chain.length == 0) return;

    const card = this.chain[this.readerPosiiton()];
    this.#setReaderPosition((prev) => (prev + 1) % this.chain.length);

    // TODO: read and execute card
  }
}
