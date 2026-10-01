import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Popover } from "@/ui/tailwind/popover";
import { TimePicker, TimePickerPanel, TimePickerState, TimeRangePicker } from "@/ui/tailwind/time-picker";

const meta: Meta = {
  title: "Tailwind/TimePicker",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational — no Morphos equivalent. `TimePickerState` owns the value " +
          "(`\"HH:mm\"` or `\"HH:mm:ss\"`, always 24-hour internally) and is a pure state container; " +
          "`TimePickerPanel` renders the scrollable hour/minute/second/period columns it computes, " +
          "and `TimePicker` / `TimeRangePicker` wrap the panel in a `Popover` whose trigger shows the " +
          "chosen value in place of the placeholder.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class PanelDemo extends StatefulComponent {
  @State() time = new TimePickerState({ minuteStep: 5 });

  onBeforeMount() {
    this.time.onBeforeMount();
  }

  render() {
    return (
      <div>
        <TimePickerPanel state={this.time} />
        <p style="margin:8px 0 0;font-size:.8rem;color:var(--muted-foreground)">
          Value: {() => this.time.value ?? "none"}
        </p>
      </div>
    );
  }
}

export const Panel: Story = {
  name: "Panel",
  render: () => <PanelDemo />,
};

@Component()
class DefaultDemo extends StatefulComponent {
  @State() popover = new Popover();
  @State() time = new TimePickerState({ minuteStep: 5 });

  onBeforeMount() {
    this.popover.onBeforeMount();
    this.time.onBeforeMount();
  }

  render() {
    return <TimePicker popover={this.popover} time={this.time} />;
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

@Component()
class TwelveHourDemo extends StatefulComponent {
  @State() popover = new Popover();
  @State() time = new TimePickerState({ hourCycle: 12, selected: () => this.value, onSelect: (v: string) => { this.value = v; } });
  @State() value: string | undefined = "14:30";

  onBeforeMount() {
    this.popover.onBeforeMount();
    this.time.onBeforeMount();
  }

  render() {
    return <TimePicker popover={this.popover} time={this.time} />;
  }
}

export const TwelveHour: Story = {
  name: "12-hour with initial value",
  render: () => <TwelveHourDemo />,
};

@Component()
class WithSecondsDemo extends StatefulComponent {
  @State() popover = new Popover();
  @State() time = new TimePickerState({ showSeconds: true });

  onBeforeMount() {
    this.popover.onBeforeMount();
    this.time.onBeforeMount();
  }

  render() {
    return <TimePicker popover={this.popover} time={this.time} />;
  }
}

export const WithSeconds: Story = {
  name: "With seconds",
  render: () => <WithSecondsDemo />,
};

@Component()
class RangeDemo extends StatefulComponent {
  @State() popover = new Popover();
  @State() from = new TimePickerState({ minuteStep: 15 });
  @State() to = new TimePickerState({ minuteStep: 15 });

  onBeforeMount() {
    this.popover.onBeforeMount();
    this.from.onBeforeMount();
    this.to.onBeforeMount();
  }

  render() {
    return <TimeRangePicker popover={this.popover} from={this.from} to={this.to} />;
  }
}

export const Range: Story = {
  name: "Range",
  render: () => <RangeDemo />,
};
