# Complete Test Coverage Analysis
Analyze test coverage and quality across the entire repository.

This command provides complete testing analysis by:
1. Identifying all test files and test patterns
2. Mapping test coverage to source code
3. Finding untested critical paths
4. Analyzing test quality and patterns
5. Generating testing improvement recommendations

Follow these steps:
1. Use nodes-semantic-search to find all test-related code (test, spec, mock, fixture, jest, mocha)
2. Get all test implementations with get-code
3. Analyze test dependencies and coverage with get-usage-dependency-links
4. Find connections between tests and source code with find-direct-connections
5. Search for testing documentation and guidelines with docs-semantic-search
6. Generate comprehensive test coverage report with improvement suggestions

This command is ideal for: test audits, coverage improvement, and testing strategy planning.