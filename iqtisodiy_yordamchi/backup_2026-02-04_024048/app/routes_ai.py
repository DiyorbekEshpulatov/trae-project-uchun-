"""
AI Assistant Routes - Savol-Javob, Tavsiyalar
"""
from flask import request, jsonify
from datetime import datetime

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
        """AI ga savol berish"""
        data = request.json
        question = data.get('question', '')
        category = data.get('category', 'business')
        
        answer = None
        confidence = 0.0
        
        if category in KNOWLEDGE_BASE:
            for item in KNOWLEDGE_BASE[category]:
                if item['q'].lower() in question.lower():
                    answer = item['a']
                    confidence = 0.95
                    break
        
        if not answer:
            answer = "Afsuski, bu savol bo'yicha ma'lumot yo'q. Iltimos, administrator bilan bog'laning."
            confidence = 0.0
        
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
