import * as React from "react";
import {
  Label,
  Stack,
  IStackTokens,
  IDropdownOption,
  IconButton,
  Text,
  ITextStyles,
} from "@fluentui/react";

export interface CalendarProps {
  name?: string;
}

interface ICalendarState {
  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;
  selectedHour: string;
  selectedSlots: Array<string>;
}

const months: IDropdownOption[] = [
  { key: 0, text: "January" },
  { key: 1, text: "February" },
  { key: 2, text: "March" },
  { key: 3, text: "April" },
  { key: 4, text: "May" },
  { key: 5, text: "June" },
  { key: 6, text: "July" },
  { key: 7, text: "August" },
  { key: 8, text: "September" },
  { key: 9, text: "October" },
  { key: 10, text: "November" },
  { key: 11, text: "December" },
];

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const stackTokens: IStackTokens = { childrenGap: 10 };

export class Calendar extends React.Component<CalendarProps, ICalendarState> {
  constructor(props: CalendarProps) {
    super(props);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    this.state = {
      selectedYear: currentYear,
      selectedMonth: currentMonth,
      selectedDay: 1,
      selectedHour: "09AM - 10AM",
      selectedSlots: [],
    };
  }

  private handleYearChange(increment: boolean) {
    this.setState((prevState) => ({
      selectedYear: prevState.selectedYear + (increment ? 1 : -1),
    }));
  }

  private handleMonthChange(increment: boolean) {
    this.setState((prevState) => {
      const newMonth = increment
        ? prevState.selectedMonth + 1
        : prevState.selectedMonth - 1;
      let newYear = prevState.selectedYear;

      if (newMonth > 11) {
        newYear++;
        return { selectedMonth: 0, selectedYear: newYear };
      } else if (newMonth < 0) {
        newYear--;
        return { selectedMonth: 11, selectedYear: newYear };
      }

      return { selectedMonth: newMonth, selectedYear: newYear };
    });
  }

  private getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  private getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
  }

  private renderDayFromNextMonth(day: number) {
    return (
      <div
        key={`next-month-day-${day}`}
        style={{
          flex: "1 0 14.28%",
          height: "auto",
          border: "1px solid black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
          fontSize: "27px",
        }}
      >
        {day}
      </div>
    );
  }

  private renderDayFromPreviousMonth(day: number) {
    return (
      <div
        key={`prev-month-day-${day}`}
        style={{
          flex: "1 0 14.28%",
          height: "auto",
          border: "1px solid black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
          fontSize: "27px",
        }}
      >
        {day}
      </div>
    );
  }

  private renderWeeks() {
    const daysInMonth = this.getDaysInMonth(
      this.state.selectedYear,
      this.state.selectedMonth
    );
    const firstDayOfMonth = this.getFirstDayOfMonth(
      this.state.selectedYear,
      this.state.selectedMonth
    );
    const daysInPreviousMonth = this.getDaysInMonth(
      this.state.selectedYear,
      this.state.selectedMonth - 1
    );

    let weeks = [];
    let days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      let prevMonthDay = daysInPreviousMonth - firstDayOfMonth + i + 1;
      days.push(this.renderDayFromPreviousMonth(prevMonthDay));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(this.renderDay(day));

      if ((day + firstDayOfMonth) % 7 === 0 || day === daysInMonth) {
        if (day === daysInMonth) {
          let remainingDays = 7 - days.length;
          for (let i = 1; i <= remainingDays; i++) {
            days.push(this.renderDayFromNextMonth(i));
          }
        }
        weeks.push(
          <div key={`week-${weeks.length}`} style={{ display: "flex" }}>
            {days}
          </div>
        );
        days = [];
      }
    }

    return weeks;
  }

  private handleSlotClick(slot: string) {
    if (this.unavailableSlots.includes(slot)) {
      return;
    }
  
    this.setState(prevState => {
      const { selectedSlots } = prevState;
      const slotIndex = selectedSlots.indexOf(slot);
      if (slotIndex > -1) {
        return { selectedSlots: selectedSlots.filter(s => s !== slot) };
      } else {
        return { selectedSlots: [...selectedSlots, slot] };
      }
    });
  }
  

  private renderDay(day: number) {
    const hours = [
      "09AM - 10AM",
      "10AM - 11AM",
      "11AM - 12PM",
      "12PM - 1PM",
      "1PM - 2PM",
      "2PM - 3PM",
      "3PM - 4PM",
      "4PM - 5PM",
    ];

    return (
      <div
        key={day}
        style={{
          flex: "1 0 14.28%",
          height: "auto",
          border: "1px solid black",
          position: "relative",
          textAlign: "left",
        }}
      >
        <div
          style={{
            textAlign: "right",
            paddingRight: "8px",
            fontSize: "27px",
            paddingBottom: "8px",
          }}
        >
          {day}
        </div>
        {hours.map(hour => (
        <div
          key={hour}
          onClick={() => this.handleSlotClick(`${day}-${hour}`)}
          style={{ flex: 1, textAlign: "left",paddingLeft:"8px",paddingBottom:"4px", textDecoration: this.unavailableSlots.includes(`${day}-${hour}`) ? 'line-through' : 'none' }}
        >
          {hour} 
          {this.state.selectedSlots.includes(`${day}-${hour}`) && (
            <span style={{ color: "green", marginLeft: "10px" }}>✔</span>
          )}
        </div>
      ))}
      </div>
    );
  }

  private unavailableSlots: Array<string> = [
    "1-09AM - 10AM", 
    "3-11AM - 12PM",
    "5-2PM - 3PM"
  ];
  

  public render(): React.ReactNode {
    const monthName = months[this.state.selectedMonth].text;
    const year = this.state.selectedYear;
    const monthYearStyles: ITextStyles = {
      root: {
        fontWeight: "bold",
        fontSize: "24px",
      },
    };

    return (
      <div>
        <Stack
          horizontal
          tokens={stackTokens}
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Stack horizontal tokens={stackTokens}>
            <IconButton
              iconProps={{ iconName: "DoubleChevronLeft" }}
              onClick={() => this.handleYearChange(false)}
            />
            <IconButton
              iconProps={{ iconName: "ChevronLeft" }}
              onClick={() => this.handleMonthChange(false)}
            />
          </Stack>

          <Text styles={monthYearStyles}>{`${monthName} ${year}`}</Text>

          <Stack horizontal tokens={stackTokens}>
            <IconButton
              iconProps={{ iconName: "ChevronRight" }}
              onClick={() => this.handleMonthChange(true)}
            />
            <IconButton
              iconProps={{ iconName: "DoubleChevronRight" }}
              onClick={() => this.handleYearChange(true)}
            />
          </Stack>
        </Stack>

        <div
          style={{
            display: "flex",
            marginTop: "15px",
            marginBottom: "15px",
          }}
        >
          {daysOfWeek.map((day) => (
            <div
              key={day}
              style={{
                flex: "1 0 14.28%",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {this.renderWeeks()}
      </div>
    );
  }
}
