import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Avatar, AvatarFallback, AvatarImage } from "@/ui/praxisjs-css/avatar";

const meta: Meta = {
  title: "PraxisCSS/Avatar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`Avatar` extends (not wraps) `@morphos/feedback`'s `Avatar` directly, so `new Avatar()` " +
          "still yields a real instance with `.setImageStatus()`/`._imageStatus` — what " +
          "`AvatarImage`/`AvatarFallback` read via their `avatar` prop. The fallback uses the " +
          "native `hidden` attribute, toggled automatically from image load state.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class WithImageDemo extends StatefulComponent {
  @State() a1 = new Avatar();
  @State() a2 = new Avatar();

  onBeforeMount() {
    this.a1.onBeforeMount();
    this.a2.onBeforeMount();
  }

  render() {
    return (
      <div style="display:flex;gap:16px">
        <Avatar>
          <AvatarImage avatar={this.a1} src="https://i.pravatar.cc/96?img=3" alt="User A" />
          <AvatarFallback avatar={this.a1}>UA</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage avatar={this.a2} src="https://i.pravatar.cc/96?img=47" alt="User B" />
          <AvatarFallback avatar={this.a2}>UB</AvatarFallback>
        </Avatar>
      </div>
    );
  }
}

export const WithImage: Story = {
  name: "With image",
  render: () => <WithImageDemo />,
};

@Component()
class WithFallbackDemo extends StatefulComponent {
  @State() a1 = new Avatar();

  onBeforeMount() {
    this.a1.onBeforeMount();
  }

  render() {
    return (
      <Avatar>
        <AvatarImage avatar={this.a1} src="https://broken.invalid/img.jpg" alt="User C" />
        <AvatarFallback avatar={this.a1}>UC</AvatarFallback>
      </Avatar>
    );
  }
}

export const WithFallback: Story = {
  name: "With fallback (broken URL)",
  render: () => <WithFallbackDemo />,
};
