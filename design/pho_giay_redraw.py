"""Phố Giấy board and land card, drawn with cloveric/claude-drawing-skill.

Artwork uses its Ballpoint renderer; layout and Vietnamese type use Pillow.
"""
from __future__ import annotations

import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".drawing-skill" / "lib"))
from ballpoint import Ballpoint, PENCILS, PENS  # noqa: E402

OUT = ROOT / "design" / "mockup"
OUT.mkdir(exist_ok=True)

PAPER = "#F1ECE2"
PANEL = "#E7E0D1"
INK = "#22262B"
INK2 = "#5E6266"
NEUTRAL = "#D9C8A6"
RUST = "#B0472F"
OCHRE = "#D49A2A"
COOL = "#2E6B6B"
COOLL = "#DCE8E4"
DISTRICTS = ["#8A6A4F", "#A9C1D6", "#C98A7A", "#C9773A", "#9E3B32", "#D49A2A", "#4C6E52", "#34506E"]

PENS["blue"] = (0.14, 0.17, 0.20)
PENS["red"] = (0.65, 0.26, 0.17)
PENCILS["teal"] = COOL
PENCILS["sky"] = "#A9C1D6"
PENCILS["brown"] = "#8A6A4F"
PENCILS["orange"] = "#C9773A"
PENCILS["rose"] = "#C98A7A"
PENCILS["ochre"] = OCHRE
PENCILS["leaf"] = "#4C6E52"

FONTS = Path("C:/Windows/Fonts")
def font(size, bold=False, mono=False, serif=False):
    name = "cambriai.ttf" if serif else "cour.ttf" if mono else "arialbd.ttf" if bold else "arial.ttf"
    return ImageFont.truetype(str(FONTS / name), size)

def line(b, pts, pen="blue", pressure=.62, width=1.55):
    b.line(pts, pen, pressure, width=width, smooth=False, wobble=.40, hook=.1, gloop=.1)

def house(b, x, y, w, h, pencil="brown"):
    roof = [(x-3,y),(x+w/2,y-h*.48),(x+w+3,y)]
    line(b, roof, width=1.7)
    line(b, [(x,y),(x,y+h),(x+w,y+h),(x+w,y)], width=1.5)
    line(b, [(x+w*.38,y+h),(x+w*.38,y+h*.45),(x+w*.63,y+h*.45),(x+w*.63,y+h)], width=1.2)
    line(b, [(x+w*.12,y+h*.25),(x+w*.27,y+h*.25),(x+w*.27,y+h*.48),(x+w*.12,y+h*.48)], width=1.1)
    b.pencil(b.poly(roof+[(x-3,y+2)]), pencil, angle=35, pressure=.19, spacing=5, length=(10,22), width=1.9)

def tree(b,x,y,r=13):
    b.pencil(b.ellipse(x,y,r,r*.78),"leaf",angle=58,pressure=.24,spacing=5,length=(8,18),width=1.8)
    line(b,b.circle_pts(x,y,r,r*.78),width=1.25)
    line(b,[(x,y+r*.7),(x,y+r*2)],width=1.2)

def person(b,x,y,s=1):
    b.dot(x,y,2.5*s,"blue",.7)
    line(b,[(x,y+4*s),(x,y+17*s)],width=1.2)
    line(b,[(x-7*s,y+8*s),(x,y+7*s),(x+6*s,y+11*s)],width=1.1)
    line(b,[(x,y+17*s),(x-5*s,y+27*s)],width=1.1)
    line(b,[(x,y+17*s),(x+5*s,y+27*s)],width=1.1)

