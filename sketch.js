const fps = 12;
const fontName = 'fonts/CutiveMono-Regular.ttf';
//const fontName = 'fonts/VT323-Regular.ttf';

const asciiSet = '@#$B%8&WM*oahkbdpqwmZO0QLCJUYXzcvunxrjft/()1{}[]?-_+~<>i!lI;:,"^`.  ';

const shadowOffset = 5;
const margin = 10;

let clickIndex = 0;
let fileNames = [
  "titlepage.txt", 
  "intropage.txt", 
  "borderspage_01.txt", 
  "airportspage_01.txt",
  "october-june.txt",
  "kapwapage_01.txt",
  "languagepage_01.txt",
  "Touristsgo.txt",
  "soundpage_01.txt",
  "calatoniapage_01.txt",
  "foodpage_01.txt",
  "pi100page_01.txt",
  "leveluppage_01.txt",
  "back2startpage_01.txt", 
  "extras.txt"
];
/*let fileNames = [
  "intropage.txt",
  "titlepage.txt", 
  "intropage.txt"
];*/

let textBoxes = [];
let sceneTitleTextBox;
let pageTitleTextBox;
let titleX = 0;
let titleY = 0;

let asciiSize = 24;
let defaultFontSize = 16;

let characterSet; // The character set object, contains the texture of the characters to be used in the shader

let slidesShader;
let shaderLayer;
let imageLayer;
let leftLayer;
let rightLayer;

let currScene;
let currSceneIndex = 0;
let currPageIndex = 0;
let prevPageCount = 0;
let currBoxesStartIndex = 0;
let nextBoxesStartIndex = 0;
let currBoxesTotHeight = 0;

let loadedImages = [];
let fileLoaded = false;
let isDrawn = false;
let allScenesData = [];
let leftImageIndex = 0;
let rightImageIndex = 0;

function preload() {  
  font = loadFont(fontName);
  sceneData = loadStrings("/content/" + fileNames[0]);
  slidesShader = loadShader("base.vert", "shader.frag");

  for(let i=0; i < fileNames.length; i++) {
    allScenesData.push(loadStrings("/content/" + fileNames[i]));
  }
}

function setup() {
  //console.log(allScenesData);
  sceneData = allScenesData[0];
  currScene = new Scene({title: ""});
  p5Canvas = createCanvas(windowWidth - 10, windowHeight - 10, WEBGL);
  p5Canvas.parent("main-div");
  frameRate(fps);
  background(0);
  pixelDensity(1);

  shaderLayer = createGraphics(width, height, WEBGL);
  shaderLayer.shader(slidesShader);
  imageLayer = createGraphics(width, height, WEBGL);
  leftLayer = createGraphics(width/2, height, WEBGL);
  rightLayer = createGraphics(width/2, height*2, WEBGL);
  
  leftLayer.textFont(font);
  leftLayer.textSize(defaultFontSize);
  leftLayer.textAlign(LEFT, TOP);
  leftLayer.fill(50);

  loadSceneFromFile();
  characterSet = new CharacterSet({font: font, fontSize: asciiSize, characters: asciiSet });
}

function mouseClicked() {
  isDrawn = false;
  let shouldSceneChange = false;
  // track clicks if left or right side of the screen
  if(mouseX < width/2) {
    shouldSceneChange = leftTrigger();
  } else {
    shouldSceneChange = rightTrigger();
  }

  // reload files
  if(shouldSceneChange) {
    sceneData = allScenesData[currSceneIndex];
    loadSceneFromFile();
  }

  loadPageTextBox();
  loadTextBoxes();

  resetTextBoxes();
}
function leftTrigger() {
  let shouldSceneChange = false;
  currBoxesStartIndex = 0;
  if(currPageIndex > 0) {
    currPageIndex--;
    loadImageLayer();
  } else if(currSceneIndex > 0) {
    currSceneIndex--;
    currPageIndex = prevPageCount;
    shouldSceneChange = true;
  } else {
    // first page is reached.. do nothing
  }
  return shouldSceneChange;
}

function rightTrigger() {
  let shouldSceneChange = false;
  if(nextBoxesStartIndex < textBoxes.length) {
    currBoxesStartIndex = nextBoxesStartIndex;
  } else {
    currBoxesStartIndex = 0;
    if(currPageIndex < currScene.getPageCount()-1) {
      currPageIndex++;
      loadImageLayer();
    } else if (currSceneIndex < fileNames.length-1) {
      currSceneIndex++;
      prevPageCount = currScene.getPageCount()-1;
      currPageIndex = 0;
      shouldSceneChange = true;
    } else {
      // end is reached.. return to first page
      currSceneIndex = 0;
      currPageIndex = 0;
      currBoxesStartIndex = 0;
      shouldSceneChange = true;
    }
  } 
  return shouldSceneChange;
}

