'use client'

import React, { useState, useRef, useEffect, createRef } from 'react'
import Cropper, { type ReactCropperElement, type ReactCropperProps } from "react-cropper";
import { useDebounce, useLocalStorage } from 'react-use'

import "cropperjs/dist/cropper.css";
import './page.css'

const defaultSrc =
    "images/child.jpg";

// dataX.value = Math.round(data.x);
// dataY.value = Math.round(data.y);
// dataHeight.value = Math.round(data.height);
// dataWidth.value = Math.round(data.width);
// dataRotate.value = typeof data.rotate !== 'undefined' ? data.rotate : '';
// dataScaleX.value = typeof data.scaleX !== 'undefined' ? data.scaleX : '';
// dataScaleY.value = typeof data.scaleY !== 'undefined' ? data.scaleY : '';
type CropDataType = {
    x: number;
    y: number;
    width: number;
    height: number;
    rotate: number | '';
    scaleX: number | '';
    scaleY: number | '';
}

function PreviewData({ cropData }: { cropData: CropDataType }) {
    const data = cropData || {} as CropDataType;
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
    }
    const mathRound = (val: number) => Math.round(val)
    return <div className="docs-data">
        <div className="input-group input-group-sm">
            <span className="input-group-prepend">
                <label className="input-group-text" htmlFor="dataX">X</label>
            </span>
            <input type="text" className="form-control" id="dataX" onChange={onChange} value={mathRound(data.x)} placeholder="x" />
            <span className="input-group-append">
                <span className="input-group-text">px</span>
            </span>
        </div>
        <div className="input-group input-group-sm">
            <span className="input-group-prepend">
                <label className="input-group-text" htmlFor="dataY">Y</label>
            </span>
            <input type="text" className="form-control" id="dataY" onChange={onChange} value={mathRound(data.y)} placeholder="y" />
            <span className="input-group-append">
                <span className="input-group-text">px</span>
            </span>
        </div>
        <div className="input-group input-group-sm">
            <span className="input-group-prepend">
                <label className="input-group-text" htmlFor="dataWidth">Width</label>
            </span>
            <input type="text" className="form-control" id="dataWidth" onChange={onChange} value={mathRound(data.width)} placeholder="width" />
            <span className="input-group-append">
                <span className="input-group-text">px</span>
            </span>
        </div>
        <div className="input-group input-group-sm">
            <span className="input-group-prepend">
                <label className="input-group-text" htmlFor="dataHeight">Height</label>
            </span>
            <input type="text" className="form-control" id="dataHeight" onChange={onChange} value={mathRound(data.height)} placeholder="height" />
            <span className="input-group-append">
                <span className="input-group-text">px</span>
            </span>
        </div>
        <div className="input-group input-group-sm">
            <span className="input-group-prepend">
                <label className="input-group-text" htmlFor="dataRotate">Rotate</label>
            </span>
            <input type="text" className="form-control" id="dataRotate" onChange={onChange} value={data.rotate} placeholder="rotate" />
            <span className="input-group-append">
                <span className="input-group-text">deg</span>
            </span>
        </div>
        <div className="input-group input-group-sm">
            <span className="input-group-prepend">
                <label className="input-group-text" htmlFor="dataScaleX">ScaleX</label>
            </span>
            <input type="text" className="form-control" id="dataScaleX" onChange={onChange} value={data.scaleX} placeholder="scaleX" />
        </div>
        <div className="input-group input-group-sm">
            <span className="input-group-prepend">
                <label className="input-group-text" htmlFor="dataScaleY">ScaleY</label>
            </span>
            <input type="text" className="form-control" id="dataScaleY" onChange={onChange} value={data.scaleY} placeholder="scaleY" />
        </div>
    </div>
}

