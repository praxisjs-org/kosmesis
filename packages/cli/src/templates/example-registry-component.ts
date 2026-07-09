/** Source written to `src/example-button.tsx` by `kosmesis registry init`. */
export const EXAMPLE_REGISTRY_COMPONENT_SOURCE = `import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

export interface ExampleButtonProps {
  children?: Children;
}

@Component()
export class ExampleButton extends StatelessComponent<ExampleButtonProps> {
  render() {
    return <button style={{ borderRadius: "999px" }}>{this.props.children}</button>;
  }
}
`;
