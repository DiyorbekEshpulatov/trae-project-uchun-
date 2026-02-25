"""
AI Assistant Routes - Savol-Javob, Tavsiyalar
"""
from flask import request, jsonify
from datetime import datetime
from sqlalchemy import func
import os

# OpenAI client'ni main.py dan import qilish
try:
    from main import openai_client
except ImportError:
    openai_client = None

def init_ai_routes(app, db, AIAssistant, AIFeedback, login_required):
    """AI routelari yaratish"""
    
    KNOWLEDGE_BASE = {
        'sales': [
            {'q': 'Bugun necha dona mahsulot sotildi?', 'a': 'Bugun 250 dona mahsulot sotildi'},
            {'q': 'Eng ko\'p sotilgan mahsulot qaysi?', 'a': 'Eng ko\'p A toifa mahsuloti sotildi (45%)'},
        ],
        'inventory': [
            {'q': 'Omborda qaysi mahsulot kam?', 'a': 'X mahsuloti 5 donadan kam qolgan'},
            {'q': 'Ombor jami qoldig\'i?', 'a': 'Omborda 1500 dona mahsulot bor'},
        ],
        'business': [
            {'q': 'Bugungi foyda qancha?', 'a': 'Bugungi foyda 2.5 million so\'m'},
            {'q': 'Haftalik sotuvlar?', 'a': 'Haftalik sotuvlar 50 million so\'m'},
        ]
    }

    @app.route('/api/ai/ask', methods=['POST'])
    @login_required
    def ask_ai():
        """AI ga savol berish (OpenAI -> Dinamik Baza -> Statik Baza)"""
        data = request.json
        question = data.get('question', '')
        category = data.get('category', 'business')
        
        answer = None
        confidence = 0.0
        source = "Static KB" # Javob manbasini kuzatish uchun

        # 1-qadam: OpenAI (GPT) orqali javob olishga harakat qilish
        if openai_client and os.getenv('OPENAI_API_KEY'):
            try:
                response = openai_client.chat.completions.create(
                    model='gpt-4', # yoki 'gpt-3.5-turbo'
                    messages=[
                        {
                            'role': 'system',
                            'content': "Siz O'zbekistondagi biznes uchun mo'ljallangan aqlli ERP yordamchisisiz. Savollarga o'zbek tilida, aniq va qisqa javob bering."
                        },
                        {'role': 'user', 'content': question}
                    ],
                    max_tokens=150,
                    temperature=0.5
                )
                answer = response.choices[0].message.content
                confidence = 0.98 # GPT-4 dan kelgan javobga yuqori ishonch
                source = "OpenAI GPT-4"
            except Exception as e:
                app.logger.warning(f"OpenAI API xatosi: {e}. Keyingi bosqichga o'tilmoqda.")
                answer = None

        # 2-qadam: Agar OpenAI ishlamasa, dinamik ma'lumotlar bazasidan qidirish
        if not answer:
            question_lower = question.lower()
            
            if 'bugun' in question_lower and ('sotuv' in question_lower or 'savdo' in question_lower):
                from main import SalesOrder
                today = datetime.now().date()
                total = db.session.query(func.sum(SalesOrder.total_amount)).filter(func.date(SalesOrder.order_date) == today).scalar() or 0
                count = SalesOrder.query.filter(func.date(SalesOrder.order_date) == today).count()
                answer = f"Bugun jami {count} ta savdo amalga oshirildi. Umumiy summa: {total:,.0f} so'm."
                confidence = 1.0
                source = "Database (Real-time)"
                
            elif 'ombor' in question_lower and 'kam' in question_lower:
                from main import Product
                low_stock_count = Product.query.filter(Product.quantity < Product.minimum_quantity).count()
                if low_stock_count > 0:
                    answer = f"Hozirda {low_stock_count} xil mahsulot zaxirasi minimal miqdordan kam."
                else:
                    answer = "Hozirda zaxirasi kamaygan mahsulotlar yo'q."
                confidence = 1.0
                source = "Database (Real-time)"

        # 3-qadam: Agar yuqoridagilar ishlamasa, statik bilimlar bazasidan qidirish
        if not answer and category in KNOWLEDGE_BASE:
            for item in KNOWLEDGE_BASE[category]:
                if item['q'].lower() in question.lower():
                    answer = item['a']
                    confidence = 0.85 # Statik javobga pastroq ishonch
                    source = "Static KB"
                    break
        
        # 4-qadam: Hech qanday javob topilmasa
        if not answer:
            answer = "Afsuski, bu savol bo'yicha ma'lumot topilmadi. Iltimos, savolni boshqacha tarzda bering."
            confidence = 0.0
            source = "Default"
        
        ai_record = AIAssistant(
            question=question,
            answer=answer,
            category=category,
            confidence=confidence
        )
        db.session.add(ai_record)
        db.session.commit()
        
        return jsonify({
            'question': question,
            'answer': answer,
            'confidence': confidence,
            'source': source,
            'ai_id': ai_record.id
        }), 200


    @app.route('/api/ai/feedback', methods=['POST'])
    @login_required
    def ai_feedback():
        """AI yordamchiga fikr-mulohaza"""
        data = request.json
        ai_id = data.get('ai_id')
        rating = data.get('rating')
        comment = data.get('comment', '')
        
        feedback = AIFeedback(
            ai_assistant_id=ai_id,
            rating=rating,
            comment=comment
        )
        db.session.add(feedback)
        db.session.commit()
        
        return jsonify({'message': 'Fikr-mulohaza qabul qilindi'}), 201


    @app.route('/api/ai/recommendations', methods=['GET'])
    @login_required
    def get_recommendations():
        """AI tavsiyalari"""
        recommendations = [
            {
                'type': 'inventory',
                'title': 'Ombor qoldiqlarini tekshiring',
                'description': 'X mahsuloti 5 donadan kam qolgan. Yangi buyurtma berish tavsiya etiladi',
                'priority': 'high'
            },
            {
                'type': 'sales',
                'title': 'Eng ko\'p sotilgan mahsulotlar',
                'description': 'A toifa mahsuloti haftalik 45% sotuvni tashkil etadi. Ushbu kategoriyani rivojlantiring',
                'priority': 'medium'
            },
            {
                'type': 'business',
                'title': 'Xarajat tahlili',
                'description': 'Transporta xarajati o\'tgan oyga nisbatan 15% oshdi. Taminotchini qayta tekshiring',
                'priority': 'medium'
            }
        ]
        return jsonify(recommendations), 200


    @app.route('/api/ai/analytics', methods=['GET'])
    @login_required
    def ai_analytics():
        """AI analitikasi"""
        category = request.args.get('category', 'all')
        
        if category == 'all':
            query = AIAssistant.query.all()
        else:
            query = AIAssistant.query.filter_by(category=category).all()
        
        return jsonify({
            'total_questions': len(query),
            'avg_confidence': sum([q.confidence for q in query]) / len(query) if query else 0,
            'categories': list(set([q.category for q in query])),
            'questions': [{
                'id': q.id,
                'question': q.question,
                'answer': q.answer,
                'confidence': q.confidence,
                'category': q.category,
                'created_at': q.created_at.isoformat()
            } for q in query[:10]]
        }), 200
