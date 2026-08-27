import hashlib
import json
import logging
import urllib.error
import urllib.request
from typing import Dict, List, Optional
from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel

from app.core.config import settings
from app.ai.currency_voice import (
    clean_brand_name,
    expand_all_currencies_in_text,
    preprocess_text_for_voice
)

logger = logging.getLogger(__name__)
router = APIRouter()

# ElevenLabs Verified Voice IDs
VOICE_IDS: Dict[str, str] = {
    "adam": "pNInz6obpgDQGcFmaJgB",      # Male Executive
    "sarah": "EXAVITQu4vr4xnSDxMaL",     # Lady / Female Executive
    "male": "pNInz6obpgDQGcFmaJgB",
    "female": "EXAVITQu4vr4xnSDxMaL"
}

# In-memory Audio Cache: sha256(voice_id + "::" + preprocessed_text) -> bytes
_AUDIO_CACHE: Dict[str, bytes] = {}


class StorylineVoiceRequest(BaseModel):
    business_name: Optional[str] = "Retail Enterprise"
    overall_status: str
    biggest_win: Optional[str] = None
    biggest_risk: Optional[str] = None
    next_actions: Optional[List[str]] = None
    voice: Optional[str] = "adam"


class SpeakRequest(BaseModel):
    text: str
    voice: Optional[str] = "adam"


def generate_storyline_script(
    business_name: str,
    overall_status: str,
    biggest_win: Optional[str],
    biggest_risk: Optional[str],
    next_actions: Optional[List[str]]
) -> str:
    """
    Generates a spoken executive briefing storyline script.
    Guarantees that brand names like 'Nexasphere Omnichannel Dataset' are cleaned to 'Nexasphere'
    so the voice greeting cleanly says 'Hi Nexasphere'.
    All currencies (₦, N, $, £, €) are expanded into natural English words.
    """
    # Clean brand/business name (e.g., "Nexasphere Omnichannel Dataset" -> "Nexasphere")
    b_name = clean_brand_name(business_name)

    # Start with the exact executive greeting requested
    parts = [f"Hi {b_name}, I'm Vesta, here is how your business looks today: {overall_status.strip()}"]

    if biggest_win and len(biggest_win.strip()) > 5:
        clean_win = biggest_win.strip()
        if not clean_win.lower().startswith("on the upside") and not clean_win.lower().startswith("additionally"):
            parts.append(f"On the upside, {clean_win}")
        else:
            parts.append(clean_win)

    if biggest_risk and len(biggest_risk.strip()) > 5:
        clean_risk = biggest_risk.strip()
        if not clean_risk.lower().startswith("however") and not clean_risk.lower().startswith("on the risk"):
            parts.append(f"However, {clean_risk}")
        else:
            parts.append(clean_risk)

    if next_actions and len(next_actions) > 0 and len(next_actions[0].strip()) > 5:
        clean_act = next_actions[0].strip()
        parts.append(f"My recommended next action is: {clean_act}.")

    raw_script = " ".join(parts)
    return preprocess_text_for_voice(raw_script)


def synthesize_elevenlabs_audio(text: str, voice_key: str = "adam") -> bytes:
    """
    Preprocesses speech text to expand currencies and remove technical suffixes,
    then synthesizes with ElevenLabs TTS.
    """
    api_key = settings.ELEVENLABS_API_KEY
    if not api_key:
        raise HTTPException(status_code=500, detail="ElevenLabs API key is not configured.")

    voice_id = VOICE_IDS.get(voice_key.lower().strip(), VOICE_IDS["adam"])

    # Expand any currency symbols or numbers into full spoken words
    speech_text = preprocess_text_for_voice(text)

    # Check cache first
    cache_key = hashlib.sha256(f"{voice_id}::{speech_text.strip()}".encode("utf-8")).hexdigest()
    if cache_key in _AUDIO_CACHE:
        logger.info(f"Serving cached voice audio for key: {cache_key[:8]}")
        return _AUDIO_CACHE[cache_key]

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    payload = {
        "text": speech_text.strip(),
        "model_id": "eleven_turbo_v2_5",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.0,
            "use_speaker_boost": True
        }
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "xi-api-key": api_key.strip(),
            "Content-Type": "application/json",
            "Accept": "audio/mpeg"
        }
    )

    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            audio_bytes = response.read()
            _AUDIO_CACHE[cache_key] = audio_bytes
            return audio_bytes
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="ignore")
        logger.error(f"ElevenLabs TTS Error ({e.code}): {err_body}")
        raise HTTPException(status_code=e.code, detail=f"ElevenLabs error: {err_body}")
    except Exception as e:
        logger.error(f"Failed to synthesize audio: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Audio synthesis failed: {str(e)}")


@router.post("/storyline")
async def speak_business_storyline(req: StorylineVoiceRequest):
    """
    Synthesizes and streams high-fidelity human speech for Today's Business Storyline.
    Starts with: "Hi [Business Name], I'm Vesta, here is how your business looks today..."
    Automatically converts all monetary amounts (e.g. ₦162,185,173.21) into natural English words.
    """
    script = generate_storyline_script(
        business_name=req.business_name or "Retail Enterprise",
        overall_status=req.overall_status,
        biggest_win=req.biggest_win,
        biggest_risk=req.biggest_risk,
        next_actions=req.next_actions
    )

    audio_bytes = synthesize_elevenlabs_audio(script, req.voice or "adam")
    return Response(content=audio_bytes, media_type="audio/mpeg")


@router.post("/speak")
async def speak_custom_text(req: SpeakRequest):
    """
    Synthesizes raw text with selected voice (adam or sarah).
    Automatically recognizes and expands currency values into full spoken words.
    """
    audio_bytes = synthesize_elevenlabs_audio(req.text, req.voice or "adam")
    return Response(content=audio_bytes, media_type="audio/mpeg")

