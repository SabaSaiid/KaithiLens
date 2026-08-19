<div align="center">

# 📜 KaithiLens 👁️

### *Restoring Forgotten History through AI*

**An end-to-end OCR and translation pipeline for digitizing historical Kaithi script manuscripts**

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tesseract](https://img.shields.io/badge/Tesseract-5.0+-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://github.com/tesseract-ocr/tesseract)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge)]()

<br/>

> *"Kaithi (𑂍𑂶𑂟𑂲) was the script of the people — used across Bihar and UP for legal deeds, land records, and royal documents from the 16th to 20th century. KaithiLens is built to make these voices heard again."*

</div>

---

## 📖 Overview

Millions of historical documents written in the **Kaithi script** — land records, legal deeds, administrative documents from Bihar and Uttar Pradesh — remain locked away, unreadable to modern audiences. The script fell out of official use after the adoption of Devanagari, leaving a critical gap in accessible South Asian history.

**KaithiLens** is an AI-powered system that automates the transcription and translation of these manuscripts using a three-stage pipeline:

```
📷 Scanned Image  ──►  🔤 Kaithi OCR  ──►  🔡 Devanagari  ──►  🌍 English
```

This project is designed for historians, archivists, genealogists, and researchers who need to access and interpret these invaluable primary sources.

---

## ✨ Features

| Feature | Description |
| :--- | :--- |
| 🔍 **Smart OCR** | Powered by Tesseract 5 with a custom-trained Kaithi language model |
| 🔄 **Transliteration Engine** | Precise Kaithi Unicode → Devanagari mapping rules covering the full script |
| 🌐 **Neural Translation** | Hindi → English translation using modern NMT APIs |
| 📜 **Dialect-Aware** | Optimized for Bhojpuri, Awadhi, and Maithili found in legal terminology |
| ✏️ **Human-in-the-Loop** | An integrated correction interface to review and refine AI outputs |
| 📦 **REST API** | A clean FastAPI backend for programmatic access to the full pipeline |
| 🖥️ **Modern UI** | A responsive React frontend for drag-and-drop document processing |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        KaithiLens                           │
├──────────────────────────┬──────────────────────────────────┤
│       Frontend (React)   │        Backend (FastAPI)         │
│                          │                                  │
│  ┌────────────────────┐  │  ┌─────────────┐  ┌──────────┐  │
│  │   Document Upload  │──┼─►│  OCR Engine │  │  Trans-  │  │
│  │   & Preview UI     │  │  │ (Tesseract) │  │  lation  │  │
│  └────────────────────┘  │  └──────┬──────┘  │   API    │  │
│                          │         │         └────┬─────┘  │
│  ┌────────────────────┐  │  ┌──────▼──────┐       │        │
│  │  Devanagari Result │◄─┼──│Transliterat-│◄──────┘        │
│  │  & English Output  │  │  │ion Engine   │                │
│  └────────────────────┘  │  └─────────────┘                │
└──────────────────────────┴──────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend** | Python 3.10+, FastAPI | REST API and pipeline orchestration |
| **OCR** | Tesseract 5, OpenCV, Pillow | Image preprocessing and text extraction |
| **Transliteration** | Custom Python engine | Kaithi Unicode → Devanagari rule mapping |
| **Translation** | Google Translate / IndicTrans2 | Hindi → English semantic translation |
| **Frontend** | React 18, Tailwind CSS | Drag-and-drop UI and results viewer |
| **Containerization** | Docker, Docker Compose | Reproducible local and cloud deployment |
| **Datasets** | Noto Kaithi, Indic-OCR | Model training and validation data |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- Git

---

### ⚡ Quick Start (1-Click Shell Command)

To automatically install dependencies and launch both the backend API and the React frontend workspace in one command:

```bash
# 1. Clone the repository
git clone https://github.com/SabaSaiid/KaithiLens.git
cd KaithiLens

# 2. Run the startup script
./start.sh
```

- 🖥️ **Web App UI:** [http://localhost:5173](http://localhost:5173)
- 📡 **FastAPI Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 🛠️ Manual Installation (Alternative)

If you prefer to run services in separate terminal sessions:

```bash
# 1. Setup & Run the Python Backend
cd backend
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 2. Setup & Run the React Frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

### 🐳 Docker Compose

```bash
docker-compose up --build
```

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/convert` | Upload a document image and run the full pipeline |
| `GET` | `/api/status/{job_id}` | Check the progress of a conversion job |
| `GET` | `/api/result/{job_id}` | Retrieve the final transliteration and translation |
| `POST` | `/api/feedback` | Submit manual corrections to improve the model |

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/convert" \
  -H "accept: application/json" \
  -F "file=@kaithi_document.jpg"
```

---

## 📅 Roadmap

- [ ] **Phase 1 — MVP** · FastAPI backend with Tesseract, basic web upload UI
- [ ] **Phase 2 — Core Pipeline** · Full Kaithi→Devanagari mapping engine + Translation API integration
- [ ] **Phase 3 — Deep Learning** · Custom CRNN/TrOCR model for handwritten Kaithi recognition
- [ ] **Phase 4 — Community Platform** · Web-based collaborative correction and document archiving portal
- [ ] **Phase 5 — Dataset Release** · Publish curated Kaithi OCR dataset to support the research community

---

## 📁 Project Structure

```
KaithiLens/
├── backend/
│   ├── main.py               # FastAPI app entry point
│   ├── ocr/
│   │   └── engine.py         # Tesseract OCR wrapper
│   ├── transliteration/
│   │   └── kaithi_to_deva.py # Transliteration mapping engine
│   ├── translation/
│   │   └── translator.py     # NMT translation client
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/       # React UI components
│   │   └── pages/
│   └── package.json
├── models/                   # Trained Tesseract .traineddata files
├── datasets/                 # Sample Kaithi manuscript images
├── docker-compose.yml
└── README.md
```

---

## 🤝 Contributing

Contributions are warmly welcomed from **developers, historians, and linguists** alike!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ to preserve South Asian cultural heritage**

*"Unlocking the past to empower the future."*

⭐ **Star this repo** if you find it useful — it helps more people discover the project!

</div>
