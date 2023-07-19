import type { Meta, StoryObj } from "@storybook/react";

import CustomDesignTokenDocBlock from "../utils/CustomDesignTokenDocBlock";

import typograpyTokens from "../tokens/typography.json";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: "Utils/CustomDesignTokenDocBlock",
  component: CustomDesignTokenDocBlock,
  tags: ["autodocs"],
  argTypes: {
    blockType: { control: "text" },
    previewType: { control: "text" },
  },
} satisfies Meta<typeof CustomDesignTokenDocBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const FontStyleDesignTokenDocBlock: Story = {
  args: {
    blockType: "table",
    previewType: "text",
    presenter: "font-style",
    tokens: [
      {
        name: "--font-style-italic",
        value: typograpyTokens.font.style.italic.value,
      },
    ],
  },
};
