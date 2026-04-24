---
name: convert-plugin
description: >-
  Convert an existing Figma plugin into the Affirm-Figma-Plugin-Starter
  framework with full design system support. Use when the user says "convert",
  "upgrade", "migrate", provides a path or GitHub URL to a Figma plugin, or
  wants to rebuild an existing plugin using the Affirm design system. Requires
  a local path or GitHub repo URL as input.
---

# Convert Figma Plugin

Accepts a local path or GitHub URL to an existing Figma plugin, duplicates the Affirm-Figma-Plugin-Starter as a clean base, analyzes the source plugin, rebuilds it using the design system and agent conventions, verifies the build, and opens the result in a new Cursor window.

## Prerequisites

- Node.js and npm must be installed.
- Git must be installed (required for `git init` and optionally `git clone`).
- The user must provide a path when invoking this skill: either a local filesystem path or a GitHub URL pointing to a Figma plugin repository.

---

## Phase 1: Parse Input and Validate Source

**You MUST complete this phase before doing anything else.**

### 1a. Identify the input type

The user provides a single argument: a path. Determine which type it is:

- **GitHub URL**: starts with `https://github.com/` or `git@github.com:`. Clone it to a temporary directory (`/tmp/convert-plugin-source/`) and use that as the source path.

  ```bash
  rm -rf /tmp/convert-plugin-source
  git clone <url> /tmp/convert-plugin-source
  ```

- **Local path**: use the path directly. Verify the directory exists.

If the directory does not exist or the clone fails, stop and tell the user: *"The path provided does not exist or could not be cloned. Please check the path and try again."*

### 1b. Extract the repo name

Derive the repo name from the path -- this becomes the base for the new project name.

- Local path: last segment of the path. `/Users/nick/Projects/my-plugin` -> `my-plugin`
- GitHub URL: repo name from the URL, stripped of `.git` suffix. `https://github.com/user/my-plugin.git` -> `my-plugin`

The new project will be named `<repo-name>-upgraded`.

### 1c. Validate the source is a Figma plugin

Check that the source directory contains a `manifest.json` file. Read it and confirm it has at minimum a `name`, `main`, and `ui` field (standard Figma plugin manifest).

If `manifest.json` is missing or invalid, stop and tell the user: *"No valid Figma plugin manifest found at the provided path. A Figma plugin must have a manifest.json with name, main, and ui fields."*

### 1d. Confirm with the user

Tell the user:
- The source plugin name (from `manifest.json`).
- The new project name (`<repo-name>-upgraded`).
- The target directory where the new project will be created.

Ask: *"Ready to proceed? Say 'go' to continue, or let me know if you'd like to change anything."*

**Do NOT proceed until the user confirms.**

---

## Phase 2: Create New Project

### 2a. Locate the starter repo

The starter repo is the root of the repository containing this skill. Resolve it by navigating up from this SKILL.md's location: this file lives at `.cursor/skills/convert-plugin/SKILL.md`, so the starter root is three directories up.

### 2b. Copy the starter

Create the new project as a sibling directory to the starter:

```bash
STARTER_ROOT="<resolved starter root>"
TARGET_DIR="$(dirname "$STARTER_ROOT")/<repo-name>-upgraded"

rsync -a --exclude='.git/' --exclude='node_modules/' --exclude='dist/' "$STARTER_ROOT/" "$TARGET_DIR/"
```

If `rsync` is unavailable, use `cp -R` followed by removing `.git/`, `node_modules/`, and `dist/` from the copy.

### 2c. Initialize the new project

```bash
cd "$TARGET_DIR"
git init
npm install
```

Wait for `npm install` to complete before proceeding.

---

## Phase 3: Analyze Source Plugin

Read and catalog the source plugin files to build a complete understanding of its functionality. Work through these steps in order.

### 3a. Read the manifest

Read `manifest.json` from the source and record:

| Field | Purpose |
|-------|---------|
| `name` | Plugin display name |
| `id` | Plugin ID (for Figma registry) |
| `main` | Path to sandbox entry file |
| `ui` | Path to UI entry file |
| `editorType` | Which editors the plugin supports |
| `networkAccess` | Allowed domains for network requests |
| `documentAccess` | Document access level |

