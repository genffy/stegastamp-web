from typing import Tuple

from PIL import Image, ImageOps, ImageDraw
import math

if __name__ == "__main__":
    img = Image.open('upload/afe84222-69ef-4d13-b66c-7b6b46f8e988.png')
    naturalWidth = img.size[0]
    naturalHeight = img.size[1]

    # 先处理原图
    data = {
        "cropWidth": 400,
        "cropHeight": 400,
        "cropX": 323.5,
        "cropY": 730.5,
        "pixelRatio": 1.600000023841858,
        "scale": 1.4,
        "rotate": 0,
        "viewWidth": 1047,
        "viewHeight": 1861
    }

    cropWidth = data.get('cropWidth')
    cropHeight = data.get('cropHeight')
    cropX = data.get('cropX')
    cropY = data.get('cropY')
    pixelRatio = data.get('pixelRatio')
    scale = data.get('scale')
    rotate = data.get('rotate')
    viewWidth = data.get('viewWidth')
    viewHeight = data.get('viewHeight')

    scaleX = naturalWidth / viewWidth
    scaleY = naturalHeight / viewHeight

    # scale original image and crop it with natural size
    # set image to view size
    img = img.resize((viewWidth, viewHeight))
    w = viewWidth * scale
    h = viewHeight * scale
    # that is ok
    img = img.rotate(-rotate)
    if scale >= 1:
        xw = viewWidth / scale
        yh = viewHeight / scale
        xx = int((viewWidth - xw) / 2)
        yy = int((viewHeight - yh) / 2)
        img = img.crop((xx, yy, xw, yh))
    else:
        img = img.resize((int(w), int(h)))
    img = img.resize((viewWidth, viewHeight))

    # that is ok
    cropY = cropY * scaleY * scale / pixelRatio
    cropX = cropX * scaleX * scale / pixelRatio
    img = img.crop((cropX, cropY, cropX + cropWidth, cropY + cropHeight))
    print(img.size, scaleX, scaleY, cropX, cropY, scale, pixelRatio)
    # img = img.resize((math.floor(cropWidth * scaleX * pixelRatio), math.floor(cropHeight * scaleY * pixelRatio)))
    img.save('upload/crop_afe84222-69ef-4d13-b66c-7b6b46f8e988.png')
