import * as React from "react";
import { Label } from "@fluentui/react";
import { Calendar } from "./Components/Calendar";

export class Landing extends React.Component {
  public render(): React.ReactNode {
    return (
      <>
        <Label>Current Bookings</Label>
        <Calendar />
      </>
    );
  }
}
