import argparse
import os
from PIL import Image
from encode_decode_fn import decode_img, encode_img
# args
parser = argparse.ArgumentParser()
parser.add_argument('--image', type=str, default=None)
parser.add_argument('--type', type=str, default=None)
parser.add_argument('--select', type=str, default=None)
parser.add_argument('--secret', type=str, default='Stega!!')
args = parser.parse_args()
img = Image.open(args.image)
if __name__ == "__main__":
    if args.type == 'encode':
        img = encode_img(img, args.secret[0:6], args.select)
        # save
        # fix OSError: cannot write mode RGBA as JPEG
        img_path = args.image
        if img.mode == "RGBA":
            img_path = os.path.splitext(img_path)[0]+'.png'
        img.save(img_path)
        print(img_path)
    elif args.type == 'decode':
        code = decode_img(img)
        print(code)
    else:
        print('type error')
