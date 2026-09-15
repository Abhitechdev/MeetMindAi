import sys
import os
from unittest.mock import MagicMock

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.services import gemini_service

def test_model_fallback():
    # 1. Verify Groq candidate selection
    os.environ["GROQ_API_KEY"] = "fake-groq-key"
    client, groq_models = gemini_service._get_client()
    assert "openai/gpt-oss-120b" in groq_models
    assert "qwen/qwen3.6-27b" in groq_models

    # 2. Verify fallback execution on 404 / model_not_found
    mock_client = MagicMock()
    call_log = []

    def fake_create(model, **kwargs):
        call_log.append(model)
        if model == "decommissioned-model":
            raise Exception("Error code: 404 - {'error': {'message': 'The model decommissioned-model does not exist or you do not have access to it.', 'type': 'invalid_request_error', 'code': 'model_not_found'}}")
        return MagicMock(choices=[MagicMock(message=MagicMock(content='{"title": "Test"}'))])

    mock_client.chat.completions.create.side_effect = fake_create

    result = gemini_service._create_completion(mock_client, ["decommissioned-model", "openai/gpt-oss-120b"])
    assert call_log == ["decommissioned-model", "openai/gpt-oss-120b"]
    assert result.choices[0].message.content == '{"title": "Test"}'
    print("ALL TESTS PASSED: Model fallback seamlessly recovered from decommissioned model.")

if __name__ == "__main__":
    test_model_fallback()
