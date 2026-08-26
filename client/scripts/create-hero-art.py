from pathlib import Path
import random

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/images/worker-field.png"
OUT.parent.mkdir(parents=True, exist_ok=True)

S = 2
W, H = 1200 * S, 1500 * S
random.seed(12)


def pts(values):
    return [(int(x * S), int(y * S)) for x, y in values]


def ellipse(draw, box, fill, outline=None, width=1):
    draw.ellipse(tuple(int(v * S) for v in box), fill=fill, outline=outline, width=int(width * S))


def polygon(draw, values, fill, outline=None, width=1):
    draw.polygon(pts(values), fill=fill)
    if outline:
        draw.line(pts(values + [values[0]]), fill=outline, width=int(width * S), joint="curve")


def line(draw, values, fill, width=1):
    draw.line(pts(values), fill=fill, width=int(width * S), joint="curve")


im = Image.new("RGB", (W, H), "#F4E3B2")
draw = ImageDraw.Draw(im)

# Soft paper-to-sky gradient.
top = (244, 227, 178)
bottom = (228, 163, 77)
for y in range(H):
    ratio = y / max(1, H - 1)
    color = tuple(int(top[i] * (1 - ratio) + bottom[i] * ratio) for i in range(3))
    draw.line([(0, y), (W, y)], fill=color)

# Sun and distant canopy.
ellipse(draw, (790, 95, 1080, 385), "#E8912D")
ellipse(draw, (840, 145, 1030, 335), "#F2B85C")
for x, y, r in [(85, 575, 85), (160, 540, 112), (285, 565, 84), (1010, 555, 120), (1115, 590, 90)]:
    ellipse(draw, (x - r, y - r, x + r, y + r), "#78945D")

# Layered fields.
polygon(draw, [(0, 660), (180, 610), (380, 642), (575, 590), (770, 630), (960, 570), (1200, 620), (1200, 1500), (0, 1500)], "#88A46A")
polygon(draw, [(0, 790), (180, 730), (400, 770), (600, 706), (850, 745), (1040, 685), (1200, 720), (1200, 1500), (0, 1500)], "#4C7A3F")
polygon(draw, [(0, 1020), (220, 925), (420, 980), (670, 900), (900, 950), (1200, 875), (1200, 1500), (0, 1500)], "#6B4226")

# Field furrows and plant marks.
for offset, color, width in [(0, "#C18C4A", 10), (44, "#A9793D", 8), (88, "#8D632F", 6)]:
    line(draw, [(0, 1170 + offset), (250, 1085 + offset), (500, 1110 + offset), (760, 1026 + offset), (1200, 1058 + offset)], color, width)
for x, y in [(94, 830), (142, 806), (206, 852), (265, 822), (1000, 790), (1065, 812), (1124, 782)]:
    line(draw, [(x, y + 40), (x - 7, y), (x, y + 15), (x + 8, y - 8)], "#F4E3B2", 5)

# Worker silhouette with warm, human detail.
stroke = "#2B2420"
skin = "#B96E3F"
scarf = "#B5482C"
cloth = "#D77A3B"

# Back scarf and head.
polygon(draw, [(384, 485), (420, 355), (585, 330), (710, 430), (663, 620), (500, 605)], scarf, stroke, 12)
ellipse(draw, (433, 355, 602, 540), skin, stroke, 12)
polygon(draw, [(420, 390), (475, 302), (609, 334), (646, 407), (602, 436), (546, 357), (468, 436)], stroke)

# Body and sari.
polygon(draw, [(418, 510), (585, 495), (715, 635), (688, 1085), (300, 1085), (310, 690)], cloth, stroke, 14)
polygon(draw, [(490, 500), (625, 520), (685, 1085), (535, 1085), (520, 780)], "#F4E3B2", stroke, 9)
polygon(draw, [(595, 520), (725, 620), (688, 1085), (615, 1085)], "#E8912D", stroke, 9)

# Arms.
line(draw, [(378, 570), (318, 710), (350, 885)], skin, 46)
line(draw, [(378, 570), (318, 710), (350, 885)], stroke, 12)
line(draw, [(642, 570), (706, 700), (655, 808)], skin, 45)
line(draw, [(642, 570), (706, 700), (655, 808)], stroke, 12)

# Phone.
polygon(draw, [(600, 690), (682, 674), (714, 845), (628, 861)], "#FFFDF7", stroke, 12)
line(draw, [(622, 724), (675, 714)], "#4C7A3F", 9)
line(draw, [(628, 755), (684, 744)], "#E8912D", 9)
line(draw, [(634, 786), (677, 778)], "#B5482C", 9)
ellipse(draw, (625, 790, 690, 850), skin, stroke, 9)

# Feet.
polygon(draw, [(340, 1040), (472, 1040), (445, 1240), (275, 1240)], stroke)
polygon(draw, [(520, 1040), (655, 1040), (700, 1240), (535, 1240)], stroke)

# Fine painterly flecks.
overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
od = ImageDraw.Draw(overlay)
for _ in range(260):
    x = random.randint(0, W - 1)
    y = random.randint(0, H - 1)
    radius = random.choice([1, 1, 2, 3]) * S
    od.ellipse((x, y, x + radius, y + radius), fill=(43, 36, 32, random.randint(5, 18)))
im = Image.alpha_composite(im.convert("RGBA"), overlay).convert("RGB")
im = im.resize((900, 1125), Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(0.15))
im.save(OUT, format="PNG", optimize=True)
print(OUT)
