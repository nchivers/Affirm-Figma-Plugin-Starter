---
name: setup-plugin
description: >-
  Set up the development environment for this Figma plugin starter. Installs
  Node.js, npm, git, and project dependencies, then verifies the build. Use
  when the user says "setup", "install", "dependencies", "environment",
  "configure", "get started", or when npm run build fails due to missing tools.
---

# Setup Plugin Environment

Verifies system prerequisites, installs anything missing, runs `npm install`, and confirms `npm run build` succeeds. Designed to be fully automated -- the agent does the work, the user just watches.

---

## Phase 1: Check and Install System Prerequisites

Run all three checks in parallel. Record which tools are missing.

### 1a. Check Node.js

```bash
node --version
```

- If the command succeeds and the major version is >= 16, Node is ready. Move on.
- If the command fails or the version is < 16, install Node (see 1d).

### 1b. Check npm

```bash
npm --version
```

- npm ships with Node. If Node is present and npm is missing, something is wrong -- reinstall Node.

### 1c. Check Git

```bash
git --version
```

- If missing, install Git (see 1d).

### 1d. Install missing tools

Detect the OS and package manager, then install. Do NOT ask the user for permission unless you need to install Homebrew itself.

**macOS (darwin):**

1. Check for Homebrew: `brew --version`
2. If Homebrew is present, install missing tools directly:
   ```bash
   brew install node   # installs Node + npm
   brew install git
   ```
3. If Homebrew is NOT present, ask the user for confirmation first (it modifies the shell profile), then install it:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
   After Homebrew is installed, run the `brew install` commands above.

**Linux:**

1. Detect the package manager (`apt`, `dnf`, `yum`, `pacman`).
2. Install using the appropriate command:
   ```bash
   # Debian/Ubuntu
   sudo apt update && sudo apt install -y nodejs npm git

   # Fedora
   sudo dnf install -y nodejs npm git

   # Arch
   sudo pacman -Sy --noconfirm nodejs npm git
   ```
   If the distro's Node is too old (< 16), use NodeSource:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

**If automated install fails**, tell the user exactly what is missing and link to:
- Node.js: https://nodejs.org/
- Git: https://git-scm.com/

### 1e. Verify installations

After any installs, re-run the version checks from 1a--1c to confirm everything is working. Do not proceed until all three pass.

---

## Phase 2: Install Project Dependencies

### 2a. Run npm install

```bash
npm install
```

Run this in the project root (the directory containing `package.json`).

### 2b. Verify node_modules

Confirm the install succeeded by checking for key packages:

```bash
ls node_modules/webpack node_modules/typescript node_modules/react
```

If any are missing, delete `node_modules` and `package-lock.json` and retry:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Phase 3: Verify Build

### 3a. Run the build

```bash
npm run build
```

### 3b. Fix errors and retry

If the build fails:

1. Read the full error output.
2. Identify the root cause (common issues: wrong Node version, missing native dependencies, TypeScript errors).
3. Fix the issue.
4. Run `npm run build` again.
5. Repeat until the build succeeds with exit code 0.

### 3c. Confirm build output

Verify the expected output files exist:

```bash
ls dist/code.js dist/ui.html
```

Both files must be present for the plugin to work in Figma.

---

## Phase 4: Report

Tell the user the setup is complete. Include:

1. **Tool versions**: Node, npm, and Git versions now installed.
2. **Build status**: Confirm `npm run build` succeeded.
3. **Issues fixed**: Note anything that was installed or repaired during setup.
4. **Next step**: Remind the user they can start development with `npm run dev` (watch mode) or load the plugin in Figma via Plugins > Development > Import plugin from manifest and selecting `manifest.json`.

---

## Rules

- **Agent does the work.** Install tools automatically. Only prompt the user before installing Homebrew.
- **Idempotent.** Skip steps where tools are already present and at the correct version. Safe to re-run.
- **No partial success.** Do not consider setup complete until `npm run build` exits with code 0 and `dist/code.js` + `dist/ui.html` exist.
- **Clean retry.** If `npm install` or `npm run build` fails, attempt to fix the issue and retry before giving up.
