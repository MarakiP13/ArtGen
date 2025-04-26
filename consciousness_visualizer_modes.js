// Consciousness Visualization Mode Toggle with Auto Slider Updates

const modes = ["Coordinate Map", "Archetype Landscape", "Signal Orbit"];

function setupVisualizerPanel() {
  // Only create once
  if (document.getElementById("visualPreview")) return;

  const visualizerPanel = document.createElement("div");
  visualizerPanel.className = "white-box";
  visualizerPanel.style.marginTop = "28px";
  visualizerPanel.innerHTML = `
    <h3 style="margin-bottom:12px">🧠 Visualization Mode</h3>
    <label for="visualModeSelect">Choose a visualization:</label>
    <select id="visualModeSelect" style="width:100%;margin:10px 0;padding:6px 10px;font-size:16px">
      ${modes.map((m, i) => `<option value="${i}">${m}</option>`).join("\n")}
    </select>
    <div id="visualPreview" style="margin-top:20px; height:300px; background:#000; display:flex; align-items:center; justify-content:center; font-size:1.2em; color:#fff; border-radius:8px;">
      Coordinate Map (D, A, S)
    </div>
  `;
  document.getElementById("visualizerPanelMount").appendChild(visualizerPanel);

  // Setup canvas and ctx as properties on the panel for reuse
  const visualPreview = document.getElementById("visualPreview");
  const visualCanvas = document.createElement("canvas");
  visualCanvas.width = 300;
  visualCanvas.height = 300;
  visualPreview.innerHTML = "";
  visualPreview.appendChild(visualCanvas);
  visualizerPanel._visualCanvas = visualCanvas;
  visualizerPanel._ctx = visualCanvas.getContext("2d");
}

setupVisualizerPanel();

function getVisualizerCtx() {
  // Always get the latest ctx from the panel
  const panel = document.getElementById("visualizerPanelMount").firstChild;
  return panel ? panel._ctx : null;
}
function getVisualizerCanvas() {
  const panel = document.getElementById("visualizerPanelMount").firstChild;
  return panel ? panel._visualCanvas : null;
}


