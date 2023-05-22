import os
from typing import List, Optional
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import openai
from openai.error import OpenAIError
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")
openai.api_key = os.getenv("OPENAI_API_KEY")


class Message(BaseModel):
    role: str
    content: str


@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


async def generate(messages: List[Message], model_type: str):
    try:
        response = await openai.ChatCompletion.acreate(
            model=model_type,
            messages=[message.dict() for message in messages],
            stream=True
        )

        async for chunk in response:
            content = chunk['choices'][0]['delta'].get('content', '')
            if content:
                yield content

    except OpenAIError as e:
        yield f"{type(e).__name__}: {str(e)}"


class Gpt4Request(BaseModel):
    messages: List[Message]
    model_type: str


@app.post("/gpt4")
async def gpt4(request: Gpt4Request):
    assistant_response = generate(request.messages, request.model_type)
    return StreamingResponse(assistant_response, media_type='text/event-stream')


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
