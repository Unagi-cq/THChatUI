from flask import Flask, request, jsonify
from flask_cors import CORS
from zhipuai import ZhipuAI

app = Flask(__name__)
# 允许来自特定域的跨域请求
CORS(app, resources={r"/*": {"origins": "http://localhost:8080"}})

client = ZhipuAI(api_key="xxx")


@app.route('/igm/generate', methods=['POST'])
def generate_image():
    try:
        # 获取JSON数据
        data = request.get_json()
        prompt = data.get('input').get('prompt')

        if not prompt:
            return jsonify({"error": "缺少prompt参数"}), 400

        # 调用智谱AI的图像生成API
        response = client.images.generations(
            model="cogView-3-plus",
            prompt=prompt,
            size="1440x720"
        )

        print(response)

        # 返回生成的图片URL
        return jsonify({
            "success": True,
            "data": [{
                "url": response.data[0].url
            }]
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="localhost", port=5000)
