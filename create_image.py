from PIL import Image

# Create a new transparent image
img = Image.new('RGBA', (400, 400), (0, 0, 0, 10))

# Save the image as a PNG file
img.save('./input/400_400_transparent.png', 'PNG')
