const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// 🔥 IMPORTANT: Set REAL resolution (match your images)
canvas.width = 1280;
canvas.height = 720;

const frameCount = 60; // adjust to your image count

// ✅ CHANGE THIS PATH TO MATCH YOUR FOLDER
const getFrameSrc = (i) =>
  `images/frame_${String(i).padStart(4, "0")}.jpg`;

const images = [];
let imagesLoaded = 0;
let currentFrame = 0;

// ✅ PRELOAD ALL IMAGES
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = getFrameSrc(i);

  img.onload = () => {
    imagesLoaded++;

    // Draw first frame once ready
    if (imagesLoaded === 1) {
      context.drawImage(img, 0, 0);
    }
  };

  images.push(img);
}

// ✅ DRAW FRAME FUNCTION
function drawFrame(index) {
  if (!images[index]) return;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[index], 0, 0);
}

// ✅ SCROLL HANDLER
function onScroll() {
  const scrollTop = window.scrollY;
  const scrollHeight = document.body.scrollHeight - window.innerHeight;

  const scrollFraction = scrollTop / scrollHeight;

  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );

  if (frameIndex !== currentFrame) {
    currentFrame = frameIndex;
    requestAnimationFrame(() => drawFrame(frameIndex));
  }
}

// ✅ WAIT UNTIL PAGE IS READY
window.addEventListener("load", () => {
  window.addEventListener("scroll", onScroll);
});