from PIL import Image
import os

def create_icons():
    source_img = "masjid_bg.png"
    if not os.path.exists(source_img):
        print(f"Error: {source_img} not found.")
        return

    try:
        img = Image.open(source_img)
        
        # Calculate crop box for center square
        width, height = img.size
        new_dim = min(width, height)
        
        left = (width - new_dim) / 2
        top = (height - new_dim) / 2
        right = (width + new_dim) / 2
        bottom = (height + new_dim) / 2

        img_cropped = img.crop((left, top, right, bottom))

        # Resize and save
        sizes = [192, 512]
        for size in sizes:
            img_resized = img_cropped.resize((size, size), Image.Resampling.LANCZOS)
            output_name = f"icon-kabe-{size}.png"
            img_resized.save(output_name)
            print(f"Generated: {output_name}")

    except Exception as e:
        print(f"Failed to generate icons: {e}")

if __name__ == "__main__":
    create_icons()
