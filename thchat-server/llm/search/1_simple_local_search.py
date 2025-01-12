import json
from threading import Thread

import torch
from flask import Flask, request, stream_with_context
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer, TextIteratorStreamer

app = Flask(__name__)
# 允许来自特定域的跨域请求
CORS(app, resources={r"/*": {"origins": "http://localhost:8080"}})

model_path = r"D:\PLMs\qwen\qwen1.5-1.8B-Chat"
device = "cuda" if torch.cuda.is_available() else "cpu"

model = AutoModelForCausalLM.from_pretrained(
    model_path,
    torch_dtype="auto",
    device_map=device
)

tokenizer = AutoTokenizer.from_pretrained(model_path)


from tavily import TavilyClient
tavily = TavilyClient(api_key="xxx")


@app.route('/chat/stream', methods=['POST'])
def chatstream():
    streamer = TextIteratorStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)
    # 获取JSON数据
    data = request.get_json()

    # 这里可以写上处理POST请求的逻辑
    # 例如，打印接收到的数据
    print(data)

    inputs = data['input']

    messages = [
        {"role": "system", "content": "You are a helpful assistant."}
    ]

    for chat in inputs['history']:
        messages.append({"role": "user", "content": chat['user']})
        messages.append({"role": "assistant", "content": chat['assistant']})

    response = tavily.search(query=inputs['prompt'], search_depth="advanced")
    web_data = [f"标题：{item['title']}\n内容：{item['content']}\n" for item in response['results']]

    messages.append(
        {"role": "user", "content": "根据以下联网搜索结果回答问题:\n联网搜索结果:" + ''.join(web_data) + "\n问题:" + inputs['prompt']})

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
    app.run(debug=True)
