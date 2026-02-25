// Excel Functions Server - Excel funksiyalarini JSda realizatsiya qilish
// Bu server Excel dagi barcha funksiyalarni JavaScriptda takrorlaydi

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8087;

// Excel formulalari va funksiyalari
const EXCEL_FUNCTIONS = {
  // Matematik funksiyalar
  SUM: (range) => range.reduce((sum, val) => sum + (parseFloat(val) || 0), 0),
  AVERAGE: (range) => {
    const numbers = range.filter(val => !isNaN(parseFloat(val)));
    return numbers.length > 0 ? numbers.reduce((sum, val) => sum + parseFloat(val), 0) / numbers.length : 0;
  },
  COUNT: (range) => range.filter(val => !isNaN(parseFloat(val))).length,
  MAX: (range) => Math.max(...range.filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val))),
  MIN: (range) => Math.min(...range.filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val))),
  ROUND: (number, digits = 0) => Math.round(parseFloat(number) * Math.pow(10, digits)) / Math.pow(10, digits),
  ABS: (number) => Math.abs(parseFloat(number)),
  POWER: (base, exponent) => Math.pow(parseFloat(base), parseFloat(exponent)),
  SQRT: (number) => Math.sqrt(parseFloat(number)),
  
  // Statistik funksiyalar
  COUNTA: (range) => range.filter(val => val !== null && val !== undefined && val !== '').length,
  COUNTBLANK: (range) => range.filter(val => val === null || val === undefined || val === '').length,
  MEDIAN: (range) => {
    const numbers = range.filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val)).sort((a, b) => a - b);
    if (numbers.length === 0) return 0;
    const mid = Math.floor(numbers.length / 2);
    return numbers.length % 2 === 0 ? (numbers[mid - 1] + numbers[mid]) / 2 : numbers[mid];
  },
  MODE: (range) => {
    const numbers = range.filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val));
    if (numbers.length === 0) return 0;
    const frequency = {};
    numbers.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
    });
    let maxFreq = 0;
    let mode = 0;
    for (const num in frequency) {
      if (frequency[num] > maxFreq) {
        maxFreq = frequency[num];
        mode = parseFloat(num);
      }
    }
    return mode;
  },
  
  // Matn funksiyalar
  CONCATENATE: (...args) => args.join(''),
  LEFT: (text, numChars = 1) => String(text).substring(0, parseInt(numChars)),
  RIGHT: (text, numChars = 1) => String(text).substring(String(text).length - parseInt(numChars)),
  MID: (text, startNum, numChars) => {
    const str = String(text);
    const start = parseInt(startNum) - 1;
    const length = parseInt(numChars);
    return str.substring(start, start + length);
  },
  LEN: (text) => String(text).length,
  UPPER: (text) => String(text).toUpperCase(),
  LOWER: (text) => String(text).toLowerCase(),
  TRIM: (text) => String(text).trim(),
  SUBSTITUTE: (text, oldText, newText, instanceNum = null) => {
    const str = String(text);
    const old = String(oldText);
    const newStr = String(newText);
    
    if (instanceNum === null) {
      return str.split(old).join(newStr);
    } else {
      const regex = new RegExp(old, 'g');
      let count = 0;
      return str.replace(regex, (match) => {
        count++;
        return count === parseInt(instanceNum) ? newStr : match;
      });
    }
  },
  
  // Mantiqiy funksiyalar
  IF: (condition, trueValue, falseValue) => {
    return condition ? trueValue : falseValue;
  },
  AND: (...args) => args.every(arg => arg),
  OR: (...args) => args.some(arg => arg),
  NOT: (logical) => !logical,
  TRUE: () => true,
  FALSE: () => false,
  
  // Sana va vaqt funksiyalar
  TODAY: () => new Date().toISOString().split('T')[0],
  NOW: () => new Date().toISOString(),
  YEAR: (serialNumber) => {
    const date = new Date(serialNumber);
    return date.getFullYear();
  },
  MONTH: (serialNumber) => {
    const date = new Date(serialNumber);
    return date.getMonth() + 1;
  },
  DAY: (serialNumber) => {
    const date = new Date(serialNumber);
    return date.getDate();
  },
  DATE: (year, month, day) => {
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString().split('T')[0];
  },
  
  // Moliyaviy funksiyalar
  PMT: (rate, nper, pv, fv = 0, type = 0) => {
    // Kredit to'lovi hisoblash
    const r = parseFloat(rate);
    const n = parseFloat(nper);
    const p = parseFloat(pv);
    const f = parseFloat(fv);
    const t = parseInt(type);
    
    if (r === 0) {
      return -(p + f) / n;
    } else {
      const pvif = Math.pow(1 + r, n);
      const pmt = -r * (p * pvif + f) / (pvif - 1);
      return t === 1 ? pmt / (1 + r) : pmt;
    }
  },
  PV: (rate, nper, pmt, fv = 0, type = 0) => {
    // Joriy qiymat hisoblash
    const r = parseFloat(rate);
    const n = parseFloat(nper);
    const p = parseFloat(pmt);
    const f = parseFloat(fv);
    const t = parseInt(type);
    
    if (r === 0) {
      return -(p * n + f);
    } else {
      const pvif = Math.pow(1 + r, n);
      const pv = (p * (1 + r * t) * (1 - 1 / pvif) / r - f) / pvif;
      return pv;
    }
  },
  FV: (rate, nper, pmt, pvValue = 0, type = 0) => {
    // Kelajakdagi qiymat hisoblash
    const r = parseFloat(rate);
    const n = parseFloat(nper);
    const p = parseFloat(pmt);
    const pv = parseFloat(pvValue);
    const t = parseInt(type);
    
    if (r === 0) {
      return -(pv + p * n);
    } else {
      const pvif = Math.pow(1 + r, n);
      const fv = -(pv * pvif + p * (1 + r * t) * (pvif - 1) / r);
      return fv;
    }
  },
  
  // Qidiruv va murojaat funksiyalar
  VLOOKUP: (lookupValue, tableArray, colIndexNum, rangeLookup = true) => {
    const value = lookupValue;
    const table = tableArray;
    const colIndex = parseInt(colIndexNum);
    const exactMatch = !rangeLookup;
    
    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      if (exactMatch) {
        if (row[0] === value) {
          return row[colIndex - 1];
        }
      } else {
        if (row[0] >= value) {
          return row[colIndex - 1];
        }
      }
    }
    return '#N/A';
  },
  HLOOKUP: (lookupValue, tableArray, rowIndexNum, rangeLookup = true) => {
    const value = lookupValue;
    const table = tableArray;
    const rowIndex = parseInt(rowIndexNum);
    const exactMatch = !rangeLookup;
    
    if (table.length > 0 && rowIndex <= table[0].length) {
      for (let i = 0; i < table[0].length; i++) {
        const cellValue = table[0][i];
        if (exactMatch) {
          if (cellValue === value) {
            return table[rowIndex - 1][i];
          }
        } else {
          if (cellValue >= value) {
            return table[rowIndex - 1][i];
          }
        }
      }
    }
    return '#N/A';
  },
  INDEX: (array, rowNum, columnNum = 1) => {
    const arr = array;
    const row = parseInt(rowNum) - 1;
    const col = parseInt(columnNum) - 1;
    
    if (row >= 0 && row < arr.length && col >= 0 && col < arr[row].length) {
      return arr[row][col];
    }
    return '#REF!';
  },
  MATCH: (lookupValue, lookupArray, matchType = 1) => {
    const value = lookupValue;
    const array = lookupArray;
    const type = parseInt(matchType);
    
    for (let i = 0; i < array.length; i++) {
      if (type === 0) {
        if (array[i] === value) return i + 1;
      } else if (type === 1) {
        if (array[i] >= value) return i + 1;
      } else if (type === -1) {
        if (array[i] <= value) return i + 1;
      }
    }
    return '#N/A';
  }
};