function mouseMoved() {
  asciiSize = floor(map(mouseY, 0, height, 1, 16)) * 4;
  if(asciiSize >= 4) characterSet.setFontSize(asciiSize);

  shaderLayer.clear();
  shaderLayer.background(150,150,150,100);
  shaderLayer.rect(0, 0); // idk why this works
  setShaderValues();
}

function keyPressed() {
  isDrawn = false;
  let shouldSceneChange = false;
  // track  left and right key presses
  if(keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    if(keyCode === LEFT_ARROW) {
      shouldSceneChange = leftTrigger();
    } else if (keyCode === RIGHT_ARROW) {
      shouldSceneChange = rightTrigger();
    }
  
    // reload files
    if(shouldSceneChange) {
      sceneData = allScenesData[currSceneIndex];
      loadSceneFromFile();
    }
  
    loadPageTextBox();
    loadTextBoxes();
  
    resetTextBoxes();
  }
}

function draw() {
  // redraw when everythings loaded
  shaderLayer.clear();
  shaderLayer.background(150,150,150,100);
  shaderLayer.rect(0, 0); // idk why this works
  setShaderValues();
  //if(fileLoaded && !isDrawn) {
    clear();
    push();
    translate(-width/2, -height/2);
    image(shaderLayer, 0, 0);
    if (!keyIsDown(49)) {
      image(leftLayer, 0, 0);
    } else {
      tint(255, 127);
      image(loadedImages[leftImageIndex], 0, (height-loadedImages[leftImageIndex].height)/2);
    }
    if (!keyIsDown(50)) {
      image(rightLayer, width/2, 0);
    } else {
      tint(255, 127);
      image(loadedImages[rightImageIndex], width/2, (height-loadedImages[rightImageIndex].height)/2);
    }
    
    //image(leftLayer, 0, 0);
    //image(rightLayer, width/2, 0);
    pop();
    
    //isDrawn = true;
  //}
}

function setShaderValues() {
  slidesShader.setUniform('u_simulationTexture', imageLayer); // The texture containing the simulation, which is used to create the ASCII character grid

  slidesShader.setUniform('u_characterTexture', characterSet.getTexture()); // The 2D texture containing the character set
  slidesShader.setUniform('u_charsetCols', float(characterSet.getColumns())); // The number of columns in the charset texture
  slidesShader.setUniform('u_charsetRows', float(characterSet.getRows())); // The number of rows in the charset texture
  slidesShader.setUniform('u_totalChars', characterSet.getTotalChars()); // The total number of characters in the character set texture

  slidesShader.setUniform('u_gridOffsetDimensions', [0, 0]); // The dimensions of the grid offset in pixels

  let cell = characterSet.getMaxGlyphDimensions(characterSet.fontSize);
  let gridDimensions = [floor(width/cell.width), float(height/cell.height)];
  slidesShader.setUniform('u_gridPixelDimensions' , [width, height]); // The dimensions of the grid cell in pixels (total width and height)
  slidesShader.setUniform('u_gridDimensions', gridDimensions); // The dimensions of the grid in number of cells

  slidesShader.setUniform('u_characterColor', [1.0, 1.0, 1.0]); // The color of the ASCII characters
  slidesShader.setUniform('u_characterColorMode', 0); // The color mode (0 = image color, 1 = single color)
  slidesShader.setUniform('u_backgroundColor', [1.0, 1.0, 1.0]); // The background color of the ASCII art
  slidesShader.setUniform('u_backgroundColorMode', 0); // The background color mode (0 = image color, 1 = single color)

  slidesShader.setUniform('u_invertMode', 0); // The character invert mode (0 = normal, 1 = inverted)

  if(frameCount % 2 == 0){
    slidesShader.setUniform('u_randBrightness', [random(0.1, 0.125), random(0.1, 0.625), random(0.1, 0.12)]); // randomize brightness threashold

  }
    
}

