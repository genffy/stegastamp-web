import { type BinaryLike, createHash } from 'crypto'
import html2canvas from 'html2canvas'

export async function fetchWithTimeout(url: string, options: any): Promise<Response> {
  if (options === undefined) options = {}

  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);

  return response;
}

export function getMd5(str: BinaryLike) {
  const hash = createHash("md5").update(str).digest("hex")
  return hash;
}

/**
 * 添加水印
 */
export async function addWaterMarker(file: Blob, text: string, el = '#markImg') {
  // 将文件blob转换成图片
  let img = await blobToImg(file)
  return new Promise(async (resolve, reject) => {
    try {
      // 创建canvas画布
      let canvas = document.createElement('canvas')
      //等比例调整canvas宽高，以缩小图片体积
      let imgRatio = img.naturalWidth / img.naturalHeight //图片比例
      canvas.width = 750  //默认设置成750
      canvas.height = canvas.width / imgRatio

      let ctx = canvas.getContext('2d')
      if (!ctx) {
        return reject('canvas获取失败')
      }

      // 填充上传的图片
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // 生成水印图片
      const markWidth = document.querySelector(el)?.clientWidth || 1
      let zoom = canvas.width * 0.3 / markWidth
      let markEle = document.querySelector(el) as HTMLElement
      console.log('markEle', markEle)
      // 先缩放水印html再转成图片
      markEle.style.transform = `scale(${zoom})`
      const markImg = await htmlToCanvas(markEle)


      ctx.font = `bold ${img.height / 10}px arial`;
      ctx.fillStyle = 'rgba(255, 0, 0, .1)';
      ctx.textBaseline = 'bottom';
      // ctx.transform(1, 0.5, -0.5, 1, 0, -canvas.height / 2);

      let txt = text || '1234567 ';
      const txtHeight = img.height / 6;
      txt = Array(Math.ceil(canvas.width / ctx.measureText(txt).width) * 2).join(txt);
      ctx.fillText(txt, 0, txtHeight);

      // 填充水印
      // ctx.drawImage(markImg, canvas.width - markImg.width - 15 * zoom, canvas.height - markImg.height - 15 * zoom, markImg.width, markImg.height)

      // 将canvas转换成blob
      canvas.toBlob(blob => resolve(blob))
    } catch (error) {
      reject(error)
    }

  })
}

/**
* blob转img标签
*/
function blobToImg(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.addEventListener('load', () => {
      let img = new Image()
      img.src = reader.result as string
      img.addEventListener('load', () => resolve(img))
    })
    reader.readAsDataURL(blob)
  })
}

/**
* html转成canvas，需要安装html2canvas.js插件
*/
export function htmlToCanvas(el: HTMLElement, backgroundColor = 'rgba(0,0,0,.1)'): Promise<HTMLCanvasElement> {
  return new Promise(async (resolve, reject) => {
    try {
      const markImg = await html2canvas(el, {
        allowTaint: false,   //允许污染
        useCORS: true,
        backgroundColor //'transparent'  //背景色
      })
      resolve(markImg)
    } catch (error) {
      reject(error)
    }
  })
}
