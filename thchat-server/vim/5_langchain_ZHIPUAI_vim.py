#!/usr/bin/env python
import os
from typing import List, Optional
from langchain.pydantic_v1 import Field
from fastapi import FastAPI
from langchain_community.chat_models import ChatZhipuAI
from langchain_core.runnables import RunnableParallel, RunnableLambda
from langserve import add_routes, CustomUserType
from langchain.globals import set_debug

set_debug(True)

os.environ["ZHIPUAI_API_KEY"] = "xxx"

app = FastAPI(
    title="LangChain Server",
    version="1.0",
    description="A simple api server using Langchain's Runnable interfaces",
)

model = ChatZhipuAI(model="glm-4v-flash", streaming=True)


class ChatTurn(CustomUserType):
    user: str
    assistant: Optional[str] = None


class Picture(CustomUserType):
    base64: str


class ChatHistory(CustomUserType):
    prompt: str
    history: List[ChatTurn] = Field(default_factory=list)
    files: List[Picture] = Field(default_factory=list)


def _format_to_messages(input: ChatHistory):
    """Format the input to a list of messages."""
    messages = [
        {"role": "system", "content": "You are a helpful assistant."}
    ]

    # 处理历史对话
    for chat in input.history:
        messages.append({"role": "user", "content": [{"type": "text", "text": chat.user}]})
        messages.append({"role": "assistant", "content": [{"type": "text", "text": chat.assistant}]})

    # 构建当前用户消息的 content
    content = []
    
    # 添加图片（如果有）
    if input.files and len(input.files) > 0:
        content.append({
            "type": "image_url",
            "image_url": {
                "url": input.files[0].base64
            }
        })
    
    # 添加文本
    content.append({
        "type": "text",
        "text": input.prompt
    })

    # 添加当前用户消息
    messages.append({"role": "user", "content": content})

    return messages


model = RunnableParallel({"data": (RunnableLambda(_format_to_messages) | model)})

add_routes(
    app,
    model.with_types(input_type=ChatHistory),
    path="/vim",
)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=5000)
