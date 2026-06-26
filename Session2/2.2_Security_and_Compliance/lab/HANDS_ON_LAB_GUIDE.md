# Hands-On Security Lab: Tax Filing Security

## 🎯 Lab Overview

**Duration**: 20-40 minutes
**Level**: Advanced
**Prerequisites**: Node.js 16+, Bob AI Assistant, Basic JavaScript knowledge

In this hands-on lab, you'll work with a **real, running vulnerable tax application** to identify and fix security issues. You'll use Bob AI to help discover vulnerabilities, understand their impact, and implement secure solutions.

---

## 📑 Lab Agenda

| Section | Description |
| ---------|-------------|
| [Part 1: Setup & Exploration](#-part-1-setup--exploration) | Install dependencies, start the vulnerable app, and explore its features |
| [Part 2: Let Bob Find Vulnerabilities](#-part-2-let-bob-find-vulnerabilities) | Use Bob AI to scan and identify security issues |
| [Part 3: See the Problems](#-part-3-see-the-problems) | Test SQL injection, command injection, and other vulnerabilities |
| [Part 4: Let Bob Fix the Issues](#-part-4-let-bob-fix-the-issues) | Use Bob to implement security fixes for critical vulnerabilities |

---

## 🚀 Part 1: Setup & Exploration

### Step 1.0: Install Node.js (if not already installed)

Skip this step if `node -v` prints `v16` or higher.

**macOS (Homebrew):**
```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.5/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 24
```

**Windows (PowerShell):**
```powershell
# Download and install Chocolatey, then  Node.js:
powershell -c "irm https://community.chocolatey.org/install.ps1|iex"
choco install nodejs --version="24.17.0"
```

If you have trouble installing Node with Choco, please download Node.js from here: https://nodejs.org/en/download. Try to run ```node -v```- if you get errors, run the below:
```
$nodePath = "$env:USERPROFILE\node-v24.17.0-win-x64"
if (Test-Path $nodePath) {
    $env:Path = "$nodePath;$env:Path"
    # Make it permanent
    [Environment]::SetEnvironmentVariable("Path", "$nodePath;" + [Environment]::GetEnvironmentVariable("Path", "User"), "User")
}
```

Note: If you have to run the above code to resolve Node/ npm issues, you will need to run this command in every new terminal you open. 

### Step 1.1: Install Dependencies

```bash
cd Session2/2.2_Security_and_Compliance/lab/vulnerable-tax-app
npm install
```

### Step 1.2: Start the Application

```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════════════════════════╗
║  ⚠️  VULNERABLE TAX APPLICATION - TRAINING ONLY ⚠️             ║
╠════════════════════════════════════════════════════════════════╣
║  Server running on http://localhost:3000                       ║
╚════════════════════════════════════════════════════════════════╝
```

### Step 1.3: Explore the Application

Open http://localhost:3000 in your browser and:

1. **Create a test taxpayer** with:
   - SSN: 123-45-6789
   - Name: John Doe
   - Bank Account: 9876543210

2. **Notice the vulnerabilities** highlighted in red throughout the UI, and how users info are logged.

3. **Check your browser console** Right click then select "Inspect" (use either Chrome or Firefox) &rarr; In the developer console, choose "Console". Notice the PII that is exposed here under `Creating taxpayer with data` > object.

4. **In your terminal** where the server is running - see any sensitive data being logged 

---

## 🔍 Part 2: Let Bob Find Vulnerabilities

### Step 2.1: Use Bob to Scan the Codebase

**Open Bob in Ask Mode (❓) and prompt:**

```
Analyze the code in @/Session2/2.2_Security_and_Compliance/lab/vulnerable-tax-app  and identify all security vulnerabilities.

Focus on:
1. PII exposure (SSN, EIN, bank accounts)
2. SQL injection vulnerabilities
3. Command injection vulnerabilities
4. Authentication/authorization issues
5. Logging of sensitive data
6. Data storage security

For each vulnerability found, provide:
- Severity (Critical/High/Medium/Low)
- File location and line number
- Specific code snippet
- Potential impact
- Recommended fix
```

**Expected Output:**

Bob should identify vulnerabilities including:
- SQL injection in search endpoints
- Command injection in document generation
- PII in application logs and browser localStorage
- PII in URL parameters
- Unmasked PII in UI
- No authentication on admin endpoints


### [Optional] Step 2.2: Review Bob's Findings

Take 5 minutes to review Bob's analysis. Ask follow-up questions:


```
For the command injection vulnerability in the document generation endpoint,
show me an example of how an attacker could exploit this to delete files.
```

```
What are the compliance implications of storing SSN in plaintext?
Which regulations does this violate?
```

---

## 💥 Part 3: See the Problems

**⚠️ IMPORTANT: Only do this on your local training environment!**

### Step 3.1: Test SQL Injection That Bob Found

**First, make sure you have created 2-3 test taxpayers** (you can create those using the Taxpayer Info tab) so you can see the SQL injection returning multiple records.

1. Go to the **Search** tab in the application
2. In the "Search by SSN" field, enter: `' OR '1'='1`
3. Click Search

What happened? You should see ALL taxpayers returned, not just one!

Try these other SQL injection examples:

- `' OR 1=1 OR '` - Returns all records
- `' OR 'x'='x` - Returns all records
- `123' OR '1'='1` - Returns all records even with a valid SSN prefix

**What this demonstrates:** The application is vulnerable to SQL injection because it uses string concatenation instead of parameterized queries. An attacker can bypass authentication, extract all data, or potentially modify/delete records.

### Step 3.2: Test Command Injection That Bob Found

Command injection is even more dangerous than SQL injection - it allows attackers to execute arbitrary system commands on the server!

1. Go to the **Documents** tab in the application
2. Enter a Taxpayer ID (e.g., 1)
3. Select format: PDF
4. In the "Filename" field, enter the payload for your OS:
   - *macOS/Linux:* `test.pdf; ls -la`
   - *Windows:* `test.pdf& dir`
5. Click "Generate Document"

*What happened?* Check your **server terminal** - you should see a directory listing!

**Now, try this destructive command injection:**

1. First, verify the backup file exists in your terminal. Open a new terminal and run this code:

   **macOS/Linux:**
   ```bash
   cd Session2/2.2_Security_and_Compliance/lab/vulnerable-tax-app
   ls -la tax_data_backup.db
   ```
   **Windows (Command Prompt):**
   ```cmd
   cd Session2/2.2_Security_and_Compliance/lab/vulnerable-tax-app
   dir tax_data_backup.db
   ```
   You should see the file exists.

2. Go back to the app's UI. In the "Filename" field, enter the payload for your OS:
   - *macOS/Linux:* `test.pdf; rm tax_data_backup.db`
   - *Windows:* `test.pdf& del tax_data_backup.db`
3. Click "Generate Document"
4. Check your terminal again:

   *macOS/Linux:*
   ```bash
   ls -la tax_data_backup.db
   ```
   *Result:* `ls: tax_data_backup.db: No such file or directory`

   *Windows (Command Prompt):*
   ```cmd
   dir tax_data_backup.db
   ```
   *Result:* `File Not Found`

**The file is GONE!** 💥

**What this demonstrates:** The application passes user input directly to shell commands without sanitization. An attacker can:
- Execute any system command
- Delete critical files (as you just did!)
- Read sensitive data
- Modify system configuration
- Establish backdoors
- Completely compromise the server

This is MORE dangerous than SQL injection because it provides full system access, not just database access!

**To restore the backup file:** Restart the server with `^C` then `npm start` - it will recreate the backup file.

### Step 3.3: PII Exposure

When you started the lab you noticed PII appearing in the browser UI and in the DevTools console. Now let's see how that same sensitive data also leaks directly into URLs. 

1. Open browser DevTools (Right click then select "Inspect") → Network tab
2. Click on the Search tab on the app and search for a taxpayer by SSN. Use ```123-45-6789```
3. Look at the request URL.

*What do you see?* SSN is in the URL query parameter, visible in Browser history, Server logs, Network monitoring tools, Proxy logs.

### Step 3.4: Verify Unprotected Admin Endpoint

1. Go to the **Admin** tab
2. Click "View All Taxpayers"

*What happened?* You got access to ALL taxpayer data with no authentication!

---

## 🔧 Part 4: Let Bob Fix the Issues

### Step 4.1: Create a Copy - Bob Creates a Copy of Vulnerable Tax App
Now let's fix the most critical issues using Bob's Code mode. For these fixes we will ask Bob to create a copy of the vulnerable-tax-app and call it secure-tax-app so we can see the differences in real time. **Switch to Bob's Code mode.** and keep **auto-approve OFF** to review each step.

**Prompt Bob:**

```
Create a copy of vulnerable-tax-app and name it secure-tax-app. vulnerable-tax-app should be left as is. Place this copy in the lab folder. Do not change the port number or anything else in the app.
```

### Step 4.2: SQL Injection - Bob Generates Parameterized Queries

**Prompt Bob:**

```
Fix the SQL injection vulnerability in server.js in the /api/taxpayers/search endpoint in secure-tax-app.

Requirements:
1. Use parameterized queries instead of string concatenation
2. Validate input before using it
3. Remove the query from error responses
4. Add proper error handling

Show me the complete fixed code for this endpoint.
```

**After Bob provides the fix:**

1. Close the server you have running using `Ctrl+C`
2. Open a new terminal and run
```
cd Session2/2.2_Security_and_Compliance/lab/secure-tax-app
npm install
npm start
```
3. In the UI, go the "Taxpayer info" tab. Create a new taxpayer:
    1. SSN: 111-11-1111
    2. Name: Jane Smith
    3. Bank account: 12-3456789
4. Test: Navigate to  the search tab, try the SQL command `' OR '1'='1` again - it should NOT return all records

### Step 4.3: Command Injection - Bob Secures Document Generation

**Prompt Bob:**

```
Fix the command injection vulnerability in server.js in the /api/documents/generate endpoint in secure-tax-app.

Requirements:
1. Sanitize and validate the filename input
2. Use allowlist validation for filename characters (alphanumeric, dash, underscore, dot only)
3. Prevent shell command execution through user input
4. Add proper error handling for invalid filenames
5. Ensure the filename cannot contain shell metacharacters (; | & $ ` etc.)

Show me the complete fixed code for this endpoint.
```

**After Bob provides the fix:**

1. Restart your server (`^C + npm start`)
2. Test the protection by navigating to the **Documents** tab
3. Try these command injection attempts - they should all be blocked:
   - *macOS/Linux:* `test.pdf; ls -la` / *Windows:* `test.pdf& dir` → Should return error about invalid filename
   - *macOS/Linux:* `test.pdf; rm tax_data_backup.db` / *Windows:* `test.pdf& del tax_data_backup.db` → Should be rejected
4. Test with a valid filename: `tax-document-2024.pdf` → Should work correctly


### Step 4.4: PII Protection - Bob Creates Encryption, Masking, and Log Filtering

**Prompt Bob:**

```
In the secure-tax-app folder, fix all PII exposure issues across the full stack.

Requirements:

1. In server.js, replace all logged PII (SSN, EIN, bank accounts) with record IDs in logs; keep logs useful for debugging and add a comment explaining why we don't log PII
2. In public/app.js, create a maskPII utility function and apply it everywhere PII is displayed:
   - Mask SSN to XXX-XX-1234 format
   - Mask bank accounts to ****1234 format
   - Update displaySearchResults() to use masking
   - Update the taxpayer creation success message to use masking
   - Never display full PII in the UI
   - Never display PII in search endpoint URL paths or query strings

Update all affected files.
```

**After applying the fix:**


1. Restart your server (`^C + npm start`)
2. In the UI, go the "Taxpayer info" tab. Create a new taxpayer:
    1. SSN: 333-33-3333
    2. Name: Tony Stark
    3. Bank account: 12-3456788
3. In the Search tab, search for the taxpayer by SSN
4. Check server console - should not display SSN [terminal]
5. Check browser console - should not display PII in Dev Console (right click on browser + Inspect)

### Step 4.5: Authentication - Bob Builds Auth Middleware

**Prompt Bob:**

```
In the secure-tax-app, add basic authentication to the /api/admin/all-taxpayers endpoint in server.js.

Requirements:
1. Require an API key in the Authorization header
2. Return 401 Unauthorized if missing or invalid
3. Log all admin access attempts (with outcome)
4. Ask for API key in the request, so only Admin users can access

Provide the complete implementation.
```

**After applying the fix:**

1. Restart your server (`^C + npm start`)
2. Try accessing admin endpoint - should get 401 error
3. Add API key to request - should work

---

## 🎯 What You Learned

**Security skills practised:**

- **PII protection** — identified SSN, EIN, and bank account exposure in logs, AI prompts, localStorage, and the UI; fixed each with log sanitisation and display-layer masking
- **SQL injection** — replaced string-concatenated queries with parameterised statements and added input validation; removed internal error details from API responses
- **Command injection** — eliminated `exec()` entirely, replaced with `fs.writeFile`, and enforced an allowlist regex on the filename input
- **Authentication** — added `requireAdminApiKey` middleware to the admin endpoint, with structured logging of every access attempt

**How Bob accelerated the work:**

Bob scanned the codebase, ranked findings by severity, explained the business and compliance impact of each one, and generated targeted fixes — turning what would be a multi-day manual audit into a single guided session.

**Compliance context:**

The vulnerabilities fixed here map directly to controls required by **IRS Publication 1075** (Federal Tax Information safeguarding) and **SOC 2 Type II** — demonstrating how AI-assisted review fits into a professional compliance workflow.

---

## 🆘 Troubleshooting

**Port 3000 in use:**

macOS/Linux:
```bash
lsof -i :3000
kill -9 <PID>
```
Windows (Command Prompt):
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```
Or on any platform: `PORT=3001 npm start`

**Need help:** Use Bob's Ask mode or check with your instructor

---

## ✨ Congratulations!

You've completed the Tax Application Security Lab! Starting from a deliberately vulnerable app, you used Bob to identify every critical issue, understand its real-world impact, and ship targeted fixes — including parameterised queries, filename allowlists, PII masking, log sanitisation, and API key authentication.

**Next Steps:**
- Apply these techniques to your own projects
- Share what you learned with your team
- Continue exploring Bob's security capabilities