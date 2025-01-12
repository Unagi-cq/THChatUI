#!/usr/bin/env python
from typing import List, Optional
from langchain.pydantic_v1 import Field
from fastapi import FastAPI
from langchain_community.chat_models import ChatSparkLLM
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_core.runnables import RunnableParallel, RunnableLambda
from langserve import add_routes, CustomUserType
from langchain.globals import set_debug
from tavily import TavilyClient
tavily = TavilyClient(api_key="tvly-xxx")

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


def _format_to_messages(input: ChatHistory) -> List[BaseMessage]:
    """Format the input to a list of messages."""
    history = input.history
    user_input = input.prompt

    response = tavily.search(query=user_input, search_depth="advanced")
    web_data = [f"标题：{item['title']}\n内容：{item['content']}\n" for item in response['results']]

    messages = []

    for turn in history:
        messages.append(HumanMessage(content=turn.user))
        messages.append(AIMessage(content=turn.assistant))
    messages.append(HumanMessage(content="根据以下联网搜索结果回答问题:\n联网搜索结果:" + ''.join(web_data[:2]) + "\n问题:" + user_input))
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
