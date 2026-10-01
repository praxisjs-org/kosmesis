import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  DateInput,
  DateRangeInput,
  DateTimeInput,
  DateTimeRangeInput,
  TimeInput,
  TimeRangeInput,
  type TemporalRange,
} from "@/ui/tailwind/date-time-input";

const meta: Meta = {
  title: "Tailwind/DateTimeInput",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Thin wrappers over the browser's native `date`, `time` and `datetime-local` inputs, " +
          "styled like `Input`. Values use the native string formats (`YYYY-MM-DD`, `HH:mm`, " +
          "`YYYY-MM-DDTHH:mm`) so they round-trip with forms and the platform's own pickers. The range " +
          "variants render a start and an end field and keep them consistent: the start's `max` " +
          "follows the end value, and the end's `min` follows the start.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Date: Story = {
  name: "Date",
  render: () => <DateInput aria-label="Date" />,
};

export const Time: Story = {
  name: "Time",
  render: () => <TimeInput aria-label="Time" />,
};

export const DateTime: Story = {
  name: "Date and time",
  render: () => <DateTimeInput aria-label="Date and time" defaultValue="2026-07-15T14:30" />,
};

@Component()
class DateRangeDemo extends StatefulComponent {
  @State() value: TemporalRange = { from: "2026-07-10", to: "2026-07-20" };

  render() {
    return (
      <div>
        <DateRangeInput value={() => this.value} onChange={(range: TemporalRange) => { this.value = range; }} />
        <p style="margin:8px 0 0;font-size:.8rem;color:var(--muted-foreground)">
          Value: {() => `${this.value.from ?? "—"} → ${this.value.to ?? "—"}`}
        </p>
      </div>
    );
  }
}

export const DateRange: Story = {
  name: "Date range",
  render: () => <DateRangeDemo />,
};

export const TimeRange: Story = {
  name: "Time range",
  render: () => <TimeRangeInput defaultValue={{ from: "09:00", to: "17:30" }} />,
};

export const DateTimeRange: Story = {
  name: "Date and time range",
  render: () => <DateTimeRangeInput defaultValue={{ from: "2026-07-10T09:00", to: "2026-07-12T18:00" }} />,
};
