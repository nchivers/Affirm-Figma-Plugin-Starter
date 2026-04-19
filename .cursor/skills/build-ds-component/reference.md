# Design System Architecture Reference

Condensed reference for building components. For full documentation see `src/design-system/README.md`.

## Directory structure per component

```
src/design-system/components/<ComponentName>/
  <ComponentName>.tsx    # React component
  <ComponentName>.scss   # BEM styles consuming var(--affirm-*) tokens
  _tokens.scss           # CSS custom property definitions (light + dark + all-modes)
  index.ts               # Barrel export
```

## Token naming convention

CSV paths map 1:1 to CSS custom properties -- dots and underscores become hyphens:

| CSV path | CSS custom property |
|----------|---------------------|
| `affirm.color.checkbox.indicator.bg.selected.resting` | `--affirm-color-checkbox-indicator-bg-selected-resting` |
| `affirm.size.checkbox.indicator.all` | `--affirm-size-checkbox-indicator-all` |
| `affirm.radius.checkbox.container.all` | `--affirm-radius-checkbox-container-all` |
| `affirm.spacing.checkbox.gap.x` | `--affirm-spacing-checkbox-gap-x` |

General pattern: `--affirm-{foundation}-{component}-{part}-{property}-{state}-{interaction}`

## `_tokens.scss` structure

```scss
@use 'sass:map';
@use '../../tokens/base-colors' as *;
@use '../../tokens/base-sizes' as *;

// Mode-independent (sizes, radius, spacing)
:root {
  --affirm-radius-<component>-<part>-all: #{map.get($base-sizes, '<scale-key>')};
  --affirm-size-<component>-<part>-<property>: #{map.get($base-sizes, '<scale-key>')};
  --affirm-spacing-<component>-<part>-<property>: #{map.get($base-sizes, '<scale-key>')};
}

// Light mode colors
[data-mode='light'] {
  --affirm-color-<component>-<part>-<property>-<state>-<interaction>: #{map.get($base-colors, '<color-key>')};
}

// Dark mode colors
[data-mode='dark'] {
  --affirm-color-<component>-<part>-<property>-<state>-<interaction>: #{map.get($base-colors, '<color-key>')};
}
```

Group tokens within each block by component part with comment headers. See `Checkbox/_tokens.scss` or `Switch/_tokens.scss` for real examples.

## SCSS patterns

### BEM naming
- Block: `.affirm-<kebab-case-component>` (e.g., `.affirm-checkbox`, `.affirm-input-text-area`)
- Elements: `&__<layer-name>` (e.g., `&__indicator`, `&__label`, `&__track`)
- Modifiers: `&--<state>` (e.g., `&--selected`, `&--disabled`, `&--error`)

### Token consumption
Every visual property comes from a `var()` reference -- never hardcode values:
```scss
.affirm-checkbox__indicator {
  width: var(--affirm-size-checkbox-indicator-all);
  height: var(--affirm-size-checkbox-indicator-all);
  border-radius: var(--affirm-radius-checkbox-indicator-container-all);
  background: var(--affirm-color-checkbox-indicator-bg-unselected-resting);
}
```

### State styling order
Style states in this order per element: resting, `:hover`, `:active`, `:has(&__input:focus-visible)`. Group by modifier combination:

1. Unselected (base)
2. Selected (`&--selected`)
3. Error unselected (`&--error`)
4. Error + selected (`&--error#{&}--selected`)
5. Disabled (`&--disabled`)
6. Disabled + selected (`&--disabled#{&}--selected`)

### Compound modifier selectors
Use `#{&}` interpolation for compound modifiers:
```scss
&--error#{&}--selected &__track { ... }
&--disabled#{&}--selected &__handle { ... }
```

### Focus-visible pattern
```scss
&:has(&__input:focus-visible) {
  outline: var(--affirm-size-<component>-outline-width-focus-visible) solid
    var(--affirm-color-<component>-container-outline-focus-visible);
  outline-offset: var(--affirm-spacing-<component>-container-outline-offset-focus-visible);
}
```

