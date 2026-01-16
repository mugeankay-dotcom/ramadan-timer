import os
from PIL import Image, ImageFilter

# Config
INPUT_DIR = r"C:\Users\HP\.gemini\antigravity\brain\2a028fec-385e-4ff9-b582-0e6bff2c7729"
OUTPUT_DIR = r"C:\Users\HP\.gemini\antigravity\scratch\ramadan_timer\screenshots"

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

TARGET_FILES = [
    "uploaded_image_0_1768562540440.jpg",
    "uploaded_image_1_1768562540440.jpg",
    "uploaded_image_2_1768562540440.jpg",
    "uploaded_image_3_1768562540440.jpg",
    "uploaded_image_4_1768562540440.jpg"
]

def create_landscape_composite(img, target_w, target_h, prefix, index):
    # 1. Background: Resize to Cover + Blur
    bg = img.copy()
    bg_ratio = bg.width / bg.height
    target_ratio = target_w / target_h
    
    if bg_ratio > target_ratio:
        new_height = target_h
        new_width = int(new_height * bg_ratio)
    else:
        new_width = target_w
        new_height = int(new_width / bg_ratio)
        
    bg = bg.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    left = (new_width - target_w) // 2
    top = (new_height - target_h) // 2
    bg = bg.crop((left, top, left + target_w, top + target_h))
    
    bg = bg.filter(ImageFilter.GaussianBlur(25)) # Slightly more blur for larger screen
    
    # 2. Foreground: Resize to Fit Height/Width
    # For 10 inch, maybe leave a bit more margin? Let's use 95% height.
    # No, full height looks cleaner for screenshots.
    
    fg_height = target_h
    fg_width = int(img.width * (target_h / img.height))
    
    fg = img.resize((fg_width, fg_height), Image.Resampling.LANCZOS)
    
    # 3. Paste
    pos_x = (target_w - fg_width) // 2
    pos_y = (target_h - fg_height) // 2
    
    bg.paste(fg, (pos_x, pos_y))
    
    # Save
    output_filename = f"{prefix}_Horizontal_{index+1}.png"
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    bg.save(output_path, "PNG")
    print(f"Saved: {output_filename} ({target_w}x{target_h})")

print(f"Processing {len(TARGET_FILES)} images for Tablet 10-inch...")

for i, filename in enumerate(TARGET_FILES):
    img_path = os.path.join(INPUT_DIR, filename)
    
    if not os.path.exists(img_path):
        print(f"Warning: File not found {filename}")
        continue

    try:
        with Image.open(img_path) as img:
            # Tablet 10-inch Landscape: 1920x1080 (16:9)
            create_landscape_composite(img, 1920, 1080, "Tablet10", i)
            
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("Tablet 10-inch processing finished.")
