---
name: build-a-figma-plugin
description: >-
  Build a new Figma plugin from a user's idea using the Affirm-Figma-Plugin-Starter
  template. Use when the user says "build a plugin", "new plugin", "plugin idea",
  "create a Figma plugin", or describes a Figma plugin they want built. Guides the
  user through ideation, planning, and implementation with the Affirm design system.
---

# Build a Figma Plugin

Takes a user's plugin idea, asks clarifying questions, produces a build plan, creates a new repo from the Affirm-Figma-Plugin-Starter template, and implements the plugin using the design system.

## Prerequisites

- Node.js and npm must be installed.
- Git must be installed.
- Read `AGENTS.md` at the repository root now. You will need the component catalog and styling rules throughout this workflow.

---

## Phase 1: Gather the Idea

**You MUST complete this phase before doing anything else.**

The target audience is **designers, not engineers.** All questions must be framed around what the user wants the plugin to *do* -- never around technical APIs, message protocols, or implementation details. You infer all technical requirements from the designer's answers.

### 1a. Parse what the user has already said

Read the user's initial message carefully. Extract everything you can about:

- What the plugin does
- How a designer would use it
- What it creates or changes in the file
- Whether it needs external services
- Whether they mentioned a name

### 1b. Ask clarifying questions

Ask **designer-friendly** follow-up questions to fill in gaps. Use `AskQuestion` when structured choices help, or ask conversationally for open-ended questions. Skip questions the user already answered. Adapt wording to the context -- these are examples, not a script:

- **Core workflow**: "Walk me through how someone would use this plugin step by step -- what do they click, what happens next?"
- **Input**: "Does the plugin work with layers the designer has selected, or does it scan the whole page/file on its own?"
- **Output**: "What does the plugin create or change? New layers, text edits, style changes, exported files, something else?"
- **Screens**: "Is this a single-screen tool, or do you picture a settings page or other secondary views?"
- **External services**: "Does the plugin need to talk to any outside service or website (e.g., an API, a spreadsheet, a CMS)? If so, which one?"
- **Editor**: "Should this work in Figma design files, FigJam whiteboards, or both?"
- **Persistence**: "Should the plugin remember any settings or data between sessions?"

**Never** ask about Figma API methods, message types, document access levels, sandbox architecture, or other implementation details. Translate the designer's intent into technical decisions silently in Phase 2.

### 1c. Ask for a plugin name

If the user has not provided a name:

1. Suggest 2--3 names based on the idea. All names **must** start with `"Affirm-"` (e.g., `"Affirm-Token-Swapper"`, `"Affirm-Bulk-Rename"`, `"Affirm-Style-Lint"`).
2. Ask the user to pick one or propose their own.
3. If the user proposes a name that does not start with `"Affirm-"`, prepend it: `"Affirm-<their-name>"`. Confirm this with the user.

Record the confirmed name. Do not proceed until the user has approved a name.

### 1d. Summarize back to the user

Before moving to Phase 2, summarize what you understood in plain language:

- Plugin name
- What it does (1--2 sentences)
- Step-by-step user workflow
- Screens/views it will have
- External services (if any)
- Editor support (Figma, FigJam, or both)

Ask: *"Does this capture your idea correctly? Let me know if anything is off, or say 'looks good' and I'll put together a build plan."*

**Do NOT proceed until the user confirms.**

---

## Phase 2: Produce a Build Plan

Switch to Plan mode. Translate the designer's answers from Phase 1 into a full technical plan. Use `CreatePlan` to present it.

### Technical translation guide

Map the designer's answers to implementation decisions:

| Designer's answer | Technical decision |
|---|---|
| "Works with selected layers" | `figma.currentPage.selection` |
| "Scans the whole page" | `figma.currentPage.findAll(...)` or `figma.currentPage.children` traversal |
| "Scans the whole file" | `documentAccess: "dynamic-page"` with `figma.root.children` page traversal |
| "Creates new layers/frames" | Node creation APIs (`figma.createFrame()`, `figma.createText()`, etc.) |
| "Changes text" | `TextNode.characters`, `figma.loadFontAsync()` |
| "Changes styles/colors" | `fills`, `strokes`, `effects` property writes |
| "Exports images" | `node.exportAsync()` |
| "Talks to an API/service" | `networkAccess.allowedDomains` with specific domains |
| "Remembers settings" | `figma.clientStorage.getAsync()` / `setAsync()` |
| "Works in FigJam" | `editorType` includes `"figjam"` |
| "Single screen" | One main view in `ui.tsx` |
| "Settings page" | State-driven page routing (`page` state), SettingsTemplate |

### Plan structure

The plan must cover all of the following sections:

**1. Manifest configuration**

Specify the exact values for `manifest.json`:
- `name`: the confirmed plugin name
- `id`: kebab-case of the name, lowercased (e.g., `affirm-bulk-rename`)
- `editorType`: `["figma"]`, `["figjam"]`, or `["figma", "figjam"]`
- `networkAccess`: `{ "allowedDomains": ["none"] }` or specific domains
- `documentAccess`: `"dynamic-page"` unless the plugin only reads the current selection

