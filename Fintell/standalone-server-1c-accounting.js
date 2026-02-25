// 1C Accounting System - Buxgalteriya hisoblarini boshqarish tizimi
// Bu server 1C dasturidagi barcha buxgalteriya funksiyalarini realizatsiya qiladi

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8086;

// 1C dagi hisoblar turlari va strukturasi
const ACCOUNT_TYPES = {
  ACTIVE: 'active',        // Aktiv hisoblar
  PASSIVE: 'passive',      // Passiv hisoblar
  ACTIVE_PASSIVE: 'active-passive', // Aktiv-passiv hisoblar
  OFF_BALANCE: 'off-balance'       // Balansdan tashqari hisoblar
};

// 1C dagi operatsiya turlari
const OPERATION_TYPES = {
  INCOME: 'income',        // Kirim
  EXPENSE: 'expense',      // Chiqim
  TRANSFER: 'transfer',    // O'tkazma
  CORRECTION: 'correction' // Tuzatma
};

// Buxgalteriya hisoblari plani (1C dagi Chart of Accounts)
const CHART_OF_ACCOUNTS = [
  { code: '1000', name: 'Kassa', type: ACCOUNT_TYPES.ACTIVE, balance: 'debit' },
  { code: '1200', name: 'Bank hisoblari', type: ACCOUNT_TYPES.ACTIVE, balance: 'debit' },
  { code: '2000', name: 'Tovarlar', type: ACCOUNT_TYPES.ACTIVE, balance: 'debit' },
  { code: '3000', name: 'Asosiy vositalar', type: ACCOUNT_TYPES.ACTIVE, balance: 'debit' },
  { code: '4000', name: 'Soliqlar', type: ACCOUNT_TYPES.ACTIVE, balance: 'debit' },
  { code: '5000', name: 'Kreditlar', type: ACCOUNT_TYPES.PASSIVE, balance: 'credit' },
  { code: '6000', name: 'Daromadlar', type: ACCOUNT_TYPES.PASSIVE, balance: 'credit' },
  { code: '7000', name: 'Xarajatlar', type: ACCOUNT_TYPES.ACTIVE, balance: 'debit' },
  { code: '8000', name: 'Foyda', type: ACCOUNT_TYPES.PASSIVE, balance: 'credit' },
  { code: '9000', name: 'Zarar', type: ACCOUNT_TYPES.ACTIVE, balance: 'debit' }
];

// Tranzaksiyalar jurnali (1C dagi transaction journal)
let TRANSACTIONS = [
  {
    id: '1',
    date: '2024-01-01',
    number: '000001',
    description: 'Kirim - Mijozdan tolov',
    entries: [
      { account: '1200', debit: 1000, credit: 0, description: 'Bank hisobiga kirim' },
      { account: '6000', debit: 0, credit: 1000, description: 'Daromadlar hisobiga' }
    ],
    type: OPERATION_TYPES.INCOME,
    status: 'posted',
    total: 1000
  },
  {
    id: '2',
    date: '2024-01-02',
    number: '000002',
    description: 'Chiqim - Xarajatlar',
    entries: [
      { account: '7000', debit: 500, credit: 0, description: 'Xarajatlar' },
      { account: '1200', debit: 0, credit: 500, description: 'Bank hisobidan chiqim' }
    ],
    type: OPERATION_TYPES.EXPENSE,
    status: 'posted',
    total: 500
  }
];

// Balans hisoboti (1C dagi Balance Sheet)
function generateBalanceSheet(date = new Date()) {
  const assets = CHART_OF_ACCOUNTS.filter(acc => acc.type === ACCOUNT_TYPES.ACTIVE);
  const liabilities = CHART_OF_ACCOUNTS.filter(acc => acc.type === ACCOUNT_TYPES.PASSIVE);
  
  const balanceSheet = {
    date: date.toISOString().split('T')[0],
    assets: {
      total: calculateTotalByType(ACCOUNT_TYPES.ACTIVE),
      accounts: assets.map(acc => ({
        code: acc.code,
        name: acc.name,
        balance: getAccountBalance(acc.code)
      }))
    },
    liabilities: {
      total: calculateTotalByType(ACCOUNT_TYPES.PASSIVE),
      accounts: liabilities.map(acc => ({
        code: acc.code,
        name: acc.name,
        balance: getAccountBalance(acc.code)
      }))
    }
  };
  
  return balanceSheet;
}

