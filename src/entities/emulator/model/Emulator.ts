import { Problem, ProblemSeverity } from "@/shared/model/types";
import lex from "./lex";
import parse, { ASTNodeCard } from "./parse";

class Mill {
  operation: "add" | "sub" | "div" | "mul" | "" = "";
  runUpLever = false;
  ingressAxis1 = 0;
  ingressAxis2 = 0;
  egressAxis = 0;
}

export default class Emulator {
  mill = new Mill();
  reader: ASTNodeCard[] = [];
  store = new Array<number>(999).fill(0);

  interpret(lines: string[]) {
    const problems: Problem[] = [];

    // 1. lexical analysis
    const tokens = lex(lines, problems);
    console.log("tokenize():", tokens);

    // 2. syntax analysis
    const nodes = parse(tokens, problems);
    console.log("parse():", nodes);

    // 3. semantic analysis

    // do not run if there are errors
    this.reader = !problems.find((v) => v.severity === ProblemSeverity.Error)
      ? nodes
      : [];
    return problems;
  }

  async run() {}
}
