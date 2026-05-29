import cairosvg

# Trace logo: ornamental T
# Wide crossbar with inward-curling scroll ends (like a ribbon bow)
# Short, wide stem with U-curve bottom — clearly a T, not anything else
# Purple gradient, white background, "Trace" wordmark below

svg = """<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="grad" x1="30%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#c4b5fd"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>

  <rect width="1024" height="1024" fill="white"/>

  <!-- ===== LEFT SCROLL =====
       A ribbon that flows from center-left OUTWARD and UP,
       then curls BACK inward (clockwise loop), ending inside itself.
       Think of the left half of a butterfly's upper wing. -->
  <path d="
    M 490 430
    C 470 400, 420 360, 370 340
    C 330 325, 295 335, 285 360
    C 273 388, 292 418, 325 425
    C 355 432, 385 415, 390 392
    C 395 372, 380 355, 362 355
  "
  fill="none" stroke="url(#grad)" stroke-width="32"
  stroke-linecap="round" stroke-linejoin="round"/>

  <!-- ===== RIGHT SCROLL ===== (mirror of left) -->
  <path d="
    M 534 430
    C 554 400, 604 360, 654 340
    C 694 325, 729 335, 739 360
    C 751 388, 732 418, 699 425
    C 669 432, 639 415, 634 392
    C 629 372, 644 355, 662 355
  "
  fill="none" stroke="url(#grad)" stroke-width="32"
  stroke-linecap="round" stroke-linejoin="round"/>

  <!-- ===== STEM LEFT EDGE =====
       Goes from crossbar junction straight down, then curves RIGHT at bottom. -->
  <path d="
    M 490 430
    L 490 590
    C 490 630, 495 650, 512 658
  "
  fill="none" stroke="url(#grad)" stroke-width="32"
  stroke-linecap="round" stroke-linejoin="round"/>

  <!-- ===== STEM RIGHT EDGE =====
       Goes from crossbar junction straight down, then curves LEFT at bottom
       to meet the left edge, completing the rounded U. -->
  <path d="
    M 534 430
    L 534 590
    C 534 630, 529 650, 512 658
  "
  fill="none" stroke="url(#grad)" stroke-width="32"
  stroke-linecap="round" stroke-linejoin="round"/>

  <!-- ===== WORDMARK ===== -->
  <text
    x="512" y="800"
    font-family="'Helvetica Neue', 'Arial', sans-serif"
    font-size="136"
    font-weight="300"
    fill="#111111"
    text-anchor="middle"
    letter-spacing="4"
  >Trace</text>
</svg>"""

cairosvg.svg2png(
    bytestring=svg.encode(),
    write_to="/home/user/Trace/public/trace-logo.png",
    output_width=1024,
    output_height=1024
)
print("Done")
