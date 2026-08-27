import pytest
from app.ai.currency_voice import (
    integer_to_words,
    currency_amount_to_words,
    expand_all_currencies_in_text,
    clean_brand_name,
    preprocess_text_for_voice
)
from app.api.v1.voice import generate_storyline_script


def test_user_exact_currency_example():
    """
    Test user exact example:
    e.g. N 162, 185,173.21 -> One hundred and Sixty-two million, One hundred and Eighty-five thousand, One hundred and Seventy-three Naira Twenty-one kobo
    """
    input_text = "N 162, 185,173.21"
    output = expand_all_currencies_in_text(input_text)
    expected = "One hundred and Sixty-two million, One hundred and Eighty-five thousand, One hundred and Seventy-three Naira Twenty-one kobo"
    assert output.lower() == expected.lower()


def test_naira_unicode_symbol_formatting():
    input_text = "Revenue reached ₦162,185,173.21 today."
    output = expand_all_currencies_in_text(input_text)
    assert "One hundred and Sixty-two million, One hundred and Eighty-five thousand, One hundred and Seventy-three Naira Twenty-one kobo" in output
    assert "₦" not in output


def test_negative_currency():
    input_text = "Estimated financial drag is -₦162,185,173.21."
    output = expand_all_currencies_in_text(input_text)
    assert "minus One hundred and Sixty-two million, One hundred and Eighty-five thousand, One hundred and Seventy-three Naira Twenty-one kobo" in output


def test_abbreviated_billions_and_millions():
    input_text = "Revenue stands at ₦1.24B and gross profit is ₦162.18M."
    output = expand_all_currencies_in_text(input_text)
    assert "One point Two Four billion Naira" in output
    assert "One hundred and Sixty-two point One Eight million Naira" in output


def test_whole_amounts_and_kobo_only():
    # Whole Naira without decimals
    res_whole = expand_all_currencies_in_text("Total order size is ₦50,000")
    assert res_whole == "Total order size is Fifty thousand Naira"

    # Only kobo
    res_kobo = expand_all_currencies_in_text("Fee is ₦0.21.")
    assert res_kobo == "Fee is Twenty-one kobo."

    # One Naira
    res_one = expand_all_currencies_in_text("Price is ₦1.00")
    assert res_one == "Price is One Naira"

    # One Naira One kobo
    res_one_kobo = expand_all_currencies_in_text("Adjusted delta is ₦1.01")
    assert res_one_kobo == "Adjusted delta is One Naira One kobo"


def test_usd_gbp_eur_currencies():
    res_usd = expand_all_currencies_in_text("US store sales reached $1,500.50")
    assert "One thousand, Five hundred Dollars Fifty cents" in res_usd

    res_gbp = expand_all_currencies_in_text("UK store sales reached £250,000")
    assert "Two hundred and Fifty thousand Pounds" in res_gbp

    res_eur = expand_all_currencies_in_text("EU store sales reached €10.25")
    assert "Ten Euros Twenty-five cents" in res_eur


def test_clean_brand_name_nexasphere():
    """
    Test user requirement:
    'the voice said hi Nexasphere Omnichannel Dataset' i want it to say only Hi Nexasphere'
    """
    assert clean_brand_name("Nexasphere Omnichannel Dataset") == "Nexasphere"
    assert clean_brand_name("NexaSphere Omnichannel Dataset") == "Nexasphere"
    assert clean_brand_name("NexaSphere Enterprise (Fact_Sales)") == "Nexasphere"
    assert clean_brand_name("Nexasphere - Omnichannel Dataset") == "Nexasphere"
    assert clean_brand_name("nexasphere.csv") == "Nexasphere"
    assert clean_brand_name("Connected Business Dataset") == "there"


def test_generate_storyline_script_greeting_and_currency():
    """
    Verifies that the generated storyline script says 'Hi Nexasphere'
    and spells out currency amounts in spoken words.
    """
    script = generate_storyline_script(
        business_name="Nexasphere Omnichannel Dataset",
        overall_status="Commercial performance is robust at ₦162,185,173.21 — all core business drivers are tracking ahead of target benchmarks.",
        biggest_win="Gross revenue reached ₦162,185,173.21, driving primary commercial cashflow.",
        biggest_risk="Return rate concentration in Lagos represents a financial impact of -₦50,000.00.",
        next_actions=["Investigate return drivers and category mix in Lagos"]
    )

    # Must start with Hi Nexasphere (NOT Hi Nexasphere Omnichannel Dataset)
    assert script.startswith("Hi Nexasphere, I'm Vesta, here is how your business looks today:")
    assert "Omnichannel Dataset" not in script

    # Currencies must be spelled out
    assert "One hundred and Sixty-two million, One hundred and Eighty-five thousand, One hundred and Seventy-three Naira Twenty-one kobo" in script
    assert "minus Fifty thousand Naira" in script
    assert "₦" not in script
