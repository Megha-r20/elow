const u = (id, w = 600, h = 600) =>
  `https://images.unsplash.com/${id}&w=${w}&h=${h}&fit=crop&q=82`;

export const PRODUCTS = [
  {
    "id": "P001",
    "name": "Lavender Glass Dip Pen",
    "shortName": "Lavender Glass Dip Pen",
    "category": "pens",
    "subcategory": "Dip Pens",
    "price": 699,
    "originalPrice": 899,
    "rating": 4.3,
    "reviewCount": 12,
    "images": [
      "https://i.pinimg.com/736x/ac/f2/3b/acf23b74b25b5c5bcd23d40a018aeeba.jpg",
      "https://pin.it/1khqHVlQF"
    ],
    "tags": [
      "pens",
      "dip pens",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Elegant glass dip pen with a smooth spiral nib for effortless ink flow.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Dip Pens",
      "Stock: 18 items available"
    ],
    "inStock": true,
    "stockCount": 18
  },
  {
    "id": "P002",
    "name": "Moonlight Fountain Pen",
    "shortName": "Moonlight Fountain Pen",
    "category": "pens",
    "subcategory": "Fountain Pens",
    "price": 849,
    "originalPrice": 1099,
    "rating": 4.6,
    "reviewCount": 35,
    "images": [
      "https://i.pinimg.com/736x/1c/51/fb/1c51fb1a679be62364ecec7e595aaf8d.jpg",
      "https://pin.it/4xs1hyMgW"
    ],
    "tags": [
      "pens",
      "fountain pens",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Minimal fountain pen with a polished body and fine writing nib.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Fountain Pens",
      "Stock: 14 items available"
    ],
    "inStock": true,
    "stockCount": 14
  },
  {
    "id": "P003",
    "name": "Blush Rose Gel Pen Set",
    "shortName": "Blush Rose Gel Pen Set",
    "category": "pens",
    "subcategory": "Gel Pens",
    "price": 299,
    "originalPrice": 399,
    "rating": 4.9,
    "reviewCount": 58,
    "images": [
      "https://i.pinimg.com/736x/85/35/f5/8535f5e87ee72c34d4c4f0336d38aa89.jpg",
      "https://pin.it/P0n9RCZYP"
    ],
    "tags": [
      "pens",
      "gel pens",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Set of six soft-tone gel pens designed for smooth everyday writing.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Gel Pens",
      "Stock: 32 items available"
    ],
    "inStock": true,
    "stockCount": 32
  },
  {
    "id": "P004",
    "name": "Vintage Brass Pen",
    "shortName": "Vintage Brass Pen",
    "category": "pens",
    "subcategory": "Metal Pens",
    "price": 549,
    "originalPrice": 699,
    "rating": 4.5,
    "reviewCount": 81,
    "images": [
      "https://i.pinimg.com/736x/8c/49/a5/8c49a5455602bcd78495f8d33e103863.jpg",
      "https://pin.it/2I8Icr8TF"
    ],
    "tags": [
      "pens",
      "metal pens",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Antique-inspired brass pen with a timeless handcrafted appearance.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Metal Pens",
      "Stock: 21 items available"
    ],
    "inStock": true,
    "stockCount": 21
  },
  {
    "id": "P005",
    "name": "Sakura Fine Liner Set",
    "shortName": "Sakura Fine Liner Set",
    "category": "pens",
    "subcategory": "Fineliners",
    "price": 349,
    "originalPrice": 449,
    "rating": 4.8,
    "reviewCount": 19,
    "images": [
      "https://i.pinimg.com/736x/73/a5/7e/73a57eab6e72b099eb9f79c6d1ebd108.jpg",
      "https://pin.it/6rPV8up78"
    ],
    "tags": [
      "pens",
      "fineliners",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Six precision fineliners perfect for notes, sketches and journaling.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Fineliners",
      "Stock: 27 items available"
    ],
    "inStock": true,
    "stockCount": 27
  },
  {
    "id": "P006",
    "name": "Cloud Blue Rollerball",
    "shortName": "Cloud Blue Rollerball",
    "category": "pens",
    "subcategory": "Rollerball Pens",
    "price": 429,
    "originalPrice": 549,
    "rating": 4.4,
    "reviewCount": 42,
    "images": [
      "https://i.pinimg.com/736x/46/48/98/46489861525f0a467c81c3d52fbeab6b.jpg",
      "https://pin.it/5eOKduoK7"
    ],
    "tags": [
      "pens",
      "rollerball pens",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Lightweight rollerball with silky ink flow and a calming blue finish.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Rollerball Pens",
      "Stock: 24 items available"
    ],
    "inStock": true,
    "stockCount": 24
  },
  {
    "id": "P007",
    "name": "Midnight Ink Bottle",
    "shortName": "Midnight Ink Bottle",
    "category": "pens",
    "subcategory": "Fountain Ink",
    "price": 279,
    "originalPrice": 349,
    "rating": 4.7,
    "reviewCount": 65,
    "images": [
      "https://i.pinimg.com/736x/b3/b1/7c/b3b17c680a35011b362508f49856d7da.jpg",
      "https://pin.it/LuSheQ4Dj"
    ],
    "tags": [
      "pens",
      "fountain ink",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": true,
    "description": "Deep midnight-blue fountain pen ink for expressive writing.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Fountain Ink",
      "Stock: 35 items available"
    ],
    "inStock": true,
    "stockCount": 35
  },
  {
    "id": "P008",
    "name": "Rose Quartz Pen",
    "shortName": "Rose Quartz Pen",
    "category": "pens",
    "subcategory": "Ball Pens",
    "price": 199,
    "originalPrice": 279,
    "rating": 4.3,
    "reviewCount": 88,
    "images": [
      "https://i.pinimg.com/736x/0e/f7/15/0ef71561604be63cf4dbf25ec065f6c2.jpg",
      "https://pin.it/37JT71wEp"
    ],
    "tags": [
      "pens",
      "ball pens",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Elegant pink ball pen with a smooth metallic barrel.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Ball Pens",
      "Stock: 41 items available"
    ],
    "inStock": true,
    "stockCount": 41
  },
  {
    "id": "P009",
    "name": "Botanical Sketch Pen Set",
    "shortName": "Botanical Sketch Pen Set",
    "category": "pens",
    "subcategory": "Drawing Pens",
    "price": 399,
    "originalPrice": 499,
    "rating": 4.6,
    "reviewCount": 26,
    "images": [
      "https://i.pinimg.com/736x/d3/47/a5/d347a57453e3b6a11ab5f67410eb84ba.jpg",
      "https://pin.it/2TGfJUO2R"
    ],
    "tags": [
      "pens",
      "drawing pens",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Assorted fine-tip pens ideal for botanical illustrations and doodles.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Drawing Pens",
      "Stock: 29 items available"
    ],
    "inStock": true,
    "stockCount": 29
  },
  {
    "id": "P010",
    "name": "Espresso Wooden Pen",
    "shortName": "Espresso Wooden Pen",
    "category": "pens",
    "subcategory": "Wooden Pens",
    "price": 349,
    "originalPrice": 449,
    "rating": 4.9,
    "reviewCount": 49,
    "images": [
      "https://i.pinimg.com/736x/60/96/94/60969424890b5162151a710455aacea1.jpg",
      "https://pin.it/3F1sdNF2v"
    ],
    "tags": [
      "pens",
      "wooden pens",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Warm wooden-bodied pen with a natural grain finish.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Wooden Pens",
      "Stock: 16 items available"
    ],
    "inStock": true,
    "stockCount": 16
  },
  {
    "id": "P011",
    "name": "Pastel Highlighter Collection",
    "shortName": "Pastel Highlighter Collection",
    "category": "pens",
    "subcategory": "Highlighters",
    "price": 329,
    "originalPrice": 429,
    "rating": 4.5,
    "reviewCount": 72,
    "images": [
      "https://i.pinimg.com/736x/be/5e/f5/be5ef511b100cd1b4cadce3cc195924d.jpg",
      "https://pin.it/18xwptNvD"
    ],
    "tags": [
      "pens",
      "highlighters",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Soft pastel highlighters designed for subtle and aesthetic notes.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Highlighters",
      "Stock: 38 items available"
    ],
    "inStock": true,
    "stockCount": 38
  },
  {
    "id": "P012",
    "name": "Vintage Ink Pen Trio",
    "shortName": "Vintage Ink Pen Trio",
    "category": "pens",
    "subcategory": "Pen Sets",
    "price": 449,
    "originalPrice": 599,
    "rating": 4.8,
    "reviewCount": 95,
    "images": [
      "https://i.pinimg.com/736x/e8/dc/63/e8dc63ac997975492e076ed6c22b6152.jpg",
      "https://pin.it/6k0Nvw2AP"
    ],
    "tags": [
      "pens",
      "pen sets",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Three vintage-style pens with comfortable rounded grips.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Pen Sets",
      "Stock: 19 items available"
    ],
    "inStock": true,
    "stockCount": 19
  },
  {
    "id": "P013",
    "name": "Pearl White Fountain Pen",
    "shortName": "Pearl White Fountain Pen",
    "category": "pens",
    "subcategory": "Fountain Pens",
    "price": 749,
    "originalPrice": 949,
    "rating": 4.4,
    "reviewCount": 33,
    "images": [
      "https://i.pinimg.com/736x/b6/d7/a6/b6d7a6e565fe6507c2be92823931fcfe.jpg",
      "https://pin.it/1IJ2L2Y8G"
    ],
    "tags": [
      "pens",
      "fountain pens",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Pearl-finish fountain pen with a refined stainless-steel nib.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Fountain Pens",
      "Stock: 13 items available"
    ],
    "inStock": true,
    "stockCount": 13
  },
  {
    "id": "P014",
    "name": "Cocoa Brush Pen Set",
    "shortName": "Cocoa Brush Pen Set",
    "category": "pens",
    "subcategory": "Brush Pens",
    "price": 379,
    "originalPrice": 479,
    "rating": 4.7,
    "reviewCount": 56,
    "images": [
      "https://i.pinimg.com/736x/85/37/84/8537844844065e0d8ad8065b60f57da3.jpg",
      "https://pin.it/4Clw45FQ5"
    ],
    "tags": [
      "pens",
      "brush pens",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Six earthy brush pens for lettering, headers and creative journaling.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Brush Pens",
      "Stock: 26 items available"
    ],
    "inStock": true,
    "stockCount": 26
  },
  {
    "id": "P015",
    "name": "Soft Lilac Marker Set",
    "shortName": "Soft Lilac Marker Set",
    "category": "pens",
    "subcategory": "Markers",
    "price": 399,
    "originalPrice": 499,
    "rating": 4.3,
    "reviewCount": 79,
    "images": [
      "https://i.pinimg.com/736x/03/6b/3c/036b3c86d6f27ead826f7953b7671945.jpg",
      "https://pin.it/2Ihf2OeQ6"
    ],
    "tags": [
      "pens",
      "markers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Aesthetic lilac-toned markers with dual-purpose writing tips.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Markers",
      "Stock: 31 items available"
    ],
    "inStock": true,
    "stockCount": 31
  },
  {
    "id": "P016",
    "name": "Golden Nib Dip Pen",
    "shortName": "Golden Nib Dip Pen",
    "category": "pens",
    "subcategory": "Dip Pens",
    "price": 599,
    "originalPrice": 799,
    "rating": 4.6,
    "reviewCount": 17,
    "images": [
      "https://i.pinimg.com/736x/29/50/d2/2950d2aa89e77993c28b6136db1b9986.jpg",
      "https://pin.it/4XjVifvuI"
    ],
    "tags": [
      "pens",
      "dip pens",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Decorative dip pen with an elegant golden nib and glass handle.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Dip Pens",
      "Stock: 12 items available"
    ],
    "inStock": true,
    "stockCount": 12
  },
  {
    "id": "P017",
    "name": "Minimal Black Fineliners",
    "shortName": "Minimal Black Fineliners",
    "category": "pens",
    "subcategory": "Fineliners",
    "price": 279,
    "originalPrice": 349,
    "rating": 4.9,
    "reviewCount": 40,
    "images": [
      "https://i.pinimg.com/736x/1e/92/50/1e9250a1220046d505d3335289c21f26.jpg",
      "https://pin.it/3GwcxYEWq"
    ],
    "tags": [
      "pens",
      "fineliners",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Clean black fineliners with consistent ink flow for precise writing.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Fineliners",
      "Stock: 44 items available"
    ],
    "inStock": true,
    "stockCount": 44
  },
  {
    "id": "P018",
    "name": "Ocean Blue Ink Set",
    "shortName": "Ocean Blue Ink Set",
    "category": "pens",
    "subcategory": "Fountain Ink",
    "price": 499,
    "originalPrice": 649,
    "rating": 4.5,
    "reviewCount": 63,
    "images": [
      "https://i.pinimg.com/736x/01/0a/39/010a39e36dd5ff60fa227fdbd27fc527.jpg",
      "https://pin.it/3bRCmssWR"
    ],
    "tags": [
      "pens",
      "fountain ink",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Set of three blue-toned inks inspired by ocean shades.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Fountain Ink",
      "Stock: 17 items available"
    ],
    "inStock": true,
    "stockCount": 17
  },
  {
    "id": "P019",
    "name": "Terracotta Brush Pen",
    "shortName": "Terracotta Brush Pen",
    "category": "pens",
    "subcategory": "Brush Pens",
    "price": 229,
    "originalPrice": 299,
    "rating": 4.8,
    "reviewCount": 86,
    "images": [
      "https://i.pinimg.com/736x/06/93/a8/0693a891c3e64688a99728c42b479fdd.jpg",
      "https://pin.it/1tK2sJLli"
    ],
    "tags": [
      "pens",
      "brush pens",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Warm terracotta brush pen ideal for expressive lettering.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Brush Pens",
      "Stock: 33 items available"
    ],
    "inStock": true,
    "stockCount": 33
  },
  {
    "id": "P020",
    "name": "Daisy Click Pen Set",
    "shortName": "Daisy Click Pen Set",
    "category": "pens",
    "subcategory": "Ball Pens",
    "price": 249,
    "originalPrice": 329,
    "rating": 4.4,
    "reviewCount": 24,
    "images": [
      "https://i.pinimg.com/736x/1b/00/8b/1b008bc5898c7246bba878aa9e8ea17e.jpg",
      "https://pin.it/1lU2kAB2D"
    ],
    "tags": [
      "pens",
      "ball pens",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Cute floral click pens with comfortable everyday writing tips.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Ball Pens",
      "Stock: 36 items available"
    ],
    "inStock": true,
    "stockCount": 36
  },
  {
    "id": "P021",
    "name": "Smoky Grey Marker Duo",
    "shortName": "Smoky Grey Marker Duo",
    "category": "pens",
    "subcategory": "Markers",
    "price": 189,
    "originalPrice": 249,
    "rating": 4.7,
    "reviewCount": 47,
    "images": [
      "https://i.pinimg.com/736x/44/4c/99/444c99e31b91c1ddefe3027051257e76.jpg",
      "https://pin.it/3HS6pkESA"
    ],
    "tags": [
      "pens",
      "markers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Two sophisticated grey markers for modern minimal layouts.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Markers",
      "Stock: 28 items available"
    ],
    "inStock": true,
    "stockCount": 28
  },
  {
    "id": "P022",
    "name": "Forest Green Fountain Ink",
    "shortName": "Forest Green Fountain Ink",
    "category": "pens",
    "subcategory": "Fountain Ink",
    "price": 249,
    "originalPrice": 329,
    "rating": 4.3,
    "reviewCount": 70,
    "images": [
      "https://i.pinimg.com/736x/f0/65/34/f06534601fd1bb5e115dadae556b3799.jpg",
      "https://pin.it/59lmiEuv6"
    ],
    "tags": [
      "pens",
      "fountain ink",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Rich forest-green ink for elegant handwritten notes.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Fountain Ink",
      "Stock: 22 items available"
    ],
    "inStock": true,
    "stockCount": 22
  },
  {
    "id": "P023",
    "name": "Creamy Latte Pen Set",
    "shortName": "Creamy Latte Pen Set",
    "category": "pens",
    "subcategory": "Gel Pens",
    "price": 329,
    "originalPrice": 429,
    "rating": 4.6,
    "reviewCount": 93,
    "images": [
      "https://i.pinimg.com/736x/c3/0a/74/c30a74ed13a2caa58b773caffb44056a.jpg",
      "https://pin.it/5h0l6rfnP"
    ],
    "tags": [
      "pens",
      "gel pens",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Neutral-toned gel pens inspired by warm café aesthetics.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Gel Pens",
      "Stock: 25 items available"
    ],
    "inStock": true,
    "stockCount": 25
  },
  {
    "id": "P024",
    "name": "Celestial Silver Pen",
    "shortName": "Celestial Silver Pen",
    "category": "pens",
    "subcategory": "Metal Pens",
    "price": 499,
    "originalPrice": 649,
    "rating": 4.9,
    "reviewCount": 31,
    "images": [
      "https://i.pinimg.com/736x/6f/ae/2f/6fae2f20537066775436fb6981ae717f.jpg",
      "https://pin.it/2FjuIeinr"
    ],
    "tags": [
      "pens",
      "metal pens",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Sleek silver pen with a polished celestial-inspired design.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Metal Pens",
      "Stock: 15 items available"
    ],
    "inStock": true,
    "stockCount": 15
  },
  {
    "id": "P025",
    "name": "Mini Journal Pen Kit",
    "shortName": "Mini Journal Pen Kit",
    "category": "pens",
    "subcategory": "Pen Sets",
    "price": 399,
    "originalPrice": 499,
    "rating": 4.5,
    "reviewCount": 54,
    "images": [
      "https://i.pinimg.com/736x/1e/54/27/1e54273bc27aae7af2e73de2490ef318.jpg",
      "https://pin.it/4VO7utDyJ"
    ],
    "tags": [
      "pens",
      "pen sets",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Compact collection of writing tools designed for planners and journals.",
    "details": [
      "Category: Pens & Ink",
      "Subcategory: Pen Sets",
      "Stock: 20 items available"
    ],
    "inStock": true,
    "stockCount": 20
  },
  {
    "id": "P026",
    "name": "Lavender Dreams Journal",
    "shortName": "Lavender Dreams Journal",
    "category": "journals",
    "subcategory": "Hardcover Journals",
    "price": 549,
    "originalPrice": 699,
    "rating": 4.8,
    "reviewCount": 77,
    "images": [
      "https://i.pinimg.com/736x/f6/c9/c3/f6c9c3e62c2b2d472cc2171e746c2fc3.jpg",
      "https://pin.it/4wnXEWblA"
    ],
    "tags": [
      "journals",
      "hardcover journals",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Hardcover journal with dreamy lavender tones and premium lined pages.",
    "details": [
      "Category: Journals",
      "Subcategory: Hardcover Journals",
      "Stock: 22 items available"
    ],
    "inStock": true,
    "stockCount": 22
  },
  {
    "id": "P027",
    "name": "Morning Pages Notebook",
    "shortName": "Morning Pages Notebook",
    "category": "journals",
    "subcategory": "Lined Journals",
    "price": 399,
    "originalPrice": 499,
    "rating": 4.4,
    "reviewCount": 15,
    "images": [
      "https://i.pinimg.com/736x/d4/9e/f8/d49ef8446ee90f287ba4797543bac49d.jpg",
      "https://pin.it/42UxV1F9D"
    ],
    "tags": [
      "journals",
      "lined journals",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Minimal lined notebook designed for morning reflections and daily writing.",
    "details": [
      "Category: Journals",
      "Subcategory: Lined Journals",
      "Stock: 34 items available"
    ],
    "inStock": true,
    "stockCount": 34
  },
  {
    "id": "P028",
    "name": "Vintage Garden Journal",
    "shortName": "Vintage Garden Journal",
    "category": "journals",
    "subcategory": "Decorative Journals",
    "price": 649,
    "originalPrice": 799,
    "rating": 4.7,
    "reviewCount": 38,
    "images": [
      "https://i.pinimg.com/736x/33/80/f5/3380f5d2ada1dc1c7231b9c8ecc23d27.jpg",
      "https://pin.it/4HRo76ZMV"
    ],
    "tags": [
      "journals",
      "decorative journals",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Botanical-inspired journal with a vintage garden cover design.",
    "details": [
      "Category: Journals",
      "Subcategory: Decorative Journals",
      "Stock: 17 items available"
    ],
    "inStock": true,
    "stockCount": 17
  },
  {
    "id": "P029",
    "name": "Midnight Moon Journal",
    "shortName": "Midnight Moon Journal",
    "category": "journals",
    "subcategory": "Hardcover Journals",
    "price": 599,
    "originalPrice": 749,
    "rating": 4.3,
    "reviewCount": 61,
    "images": [
      "https://i.pinimg.com/736x/5b/e7/fc/5be7fc4e7a6eb30df45147aaacdff0f2.jpg",
      "https://pin.it/2CbXtWyUQ"
    ],
    "tags": [
      "journals",
      "hardcover journals",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Deep-toned journal featuring a subtle moon-inspired cover.",
    "details": [
      "Category: Journals",
      "Subcategory: Hardcover Journals",
      "Stock: 14 items available"
    ],
    "inStock": true,
    "stockCount": 14
  },
  {
    "id": "P030",
    "name": "Little Things Journal",
    "shortName": "Little Things Journal",
    "category": "journals",
    "subcategory": "Pocket Journals",
    "price": 299,
    "originalPrice": 399,
    "rating": 4.6,
    "reviewCount": 84,
    "images": [
      "https://i.pinimg.com/736x/04/13/64/041364d35fcb48871770a3d69ac3bca4.jpg",
      "https://pin.it/1QyPVV40E"
    ],
    "tags": [
      "journals",
      "pocket journals",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Compact journal for capturing small memories and everyday thoughts.",
    "details": [
      "Category: Journals",
      "Subcategory: Pocket Journals",
      "Stock: 41 items available"
    ],
    "inStock": true,
    "stockCount": 41
  },
  {
    "id": "P031",
    "name": "Soft Bloom Notebook",
    "shortName": "Soft Bloom Notebook",
    "category": "journals",
    "subcategory": "Lined Journals",
    "price": 349,
    "originalPrice": 449,
    "rating": 4.9,
    "reviewCount": 22,
    "images": [
      "https://i.pinimg.com/736x/41/7f/a5/417fa5121f66e88950c799f31960f236.jpg",
      "https://pin.it/2nUFaZBlh"
    ],
    "tags": [
      "journals",
      "lined journals",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Floral notebook with soft pages and a calming pastel cover.",
    "details": [
      "Category: Journals",
      "Subcategory: Lined Journals",
      "Stock: 29 items available"
    ],
    "inStock": true,
    "stockCount": 29
  },
  {
    "id": "P032",
    "name": "Coffee & Notes Journal",
    "shortName": "Coffee & Notes Journal",
    "category": "journals",
    "subcategory": "Hardcover Journals",
    "price": 499,
    "originalPrice": 649,
    "rating": 4.5,
    "reviewCount": 45,
    "images": [
      "https://i.pinimg.com/736x/ce/35/50/ce3550ea96fe5a9d187391afb02c366b.jpg",
      "https://pin.it/7oX4QGxSg"
    ],
    "tags": [
      "journals",
      "hardcover journals",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Cozy café-inspired journal for notes, ideas and reflections.",
    "details": [
      "Category: Journals",
      "Subcategory: Hardcover Journals",
      "Stock: 24 items available"
    ],
    "inStock": true,
    "stockCount": 24
  },
  {
    "id": "P033",
    "name": "Minimal Grid Journal",
    "shortName": "Minimal Grid Journal",
    "category": "journals",
    "subcategory": "Grid Journals",
    "price": 449,
    "originalPrice": 549,
    "rating": 4.8,
    "reviewCount": 68,
    "images": [
      "https://i.pinimg.com/736x/47/ec/ee/47ecee8c4080422d3694c4ef1e2510c3.jpg",
      "https://pin.it/7leVY3SUe"
    ],
    "tags": [
      "journals",
      "grid journals",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Clean grid notebook suitable for planning, sketches and bullet journaling.",
    "details": [
      "Category: Journals",
      "Subcategory: Grid Journals",
      "Stock: 31 items available"
    ],
    "inStock": true,
    "stockCount": 31
  },
  {
    "id": "P034",
    "name": "Dreamscape Journal",
    "shortName": "Dreamscape Journal",
    "category": "journals",
    "subcategory": "Dream Journals",
    "price": 529,
    "originalPrice": 679,
    "rating": 4.4,
    "reviewCount": 91,
    "images": [
      "https://i.pinimg.com/736x/0b/04/d0/0b04d0115d50ef07f5b9f9fbc2fa62ea.jpg",
      "https://pin.it/7mczaslk8"
    ],
    "tags": [
      "journals",
      "dream journals",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Dream-themed journal created for recording nighttime thoughts and ideas.",
    "details": [
      "Category: Journals",
      "Subcategory: Dream Journals",
      "Stock: 18 items available"
    ],
    "inStock": true,
    "stockCount": 18
  },
  {
    "id": "P035",
    "name": "Poetry Pages Notebook",
    "shortName": "Poetry Pages Notebook",
    "category": "journals",
    "subcategory": "Creative Journals",
    "price": 399,
    "originalPrice": 499,
    "rating": 4.7,
    "reviewCount": 29,
    "images": [
      "https://i.pinimg.com/736x/64/49/9c/64499c82237acbc0d7ac780112fe0a6e.jpg",
      "https://pin.it/2r8lh8Gxg"
    ],
    "tags": [
      "journals",
      "creative journals",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Elegant notebook designed for poems, quotes and creative writing.",
    "details": [
      "Category: Journals",
      "Subcategory: Creative Journals",
      "Stock: 26 items available"
    ],
    "inStock": true,
    "stockCount": 26
  },
  {
    "id": "P036",
    "name": "Sakura Blossom Journal",
    "shortName": "Sakura Blossom Journal",
    "category": "journals",
    "subcategory": "Decorative Journals",
    "price": 579,
    "originalPrice": 729,
    "rating": 4.3,
    "reviewCount": 52,
    "images": [
      "https://i.pinimg.com/736x/e2/f7/87/e2f7873c7934b8b1f4618603c8dd9189.jpg",
      "https://pin.it/5CwIkzfn0"
    ],
    "tags": [
      "journals",
      "decorative journals",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Japanese-inspired journal featuring delicate cherry blossom artwork.",
    "details": [
      "Category: Journals",
      "Subcategory: Decorative Journals",
      "Stock: 15 items available"
    ],
    "inStock": true,
    "stockCount": 15
  },
  {
    "id": "P037",
    "name": "Forest Notes Journal",
    "shortName": "Forest Notes Journal",
    "category": "journals",
    "subcategory": "Nature Journals",
    "price": 449,
    "originalPrice": 599,
    "rating": 4.6,
    "reviewCount": 75,
    "images": [
      "https://i.pinimg.com/736x/17/af/38/17af38acbb3aab494b551a9b4f933d6b.jpg",
      "https://pin.it/64AXA6kXJ"
    ],
    "tags": [
      "journals",
      "nature journals",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": true,
    "description": "Nature-themed notebook with earthy colors and spacious writing pages.",
    "details": [
      "Category: Journals",
      "Subcategory: Nature Journals",
      "Stock: 23 items available"
    ],
    "inStock": true,
    "stockCount": 23
  },
  {
    "id": "P038",
    "name": "Velvet Plum Journal",
    "shortName": "Velvet Plum Journal",
    "category": "journals",
    "subcategory": "Hardcover Journals",
    "price": 699,
    "originalPrice": 899,
    "rating": 4.9,
    "reviewCount": 13,
    "images": [
      "https://i.pinimg.com/736x/a6/5e/1d/a65e1d76d8490253fda81180a28a24dc.jpg",
      "https://pin.it/4KW5sm0JO"
    ],
    "tags": [
      "journals",
      "hardcover journals",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Premium plum-colored journal with a soft-touch hardcover.",
    "details": [
      "Category: Journals",
      "Subcategory: Hardcover Journals",
      "Stock: 11 items available"
    ],
    "inStock": true,
    "stockCount": 11
  },
  {
    "id": "P039",
    "name": "Daily Thoughts Notebook",
    "shortName": "Daily Thoughts Notebook",
    "category": "journals",
    "subcategory": "Daily Journals",
    "price": 329,
    "originalPrice": 429,
    "rating": 4.5,
    "reviewCount": 36,
    "images": [
      "https://i.pinimg.com/736x/58/9b/6a/589b6a7a2db919bc2b20eef3da1b189b.jpg",
      "https://pin.it/2Mvx7XMlC"
    ],
    "tags": [
      "journals",
      "daily journals",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Simple daily notebook for thoughts, observations and quick notes.",
    "details": [
      "Category: Journals",
      "Subcategory: Daily Journals",
      "Stock: 38 items available"
    ],
    "inStock": true,
    "stockCount": 38
  },
  {
    "id": "P040",
    "name": "Pressed Flower Journal",
    "shortName": "Pressed Flower Journal",
    "category": "journals",
    "subcategory": "Decorative Journals",
    "price": 629,
    "originalPrice": 799,
    "rating": 4.8,
    "reviewCount": 59,
    "images": [
      "https://i.pinimg.com/736x/1a/77/56/1a77560954b3a2da1e5ee9f2e5adc93f.jpg",
      "https://pin.it/2xabMA1SB"
    ],
    "tags": [
      "journals",
      "decorative journals",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Elegant journal inspired by pressed flowers and vintage stationery.",
    "details": [
      "Category: Journals",
      "Subcategory: Decorative Journals",
      "Stock: 13 items available"
    ],
    "inStock": true,
    "stockCount": 13
  },
  {
    "id": "P041",
    "name": "Calm Mind Journal",
    "shortName": "Calm Mind Journal",
    "category": "journals",
    "subcategory": "Wellness Journals",
    "price": 499,
    "originalPrice": 649,
    "rating": 4.4,
    "reviewCount": 82,
    "images": [
      "https://i.pinimg.com/736x/d3/a5/a4/d3a5a49a1184c269a8e69687ec665be7.jpg",
      "https://pin.it/WCdU6GYM1"
    ],
    "tags": [
      "journals",
      "wellness journals",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Guided journal designed for reflections, gratitude and mindful writing.",
    "details": [
      "Category: Journals",
      "Subcategory: Wellness Journals",
      "Stock: 20 items available"
    ],
    "inStock": true,
    "stockCount": 20
  },
  {
    "id": "P042",
    "name": "Traveler's Pocket Journal",
    "shortName": "Traveler's Pocket Journal",
    "category": "journals",
    "subcategory": "Travel Journals",
    "price": 379,
    "originalPrice": 479,
    "rating": 4.7,
    "reviewCount": 20,
    "images": [
      "https://i.pinimg.com/736x/64/a1/45/64a14579679bdec0f4d05b8d8b0e0513.jpg",
      "https://pin.it/47IM9nYKB"
    ],
    "tags": [
      "journals",
      "travel journals",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Compact travel notebook for itineraries, memories and destination notes.",
    "details": [
      "Category: Journals",
      "Subcategory: Travel Journals",
      "Stock: 27 items available"
    ],
    "inStock": true,
    "stockCount": 27
  },
  {
    "id": "P043",
    "name": "Artist's Blank Journal",
    "shortName": "Artist's Blank Journal",
    "category": "journals",
    "subcategory": "Blank Journals",
    "price": 429,
    "originalPrice": 549,
    "rating": 4.3,
    "reviewCount": 43,
    "images": [
      "https://i.pinimg.com/736x/75/6f/5e/756f5e84748a70266b4d3fdb74df2fff.jpg",
      "https://pin.it/5DEHnauz0"
    ],
    "tags": [
      "journals",
      "blank journals",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Blank-page journal suitable for sketches, ideas and creative experiments.",
    "details": [
      "Category: Journals",
      "Subcategory: Blank Journals",
      "Stock: 19 items available"
    ],
    "inStock": true,
    "stockCount": 19
  },
  {
    "id": "P044",
    "name": "Lavender Linen Notebook",
    "shortName": "Lavender Linen Notebook",
    "category": "journals",
    "subcategory": "Linen Journals",
    "price": 599,
    "originalPrice": 749,
    "rating": 4.6,
    "reviewCount": 66,
    "images": [
      "https://i.pinimg.com/736x/d6/e6/fb/d6e6fb818624abeaa8903b78bbf94342.jpg",
      "https://pin.it/2Uy8voR7p"
    ],
    "tags": [
      "journals",
      "linen journals",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Linen-textured notebook with a refined lavender cover.",
    "details": [
      "Category: Journals",
      "Subcategory: Linen Journals",
      "Stock: 16 items available"
    ],
    "inStock": true,
    "stockCount": 16
  },
  {
    "id": "P045",
    "name": "Secret Garden Diary",
    "shortName": "Secret Garden Diary",
    "category": "journals",
    "subcategory": "Diaries",
    "price": 549,
    "originalPrice": 699,
    "rating": 4.9,
    "reviewCount": 89,
    "images": [
      "https://i.pinimg.com/736x/1d/99/a3/1d99a37837497b553ee9aab55e168aac.jpg",
      "https://pin.it/12pyod07U"
    ],
    "tags": [
      "journals",
      "diaries",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Charming diary inspired by hidden gardens and vintage illustrations.",
    "details": [
      "Category: Journals",
      "Subcategory: Diaries",
      "Stock: 21 items available"
    ],
    "inStock": true,
    "stockCount": 21
  },
  {
    "id": "P046",
    "name": "Tiny Memories Journal",
    "shortName": "Tiny Memories Journal",
    "category": "journals",
    "subcategory": "Pocket Journals",
    "price": 279,
    "originalPrice": 359,
    "rating": 4.5,
    "reviewCount": 27,
    "images": [
      "https://i.pinimg.com/736x/52/17/f6/5217f6b8eec96efd7541b860416501b8.jpg",
      "https://pin.it/3I3oC9Z1D"
    ],
    "tags": [
      "journals",
      "pocket journals",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Small keepsake journal for short memories, quotes and daily moments.",
    "details": [
      "Category: Journals",
      "Subcategory: Pocket Journals",
      "Stock: 35 items available"
    ],
    "inStock": true,
    "stockCount": 35
  },
  {
    "id": "P047",
    "name": "Cloud Paper Journal",
    "shortName": "Cloud Paper Journal",
    "category": "journals",
    "subcategory": "Softcover Journals",
    "price": 399,
    "originalPrice": 499,
    "rating": 4.8,
    "reviewCount": 50,
    "images": [
      "https://i.pinimg.com/736x/47/b5/9f/47b59f1a0335aae7da7d850961fdd86b.jpg",
      "https://pin.it/3I6PHSdYD"
    ],
    "tags": [
      "journals",
      "softcover journals",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Lightweight softcover notebook with smooth cream-colored pages.",
    "details": [
      "Category: Journals",
      "Subcategory: Softcover Journals",
      "Stock: 30 items available"
    ],
    "inStock": true,
    "stockCount": 30
  },
  {
    "id": "P048",
    "name": "Lavender Weekly Planner",
    "shortName": "Lavender Weekly Planner",
    "category": "planners",
    "subcategory": "Weekly Planners",
    "price": 499,
    "originalPrice": 649,
    "rating": 4.4,
    "reviewCount": 73,
    "images": [
      "https://i.pinimg.com/736x/ca/62/fa/ca62faf946122e9c98f76ac7a1255bb2.jpg",
      "https://pin.it/5bNOfo88x"
    ],
    "tags": [
      "planners",
      "weekly planners",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Undated weekly planner with a soft lavender aesthetic and spacious layout.",
    "details": [
      "Category: Planners",
      "Subcategory: Weekly Planners",
      "Stock: 26 items available"
    ],
    "inStock": true,
    "stockCount": 26
  },
  {
    "id": "P049",
    "name": "Productivity Planner",
    "shortName": "Productivity Planner",
    "category": "planners",
    "subcategory": "Productivity Planners",
    "price": 599,
    "originalPrice": 749,
    "rating": 4.7,
    "reviewCount": 96,
    "images": [
      "https://i.pinimg.com/736x/27/fe/9e/27fe9e2082b59c6441a95d52494b9173.jpg",
      "https://pin.it/5DPPwvZes"
    ],
    "tags": [
      "planners",
      "productivity planners",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Structured planner for organizing priorities, tasks and weekly goals.",
    "details": [
      "Category: Planners",
      "Subcategory: Productivity Planners",
      "Stock: 19 items available"
    ],
    "inStock": true,
    "stockCount": 19
  },
  {
    "id": "P050",
    "name": "Aesthetic Daily Planner",
    "shortName": "Aesthetic Daily Planner",
    "category": "planners",
    "subcategory": "Daily Planners",
    "price": 449,
    "originalPrice": 599,
    "rating": 4.3,
    "reviewCount": 34,
    "images": [
      "https://i.pinimg.com/736x/64/b3/1b/64b31b88e47cfa4314bb741452c803ee.jpg",
      "https://pin.it/F1S2y0fNI"
    ],
    "tags": [
      "planners",
      "daily planners",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Minimal daily planner designed for clean and organized schedules.",
    "details": [
      "Category: Planners",
      "Subcategory: Daily Planners",
      "Stock: 28 items available"
    ],
    "inStock": true,
    "stockCount": 28
  },
  {
    "id": "P051",
    "name": "Student Study Planner",
    "shortName": "Student Study Planner",
    "category": "planners",
    "subcategory": "Student Planners",
    "price": 399,
    "originalPrice": 499,
    "rating": 4.6,
    "reviewCount": 57,
    "images": [
      "https://i.pinimg.com/736x/0b/e1/b1/0be1b1fcad8acd0b26224d79f8200046.jpg",
      "https://pin.it/6JIHR3vok"
    ],
    "tags": [
      "planners",
      "student planners",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Student-friendly planner for classes, assignments, exams and study sessions.",
    "details": [
      "Category: Planners",
      "Subcategory: Student Planners",
      "Stock: 37 items available"
    ],
    "inStock": true,
    "stockCount": 37
  },
  {
    "id": "P052",
    "name": "Dream Goals Planner",
    "shortName": "Dream Goals Planner",
    "category": "planners",
    "subcategory": "Goal Planners",
    "price": 549,
    "originalPrice": 699,
    "rating": 4.9,
    "reviewCount": 80,
    "images": [
      "https://i.pinimg.com/736x/c8/3a/12/c83a12a1a57ca986bc331dd4eeae48b8.jpg",
      "https://pin.it/2yvOeMtQe"
    ],
    "tags": [
      "planners",
      "goal planners",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Goal-setting planner with sections for milestones and action steps.",
    "details": [
      "Category: Planners",
      "Subcategory: Goal Planners",
      "Stock: 18 items available"
    ],
    "inStock": true,
    "stockCount": 18
  },
  {
    "id": "P053",
    "name": "Purple Academic Planner",
    "shortName": "Purple Academic Planner",
    "category": "planners",
    "subcategory": "Academic Planners",
    "price": 649,
    "originalPrice": 799,
    "rating": 4.5,
    "reviewCount": 18,
    "images": [
      "https://i.pinimg.com/736x/2b/87/a1/2b87a1a80fd1482f81f839b7941ddc0d.jpg",
      "https://pin.it/6JnfAVrQe"
    ],
    "tags": [
      "planners",
      "academic planners",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Academic planner designed around semesters, deadlines and study goals.",
    "details": [
      "Category: Planners",
      "Subcategory: Academic Planners",
      "Stock: 23 items available"
    ],
    "inStock": true,
    "stockCount": 23
  },
  {
    "id": "P054",
    "name": "Monthly Reset Planner",
    "shortName": "Monthly Reset Planner",
    "category": "planners",
    "subcategory": "Monthly Planners",
    "price": 429,
    "originalPrice": 549,
    "rating": 4.8,
    "reviewCount": 41,
    "images": [
      "https://i.pinimg.com/736x/d6/e2/98/d6e29831cd62db49f49c5cc0ace72b26.jpg",
      "https://pin.it/4AE96Wz8I"
    ],
    "tags": [
      "planners",
      "monthly planners",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Monthly planner for routines, priorities, goals and personal resets.",
    "details": [
      "Category: Planners",
      "Subcategory: Monthly Planners",
      "Stock: 31 items available"
    ],
    "inStock": true,
    "stockCount": 31
  },
  {
    "id": "P055",
    "name": "Self-Care Planner",
    "shortName": "Self-Care Planner",
    "category": "planners",
    "subcategory": "Wellness Planners",
    "price": 499,
    "originalPrice": 649,
    "rating": 4.4,
    "reviewCount": 64,
    "images": [
      "https://i.pinimg.com/736x/14/ed/09/14ed09630b70043191e0c5a8a86bf26c.jpg",
      "https://pin.it/15L839R7A"
    ],
    "tags": [
      "planners",
      "wellness planners",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Gentle planning system for habits, routines and personal wellbeing.",
    "details": [
      "Category: Planners",
      "Subcategory: Wellness Planners",
      "Stock: 20 items available"
    ],
    "inStock": true,
    "stockCount": 20
  },
  {
    "id": "P056",
    "name": "Undated Life Planner",
    "shortName": "Undated Life Planner",
    "category": "planners",
    "subcategory": "Life Planners",
    "price": 699,
    "originalPrice": 899,
    "rating": 4.7,
    "reviewCount": 87,
    "images": [
      "https://i.pinimg.com/736x/b0/b1/7a/b0b17ad24eafa7ad6e00b1a98c4e590e.jpg",
      "https://pin.it/6W1VjxIdm"
    ],
    "tags": [
      "planners",
      "life planners",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Flexible undated planner for organizing personal and professional life.",
    "details": [
      "Category: Planners",
      "Subcategory: Life Planners",
      "Stock: 12 items available"
    ],
    "inStock": true,
    "stockCount": 12
  },
  {
    "id": "P057",
    "name": "Content Creator Planner",
    "shortName": "Content Creator Planner",
    "category": "planners",
    "subcategory": "Creative Planners",
    "price": 579,
    "originalPrice": 729,
    "rating": 4.3,
    "reviewCount": 25,
    "images": [
      "https://i.pinimg.com/736x/9f/dd/ca/9fddcabc637525c858a9ff268c896ec9.jpg",
      "https://pin.it/VD88E0cWN"
    ],
    "tags": [
      "planners",
      "creative planners",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Planner for content ideas, posting schedules and creative projects.",
    "details": [
      "Category: Planners",
      "Subcategory: Creative Planners",
      "Stock: 16 items available"
    ],
    "inStock": true,
    "stockCount": 16
  },
  {
    "id": "P058",
    "name": "Budget & Savings Planner",
    "shortName": "Budget & Savings Planner",
    "category": "planners",
    "subcategory": "Finance Planners",
    "price": 449,
    "originalPrice": 579,
    "rating": 4.6,
    "reviewCount": 48,
    "images": [
      "https://i.pinimg.com/736x/74/96/09/749609d801fda935c1c2458228d32296.jpg",
      "https://pin.it/6lxlJCj3E"
    ],
    "tags": [
      "planners",
      "finance planners",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Simple planner for tracking budgets, expenses and savings goals.",
    "details": [
      "Category: Planners",
      "Subcategory: Finance Planners",
      "Stock: 29 items available"
    ],
    "inStock": true,
    "stockCount": 29
  },
  {
    "id": "P059",
    "name": "Minimal Desk Planner",
    "shortName": "Minimal Desk Planner",
    "category": "planners",
    "subcategory": "Desk Planners",
    "price": 379,
    "originalPrice": 479,
    "rating": 4.9,
    "reviewCount": 71,
    "images": [
      "https://i.pinimg.com/736x/0d/b9/b6/0db9b6ea83a405636dc03e9932c1e3e7.jpg",
      "https://pin.it/5jgXu1zke"
    ],
    "tags": [
      "planners",
      "desk planners",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Compact desk planner with clean layouts for everyday tasks.",
    "details": [
      "Category: Planners",
      "Subcategory: Desk Planners",
      "Stock: 34 items available"
    ],
    "inStock": true,
    "stockCount": 34
  },
  {
    "id": "P060",
    "name": "Habit Tracker Planner",
    "shortName": "Habit Tracker Planner",
    "category": "planners",
    "subcategory": "Habit Planners",
    "price": 399,
    "originalPrice": 499,
    "rating": 4.5,
    "reviewCount": 94,
    "images": [
      "https://i.pinimg.com/736x/14/00/73/1400734ffee4108a0866ac7a69f83d70.jpg",
      "https://pin.it/6UAgRZ3cz"
    ],
    "tags": [
      "planners",
      "habit planners",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Habit-focused planner with monthly and weekly tracking sections.",
    "details": [
      "Category: Planners",
      "Subcategory: Habit Planners",
      "Stock: 33 items available"
    ],
    "inStock": true,
    "stockCount": 33
  },
  {
    "id": "P061",
    "name": "Exam Countdown Planner",
    "shortName": "Exam Countdown Planner",
    "category": "planners",
    "subcategory": "Student Planners",
    "price": 349,
    "originalPrice": 449,
    "rating": 4.8,
    "reviewCount": 32,
    "images": [
      "https://i.pinimg.com/1200x/26/1d/d4/261dd476873c09ac4b97998535637ceb.jpg"
    ],
    "tags": [
      "planners",
      "student planners",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Study planner designed to organize revision and countdown to exams.",
    "details": [
      "Category: Planners",
      "Subcategory: Student Planners",
      "Stock: 25 items available"
    ],
    "inStock": true,
    "stockCount": 25
  },
  {
    "id": "P062",
    "name": "Cozy Sunday Planner",
    "shortName": "Cozy Sunday Planner",
    "category": "planners",
    "subcategory": "Weekly Planners",
    "price": 429,
    "originalPrice": 549,
    "rating": 4.4,
    "reviewCount": 55,
    "images": [
      "https://i.pinimg.com/736x/73/e8/3b/73e83b4c07fb16a89b75789b51c483e2.jpg"
    ],
    "tags": [
      "planners",
      "weekly planners",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Relaxed weekly planner inspired by cozy Sunday routines.",
    "details": [
      "Category: Planners",
      "Subcategory: Weekly Planners",
      "Stock: 22 items available"
    ],
    "inStock": true,
    "stockCount": 22
  },
  {
    "id": "P063",
    "name": "Project Planning Pad",
    "shortName": "Project Planning Pad",
    "category": "planners",
    "subcategory": "Project Planners",
    "price": 299,
    "originalPrice": 399,
    "rating": 4.7,
    "reviewCount": 78,
    "images": [
      "https://i.pinimg.com/736x/29/91/9d/29919dd533fc74f24f77d7daedc4ca89.jpg"
    ],
    "tags": [
      "planners",
      "project planners",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Tear-off planning pad for breaking projects into manageable tasks.",
    "details": [
      "Category: Planners",
      "Subcategory: Project Planners",
      "Stock: 40 items available"
    ],
    "inStock": true,
    "stockCount": 40
  },
  {
    "id": "P064",
    "name": "Meal & Grocery Planner",
    "shortName": "Meal & Grocery Planner",
    "category": "planners",
    "subcategory": "Meal Planners",
    "price": 329,
    "originalPrice": 429,
    "rating": 4.3,
    "reviewCount": 16,
    "images": [
      "https://i.pinimg.com/736x/4d/27/0e/4d270e51efb7f3e1a1f6d1b0402ad5fa.jpg",
      "https://pin.it/6zU0Ofjg5"
    ],
    "tags": [
      "planners",
      "meal planners",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Weekly meal planner with grocery-list sections and meal notes.",
    "details": [
      "Category: Planners",
      "Subcategory: Meal Planners",
      "Stock: 36 items available"
    ],
    "inStock": true,
    "stockCount": 36
  },
  {
    "id": "P065",
    "name": "Finance Dashboard Planner",
    "shortName": "Finance Dashboard Planner",
    "category": "planners",
    "subcategory": "Finance Planners",
    "price": 529,
    "originalPrice": 679,
    "rating": 4.6,
    "reviewCount": 39,
    "images": [
      "https://i.pinimg.com/1200x/74/96/09/749609d801fda935c1c2458228d32296.jpg"
    ],
    "tags": [
      "planners",
      "finance planners",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Organized planner for monthly income, expenses and financial goals.",
    "details": [
      "Category: Planners",
      "Subcategory: Finance Planners",
      "Stock: 17 items available"
    ],
    "inStock": true,
    "stockCount": 17
  },
  {
    "id": "P066",
    "name": "Creative Week Planner",
    "shortName": "Creative Week Planner",
    "category": "planners",
    "subcategory": "Creative Planners",
    "price": 399,
    "originalPrice": 499,
    "rating": 4.9,
    "reviewCount": 62,
    "images": [
      "https://i.pinimg.com/736x/f3/23/c4/f323c4421052685deeaed3fdc0ba4ff0.jpg"
    ],
    "tags": [
      "planners",
      "creative planners",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Colorful weekly planner designed for creative schedules and ideas.",
    "details": [
      "Category: Planners",
      "Subcategory: Creative Planners",
      "Stock: 28 items available"
    ],
    "inStock": true,
    "stockCount": 28
  },
  {
    "id": "P067",
    "name": "Yearly Vision Planner",
    "shortName": "Yearly Vision Planner",
    "category": "planners",
    "subcategory": "Goal Planners",
    "price": 699,
    "originalPrice": 899,
    "rating": 4.5,
    "reviewCount": 85,
    "images": [
      "https://i.pinimg.com/736x/d6/51/b2/d651b2d67a94138f36e4c58ab6beca2a.jpg"
    ],
    "tags": [
      "planners",
      "goal planners",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": true,
    "description": "Vision-focused planner for yearly goals, milestones and reflections.",
    "details": [
      "Category: Planners",
      "Subcategory: Goal Planners",
      "Stock: 14 items available"
    ],
    "inStock": true,
    "stockCount": 14
  },
  {
    "id": "P068",
    "name": "Lavender Sky Washi Set",
    "shortName": "Lavender Sky Washi Set",
    "category": "washi",
    "subcategory": "Pastel Washi",
    "price": 299,
    "originalPrice": 399,
    "rating": 4.8,
    "reviewCount": 23,
    "images": [
      "https://i.pinimg.com/736x/e6/c9/d7/e6c9d7a0406783764a0433325ae36f0c.jpg"
    ],
    "tags": [
      "washi",
      "pastel washi",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Six pastel tapes inspired by lavender skies and soft clouds.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Pastel Washi",
      "Stock: 42 items available"
    ],
    "inStock": true,
    "stockCount": 42
  },
  {
    "id": "P069",
    "name": "Botanical Garden Washi",
    "shortName": "Botanical Garden Washi",
    "category": "washi",
    "subcategory": "Floral Washi",
    "price": 199,
    "originalPrice": 279,
    "rating": 4.4,
    "reviewCount": 46,
    "images": [
      "https://i.pinimg.com/1200x/5e/37/45/5e37450ae2b07c742b4af9536ef96d01.jpg"
    ],
    "tags": [
      "washi",
      "floral washi",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Botanical-print tape featuring delicate leaves and tiny flowers.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Floral Washi",
      "Stock: 37 items available"
    ],
    "inStock": true,
    "stockCount": 37
  },
  {
    "id": "P070",
    "name": "Vintage Postcard Washi",
    "shortName": "Vintage Postcard Washi",
    "category": "washi",
    "subcategory": "Vintage Washi",
    "price": 249,
    "originalPrice": 329,
    "rating": 4.7,
    "reviewCount": 69,
    "images": [
      "https://i.pinimg.com/736x/3b/b8/a8/3bb8a88649fca9b4f293946195bb3413.jpg"
    ],
    "tags": [
      "washi",
      "vintage washi",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Decorative tape inspired by old postcards and handwritten letters.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Vintage Washi",
      "Stock: 29 items available"
    ],
    "inStock": true,
    "stockCount": 29
  },
  {
    "id": "P071",
    "name": "Midnight Stars Washi",
    "shortName": "Midnight Stars Washi",
    "category": "washi",
    "subcategory": "Celestial Washi",
    "price": 229,
    "originalPrice": 299,
    "rating": 4.3,
    "reviewCount": 92,
    "images": [
      "https://i.pinimg.com/1200x/19/bd/a0/19bda061392a0411dc3e85cfbaf7f98e.jpg"
    ],
    "tags": [
      "washi",
      "celestial washi",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Dark aesthetic tape decorated with tiny stars and moons.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Celestial Washi",
      "Stock: 34 items available"
    ],
    "inStock": true,
    "stockCount": 34
  },
  {
    "id": "P072",
    "name": "Coffee Shop Washi Trio",
    "shortName": "Coffee Shop Washi Trio",
    "category": "washi",
    "subcategory": "Food Washi",
    "price": 249,
    "originalPrice": 329,
    "rating": 4.6,
    "reviewCount": 30,
    "images": [
      "https://i.pinimg.com/1200x/f1/bf/ee/f1bfeea148afadf1d7c85e32f20cc9e5.jpg"
    ],
    "tags": [
      "washi",
      "food washi",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Three café-themed tapes featuring coffee cups and cozy illustrations.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Food Washi",
      "Stock: 31 items available"
    ],
    "inStock": true,
    "stockCount": 31
  },
  {
    "id": "P073",
    "name": "Daisy Field Washi",
    "shortName": "Daisy Field Washi",
    "category": "washi",
    "subcategory": "Floral Washi",
    "price": 189,
    "originalPrice": 249,
    "rating": 4.9,
    "reviewCount": 53,
    "images": [
      "https://i.pinimg.com/1200x/39/da/a8/39daa865038fd5c967f31af6ed4e36bd.jpg"
    ],
    "tags": [
      "washi",
      "floral washi",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Cheerful floral tape covered with tiny daisy illustrations.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Floral Washi",
      "Stock: 45 items available"
    ],
    "inStock": true,
    "stockCount": 45
  },
  {
    "id": "P074",
    "name": "Purple Gradient Washi",
    "shortName": "Purple Gradient Washi",
    "category": "washi",
    "subcategory": "Gradient Washi",
    "price": 179,
    "originalPrice": 249,
    "rating": 4.5,
    "reviewCount": 76,
    "images": [
      "https://i.pinimg.com/1200x/c3/2e/23/c32e231794350dc5f5ac2e12fcb2c09c.jpg"
    ],
    "tags": [
      "washi",
      "gradient washi",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Smooth purple gradient tape for borders, layouts and journaling.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Gradient Washi",
      "Stock: 39 items available"
    ],
    "inStock": true,
    "stockCount": 39
  },
  {
    "id": "P075",
    "name": "Moon Phase Washi Set",
    "shortName": "Moon Phase Washi Set",
    "category": "washi",
    "subcategory": "Celestial Washi",
    "price": 279,
    "originalPrice": 379,
    "rating": 4.8,
    "reviewCount": 14,
    "images": [
      "https://i.pinimg.com/1200x/69/7f/22/697f2236d9317e45688184a41bbd331a.jpg"
    ],
    "tags": [
      "washi",
      "celestial washi",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Four tapes featuring elegant moon phases and celestial details.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Celestial Washi",
      "Stock: 24 items available"
    ],
    "inStock": true,
    "stockCount": 24
  },
  {
    "id": "P076",
    "name": "Cottagecore Washi Collection",
    "shortName": "Cottagecore Washi Collection",
    "category": "washi",
    "subcategory": "Cottagecore Washi",
    "price": 329,
    "originalPrice": 429,
    "rating": 4.4,
    "reviewCount": 37,
    "images": [
      "https://i.pinimg.com/1200x/fe/e4/10/fee4102126ce5a7f55edb4ee49db71af.jpg"
    ],
    "tags": [
      "washi",
      "cottagecore washi",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Soft tapes inspired by flowers, cottages and countryside aesthetics.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Cottagecore Washi",
      "Stock: 18 items available"
    ],
    "inStock": true,
    "stockCount": 18
  },
  {
    "id": "P077",
    "name": "Minimal Line Washi",
    "shortName": "Minimal Line Washi",
    "category": "washi",
    "subcategory": "Minimal Washi",
    "price": 169,
    "originalPrice": 229,
    "rating": 4.7,
    "reviewCount": 60,
    "images": [
      "https://i.pinimg.com/1200x/41/85/a1/4185a14d19d508a308c8bf5f0265bc90.jpg"
    ],
    "tags": [
      "washi",
      "minimal washi",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Simple monochrome line-patterned tape for clean layouts.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Minimal Washi",
      "Stock: 46 items available"
    ],
    "inStock": true,
    "stockCount": 46
  },
  {
    "id": "P078",
    "name": "Berry Picnic Washi",
    "shortName": "Berry Picnic Washi",
    "category": "washi",
    "subcategory": "Food Washi",
    "price": 219,
    "originalPrice": 299,
    "rating": 4.3,
    "reviewCount": 83,
    "images": [
      "https://i.pinimg.com/1200x/5b/10/28/5b1028ea7b4db35243747d9bc0d3d85b.jpg"
    ],
    "tags": [
      "washi",
      "food washi",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Playful berry-themed tape with a charming picnic aesthetic.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Food Washi",
      "Stock: 33 items available"
    ],
    "inStock": true,
    "stockCount": 33
  },
  {
    "id": "P079",
    "name": "Purple Checkered Washi",
    "shortName": "Purple Checkered Washi",
    "category": "washi",
    "subcategory": "Pattern Washi",
    "price": 179,
    "originalPrice": 249,
    "rating": 4.6,
    "reviewCount": 21,
    "images": [
      "https://i.pinimg.com/1200x/34/c7/73/34c773ad512f0c28b3eba6487ad66977.jpg"
    ],
    "tags": [
      "washi",
      "pattern washi",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Classic purple checkered tape for stylish borders and accents.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Pattern Washi",
      "Stock: 40 items available"
    ],
    "inStock": true,
    "stockCount": 40
  },
  {
    "id": "P080",
    "name": "Pressed Flower Washi",
    "shortName": "Pressed Flower Washi",
    "category": "washi",
    "subcategory": "Floral Washi",
    "price": 249,
    "originalPrice": 329,
    "rating": 4.9,
    "reviewCount": 44,
    "images": [
      "https://i.pinimg.com/736x/7e/bc/67/7ebc676a7b153ef5885c35531b07bb28.jpg"
    ],
    "tags": [
      "washi",
      "floral washi",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Transparent-style tape featuring delicate pressed-flower illustrations.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Floral Washi",
      "Stock: 27 items available"
    ],
    "inStock": true,
    "stockCount": 27
  },
  {
    "id": "P081",
    "name": "Dreamy Cloud Washi",
    "shortName": "Dreamy Cloud Washi",
    "category": "washi",
    "subcategory": "Pastel Washi",
    "price": 199,
    "originalPrice": 279,
    "rating": 4.5,
    "reviewCount": 67,
    "images": [
      "https://i.pinimg.com/1200x/f9/b3/2a/f9b32a9e48e4964c70720ea7a16bb6f3.jpg"
    ],
    "tags": [
      "washi",
      "pastel washi",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Soft blue and lavender tape decorated with fluffy clouds.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Pastel Washi",
      "Stock: 36 items available"
    ],
    "inStock": true,
    "stockCount": 36
  },
  {
    "id": "P082",
    "name": "Antique Label Washi",
    "shortName": "Antique Label Washi",
    "category": "washi",
    "subcategory": "Vintage Washi",
    "price": 269,
    "originalPrice": 349,
    "rating": 4.8,
    "reviewCount": 90,
    "images": [
      "https://i.pinimg.com/1200x/0d/64/78/0d6478d1c9ea56cc6e0f190824fd388d.jpg"
    ],
    "tags": [
      "washi",
      "vintage washi",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Vintage label-inspired tape for journals and scrapbook pages.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Vintage Washi",
      "Stock: 22 items available"
    ],
    "inStock": true,
    "stockCount": 22
  },
  {
    "id": "P083",
    "name": "Lavender Ribbon Washi",
    "shortName": "Lavender Ribbon Washi",
    "category": "washi",
    "subcategory": "Decorative Washi",
    "price": 189,
    "originalPrice": 259,
    "rating": 4.4,
    "reviewCount": 28,
    "images": [
      "https://i.pinimg.com/736x/b4/53/aa/b453aaa2ef7c3ca8a232b0595347928c.jpg"
    ],
    "tags": [
      "washi",
      "decorative washi",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Elegant ribbon-patterned tape with a soft lavender finish.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Decorative Washi",
      "Stock: 43 items available"
    ],
    "inStock": true,
    "stockCount": 43
  },
  {
    "id": "P084",
    "name": "Forest Walk Washi",
    "shortName": "Forest Walk Washi",
    "category": "washi",
    "subcategory": "Nature Washi",
    "price": 229,
    "originalPrice": 299,
    "rating": 4.7,
    "reviewCount": 51,
    "images": [
      "https://i.pinimg.com/1200x/ff/5b/1e/ff5b1e2bf9a6f5b2c2aab41df4382009.jpg"
    ],
    "tags": [
      "washi",
      "nature washi",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Earthy tape inspired by leaves, trees and peaceful forest walks.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Nature Washi",
      "Stock: 30 items available"
    ],
    "inStock": true,
    "stockCount": 30
  },
  {
    "id": "P085",
    "name": "Starry Night Washi Trio",
    "shortName": "Starry Night Washi Trio",
    "category": "washi",
    "subcategory": "Celestial Washi",
    "price": 299,
    "originalPrice": 399,
    "rating": 4.3,
    "reviewCount": 74,
    "images": [
      "https://i.pinimg.com/736x/46/d8/76/46d8763ff53bdd0d84da8a8048fd37c8.jpg"
    ],
    "tags": [
      "washi",
      "celestial washi",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Three coordinated tapes inspired by a dreamy starry night.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Celestial Washi",
      "Stock: 21 items available"
    ],
    "inStock": true,
    "stockCount": 21
  },
  {
    "id": "P086",
    "name": "Soft Hearts Washi",
    "shortName": "Soft Hearts Washi",
    "category": "washi",
    "subcategory": "Pattern Washi",
    "price": 169,
    "originalPrice": 229,
    "rating": 4.6,
    "reviewCount": 12,
    "images": [
      "https://i.pinimg.com/1200x/4c/bc/e5/4cbce5316e0d98a2ceb92e5673571443.jpg"
    ],
    "tags": [
      "washi",
      "pattern washi",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Delicate heart-patterned tape for letters, planners and gifts.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Pattern Washi",
      "Stock: 48 items available"
    ],
    "inStock": true,
    "stockCount": 48
  },
  {
    "id": "P087",
    "name": "Lilac Botanical Washi",
    "shortName": "Lilac Botanical Washi",
    "category": "washi",
    "subcategory": "Floral Washi",
    "price": 239,
    "originalPrice": 319,
    "rating": 4.9,
    "reviewCount": 35,
    "images": [
      "https://i.pinimg.com/1200x/0f/81/0a/0f810ae2585edf5348a1486947447405.jpg"
    ],
    "tags": [
      "washi",
      "floral washi",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Lilac botanical tape featuring leaves and tiny floral accents.",
    "details": [
      "Category: Washi Tape",
      "Subcategory: Floral Washi",
      "Stock: 25 items available"
    ],
    "inStock": true,
    "stockCount": 25
  },
  {
    "id": "P088",
    "name": "Lavender Mood Sticker Sheet",
    "shortName": "Lavender Mood Sticker Sheet",
    "category": "stickers",
    "subcategory": "Aesthetic Stickers",
    "price": 199,
    "originalPrice": 299,
    "rating": 4.5,
    "reviewCount": 58,
    "images": [
      "https://i.pinimg.com/736x/13/a9/74/13a9746407831fdd98386a9920fe83d0.jpg"
    ],
    "tags": [
      "stickers",
      "aesthetic stickers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Illustrated sticker sheet featuring calming lavender-themed icons.",
    "details": [
      "Category: Stickers",
      "Subcategory: Aesthetic Stickers",
      "Stock: 51 items available"
    ],
    "inStock": true,
    "stockCount": 51
  },
  {
    "id": "P089",
    "name": "Cozy Café Sticker Pack",
    "shortName": "Cozy Café Sticker Pack",
    "category": "stickers",
    "subcategory": "Food Stickers",
    "price": 229,
    "originalPrice": 329,
    "rating": 4.8,
    "reviewCount": 81,
    "images": [
      "https://i.pinimg.com/736x/79/27/17/79271782301f9529fb6c2432b7254521.jpg"
    ],
    "tags": [
      "stickers",
      "food stickers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Cute coffee, pastry and café-themed decorative stickers.",
    "details": [
      "Category: Stickers",
      "Subcategory: Food Stickers",
      "Stock: 44 items available"
    ],
    "inStock": true,
    "stockCount": 44
  },
  {
    "id": "P090",
    "name": "Purple Flower Sticker Set",
    "shortName": "Purple Flower Sticker Set",
    "category": "stickers",
    "subcategory": "Floral Stickers",
    "price": 179,
    "originalPrice": 249,
    "rating": 4.4,
    "reviewCount": 19,
    "images": [
      "https://i.pinimg.com/736x/45/3c/e5/453ce5d9b81fbd77d2fb5ea542fbcc88.jpg"
    ],
    "tags": [
      "stickers",
      "floral stickers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Collection of delicate purple flowers for journals and planners.",
    "details": [
      "Category: Stickers",
      "Subcategory: Floral Stickers",
      "Stock: 58 items available"
    ],
    "inStock": true,
    "stockCount": 58
  },
  {
    "id": "P091",
    "name": "Study Buddy Stickers",
    "shortName": "Study Buddy Stickers",
    "category": "stickers",
    "subcategory": "Study Stickers",
    "price": 199,
    "originalPrice": 279,
    "rating": 4.7,
    "reviewCount": 42,
    "images": [
      "https://i.pinimg.com/736x/6c/0b/a7/6c0ba7b9dbdd67645a96382ef01aeb98.jpg"
    ],
    "tags": [
      "stickers",
      "study stickers",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Fun study-themed stickers featuring books, pens and productivity icons.",
    "details": [
      "Category: Stickers",
      "Subcategory: Study Stickers",
      "Stock: 47 items available"
    ],
    "inStock": true,
    "stockCount": 47
  },
  {
    "id": "P092",
    "name": "Moon & Stars Sticker Sheet",
    "shortName": "Moon & Stars Sticker Sheet",
    "category": "stickers",
    "subcategory": "Celestial Stickers",
    "price": 189,
    "originalPrice": 259,
    "rating": 4.3,
    "reviewCount": 65,
    "images": [
      "https://i.pinimg.com/736x/43/8b/0e/438b0eb587b05eeda82cb3477452112f.jpg"
    ],
    "tags": [
      "stickers",
      "celestial stickers",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Dreamy celestial stickers featuring moons, stars and tiny planets.",
    "details": [
      "Category: Stickers",
      "Subcategory: Celestial Stickers",
      "Stock: 52 items available"
    ],
    "inStock": true,
    "stockCount": 52
  },
  {
    "id": "P093",
    "name": "Vintage Label Stickers",
    "shortName": "Vintage Label Stickers",
    "category": "stickers",
    "subcategory": "Vintage Stickers",
    "price": 249,
    "originalPrice": 329,
    "rating": 4.6,
    "reviewCount": 88,
    "images": [
      "https://i.pinimg.com/736x/71/d6/8d/71d68d68f13465adf15c14d85add6a88.jpg"
    ],
    "tags": [
      "stickers",
      "vintage stickers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Decorative vintage labels for journaling and scrapbooking.",
    "details": [
      "Category: Stickers",
      "Subcategory: Vintage Stickers",
      "Stock: 36 items available"
    ],
    "inStock": true,
    "stockCount": 36
  },
  {
    "id": "P094",
    "name": "Mini Botanical Stickers",
    "shortName": "Mini Botanical Stickers",
    "category": "stickers",
    "subcategory": "Nature Stickers",
    "price": 179,
    "originalPrice": 249,
    "rating": 4.9,
    "reviewCount": 26,
    "images": [
      "https://i.pinimg.com/736x/9b/a6/88/9ba688cfc97ad522af0080b4006da2ac.jpg"
    ],
    "tags": [
      "stickers",
      "nature stickers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Tiny botanical illustrations perfect for minimalist journal layouts.",
    "details": [
      "Category: Stickers",
      "Subcategory: Nature Stickers",
      "Stock: 63 items available"
    ],
    "inStock": true,
    "stockCount": 63
  },
  {
    "id": "P095",
    "name": "Planner Icons Sticker Book",
    "shortName": "Planner Icons Sticker Book",
    "category": "stickers",
    "subcategory": "Planner Stickers",
    "price": 299,
    "originalPrice": 399,
    "rating": 4.5,
    "reviewCount": 49,
    "images": [
      "https://i.pinimg.com/1200x/44/41/d4/4441d47a587fc87bb58dba4a9c91c965.jpg"
    ],
    "tags": [
      "stickers",
      "planner stickers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Compact sticker book filled with useful planning and scheduling icons.",
    "details": [
      "Category: Stickers",
      "Subcategory: Planner Stickers",
      "Stock: 31 items available"
    ],
    "inStock": true,
    "stockCount": 31
  },
  {
    "id": "P096",
    "name": "Pastel Hearts Sticker Pack",
    "shortName": "Pastel Hearts Sticker Pack",
    "category": "stickers",
    "subcategory": "Decorative Stickers",
    "price": 159,
    "originalPrice": 229,
    "rating": 4.8,
    "reviewCount": 72,
    "images": [
      "https://i.pinimg.com/736x/40/2d/91/402d91a7bda6cc5425bce81ad99d88c0.jpg"
    ],
    "tags": [
      "stickers",
      "decorative stickers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Soft pastel heart stickers for decorating notes and gift packaging.",
    "details": [
      "Category: Stickers",
      "Subcategory: Decorative Stickers",
      "Stock: 67 items available"
    ],
    "inStock": true,
    "stockCount": 67
  },
  {
    "id": "P097",
    "name": "Book Lover Sticker Set",
    "shortName": "Book Lover Sticker Set",
    "category": "stickers",
    "subcategory": "Bookish Stickers",
    "price": 219,
    "originalPrice": 299,
    "rating": 4.4,
    "reviewCount": 95,
    "images": [
      "https://i.pinimg.com/736x/ae/25/b4/ae25b4b7ff7347fad75489af9b368d34.jpg"
    ],
    "tags": [
      "stickers",
      "bookish stickers",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": true,
    "description": "Literary-themed stickers featuring books, reading and cozy corners.",
    "details": [
      "Category: Stickers",
      "Subcategory: Bookish Stickers",
      "Stock: 42 items available"
    ],
    "inStock": true,
    "stockCount": 42
  },
  {
    "id": "P098",
    "name": "Self-Care Sticker Sheet",
    "shortName": "Self-Care Sticker Sheet",
    "category": "stickers",
    "subcategory": "Wellness Stickers",
    "price": 199,
    "originalPrice": 279,
    "rating": 4.7,
    "reviewCount": 33,
    "images": [
      "https://i.pinimg.com/736x/25/41/dd/2541dd7920b19f7a6ade1da14a509cae.jpg"
    ],
    "tags": [
      "stickers",
      "wellness stickers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Relaxing stickers featuring tea, candles, skincare and self-care moments.",
    "details": [
      "Category: Stickers",
      "Subcategory: Wellness Stickers",
      "Stock: 45 items available"
    ],
    "inStock": true,
    "stockCount": 45
  },
  {
    "id": "P099",
    "name": "Tiny Garden Stickers",
    "shortName": "Tiny Garden Stickers",
    "category": "stickers",
    "subcategory": "Floral Stickers",
    "price": 189,
    "originalPrice": 259,
    "rating": 4.3,
    "reviewCount": 56,
    "images": [
      "https://i.pinimg.com/736x/93/40/92/934092502415aa6e2aa96c1f43c8d1e0.jpg"
    ],
    "tags": [
      "stickers",
      "floral stickers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Miniature garden illustrations with flowers, leaves and pots.",
    "details": [
      "Category: Stickers",
      "Subcategory: Floral Stickers",
      "Stock: 49 items available"
    ],
    "inStock": true,
    "stockCount": 49
  },
  {
    "id": "P100",
    "name": "Purple Cat Sticker Pack",
    "shortName": "Purple Cat Sticker Pack",
    "category": "stickers",
    "subcategory": "Character Stickers",
    "price": 179,
    "originalPrice": 249,
    "rating": 4.6,
    "reviewCount": 79,
    "images": [
      "https://i.pinimg.com/1200x/c6/3b/42/c63b424e4cc5a860448c436a769b11c5.jpg"
    ],
    "tags": [
      "stickers",
      "character stickers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Playful purple cat illustrations for notebooks and planners.",
    "details": [
      "Category: Stickers",
      "Subcategory: Character Stickers",
      "Stock: 54 items available"
    ],
    "inStock": true,
    "stockCount": 54
  },
  {
    "id": "P101",
    "name": "Dream Journal Stickers",
    "shortName": "Dream Journal Stickers",
    "category": "stickers",
    "subcategory": "Journal Stickers",
    "price": 219,
    "originalPrice": 299,
    "rating": 4.9,
    "reviewCount": 17,
    "images": [
      "https://i.pinimg.com/736x/3b/cb/c4/3bcbc41af98f530fa887ccb8a4875948.jpg"
    ],
    "tags": [
      "stickers",
      "journal stickers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Dreamy stickers designed for decorating personal journal pages.",
    "details": [
      "Category: Stickers",
      "Subcategory: Journal Stickers",
      "Stock: 38 items available"
    ],
    "inStock": true,
    "stockCount": 38
  },
  {
    "id": "P102",
    "name": "Retro Camera Sticker Set",
    "shortName": "Retro Camera Sticker Set",
    "category": "stickers",
    "subcategory": "Retro Stickers",
    "price": 229,
    "originalPrice": 299,
    "rating": 4.5,
    "reviewCount": 40,
    "images": [
      "https://i.pinimg.com/736x/a7/f4/2e/a7f42e13578b71acb6128a812a2afcb5.jpg"
    ],
    "tags": [
      "stickers",
      "retro stickers",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Vintage camera and photography-themed decorative stickers.",
    "details": [
      "Category: Stickers",
      "Subcategory: Retro Stickers",
      "Stock: 34 items available"
    ],
    "inStock": true,
    "stockCount": 34
  },
  {
    "id": "P103",
    "name": "Productivity Quote Stickers",
    "shortName": "Productivity Quote Stickers",
    "category": "stickers",
    "subcategory": "Quote Stickers",
    "price": 199,
    "originalPrice": 279,
    "rating": 4.8,
    "reviewCount": 63,
    "images": [
      "https://i.pinimg.com/736x/b8/17/6f/b8176f009111132f0ede541dacae1604.jpg"
    ],
    "tags": [
      "stickers",
      "quote stickers",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Motivational quote stickers designed for planners and study pages.",
    "details": [
      "Category: Stickers",
      "Subcategory: Quote Stickers",
      "Stock: 46 items available"
    ],
    "inStock": true,
    "stockCount": 46
  },
  {
    "id": "P104",
    "name": "Cottage Garden Stickers",
    "shortName": "Cottage Garden Stickers",
    "category": "stickers",
    "subcategory": "Cottagecore Stickers",
    "price": 249,
    "originalPrice": 329,
    "rating": 4.4,
    "reviewCount": 86,
    "images": [
      "https://i.pinimg.com/736x/45/d5/f2/45d5f2d7f0e2e3831c40b861c96fbd7d.jpg"
    ],
    "tags": [
      "stickers",
      "cottagecore stickers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Charming cottage-inspired stickers featuring flowers and garden scenes.",
    "details": [
      "Category: Stickers",
      "Subcategory: Cottagecore Stickers",
      "Stock: 32 items available"
    ],
    "inStock": true,
    "stockCount": 32
  },
  {
    "id": "P105",
    "name": "Celestial Gold Sticker Pack",
    "shortName": "Celestial Gold Sticker Pack",
    "category": "stickers",
    "subcategory": "Celestial Stickers",
    "price": 279,
    "originalPrice": 379,
    "rating": 4.7,
    "reviewCount": 24,
    "images": [
      "https://i.pinimg.com/736x/6b/dc/05/6bdc0515bff2bfe98bcf1029b23e506f.jpg"
    ],
    "tags": [
      "stickers",
      "celestial stickers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Elegant celestial stickers with premium gold-style details.",
    "details": [
      "Category: Stickers",
      "Subcategory: Celestial Stickers",
      "Stock: 29 items available"
    ],
    "inStock": true,
    "stockCount": 29
  },
  {
    "id": "P106",
    "name": "Cute Stationery Sticker Sheet",
    "shortName": "Cute Stationery Sticker Sheet",
    "category": "stickers",
    "subcategory": "Stationery Stickers",
    "price": 169,
    "originalPrice": 239,
    "rating": 4.3,
    "reviewCount": 47,
    "images": [
      "https://i.pinimg.com/736x/92/db/de/92dbde50a50d37091a77fc2a490787ad.jpg"
    ],
    "tags": [
      "stickers",
      "stationery stickers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Tiny illustrated stationery items for decorating notebooks and planners.",
    "details": [
      "Category: Stickers",
      "Subcategory: Stationery Stickers",
      "Stock: 61 items available"
    ],
    "inStock": true,
    "stockCount": 61
  },
  {
    "id": "P107",
    "name": "Purple Butterfly Stickers",
    "shortName": "Purple Butterfly Stickers",
    "category": "stickers",
    "subcategory": "Nature Stickers",
    "price": 189,
    "originalPrice": 259,
    "rating": 4.6,
    "reviewCount": 70,
    "images": [
      "https://i.pinimg.com/1200x/62/f1/51/62f1512f52686f696cc2a5170474fbd7.jpg"
    ],
    "tags": [
      "stickers",
      "nature stickers",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Delicate butterfly stickers in coordinated purple shades.",
    "details": [
      "Category: Stickers",
      "Subcategory: Nature Stickers",
      "Stock: 55 items available"
    ],
    "inStock": true,
    "stockCount": 55
  },
  {
    "id": "P108",
    "name": "Memory Keeping Sticker Book",
    "shortName": "Memory Keeping Sticker Book",
    "category": "stickers",
    "subcategory": "Scrapbook Stickers",
    "price": 349,
    "originalPrice": 449,
    "rating": 4.9,
    "reviewCount": 93,
    "images": [
      "https://i.pinimg.com/1200x/b2/8e/dd/b28edded5a0e0fae8b4d7b8a5fe14424.jpg"
    ],
    "tags": [
      "stickers",
      "scrapbook stickers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Multi-page sticker book for memory keeping and creative scrapbooking.",
    "details": [
      "Category: Stickers",
      "Subcategory: Scrapbook Stickers",
      "Stock: 27 items available"
    ],
    "inStock": true,
    "stockCount": 27
  },
  {
    "id": "P109",
    "name": "Soft Girl Sticker Collection",
    "shortName": "Soft Girl Sticker Collection",
    "category": "stickers",
    "subcategory": "Aesthetic Stickers",
    "price": 299,
    "originalPrice": 399,
    "rating": 4.5,
    "reviewCount": 31,
    "images": [
      "https://i.pinimg.com/736x/46/5a/47/465a4712cb3d23bc2acfa684c806f9a6.jpg"
    ],
    "tags": [
      "stickers",
      "aesthetic stickers",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Feminine pastel sticker collection with bows, flowers and lifestyle icons.",
    "details": [
      "Category: Stickers",
      "Subcategory: Aesthetic Stickers",
      "Stock: 33 items available"
    ],
    "inStock": true,
    "stockCount": 33
  },
  {
    "id": "P110",
    "name": "Lavender Desk Mat",
    "shortName": "Lavender Desk Mat",
    "category": "desk",
    "subcategory": "Desk Mats",
    "price": 699,
    "originalPrice": 899,
    "rating": 4.8,
    "reviewCount": 54,
    "images": [
      "https://i.pinimg.com/1200x/f3/d4/81/f3d481ba5611b84ba0374cc5df870a8f.jpg"
    ],
    "tags": [
      "desk",
      "desk mats",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Soft lavender desk mat designed to create a clean aesthetic workspace.",
    "details": [
      "Category: Workspace",
      "Subcategory: Desk Mats",
      "Stock: 18 items available"
    ],
    "inStock": true,
    "stockCount": 18
  },
  {
    "id": "P111",
    "name": "Acrylic Pen Holder",
    "shortName": "Acrylic Pen Holder",
    "category": "desk",
    "subcategory": "Pen Holders",
    "price": 349,
    "originalPrice": 449,
    "rating": 4.4,
    "reviewCount": 77,
    "images": [
      "https://i.pinimg.com/1200x/b2/0d/24/b20d24be3af73ccb1b485202792b083f.jpg"
    ],
    "tags": [
      "desk",
      "pen holders",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Clear acrylic holder for neatly displaying everyday writing tools.",
    "details": [
      "Category: Workspace",
      "Subcategory: Pen Holders",
      "Stock: 27 items available"
    ],
    "inStock": true,
    "stockCount": 27
  },
  {
    "id": "P112",
    "name": "Cloud Desk Organizer",
    "shortName": "Cloud Desk Organizer",
    "category": "desk",
    "subcategory": "Desk Organizers",
    "price": 499,
    "originalPrice": 649,
    "rating": 4.7,
    "reviewCount": 15,
    "images": [
      "https://i.pinimg.com/736x/26/85/52/268552ff35f1a425b293761e84cd2e01.jpg"
    ],
    "tags": [
      "desk",
      "desk organizers",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Cloud-shaped organizer for pens, clips and small desk essentials.",
    "details": [
      "Category: Workspace",
      "Subcategory: Desk Organizers",
      "Stock: 22 items available"
    ],
    "inStock": true,
    "stockCount": 22
  },
  {
    "id": "P113",
    "name": "Minimal Wooden Tray",
    "shortName": "Minimal Wooden Tray",
    "category": "desk",
    "subcategory": "Desk Trays",
    "price": 449,
    "originalPrice": 579,
    "rating": 4.3,
    "reviewCount": 38,
    "images": [
      "https://i.pinimg.com/1200x/ac/5a/14/ac5a14c1bd2c872cdfc2c104404f0310.jpg"
    ],
    "tags": [
      "desk",
      "desk trays",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Natural wooden tray for organizing stationery and accessories.",
    "details": [
      "Category: Workspace",
      "Subcategory: Desk Trays",
      "Stock: 19 items available"
    ],
    "inStock": true,
    "stockCount": 19
  },
  {
    "id": "P114",
    "name": "Purple Desktop Calendar",
    "shortName": "Purple Desktop Calendar",
    "category": "desk",
    "subcategory": "Desk Calendars",
    "price": 299,
    "originalPrice": 399,
    "rating": 4.6,
    "reviewCount": 61,
    "images": [
      "https://i.pinimg.com/736x/9b/bf/fa/9bbffa23954be94275bc4e021d1e5ddb.jpg"
    ],
    "tags": [
      "desk",
      "desk calendars",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Minimal desktop calendar with a coordinated purple aesthetic.",
    "details": [
      "Category: Workspace",
      "Subcategory: Desk Calendars",
      "Stock: 34 items available"
    ],
    "inStock": true,
    "stockCount": 34
  },
  {
    "id": "P115",
    "name": "Moon Lamp Desk Light",
    "shortName": "Moon Lamp Desk Light",
    "category": "desk",
    "subcategory": "Desk Lamps",
    "price": 899,
    "originalPrice": 1199,
    "rating": 4.9,
    "reviewCount": 84,
    "images": [
      "https://i.pinimg.com/736x/e6/55/2c/e6552cb35ab74842e6238c0ab8511ce1.jpg"
    ],
    "tags": [
      "desk",
      "desk lamps",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Decorative moon-inspired desk lamp for a cozy workspace atmosphere.",
    "details": [
      "Category: Workspace",
      "Subcategory: Desk Lamps",
      "Stock: 13 items available"
    ],
    "inStock": true,
    "stockCount": 13
  },
  {
    "id": "P116",
    "name": "Magnetic Memo Board",
    "shortName": "Magnetic Memo Board",
    "category": "desk",
    "subcategory": "Memo Boards",
    "price": 649,
    "originalPrice": 799,
    "rating": 4.5,
    "reviewCount": 22,
    "images": [
      "https://i.pinimg.com/736x/b4/c9/1a/b4c91ad4cadad19811c0d17d19a69adf.jpg"
    ],
    "tags": [
      "desk",
      "memo boards",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Compact magnetic board for notes, reminders and small prints.",
    "details": [
      "Category: Workspace",
      "Subcategory: Memo Boards",
      "Stock: 16 items available"
    ],
    "inStock": true,
    "stockCount": 16
  },
  {
    "id": "P117",
    "name": "Acrylic Note Stand",
    "shortName": "Acrylic Note Stand",
    "category": "desk",
    "subcategory": "Note Holders",
    "price": 249,
    "originalPrice": 329,
    "rating": 4.8,
    "reviewCount": 45,
    "images": [
      "https://i.pinimg.com/736x/ac/34/b8/ac34b8b956613c71b2794f2f7e8aba90.jpg"
    ],
    "tags": [
      "desk",
      "note holders",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Transparent acrylic stand for displaying notes, cards and reminders.",
    "details": [
      "Category: Workspace",
      "Subcategory: Note Holders",
      "Stock: 41 items available"
    ],
    "inStock": true,
    "stockCount": 41
  },
  {
    "id": "P118",
    "name": "Lavender Cable Organizer",
    "shortName": "Lavender Cable Organizer",
    "category": "desk",
    "subcategory": "Cable Management",
    "price": 199,
    "originalPrice": 279,
    "rating": 4.4,
    "reviewCount": 68,
    "images": [
      "https://i.pinimg.com/1200x/3f/09/f0/3f09f01e14efeb4a02b5059297299574.jpg"
    ],
    "tags": [
      "desk",
      "cable management",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Soft silicone cable clips designed to keep charging cables organized.",
    "details": [
      "Category: Workspace",
      "Subcategory: Cable Management",
      "Stock: 48 items available"
    ],
    "inStock": true,
    "stockCount": 48
  },
  {
    "id": "P119",
    "name": "Wooden Monitor Stand",
    "shortName": "Wooden Monitor Stand",
    "category": "desk",
    "subcategory": "Desk Accessories",
    "price": 899,
    "originalPrice": 1099,
    "rating": 4.7,
    "reviewCount": 91,
    "images": [
      "https://i.pinimg.com/736x/cf/3d/1e/cf3d1e0c831a8a2c809d5cba47fe0260.jpg"
    ],
    "tags": [
      "desk",
      "desk accessories",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Minimal wooden riser that adds storage space beneath your monitor.",
    "details": [
      "Category: Workspace",
      "Subcategory: Desk Accessories",
      "Stock: 11 items available"
    ],
    "inStock": true,
    "stockCount": 11
  },
  {
    "id": "P120",
    "name": "Soft Cloud Mouse Pad",
    "shortName": "Soft Cloud Mouse Pad",
    "category": "desk",
    "subcategory": "Mouse Pads",
    "price": 399,
    "originalPrice": 499,
    "rating": 4.3,
    "reviewCount": 29,
    "images": [
      "https://i.pinimg.com/1200x/36/1e/35/361e35b718a95cf456d12bb183af94c2.jpg"
    ],
    "tags": [
      "desk",
      "mouse pads",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Comfortable cloud-shaped mouse pad with a soft aesthetic finish.",
    "details": [
      "Category: Workspace",
      "Subcategory: Mouse Pads",
      "Stock: 26 items available"
    ],
    "inStock": true,
    "stockCount": 26
  },
  {
    "id": "P121",
    "name": "Desktop Storage Box",
    "shortName": "Desktop Storage Box",
    "category": "desk",
    "subcategory": "Storage",
    "price": 549,
    "originalPrice": 699,
    "rating": 4.6,
    "reviewCount": 52,
    "images": [
      "https://i.pinimg.com/1200x/3c/3b/7c/3c3b7c44f62f02bacd7a52fdbb6e555a.jpg"
    ],
    "tags": [
      "desk",
      "storage",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Multi-purpose storage box for stationery and small desk supplies.",
    "details": [
      "Category: Workspace",
      "Subcategory: Storage",
      "Stock: 23 items available"
    ],
    "inStock": true,
    "stockCount": 23
  },
  {
    "id": "P122",
    "name": "Mini Whiteboard Planner",
    "shortName": "Mini Whiteboard Planner",
    "category": "desk",
    "subcategory": "Whiteboards",
    "price": 449,
    "originalPrice": 579,
    "rating": 4.9,
    "reviewCount": 75,
    "images": [
      "https://i.pinimg.com/736x/e0/70/7d/e0707d431ee9ed86548ab22eaadc2c7e.jpg"
    ],
    "tags": [
      "desk",
      "whiteboards",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Reusable mini whiteboard for daily tasks and quick reminders.",
    "details": [
      "Category: Workspace",
      "Subcategory: Whiteboards",
      "Stock: 17 items available"
    ],
    "inStock": true,
    "stockCount": 17
  },
  {
    "id": "P123",
    "name": "Purple Book Stand",
    "shortName": "Purple Book Stand",
    "category": "desk",
    "subcategory": "Book Stands",
    "price": 599,
    "originalPrice": 749,
    "rating": 4.5,
    "reviewCount": 13,
    "images": [
      "https://i.pinimg.com/1200x/14/6d/37/146d37ed1813c8a84c2406fa004a196.jpg"
    ],
    "tags": [
      "desk",
      "book stands",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Adjustable book stand for reading, studying and desk organization.",
    "details": [
      "Category: Workspace",
      "Subcategory: Book Stands",
      "Stock: 15 items available"
    ],
    "inStock": true,
    "stockCount": 15
  },
  {
    "id": "P124",
    "name": "Ceramic Pen Cup",
    "shortName": "Ceramic Pen Cup",
    "category": "desk",
    "subcategory": "Pen Holders",
    "price": 329,
    "originalPrice": 429,
    "rating": 4.8,
    "reviewCount": 36,
    "images": [
      "https://i.pinimg.com/1200x/ee/33/d1/ee33d1084b0f3f342cf07c0a3cc51a1d.jpg"
    ],
    "tags": [
      "desk",
      "pen holders",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Matte ceramic pen cup with a refined minimalist design.",
    "details": [
      "Category: Workspace",
      "Subcategory: Pen Holders",
      "Stock: 25 items available"
    ],
    "inStock": true,
    "stockCount": 25
  },
  {
    "id": "P125",
    "name": "Desk Drawer Organizer",
    "shortName": "Desk Drawer Organizer",
    "category": "desk",
    "subcategory": "Desk Organizers",
    "price": 379,
    "originalPrice": 479,
    "rating": 4.4,
    "reviewCount": 59,
    "images": [
      "https://i.pinimg.com/736x/ec/35/39/ec35390d37bd94131727e46eb5bc59c7.jpg"
    ],
    "tags": [
      "desk",
      "desk organizers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Modular organizer for clips, sticky notes and small stationery items.",
    "details": [
      "Category: Workspace",
      "Subcategory: Desk Organizers",
      "Stock: 31 items available"
    ],
    "inStock": true,
    "stockCount": 31
  },
  {
    "id": "P126",
    "name": "Aesthetic Sticky Note Board",
    "shortName": "Aesthetic Sticky Note Board",
    "category": "desk",
    "subcategory": "Memo Boards",
    "price": 499,
    "originalPrice": 649,
    "rating": 4.7,
    "reviewCount": 82,
    "images": [
      "https://i.pinimg.com/736x/58/a6/82/58a68204798ff6a3c4ae0b5a4b62bcae.jpg"
    ],
    "tags": [
      "desk",
      "memo boards",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Compact board for arranging reminders and colorful sticky notes.",
    "details": [
      "Category: Workspace",
      "Subcategory: Memo Boards",
      "Stock: 20 items available"
    ],
    "inStock": true,
    "stockCount": 20
  },
  {
    "id": "P127",
    "name": "Minimal Desk Clock",
    "shortName": "Minimal Desk Clock",
    "category": "desk",
    "subcategory": "Desk Clocks",
    "price": 649,
    "originalPrice": 799,
    "rating": 4.3,
    "reviewCount": 20,
    "images": [
      "https://i.pinimg.com/736x/20/20/06/20200627573d2a95dccf26df49e30ca1.jpg"
    ],
    "tags": [
      "desk",
      "desk clocks",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": true,
    "description": "Simple modern desk clock with a clean minimalist face.",
    "details": [
      "Category: Workspace",
      "Subcategory: Desk Clocks",
      "Stock: 14 items available"
    ],
    "inStock": true,
    "stockCount": 14
  },
  {
    "id": "P128",
    "name": "Purple Laptop Stand",
    "shortName": "Purple Laptop Stand",
    "category": "desk",
    "subcategory": "Laptop Stands",
    "price": 799,
    "originalPrice": 999,
    "rating": 4.6,
    "reviewCount": 43,
    "images": [
      "https://i.pinimg.com/1200x/6b/52/e1/6b52e1ffd293699876c2a1d1929ec68a.jpg"
    ],
    "tags": [
      "desk",
      "laptop stands",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Sleek laptop stand designed for an organized and elevated workspace.",
    "details": [
      "Category: Workspace",
      "Subcategory: Laptop Stands",
      "Stock: 12 items available"
    ],
    "inStock": true,
    "stockCount": 12
  },
  {
    "id": "P129",
    "name": "Wooden Pencil Tray",
    "shortName": "Wooden Pencil Tray",
    "category": "desk",
    "subcategory": "Desk Trays",
    "price": 299,
    "originalPrice": 399,
    "rating": 4.9,
    "reviewCount": 66,
    "images": [
      "https://i.pinimg.com/736x/e3/bf/dc/e3bfdcde65debd0c48a151eb1396b191.jpg"
    ],
    "tags": [
      "desk",
      "desk trays",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Compact wooden tray for pencils, pens and everyday desk items.",
    "details": [
      "Category: Workspace",
      "Subcategory: Desk Trays",
      "Stock: 36 items available"
    ],
    "inStock": true,
    "stockCount": 36
  },
  {
    "id": "P130",
    "name": "Cozy Desk Coaster Set",
    "shortName": "Cozy Desk Coaster Set",
    "category": "desk",
    "subcategory": "Desk Accessories",
    "price": 249,
    "originalPrice": 329,
    "rating": 4.5,
    "reviewCount": 89,
    "images": [
      "https://i.pinimg.com/1200x/3a/a9/95/3aa9951c86dbdc79c5700c2087671dac.jpg"
    ],
    "tags": [
      "desk",
      "desk accessories",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Set of four decorative coasters for a cozy and tidy desk setup.",
    "details": [
      "Category: Workspace",
      "Subcategory: Desk Accessories",
      "Stock: 29 items available"
    ],
    "inStock": true,
    "stockCount": 29
  },
  {
    "id": "P131",
    "name": "Lavender Pencil Pouch",
    "shortName": "Lavender Pencil Pouch",
    "category": "gifting",
    "subcategory": "Pencil Cases",
    "price": 349,
    "originalPrice": 449,
    "rating": 4.8,
    "reviewCount": 27,
    "images": [
      "https://i.pinimg.com/736x/be/11/29/be112946b7ed1f8faa4d554a0e0bf1a6.jpg"
    ],
    "tags": [
      "gifting",
      "pencil cases",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Soft lavender pouch with enough space for everyday stationery essentials.",
    "details": [
      "Category: Accessories",
      "Subcategory: Pencil Cases",
      "Stock: 39 items available"
    ],
    "inStock": true,
    "stockCount": 39
  },
  {
    "id": "P132",
    "name": "Transparent Stationery Pouch",
    "shortName": "Transparent Stationery Pouch",
    "category": "gifting",
    "subcategory": "Pencil Cases",
    "price": 299,
    "originalPrice": 399,
    "rating": 4.4,
    "reviewCount": 50,
    "images": [
      "https://i.pinimg.com/1200x/1a/cc/a0/1acca070c8f97f7f18f55c5ccce696b9.jpg"
    ],
    "tags": [
      "gifting",
      "pencil cases",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Clear pouch that keeps stationery visible and easy to organize.",
    "details": [
      "Category: Accessories",
      "Subcategory: Pencil Cases",
      "Stock: 43 items available"
    ],
    "inStock": true,
    "stockCount": 43
  },
  {
    "id": "P133",
    "name": "Vintage Brass Bookmark",
    "shortName": "Vintage Brass Bookmark",
    "category": "gifting",
    "subcategory": "Bookmarks",
    "price": 199,
    "originalPrice": 279,
    "rating": 4.7,
    "reviewCount": 73,
    "images": [
      "https://i.pinimg.com/736x/80/f1/06/80f106f570cc392a1d2c6ba77cb2ef30.jpg"
    ],
    "tags": [
      "gifting",
      "bookmarks",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Elegant brass-style bookmark with a timeless vintage appearance.",
    "details": [
      "Category: Accessories",
      "Subcategory: Bookmarks",
      "Stock: 51 items available"
    ],
    "inStock": true,
    "stockCount": 51
  },
  {
    "id": "P134",
    "name": "Purple Tassel Bookmark",
    "shortName": "Purple Tassel Bookmark",
    "category": "gifting",
    "subcategory": "Bookmarks",
    "price": 149,
    "originalPrice": 219,
    "rating": 4.3,
    "reviewCount": 96,
    "images": [
      "https://i.pinimg.com/1200x/58/8f/f0/588ff075503cc96a57b331fb34d868e2.jpg"
    ],
    "tags": [
      "gifting",
      "bookmarks",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Decorative bookmark featuring a soft purple tassel.",
    "details": [
      "Category: Accessories",
      "Subcategory: Bookmarks",
      "Stock: 64 items available"
    ],
    "inStock": true,
    "stockCount": 64
  },
  {
    "id": "P135",
    "name": "Floral Paper Clip Set",
    "shortName": "Floral Paper Clip Set",
    "category": "gifting",
    "subcategory": "Paper Clips",
    "price": 179,
    "originalPrice": 249,
    "rating": 4.6,
    "reviewCount": 34,
    "images": [
      "https://i.pinimg.com/1200x/d5/c4/90/d5c4906cee983aef3a411f8aaff33be7.jpg"
    ],
    "tags": [
      "gifting",
      "paper clips",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Decorative floral paper clips for journals, planners and documents.",
    "details": [
      "Category: Accessories",
      "Subcategory: Paper Clips",
      "Stock: 48 items available"
    ],
    "inStock": true,
    "stockCount": 48
  },
  {
    "id": "P136",
    "name": "Gold Star Paper Clips",
    "shortName": "Gold Star Paper Clips",
    "category": "gifting",
    "subcategory": "Paper Clips",
    "price": 159,
    "originalPrice": 229,
    "rating": 4.9,
    "reviewCount": 57,
    "images": [
      "https://i.pinimg.com/1200x/02/d0/3f/02d03ff5e5e7fb04dd36ebb62c1e5e9f.jpg"
    ],
    "tags": [
      "gifting",
      "paper clips",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Star-shaped metallic paper clips with a polished decorative finish.",
    "details": [
      "Category: Accessories",
      "Subcategory: Paper Clips",
      "Stock: 57 items available"
    ],
    "inStock": true,
    "stockCount": 57
  },
  {
    "id": "P137",
    "name": "Lavender Sticky Notes",
    "shortName": "Lavender Sticky Notes",
    "category": "gifting",
    "subcategory": "Sticky Notes",
    "price": 129,
    "originalPrice": 179,
    "rating": 4.5,
    "reviewCount": 80,
    "images": [
      "https://i.pinimg.com/1200x/a5/b7/c2/a5b7c25452218bf707509ef5bd0b14ab.jpg"
    ],
    "tags": [
      "gifting",
      "sticky notes",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Soft lavender sticky notes for reminders, study notes and planning.",
    "details": [
      "Category: Accessories",
      "Subcategory: Sticky Notes",
      "Stock: 72 items available"
    ],
    "inStock": true,
    "stockCount": 72
  },
  {
    "id": "P138",
    "name": "Cloud Sticky Note Set",
    "shortName": "Cloud Sticky Note Set",
    "category": "gifting",
    "subcategory": "Sticky Notes",
    "price": 169,
    "originalPrice": 229,
    "rating": 4.8,
    "reviewCount": 18,
    "images": [
      "https://i.pinimg.com/1200x/53/81/b7/5381b7703b43bcb8d92a6f0f5e9762dd.jpg"
    ],
    "tags": [
      "gifting",
      "sticky notes",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Cloud-shaped sticky notes in a calming pastel palette.",
    "details": [
      "Category: Accessories",
      "Subcategory: Sticky Notes",
      "Stock: 55 items available"
    ],
    "inStock": true,
    "stockCount": 55
  },
  {
    "id": "P139",
    "name": "Mini Scissors Lavender",
    "shortName": "Mini Scissors Lavender",
    "category": "gifting",
    "subcategory": "Craft Tools",
    "price": 229,
    "originalPrice": 299,
    "rating": 4.4,
    "reviewCount": 41,
    "images": [
      "https://i.pinimg.com/1200x/48/17/af/4817afbf2739fe8a7f352aa1c6bea253.jpg"
    ],
    "tags": [
      "gifting",
      "craft tools",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Compact scissors with a lavender handle for crafting and journaling.",
    "details": [
      "Category: Accessories",
      "Subcategory: Craft Tools",
      "Stock: 37 items available"
    ],
    "inStock": true,
    "stockCount": 37
  },
  {
    "id": "P140",
    "name": "Aesthetic Ruler Set",
    "shortName": "Aesthetic Ruler Set",
    "category": "gifting",
    "subcategory": "Rulers",
    "price": 149,
    "originalPrice": 199,
    "rating": 4.7,
    "reviewCount": 64,
    "images": [
      "https://i.pinimg.com/736x/66/79/ed/6679eda7f9f2019225f3207efdcd6ef7.jpg"
    ],
    "tags": [
      "gifting",
      "rulers",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Minimal rulers designed for precise planning and creative layouts.",
    "details": [
      "Category: Accessories",
      "Subcategory: Rulers",
      "Stock: 61 items available"
    ],
    "inStock": true,
    "stockCount": 61
  },
  {
    "id": "P141",
    "name": "Purple Pencil Sharpener",
    "shortName": "Purple Pencil Sharpener",
    "category": "gifting",
    "subcategory": "Desk Tools",
    "price": 129,
    "originalPrice": 179,
    "rating": 4.3,
    "reviewCount": 87,
    "images": [
      "https://i.pinimg.com/736x/92/2f/c6/922fc66e4f6593189b4a0bcbe1f55eb3.jpg"
    ],
    "tags": [
      "gifting",
      "desk tools",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Compact sharpener with a smooth purple finish.",
    "details": [
      "Category: Accessories",
      "Subcategory: Desk Tools",
      "Stock: 68 items available"
    ],
    "inStock": true,
    "stockCount": 68
  },
  {
    "id": "P142",
    "name": "Washi Tape Dispenser",
    "shortName": "Washi Tape Dispenser",
    "category": "gifting",
    "subcategory": "Tape Tools",
    "price": 249,
    "originalPrice": 329,
    "rating": 4.6,
    "reviewCount": 25,
    "images": [
      "https://i.pinimg.com/1200x/e1/cd/e7/e1cde72bc23be3cbe968306c233f45fe.jpg"
    ],
    "tags": [
      "gifting",
      "tape tools",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Handy dispenser for neatly cutting and storing decorative tape.",
    "details": [
      "Category: Accessories",
      "Subcategory: Tape Tools",
      "Stock: 32 items available"
    ],
    "inStock": true,
    "stockCount": 32
  },
  {
    "id": "P143",
    "name": "Journal Elastic Band Set",
    "shortName": "Journal Elastic Band Set",
    "category": "gifting",
    "subcategory": "Journal Accessories",
    "price": 179,
    "originalPrice": 249,
    "rating": 4.9,
    "reviewCount": 48,
    "images": [
      "https://i.pinimg.com/1200x/ee/20/a8/ee20a82979aba3d323526142d4d45a80.jpg"
    ],
    "tags": [
      "gifting",
      "journal accessories",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Decorative elastic bands for securing notebooks and planners.",
    "details": [
      "Category: Accessories",
      "Subcategory: Journal Accessories",
      "Stock: 44 items available"
    ],
    "inStock": true,
    "stockCount": 44
  },
  {
    "id": "P144",
    "name": "Mini Bookmark Charm",
    "shortName": "Mini Bookmark Charm",
    "category": "gifting",
    "subcategory": "Bookmarks",
    "price": 219,
    "originalPrice": 299,
    "rating": 4.5,
    "reviewCount": 71,
    "images": [
      "https://i.pinimg.com/736x/b0/08/6a/b0086ad83203f66833d7a547af7924.jpg"
    ],
    "tags": [
      "gifting",
      "bookmarks",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Small decorative bookmark charm designed for journals and novels.",
    "details": [
      "Category: Accessories",
      "Subcategory: Bookmarks",
      "Stock: 35 items available"
    ],
    "inStock": true,
    "stockCount": 35
  },
  {
    "id": "P145",
    "name": "Purple Binder Clips",
    "shortName": "Purple Binder Clips",
    "category": "gifting",
    "subcategory": "Clips",
    "price": 139,
    "originalPrice": 199,
    "rating": 4.8,
    "reviewCount": 94,
    "images": [
      "https://i.pinimg.com/1200x/cf/8e/99/cf8e99530d120ef298c39298c275dc5c.jpg"
    ],
    "tags": [
      "gifting",
      "clips",
      "stationery",
      "aesthetic"
    ],
    "badge": "NEW",
    "badgeVariant": "teal",
    "isNew": true,
    "isBestseller": false,
    "description": "Set of aesthetic binder clips for organizing papers and documents.",
    "details": [
      "Category: Accessories",
      "Subcategory: Clips",
      "Stock: 59 items available"
    ],
    "inStock": true,
    "stockCount": 59
  },
  {
    "id": "P146",
    "name": "Desk Photo Clips",
    "shortName": "Desk Photo Clips",
    "category": "gifting",
    "subcategory": "Photo Accessories",
    "price": 199,
    "originalPrice": 279,
    "rating": 4.4,
    "reviewCount": 32,
    "images": [
      "https://i.pinimg.com/1200x/09/25/2e/09252e67c7be736223a21524f71f9e0e.jpg"
    ],
    "tags": [
      "gifting",
      "photo accessories",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Mini clips for displaying photographs, notes and inspirational cards.",
    "details": [
      "Category: Accessories",
      "Subcategory: Photo Accessories",
      "Stock: 46 items available"
    ],
    "inStock": true,
    "stockCount": 46
  },
  {
    "id": "P147",
    "name": "Lavender Book Sleeve",
    "shortName": "Lavender Book Sleeve",
    "category": "gifting",
    "subcategory": "Book Sleeves",
    "price": 449,
    "originalPrice": 579,
    "rating": 4.7,
    "reviewCount": 55,
    "images": [
      "https://i.pinimg.com/1200x/89/02/38/890238a4b259b1040647ce5e2fc305db.jpg"
    ],
    "tags": [
      "gifting",
      "book sleeves",
      "stationery",
      "aesthetic"
    ],
    "badge": "BESTSELLER",
    "badgeVariant": "yellow",
    "isNew": false,
    "isBestseller": true,
    "description": "Protective fabric sleeve for carrying notebooks and favorite books.",
    "details": [
      "Category: Accessories",
      "Subcategory: Book Sleeves",
      "Stock: 24 items available"
    ],
    "inStock": true,
    "stockCount": 24
  },
  {
    "id": "P148",
    "name": "Stationery Travel Case",
    "shortName": "Stationery Travel Case",
    "category": "gifting",
    "subcategory": "Storage Cases",
    "price": 499,
    "originalPrice": 649,
    "rating": 4.3,
    "reviewCount": 78,
    "images": [
      "https://i.pinimg.com/736x/4a/fc/3d/4afc3dae85d892cbb92585d8b1989370.jpg"
    ],
    "tags": [
      "gifting",
      "storage cases",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Compact travel case with compartments for organizing stationery.",
    "details": [
      "Category: Accessories",
      "Subcategory: Storage Cases",
      "Stock: 18 items available"
    ],
    "inStock": true,
    "stockCount": 18
  },
  {
    "id": "P149",
    "name": "Purple Lanyard Charm",
    "shortName": "Purple Lanyard Charm",
    "category": "gifting",
    "subcategory": "Charms",
    "price": 159,
    "originalPrice": 229,
    "rating": 4.6,
    "reviewCount": 16,
    "images": [
      "https://i.pinimg.com/736x/a0/27/30/a0273060aff3cdc16e326115876510ee.jpg"
    ],
    "tags": [
      "gifting",
      "charms",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Small decorative charm for bags, pencil cases and lanyards.",
    "details": [
      "Category: Accessories",
      "Subcategory: Charms",
      "Stock: 41 items available"
    ],
    "inStock": true,
    "stockCount": 41
  },
  {
    "id": "P150",
    "name": "Mini Craft Storage Box",
    "shortName": "Mini Craft Storage Box",
    "category": "gifting",
    "subcategory": "Storage Boxes",
    "price": 299,
    "originalPrice": 399,
    "rating": 4.9,
    "reviewCount": 39,
    "images": [
      "https://i.pinimg.com/736x/47/a3/4b/47a34b770e85fd788bddb7af1b344c80.jpg"
    ],
    "tags": [
      "gifting",
      "storage boxes",
      "stationery",
      "aesthetic"
    ],
    "isNew": false,
    "isBestseller": false,
    "description": "Compact compartment box for storing stickers, clips and tiny supplies.",
    "details": [
      "Category: Accessories",
      "Subcategory: Storage Boxes",
      "Stock: 28 items available"
    ],
    "inStock": true,
    "stockCount": 28
  }
];

export const CATEGORIES = [
  { id: "journals",  label: "Journals",         image: "https://i.pinimg.com/736x/f6/c9/c3/f6c9c3e62c2b2d472cc2171e780721eb.jpg", fallbackImage: "/journals.jpg", productCount: 22, color: "#EEE8F8" },
  { id: "pens",      label: "Pens & Ink",       image: "https://i.pinimg.com/736x/be/5e/f5/be5ef511b100cd1b4cadce3cc28e67ea.jpg", fallbackImage: "/pens-markers.jpg", productCount: 25, color: "#FFE8EC" },
  { id: "washi",     label: "Washi Tape",        image: "https://i.pinimg.com/736x/e6/c9/d7/e6c9d7a0406783764a0433325ae36f0c.jpg", fallbackImage: "/washi-tape.jpg", productCount: 20, color: "#DFF5F3" },
  { id: "stickers",  label: "Stickers",          image: "https://i.pinimg.com/736x/13/a9/74/13a9746407831fdd98386a9920fe83d0.jpg", fallbackImage: "/stickers.jpg", productCount: 22, color: "#FFF0DC" },
  { id: "planners",  label: "Planners",          image: "https://i.pinimg.com/736x/ca/62/fa/ca62faf946122e9c98f76ac7a8684725.jpg", fallbackImage: "/planners.jpg", productCount: 20, color: "#E5F5EC" },
  { id: "desk",      label: "Workspace & Desk",  image: "https://i.pinimg.com/1200x/f3/d4/81/f3d481ba5611b84ba0374cc5df870a8f.jpg", fallbackImage: "/desk-accessories.jpg", productCount: 21, color: "#E5EEFF" },
  { id: "gifting",   label: "Accessories",      image: "https://i.pinimg.com/736x/be/11/29/be112946b7ed1f8faa4d554a0e0bf1a6.jpg", fallbackImage: "/gift-combo.jpg", productCount: 20, color: "#FDEFEF" },
];

export const REVIEWS = [
  {
    id: "r1",
    productId: "P001",
    name: "Ritika S.",
    avatar: u("photo-1579017308347-e53e0d2fc5e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA", 80, 80),
    rating: 5,
    date: "Aug 2024",
    text: "The glass dip pen quality is incredible — smooth ink flow, lovely feel. I have been using it every morning for calligraphy.",
    verified: true,
  },
  {
    id: "r2",
    productId: "P026",
    name: "Meghna P.",
    avatar: u("photo-1750814019023-4e43037f5075?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA", 80, 80),
    rating: 5,
    date: "Jul 2024",
    text: "Finally found my perfect lavender journal. The paper quality is so premium and smooth. Will definitely reorder!",
    verified: true,
  },
  {
    id: "r3",
    productId: "P068",
    name: "Aanya K.",
    avatar: u("photo-1517703565892-7cdb859e127b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA", 80, 80),
    rating: 4,
    date: "Jul 2024",
    text: "The Lavender Sky washi tape collection is stunning. Beautiful prints and perfect adhesion for my bullet journal!",
    verified: true,
  },
];

export const SORT_OPTIONS = [
  { value: "featured",    label: "Featured" },
  { value: "newest",      label: "Newest First" },
  { value: "price-asc",   label: "Price: Low to High" },
  { value: "price-desc",  label: "Price: High to Low" },
  { value: "rating",      label: "Top Rated" },
  { value: "bestselling", label: "Best Selling" },
];

export const PRICE_RANGES = [
  { label: "Under ₹299", min: 0, max: 299 },
  { label: "₹299 – ₹499", min: 299, max: 499 },
  { label: "₹499 – ₹799", min: 499, max: 799 },
  { label: "₹799+", min: 799, max: Infinity },
];
