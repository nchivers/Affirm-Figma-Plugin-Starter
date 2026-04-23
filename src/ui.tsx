import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ThemeProvider, Type } from "./design-system";
import { Badge, Button, Checkbox, CircularLoader, Icon, InputText, InputTextArea, Link, Switch, PageHeader, Dropdown, Divider, PageFooter, SectionHeader } from "./design-system/components";
import DsComponents from "./pages/DsComponents";
import "./ui.scss";

declare function require(path: string): any;

function App() {
  const [page, setPage] = React.useState<"main" | "ds">("main");
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

  if (page === "ds") {
    return <DsComponents onBack={() => setPage("main")} />;
  }

  return (
    <main>
      <header>
        <PageHeader title="Template" description="This is a figma plugin template" action={<Button label="DS Components" variant="neutral" emphasis="tertiary" icon="levels" iconPosition="only" onClick={() => setPage("ds")} />} />
        <SectionHeader title="Test section header" actionLabel="Test action" onActionClick={onCreate} body="This is a test of body text." />
      </header>
      <section>
        <Type variant="body.large" color="text.primary">Your Plugin UI Here!</Type>
      </section>
      {/** Update the footer to include your information! */}
      <PageFooter
        builderName="Nick"
        builderSlack="https://affirm.slack.com/team/U12345"
        updatedDate="04.21.2026"
        className="affirm-page-footer"
      />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("react-page")).render(
  <ThemeProvider defaultTheme="affirm" defaultMode="auto">
    <App />
  </ThemeProvider>
);
