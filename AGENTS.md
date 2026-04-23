# Agent Instructions

Read and follow these instructions before doing any work in this repository.

## Project Overview

This is a **Figma plugin starter** built with React, TypeScript, SCSS, and Webpack. It includes a full design system with themed components and tokens.

**Architecture:**

- `src/code.ts` -- Figma plugin sandbox. Runs in Figma's main thread (no DOM). Communicates with the UI via message passing.
- `src/ui.tsx` -- React app rendered inside a Figma plugin iframe. This is where all UI lives.
- `manifest.json` -- Plugin configuration (name, ID, network access, editor types).
- `dist/` -- Build output. The UI script is inlined into `dist/ui.html`.

**Commands:**

- `npm run dev` -- Build in watch mode (development).
- `npm run build` -- Production build.

---

## Design System First

**ALWAYS use existing design system components before writing custom HTML or CSS.** This is the most important rule in this repository.

Follow this decision process for every UI element:

1. **Does a DS component exist?** Use it directly.
2. **Can you compose DS components?** Combine existing components to build what you need.
3. **Truly need something custom?** Use design system tokens for all visual properties (`var(--affirm-*)`), follow BEM naming (`affirm-<name>`), and read `src/design-system/README.md` for the full token reference.

Never skip to step 3 without confirming steps 1 and 2 don't apply.

---

## Available Components

Import from `'./design-system/components'` (relative to `src/`). Providers and hooks import from `'./design-system'`.

### Type -- All text rendering

Use `<Type>` for ALL text. Never use raw `<h1>`, `<p>`, `<span>` with manual font/color styling.

```tsx
import { Type } from './design-system/components';

<Type variant="headline.large" as="h1">Page Title</Type>
<Type variant="body.medium" color="text.secondary">Description text</Type>
<Type variant="body.small.highImp" color="text.critical">Error message</Type>
```

**Props:** `variant` (required), `color` (default `'text.primary'`), `as` (override HTML element), `className`, `children`

**Variants:** `headline.xxlarge`, `headline.xlarge`, `headline.large`, `headline.medium`, `headline.small`, `body.xlarge`, `body.large`, `body.medium`, `body.small`, `body.xlarge.highImp`, `body.large.highImp`, `body.medium.highImp`, `body.small.highImp`, `body.support.xlarge.strike`, `body.support.large.strike`, `body.support.medium.strike`, `body.support.small.strike`

**Colors:** `text.primary`, `text.primary.brand`, `text.primary.inverse`, `text.secondary`, `text.secondary.brand`, `text.secondary.inverse`, `text.link`, `text.link.inverse`, `text.critical`, `text.info`, `text.success`, `text.warning` (plus static variants)

### InputText -- Single-line text field

```tsx
import { InputText } from './design-system/components';

<InputText label="Email" value={email} onChange={e => setEmail(e.target.value)} />
<InputText label="Name" error errorMessage="Required field" />
<InputText label="Search" startIcon={<Icon name="checkmark-small" />} />
```

**Props:** `label` (required), `value`, `defaultValue`, `error`, `errorMessage`, `message`, `disabled`, `startIcon`, `endIcon`, plus standard `<input>` attributes

### InputTextArea -- Multi-line text field

```tsx
import { InputTextArea } from './design-system/components';

<InputTextArea label="Description" value={desc} onChange={e => setDesc(e.target.value)} />
```

**Props:** Same as `InputText` but renders a `<textarea>`.

### Checkbox

```tsx
import { Checkbox } from './design-system/components';

<Checkbox label="I agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
```

**Props:** `checked`, `defaultChecked`, `disabled`, `error`, `label`, `name`, `onChange`

### Switch -- Toggle switch

```tsx
import { Switch } from './design-system/components';

<Switch label="Enable feature" checked={on} onChange={e => setOn(e.target.checked)} />
<Switch label="Dark mode" labelPosition="start" checked={dark} onChange={e => setDark(e.target.checked)} />
```

