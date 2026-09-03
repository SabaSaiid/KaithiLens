"""
FastAPI Route Handlers for the KaithiLens Pipeline.
"""

from typing import Optional, List, Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel, Field

from ..ocr.preprocessor import ImagePreprocessor
from ..ocr.engine import OCREngine, HISTORICAL_SAMPLES
from ..transliteration.kaithi_to_deva import (
    kaithi_to_devanagari,
    devanagari_to_kaithi,
    devanagari_to_iast,
    kaithi_to_iast,
    is_kaithi_text,
    get_character_breakdown,
)
from ..translation.translator import DocumentTranslator, HISTORICAL_GLOSSARY

router = APIRouter(prefix="/api", tags=["pipeline"])

ocr_engine = OCREngine()
translator = DocumentTranslator()

# In-memory storage for submitted corrections (human-in-the-loop)
feedback_database: List[Dict[str, Any]] = []


# Request / Response Schemas
class TransliterationRequest(BaseModel):
    text: str = Field(..., description="Source text to transliterate")
    direction: str = Field("kaithi_to_deva", description="'kaithi_to_deva' or 'deva_to_kaithi'")


class TransliterationResponse(BaseModel):
    original_text: str
    transliterated_text: str
    direction: str
    character_breakdown: List[Dict[str, Any]]
    iast_text: Optional[str] = None


class MetadataRequest(BaseModel):
    devanagari_text: str = Field(..., description="Devanagari text to analyze")
    english_text: Optional[str] = Field("", description="English translation if available")



class TranslationRequest(BaseModel):
    text: str = Field(..., description="Devanagari text to translate")
    target_lang: str = Field("en", description="Target language ISO code")


class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    glossary_terms_found: List[Dict[str, Any]]
    engine_used: str


class FeedbackSubmission(BaseModel):
    sample_id: Optional[str] = None
    original_kaithi: str
    corrected_kaithi: str
    original_devanagari: Optional[str] = None
    corrected_devanagari: str
    user_notes: Optional[str] = None


@router.get("/health")
def get_health_status():
    """System health check and OCR engine status."""
    engine_status = ocr_engine.check_engine_status()
    return {
        "status": "healthy",
        "service": "KaithiLens API",
        "version": "1.0.0",
        "ocr_backends": engine_status,
        "supported_scripts": ["Kaithi (𑂍𑂶𑂟𑂲)", "Devanagari (देवनागरी)"],
        "target_languages": ["en (English)", "hi (Hindi)"],
    }


@router.get("/samples")
def get_sample_records():
    """List sample historical manuscripts available for immediate test/demo."""
    samples = []
    for s_id, data in HISTORICAL_SAMPLES.items():
        samples.append({
            "id": s_id,
            "title": data["title"],
            "region": data["region"],
            "date": data["date"],
            "kaithi_snippet": data["kaithi_text"].split("\n")[0],
            "devanagari_snippet": data["devanagari_ground_truth"].split("\n")[0],
            "english_snippet": data["english_translation"].split("\n")[0],
        })
    return {"samples": samples}


@router.get("/samples/{sample_id}")
def get_sample_detail(sample_id: str):
    """Retrieve full detail and ground truth for a given sample manuscript."""
    if sample_id not in HISTORICAL_SAMPLES:
        raise HTTPException(status_code=404, detail="Sample record not found")

    sample = HISTORICAL_SAMPLES[sample_id]
    devanagari_text = sample["devanagari_ground_truth"]
    english_translation = sample["english_translation"]
    return {
        "id": sample_id,
        "title": sample["title"],
        "region": sample["region"],
        "date": sample["date"],
        "kaithi_text": sample["kaithi_text"],
        "devanagari_text": devanagari_text,
        "iast_text": devanagari_to_iast(devanagari_text),
        "english_translation": english_translation,
        "character_breakdown": get_character_breakdown(sample["kaithi_text"]),
        "glossary_terms": translator.find_glossary_terms(devanagari_text),
        "structured_metadata": translator.extract_deed_metadata(devanagari_text, english_translation),
    }


@router.get("/glossary")
def get_historical_glossary():
    """Return historical land record and legal terminology dictionary."""
    return {"glossary": HISTORICAL_GLOSSARY}


@router.post("/transliterate", response_model=TransliterationResponse)
def transliterate_text(payload: TransliterationRequest):
    """Convert text between Kaithi and Devanagari scripts with IAST Romanization."""
    if payload.direction == "kaithi_to_deva":
        result_text = kaithi_to_devanagari(payload.text)
        breakdown = get_character_breakdown(payload.text)
        iast_text = devanagari_to_iast(result_text)
    elif payload.direction == "deva_to_kaithi":
        result_text = devanagari_to_kaithi(payload.text)
        breakdown = get_character_breakdown(result_text)
        iast_text = devanagari_to_iast(payload.text)
    else:
        raise HTTPException(status_code=400, detail="Invalid direction specified. Choose 'kaithi_to_deva' or 'deva_to_kaithi'")

    return TransliterationResponse(
        original_text=payload.text,
        transliterated_text=result_text,
        direction=payload.direction,
        character_breakdown=breakdown,
        iast_text=iast_text,
    )


