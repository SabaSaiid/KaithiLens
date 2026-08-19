"""
Kaithi to Devanagari (and reverse) Transliteration Engine.
Covers the full Unicode Kaithi block (U+11080 to U+110CF),
handling independent vowels, consonants, matras (dependent vowel signs),
virama/halant, nukta, and script-specific punctuation.
"""

from typing import Dict, List, Any, Tuple
import unicodedata

# Unicode Kaithi to Devanagari Mapping Dictionary
SCRIPT_MAPPING: Dict[str, str] = {
    # Various Signs
    "\U00011080": "\u0901",  # 𑂀 KAITHI SIGN CANDRABINDU -> ँ
    "\U00011081": "\u0902",  # 𑂁 KAITHI SIGN ANUSVARA -> ं
    "\U00011082": "\u0903",  # 𑂂 KAITHI SIGN VISARGA -> ः

    # Independent Vowels
    "\U00011083": "\u0905",  # 𑂃 KAITHI LETTER A -> अ
    "\U00011084": "\u0906",  # 𑂄 KAITHI LETTER AA -> आ
    "\U00011085": "\u0907",  # 𑂅 KAITHI LETTER I -> इ
    "\U00011086": "\u0908",  # 𑂆 KAITHI LETTER II -> ई
    "\U00011087": "\u0909",  # 𑂇 KAITHI LETTER U -> उ
    "\U00011088": "\u090A",  # 𑂈 KAITHI LETTER UU -> ऊ
    "\U00011089": "\u090F",  # 𑂉 KAITHI LETTER E -> ए
    "\U0001108A": "\u0910",  # 𑂊 KAITHI LETTER AI -> ऐ
    "\U0001108B": "\u0913",  # 𑂋 KAITHI LETTER O -> ओ
    "\U0001108C": "\u0914",  # 𑂌 KAITHI LETTER AU -> औ

    # Consonants
    "\U0001108D": "\u0915",  # 𑂍 KAITHI LETTER KA -> क
    "\U0001108E": "\u0916",  # 𑂎 KAITHI LETTER KHA -> ख
    "\U0001108F": "\u0917",  # 𑂏 KAITHI LETTER GA -> ग
    "\U00011090": "\u0918",  # 𑂐 KAITHI LETTER GHA -> घ
    "\U00011091": "\u0919",  # 𑂑 KAITHI LETTER NGA -> ङ
    "\U00011092": "\u091A",  # 𑂒 KAITHI LETTER CA -> च
    "\U00011093": "\u091B",  # 𑂓 KAITHI LETTER CHA -> छ
    "\U00011094": "\u091C",  # 𑂔 KAITHI LETTER JA -> ज
    "\U00011095": "\u091D",  # 𑂕 KAITHI LETTER JHA -> झ
    "\U00011096": "\u091E",  # 𑂖 KAITHI LETTER NYA -> ञ
    "\U00011097": "\u091F",  # 𑂗 KAITHI LETTER TTA -> ट
    "\U00011098": "\u0920",  # 𑂘 KAITHI LETTER TTHA -> ठ
    "\U00011099": "\u0921",  # 𑂙 KAITHI LETTER DDA -> ड
    "\U0001109A": "\u0922",  # 𑂚 KAITHI LETTER DDHA -> ढ
    "\U0001109B": "\u0921\u093C",  # 𑂛 KAITHI LETTER RRA -> ड़
    "\U0001109C": "\u0923",  # 𑂜 KAITHI LETTER NNA -> ण
    "\U0001109D": "\u0924",  # 𑂝 KAITHI LETTER TA -> त
    "\U0001109E": "\u0925",  # 𑂞 KAITHI LETTER THA -> थ
    "\U0001109F": "\u0926",  # 𑂟 KAITHI LETTER DA -> द
    "\U000110A0": "\u0927",  # 𑂠 KAITHI LETTER DHA -> ध
    "\U000110A1": "\u0928",  # 𑂡 KAITHI LETTER NA -> न
    "\U000110A2": "\u092A",  # 𑂢 KAITHI LETTER PA -> प
    "\U000110A3": "\u092B",  # 𑂣 KAITHI LETTER PHA -> फ
    "\U000110A4": "\u092C",  # 𑂤 KAITHI LETTER BA -> ब
    "\U000110A5": "\u092D",  # 𑂥 KAITHI LETTER BHA -> भ
    "\U000110A6": "\u092E",  # 𑂦 KAITHI LETTER MA -> म
    "\U000110A7": "\u092F",  # 𑂧 KAITHI LETTER YA -> य
    "\U000110A8": "\u0930",  # 𑂨 KAITHI LETTER RA -> र
    "\U000110A9": "\u0932",  # 𑂩 KAITHI LETTER LA -> ल
    "\U000110AA": "\u0935",  # 𑂪 KAITHI LETTER VA -> व
    "\U000110AB": "\u0936",  # 𑂫 KAITHI LETTER SHA -> श
    "\U000110AC": "\u0937",  # 𑂬 KAITHI LETTER SSA -> ष
    "\U000110AD": "\u0938",  # 𑂭 KAITHI LETTER SA -> स
    "\U000110AE": "\u0939",  # 𑂮 KAITHI LETTER HA -> ह

    # Dependent Vowel Signs (Matras)
    "\U000110AF": "\u093E",  # 𑂯 KAITHI VOWEL SIGN AA -> ा
    "\U000110B0": "\u093F",  # 𑂰 KAITHI VOWEL SIGN I -> ि
    "\U000110B1": "\u0940",  # 𑂱 KAITHI VOWEL SIGN II -> ी
    "\U000110B2": "\u0941",  # 𑂲 KAITHI VOWEL SIGN U -> ु
    "\U000110B3": "\u0942",  # 𑂳 KAITHI VOWEL SIGN UU -> ू
    "\U000110B4": "\u0947",  # 𑂴 KAITHI VOWEL SIGN E -> े
    "\U000110B5": "\u0948",  # 𑂵 KAITHI VOWEL SIGN AI -> ै
    "\U000110B6": "\u094B",  # 𑂶 KAITHI VOWEL SIGN O -> ो
    "\U000110B7": "\u094C",  # 𑂷 KAITHI VOWEL SIGN AU -> ौ

    # Signs & Virama
    "\U000110B8": "\u094D",  # 𑂸 KAITHI SIGN VIRAMA -> ्
    "\U000110B9": "\u093C",  # 𑂹 KAITHI SIGN NUKTA -> ़
    "\U000110BA": "\u0970",  # 𑂺 KAITHI SIGN ABBREVIATION -> ॰
    "\U000110BB": "\u0970",  # 𑂻 KAITHI ENUMERATION SIGN -> ॰
    "\U000110BC": "§",       # 𑂼 KAITHI SECTION MARK -> §
    "\U000110BD": "§§",      # 𑂽 KAITHI DOUBLE SECTION MARK
    "\U000110BE": "\u0964",  # 𑂾 KAITHI DANDA -> ।
    "\U000110BF": "\u0965",  # 𑂿 KAITHI DOUBLE DANDA -> ॥
    "\U000110C0": "—",       # 𑃀 KAITHI SIGN STROKE
}

