from encode_decode_fn import encode_img, decode_img, has_transparency
from PIL import Image

filename = '13FDBF0B-E77D-4FB5-9777-A32CF0C93F40'
def encode_test():
    # img = Image.open("input/400_400_transparent.png")
    img = Image.open('./input/'+ filename +'.png')
    crop_img = img.crop((0,400,400,800))
    im_hidden, im_residual = encode_img(crop_img)
    img.paste(im_hidden, (0,400,400,800))
    img.save('./corp/'+filename+'.png')
    # if has_transparency(img):
    #     alpha_channel_save = img.getchannel('A')
    #     r, g, b = im_hidden.split()
    #     im_hidden = Image.merge('RGBA', (r, g, b, alpha_channel_save))
    # if im_hidden:
    #     # encode_img.show()
    #     im_hidden.save('./corp/'+filename+'.png')

def decode_test():
    to_decode_img = Image.open("./corp/IMG_0759.png")
    # to_decode_img = Image.open('./corp/'+filename+'.png')
    print(to_decode_img.size)
    code = decode_img(to_decode_img)
    if code:
        print(code)
    else:
        print('no code')

def batch_decode():
    # img = Image.open('./corp/IMG_0758.png')
    img = Image.open('./corp/IMG_0759.png')
    # img = Image.open('./corp/WX20230426-153306@2x.png')
    # img = Image.open('./corp/'+filename+'.png')
    # Get the dimensions of the input image
    width, height = img.size
    # Set the size of the square tiles
    # 这里需要动态计算,画图时按照 400的，但是经过拍照之后，可能不是 400 
    tile_size = 600
    # Calculate the number of tiles in each dimension
    num_tiles_x = width // tile_size
    num_tiles_y = height // tile_size

    print(width, height, num_tiles_x, num_tiles_y)

    # Loop over the tiles and save each one as a separate image
    step = 20
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
            # if tile:
            #     tile.save(f'corp/decode/tile_{i}_{j}.png')
            code = decode_img(tile)
            if code:
                print('image postition', x1, y1, x2, y2)
                print(code)

    print('done')

if __name__ == "__main__":
    # encode_test()
    decode_test()
    # batch_decode()
