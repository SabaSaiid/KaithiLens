"""
Script to generate sample historical manuscript images with parchment texture,
decorative stamp borders, and Kaithi inscriptions for testing & demo purposes.
"""

import os
from PIL import Image, ImageDraw, ImageFont


def create_parchment_manuscript(
    output_path: str,
    title: str,
    lines: list,
    seal_text: str = "OFFICIAL RECORD 1894",
    width: int = 900,
    height: int = 550,
):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Base parchment color
    img = Image.new("RGB", (width, height), color=(244, 233, 211))
    draw = ImageDraw.Draw(img)

    # Add simulated paper aging texture (soft vignette & horizontal grain)
    for y in range(0, height, 4):
        tint = (y % 12) - 6
        draw.line([(0, y), (width, y)], fill=(240 + tint, 228 + tint, 205 + tint))

    # Outer decorative border
    draw.rectangle([(25, 25), (width - 25, height - 25)], outline=(140, 105, 65), width=3)
    draw.rectangle([(32, 32), (width - 32, height - 32)], outline=(180, 145, 100), width=1)

    # Historical Revenue / Court Stamp (Top Right)
    seal_x0, seal_y0, seal_x1, seal_y1 = width - 180, 45, width - 55, 170
    draw.ellipse([(seal_x0, seal_y0), (seal_x1, seal_y1)], outline=(160, 60, 50), width=3)
    draw.ellipse([(seal_x0 + 8, seal_y0 + 8), (seal_x1 - 8, seal_y1 - 8)], outline=(160, 60, 50), width=1)
    draw.text((seal_x0 + 18, seal_y0 + 45), "BIHAR PROVINCE", fill=(160, 60, 50))
    draw.text((seal_x0 + 26, seal_y0 + 65), "ONE RUPEE", fill=(160, 60, 50))

    # Top Heading
    draw.text((60, 55), f"[ HISTORICAL DOCUMENT: {title} ]", fill=(100, 70, 40))
    draw.line([(60, 78), (width - 200, 78)], fill=(150, 110, 70), width=2)

    # Manuscript Text Lines (simulating Kaithi cursive script handwriting)
    y_offset = 120
    for idx, line in enumerate(lines):
        # Draw text line
        draw.text((60, y_offset), line, fill=(35, 25, 20))
        # Draw faint ruled line beneath
        draw.line([(55, y_offset + 35), (width - 60, y_offset + 35)], fill=(210, 195, 170), width=1)
        y_offset += 75

    # Bottom archivist seal / signatures
    draw.line([(60, height - 70), (width - 60, height - 70)], fill=(160, 120, 80), width=1)
    draw.text((60, height - 55), "𑂠𑂮𑂹𑂞𑂎𑂞 𑂍𑂰𑂞𑂱𑂥 (Scribe Signature) : 𑂩𑂰𑂧 𑂠𑂨𑂰𑂪 𑂪𑂰𑂪", fill=(90, 60, 30))
    draw.text((width - 280, height - 55), "ARCHIVE ID: #KL-1894-082", fill=(120, 90, 60))

    img.save(output_path, "PNG")
    print(f"Generated manuscript sample image at {output_path}")


if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    records_dir = os.path.join(base_dir, "sample_records")

    # Sample 1: Land Sale Deed
    create_parchment_manuscript(
        os.path.join(records_dir, "sample_land_deed_1.png"),
        title="Land Sale Deed (1894 CE) - Arrah, Shahabad",
        lines=[
            "𑂬𑂹𑂩𑂲 𑂩𑂰𑂧 𑂔𑂲 𑂮𑂯𑂰𑂨 𑂾",
            "𑂧𑂸𑂔𑂵 𑂩𑂰𑂧𑂣𑂳𑂩 𑂣𑂩𑂑𑂢𑂰 𑂃𑂩𑂩𑂯 𑂔𑂱𑂪𑂰 𑂬𑂰𑂯𑂰𑂥𑂰𑂠 𑂾",
            "𑂍𑂶𑂟𑂲 𑂪𑂵𑂎𑂰 𑂥𑂰𑂥𑂞 𑂥𑂱𑂍𑂹𑂩𑂨 𑂥𑂰𑂏 𑂅𑂍𑂩𑂰𑂩𑂢𑂰𑂧𑂰 𑂾",
            "𑂨𑂯 𑂠𑂮𑂹𑂞𑂰𑂫𑂵𑂔 𑂦𑂴𑂧𑂱 𑂔𑂧𑂲𑂁𑂠𑂰𑂩 𑂍𑂵 𑂯𑂍 𑂧𑂵𑂁 𑂪𑂱𑂎𑂪 𑂏𑂅𑂪 𑂯𑂰 𑂾",
        ],
    )

    # Sample 2: Court Order
    create_parchment_manuscript(
        os.path.join(records_dir, "sample_court_order_2.png"),
        title="Patna Magistrate Court Order (1902 CE)",
        lines=[
            "𑂃𑂠𑂰𑂪𑂞 𑂧𑂱𑂮𑂱𑂪 𑂧𑂶𑂔𑂱𑂮𑂹𑂗𑂹𑂩𑂵𑂗 𑂥𑂯𑂰𑂠𑂳𑂩 𑂣𑂗𑂢𑂰 𑂾",
            "𑂩𑂶𑂨𑂞 𑂍𑂵 𑂎𑂞𑂱𑂨𑂰𑂢 𑂠𑂰𑂎𑂱𑂪 𑂍𑂩𑂵 𑂍𑂵 𑂯𑂳𑂍𑂳𑂧 𑂠𑂱𑂯𑂪 𑂏𑂅𑂪 𑂾",
            "𑂍𑂳𑂪 𑂩𑂍𑂥𑂰 𑂢𑂸 𑂥𑂲𑂐𑂰 𑂮𑂰𑂞 𑂍𑂘𑂰 𑂢𑂱𑂨𑂧 𑂃𑂢𑂳𑂮𑂰𑂩 𑂠𑂩𑂹𑂔 𑂦𑂅𑂪 𑂾",
        ],
    )

    # Sample 3: Survey Khatiyan
    create_parchment_manuscript(
        os.path.join(records_dir, "sample_khatiyan_3.png"),
        title="Cadastral Survey Khatiyan (1910 CE) - Darbhanga",
        lines=[
            "𑂎𑂞𑂰 𑂢𑂧𑂹𑂥𑂩 𑂥𑂰𑂨𑂲𑂮 𑂎𑂮𑂩𑂰 𑂮𑂸 𑂐𑂩 𑂾",
            "𑂢𑂰𑂧 𑂍𑂰𑂬𑂹𑂞𑂍𑂰𑂩 𑂩𑂰𑂧 𑂮𑂳𑂁𑂠𑂩 𑂮𑂱𑂁𑂯 𑂾",
            "𑂦𑂴𑂧𑂱 𑂍𑂵 𑂪𑂏𑂰𑂢 𑂮𑂰𑂪𑂰𑂢𑂰 𑂥𑂰𑂩𑂯 𑂩𑂴𑂣𑂨𑂰 𑂢𑂱𑂬𑂹𑂒𑂱𑂞 𑂦𑂅𑂪 𑂾",
        ],
    )
