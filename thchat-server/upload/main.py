import time

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'pdf', 'doc', 'docx', 'txt'}
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5 MB

# 允许来自特定域的跨域请求
CORS(app, resources={r"/*": {"origins": "http://localhost:8080"}})


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


@app.route('/upload', methods=['POST'])
def upload_files():

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    files = request.files.getlist('file')

    if not files:
        return jsonify({'error': 'No selected file'}), 400

    for file in files:
        if file and allowed_file(file.filename) and file.content_length <= app.config['MAX_CONTENT_LENGTH']:
            filename = file.filename
            url = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            absolute_path = os.path.abspath(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            file.save(url)
            return jsonify({'msg': '上传成功', "url": absolute_path, "uuid": int(time.time() * 1000), "title": filename, 'file_type':filename.rsplit('.', 1)[1].lower(), 'code': 200}), 200
        else:
            return jsonify({'msg': '上传失败，请检查文件大小或类型', 'code': 400}), 200


if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True)
