# Contributing to ADHD Cookbook

First off, thank you for considering contributing to ADHD Cookbook! This project exists to make cooking more accessible
for people with ADHD, and your help makes a big difference.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. Please be
kind and considerate to others.

## Repository Structure

This project follows a protected branch workflow:

- `main` branch is protected and cannot be directly committed to
- All changes must go through pull requests
- Pull requests require review before merging

## How to Contribute

### 1. Create an Issue First

Before writing any code, please create an issue describing what you want to change or fix. This helps prevent duplicate
work and allows for discussion before implementation.

### 2. Fork and Create a Branch

- Fork the repository
- Create a branch from `main` with a descriptive name
  ```
  git checkout -b feature/your-feature-name
  ```
  or
  ```
  git checkout -b fix/issue-you-are-fixing
  ```

### 3. Make Your Changes

Make changes following our coding guidelines below.

### 4. Test Your Changes

- Test on both Android and iOS if possible
- Ensure existing functionality isn't broken
- Test edge cases and error handling

### 5. Create a Pull Request

- Push your changes to your fork
- Create a pull request to the `main` branch of the original repository
- Reference the issue number in your pull request description
- Provide a clear description of the changes

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow existing project code style
- Use meaningful variable and function names
- Write comments for complex logic
- Use functional components with hooks

### Component Structure

- Keep components small and focused on a single responsibility
- Separate business logic from UI components
- Follow the existing project patterns

### Styling Guidelines

- Use the app's theme system
- Test both light and dark modes
- Ensure UI is responsive on different screen sizes

## Release Process

The project follows a defined release process:

1. Changes are collected on the `main` branch
2. Releases are created with semantic versioning
3. When ready for a new version, a release branch is created
4. After testing, the release is published and tagged

## Getting Help

If you have questions or need help with anything related to contributing, please open a discussion in the repository or
reach out directly.

Thank you for helping make ADHD Cookbook better for everyone!