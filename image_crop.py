from PIL import Image, ImageChops
from encode_decode_fn import encode_img, decode_img, has_transparency

# Open the input image
img = Image.open('input/13FDBF0B-E77D-4FB5-9777-A32CF0C93F40.png')
# Get the dimensions of the input image
width, height = img.size
# Set the size of the square tiles
tile_size = 400
# Calculate the number of tiles in each dimension
num_tiles_x = width // tile_size
num_tiles_y = height // tile_size
print(width, height, num_tiles_x, num_tiles_y)

# Loop over the tiles and save each one as a separate image
new_image = img.copy()
transparent_mask = Image.open('./corp/400_400_transparent_hidden.png')
for i in range(num_tiles_x):
    x1 = i * tile_size
    x2 = x1 + tile_size
    if x2 > width or x1 > width - tile_size:
        continue
    for j in range(num_tiles_y):
        # Calculate the top-left corner of the current tile
        y1 = j * tile_size
        # Calculate the bottom-right corner of the current tile
        y2 = y1 + tile_size

        if y2 > height or y1 > height - tile_size:
            continue
        # print('x1, y1, x2, y2')
        # print(x1, y1, x2, y2)
        # Crop the current tile from the input image
        # tile = new_image.crop((x1, y1, x2, y2))
        # # Save the current tile as a separate image
        # im_hidden, im_residual = encode_img(tile)
        # bg = Image.new(im.mode, im.size, (255,255,255,0))
        # diff = ImageChops.difference(tile, im_hidden)
        # print(diff)
        # im_hidden.save(f'corp/spilt/tile_{i}_{j}.png')
        img.paste(transparent_mask, (x1, y1, x2, y2))
        # if im_hidden:
        #     # encode_img.show()
        #     im_hidden.save(f'corp/tile_{i}_{j}.png')
        #     im_residual.save(f'corp/tile_{i}_{j}_residual.png')
        # else:
        #     tile.save(f'corp/tile_{i}_{j}.png')
img.save('corp/merged_image_encode_1.png')

# # Merge the tiles back together into a single image
# merged_img = Image.new('RGB', (width, height))
# for i in range(num_tiles_x):
#     for j in range(num_tiles_y):
#         # Load the current tile image
#         tile_img = Image.open(f'corp/tile_{i}_{j}.png')
        
#         # Calculate the top-left corner of the current tile in the merged image
#         x1 = i * tile_size
#         y1 = j * tile_size
        
#         # Calculate the bottom-right corner of the current tile in the merged image
#         x2 = x1 + tile_size
#         y2 = y1 + tile_size
        
#         # Paste the current tile into the merged image
#         merged_img.paste(tile_img, (x1, y1, x2, y2))

# # Save the merged image
# merged_img.save('corp/merged_image.png')
