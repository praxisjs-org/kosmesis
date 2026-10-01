import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { CalendarState } from "@/ui/tailwind/calendar";
import { DateTimePicker, DateTimeRangePicker } from "@/ui/tailwind/date-time-picker";
import { Popover } from "@/ui/tailwind/popover";
import { TimePickerState } from "@/ui/tailwind/time-picker";

const meta: Meta = {
  title: "Tailwind/DateTimePicker",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A composition: `Popover` + `Calendar` + `TimePickerPanel`. The trigger shows the chosen " +
          "date and time in place of the placeholder. The range variant uses a `Calendar` in " +
          "`mode: \"range\"` plus one `TimePickerState` per end.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() popover = new Popover();
  @State() calendar = new CalendarState();
  @State() time = new TimePickerState({ minuteStep: 5 });

  onBeforeMount() {
    this.popover.onBeforeMount();
    this.calendar.onBeforeMount();
    this.time.onBeforeMount();
  }

  render() {
    return <DateTimePicker popover={this.popover} calendar={this.calendar} time={this.time} />;
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

@Component()
class RangeDemo extends StatefulComponent {
  @State() popover = new Popover();
  @State() calendar = new CalendarState({ mode: "range" });
  @State() startTime = new TimePickerState({ minuteStep: 15 });
  @State() endTime = new TimePickerState({ minuteStep: 15 });

  onBeforeMount() {
    this.popover.onBeforeMount();
    this.calendar.onBeforeMount();
    this.startTime.onBeforeMount();
    this.endTime.onBeforeMount();
  }

  render() {
    return (
      <DateTimeRangePicker
        popover={this.popover}
        calendar={this.calendar}
        startTime={this.startTime}
        endTime={this.endTime}
      />
    );
  }
}

export const Range: Story = {
  name: "Range",
  render: () => <RangeDemo />,
};
