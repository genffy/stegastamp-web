import os
from PIL import Image
from encode_decode_fn import decode_img, encode_img
from flask import Flask, flash, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'public/upload'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)
app.secret_key = 'trest'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SESSION_TYPE'] = 'filesystem'

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/imgmarker', methods=['POST'])
def imgmarker():
    if request.method == 'POST':
        type = request.form.get('type')
        select = request.form.get('select')
        secret = request.form.get('secret')
        if type not in ['encode', 'decode']:
            return jsonify({
                'code': 403,
                'message': 'type error'
            })
        # FIXME: get image from url, download it and save it to local
        # check if the post request has the file part
        if 'imageFile' not in request.files:
            flash('No file part')
            return jsonify({
                'code': 403,
                'message': 'No file part'
            })
        file = request.files['imageFile']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return jsonify({
                'code': 403,
                'message': 'No selected file'
            })
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            img_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(img_path)
            img = Image.open(img_path)
            if type == 'encode':
                # encode 
                img = encode_img(img, secret, select)
                # save
                # fix OSError: cannot write mode RGBA as JPEG
                if img.mode == "RGBA":
                    img_path = os.path.splitext(img_path)[0]+'.png'
                # TODO save it to CDN is better
                img.save(img_path);
                result = img_path
            elif type == 'decode':
                result = decode_img(img)

            return jsonify({
                'code': 200,
                'message': 'ok',
                'data': result,
            })
    return jsonify({'code': 404, 'message': 'not found'})

@app.route('/')
def home():
    return 'Hello, World!'

if __name__ == "__main__":
    # Quick test configuration. Please use proper Flask configuration options
    # in production settings, and use a separate file or environment variables
    # to manage the secret key!
    # app.debug = True
    app.run()