// Excel jadvali (data grid)
let EXCEL_DATA = {
  sheets: {
    'Sheet1': {
      data: [
        ['Mahsulot', 'Narx', 'Soni', 'Jami'],
        ['Kompyuter', 1500, 5, '=B2*C2'],
        ['Telefon', 800, 10, '=B3*C3'],
        ['Printer', 300, 3, '=B4*C4'],
        ['Monitor', 400, 7, '=B5*C5'],
        ['', '', '', '=SUM(D2:D5)']
      ],
      formulas: {
        'D2': '=B2*C2',
        'D3': '=B3*C3',
        'D4': '=B4*C4',
        'D5': '=B5*C5',
        'D6': '=SUM(D2:D5)'
      }
    },
    'Sheet2': {
      data: [
        ['Oylar', 'Sotuv', 'Xarajatlar', 'Foyda'],
        ['Yanvar', 50000, 30000, '=B2-C2'],
        ['Fevral', 60000, 35000, '=B3-C3'],
        ['Mart', 55000, 32000, '=B4-C4'],
        ['', '', '', '=SUM(D2:D4)']
      ],
      formulas: {
        'D2': '=B2-C2',
        'D3': '=B3-C3',
        'D4': '=B4-C4',
        'D5': '=SUM(D2:D4)'
      }
    }
  }
};

