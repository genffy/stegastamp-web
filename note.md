## encode 
```shell
python encode_image.py ./saved_models/stegastamp_pretrained --image ./data/zme/demo.jpg --save_dir ./out/ --secret 

python decode_image.py ./saved_models/stegastamp_pretrained --image ./out/demo_hidden.png
```