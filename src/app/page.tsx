'use client'

import React, {useState, useRef, useEffect} from 'react'

import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
} from 'react-image-crop'
import { canvasPreview , type PreviewData} from '@/component/canvasPreview'

import 'react-image-crop/dist/ReactCrop.css'
import '@/app/watermark.css'
import { useDebounce, useLocalStorage } from 'react-use'

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier, so we use some helper functions.
function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: 'px',
                width: 400,
                // unit: '%',
                // width: 20,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

export default function IndexMark() {
    const [imgSrc, setImgSrc] = useState('')
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)
    const blobUrlRef = useRef('')
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState<number | undefined>(1 / 1)
    const [previewData, setPreviewData] = useState<PreviewData>()
    const [value, setValue, remove] = useLocalStorage('watermark', '');

    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined) // Makes crop preview update between images.
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setImgSrc(reader.result?.toString() || '')
                setValue(reader.result?.toString() || '')
            })
            reader.readAsDataURL(e.target.files[0])
        }
    }

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        if (aspect) {
            const { width, height } = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }
    function getPreviewCanvas() {
        return new Promise((resolve, reject) => {
            if (!previewCanvasRef.current) {
                throw reject(new Error('Crop canvas does not exist'))
            }

            previewCanvasRef.current.toBlob((blob) => {
                if (!blob) {
                    throw new Error('Failed to create blob')
                }
                if (blobUrlRef.current) {
                    URL.revokeObjectURL(blobUrlRef.current)
                }
                resolve({
                    blob,
                    url: URL.createObjectURL(blob),
                })
            })
        })
    }
    function onDownloadCropClick() {
        if (!previewCanvasRef.current) {
            throw new Error('Crop canvas does not exist')
        }

        previewCanvasRef.current.toBlob((blob) => {
            if (!blob) {
                throw new Error('Failed to create blob')
            }
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current)
            }
            blobUrlRef.current = URL.createObjectURL(blob)
            hiddenAnchorRef.current!.href = blobUrlRef.current
            hiddenAnchorRef.current!.click()
        })
    }
    const [, _cancel] = useDebounce(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                // We use canvasPreview as it's much faster than imgPreview.
                setPreviewData(await canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop,
                    scale,
                    rotate,
                ))
            }
        },
        100,
        [completedCrop, scale, rotate],
    );

    function handleToggleAspectClick() {
        if (aspect) {
            setAspect(undefined)
        } else if (imgRef.current) {
            const { width, height } = imgRef.current
            setAspect(1)
            setCrop(centerAspectCrop(width, height, 1))
        }
    }
    // 加密指定区域，返回修改后的图片
    async function onEncodeCropClick() {
        const isOk = confirm('确定加密该区域么?')
        if (isOk) {
            // do encode
            // upload image with params
            const data: any = await getPreviewCanvas().catch(err => alert(err));
            if (data) {
                // 截取的 position, scale, rotate
                console.log('completedCrop', completedCrop)
                console.log('previewData', previewData)
                const formData = new FormData();
                formData.append("myImage", data.blob);
                if (previewData) {
                    formData.append("previewData", JSON.stringify(previewData));
                }
                // how to convert completedCrop and previewData to position
                fetch(`/api/watermark/encode?pos=x1,y1,x2,y2&scale=${scale}&rotate=${rotate}`, {
                    method: 'POST',
                    // TODO build it to a form data
                    // https://github.com/vercel/examples/blob/main/solutions/aws-s3-image-upload/pages/index.tsx
                    // https://github.com/vercel/examples/blob/main/storage/blob-starter/components/uploader.tsx
                    // body: data.blob,
                    body: formData,
                }).then(response => {
                    console.log(response.body)
                    if (response && response.body) {
                        const reader = response.body.getReader();
                        const decoder = new TextDecoder('utf-8');
                        reader.read().then(function processText({ done, value }): Promise<void> {
                          if (done) {
                            console.log('传输完毕');
                            return Promise.resolve();
                          }
                          console.log('result----', decoder.decode(value));
                          return reader.read().then(processText);
                        });
                      }
              
                })
                    .catch(err => alert(err));
            }
            // download image
        }

    }
    // 解密指定区域，输出解密后的内容
    function onDecodeCropClick() {
        const isOk = confirm('确定解密该区域么?')
        if (isOk) {
            // do decode
            // upload image with params

            // return decode content
        }
    }

    useEffect(() => {
        setImgSrc(value || '')
    }, [imgSrc])

    return (
        <div className='container'>
            <div className=''>
                <div className='main'>

                </div>
                <div className='preview'>
                    
                </div>
            </div>
            <div className=''></div>
        </div>
    )
}
