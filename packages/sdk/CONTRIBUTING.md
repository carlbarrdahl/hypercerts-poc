# Contributing to sdk-react

Thank you for your interest in contributing to our project! This guide will help you get started with the development process.

## Development Setup

### Prerequisites

- Bun installed on your system

### Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/username/repo-name.git`
3. Navigate to the project directory: `cd repo-name`
4. Install dependencies: `bun install`
5. Start development: `bun run dev`

### 🚀 Full Development Mode (Recommended)

For the best development experience with instant feedback:

1. **Terminal 1**: Run `bun run dev` - This watches your source files and rebuilds the library instantly on any change
2. **Terminal 2**: Run `bun run dev:test` - This starts a Next.js preview app at http://localhost:3000

This setup provides **instant rebuild and instant reflection** in the preview app. When you save any component file, you'll see the changes immediately in your browser without any waiting. It's a beautiful development experience! ✨

## Development Workflow

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Start the full development mode (see above) for instant feedback
3. Make your changes and test them live in the preview app
4. Fix linting and formatting: `bun run lint:fix`
5. Build the project: `bun run build`
6. Commit your changes using the conventions below
7. Push your branch to your fork
8. Open a pull request

## Commit Message Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear and structured commit messages:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code changes that neither fix bugs nor add features
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks, dependencies, etc.

## Pull Request Guidelines

1. Update documentation if needed
2. Ensure all tests pass
3. Address any feedback from code reviews
4. Once approved, your PR will be merged

## Code of Conduct

Please be respectful and constructive in all interactions within our community.

## Questions?

If you have any questions, please [open an issue](https://github.com/username/repo-name/issues/new) for discussion.

Thank you for contributing to sdk-react!
