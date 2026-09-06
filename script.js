let image = null; 
let balloonPosition = { x: 200, y: 100 }; 

// Upload image
document.getElementById("upload").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      image = new Image();
      image.onload = () => drawPreview();
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Add text boxes
document.getElementById("add-text").addEventListener("click", () => {
  const container = document.getElementById("texts-container");
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter text";
  container.appendChild(input);
  container.appendChild(document.createElement("br"));
});

// Capture click for balloon position
document.getElementById("canvas").addEventListener("click", (event) => {
  const canvas = event.target;
  const rect = canvas.getBoundingClientRect();
  balloonPosition.x = event.clientX - rect.left;
  balloonPosition.y = event.clientY - rect.top;
  drawPreview();
});

// Draw preview
function drawPreview() {
  if (!image) return;
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0);

  const size = parseInt(document.getElementById("size").value);

  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(balloonPosition.x, balloonPosition.y, size, size * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (document.getElementById("tail").checked) {
    ctx.beginPath();
    ctx.moveTo(balloonPosition.x, balloonPosition.y + size * 0.6);
    ctx.lineTo(balloonPosition.x + 20, balloonPosition.y + size * 0.6 + 40);
    ctx.lineTo(balloonPosition.x + 40, balloonPosition.y + size * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

// Generate images
function generateImages() {
  if (!image) {
    alert("Please upload an image first!");
    return;
  }

  const inputs = document.querySelectorAll("#texts-container input[type='text']");
  const texts = Array.from(inputs).map(i => i.value.trim()).filter(t => t.length > 0);

  if (texts.length === 0) {
    alert("Please enter at least one text!");
    return;
  }

  const includeTail = document.getElementById("tail").checked;
  const size = parseInt(document.getElementById("size").value);
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  texts.forEach((text, i) => {
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(balloonPosition.x, balloonPosition.y, size, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (includeTail) {
      ctx.beginPath();
      ctx.moveTo(balloonPosition.x, balloonPosition.y + size * 0.6);
      ctx.lineTo(balloonPosition.x + 20, balloonPosition.y + size * 0.6 + 40);
      ctx.lineTo(balloonPosition.x + 40, balloonPosition.y + size * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText(text, balloonPosition.x - size/2 + 20, balloonPosition.y);

    const link = document.createElement("a");
    link.download = `output_${i}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

document.getElementById("generate").onclick = generateImages;
