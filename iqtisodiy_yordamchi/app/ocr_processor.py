#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OCR (Optical Character Recognition) Moduli
Qogozi hujjatlarni skanerlash va matn ajratib olish
Tesseract.js (JavaScript) yoki pytesseract (Python) orqali
"""
import pytesseract
from PIL import Image
import os
import logging
from datetime import datetime
from typing import Dict, List, Optional
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OCRProcessor:
    """OCR (Tesseract) bilan hujjatlarni qayta ishlash"""
    
    def __init__(self):
        """OCR processor'ni boshlash"""
        try:
            # Tesseract-OCR o'rnatilganligi tekshirish
            pytesseract.pytesseract.get_tesseract_version()
            logger.info("Tesseract OCR config'uratsiyasi muvaffaqiyatli")
        except Exception as e:
            logger.warning(f"Tesseract OCR o'rnatilmagan: {e}")
            logger.info("O'rnatish: https://github.com/UB-Mannheim/tesseract/wiki")
    
    @staticmethod
    def extract_text_from_image(image_path: str, lang: str = 'uzb+eng') -> Dict:
        """
        Rasmdan matn ajratib olish
        
        Args:
            image_path: Rasm fayilining yo'li
            lang: Tesseract tillar kodi (uzb=O'zbek, eng=English)
        
        Returns:
            {'success': bool, 'text': str, 'confidence': float}
        """
        try:
            if not os.path.exists(image_path):
                return {'success': False, 'error': f'Fayl topilmadi: {image_path}'}
            
            # Rasmni ochish
            image = Image.open(image_path)
            
            # OCR ni ishga tushirish
            text = pytesseract.image_to_string(image, lang=lang)
            
            # Ma'lumotlarni olish
            data = pytesseract.image_to_data(image, lang=lang, output_type='dict')
            confidence = sum([int(c) for c in data['conf'] if int(c) > 0]) / len([c for c in data['conf'] if int(c) > 0]) if len(data['conf']) > 0 else 0
            
            logger.info(f"OCR muvaffaqiyatli: {image_path}")
            
            return {
                'success': True,
                'text': text.strip(),
                'confidence': confidence / 100,
                'language': lang,
                'file': image_path
            }
        
        except Exception as e:
            logger.error(f"OCR xatosi: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def extract_invoice_data(self, image_path: str) -> Dict:
        """
        Hisob-fakturadan ma'lumotlarni ajratib olish
        
        Returns:
            {
                'invoice_number': 'HF-2026-001',
                'invoice_date': '2026-02-04',
                'customer_name': 'ABC Corp',
                'total_amount': 5000000,
                'items': [...]
            }
        """
        try:
            result = self.extract_text_from_image(image_path)
            
            if not result['success']:
                return result
            
            text = result['text']
            
            # Pattern matching bilan ma'lumotlarni ajratib olish
            import re
            
            data = {
                'source_image': image_path,
                'extracted_text': text,
                'invoice_number': self._extract_invoice_number(text),
                'invoice_date': self._extract_date(text),
                'customer_name': self._extract_customer(text),
                'total_amount': self._extract_amount(text),
                'items': self._extract_items(text),
                'confidence': result['confidence']
            }
            
            logger.info(f"Hisob-faktura ma'lumotlari ajratildi: {data['invoice_number']}")
            
            return {
                'success': True,
                'data': data
            }
        
        except Exception as e:
            logger.error(f"Hisob-faktura ajratish xatosi: {str(e)}")
            return {'success': False, 'error': str(e)}

    @staticmethod
    def _extract_invoice_number(text: str) -> Optional[str]:
        """Hisob-faktura raqamini ajratib olish"""
        import re
        patterns = [
            r'(?:HF|Invoice|Hisob|Счёт)[\s-]*(\d+[-/]\d+[-/]\d+)',
            r'(\d{4}[-/]\d{2}[-/]\d{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        
        return None

    @staticmethod
    def _extract_date(text: str) -> Optional[str]:
        """Sanani ajratib olish"""
        import re
        patterns = [
            r'(\d{4}[-/]\d{2}[-/]\d{2})',
            r'(\d{2}[-/]\d{2}[-/]\d{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1)
        
        return None

    @staticmethod
    def _extract_customer(text: str) -> Optional[str]:
        """Mijozni ajratib olish"""
        import re
        
        # O'zbek til tikiliklari
        lines = text.split('\n')
        for i, line in enumerate(lines):
            if any(word in line.lower() for word in ['mjoj', 'customer', 'компания', 'lic']):
                if i + 1 < len(lines):
                    return lines[i + 1].strip()
        
        return None

    @staticmethod
    def _extract_amount(text: str) -> Optional[float]:
        """Jami summani ajratib olish"""
        import re
        
        patterns = [
            r'(?:Jami|Total|ИТОГО)[\s:]*(\d{1,3}(?:\s?\d{3})*(?:[.,]\d{2})?)',
            r'(\d{1,3}(?:\s?\d{3})*(?:[.,]\d{2})?)\s*(?:UZS|som|$)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                amount_str = match.group(1).replace(',', '.').replace(' ', '')
                try:
                    return float(amount_str)
                except:
                    pass
        
        return None

    @staticmethod
    def _extract_items(text: str) -> List[Dict]:
        """Mahsulotlarni ajratib olish"""
        import re
        
        items = []
        lines = text.split('\n')
        
        for line in lines:
            # Mahsulot liniyalari odatda raqam + nom + miqdor + narx bo'ladi
            if re.search(r'\d+[\.\s]+\d+[\s,.]', line):
                parts = re.split(r'\s{2,}', line.strip())
                if len(parts) >= 3:
                    items.append({
                        'name': parts[0] if len(parts) > 0 else 'Unknown',
                        'quantity': float(parts[1]) if len(parts) > 1 else 1,
                        'price': float(parts[2].replace(',', '.')) if len(parts) > 2 else 0
                    })
        
        return items

    def process_multiple_invoices(self, folder_path: str) -> List[Dict]:
        """
        Papka'dagi barcha hisob-fakturalarni qayta ishlash
        """
        results = []
        if not os.path.isdir(folder_path):
            logger.error(f"Papka topilmadi: {folder_path}")
            return results
        
        supported_formats = ('.jpg', '.jpeg', '.png', '.pdf', '.bmp')
        
        for file in os.listdir(folder_path):
            if file.lower().endswith(supported_formats):
                file_path = os.path.join(folder_path, file)
                result = self.extract_invoice_data(file_path)
                results.append(result)
        
        logger.info(f"Jami {len(results)} ta hisob-faktura qayta ishlandi")
        
        return results


class DocumentScanner:
    """Hujjat skanerlash qo'shimchasi"""
    
    def __init__(self):
        self.ocr = OCRProcessor()
    
    def scan_and_save(self, image_path: str, output_dir: str = 'scanned_documents') -> Dict:
        """
        Hujjatni skanerlash va saqqlash
        """
        try:
            os.makedirs(output_dir, exist_ok=True)
            
            # OCR ni ishga tushirish
            result = self.ocr.extract_invoice_data(image_path)
            
            if result['success']:
                # Ma'lumotlarni JSON qilib saqlash
                import json
                
                filename = f"{output_dir}/scanned_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
                
                with open(filename, 'w', encoding='utf-8') as f:
                    json.dump(result['data'], f, ensure_ascii=False, indent=2)
                
                logger.info(f"Hujjat saqlandi: {filename}")
                
                return {
                    'success': True,
                    'file': filename,
                    'data': result['data']
                }
            else:
                return result
        
        except Exception as e:
            logger.error(f"Hujjat saqqlash xatosi: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def batch_process(self, input_folder: str, output_folder: str = 'processed_documents') -> Dict:
        """
        Bir nechta hujjatlarni bir paytda qayta ishlash
        """
        os.makedirs(output_folder, exist_ok=True)
        
        results = self.ocr.process_multiple_invoices(input_folder)
        
        summary = {
            'total_processed': len(results),
            'successful': sum(1 for r in results if r.get('success', False)),
            'failed': sum(1 for r in results if not r.get('success', False)),
            'results': results,
            'output_folder': output_folder
        }
        
        logger.info(f"Batch qayta ishlash tugallandi: {summary['successful']}/{summary['total_processed']}")
        
        return summary


# Dev/Test uchun Dummy OCR
class OCRProcessorDev(OCRProcessor):
    """Test uchun demo version"""
    
    def extract_text_from_image(self, image_path: str, lang: str = 'uzb+eng') -> Dict:
        logger.info(f"[DEV] OCR: {image_path}")
        return {
            'success': True,
            'text': '[OCR DEMO] Bu hujjat matnini o\'qish uchun Tesseract o\'rnatish kerak',
            'confidence': 0.85,
            'language': lang,
            'file': image_path
        }
    
    def extract_invoice_data(self, image_path: str) -> Dict:
        logger.info(f"[DEV] Invoice extraction: {image_path}")
        return {
            'success': True,
            'data': {
                'source_image': image_path,
                'invoice_number': 'HF-2026-001',
                'invoice_date': '2026-02-04',
                'customer_name': 'ABC Corp (Demo)',
                'total_amount': 5000000,
                'items': [
                    {'name': 'Mahsulot 1', 'quantity': 10, 'price': 250000},
                    {'name': 'Mahsulot 2', 'quantity': 5, 'price': 300000}
                ],
                'confidence': 0.90
            }
        }
