// VULNERABLE FRONTEND CODE - FOR TRAINING PURPOSES ONLY

const API_BASE = 'http://localhost:3000/api';

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
}

// Create Taxpayer Form
document.getElementById('taxpayer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const taxpayerData = {
        ssn: document.getElementById('ssn').value,
        ein: document.getElementById('ein').value || null,
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value || null,
        phone: document.getElementById('phone').value || null,
        address: document.getElementById('address').value || null,
        bank_account: document.getElementById('bank_account').value || null
    };
    
    console.log('Creating taxpayer with data:', taxpayerData);
    
    try {
        const response = await fetch(`${API_BASE}/taxpayers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taxpayerData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showResult('taxpayer-result', `
                <div class="success">
                    <h3>✅ Taxpayer Created Successfully</h3>
                    <p><strong>ID:</strong> ${result.id}</p>
                    <p><strong>Name:</strong> ${result.first_name} ${result.last_name}</p>
                    <p><strong>SSN:</strong> ${result.ssn}</p>
                    ${result.ein ? `<p><strong>EIN:</strong> ${result.ein}</p>` : ''}
                    ${result.bank_account ? `<p><strong>Bank Account:</strong> ${result.bank_account}</p>` : ''}
                </div>
            `);
            
            localStorage.setItem('lastTaxpayer', JSON.stringify(result));
            
            trackEvent('taxpayer_created', {
                ssn: result.ssn,
                name: `${result.first_name} ${result.last_name}`
            });
            
            document.getElementById('taxpayer-form').reset();
        } else {
            showResult('taxpayer-result', `
                <div class="error">
                    <h3>❌ Error</h3>
                    <p>${result.error}</p>
                    ${result.details ? `<p><strong>Details:</strong> ${result.details}</p>` : ''}
                </div>
            `);
        }
    } catch (error) {
        console.error('Error creating taxpayer:', error);
        showResult('taxpayer-result', `
            <div class="error">
                <h3>❌ Network Error</h3>
                <p>${error.message}</p>
            </div>
        `);
    }
});

// Tax Return Form
document.getElementById('tax-return-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const returnData = {
        taxpayer_id: parseInt(document.getElementById('return_taxpayer_id').value),
        tax_year: parseInt(document.getElementById('tax_year').value),
        filing_status: document.getElementById('filing_status').value,
        w2_income: parseFloat(document.getElementById('w2_income').value) || 0,
        self_employment_income: parseFloat(document.getElementById('self_employment_income').value) || 0,
        investment_income: parseFloat(document.getElementById('investment_income').value) || 0,
        total_income: parseFloat(document.getElementById('total_income').value),
        total_deductions: parseFloat(document.getElementById('total_deductions').value) || 0
    };
    
    console.log('Filing tax return:', returnData);
    
    try {
        const response = await fetch(`${API_BASE}/tax-returns`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(returnData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showResult('tax-return-result', `
                <div class="success">
                    <h3>✅ Tax Return Filed Successfully</h3>
                    <p><strong>Return ID:</strong> ${result.id}</p>
                    <p><strong>Federal Tax Owed:</strong> $${result.federal_tax_owed.toFixed(2)}</p>
                    <p><strong>State Tax Owed:</strong> $${result.state_tax_owed.toFixed(2)}</p>
                    <p><strong>Total Tax:</strong> $${(result.federal_tax_owed + result.state_tax_owed).toFixed(2)}</p>
                </div>
            `);
            
            document.getElementById('tax-return-form').reset();
        } else {
            showResult('tax-return-result', `
                <div class="error">
                    <h3>❌ Error</h3>
                    <p>${result.error}</p>
                </div>
            `);
        }
    } catch (error) {
        console.error('Error filing tax return:', error);
        showResult('tax-return-result', `
            <div class="error">
                <h3>❌ Network Error</h3>
                <p>${error.message}</p>
            </div>
        `);
    }
});

// Search by SSN
async function searchBySSN() {
    const ssn = document.getElementById('search_ssn').value;
    
    if (!ssn) {
        alert('Please enter an SSN');
        return;
    }
    
    console.log('Searching for SSN:', ssn);
    
    try {
        const response = await fetch(`${API_BASE}/taxpayers/search?ssn=${ssn}`);
        const results = await response.json();
        
        if (response.ok) {
            displaySearchResults(results);
        } else {
            showResult('search-results', `
                <div class="error">
                    <h3>❌ Error</h3>
                    <p>${results.error}</p>
                    ${results.details ? `<p><strong>Details:</strong> ${results.details}</p>` : ''}
                    ${results.query ? `<p><strong>Query:</strong> <code>${results.query}</code></p>` : ''}
                </div>
            `);
        }
    } catch (error) {
        console.error('Search error:', error);
        showResult('search-results', `
            <div class="error">
                <h3>❌ Network Error</h3>
                <p>${error.message}</p>
            </div>
        `);
    }
}

// Search by Name
async function searchByName() {
    const name = document.getElementById('search_name').value;
    
    if (!name) {
        alert('Please enter a name');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/taxpayers/search?name=${encodeURIComponent(name)}`);
        const results = await response.json();
        
        if (response.ok) {
            displaySearchResults(results);
        } else {
            showResult('search-results', `
                <div class="error">
                    <h3>❌ Error</h3>
                    <p>${results.error}</p>
                </div>
            `);
        }
    } catch (error) {
        console.error('Search error:', error);
    }
}

