#!/usr/bin/env python
import os
from typing import List, Optional
from langchain.pydantic_v1 import Field
from fastapi import FastAPI
from langchain_community.chat_models import ChatZhipuAI
from langchain_core.runnables import RunnableParallel, RunnableLambda
from langserve import add_routes, CustomUserType
from langchain.globals import set_debug
from tavily import TavilyClient

tavily = TavilyClient(api_key="xxx")

set_debug(True)

os.environ["ZHIPUAI_API_KEY"] = "xxx"

app = FastAPI(
    title="LangChain Server",
    version="1.0",
    description="A simple api server using Langchain's Runnable interfaces",
)

model = ChatZhipuAI(model="glm-4-flash", streaming=True)


class ChatTurn(CustomUserType):
    user: str
    assistant: Optional[str] = None


class ChatHistory(CustomUserType):
    prompt: str
    history: List[ChatTurn] = Field(default_factory=list)


def _search(input: ChatHistory):
    """执行搜索并返回结果"""
    response = tavily.search(query=input.prompt, search_depth="advanced")
    web_data = [f"标题：{item['title']}\n内容：{item['content']}\n" for item in response['results']]
    return web_data[:2]


def _format_to_messages(search_results, input: ChatHistory):
    """Format the input to a list of messages."""
    messages = [
        {"role": "system", "content": "You are a helpful assistant."}
    ]

    for chat in input.history:
        messages.append({"role": "user", "content": chat.user})
        messages.append({"role": "assistant", "content": chat.assistant})

    messages.append({"role": "user", "content": "根据以下联网搜索结果回答问题:\n联网搜索结果:" + ''.join(
        search_results) + "\n问题:" + input.prompt})

    return messages


# 重新定义执行链
chain = RunnableParallel({
    "search_results": RunnableLambda(_search),
    "input": lambda x: x,
}).assign(
    messages=lambda x: _format_to_messages(x["search_results"], x["input"])
)

final_chain = RunnableParallel({"data": (chain | RunnableLambda(lambda x: x["messages"]) | model)})

add_routes(
    app,
    final_chain.with_types(input_type=ChatHistory),
    path="/chat",
)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=5000)
