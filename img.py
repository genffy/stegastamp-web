from typing import Tuple

from PIL import Image, ImageOps, ImageDraw
import math
import json

if __name__ == "__main__":
    img = Image.open('upload/1351.jpg_wh1200.jpg')
    crop_image = open('./upload/crop_image.json', 'rb')
    # 先处理原图
    data = json.load(crop_image)
    naturalWidth = img.size[0]
    naturalHeight = img.size[1]
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
    img = img.resize((viewWidth, viewHeight))
    img = img.rotate(-rotate)
    print(img.size)
    if scale >= 1:
        xw = viewWidth / scale
        yh = viewHeight / scale
        xx = int((viewWidth - xw) / 2)
        yy = int((viewHeight - yh) / 2)
        img = img.crop((xx, yy, xw + xx, yh + yy))
    else:
        xw = viewWidth * scale
        yh = viewHeight * scale
        xx = int((xw - viewWidth) / 2)
        yy = int((yh - viewHeight) / 2)
        # img = img.crop((xx, yy, viewWidth + xx, viewHeight + yy))
        img = img.resize((int(xw), int(yh)))
    print(scale, xw, yh, yy, xx)
    # img = img.resize((viewWidth, viewHeight))




    # that is ok
    # cropY = cropY * scaleY * scale / pixelRatio
    # cropX = cropX * scaleX * scale / pixelRatio
    # img = img.crop((cropX, cropY, cropX + cropWidth, cropY + cropHeight))
    # print(img.size, scaleX, scaleY, cropX, cropY, scale, pixelRatio)
    # img = img.resize((math.floor(cropWidth * scaleX * pixelRatio), math.floor(cropHeight * scaleY * pixelRatio)))
    img.save('upload/croped.png')
