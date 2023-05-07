import argparse
import os
from PIL import Image
from encode_decode_fn import decode_img, encode_img, has_transparency
# args
parser = argparse.ArgumentParser()
parser.add_argument('--image', type=str, default=None)
parser.add_argument('--type', type=str, default=None)
parser.add_argument('--select', type=str, default=None)
parser.add_argument('--secret', type=str, default='Stega!!')
args = parser.parse_args()
model_size = 400
# load image
img = Image.open(args.image)
def encode(img):
    # get encode area 
    new_image = img.copy()
    arr = [x.strip() for x in args.select.split(',')]
    x1, y1, x2, y2 = int(arr[0]), int(arr[1]), int(arr[2]), int(arr[3])
    tile = new_image.crop((x1, y1, x2, y2))
    # resize to 400 400
    tile = tile.resize((model_size, model_size))
    # encode 
    im_hidden, im_residual = encode_img(tile, args.secret[0:6])
    # resize to origin size
    im_hidden = im_hidden.resize((int(x2) - int(x1), int(y2) - int(y1)))
    # paste it 
    img.paste(im_hidden, (x1, y1, x2, y2))
    # save
    # fix OSError: cannot write mode RGBA as JPEG
    img_path = args.image
    if img.mode == "RGBA":
        img_path = os.path.splitext(img_path)[0]+'.png'
    img.save(img_path)
    print(img_path)

def decode(img):
    code = decode_img(img)
    print(code)

if __name__ == "__main__":
    if args.type == 'encode':
        encode(img)
    elif args.type == 'decode':
        decode(img)
    else:
        print('type error')
