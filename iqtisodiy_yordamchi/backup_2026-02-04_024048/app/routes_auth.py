"""
Authentication Routes - OTP, Login, Register
"""
from flask import request, jsonify, session, render_template
from datetime import datetime, timedelta

def init_auth_routes(app, db, User, OTPCode, generate_otp, send_otp_sms):
    """Auth routelari yaratish"""
    
    @app.route('/register', methods=['GET', 'POST'])
    def register():
        """Ro'yxatdan o'tish"""
        if request.method == 'POST':
            data = request.json
            username = data.get('username')
            email = data.get('email')
            phone = data.get('phone')
            password = data.get('password')

            if User.query.filter_by(username=username).first():
                return jsonify({'error': 'Foydalanuvchi allaqachon mavjud'}), 400

            user = User(username=username, email=email, phone=phone, role_id=3)
            user.set_password(password)
            db.session.add(user)
            db.session.commit()

            return jsonify({'id': user.id, 'message': 'Ro\'yxat muvaffaqiyatli'}), 201

        return render_template('register.html')


    @app.route('/login', methods=['GET', 'POST'])
    def login():
        """Kirish va OTP yuborish"""
        if request.method == 'POST':
            data = request.json
            username = data.get('username')
            password = data.get('password')

            user = User.query.filter_by(username=username).first()
            if user and user.check_password(password) and user.is_active:
                otp_code = generate_otp()
                otp = OTPCode(
                    user_id=user.id,
                    code=otp_code,
                    expires_at=datetime.utcnow() + timedelta(minutes=5)
                )
                db.session.add(otp)
                db.session.commit()
                
                send_otp_sms(user.phone, otp_code)
                
                return jsonify({
                    'message': 'OTP kod yuborildi',
                    'user_id': user.id,
                    'otp_id': otp.id
                }), 200
            
            return jsonify({'error': 'Noto\'g\'ri foydalanuvchi yoki parol'}), 401

        return render_template('login.html')


    @app.route('/verify-otp', methods=['POST'])
    def verify_otp():
        """OTP kodini tekshirish"""
        data = request.json
        user_id = data.get('user_id')
        otp_code = data.get('otp_code')

        otp = OTPCode.query.filter_by(user_id=user_id, code=otp_code).first()
        
        if not otp:
            return jsonify({'error': 'Noto\'g\'ri OTP kod'}), 400
        
        if otp.attempts >= 3:
            return jsonify({'error': 'OTP kodini 3 marta xato kiritdingiz'}), 429
        
        if otp.expires_at < datetime.utcnow():
            return jsonify({'error': 'OTP kod muddati tugadi'}), 400
        
        otp.is_verified = True
        session['user_id'] = user_id
        session['username'] = User.query.get(user_id).username
        
        user = User.query.get(user_id)
        user.last_login = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({'message': 'Kirish muvaffaqiyatli'}), 200


    @app.route('/logout')
    def logout():
        """Chiqish"""
        session.clear()
        return jsonify({'message': 'Chiqish muvaffaqiyatli'}), 200
