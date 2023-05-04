import fs from 'node:fs'
import { Writable } from "node:stream";
import { exec } from "child_process";
import util from "node:util";
const promiseExec = util.promisify(exec);

export async function POST(req: Request, res: Response) {
  const encoder = new TextEncoder();
  let controller: any;
  const stream = await new ReadableStream({
    async start(_) {
      controller = _;
    },
  });
  // read image & decode it
  const data: FormData = await req.formData();
  // how to save image from blob
  if (data.get('croppedImage') !== null) {
    const file: Blob = data.get('croppedImage') as Blob;
    const fileStream = file.stream()
    const destination = fs.createWriteStream(`./upload/to_decode_image.jpeg`, {
      encoding: "utf-8",
    });
    const webWritableStream = Writable.toWeb(destination);
    fileStream.pipeTo(webWritableStream);
    destination.on("finish", async (d: any) => {
      const abort = new AbortController();
      const { signal } = abort;
      try {
        const id = setTimeout(() => abort.abort(), 10000);
        const { stdout, stderr } = await promiseExec(`python3.10 test.py`, {
          signal,
          // timeout: 10000,
        });
        clearTimeout(id)
        console.log(stdout, stderr)
        controller.enqueue(encoder.encode(`${stdout}\n\n`));
      } catch (error) {
        console.log(error)
        controller.enqueue(encoder.encode(`timeout`));
      }
    });
    destination.on("error", () => {
      console.log("error");
    });
  }
  return new Response(stream);
}
