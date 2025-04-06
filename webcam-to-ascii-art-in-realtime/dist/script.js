/**
 * Keep this lowres!
 */
const w = 92,
h = 64;

/**
 * ASCII art palettes to try
 * These characters range from high to low density
 */
const palettes = {
  SHORT: "@%#*+=-:.",
  MEDIUM: "@%#8*+=-:,. ",
  LONGER: "$@B%8&WM#*oa*+=-:,.",
  LONG: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft?+~i!lI;:,^`'." };


const modes = {
  GRAYSCALE: 1,
  COLOR: 2,
  WHITE: 3 };


/**
 * The palette to use
 * CHANGE THIS VALUE!
 */
const chars = palettes.LONG; // palettes.SHORT, etc.

/**
 * The color mode to use
 * CHANGE THIS VALUE!
 */
const mode = modes.GRAYSCALE; // modes.WHITE / modes.COLOR

// ------------------------------------------

// Video takes in the webcam
const video = document.createElement("video");

// Canvas to render video stream on
const canvas = document.createElement("canvas");
canvas.width = w;
canvas.height = h;
canvas.style.width = `${w}px`;
canvas.style.width = `${h}px`;
const ctx = canvas.getContext("2d");
ctx.scale(-1, 1);

// Output div to receive ASCII art
const output = document.createElement("div");
output.classList.add("output");
document.body.appendChild(output);

// Get camera
navigator.mediaDevices.
getUserMedia({
  audio: false,
  video: { width: w, height: h } }).

then(stream => {
  // get stream
  video.srcObject = stream;
  // start cam
  video.play();
  // start loop
  tick();
}).
catch(error => {
  console.warn(error.message, error.name);
});

/**
 * The loop itself
 */
const tick = () => {
  window.requestAnimationFrame(tick);

  // new video frame
  ctx.drawImage(video, -w, 0, w, h);

  // build color value array
  var d = ctx.getImageData(0, 0, w, h).data;

  // transpile every pixel
  let out = "";
  for (let y = 0; y < h; y++) {
    // columns first
    for (let x = 0; x < w; x++) {
      // then rows
      // get color values at pixel
      const index = (x + y * w) * 4;
      const r = d[index];
      const g = d[index + 1];
      const b = d[index + 2];
      // const a = imageData.data[index + 3]; // alpha

      // calc average color
      const avg = Math.floor((r + g + b) / 3);

      // get character in palette
      let c = chars.charAt(map(avg, 255, 0, 0, chars.length));

      // html don't do multiple spaces
      if (c == " ") c = "&nbsp;";

      // add to output
      switch (mode) {
        case modes.COLOR:
          out += `<span style="color:rgb(${r}, ${g}, ${b})">${c}</span>`;
          break;

        case modes.GRAYSCALE:
          out += `<span style="color:rgb(${avg}, ${avg}, ${avg})">${c}</span>`;
          break;

        case modes.WHITE:
        default:
          out += c;
          break;}

    }

    // newline for every row of pixels
    out += "<br>";
  }

  output.innerHTML = out;
};

function normalize(value, minimum, maximum) {
  return (value - minimum) / (maximum - minimum);
}
function interpolate(normValue, minimum, maximum) {
  return minimum + (maximum - minimum) * normValue;
}
function map(value, min1, max1, min2, max2) {
  return interpolate(normalize(value, min1, max1), min2, max2);
}