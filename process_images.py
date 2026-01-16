import os
from PIL import Image

# Config
INPUT_DIR = r"C:\Users\HP\.gemini\antigravity\brain\2a028fec-385e-4ff9-b582-0e6bff2c7729"
OUTPUT_DIR = r"C:\Users\HP\.gemini\antigravity\scratch\ramadan_timer\processed_screenshots"
TARGET_WIDTH = 1080
TARGET_HEIGHT = 1920

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# Get images
files = [f for f in os.listdir(INPUT_DIR) if f.startswith("uploaded_image") and f.endswith(".jpg")]
files.sort() # Ensure consistent order

print(f"Found {len(files)} images to process.")

for i, filename in enumerate(files):
    img_path = os.path.join(INPUT_DIR, filename)
    try:
        with Image.open(img_path) as img:
            # Resize logic: OBJECT COVER (Fill the area, verify aspect ratio)
            
            # Calculate ratios
            img_ratio = img.width / img.height
            target_ratio = TARGET_WIDTH / TARGET_HEIGHT
            
            # If image matches target ratio roughly, simple resize
            if abs(img_ratio - target_ratio) < 0.01:
                img_final = img.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
            else:
                # Resize keeping aspect ratio so that it COVERS the target dimension
                if img_ratio > target_ratio:
                    # Image is wider -> Resize based on height
                    new_height = TARGET_HEIGHT
                    new_width = int(new_height * img_ratio)
                else:
                    # Image is taller -> Resize based on width
                    new_width = TARGET_WIDTH
                    new_height = int(new_width / img_ratio)
                
                img_resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                
                # Center Crop
                left = (new_width - TARGET_WIDTH) // 2
                top = (new_height - TARGET_HEIGHT) // 2
                right = left + TARGET_WIDTH
                bottom = top + TARGET_HEIGHT
                
                img_final = img_resized.crop((left, top, right, bottom))
            
            # Save as PNG
            output_filename = f"Ramazan2026_Screenshot_{i+1}.png"
            output_path = os.path.join(OUTPUT_DIR, output_filename)
            img_final.save(output_path, "PNG")
            print(f"Processed: {output_filename}")
            
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("Processing finished.")
