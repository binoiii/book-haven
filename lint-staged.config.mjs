const config = {
  "**/*.{ts,tsx}": (filenames) => [
    `prettier --write ${filenames.join(" ")}`,
    `eslint --fix ${filenames.join(" ")}`,
    "tsc --noEmit",
  ],
};

export default config;
