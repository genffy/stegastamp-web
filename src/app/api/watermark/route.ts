import fs from 'node:fs'
import { Writable } from "node:stream";
import { exec } from "child_process";
import util from "node:util";

import { getMd5 } from '@/utils';
import { NextResponse } from 'next/server';

const promiseExec = util.promisify(exec);
const UPLOAD_DIR = `${process.cwd()}/public/upload`;

function promisifySaveFile(file: Blob): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const fileStream = file.stream()
    // FIXME: already get text, why not write it directly?
    const filePath = `${UPLOAD_DIR}/${getMd5(await file.text())}.jpeg`;
    const destination = fs.createWriteStream(filePath, {
      encoding: "utf-8",
    });
    // NOTICE: sice node v17.0.0
    const webWritableStream = Writable.toWeb(destination);
    fileStream.pipeTo(webWritableStream);

    destination.on("finish", async (d: any) => {
      resolve(filePath)
    });
    destination.on("error", (e) => {
      reject(e.message)
    });
  });
}
// return image data
async function handleEncoder(filePath: string, secret: string, select: string) {
  let data = filePath
  try {
    const { signal, clearTimer } = abortSignal()
    const { stdout, stderr } = await promiseExec(`python3.10 web_encode.py --image ${filePath} --secret ${secret} --select ${select}`, {
      signal,
    });
    clearTimer()
    data = stdout
    console.log(stdout, stderr)
  } catch (error) {
    console.log(error)
  }
  return data
}
// return decode text or empty
async function handleDecoder(filePath: string) {
  let data = ''
  try {
    const { signal, clearTimer } = abortSignal()
    const { stdout, stderr } = await promiseExec(`python3.10 web_decode.py --image ${filePath}`, {
      signal,
    });
    clearTimer()
    console.log(stdout, stderr)
    data = stdout
  } catch (error) {
    console.log(error)
  }
  return data
}

function abortSignal(timeout = 10000) {
  const abort = new AbortController();
  const { signal } = abort;
  const id = setTimeout(() => abort.abort(), timeout);
  function clearTimer() {
    clearTimeout(id)
  }
  return { abort, signal, clearTimer }
}
/**
 * formdata
 * type: encode or decode
 * imageFile: image file
 * data: 
 *  {"x":-220,"y":-347,"width":1854,"height":1853,"rotate":0,"scaleX":1,"scaleY":1}
 * containerData:
 *  {"width":1854,"height":1853}
 * imageData:
 *  {"rotate":0,"scaleX":1,"scaleY":1,"naturalWidth":1200,"naturalHeight":800,"aspectRatio":1.5,"width":332.0032356547548,"height":221.3354904365032,"left":0,"top":0}
 * canvasData:
 *  {"left":385.5429400958289,"top":161.71926958760554,"width":332.0032356547548,"height":221.3354904365032,"naturalWidth":1200,"naturalHeight":800}
 * cropBoxData:
 *  {"left":324.71230468749997,"top":65.63320312499997,"width":512.8000000000001,"height":512.8000000000001}
 * @param req 
 * @param res 
 * @returns 
 */
export async function POST(req: Request) {

  // read form data
  const data: FormData = await req.formData();
  // get type, encode or decode
  const type = data.get("type");
  const imageFile = data.get('imageFile') as Blob
  // save file firstly
  if (!type || !imageFile) {
    return NextResponse.json({
      code: 403,
      message: "type or imageFile is empty",
    });
  }
  const filePath = await promisifySaveFile(imageFile);
  let result = '';
  if (type === "encode") {
    // TODO: how to get cropped image
    result = await handleEncoder(filePath, data.get('secret') as string, '');
    // TODO: read local file and return
  } else if (type === "decode") {
    result = await handleDecoder(filePath);
  }
  return NextResponse.json({ code: 200, result: result.replace(/\n/g, '') });
}
