import parse from "./parse";
import tokenize from "./tokenize";

class Mill {
  operation: "add" | "sub" | "div" | "mul" | "" = "";
  runUpLever = false;
  ingressAxis1 = 0;
  ingressAxis2 = 0;
  egressAxis = 0;
}

export default class Emulator {
  mill = new Mill();
  store = new Map<`${number}`, number>();

  interpret(lines: string[]) {
    // 1. lexical analysis
    const tokens = tokenize(lines);
    console.log("tokenize():", tokens);

    // 2. syntax analysis
    const ast = parse(tokens);
    console.log("parse():", ast);

    // 3. semantic analysis

    // 4. runtime execution
  }
}