# Reverse Mapping Dictionary (Devanagari -> Kaithi)
REVERSE_MAPPING: Dict[str, str] = {v: k for k, v in SCRIPT_MAPPING.items() if len(v) == 1}
# Special multi-char reverse mappings
REVERSE_MAPPING["\u0921\u093C"] = "\U0001109B"  # ड़ -> 𑂛
REVERSE_MAPPING["\u095C"] = "\U0001109B"        # ड़ (precomposed) -> 𑂛
REVERSE_MAPPING[" "] = " "                      # Preserve space


def is_kaithi_text(text: str) -> bool:
    """Check if the string contains any Kaithi Unicode characters."""
    for char in text:
        cp = ord(char)
        if 0x11080 <= cp <= 0x110DF:
            return True
    return False


def kaithi_to_devanagari(text: str) -> str:
    """
    Transliterate a Kaithi text string to Devanagari script.
    Preserves whitespace, punctuation, and unmapped characters.
    """
    if not text:
        return ""

    result: List[str] = []
    i = 0
    length = len(text)

    while i < length:
        char = text[i]
        if char in SCRIPT_MAPPING:
            result.append(SCRIPT_MAPPING[char])
        else:
            result.append(char)
        i += 1

    # Normalize unicode to NFC for clean rendering
    return unicodedata.normalize("NFC", "".join(result))


def devanagari_to_kaithi(text: str) -> str:
    """
    Transliterate a Devanagari text string to Kaithi script.
    """
    if not text:
        return ""

    # Normalize to NFD first to handle nukta decomposition cleanly
    norm_text = unicodedata.normalize("NFD", text)
    result: List[str] = []
    i = 0
    length = len(norm_text)

    while i < length:
        # Check for 2-char sequences first (e.g. char + nukta)
        if i + 1 < length:
            two_char = norm_text[i : i + 2]
            if two_char in REVERSE_MAPPING:
                result.append(REVERSE_MAPPING[two_char])
                i += 2
                continue

        char = norm_text[i]
        if char in REVERSE_MAPPING:
            result.append(REVERSE_MAPPING[char])
        else:
            # Check NFC single char
            single_nfc = unicodedata.normalize("NFC", char)
            result.append(REVERSE_MAPPING.get(single_nfc, char))
        i += 1

    return "".join(result)


def get_character_breakdown(kaithi_text: str) -> List[Dict[str, Any]]:
    """
    Analyze Kaithi text character by character with Unicode codepoints,
    names, and corresponding Devanagari equivalents.
    Useful for interactive UI inspection and learning modes.
    """
    breakdown = []
    for char in kaithi_text:
        if char in ("\n", "\r", "\t", " "):
            continue
        cp = ord(char)
        is_kaithi = 0x11080 <= cp <= 0x110DF
        deva_equiv = SCRIPT_MAPPING.get(char, char)
        try:
            name = unicodedata.name(char)
        except ValueError:
            name = f"KAITHI CHARACTER U+{cp:04X}" if is_kaithi else "UNKNOWN"

        breakdown.append({
            "char": char,
            "codepoint": f"U+{cp:04X}",
            "is_kaithi": is_kaithi,
            "devanagari": deva_equiv,
            "name": name
        })
    return breakdown
