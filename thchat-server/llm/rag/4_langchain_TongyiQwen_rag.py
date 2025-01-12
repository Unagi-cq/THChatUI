#!/usr/bin/env python
import os
from typing import List, Optional

import torch
from langchain.pydantic_v1 import Field
from fastapi import FastAPI
from langchain_community.chat_models.tongyi import ChatTongyi
from langchain_community.document_loaders import TextLoader, PyPDFLoader, Docx2txtLoader
from langchain_community.vectorstores import FAISS
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_core.runnables import RunnableParallel, RunnableLambda
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import CharacterTextSplitter
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

embedding_path = r"D:\Embs\bge-small-zh-v1.5"
device = "cuda" if torch.cuda.is_available() else "cpu"
embedding = HuggingFaceEmbeddings(model_name=embedding_path)


def split_text(files, chunk_size=300, chunk_overlap=20):
    docs = []
    for f in files:
        if f['file_type'] == 'txt':
            docs.extend(TextLoader(f['url'], autodetect_encoding=True).load())
        elif f['file_type'] == 'pdf':
            docs.extend(PyPDFLoader(f['url']).load())
        else:
            docs.extend(Docx2txtLoader(f['url']).load())

    text_splitter = CharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    return text_splitter.split_documents(docs)


class ChatTurn(CustomUserType):
    user: str
    assistant: Optional[str] = None


class FileObj(CustomUserType):
    file_type: str
    url: str
    title: str
    uuid: int


class ChatHistory(CustomUserType):
    prompt: str
    files: List[FileObj] = Field(default_factory=list)
    history: List[ChatTurn] = Field(default_factory=list)


def _format_to_messages(input: ChatHistory) -> List[BaseMessage]:
    """Format the input to a list of messages."""
    history = input.history
    user_input = input.prompt

    search_docs = retriever.get_relevant_documents(user_input)

    content = '\n'.join([doc.page_content for doc in search_docs])

    messages = []

    for turn in history:
        messages.append(HumanMessage(content=turn.user))
        messages.append(AIMessage(content=turn.assistant))
    messages.append(HumanMessage(content="根据以下上下文回答问题:\n上下文:" + content + "\n问题:" + user_input))
    return messages


model = RunnableParallel({"data": (RunnableLambda(_format_to_messages) | model)})

add_routes(
    app,
    model.with_types(input_type=ChatHistory),
    path="/chat",
)

if __name__ == "__main__":
    import uvicorn

    files = [
        {"url": "rag_example.pdf", "file_type": "pdf"}
    ]
    split_docs = split_text(files)

    # 构建 FAISS 向量存储和对应的 retriever
    vs = FAISS.from_documents(split_docs, embedding)

    retriever = vs.as_retriever()

    uvicorn.run(app, host="localhost", port=5000)
