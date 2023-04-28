import fs from "node:fs";
import { Writable } from "node:stream";
export async function POST(req: Request, res: Response) {
  const destination = fs.createWriteStream(`./upload/image.jpeg`, {
    encoding: "utf-8",
  });
  // get query params from url
  const { searchParams } = new URL(req.url);
  const position = searchParams.get("pos");
  const scale = searchParams.get("scale");
  // @ts-ignore
  const webWritableStream = Writable.toWeb(destination);
  // @ts-ignore
  req.body.pipeTo(webWritableStream);
  destination.on("finish", (d: any) => {
    console.log(d);
  });
  destination.on("error", () => {
    console.log("error");
  });

  return new Response(
    JSON.stringify({
      code: 0,
      data: {
        position,
        scale,
      },
    })
  );
}