**Props:** `label` (required, accepts `ReactNode`), `checked`, `defaultChecked`, `disabled`, `error`, `hideLabel`, `labelPosition` (`'end'` | `'start'`), `name`, `onChange`

### Link

```tsx
import { Link } from './design-system/components';

<Link href="https://example.com">Visit site</Link>
<Link href="https://example.com" externalLink>External site</Link>
<Link as="button" onClick={handleClick}>Action link</Link>
```

**Props:** `href`, `size` (`'large'` | `'medium'` | `'small'`), `externalLink`, `disabled`, `as` (`'a'` | `'button'` | `'span'`), plus standard HTML attributes

### Icon

```tsx
import { Icon } from './design-system/components';

<Icon name="checkmark-small" />
<Icon name="close-small" color="icon.critical" />
```

**Props:** `name` (required: `'arrow-left'` | `'checkmark-small'` | `'close-small'`), `color` (default `'icon.primary'`), `className`

---

## ThemeProvider

The app root MUST be wrapped in `<ThemeProvider>`. This is already set up in `src/ui.tsx`:

```tsx
import { ThemeProvider } from './design-system';

ReactDOM.createRoot(document.getElementById('react-page')).render(
  <ThemeProvider defaultTheme="affirm" defaultMode="auto">
    <App />
  </ThemeProvider>
);
```

Do not remove this wrapper. All DS components depend on it for token resolution.

To read or change the active theme/mode from within a component:

```tsx
import { useTheme } from './design-system';

const { theme, mode, setTheme, setMode } = useTheme();
```

---

## Styling Rules for Custom Elements

When you must create custom UI (after confirming no DS component fits):

- **Never hardcode** hex colors, pixel sizes, or font values.
- Use `var(--affirm-color-bg-*)` for backgrounds.
- Use `var(--affirm-color-text-*)` for text colors.
- Use `var(--affirm-color-border-*)` for borders.
- Use `var(--affirm-color-icon-*)` for icon colors.
- Use `var(--affirm-spacing-*)` for spacing.
- Use `var(--affirm-radius-*)` for border radius.
- Follow BEM naming: `.affirm-<component>`, `.affirm-<component>__<element>`, `.affirm-<component>--<modifier>`.
- Read `src/design-system/README.md` for the complete token catalog and architecture guide.

---

## Plugin Communication

The sandbox (`src/code.ts`) and UI (`src/ui.tsx`) communicate via messages:

**UI to sandbox:**
```tsx
parent.postMessage({ pluginMessage: { type: 'my-action', data: { ... } } }, '*');
```

**Sandbox to UI:**
```ts
figma.ui.postMessage({ type: 'response', data: { ... } });
```

**Sandbox receiving from UI:**
```ts
figma.ui.onmessage = (msg) => {
  if (msg.type === 'my-action') {
    // handle it
  }
};
```

**UI receiving from sandbox:**
```tsx
React.useEffect(() => {
  const handler = (event: MessageEvent) => {
    const msg = event.data.pluginMessage;
    if (msg?.type === 'response') {
      // handle it
    }
  };
  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
}, []);
```

---

## Quick Reference

| Need | Use |
|------|-----|
| Any text | `<Type variant="..." color="...">` |
| Text input | `<InputText label="...">` |
| Text area | `<InputTextArea label="...">` |
| Checkbox | `<Checkbox label="...">` |
| Toggle | `<Switch label="...">` |
| Hyperlink | `<Link href="...">` |
| Action link | `<Link as="button" onClick={...}>` |
| Icon | `<Icon name="checkmark-small">` or `<Icon name="close-small">` |
| Spacing | `var(--affirm-spacing-*)` in SCSS |
| Colors | `var(--affirm-color-bg-*)`, `var(--affirm-color-text-*)`, etc. |
| Border radius | `var(--affirm-radius-*)` |
| Full token docs | Read `src/design-system/README.md` |
