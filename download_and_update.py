import re
import random
import json
import urllib.parse
import urllib.request
import os
import time

file_path = r'h:\Projects\elow_e-commerce\src\data\index.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

start_match = re.search(r'export const PRODUCTS:\s*Product\[\]\s*=\s*\[', content)
start_idx = start_match.start()
end_idx = content.find('];\n\nexport type Category')
if end_idx == -1:
    end_idx = content.find('];\nexport type Category')
end_idx += 2

unsplash_ids = ['1774878488110-a1da46f5dc5b', '1518082130724-74d38e9ab9d4', '1765917921173-e43f86bf9c0f', '1774578342274-29121c889b01', '1762318897771-f68b31c0d11f', '1731575131336-9756ecd34dbc', '1660324197196-69580168711e', '1750814019023-4e43037f5075', '1725953386283-d918bb2ac9bb', '1521669145854-0bd392445939', '1760720962384-e470ee773c1f', '1725953236941-ec8efc71b0fc', '1579017308347-e53e0d2fc5e9', '1772890227578-50e68afb31c2', '1731575131547-d1f74ba73f85', '1784798455842-3a0be501172c', '1711030239034-d7dbf7f2794d', '1518082049942-62a4e31b18d3', '1779684998928-2d824ee831cf', '1774878520736-6cacbcce1b7b', '1517703565892-7cdb859e127b', '1627807353979-f8bd316b62cb', '1775884078872-3de6e7bded55', '1535837487710-a191373a20ae', '1781456505405-76d614cf5746', '1774878488255-5fc29c9edfcb', '1567855354833-ac2c4f967b0c', '1601311911926-dbdae16e54c9', '1700085663963-bbe0f7789b4a']
pexels_ids_1 = ['7718835', '32975295', '8004105', '7657376', '37401695', '5594317', '7657391', '11124936', '7718794', '6969319', '5554657', '32963963', '33445595', '28028334', '29997001', '983828', '6969293', '5445610', '5250892', '7657384', '5706020', '36376224', '8004103', '5412111', '7657387', '7695000', '3927131', '8250905', '4860071', '6340707', '4690306', '35278942', '34511907', '12914430', '8004106', '39675', '9743043']
pexels_ids_2 = ['17042498', '18277854', '38840591', '17042491', '18277851', '30355544', '5426052', '6952411', '4925688', '29391663', '16457216', '9664160', '6195790', '5081531', '8251921', '34531681', '18277845', '17042503', '8986081', '36978833', '34835173', '37100683', '36582881', '16605273', '17042501', '31172334', '8716210', '28921199', '34159490', '30021730', '1074921', '15937294', '18277843', '30683621', '21630720', '16472571', '30683622', '36421444', '33857229', '28921200']

def get_unsplash(id):
    return f'u("photo-{id}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA")'
def get_pexels(id):
    return f'"https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"'

image_pool = [get_unsplash(uid) for uid in unsplash_ids] + [get_pexels(pid) for pid in pexels_ids_1] + [get_pexels(pid) for pid in pexels_ids_2]
random.shuffle(image_pool)

categories = [
    {
        "id": "journals",
        "names": ["Linen Hardcover Journal", "Dotted Bullet Journal", "Leather Bound Diary", "Minimalist Grid Journal", "Floral Cover Journal", "Vintage Traveler's Notebook", "Guided Wellness Journal", "Dream Diary"]
    },
    {
        "id": "pens",
        "names": ["Pastel Gel Pen Set", "Fountain Pen", "Brush Pen Set", "Fineliner 0.5mm", "Calligraphy Pens", "Mechanical Pencil", "Highlighter Set", "Metallic Markers"]
    },
    {
        "id": "washi",
        "names": ["Cherry Blossom Washi Tape", "Grid Washi Tape", "Gold Foil Tape", "Vintage Stamp Washi", "Galaxy Tape Set", "Solid Color Washi", "Floral Washi Roll", "Slim Washi Tape"]
    },
    {
        "id": "stickers",
        "names": ["Kawaii Animal Stickers", "Vintage Plant Stickers", "Holographic Star Stickers", "Aesthetic Quotes Stickers", "Cafe Theme Sticker Pack", "Wax Seal Stickers", "Alphabet Stickers", "Planner Icon Stickers"]
    },
    {
        "id": "planners",
        "names": ["A5 Weekly Planner", "Undated Daily Planner", "Monthly Calendar Pad", "Academic Year Planner", "Goal Setting Agenda", "Desk Pad Planner", "Pocket Weekly Planner", "Project Planner"]
    },
    {
        "id": "notebooks",
        "names": ["Spiral Bound Notebook", "Mini Memo Pad", "Subject Notebook", "Composition Book", "Kraft Paper Notebook", "Tear-off Notepad", "Waterproof Notebook", "Recycled Paper Notebook"]
    },
    {
        "id": "desk",
        "names": ["Oak Desk Organizer", "Acrylic Pen Holder", "Rose Gold Paper Clips", "Monitor Stand", "Desk Mat", "Cable Organizer", "Sticky Notes Set", "Stapler and Tape Dispenser"]
    }
]

