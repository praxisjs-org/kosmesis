import type { Meta, StoryObj } from "@praxisjs/storybook";

import { PromptSuggestion, PromptSuggestions } from "@/ui/tailwind/prompt-suggestion";

const meta: Meta = {
  title: "Tailwind/Prompt Suggestion",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A row of clickable suggestion chips for a PromptInput. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="width:360px;font-family:sans-serif">
      <PromptSuggestions>
        <PromptSuggestion onClick={() => { console.log("Summarize this"); }}>Summarize this</PromptSuggestion>
        <PromptSuggestion onClick={() => { console.log("Explain like I'm 5"); }}>Explain like I'm 5</PromptSuggestion>
        <PromptSuggestion onClick={() => { console.log("Find counterarguments"); }}>Find counterarguments</PromptSuggestion>
      </PromptSuggestions>
    </div>
  ),
};