export default function App() {
    const cropperRef = createRef<ReactCropperElement>();
    const [cropper, setCropper] = useState<Cropper>();
    const [image, setImage] = useState(defaultSrc);
    const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)
    const [cropData, setCropData] = useState<CropDataType>({ x: 0, y: 0, width: 0, height: 0, rotate: '', scaleX: '', scaleY: '' });
    const [uploadedImageType, setUploadedImageType] = useState('image/jpeg');
    const [uploadedImageName, setUploadedImageName] = useState('cropped.jpg');
    const [lsValue, setLsValue, removeLsValue] = useLocalStorage('cropperjs_watermark', '');
    const [options, setOptions] = useState<Record<string, any>>({
        viewMode: 0,
        aspectRatio: 1 / 1,
    })
    const onCrop = (e: CustomEvent) => {
        var data = e.detail;
        setCropData({ ...data });
    }
    const blobUrlRef = useRef('')
    function onDownloadCropClick(blob: Blob) {
        if (!blob) {
            throw new Error('Failed to create blob')
        }
        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current)
        }
        blobUrlRef.current = URL.createObjectURL(blob)
        hiddenAnchorRef.current!.href = blobUrlRef.current
        hiddenAnchorRef.current!.click()
    }

    function syncData(str: string) {
        setImage(str);
        setLsValue(str);
    }

    function _processFile(blob: Blob) {
        var reader = new FileReader();
        reader.onload = function (evt: any) {
            console.log(evt.target.result); // data url!
            syncData(evt.target.result as any);
        };
        reader.readAsDataURL(blob);
    }

    // upload files
    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        let files;
        // TODO support drag and drop
        // if (e.dataTransfer) {
        //     files = e.dataTransfer.files;
        // } else 
        if (e.target) {
            files = e.target.files;
        }
        if (files && files.length > 0) {
            const file = files[0];
            console.log('file.type', file.type)
            if (/^image\/\w+/.test(file.type)) {
                setUploadedImageType(file.type);
                setUploadedImageName(file.name);
            } else {
                window.alert('Please choose an image file.');
            }
            _processFile(file)
        }
    }
    // process paste
    function listenOnPaste() {
        document.onpaste = function (event: any) {
            var items = (event.clipboardData || event.originalEvent.clipboardData).items;
            console.log(JSON.stringify(items)); // might give you mime types
            for (var index in items) {
                var item = items[index];
                if (item.kind === 'file') {
                    var blob = item.getAsFile();
                    _processFile(blob)
                }
            }
        };
    }

    useEffect(() => {
        listenOnPaste()
        if (lsValue) {
            syncData(lsValue)
        }
    })

    useEffect(() => {
        if (!cropperRef.current?.cropper) {
            return;
        }
        setCropper(cropperRef.current.cropper)
    }, [cropperRef])

    const handleActions = (event: React.MouseEvent<HTMLButtonElement>) => {
        // if (!cropperRef.current?.cropper) {
        //     return;
        // }
        // setCropper(cropperRef.current.cropper)
        const target = event.currentTarget;
        const data: any = {
            method: target.getAttribute('data-method'),
            target: target.getAttribute('data-target'),
            option: target.getAttribute('data-option') || undefined,
            secondOption: target.getAttribute('data-second-option') || undefined
        };

        let input, cropped, uploadedImageURL, result;
        if (cropper) {
            if (data.method) {
                if (!!data.target) {
                    input = document.querySelector(data.target) as HTMLInputElement;

                    if (!target.hasAttribute('data-option') && data.target && input) {
                        try {
                            data.option = JSON.parse(input.value);
                        } catch (e: any) {
                            console.log(e.message);
                        }
                    }
                }
                cropped = true // cropper.cropped;

                switch (data.method) {
                    case 'rotate':
                        if (cropped && options.viewMode > 0) {
                            cropper.clear();
                        }

                        break;

                    case 'getCroppedCanvas':
                        try {
                            data.option = JSON.parse(data.option);
                        } catch (e: any) {
                            console.log(e.message);
                        }

                        if (uploadedImageType === 'image/jpeg') {
                            if (!data.option) {
                                data.option = {};
                            }

                            data.option.fillColor = '#fff';
                        }

                        break;
                }
                // @ts-ignore
                result = cropper[data.method](data.option, data.secondOption);

                switch (data.method) {
                    case 'rotate':
                        if (cropped && options.viewMode > 0) {
                            cropper.crop();
                        }

                        break;

                    case 'scaleX':
                    case 'scaleY':
                        target.setAttribute('data-option', `${-data.option}`);
                        break;

                    case 'getCroppedCanvas':
                        if (result) {
                            result.toBlob((blob: Blob) => {
                                if (!blob) {
                                    throw new Error('Failed to create blob')
                                }
                                onDownloadCropClick(blob)
                                // if (blobUrlRef.current) {
                                //     URL.revokeObjectURL(blobUrlRef.current)
                                // }
                                // blobUrlRef.current = URL.createObjectURL(blob)
                                // hiddenAnchorRef.current!.href = blobUrlRef.current
                                // hiddenAnchorRef.current!.click()
                            })
                        }

                        break;

                    case 'destroy':
                        setCropper(undefined)

                        if (uploadedImageURL) {
                            URL.revokeObjectURL(uploadedImageURL);
                            uploadedImageURL = '';
                            syncData(defaultSrc)
                        }

                        break;
                }

                if (typeof result === 'object' && result !== cropper && input) {
                    try {
                        input.value = JSON.stringify(result);
                    } catch (e: any) {
                        console.log(e.message);
                    }
                }
            }
        }

    }

    const handleToggles = (event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
        var target = event.currentTarget as unknown as HTMLInputElement;
        var isCheckbox;
        var isRadio;

        if (!cropper) {
            return;
        }

        if (target.tagName.toLowerCase() === 'label') {
            target = target.querySelector('input') as HTMLInputElement;
        }

        isCheckbox = target.type === 'checkbox';
        isRadio = target.type === 'radio';

        if (isCheckbox || isRadio) {
            const ops: Record<string, any> = {}
            if (isCheckbox) {
                ops[target.name] = target.checked;
                const cropBoxData = cropper.getCropBoxData();
                const canvasData = cropper.getCanvasData();

                ops.ready = function () {
                    console.log('ready');
                    cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
                };
            } else {
                ops[target.name] = target.value;
                ops.ready = function () {
                    console.log('ready');
                };
            }

            // Restart
            // cropper.destroy();
            console.log('ops', ops)
            setOptions({ ...options, ...ops })
        }
    }

    const handleChange = () => { }

    return (
        <>
            <div className='container mx-auto'>
                <div className="row">
                    <div className="col-9">
                        <div className="docs-demo">
                            <div className="img-container">
                                <Cropper
                                    ref={cropperRef}
                                    // style={{ height: 400, width: "100%" }}
                                    zoomTo={0.5}
                                    initialAspectRatio={1}
                                    preview=".img-preview"
                                    src={image}
                                    aspectRatio={options.aspectRatio}
                                    viewMode={options.viewMode}
                                    // minCropBoxHeight={10}
                                    // minCropBoxWidth={10}
                                    // background={false}
                                    // responsive={true}
                                    // autoCropArea={1}
                                    // checkOrientation={false}
                                    // guides={true}
                                    crop={onCrop}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-3">
                        {/* <!-- <h3>Preview:</h3> --> */}
                        <div className="docs-preview clearfix">
                            <div className="img-preview preview-lg"></div>
                            <div className="img-preview preview-md"></div>
                            <div className="img-preview preview-sm"></div>
                            <div className="img-preview preview-xs"></div>
                        </div>

                        {/* <!-- <h3>Data:</h3> --> */}
                        <PreviewData cropData={cropData} />
                    </div>
                </div>
                <div className="row" id="actions">
                    <div className="col-9 docs-buttons">
                        {/* <!-- <h3>Toolbar:</h3> --> */}
                        <div className="btn-group">
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-primary" data-method="setDragMode" data-option="move" title="Move">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.setDragMode(&quot;move&quot;)">
                                    <span className="fa fa-arrows-alt"></span>
                                </span>
                            </button>
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-primary" data-method="setDragMode" data-option="crop" title="Crop">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.setDragMode(&quot;crop&quot;)">
                                    <span className="fa fa-crop-alt"></span>
                                </span>
                            </button>
                        </div>

                        <div className="btn-group">
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-primary" data-method="zoom" data-option="0.1" title="Zoom In">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.zoom(0.1)">
                                    <span className="fa fa-search-plus"></span>
                                </span>
                            </button>
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-primary" data-method="zoom" data-option="-0.1" title="Zoom Out">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.zoom(-0.1)">
                                    <span className="fa fa-search-minus"></span>
                                </span>
                            </button>
                        </div>

                        <div className="btn-group">
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-primary" data-method="move" data-option="-10" data-second-option="0" title="Move Left">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.move(-10, 0)">
                                    <span className="fa fa-arrow-left"></span>
                                </span>
                            </button>
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-primary" data-method="move" data-option="10" data-second-option="0" title="Move Right">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.move(10, 0)">
                                    <span className="fa fa-arrow-right"></span>
                                </span>
                            </button>
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-primary" data-method="move" data-option="0" data-second-option="-10" title="Move Up">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.move(0, -10)">
                                    <span className="fa fa-arrow-up"></span>
                                </span>
                            </button>
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-primary" data-method="move" data-option="0" data-second-option="10" title="Move Down">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.move(0, 10)">
                                    <span className="fa fa-arrow-down"></span>
                                </span>
                            </button>
                        </div>

                        <div className="btn-group">
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-primary" data-method="rotate" data-option="-45" title="Rotate Left">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.rotate(-45)">
                                    <span className="fa fa-undo-alt"></span>
                                </span>
                            </button>
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-primary" data-method="rotate" data-option="45" title="Rotate Right">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.rotate(45)">
                                    <span className="fa fa-redo-alt"></span>
                                </span>
                            </button>
                        </div>

                        <div className="btn-group">
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-primary" data-method="scaleX" data-option="-1" title="Flip Horizontal">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.scaleX(-1)">
                                    <span className="fa fa-arrows-alt-h"></span>
                                </span>
                            </button>
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-primary" data-method="scaleY" data-option="-1" title="Flip Vertical">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.scaleY(-1)">
                                    <span className="fa fa-arrows-alt-v"></span>
                                </span>
                            </button>
                        </div>

                        <div className="btn-group">
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-primary" data-method="crop" title="Crop">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.crop()">
                                    <span className="fa fa-check"></span>
                                </span>
                            </button>
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-primary" data-method="clear" title="Clear">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.clear()">
                                    <span className="fa fa-times"></span>
                                </span>
                            </button>
                        </div>

                        <div className="btn-group">
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-primary" data-method="disable" title="Disable">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.disable()">
                                    <span className="fa fa-lock"></span>
                                </span>
                            </button>
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-primary" data-method="enable" title="Enable">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.enable()">
                                    <span className="fa fa-unlock"></span>
                                </span>
                            </button>
                        </div>

                        <div className="btn-group">
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-primary" data-method="reset" title="Reset">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.reset()">
                                    <span className="fa fa-sync-alt"></span>
                                </span>
                            </button>
                            <label className="btn btn-primary btn-upload" htmlFor="inputImage" title="Upload image file">
                                <input type="file" className="sr-only" id="inputImage" name="file" accept="image/*" onChange={onSelectFile} />
                                <span className="docs-tooltip" data-toggle="tooltip" title="Import image with Blob URLs">
                                    <span className="fa fa-upload"></span>
                                </span>
                            </label>
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-primary" data-method="destroy" title="Destroy">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.destroy()">
                                    <span className="fa fa-power-off"></span>
                                </span>
                            </button>
                        </div>

                        <div className="btn-group btn-group-crop">
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-success" data-method="getCroppedCanvas" data-option="{ &quot;maxWidth&quot;: 4096, &quot;maxHeight&quot;: 4096 }">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.getCroppedCanvas({ maxWidth: 4096, maxHeight: 4096 })">
                                    Get Cropped Canvas
                                </span>
                            </button>
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-success" data-method="getCroppedCanvas" data-option="{ &quot;width&quot;: 160, &quot;height&quot;: 90 }">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.getCroppedCanvas({ width: 160, height: 90 })">
                                    160&times;90
                                </span>
                            </button>
                            <button type="button" onClick={(e) => handleActions(e)} className="btn btn-success" data-method="getCroppedCanvas" data-option="{ &quot;width&quot;: 320, &quot;height&quot;: 180 }">
                                <span className="docs-tooltip" data-toggle="tooltip" title="cropper.getCroppedCanvas({ width: 320, height: 180 })">
                                    320&times;180
                                </span>
                            </button>
                        </div>

                        <button type="button" onClick={(e) => handleActions(e)} className="btn btn-secondary" data-method="getData" data-option data-target="#putData">
                            <span className="docs-tooltip" data-toggle="tooltip" title="cropper.getData()">
                                Get Data
                            </span>
                        </button>
                        <button type="button" onClick={(e) => handleActions(e)} className="btn btn-secondary" data-method="setData" data-target="#putData">
                            <span className="docs-tooltip" data-toggle="tooltip" title="cropper.setData(data)">
                                Set Data
                            </span>
                        </button>
                        <button type="button" onClick={(e) => handleActions(e)} className="btn btn-secondary" data-method="getContainerData" data-option data-target="#putData">
                            <span className="docs-tooltip" data-toggle="tooltip" title="cropper.getContainerData()">
                                Get Container Data
                            </span>
                        </button>
                        <button type="button" onClick={(e) => handleActions(e)} className="btn btn-secondary" data-method="getImageData" data-option data-target="#putData">
                            <span className="docs-tooltip" data-toggle="tooltip" title="cropper.getImageData()">
                                Get Image Data
                            </span>
                        </button>
                        <button type="button" onClick={(e) => handleActions(e)} className="btn btn-secondary" data-method="getCanvasData" data-option data-target="#putData">
                            <span className="docs-tooltip" data-toggle="tooltip" title="cropper.getCanvasData()">
                                Get Canvas Data
                            </span>
                        </button>
                        <button type="button" onClick={(e) => handleActions(e)} className="btn btn-secondary" data-method="setCanvasData" data-target="#putData">
                            <span className="docs-tooltip" data-toggle="tooltip" title="cropper.setCanvasData(data)">
                                Set Canvas Data
                            </span>
                        </button>
                        <button type="button" onClick={(e) => handleActions(e)} className="btn btn-secondary" data-method="getCropBoxData" data-option data-target="#putData">
                            <span className="docs-tooltip" data-toggle="tooltip" title="cropper.getCropBoxData()">
                                Get Crop Box Data
                            </span>
                        </button>
                        <button type="button" onClick={(e) => handleActions(e)} className="btn btn-secondary" data-method="setCropBoxData" data-target="#putData">
                            <span className="docs-tooltip" data-toggle="tooltip" title="cropper.setCropBoxData(data)">
                                Set Crop Box Data
                            </span>
                        </button>
                        <button type="button" onClick={(e) => handleActions(e)} className="btn btn-secondary" data-method="moveTo" data-option="0">
                            <span className="docs-tooltip" data-toggle="tooltip" title="cropper.moveTo(0)">
                                Move to [0,0]
                            </span>
                        </button>
                        <button type="button" onClick={(e) => handleActions(e)} className="btn btn-secondary" data-method="zoomTo" data-option="1">
                            <span className="docs-tooltip" data-toggle="tooltip" title="cropper.zoomTo(1)">
                                Zoom to 100%
                            </span>
                        </button>
                        <button type="button" onClick={(e) => handleActions(e)} className="btn btn-secondary" data-method="rotateTo" data-option="180">
                            <span className="docs-tooltip" data-toggle="tooltip" title="cropper.rotateTo(180)">
                                Rotate 180°
                            </span>
                        </button>
                        <button type="button" onClick={(e) => handleActions(e)} className="btn btn-secondary" data-method="scale" data-option="-2" data-second-option="-1">
                            <span className="docs-tooltip" data-toggle="tooltip" title="cropper.scale(-2, -1)">
                                Scale (-2, -1)
                            </span>
                        </button>
                        <textarea className="form-control" id="putData" placeholder="Get data to here or set data with this value"></textarea>
                    </div>

                    <div className="col-3 docs-toggles">
                        {/* <!-- <h3>Toggles:</h3> --> */}
                        <div className="btn-group d-flex flex-nowrap" data-toggle="buttons">
                            <label onClick={(e) => handleToggles(e)} className="btn btn-primary active">
                                <input type="radio" onChange={handleChange} className="sr-only" id="aspectRatio1" name="aspectRatio" value="1.7777777777777777" />
                                <span className="docs-tooltip" data-toggle="tooltip" title="aspectRatio: 16 / 9">
                                    16:9
                                </span>
                            </label>
                            <label onClick={(e) => handleToggles(e)} className="btn btn-primary">
                                <input type="radio" onChange={handleChange} className="sr-only" id="aspectRatio2" name="aspectRatio" value="1.3333333333333333" />
                                <span className="docs-tooltip" data-toggle="tooltip" title="aspectRatio: 4 / 3">
                                    4:3
                                </span>
                            </label>
                            <label onClick={(e) => handleToggles(e)} className="btn btn-primary">
                                <input type="radio" onChange={handleChange} className="sr-only" id="aspectRatio3" name="aspectRatio" value="1" />
                                <span className="docs-tooltip" data-toggle="tooltip" title="aspectRatio: 1 / 1">
                                    1:1
                                </span>
                            </label>
                            <label onClick={(e) => handleToggles(e)} className="btn btn-primary">
                                <input type="radio" onChange={handleChange} className="sr-only" id="aspectRatio4" name="aspectRatio" value="0.6666666666666666" />
                                <span className="docs-tooltip" data-toggle="tooltip" title="aspectRatio: 2 / 3">
                                    2:3
                                </span>
                            </label>
                            <label onClick={(e) => handleToggles(e)} className="btn btn-primary">
                                <input type="radio" onChange={handleChange} className="sr-only" id="aspectRatio5" name="aspectRatio" value="NaN" />
                                <span className="docs-tooltip" data-toggle="tooltip" title="aspectRatio: NaN">
                                    Free
                                </span>
                            </label>
                        </div>

                        <div className="btn-group d-flex flex-nowrap" data-toggle="buttons">
                            <label onClick={(e) => handleToggles(e)} className="btn btn-primary active">
                                <input type="radio" onChange={handleChange} className="sr-only" id="viewMode0" name="viewMode" value="0" checked />
                                <span className="docs-tooltip" data-toggle="tooltip" title="View Mode 0">
                                    VM0
                                </span>
                            </label>
                            <label onClick={(e) => handleToggles(e)} className="btn btn-primary">
                                <input type="radio" onChange={handleChange} className="sr-only" id="viewMode1" name="viewMode" value="1" />
                                <span className="docs-tooltip" data-toggle="tooltip" title="View Mode 1">
                                    VM1
                                </span>
                            </label>
                            <label onClick={(e) => handleToggles(e)} className="btn btn-primary">
                                <input type="radio" onChange={handleChange} className="sr-only" id="viewMode2" name="viewMode" value="2" />
                                <span className="docs-tooltip" data-toggle="tooltip" title="View Mode 2">
                                    VM2
                                </span>
                            </label>
                            <label onClick={(e) => handleToggles(e)} className="btn btn-primary">
                                <input type="radio" onChange={handleChange} className="sr-only" id="viewMode3" name="viewMode" value="3" />
                                <span className="docs-tooltip" data-toggle="tooltip" title="View Mode 3">
                                    VM3
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <a
                ref={hiddenAnchorRef}
                download={uploadedImageName}
                style={{
                    position: 'absolute',
                    top: '-200vh',
                    visibility: 'hidden',
                }}
            >
                Hidden download
            </a>
        </>
    )
}
