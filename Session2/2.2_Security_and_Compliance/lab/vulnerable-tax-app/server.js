// VULNERABLE TAX APPLICATION - FOR TRAINING PURPOSES ONLY
// This application contains intentional security vulnerabilities
// DO NOT use in production!

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const DB_PATH = './tax_data.db';

// Initialize database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS taxpayers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ssn TEXT NOT NULL,
      ein TEXT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      bank_account TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tax_returns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      taxpayer_id INTEGER NOT NULL,
      tax_year INTEGER NOT NULL,
      filing_status TEXT NOT NULL,
      total_income REAL NOT NULL,
      w2_income REAL,
      self_employment_income REAL,
      investment_income REAL,
      total_deductions REAL,
      federal_tax_owed REAL,
      state_tax_owed REAL,
      refund_amount REAL,
      status TEXT DEFAULT 'draft',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (taxpayer_id) REFERENCES taxpayers(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS dependents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      taxpayer_id INTEGER NOT NULL,
      ssn TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      date_of_birth TEXT NOT NULL,
      relationship TEXT NOT NULL,
      FOREIGN KEY (taxpayer_id) REFERENCES taxpayers(id)
    )
  `);

  console.log('Database tables initialized successfully');
  
  // Create a backup database file for demonstration purposes
  const fs = require('fs');
  const backupPath = './tax_data_backup.db';
  
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(DB_PATH, backupPath);
    console.log('✅ Created backup database: tax_data_backup.db');
    console.log('⚠️  This file can be deleted via command injection!');
  }
}

// =============================================================================
// API ENDPOINTS
// =============================================================================

app.get('/api/taxpayers/search', (req, res) => {
  const { ssn, name } = req.query;
  
  let query = 'SELECT * FROM taxpayers WHERE 1=1';
  
  if (ssn) {
    query += ` AND ssn = '${ssn}'`;
    console.log(`Searching for taxpayer with SSN: ${ssn}`);
  }
  
  if (name) {
    query += ` AND (first_name LIKE '%${name}%' OR last_name LIKE '%${name}%')`;
  }
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ 
        error: 'Database error', 
        details: err.message,
        query: query
      });
    }
    
    res.json(rows);
  });
});

app.get('/api/taxpayers/ssn/:ssn', (req, res) => {
  const { ssn } = req.params;
  
  console.log(`Fetching taxpayer by SSN: ${ssn}`);
  
  db.get('SELECT * FROM taxpayers WHERE ssn = ?', [ssn], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Taxpayer not found' });
    }
    
    res.json(row);
  });
});

// Create new taxpayer
app.post('/api/taxpayers', (req, res) => {
  const { ssn, ein, first_name, last_name, email, phone, address, bank_account } = req.body;
  
  console.log('Creating new taxpayer:', req.body);
  
  const query = `
    INSERT INTO taxpayers (ssn, ein, first_name, last_name, email, phone, address, bank_account)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [ssn, ein, first_name, last_name, email, phone, address, bank_account], function(err) {
    if (err) {
      console.error('Failed to create taxpayer:', err.message);
      return res.status(500).json({ 
        error: 'Failed to create taxpayer',
        details: err.message 
      });
    }
    
    db.get('SELECT * FROM taxpayers WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(row);
    });
  });
});

// Get all tax returns for a taxpayer
app.get('/api/taxpayers/:id/returns', (req, res) => {
  const { id } = req.params;
  
  db.all(`
    SELECT tr.*, t.ssn, t.first_name, t.last_name 
    FROM tax_returns tr
    JOIN taxpayers t ON tr.taxpayer_id = t.id
    WHERE tr.taxpayer_id = ?
  `, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json(rows);
  });
});

// Create tax return
app.post('/api/tax-returns', (req, res) => {
  const {
    taxpayer_id,
    tax_year,
    filing_status,
    total_income,
    w2_income,
    self_employment_income,
    investment_income,
    total_deductions
  } = req.body;
  
  // Calculate taxes (simplified)
  const federal_tax_owed = calculateFederalTax(total_income, total_deductions, filing_status);
  const state_tax_owed = total_income * 0.05; // Simplified 5% state tax
  const refund_amount = 0; // Simplified
  
  console.log(`Tax calculation for taxpayer ${taxpayer_id}:`, {
    total_income,
    federal_tax_owed,
    state_tax_owed
  });
  
  const query = `
    INSERT INTO tax_returns (
      taxpayer_id, tax_year, filing_status, total_income,
      w2_income, self_employment_income, investment_income,
      total_deductions, federal_tax_owed, state_tax_owed, refund_amount
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [
    taxpayer_id, tax_year, filing_status, total_income,
    w2_income, self_employment_income, investment_income,
    total_deductions, federal_tax_owed, state_tax_owed, refund_amount
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.status(201).json({ 
      id: this.lastID,
      federal_tax_owed,
      state_tax_owed,
      refund_amount
    });
  });
});

app.get('/api/admin/all-taxpayers', (req, res) => {
  db.all('SELECT * FROM taxpayers', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    console.log(`Admin accessed all taxpayer data: ${rows.length} records`);
    res.json(rows);
  });
});

app.post('/api/tax-advice', async (req, res) => {
  const { taxpayer_id } = req.body;
  
  // Get taxpayer and tax return data
  db.get('SELECT * FROM taxpayers WHERE id = ?', [taxpayer_id], async (err, taxpayer) => {
    if (err || !taxpayer) {
      return res.status(404).json({ error: 'Taxpayer not found' });
    }
    
    db.get('SELECT * FROM tax_returns WHERE taxpayer_id = ? ORDER BY tax_year DESC LIMIT 1', 
      [taxpayer_id], async (err, taxReturn) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        const prompt = `
          Provide tax advice for:
          Name: ${taxpayer.first_name} ${taxpayer.last_name}
          SSN: ${taxpayer.ssn}
          Income: $${taxReturn?.total_income || 0}
          Deductions: $${taxReturn?.total_deductions || 0}
          
          What tax strategies should they consider?
        `;
        
        console.log('Sending to AI service:', prompt);
        
        // Simulated AI response (in real app, this would call external API)
        const advice = `Based on your income of $${taxReturn?.total_income || 0}, consider maximizing retirement contributions and itemizing deductions.`;
        
        res.json({ advice });
    });
  });
});

// Add dependent
app.post('/api/dependents', (req, res) => {
  const { taxpayer_id, ssn, first_name, last_name, date_of_birth, relationship } = req.body;
  
  console.log('Adding dependent:', { ssn, first_name, last_name, date_of_birth });
  
  const query = `
    INSERT INTO dependents (taxpayer_id, ssn, first_name, last_name, date_of_birth, relationship)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [taxpayer_id, ssn, first_name, last_name, date_of_birth, relationship], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.status(201).json({ id: this.lastID });
  });
});

