# LANDING_PAGE_MOTION_DESIGN.md

> Trạng thái: hướng thiết kế lưu trữ. Trang hiện tại dùng bài đọc biên tập và không còn phần model 3D hay cuộn theo cảnh.

## 1. Mục tiêu

Thiết kế landing page theo ngôn ngữ hình ảnh của ảnh tham chiếu:

- Chất liệu giấy cũ / giấy mỹ thuật màu kem.
- Collage kiến trúc Việt Nam: công trình hiện đại ở phía trên/trái và kiến trúc di sản ở phía dưới/trái.
- Các mảng báo cũ, mép giấy xé và ngôi sao vàng đóng vai trò accent.
- Nhiều **negative space** ở trung tâm để landing page thoáng, sang và có chỗ cho text / 3D.
- Cảm giác tổng thể: **Vietnamese editorial collage — heritage meets modernity**.
- Hero mở đầu bằng một đoạn motion ngắn, sau đó **đóng băng ở frame cuối**.
- Khi scroll xuống, màu nền và texture phải tiếp tục liền mạch với hero.
- Section tiếp theo chứa model 3D, chuyển động dựa trên scroll và lần lượt reveal text.

Ảnh tham chiếu gốc: `675 × 1200 px`.

---

## 2. Visual DNA từ ảnh tham chiếu

### Bố cục

1. **Nền giấy kem** phủ toàn viewport.
2. **Modern architecture** nằm sát cạnh trái, gần góc trên.
3. **Heritage architecture** nằm sát cạnh trái ở nửa dưới.
4. **Newspaper / paper clipping** nằm ở góc trên bên phải.
5. **Star accents** xuất hiện ở góc trên phải và vùng phải phía dưới.
6. Khu vực giữa ảnh gần như trống hoàn toàn.

Nguyên tắc quan trọng:

> Kiến trúc và các mảng collage chỉ nên ôm lấy rìa viewport. Trung tâm phải được giữ sạch để tạo chiều sâu và để dành không gian cho typography / 3D.

---

## 3. Color system

Các màu được lấy gần với ảnh tham chiếu.

```css
:root {
  --paper-main: #F2EEE5;
  --paper-soft: #EDE8DF;
  --paper-shadow: #E7E2D8;

  --sepia: #9D8B6B;
  --heritage-dark: #433425;

  --star-yellow: #F0D95D;

  --text-primary: #433425;
  --text-secondary: #786B59;
}
```

### Background continuity

Hero, transition section và 3D section nên dùng cùng base:

```css
background: #F2EEE5;
```

Không chuyển sang trắng tinh `#FFFFFF`, vì sẽ làm mất continuity với texture giấy.

Texture giấy nên được overlay rất nhẹ:

```css
opacity: 0.08 - 0.16;
mix-blend-mode: multiply;
```

---

## 4. Responsive composition

### Desktop — 16:9

Target master:

- `1920 × 1080`
- hoặc `2560 × 1440`

Bố trí gợi ý:

- Modern building: `left: -2%`, `top: -4%`, width khoảng `24–30vw`.
- Heritage building: `left: -3%`, `bottom: -4%`, width khoảng `38–45vw`.
- Newspaper clipping: `right: -1%`, `top: -2%`, width khoảng `18–22vw`.
- Star 01: vùng `82–88% x / 8–15% y`.
- Star 02: vùng `72–80% x / 70–82% y`.
- Giữ phần giữa từ khoảng `35% → 72% width` tương đối sạch.

### Mobile — 9:16

Reference hiện tại đã gần với bố cục mobile.

Target:

- `1080 × 1920`

Không crop các công trình quá mạnh. Giữ modern building và heritage building bám cạnh trái như ảnh gốc.

---

# 5. Hero video concept

## Concept name

**HERITAGE IN MOTION**

Video không nên giống một đoạn cinematic camera shot.

Nó nên giống một **editorial collage đang nhẹ nhàng sống dậy**, rồi từ từ trở lại thành một poster tĩnh.

Điều này rất quan trọng vì frame cuối sẽ trở thành background tĩnh của website.

---

## 6. Motion principles

### Được phép chuyển động

- Paper texture chuyển động cực nhẹ.
- Các layer kiến trúc có parallax rất nhỏ.
- Newspaper clipping rung / settle nhẹ như một mảnh giấy vừa được đặt xuống.
- Star accent có shimmer / light pulse rất tinh tế.
- Shadow của collage thay đổi nhẹ.
- Các layer có thể trượt vào vị trí cuối từ khoảng `10–40 px`.
- Scale chỉ dao động khoảng `1–3%`.

