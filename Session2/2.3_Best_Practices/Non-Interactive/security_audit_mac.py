import subprocess
import os
import re
from datetime import datetime

class SecurityAuditTool:
    def __init__(self, api_key, repo_path):
        self.api_key = api_key
        self.repo_path = repo_path
        os.environ["BOBSHELL_API_KEY"] = api_key
        self.results = {}

    def extract_answer(self, text):
        """Extract clean output from Bob's response"""
        match = re.search(r'<answer>(.*?)</answer>', text, re.DOTALL)
        if match:
            return match.group(1).strip()

        text = re.sub(r'<thinking>.*?</thinking>', '', text, flags=re.DOTALL)
        text = re.sub(r'\[using tool.*?\]', '', text, flags=re.DOTALL)
        if '---output---' in text:
            parts = text.split('---output---')
            if len(parts) >= 3:
                text = parts[-2]

        return text.strip()

    def run_bob_command(self, prompt, description=""):
        print(f"Running: {description}...")
        # On macOS/Linux, 'bob' is a real binary — no shell=True needed.
        result = subprocess.run(
            ["bob", "--auth-method", "api-key", "-p", prompt],
            capture_output=True,
            text=True,
            cwd=self.repo_path
        )
        return {
            "output": self.extract_answer(result.stdout),
            "success": result.returncode == 0
        }

    def scan_security(self):
        prompt = """Analyze this codebase for security vulnerabilities. List the top 5 security vulnerabilities. For each one, provide:
SEVERITY | filename:line | description

Example:
CRITICAL | auth.js:45 | Hardcoded API key exposed
HIGH | login.js:12 | Missing rate limiting

Output ONLY the final result in markdown format between <answer> and </answer> tags with no commentary, reasoning, or tool logs outside those tags."""
        self.results['security'] = self.run_bob_command(prompt, "Security Scan")

    def analyze_quality(self):
        prompt = """Analyze this codebase for code quality issues. List the top 5 code quality issues. For each one, provide:
filename:line | problem | solution

Example:
utils.js:23 | Complex nested loops | Refactor into separate functions
auth.js:67 | Missing error handling | Add try-catch block

Output ONLY the final result in markdown format between <answer> and </answer> tags with no commentary, reasoning, or tool logs outside those tags."""
        self.results['quality'] = self.run_bob_command(prompt, "Quality Analysis")

    def generate_summary(self):
        prompt = """Analyze this codebase and create an executive summary in 100 words or less:
- Security score (X/10)
- Top 3 critical issues (one line each)
- Risk level (Low/Medium/High/Critical)
- Recommended action (one sentence)

Output ONLY the final result in markdown format between <answer> and </answer> tags with no commentary, reasoning, or tool logs outside those tags."""
        self.results['summary'] = self.run_bob_command(prompt, "Executive Summary")

    def run_full_audit(self):
        print(f"\nStarting audit: {self.repo_path}\n")

        self.scan_security()
        self.analyze_quality()
        self.generate_summary()

        report = f"""# Security Audit Report
**Repository:** {self.repo_path}
**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Executive Summary
{self.results['summary']['output']}

## Security Findings
{self.results['security']['output']}

## Code Quality
{self.results['quality']['output']}
"""
        with open("audit_report.md", "w") as f:
            f.write(report)

        print("\nAudit complete - Report saved to audit_report.md\n")
        return self.results

if __name__ == "__main__":
    auditor = SecurityAuditTool(
        api_key=os.environ.get("BOBSHELL_API_KEY"),
        repo_path="./node-express-realworld-example-app"
    )
    auditor.run_full_audit()