// Foyda-zarar hisoboti (1C dagi Income Statement)
function generateIncomeStatement(startDate, endDate) {
  const incomeAccounts = CHART_OF_ACCOUNTS.filter(acc => acc.code.startsWith('6'));
  const expenseAccounts = CHART_OF_ACCOUNTS.filter(acc => acc.code.startsWith('7'));
  
  const incomeStatement = {
    period: { start: startDate, end: endDate },
    income: {
      total: incomeAccounts.reduce((sum, acc) => sum + getAccountBalance(acc.code), 0),
      accounts: incomeAccounts.map(acc => ({
        code: acc.code,
        name: acc.name,
        amount: getAccountBalance(acc.code)
      }))
    },
    expenses: {
      total: expenseAccounts.reduce((sum, acc) => sum + getAccountBalance(acc.code), 0),
      accounts: expenseAccounts.map(acc => ({
        code: acc.code,
        name: acc.name,
        amount: getAccountBalance(acc.code)
      }))
    },
    netProfit: 0
  };
  
  incomeStatement.netProfit = incomeStatement.income.total - incomeStatement.expenses.total;
  return incomeStatement;
}

// Hisob qoldig'i (1C dagi Account Balance)
function getAccountBalance(accountCode) {
  let balance = 0;
  TRANSACTIONS.forEach(transaction => {
    transaction.entries.forEach(entry => {
      if (entry.account === accountCode) {
        balance += entry.debit - entry.credit;
      }
    });
  });
  return Math.abs(balance);
}

// Jami hisoblash
function calculateTotalByType(accountType) {
  const accounts = CHART_OF_ACCOUNTS.filter(acc => acc.type === accountType);
  return accounts.reduce((total, acc) => total + getAccountBalance(acc.code), 0);
}

// Yangi tranzaksiya yaratish (1C dagi Create Transaction)
function createTransaction(transactionData) {
  const newTransaction = {
    id: Date.now().toString(),
    date: transactionData.date || new Date().toISOString().split('T')[0],
    number: `0000${TRANSACTIONS.length + 1}`,
    description: transactionData.description,
    entries: transactionData.entries,
    type: transactionData.type,
    status: 'draft',
    total: calculateTransactionTotal(transactionData.entries)
  };
  
  TRANSACTIONS.push(newTransaction);
  return newTransaction;
}

// Tranzaksiya jami hisoblash
function calculateTransactionTotal(entries) {
  const debitTotal = entries.reduce((sum, entry) => sum + entry.debit, 0);
  const creditTotal = entries.reduce((sum, entry) => sum + entry.credit, 0);
  return Math.max(debitTotal, creditTotal);
}

// Tranzaksiyani tasdiqlash (1C dagi Post Transaction)
function postTransaction(transactionId) {
  const transaction = TRANSACTIONS.find(t => t.id === transactionId);
  if (transaction) {
    transaction.status = 'posted';
    return transaction;
  }
  return null;
}

// Oborot-saldo vedomost (1C dagi Trial Balance)
function generateTrialBalance(date = new Date()) {
  const trialBalance = {
    date: date.toISOString().split('T')[0],
    accounts: CHART_OF_ACCOUNTS.map(acc => {
      const balance = getAccountBalance(acc.code);
      return {
        code: acc.code,
        name: acc.name,
        type: acc.type,
        openingBalance: 0,
        debitTurnover: calculateDebitTurnover(acc.code),
        creditTurnover: calculateCreditTurnover(acc.code),
        closingBalance: balance
      };
    })
  };
  
  return trialBalance;
}

// Debit va credit oborotlarini hisoblash
function calculateDebitTurnover(accountCode) {
  let turnover = 0;
  TRANSACTIONS.forEach(transaction => {
    transaction.entries.forEach(entry => {
      if (entry.account === accountCode && entry.debit > 0) {
        turnover += entry.debit;
      }
    });
  });
  return turnover;
}

function calculateCreditTurnover(accountCode) {
  let turnover = 0;
  TRANSACTIONS.forEach(transaction => {
    transaction.entries.forEach(entry => {
      if (entry.account === accountCode && entry.credit > 0) {
        turnover += entry.credit;
      }
    });
  });
  return turnover;
}

