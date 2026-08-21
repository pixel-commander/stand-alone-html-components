import * as React from 'react';

import { cn } from '@md/cds/react/shadcn-shared/utils';

import './styles.css';

export type ComponentNameRow = {
  id?: string;
};

export type CdsComponentNameProps = React.ComponentProps<'div'> & {
  data?: ComponentNameRow[];
};

export const CdsComponentName = ({
  data,
  className,
  ...props
}: CdsComponentNameProps) => {
  return (
    <div
      data-slot="component-name"
      className={cn('component-name', className)}
      {...props}
    >
      {data?.map((row, index) => (
        <div data-item key={index}>
          <div data-label="id">{row?.id || ''}</div>
        </div>
      ))}
    </div>
  );
};

export default CdsComponentName;
