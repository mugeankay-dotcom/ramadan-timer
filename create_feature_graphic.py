import os
from PIL import Image, ImageFilter

# Config
INPUT_DIR = r"C:\Users\HP\.gemini\antigravity\brain\2a028fec-385e-4ff9-b582-0e6bff2c7729"
OUTPUT_DIR = r"C:\Users\HP\.gemini\antigravity\scratch\ramadan_timer\screenshots"
SOURCE_IMAGE = "uploaded_image_0_1768562540440.jpg" # 1 nolu resim

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def create_feature_graphic():
    img_path = os.path.join(INPUT_DIR, SOURCE_IMAGE)
    
    if not os.path.exists(img_path):
        print(f"Error: Source file not found {SOURCE_IMAGE}")
        return

    try:
        with Image.open(img_path) as img:
            target_w = 1024
            target_h = 500
            
            # 1. Backgound
            bg = img.copy()
            # Resize logic for background (Cover width)
            bg_ratio = bg.width / bg.height
            target_ratio = target_w / target_h
            
            # We want to fill width mainly
            new_width = target_w
            new_height = int(new_width / bg_ratio)
            
            # If new height is less than target height, we scale by height instead
            if new_height < target_h:
                new_height = target_h
                new_width = int(new_height * bg_ratio)
            
            bg = bg.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Center Crop
            left = (new_width - target_w) // 2
            top = (new_height - target_h) // 2
            bg = bg.crop((left, top, left + target_w, top + target_h))
            
            # Blur
            bg = bg.filter(ImageFilter.GaussianBlur(30))
            
            # 2. Foreground (The UI screenshot)
            # Fit to height with some padding
            padding = 40
            fg_h = target_h - (padding * 2)
            fg_w = int(img.width * (fg_h / img.height))
            
            fg = img.resize((fg_w, fg_h), Image.Resampling.LANCZOS)
            
            # Paste Center
            pos_x = (target_w - fg_w) // 2
            pos_y = (target_h - fg_h) // 2
            
            # Add subtle shadow or border? Python PIL generic shadow is hard.
            # Just paste for now.
            bg.paste(fg, (pos_x, pos_y))
            
            # Save
            output_filename = "Feature_Graphic_1024x500.png"
            output_path = os.path.join(OUTPUT_DIR, output_filename)
            bg.save(output_path, "PNG")
            print(f"Created Feature Graphic: {output_filename}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_feature_graphic()
