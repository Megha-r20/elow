import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://cdn.coverr.co/videos/coverr-writing-in-a-notebook-2821/1080p.mp4"
req = urllib.request.Request(
    url, 
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
    }
)

import os
os.makedirs('public', exist_ok=True)

with urllib.request.urlopen(req, context=ctx) as response, open('public/hero-video.mp4', 'wb') as out_file:
    out_file.write(response.read())

print("Video downloaded")