// HTML sahifa
function generateHTML() {
  return `<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>1C Buxgalteriya - Smart Accounting</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            min-height: 100vh; 
            color: #333;
        }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .header { 
            background: white; 
            padding: 20px; 
            border-radius: 10px; 
            margin-bottom: 20px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
            text-align: center;
        }
        .header h1 { color: #2563eb; margin-bottom: 10px; }
        .nav { 
            display: flex; 
            gap: 15px; 
            margin-bottom: 20px; 
            flex-wrap: wrap;
            justify-content: center;
        }
        .nav a { 
            color: white; 
            text-decoration: none; 
            padding: 10px 20px; 
            background: rgba(255,255,255,0.2); 
            border-radius: 5px; 
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        .nav a:hover { 
            background: rgba(255,255,255,0.3); 
            transform: translateY(-2px);
        }
        .grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); 
            gap: 20px; 
        }
        .card { 
            background: white; 
            padding: 20px; 
            border-radius: 10px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
        }
        .card h2 { 
            color: #2563eb; 
            margin-bottom: 15px; 
            border-bottom: 2px solid #e5e7eb; 
            padding-bottom: 10px;
        }
        .btn { 
            background: #2563eb; 
            color: white; 
            border: none; 
            padding: 10px 20px; 
            border-radius: 5px; 
            cursor: pointer; 
            margin: 5px;
            transition: all 0.3s ease;
        }
        .btn:hover { 
            background: #1d4ed8; 
            transform: translateY(-1px);
        }
        .btn-success { background: #10b981; }
        .btn-success:hover { background: #059669; }
        .btn-warning { background: #f59e0b; }
        .btn-warning:hover { background: #d97706; }
        .table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 15px;
        }
        .table th, .table td { 
            border: 1px solid #e5e7eb; 
            padding: 8px; 
            text-align: left; 
        }
        .table th { 
            background: #f9fafb; 
            font-weight: bold; 
        }
        .stats { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
            gap: 15px; 
            margin: 20px 0;
        }
        .stat-item { 
            background: #f3f4f6; 
            padding: 15px; 
            border-radius: 8px; 
            text-align: center;
        }
        .stat-value { 
            font-size: 24px; 
            font-weight: bold; 
            color: #2563eb; 
        }
        .stat-label { 
            color: #6b7280; 
            font-size: 14px; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 1C Buxgalteriya Tizimi</h1>
            <p>Smart Accounting - Professional buxgalteriya hisoboti</p>
        </div>
        
        <div class="nav">
            <a href="/">🏠 Bosh sahifa</a>
            <a href="http://localhost:8080/dashboard">📈 Dashboard</a>
            <a href="http://localhost:8081/import-export">📊 Import/Export</a>
            <a href="http://localhost:8082/reports">📋 Hisobotlar</a>
            <a href="http://localhost:8083/profile">👤 Profil</a>
            <a href="http://localhost:8084/categories">📂 Kategoriyalar</a>
            <a href="http://localhost:8085/notifications">📧 Xabarnomalar</a>
        </div>

        <div class="grid">
            <div class="card">
                <h2>📈 Balans Hisoboti</h2>
                <div class="stats">
                    <div class="stat-item">
                        <div class="stat-value">${calculateTotalByType(ACCOUNT_TYPES.ACTIVE).toLocaleString()}</div>
                        <div class="stat-label">Jami Aktivlar</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${calculateTotalByType(ACCOUNT_TYPES.PASSIVE).toLocaleString()}</div>
                        <div class="stat-label">Jami Passivlar</div>
                    </div>
                </div>
                <button class="btn btn-success" onclick="generateBalanceSheet()">🔄 Balansni Yangilash</button>
                <div id="balanceSheetResult"></div>
            </div>

            <div class="card">
                <h2>💰 Foyda-Zarar Hisoboti</h2>
                <div class="stats">
                    <div class="stat-item">
                        <div class="stat-value">${TRANSACTIONS.filter(t => t.type === OPERATION_TYPES.INCOME).length}</div>
                        <div class="stat-label">Kirim Tranzaksiyalar</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${TRANSACTIONS.filter(t => t.type === OPERATION_TYPES.EXPENSE).length}</div>
                        <div class="stat-label">Chiqim Tranzaksiyalar</div>
                    </div>
                </div>
                <button class="btn btn-success" onclick="generateIncomeStatement()">📊 Hisobot Ko'rish</button>
                <div id="incomeStatementResult"></div>
            </div>

            <div class="card">
                <h2>📋 Oborot-Saldo Vedomosti</h2>
                <button class="btn btn-warning" onclick="generateTrialBalance()">⚖️ Vedomosti Ko'rish</button>
                <div id="trialBalanceResult"></div>
            </div>

            <div class="card">
                <h2>➕ Yangi Tranzaksiya</h2>
                <form id="transactionForm">
                    <div style="margin-bottom: 15px;">
                        <label>Tarif:</label>
                        <input type="text" id="description" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label>Summa:</label>
                        <input type="number" id="amount" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label>Turi:</label>
                        <select id="type" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="income">Kirim</option>
                            <option value="expense">Chiqim</option>
                            <option value="transfer">O'tkazma</option>
                        </select>
                    </div>
                    <button type="button" class="btn btn-success" onclick="createTransaction()">💾 Saqlash</button>
                </form>
            </div>
        </div>

        <div class="card">
            <h2>📜 Tranzaksiyalar Jurnali</h2>
            <button class="btn" onclick="loadTransactions()">🔄 Yangilash</button>
            <div id="transactionsList"></div>
        </div>
    </div>

    <script>
        // Balans hisobotini generatsiya qilish
        function generateBalanceSheet() {
            fetch('/api/balance-sheet')
                .then(response => response.json())
                .then(data => {
                    const resultDiv = document.getElementById('balanceSheetResult');
                    resultDiv.innerHTML = \`
                        <div style="margin-top: 20px;">
                            <h4>📅 Sana: \${data.date}</h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
                                <div>
                                    <h4>💰 Aktivlar (Jami: \${data.assets.total.toLocaleString()}):</h4>
                                    \${data.assets.accounts.map(acc => \`
                                        <div style="padding: 5px; border-bottom: 1px solid #eee;">
                                            \${acc.code} - \${acc.name}: \${acc.balance.toLocaleString()}
                                        </div>
                                    \`).join('')}
                                </div>
                                <div>
                                    <h4>📊 Passivlar (Jami: \${data.liabilities.total.toLocaleString()}):</h4>
                                    \${data.liabilities.accounts.map(acc => \`
                                        <div style="padding: 5px; border-bottom: 1px solid #eee;">
                                            \${acc.code} - \${acc.name}: \${acc.balance.toLocaleString()}
                                        </div>
                                    \`).join('')}
                                </div>
                            </div>
                        </div>
                    \`;
                })
                .catch(error => {
                    console.error('Xatolik:', error);
                    alert('Balans hisobotini generatsiya qilishda xatolik yuz berdi!');
                });
        }

        // Foyda-zarar hisobotini generatsiya qilish
        function generateIncomeStatement() {
            const startDate = '2024-01-01';
            const endDate = new Date().toISOString().split('T')[0];
            
            fetch(\`/api/income-statement?start=\${startDate}&end=\${endDate}\`)
                .then(response => response.json())
                .then(data => {
                    const resultDiv = document.getElementById('incomeStatementResult');
                    resultDiv.innerHTML = \`
                        <div style="margin-top: 20px;">
                            <h4>📅 Davr: \${data.period.start} - \${data.period.end}</h4>
                            <div style="margin-top: 15px;">
                                <h4>📈 Daromadlar (Jami: \${data.income.total.toLocaleString()}):</h4>
                                \${data.income.accounts.map(acc => \`
                                    <div style="padding: 5px; border-bottom: 1px solid #eee;">
                                        \${acc.code} - \${acc.name}: \${acc.amount.toLocaleString()}
                                    </div>
                                \`).join('')}
                            </div>
                            <div style="margin-top: 15px;">
                                <h4>📉 Xarajatlar (Jami: \${data.expenses.total.toLocaleString()}):</h4>
                                \${data.expenses.accounts.map(acc => \`
                                    <div style="padding: 5px; border-bottom: 1px solid #eee;">
                                        \${acc.code} - \${acc.name}: \${acc.amount.toLocaleString()}
                                    </div>
                                \`).join('')}
                            </div>
                            <div style="margin-top: 20px; padding: 15px; background: \${data.netProfit >= 0 ? '#dcfce7' : '#fef2f2'}; border-radius: 8px;">
                                <h4>\${data.netProfit >= 0 ? '💰 Sof Foyda' : '📉 Sof Zarar'}: \${Math.abs(data.netProfit).toLocaleString()}</h4>
                            </div>
                        </div>
                    \`;
                })
                .catch(error => {
                    console.error('Xatolik:', error);
                    alert('Foyda-zarar hisobotini generatsiya qilishda xatolik yuz berdi!');
                });
        }

        // Oborot-saldo vedomostini generatsiya qilish
        function generateTrialBalance() {
            fetch('/api/trial-balance')
                .then(response => response.json())
                .then(data => {
                    const resultDiv = document.getElementById('trialBalanceResult');
                    resultDiv.innerHTML = \`
                        <div style="margin-top: 20px;">
                            <h4>📅 Sana: \${data.date}</h4>
                            <table class="table" style="margin-top: 15px;">
                                <thead>
                                    <tr>
                                        <th>Hisob</th>
                                        <th>Nomi</th>
                                        <th>Saldo Boshlang'ich</th>
                                        <th>Debit Oborot</th>
                                        <th>Credit Oborot</th>
                                        <th>Saldo Yakuniy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    \${data.accounts.map(acc => \`
                                        <tr>
                                            <td>\${acc.code}</td>
                                            <td>\${acc.name}</td>
                                            <td>\${acc.openingBalance.toLocaleString()}</td>
                                            <td>\${acc.debitTurnover.toLocaleString()}</td>
                                            <td>\${acc.creditTurnover.toLocaleString()}</td>
                                            <td>\${acc.closingBalance.toLocaleString()}</td>
                                        </tr>
                                    \`).join('')}
                                </tbody>
                            </table>
                        </div>
                    \`;
                })
                .catch(error => {
                    console.error('Xatolik:', error);
                    alert('Oborot-saldo vedomostini generatsiya qilishda xatolik yuz berdi!');
                });
        }

        // Yangi tranzaksiya yaratish
        function createTransaction() {
            const description = document.getElementById('description').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const type = document.getElementById('type').value;

            if (!description || !amount) {
                alert('Iltimos, barcha maydonlarni to\'ldiring!');
                return;
            }

            const transactionData = {
                description: description,
                amount: amount,
                type: type,
                entries: generateTransactionEntries(type, amount, description)
            };

            fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData)
            })
            .then(response => response.json())
            .then(data => {
                alert('✅ Tranzaksiya muvaffaqiyatli yaratildi!');
                document.getElementById('transactionForm').reset();
                loadTransactions();
            })
            .catch(error => {
                console.error('Xatolik:', error);
                alert('Tranzaksiya yaratishda xatolik yuz berdi!');
            });
        }

        // Tranzaksiya yozuvlarini generatsiya qilish
        function generateTransactionEntries(type, amount, description) {
            const entries = [];
            
            switch (type) {
                case 'income':
                    entries.push(
                        { account: '1200', debit: amount, credit: 0, description: description },
                        { account: '6000', debit: 0, credit: amount, description: description }
                    );
                    break;
                case 'expense':
                    entries.push(
                        { account: '7000', debit: amount, credit: 0, description: description },
                        { account: '1200', debit: 0, credit: amount, description: description }
                    );
                    break;
                case 'transfer':
                    entries.push(
                        { account: '1000', debit: amount, credit: 0, description: description },
                        { account: '1200', debit: 0, credit: amount, description: description }
                    );
                    break;
            }
            
            return entries;
        }

        // Tranzaksiyalar ro'yxatini yuklash
        function loadTransactions() {
            fetch('/api/transactions')
                .then(response => response.json())
                .then(data => {
                    const listDiv = document.getElementById('transactionsList');
                    listDiv.innerHTML = \`
                        <table class="table" style="margin-top: 15px;">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Sana</th>
                                    <th>Tarif</th>
                                    <th>Turi</th>
                                    <th>Summa</th>
                                    <th>Holati</th>
                                    <th>Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                \${data.map((transaction, index) => \`
                                    <tr>
                                        <td>\${transaction.number}</td>
                                        <td>\${transaction.date}</td>
                                        <td>\${transaction.description}</td>
                                        <td>\${transaction.type}</td>
                                        <td>\${transaction.total.toLocaleString()}</td>
                                        <td>
                                            <span style="padding: 4px 8px; border-radius: 4px; background: \${
                                                transaction.status === 'posted' ? '#dcfce7' : 
                                                transaction.status === 'draft' ? '#fef3c7' : '#fee2e2'
                                            }; color: \${
                                                transaction.status === 'posted' ? '#166534' : 
                                                transaction.status === 'draft' ? '#92400e' : '#991b1b'
                                            };">
                                                \${transaction.status}
                                            </span>
                                        </td>
                                        <td>
                                            \${transaction.status === 'draft' ? 
                                                \`<button class="btn btn-success" onclick="postTransaction('\${transaction.id}')">✅ Tasdiqlash</button>\` : 
                                                ''
                                            }
                                        </td>
                                    </tr>
                                \`).join('')}
                            </tbody>
                        </table>
                    \`;
                })
                .catch(error => {
                    console.error('Xatolik:', error);
                    alert('Tranzaksiyalar ro\'yxatini yuklashda xatolik yuz berdi!');
                });
        }

        // Tranzaksiyani tasdiqlash
        function postTransaction(transactionId) {
            fetch(\`/api/transactions/\${transactionId}/post\`, {
                method: 'PUT'
            })
            .then(response => response.json())
            .then(data => {
                alert('✅ Tranzaksiya tasdiqlandi!');
                loadTransactions();
            })
            .catch(error => {
                console.error('Xatolik:', error);
                alert('Tranzaksiyani tasdiqlashda xatolik yuz berdi!');
            });
        }

        // Sahifa yuklanganda tranzaksiyalarni yuklash
        document.addEventListener('DOMContentLoaded', function() {
            loadTransactions();
        });
    </script>
</body>
</html>`;
}

