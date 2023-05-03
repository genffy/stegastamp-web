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

    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
        }
    };

    function decodeImage() {
        const imgData = {}

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
                        <h1 style={{display: }}>
                            <span>Decode</span>
                            <button style={{ float: "right" }} onClick={decodeImage}>
                                Decode Image
                            </button>
                        </h1>
                        {
                            cropData != "#" && <img style={{ width: "100%" }} src={cropData} alt="cropped" />
                        }
                    </div>
                </div>
            </div>
        </>
    );
};