**2. Sandbox logic (`src/code.ts`)**

- `figma.showUI` dimensions (`width`, `height`). Default width is 400. Height should account for PageHeader + SectionHeader + content + PageFooter chrome -- start at 640 and adjust based on content complexity. Do not exceed 800.
- Every `figma.ui.onmessage` handler: message type string, expected payload, and what Figma API operations it performs.
- Every `figma.ui.postMessage` call: message type string, payload shape, and when it is sent.
- Any `figma.on` event listeners (e.g., `selectionchange`, `documentchange`).
- Any `figma.clientStorage` usage for persistence.
- All Figma API operations must comply with the [Figma Plugin API reference](https://developers.figma.com/docs/plugins/api/api-reference/). When uncertain about an API method's signature or behavior, look it up before including it in the plan.

**3. Message protocol table**

| Message type | Direction | Payload | Description |
|---|---|---|---|
| (one row per message) | UI -> Sandbox or Sandbox -> UI | `{ field: type }` | What it does |

**4. UI design (`src/ui.tsx`)**

- Which page template to start from (`MainTemplate.tsx`, and optionally `SettingsTemplate.tsx`).
- Every screen/view and how the user navigates between them (state-driven routing with a `page` state variable).
- Every UI element mapped to a DS component (follow the decision process from `AGENTS.md`):

| UI element | DS component |
|---|---|
| Any text | `<Type variant="..." color="...">` |
| Text input | `<InputText label="...">` |
| Text area | `<InputTextArea label="...">` |
| Checkbox | `<Checkbox label="...">` |
| Toggle | `<Switch label="...">` |
| Link | `<Link href="...">` |
| Icon | `<Icon name="...">` |
| Page title area | `<PageHeader>` |
| Section title | `<SectionHeader>` |
| Footer | `<PageFooter>` |

- If any element cannot be built with DS components, describe it and specify which DS tokens it will use.

**5. Custom SCSS needs**

List any custom styles required beyond DS components. Every custom style must use `var(--affirm-*)` tokens and follow BEM naming (`.affirm-<name>`). If no custom styles are needed, state that explicitly.

**6. Additional dependencies**

List any npm packages beyond the starter's defaults. If none, state that explicitly.

**7. Repo setup**

- New directory name (the plugin name, e.g., `Affirm-Bulk-Rename`)
- New directory location (sibling to the starter repo)
- `manifest.json` updates
- `package.json` name field update

### Present and iterate

Present the plan and ask: *"Please review the plan above. Let me know if you'd like any changes, or say 'build it' when you're ready."*

If the user requests changes, update the plan and re-present the affected sections. Repeat until the user approves.

**Do NOT proceed to Phase 3 until the user explicitly approves.**

---

## Phase 3: Create New Project

### 3a. Locate the starter repo

The starter repo is the root of the repository containing this skill. Resolve it by navigating up from this SKILL.md: this file lives at `.cursor/skills/build-a-figma-plugin/SKILL.md`, so the starter root is three directories up.

### 3b. Copy the starter

Create the new project as a sibling directory to the starter:

```bash
STARTER_ROOT="<resolved starter root>"
TARGET_DIR="$(dirname "$STARTER_ROOT")/<plugin-name>"

rsync -a --exclude='.git/' --exclude='node_modules/' --exclude='dist/' "$STARTER_ROOT/" "$TARGET_DIR/"
```

If `rsync` is unavailable, use `cp -R` followed by removing `.git/`, `node_modules/`, and `dist/` from the copy.

### 3c. Update manifest.json

Replace the template values with the plan's values:

- `name`: from the plan
- `id`: from the plan
- `editorType`: from the plan
- `networkAccess`: from the plan
- `documentAccess`: from the plan

Keep `main` as `dist/code.js` and `ui` as `dist/ui.html`.

### 3d. Update package.json

Set the `name` field to the kebab-case plugin name (e.g., `affirm-bulk-rename`).

### 3e. Initialize the new project

```bash
cd "$TARGET_DIR"
git init
npm install
```

Wait for `npm install` to complete before proceeding.

---

## Phase 4: Build the Plugin

Work in the new project directory. Follow `AGENTS.md` for all UI decisions -- the design-system-first rule is paramount.

### 4a. Write `src/code.ts`

Implement the sandbox logic from the plan:

```typescript
figma.showUI(__html__, { themeColors: true, height: <plan-height>, width: <plan-width> });

figma.ui.onmessage = (msg) => {
  // All message handlers from the plan
};
```

Key rules:
- Always set `themeColors: true` (required for DS theming).
- Implement every message handler from the plan's message protocol table.
- Implement all Figma API operations as specified.
- If helper functions are complex, create separate files under `src/` and import them.

### 4b. Write `src/ui.tsx`

Start from the `MainTemplate.tsx` template. Build the entire UI using DS components:

1. Copy the template structure into `src/ui.tsx`.
2. Replace placeholder text with the plugin's actual title, description, and section headers.
3. Build the content inside the `<section>` slot using DS components from `AGENTS.md`.
4. Wire up all message handlers from the plan's message protocol table:
   - `parent.postMessage({ pluginMessage: { type: '...', data: { ... } } }, '*')` for UI-to-sandbox messages.
   - `window.addEventListener('message', handler)` in a `useEffect` for sandbox-to-UI messages.
5. If the plugin has multiple screens, implement state-driven routing:
   ```tsx
   const [page, setPage] = React.useState<'main' | 'settings'>('main');
   ```

Import all DS components from `'./design-system/components'`. Import `ThemeProvider` and `Type` from `'./design-system'`. Keep the `<ThemeProvider>` wrapper at the root.

### 4c. Add settings page (if applicable)

If the plan includes a settings page:

1. Create `src/pages/Settings.tsx` starting from `SettingsTemplate.tsx`.
2. Replace placeholder text and add settings controls using DS components.
3. Wire up the `onBack` callback to navigate back to the main page.
4. Import and render it from `src/ui.tsx` based on the `page` state.

### 4d. Add custom SCSS

If the plan identifies custom styles:

- Add them to `src/ui.scss` or create new `.scss` files for complex layouts.
- Use **only** design tokens: `var(--affirm-color-*)`, `var(--affirm-spacing-*)`, `var(--affirm-radius-*)`, etc.
- Follow BEM naming: `.affirm-<name>`, `.affirm-<name>__<element>`, `.affirm-<name>--<modifier>`.
- **Never** hardcode hex colors, pixel sizes, or font values.

### 4e. Install additional dependencies

If the plan identifies extra packages:

```bash
npm install <package-name>
npm install --save-dev @types/<package-name>
```

### 4f. Remove template demo page

Delete `src/pages/DsComponents.tsx` and remove its import and route from `src/ui.tsx`. The demo page is only useful in the starter template, not in a real plugin.

### 4g. Verify against the plan

Walk through the message protocol table and confirm:
- Every UI-to-sandbox message is sent with the correct type and payload.
- Every sandbox-to-UI message is received and handled.
- Every Figma API operation is present in `src/code.ts`.
- Every screen/view from the plan is represented.

---

## Phase 5: Build and Verify

### 5a. Build the project

```bash
cd "<target-directory>"
npm run build
```

### 5b. Fix build errors

If the build fails:
1. Read the error output.
2. Fix the errors in the source files.
3. Run `npm run build` again.
4. Repeat until the build succeeds with zero errors.

### 5c. Check for lint issues

Run linter checks on all new and modified files. Fix any issues introduced.

### 5d. Confirm build output

Verify the expected output files exist:

```bash
ls dist/code.js dist/ui.html
```

Both files must be present for the plugin to work in Figma.

---

## Phase 6: Open and Notify

### 6a. Open in a new Cursor window

```bash
cursor "<target-directory>"
```

If the `cursor` CLI is not available, try `code "<target-directory>"`.

### 6b. Notify the user

Tell the user the build is complete. Include:

1. **Project path**: the full path to the new project directory.
2. **What was built**: a brief summary of the plugin's functionality.
3. **Design system components used**: which DS components make up the UI.
4. **Next steps**: remind the user to load the plugin in Figma via **Plugins > Development > Import plugin from manifest** and select the `manifest.json` in the new project directory.
5. **Development workflow**: `npm run dev` for watch mode during development.

---

## Rules

- **Plan first, code second.** Never write code before Phase 2 is complete and the user has approved the plan. The agent must switch to Plan mode and use `CreatePlan` to present the plan.
- **Designer-friendly questions only.** Never ask the user about Figma API methods, message types, sandbox architecture, document access levels, or other implementation details. Infer all technical decisions from their plain-language answers.
- **Affirm- naming convention.** All plugin names must start with `"Affirm-"`. No exceptions.
- **Design system first.** Always check `AGENTS.md` and use DS components before writing custom elements. Never skip to custom CSS without confirming no DS component fits.
- **Token-only styling.** Never hardcode hex colors, pixel font sizes, or pixel spacing. Always use `var(--affirm-*)` tokens.
- **Figma Plugin API compliance.** All sandbox code must comply with the [Figma Plugin API reference](https://developers.figma.com/docs/plugins/api/api-reference/). When uncertain about an API method, look it up.
- **Clean build required.** Do not consider the plugin complete until `npm run build` succeeds with zero errors and `dist/code.js` + `dist/ui.html` exist.
- **Get confirmation at every gate.** Confirm with the user after Phase 1 (idea summary) and Phase 2 (build plan) before proceeding.
- **Start from templates.** Always start page layouts from the templates in `src/design-system/templates/`. Never build a page layout from scratch.