### Không nên có

- Camera orbit.
- Camera dolly mạnh.
- Zoom cinematic.
- Morph kiến trúc.
- Biến dạng mái, cửa, tường.
- Sinh thêm người / xe / cây.
- Text AI tự sinh.
- Các vật thể mới xuất hiện.
- Chuyển cảnh sang scene khác.
- Glitch.
- Particle quá nhiều.
- Motion liên tục ở giây cuối.

---

# 7. Timeline video

Thời lượng khuyến nghị:

**7–8 giây**

Frame rate:

**24 fps**

### 0.0s → 1.5s

- Background giấy đã có sẵn.
- Paper grain rất nhẹ.
- Modern building bắt đầu lệch khoảng `20 px` so với vị trí cuối.
- Heritage building lệch khoảng `30 px` xuống dưới.
- Newspaper layer hơi xoay `1–2°`.
- Opacity các collage layer khoảng `92–96%`.

### 1.5s → 4.0s

Các layer từ từ settle về đúng composition.

- Heritage building dịch lên.
- Modern building dịch nhẹ sang phải.
- Newspaper clipping giảm rotation về `0°`.
- Shadow trở nên rõ hơn một chút.
- Star accent phát sáng nhẹ một lần.

Easing:

`ease-out / cubic-bezier(0.16, 1, 0.3, 1)`

### 4.0s → 6.5s

Micro parallax.

Amplitude rất nhỏ:

- X/Y: `2–6 px`
- Rotation: `< 0.25°`
- Scale: `< 1%`

Mục đích chỉ để người xem cảm thấy hình ảnh đang sống.

### 6.5s → 7.2s

Toàn bộ chuyển động giảm dần về 0.

### 7.2s → 8.0s

**Hoàn toàn tĩnh.**

Frame này phải càng gần ảnh tham chiếu / final design càng tốt.

Không shimmer.

Không grain animation.

Không camera movement.

Không parallax.

Khoảng `0.8s` cuối chính là vùng an toàn để website freeze video.

---

# 8. MASTER VIDEO GENERATION PROMPT

Dùng ảnh reference làm visual/composition reference.

Nếu video generator hỗ trợ **start frame + end frame**, hãy đặt **final target image làm END FRAME**.

```text
Create a premium image-to-video animation for a modern Vietnamese cultural landing page.

Use the supplied reference image as the exact visual and composition anchor.

The scene is an elegant Vietnamese editorial paper collage on a warm ivory handmade-paper background. Preserve the original architecture, proportions, textures, colors and placement: a modern Vietnamese building attached to the upper-left edge, historic Vietnamese imperial architecture attached to the lower-left edge, a torn vintage newspaper clipping in the upper-right corner, and subtle yellow star-shaped graphic accents. Maintain a large clean negative-space area through the center of the frame.

Animate the composition very subtly, as if a printed editorial collage is gently coming to life.

The historic architecture should rise only slightly into its final position with soft layered parallax. The modern building should drift only a few pixels toward its final position. The torn newspaper piece should have a tiny paper-settling motion and then become perfectly still. Add extremely subtle depth through soft shadow changes and restrained paper parallax. The yellow star graphics may give one delicate warm shimmer, but must remain flat graphic elements.

The camera must remain locked and orthographic-feeling. No cinematic camera travel. No perspective change. No major zoom. No scene transition.

Motion should feel sophisticated, calm, editorial, cultural, tactile, premium and intentional — not energetic.

Preserve realistic Vietnamese architectural details. Do not redesign or morph the buildings.

During the final 1 second, gradually remove every motion and finish on a completely static composition matching the supplied reference image as closely as possible. The last frame must be clean and stable so it can seamlessly become the static background of the website after video playback ends.

Style keywords:
Vietnamese editorial design, heritage meets modernity, handmade paper, vintage print collage, architectural collage, tactile paper texture, museum editorial, restrained motion design, warm ivory, sepia, subtle yellow accent, premium cultural identity.

Duration: 8 seconds.
Frame rate: 24 fps.
Camera: locked.
Motion intensity: very low.
Final second: completely static.
No loop.
```

---

## 9. Negative prompt

