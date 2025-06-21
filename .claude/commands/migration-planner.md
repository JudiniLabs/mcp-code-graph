# Smart Migration Planning
Plan migration strategy for: $ARGUMENTS

This command creates a comprehensive migration plan by:
1. Identifying all components that need migration
2. Analyzing dependencies and impact scope
3. Determining migration order based on dependencies
4. Finding similar patterns that can be migrated together
5. Generating step-by-step migration roadmap

Follow these steps:
1. Use nodes-semantic-search to find all instances of the target component
2. Get complete implementation with get-code for each instance
3. Generate full dependency analysis with get-usage-dependency-links
4. Find similar components that can be migrated together
5. Analyze direct connections to understand migration impact
6. Search documentation for migration guidelines with docs-semantic-search
7. Create a prioritized migration roadmap

This command is ideal for: technology migrations, refactoring projects, and modernization efforts.