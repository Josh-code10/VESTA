import re
from typing import Optional

UNITS = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
]
TENS = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
]
SCALES = ["", "thousand", "million", "billion", "trillion"]

DIGIT_WORDS = {
    "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four",
    "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine"
}


def integer_to_words(num: int) -> str:
    """
    Converts an integer into spoken English words with proper hyphenation and 'and' placement.
    Example: 162 -> "One hundred and Sixty-two", 185 -> "One hundred and Eighty-five"
    """
    if num == 0:
        return "Zero"
    if num < 0:
        return f"minus {integer_to_words(abs(num))}"

    def convert_below_thousand(n: int) -> str:
        if n == 0:
            return ""
        if n < 20:
            return UNITS[n]
        if n < 100:
            rem = n % 10
            return TENS[n // 10] + (f"-{UNITS[rem].lower()}" if rem > 0 else "")
        h = n // 100
        rem = n % 100
        res = f"{UNITS[h]} hundred"
        if rem > 0:
            res += f" and {convert_below_thousand(rem)}"
        return res

    chunks = []
    temp = num
    scale_idx = 0

    while temp > 0 and scale_idx < len(SCALES):
        chunk = temp % 1000
        if chunk > 0:
            words = convert_below_thousand(chunk)
            scale = SCALES[scale_idx]
            if scale:
                chunks.append(f"{words} {scale}")
            else:
                chunks.append(words)
        temp //= 1000
        scale_idx += 1

    chunks.reverse()
    return ", ".join(chunks)


def currency_amount_to_words(
    raw_num_str: str,
    currency_code: str = "NGN",
    abbrev_suffix: str = "",
    is_negative: bool = False
) -> str:
    """
    Converts raw currency number string (e.g. '162, 185,173.21' or '1.24' with 'B')
    into full spoken English words with proper currency units (Naira/kobo, Dollars/cents, etc.).
    Example: 'N 162, 185,173.21' -> 'One hundred and Sixty-two million, One hundred and Eighty-five thousand, One hundred and Seventy-three Naira Twenty-one kobo'
    """
    curr = currency_code.upper().strip()
    if curr in ["NGN", "NAIRA", "₦", "N"]:
        major_singular = "Naira"
        major_plural = "Naira"
        minor_singular = "kobo"
        minor_plural = "kobo"
    elif curr in ["USD", "$", "DOLLAR", "DOLLARS"]:
        major_singular = "Dollar"
        major_plural = "Dollars"
        minor_singular = "cent"
        minor_plural = "cents"
    elif curr in ["GBP", "£", "POUND", "POUNDS"]:
        major_singular = "Pound"
        major_plural = "Pounds"
        minor_singular = "penny"
        minor_plural = "pence"
    elif curr in ["EUR", "€", "EURO", "EUROS"]:
        major_singular = "Euro"
        major_plural = "Euros"
        minor_singular = "cent"
        minor_plural = "cents"
    else:
        major_singular = curr
        major_plural = curr
        minor_singular = "cents"
        minor_plural = "cents"

    # Clean numeric string: remove commas, extra spaces
    clean_num = re.sub(r"[\s,]+", "", raw_num_str)
    if not clean_num:
        return ""

    prefix = "minus " if is_negative else ""

    # Handle abbreviated suffixes (K, M, B, T) e.g., 1.24B or 162.18M
    if abbrev_suffix:
        suf = abbrev_suffix.upper().strip()
        scale_name_map = {
            "K": "thousand",
            "M": "million",
            "B": "billion",
            "T": "trillion"
        }
        scale_word = scale_name_map.get(suf[0], "")

        if "." not in clean_num:
            try:
                int_val = int(clean_num)
            except ValueError:
                return f"{prefix}{clean_num} {abbrev_suffix} {major_plural}".strip()
            int_words = integer_to_words(int_val)
            major = major_singular if int_val == 1 and not scale_word else major_plural
            return f"{prefix}{int_words} {scale_word} {major}".strip()
        else:
            # e.g. 1.24B -> "One point Two Four billion Naira"
            parts = clean_num.split(".", 1)
            try:
                int_part = int(parts[0]) if parts[0] else 0
            except ValueError:
                int_part = 0
            int_words = integer_to_words(int_part)
            dec_digits_words = " ".join(DIGIT_WORDS.get(d, d) for d in parts[1])
            major = major_plural
            return f"{prefix}{int_words} point {dec_digits_words} {scale_word} {major}".strip()

    # Standard full numbers with optional decimal (e.g. 162,185,173.21)
    if "." in clean_num:
        parts = clean_num.split(".", 1)
        int_str, dec_str = parts[0], parts[1]
    else:
        int_str, dec_str = clean_num, ""

    try:
        int_val = int(int_str) if int_str else 0
    except ValueError:
        return f"{prefix}{raw_num_str} {major_plural}".strip()

    # Parse decimal as 2-digit subunit (cents / kobo)
    dec_val = 0
    if dec_str:
        # Normalize to 2 decimal places e.g., '2' -> 20, '21' -> 21, '215' -> 22, '05' -> 5
        if len(dec_str) == 1:
            dec_str = dec_str + "0"
        elif len(dec_str) > 2:
            dec_val = round(float(f"0.{dec_str}") * 100)
            dec_str = f"{dec_val:02d}"
        dec_val = int(dec_str[:2])

    major_word = major_singular if int_val == 1 else major_plural
    minor_word = minor_singular if dec_val == 1 else minor_plural

    if int_val > 0 and dec_val > 0:
        int_words = integer_to_words(int_val)
        dec_words = integer_to_words(dec_val)
        return f"{prefix}{int_words} {major_word} {dec_words} {minor_word}".strip()
    elif int_val > 0 and dec_val == 0:
        int_words = integer_to_words(int_val)
        return f"{prefix}{int_words} {major_word}".strip()
    elif int_val == 0 and dec_val > 0:
        dec_words = integer_to_words(dec_val)
        return f"{prefix}{dec_words} {minor_word}".strip()
    else:
        return f"{prefix}Zero {major_plural}".strip()


def expand_all_currencies_in_text(text: str) -> str:
    """
    Scans arbitrary input text, detects all currencies (₦, NGN, N, $, £, €, 'naira', etc.)
    and spells out their numerical amounts into natural English words suitable for speech synthesis.
    """
    if not text:
        return text

    # Base number regex: digits with optional embedded commas/spaces, optional decimal
    # e.g., '162, 185,173.21', '50,000', '1.24', '0.75'
    NUM_RE = r"(?:\d+(?:[,\s]+\d+)*(?:\.\d+)?|\.\d+)"
    ABBREV_RE = r"(?:[KkMmBbTt](?:illion|illion)?\b)"

    # Unified single-pass currency pattern:
    # Handles:
    # 1. Prefix symbols: ₦, NGN, N (standalone before digit), $, £, €
    # 2. Suffix words: naira, dollars, pounds, euros
    CURRENCY_PATTERN = re.compile(
        rf"(?<!\w)([-–—]?)(?:(₦|NGN|\$|£|€)|(\bN\b(?=\s*\d)))\s*({NUM_RE})(?:\s*({ABBREV_RE}))?(?:\s+(naira|dollars?|pounds?|euros?)\b)?|"
        rf"(?<!\w)([-–—]?)\b({NUM_RE})(?:\s*({ABBREV_RE}))?\s+(naira|dollars?|pounds?|euros?)\b",
        re.IGNORECASE | re.UNICODE
    )

    def replace_currency(match):
        groups = match.groups()
        # Case A: Prefix symbol/code
        if groups[1] or groups[2]:
            neg = bool(groups[0])
            symbol = (groups[1] or groups[2] or "").upper().strip()
            num_str = groups[3].strip()
            abbrev = groups[4] or ""
            suffix_word = (groups[5] or "").upper().strip()

            if symbol in ["₦", "NGN", "N"] or suffix_word == "NAIRA":
                curr = "NGN"
            elif symbol == "$" or "DOLLAR" in suffix_word:
                curr = "USD"
            elif symbol == "£" or "POUND" in suffix_word:
                curr = "GBP"
            elif symbol == "€" or "EURO" in suffix_word:
                curr = "EUR"
            else:
                curr = "NGN"

            return currency_amount_to_words(num_str, curr, abbrev, neg)

        # Case B: Suffix currency (e.g. 50,000 naira)
        elif groups[7]:
            neg = bool(groups[6])
            num_str = groups[7].strip()
            abbrev = groups[8] or ""
            suffix_word = (groups[9] or "").upper().strip()

            if "NAIRA" in suffix_word:
                curr = "NGN"
            elif "DOLLAR" in suffix_word:
                curr = "USD"
            elif "POUND" in suffix_word:
                curr = "GBP"
            elif "EURO" in suffix_word:
                curr = "EUR"
            else:
                curr = "NGN"

            return currency_amount_to_words(num_str, curr, abbrev, neg)

        return match.group(0)

    text = CURRENCY_PATTERN.sub(replace_currency, text)
    # Clean redundant spaces
    text = re.sub(r"[ \t]+", " ", text).strip()
    return text


def clean_brand_name(raw_name: Optional[str]) -> str:
    """
    Cleans dataset or workspace titles down to the core executive business brand.
    e.g. "Nexasphere Omnichannel Dataset" -> "Nexasphere"
         "NexaSphere Enterprise (Fact_Sales)" -> "Nexasphere"
    """
    if not raw_name:
        return "there"
    name = raw_name.strip()

    # Remove parenthesized sheet details e.g. "(Fact_Sales)" or "(Sheet1)"
    name = re.sub(r"\(.*?\)", "", name).strip()

    # Remove file extensions
    for ext in [".csv", ".xlsx", ".xls", ".json"]:
        if name.lower().endswith(ext):
            name = name[:-len(ext)].strip()

    # Specific brand recognition
    if "nexasphere" in name.lower():
        return "Nexasphere"

    # Generic dataset placeholders -> "there"
    if name.lower() in [
        "connected business dataset",
        "demo dataset",
        "connected google sheet",
        "ws_default",
        "untitled",
        "dataset",
        "sheet",
        "retail enterprise"
    ]:
        return "there"

    # Common technical/data-oriented descriptor terms to strip out
    descriptor_terms = [
        "omnichannel dataset",
        "omnichannel data",
        "enterprise dataset",
        "business dataset",
        "sales dataset",
        "retail dataset",
        "transaction dataset",
        "transactions dataset",
        "omnichannel",
        "enterprise",
        "dataset",
        "data set",
        "data",
        "sheet",
        "transactions",
        "transaction records",
        "records",
        "analytics",
        "report"
    ]

    for term in descriptor_terms:
        name = re.sub(rf"\b{re.escape(term)}\b", "", name, flags=re.IGNORECASE).strip()

    name = re.sub(r"[\-_|:]+$", "", name).strip()
    name = re.sub(r"^[\-_|:]+", "", name).strip()
    name = " ".join(name.split())

    if not name or name.lower() in ["the", "my", "our"]:
        return "there"

    return name


def preprocess_text_for_voice(text: str) -> str:
    """
    Preprocesses any text before sending to ElevenLabs TTS:
    1. Replaces technical phrases like "Nexasphere Omnichannel Dataset" with "Nexasphere".
    2. Expands all numeric currencies into spelled-out words (e.g. ₦162,185,173.21 -> words).
    3. Normalizes whitespace and pauses.
    """
    if not text:
        return text

    cleaned = text

    # Remove "Omnichannel Dataset" and technical suffixes attached to brands
    cleaned = re.sub(r"Nexasphere\s+Omnichannel\s+Dataset", "Nexasphere", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"Nexasphere\s+Enterprise\s+Dataset", "Nexasphere", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\bOmnichannel\s+Dataset\b", "", cleaned, flags=re.IGNORECASE)

    # Expand currencies to spelled out words
    cleaned = expand_all_currencies_in_text(cleaned)

    # Clean redundant spaces
    cleaned = re.sub(r"[ \t]+", " ", cleaned).strip()
    return cleaned
