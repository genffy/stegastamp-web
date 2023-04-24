from PIL import Image

# Create a new transparent image
img = Image.new('RGBA', (400, 400), (0, 0, 0, 0))

# Save the image as a PNG file
img.save('transparent.png', 'PNG')
