const fontName = 'fonts/VT323-Regular.ttf';
const density = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/()1{}[]?-_+~<>i!lI;:,"^`.   ';
const fps = 24;

const title = "coming soon...";

const shadowOffset = 5;

var clickIndex = 0;

let myBuffer;
let imageBuffers = [];
let titleX = 0;
let titleY = 0;
let sampleImage;

let characterSet; // The character set object, contains the texture of the characters to be used in the shader

let slidesShader;
let shaderLayer;
let characterSetLayer;
let topLayer;
let textSrc;

function preload() {  
  font = loadFont(fontName);
  sampleImage = loadImage("/assets/sample_image_128.jpg");
  slidesShader = loadShader("base.vert", "asciishader.frag");
}

function setup() {
  p5Canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  p5Canvas.parent("main-div");

  shaderLayer = createGraphics(width, height, WEBGL);
  characterSetLayer = createGraphics(width, height, WEBGL);
  topLayer = createGraphics(width, height, WEBGL);
  textSrc = createGraphics(width*2, height*2, WEBGL);

  textFont(font);
  shaderLayer.textFont(font);
  topLayer.textFont(font);
  frameRate(fps);
  background(255);

  shaderLayer.shader(slidesShader);

  textSrc.textFont(font);

  characterSet = new CharacterSet({font: font, fontSize: 80, characters: density });
  topLayer.sampleTextbox = new TextBox({text: "hello world", font: font, fontSize: 12, width: 80, padding: 10, hasShadow: true}); 
  topLayer.titleTextbox = new TextBox({text: title, font: font, fontSize: 32, width: 200, padding: 10, hasShadow: false});

  sampleImage.loadPixels();
  imageBuffers.push(imageToAsciiAsBuffer(sampleImage, floor(sampleImage.width/30)));
}

function mouseClicked() {
  // track clicks
  if(mouseY < 20 && clickIndex > 0) {
    clickIndex--;
  } else {
    clickIndex++;      
  }
}

function draw() {
  clear();
  // fun animation
  topLayer.rotateX(frameCount/1000);
  topLayer.rotateY(frameCount/2000);
  topLayer.rotateZ(frameCount/2000);
  
  if(frameCount % (fps) == 0) {
    titleX = random(50, windowWidth);
    titleY = random(50, windowHeight);
  }
  

  /*
  for(let i = 0; i < imageBuffers.length; i++) {
    image(imageBuffers[i], i*100, 0);
  }
  
  */

  shaderLayer.clear();
  shaderLayer.rect(0, 0, 1, 1);

  slidesShader.setUniform('tex0', sampleImage);
  slidesShader.setUniform('charSet2D', characterSet.getTexture());
  let offsetX = map(mouseX, 0, width, -50, 50);
  let offsetY = map(mouseY, 0, height, 0.001, 0.05);
  slidesShader.setUniform('offset', [offsetX, offsetY]);
  slidesShader.setUniform('time', frameCount * 0.025);
  slidesShader.setUniform('tiles', map(mouseX, 0, width, 200, 1));

  push();
  translate(-windowWidth/2, -windowHeight/2);
  image(shaderLayer, 0, 0);
  topLayer.sampleTextbox.draw(topLayer, mouseX, mouseY);
  topLayer.titleTextbox.draw(topLayer, titleX, titleY);
  image(topLayer, 0, 0);
  
  pop();
}

// ---------------------------------- //
function imageToAsciiAsBuffer(im, stepSize) {
  let inputImage = im;
  if(stepSize > inputImage.width) {
    stepSize = inputImage.width;
  }
  console.log(stepSize);
  let tSize = 12;
  let whiteMin = 0;
  let whiteMax = 255;
  let dens = density;
  let scale = 10;

  let tempBuffer = createFramebuffer();
  tempBuffer.begin();
  translate(-windowWidth/2, -windowHeight/2);
  fill(100);

  for (let j = 0; j < inputImage.height; j+=stepSize) {
    let row = "0";
    for (let i = 0; i < inputImage.width; i+=stepSize) {
      const pixelIndex = (i + j * inputImage.width) *4;
      const r = inputImage.pixels[pixelIndex + 0];
      const g = inputImage.pixels[pixelIndex + 1];
      const b = inputImage.pixels[pixelIndex + 2];

      const avg = (r + g + b) / 3;
      fill(r,g,b);
      textSize(tSize);
      const len = dens.length;
      const charIndex = floor(map(avg, whiteMin, whiteMax, 0, len));
      const c = dens.charAt(charIndex);
      text(c, i, j);
    }
  }
  tempBuffer.end();
  return tempBuffer;
}