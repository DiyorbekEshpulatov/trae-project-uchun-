#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Simple Flask Test Server
"""

from flask import Flask, render_template_string, request, jsonify, session
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'test-secret-key-2026'

# Test credentials
TEST_USERS = {
    'deshpulatov874@gmail.com': 'Diyorbek2005',
    'admin@example.com': 'admin123'
}

@app.route('/')
def index():
    return render_template_string('''
    <!DOCTYPE html>
    <html lang="uz">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ERP Sistema - Sinov</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .container {
                background: white;
                padding: 50px;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                width: 100%;
                max-width: 500px;
            }
            h1 {
                color: #333;
                margin-bottom: 30px;
                text-align: center;
                font-size: 28px;
            }
            .status {
                background: #e8f5e9;
                border-left: 4px solid #4caf50;
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 4px;
            }
            .status.success { background: #e8f5e9; border-left-color: #4caf50; color: #2e7d32; }
            .status.info { background: #e3f2fd; border-left-color: #2196f3; color: #1565c0; }
            .form-group {
                margin-bottom: 20px;
            }
            label {
                display: block;
                margin-bottom: 8px;
                color: #333;
                font-weight: 600;
            }
            input[type="email"],
            input[type="password"] {
                width: 100%;
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                transition: border-color 0.3s;
            }
            input:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 5px rgba(102, 126, 234, 0.1);
            }
            .btn {
                width: 100%;
                padding: 12px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.3s;
            }
            .btn:hover { background: #764ba2; }
            .test-info {
                background: #f5f5f5;
                padding: 15px;
                border-radius: 4px;
                margin-top: 20px;
                font-size: 13px;
                color: #666;
            }
            .test-info h3 { margin-bottom: 10px; color: #333; }
            .test-cred {
                background: white;
                padding: 10px;
                margin: 5px 0;
                border-left: 3px solid #667eea;
            }
            .endpoints {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
            }
            .endpoint-list {
                list-style: none;
            }
            .endpoint-list li {
                padding: 8px 0;
                color: #666;
                font-size: 13px;
            }
            .endpoint-list li code {
                background: #f0f0f0;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 ERP Sistema - Sinov Ilovasi</h1>
            
            <div class="status success">
                ✅ Server muvaffaqiyatli ishga tushdi!
            </div>
            
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">📧 Email</label>
                    <input type="email" id="email" name="email" required value="deshpulatov874@gmail.com">
                </div>
                
                <div class="form-group">
                    <label for="password">🔐 Parol</label>
                    <input type="password" id="password" name="password" required value="Diyorbek2005">
                </div>
                
                <button type="submit" class="btn">Kirish</button>
            </form>
            
            <div class="test-info">
                <h3>📋 Test Hisoblar:</h3>
                <div class="test-cred">
                    <strong>1. Asosiy Hisob</strong><br>
                    Email: deshpulatov874@gmail.com<br>
                    Parol: Diyorbek2005
                </div>
                <div class="test-cred">
                    <strong>2. Admin Hisob</strong><br>
                    Email: admin@example.com<br>
                    Parol: admin123
                </div>
            </div>
            
            <div class="endpoints">
                <h3>🔌 API Endpoints:</h3>
                <ul class="endpoint-list">
                    <li><code>/</code> - Asosiy sahifa</li>
                    <li><code>/dashboard</code> - Dashboard</li>
                    <li><code>/api/login</code> - Login API</li>
                    <li><code>/api/status</code> - Server holati</li>
                    <li><code>/api/sales</code> - Savdo ro'yxati</li>
                    <li><code>/api/inventory</code> - Inventar</li>
                </ul>
            </div>
        </div>
        
        <script>
            document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                try {
                    const response = await fetch('/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        alert('✅ Kirish muvaffaqiyatli!');
                        window.location.href = '/dashboard';
                    } else {
                        alert('❌ Xatolik: ' + data.message);
                    }
                } catch (error) {
                    alert('❌ Xatolik: ' + error.message);
                }
            });
        </script>
    </body>
    </html>
    ''')

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if email in TEST_USERS and TEST_USERS[email] == password:
        session['user'] = email
        return jsonify({
            'status': 'success',
            'message': 'Kirish muvaffaqiyatli',
            'user': email
        }), 200
    else:
        return jsonify({
            'status': 'error',
            'message': 'Email yoki parol noto\'g\'ri'
        }), 401

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return '''
        <script>window.location.href = '/';</script>
        '''
    
    return render_template_string('''
    <!DOCTYPE html>
    <html lang="uz">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
            .navbar {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .navbar h1 { font-size: 24px; }
            .logout-btn {
                background: rgba(255,255,255,0.2);
                color: white;
                border: 1px solid white;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.3s;
            }
            .logout-btn:hover { background: rgba(255,255,255,0.3); }
            .container {
                max-width: 1200px;
                margin: 30px auto;
                padding: 20px;
            }
            .welcome { color: #333; margin-bottom: 30px; }
            .dashboard-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
            }
            .card {
                background: white;
                padding: 25px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                text-align: center;
                transition: transform 0.3s, box-shadow 0.3s;
            }
            .card:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.15);
            }
            .card-icon { font-size: 40px; margin-bottom: 15px; }
            .card-title { color: #333; font-size: 18px; font-weight: 600; margin-bottom: 10px; }
            .card-desc { color: #666; font-size: 14px; }
            .stats {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin-top: 30px;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 20px;
            }
            .stat-item { text-align: center; }
            .stat-number { font-size: 32px; color: #667eea; font-weight: bold; }
            .stat-label { color: #666; font-size: 14px; margin-top: 5px; }
        </style>
    </head>
    <body>
        <div class="navbar">
            <h1>📊 Dashboard</h1>
            <button class="logout-btn" onclick="logout()">Chiqish</button>
        </div>
        
        <div class="container">
            <div class="welcome">
                <h2>Xush kelibsiz! 👋</h2>
                <p style="color: #666; margin-top: 5px;">ERP Sistema Sinov Ilovasiga</p>
            </div>
            
            <div class="dashboard-grid">
                <div class="card">
                    <div class="card-icon">💳</div>
                    <div class="card-title">Savdo</div>
                    <div class="card-desc">Savdo operatsiyalarini boshqarish</div>
                </div>
                
                <div class="card">
                    <div class="card-icon">📦</div>
                    <div class="card-title">Inventar</div>
                    <div class="card-desc">Qolgan mahsulotlar</div>
                </div>
                
                <div class="card">
                    <div class="card-icon">📊</div>
                    <div class="card-title">Hisobotlar</div>
                    <div class="card-desc">Sotuvlar va daromadlar</div>
                </div>
                
                <div class="card">
                    <div class="card-icon">💰</div>
                    <div class="card-title">Soliq</div>
                    <div class="card-desc">Soliq deklaratsiyalari</div>
                </div>
                
                <div class="card">
                    <div class="card-icon">📈</div>
                    <div class="card-title">Excel</div>
                    <div class="card-desc">Jadvallar va formulalar</div>
                </div>
                
                <div class="card">
                    <div class="card-icon">🤖</div>
                    <div class="card-title">AI Yordamchi</div>
                    <div class="card-desc">Sun'iy intellekt maslahat</div>
                </div>
            </div>
            
            <div class="stats">
                <div class="stat-item">
                    <div class="stat-number">1,250</div>
                    <div class="stat-label">Savdolar</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">450</div>
                    <div class="stat-label">Mahsulotlar</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">125M</div>
                    <div class="stat-label">Daromad (UZS)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">98%</div>
                    <div class="stat-label">Samaradorlik</div>
                </div>
            </div>
        </div>
        
        <script>
            function logout() {
                if (confirm('Chiqishga rozisiz?')) {
                    fetch('/api/logout', { method: 'POST' })
                        .then(() => window.location.href = '/');
                }
            }
        </script>
    </body>
    </html>
    ''')

@app.route('/api/logout', methods=['POST'])
def api_logout():
    session.clear()
    return jsonify({'status': 'success'}), 200

@app.route('/api/status')
def api_status():
    return jsonify({
        'status': 'online',
        'app': 'ERP Sistema',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat(),
        'database': 'SQLite',
        'language': 'Uzbek, Russian, English'
    }), 200

@app.route('/api/sales')
def api_sales():
    return jsonify({
        'status': 'success',
        'data': [
            {
                'id': 1,
                'invoice': 'INV-001',
                'customer': 'ABC Kompaniya',
                'amount': 50000,
                'date': '2026-02-04',
                'status': 'Yakunlangan'
            },
            {
                'id': 2,
                'invoice': 'INV-002',
                'customer': 'XYZ Savdo',
                'amount': 75000,
                'date': '2026-02-04',
                'status': 'Kutilmoqda'
            }
        ]
    }), 200

@app.route('/api/inventory')
def api_inventory():
    return jsonify({
        'status': 'success',
        'data': [
            {
                'id': 1,
                'product': 'Telefon',
                'quantity': 150,
                'unit': 'dona',
                'price': 2500000
            },
            {
                'id': 2,
                'product': 'Laptop',
                'quantity': 45,
                'unit': 'dona',
                'price': 8500000
            }
        ]
    }), 200

if __name__ == '__main__':
    print("\n" + "="*60)
    print("   🚀 ERP SISTEMA TEST VERSIYASI")
    print("="*60)
    print("\n📍 Server manzili: http://localhost:5000")
    print("📊 Dashboard:     http://localhost:5000/dashboard")
    print("\n🔐 Test Hisoblar:")
    print("   1. deshpulatov874@gmail.com : Diyorbek2005")
    print("   2. admin@example.com : admin123")
    print("\n⏳ Server ishga tushmoqda... (Ctrl+C bilan toʻxtatish)")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
