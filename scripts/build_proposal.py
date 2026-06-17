#!/usr/bin/env python3
"""Cruz Carpentry — proposal & invoices PDF generator (Elevation Web Dev Solutions)."""
import os, math
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ---------- fonts ----------
LIB = "/usr/share/fonts/truetype/liberation"
pdfmetrics.registerFont(TTFont("Serif",   f"{LIB}/LiberationSerif-Regular.ttf"))
pdfmetrics.registerFont(TTFont("SerifB",  f"{LIB}/LiberationSerif-Bold.ttf"))
pdfmetrics.registerFont(TTFont("SerifI",  f"{LIB}/LiberationSerif-Italic.ttf"))
pdfmetrics.registerFont(TTFont("Sans",    f"{LIB}/LiberationSans-Regular.ttf"))
pdfmetrics.registerFont(TTFont("SansB",   f"{LIB}/LiberationSans-Bold.ttf"))

DISP, DISPI, SERIF = "SerifB", "SerifI", "Serif"
SANS, SANSB = "Sans", "SansB"

# ---------- palette ----------
CREAM   = (0.980, 0.969, 0.949)
PAPER   = (1, 1, 1)
INK     = (0.110, 0.098, 0.090)
SOFT    = (0.341, 0.325, 0.302)
FAINT   = (0.55, 0.53, 0.50)
GREEN   = (0.180, 0.490, 0.275)
GREEND  = (0.122, 0.353, 0.196)
GOLD    = (0.706, 0.325, 0.035)
LINE    = (0.906, 0.882, 0.847)
FILL    = (0.945, 0.925, 0.890)
GREENBG = (0.92, 0.952, 0.93)

W, H = letter            # 612 x 792
M = 48                   # page margin

c = canvas.Canvas("/home/user/cruz-carpentry/Cruz-Carpentry-Proposal.pdf", pagesize=letter)
c.setTitle("Cruz Carpentry — Website Proposal & Invoices")
c.setAuthor("Elevation Web Dev Solutions")

# ---------- helpers ----------
def col(rgb): return rgb
def setf(rgb): c.setFillColorRGB(*rgb)
def sets(rgb): c.setStrokeColorRGB(*rgb)

def bg(rgb=CREAM):
    setf(rgb); c.rect(0, 0, W, H, fill=1, stroke=0)

def txt(x, y, s, font=SANS, size=10, color=INK, align="left"):
    setf(color); c.setFont(font, size)
    if align == "center": c.drawCentredString(x, y, s)
    elif align == "right": c.drawRightString(x, y, s)
    else: c.drawString(x, y, s)

def measure_tracked(s, font, size, tr):
    return sum(c.stringWidth(ch, font, size) for ch in s) + tr * (len(s) - 1)

def tracked(x, y, s, font=SANSB, size=8, color=SOFT, tr=2.2, align="left"):
    c.setFont(font, size)
    ws = [c.stringWidth(ch, font, size) for ch in s]
    total = sum(ws) + tr * (len(s) - 1)
    if align == "center": x -= total / 2
    elif align == "right": x -= total
    setf(color); cx = x
    for ch, w in zip(s, ws):
        c.drawString(cx, y, ch); cx += w + tr
    return total

def para(x, y, s, font=SANS, size=9.5, color=SOFT, width=300, leading=None, align="left"):
    leading = leading or size * 1.45
    setf(color); c.setFont(font, size)
    for ln in simpleSplit(s, font, size, width):
        if align == "center": c.drawCentredString(x, y, ln)
        elif align == "right": c.drawRightString(x, y, ln)
        else: c.drawString(x, y, ln)
        y -= leading
    return y

def rrect(x, y, w, h, r=10, fill=None, stroke=None, lw=1):
    if fill: setf(fill)
    if stroke: sets(stroke); c.setLineWidth(lw)
    c.roundRect(x, y, w, h, r, stroke=1 if stroke else 0, fill=1 if fill else 0)

