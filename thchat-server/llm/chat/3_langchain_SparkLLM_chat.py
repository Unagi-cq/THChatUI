#!/usr/bin/env python
from typing import List, Optional
from pydantic import Field
from fastapi import FastAPI
from langchain_community.chat_models import ChatSparkLLM
from langchain_core.runnables import RunnableParallel, RunnableLambda
from langserve import add_routes, CustomUserType
from langchain.globals import set_debug

set_debug(True)

app = FastAPI(
    title="LangChain Server",
    version="1.0",
    description="A simple api server using Langchain's Runnable interfaces",
)

model = ChatSparkLLM(
    spark_app_id="xxx",
    spark_api_key="xxx",
    spark_api_secret="xxx",
    streaming=True,
    spark_api_url="wss://spark-api.xf-yun.com/v1.1/chat",
    spark_llm_domain="general",
)


class ChatTurn(CustomUserType):
    user: str
    assistant: Optional[str] = None


class ChatHistory(CustomUserType):
    prompt: str
    history: List[ChatTurn] = Field(default_factory=list)


def _format_to_messages(input: ChatHistory):
    """Format the input to a list of messages."""
    messages = [
        {"role": "system", "content": "You are a helpful assistant."}
    ]

    for chat in input.history:
        messages.append({"role": "user", "content": chat.user})
        messages.append({"role": "assistant", "content": chat.assistant})

    messages.append({"role": "user", "content": input.prompt})

    return messages


model = RunnableParallel({"data": (RunnableLambda(_format_to_messages) | model)})

add_routes(
    app,
    model.with_types(input_type=ChatHistory),
    path="/chat",
)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=5000)