let coordinateMapAnimId;
function drawCoordinateMap() {
  const ctx = getVisualizerCtx();
  const visualCanvas = getVisualizerCanvas();
  if (!ctx || !visualCanvas) return;
  let t = 0;
  if (coordinateMapAnimId) cancelAnimationFrame(coordinateMapAnimId);
  function animate() {
    // Always fetch latest slider values
    const D = parseInt(document.getElementById('informationDensity').value);
    const A = parseInt(document.getElementById('knowledgeBase').value);
    const S = parseInt(document.getElementById('cognitiveComplexity').value);
    ctx.clearRect(0, 0, visualCanvas.width, visualCanvas.height);
    // Moving grid
    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.strokeStyle = '#fff';
    for (let gx = 0; gx < visualCanvas.width; gx += 30) {
      ctx.beginPath();
      ctx.moveTo(gx + (t % 30), 0);
      ctx.lineTo(gx + (t % 30), visualCanvas.height);
      ctx.stroke();
    }
    for (let gy = 0; gy < visualCanvas.height; gy += 30) {
      ctx.beginPath();
      ctx.moveTo(0, gy + (t % 30));
      ctx.lineTo(visualCanvas.width, gy + (t % 30));
      ctx.stroke();
    }
    ctx.restore();

    // --- Axes and Baselines ---
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    // X axis (D)
    ctx.beginPath();
    ctx.moveTo(0, visualCanvas.height/2);
    ctx.lineTo(visualCanvas.width, visualCanvas.height/2);
    ctx.stroke();
    // Y axis (A)
    ctx.beginPath();
    ctx.moveTo(visualCanvas.width/2, 0);
    ctx.lineTo(visualCanvas.width/2, visualCanvas.height);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.globalAlpha = 1;
    // Tick marks and labels
    ctx.font = '13px monospace';
    ctx.fillStyle = '#fff';
    // D axis
    ctx.fillText('Low D', 5, visualCanvas.height/2 - 8);
    ctx.fillText('High D', visualCanvas.width-55, visualCanvas.height/2 - 8);
    // A axis
    ctx.save();
    ctx.translate(visualCanvas.width/2 + 8, 16);
    ctx.rotate(-Math.PI/2);
    ctx.fillText('High A', 0, 0);
    ctx.restore();
    ctx.save();
    ctx.translate(visualCanvas.width/2 + 8, visualCanvas.height-8);
    ctx.rotate(-Math.PI/2);
    ctx.fillText('Low A', 0, 0);
    ctx.restore();
    // Center label
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#ffc';
    ctx.fillText('Everyperson', visualCanvas.width/2 + 12, visualCanvas.height/2 - 10);
    ctx.restore();

    // --- Opposite corners ---
    ctx.save();
    ctx.font = '12px monospace';
    ctx.fillStyle = '#ffa';
    ctx.globalAlpha = 0.7;
    ctx.fillText('Max D / Max A', visualCanvas.width-92, 18);
    ctx.fillText('Min D / Max A', 6, 18);
    ctx.fillText('Max D / Min A', visualCanvas.width-98, visualCanvas.height-10);
    ctx.fillText('Min D / Min A', 6, visualCanvas.height-10);
    ctx.globalAlpha = 1;
    ctx.restore();

    // --- Everyperson marker ---
    const cx = visualCanvas.width/2;
    const cy = visualCanvas.height/2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI*2);
    ctx.strokeStyle = '#ffc';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#fff8';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1;
    ctx.restore();

    // --- Opposite marker ---
    const ox = ((100 - D) / 100) * visualCanvas.width;
    const oy = visualCanvas.height - ((100 - A) / 100) * visualCanvas.height;
    const osize = 10 + (S / 8);
    let ograd = ctx.createRadialGradient(ox, oy, osize / 4, ox, oy, osize * 1.5);
    ograd.addColorStop(0, '#f33');
    ograd.addColorStop(0.5, 'rgba(255,51,51,0.3)');
    ograd.addColorStop(1, 'rgba(255,51,51,0)');
    ctx.beginPath();
    ctx.arc(ox, oy, osize * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = ograd;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ox, oy, osize, 0, Math.PI * 2);
    ctx.fillStyle = '#f33';
    ctx.shadowColor = '#f33';
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;
    // Label for opposite
    ctx.save();
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#f33';
    ctx.shadowColor = '#f33';
    ctx.shadowBlur = 8;
    ctx.fillText('Opposite', ox + 16, oy - 8);
    ctx.shadowBlur = 0;
    ctx.restore();

    // --- User marker ---
    const x = (D / 100) * visualCanvas.width;
    const y = visualCanvas.height - (A / 100) * visualCanvas.height;
    const size = 12 + (S / 6);
    let gradient = ctx.createRadialGradient(x, y, size / 4, x, y, size * 1.5);
    gradient.addColorStop(0, '#0ff');
    gradient.addColorStop(0.5, 'rgba(0,255,255,0.3)');
    gradient.addColorStop(1, 'rgba(0,255,255,0)');
    ctx.beginPath();
    ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = '#0ff';
    ctx.shadowColor = '#0ff';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;
    // Orbiting rings
    ctx.save();
    ctx.strokeStyle = 'rgba(0,255,255,0.4)';
    for (let i = 1; i <= Math.max(2, Math.floor(S / 30)); i++) {
      ctx.beginPath();
      ctx.arc(x, y, size * 2.2 + i * 10 + Math.sin(t/20 + i)*3, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
    // Label for user
    ctx.save();
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = '#0ff';
    ctx.shadowColor = '#0ff';
    ctx.shadowBlur = 10;
    ctx.fillText('You', x + 16, y - 8);
    ctx.shadowBlur = 0;
    ctx.restore();

    // Info
    ctx.font = '16px monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText(`D:${D} A:${A} S:${S}`, 10, 26);
    t += 1.5;
    coordinateMapAnimId = requestAnimationFrame(animate);
  }
  animate();
}

let archetypeLandscapeAnimId;
function drawArchetypeLandscape() {
  const ctx = getVisualizerCtx();
  const visualCanvas = getVisualizerCanvas();
  if (!ctx || !visualCanvas) return;
  // Archetype landmark definitions
  const archetypes = [
    {name: 'Philosopher', icon: 'mountain', x: 0.18, y: 0.25},
    {name: 'Dreamer', icon: 'forest', x: 0.75, y: 0.18},
    {name: 'Inventor', icon: 'tower', x: 0.82, y: 0.82},
    {name: 'Sage', icon: 'temple', x: 0.22, y: 0.8},
    {name: 'Everyperson', icon: 'village', x: 0.5, y: 0.5}
  ];
  // Archetype paths (indices)
  const archetypePaths = [
    [0,4],[4,1],[4,2],[4,3],[0,3],[1,2]
  ];
  let t = 0;
  if (archetypeLandscapeAnimId) cancelAnimationFrame(archetypeLandscapeAnimId);
  function drawLandmarkIcon(ctx, type, x, y, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = 0.94;
    if(type==='mountain'){
      ctx.beginPath();ctx.moveTo(-16,12);ctx.lineTo(0,-16-Math.sin(t/30)*2);ctx.lineTo(16,12);ctx.closePath();ctx.fillStyle='#b8b8ff';ctx.fill();ctx.strokeStyle='#4e4e80';ctx.stroke();
      ctx.beginPath();ctx.moveTo(-6,6);ctx.lineTo(0,-4-Math.sin(t/30)*2);ctx.lineTo(6,6);ctx.closePath();ctx.fillStyle='#fff';ctx.globalAlpha=0.7;ctx.fill();ctx.globalAlpha=0.94;
    }else if(type==='forest'){
      ctx.beginPath();ctx.arc(0,8,10,Math.PI,Math.PI*2);ctx.fillStyle='#2ecc40';ctx.fill();ctx.beginPath();ctx.arc(-7,8,7,Math.PI,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(7,8,7,Math.PI,Math.PI*2);ctx.fill();
    }else if(type==='tower'){
      ctx.beginPath();ctx.rect(-6,-16,12,32);ctx.fillStyle='#cfcfcf';ctx.fill();ctx.strokeStyle='#888';ctx.stroke();ctx.beginPath();ctx.arc(0,-16,7,Math.PI,Math.PI*2);ctx.fillStyle='#eee';ctx.fill();ctx.stroke();
    }else if(type==='temple'){
      ctx.beginPath();ctx.moveTo(-14,8);ctx.lineTo(0,-10-Math.cos(t/23)*2);ctx.lineTo(14,8);ctx.closePath();ctx.fillStyle='#fbeee0';ctx.fill();ctx.strokeStyle='#b89850';ctx.stroke();ctx.beginPath();ctx.rect(-10,8,20,8);ctx.fillStyle='#e6d3b3';ctx.fill();ctx.stroke();
    }else if(type==='village'){
      ctx.beginPath();ctx.arc(0,8,9,Math.PI,Math.PI*2);ctx.fillStyle='#b7e0ff';ctx.fill();ctx.strokeStyle='#4e4e80';ctx.stroke();ctx.beginPath();ctx.rect(-8,8,16,7);ctx.fillStyle='#e2d2b3';ctx.fill();ctx.stroke();
    }
    ctx.restore();
  }
  function animate() {
    // Always fetch latest slider values
    const D = parseInt(document.getElementById('informationDensity').value);
    const A = parseInt(document.getElementById('knowledgeBase').value);
    const S = parseInt(document.getElementById('cognitiveComplexity').value);
    ctx.clearRect(0, 0, visualCanvas.width, visualCanvas.height);
    // Sky gradient
    let sky = ctx.createLinearGradient(0, 0, 0, visualCanvas.height);
    sky.addColorStop(0, '#3a7bd5');
    sky.addColorStop(1, '#00d2ff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, visualCanvas.width, visualCanvas.height);
    // Hills (shifted by D/A/S)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, visualCanvas.height-40);
    for(let x=0; x<=visualCanvas.width; x+=10){
      let freq = 50 + 20*Math.sin(D/40 + S/60);
      let amp = 18 + 8*Math.cos(A/35 + S/80);
      ctx.lineTo(x, visualCanvas.height-40 - amp*Math.sin((x/freq)+t/40 + D/60));
    }
    ctx.lineTo(visualCanvas.width, visualCanvas.height);
    ctx.lineTo(0, visualCanvas.height);
    ctx.closePath();
    ctx.fillStyle = '#8e44ad';
    ctx.globalAlpha = 0.88;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
    // Draw paths between archetypes
    ctx.save();
    ctx.strokeStyle = '#ffd70088';
    ctx.lineWidth = 2.5;
    for(const [i,j] of archetypePaths) {
      const ax = archetypes[i].x * visualCanvas.width;
      const ay = archetypes[i].y * visualCanvas.height;
      const bx = archetypes[j].x * visualCanvas.width;
      const by = archetypes[j].y * visualCanvas.height;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }
    ctx.restore();
    // Draw archetype landmarks
    for(let i=0;i<archetypes.length;i++){
      const arch = archetypes[i];
      const ax = arch.x * visualCanvas.width;
      const ay = arch.y * visualCanvas.height;
      drawLandmarkIcon(ctx, arch.icon, ax, ay, t);
      ctx.save();
      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 6;
      ctx.fillText(arch.name, ax+18, ay-8);
      ctx.shadowBlur = 0;
      ctx.restore();
    }
    // Moving clouds
    for (let c = 0; c < 3; c++) {
      let cx = (t*1.2 + c*100 + D*2) % (visualCanvas.width+60) - 30;
      let cy = 60 + 18*Math.sin(t/40+c+A/40);
      ctx.globalAlpha = 0.18;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 44, 16, 0, 0, Math.PI*2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    // --- Markers ---
    // User position
    const userX = (D / 100) * visualCanvas.width;
    const userY = (A / 100) * visualCanvas.height;
    // Everyperson
    const centerX = 0.5 * visualCanvas.width;
    const centerY = 0.5 * visualCanvas.height;
    // Opposite
    const oppX = ((100-D)/100) * visualCanvas.width;
    const oppY = ((100-A)/100) * visualCanvas.height;
    // Path from Everyperson to user
    ctx.save();
    ctx.strokeStyle = '#0af';
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(userX, userY);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
    // User marker (blue)
    ctx.save();
    ctx.beginPath();
    ctx.arc(userX, userY, 13, 0, Math.PI*2);
    ctx.fillStyle = '#0af';
    ctx.shadowColor = '#0af';
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#0af';
    ctx.fillText('You', userX+17, userY-8);
    ctx.restore();
    // Everyperson marker (gold)
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 13, 0, Math.PI*2);
    ctx.fillStyle = '#ffd700';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('Everyperson', centerX+17, centerY-8);
    ctx.restore();
    // Opposite marker (red)
    ctx.save();
    ctx.beginPath();
    ctx.arc(oppX, oppY, 13, 0, Math.PI*2);
    ctx.fillStyle = '#f33';
    ctx.shadowColor = '#f33';
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#f33';
    ctx.fillText('Opposite', oppX+17, oppY-8);
    ctx.restore();
    // Draw a small '?' icon button in the top right
    ctx.save();
    ctx.beginPath();
    ctx.arc(visualCanvas.width-28, 28, 16, 0, Math.PI*2);
    ctx.fillStyle = '#222a';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = 'bold 20px monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText('?', visualCanvas.width-34, 34);
    ctx.restore();
    // Legend popup logic
    if (!window.__archetypeLegendSetup) {
      window.__archetypeLegendSetup = true;
      const canvas = visualCanvas;
      function showLegendPopupUniversal({ id, html, style = {}, closeBtnId }) {
        // Remove any existing legend popups (archetype, orbit, etc.)
        const legendIds = ['archetype-legend-popup', 'orbit-legend-popup'];
        legendIds.forEach(lid => {
          const el = document.getElementById(lid);
          if (el) el.remove();
        });
        // Create the new legend
        let legend = document.createElement('div');
        legend.id = id;
        legend.innerHTML = html;
        Object.assign(legend.style, style);
        document.body.appendChild(legend);
        if (closeBtnId) {
          document.getElementById(closeBtnId).onclick = () => legend.remove();
        }
      }

      function showArchetypeLegendPopup() {
        const canvas = getVisualizerCanvas();
        showLegendPopupUniversal({
          id: 'archetype-legend-popup',
          html: `
            <div style="font-weight:bold;font-size:16px;margin-bottom:8px;">Conscious Terrain Legend <span id='close-arch-legend' style='float:right;cursor:pointer;font-size:20px;'>&times;</span></div>
            <div style='font-size:13px;'>
              <b>Horizontal:</b> Density (D)<br>
              <b>Vertical:</b> Awareness (A)<br>
              <span style='color:#0af;'>● You</span> &nbsp; <span style='color:#ffd700;'>● Everyperson</span> &nbsp; <span style='color:#f33;'>● Opposite</span><br>
              <b>Landmarks:</b> Archetypes (mountain, forest, etc.)<br>
              <b>Paths:</b> Suggest evolution between archetypes<br>
              <b>Blue Path:</b> Your journey from Everyperson<br>
            </div>
          `,
          style: {
            position: 'absolute',
            top: (canvas.offsetTop + 18) + 'px',
            left: (canvas.offsetLeft + canvas.width - 230) + 'px',
            background: '#181c22',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: '10px',
            boxShadow: '0 4px 16px #000a',
            zIndex: 1000,
            padding: '14px 20px 10px 16px',
            minWidth: '200px',
            maxWidth: '270px',
            fontFamily: 'monospace',
            userSelect: 'text',
          },
          closeBtnId: 'close-arch-legend'
        });
      }
      function hideLegendPopup() {
        let legend = document.getElementById('archetype-legend-popup');
        if (legend) legend.remove();
      }
      canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = canvas.width-28, cy = 28, r = 16;
        if (Math.pow(x-cx,2) + Math.pow(y-cy,2) < r*r) {
          let legend = document.getElementById('archetype-legend-popup');
          if (legend) { hideLegendPopup(); } else { showArchetypeLegendPopup(); }
        }
      });
    }

    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText('Conscious Terrain', 14, 32);
    t += 1.2;
    archetypeLandscapeAnimId = requestAnimationFrame(animate);
  }
  animate();
}

let signalOrbitAnimId;
function drawSignalOrbit(D = 50, A = 50, S = 50) {
  const ctx = getVisualizerCtx();
  const visualCanvas = getVisualizerCanvas();
  if (!ctx || !visualCanvas) return;
  let t = 0;
  if (signalOrbitAnimId) cancelAnimationFrame(signalOrbitAnimId);

  // Helper for mapping D,A to orbit space (centered at 150,150, 0-100 scale)
  function mapDAtoXY(d, a) {
    // D: left (0) to right (100), A: bottom (0) to top (100)
    return [
      30 + (d/100)*190, // X: 30..220
      220 - (a/100)*190 // Y: 220..30 (invert so 100 is up)
    ];
  }

  // Legend popup logic (like Archetype Landscape)





  function animate() {
    // Always fetch latest slider values
    const D = parseInt(document.getElementById('informationDensity').value);
    const A = parseInt(document.getElementById('knowledgeBase').value);
    const S = parseInt(document.getElementById('cognitiveComplexity').value);
    ctx.clearRect(0, 0, visualCanvas.width, visualCanvas.height);
    // Central core (Everyperson)
    ctx.save();
    ctx.beginPath();
    ctx.arc(150, 150, 32 + 8*Math.sin(t/12), 0, Math.PI*2);
    let grad = ctx.createRadialGradient(150,150,8,150,150,32);
    grad.addColorStop(0,'#ffe600');
    grad.addColorStop(1,'#ff5edc');
    ctx.fillStyle = grad;
    ctx.shadowColor = '#ffe600';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
    // --- Orbits ---
    const orbitLabels = ["Self", "Growth", "Influence"];
    for (let o = 0; o < 3; o++) {
      ctx.save();
      ctx.strokeStyle = `hsl(${(t*5+o*80)%360},100%,60%)`;
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.arc(150, 150, 70 + 13*o + 6*Math.sin(t/18+o), 0, Math.PI*2);
      ctx.stroke();
      ctx.globalAlpha = 0.7;
      ctx.font = '13px monospace';
      ctx.fillStyle = '#fff8';
      ctx.fillText(orbitLabels[o], 150 + (70+13*o)*Math.cos(-Math.PI/2) - 18, 150 + (70+13*o)*Math.sin(-Math.PI/2) - 8);
      ctx.restore();
    }
    // --- Markers ---
    // Everyperson (center)
    ctx.save();
    ctx.beginPath();
    ctx.arc(150, 150, 11, 0, Math.PI*2);
    ctx.fillStyle = '#ffe600';
    ctx.shadowColor = '#ffe600';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#ffe600';
    ctx.fillText('Everyperson', 150-36, 150+32);
    ctx.restore();
    // User marker
    const [ux, uy] = mapDAtoXY(D, A);
    ctx.save();
    ctx.beginPath();
    ctx.arc(ux, uy, 10, 0, Math.PI*2);
    ctx.fillStyle = '#39f';
    ctx.shadowColor = '#39f';
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#39f';
    ctx.fillText('You', ux+12, uy-8);
    ctx.restore();
    // Opposite marker
    const [ox, oy] = mapDAtoXY(100-D, 100-A);
    ctx.save();
    ctx.beginPath();
    ctx.arc(ox, oy, 10, 0, Math.PI*2);
    ctx.fillStyle = '#f44';
    ctx.shadowColor = '#f44';
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#f44';
    ctx.fillText('Opposite', ox+12, oy-8);
    ctx.restore();
    // --- Axes ---
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, 150); ctx.lineTo(270, 150); // D axis
    ctx.moveTo(150, 30); ctx.lineTo(150, 270); // A axis
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.font = '13px monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText('Low D', 34, 140);
    ctx.fillText('High D', 220, 140);
    ctx.save(); ctx.translate(160, 40); ctx.rotate(-Math.PI/2);
    ctx.fillText('High A', 0, 0);
    ctx.restore();
    ctx.save(); ctx.translate(160, 260); ctx.rotate(-Math.PI/2);
    ctx.fillText('Low A', 0, 0);
    ctx.restore();
    ctx.restore();
    // --- Orbiting nodes (visual interest, not user-specific) ---
    for (let n = 0; n < 5; n++) {
      let angle = t/22 + n*Math.PI*2/5;
      let r = 88 + 18*Math.sin(t/30+n);
      let nx = 150 + r*Math.cos(angle);
      let ny = 150 + r*Math.sin(angle);
      ctx.beginPath();
      ctx.arc(nx, ny, 13+4*Math.sin(t/16+n), 0, Math.PI*2);
      ctx.fillStyle = `hsl(${(n*70+t*2)%360},100%,60%)`;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
      // Trailing tail
      for (let tail = 1; tail <= 8; tail++) {
        let ta = angle - tail*0.18;
        let tr = r - tail*4;
        let tx = 150 + tr*Math.cos(ta);
        let ty = 150 + tr*Math.sin(ta);
        ctx.globalAlpha = 0.11;
        ctx.beginPath();
        ctx.arc(tx, ty, 10-tail, 0, Math.PI*2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }


    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText('Signal Orbit', 14, 32);
    t += 1.1;
    signalOrbitAnimId = requestAnimationFrame(animate);
  }
  animate();
}

let neuralMapAnimId;
function drawNeuralMap(D = 50, A = 50, S = 50) {
  const ctx = getVisualizerCtx();
  const visualCanvas = getVisualizerCanvas();
  if (!ctx || !visualCanvas) return;
  // Generate a network of nodes and edges for animation
  if (neuralMapAnimId) cancelAnimationFrame(neuralMapAnimId);
  // Generate static network
  const nodeCount = 12 + Math.floor(D/10);
  const nodes = [];
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: 40 + Math.random()*(visualCanvas.width-80),
      y: 40 + Math.random()*(visualCanvas.height-80),
      pulse: Math.random()*100
    });
  }
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i+1; j < nodes.length; j++) {
      if (Math.random() < 0.18) edges.push([i,j]);
    }
  }
  let t = 0;
  function animate() {
    ctx.clearRect(0, 0, visualCanvas.width, visualCanvas.height);
    // Edges with pulses
    for (let e = 0; e < edges.length; e++) {
      let [i, j] = edges[e];
      ctx.save();
      ctx.strokeStyle = `hsl(${(t*2+e*30)%360},100%,60%)`;
      ctx.globalAlpha = 0.22 + 0.3*Math.abs(Math.sin(t/20+e));
      ctx.beginPath();
      ctx.moveTo(nodes[i].x, nodes[i].y);
      ctx.lineTo(nodes[j].x, nodes[j].y);
      ctx.stroke();
      ctx.restore();
      // Signal pulse
      let pulsePos = (Math.sin(t/20+e)+1)/2;
      let px = nodes[i].x + (nodes[j].x - nodes[i].x)*pulsePos;
      let py = nodes[i].y + (nodes[j].y - nodes[i].y)*pulsePos;
      ctx.beginPath();
      ctx.arc(px, py, 3 + 2*Math.abs(Math.sin(t/10+e)), 0, Math.PI*2);
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    // Nodes
    for (let n = 0; n < nodes.length; n++) {
      let node = nodes[n];
      let pulse = Math.abs(Math.sin(t/10+node.pulse));
      ctx.beginPath();
      ctx.arc(node.x, node.y, 8 + 7*pulse, 0, Math.PI*2);
      ctx.fillStyle = `hsl(${(n*40+t*3)%360},100%,60%)`;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.shadowBlur = 0;
      // Occasional burst
      if (Math.random() < 0.01) {
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 26+Math.random()*18, 0, Math.PI*2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText('Neural Map', 14, 32);
    t += 1.5;
    neuralMapAnimId = requestAnimationFrame(animate);
  }
  animate();
}

function updateVisualization() {
  const D = parseInt(document.getElementById('informationDensity').value);
  const A = parseInt(document.getElementById('knowledgeBase').value);
  const S = parseInt(document.getElementById('cognitiveComplexity').value);
  const modeIndex = parseInt(document.getElementById("visualModeSelect").value);

  switch (modeIndex) {
    case 0:
      drawCoordinateMap(D, A, S);
      break;
    case 1:
      drawArchetypeLandscape();
      break;
    case 2:
      drawSignalOrbit();
      break;
    case 3:
      drawNeuralMap();
      break;
  }
}

document.getElementById("visualModeSelect").addEventListener("change", updateVisualization);

["informationDensity", "knowledgeBase", "cognitiveComplexity"].forEach(id => {
  document.getElementById(id).addEventListener("input", updateVisualization);
});

// Mode swap logic
function updateMainMode() {
  const mainMode = document.getElementById("mainModeSelect").value;
  const visualizerPanelMount = document.getElementById("visualizerPanelMount");
  const artCanvasBox = document.getElementById("artCanvasBox");
  if (mainMode === "visualizer") {
    visualizerPanelMount.style.display = "block";
    artCanvasBox.style.display = "none";
    updateVisualization();
  } else {
    visualizerPanelMount.style.display = "none";
    artCanvasBox.style.display = "block";
  }
}
document.getElementById("mainModeSelect").addEventListener("change", updateMainMode);
window.addEventListener("load", () => {
  document.getElementById("mainModeSelect").value = "regular";
  updateMainMode();

    // Visualizer Help ('?') button logic
  
  const mainModeSelect = document.getElementById("mainModeSelect");
  const visualModeSelect = document.getElementById("visualModeSelect");

  const helpBtn = document.getElementById('helpBtn');
  function updateHelpBtnVisibility() {
    if (typeof helpBtn !== 'undefined' && helpBtn) helpBtn.style.display = (mainModeSelect.value === "visualizer") ? "inline-block" : "none";
  }
  mainModeSelect.addEventListener("change", updateHelpBtnVisibility);
  updateHelpBtnVisibility();

  if (helpBtn) {
    if (typeof helpBtn !== 'undefined' && helpBtn) helpBtn.onclick = function() {
      // Hide all legend popups first
      if (drawArchetypeLandscape.animate && typeof drawArchetypeLandscape.animate.hideLegendPopup === "function") drawArchetypeLandscape.animate.hideLegendPopup();
      if (drawSignalOrbit && typeof drawSignalOrbit.hideLegendPopup === "function") drawSignalOrbit.hideLegendPopup();
      if (typeof drawCoordinateMap?.hideLegendPopup === "function") drawCoordinateMap.hideLegendPopup();

      // Show the correct legend for the current mode
      const modeIndex = parseInt(visualModeSelect.value);
      if (modeIndex === 0 && typeof drawCoordinateMap?.showLegendPopupUniversal === "function") {
        drawCoordinateMap.showLegendPopupUniversal();
      } else if (modeIndex === 1 && drawArchetypeLandscape.animate && typeof drawArchetypeLandscape.animate.showArchetypeLegendPopup === "function") {
        drawArchetypeLandscape.animate.showArchetypeLegendPopup();
      } else if (modeIndex === 2 && drawSignalOrbit && typeof drawSignalOrbit.showSignalOrbitLegendPopup === "function") {
        drawSignalOrbit.showSignalOrbitLegendPopup();
      }
    };
  }
});
window.addEventListener("load", updateVisualization);
