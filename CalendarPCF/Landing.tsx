import * as React from 'react';
import { Label } from '@fluentui/react';
import { Calendar } from './Components/Calendar'
export interface LandingProps {
  name?: string;
}

export class Landing extends React.Component<LandingProps> {
  public render(): React.ReactNode {
    return (
    <>
      <Label>
      Current  Bookings
      </Label>
<Calendar/>
      </>
    )
  }
}