def draw_city():
    b = Ballpoint(844,844,seed=42,ss=2,pen_width=1.6)
    b.paper(tone=PANEL,fibres=180,mottle=.010,cockle=.3,vignette=.015)
    plots=[
        ([(28,28),(162,28),(167,190),(28,187)],"brown"),
        ([(230,25),(367,25),(370,195),(242,183)],"sky"),
        ([(410,34),(556,38),(560,202),(410,197)],"rose"),
        ([(639,28),(813,34),(815,190),(631,193)],"orange"),
        ([(32,288),(153,292),(160,488),(27,490)],"ochre"),
        ([(394,294),(544,301),(547,490),(390,484)],"leaf"),
        ([(641,283),(819,291),(819,492),(641,487)],"teal"),
        ([(29,600),(164,594),(168,815),(29,814)],"sky"),
        ([(219,611),(351,602),(355,815),(220,818)],"leaf"),
        ([(424,609),(551,604),(554,812),(425,818)],"rose"),
        ([(627,609),(815,604),(815,819),(627,817)],"brown"),
    ]
    for polygon,colour in plots:
        b.pencil(b.poly(polygon),colour,angle=54,pressure=.08,spacing=8,length=(18,36),width=1.7)
    # Streets and the river give the drawing a legible city structure.
    river=[(120,-15),(150,95),(137,192),(185,300),(205,398),(182,494),(230,625),(238,865)]
    b.pencil(b.band(river,37),"sky",angle=70,pressure=.26,spacing=5,length=(20,42),width=2)
    for shift in (-14,0,14):
        line(b,[(x+shift,y) for x,y in river],"blue",.32,1.1)
    roads=[
        [(20,220),(170,235),(320,225),(455,240),(670,225),(830,245)],
        [(15,535),(150,525),(300,545),(465,530),(690,548),(835,540)],
        [(325,5),(330,145),(345,290),(365,420),(360,625),(375,845)],
        [(590,-10),(575,175),(585,325),(565,470),(590,650),(570,850)],
        [(80,100),(220,190),(365,330),(500,455),(650,620),(785,760)],
    ]
    for p in roads:
        line(b,p,"blue",.38,1.5)
    homes=[(55,55,55,48,"brown"),(246,68,67,58,"rose"),(420,90,48,49,"orange"),
           (675,60,65,55,"ochre"),(70,320,58,55,"brown"),(400,350,62,52,"rose"),
           (700,340,56,54,"orange"),(45,650,68,52,"ochre"),(250,650,54,48,"leaf"),
           (455,675,66,55,"brown"),(685,670,61,53,"sky"),(65,110,34,28,"brown"),
           (290,123,36,31,"sky"),(482,137,35,28,"rose"),(755,115,35,31,"orange"),
           (77,391,34,30,"ochre"),(448,425,38,28,"leaf"),(753,408,32,27,"teal"),
           (87,719,36,29,"sky"),(277,715,32,29,"leaf"),(480,738,34,29,"rose"),
           (749,731,31,28,"brown")]
    for args in homes: house(b,*args)
    for x,y,r in [(260,155,12),(465,170,14),(745,180,13),(95,465,14),(467,490,13),
                  (770,465,13),(80,775,12),(305,765,14),(655,800,14),
                  (110,95,8),(340,168,8),(540,185,10),(795,90,8),(135,447,8),
                  (528,449,9),(796,451,8),(137,748,8),(348,750,8),(529,770,8)]:
        tree(b,x,y,r)
    for x,y in [(114,174),(515,117),(740,285),(280,445),(490,590),(120,615),(675,725)]:
        person(b,x,y,.95)
    # Bridges and a small civic square add memorable landmarks.
    for yy in (225,535):
        line(b,[(164,yy-13),(215,yy-12)],"red",.58,1.8)
        line(b,[(164,yy+13),(215,yy+12)],"red",.58,1.8)
    b.ring(478,389,54,47,"red",.43)
    b.save(str(OUT/"city_ballpoint.png"))
    return Image.open(OUT/"city_ballpoint.png").convert("RGB")

def draw_alley():
    b=Ballpoint(540,270,seed=73,ss=2,pen_width=1.65)
    b.paper(tone=PAPER,fibres=85,mottle=.008,cockle=.15,vignette=0)
    # Narrow whitewashed alley, a child with chalk, and a neighbour's window.
    line(b,[(12,30),(168,44),(168,240),(12,258)],width=1.5)
    line(b,[(528,18),(374,53),(374,238),(528,256)],width=1.5)
    line(b,[(168,44),(262,90),(374,53)],width=1.2)
    line(b,[(168,240),(270,219),(374,238)],width=1.1)
    line(b,[(15,130),(168,139)],width=1)
    line(b,[(374,145),(528,131)],width=1)
    line(b,[(48,81),(119,87),(119,143),(48,142),(48,81)],width=1.3)
    line(b,[(85,84),(85,143)],width=1)
    line(b,[(417,64),(489,50),(489,126),(417,132),(417,64)],width=1.3)
    b.pencil(b.poly([(12,32),(168,45),(168,238),(12,256)]),"brown",angle=63,pressure=.10,spacing=7,length=(15,35),width=2)
    b.pencil(b.poly([(374,53),(528,18),(528,253),(374,238)]),"sky",angle=75,pressure=.09,spacing=7,length=(18,35),width=2)
    # Chalk flowers on the wall.
    for x,y in [(65,183),(109,174),(127,212)]:
        b.ring(x,y,7,6,"red",.30)
        line(b,[(x,y+7),(x+2,y+22)],"red",.3,1)
    person(b,264,145,2.05)
    line(b,[(274,168),(321,189)],"red",.52,1.45)
    for x,y in [(321,189),(331,181),(342,194),(350,184)]:
        b.dot(x,y,2.1,"red",.4)
    tree(b,455,175,20)
    b.save(str(OUT/"alley_ballpoint.png"))
    return Image.open(OUT/"alley_ballpoint.png").convert("RGB")

