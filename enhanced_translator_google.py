
#!/usr/bin/env python3

import json
import os
from googletrans import Translator

translator = Translator()

def translate_text(text: str, target_lang: str) -> str:
    """Перевод текста через Google Translate"""
    try:
        result = translator.translate(text, src='ru', dest=target_lang)
        return result.text
    except Exception as e:
        print(f"❌ Ошибка перевода '{text[:30]}...': {e}")
        return text

def translate_dict(data, target_lang):
    result = {}
    for key, value in data.items():
        if isinstance(value, dict):
            result[key] = translate_dict(value, target_lang)
        elif isinstance(value, list):
            result[key] = [translate_dict(item, target_lang) if isinstance(item, dict)
                           else translate_text(item, target_lang) if isinstance(item, str)
                           else item for item in value]
        elif isinstance(value, str):
            result[key] = translate_text(value, target_lang)
        else:
            result[key] = value
    return result

def create_translation(source_file, target_lang, output_file):
    with open(source_file, 'r', encoding='utf-8') as f:
        source_data = json.load(f)

    translated_data = translate_dict(source_data, target_lang)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)

    print(f"✅ Переведено: {source_file} → {output_file}")

def main():
    source_file = "ru.json"
    if not os.path.exists(source_file):
        print(f"❌ Файл {source_file} не найден")
        return

    create_translation(source_file, "en", "en.json")
    create_translation(source_file, "zh-cn", "zh.json")

    print("🎉 Автоперевод через Google Translate завершён.")

if __name__ == "__main__":
    main()
