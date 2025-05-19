import os
from typing import List, Optional

# from langchain.globals import set_debug
from pydantic import Field
from fastapi import FastAPI, Body
from langchain_community.chat_models import ChatZhipuAI
from langserve import CustomUserType
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START
from fastapi.responses import StreamingResponse
import json

# set_debug(True)

os.environ["ZHIPUAI_API_KEY"] = "xxx"

app = FastAPI(
    title="LangGraph Server",
    version="1.0",
    description="A simple api server using Langgraph and ZHIPUAI",
)

glm = ChatZhipuAI(model="glm-4-flash")


class ChatTurn(CustomUserType):
    user: str
    assistant: Optional[str] = None


class ChatHistory(CustomUserType):
    prompt: str
    history: List[ChatTurn] = Field(default_factory=list)


def _format_to_messages(input: ChatHistory):
    messages = [
        {"role": "system", "content": "You are a helpful assistant."}
    ]
    for chat in input.history:
        messages.append({"role": "user", "content": chat.user})
        messages.append({"role": "assistant", "content": chat.assistant})
    messages.append({"role": "user", "content": input.prompt})
    return messages


# langgraph部分
class State(TypedDict):
    messages: List[dict]


graph_builder = StateGraph(State)


def chatbot(state: State):
    messages = state["messages"].copy()
    for chunk in glm.stream(messages):
        messages.append(chunk)


graph_builder.add_node("chatbot", chatbot)
graph_builder.add_edge(START, "chatbot")
graph = graph_builder.compile()


@app.post("/chat/stream")
def chat_api(input: dict = Body(...)):
    chat_history = ChatHistory(**input["input"])
    messages = _format_to_messages(chat_history)

    def event_stream():
        for chunk in graph.stream({"messages": messages}, stream_mode="messages"):
            json_object = json.dumps({"data": {"content": chunk[0].content}}, ensure_ascii=False)
            yield f"event: msg\ndata: " + json_object + "\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


if __name__ == "__main__":
    import uvicorn
    # 启动服务
    uvicorn.run(app, host="localhost", port=5000)
