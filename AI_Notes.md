# AI Notes

This document describes how AI tools are used in this project and the use cases they solve.

## AI Models Used

### 1. MiniMax-M2.5 Code
- **Primary AI assistant** for this project
- Used for code generation, debugging, and answering technical questions
- Handles most of the day-to-day development tasks

### 2. Claude Code
- **Secondary AI assistant** (via Claude Code CLI)
- Used for codebase exploration and documentation updates
- Specialized in understanding large codebases and generating comprehensive documentation

---

## Use Cases

### Code Exploration & Understanding

**Problem**: Understanding an unfamiliar codebase or large project structure is time-consuming.

**AI Solution**:
- Claude Code's `Explore` agent can quickly analyze and summarize the entire codebase
- Provides insights into project structure, routing, state management, and patterns
- Identifies relationships between files and components

**Example**:
- Exploring the codebase to understand the module structure (customer, inventory, transaction)
- Identifying that auth middleware was commented out across routes
- Discovering the mock data pattern in services

### Documentation Updates

**Problem**: Documentation often becomes outdated as the codebase evolves.

**AI Solution**:
- AI can explore the current state of the codebase and update documentation accordingly
- Ensures CLAUDE.md and README.md reflect the actual architecture

**Example**:
- Updating CLAUDE.md with correct route paths (/admin/ instead of /dashboard/)
- Adding information about modules, components, and mock data
- Documenting Docker configuration in README.md

### Code Generation & Implementation

**Problem**: Writing boilerplate code and implementing features takes significant time.

**AI Solution**:
- MiniMax-M2.5 Code generates component code, service layers, and route handlers
- Follows existing patterns in the codebase
- Creates consistent, maintainable code

**Example**:
- Generating CRUD operations for customer and transaction modules
- Creating UI components following existing patterns
- Implementing form validation with React Hook Form

### Debugging & Issue Resolution

**Problem**: Identifying and fixing bugs can be challenging, especially in complex applications.

**AI Solution**:
- AI analyzes error messages and provides potential solutions
- Helps trace issues through the codebase
- Suggests best practices for fixing common problems

### Architecture Decisions

**Problem**: Choosing the right patterns and libraries for new features.

**AI Solution**:
- AI provides recommendations based on existing codebase patterns
- Helps maintain consistency across the project
- Suggests improvements to existing architecture

---

## Workflow

### Typical Development Flow

1. **Planning**: Discuss feature requirements with AI
2. **Implementation**: AI generates code following project patterns
3. **Review**: AI reviews code for potential issues
4. **Documentation**: AI updates relevant documentation
5. **Testing**: AI helps write and run tests

### When to Use Which AI

| Task | Recommended AI |
|------|----------------|
| Code generation | MiniMax-M2.5 Code |
| Debugging | MiniMax-M2.5 Code |
| Codebase exploration | Claude Code |
| Documentation updates | Claude Code |
| Architecture discussion | Either |
| Writing tests | MiniMax-M2.5 Code |

---

## Integration with Claude Code CLI

Claude Code provides additional capabilities:

### Available Commands

```bash
# Get AI diagnostics for files
claude --诊断 <file>

# Execute code in IDE
claude --执行代码 <code>
```

### Tips for Effective AI Collaboration

1. **Be specific**: Provide clear requirements and context
2. **Share relevant files**: Point AI to specific files when asking questions
3. **Ask for explanations**: Request AI to explain complex code
4. **Iterate**: Build on AI suggestions incrementally
5. **Verify**: Always review AI-generated code before committing

---

## Benefits Observed

- **Faster onboarding**: New developers can understand the codebase quickly
- **Consistent patterns**: AI maintains coding conventions across the project
- **Reduced documentation drift**: Documentation stays up-to-date
- **Improved productivity**: Faster development cycles for new features
- **Better code quality**: AI suggests best practices and identifies potential issues

---

## Limitations

- AI-generated code should always be reviewed by a developer
- Mock data is used for demonstration; real API integration requires additional work
- Security-sensitive code (authentication, authorization) should be manually reviewed
- AI may not be aware of business-specific requirements; human oversight is essential
