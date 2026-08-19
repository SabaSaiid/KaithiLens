"""
Historical Manuscript Image Preprocessing Pipeline using OpenCV.
Optimized for 16th-20th century aged paper, ink bleed-through,
uneven illumination, and handwritten cursive Kaithi script.
"""

from dataclasses import dataclass
from typing import List, Dict, Any, Tuple, Optional
import base64
import io
import cv2
import numpy as np
from PIL import Image


@dataclass
class BoundingBox:
    x: int
    y: int
    w: int
    h: int
    confidence: float = 1.0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "x": self.x,
            "y": self.y,
            "w": self.w,
            "h": self.h,
            "confidence": self.confidence,
        }


@dataclass
class PreprocessedResult:
    original_dimensions: Tuple[int, int]  # (width, height)
    processed_dimensions: Tuple[int, int]
    skew_angle: float
    binarized_image_base64: str
    clahe_image_base64: str
    bounding_boxes: List[Dict[str, Any]]
    total_regions_detected: int


class ImagePreprocessor:
    """Handles image cleaning, contrast adjustment, deskewing, and binarization."""

    @staticmethod
    def bytes_to_cv2(image_bytes: bytes) -> np.ndarray:
        """Convert raw image bytes to OpenCV BGR image."""
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            # Fallback to PIL in case OpenCV fails to decode certain formats
            pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        return img

    @staticmethod
    def cv2_to_base64(img: np.ndarray, format: str = ".png") -> str:
        """Convert OpenCV image to base64 data URI string."""
        _, buffer = cv2.imencode(format, img)
        b64_str = base64.b64encode(buffer).decode("utf-8")
        return f"data:image/png;base64,{b64_str}"

    @classmethod
    def deskew(cls, gray: np.ndarray) -> Tuple[np.ndarray, float]:
        """Detect and correct rotation skew angle of the manuscript."""
        # Threshold inverted image to find text pixels
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

        # Get coordinates of all non-zero pixels
        coords = np.column_stack(np.where(thresh > 0))
        if coords.size == 0:
            return gray, 0.0

        # Find minimum area bounding box
        rect = cv2.minAreaRect(coords)
        angle = rect[-1]

        # OpenCV minAreaRect returns angle in [-90, 0)
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle

        # Only deskew if angle is significant (> 0.5 deg and < 35 deg)
        if 0.5 < abs(angle) < 35.0:
            (h, w) = gray.shape[:2]
            center = (w // 2, h // 2)
            M = cv2.getRotationMatrix2D(center, angle, 1.0)
            rotated = cv2.warpAffine(
                gray, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE
            )
            return rotated, float(angle)

        return gray, 0.0

    @classmethod
    def apply_clahe(cls, gray: np.ndarray, clip_limit: float = 2.5, tile_grid_size: Tuple[int, int] = (8, 8)) -> np.ndarray:
        """Apply Contrast Limited Adaptive Histogram Equalization to handle faded ink."""
        clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=tile_grid_size)
        return clahe.apply(gray)

    @classmethod
    def adaptive_binarize(cls, gray: np.ndarray) -> np.ndarray:
        """
        Multi-stage adaptive binarization for historical documents:
        1. Fast median/bilateral blur to preserve stroke edges while suppressing paper grain.
        2. Adaptive Gaussian thresholding.
        3. Morphological opening to eliminate salt-and-pepper noise.
        """
        # Noise reduction preserving ink strokes
        denoised = cv2.bilateralFilter(gray, 9, 75, 75)

        # Adaptive Gaussian thresholding (robust against uneven stains & shadows)
        binary = cv2.adaptiveThreshold(
            denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 21, 11
        )

        # Morphological clean up
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
        cleaned = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)

        return cleaned

    @classmethod
    def segment_text_regions(cls, binary_img: np.ndarray) -> List[BoundingBox]:
        """Detect probable text lines and word regions using contour analysis."""
        (h, w) = binary_img.shape[:2]
        inv_binary = 255 - binary_img

        # Dilation horizontally to connect characters in words
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 3))
        dilated = cv2.dilate(inv_binary, kernel, iterations=2)

        contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        boxes: List[BoundingBox] = []

        # Sort contours from top to bottom
        bounding_rects = [cv2.boundingRect(c) for c in contours]
        bounding_rects = sorted(bounding_rects, key=lambda b: (b[1] // 30, b[0]))

        for x, y, bw, bh in bounding_rects:
            # Filter noise / borders / full page rectangles
            if bw > 15 and bh > 8 and (bw * bh) < (0.85 * w * h):
                boxes.append(BoundingBox(x=x, y=y, w=bw, h=bh, confidence=0.92))

        return boxes

    @classmethod
    def process_pipeline(cls, image_bytes: bytes) -> Tuple[np.ndarray, np.ndarray, PreprocessedResult]:
        """
        Executes the complete preprocessing pipeline.
        Returns: (gray_deskewed, binarized_img, metadata_result)
        """
        img_bgr = cls.bytes_to_cv2(image_bytes)
        orig_h, orig_w = img_bgr.shape[:2]

        # 1. Grayscale
        gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

        # 2. Deskew
        deskewed_gray, skew_angle = cls.deskew(gray)

        # 3. CLAHE (Contrast Enhancement)
        clahe_enhanced = cls.apply_clahe(deskewed_gray)

        # 4. Adaptive Binarization
        binarized = cls.adaptive_binarize(clahe_enhanced)

        # 5. Region segmentation
        boxes = cls.segment_text_regions(binarized)

        # 6. Generate Base64 previews for UI inspection
        binarized_b64 = cls.cv2_to_base64(binarized)
        clahe_b64 = cls.cv2_to_base64(clahe_enhanced)

        res = PreprocessedResult(
            original_dimensions=(orig_w, orig_h),
            processed_dimensions=(deskewed_gray.shape[1], deskewed_gray.shape[0]),
            skew_angle=round(skew_angle, 2),
            binarized_image_base64=binarized_b64,
            clahe_image_base64=clahe_b64,
            bounding_boxes=[b.to_dict() for b in boxes],
            total_regions_detected=len(boxes),
        )

        return deskewed_gray, binarized, res
