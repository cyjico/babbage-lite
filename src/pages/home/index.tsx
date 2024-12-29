import "./styles.css";
import Editor from "@/widgets/Editor";
import TabbedPanel from "@/shared/ui/TabbedPanel";
import EditorContextProvider from "@/widgets/Editor/ContextProvider";
import EditorStatusBar from "@/widgets/EditorStatusBar";

export default function HomePage() {
  return (
    <EditorContextProvider>
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
        <Editor class="flex-1" />

        <TabbedPanel
          labelClass="flex-initial flex justify-around"
          contentClass="flex-1 overflow-auto max-h-32"
          tabs={[
            {
              label: "PROBLEMS",
              content: (
                <div>
                  <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Cumque, eum perspiciatis esse consectetur dolorum cupiditate
                    earum asperiores laboriosam eos? Eveniet, distinctio.
                    Officia asperiores repudiandae est corporis, praesentium
                    perspiciatis. Sint, odio!
                  </p>
                </div>
              ),
            },
            {
              label: "OUTPUT",
              content: (
                <div>
                  <p>
                    Incredible! However, if your energy in your pseudo-mind is
                    not conducive - or yeah, I like the word conducive - to what
                    I'm saying or what I'm feeling, then there's
                    incompatibility. So how do you know that? How do you fix
                    that? Well, first you have to understand. You have to look
                    at yourself and say, what kind of energy or what kind of
                    pseudo power do I have to set my atmosphere? Woooooah,
                    That's good. What kind of pseudo-energy do I have that I can
                    create?
                  </p>
                </div>
              ),
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
        <EditorStatusBar />
      </footer>
    </EditorContextProvider>
  );
}
