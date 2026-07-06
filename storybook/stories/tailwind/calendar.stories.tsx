import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Calendar, CalendarState } from "@/ui/tailwind/calendar";

const meta: Meta = {
  title: "Tailwind/Calendar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational + date math — no Morphos equivalent (Radix has no calendar " +
          "primitive either). `CalendarState` owns the visible month and selection and is a pure " +
          "state container (`render()` returns `null`); `Calendar` renders the grid it computes. " +
          "Both instantiated directly, the same pattern as every other compound component here.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() state = new CalendarState({ defaultMonth: new Date(2026, 6, 1) });

  onBeforeMount() {
    this.state.onBeforeMount();
  }

  render() {
    return <Calendar state={this.state} />;
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

@Component()
class WithSelectionDemo extends StatefulComponent {
  // `@Prop()` locks onto whatever raw value it's constructed with: a plain `Date` here would
  // freeze `selected` forever, since only a *function* raw prop is re-read reactively (see
  // `@praxisjs/decorators`'s `Prop()` — a non-function raw value always wins over `_selected`, so
  // clicking another day would never change anything). Binding it to this component's own
  // `selectedDate` field via a getter, plus wiring `onSelect` back into it, makes this a real
  // controlled loop instead of a permanently-frozen initial value.
  @State() selectedDate: Date | undefined = new Date(2026, 6, 15);

  @State() state = new CalendarState({
    defaultMonth: new Date(2026, 6, 1),
    selected: () => this.selectedDate,
    onSelect: (date: Date) => { this.selectedDate = date; },
  });

  onBeforeMount() {
    this.state.onBeforeMount();
  }

  render() {
    return (
      <div>
        <Calendar state={this.state} />
        <p style="margin:8px 0 0;font-size:.8rem;color:var(--muted-foreground)">
          Selected: {() => this.selectedDate?.toLocaleDateString() ?? "none"}
        </p>
      </div>
    );
  }
}

export const WithSelection: Story = {
  name: "With initial selection",
  render: () => <WithSelectionDemo />,
};

@Component()
class DisabledWeekendsDemo extends StatefulComponent {
  @State() state = new CalendarState({
    defaultMonth: new Date(2026, 6, 1),
    disabled: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
  });

  onBeforeMount() {
    this.state.onBeforeMount();
  }

  render() {
    return <Calendar state={this.state} />;
  }
}

export const DisabledWeekends: Story = {
  name: "Disabled weekends",
  render: () => <DisabledWeekendsDemo />,
};
