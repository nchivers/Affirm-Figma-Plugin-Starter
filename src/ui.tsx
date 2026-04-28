import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ThemeProvider, Type } from "./design-system";
import { Button, PageHeader, SectionHeader, PageFooter } from "./design-system/components";
import DsComponents from "./pages/DsComponents";
import "./ui.scss";

declare function require(path: string): any;

function App() {
  const [page, setPage] = React.useState<"main" | "ds">("main");

  if (page === "ds") {
    return <DsComponents onBack={() => setPage("main")} />;
  }

  return (
    <main>
      <header>
        <PageHeader
          title="Plugin Title"
          description="Description of what the plugin does at a high level."
          action={
            <Button
              label="DS Components"
              variant="neutral"
              emphasis="tertiary"
              icon="levels"
              iconPosition="only"
              onClick={() => setPage("ds")}
            />
          }
        />
        <SectionHeader
          title="Instructions"
          body="General instructions for how to use the plugin."
        />
      </header>

      <section>
        <Type variant="body.large" color="text.primary">Your Plugin UI Here!</Type>
      </section>

      <PageFooter
        builderName="name"
        builderSlack="https://affirm.slack.com/team/..."
        updatedDate="MM.DD.YYYY"
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