// Server sozlamalari
const server = http.createServer((req, res) => {
  console.log('📨 1C Accounting Request:', req.method, req.url);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Vite client va boshqa yo'nalishlar uchun
  if (req.url === '/@vite/client') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end('// Vite client mock\nconsole.log("Vite client connected");');
    return;
  }

  // Query parametrlarini olib tashlash
  const cleanUrl = req.url.split('?')[0];

  // Asosiy sahifa
  if (cleanUrl === '/' || cleanUrl === '/accounting') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(generateHTML());
    return;
  }

  // API endpointlar
  if (cleanUrl === '/api/balance-sheet') {
    const balanceSheet = generateBalanceSheet();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(balanceSheet));
    return;
  }

  if (cleanUrl.startsWith('/api/income-statement')) {
    const url = new URL(req.url, 'http://localhost:8086');
    const startDate = url.searchParams.get('start') || '2024-01-01';
    const endDate = url.searchParams.get('end') || new Date().toISOString().split('T')[0];
    
    const incomeStatement = generateIncomeStatement(startDate, endDate);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(incomeStatement));
    return;
  }

  if (cleanUrl === '/api/trial-balance') {
    const trialBalance = generateTrialBalance();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(trialBalance));
    return;
  }

  if (cleanUrl === '/api/transactions') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(TRANSACTIONS));
      return;
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const transactionData = JSON.parse(body);
          const newTransaction = createTransaction(transactionData);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newTransaction));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid transaction data' }));
        }
      });
      return;
    }
  }

  if (cleanUrl.startsWith('/api/transactions/') && cleanUrl.endsWith('/post')) {
    const transactionId = cleanUrl.split('/')[3];
    const postedTransaction = postTransaction(transactionId);
    
    if (postedTransaction) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(postedTransaction));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Transaction not found' }));
    }
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>404 - Sahifa topilmadi</h1>');
});

server.listen(PORT, () => {
  console.log('🚀 1C Accounting System running at http://localhost:' + PORT);
  console.log('📊 Available endpoints:');
  console.log('   GET  /api/balance-sheet');
  console.log('   GET  /api/income-statement');
  console.log('   GET  /api/trial-balance');
  console.log('   GET  /api/transactions');
  console.log('   POST /api/transactions');
  console.log('   PUT  /api/transactions/:id/post');
});