TILES=[
("Nhà",0,0),("Ngõ Vôi",1,60),("Hàng xóm","h",0),("Ngõ Giếng",1,60),("Phí Chợ","tax",150),
("Ga Bắc","station",200),("Bến Đò",2,100),("Câu hỏi","q",0),("Bến Lưới",2,100),("Bến Trăng",2,120),
("Trạm Nghỉ",0,0),("Chợ Sớm",3,140),("Trạm Điện","util",150),("Chợ Hoa",3,140),("Chợ Đêm",3,160),
("Ga Đông","station",200),("Lò Gốm",4,180),("Hàng xóm","h",0),("Xưởng Mộc",4,180),("Phố Rèn",4,200),
("Công Viên",0,0),("Đình Làng",5,220),("Câu hỏi","q",0),("Phố Đèn Lồng",5,220),("Cửa Ô",5,240),
("Ga Nam","station",200),("Đồi Chè",6,260),("Đồi Gió",6,260),("Giếng Nước","util",150),("Đồi Nắng",6,280),
("Lạc Đường",0,0),("Vườn Ươm",7,300),("Vườn Sen",7,300),("Hàng xóm","h",0),("Vườn Mây",7,320),
("Ga Tây","station",200),("Câu hỏi","q",0),("Cảng Cá",8,350),("Phí Cảng","tax",100),("Hải Đăng",8,400)]

def wrapped(draw,text,ft,maxwidth):
    words=text.split(); rows=[]; row=""
    for word in words:
        cand=(row+" "+word).strip()
        if row and draw.textlength(cand,font=ft)>maxwidth:
            rows.append(row); row=word
        else: row=cand
    if row: rows.append(row)
    return rows

def tile_image(i,tile,w,h):
    name,group,price=tile
    im=Image.new("RGB",(w,h),PANEL if group==0 else PAPER)
    d=ImageDraw.Draw(im)
    d.rectangle((0,0,w-1,h-1),outline=INK,width=1)
    d.text((10,8),f"{i+1:02d}",font=font(13,mono=True),fill=NEUTRAL if group==0 else INK2)
    if isinstance(group,int) and group>0:
        color=DISTRICTS[group-1]
        d.rectangle((w-25,10,w-12,23),fill=color)
        for z in range(3): d.line((w-23+z*4,11,w-23+z*4,22),fill=PAPER,width=1)
    elif group=="q":
        d.text((w-27,7),"?",font=font(22,bold=True),fill=OCHRE)
    elif group=="h":
        d.ellipse((w-24,12,w-14,22),outline=COOL,width=2)
    elif group=="station":
        d.line((w-23,12,w-23,26),fill="#6F90AE",width=2)
        d.line((w-17,12,w-17,26),fill="#6F90AE",width=2)
    elif group=="util":
        d.ellipse((w-23,12,w-12,23),fill=COOL)
    elif group=="tax":
        d.rectangle((w-24,12,w-13,23),outline=INK2,width=1)
    y=35 if h>125 else 29
    fs=20 if group==0 else 15 if w<110 else 16
    ft=font(fs,bold=True)
    for row in wrapped(d,name,ft,w-18)[:2]:
        d.text((9,y),row,font=ft,fill=INK)
        y+=fs+2
    if isinstance(group,int) and group>0:
        # Tiny neighbour's house instead of the previous exclamation-mark figure.
        hx,hy=w-35,h-48
        d.line((hx-11,hy,hx,hy-9,hx+11,hy),fill=INK2,width=1)
        d.rectangle((hx-8,hy,hx+8,hy+12),outline=INK2,width=1)
        d.rectangle((hx-2,hy+5,hx+3,hy+12),outline=INK2,width=1)
        d.line((9,h-29,w-9,h-29),fill=NEUTRAL,width=1)
        d.text((9,h-25),f"{price} ₫g",font=font(15,bold=True),fill=INK)
    elif group==0:
        # Four special corners, each with its own quiet symbol.
        color=OCHRE if i==0 else COOL if i==20 else RUST if i==30 else INK2
        d.ellipse((w-41,h-55,w-19,h-33),outline=color,width=2)
    return im

