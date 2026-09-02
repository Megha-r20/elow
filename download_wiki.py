import urllib.request
import json
import os

url = "https://commons.wikimedia.org/w/api.php?action=query&prop=videoinfo&viprop=url&titles=File:Writing_For_Open_Source_Day2.webm&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
response = urllib.request.urlopen(req)
data = json.loads(response.read())

pages = data['query']['pages']
for page_id in pages:
    video_url = pages[page_id]['videoinfo'][0]['url']
    print(f"Downloading from {video_url}")
    os.makedirs('public', exist_ok=True)
    req2 = urllib.request.Request(video_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req2) as resp, open('public/hero-video.webm', 'wb') as f:
        f.write(resp.read())
    print("Success!")
    break
