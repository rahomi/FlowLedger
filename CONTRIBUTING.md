# Contributing to FlowLedger

Thank you for your interest in contributing to FlowLedger! We welcome contributions from everyone.

## 📋 Table of Contents
- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
- [Development Setup](#-development-setup)
- [Coding Guidelines](#-coding-guidelines)
- [Commit Message Guidelines](#-commit-message-guidelines)
- [Pull Request Process](#-pull-request-process)

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand the expected behavior.

## 🙋 How Can I Contribute?

### Reporting Bugs
- Check if the bug has already been reported
- Provide clear steps to reproduce
- Include screenshots if applicable
- Specify your environment (OS, Node.js version, etc.)

### Suggesting Enhancements
- Check if the enhancement has already been suggested
- Provide a clear description of the proposed feature
- Explain why this enhancement would be useful
- Include any relevant mockups or examples

### Code Contributions
- Fork the repository
- Create a feature branch: `git checkout -b feature/your-feature-name`
- Implement your changes following our coding guidelines
- Write tests for your changes
- Ensure all existing tests pass
- Submit a pull request

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 14+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/rahomi/FlowLedger.git
cd FlowLedger

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the development server
npm run start:api
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

### Linting and Formatting

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 💻 Coding Guidelines

### TypeScript
- Use strict typing wherever possible
- Avoid `any` type - use proper interfaces or types
- Use `unknown` instead of `any` when type is truly unknown
- Prefer `interface` over `type` for object shapes

### NestJS
- Follow NestJS official style guide
- Use proper decorators (@Injectable(), @Controller(), etc.)
- Use dependency injection for services
- Follow the repository pattern for data access

### Database
- Use TypeORM decorators properly
- Always use soft deletion (@DeleteDateColumn())
- Use proper data types (bigint for monetary values)
- Add indexes for frequently queried columns

### API Design
- Use RESTful conventions
- Version all API endpoints (/api/v1/...)
- Use proper HTTP methods (GET, POST, PATCH, DELETE)
- Return consistent response formats
- Include proper error handling

### Code Style
- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces
- Use UPPER_CASE for constants
- Use meaningful, descriptive names
- Keep functions small and focused
- Add JSDoc comments for public APIs

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format
```
<type>(<scope>): <description>
[optional body]
[optional footer]
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring (no functional changes)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system or dependency changes
- `ci`: CI configuration changes
- `chore`: Other changes that don't modify src or test files

### Examples
```
feat(auth): add JWT authentication system
fix(transactions): correct amount calculation bug
docs(readme): update installation instructions
refactor(api): improve error handling middleware
test(businesses): add unit tests for repository
```

## 🔄 Pull Request Process

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies** and ensure the project builds successfully
3. **Implement your changes** following our coding guidelines
4. **Write tests** for your changes and ensure all tests pass
5. **Update documentation** if your changes affect the API or behavior
6. **Run linting and formatting** to ensure code quality
7. **Submit your pull request** with a clear title and description
8. **Wait for review** and address any feedback

### Pull Request Title
Use the same format as commit messages following Conventional Commits.

### Pull Request Description
Include:
- A clear description of the changes
- The motivation behind the changes
- Any breaking changes
- Screenshots if applicable
- Related issues (e.g., "Fixes #123")

## 🎉 Thank You!

Your contributions help make FlowLedger better for everyone. We appreciate your time and effort!

If you have any questions about contributing, please open an issue and ask.

Happy coding! 🚀