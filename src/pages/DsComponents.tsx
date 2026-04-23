import * as React from 'react';
import {
  Badge,
  Button,
  Checkbox,
  CircularLoader,
  Divider,
  Dropdown,
  Icon,
  InputText,
  InputTextArea,
  Link,
  PageFooter,
  PageHeader,
  SectionHeader,
  Switch,
  Type,
} from '../design-system/components';
import './DsComponents.scss';

export interface DsComponentsProps {
  onBack: () => void;
}

interface PropRow {
  name: string;
  required: boolean;
  type: string;
}

interface PropsTableProps {
  rows: PropRow[];
}

const PropsTable: React.FC<PropsTableProps> = ({ rows }) => (
  <div className="affirm-ds-components__table-wrapper">
    <table className="affirm-ds-components__table">
      <thead>
        <tr>
          <th className="affirm-ds-components__th">
            <Type variant="body.small.highImp" as="span">Prop</Type>
          </th>
          <th className="affirm-ds-components__th">
            <Type variant="body.small.highImp" as="span">Required</Type>
          </th>
          <th className="affirm-ds-components__th">
            <Type variant="body.small.highImp" as="span">Type</Type>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td className="affirm-ds-components__td">
              <Type variant="body.small" as="span">
                <span className="affirm-ds-components__type-pill">{row.name}</span>
              </Type>
            </td>
            <td className="affirm-ds-components__td">
              <Type variant="body.small" as="span">{row.required ? 'Yes' : 'No'}</Type>
            </td>
            <td className="affirm-ds-components__td">
              <Type variant="body.small" as="span">
                <span className="affirm-ds-components__type-pill">{row.type}</span>
              </Type>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

interface ComponentSectionProps {
  name: string;
  description: string;
  demo: React.ReactNode;
  props: PropRow[];
  isLast?: boolean;
}

const ComponentSection: React.FC<ComponentSectionProps> = ({ name, description, demo, props, isLast }) => (
  <>
    <div className="affirm-ds-components__section">
      <SectionHeader title={name} body={description} />
      <div className="affirm-ds-components__demo">{demo}</div>
      <PropsTable rows={props} />
    </div>
    {!isLast && <Divider variant="secondary" />}
  </>
);

const BadgeDemo: React.FC = () => (
  <div className="affirm-ds-components__demo-row">
    <Badge category="info">Info</Badge>
    <Badge category="success">Success</Badge>
    <Badge category="warning">Warning</Badge>
    <Badge category="error">Error</Badge>
    <Badge category="brand-primary">Brand</Badge>
  </div>
);

const ButtonDemo: React.FC = () => (
  <div className="affirm-ds-components__demo-row">
    <Button label="Primary" />
    <Button label="Secondary" emphasis="secondary" />
    <Button label="Tertiary" emphasis="tertiary" />
    <Button label="Destructive" variant="destructive" />
    <Button label="Icon" icon="checkmark-small" iconPosition="start" />
  </div>
);

const CheckboxDemo: React.FC = () => {
  const [checked, setChecked] = React.useState(false);
  return (
    <div className="affirm-ds-components__demo-row">
      <Checkbox label="Unchecked" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Error" error />
    </div>
  );
};

const CircularLoaderDemo: React.FC = () => (
  <div className="affirm-ds-components__demo-row">
    <CircularLoader size="large" />
    <CircularLoader size="small" />
  </div>
);

const DividerDemo: React.FC = () => (
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--affirm-spacing-xs)' }}>
    <Divider variant="primary" />
    <Divider variant="secondary" />
    <Divider variant="tertiary" />
  </div>
);

const DropdownDemo: React.FC = () => {
  const [value, setValue] = React.useState('');
  return (
    <Dropdown
      label="Choose an option"
      value={value}
      onChange={setValue}
      options={[
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ]}
    />
  );
};

const IconDemo: React.FC = () => (
  <div className="affirm-ds-components__demo-row">
    <Icon name="checkmark-small" />
    <Icon name="close-small" />
    <Icon name="chevron-down" />
    <Icon name="chevron-right" />
    <Icon name="levels" />
  </div>
);