function loadSceneFromFile() {
  //currPageIndex = 0;
  loadedImages = [];
  let line = sceneData[0];
  fileLoaded = true;

  if(line.startsWith("# ")) {
    //currScene = new Scene({title: line});
    if(currSceneIndex == 0) {
      currScene.reset(line);
    } else {
      let number = allScenesData.length - 1;
      let title = currSceneIndex + "/" + number +" " + line ;
      currScene.reset(title);
    }
  }
    
  //else
    //currScene = new Scene({title: "Untitled"});

  let tempPage;
  let currText = "";
  for (let i = 0; i < sceneData.length; i++) {
    let line = sceneData[i];
    
    if(line.startsWith("## ")){
      if(tempPage == undefined) { // first
        tempPage = {
          "title": "",
          "text": []
        };
        tempPage.title = line;
      } else {
        if(currText.length > 0) tempPage.text.push(currText);
        currText = "";
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
    } else if (tempPage != undefined && line.length > 0) {
      if (currText.length > 0) currText += "\n";
      currText +=  line;
    } else if(line.length == 0 && currText.length > 0) {
      tempPage.text.push(currText);
      currText = "";
    }
  }
  if(tempPage.title.length > 0) {
    tempPage.text.push(currText);
    currText = "";
    currScene.addPage(tempPage.title, tempPage.text);
  }

  for(let i = 0; i < currScene.images.length; i++) {
    let tempImage = loadImage(currScene.images[i], loadImagesCallback);
  }

  resetTextBoxes();
}

function loadImagesCallback(data) {
  data.loadPixels();
  loadedImages.push(data);

  if(loadedImages.length == currScene.getImageCount()) {
    fileLoaded = true;
    //console.log("all images loaded");
    loadImageLayer();
  }
}

function loadPageTextBox() {
  if(pageTitleTextBox == undefined) {
    pageTitleTextBox = new TextBox({text: currScene.getPage(currPageIndex).title, font: font, fontSize: defaultFontSize, width: 200, padding: 10, hasShadow: true});
  } else {
    pageTitleTextBox.setText(currScene.getPage(currPageIndex).title);
    //pageTitleTextBox.setText("ABCDEF");
  }
}

function loadTextBoxes() {
  textBoxes = [];
  let tempPage = currScene.getPage(currPageIndex);    
  for(let j = 0; j < tempPage.texts.length; j++) {
    let tempTextBox = new TextBox({text: tempPage.texts[j], font: font, fontSize: defaultFontSize, width: width/4, padding: 10, hasShadow: true});
    textBoxes.push(tempTextBox);
  }
}


function resetTextBoxes() {
  sceneTitleTextBox = new TextBox({text: currScene.title, font: font, fontSize: defaultFontSize, width: 200, padding: 10, hasShadow: true});
  loadPageTextBox();
  loadTextBoxes();

  leftLayer.clear();
  rightLayer.clear();

  let xPos = (leftLayer.width-sceneTitleTextBox.getWidth())/2;
  let yPos = (leftLayer.height-sceneTitleTextBox.getHeight())/2;
  //.draw(leftLayer, 0, 0, false);
  leftLayer.push();
  leftLayer.translate(-leftLayer.width/2, -leftLayer.height/2);
  leftLayer.image(sceneTitleTextBox.getTexture(), 10, 10);
  leftLayer.pop();

  xPos = (leftLayer.width-pageTitleTextBox.getWidth())/2;
  yPos = (leftLayer.width-pageTitleTextBox.getHeight())/2;
  //pageTitleTextBox.draw(leftLayer, xPos, yPos, false);
  leftLayer.push();
  leftLayer.translate(-leftLayer.width/2, -leftLayer.height/2);
  leftLayer.image(pageTitleTextBox.getTexture(), xPos, yPos);
  leftLayer.pop();

  let tempY = 0;
  let xOffset = 0;
  let tempTotHeight = 0;
  for(let i = currBoxesStartIndex; i < textBoxes.length; i++) {
    tempTotHeight += (textBoxes[i].getHeight() + margin);
    if(tempTotHeight < height) {
      xPos = margin;
      xOffset = random(textBoxes[i].getWidth()/2);
      rightLayer.push();
      rightLayer.translate(-rightLayer.width/2, -rightLayer.height/2);
      rightLayer.image(textBoxes[i].getTexture(), xPos+xOffset, margin + tempY);
      rightLayer.pop();
      tempY += textBoxes[i].getHeight() + 10;
      nextBoxesStartIndex = i+1;
    }
  }
}

function loadImageLayer() {
  // only need 2 images to show so if there are more than 2, select randomly
  leftImageIndex = 0;
  rightImageIndex = 1;

  if(loadedImages.length > 2) {
    leftImageIndex = floor(random(0, loadedImages.length));
    if(leftImageIndex == loadedImages.length - 1) {
      rightImageIndex = 0;
    } else {
      rightImageIndex = leftImageIndex+1;
    }
  } else if (loadedImages.length == 1) {
    rightImageIndex = 0;
  }

  imageLayer.clear();
  imageLayer.push();
  imageLayer.translate(-width/2, -height/2);

  loadedImages[leftImageIndex].resize(width/2, 0);
  loadedImages[rightImageIndex].resize(width/2, 0);

  let maxYoffset = height - loadedImages[leftImageIndex].height;
  imageLayer.image(loadedImages[leftImageIndex], 0, random(0, maxYoffset), width/2);
  imageLayer.image(loadedImages[rightImageIndex], width/2, random(0, maxYoffset), width/2);
  imageLayer.pop();
}