def hline(x1, x2, y, color=LINE, lw=1):
    sets(color); c.setLineWidth(lw); c.line(x1, y, x2, y)

def star(cx, cy, r, color):
    p = c.beginPath()
    for i in range(10):
        ang = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.42
        x, y = cx + rr * math.cos(ang), cy + rr * math.sin(ang)
        p.moveTo(x, y) if i == 0 else p.lineTo(x, y)
    p.close(); setf(color); c.drawPath(p, fill=1, stroke=0)

def stars(x, y, size=9, color=GOLD, n=5):
    r = size * 0.52; gap = size * 1.5
    for i in range(n):
        star(x + r + i * gap, y + r * 0.55, r, color)
    return (r + (n - 1) * gap + r)

def footer(label):
    tracked(M, 34, "ELEVATION WEB DEV SOLUTIONS  ·  HIGHLANDS RANCH, COLORADO",
             SANSB, 6.3, FAINT, 1.8)
    tracked(W - M, 34, label, SANSB, 6.3, FAINT, 1.8, align="right")

def header(num, kicker, title, sub=None):
    tracked(M, H - 70, f"{num} · {kicker}", SANSB, 8, GREEN, 2.2)
    txt(M, H - 100, title, DISP, 23, INK)
    y = H - 120
    if sub:
        y = para(M, H - 120, sub, SERIF, 11, SOFT, width=W - 2 * M - 6, leading=15)
    return y

def check(x, y, color=GREEN, sz=8.5):
    s = sz / 8.5
    sets(color); c.setLineWidth(1.5 * s); c.setLineCap(1)
    p = c.beginPath()
    p.moveTo(x + 0.5 * s, y + 2.0 * s)
    p.lineTo(x + 3.0 * s, y - 1.0 * s)
    p.lineTo(x + 8.0 * s, y + 5.5 * s)
    c.drawPath(p, fill=0, stroke=1)

# =====================================================================
# PAGE 1 — COVER
# =====================================================================
bg()
# top rule band
tracked(M, H - 64, "CRUZ CARPENTRY", SANSB, 9, INK, 3.2)
tracked(M, H - 78, "CUSTOM CARPENTRY  ·  FINE MILLWORK  ·  COLORADO FRONT RANGE",
        SANSB, 6.6, SOFT, 2.0)
stars(W - M - 150, H - 74, 8)
tracked(W - M, H - 84, "5.0 ON GOOGLE", SANSB, 6.6, SOFT, 1.8, align="right")
hline(M, W - M, H - 92, LINE, 1)

# headline
y = H - 150
tracked(M, y, "PREPARED FOR CRUZ CARPENTRY  ·  JUNE 17, 2026", SANSB, 7.5, GREEN, 2.0)
txt(M, y - 44, "Your website,", DISP, 42, INK)
txt(M, y - 90, "and three honest", DISP, 42, INK)
txt(M, y - 136, "ways forward.", DISP, 42, INK)

para(M, y - 178,
     "You hired me to build a home page for $500. I went further — and built you a working "
     "business platform: a site that wins trust, quotes jobs on its own, and helps you hire the crew "
     "you told me was your real bottleneck. Here is everything that’s live, what it’s honestly "
     "worth, and three clear ways to make it yours. No surprises, no fine print.",
     SERIF, 12.5, SOFT, width=W - 2 * M - 40, leading=18)

# three chips
chips = ["A LIVE PROFESSIONAL SITE", "INSTANT ESTIMATES, 24/7", "A TOOL TO HIRE CREW"]
cx = M
cy = y - 300
for ch in chips:
    tw = measure_tracked(ch, SANSB, 7.5, 1.2)
    w = tw + 26
    rrect(cx, cy, w, 22, 11, fill=GREENBG, stroke=GREEN, lw=0.8)
    tracked(cx + 13, cy + 7.5, ch, SANSB, 7.5, GREEND, 1.2)
    cx += w + 10