// Formula parser
function parseFormula(formula, row = 0, col = 0) {
  if (!formula.startsWith('=')) return formula;
  
  const expression = formula.substring(1);
  
  try {
    // Oddiy formula parser (osonlashtirilgan)
    let result = expression;
    
    // SUM funksiyasini qayta ishlash
    result = result.replace(/SUM\(([^)]+)\)/g, (match, range) => {
      const values = parseRange(range, row, col);
      return EXCEL_FUNCTIONS.SUM(values);
    });
    
    // AVERAGE funksiyasini qayta ishlash
    result = result.replace(/AVERAGE\(([^)]+)\)/g, (match, range) => {
      const values = parseRange(range, row, col);
      return EXCEL_FUNCTIONS.AVERAGE(values);
    });
    
    // Oddiy arifmetik amallar
    result = result.replace(/([A-Z]+)(\d+)/g, (match, colStr, rowNum) => {
      const colNum = colStr.charCodeAt(0) - 'A'.charCodeAt(0);
      const cellValue = getCellValue(parseInt(rowNum) - 1, colNum);
      return cellValue;
    });
    
    // Xavfsiz hisoblash
    return Function('"use strict"; return (' + result + ')')();
  } catch (error) {
    return '#ERROR!';
  }
}

// Diapazonni parser qilish
function parseRange(range, currentRow, currentCol) {
  const rangeMatch = range.match(/([A-Z]+)(\d+):([A-Z]+)(\d+)/);
  if (rangeMatch) {
    const [, startCol, startRow, endCol, endRow] = rangeMatch;
    const startColNum = startCol.charCodeAt(0) - 'A'.charCodeAt(0);
    const endColNum = endCol.charCodeAt(0) - 'A'.charCodeAt(0);
    const startRowNum = parseInt(startRow) - 1;
    const endRowNum = parseInt(endRow) - 1;
    
    const values = [];
    for (let row = startRowNum; row <= endRowNum; row++) {
      for (let col = startColNum; col <= endColNum; col++) {
        values.push(getCellValue(row, col));
      }
    }
    return values;
  }
  return [];
}

// Katak qiymatini olish
function getCellValue(row, col, sheetName = 'Sheet1') {
  const sheet = EXCEL_DATA.sheets[sheetName];
  if (sheet && sheet.data[row] && sheet.data[row][col] !== undefined) {
    const value = sheet.data[row][col];
    
    // Agar bu formula bo'lsa
    const cellKey = String.fromCharCode(65 + col) + (row + 1);
    if (sheet.formulas && sheet.formulas[cellKey]) {
      return parseFormula(sheet.formulas[cellKey], row, col);
    }
    
    // Agar bu formula bo'lsa lekin ko'rsatilmagan
    if (typeof value === 'string' && value.startsWith('=')) {
      return parseFormula(value, row, col);
    }
    
    return value;
  }
  return '';
}

// Katak qiymatini o'rnatish
function setCellValue(row, col, value, sheetName = 'Sheet1') {
  if (!EXCEL_DATA.sheets[sheetName]) {
    EXCEL_DATA.sheets[sheetName] = { data: [], formulas: {} };
  }
  
  const sheet = EXCEL_DATA.sheets[sheetName];
  if (!sheet.data[row]) {
    sheet.data[row] = [];
  }
  
  sheet.data[row][col] = value;
  
  // Agar bu formula bo'lsa
  if (typeof value === 'string' && value.startsWith('=')) {
    const cellKey = String.fromCharCode(65 + col) + (row + 1);
    sheet.formulas[cellKey] = value;
  }
}

