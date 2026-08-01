# Contributing to SkillFlow Protocol 🌊

Thank you for your interest in contributing to **SkillFlow Protocol**! We welcome contributions from developers, smart contract engineers, UI designers, technical writers, and community maintainers.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How to Participate](#-how-to-participate)
- [Development Setup](#-development-setup)
- [Coding Standards](#-coding-standards)
- [Pull Request Process](#-pull-request-process)
- [Community & Support](#-community--support)

---

## 📜 Code of Conduct

All contributors are expected to adhere to our [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). Please read it to ensure a respectful, inclusive environment for everyone.

---

## 🤝 How to Participate

### Finding Issues

1. **Browse Open Issues**: Look for open issues on GitHub tagged with:
   - `help-wanted`: Tasks open for community contributions.
   - `good-first-issue`: Beginner-friendly tasks for new contributors.
   - `enhancement`: Feature implementation or protocol improvements.
2. **Request Assignment**: Comment on the issue stating your intention to work on it. Maintainers will assign the issue to you to prevent duplicate work.
3. **Submit PR**: Submit your Pull Request linking the issue.

---

## 🛠️ Development Setup

### 1. Prerequisites

Ensure you have the following installed locally:

- **Git** `2.30+`
- **Rust Toolchain**: `rustup` with `wasm32-unknown-unknown` target.
  ```bash
  rustup update stable
  rustup target add wasm32-unknown-unknown
  ```
- **Soroban CLI**:
  ```bash
  cargo install --locked soroban-cli
  ```
- **Node.js & npm**: Node.js `v18.0.0+`
- **Freighter Browser Extension**: Configured for Stellar Futurenet or Testnet.

### 2. Local Setup & Building

```bash
# Clone the repository
git clone https://github.com/skill-flow/skill-flow-protocol.git
cd skill-flow

# Install Node dependencies
npm install

# Build Soroban smart contracts
cargo build --target wasm32-unknown-unknown --release

# Run Rust contract test suite
cargo test

# Run live frontend dev server
npm run dev
```

---

## 📐 Coding Standards

### Rust & Soroban Contracts (`/contracts`)

- **Formatting**: Always format your code with `cargo fmt` before submitting.
- **Clippy**: Code must pass `cargo clippy --all-targets` without warnings.
- **Storage Keys**: Strictly use enum-based storage keys (`DataKey`) for Soroban storage isolation.
- **Error Handling**: Use explicit `ContractError` enums for custom contract error codes.
- **Testing**: Include unit tests in `test.rs` covering success, invalid parameters, unauthorized calls, and boundary conditions.

### React Frontend & Styling (`/src`)

- **Component Architecture**: Keep components modular, accessible, and clean.
- **Styling**: Standardize styles in `style.css` / `index.css`. Avoid inline styles or uncurated magic values.
- **State Management**: Use clear local state hooks and custom event listeners for wallet events.
- **Types & Props**: Ensure props are validated and handle missing data gracefully.

---

## 📤 Pull Request Process

1. **Branch Naming**: Use descriptive branch names:
   - `feature/short-description`
   - `fix/issue-number-description`
   - `docs/update-readme`
2. **Keep Commits Clean**: Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat(vault): add milestone boost calculation`
   - `fix(verifier): resolve signature length validation`
   - `docs(readme): update contributing guide`
3. **Run Tests**: Ensure all automated checks pass locally before opening a PR:
   ```bash
   cargo test
   npm run build
   ```
4. **Fill PR Template**: Fill out all sections of the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).
5. **Review**: At least one core maintainer approval is required for merging into `main`.

---

## 💬 Community & Support

- **GitHub Discussions**: For general questions, feature proposals, and feedback.
- **Security**: To report vulnerabilities, follow guidelines in [`SECURITY.md`](SECURITY.md).

Thank you for building the future of open-source human capital markets on Stellar Soroban! 🚀