```text
No people, no crowds, no cars, no birds, no generated text, no logos, no additional buildings, no new objects, no architecture morphing, no warped windows, no distorted roofs, no melting geometry, no floating debris, no aggressive particles, no strong wind, no dramatic camera movement, no dolly, no orbit, no handheld shake, no large zoom, no lens distortion, no depth-of-field blur, no neon colors, no cyberpunk styling, no glossy 3D look, no photorealistic environment replacement, no scene cut, no transition to another location, no continuous motion in the final second.
```

---

# 10. Generation settings

Recommended:

```text
Mode: Image-to-video
Duration: 8s
FPS: 24
Motion strength: Low
Camera motion: None / Locked
Prompt adherence: High
Reference adherence: High
Creativity / variation: Low
Loop: Off
```

Desktop export:

```text
1920 × 1080
16:9
```

Mobile export:

```text
1080 × 1920
9:16
```

Nếu generator hỗ trợ end-frame conditioning:

```text
START FRAME:
có thể dùng một version lệch nhẹ của collage

END FRAME:
final landing-page artwork
```

Nếu generator chỉ hỗ trợ một reference image, hãy dùng ảnh landing page làm input và yêu cầu motion cực thấp.

---

# 11. Cách đảm bảo video dừng đúng frame cuối trên website

Không nên phụ thuộc hoàn toàn vào AI video để giữ frame cuối chính xác.

Cách ổn định hơn:

1. Export riêng một ảnh:
   - `hero-final.webp`

2. Video kết thúc bằng composition gần giống ảnh này nhất có thể.

3. Khi sự kiện `ended` xảy ra:
   - giữ video ở frame cuối, hoặc
   - fade `80–120ms` sang `hero-final.webp`.

4. Background section bên dưới dùng cùng `paper-main`.

Ví dụ logic:

```js
video.addEventListener("ended", () => {
  hero.classList.add("is-ended");
});
```

```css
.hero-final-frame {
  opacity: 0;
}

.hero.is-ended .hero-video {
  opacity: 0;
}

.hero.is-ended .hero-final-frame {
  opacity: 1;
}
```

Transition nên cực ngắn để mắt người không nhận thấy việc swap asset.

---

# 12. Hero structure

```text
Hero
├── paper background
├── paper grain texture
├── hero video
├── exact final-frame image
├── optional title / logo
└── scroll indicator
```

Video:

```text
autoplay
muted
playsinline
loop = false
```

Không dùng audio.

---

# 13. Transition từ hero sang phần 3D

Hero không nên kết thúc bằng một section boundary rõ ràng.

Thay vào đó:

```text
Hero video
      ↓
final still frame
      ↓
same paper background
      ↓
3D model slowly enters
      ↓
text begins revealing
```

Màu nền không đổi trong toàn bộ transition.

Có thể dùng một gradient cực nhẹ ở cuối hero:

```css
linear-gradient(
  to bottom,
  rgba(242, 238, 229, 0),
  #F2EEE5
)
```

Nhưng gradient chỉ dùng để che edge / artifact, không được nhìn thấy rõ.

---

# 14. 3D section concept

## Desktop

Layout:

```text
┌─────────────────────────────────────────┐
│                                         │
│         text          3D object         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

Model 3D có thể ở:

```text
x: 58–68% viewport
y: center
```

Text:

```text
x: 12–18% viewport
max-width: 420–560px
```

Có thể đảo vị trí ở section tiếp theo.

---

# 15. Scroll-driven 3D animation

Section height:

```text
180vh – 260vh
```

Canvas:

```text
position: sticky;
top: 0;
height: 100vh;
```

Scroll progress:

```text
0.00 ------------------------------ 1.00
```

### Progress 0.00 → 0.15

Model xuất hiện.

```text
opacity: 0 → 1
translateY: 80px → 0
scale: 0.92 → 1
```

### Progress 0.15 → 0.50

Model rotate.

Ví dụ:

```text
rotationY: -25° → 8°
rotationX: 6° → 0°
```

Không rotate liên tục 360°.

Chuyển động nên giống một object được trưng bày trong museum / editorial showcase.

### Progress 0.30 → 0.55

Headline xuất hiện.

Animation:

```text
mask reveal
Y: 32px → 0
opacity: 0 → 1
```

### Progress 0.48 → 0.70

Body text xuất hiện.

### Progress 0.70 → 0.90

Model tiến nhẹ về camera.

```text
scale: 1 → 1.06
```

Có thể thêm highlight nhẹ theo normal / environment light.

### Progress 0.90 → 1.00

Mọi thứ settle.

Không để model vẫn xoay khi user dừng scroll.

---

# 16. 3D rendering direction

Model không nên có look "game engine".

Nên hướng tới:

- museum artifact
- product editorial
- soft studio light
- diffuse shadows
- low contrast
- slightly warm light
- subtle contact shadow

Background của WebGL canvas:

```text
transparent
```

để nhìn thấy paper texture thật phía sau.

---

# 17. Lighting gợi ý

Three.js / React Three Fiber:

```text
Environment intensity: 0.6 – 0.9
Key light: warm neutral
Fill light: soft
Rim light: very subtle
```

Không dùng RGB lighting.

Không dùng bloom mạnh.

---

# 18. Typography direction

Vì visual mang tính editorial và văn hóa, nên dùng serif cho headline và sans-serif cho UI/body.

Gợi ý:

```text
Headline:
Noto Serif
Cormorant Garamond
Lora

