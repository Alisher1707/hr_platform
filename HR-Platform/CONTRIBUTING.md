# 🤝 Contributing to HR Platform

Thank you for considering contributing to HR Platform! This document outlines the process and guidelines.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

---

## 📜 Code of Conduct

Be respectful, inclusive, and professional in all interactions.

---

## 🚀 Getting Started

### 1. Fork the Repository

Click the "Fork" button on GitHub.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/HR-Platform.git
cd HR-Platform
```

### 3. Add Upstream Remote

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/HR-Platform.git
```

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Create Environment Files

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

### 6. Setup Database

```bash
docker-compose up -d postgres
cd apps/backend
pnpm migrate
pnpm seed
```

---

## 💻 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Tests

### 2. Make Changes

Follow the coding standards below.

### 3. Test Your Changes

```bash
# Backend tests (if available)
cd apps/backend
pnpm test

# Frontend tests (if available)
cd apps/frontend
pnpm test
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

Go to GitHub and create a Pull Request.

---

## 📝 Coding Standards

### Backend (Node.js)

- ✅ Use **ES Modules** (import/export)
- ✅ Use **async/await** instead of callbacks
- ✅ Handle errors properly with try/catch
- ✅ Use **JSDoc** comments for functions
- ✅ Validate inputs with **Joi**
- ✅ Use **camelCase** for variables and functions
- ✅ Use **PascalCase** for classes
- ✅ Use **UPPER_CASE** for constants

**Example:**
```javascript
/**
 * Create new employee
 * @param {Object} employeeData - Employee data
 * @param {string} createdBy - User ID
 * @returns {Promise<Object>} Created employee
 */
export async function createEmployee(employeeData, createdBy) {
  try {
    // Implementation
  } catch (error) {
    throw error;
  }
}
```

### Frontend (React)

- ✅ Use **functional components** with hooks
- ✅ Use **named exports** for components
- ✅ Use **PropTypes** or TypeScript
- ✅ Keep components **small and focused**
- ✅ Use **custom hooks** for reusable logic
- ✅ Use **CSS variables** for theming
- ✅ Avoid inline styles

**Example:**
```jsx
export function Button({ children, onClick, variant = 'primary' }) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Database

- ✅ Use **snake_case** for table and column names
- ✅ Always add **indexes** for foreign keys
- ✅ Use **TIMESTAMPTZ** for timestamps
- ✅ Use **UUID** for primary keys
- ✅ Add **comments** to tables and columns

---

## 💬 Commit Messages

Follow **Conventional Commits**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Tests
- `chore` - Maintenance

**Examples:**
```
feat(auth): add JWT refresh token support

fix(kanban): resolve drag and drop issue on mobile

docs(readme): update installation instructions

refactor(employees): extract validation to separate file
```

---

## 🔄 Pull Request Process

### 1. PR Title

Use the same format as commit messages:
```
feat(auth): add password reset functionality
```

### 2. PR Description

Include:
- What changes were made
- Why these changes were necessary
- How to test the changes
- Screenshots (if UI changes)
- Related issues (if any)

**Template:**
```markdown
## What
Brief description of changes

## Why
Reason for changes

## How to Test
1. Step 1
2. Step 2
3. Expected result

## Screenshots
(if applicable)

## Related Issues
Closes #123
```

### 3. Code Review

- Address all review comments
- Request re-review after changes
- Be open to feedback

### 4. Merge

Once approved, a maintainer will merge your PR.

---

## 🐛 Reporting Bugs

Use GitHub Issues with the "bug" label.

**Include:**
- Clear description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, browser, versions)
- Screenshots/logs

---

## 💡 Feature Requests

Use GitHub Issues with the "enhancement" label.

**Include:**
- Clear description
- Use case
- Benefits
- Potential implementation approach

---

## 📞 Questions?

- Open a GitHub Discussion
- Email: support@hrplatform.com

---

**Thank you for contributing! 🙏**