// Excel funksiyasini bajarish
function executeExcelFunction(functionName, ...args) {
  const func = EXCEL_FUNCTIONS[functionName.toUpperCase()];
  if (func) {
    try {
      return func(...args);
    } catch (error) {
      return '#ERROR!';
    }
  }
  return '#NAME?';
}

// Pivot jadval yaratish
function createPivotTable(data, rows = [], columns = [], values = [], aggFunc = 'sum') {
  const pivot = {};
  
  data.forEach(row => {
    const rowKey = rows.map(r => row[r]).join('|');
    const colKey = columns.map(c => row[c]).join('|');
    
    if (!pivot[rowKey]) pivot[rowKey] = {};
    if (!pivot[rowKey][colKey]) pivot[rowKey][colKey] = [];
    
    values.forEach(valueField => {
      pivot[rowKey][colKey].push(parseFloat(row[valueField]) || 0);
    });
  });
  
  // Agregatsiya funksiyasi
  const aggregated = {};
  for (const rowKey in pivot) {
    aggregated[rowKey] = {};
    for (const colKey in pivot[rowKey]) {
      const values = pivot[rowKey][colKey];
      switch (aggFunc.toLowerCase()) {
        case 'sum':
          aggregated[rowKey][colKey] = values.reduce((sum, val) => sum + val, 0);
          break;
        case 'average':
          aggregated[rowKey][colKey] = values.reduce((sum, val) => sum + val, 0) / values.length;
          break;
        case 'count':
          aggregated[rowKey][colKey] = values.length;
          break;
        case 'max':
          aggregated[rowKey][colKey] = Math.max(...values);
          break;
        case 'min':
          aggregated[rowKey][colKey] = Math.min(...values);
          break;
        default:
          aggregated[rowKey][colKey] = values.reduce((sum, val) => sum + val, 0);
      }
    }
  }
  
  return aggregated;
}

// Data filtratsiyasi
function filterData(data, criteria) {
  return data.filter(row => {
    return Object.keys(criteria).every(field => {
      const criterion = criteria[field];
      const value = row[field];
      
      if (typeof criterion === 'object') {
        // Murakkab filtrlar
        if (criterion.operator === 'equals') return value === criterion.value;
        if (criterion.operator === 'not_equals') return value !== criterion.value;
        if (criterion.operator === 'greater') return parseFloat(value) > parseFloat(criterion.value);
        if (criterion.operator === 'less') return parseFloat(value) < parseFloat(criterion.value);
        if (criterion.operator === 'greater_equal') return parseFloat(value) >= parseFloat(criterion.value);
        if (criterion.operator === 'less_equal') return parseFloat(value) <= parseFloat(criterion.value);
        if (criterion.operator === 'contains') return String(value).includes(criterion.value);
        if (criterion.operator === 'starts_with') return String(value).startsWith(criterion.value);
        if (criterion.operator === 'ends_with') return String(value).endsWith(criterion.value);
      } else {
        // Oddiy tenglik
        return value === criterion;
      }
      return true;
    });
  });
}

