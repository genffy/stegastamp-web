from pathlib import Path

from encode_decode_fn import encode_img, decode_img, has_transparency
from PIL import Image
import os

model_size = 400

filename = '400_400_transparent'


def encode_test():
    # img = Image.open("input/400_400_transparent.png")
    img = Image.open('./input/' + filename + '.png')
    # crop_img = img.crop((0,400,400,800))
    im_hidden, im_residual = encode_img(img)
    # img.paste(im_hidden, (0,400,400,800))
    # im_hidden.save('./corp/'+filename+'.png')
    if has_transparency(img):
        alpha_channel_save = img.getchannel('A')
        r, g, b = im_hidden.split()
        im_hidden = Image.merge('RGBA', (r, g, b, alpha_channel_save))
    if im_hidden:
        # encode_img.show()
        im_hidden.save('./corp/' + filename + '.png')


def decode_test():
    # to_decode_img = Image.open("./corp/WX20230426-153306@2x.png")
    # to_decode_img = Image.open('./corp/' + filename + '.png')
    to_decode_img = Image.open("./upload/to_decode_image.jpeg")
    # print(to_decode_img.size)
    code = decode_img(to_decode_img)
    if code:
        print(code)
    else:
        print('no code')


def batch_decode(img, tile_size=400, step=2, logger=False):
    # Get the dimensions of the input image
    width, height = img.size
    # Set the size of the square tiles
    # 这里需要动态计算,画图时按照 400的，但是经过拍照之后，可能不是 400 
    # tile_size = 54
    # Loop over the tiles and save each one as a separate image
    # step = 2
    print(width, height, tile_size, step)
    new_image = img.copy()
    for i in range(width):
        x1 = i * step
        x2 = x1 + tile_size
        if x1 > width - tile_size or x2 > width:
            continue
        for j in range(height):
            # Calculate the top-left corner of the current tile
            y1 = j * step
            # Calculate the bottom-right corner of the current tile
            y2 = y1 + tile_size
            if y1 > height - tile_size or y2 > height:
                continue
            # Crop the current tile from the input image
            tile = new_image.crop((x1, y1, x2, y2))
            # print(x1, y1, x2, y2, tile.size)
            if logger:
                if tile:
                    tile.save(f'corp/decode/tile_{i}_{j}.png')
            code = decode_img(tile)
            if code:
                print('image position', x1, y1, x2, y2)
                print(code)
                tile.save(f'corp/decode/{i}_{j}_{x1}_{y1}_{x2}_{y2}.png')

    print('done')


def resize_image():
    img = Image.open('./corp/logo-1_hidden.png')
    w, h = img.size
    min_size = min(w, h)
    to_decode = img.crop((0, 0, min_size, min_size))
    to_decode = to_decode.resize((model_size, model_size))
    code = decode_img(to_decode)
    if code:
        print(code)
    else:
        print('no code')


def get_tile_size(img):
    width, height = img.size
    min_size = min(width, height)
    tile_size = min_size // 5
    # Calculate the number of tiles in each dimension
    print(width, height, min_size, tile_size)
    return width, height, tile_size


def encode_for4(img):
    width, height, tile_size = get_tile_size(img)
    # Loop over the tiles and save each one as a separate image
    new_image = img.copy()
    # for position top-left, top-right, bottom-left, bottom-right
    for x1, y1, x2, y2 in [
        (0, 0, tile_size, tile_size),
        (width - tile_size, 0, width, tile_size),
        (0, height - tile_size, tile_size, height),
        (width - tile_size, height - tile_size, width, height)
    ]:
        print((x1, y1, x2, y2))
        # Crop the current tile from the input image
        tile = new_image.crop((x1, y1, x2, y2))
        # Save the current tile as a separate image
        tile = tile.resize((model_size, model_size))
        im_hidden, im_residual = encode_img(tile)
        if im_hidden:
            # 如果有透明图层，记得写回去
            if has_transparency(tile):
                alpha_channel_save = tile.getchannel('A')
                r, g, b = im_hidden.split()
                im_hidden = Image.merge('RGBA', (r, g, b, alpha_channel_save))
            img.paste(im_hidden.resize((tile_size, tile_size)), (x1, y1, x2, y2))
    return img


def get_image_paths(img_root_dir):
    image_file_paths = []
    for root, dirs, files in os.walk(img_root_dir):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp')):
                file_path = os.path.join(root, file)
                image_file_paths.append(file_path)
    return image_file_paths


def process_image(img_path):
    with Image.open(img_path) as img:
        encode_for4(img)
        img.save(img_path)


if __name__ == "__main__":
    root_dir = '/path/to/your/img/assets'
    image_paths = get_image_paths(root_dir)
    for image_path in image_paths:
        img = Image.open(image_path)
        for tile in range(5, 15):
            batch_decode(img, int(tile), step=3)
    # encode_test()
    # decode_test()
    # batch_decode()
    # resize_image()
