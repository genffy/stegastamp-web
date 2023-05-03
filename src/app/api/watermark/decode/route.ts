import fs from 'node:fs'
import { Writable } from "node:stream";
import { exec } from "child_process";
import util from "node:util";
export const api = {
  bodyParser: false,
};
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
      console.log('done1', Date.now())
      const { stdout, stderr } = await promiseExec(`python3.10 test.py`);
      console.log(stdout, controller);
      controller.enqueue(encoder.encode(`${stdout}\n\n`));
    });
    console.log('done2', Date.now())
    destination.on("error", () => {
      console.log("error");
    });
  }
  return new Response(stream);
}