Also note any `relaunchButtons`, `permissions`, `capabilities`, or other fields.

### 3b. Read the sandbox code

Read the file referenced by `main` in the manifest (usually `code.ts` or `code.js`). Trace all imports to read helper modules too. Catalog:

1. **`figma.showUI` call**: dimensions (`width`, `height`), `themeColors`, and any other options.
2. **Incoming messages** (`figma.ui.onmessage`): every message `type` string, the expected payload shape, and what the handler does.
3. **Outgoing messages** (`figma.ui.postMessage`): every message `type` string and payload shape.
4. **Figma API usage**: every `figma.*` call -- node creation, traversal, property reads/writes, selection, viewport, notifications, storage, etc.
5. **Plugin parameters**: any `figma.parameters` usage for quick actions.

### 3c. Read the UI code

Read the UI entry file and all files it imports. Catalog:

1. **Framework**: React, Preact, Svelte, Vue, vanilla JS, or other.
2. **Screens/views**: distinct UI states or pages the plugin shows.
3. **Components**: every UI element -- buttons, inputs, dropdowns, lists, toggles, text, icons, images, etc. Note their behavior and purpose.
4. **Outgoing messages** (`parent.postMessage`): every message `type` string and payload sent to the sandbox.
5. **Incoming messages** (`onmessage` listener): every message `type` received from the sandbox and how it updates the UI.
6. **Styles**: how styling is done (CSS, SCSS, CSS-in-JS, inline styles, Tailwind, etc.).
7. **External dependencies**: any libraries beyond the framework itself.

### 3d. Read additional source files

Read any other source files (utilities, constants, types, assets) imported by the sandbox or UI. Note their purpose and contents.

### 3e. Produce a structured summary

Compile all findings into a summary with these sections:

1. **Message Protocol**: a table of every message type, its direction (UI->Sandbox or Sandbox->UI), and payload shape.
2. **Figma API Operations**: a list of every Figma API call and its purpose.
3. **UI Inventory**: every screen/view and its components.
4. **External Dependencies**: libraries that need to be installed in the new project.
5. **Network Requirements**: any external API calls or webhooks.

Present this summary to the user before proceeding to Phase 4.

---

## Phase 4: Rebuild the Plugin

Work in the new project directory (`<repo-name>-upgraded`). Follow the agent rules in `AGENTS.md` -- read it now if you have not already. The design-system-first rule is paramount: use existing DS components before writing custom HTML or CSS.

### 4a. Update `manifest.json`

Replace the template manifest values with the source plugin's values:

- `name`: from source manifest.
- `id`: from source manifest.
- `editorType`: from source manifest.
- `networkAccess`: from source manifest.
- `documentAccess`: from source manifest.

