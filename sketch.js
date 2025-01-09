const fontName = 'fonts/VT323-Regular.ttf';
//const fontName = 'fonts/CutiveMono-Regular.ttf';
const density = '#$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/()1{}[]?-_+~<>i!lI;:,"^`.  ';
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
let imageLayer;
let characterSetLayer;
let topLayer;
let textSrc;

function preload() {  
  font = loadFont(fontName);
  sampleImage = loadImage("/assets/sample_image_128.jpg");
  //slidesShader = loadShader("base.vert", "asciishader.frag");
  slidesShader = loadShader("base.vert", "shader.frag");
}

function setup() {
  p5Canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  p5Canvas.parent("main-div");

  shaderLayer = createGraphics(width, height, WEBGL);
  imageLayer = createGraphics(width, height, WEBGL);
  characterSetLayer = createGraphics(width, height, WEBGL);
  topLayer = createGraphics(width, height, WEBGL);
  textSrc = createGraphics(width*2, height*2, WEBGL);

  textFont(font);
  shaderLayer.textFont(font);
  topLayer.textFont(font);
  frameRate(fps);
  background(0);

  shaderLayer.shader(slidesShader);

  textSrc.textFont(font);

  characterSet = new CharacterSet({font: font, fontSize: 24, characters: density });
  topLayer.sampleTextbox = new TextBox({text: "hello world", font: font, fontSize: 12, width: 80, padding: 10, hasShadow: true}); 
  topLayer.titleTextbox = new TextBox({text: title, font: font, fontSize: 32, width: 200, padding: 10, hasShadow: false});

  imageLayer.push();
  imageLayer.translate(-windowWidth/2, -windowHeight/2);
  imageLayer.background(255);
  sampleImageW = windowWidth/2;
  sampleImageH = (sampleImageW/ sampleImage.width) * sampleImage.height;
  imageLayer.image(sampleImage, (windowWidth - sampleImageW)/2, (windowHeight - sampleImageH)/2, sampleImageW, sampleImageH);
  imageLayer.pop();

  sampleImage.loadPixels();
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

  let fontSize = floor(mouseX/20);
  if(fontSize > 4) characterSet.setFontSize(fontSize);

  shaderLayer.clear();
  shaderLayer.rect(0, 0, 1, 1);

  //console.log([characterSet.getColumns(), characterSet.getRows(), characterSet.getTotalChars()]);
  slidesShader.setUniform('u_characterTexture', characterSet.getTexture()); // The 2D texture containing the character set
  slidesShader.setUniform('u_charsetCols', float(characterSet.getColumns())); // The number of columns in the charset texture
  slidesShader.setUniform('u_charsetRows', float(characterSet.getRows())); // The number of rows in the charset texture
  slidesShader.setUniform('u_totalChars', characterSet.getTotalChars()); // The total number of characters in the character set texture

  slidesShader.setUniform('u_simulationTexture', imageLayer); // The texture containing the simulation, which is used to create the ASCII character grid

  slidesShader.setUniform('u_gridOffsetDimensions', [0, 0]); // The dimensions of the grid offset in pixels

  let cell = characterSet.getMaxGlyphDimensions(characterSet.fontSize);
  let gridDimensions = [floor(windowWidth/cell.width), float(windowHeight/cell.height)];
  slidesShader.setUniform('u_gridPixelDimensions' , [width, height]); // The dimensions of the grid cell in pixels (total width and height)
  slidesShader.setUniform('u_gridDimensions', gridDimensions); // The dimensions of the grid in number of cells

  slidesShader.setUniform('u_characterColor', [0.0, 0.0, 0.0]); // The color of the ASCII characters
  slidesShader.setUniform('u_characterColorMode', 0); // The color mode (0 = image color, 1 = single color)
  slidesShader.setUniform('u_backgroundColor', [0.0, 1.0, 0.3]); // The background color of the ASCII art
  slidesShader.setUniform('u_backgroundColorMode', 0); // The background color mode (0 = image color, 1 = single color)

  slidesShader.setUniform('u_invertMode', 0); // The character invert mode (0 = normal, 1 = inverted)

  slidesShader.setUniform('u_randBrightness', [getRandomFloat(0.4, 0.6), getRandomFloat(0.4, 0.9), getRandomFloat(0.4, 0.6)]); // rand

  push();
  translate(-windowWidth/2, -windowHeight/2);
  image(shaderLayer, 0, 0);
  //image(characterSet.getTexture(), 0, 0);

  //topLayer.sampleTextbox.draw(topLayer, mouseX, mouseY);
  topLayer.titleTextbox.draw(topLayer, titleX, titleY);
  image(topLayer, 0, 0);
  pop();
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}