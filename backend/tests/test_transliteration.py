"""
Unit tests for the Kaithi to Devanagari (and reverse) transliteration engine.
Uses standard library unittest for standalone execution.
"""

import unittest
from backend.transliteration.kaithi_to_deva import (
    kaithi_to_devanagari,
    devanagari_to_kaithi,
    is_kaithi_text,
    get_character_breakdown,
    SCRIPT_MAPPING,
)


class TestKaithiTransliteration(unittest.TestCase):
    def test_kaithi_detection(self):
        self.assertTrue(is_kaithi_text("𑂍𑂵𑂞𑂱"))
        self.assertFalse(is_kaithi_text("कैथी"))
        self.assertFalse(is_kaithi_text("Hello World 123"))
        self.assertTrue(is_kaithi_text("Mixed 𑂍 text"))

    def test_independent_vowels(self):
        kaithi_vowels = "𑂃𑂄𑂅𑂆𑂇𑂈𑂉𑂊𑂋𑂌"
        expected_deva = "अआइईउऊएऐओऔ"
        self.assertEqual(kaithi_to_devanagari(kaithi_vowels), expected_deva)

    def test_consonants(self):
        kaithi_cons = "𑂍𑂎𑂏𑂐𑂑𑂒𑂓𑂔𑂕𑂖𑂗𑂘𑂙𑂚𑂜𑂝𑂞𑂟𑂠𑂡𑂢𑂣𑂤𑂥𑂦𑂧𑂨𑂩𑂪𑂫𑂬𑂭𑂮"
        deva_cons = kaithi_to_devanagari(kaithi_cons)
        self.assertEqual(deva_cons, "कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह")

    def test_dependent_vowel_signs_matras(self):
        # 𑂍 (KA) + 𑂰 (I) -> कि
        self.assertEqual(kaithi_to_devanagari("𑂍𑂰"), "कि")
        # 𑂍 (KA) + 𑂱 (II) -> की
        self.assertEqual(kaithi_to_devanagari("𑂍𑂱"), "की")
        # 𑂍 (KA) + 𑂲 (U) -> कु
        self.assertEqual(kaithi_to_devanagari("𑂍𑂲"), "कु")
        # 𑂍 (KA) + 𑂳 (UU) -> कू
        self.assertEqual(kaithi_to_devanagari("𑂍𑂳"), "कू")
        # 𑂍 (KA) + 𑂴 (E) -> के
        self.assertEqual(kaithi_to_devanagari("𑂍𑂴"), "के")
        # 𑂍 (KA) + 𑂵 (AI) -> कै
        self.assertEqual(kaithi_to_devanagari("𑂍𑂵"), "कै")
        # 𑂍 (KA) + 𑂶 (O) -> को
        self.assertEqual(kaithi_to_devanagari("𑂍𑂶"), "को")
        # 𑂍 (KA) + 𑂷 (AU) -> कौ
        self.assertEqual(kaithi_to_devanagari("𑂍𑂷"), "कौ")

    def test_kaithi_term_transliteration(self):
        # 𑂍 (KA) + 𑂵 (AI) + 𑂞 (THA) + 𑂱 (II) -> कैथी
        self.assertEqual(kaithi_to_devanagari("𑂍𑂵𑂞𑂱"), "कैथी")
        # 𑂨 (RA) + 𑂯 (AA) + 𑂦 (MA) -> राम
        self.assertEqual(kaithi_to_devanagari("𑂨𑂯𑂦"), "राम")

    def test_danda_and_signs(self):
        # Danda 𑂾 -> । , Double Danda 𑂿 -> ॥
        self.assertEqual(kaithi_to_devanagari("𑂾"), "।")
        self.assertEqual(kaithi_to_devanagari("𑂿"), "॥")
        # Anusvara 𑂁 -> ं on 𑂨 (RA) -> रं
        self.assertEqual(kaithi_to_devanagari("𑂨𑂁"), "रं")

    def test_reverse_transliteration(self):
        self.assertEqual(devanagari_to_kaithi("क"), "𑂍")
        self.assertEqual(devanagari_to_kaithi("ख"), "𑂎")
        self.assertEqual(devanagari_to_kaithi("ग"), "𑂏")

    def test_character_breakdown(self):
        breakdown = get_character_breakdown("𑂍𑂾")
        self.assertEqual(len(breakdown), 2)
        self.assertEqual(breakdown[0]["char"], "𑂍")
        self.assertTrue(breakdown[0]["is_kaithi"])
        self.assertEqual(breakdown[0]["devanagari"], "क")
        self.assertEqual(breakdown[1]["char"], "𑂾")
        self.assertEqual(breakdown[1]["devanagari"], "।")


if __name__ == "__main__":
    unittest.main()
