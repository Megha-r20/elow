import re

with open('src/data/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

def make_bestseller(match):
    # Insert badge, badgeVariant, and isBestseller before the matched string (which is '    description: "')
    return '    badge: "BESTSELLER",\n    badgeVariant: "yellow",\n    isBestseller: true,\n' + match.group(0)

# p10: Rainbow Washi Tape Set
content = re.sub(r'(?<=id: "p10",).*?(?=    description: ")', make_bestseller, content, flags=re.DOTALL)
# p12: Solid Oak Desk Organizer
content = re.sub(r'(?<=id: "p12",).*?(?=    description: ")', make_bestseller, content, flags=re.DOTALL)


with open('src/data/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated data.ts")
