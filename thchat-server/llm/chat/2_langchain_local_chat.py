#!/usr/bin/env python
from typing import List, Optional
import logging

from pydantic import Field
from fastapi import FastAPI
from langchain_huggingface import HuggingFacePipeline
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from langchain_core.runnables import RunnableParallel, RunnableLambda
from langserve import add_routes, CustomUserType
from langchain.globals import set_debug

set_debug(True)

app = FastAPI(
    title="LangChain Server",
    version="1.0",
    description="A simple api server using Langchain's Runnable interfaces",
)

# 设置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

path = r"D:\PLMs\qwen\qwen1.5-1.8B-Chat"
tokenizer = AutoTokenizer.from_pretrained(path)
model = AutoModelForCausalLM.from_pretrained(path)
pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    max_new_tokens=128,
    temperature=0.7,
    top_p=0.9,
)
llm = HuggingFacePipeline(pipeline=pipe)


class ChatTurn(CustomUserType):
    user: str
    assistant: Optional[str] = None


class ChatHistory(CustomUserType):
    prompt: str
    history: List[ChatTurn] = Field(default_factory=list)


def _format_to_messages(input: ChatHistory) -> str:
    """格式化输入为消息列表"""
    try:
        messages = [
            {"role": "system", "content": "You are a helpful assistant."}
        ]

        for chat in input.history:
            messages.append({"role": "user", "content": chat['user']})
            messages.append({"role": "assistant", "content": chat['assistant']})

        messages.append({"role": "user", "content": input.prompt})

        text = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )
        return text
    except Exception as e:
        logger.error(f"消息格式化失败: {str(e)}")
        raise


chatChain = RunnableParallel({"data": (RunnableLambda(_format_to_messages) | llm)})

add_routes(
    app,
    chatChain.with_types(input_type=ChatHistory),
    path="/chat",
)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=5000)
