# Bob Shell Non-Interactive Mode: Automated Security Audit

## Overview

This walkthrough demonstrates how to use Bob Shell in non-interactive mode to automate security audits. Non-interactive mode allows you to script Bob Shell commands and run them programmatically, making it ideal for batch operations, scheduled tasks, and CI/CD integration. We'll use the RealWorld Node.js API (a blog/social platform) as our demonstration repository.

**Requirements:** Python 3.7+, Git, terminal (Terminal on macOS, PowerShell on Windows)

## Problem and Solution

**The Challenge:**
Manual code reviews are time-consuming, inconsistent, and don't scale for multiple repositories or regular audits. Even interactive Bob Shell requires manual prompting for each analysis.

**Why Non-Interactive Mode:**
Non-interactive mode scripts your entire analysis workflow upfront, executing automatically without human intervention. This enables scheduled audits (nightly, weekly), batch processing of multiple repositories, CI/CD integration, and consistent analysis across all projects. What takes hours manually completes in minutes and can run as often as needed.

## Step 1: Setup

- **Install Bob Shell** — follow the [Bob Shell Installation](https://bob.ibm.com/docs/shell/getting-started/install-and-setup) guide
- **Log into Bob** — visit https://bob.ibm.com and log in with your IBM credentials
- **Navigate to API Keys** — click the **Admin** tab in the top menu bar, then select **API Keys** from the left sidebar
- **Generate New Key** — click **Create**, give it a name (e.g., "Security Audit"), and copy the generated key
- **Set Environment Variable** — set the API key in your terminal:

  *macOS/Linux:*
  ```bash
  export BOBSHELL_API_KEY="your-copied-api-key"
  ```

  *Windows (PowerShell):*
  ```powershell
  $env:BOBSHELL_API_KEY = "your-copied-api-key"
  ```

- **Accept License:**


  *macOS/Linux && Windows (PowerShell):*
  ```powershell
  bob --show-license
  bob --accept-license
  ```
  This will open Bob Shell in interactive mode. Once accepted, press **Ctrl+C twice** to exit back to your terminal.

  > **Note:** The `BOBSHELL_API_KEY` environment variable only persists for the current terminal session. If you close the terminal or open a new one, you will need to re-export it before running the script.

- **Verify Setup (Optional)** — `-p` sends a prompt; a text reply from Bob means success, an auth error means the key wasn't set correctly:

  *macOS/Linux && Windows (PowerShell):*
  ```powershell
  bob --auth-method api-key -p "Hello"
  ```

For further detailed instructions, see: [Bob API Key Documentation](https://bob.ibm.com/docs/ide/account/api-keys#api-key-types)

## Step 2: Clone Demo Repo

**Navigate to where you cloned the Labs git repo**. Make sure you are in the correct folder before you cd into Non-Interactive:

*macOS:*
```bash
cd Session2/2.3_Best_Practices/Non-Interactive
```

*Windows (PowerShell):*
```powershell
cd Session2\2.3_Best_Practices\Non-Interactive
```

We will use this repo as an example for this lab: **RealWorld Node.js/Express API** (Industry-standard open source demo application, 2,000+ stars)
- Repository: https://github.com/gothinkster/node-express-realworld-example-app
- Features: User authentication, articles, comments (JWT auth, database queries, user input)

Ensure you are in the `Non-Interactive` folder first, then clone:

```bash
git clone https://github.com/gothinkster/node-express-realworld-example-app.git
```

## Step 3: Try the Example

Two platform-specific scripts have been provided in the `Non-Interactive` folder.

Each script executes three Bob Shell commands sequentially — security scan → quality analysis → executive summary — without any manual intervention. The cloned repo directory is referenced by a relative path inside the script; no edits are needed as long as you cloned into the `Non-Interactive` folder.

### Running the Script

*macOS/Linux:*
```bash
python3 security_audit_mac.py
```

*Windows (PowerShell):*
```powershell
python security_audit.py
```

Analysis finishes in 2–3 minutes; silence between sections is normal.

**Note:** The environment variable set in Step 1 only persists for the current terminal session. If you open a new session, set it again before running the script.

## Step 4: Review Results

On completion, `audit_report.md` is created in the `Non-Interactive` folder. Open it to review the results.

The audit generates a markdown report with three sections: executive summary (security score, top issues, remediation effort), security findings (hardcoded secrets, SQL injection risks, missing rate limiting), and code quality issues (complex functions, missing error handling, duplicate logic). Each finding includes severity ratings, file locations, and actionable recommendations.
