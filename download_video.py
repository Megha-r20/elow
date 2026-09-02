import urllib.request

url = "https://assets.mixkit.co/videos/preview/mixkit-woman-writing-in-a-notebook-at-a-desk-with-coffee-51261-large.mp4"
req = urllib.request.Request(
    url, 
    data=None, 
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://mixkit.co/'
    }
)

with urllib.request.urlopen(req) as response, open('public/hero-video.mp4', 'wb') as out_file:
    out_file.write(response.read())

print("Video downloaded successfully!")
