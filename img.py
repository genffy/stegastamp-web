from typing import Tuple

from PIL import Image, ImageOps, ImageDraw
import math

if __name__ == "__main__":
    img = Image.open('upload/afe84222-69ef-4d13-b66c-7b6b46f8e988.png')
    img_w = img.size[0]
    img_h = img.size[1]

    # 先处理原图
    data = {
        "width": 209.359375,
        "height": 209.39736280897367,
        "x": 0,
        "y": 175.2628511882866,
        "pixelRatio": 1.600000023841858,
        "scale": 1.5,
        "rotate": -22,
        "naturalWidth": 1047,
        "naturalHeight": 1861
    }

    width = data.get('width')
    height = data.get('height')
    x = data.get('x')
    y = data.get('y')
    pixelRatio = data.get('pixelRatio')
    scale = data.get('scale')
    rotate = data.get('rotate')
    naturalWidth = data.get('naturalWidth')
    naturalHeight = data.get('naturalHeight')
    # 旋转这个没问题
    img = img.rotate(-rotate, center=(naturalWidth/2, naturalHeight/2))
    # 放大缩小
    # img = ImageOps.fit(img, (round(naturalWidth), round(naturalHeight)))
    # img = ImageOps.fit(img, (round(naturalWidth * scale * pixelRatio), round(naturalHeight * scale * pixelRatio)))
    # x = x * scale
    # y = y * scale
    img = img.crop((x, y, x+width, y+height))
    img.resize((naturalWidth, naturalHeight), Image.LANCZOS)
    # img = ImageOps.scale(img, pixelRatio)
    # img = ImageOps.fit(img, (round(width), round(height)))
    # img.show()
    img.save('upload/crop_afe84222-69ef-4d13-b66c-7b6b46f8e988.png')
