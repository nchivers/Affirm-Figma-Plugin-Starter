# Affirm Figma Plugin Starter

A template for building Figma plugins with Affirm's design system built in. You don't need to be an engineer to use it -- Claude (the AI in Cursor) handles all the coding for you.

Plugins built from this template automatically get:

- **Affirm-branded UI** that matches our Figma component library
- **Dark and light mode** support out of the box
- **Themed components** (buttons, inputs, text, toggles, etc.) ready to use

---

## Getting Started

### 1. Download Cursor

If you don't have it yet, download **Cursor** (the AI code editor) from [cursor.com](https://www.cursor.com/). Install it like any other app.

### 2. Clone this repo to your computer

Click the green **Code** button at the top of this GitHub page, then choose **Open with Cursor** if that option appears. 

Alternatively, copy the repo URL from the green Code button, open Cursor, and use **File > Open Folder** after cloning. If you're not sure how to clone, just open Cursor and ask Claude: "Help me clone this repo" and paste the URL -- it will walk you through it.

### 3. Run setup

Once the repo is open in Cursor, open the AI chat panel (click the chat icon or press `Cmd+L` on Mac) and type **/setup-plugin**. Claude will install everything your computer needs to build plugins (Node.js, npm, git, and project dependencies). You only need to do this once.

### 4. Start building

After setup is complete, you're ready to go. In the same chat panel, type one of these commands:

- **/build-a-figma-plugin** -- to create a brand new plugin from an idea
- **/convert-plugin** -- to rebuild an existing plugin with the Affirm design system

Claude will guide you through the rest. More details on each skill below.

---

## What You Can Ask Claude to Do

This template comes with built-in skills that Claude knows how to run. Just say the trigger phrase (or anything similar) and Claude will walk you through the process.

### Build a Plugin

**Command:** `/build-a-figma-plugin`

Describe your plugin idea and Claude creates it from scratch. It will ask you a few questions about what the plugin should do, then build the whole thing for you.

Claude will ask designer-friendly questions (no technical jargon), then build the plugin and open it in a new window.

---

### Convert an Existing Plugin

**Command:** `/convert-plugin`

Have an existing Figma plugin that you want to rebuild with the Affirm design system? Point Claude at it (a folder on your computer or a GitHub link) and it will recreate the plugin with Affirm-branded UI while keeping all the original functionality.

---

## Maintenance

### Update the Design System

**Command:** `/update-figma-plugin-ds`

If the design system has been updated in the template and you want to pull the latest version into your plugin, Claude can sync it for you. This replaces the design system files in your plugin with the newest version from the template, then makes sure everything still builds correctly.

---

## Common Questions

**Do I need to know how to code?**

No. Claude writes all the code. You describe what you want in plain language and it handles the implementation.

**How do I test my plugin in Figma?**

In Figma, go to **Plugins > Development > Import plugin from manifest**, then select the `manifest.json` file in your plugin's folder. Your plugin will appear in the development plugins menu.

**What is the design system?**

A collection of pre-built UI components (buttons, text fields, toggles, dropdowns, etc.) styled to match Affirm's visual identity. They support dark mode, light mode, and respond to Figma's theme automatically.

**Can I customize how the plugin looks?**

Yes. The design system uses design tokens for colors, spacing, and sizing. Tell Claude what you'd like changed and it will use the token system to make adjustments that stay consistent with Affirm's brand.

**How do I run the plugin during development?**

Type `npm run dev` in the terminal, or just ask Claude to start it for you. This watches for changes and rebuilds automatically.

**What if something breaks?**

Ask Claude to fix it. You can say "the build is broken" or "I'm getting an error" and paste any error messages you see. Claude will diagnose and repair the issue.