### Typography
Import the component-type mixin partial and apply to text elements:
```scss
@use '../../tokens/component-type' as typography;

.affirm-<component>__label {
  @include typography.component-paragraph-large;
  color: var(--affirm-color-<component>-label-text-unselected-resting);
}
```

Available mixins: `component-singleline-{xlarge|large|medium|small|xsmall}` and `component-paragraph-{xlarge|large|medium|small|xsmall}`, each with optional `-mid-imp` and `-high-imp` weight variants.

### Disabled hover/active suppression
Override hover/active states for disabled to prevent visual changes:
```scss
&--disabled:hover &__track,
&--disabled:active &__track {
  background: var(--affirm-color-<component>-track-bg-unselected-disabled);
}
```

## TSX patterns

### Component structure
```tsx
import * as React from 'react';
import './<ComponentName>.scss';
import { Icon } from '../Icon';

export interface <ComponentName>Props {
  // Props derived from Figma component API
}

export const <ComponentName> = React.forwardRef<HTMLElement, <ComponentName>Props>(
  ({ prop1, prop2, ...rest }, ref) => {
    // State management (controlled/uncontrolled if applicable)

    const classNames = [
      'affirm-<kebab-name>',
      isChecked && 'affirm-<kebab-name>--selected',
      disabled && 'affirm-<kebab-name>--disabled',
      error && 'affirm-<kebab-name>--error',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label className={classNames}>
        {/* Hidden input + visible elements */}
      </label>
    );
  },
);

<ComponentName>.displayName = '<ComponentName>';
```

### Controlled/uncontrolled pattern
Used by Checkbox, Switch, InputText, InputTextArea:
```tsx
const [internalValue, setInternalValue] = React.useState(defaultValue ?? initialValue);
const isControlled = value !== undefined;
const currentValue = isControlled ? value : internalValue;

const handleChange = (e) => {
  if (!isControlled) {
    setInternalValue(e.target.value);
  }
  onChange?.(e);
};
```

### Class name construction
Always use the array + filter + join pattern -- no classnames library:
```tsx
const classNames = [
  'affirm-component',
  condition && 'affirm-component--modifier',
  className,
]
  .filter(Boolean)
  .join(' ');
```

### Focus-visible hook
For input components that need custom focus styling:
```tsx
import { useFocusVisible } from '../../hooks';

const { isFocusVisible, focusVisibleProps } = useFocusVisible();
// Spread focusVisibleProps onto the input, use isFocusVisible for data attribute
```

## Barrel / index exports

### Per-component `index.ts`
```typescript
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

### Registration checklist

1. **`src/design-system/tokens/_index.scss`**: Add `@use` import (alphabetical order):
   ```scss
   @use '../components/<ComponentName>/tokens' as <kebab-name>-tokens;
   ```

2. **`src/design-system/components/index.ts`**: Add exports (alphabetical order):
   ```typescript
   export { ComponentName } from './<ComponentName>';
   export type { ComponentNameProps } from './<ComponentName>';
   ```

3. **`src/design-system/index.ts`**: Add root barrel exports:
   ```typescript
   export { ComponentName } from './components';
   export type { ComponentNameProps } from './components';
   ```

## Existing components for reference

| Component | Has tokens | Key patterns to study |
|-----------|-----------|----------------------|
| `Checkbox` | Yes | Controlled/uncontrolled, indicator + label, error states, focus-visible |
| `Switch` | Yes | Compound modifiers (`#{&}`), track/handle/icon structure, `role="switch"` |
| `InputText` | Yes | `useFocusVisible` hook, `data-focus-visible` attribute, Omit<InputHTMLAttributes> |
| `InputTextArea` | Yes | Multi-line input, resize handling, character count |
| `Link` | Yes | Polymorphic `as` prop, size variants, link typography mixins |
| `Icon` | No | Inline style for color variable, `toKebab` helper |
| `Type` | No | Variant/color dot-notation to CSS variable mapping |
