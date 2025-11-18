import {
  Accessor,
  Context,
  createContext,
  createMemo,
  createSignal,
  ParentProps,
  useContext,
} from "solid-js";
import Interpreter from "../model/Interpreter";
import { Problem } from "@/shared/model/types";

interface InterpreterContextProviderValue {
  interpreter: Interpreter;
  diagnostics: {
    problems: Accessor<Problem[]>;
    breakpts: Accessor<Set<number>>;
    toggleBreakpt: (line: number) => void;
  };
}

const InterpreterContext =
  createContext<InterpreterContextProviderValue>() as Context<InterpreterContextProviderValue>;

export function useInterpreterContext() {
  return useContext(InterpreterContext);
}

export default function InterpreterContextProvider(props: ParentProps) {
  const interpreter = new Interpreter();
  const [breakpts, setBreakpts] = createSignal<Set<number>>(new Set());

  return (
    <InterpreterContext.Provider
      value={{
        interpreter,
        diagnostics: {
          problems: createMemo(() => []),
          breakpts,
          toggleBreakpt(line) {
            setBreakpts((prev) => {
              const next = new Set(prev);
              if (next.has(line)) next.delete(line);
              else next.add(line);

              return next;
            });
          },
        },
      }}
    >
      {props.children}
    </InterpreterContext.Provider>
  );
}
