#!/usr/bin/env python
import os
from typing import List, Optional
from langchain.pydantic_v1 import Field
from fastapi import FastAPI
from langchain_community.chat_models.tongyi import ChatTongyi
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_core.runnables import RunnableParallel, RunnableLambda
from langserve import add_routes, CustomUserType
from langchain.globals import set_debug

set_debug(True)

os.environ["DASHSCOPE_API_KEY"] = "xxx"

app = FastAPI(
    title="LangChain Server",
    version="1.0",
    description="A simple api server using Langchain's Runnable interfaces",
)

model = ChatTongyi(model="qwen-turbo", streaming=True)


class ChatTurn(CustomUserType):
    user: str
    assistant: Optional[str] = None


class ChatHistory(CustomUserType):
    prompt: str
    history: List[ChatTurn] = Field(default_factory=list)


def _format_to_messages(input: ChatHistory) -> List[BaseMessage]:
    """Format the input to a list of messages."""
    history = input.history
    user_input = input.prompt

    messages = []

    for turn in history:
        messages.append(HumanMessage(content=turn.user))
        messages.append(AIMessage(content=turn.assistant))
    messages.append(HumanMessage(content=user_input))
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