Keep `main` as `dist/code.js` and `ui` as `dist/ui.html` (the starter's build output paths).

Preserve any additional fields from the source manifest (`relaunchButtons`, `permissions`, `capabilities`, etc.).

### 4b. Rewrite `src/code.ts`

Replicate all sandbox functionality from the source plugin. The structure must follow:

```typescript
figma.showUI(__html__, { themeColors: true, height: <source-height>, width: <source-width> });

figma.ui.onmessage = (msg) => {
  // All message handlers from the source
};
```

Key rules:
- Preserve the exact `figma.showUI` dimensions from the source.
- Keep `themeColors: true` (required for DS theming).
- Replicate every message handler and its logic faithfully.
- Replicate all Figma API operations exactly.
- If the source has helper functions or modules for the sandbox, add them as separate files under `src/` and import them.

### 4c. Rewrite `src/ui.tsx`

This is the most important step. Rebuild the entire UI using the design system. Read `AGENTS.md` for the component catalog and follow this decision process for **every** UI element:

1. **Does a DS component exist?** Use it directly.
2. **Can you compose DS components?** Combine them.
3. **Truly need something custom?** Use DS tokens (`var(--affirm-*)`) for all visual properties and follow BEM naming.

**Mapping source UI elements to DS components:**

| Source element | DS component |
|----------------|-------------|
| Any text (headings, paragraphs, labels, spans) | `<Type variant="..." color="...">` |
| Text input | `<InputText label="...">` |
| Textarea | `<InputTextArea label="...">` |
| Checkbox | `<Checkbox label="...">` |
| Toggle / switch | `<Switch label="...">` |
| Link / anchor | `<Link href="...">` |
| Button | `<Button label="..." variant="..." emphasis="...">` |
| Select / dropdown | `<Dropdown>` |
| Page title area | `<PageHeader title="..." description="...">` |
| Section dividers | `<Divider>` |
| Section titles | `<SectionHeader title="...">` |
| Icons | `<Icon name="...">` |
| Loading spinner | `<CircularLoader>` |
| Status badge | `<Badge>` |
| Footer | `<PageFooter>` |

**Critical requirements:**
- Wrap the app in `<ThemeProvider>` (already in the starter's `ui.tsx`).
- Maintain the **exact same message protocol** with the sandbox. Every `parent.postMessage` and `onmessage` handler from the source must be replicated with identical type strings and payload shapes.
- If the source has multiple screens/views, implement them as React state-driven views (see the starter's `page` state pattern).
- Import all DS components from `'./design-system/components'`.
- Import `ThemeProvider` and `Type` from `'./design-system'`.

### 4d. Add custom SCSS

If any UI elements cannot be built with DS components alone:

- Add styles to `src/ui.scss` for simple additions, or create new `.scss` files for complex layouts.
- Use **only** design tokens: `var(--affirm-color-*)`, `var(--affirm-spacing-*)`, `var(--affirm-radius-*)`, etc.
- Follow BEM naming: `.affirm-<name>`, `.affirm-<name>__<element>`, `.affirm-<name>--<modifier>`.
- **Never** hardcode hex colors, pixel sizes, or font values.

### 4e. Install additional dependencies

If the source plugin uses libraries not included in the starter (identified in Phase 3e), install them:

```bash
npm install <package-name>
```

For type definitions:

```bash
npm install --save-dev @types/<package-name>
```

### 4f. Verify functionality parity

Walk through the message protocol table from Phase 3e and confirm:
- Every UI->Sandbox message is sent with the correct type and payload.
- Every Sandbox->UI message is received and handled.
- Every Figma API operation is present in `code.ts`.
- Every UI screen/view from the source is represented.

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
4. Repeat until the build succeeds with no errors.

### 5c. Check for lint issues

Run linter checks on all new and modified files. Fix any issues introduced.

---

## Phase 6: Open and Notify

### 6a. Open in a new Cursor window

```bash
cursor "<target-directory>"
```

If the `cursor` CLI is not available, try `code "<target-directory>"`.

### 6b. Notify the user

Tell the user the conversion is complete. Include:

1. **New project path**: the full path to the new project directory.
2. **Migration summary**: what was carried over from the source (message handlers, Figma API operations, UI screens).
3. **Design system usage**: which DS components were used to replace the original UI elements.
4. **Manual follow-ups** (if any): any functionality that could not be automatically converted, with guidance on what to do next.
5. **Next steps**: remind the user they can load the plugin in Figma by going to Plugins > Development > Import plugin from manifest and selecting the `manifest.json` in the new project.

---

## Rules

- **Preserve all functionality.** Every feature from the source plugin must work identically in the rebuilt version. Zero degradation.
- **Design system first.** Always check AGENTS.md and use DS components before writing custom elements. Never skip to custom CSS without confirming no DS component fits.
- **Token-only styling.** Never hardcode hex colors, pixel font sizes, or pixel spacing. Always use `var(--affirm-*)` tokens.
- **Exact message protocol.** Message type strings and payload shapes between sandbox and UI must match the source exactly.
- **Clean build required.** Do not consider the conversion complete until `npm run build` succeeds with zero errors.
- **Get confirmation before building.** Always confirm with the user after Phase 1 (before creating the project) and present the analysis summary after Phase 3 (before rebuilding).
- **Clean up GitHub clones.** If the source was cloned from GitHub, remove the temporary clone (`/tmp/convert-plugin-source/`) after Phase 3 analysis is complete.
