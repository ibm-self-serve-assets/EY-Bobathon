import subprocess
import os
import re
from datetime import datetime
import shutil

class SecurityAuditTool:
    def __init__(self, api_key, repo_path):
        self.api_key = api_key
        self.repo_path = repo_path
        os.environ["BOBSHELL_API_KEY"] = api_key
        self.results = {}

        # Find bob executable in PATH
        self.bob_path = shutil.which("bob")
        if not self.bob_path:
            # Try common npm global install location on Windows
            npm_path = os.path.join(os.environ.get("APPDATA", ""), "npm", "bob.cmd")
            if os.path.exists(npm_path):
                self.bob_path = npm_path
            else:
                raise FileNotFoundError("bob command not found. Please ensure BobShell CLI is installed and in PATH.")


    
    def extract_answer(self, text):
        """Extract clean output from Bob's response"""
        # Try to extract <answer> tags first
        match = re.search(r'<answer>(.*?)</answer>', text, re.DOTALL)
        if match:
            return match.group(1).strip()
        
        # If no answer tags, clean the output manually
        # Remove thinking tags
        text = re.sub(r'<thinking>.*?</thinking>', '', text, flags=re.DOTALL)
        # Remove tool usage
        text = re.sub(r'\[using tool.*?\]', '', text, flags=re.DOTALL)
        # Extract final output between markers
        if '---output---' in text:
            parts = text.split('---output---')
            if len(parts) >= 3:
                text = parts[-2]
        
        return text.strip()
    
    def run_bob_command(self, prompt, description=""):
        print(f"Running: {description}...")
        bob_cmd = str(self.bob_path) if self.bob_path else "bob"
        result = subprocess.run(
            [bob_cmd, "--auth-method", "api-key", "-p", prompt],
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