// Display search results
function displaySearchResults(results) {
    if (results.length === 0) {
        showResult('search-results', `
            <div class="info">
                <p>No taxpayers found</p>
            </div>
        `);
        return;
    }
    
    const html = `
        <div class="success">
            <h3>Found ${results.length} Taxpayer(s)</h3>
            <table class="results-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>SSN</th>
                        <th>EIN</th>
                        <th>Email</th>
                        <th>Bank Account</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map(taxpayer => `
                        <tr>
                            <td>${taxpayer.id}</td>
                            <td>${taxpayer.first_name} ${taxpayer.last_name}</td>
                            <td class="pii-field">${taxpayer.ssn}</td>
                            <td class="pii-field">${taxpayer.ein || 'N/A'}</td>
                            <td>${taxpayer.email || 'N/A'}</td>
                            <td class="pii-field">${taxpayer.bank_account || 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    showResult('search-results', html);
}

// Get Tax Advice (AI)
async function getTaxAdvice() {
    const taxpayerId = document.getElementById('advice_taxpayer_id').value;
    
    if (!taxpayerId) {
        alert('Please enter a Taxpayer ID');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/tax-advice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taxpayer_id: parseInt(taxpayerId) })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showResult('tax-advice-result', `
                <div class="success">
                    <h3>💡 AI Tax Advice</h3>
                    <p>${result.advice}</p>
                </div>
            `);
        } else {
            showResult('tax-advice-result', `
                <div class="error">
                    <h3>❌ Error</h3>
                    <p>${result.error}</p>
                </div>
            `);
        }
    } catch (error) {
        console.error('Tax advice error:', error);
    }
}

// Generate Document Form
document.getElementById('document-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const documentData = {
        taxpayer_id: parseInt(document.getElementById('doc_taxpayer_id').value),
        format: document.getElementById('doc_format').value,
        filename: document.getElementById('doc_filename').value || null
    };
    
    console.log('Generating document:', documentData);
    
    try {
        const response = await fetch(`${API_BASE}/generate-document`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(documentData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showResult('document-result', `
                <div class="success">
                    <h3>✅ Document Generated Successfully</h3>
                    <p><strong>Message:</strong> ${result.message}</p>
                    <p><strong>Path:</strong> ${result.path}</p>
                </div>
            `);
        } else {
            showResult('document-result', `
                <div class="error">
                    <h3>❌ Error</h3>
                    <p>${result.error}</p>
                    ${result.details ? `<p><strong>Details:</strong> ${result.details}</p>` : ''}
                    ${result.command ? `<p><strong>Command:</strong> <code>${result.command}</code></p>` : ''}
                </div>
            `);
        }
    } catch (error) {
        console.error('Document generation error:', error);
        showResult('document-result', `
            <div class="error">
                <h3>❌ Network Error</h3>
                <p>${error.message}</p>
            </div>
        `);
    }
});

// Get All Taxpayers (Admin)
async function getAllTaxpayers() {
    try {
        const response = await fetch(`${API_BASE}/admin/all-taxpayers`);
        const results = await response.json();
        
        if (response.ok) {
            const html = `
                <div class="warning">
                    <h3>⚠️ All Taxpayer Data (${results.length} records)</h3>
                    <table class="results-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>SSN</th>
                                <th>EIN</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Bank Account</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${results.map(taxpayer => `
                                <tr>
                                    <td>${taxpayer.id}</td>
                                    <td>${taxpayer.first_name} ${taxpayer.last_name}</td>
                                    <td class="pii-field">${taxpayer.ssn}</td>
                                    <td class="pii-field">${taxpayer.ein || 'N/A'}</td>
                                    <td>${taxpayer.email || 'N/A'}</td>
                                    <td>${taxpayer.phone || 'N/A'}</td>
                                    <td class="pii-field">${taxpayer.bank_account || 'N/A'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            
            showResult('admin-results', html);
        } else {
            showResult('admin-results', `
                <div class="error">
                    <h3>❌ Error</h3>
                    <p>${results.error}</p>
                </div>
            `);
        }
    } catch (error) {
        console.error('Admin error:', error);
    }
}

// Helper function to show results
function showResult(elementId, html) {
    const element = document.getElementById(elementId);
    element.innerHTML = html;
    element.style.display = 'block';
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Fake analytics that logs PII
function trackEvent(eventName, data) {
    console.log('📊 Analytics Event:', eventName, data);
}

// Check localStorage for PII on page load
window.addEventListener('load', () => {
    const lastTaxpayer = localStorage.getItem('lastTaxpayer');
    if (lastTaxpayer) {
        console.log('Found taxpayer data in localStorage:', JSON.parse(lastTaxpayer));
    }
});

// Made with Bob
