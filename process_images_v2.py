import os
from PIL import Image

# Config
INPUT_DIR = r"C:\Users\HP\.gemini\antigravity\brain\2a028fec-385e-4ff9-b582-0e6bff2c7729"
OUTPUT_DIR = r"C:\Users\HP\.gemini\antigravity\scratch\ramadan_timer\screenshots"
TARGET_WIDTH = 1080
TARGET_HEIGHT = 1920

# Create output dir if not exists (or clean it if needed, but we will overwrite)
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# Specific files uploaded by user (Exact filenames from metadata)
TARGET_FILES = [
    "uploaded_image_0_1768562540440.jpg",
    "uploaded_image_1_1768562540440.jpg",
    "uploaded_image_2_1768562540440.jpg",
    "uploaded_image_3_1768562540440.jpg",
    "uploaded_image_4_1768562540440.jpg"
]

print(f"Processing {len(TARGET_FILES)} specific images...")

for i, filename in enumerate(TARGET_FILES):
    img_path = os.path.join(INPUT_DIR, filename)
    
    if not os.path.exists(img_path):
        print(f"Warning: File not found {filename}")
        continue

    try:
        with Image.open(img_path) as img:
            # Resize logic: OBJECT COVER
            img_ratio = img.width / img.height
            target_ratio = TARGET_WIDTH / TARGET_HEIGHT
            
            if abs(img_ratio - target_ratio) < 0.01:
                img_final = img.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
            else:
                if img_ratio > target_ratio:
                    new_height = TARGET_HEIGHT
                    new_width = int(new_height * img_ratio)
                else:
                    new_width = TARGET_WIDTH
                    new_height = int(new_width / img_ratio)
                
                img_resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                
                left = (new_width - TARGET_WIDTH) // 2
                top = (new_height - TARGET_HEIGHT) // 2
                right = left + TARGET_WIDTH
                bottom = top + TARGET_HEIGHT
                
                img_final = img_resized.crop((left, top, right, bottom))
            
            # Save as PNG
            # Clean output filename
            output_filename = f"Ramazan2026_Screen_{i+1}.png"
            output_path = os.path.join(OUTPUT_DIR, output_filename)
            img_final.save(output_path, "PNG")
            print(f"Processed: {output_filename}")
            
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("Processing finished.")