// Get dependents
app.get('/api/taxpayers/:id/dependents', (req, res) => {
  const { id } = req.params;
  
  db.all('SELECT * FROM dependents WHERE taxpayer_id = ?', [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json(rows);
  });
});

// VULNERABLE: Command Injection in document generation
app.post('/api/generate-document', (req, res) => {
  const { taxpayer_id, format, filename } = req.body;
  
  // Validate taxpayer exists
  db.get('SELECT * FROM taxpayers WHERE id = ?', [taxpayer_id], (err, taxpayer) => {
    if (err || !taxpayer) {
      return res.status(404).json({ error: 'Taxpayer not found' });
    }
    
    // VULNERABILITY: User-controlled filename passed directly to shell command
    const outputFile = filename || `tax_return_${taxpayer_id}`;
    const formatOption = format || 'pdf';
    
    console.log(`Generating ${formatOption} document for taxpayer ${taxpayer_id}: ${outputFile}`);
    
    // DANGEROUS: Using exec with unsanitized user input
    const { exec } = require('child_process');
    // VULNERABILITY: Filename is concatenated directly into command without sanitization
    // The command creates a file and echoes a success message
    const command = `echo "Tax Return for ${taxpayer.first_name} ${taxpayer.last_name} - SSN: ${taxpayer.ssn}" > /tmp/${outputFile}`;
    
    console.log(`Executing command: ${command}`);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command execution error: ${error.message}`);
        return res.status(500).json({
          error: 'Document generation failed',
          details: error.message,
          command: command  // VULNERABILITY: Exposing command in error
        });
      }
      
      // Log the command output to make injection obvious
      if (stdout) {
        console.log('=== COMMAND OUTPUT START ===');
        console.log(stdout);
        console.log('=== COMMAND OUTPUT END ===');
      }
      
      if (stderr) {
        console.error(`Command stderr: ${stderr}`);
      }
      
      res.json({
        success: true,
        message: `Document generated: ${outputFile}`,
        path: `/tmp/${outputFile}`,
        stdout: stdout || 'Command executed successfully'
      });
    });
  });
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function calculateFederalTax(income, deductions, filingStatus) {
  const taxableIncome = income - deductions;
  
  // Simplified 2024 tax brackets (single filer)
  if (taxableIncome <= 11000) {
    return taxableIncome * 0.10;
  } else if (taxableIncome <= 44725) {
    return 1100 + (taxableIncome - 11000) * 0.12;
  } else if (taxableIncome <= 95375) {
    return 5147 + (taxableIncome - 44725) * 0.22;
  } else if (taxableIncome <= 182100) {
    return 16290 + (taxableIncome - 95375) * 0.24;
  } else {
    return 37104 + (taxableIncome - 182100) * 0.32;
  }
}

// =============================================================================
// SERVER STARTUP
// =============================================================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  ⚠️  VULNERABLE TAX APPLICATION - TRAINING ONLY ⚠️             ║
╠════════════════════════════════════════════════════════════════╣
║  Server running on http://localhost:${PORT}                      ║
║                                                                ║
║  This application contains INTENTIONAL security                ║
║  vulnerabilities for educational purposes.                     ║
║                                                                ║
║  DO NOT use in production!                                     ║
║  DO NOT expose to the internet!                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
  
  console.log('\nAPI Endpoints:');
  console.log('  GET  /api/taxpayers/search?ssn=XXX-XX-XXXX');
  console.log('  GET  /api/taxpayers/ssn/:ssn');
  console.log('  POST /api/taxpayers');
  console.log('  GET  /api/taxpayers/:id/returns');
  console.log('  POST /api/tax-returns');
  console.log('  POST /api/tax-advice');
  console.log('  GET  /api/taxpayers/:id/dependents');
  console.log('  POST /api/dependents');
  console.log('  POST /api/generate-document');
  console.log('  GET  /api/admin/all-taxpayers');
  console.log('\nFrontend: http://localhost:3000\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('\nDatabase connection closed.');
    process.exit(0);
  });
});

// Made with Bob
