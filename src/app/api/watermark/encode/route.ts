import fs from "node:fs";
import { Writable } from "node:stream";
export async function POST(req: Request, res: Response) {
  const destination = fs.createWriteStream(`./upload/image.jpeg`, {
    encoding: "utf-8",
  });
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

  // console.log(req.body);
  // // @ts-ignore
  // console.log(req.body.type);
  // const reader = req.body.getReader();
  return new Response(
    JSON.stringify({
      code: 0,
      data: {
        url: "",
      },
    })
  );
}
