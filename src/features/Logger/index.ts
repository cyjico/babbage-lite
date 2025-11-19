import { fileSave } from "browser-fs-access";
import Interpreter, { ASTNodeType } from "@/entities/Interpreter";

export default class Logger {
  #fileHandle: FileSystemFileHandle | null = null;
  #writable: FileSystemWritableFileStream | null = null;
  #counter = 0;

  async open(filename = "log.txt") {
    if (this.#writable) return;

    const blob = new Blob([], { type: "text/plain" });
    this.#fileHandle = await fileSave(blob, {
      fileName: filename,
      extensions: [".txt"],
    });
    this.#writable = await this.#fileHandle!.createWritable();
    this.#counter = 0;
  }

  async log(interp: Interpreter) {
    if (!this.#writable) return;

    if (interp.readerPosition() === 0) return;

    const card = interp.chain[interp.readerPosition() - 1];
    switch (card.type) {
      case ASTNodeType.NumberCard:
        await this.#writable.write(`Card:  ${this.#counter++}. N${card.address}
Store: V${card.address} = ${card.number.value}\n`);
        break;
      case ASTNodeType.OperationCard:
        await this.#writable.write(
          `Card:  ${this.#counter++}. ${card.operation}\n`,
        );
        break;
      case ASTNodeType.ActionCard:
        await this.#writable.write(
          `Card:  ${this.#counter++}. ${card.action}\n`,
        );
        break;
      case ASTNodeType.CombinatorialCard:
        await this.#writable.write(
          `Card:  ${this.#counter++}. C${card.direction}${card.condition}${card.skips}\n`,
        );
        break;
      case ASTNodeType.VariableCard:
        switch (card.action) {
          case "L":
            await this.#writable
              .write(`Card:  ${this.#counter++}. ${card.action}${card.address}
Store: Mill <= V${card.address}(${interp.store[card.address]})\n`);
            break;
          case "S":
            await this.#writable
              .write(`Card:  ${this.#counter++}. ${card.action}${card.address}
Store: Mill(${interp.mill.egressAxis}) => V${card.address}\n`);
            break;
        }
        break;
    }
  }

  async close() {
    if (!this.#writable) return;

    await this.#writable!.close();
    this.#fileHandle = null;
    this.#writable = null;
  }
}
