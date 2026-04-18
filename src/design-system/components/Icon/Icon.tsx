import * as React from 'react';
import './Icon.scss';

export type IconName = 'checkmark-small' | 'close-small';

export type IconColor =
  | 'icon.primary'
  | 'icon.primary.brand'
  | 'icon.primary.brand.on_dark.static'
  | 'icon.primary.brand.on_light.static'
  | 'icon.primary.inverse'
  | 'icon.primary.on_dark.static'
  | 'icon.primary.on_light.static'
  | 'icon.secondary'
  | 'icon.secondary.brand'
  | 'icon.secondary.inverse'
  | 'icon.link'
  | 'icon.link.inverse'
  | 'icon.link.on_dark.static'
  | 'icon.link.on_light.static'
  | 'icon.critical'
  | 'icon.info'
  | 'icon.success'
  | 'icon.warning';

export interface IconProps {
  name: IconName;
  color?: IconColor;
  className?: string;
}

interface IconDef {
  viewBox: string;
  path: React.ReactNode;
}

const icons: Record<IconName, IconDef> = {
  'checkmark-small': {
    viewBox: '0 0 20 20',
    path: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.5473 6.83094C13.8018 7.06418 13.8189 7.45954 13.5857 7.71399L9.00237 12.714C8.88718 12.8397 8.72565 12.9128 8.55522 12.9165C8.38479 12.9202 8.22025 12.8541 8.0997 12.7336L6.01637 10.6503C5.77229 10.4062 5.77229 10.0105 6.01637 9.76639C6.26045 9.52231 6.65618 9.52231 6.90025 9.76639L8.52201 11.3881L12.6643 6.86933C12.8975 6.61488 13.2929 6.59769 13.5473 6.83094Z"
        fill="currentColor"
        stroke="none"
      />
    ),
  },
  'close-small': {
    viewBox: '0 0 20 20',
    path: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.46967 6.46967C6.76256 6.17678 7.23744 6.17678 7.53033 6.46967L10 8.93934L12.4697 6.46967C12.7626 6.17678 13.2374 6.17678 13.5303 6.46967C13.8232 6.76256 13.8232 7.23744 13.5303 7.53033L11.0607 10L13.5303 12.4697C13.8232 12.7626 13.8232 13.2374 13.5303 13.5303C13.2374 13.8232 12.7626 13.8232 12.4697 13.5303L10 11.0607L7.53033 13.5303C7.23744 13.8232 6.76256 13.8232 6.46967 13.5303C6.17678 13.2374 6.17678 12.7626 6.46967 12.4697L8.93934 10L6.46967 7.53033C6.17678 7.23744 6.17678 6.76256 6.46967 6.46967Z"
        fill="currentColor"
        stroke="none"
      />
    ),
  },
};

function toKebab(dotPath: string): string {
  return dotPath.replace(/[._]/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, color = 'icon.primary', className }, ref) => {
    const icon = icons[name];

    const classNames = ['affirm-icon', className].filter(Boolean).join(' ');

    const style = {
      '--affirm-icon-color': `var(--affirm-color-${toKebab(color)})`,
    } as React.CSSProperties;

    return (
      <svg
        ref={ref}
        className={classNames}
        style={style}
        viewBox={icon.viewBox}
        fill="none"
        stroke="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {icon.path}
      </svg>
    );
  },
);

Icon.displayName = 'Icon';
