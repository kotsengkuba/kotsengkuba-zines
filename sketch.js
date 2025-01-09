const fontName = 'fonts/VT323-Regular.ttf';
//const fontName = 'fonts/CutiveMono-Regular.ttf';
const asciiSet = '#$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/()1{}[]?-_+~<>i!lI;:,"^`.  ';
const fps = 24;

const title = "coming soon...";

const shadowOffset = 5;

let clickIndex = 0;
let fileNames = ["titlepage.txt", "pages.txt", "pages_2.txt"];

let textBoxes = [];
let titleX = 0;
let titleY = 0;
let sampleImage;
let asciiSize = 24;
let defaultFontSize = 18;

let characterSet; // The character set object, contains the texture of the characters to be used in the shader

let slidesShader;
let shaderLayer;
let imageLayer;
let topLayer;

let currScene;
let loadedImages = [];

function preload() {  
  font = loadFont(fontName);
  scenesData = loadStrings("/content/" + fileNames[0]);
  sampleImage = loadImage("/assets/STREETS_02_480.png");
  sampleImage_2 = loadImage("/assets/STREETS_06_480.png");
  slidesShader = loadShader("base.vert", "shader.frag");
}

function setup() {
  p5Canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  p5Canvas.parent("main-div");

  shaderLayer = createGraphics(width, height, WEBGL);
  imageLayer = createGraphics(width, height, WEBGL);
  topLayer = createGraphics(width, height, WEBGL);

  loadSceneFromFile();

  textFont(font);
  shaderLayer.textFont(font);
  topLayer.textFont(font);
  frameRate(fps);
  background(0);

  shaderLayer.shader(slidesShader);

  characterSet = new CharacterSet({font: font, fontSize: asciiSize, characters: asciiSet });

  /*sampleImage.loadPixels();*/
}

function mouseClicked() {
  // track clicks
  if(mouseY < 20 && clickIndex > 0) {
    clickIndex--;
  } else {
    clickIndex++;      
  }

  scenesData = loadStrings("/content/" + fileNames[clickIndex%fileNames.length], loadSceneFromFile);
  topLayer.clear();
}

function draw() {
  clear();
  // fun animation
  //topLayer.rotateX(frameCount/1000);
  //topLayer.rotateY(frameCount/2000);
  //topLayer.rotateZ(frameCount/2000);
  
  if(frameCount % (fps) == 0) {
    titleX = random(50, windowWidth);
    titleY = random(50, windowHeight);
  }

  let fontSize = floor(mouseY/30);
  if(fontSize >= 4) characterSet.setFontSize(fontSize);

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
  slidesShader.setUniform('u_backgroundColor', [1.0, 1.0, 1.0]); // The background color of the ASCII art
  slidesShader.setUniform('u_backgroundColorMode', 0); // The background color mode (0 = image color, 1 = single color)

  slidesShader.setUniform('u_invertMode', 0); // The character invert mode (0 = normal, 1 = inverted)

  //slidesShader.setUniform('u_randBrightness', [0.22, 0.12, 0.12]); // rand
  slidesShader.setUniform('u_randBrightness', [random(0.1, 0.125), random(0.1, 0.625), random(0.1, 0.12)]); // rand

  push();
  translate(-windowWidth/2, -windowHeight/2);
  image(shaderLayer, 0, 0);
  for(let i = 0; i < textBoxes.length; i++) {
    textBoxes[i].draw(topLayer, i * 220, 10, false);
  }
  image(topLayer, 0, 0);
  loadImageLayer();
  pop();
}

function loadSceneFromFile() {
  let line = scenesData[0];
  if(line.startsWith("# "))
    currScene = new Scene({title: line});
  else
    currScene = new Scene({title: "Untitled"});

  let tempPage;

  for (let i = 0; i < scenesData.length; i++) {
    let line = scenesData[i];

    if(line.startsWith("## ")){
      if(tempPage == undefined) { // first
        tempPage = {
          "title": "",
          "text": []
        };
        tempPage.title = line;
      } else {
        currScene.addPage(tempPage.title, tempPage.text);
        tempPage = {
          "title": line,
          "text": []
        };
      }     
      
    } else if (line.startsWith("# ")) {
      // what to do? can the file have multiple scenes??
    } else if(line.startsWith("!")) {
      const start = line.indexOf("(") + 1;
      const end = line.indexOf(")");
      const imgFileName = line.substring(start, end);
      currScene.addImage(imgFileName);
    } else {
      tempPage.text.push(line);
    }
  }
  if(tempPage.title.length > 0) {
    currScene.addPage(tempPage.title, tempPage.text);
  }

  loadedImages = [];
  for(let i = 0; i < currScene.images.length; i++) {
    let tempImage = loadImage(currScene.images[i], loadImagesCallback);
  }

  loadTextBoxes();
}

function loadImagesCallback(data) {
  data.loadPixels();
  loadedImages.push(data);
  console.log(data);

  if(loadedImages.length == currScene.getImageCount()) {
    console.log("all loaded");
    loadImageLayer();
  }
}

function loadTextBoxes() {
  textBoxes = [];
  for(let i = 0; i < currScene.getPageCount(); i++) {
    let tempPage = currScene.getPage(i);
    let tempTextBox = new TextBox({text: tempPage.title, font: font, fontSize: defaultFontSize, width: 200, padding: 10, hasShadow: true});
    textBoxes.push(tempTextBox);
    
    for(let j = 0; j < tempPage.texts.length; j++) {
      let tempTextBox = new TextBox({text: tempPage.texts[j], font: font, fontSize: defaultFontSize, width: 200, padding: 10, hasShadow: true});
      textBoxes.push(tempTextBox);
    }
  }
}

function loadImageLayer() {
  imageLayer.clear();
  imageLayer.push();
  imageLayer.translate(-windowWidth/2, -windowHeight/2);
  let lastWidth = 0;
  for(let i = 0; i < loadedImages.length; i++) {
    imageLayer.image(loadedImages[i], lastWidth, 0);
    lastWidth += loadedImages[i].width;
  }
  imageLayer.pop();
}