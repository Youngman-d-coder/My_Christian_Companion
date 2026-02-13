# Contributing to My Christian Companion

Thank you for your interest in contributing to My Christian Companion! This document provides guidelines and instructions for contributing.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Security](#security)

---

## Code of Conduct

This project welcomes contributors from all Christian denominations and backgrounds. We ask that all interactions be:
- Respectful and kind
- Focused on the project
- Constructive and helpful
- In line with Christian values of love and service

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Git
- Code editor (VS Code recommended)

### Setup Development Environment

1. **Fork and clone the repository:**
```bash
git clone https://github.com/YOUR_USERNAME/My_Christian_Companion.git
cd My_Christian_Companion
```

2. **Install dependencies:**
```bash
# Root (for Prettier)
npm install

# Server
cd server
npm install

# Client
cd ../client
npm install
```

3. **Set up environment variables:**
```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your values

# Client (if needed)
cp client/.env.example client/.env
```

4. **Start development servers:**
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

---

## Development Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `test/description` - Test additions/updates
- `refactor/description` - Code refactoring

### Commit Messages
Follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(prayers): add Lutheran prayers section
fix(auth): resolve token expiration issue
docs(api): update authentication endpoint docs
test(user): add bookmark validation tests
```

---

## Code Standards

### Code Style
We use Prettier for consistent formatting:

```bash
# Format all code
npm run format

# Check formatting
npm run format:check
```

### Linting

**Server:**
```bash
cd server
# No linter currently - follows Node.js best practices
```

**Client:**
```bash
cd client
npm run lint
```

### TypeScript (Client)
- Use TypeScript for new client code
- Define interfaces for all data structures
- Avoid `any` type unless absolutely necessary
- Document complex types with comments

### JavaScript (Server)
- Use ES6+ features where appropriate
- Use async/await for asynchronous code
- Add JSDoc comments for functions
- Keep functions small and focused

### Code Organization
```
server/src/
├── models/         # Mongoose models
├── routes/         # API route handlers
├── middleware/     # Express middleware
├── utils/          # Utility functions
└── __tests__/      # Jest test files

client/src/
├── components/     # React components
├── pages/          # Page components
├── services/       # API service calls
├── store/          # Zustand state stores
├── types/          # TypeScript types
└── utils/          # Utility functions
```

---

## Testing

### Server Tests (Jest)

**Run all tests:**
```bash
cd server
npm test
```

**Run specific test:**
```bash
npm test -- auth.test.js
```

**Watch mode:**
```bash
npm run test:watch
```

**Coverage:**
```bash
npm test -- --coverage
```

### Client Tests (Vitest)

**Run tests:**
```bash
cd client
npm test
```

**UI mode:**
```bash
npm run test:ui
```

**Coverage:**
```bash
npm run test:coverage
```

### Writing Tests

**Server (Jest):**
```javascript
describe('Feature Name', () => {
  it('should do something specific', async () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = await functionToTest(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

**Client (Vitest + Testing Library):**
```typescript
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Test Coverage Requirements
- Aim for 70%+ coverage on new code
- All new API routes must have tests
- Critical paths require thorough testing
- Security-related code needs comprehensive tests

---

## Pull Request Process

### Before Submitting

1. **Update from main:**
```bash
git checkout main
git pull origin main
git checkout your-branch
git rebase main
```

2. **Run tests:**
```bash
cd server && npm test
cd ../client && npm run lint
```

3. **Format code:**
```bash
npm run format
```

4. **Build client:**
```bash
cd client && npm run build
```

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added/updated for changes
- [ ] All tests passing
- [ ] Documentation updated
- [ ] No new warnings/errors
- [ ] Commit messages follow convention
- [ ] Branch is up-to-date with main
- [ ] Self-reviewed code changes

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Test addition

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #issue_number
```

### Review Process

1. Automated checks must pass (CI/CD)
2. At least one maintainer approval required
3. All review comments must be addressed
4. No merge conflicts with main branch

---

## Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead:
1. Email security concerns privately
2. Include detailed description
3. Provide steps to reproduce
4. Suggest a fix if possible

### Security Best Practices

When contributing:
- Never commit sensitive data (.env files, keys, passwords)
- Validate all user inputs
- Use parameterized queries (Mongoose handles this)
- Follow OWASP top 10 guidelines
- Use secure dependencies (check npm audit)
- Implement proper authentication checks
- Sanitize output to prevent XSS

### Dependency Security

```bash
# Check for vulnerabilities
npm audit

# Fix automatically (if possible)
npm audit fix

# Update dependencies
npm update
```

---

## Feature Requests

For feature requests:
1. Check existing issues first
2. Open a new issue with "Feature Request" label
3. Describe the feature and use case
4. Explain how it benefits the community
5. Discuss technical approach (optional)

---

## Questions?

- Open a discussion on GitHub
- Check existing documentation
- Review closed issues for similar questions
- Be patient and respectful

---

## Recognition

Contributors will be:
- Listed in project README
- Mentioned in release notes
- Part of the Christian developer community building tools for faith

---

## License

By contributing, you agree that your contributions will be licensed under the project's ISC License.

---

**Thank you for helping make My Christian Companion better!** ✝️

May your code be bug-free and your commits blessed! 🙏
