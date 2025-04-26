// Modular Consciousness Face Generator with Opposite Mode and Flip Animation

// Only inject the SVG/avatar into #faceAvatar (should exist in HTML)
function injectFaceAvatar() {
  const faceAvatarDiv = document.getElementById("faceAvatar");
  if (!faceAvatarDiv) return;
  faceAvatarDiv.innerHTML = `
    <svg id="faceSVG" viewBox="0 0 200 200" width="200" height="200" style="transition: transform 0.6s ease-in-out;">
      <circle cx="100" cy="100" r="80" fill="#000" stroke="#0ff" stroke-width="3" />
      <g id="eyes"></g>
      <g id="mouth"></g>
      <g id="ornaments"></g>
    </svg>
  `;
}

// Inject SVG on load
window.addEventListener("DOMContentLoaded", injectFaceAvatar);

let isOppositeFace = false;

function updateFaceAvatar(D, A, S) {
  const d = isOppositeFace ? 1 - D / 100 : D / 100;
  const a = isOppositeFace ? 1 - A / 100 : A / 100;
  const s = isOppositeFace ? 1 - S / 100 : S / 100;

  let eyeShape = d < 0.33 ? "slit" : d < 0.66 ? "soft" : "wide";
  let mouthShape = a < 0.33 ? "line" : a < 0.66 ? "smile" : "grin";
  let ornamentShape = s > 0.66 ? "fractal" : s > 0.33 ? "rune" : "none";

  document.getElementById("eyes").innerHTML = getEyeSVG(eyeShape);
  document.getElementById("mouth").innerHTML = getMouthSVG(mouthShape);
  document.getElementById("ornaments").innerHTML = getOrnamentSVG(ornamentShape);
}

function getEyeSVG(type) {
  if (type === "slit") {
    return `
      <ellipse cx="70" cy="80" rx="10" ry="3" fill="#0ff" />
      <ellipse cx="130" cy="80" rx="10" ry="3" fill="#0ff" />
    `;
  } else if (type === "soft") {
    return `
      <circle cx="70" cy="80" r="6" fill="#0ff" />
      <circle cx="130" cy="80" r="6" fill="#0ff" />
    `;
  } else {
    return `
      <circle cx="70" cy="80" r="9" fill="#0ff" stroke="#fff" stroke-width="2" />
      <circle cx="130" cy="80" r="9" fill="#0ff" stroke="#fff" stroke-width="2" />
    `;
  }
}

function getMouthSVG(type) {
  if (type === "line") {
    return `<line x1="70" y1="135" x2="130" y2="135" stroke="#0ff" stroke-width="2" />`;
  } else if (type === "smile") {
    return `<path d="M70 135 Q100 150 130 135" stroke="#0ff" stroke-width="2" fill="none" />`;
  } else {
    return `<path d="M70 135 Q100 160 130 135" stroke="#0ff" stroke-width="3" fill="none" />`;
  }
}

function getOrnamentSVG(type) {
  if (type === "rune") {
    return `<path d="M95 60 Q100 50 105 60" stroke="#0ff" stroke-width="2" fill="none" />`;
  } else if (type === "fractal") {
    return `
      <circle cx="100" cy="60" r="6" fill="none" stroke="#0ff" stroke-width="2" />
      <path d="M94 60 L106 60 M100 54 L100 66" stroke="#0ff" stroke-width="1" />
    `;
  } else {
    return "";
  }
}

function downloadAvatar() {
  const svg = document.getElementById("faceSVG");
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    const link = document.createElement("a");
    link.download = "consciousness-avatar.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  img.src = "data:image/svg+xml;base64," + btoa(svgData);
}

// Attach listeners to static HTML buttons
const downloadBtn = document.getElementById("downloadAvatarBtn");
const flipBtn = document.getElementById("showOriginalBtn");
if (downloadBtn) downloadBtn.addEventListener("click", downloadAvatar);
if (flipBtn) flipBtn.addEventListener("click", () => {
  isOppositeFace = !isOppositeFace;
  const faceSVG = document.getElementById("faceSVG");
  faceSVG.style.transform = `rotateY(${isOppositeFace ? 180 : 0}deg)`;
  flipBtn.textContent = isOppositeFace ? "Show Original" : "Show Opposite";

  const D = parseInt(document.getElementById('informationDensity').value);
  const A = parseInt(document.getElementById('knowledgeBase').value);
  const S = parseInt(document.getElementById('cognitiveComplexity').value);
  updateFaceAvatar(D, A, S);
});

window.addEventListener("load", () => {
  const D = parseInt(document.getElementById('informationDensity').value);
  const A = parseInt(document.getElementById('knowledgeBase').value);
  const S = parseInt(document.getElementById('cognitiveComplexity').value);
  updateFaceAvatar(D, A, S);
});

[informationDensity, knowledgeBase, cognitiveComplexity].forEach(input => {
  input.addEventListener("input", () => {
    const D = parseInt(informationDensity.value);
    const A = parseInt(knowledgeBase.value);
    const S = parseInt(cognitiveComplexity.value);
    updateFaceAvatar(D, A, S);
  });
});