def make_board(city):
    S=1200; margin=20; corner=158; edge=(S-2*margin-2*corner)/9
    board=Image.new("RGB",(S,S),PAPER)
    d=ImageDraw.Draw(board)
    d.rectangle((margin+corner,margin+corner,S-margin-corner-1,S-margin-corner-1),fill=PANEL)
    board.paste(city,(margin+corner,margin+corner))
    for i,tile in enumerate(TILES):
        if i==0: x=y=S-margin-corner; w=h=corner; rot=0
        elif i<10: x=round(S-margin-corner-i*edge);y=S-margin-corner;w=round(edge);h=corner;rot=0
        elif i==10: x=margin;y=S-margin-corner;w=h=corner;rot=0
        elif i<20: x=margin;y=round(S-margin-corner-(i-10)*edge);w=corner;h=round(edge);rot=90
        elif i==20: x=y=margin;w=h=corner;rot=0
        elif i<30: x=round(margin+corner+(i-21)*edge);y=margin;w=round(edge);h=corner;rot=180
        elif i==30: x=S-margin-corner;y=margin;w=h=corner;rot=0
        else: x=S-margin-corner;y=round(margin+corner+(i-31)*edge);w=corner;h=round(edge);rot=270
        if rot in (90,270):
            a=tile_image(i,tile,h,w).rotate(rot,expand=True)
        elif rot==180:
            a=tile_image(i,tile,w,h).rotate(rot,expand=True)
        else: a=tile_image(i,tile,w,h)
        board.paste(a,(int(x),int(y)))
    d=ImageDraw.Draw(board)
    # Main hierarchy sits on a translucent paper cartouche, over the illustrated map.
    box=(455,465,768,640)
    d.rectangle(box,fill=PAPER,outline=INK,width=1)
    d.text((476,483),"PHỐ GIẤY",font=font(45,bold=True),fill=INK)
    d.line((476,545,747,545),fill=RUST,width=3)
    d.text((476,565),"một thành phố có người sống",font=font(18,serif=True),fill=INK2)
    d.text((476,602),"40 Ô  /  8 QUẬN  /  2–6 NGƯỜI",font=font(13,mono=True),fill=INK2)
    for x,y in ((200,200),(1000,200),(200,1000),(1000,1000)):
        d.line((x-8,y,x+8,y),fill=INK,width=1);d.line((x,y-8,x,y+8),fill=INK,width=1)
    board.save(OUT/"board_redraw.png")
    return board

def make_card(alley):
    W,H=630,880
    im=Image.new("RGB",(W,H),PAPER);d=ImageDraw.Draw(im)
    d.rectangle((1,1,W-2,H-2),outline=INK,width=2)
    d.text((40,31),"PHỐ GIẤY  /  NGÕ ĐẤT",font=font(21),fill=INK2)
    d.text((510,31),"02 / 40",font=font(18,mono=True),fill=INK2)
    d.line((40,70,590,70),fill=INK,width=2)
    d.text((40,88),"AI SỐNG Ở ĐÂY?",font=font(23,bold=True),fill=RUST)
    d.rectangle((556,91,579,114),fill=DISTRICTS[0])
    d.text((40,131),"Ngõ Vôi",font=font(58,bold=True),fill=INK)
    d.text((40,203),"Tường vôi trắng, trẻ con vẽ phấn",font=font(26,serif=True),fill=INK2)
    d.text((40,235),"lên chân tường.",font=font(26,serif=True),fill=INK2)
    im.paste(alley,(45,290))
    d=ImageDraw.Draw(im)
    d.line((40,588,590,588),fill=NEUTRAL,width=2)
    rents=[("đất trống","4 ₫g"),("1 nhà","20 ₫g"),("2 nhà","60 ₫g"),
           ("3 nhà","160 ₫g"),("4 nhà","220 ₫g"),("phố","280 ₫g")]
    for j,(label,value) in enumerate(rents):
        yy=606+j*32
        d.text((40,yy),label,font=font(22,mono=True),fill=INK2)
        vw=d.textlength(value,font=font(22,mono=True))
        d.text((588-vw,yy),value,font=font(22,mono=True),fill=INK)
    d.line((40,808,590,808),fill=NEUTRAL,width=2)
    d.text((40,822),"MUA 60 ₫g",font=font(25,bold=True),fill=RUST)
    d.text((270,826),"XÂY 50  ·  CẦM 30 ₫g",font=font(17,mono=True),fill=INK2)
    im.save(OUT/"card_redraw.png")
    return im

if __name__=="__main__":
    city=draw_city()
    alley=draw_alley()
    make_board(city)
    make_card(alley)
    print(OUT)
