from unittest.mock import patch
import pytest
from unittest.mock import AsyncMock
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

class MockResponse:
    async def __aiter__(self):
        yield {
            'choices': [
                {
                    'delta': {
                        'content': 'Hello, world!'
                    }
                }
            ]
        }


@pytest.mark.asyncio
async def test_endpoint():
    with patch('openai.ChatCompletion.acreate', new_callable=AsyncMock) as mock_acreate:
        # Define the mock response
        mock_acreate.return_value = MockResponse()

        # Make request to application
        response = client.post("/gpt4", json={
            'messages': [
                {'role': 'system', 'content': 'Act like an assistant'},
                {'role': 'user', 'content': 'Hello'}
            ],
            'model_type': 'gpt-3.5-turbo'
        })

        # Check the response
        assert response.status_code == 200
        assert response.content.decode() == 'Hello, world!'