const InputTextDemo: React.FC = () => {
  const [value, setValue] = React.useState('');
  return (
    <InputText label="Text input" value={value} onChange={(e) => setValue(e.target.value)} />
  );
};

const InputTextAreaDemo: React.FC = () => {
  const [value, setValue] = React.useState('');
  return (
    <InputTextArea label="Multi-line input" value={value} onChange={(e) => setValue(e.target.value)} />
  );
};

const LinkDemo: React.FC = () => (
  <div className="affirm-ds-components__demo-row">
    <Link href="https://www.affirm.com">Default link</Link>
    <Link href="https://www.affirm.com" externalLink>External link</Link>
    <Link as="button" onClick={() => { /* demo */ }}>Action link</Link>
  </div>
);

const PageFooterDemo: React.FC = () => (
  <div style={{ width: '100%' }}>
    <PageFooter builderName="Nick" builderSlack="https://affirm.slack.com/team/U12345" updatedDate="04.21.2026" />
  </div>
);

const PageHeaderDemo: React.FC = () => (
  <Type variant="body.small" color="text.secondary">
    The PageHeader is used at the top of this page. See the top of the screen for a live example.
  </Type>
);

const SectionHeaderDemo: React.FC = () => (
  <div style={{ width: '100%' }}>
    <SectionHeader
      title="Example section"
      body="This is the body description shown below the title."
      actionLabel="Action"
      onActionClick={() => { /* demo */ }}
    />
  </div>
);

const SwitchDemo: React.FC = () => {
  const [on, setOn] = React.useState(false);
  return (
    <div className="affirm-ds-components__demo-row">
      <Switch label="Toggle" checked={on} onChange={(e) => setOn(e.target.checked)} />
      <Switch label="Disabled" disabled />
    </div>
  );
};

const TypeDemo: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--affirm-spacing-xxs)' }}>
    <Type variant="headline.large">Headline large</Type>
    <Type variant="headline.small">Headline small</Type>
    <Type variant="body.large">Body large</Type>
    <Type variant="body.small" color="text.secondary">Body small secondary</Type>
  </div>
);

const badgeProps: PropRow[] = [
  { name: 'category', required: false, type: 'BadgeCategory' },
  { name: 'context', required: false, type: 'BadgeContext' },
  { name: 'size', required: false, type: 'BadgeSize' },
  { name: 'icon', required: false, type: 'ReactNode' },
  { name: 'iconPosition', required: false, type: "'start' | 'end'" },
  { name: 'children', required: true, type: 'ReactNode' },
  { name: 'className', required: false, type: 'string' },
];

const buttonProps: PropRow[] = [
  { name: 'label', required: true, type: 'string' },
  { name: 'emphasis', required: false, type: "'primary' | 'secondary' | 'tertiary'" },
  { name: 'variant', required: false, type: 'ButtonVariant' },
  { name: 'size', required: false, type: "'small' | 'medium' | 'large'" },
  { name: 'icon', required: false, type: 'ReactNode | IconName' },
  { name: 'iconPosition', required: false, type: "'none' | 'start' | 'end' | 'only'" },
  { name: 'loading', required: false, type: 'boolean' },
  { name: 'disabled', required: false, type: 'boolean' },
  { name: 'onClick', required: false, type: '(e: MouseEvent) => void' },
];

const checkboxProps: PropRow[] = [
  { name: 'checked', required: false, type: 'boolean' },
  { name: 'defaultChecked', required: false, type: 'boolean' },
  { name: 'disabled', required: false, type: 'boolean' },
  { name: 'error', required: false, type: 'boolean' },
  { name: 'label', required: false, type: 'string' },
  { name: 'name', required: false, type: 'string' },
  { name: 'onChange', required: false, type: '(e: ChangeEvent) => void' },
];

const circularLoaderProps: PropRow[] = [
  { name: 'colorBorder', required: false, type: "'default' | 'default-inverse'" },
  { name: 'size', required: false, type: "'large' | 'small'" },
  { name: 'className', required: false, type: 'string' },
];

const dividerProps: PropRow[] = [
  { name: 'variant', required: false, type: 'DividerVariant' },
  { name: 'className', required: false, type: 'string' },
];