# bottom meta block
by = 150
rrect(M, by, W - 2 * M, 70, 12, fill=PAPER, stroke=LINE, lw=1)
colw = (W - 2 * M) / 3
labels = [("FOR", "Cruz Carpentry", "Custom Millwork · (720) 280-0812"),
          ("FROM", "Tyler DeVries", "Elevation Web Dev Solutions · 720-708-0567"),
          ("PRICES HELD THROUGH", "July 17, 2026", "30 days from today")]
for i, (k, v, s) in enumerate(labels):
    x = M + 20 + i * colw
    tracked(x, by + 50, k, SANSB, 6.5, GREEN, 1.6)
    txt(x, by + 32, v, DISP, 12, INK)
    txt(x, by + 18, s, SANS, 7.5, SOFT)
footer("PROPOSAL  ·  PAGE 1 OF 8")
c.showPage()

# =====================================================================
# PAGE 2 — WHAT'S ALREADY BUILT  (value proof)
# =====================================================================
bg()
header("01", "WHAT’S ALREADY BUILT",
       "Everything that’s live right now.",
       "Real, working features on your site today — each at a fair market price any web studio would "
       "quote. You won’t pay this; it’s simply proof of what you’re holding.")

rows = [
    ("Animated home page", "7-chapter scroll “wood story,” hero, services preview", "$500"),
    ("16 custom service pages + hub", "Cabinetry, stairs, doors, wine rooms… each SEO-ready", "$1,600"),
    ("43-photo gallery", "Filterable by service, full-screen lightbox viewer", "$500"),
    ("Instant Estimate engine + wizard", "Live lumber-market pricing, smart ranges, lead scoring", "$2,000"),
    ("Careers / hiring portal", "Multi-step apply, résumé & photo uploads, file-type security", "$850"),
    ("Customer accounts + booking", "Clients log in, track their project, request a visit", "$600"),
    ("Admin dashboard", "Lead CRM, applicant review, live pricing rate editor", "$1,200"),
    ("About · FAQ · Contact · Service Areas", "Plus an 18-city Colorado coverage map", "$600"),
    ("Full Google SEO", "Structured data, sitemap, social share cards", "$500"),
    ("Secure backend", "Supabase database, spam defense, rate-limiting, tests", "$650"),
]
ty = H - 182
rh = 33
tracked(M + 28, ty + 8, "FEATURE — ALREADY LIVE & WORKING", SANSB, 6.8, FAINT, 1.4)
tracked(W - M - 14, ty + 8, "FAIR VALUE", SANSB, 6.8, FAINT, 1.4, align="right")
ty -= 6
for i, (name, desc, val) in enumerate(rows):
    yy = ty - (i + 1) * rh
    if i % 2 == 0:
        setf(PAPER); c.rect(M, yy, W - 2 * M, rh, fill=1, stroke=0)
    check(M + 12, yy + rh / 2 - 3)
    txt(M + 28, yy + rh / 2 + 2.5, name, SANSB, 9.7, INK)
    txt(M + 28, yy + rh / 2 - 8, desc, SANS, 7.6, SOFT)
    txt(W - M - 14, yy + rh / 2 - 3, val, SerifB := "SerifB", 12, INK, align="right")
    hline(M, W - M, yy, LINE, 0.6)

# total bar
tb = ty - len(rows) * rh - 14
rrect(M, tb - 30, W - 2 * M, 40, 10, fill=INK, stroke=None)
txt(M + 18, tb - 13, "Total fair market value of what’s built", SANSB, 11, CREAM)
txt(W - M - 18, tb - 14, "≈ $9,000", DISP, 20, (0.99, 0.84, 0.45), align="right")

