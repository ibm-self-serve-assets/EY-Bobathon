# Bobathon Problem Statement 

## The Problem
Your team reviews pull requests manually today. Reviews are inconsistent — some people check for security issues, some don’t. Some enforce naming conventions, others ignore them. Junior developers get long reviews, senior developers get rubber stamps. There’s no standard.

Your job: build a Bob setup that does consistent, opinionated PR reviews for a Python codebase.

## What you need to build
A custom mode called pr-reviewer that:
- Can only read files, not write or execute anything
- Has a clear persona — it’s a senior engineer who is direct, constructive, and never vague

A skill called python-review that Bob loads when reviewing Python files, covering:
- PEP 8 and naming conventions
- Security red flags (hardcoded secrets, SQL injection patterns, unsafe deserialization)
- Test coverage expectations

A .bobignore that protects:
- Any .env files
- *.pem and *.key files
- The secrets/ directory




Stretch goal: A subagent called security-scanner that Bob can delegate to — it scans the diff for secrets, vulnerable dependencies, and unsafe patterns, then returns a one-paragraph summary to the parent.