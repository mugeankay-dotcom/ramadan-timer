
import urllib.request
from PIL import Image
import os

def process_icons():
    url = "https://cdn-icons-png.flaticon.com/512/4358/4358665.png"
    try:
        urllib.request.urlretrieve(url, "icon-original.png")
        img = Image.open("icon-original.png")
        
        # Save 192
        img.resize((192, 192)).save("icon-192.png")
        print("Generated icon-192.png")

        # Save 512
        img.resize((512, 512)).save("icon-512.png")
        print("Generated icon-512.png")
        
    except Exception as e:
        print(f"Error processing icons: {e}")

def check_sizes():
    files = ["icon-192.png", "icon-512.png", "screenshots/mobile.jpg", "screenshots/desktop.jpg"]
    for f in files:
        if os.path.exists(f):
            try:
                img = Image.open(f)
                print(f"{f}: {img.size} {img.format}")
            except Exception as e:
                print(f"{f}: Error {e}")
        else:
            print(f"{f}: Not found")

if __name__ == "__main__":
    process_icons()
    check_sizes()