@router.post("/translate", response_model=TranslationResponse)
def translate_text(payload: TranslationRequest):
    """Translate Devanagari text to English with historical glossary lookup."""
    res = translator.translate(payload.text, target_lang=payload.target_lang)
    return TranslationResponse(
        original_text=payload.text,
        translated_text=res.translated_text,
        glossary_terms_found=res.glossary_terms_found,
        engine_used=res.engine_used,
    )


@router.post("/metadata")
def extract_metadata_endpoint(payload: MetadataRequest):
    """Extract structured historical deed metadata (NER) from Devanagari & English text."""
    meta = translator.extract_deed_metadata(payload.devanagari_text, payload.english_text or "")
    return {"structured_metadata": meta}


@router.post("/convert")
async def convert_document(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None),
):
    """
    End-to-End Pipeline:
    Upload Document -> Image Preprocessing -> OCR -> Transliteration -> Translation -> Metadata Extraction
    """
    image_bytes = None
    if file:
        image_bytes = await file.read()
    elif sample_id and sample_id in HISTORICAL_SAMPLES:
        # Generate dummy 1x1 image bytes for sample pipelines if image file omitted
        from PIL import Image as PILImage
        import io
        img = PILImage.new("RGB", (800, 400), color=(248, 241, 227))
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        image_bytes = buf.getvalue()
    else:
        raise HTTPException(status_code=400, detail="Please upload an image file or specify a valid sample_id.")

    # 1. Preprocessing
    try:
        deskewed_gray, binarized_img, prep_result = ImagePreprocessor.process_pipeline(image_bytes)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Image preprocessing failed: {str(e)}")

    # 2. OCR Text Extraction
    ocr_result = ocr_engine.extract_text(binarized_img, sample_id=sample_id)

    # 3. Transliteration (Kaithi -> Devanagari & IAST)
    devanagari_text = kaithi_to_devanagari(ocr_result.raw_kaithi_text)
    iast_text = devanagari_to_iast(devanagari_text)
    char_breakdown = get_character_breakdown(ocr_result.raw_kaithi_text)

    # 4. Translation (Devanagari -> English)
    translation_result = translator.translate(devanagari_text, target_lang="en")

    # 5. Deed Intelligence / NER Metadata Extraction
    structured_metadata = translator.extract_deed_metadata(devanagari_text, translation_result.translated_text)

    return {
        "success": True,
        "sample_id": sample_id,
        "preprocessing": {
            "original_dimensions": prep_result.original_dimensions,
            "processed_dimensions": prep_result.processed_dimensions,
            "skew_angle": prep_result.skew_angle,
            "total_regions_detected": prep_result.total_regions_detected,
            "binarized_image_base64": prep_result.binarized_image_base64,
            "clahe_image_base64": prep_result.clahe_image_base64,
            "bounding_boxes": prep_result.bounding_boxes,
        },
        "ocr": {
            "engine": ocr_result.engine_name,
            "confidence": ocr_result.confidence_score,
            "raw_kaithi": ocr_result.raw_kaithi_text,
            "word_count": ocr_result.word_count,
            "words": ocr_result.words,
            "lines": ocr_result.lines,
        },
        "transliteration": {
            "devanagari": devanagari_text,
            "iast": iast_text,
            "character_breakdown": char_breakdown,
        },
        "translation": {
            "english": translation_result.translated_text,
            "engine_used": translation_result.engine_used,
            "glossary_terms": translation_result.glossary_terms_found,
        },
        "structured_metadata": structured_metadata,
    }



@router.post("/feedback")
def submit_user_correction(submission: FeedbackSubmission):
    """Save human-in-the-loop archivist corrections for model refinement."""
    record = {
        "id": len(feedback_database) + 1,
        "sample_id": submission.sample_id,
        "original_kaithi": submission.original_kaithi,
        "corrected_kaithi": submission.corrected_kaithi,
        "corrected_devanagari": submission.corrected_devanagari,
        "user_notes": submission.user_notes,
    }
    feedback_database.append(record)
    return {
        "success": True,
        "message": "Thank you! Your correction has been recorded for active model learning.",
        "feedback_id": record["id"],
        "total_corrections_collected": len(feedback_database),
    }


@router.get("/feedback")
def list_feedback_entries():
    """Retrieve recorded archivist corrections."""
    return {
        "count": len(feedback_database),
        "feedback_records": feedback_database,
    }
