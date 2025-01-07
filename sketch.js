const fontName = 'fonts/VT323-Regular.ttf';
const asciiFontName = 'fonts/VT323-Regular.ttf';
const density = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`.   ';
const fps = 24;

const title = "para llevar coming soon";

const shadowOffset = 5;

var clickIndex = 0;

let myBuffer;
let imageBuffers = [];
let titleX = 0;
let titleY = 0;
let titleBuffer;
let sampleImage;

function preload() {  
  font = loadFont(fontName);
  sampleImage = loadImage("/assets/sample_image_128.jpg")
}

function setup() {
  p5Canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  p5Canvas.parent("main-div");
  textFont(font);
  frameRate(fps);
  background(255);
  sampleImage.loadPixels();
  imageBuffers.push(imageToAsciiAsBuffer(sampleImage, floor(sampleImage.width/30)));
  titleBuffer = createFramebuffer();
}

function mouseClicked() {
  if(mouseY < 20 && clickIndex > 0) {
    clickIndex--;
  } else {
    clickIndex++;      
  }
}

function draw() {
  clear();
  push();
  translate(-windowWidth/2, -windowHeight/2);
  
  for(let i = 0; i < imageBuffers.length; i++) {
    image(imageBuffers[i], i*100, 0);
  }
  
  if(frameCount % fps == 0) {
    titleX = random(50, windowWidth);
    titleY = random(50, windowHeight);
    drawTitle();
  }
  image(titleBuffer, 0, 0);
  pop();
}

function drawTitle() {
  fill(100);
  textSize(24);
  textAlign(LEFT, TOP);
  textWrap(WORD);
  let w = textWidth(title) + 10;

  titleBuffer = drawTextbox(title, titleX, titleY, w, 5);
}

function drawTextbox(t, x, y, width, leftPadding){
  let newLines = textToWidth(t, width).split("\n");
  let tempBuffer = createFramebuffer();
  tempBuffer.begin();
  translate(-windowWidth/2, -windowHeight/2);
  fill(0);
  noStroke();
  rect(shadowOffset+x-leftPadding, shadowOffset+y, width+leftPadding, newLines.length*textSize());
  fill('white');
  stroke(0);
  strokeWeight(2);
  rect(x-leftPadding, y, width+leftPadding, newLines.length*textSize());
  for(let i = 0; i<newLines.length; i++) {
    fill(100);
    text(newLines[i], x, y + i*textSize()); 
  }
  tempBuffer.end();
  return tempBuffer;
}

function textToWidth(text, width) {
  let lines = text.split("\n");
  modified_text = "";
  w = 200;
  for(let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let words = line.split(" ");
    let testLine = "";
    for(let j = 0; j < words.length; j++) {
      let word = words[j];
      if(textWidth(word) > width) {
        modified_text = modified_text + "\n";
        testLine = "";
        for(let k = 0; k < word.length; k++) {
          let letter = word.charAt(k);
          testLine = testLine + letter;
          let metrics = textWidth(testLine);
          if(metrics < w) {
            modified_text = modified_text + letter;
          } else {
            modified_text = modified_text + "\n";
            testLine = "";
          }
        }
      } else {
        testLine = testLine + ' ' + word;
        let metrics = textWidth(testLine);

        if(metrics <= width) {
          modified_text = modified_text + word + ' ';
        } else {
          modified_text = modified_text + "\n" + word + ' ';
          testLine = word;
        }
      }      
    }
    modified_text = modified_text + "\n";
  }
  return modified_text;
}

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

  //image(im, 0, 0);
  tempBuffer.end();
  return tempBuffer;
}