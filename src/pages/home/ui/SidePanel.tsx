import {
  InterpreterStatus,
  useInterpreterContext,
} from "@/entities/Interpreter";
import { Index } from "solid-js";

export default function SidePanel() {
  const { interpreter } = useInterpreterContext();

  return (
    <div
      class={`flex flex-col h-full${
        interpreter.status() === InterpreterStatus.Halted ? " opacity-25" : ""
      }`}
    >
      <p>Operation: {interpreter.mill.operation}</p>
      <p>Run-up Lever: {interpreter.mill.runUpLever ? "Set" : "Unset"}</p>
      <p>Ingress Axis 1: {interpreter.mill.ingressAxis1}</p>
      <p>Ingress Axis 2: {interpreter.mill.ingressAxis2}</p>
      <p>Egress Axis: {interpreter.mill.egressAxis}</p>

      <hr />

      <h1>Store</h1>

      <div class="overflow-y-auto flex-1 h-fit">
        <table>
          <thead>
            <tr>
              <th scope="col" class="font-normal p-2">
                Address
              </th>
              <th scope="col" class="font-normal p-2">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            <Index each={interpreter.store}>
              {(value, idx) => (
                <tr>
                  <td>{idx.toString().padStart(3, "0")}</td>
                  <td>{value()}</td>
                </tr>
              )}
            </Index>
          </tbody>
        </table>
      </div>
    </div>
  );
}
