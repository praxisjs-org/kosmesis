import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { CalendarState } from "@/ui/praxisjs-css/calendar";
import { DatePicker } from "@/ui/praxisjs-css/date-picker";
import { Popover } from "@/ui/praxisjs-css/popover";

const meta: Meta = {
  title: "PraxisCSS/DatePicker",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A composition, not a new primitive: `Popover` (Morphos) + `Calendar` (built from " +
          "scratch). Morphos's `PopoverTrigger` always renders its own `<button>` (there's no " +
          "`asChild` merge like Radix's) — so the trigger is styled directly with `buttonVariants()` " +
          "rather than nesting a separate `Button` inside it.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() popover = new Popover();
  @State() calendar = new CalendarState({
    onSelect: () => { this.popover.closePopover(); },
  });

  onBeforeMount() {
    this.popover.onBeforeMount();
    this.calendar.onBeforeMount();
  }

  render() {
    return <DatePicker popover={this.popover} calendar={this.calendar} />;
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};
