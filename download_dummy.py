import urllib.request
import json

# W3Schools video is 100% reliable
url = "https://www.w3schools.com/html/mov_bbb.mp4"
req = urllib.request.Request(
    url, 
    headers={'User-Agent': 'Mozilla/5.0'}
)

with urllib.request.urlopen(req) as response, open('public/hero-video.mp4', 'wb') as out_file:
    out_file.write(response.read())

print("Video downloaded")
