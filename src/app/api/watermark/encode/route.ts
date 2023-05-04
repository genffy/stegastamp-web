import { Writable } from "node:stream";
import formidable from "formidable";
import path from "path";
import fs from "node:fs";
// export const api = {
//   bodyParser: false,
// };
export async function POST(req: Request, res: Response) {
  const data: FormData = await req.formData();
  // how to save image from blob
  if (data.get('myImage') !== null) {
    // const file: Blob = data.get('myImage') as Blob;
    // const fileStream = file.stream()
    // const destination = fs.createWriteStream(`./upload/image.jpeg`, {
    //   encoding: "utf-8",
    // });
    // const webWritableStream = Writable.toWeb(destination);
    // fileStream.pipeTo(webWritableStream);
    // destination.on("finish", (d: any) => {
    //   console.log(d);
    // });
    // destination.on("error", () => {
    //   console.log("error");
    // });
  }
  let previewData = {}
  if (data.get('previewData') !== null) {
    const objStr = `${data.get('previewData')}` || '{}'
    previewData = JSON.parse(objStr)
    await fs.writeFileSync('./upload/crop_image.json',objStr, 'utf8');
  }
  console.log(previewData)
  return new Response(
    JSON.stringify({
      code: 0,
      data: previewData,
    })
  );
}
