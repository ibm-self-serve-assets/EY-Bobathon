# 🤖 EY Bobathon - Advanced Bob Training 🤖

## 📅 Session 1: Advanced Bob Capabilities (150 minutes) - 25th June

### 1.1 Recap & Quick Poll
- Bob core feature recap
- Quick wins: common pain points and how Bob solved them
- Quick poll: what features are you using most?

### 1.2 Bob Customization Deep Dive
**Extending Bob Through Custom Components**

#### Custom Modes
- Creating custom modes (Mode configuration and best practices)

#### Skills Development
- Building reusable skills
- **Example:**
  - **Tax-domain skill** - Create a skill that analyzes tax authority guidance, notifications, circulars, and similar documents uploaded by users, extracts the underlying business rules and decision logic, and generates structured, implementation-ready pseudocode for software development

#### MCP Server Integration
- Securely Handling Remote MCP Connections in Bob
- **Examples:**
  - watsonx Orchestrate MCP server integration
  - watsonx Data Intelligence MCP server - **Hands-on**

#### Rules & Guidelines
- Enforcing coding standards
- Domain-specific validation rules

### 1.3 Subagents

### 1.4 Code Refactoring - **Hands-on Lab**
- Multi-file refactoring for .NET Framework → .NET 6/8 migration



---

## 📅 Session 2: (150 mins) - 26th June

### 2.1 Using Bob with watsonx Orchestrate MCP server - **Hands-on Lab**
  - How to build a fully functional agent and deploy using Bob

### 2.2 Security & Compliance - **Hands-on Lab**
- Sensitive data handling in prompts
- PII protection in tax applications
- Bob's role in security code reviews

### 2.3 Best Practices / Productivity Hacks
- Context management for large projects
- Using Bob's memory across sessions and how to leverage modes
- Using Bob's context awareness for large codebases
- Bob shell - non-interactive mode

---

## 🏆 Bobathon

### 🚀 Advanced Techniques & Bobathon Tasks

#### Custom mode creation for tax workflows
- Creating custom tax based workflows skills

**Examples:**

- **tax-domain skill**
  - Teaches Bob terminology like nexus, VAT reverse-charge, and the `decimal` -not- `float` rule

- **dotnet-migration skill**
  - Gives Bob a cheat sheet of every namespace replacement and pattern change needed
  - Harnessing Autonomous Self-Correction loop
