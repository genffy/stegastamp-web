import bchlib
from PIL import Image,ImageOps, ImageChops
import numpy as np
import tensorflow as tf
from tensorflow.python.saved_model import tag_constants
from tensorflow.python.saved_model import signature_constants

BCH_POLYNOMIAL = 137
BCH_BITS = 5

# load model
# FIXME use v2 api `compat.v1`
# refs https://www.tensorflow.org/guide/migrate
sess = tf.compat.v1.InteractiveSession(graph=tf.Graph())

model = tf.compat.v1.saved_model.loader.load(sess, [tag_constants.SERVING], "./saved_models/stegastamp_pretrained")

input_secret_name = model.signature_def[signature_constants.DEFAULT_SERVING_SIGNATURE_DEF_KEY].inputs['secret'].name
input_image_name = model.signature_def[signature_constants.DEFAULT_SERVING_SIGNATURE_DEF_KEY].inputs['image'].name
input_secret = tf.compat.v1.get_default_graph().get_tensor_by_name(input_secret_name)
input_image = tf.compat.v1.get_default_graph().get_tensor_by_name(input_image_name)

output_stegastamp_name = model.signature_def[signature_constants.DEFAULT_SERVING_SIGNATURE_DEF_KEY].outputs['stegastamp'].name
output_residual_name = model.signature_def[signature_constants.DEFAULT_SERVING_SIGNATURE_DEF_KEY].outputs['residual'].name
output_stegastamp = tf.compat.v1.get_default_graph().get_tensor_by_name(output_stegastamp_name)
output_residual = tf.compat.v1.get_default_graph().get_tensor_by_name(output_residual_name)

output_secret_name = model.signature_def[signature_constants.DEFAULT_SERVING_SIGNATURE_DEF_KEY].outputs['decoded'].name
output_secret = tf.compat.v1.get_default_graph().get_tensor_by_name(output_secret_name)
# https://github.com/tancik/StegaStamp/issues/43
width = 400
height = 400
bch = bchlib.BCH(BCH_POLYNOMIAL, BCH_BITS)
size = (width, height)

def get_secrect(secret_str='Stega!!'):
    # force to 7 char
    secret_str = secret_str[0:6]
    data = bytearray(secret_str + ' '*(7-len(secret_str)), 'utf-8')
    ecc = bch.encode(data)
    packet = data + ecc

    packet_binary = ''.join(format(x, '08b') for x in packet)
    secret = [int(x) for x in packet_binary]
    secret.extend([0,0,0,0])
    return secret

def trim_and_convert(im):
    bg = Image.new(im.mode, im.size, (255,255,255,0))
    diff = ImageChops.difference(im, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        print('with bbox convert')
        return im.crop(bbox).convert('RGB')
    else:
        print('pure convert')
        return im.convert('RGB')

def encode_img(input_img, secret_str, select='0,0,400,400'):
    secret = get_secrect(secret_str)
    # get encode area 
    new_image = input_img.copy()
    arr = [x.strip() for x in select.split(',')]
    x1, y1, x2, y2 = int(arr[0]), int(arr[1]), int(arr[2]), int(arr[3])
    input_img = new_image.crop((x1, y1, x2, y2))
    # resize to 400 400
    input_img = input_img.resize(size)
    # convert to RGB
    image = input_img.convert("RGB")
    image = np.array(ImageOps.fit(image, size),dtype=np.float32)
    image /= 255.

    feed_dict = {input_secret:[secret],
                    input_image:[image]}

    hidden_img, residual = sess.run([output_stegastamp, output_residual],feed_dict=feed_dict)

    rescaled = (hidden_img[0] * 255).astype(np.uint8)

    im_hidden = Image.fromarray(np.array(rescaled))

    # resize to origin size
    im_hidden = im_hidden.resize((int(x2) - int(x1), int(y2) - int(y1)))
    # paste it 
    input_img.paste(im_hidden, (x1, y1, x2, y2))

    return input_img   

def decode_img(input_img): 
    image = input_img.convert("RGB")
    image = np.array(ImageOps.fit(image,(400, 400)),dtype=np.float32)
    image /= 255.

    feed_dict = {input_image:[image]}

    secret = sess.run([output_secret],feed_dict=feed_dict)[0][0]

    packet_binary = "".join([str(int(bit)) for bit in secret[:96]])
    packet = bytes(int(packet_binary[i : i + 8], 2) for i in range(0, len(packet_binary), 8))
    packet = bytearray(packet)

    data, ecc = packet[:-bch.ecc_bytes], packet[-bch.ecc_bytes:]

    bitflips = bch.decode_inplace(data, ecc)

    if bitflips != -1:
        try:
            code = data.decode("utf-8")
            return code
        except:
            return None
    return None

def has_transparency(img):
    if img.mode == "P":
        transparent = img.info.get("transparency", -1)
        for _, index in img.getcolors():
            if index == transparent:
                return True
    elif img.mode == "RGBA":
        extrema = img.getextrema()
        if extrema[3][0] < 255:
            return True
    return False
