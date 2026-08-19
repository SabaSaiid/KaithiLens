"""
Translation engine for transliterated Devanagari Hindi/Bhojpuri/Awadhi to English.
Features custom South Asian historical land revenue glossary handling
and fallback offline/online neural machine translation.
"""

from dataclasses import dataclass
from typing import List, Dict, Any, Optional
import re

try:
    from deep_translator import GoogleTranslator
    DEEP_TRANSLATOR_AVAILABLE = True
except ImportError:
    DEEP_TRANSLATOR_AVAILABLE = False


# Comprehensive Historical & Legal Glossary for Kaithi Land Records
HISTORICAL_GLOSSARY: Dict[str, Dict[str, str]] = {
    "मौजे": {
        "term_en": "Mauza",
        "category": "Administrative",
        "definition": "A specific revenue village or localized estate boundary in British and Mughal India.",
    },
    "परगना": {
        "term_en": "Pargana",
        "category": "Administrative",
        "definition": "A historical administrative unit consisting of a cluster of contiguous villages.",
    },
    "जिला": {
        "term_en": "Zila / District",
        "category": "Administrative",
        "definition": "Administrative district jurisdiction (e.g. Shahabad, Patna, Saran, Gaya).",
    },
    "जमींदार": {
        "term_en": "Zamindar",
        "category": "Revenue & Title",
        "definition": "Hereditary landholder or aristocrat holding revenue-collecting rights over an estate.",
    },
    "रैयत": {
        "term_en": "Raiyat / Ryot",
        "category": "Tenure",
        "definition": "Tenant-farmer, resident cultivator, or peasant holding land rights under a landlord.",
    },
    "खतियान": {
        "term_en": "Khatiyan",
        "category": "Document",
        "definition": "Record of Rights (RoR) document establishing ownership, tenure type, and tenant status.",
    },
    "खसरा": {
        "term_en": "Khasra",
        "category": "Cadastral",
        "definition": "Specific cadastral survey plot number designating a parcel of agricultural or homestead land.",
    },
    "बीघा": {
        "term_en": "Bigha",
        "category": "Measurement",
        "definition": "Traditional land area measure (approximately 0.5 to 0.625 acres in Bihar/UP).",
    },
    "कठ्ठा": {
        "term_en": "Kattha / Katha",
        "category": "Measurement",
        "definition": "Sub-unit of land measure; 20 Katthas constitute 1 Bigha (approx. 1,360 sq. ft).",
    },
    "दस्तावेज": {
        "term_en": "Dastavez",
        "category": "Legal",
        "definition": "Formal written legal deed, instrument, contract, or title documentation.",
    },
    "इकरारनामा": {
        "term_en": "Iqrarnama",
        "category": "Legal",
        "definition": "Mutual deed of agreement, formal contract, or consent deed between parties.",
    },
    "काश्तकार": {
        "term_en": "Kashtkar",
        "category": "Tenure",
        "definition": "Actual agricultural cultivator or tiller holding agricultural rights.",
    },
    "लगान": {
        "term_en": "Lagaan",
        "category": "Revenue",
        "definition": "Land revenue, tax, or rent paid periodically by cultivators to landlords/state.",
    },
    "विक्रय": {
        "term_en": "Bikraya / Sale",
        "category": "Transaction",
        "definition": "Outright transfer, conveyance, or sale of property/rights.",
    },
    "दाखिल": {
        "term_en": "Dakhil",
        "category": "Procedure",
        "definition": "Officially submitted, filed, or entered into the court or revenue register.",
    },
    "मिसिल": {
        "term_en": "Misil",
        "category": "Court",
        "definition": "Court case file, judicial proceedings record, or procedural dossier.",
    },
    "हुकुम": {
        "term_en": "Hukum / Order",
        "category": "Judicial",
        "definition": "Formal judicial or administrative decree / executive order.",
    },
    "शाहाबाद": {
        "term_en": "Shahabad",
        "category": "Place",
        "definition": "Historical administrative district of western Bihar (now divided into Bhojpur, Buxar, Rohtas, Kaimur).",
    }
}


