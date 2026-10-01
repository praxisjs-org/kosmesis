import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { MonthPicker, MonthPickerPanel, MonthRangePicker, MonthPickerState, type MonthRange, type MonthValue } from "@/ui/praxisjs-css/month-picker";
import { Popover } from "@/ui/praxisjs-css/popover";

const meta: Meta = {
  title: "PraxisCSS/MonthPicker",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational — no Morphos equivalent. `MonthPickerState` owns the visible year and " +
          "the selection (`{ year, month }`, month 0–11) and is a pure state container; " +
          "`MonthPickerPanel` renders the 12-month grid, and `MonthPicker` wraps it in a `Popover` whose " +
          "trigger shows the chosen month in place of the placeholder.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class PanelDemo extends StatefulComponent {
  @State() state = new MonthPickerState({ defaultYear: 2026 });

  onBeforeMount() {
    this.state.onBeforeMount();
  }

  render() {
    return (
      <div>
        <MonthPickerPanel state={this.state} />
        <p style="margin:8px 0 0;font-size:.8rem;color:var(--muted-foreground)">
          Selected: {() => this.state.formattedValue ?? "none"}
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
  @State() month = new MonthPickerState({ onSelect: () => { this.popover.closePopover(); } });

  onBeforeMount() {
    this.popover.onBeforeMount();
    this.month.onBeforeMount();
  }

  render() {
    return <MonthPicker popover={this.popover} state={this.month} />;
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

@Component()
class DisabledPastDemo extends StatefulComponent {
  @State() popover = new Popover();
  @State() month = new MonthPickerState({
    selected: () => this.value,
    onSelect: (value: MonthValue) => { this.value = value; this.popover.closePopover(); },
    disabled: ({ year, month }: MonthValue) => year < 2026 || (year === 2026 && month < 6),
  });
  @State() value: MonthValue | undefined = { year: 2026, month: 8 };

  onBeforeMount() {
    this.popover.onBeforeMount();
    this.month.onBeforeMount();
  }

  render() {
    return <MonthPicker popover={this.popover} state={this.month} />;
  }
}

export const DisabledPast: Story = {
  name: "Disabled past months",
  render: () => <DisabledPastDemo />,
};

@Component()
class RangeDemo extends StatefulComponent {
  @State() popover = new Popover();
  @State() month = new MonthPickerState({
    mode: "range",
    onSelectRange: ({ from, to }: MonthRange) => {
      if (from && to) this.popover.closePopover();
    },
  });

  onBeforeMount() {
    this.popover.onBeforeMount();
    this.month.onBeforeMount();
  }

  render() {
    return <MonthRangePicker popover={this.popover} state={this.month} />;
  }
}

export const Range: Story = {
  name: "Range",
  render: () => <RangeDemo />,
};

@Component()
class WithoutYearDemo extends StatefulComponent {
  @State() popover = new Popover();
  @State() month = new MonthPickerState({ showYear: false, onSelect: () => { this.popover.closePopover(); } });

  onBeforeMount() {
    this.popover.onBeforeMount();
    this.month.onBeforeMount();
  }

  render() {
    return <MonthPicker popover={this.popover} state={this.month} />;
  }
}

export const WithoutYear: Story = {
  name: "Without year",
  render: () => <WithoutYearDemo />,
};
