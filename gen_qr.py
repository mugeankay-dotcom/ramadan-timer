import qrcode
import sys

url = "https://mugeankay-dotcom.github.io/ramadan-timer/?v=v27_mobile_polish"
img = qrcode.make(url)
img.save("mobile_qr.png")
print("QR Code generated: mobile_qr.png")
