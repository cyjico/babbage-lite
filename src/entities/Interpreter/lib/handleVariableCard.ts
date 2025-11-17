import { Mill } from "../model/types";
import { ASTNode_VariableCard } from "./parse";

export default function handleVariableCard(
  toLoadIngressAxis1: boolean,
  card: ASTNode_VariableCard,
  mill: Mill,
  setMill: <K extends keyof Mill>(key: K, value: Mill[K]) => void,
  store: readonly number[],
  setStore: (key: number, value: number) => void,
): boolean {
  if (card.action == "L") {
    if (toLoadIngressAxis1) {
      setMill("ingressAxis1", store[card.address]);
    } else {
      setMill("ingressAxis2", store[card.address]);

      switch (mill.operation) {
        case "+":
          setMill("egressAxis", mill.ingressAxis1 + mill.ingressAxis2);
          setMill(
            "runUpLever",
            sign(mill.egressAxis) !== sign(mill.ingressAxis1),
          );
          break;
        case "-":
          setMill("egressAxis", mill.ingressAxis1 - mill.ingressAxis2);
          setMill(
            "runUpLever",
            sign(mill.egressAxis) !== sign(mill.ingressAxis1),
          );
          break;
        case "*":
          setMill("egressAxis", mill.ingressAxis1 * mill.ingressAxis2);
          setMill("runUpLever", false);
          break;
        case "/":
          if (mill.ingressAxis2 === 0) {
            setMill("runUpLever", true);
            setMill("egressAxis", 0);
            break;
          }

          setMill("egressAxis", mill.ingressAxis1 / mill.ingressAxis2);
          setMill("runUpLever", false);
          break;
      }
    }

    return !toLoadIngressAxis1;
  } else {
    setStore(card.address, mill.egressAxis);

    return toLoadIngressAxis1;
  }
}

function sign(num: number) {
  return num === 0 ? 1 : Math.sign(num);
}
