import { Problem } from "@/shared/model/types";
import lex from "./lex";
import parse, { ASTNode } from "./parse";

class Mill {
  operation: "add" | "sub" | "div" | "mul" | "" = "";
  runUpLever = false;
  ingressAxis1 = 0;
  ingressAxis2 = 0;
  egressAxis = 0;
}

type Reader = ASTNode[];

export default class Emulator {
  mill = new Mill();
  reader: Reader[] = [];
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

    // 4. runtime execution

    return problems;
  }
}