const dropdownProps: PropRow[] = [
  { name: 'label', required: true, type: 'string' },
  { name: 'options', required: true, type: 'DropdownOption[]' },
  { name: 'value', required: false, type: 'string' },
  { name: 'defaultValue', required: false, type: 'string' },
  { name: 'error', required: false, type: 'boolean' },
  { name: 'errorMessage', required: false, type: 'string' },
  { name: 'message', required: false, type: 'string' },
  { name: 'disabled', required: false, type: 'boolean' },
  { name: 'startIcon', required: false, type: 'ReactNode' },
  { name: 'onChange', required: false, type: '(value: string) => void' },
  { name: 'onOpenChange', required: false, type: '(open: boolean) => void' },
];

const iconProps: PropRow[] = [
  { name: 'name', required: true, type: 'IconName' },
  { name: 'color', required: false, type: 'IconColor' },
  { name: 'className', required: false, type: 'string' },
];

const inputTextProps: PropRow[] = [
  { name: 'label', required: true, type: 'string' },
  { name: 'value', required: false, type: 'string' },
  { name: 'defaultValue', required: false, type: 'string' },
  { name: 'error', required: false, type: 'boolean' },
  { name: 'errorMessage', required: false, type: 'string' },
  { name: 'message', required: false, type: 'string' },
  { name: 'disabled', required: false, type: 'boolean' },
  { name: 'startIcon', required: false, type: 'ReactNode' },
  { name: 'endIcon', required: false, type: 'ReactNode' },
  { name: 'onChange', required: false, type: '(e: ChangeEvent) => void' },
];

const inputTextAreaProps: PropRow[] = [
  { name: 'label', required: true, type: 'string' },
  { name: 'value', required: false, type: 'string' },
  { name: 'defaultValue', required: false, type: 'string' },
  { name: 'error', required: false, type: 'boolean' },
  { name: 'errorMessage', required: false, type: 'string' },
  { name: 'message', required: false, type: 'string' },
  { name: 'disabled', required: false, type: 'boolean' },
  { name: 'startIcon', required: false, type: 'ReactNode' },
  { name: 'endIcon', required: false, type: 'ReactNode' },
  { name: 'onChange', required: false, type: '(e: ChangeEvent) => void' },
];

const linkProps: PropRow[] = [
  { name: 'size', required: false, type: "'large' | 'medium' | 'small'" },
  { name: 'externalLink', required: false, type: 'boolean' },
  { name: 'disabled', required: false, type: 'boolean' },
  { name: 'as', required: false, type: "'a' | 'button' | 'span'" },
  { name: 'href', required: false, type: 'string' },
  { name: 'target', required: false, type: 'HTMLAttributeAnchorTarget' },
  { name: 'rel', required: false, type: 'string' },
  { name: 'children', required: false, type: 'ReactNode' },
];

const pageFooterProps: PropRow[] = [
  { name: 'builderName', required: true, type: 'string' },
  { name: 'builderSlack', required: false, type: 'string' },
  { name: 'updatedDate', required: true, type: 'string' },
  { name: 'className', required: false, type: 'string' },
];

const pageHeaderProps: PropRow[] = [
  { name: 'title', required: true, type: 'string' },
  { name: 'description', required: true, type: 'string' },
  { name: 'action', required: false, type: 'ReactNode' },
  { name: 'actionPosition', required: false, type: "'start' | 'end'" },
];

const sectionHeaderProps: PropRow[] = [
  { name: 'title', required: true, type: 'string' },
  { name: 'body', required: false, type: 'string' },
  { name: 'actionLabel', required: false, type: 'string' },
  { name: 'onActionClick', required: false, type: '(e: MouseEvent) => void' },
  { name: 'className', required: false, type: 'string' },
];

