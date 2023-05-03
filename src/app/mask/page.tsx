'use client'

import React, { useState, createRef, useEffect } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./Demo.css";
import { useLocalStorage } from "react-use";

const defaultSrc =
    "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";

export default function MaskPage() {
    const [image, setImage] = useState(defaultSrc);
    const [cropData, setCropData] = useState("#");
    const cropperRef = createRef<ReactCropperElement>();
    const [value, setValue, remove] = useLocalStorage('cropperjs_watermark', '');
    const [decodeData, setDecodeData] = useState('');
    const onChange = (e: any) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result as any);
            setValue(reader.result as any);
        };
        reader.readAsDataURL(files[0]);
    };

    document.onpaste = function (event: any) {
        var items = (event.clipboardData || event.originalEvent.clipboardData).items;
        console.log(JSON.stringify(items)); // might give you mime types
        for (var index in items) {
            var item = items[index];
            if (item.kind === 'file') {
                var blob = item.getAsFile();
                var reader = new FileReader();
                reader.onload = function (evt: any) {
                    console.log(evt.target.result); // data url!
                    setImage(evt.target.result as any);
                    setValue(evt.target.result as any);
                }; 
                reader.readAsDataURL(blob);
            }
        }
    };

    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
        }
    };

    function decodeImage() {
        const imgData = {}
        if (typeof cropperRef.current?.cropper !== "undefined") {
            const data = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
            // Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`.
            // The default value for the second parameter of `toBlob` is 'image/png', change it if necessary.
            cropperRef.current?.cropper.getCroppedCanvas().toBlob((blob) => {
                const formData = new FormData();
                // Pass the image file name as the third parameter if necessary.
                if(blob){
                    formData.append('croppedImage', blob/*, 'example.png' */);
                    setDecodeData('decoding...')
                    fetch(`/api/watermark/decode`, {
                        method: 'POST',
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
                            setDecodeData(decoder.decode(value));
                            return reader.read().then(processText);
                            });
                        }
                    })
                        .catch(err => alert(err));
                }
            }/*, 'image/png' */);
        }
    }

    useEffect(() => {
        if (value) {
            setImage(value || '')
        }
    }, [image, value])

    return (
        <>
            <div className="header">
                <input type="file" onChange={onChange} />
            </div>
            <div className="container">
                <div className="left">
                    <Cropper
                        ref={cropperRef}
                        style={{ height: 400, width: "100%" }}
                        zoomTo={0.5}
                        initialAspectRatio={1}
                        preview=".img-preview"
                        src={image}
                        aspectRatio={1 / 1}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        checkOrientation={false}
                        guides={true}
                    />
                </div>
                <div className="right">
                    <div className="box">
                        <h1>Preview</h1>
                        <div
                            className="img-preview"
                            style={{ height: "400px", width: "400px", overflow: "hidden" }}
                        />
                    </div>
                    <div
                        className="box"
                    >
                        <h1 className="center">
                            <span>Decode</span>
                            <button style={{ float: "right" }} onClick={decodeImage}>
                                Decode Image
                            </button>
                            
                        </h1>
                        <p>{decodeData}</p>
                        {
                            cropData != "#" && <img style={{ width: "100%" }} src={cropData} alt="cropped" />
                        }
                    </div>
                </div>
            </div>
        </>
    );
};
