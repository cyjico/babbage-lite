import { Problem, ProblemSeverity } from "@/shared/model/types";
import analyze from "./analyze";
import lex from "./lex";
import parse, { ASTNode_Card } from "./parse";
import { Mill } from "./types";

export default class Emulator {
  cardChain: ASTNode_Card[] = [];

  mill: Mill = {
    operation: null,
    runUpLever: false,
    ingressAxis1: 0,
    ingressAxis2: 0,
    egressAxis: 0,
  };
  store = new Array<number>(999).fill(0);

  prepare(lines: string[]) {
    const problems: Problem[] = [];

    // 1. lexical analysis
    const tokens = lex(lines, problems);
    console.log("tokenize():", tokens);

    // 2. syntax analysis
    const cards = parse(tokens, problems);
    console.log("parse():", cards);

    // 3. semantic analysis
    analyze(cards, problems);

    // do not run if there are errors
    this.cardChain = !problems.find((v) => v.severity === ProblemSeverity.Error)
      ? cards
      : [];
    return problems;
  }

  async readAll() {}
}
