import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ThemeProvider, Type } from "./design-system";
import { Badge, Button, Checkbox, CircularLoader, Icon, InputText, InputTextArea, Link, Switch, PageHeader, Dropdown, Divider } from "./design-system/components";
import "./ui.scss";

declare function require(path: string): any;

function App() {
  const [checked, setChecked] = React.useState(false);
  const [textValue, setTextValue] = React.useState("");
  const [textAreaValue, setTextAreaValue] = React.useState("");
  const [dropdownValue, setDropdownValue] = React.useState("");
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
        <PageHeader title="Template" description="This is a figma plugin template" action={<Button label="Settings" variant="neutral" emphasis="tertiary" icon="levels" iconPosition="only" onClick={onCreate} />} />
        
        <Badge category="info">Test badge</Badge>
        <Type variant="headline.large" as="h1" color="text.primary">Rectangle Creator</Type>
        <Link href="https://www.affirm.com">Affirm</Link>
        <CircularLoader />
        <CircularLoader size="small" />
      </header>
      <Divider variant="secondary-inverse" />
      <section>
        <InputText id="textinput" ref={inputRef} label={"Test Text Input"} value={textValue} onChange={e => setTextValue(e.target.value)} startIcon={<Icon name="checkmark-small" />} />
        <InputTextArea id="textarea" ref={inputTextAreaRef} label={"Test Text Area"} value={textAreaValue} onChange={e => setTextAreaValue(e.target.value)} startIcon={<Icon name="checkmark-small" />} />
        <Checkbox checked={checked} label="Test label" onChange={e => setChecked(e.target.checked)} />
        <Switch checked={switchChecked} label={<Type variant="body.large" as="span" color="text.primary">Test label node <Link href="https://www.affirm.com">Affirm</Link></Type>} onChange={e => setSwitchChecked(e.target.checked)} labelPosition="start" />
        <Dropdown label="Test dropdown" options={[{ label: "Option 1", value: "option1" }, { label: "Option 2", value: "option2" }]} onChange={setDropdownValue} />
      </section>
      <footer>
        <Button label="Create" onClick={onCreate} />
        <Button label="Create" emphasis="secondary" variant="neutral" onClick={onCreate} />
        <Button label="Create" emphasis="tertiary" onClick={onCreate} />
        <Button label="Create" icon="checkmark-small" iconPosition="start" variant="destructive" onClick={onCreate} />
        <Button label="Create" icon="close-small" iconPosition="only" onClick={onCreate} />
        <Button label="Create" icon={<Icon name="checkmark-small" />} iconPosition="start" onClick={onCreate} />
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("react-page")).render(
  <ThemeProvider defaultTheme="affirm" defaultMode="auto">
    <App />
  </ThemeProvider>
);
