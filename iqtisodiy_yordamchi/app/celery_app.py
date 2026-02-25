"""
Celery async tasks for data export, forecasting, ingestion
"""
from celery import Celery
import os
from dotenv import load_dotenv

load_dotenv()

celery = Celery(
    'erp_tasks',
    broker=os.getenv('REDIS_URL', 'redis://localhost:6379/0'),
    backend=os.getenv('REDIS_URL', 'redis://localhost:6379/0')
)

celery.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)


@celery.task(name='export_sales_report')
def export_sales_report(start_date, end_date, format='xlsx'):
    """Export sales report asynchronously"""
    from app.main import db, SalesOrder
    from datetime import datetime
    import json
    
    try:
        orders = SalesOrder.query.filter(
            SalesOrder.order_date >= start_date,
            SalesOrder.order_date <= end_date
        ).all()
        
        result = {
            'status': 'success',
            'count': len(orders),
            'format': format,
            'filename': f'sales_report_{start_date}_{end_date}.{format}'
        }
        return result
    except Exception as e:
        return {'status': 'error', 'message': str(e)}


@celery.task(name='compute_forecast')
def compute_forecast(product_id=None, method='holt_winters', days=30):
    """Compute forecast asynchronously"""
    from app.main import db, Forecast, SalesOrder, SalesOrderItem
    from datetime import datetime, timedelta
    
    try:
        if product_id:
            since = datetime.utcnow() - timedelta(days=days)
            items = db.session.query(SalesOrderItem).join(SalesOrder).filter(
                SalesOrderItem.product_id == product_id,
                SalesOrder.order_date >= since
            ).all()
            daily = {}
            for it in items:
                date = it.sales_order.order_date.date()
                daily[date] = daily.get(date, 0) + it.quantity
            series = list(daily.values()) if daily else [0]
        else:
            since = datetime.utcnow() - timedelta(days=days)
            q = db.session.query(SalesOrder.order_date, db.func.sum(SalesOrder.total_amount).label('total'))\
                .filter(SalesOrder.order_date >= since)\
                .group_by(db.func.date(SalesOrder.order_date))\
                .order_by(SalesOrder.order_date.asc())
            series = [float(r.total or 0) for r in q.all()]
        
        forecast_val = sum(series[-7:]) / 7 if series else 0
        f = Forecast(product_id=product_id, window_days=days, predicted=forecast_val)
        db.session.add(f)
        db.session.commit()
        
        return {'status': 'success', 'forecast': forecast_val, 'method': method}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}


@celery.task(name='process_ingest')
def process_ingest(ingest_id):
    """Process data ingestion asynchronously"""
    from app.main import db, DataIngest, ValidationReport
    import json
    
    try:
        ingest = DataIngest.query.get(ingest_id)
        if not ingest:
            return {'status': 'error', 'message': 'Ingest not found'}
        
        # Simulate processing
        payload = ingest.payload if isinstance(ingest.payload, dict) else json.loads(ingest.payload)
        errors = []
        
        if 'sales_orders' in payload:
            for i, so in enumerate(payload['sales_orders']):
                if 'customer_id' not in so:
                    errors.append({'path': f'sales_orders[{i}]', 'error': 'missing customer_id'})
        
        report = ValidationReport(ingest_id=ingest_id, valid=(len(errors) == 0), errors=errors)
        db.session.add(report)
        db.session.commit()
        
        return {'status': 'success', 'ingest_id': ingest_id, 'errors_count': len(errors)}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}
