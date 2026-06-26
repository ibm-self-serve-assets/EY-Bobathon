# Vulnerable Tax Application - Security Training Lab

⚠️ **WARNING: Contains INTENTIONAL security vulnerabilities for educational purposes only. DO NOT use in production!**

## Purpose

Tax preparation application with **15 intentional security vulnerabilities** to teach security best practices. You'll discover, exploit, and fix critical security issues using Bob AI.

## Quick Start

```bash
cd security-and-compliance/lab/vulnerable-tax-app
npm install
npm start
```

Application runs on **http://localhost:3000**

## Structure

```
vulnerable-tax-app/
├── server.js          # Backend API with vulnerabilities
├── package.json       # Dependencies
├── tax_data.db       # SQLite database (auto-created)
└── public/           # Frontend UI
```

## Features

- Taxpayer management (SSN, EIN, bank accounts)
- Tax return filing and calculations
- Search by SSN/name
- AI tax advice
- Admin panel

## Vulnerabilities (15 Total)

**Critical (8):** SQL Injection, Unencrypted PII, PII in Logs, PII to AI, No Authentication, PII in URLs, PII in localStorage, Hardcoded Credentials

**High (6):** Unmasked PII Display, PII in Errors, No Input Validation, PII in Analytics, Exposed SQL Queries, CORS Misconfiguration

**Medium (1):** Verbose Error Messages

## Lab Guide

See **[HANDS_ON_LAB_GUIDE.md](../HANDS_ON_LAB_GUIDE.md)** for step-by-step instructions on discovering and fixing vulnerabilities.

## API Endpoints

- `POST /api/taxpayers` - Create taxpayer
- `GET /api/taxpayers/search?ssn=XXX-XX-XXXX` - Search (⚠️ SQL Injection)
- `GET /api/taxpayers/ssn/:ssn` - Get by SSN (⚠️ PII in URL)
- `POST /api/tax-returns` - File tax return
- `POST /api/tax-advice` - Get AI advice (⚠️ Sends PII)
- `GET /api/admin/all-taxpayers` - Admin access (⚠️ No Auth)

## Priority Fixes

1. Fix SQL Injection - Use parameterized queries
2. Remove PII from Logs - Log IDs only
3. Mask PII in UI - Show XXX-XX-1234 format
4. Add Authentication - Protect admin endpoints
5. Sanitize AI Prompts - Remove PII before sending

## Troubleshooting

**Port in use:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

**Database issues:**
```bash
# Delete and recreate database
rm tax_data.db
npm start
```

## Additional Resources

### Security Standards
- [IRS Publication 1075](https://www.irs.gov/pub/irs-pdf/p1075.pdf)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

### Node.js Security
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

### SQL Injection Prevention
- [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [Parameterized Queries Guide](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html)

## Important Reminders

- Training application only - contains intentional vulnerabilities
- Do not expose to the internet
- Use fake SSNs for testing
- Safe exploitation on local machine only

---

**Complete the hands-on lab:** [HANDS_ON_LAB_GUIDE.md](../HANDS_ON_LAB_GUIDE.md)