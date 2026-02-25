from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db

# ==================== MODELS ====================

class User(db.Model):
    """Foydalanuvchi modeli"""
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), default=3)
    is_active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    role = db.relationship('Role', backref='users')
    otp_codes = db.relationship('OTPCode', backref='user', lazy=True, cascade='all, delete-orphan')
    offline_syncs = db.relationship('OfflineSync', backref='user', lazy=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    permissions = db.Column(db.JSON)
    description = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class OTPCode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    code = db.Column(db.String(6), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime)
    attempts = db.Column(db.Integer, default=0)

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    address = db.Column(db.String(200))
    inn = db.Column(db.String(50))
    credit_limit = db.Column(db.Float, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    sales_orders = db.relationship('SalesOrder', backref='customer', lazy=True)
    invoices = db.relationship('Invoice', backref='customer', lazy=True)

class Supplier(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    address = db.Column(db.String(200))
    inn = db.Column(db.String(50))
    bank_account = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    purchase_orders = db.relationship('PurchaseOrder', backref='supplier', lazy=True)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(50))
    unit = db.Column(db.String(20))
    purchase_price = db.Column(db.Float, nullable=False)
    sale_price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, default=0)
    minimum_quantity = db.Column(db.Integer, default=10)
    description = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    sales_items = db.relationship('SalesOrderItem', backref='product', lazy=True)
    purchase_items = db.relationship('PurchaseOrderItem', backref='product', lazy=True)

class SalesOrder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(50), unique=True, nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    delivery_date = db.Column(db.DateTime)
    total_amount = db.Column(db.Float, default=0)
    discount = db.Column(db.Float, default=0)
    tax_amount = db.Column(db.Float, default=0)
    status = db.Column(db.String(50), default='Yangi')
    items = db.relationship('SalesOrderItem', backref='sales_order', lazy=True, cascade='all, delete-orphan')
    invoices = db.relationship('Invoice', backref='sales_order', lazy=True)

class SalesOrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sales_order_id = db.Column(db.Integer, db.ForeignKey('sales_order.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    discount = db.Column(db.Float, default=0)

class PurchaseOrder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(50), unique=True, nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'), nullable=False)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    expected_delivery = db.Column(db.DateTime)
    total_amount = db.Column(db.Float, default=0)
    status = db.Column(db.String(50), default='Yangi')
    items = db.relationship('PurchaseOrderItem', backref='purchase_order', lazy=True, cascade='all, delete-orphan')

class PurchaseOrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    purchase_order_id = db.Column(db.Integer, db.ForeignKey('purchase_order.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)

class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(50), unique=True, nullable=False)
    inventory_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default='Boshlangan')
    items = db.relationship('InventoryItem', backref='inventory', lazy=True, cascade='all, delete-orphan')

class InventoryItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    inventory_id = db.Column(db.Integer, db.ForeignKey('inventory.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    product_code = db.Column(db.String(50))
    expected_quantity = db.Column(db.Integer)
    actual_quantity = db.Column(db.Integer)
    difference = db.Column(db.Integer)

class Invoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(50), unique=True, nullable=False)
    sales_order_id = db.Column(db.Integer, db.ForeignKey('sales_order.id'))
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    invoice_date = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime)
    total_amount = db.Column(db.Float, default=0)
    paid_amount = db.Column(db.Float, default=0)
    status = db.Column(db.String(50), default='Yangi')

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    provider = db.Column(db.String(50))
    provider_id = db.Column(db.String(200))
    amount = db.Column(db.Float)
    currency = db.Column(db.String(10), default='UZS')
    status = db.Column(db.String(50))
    metadata = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class CashRegister(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(50), unique=True)
    balance = db.Column(db.Float, default=0)
    currency = db.Column(db.String(10), default='UZS')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    transactions = db.relationship('CashTransaction', backref='cash_register', lazy=True)

class CashTransaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cash_register_id = db.Column(db.Integer, db.ForeignKey('cash_register.id'), nullable=False)
    transaction_date = db.Column(db.DateTime, default=datetime.utcnow)
    transaction_type = db.Column(db.String(50))
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200))
    reference = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(50), unique=True, nullable=False)
    category = db.Column(db.String(50))
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200))
    expense_date = db.Column(db.DateTime, default=datetime.utcnow)
    payment_method = db.Column(db.String(50))
    status = db.Column(db.String(50), default='Yangi')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class JournalEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    entry_number = db.Column(db.String(50), unique=True, nullable=False)
    entry_date = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.String(200))
    debit_account = db.Column(db.String(50))
    credit_account = db.Column(db.String(50))
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='Yangi')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)
    account_type = db.Column(db.String(50))
    balance = db.Column(db.Float, default=0)
    currency = db.Column(db.String(10), default='UZS')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class AIAssistant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(500), nullable=False)
    answer = db.Column(db.Text)
    category = db.Column(db.String(50))
    confidence = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class AIFeedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ai_assistant_id = db.Column(db.Integer, db.ForeignKey('ai_assistant.id'), nullable=False)
    rating = db.Column(db.Integer)
    comment = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class InventoryLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    transaction_type = db.Column(db.String(50))
    quantity = db.Column(db.Integer)
    notes = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class OfflineSync(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    device_id = db.Column(db.String(100))
    data_snapshot = db.Column(db.JSON)
    last_sync = db.Column(db.DateTime, default=datetime.utcnow)
    pending_changes = db.Column(db.JSON)
    is_synced = db.Column(db.Boolean, default=False)

class SystemConfig(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(50), unique=True, nullable=False)
    value = db.Column(db.String(500))
    description = db.Column(db.String(200))
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    report_type = db.Column(db.String(50))
    created_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    data = db.Column(db.JSON)
    chart_type = db.Column(db.String(50))
    export_format = db.Column(db.String(50))

class DataIngest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(100))
    filename = db.Column(db.String(200))
    payload = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ValidationReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ingest_id = db.Column(db.Integer, db.ForeignKey('data_ingest.id'))
    valid = db.Column(db.Boolean, default=True)
    errors = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Forecast(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer)
    window_days = db.Column(db.Integer, default=7)
    forecast_date = db.Column(db.DateTime, default=datetime.utcnow)
    predicted = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)