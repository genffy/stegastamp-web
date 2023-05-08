# stegastamp-web
The web for [StegaStamp](https://github.com/tancik/StegaStamp), and the demo idea is inspired by [cropperjs](https://fengyuanchen.github.io/cropperjs/), thanks for the author.

## Installation
### StegaStamp
Read [INSTALLATION.md](INSTALLATION.md) and confirm that you have installed all dependencies and run it as expected.

Note: the python version 3.10 recommended.
### StegaStamp-web

First, confirm `python web_cli.py` can run as expected.
```bash
python web_cli.py --type encode --image path/to/encode/image.png --secret encode123 --select '457,48,582,173'
python web_cli.py --type decode --image path/to/decode/image.png'
```

Then run web
```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage
![stegastamp-web-usage](https://user-images.githubusercontent.com/1506972/236694589-16ae6fd2-0c91-42dc-920c-79ae76092af3.gif)

## Deploy
TODO
