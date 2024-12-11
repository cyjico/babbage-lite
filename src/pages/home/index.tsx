import "./styles.css";
import Editor from "@/widgets/Editor";
import TabbedPanel from "@/shared/ui/TabbedPanel";

export default function HomePage() {

  return (
    <>
      <header>
        <div id="menubar">
          <button>File</button>
        </div>

        <div id="toolbar">
          <button>Pause</button>
          <button>Play</button>
          <button>Step</button>
          <button>Stop</button>
          <label>
            Speed: <input type="range" />
          </label>
        </div>
      </header>

      <main>
        <Editor />

        <TabbedPanel
          tabs={[
            {
              label: "PROBLEMS",
              content: "problem is here",
            },
            {
              label: "OUTPUT",
              content: "output is here",
            },
          ]}
        />
      </main>

      <aside>
        <section>
          <span>Operation: *</span>
          <span>Run-up Lever: Unset</span>
        </section>
        <section>
          <h1>Store</h1>

          <table>
            <thead>
              <tr>
                <th scope="col">Address</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>000</td>
                <td>10</td>
              </tr>
              <tr>
                <td>001</td>
                <td>5</td>
              </tr>
            </tbody>
          </table>
        </section>
      </aside>

      <footer>
        <span>Ln 1, Col 1</span>
      </footer>
    </>
  );
}
