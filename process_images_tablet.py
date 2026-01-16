import os
from PIL import Image

# Config
INPUT_DIR = r"C:\Users\HP\.gemini\antigravity\brain\2a028fec-385e-4ff9-b582-0e6bff2c7729"
OUTPUT_DIR = r"C:\Users\HP\.gemini\antigravity\scratch\ramadan_timer\screenshots"

# Ensure output directory exists (we don't delete existing files here to preserve Phone ones)
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

TARGET_FILES = [
    "uploaded_image_0_1768562540440.jpg",
    "uploaded_image_1_1768562540440.jpg",
    "uploaded_image_2_1768562540440.jpg",
    "uploaded_image_3_1768562540440.jpg",
    "uploaded_image_4_1768562540440.jpg"
]

def process_and_save(img, target_w, target_h, prefix, index):
    # Resize logic: OBJECT COVER
    img_ratio = img.width / img.height
    target_ratio = target_w / target_h
    
    if abs(img_ratio - target_ratio) < 0.01:
        img_final = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    else:
        if img_ratio > target_ratio:
            # Image wider
            new_height = target_h
            new_width = int(new_height * img_ratio)
        else:
            # Image taller
            new_width = target_w
            new_height = int(new_width / img_ratio)
        
        img_resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        left = (new_width - target_w) // 2
        top = (new_height - target_h) // 2
        right = left + target_w
        bottom = top + target_h
        
        img_final = img_resized.crop((left, top, right, bottom))
    
    # Save
    output_filename = f"{prefix}_Screen_{index+1}.png"
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    img_final.save(output_path, "PNG")
    print(f"Saved: {output_filename} ({target_w}x{target_h})")

print(f"Processing {len(TARGET_FILES)} images for Tablet 7-inch...")

for i, filename in enumerate(TARGET_FILES):
    img_path = os.path.join(INPUT_DIR, filename)
    
    if not os.path.exists(img_path):
        print(f"Warning: File not found {filename}")
        continue

    try:
        with Image.open(img_path) as img:
            # Create Tablet 7-inch version (800x1280) - Standard 7" Android Tablet Portrait
            process_and_save(img, 800, 1280, "Tablet7", i)
            
            # (Optional) Re-verify Phone version if needed, but user asked for Tablet *also*
            # process_and_save(img, 1080, 1920, "Phone", i) 
            
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("Tablet processing finished.")
