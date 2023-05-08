# stegastamp-web

The web for [StegaStamp](https://github.com/tancik/StegaStamp), and the demo idea is inspired by [cropperjs](https://fengyuanchen.github.io/cropperjs/), thanks for the author.

## Installation

### StegaStamp

use GIT LFS load models, how to install pls check [installing-git-large-file-storage](https://docs.github.com/en/repositories/working-with-files/managing-large-files/installing-git-large-file-storage)

```bash
git lfs pull
```

Read [StegaStamp/README.md](https://github.com/tancik/StegaStamp/blob/master/README.md) and confirm that you have installed all dependencies and run it as expected.

Note: the python version 3.10 recommended.

### StegaStamp-web

First, confirm `python web_cli.py` can run as expected.

```bash
python3 web_cli.py --type encode --image path/to/encode/image.png --secret encode123 --select '457,48,582,173'
python3 web_cli.py --type decode --image path/to/decode/image.png
```

Then run web

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### WebUI

![stegastamp-web-usage](https://user-images.githubusercontent.com/1506972/236694589-16ae6fd2-0c91-42dc-920c-79ae76092af3.gif)

### Api

Run Flask api sever

```bash
flask --debug run
```

```bash
curl --location 'http://127.0.0.1:5000/imgmarker' \
--header 'secret_key: trest' \
--header 'Cookie: session=.eJyrVopPy0kszkgtVrKKrlZSKAFSSrmpxcWJ6alKOkp--QppmTmpCgWJRSVKsbU6Q0ZFbC0ABkNGag.ZFi1zg.KrXSLc399gA5iu9pNb37_ZhhSK0' \
--form 'type="encode"' \
--form 'secret="Hello1234"' \
--form 'select="47,70,584,607"' \
--form 'imageFile=@"6ba4b470f7314c10855ccb88b74a2d80.png"'

# {
#     "code": 200,
#     "data": "public/upload/6ba4b470f7314c10855ccb88b74a2d80.png",
#     "message": "ok"
# }
```
