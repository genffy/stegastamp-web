# TODO: read origin image path and select area data from args, encode it and print encoded image file path
import argparse
parser = argparse.ArgumentParser()
parser.add_argument('--image', type=str, default=None)
parser.add_argument('--select', type=str, default=None)
parser.add_argument('--secret', type=str, default='Stega!!')
args = parser.parse_args()
print(args.image)
