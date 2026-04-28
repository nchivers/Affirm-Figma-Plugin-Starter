---
name: update-figma-plugin-ds
description: >-
  Pull the latest design system from the Affirm-Figma-Plugin-Starter template
  repo and overwrite the local src/design-system/ folder and AGENTS.md. Use
  when the user says "update design system", "sync DS", "pull latest DS",
  "update DS", or wants to get the newest components, tokens, or themes from
  the template.
---

# Update Figma Plugin Design System

Pulls the latest `src/design-system/` folder and `AGENTS.md` from the template GitHub repo and overwrites the local copies to keep a derived plugin in sync with the upstream design system.

## Prerequisites

- Git must be installed.
- Network access to `https://github.com/nchivers/Affirm-Figma-Plugin-Starter`.
- Node.js and npm must be installed (for the verification build).

---

## Phase 1: Snapshot Current State

Before fetching, record the current component inventory so you can report what changed at the end.

```bash
ls src/design-system/components/ > /tmp/ds-components-before.txt 2>/dev/null || true
```

---

## Phase 2: Fetch Latest from Template

Shallow-clone the template repo into a temporary directory:

```bash
rm -rf /tmp/affirm-plugin-ds-update
git clone --depth 1 https://github.com/nchivers/Affirm-Figma-Plugin-Starter.git /tmp/affirm-plugin-ds-update
```

If the clone fails, stop and tell the user: *"Could not reach the template repo. Check your network connection and that https://github.com/nchivers/Affirm-Figma-Plugin-Starter is accessible."*

---

## Phase 3: Replace Local Files

The design system should never be modified locally in derived plugins. Overwrite without backup.

### 3a. Replace `src/design-system/`

```bash
rm -rf src/design-system
cp -R /tmp/affirm-plugin-ds-update/src/design-system src/design-system
```

### 3b. Replace `AGENTS.md`

```bash
cp /tmp/affirm-plugin-ds-update/AGENTS.md AGENTS.md
```

### 3c. Replace `CLAUDE.md`

```bash
cp /tmp/affirm-plugin-ds-update/CLAUDE.md CLAUDE.md
```

---

## Phase 4: Clean Up

Remove the temporary clone:

```bash
rm -rf /tmp/affirm-plugin-ds-update
```

---

## Phase 5: Build and Verify

Run the production build to confirm the updated design system is compatible with the plugin:

```bash
npm run build
```

If the build fails:

1. Read the error output.
2. The most likely causes are:
   - **Removed component**: A DS component the plugin imports was removed or renamed. Update the plugin's imports in `src/ui.tsx` to use the replacement.
   - **Changed export**: A component's named export changed. Update the import statement.
   - **New peer dependency**: The DS added a dependency not in the plugin's `package.json`. Run `npm install`.
3. Fix the issue and run `npm run build` again.
4. Repeat until the build succeeds with zero errors.

---

## Phase 6: Report Changes

Compare the before and after component lists and summarize for the user:

```bash
ls src/design-system/components/ > /tmp/ds-components-after.txt 2>/dev/null || true
```

Present a summary including:

1. **New components**: directories in after but not in before.
2. **Removed components**: directories in before but not in after.
3. **Build result**: whether the build passed or what was fixed.
4. **Manual follow-ups**: any plugin code that needed changes due to breaking DS updates (component renames, removed exports, changed props).

After reporting, clean up the temp files:

```bash
rm -f /tmp/ds-components-before.txt /tmp/ds-components-after.txt
```

---

## Rules

- **Always overwrite.** The `src/design-system/` folder and `AGENTS.md` are owned by the template. Never preserve local modifications.
- **Clean build required.** Do not consider the update complete until `npm run build` succeeds with zero errors.
- **Clean up temp files.** Always remove `/tmp/affirm-plugin-ds-update` and any temp diff files when done, even if the build fails.
- **Do not modify the template.** This skill only pulls from the template repo. Never push changes back.
- **Scope is limited.** Only sync `src/design-system/`, `AGENTS.md`, and `CLAUDE.md`. Do not overwrite `manifest.json`, `src/code.ts`, `src/ui.tsx`, `src/ui.scss`, `package.json`, or any other plugin-specific files.
