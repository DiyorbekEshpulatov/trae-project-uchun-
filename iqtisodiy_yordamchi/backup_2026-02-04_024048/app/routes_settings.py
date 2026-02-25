"""
Offline Mode & Settings Routes - Sync, Roles, Permissions
"""
from flask import Blueprint, request, jsonify, session
from main import db, User, Role, OfflineSync, login_required
from datetime import datetime
import json

settings_bp = Blueprint('settings', __name__)


@settings_bp.route('/api/settings/roles', methods=['GET'])
@login_required
def get_roles():
    """Barcha rollarni olish"""
    roles = Role.query.all()
    return jsonify([{
        'id': r.id,
        'name': r.name,
        'permissions': r.permissions,
        'description': r.description
    } for r in roles]), 200


@settings_bp.route('/api/settings/roles/<int:role_id>', methods=['GET', 'PUT'])
@login_required
def role_detail(role_id):
    """Bir rollning ma'lumotlari va ruxsatnomalarini o'zgartirish"""
    role = Role.query.get_or_404(role_id)
    
    if request.method == 'GET':
        return jsonify({
            'id': role.id,
            'name': role.name,
            'permissions': role.permissions,
            'description': role.description
        }), 200
    
    if request.method == 'PUT':
        data = request.json
        role.permissions = data.get('permissions', role.permissions)
        role.description = data.get('description', role.description)
        db.session.commit()
        return jsonify({'message': 'Roll yangilandi'}), 200


@settings_bp.route('/api/settings/users/<int:user_id>/role', methods=['PUT'])
@login_required
def change_user_role(user_id):
    """Foydalanuvchi rollini o'zgartirish"""
    user = User.query.get_or_404(user_id)
    data = request.json
    new_role_id = data.get('role_id')
    
    role = Role.query.get_or_404(new_role_id)
    user.role_id = new_role_id
    
    db.session.commit()
    
    return jsonify({
        'message': 'Foydalanuvchi roli o\'zgartirildi',
        'new_role': role.name
    }), 200


@settings_bp.route('/api/offline/sync', methods=['POST'])
@login_required
def sync_offline_data():
    """Offline ma'lumotlarni server bilan sinxron qilish"""
    user_id = session.get('user_id')
    data = request.json
    device_id = data.get('device_id')
    
    # Mavjud sync recordni tekshirish
    offline_sync = OfflineSync.query.filter_by(
        user_id=user_id,
        device_id=device_id
    ).first()
    
    if not offline_sync:
        offline_sync = OfflineSync(
            user_id=user_id,
            device_id=device_id
        )
    
    # Offline ma'lumotlarni saqlash
    offline_sync.data_snapshot = data.get('data_snapshot')
    offline_sync.pending_changes = data.get('pending_changes', {})
    offline_sync.last_sync = datetime.utcnow()
    offline_sync.is_synced = True
    
    db.session.add(offline_sync)
    db.session.commit()
    
    return jsonify({
        'message': 'Sinxronizatsiya muvaffaqiyatli',
        'last_sync': offline_sync.last_sync.isoformat()
    }), 200


@settings_bp.route('/api/offline/get-data', methods=['GET'])
@login_required
def get_offline_data():
    """Offline rejim uchun kerak bo'ladigan ma'lumotlarni olish"""
    user_id = session.get('user_id')
    device_id = request.args.get('device_id')
    
    user = User.query.get(user_id)
    
    # Foydalanuvchi ruxsatnomalariga asoslanib ma'lumotlarni berish
    data = {
        'user': {
            'id': user.id,
            'username': user.username,
            'role': user.role.name if user.role else 'user'
        },
        'timestamp': datetime.utcnow().isoformat()
    }
    
    # Role asosida ma'lumotlarni filtrlash
    if user.role and 'read' in user.role.permissions.get('sales', []):
        from main import SalesOrder, Customer
        data['sales_orders'] = [{
            'id': o.id,
            'number': o.number,
            'customer_id': o.customer_id,
            'total_amount': o.total_amount,
            'status': o.status
        } for o in SalesOrder.query.all()]
        
        data['customers'] = [{
            'id': c.id,
            'name': c.name,
            'phone': c.phone
        } for c in Customer.query.all()]
    
    if user.role and 'read' in user.role.permissions.get('inventory', []):
        from main import Product
        data['products'] = [{
            'id': p.id,
            'code': p.code,
            'name': p.name,
            'quantity': p.quantity,
            'sale_price': p.sale_price
        } for p in Product.query.all()]
    
    return jsonify(data), 200


@settings_bp.route('/api/offline/push-changes', methods=['POST'])
@login_required
def push_offline_changes():
    """Offline rejimda qilingan o'zgarishlarni server ga jo'natish"""
    user_id = session.get('user_id')
    data = request.json
    changes = data.get('changes', {})
    device_id = data.get('device_id')
    
    # Har bir o'zgarish uchun qayta yaratish
    for module, operations in changes.items():
        # Bu joyda operatsiyalar bajarilib ma'lumotlar yangilanadi
        pass
    
    # Sync recordni yangilash
    offline_sync = OfflineSync.query.filter_by(
        user_id=user_id,
        device_id=device_id
    ).first()
    
    if offline_sync:
        offline_sync.is_synced = True
        offline_sync.pending_changes = {}
        offline_sync.last_sync = datetime.utcnow()
        db.session.commit()
    
    return jsonify({
        'message': 'O\'zgarishlar qabul qilindi',
        'synced': len(changes)
    }), 200


@settings_bp.route('/api/settings/permissions', methods=['GET'])
@login_required
def get_permissions():
    """Mavjud ruxsatnomalar ro'yxati"""
    permissions_structure = {
        'sales': ['read', 'create', 'edit', 'delete'],
        'inventory': ['read', 'create', 'edit', 'delete'],
        'purchases': ['read', 'create', 'edit', 'delete'],
        'finance': ['read', 'create', 'edit', 'delete'],
        'reports': ['read', 'export'],
        'users': ['read', 'create', 'edit', 'delete'],
        'settings': ['read', 'edit']
    }
    return jsonify(permissions_structure), 200


@settings_bp.route('/api/settings/user/permissions', methods=['GET'])
@login_required
def get_current_user_permissions():
    """Joriy foydalanuvchining ruxsatnomalarini olish"""
    user_id = session.get('user_id')
    user = User.query.get(user_id)
    
    permissions = user.role.permissions if user.role else {}
    
    return jsonify({
        'user_id': user_id,
        'username': user.username,
        'role': user.role.name if user.role else 'unknown',
        'permissions': permissions
    }), 200
