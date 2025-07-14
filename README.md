# 🕵️‍♂️ React Blindspot

**React Blindspot** is a CLI tool that helps developers identify **untested React components, hooks, and logic**, then suggests missing test cases using optional **AI assistance**.

> Detect what’s tested. Highlight what’s missing. Even generate test ideas.

---

## 🚀 Features

- 🔍 Parse React source files and analyze usage (hooks, components, exports)
- 🧪 Automatically detect corresponding test files (Jest/Vitest supported)
- 🧠 Optional OpenAI integration to analyze and suggest missing tests
- 💾 Caches parsed results to improve performance
- 🧼 Supports custom test directory structure (e.g., `__tests__`, colocated, etc.)
- 🛠️ Works with TypeScript and ES modules

---

## 📦 Installation

```bash
npm install -g react-blindspot
```

Or clone locally for development:

```bash
git clone https://github.com/yourusername/react-blindspot.git
cd react-blindspot
npm install
npm run build
```

---

## ⚙️ Configuration

React Blindspot looks for a config file in your project root:

```ts
// react-blindspot.config.ts
export default {
  ai: {
    enabled: true,
    apiKey: process.env.OPENAI_API_KEY,
  },
  testEngine: "vitest", // or 'jest'
};
```

If no config is found, it will try to infer from `vitest.config.ts` or `jest.config.js`.

---

## 📖 Usage

### Analyze your project:

```bash
reactblindspot analyze
```

### Invalidate cache:

```bash
reactblindspot analyze --reset-cache
```

### Prompt to generate missing tests (if enabled):

```bash
reactblindspot analyze
```

> You will be prompted interactively to select files for AI-powered suggestions.

---

## 🧠 AI Integration

To enable AI suggestions, set your `OPENAI_API_KEY` and turn on the config flag:

```ts
ai: {
  enabled: true,
  apiKey: process.env.OPENAI_API_KEY,
}
```

The tool will:

- Send relevant source and test context to the OpenAI API
- Suggest missing test cases in CLI
- (Optional) Let you generate test stubs in the future

> Only test-related files are analyzed for AI to reduce token cost.

---

## 🗂 Example Output

```bash
✅ src/components/Button.tsx is tested by:
   └── tests/Button.test.tsx

❌ src/components/Header.tsx is NOT tested

🤖 AI Suggestion:
- Consider testing "renders title"
- Check visibility on different screen sizes
```

---

## 🛠 Roadmap

- [x] CLI mode with file parsing & cache
- [x] Basic Jest/Vitest detection
- [x] Interactive prompt for missing tests
- [x] AI-assisted test suggestions
- [ ] Test stub generator
- [ ] VS Code extension
- [ ] GitHub action integration

---

## 🤝 Contributing

Contributions welcome!

- Fork the repo
- Create a feature branch
- Run `npm run dev` to test CLI locally
- Open a PR

---

## 📄 License

MIT © 2025 Tomas Lachmann
