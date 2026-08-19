"""OCR and Preprocessing Module for KaithiLens."""
from .preprocessor import ImagePreprocessor, PreprocessedResult
from .engine import OCREngine, OCRResult

__all__ = ["ImagePreprocessor", "PreprocessedResult", "OCREngine", "OCRResult"]