adjectives = ["Premium", "Aesthetic", "Minimalist", "Colorful", "Vintage", "Classic", "Modern", "Eco-friendly", "Handcrafted", "Luxury", "Everyday", "Compact"]

products_str = "export const PRODUCTS: Product[] = [\n"

for i in range(1, 101):
    cat = categories[i % len(categories)]
    
    if i % 10 == 0:
        base_name = f"Gift Set Combo ({cat['names'][0].split()[0]})"
        adj = "Ultimate"
        price = random.randint(799, 999)
    else:
        base_name = random.choice(cat["names"])
        adj = random.choice(adjectives)
        price = random.randint(99, 799)
        
    name = f"{adj} {base_name}"
    short_name = base_name
    
    original_price = price + random.randint(50, 300)
    rating = round(random.uniform(4.0, 5.0), 1)
    review_count = random.randint(20, 500)
    
    # Download primary image
    prompt = f"aesthetic Pinterest style flatlay photo of {name} stationery"
    encoded = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=600&height=600&nologo=true&seed={i}"
    
    local_path = f"h:\\Projects\\elow_e-commerce\\public\\products\\p{i}.jpg"
    
    print(f"Downloading p{i}.jpg ...")
    max_retries = 3
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as response:
                with open(local_path, 'wb') as out_file:
                    out_file.write(response.read())
            break
        except Exception as e:
            print(f"Failed to download p{i}.jpg: {e}")
            time.sleep(1)
            
    img1 = f'"/products/p{i}.jpg"'
    
    # Randomly pick 2 from the aesthetic stock pool
    other_img1 = random.choice(image_pool)
    other_img2 = random.choice(image_pool)
    while other_img2 == other_img1:
        other_img2 = random.choice(image_pool)
    
    tags = json.dumps([cat["id"], "aesthetic", adj.lower(), "pinterest", "gift" if "Gift" in name else "stationery"])
    
    badges = ["NEW", "BESTSELLER", "SALE", "LIMITED", None, None, None]
    badge = random.choice(badges)
    badge_variant = random.choice(["teal", "yellow", "red", "pink"])
    
    badge_str = f'\n    badge: "{badge}",\n    badgeVariant: "{badge_variant}",' if badge else ""
    is_new = 'true' if badge == 'NEW' else 'false'
    is_bestseller = 'true' if badge == 'BESTSELLER' else 'false'
    
    product_str = f"""  {{
    id: "p{i}",
    name: "{name}",
    shortName: "{short_name}",
    category: "{cat['id']}",
    subcategory: "General {cat['id'].title()}",
    price: {price},
    originalPrice: {original_price},
    rating: {rating},
    reviewCount: {review_count},
    images: [
      {img1},
      {other_img1},
      {other_img2}
    ],
    tags: {tags},{badge_str}
    isNew: {is_new},
    isBestseller: {is_bestseller},
    description: "This Pinterest-aesthetic {base_name.lower()} exactly matches the picture. High quality, reliable, and beautifully curated for your workspace.",
    details: [
      "Aesthetic Pinterest-inspired design",
      "High quality premium materials",
      "Perfect for journaling, planning, or gifting"
    ],
    inStock: {str(random.random() > 0.05).lower()},
    stockCount: {random.randint(5, 100)},
  }},
"""
    products_str += product_str

products_str += "];"

new_content = content[:start_idx] + products_str + content[end_idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully replaced PRODUCTS with locally downloaded AI images.")