Body / UI:
Be Vietnam Pro
Inter
Manrope
```

Nếu nội dung tiếng Việt nhiều:

**Be Vietnam Pro + Noto Serif** là pairing an toàn.

---

# 19. Typography style

Headline:

```text
font-weight: 400–500
letter-spacing: -0.02em
line-height: 0.95–1.08
```

Body:

```text
font-weight: 400
line-height: 1.55–1.75
```

Không nên dùng bold quá nặng.

---

# 20. Suggested content reveal

Thay vì text hiện ra cùng lúc:

```text
01
small eyebrow

02
main headline

03
short paragraph

04
CTA / metadata
```

Reveal lần lượt theo scroll.

Ví dụ:

```text
DI SẢN
không đứng yên trong quá khứ.

Nó tiếp tục chuyển động,
thay đổi và định hình hiện tại.
```

Nội dung cuối cùng tùy brand/project.

---

# 21. Texture layering

Layer structure:

```text
base color
↓
paper texture
↓
very soft stains / print imperfections
↓
architecture collage
↓
3D canvas
↓
typography
```

Paper grain phải đứng yên sau hero video để không gây mỏi mắt.

---

# 22. Motion design rule

Toàn site nên tuân theo:

```text
large visual movement = scroll controlled

ambient movement = extremely small

decorative movement = almost zero
```

Điểm thu hút chính phải là:

1. Hero collage assembling.
2. Freeze.
3. User scroll.
4. 3D object reacts.
5. Typography reveals.

Không để mọi thứ cùng chuyển động.

---

# 23. Suggested technology

Frontend:

```text
Next.js
React
```

Scroll animation:

```text
GSAP + ScrollTrigger
```

3D:

```text
React Three Fiber
@react-three/drei
```

Video:

```text
WebM primary
MP4 fallback
```

Image:

```text
AVIF / WebP
```

---

# 24. Performance budget

Hero:

```text
video: ideally < 6–8 MB
final frame: < 400 KB
paper texture: < 250 KB
```

3D model:

```text
GLB / GLTF
Draco compression
Meshopt
KTX2 textures
```

Ideal initial model payload:

```text
< 5 MB
```

Nếu model lớn hơn, chỉ bắt đầu preload sau khi hero đã render.

---

# 25. Accessibility

Nếu người dùng bật:

```css
@media (prefers-reduced-motion: reduce)
```

thì:

- Không autoplay hero animation.
- Hiển thị trực tiếp `hero-final.webp`.
- Không rotate model theo scroll.
- Chỉ dùng fade nhẹ cho text.

---

# 26. Asset list

```text
/public
  /hero
    hero-motion.webm
    hero-motion.mp4
    hero-final.webp
    paper-texture.avif

  /models
    hero-object.glb

  /textures
    model-*.ktx2
```

---

# 27. Final UX sequence

```text
PAGE LOAD
   ↓
paper background visible immediately
   ↓
hero video autoplay
   ↓
collage subtly comes alive
   ↓
all motion decelerates
   ↓
last ~0.8s completely static
   ↓
video ends
   ↓
swap invisibly to exact final still image
   ↓
user scrolls
   ↓
background remains visually continuous
   ↓
3D model enters
   ↓
model reacts to scroll
   ↓
headline reveals
   ↓
body copy reveals
   ↓
model + text settle
```

---

# 28. Core design principle

> **The hero should not feel like a video placed on top of a website. The video should feel like the website itself briefly comes alive, then turns into the static visual system that continues through the rest of the page.**

Đây là nguyên tắc quan trọng nhất để phần video, final frame và 3D scroll section cảm giác như một trải nghiệm duy nhất thay vì ba phần riêng biệt.
