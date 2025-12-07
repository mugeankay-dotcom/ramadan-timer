import struct

def get_png_size(file_path):
    try:
        with open(file_path, 'rb') as f:
            data = f.read(24)
            if data[:8] != b'\x89PNG\r\n\x1a\n':
                return "Not a PNG"
            w, h = struct.unpack('>LL', data[16:24])
            return f"{w}x{h}"
    except Exception as e:
        return str(e)

print(f"Mobile: {get_png_size('screenshots/mobile.png')}")
print(f"Desktop: {get_png_size('screenshots/desktop.png')}")
