# Complete Security Audit
Perform a comprehensive security analysis of the entire repository.

This command conducts a full security audit by:
1. Identifying all authentication and authorization patterns
2. Finding data validation and sanitization throughout the codebase
3. Analyzing all API endpoints and their security measures
4. Mapping security-related dependencies across the system
5. Checking for common vulnerability patterns

Follow these steps:
1. Use nodes-semantic-search with security-related queries (auth, validation, sanitization, encryption, password, token)
2. Get implementation details of all security-critical functions with get-code
3. Analyze security dependencies with get-usage-dependency-links
4. Find security flow connections with find-direct-connections
5. Search for security documentation with docs-semantic-search
6. Generate a comprehensive security report with recommendations

This command is ideal for: security audits, compliance checks, and vulnerability assessments.