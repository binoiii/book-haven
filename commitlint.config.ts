const config = {
  extends: ["@commitlint/config-conventional"],
  prompt: {
    useEmoji: true,
    emojiAlign: "center",
    types: [
      { value: "feat",     name: "feat:      ✨ A new feature",                emoji: "✨" },
      { value: "fix",      name: "fix:       🐛 A bug fix",                    emoji: "🐛" },
      { value: "docs",     name: "docs:      📝 Documentation only changes",   emoji: "📝" },
      { value: "style",    name: "style:     💄 Formatting, missing semicolons", emoji: "💄" },
      { value: "refactor", name: "refactor:  ♻️  Code refactor",                emoji: "♻️" },
      { value: "perf",     name: "perf:      ⚡️ Performance improvements",     emoji: "⚡️" },
      { value: "test",     name: "test:      ✅ Adding or updating tests",      emoji: "✅" },
      { value: "build",    name: "build:     📦 Build system or dependencies",  emoji: "📦" },
      { value: "ci",       name: "ci:        🎡 CI/CD configuration changes",   emoji: "🎡" },
      { value: "chore",    name: "chore:     🔨 Other changes (no src/test)",   emoji: "🔨" },
      { value: "revert",   name: "revert:    ⏪ Revert a previous commit",      emoji: "⏪" },
    ],
  },
};

export default config;