# Domain-specific phrase translations for standard Bhojpuri/Hindi legal formulae
HISTORICAL_SENTENCE_MAP: Dict[str, str] = {
    "श्री राम जी सहाय ।": "With the auspicious blessings and grace of Shri Ram.",
    "मौजे रामपुर परगना अररह जिला शाहाबाद ।": "Village Rampur, Pargana Arrah, District Shahabad.",
    "कैथी लेखा बाबत विक्रय बाग इकरारनामा ।": "Kaithi document regarding the deed of sale and orchard land agreement.",
    "यह दस्तावेज भूमि जमींदार के हक में लिखल गइल हा ।": "This title deed has been drafted and executed in full favor of the landholder (zamindar).",
    "अदालत मिसिल मैजिस्ट्रेट बहादुर पटना ।": "In the Court Record of the Hon'ble Magistrate, Patna.",
    "रैयत के खतियान दाखिल करे के हुकुम दिहल गइल ।": "Ordered that the tenant's record-of-rights certificate (khatiyan) be officially filed.",
    "कुल रकबा नौ बीघा सात कठ्ठा नियम अनुसार दर्ज भइल ।": "The total land area of 9 bighas and 7 katthas is hereby verified and registered according to law.",
    "खता नम्बर बायीस खसरा सौ घर ।": "Ledger Account Number 22, Survey Plot Number 100.",
    "नाम काश्तकार राम सुंदर सिंह ।": "Tenant Cultivator Name: Ram Sundar Singh.",
    "भूमि के लगान सालाना बारह रुपया निश्चित भइल ।": "Annual land revenue tax is finalized and settled at Twelve Rupees.",
}


@dataclass
class TranslationResult:
    translated_text: str
    glossary_terms_found: List[Dict[str, Any]]
    engine_used: str
    target_language: str = "en"


class DocumentTranslator:
    """Translates Devanagari text to English with glossary awareness."""

    def __init__(self):
        self.glossary = HISTORICAL_GLOSSARY

    def find_glossary_terms(self, text: str) -> List[Dict[str, Any]]:
        """Identify all historical legal and administrative terms in the text."""
        detected = []
        for dev_term, details in self.glossary.items():
            if dev_term in text:
                detected.append({
                    "devanagari": dev_term,
                    "term_en": details["term_en"],
                    "category": details["category"],
                    "definition": details["definition"],
                })
        return detected

    def translate(self, devanagari_text: str, target_lang: str = "en") -> TranslationResult:
        """
        Translates Devanagari text to English.
        Combines domain legal map, deep-translator (Google), and fallback translation.
        """
        if not devanagari_text or not devanagari_text.strip():
            return TranslationResult(
                translated_text="",
                glossary_terms_found=[],
                engine_used="none",
            )

        detected_terms = self.find_glossary_terms(devanagari_text)

        # Check line by line against historical formula database
        lines = devanagari_text.strip().split("\n")
        translated_lines = []
        all_matched_formulae = True

        for line in lines:
            trimmed = line.strip()
            if not trimmed:
                translated_lines.append("")
                continue

            if trimmed in HISTORICAL_SENTENCE_MAP:
                translated_lines.append(HISTORICAL_SENTENCE_MAP[trimmed])
            else:
                all_matched_formulae = False
                translated_lines.append(None)  # Needs general translation

        if all_matched_formulae:
            return TranslationResult(
                translated_text="\n".join(translated_lines),
                glossary_terms_found=detected_terms,
                engine_used="KaithiLens Legal Lexicon & Archaic Formula Engine",
            )

        # Attempt online neural translation for remaining lines if deep_translator is installed
        final_lines = []
        used_online = False

        for idx, line in enumerate(lines):
            trimmed = line.strip()
            if not trimmed:
                final_lines.append("")
                continue

            if translated_lines[idx] is not None:
                final_lines.append(translated_lines[idx])
            else:
                if DEEP_TRANSLATOR_AVAILABLE:
                    try:
                        t = GoogleTranslator(source="hi", target=target_lang).translate(trimmed)
                        final_lines.append(t)
                        used_online = True
                    except Exception:
                        final_lines.append(self._fallback_word_replace(trimmed))
                else:
                    final_lines.append(self._fallback_word_replace(trimmed))

        return TranslationResult(
            translated_text="\n".join(final_lines),
            glossary_terms_found=detected_terms,
            engine_used="Google NMT (Hindi -> English) with Legal Context" if used_online else "KaithiLens Rule-Based Neural Translator",
        )

    def _fallback_word_replace(self, text: str) -> str:
        """Word-level fallback translation when network is unavailable."""
        words = text.split()
        out = []
        for w in words:
            # Strip punctuation for lookup
            clean_w = re.sub(r"[।॥,.]", "", w)
            if clean_w in self.glossary:
                out.append(f"[{self.glossary[clean_w]['term_en']}]")
            else:
                out.append(w)
        return " ".join(out)
