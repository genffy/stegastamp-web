export type CropDataType = {
    x: number;
    y: number;
    width: number;
    height: number;
    rotate: number | '';
    scaleX: number | '';
    scaleY: number | '';
}

export default function PreviewData({ cropData }: { cropData: CropDataType }) {
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