// Data sortirovkasi
function sortData(data, sortBy, order = 'asc') {
  return data.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    // Raqamlarni solishtirish
    if (!isNaN(parseFloat(aVal)) && !isNaN(parseFloat(bVal))) {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    }
    
    if (order.toLowerCase() === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
}

// HTML sahifa
function generateHTML() {
  return `<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📊 Excel Funksiyalari Tizimi</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); 
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
        .header h1 { color: #4f46e5; margin-bottom: 10px; }
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
            color: #4f46e5; 
            margin-bottom: 15px; 
            border-bottom: 2px solid #e5e7eb; 
            padding-bottom: 10px;
        }
        .btn { 
            background: #4f46e5; 
            color: white; 
            border: none; 
            padding: 10px 20px; 
            border-radius: 5px; 
            cursor: pointer; 
            margin: 5px;
            transition: all 0.3s ease;
        }
        .btn:hover { 
            background: #3730a3; 
            transform: translateY(-1px);
        }
        .btn-success { background: #10b981; }
        .btn-success:hover { background: #059669; }
        .btn-warning { background: #f59e0b; }
        .btn-warning:hover { background: #d97706; }
        .excel-grid {
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            gap: 1px;
            background: #e5e7eb;
            border: 1px solid #d1d5db;
            margin: 15px 0;
        }
        .excel-cell {
            background: white;
            padding: 8px;
            text-align: center;
            min-height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            border: 1px solid #e5e7eb;
        }
        .excel-cell.header {
            background: #f3f4f6;
            font-weight: bold;
            color: #374151;
        }
        .excel-cell.formula {
            background: #fef3c7;
            color: #92400e;
        }
        .input-group {
            margin-bottom: 15px;
        }
        .input-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #374151;
        }
        .input-group input, .input-group select, .input-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 5px;
            font-size: 14px;
        }
        .result {
            background: #f9fafb;
            padding: 15px;
            border-radius: 5px;
            margin-top: 15px;
            border-left: 4px solid #4f46e5;
        }
        .function-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin-top: 15px;
        }
        .function-item {
            background: #f3f4f6;
            padding: 10px;
            border-radius: 5px;
            border-left: 3px solid #4f46e5;
        }
        .function-name {
            font-weight: bold;
            color: #4f46e5;
            margin-bottom: 5px;
        }
        .function-desc {
            font-size: 12px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Excel Funksiyalari Tizimi</h1>
            <p>Professional Excel funksiyalari JavaScriptda</p>
        </div>
        
        <div class="nav">
            <a href="/">🏠 Bosh sahifa</a>
            <a href="http://localhost:8080/dashboard">📈 Dashboard</a>
            <a href="http://localhost:8081/import-export">📊 Import/Export</a>
            <a href="http://localhost:8082/reports">📋 Hisobotlar</a>
            <a href="http://localhost:8083/profile">👤 Profil</a>
            <a href="http://localhost:8084/categories">📂 Kategoriyalar</a>
            <a href="http://localhost:8085/notifications">📧 Xabarnomalar</a>
            <a href="http://localhost:8086/accounting">💰 Buxgalteriya</a>
        </div>

        <div class="grid">
            <div class="card">
                <h2>🧮 Excel Funksiyasi Kalkulyatori</h2>
                <div class="input-group">
                    <label>Funksiya nomi:</label>
                    <select id="functionName">
                        <option value="SUM">SUM - Yig'indi</option>
                        <option value="AVERAGE">AVERAGE - O'rta qiymat</option>
                        <option value="COUNT">COUNT - Hisoblash</option>
                        <option value="MAX">MAX - Maksimal</option>
                        <option value="MIN">MIN - Minimal</option>
                        <option value="ROUND">ROUND - Yaxlitlash</option>
                        <option value="IF">IF - Shartli funksiya</option>
                        <option value="CONCATENATE">CONCATENATE - Birlashtirish</option>
                        <option value="VLOOKUP">VLOOKUP - Vertikal qidiruv</option>
                        <option value="PMT">PMT - Kredit to'lovi</option>
                        <option value="TODAY">TODAY - Bugungi sana</option>
                        <option value="DATE">DATE - Sana yaratish</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Argumentlar (vergul bilan ajrating):</label>
                    <textarea id="functionArgs" rows="3" placeholder="Masalan: 10,20,30,40,50"></textarea>
                </div>
                <button class="btn btn-success" onclick="executeFunction()">🧮 Hisoblash</button>
                <div id="functionResult" class="result" style="display: none;">
                    <strong>Natija:</strong> <span id="resultValue"></span>
                </div>
            </div>

            <div class="card">
                <h2>📊 Excel Jadvali</h2>
                <div class="input-group">
                    <label>Varaq nomi:</label>
                    <select id="sheetName" onchange="loadSheet()">
                        <option value="Sheet1">Sheet1 - Mahsulotlar</option>
                        <option value="Sheet2">Sheet2 - Sotuv hisoboti</option>
                    </select>
                </div>
                <div id="excelGrid" class="excel-grid"></div>
                <button class="btn btn-warning" onclick="recalculateFormulas()">🔄 Formulalarni qayta hisoblash</button>
            </div>

            <div class="card">
                <h2>🎯 Pivot Jadval</h2>
                <div class="input-group">
                    <label>Qatorlar (vergul bilan):</label>
                    <input type="text" id="pivotRows" value="0" placeholder="Masalan: 0,1">
                </div>
                <div class="input-group">
                    <label>Ustunlar (vergul bilan):</label>
                    <input type="text" id="pivotCols" value="2" placeholder="Masalan: 2">
                </div>
                <div class="input-group">
                    <label>Qiymatlar (vergul bilan):</label>
                    <input type="text" id="pivotValues" value="3" placeholder="Masalan: 3">
                </div>
                <div class="input-group">
                    <label>Agregatsiya funksiyasi:</label>
                    <select id="pivotAgg">
                        <option value="sum">SUM - Yig'indi</option>
                        <option value="average">AVERAGE - O'rta qiymat</option>
                        <option value="count">COUNT - Hisoblash</option>
                        <option value="max">MAX - Maksimal</option>
                        <option value="min">MIN - Minimal</option>
                    </select>
                </div>
                <button class="btn btn-success" onclick="createPivotTable()">📊 Pivot Jadval Yaratish</button>
                <div id="pivotResult"></div>
            </div>

            <div class="card">
                <h2>🔍 Data Filtratsiyasi</h2>
                <div class="input-group">
                    <label>Filtr maydoni:</label>
                    <input type="text" id="filterField" value="1" placeholder="Maydon indeksi (0 dan boshlanadi)">
                </div>
                <div class="input-group">
                    <label>Operator:</label>
                    <select id="filterOperator">
                        <option value="equals">Teng</option>
                        <option value="not_equals">Teng emas</option>
                        <option value="greater">Katta</option>
                        <option value="less">Kichik</option>
                        <option value="contains">O'z ichiga oladi</option>
                        <option value="starts_with">Bilan boshlanadi</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Qiymat:</label>
                    <input type="text" id="filterValue" placeholder="Filtr qiymati">
                </div>
                <button class="btn btn-success" onclick="filterData()">🔍 Filtrlash</button>
                <div id="filterResult"></div>
            </div>
        </div>

        <div class="card">
            <h2>📚 Barcha Excel Funksiyalari</h2>
            <div class="function-list">
                <div class="function-item">
                    <div class="function-name">SUM</div>
                    <div class="function-desc">Yig'indi hisoblash</div>
                </div>
                <div class="function-item">
                    <div class="function-name">AVERAGE</div>
                    <div class="function-desc">O'rta qiymat hisoblash</div>
                </div>
                <div class="function-item">
                    <div class="function-name">COUNT</div>
                    <div class="function-desc">Raqamlarni hisoblash</div>
                </div>
                <div class="function-item">
                    <div class="function-name">MAX/MIN</div>
                    <div class="function-desc">Maksimal/Minimal qiymat</div>
                </div>
                <div class="function-item">
                    <div class="function-name">IF</div>
                    <div class="function-desc">Shartli funksiya</div>
                </div>
                <div class="function-item">
                    <div class="function-name">VLOOKUP</div>
                    <div class="function-desc">Vertikal qidiruv</div>
                </div>
                <div class="function-item">
                    <div class="function-name">CONCATENATE</div>
                    <div class="function-desc">Matnlarni birlashtirish</div>
                </div>
                <div class="function-item">
                    <div class="function-name">PMT/PV/FV</div>
                    <div class="function-desc">Moliyaviy funksiyalar</div>
                </div>
                <div class="function-item">
                    <div class="function-name">TODAY/NOW</div>
                    <div class="function-desc">Sana va vaqt funksiyalari</div>
                </div>
                <div class="function-item">
                    <div class="function-name">ROUND/ABS</div>
                    <div class="function-desc">Matematik funksiyalar</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Excel funksiyasini bajarish
        function executeFunction() {
            const functionName = document.getElementById('functionName').value;
            const functionArgs = document.getElementById('functionArgs').value;
            
            if (!functionArgs) {
                alert('Iltimos, argumentlarni kiriting!');
                return;
            }
            
            // Argumentlarni ajratish
            const args = functionArgs.split(',').map(arg => {
                const trimmed = arg.trim();
                // Agar bu raqam bo'lsa
                if (!isNaN(trimmed)) {
                    return parseFloat(trimmed);
                }
                // Agar bu mantiqiy qiymat bo'lsa
                if (trimmed.toLowerCase() === 'true') return true;
                if (trimmed.toLowerCase() === 'false') return false;
                // Boshqa hollarda matn sifatida
                return trimmed;
            });
            
            fetch('/api/excel-function', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    functionName: functionName,
                    args: args
                })
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('resultValue').textContent = data.result;
                document.getElementById('functionResult').style.display = 'block';
            })
            .catch(error => {
                console.error('Xatolik:', error);
                alert('Funksiyani bajarishda xatolik yuz berdi!');
            });
        }
        
        // Excel varaqini yuklash
        function loadSheet() {
            const sheetName = document.getElementById('sheetName').value;
            
            fetch(\`/api/excel-sheet/\${sheetName}\`)
                .then(response => response.json())
                .then(data => {
                    const gridDiv = document.getElementById('excelGrid');
                    gridDiv.innerHTML = '';
                    
                    // Jadvalni ko'rsatish
                    data.data.forEach((row, rowIndex) => {
                        if (row) {
                            row.forEach((cell, colIndex) => {
                                const cellDiv = document.createElement('div');
                                cellDiv.className = 'excel-cell';
                                
                                // Agar bu header bo'lsa
                                if (rowIndex === 0) {
                                    cellDiv.className += ' header';
                                }
                                
                                // Agar bu formula bo'lsa
                                const cellKey = String.fromCharCode(65 + colIndex) + (rowIndex + 1);
                                if (data.formulas && data.formulas[cellKey]) {
                                    cellDiv.className += ' formula';
                                    cellDiv.title = \`Formula: \${data.formulas[cellKey]}\`;
                                }
                                
                                cellDiv.textContent = cell !== undefined ? cell : '';
                                gridDiv.appendChild(cellDiv);
                            });
                        }
                    });
                })
                .catch(error => {
                    console.error('Xatolik:', error);
                    alert('Excel varaqini yuklashda xatolik yuz berdi!');
                });
        }
        
        // Formulalarni qayta hisoblash
        function recalculateFormulas() {
            const sheetName = document.getElementById('sheetName').value;
            
            fetch(\`/api/excel-sheet/\${sheetName}/recalculate\`, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                loadSheet(); // Jadvalni qayta yuklash
                alert('✅ Formulalar muvaffaqiyatli qayta hisoblandi!');
            })
            .catch(error => {
                console.error('Xatolik:', error);
                alert('Formulalarni qayta hisoblashda xatolik yuz berdi!');
            });
        }
        
        // Pivot jadval yaratish
        function createPivotTable() {
            const rows = document.getElementById('pivotRows').value.split(',').map(r => parseInt(r.trim()));
            const cols = document.getElementById('pivotCols').value.split(',').map(c => parseInt(c.trim()));
            const values = document.getElementById('pivotValues').value.split(',').map(v => parseInt(v.trim()));
            const aggFunc = document.getElementById('pivotAgg').value;
            
            fetch('/api/pivot-table', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sheetName: 'Sheet1',
                    rows: rows,
                    columns: cols,
                    values: values,
                    aggFunc: aggFunc
                })
            })
            .then(response => response.json())
            .then(data => {
                const resultDiv = document.getElementById('pivotResult');
                resultDiv.innerHTML = \`
                    <div class="result" style="margin-top: 15px;">
                        <h4>📊 Pivot Jadval Natijasi:</h4>
                        <pre>\${JSON.stringify(data, null, 2)}</pre>
                    </div>
                \`;
            })
            .catch(error => {
                console.error('Xatolik:', error);
                alert('Pivot jadval yaratishda xatolik yuz berdi!');
            });
        }
        
        // Data filtratsiyasi
        function filterData() {
            const field = parseInt(document.getElementById('filterField').value);
            const operator = document.getElementById('filterOperator').value;
            const value = document.getElementById('filterValue').value;
            
            if (!value) {
                alert('Iltimos, filtr qiymatini kiriting!');
                return;
            }
            
            fetch('/api/filter-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sheetName: 'Sheet1',
                    criteria: {
                        [field]: {
                            operator: operator,
                            value: isNaN(value) ? value : parseFloat(value)
                        }
                    }
                })
            })
            .then(response => response.json())
            .then(data => {
                const resultDiv = document.getElementById('filterResult');
                resultDiv.innerHTML = \`
                    <div class="result" style="margin-top: 15px;">
                        <h4>🔍 Filtr Natijasi (\${data.length} ta yozuv):</h4>
                        <table class="table" style="margin-top: 10px;">
                            \${data.map(row => \`
                                <tr>\${row.map(cell => \`<td>\${cell}</td>\`).join('')}</tr>
                            \`).join('')}
                        </table>
                    </div>
                \`;
            })
            .catch(error => {
                console.error('Xatolik:', error);
                alert('Data filtratsiyasida xatolik yuz berdi!');
            });
        }
        
        // Sahifa yuklanganda
        document.addEventListener('DOMContentLoaded', function() {
            loadSheet();
        });
    </script>
</body>
</html>`;
}

// Server sozlamalari
const server = http.createServer((req, res) => {
  console.log('📊 Excel Functions Request:', req.method, req.url);

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
  if (cleanUrl === '/' || cleanUrl === '/excel') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(generateHTML());
    return;
  }

  // Excel funksiyasini bajarish
  if (cleanUrl === '/api/excel-function' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { functionName, args } = JSON.parse(body);
        const result = executeExcelFunction(functionName, ...args);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ result }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Function execution failed' }));
      }
    });
    return;
  }

  // Excel varaqini olish
  if (cleanUrl.startsWith('/api/excel-sheet/')) {
    const parts = cleanUrl.split('/');
    const sheetName = parts[3];
    
    if (parts[4] === 'recalculate' && req.method === 'POST') {
      // Formulalarni qayta hisoblash
      const sheet = EXCEL_DATA.sheets[sheetName];
      if (sheet) {
        for (const cellKey in sheet.formulas) {
          const match = cellKey.match(/([A-Z])(\d+)/);
          if (match) {
            const col = match[1].charCodeAt(0) - 'A'.charCodeAt(0);
            const row = parseInt(match[2]) - 1;
            const result = parseFormula(sheet.formulas[cellKey], row, col);
            if (sheet.data[row]) {
              sheet.data[row][col] = result;
            }
          }
        }
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Formulas recalculated' }));
      return;
    }
    
    const sheet = EXCEL_DATA.sheets[sheetName];
    if (sheet) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(sheet));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Sheet not found' }));
    }
    return;
  }

  // Pivot jadval
  if (cleanUrl === '/api/pivot-table' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { sheetName, rows, columns, values, aggFunc } = JSON.parse(body);
        const sheet = EXCEL_DATA.sheets[sheetName];
        
        if (sheet) {
          const pivotData = createPivotTable(sheet.data, rows, columns, values, aggFunc);
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(pivotData));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Sheet not found' }));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Pivot table creation failed' }));
      }
    });
    return;
  }

  // Data filtratsiyasi
  if (cleanUrl === '/api/filter-data' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { sheetName, criteria } = JSON.parse(body);
        const sheet = EXCEL_DATA.sheets[sheetName];
        
        if (sheet) {
          const filteredData = filterData(sheet.data, criteria);
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(filteredData));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Sheet not found' }));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Data filtering failed' }));
      }
    });
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>404 - Sahifa topilmadi</h1>');
});

server.listen(PORT, () => {
  console.log('📊 Excel Functions Server running at http://localhost:' + PORT);
  console.log('🔢 Available Excel functions:');
  console.log('   SUM, AVERAGE, COUNT, MAX, MIN, ROUND, ABS');
  console.log('   IF, AND, OR, NOT, TRUE, FALSE');
  console.log('   CONCATENATE, LEFT, RIGHT, MID, LEN, UPPER, LOWER');
  console.log('   TODAY, NOW, YEAR, MONTH, DAY, DATE');
  console.log('   PMT, PV, FV, VLOOKUP, HLOOKUP, INDEX, MATCH');
});