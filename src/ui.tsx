import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ThemeProvider, Type } from "./design-system";
import { Checkbox, Icon, InputText, InputTextArea, Link, Switch } from "./design-system/components";
import "./ui.scss";

declare function require(path: string): any;

function App() {
  const [checked, setChecked] = React.useState(false);
  const [textValue, setTextValue] = React.useState("");
  const [textAreaValue, setTextAreaValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const inputTextAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const [switchChecked, setSwitchChecked] = React.useState(false);
  const onCreate = () => {
    const count = Number(inputRef.current?.value || 0);
    parent.postMessage(
      { pluginMessage: { type: "create-rectangles", count } },
      "*"
    );
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  return (
    <main>
      <header>
        <img src={require("./logo.svg")} />
        <Type variant="headline.large" as="h1" color="text.primary">Rectangle Creator</Type>
        <Link href="https://www.affirm.com">Affirm</Link>
      </header>
      <section>
        <input id="input" type="number" min="0" ref={inputRef} />
        <InputText id="textinput" ref={inputRef} label={"Test Text Input"} value={textValue} onChange={e => setTextValue(e.target.value)} startIcon={<Icon name="checkmark-small" />} />
        <InputTextArea id="textarea" ref={inputTextAreaRef} label={"Test Text Area"} value={textAreaValue} onChange={e => setTextAreaValue(e.target.value)} startIcon={<Icon name="checkmark-small" />} />
        <label htmlFor="input">Rectangle Count</label>
        <Checkbox checked={checked} label="Test label" onChange={e => setChecked(e.target.checked)} />
        <Switch checked={switchChecked} label="Test label" onChange={e => setSwitchChecked(e.target.checked)} />
      </section>
      <footer>
        <button className="brand" onClick={onCreate}>
          Create
        </button>
        <button onClick={onCancel}>Cancel</button>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("react-page")).render(
  <ThemeProvider defaultTheme="affirm" defaultMode="auto">
    <App />
  </ThemeProvider>
);
