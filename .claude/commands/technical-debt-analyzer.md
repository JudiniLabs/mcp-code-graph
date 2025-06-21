# Complete Technical Debt Assessment
Assess technical debt across the entire repository.

This command provides comprehensive technical debt analysis by:
1. Identifying code smells and anti-patterns throughout the codebase
2. Analyzing complexity and maintainability metrics
3. Finding duplicated code and inconsistent patterns
4. Mapping technical debt impact across the entire system
5. Prioritizing technical debt remediation

Follow these steps:
1. Use nodes-semantic-search to find potentially problematic code patterns (TODO, FIXME, deprecated, hack, workaround)
2. Get implementation details with get-code for analysis
3. Analyze impact and dependencies with get-usage-dependency-links
4. Find similar problematic patterns across the codebase
5. Map relationships and impact with find-direct-connections
6. Search for coding standards documentation with docs-semantic-search
7. Generate prioritized technical debt remediation plan

This command is ideal for: code quality assessments, refactoring planning, and technical debt management.