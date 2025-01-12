conda env remove --name thchat

conda create -n thchat python=3.10 -y
conda activate thchat

pip install transformers langchain==0.3.14 langchain-community flask flask-cors accelerate langserve fastapi langchain_huggingface
pip install sse_starlette uvicorn websocket-client pyjwt
pip install dashscope tavily-python pypdf faiss-gpu faiss-cpu zhipuai

# pip install --user ipykernel
# python -m ipykernel install --user --name=thchat
