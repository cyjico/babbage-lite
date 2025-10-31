import { Problem } from "@/shared/model/types";
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

    // 2. syntax analysis
    const cards = parse(tokens, problems);

    // 3. semantic analysis
    analyze(cards, problems);

    return problems;
  }

  async readAll() {}
}
