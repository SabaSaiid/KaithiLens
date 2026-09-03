"""
Integration tests for KaithiLens FastAPI Endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "KaithiLens API" in data["message"]


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "ocr_backends" in data


def test_samples_endpoint():
    response = client.get("/api/samples")
    assert response.status_code == 200
    data = response.json()
    assert "samples" in data
    assert len(data["samples"]) >= 3


def test_sample_detail_endpoint():
    response = client.get("/api/samples/sample_land_deed_1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "sample_land_deed_1"
    assert "kaithi_text" in data
    assert "devanagari_text" in data
    assert "english_translation" in data
    assert "iast_text" in data
    assert "structured_metadata" in data


def test_transliterate_endpoint():
    response = client.post(
        "/api/transliterate",
        json={"text": "𑂍𑂎𑂏", "direction": "kaithi_to_deva"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["transliterated_text"] == "कखग"
    assert len(data["character_breakdown"]) == 3
    assert "iast_text" in data


def test_translate_endpoint():
    response = client.post(
        "/api/translate",
        json={"text": "मौजे रामपुर परगना अररह जिला शाहाबाद ।", "target_lang": "en"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "Village Rampur" in data["translated_text"]
    assert len(data["glossary_terms_found"]) > 0


def test_metadata_endpoint():

    response = client.post(
        "/api/metadata",
        json={
            "devanagari_text": "मौजे रामपुर परगना अररह जिला शाहाबाद । कैथी लेखा बाबत विक्रय बाग इकरारनामा ।",
            "english_text": "Village Rampur, Pargana Arrah, District Shahabad.",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "structured_metadata" in data
    meta = data["structured_metadata"]
    assert "document_type" in meta
    assert meta["geographic_jurisdiction"]["district_zila"] == "Shahabad (शाहाबाद)"


def test_feedback_endpoint():
    payload = {
        "sample_id": "sample_land_deed_1",
        "original_kaithi": "𑂍𑂎",
        "corrected_kaithi": "𑂍𑂏",
        "corrected_devanagari": "कग",
        "user_notes": "Verified against 1894 revenue register",
    }
    response = client.post("/api/feedback", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "feedback_id" in data


def test_convert_sample_endpoint():
    response = client.post(
        "/api/convert",
        data={"sample_id": "sample_land_deed_1"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "ocr" in data
    assert "transliteration" in data
    assert "translation" in data
    assert "structured_metadata" in data
    assert "श्री राम जी सहाय ।" in data["transliteration"]["devanagari"]


