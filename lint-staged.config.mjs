export default {
  "**/*.{ts,tsx}": (filenames) => [
    `eslint --fix ${filenames.join(" ")}`,
    "tsc --noEmit",
  ],
};
