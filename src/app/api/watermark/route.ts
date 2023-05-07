import fs from 'node:fs'
import { Writable } from "node:stream";
import { exec } from "child_process";
import util from "node:util";

import { getMd5 } from '@/utils';
import { NextResponse } from 'next/server';

const promiseExec = util.promisify(exec);
const PUBLIC_ROOT = `${process.cwd()}/public`;
const UPLOAD_DIR = `${PUBLIC_ROOT}/upload`;

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
async function handleEncoder(filePath: string, secret: string, select='0,0,400,400') {
  let data = filePath
  try {
    const { signal, clearTimer } = abortSignal()
    const { stdout, stderr } = await promiseExec(`python web_cli.py --type encode --image ${filePath} --secret ${secret} --select '${select}'`, {
      signal,
    });
    clearTimer()
    data = stdout
    console.log(stdout, stderr)
  } catch (error) {
    console.log(error)
  }
  return data.replace(PUBLIC_ROOT, '')
}
// return decode text or empty
async function handleDecoder(filePath: string) {
  let data = ''
  try {
    const { signal, clearTimer } = abortSignal()
    const { stdout, stderr } = await promiseExec(`python web_cli.py --type decode --image ${filePath}`, {
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
 * secret: encode secret
 * crop: left, top, right, bottom
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
  // FIXME: delete local file no used, corn job?
  let result = '';
  if (type === "encode") {
    result = await handleEncoder(filePath, data.get('secret') as string, data.get('crop') as string);
  } else if (type === "decode") {
    result = await handleDecoder(filePath);
  }
  return NextResponse.json({ code: 200, result: result.replace(/\n/g, '') });
}