const switchProps: PropRow[] = [
  { name: 'label', required: true, type: 'ReactNode' },
  { name: 'checked', required: false, type: 'boolean' },
  { name: 'defaultChecked', required: false, type: 'boolean' },
  { name: 'disabled', required: false, type: 'boolean' },
  { name: 'error', required: false, type: 'boolean' },
  { name: 'hideLabel', required: false, type: 'boolean' },
  { name: 'labelPosition', required: false, type: "'end' | 'start'" },
  { name: 'name', required: false, type: 'string' },
  { name: 'onChange', required: false, type: '(e: ChangeEvent) => void' },
];

const typeProps: PropRow[] = [
  { name: 'variant', required: true, type: 'TypeVariant' },
  { name: 'color', required: false, type: 'TypeColor' },
  { name: 'as', required: false, type: 'HTML element tag' },
  { name: 'className', required: false, type: 'string' },
  { name: 'children', required: false, type: 'ReactNode' },
];

const DsComponents: React.FC<DsComponentsProps> = ({ onBack }) => {
  const sections: Array<Omit<ComponentSectionProps, 'isLast'>> = [
    {
      name: 'Badge',
      description: 'A compact label used to communicate status, category, or count.',
      demo: <BadgeDemo />,
      props: badgeProps,
    },
    {
      name: 'Button',
      description: 'Triggers actions. Supports multiple emphasis levels, variants, and icon placements.',
      demo: <ButtonDemo />,
      props: buttonProps,
    },
    {
      name: 'Checkbox',
      description: 'Allows users to select one or more items from a set.',
      demo: <CheckboxDemo />,
      props: checkboxProps,
    },
    {
      name: 'CircularLoader',
      description: 'Indicates an in-progress operation with an animated spinner.',
      demo: <CircularLoaderDemo />,
      props: circularLoaderProps,
    },
    {
      name: 'Divider',
      description: 'A horizontal rule used to separate content sections.',
      demo: <DividerDemo />,
      props: dividerProps,
    },
    {
      name: 'Dropdown',
      description: 'A single-select menu for choosing an option from a list.',
      demo: <DropdownDemo />,
      props: dropdownProps,
    },
    {
      name: 'Icon',
      description: 'Renders a design system SVG icon at a configurable color.',
      demo: <IconDemo />,
      props: iconProps,
    },
    {
      name: 'InputText',
      description: 'A single-line text field with floating label, icons, and validation messaging.',
      demo: <InputTextDemo />,
      props: inputTextProps,
    },
    {
      name: 'InputTextArea',
      description: 'A multi-line text field for longer-form input.',
      demo: <InputTextAreaDemo />,
      props: inputTextAreaProps,
    },
    {
      name: 'Link',
      description: 'Navigational text link. Can render as an anchor, button, or span.',
      demo: <LinkDemo />,
      props: linkProps,
    },
    {
      name: 'PageFooter',
      description: 'Attribution footer shown at the bottom of a plugin page.',
      demo: <PageFooterDemo />,
      props: pageFooterProps,
    },
    {
      name: 'PageHeader',
      description: 'Top-of-page header with a title, description, and optional action button.',
      demo: <PageHeaderDemo />,
      props: pageHeaderProps,
    },
    {
      name: 'SectionHeader',
      description: 'Introduces a section of content with a title, optional body, and optional action.',
      demo: <SectionHeaderDemo />,
      props: sectionHeaderProps,
    },
    {
      name: 'Switch',
      description: 'A toggle control for binary on/off preferences.',
      demo: <SwitchDemo />,
      props: switchProps,
    },
    {
      name: 'Type',
      description: 'The single component for rendering all text at design system variants and colors.',
      demo: <TypeDemo />,
      props: typeProps,
    },
  ];

  return (
    <main className="affirm-ds-components">
      <PageHeader
        navigation="secondary"
        title="DS Components"
        description="A live reference of every design system component, its props, and a usage example."
        action={
          <Button
            label="Back"
            variant="neutral"
            emphasis="tertiary"
            icon="arrow-left"
            iconPosition="only"
            onClick={onBack}
          />
        }
        actionPosition="start"
      />
      {sections.map((section, i) => (
        <ComponentSection
          key={section.name}
          name={section.name}
          description={section.description}
          demo={section.demo}
          props={section.props}
          isLast={i === sections.length - 1}
        />
      ))}
    </main>
  );
};

export default DsComponents;
