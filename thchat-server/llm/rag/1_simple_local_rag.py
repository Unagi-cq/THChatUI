import json
from threading import Thread

import torch
from flask import Flask, request, stream_with_context
from flask_cors import CORS
from langchain_community.document_loaders import TextLoader, PyPDFLoader, Docx2txtLoader
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from transformers import AutoModelForCausalLM, AutoTokenizer, TextIteratorStreamer

app = Flask(__name__)
# 允许来自特定域的跨域请求
CORS(app, resources={r"/*": {"origins": "http://localhost:8080"}})

model_path = r"D:\PLMs\qwen\qwen1.5-1.8B-Chat"
embedding_path = r"D:\Embs\bge-small-zh-v1.5"
device = "cuda" if torch.cuda.is_available() else "cpu"

tokenizer = AutoTokenizer.from_pretrained(model_path)
embedding = HuggingFaceEmbeddings(model_name=embedding_path)
model = AutoModelForCausalLM.from_pretrained(
    model_path,
    torch_dtype="auto",
    device_map=device
)


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


@app.route('/rag/stream', methods=['POST'])
def chatstream():
    streamer = TextIteratorStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)
    # 获取JSON数据
    data = request.get_json()

    # 这里可以写上处理POST请求的逻辑
    # 例如，打印接收到的数据
    print(data)

    inputs = data['input']

    search_docs = retriever.get_relevant_documents(inputs['prompt'])

    messages = [
        {"role": "system", "content": "You are a helpful assistant."}
    ]

    for chat in inputs['history']:
        messages.append({"role": "user", "content": chat['user']})
        messages.append({"role": "assistant", "content": chat['assistant']})

    content = '\n'.join([doc.page_content for doc in search_docs])

    messages.append(
        {"role": "user", "content": "根据以下上下文回答问题:\n上下文:" + content + "\n问题:" + inputs['prompt']})

    print(messages)

    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )

    model_inputs = tokenizer([text], return_tensors="pt").to(device)

    generation_kwargs = dict(model_inputs, streamer=streamer, max_new_tokens=1024)
    thread = Thread(target=model.generate, kwargs=generation_kwargs)
    thread.start()

    # 模型生成文本的函数
    def generate_text():
        # 文本生成的过程
        for new_text in streamer:
            # 创建一个包含文本的 JSON 对象
            json_object = json.dumps({"data": new_text})
            # 发送一个换行符，以分隔 JSON 对象
            # print(json_object)
            yield f"event: msg\ndata: " + json_object + "\n\n"

    # 使用Response对象包装生成器，实现流式响应
    return app.response_class(stream_with_context(generate_text()))


if __name__ == '__main__':
    files = [
        {"url": "rag_example.pdf", "file_type": "pdf"}
    ]
    split_docs = split_text(files)

    # 构建 FAISS 向量存储和对应的 retriever
    vs = FAISS.from_documents(split_docs, embedding)

    retriever = vs.as_retriever()

    app.run(debug=True)
