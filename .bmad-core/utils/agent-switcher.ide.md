# Agent Switcher IDE Utility

## Purpose
Provides seamless agent switching capabilities within Cursor IDE using the BMAD Method framework.

## Available Agents

### Core Management Agents
- `@bmad-orchestrator` - Master coordinator for workflows and multi-agent tasks
- `@bmad-master` - Universal task executor with access to all BMAD capabilities
- `@pm` - Project Manager for planning and coordination
- `@po` - Product Owner for requirements and user stories
- `@sm` - Scrum Master for agile process management

### Technical Agents
- `@architect` - System architecture and technical design
- `@dev` - Full-stack development implementation
- `@analyst` - Business analysis and market research
- `@qa` - Quality assurance and testing
- `@ux-expert` - User experience and interface design

### Specialized Agents
- `@game-designer` - Game design and mechanics
- `@game-developer` - Game development implementation
- `@game-sm` - Game project scrum management
- `@infra-devops-platform` - Infrastructure and DevOps
- `@bmad-the-creator` - Creates new expansion packs

## Quick Switch Commands

### Workflow-Based Switching
```
For new projects: @bmad-orchestrator → *workflow-guidance
For brownfield: @architect → *task brownfield-architecture
For user stories: @po → *task create-story
For implementation: @dev → *task implementation
```

### Command Patterns
All agents support these command patterns:
- `*help` - Show agent-specific commands
- `*status` - Current context and progress
- `*task [name]` - Execute specific task
- `*workflow [name]` - Start workflow
- `*exit` - Return to neutral mode

## IDE Integration Features

### Auto-Completion Triggers
- Type `@` to see available agents
- Each agent has contextual help
- Fuzzy matching with 85% confidence threshold

### State Management
- Agents maintain context until `*exit` or new agent called
- Automatic resource loading on demand
- Progress tracking across agent switches

## Best Practices

1. **Start with Orchestrator**: Use `@bmad-orchestrator` when unsure which agent to use
2. **Workflow-First**: Use `*workflow-guidance` for project planning
3. **Atomic Tasks**: Switch agents for specialized tasks, return when complete
4. **State Awareness**: Always check `*status` after switching
5. **Resource Conservation**: Agents load dependencies only when needed 