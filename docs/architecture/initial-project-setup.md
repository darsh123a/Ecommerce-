# Initial Project Setup

## Objective

Set up the complete local development environment for this e-commerce application.

The final development environment must have:

Frontend
    React + TypeScript + Vite

Backend
    PHP + Laravel

Database
    PostgreSQL

Architecture

React Frontend
        ↓
Laravel REST API
        ↓
PostgreSQL

The application must be runnable locally as a complete frontend + backend + database stack.

---

# 1. Important AI Instructions

Before doing anything:

1. Inspect the existing repository.
2. Inspect the current directory structure.
3. Inspect installed software and versions.
4. Read:
   - `docs/tech-stack.md`
   - `docs/setup.md`
   - `docs/system-architecture.md` if it exists.
5. Do not delete existing files.
6. Do not overwrite existing project work unnecessarily.
7. Do not change architectural decisions.
8. Do not start feature/module development.
9. Do not create Product functionality yet.
10. Do not install unnecessary packages.
11. Prefer stable production-supported versions.
12. Keep frontend and backend independently runnable.
13. Keep secrets out of Git.
14. Use `.env` for local secrets/configuration.
15. Provide `.env.example` files where appropriate.

---

# 2. Existing Environment

The following are already installed:

- Node.js
- npm
- Git
- VS Code
- GitHub
- GitHub Copilot
- Google Antigravity

Do NOT reinstall these.

Verify their versions before proceeding.

---

# 3. Inspect Required Backend Tools

Check whether the following are installed:

```bash
php --version
composer --version