para(M, tb - 50,
     "You agreed to $500 for the home page — and you’ve already paid a $100 deposit. The rest I "
     "built going above and beyond. So the real question isn’t “$9,000 or not.” It’s simply: "
     "how much of this do you want to keep? Three clear answers are next.",
     SERIF, 10.5, SOFT, width=W - 2 * M - 6, leading=15)
footer("PROPOSAL  ·  PAGE 2 OF 8")
c.showPage()

# =====================================================================
# PAGE 3 — THREE OPTIONS  (Good / Better / Best)
# =====================================================================
bg()
tracked(M, H - 70, "02 · YOUR THREE OPTIONS", SANSB, 8, GREEN, 2.2)
txt(M, H - 100, "Pick what fits. Keep what you want.", DISP, 23, INK)
para(M, H - 120,
     "From a simple business card to the full platform — your call, no pressure. Every option is "
     "yours to own, with a $100 deposit already credited.",
     SERIF, 11, SOFT, width=W - 2 * M - 6, leading=15)

def option_block(y, h, letter_, name, tagline, bullets, was, price, due, monthly,
                 badge=None, accent=LINE, highlight=False):
    border = GREEN if highlight else (GOLD if badge == "BEST VALUE" else LINE)
    lw = 1.6 if (highlight or badge) else 1
    rrect(M, y, W - 2 * M, h, 14, fill=PAPER, stroke=border, lw=lw)
    # left text zone
    lx = M + 22
    # letter badge
    setf(GREEN if highlight else INK)
    c.circle(lx + 9, y + h - 24, 12, fill=1, stroke=0)
    txt(lx + 9, y + h - 28, letter_, DISP, 13, PAPER, align="center")
    txt(lx + 30, y + h - 20, name, DISP, 16, INK)
    txt(lx + 30, y + h - 34, tagline, DISPI, 10, SOFT)
    # badge pill
    if badge:
        bw = c.stringWidth(badge, SANSB, 7) + 18
        bc = GREEN if highlight else GOLD
        rrect(W - M - 22 - bw, y + h - 26, bw, 16, 8, fill=bc, stroke=None)
        tracked(W - M - 22 - bw + 9, y + h - 21, badge, SANSB, 7, PAPER, 1.0)
    # bullets (two columns inside left zone)
    by0 = y + h - 52
    colw = (W - 2 * M - 200) / 2
    for i, b in enumerate(bullets):
        cx = lx + (0 if i < (len(bullets) + 1) // 2 else colw + 10)
        ci = i if i < (len(bullets) + 1) // 2 else i - (len(bullets) + 1) // 2
        yy = by0 - ci * 16
        new = b.endswith("|NEW")
        b2 = b.replace("|NEW", "")
        check(cx, yy, GREEN if not new else GOLD)
        txt(cx + 12, yy, b2, SANS, 8.3, INK)
        if new:
            txt(cx + 12 + c.stringWidth(b2, SANS, 8.3) + 5, yy, "NEW", SANSB, 6.5, GOLD)
    # price panel (right)
    px = W - M - 168
    sets(LINE); c.setLineWidth(1); c.line(px - 6, y + 14, px - 6, y + h - 14)
    pcx = px + 78
    if was:
        wtxt = f"was {was}"
        txt(pcx, y + h - 30, wtxt, SANS, 9, FAINT, align="center")
        wsx = pcx - c.stringWidth(wtxt, SANS, 9) / 2
        hline(wsx, wsx + c.stringWidth(wtxt, SANS, 9), y + h - 27, FAINT, 0.8)
    txt(pcx, y + h - 58, price, DISP, 30, GREEN if highlight else INK, align="center")
    txt(pcx, y + h - 70, "one-time", SANS, 7.5, FAINT, align="center")
    rrect(px, y + 40, 156, 22, 8, fill=FILL, stroke=None)
    txt(pcx, y + 47, due, SANSB, 11, INK, align="center")
    txt(pcx, y + 22, monthly, SANS, 8.2, SOFT, align="center")
    return

gap = 12
top = H - 152
h1, h2, h3 = 118, 168, 150
y1 = top - h1
option_block(y1, h1, "A", "Just the Landing Page", "The original agreement.",
    ["Animated one-page home", "Sharp on phone & desktop",
     "Your photos placed", "Launch + domain + 30-day support",
     "You own the code outright"],
    None, "$500", "$400 due after deposit", "or $50 / mo × 8 months")

y2 = y1 - gap - h2
option_block(y2, h2, "B", "The Professional Site", "Everything public-facing.",
    ["Everything in the Landing Page", "16 service pages + services hub",
     "43-photo filterable gallery", "About · FAQ · Contact · 18-city areas",
     "Instant Estimate → leads to inbox", "Careers portal → résumés to inbox",
     "Full Google SEO + structured data", "Spam-proof secure backend"],
    "$7,200", "$1,900", "$1,800 due after deposit", "or $150 / mo × 12 months",
    badge="MOST POPULAR", highlight=True)

y3 = y2 - gap - h3
option_block(y3, h3, "C", "The Complete Platform", "The whole machine, plus more.",
    ["Everything in the Professional Site", "Customer logins — clients track projects",
     "Admin dashboard — lead CRM + hiring", "Live pricing rate editor",
     "Full Spanish version of the site|NEW", "Project materials shopping list|NEW"],
    "$10,800", "$2,600", "$2,500 due after deposit", "or $210 / mo × 12 months",
    badge="BEST VALUE")

# care strip
cs = y3 - 30
rrect(M, cs - 2, W - 2 * M, 24, 8, fill=GREENBG, stroke=GREEN, lw=0.8)
txt(M + 16, cs + 5, "+  $49 / mo Website + Care on any option", SANSB, 9.5, GREEND)
txt(W - M - 16, cs + 5, "hosting · backups · edits · your GoDaddy domain, managed",
    SANS, 8, GREEND, align="right")
footer("PROPOSAL  ·  PAGE 3 OF 8")
c.showPage()

# =====================================================================
# PAGE 4 — THE HIRING ENGINE (flagship)
# =====================================================================
bg()
header("03", "YOUR REAL BOTTLENECK",
       "Your problem isn’t customers — it’s crew.",
       "When we met, this was the real story: the work is there and the customers are there. What’s "
       "hard is finding good people to build it with you. The same website becomes your best recruiting "
       "tool — and I can run the whole thing for you.")

# included card
iy = H - 302
rrect(M, iy, (W - 2 * M - 14) / 2, 130, 12, fill=PAPER, stroke=LINE, lw=1)
ix = M + 18
tracked(ix, iy + 108, "BUILT IN  ·  INCLUDED IN OPTIONS B & C", SANSB, 7, GREEN, 1.4)
txt(ix, iy + 88, "Your Careers Portal", DISP, 15, INK)
for i, b in enumerate(["A “We’re Hiring” page that sells the job",
                       "Apply from a phone in two minutes",
                       "Résumés & work photos land in your inbox",
                       "Review & rate applicants in your dashboard (C)"]):
    yy = iy + 66 - i * 16
    check(ix, yy); txt(ix + 13, yy, b, SANS, 8.6, INK)

# managed service card
mx = M + (W - 2 * M - 14) / 2 + 14
rrect(mx, iy, (W - 2 * M - 14) / 2, 130, 12, fill=INK, stroke=None)
mxi = mx + 18
tracked(mxi, iy + 108, "FLAGSHIP GROWTH SERVICE  ·  OPTIONAL", SANSB, 7, (0.99, 0.84, 0.45), 1.4)
txt(mxi, iy + 88, "Managed Hiring", DISP, 15, CREAM)
txt(mx + (W - 2 * M - 14) / 2 - 18, iy + 90, "$299/mo", DISP, 17, (0.99, 0.84, 0.45), align="right")
for i, b in enumerate(["I post your openings to Indeed, Facebook & local boards",
                       "I screen applicants — you only meet the good ones",
                       "You stay focused on the work, not the hiring"]):
    yy = iy + 66 - i * 17
    setf((0.99, 0.84, 0.45)); c.setFont(SANSB, 8.5); c.drawString(mxi, yy, "→")
    txt(mxi + 14, yy, b, SANS, 8.4, CREAM)

# 60-day promise band
py = iy - 70
rrect(M, py, W - 2 * M, 56, 12, fill=GREENBG, stroke=GREEN, lw=1)
tracked(M + 20, py + 38, "MY 60-DAY PROMISE", SANSB, 8, GREEND, 1.8)
para(M + 20, py + 22,
     "Qualified applicants within 60 days, or your next month is free. You carry none of the risk — "
     "if it isn’t working, you don’t keep paying.",
     SERIF, 10.5, GREEND, width=W - 2 * M - 40, leading=14)

# ROI math
ry = py - 96
txt(M, ry + 60, "The math isn’t close.", DISP, 16, INK)
para(M, ry + 38,
     "The full hiring service runs $3,588 a year. One reliable carpenter lets you take on tens of "
     "thousands of dollars in work you’re currently turning away — so it pays for itself many times "
     "over with a single good hire. That’s why it’s the one service that actually moves the needle.",
     SERIF, 11, SOFT, width=W - 2 * M - 6, leading=16)
footer("PROPOSAL  ·  PAGE 4 OF 8")
c.showPage()

# =====================================================================
# INVOICE PAGES 5-7
# =====================================================================
def invoice(page_no, inv_id, opt_title, opt_sub, line_items, value_label, your_price,
            balance, monthly, recommended=False):
    bg()
    # masthead
    tracked(M, H - 64, "INVOICE", SANSB, 9, GREEN, 3.0)
    txt(M, H - 92, opt_title, DISP, 24, INK)
    txt(M, H - 110, opt_sub, DISPI, 11, SOFT)
    if recommended:
        bw = c.stringWidth("RECOMMENDED", SANSB, 7) + 18
        rrect(W - M - bw, H - 70, bw, 16, 8, fill=GREEN, stroke=None)
        tracked(W - M - bw + 9, H - 65, "RECOMMENDED", SANSB, 7, PAPER, 1.0)
    hline(M, W - M, H - 122, LINE, 1)

    # from / bill-to / meta
    fy = H - 140
    tracked(M, fy, "FROM", SANSB, 6.8, GREEN, 1.6)
    txt(M, fy - 15, "Elevation Web Dev Solutions", SANSB, 10, INK)
    txt(M, fy - 28, "Tyler DeVries · Highlands Ranch, CO", SANS, 8.3, SOFT)
    txt(M, fy - 40, "720-708-0567 · tyler@elevationwebdevsolutions.com", SANS, 8.3, SOFT)
    bx = M + (W - 2 * M) * 0.42
    tracked(bx, fy, "BILL TO", SANSB, 6.8, GREEN, 1.6)
    txt(bx, fy - 15, "Cruz Carpentry", SANSB, 10, INK)
    txt(bx, fy - 28, "Custom Millwork · Colorado Front Range", SANS, 8.3, SOFT)
    txt(bx, fy - 40, "(720) 280-0812", SANS, 8.3, SOFT)
    mx = W - M
    txt(mx, fy - 1, inv_id, SANSB, 9.5, INK, align="right")
    txt(mx, fy - 15, "Date: June 17, 2026", SANS, 8.3, SOFT, align="right")
    txt(mx, fy - 28, "Due: on acceptance", SANS, 8.3, SOFT, align="right")
    setf(GREEN); c.setFont(SANSB, 8.3); c.drawRightString(mx, fy - 41, "Status: Deposit Paid")

    # line item table
    ty = fy - 66
    tracked(M + 12, ty, "WHAT’S INCLUDED", SANSB, 6.8, FAINT, 1.4)
    tracked(W - M - 12, ty, "PRICE", SANSB, 6.8, FAINT, 1.4, align="right")
    ty -= 6
    rh = 21
    for i, (name, val) in enumerate(line_items):
        yy = ty - (i + 1) * rh
        if i % 2 == 0:
            setf(PAPER); c.rect(M, yy, W - 2 * M, rh, fill=1, stroke=0)
        inc = val.lower() in ("included", "new")
        check(M + 12, yy + 6, GREEN if val.lower() != "new" else GOLD)
        txt(M + 28, yy + 6, name, SANS, 9.2, INK)
        vcol = GREEN if val.lower() == "included" else (GOLD if val.lower() == "new" else INK)
        txt(W - M - 12, yy + 6, val, SANSB if inc else SerifB, 8.5 if inc else 11, vcol, align="right")
        hline(M, W - M, yy, LINE, 0.5)

    # totals block
    by = ty - len(line_items) * rh - 16
    tot_x = W - M
    lab_x = W - M - 230
    def trow(yy, label, value, bold=False, color=INK):
        txt(lab_x, yy, label, SANSB if bold else SANS, 10 if bold else 9.3,
            INK if bold else SOFT)
        txt(tot_x, yy, value, SANSB if bold else SANS, 11 if bold else 9.3, color, align="right")
    trow(by, value_label[0], value_label[1])
    trow(by - 16, "Your price (one-time)", your_price)
    trow(by - 32, "Deposit already paid", "– $100.00", color=GREEN)
    hline(lab_x, tot_x, by - 42, LINE, 1)
    # balance due bar
    rrect(lab_x - 12, by - 78, (tot_x - lab_x) + 24, 30, 8, fill=INK, stroke=None)
    txt(lab_x, by - 68, "Balance due", SANSB, 11, CREAM)
    txt(tot_x, by - 69, balance, DISP, 16, (0.99, 0.84, 0.45), align="right")
    txt(tot_x, by - 96, monthly, SANS, 9, SOFT, align="right")

    # care + next steps
    cy = by - 142
    rrect(M, cy, W - 2 * M, 30, 8, fill=GREENBG, stroke=GREEN, lw=0.8)
    txt(M + 16, cy + 11, "+  $49 / mo Website + Care", SANSB, 9.5, GREEND)
    txt(W - M - 16, cy + 11, "hosting · backups · edits · GoDaddy domain managed on Vercel",
        SANS, 8, GREEND, align="right")

    ny = cy - 22
    para(M, ny,
         "Pay by bank transfer, check, or card. Cancel any monthly plan with 30 days’ notice — no "
         "lock-in, ever. Prices held through July 17, 2026. Questions? Call or text 720-708-0567.",
         SERIF, 9.5, SOFT, width=W - 2 * M - 6, leading=13)
    footer(f"INVOICE {inv_id}  ·  PAGE {page_no} OF 8")
    c.showPage()

# Invoice A
invoice(5, "INV-CRUZ-A", "Option A — Just the Landing Page",
        "The original agreement: your home page, finished.",
        [("Custom animated home page — design, build & copy", "$500.00"),
         ("Mobile + desktop responsive build", "Included"),
         ("Your photos placed & color-matched", "Included"),
         ("Launch, domain setup & 30-day support", "Included"),
         ("Full ownership of the code", "Included")],
        ("Project total", "$500.00"), "$500.00",
        "$400.00", "or $50 / mo × 8 months ($400)")

# Invoice B
invoice(6, "INV-CRUZ-B", "Option B — The Professional Site",
        "Your full public-facing platform.",
        [("Everything in the Landing Page", "Included"),
         ("16 custom service pages + services hub", "Included"),
         ("43-photo filterable gallery + lightbox", "Included"),
         ("About · FAQ · Contact · 18-city Service Areas", "Included"),
         ("Instant Estimate engine + wizard (leads to inbox)", "Included"),
         ("Careers / hiring portal (résumés to inbox)", "Included"),
         ("Full Google SEO + structured data + social cards", "Included"),
         ("Secure backend, spam defense & rate-limiting", "Included")],
        ("Bundle fair value", "$7,200.00"), "$1,900.00",
        "$1,800.00", "or $150 / mo × 12 months ($1,800)", recommended=True)

# Invoice C
invoice(7, "INV-CRUZ-C", "Option C — The Complete Platform",
        "The whole machine, plus a bilingual reach.",
        [("Everything in the Professional Site", "Included"),
         ("Customer accounts + login (clients track projects)", "Included"),
         ("Admin dashboard — lead CRM + applicant review", "Included"),
         ("Live pricing rate editor", "Included"),
         ("Consultation booking portal", "Included"),
         ("Full Spanish version of the entire site", "New"),
         ("Project materials shopping list (auto cut/material list)", "New")],
        ("Bundle fair value", "$10,800.00"), "$2,600.00",
        "$2,500.00", "or $210 / mo × 12 months ($2,520)")

# =====================================================================
# PAGE 8 — HOW TO SAY YES
# =====================================================================
bg()
header("04", "NEXT STEPS",
       "Three ways to say yes.",
       "No pressure and no lock-in. Pick the option that fits today — you can always step up later, "
       "and your deposit carries to whichever you choose.")

steps = [("1", "Pick A, B or C", "Text the letter to 720-708-0567, or sign below. The $100 deposit is already credited."),
         ("2", "I finish & launch it", "I build, host on Vercel, and point your CustomCarpentryColorado.com domain — fast."),
         ("3", "Live & cared for", "It goes live, I keep it running for $49/mo, and you add Managed Hiring whenever the crew problem bites.")]
sy = H - 296
sw = (W - 2 * M - 28) / 3
for i, (n, t, d) in enumerate(steps):
    x = M + i * (sw + 14)
    rrect(x, sy, sw, 120, 12, fill=PAPER, stroke=LINE, lw=1)
    setf(GREEN); c.circle(x + 24, sy + 96, 13, fill=1, stroke=0)
    txt(x + 24, sy + 92, n, DISP, 14, PAPER, align="center")
    txt(x + 16, sy + 64, t, DISP, 13, INK)
    para(x + 16, sy + 46, d, SANS, 8.6, SOFT, width=sw - 32, leading=12)

# recommendation callout
ry = sy - 96
rrect(M, ry, W - 2 * M, 78, 12, fill=INK, stroke=None)
tracked(M + 22, ry + 56, "MY HONEST RECOMMENDATION", SANSB, 7.5, (0.99, 0.84, 0.45), 1.8)
para(M + 22, ry + 40,
     "Go with Option B — it’s the whole public platform for $1,800, the best balance of value and "
     "cost. If hiring is truly your #1 problem, Option C plus Managed Hiring is the package that fixes "
     "it: the admin CRM and Spanish site widen who can find and work for you.",
     SERIF, 10.5, CREAM, width=W - 2 * M - 44, leading=15)

# signature
gy = ry - 70
txt(M, gy + 40, "Accepted by", SANSB, 9, INK)
hline(M, M + 230, gy + 14, INK, 1)
txt(M, gy + 4, "Signature", SANS, 8, FAINT)
hline(W - M - 180, W - M, gy + 14, INK, 1)
txt(W - M - 180, gy + 4, "Date", SANS, 8, FAINT)

txt(M, gy - 26, "Questions? Call or text Tyler at 720-708-0567 — plain English, no jargon.",
    SERIF, 10, SOFT)
footer("PROPOSAL  ·  PAGE 8 OF 8")
c.showPage()

c.save()
print("OK wrote Cruz-Carpentry-Proposal.pdf")
