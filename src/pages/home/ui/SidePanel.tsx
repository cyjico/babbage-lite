import { useEditorContext } from "@/widgets/Editor";
import { For } from "solid-js";

export default function SidePanel() {
  const { interpreter } = useEditorContext();

  return (
    <div class="flex flex-col h-full">
      <span>Operation: {interpreter.mill.operation}</span>
      <span>Run-up Lever: {interpreter.mill.runUpLever ? "Set" : "Unset"}</span>
      <span>Ingress Axis 1: {interpreter.mill.ingressAxis1}</span>
      <span>Ingress Axis 2: {interpreter.mill.ingressAxis2}</span>
      <span>Egress Axis: {interpreter.mill.egressAxis}</span>

      <hr />

      <h1>Store</h1>

      <div class="overflow-y-auto flex-1 h-fit">
        <table>
          <thead>
            <tr>
              <th scope="col">Address</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <For each={interpreter.store}>
              {(value, idx) => (
                <tr>
                  <td>{idx()}</td>
                  <td>{value}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
}
