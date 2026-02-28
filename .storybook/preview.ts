import type { Preview } from "@storybook/react";

import "../app/globals.css";

const preview = {
  parameters: {
    layout: "padded",
    actions: { argTypesRegex: "^on.*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
} satisfies Preview;

export default preview;

