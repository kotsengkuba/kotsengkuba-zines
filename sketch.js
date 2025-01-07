const fontName = 'fonts/VT323-Regular.ttf';
const asciiFontName = 'fonts/VT323-Regular.ttf';

const title = "para llevar coming soon";

const shadowOffset = 5;

var clickIndex = 0;

function preload() {  
  font = loadFont(fontName);
}

function setup() {
  p5Canvas = createCanvas(windowWidth,windowHeight, WEBGL);
  p5Canvas.parent("main-div");
  frameRate(24);
  background(255);
}

function mouseClicked() {
  if(mouseY < 20 && clickIndex > 0) {
    clickIndex--;
  } else {
    clickIndex++;
    drawTitle();
  }
}

function draw() {
}

function drawTitle() {
  fill(100);
  textFont(font);
  textSize(24);
  textAlign(LEFT, TOP);
  textWrap(WORD);
  let w = textWidth(title) + 10;

  drawTextbox(title, random(0, windowWidth-w), random(0, windowHeight), w, 5);
}

function drawTextbox(t, x, y, width, leftPadding){
  let newLines = textToWidth(t, width).split("\n");

  push();
  translate(-windowWidth/2, -windowHeight/2);
  fill(0);
  rect(shadowOffset+x-leftPadding, shadowOffset+y, width+leftPadding, newLines.length*textSize());
  fill(255);
  rect(x-leftPadding, y, width+leftPadding, newLines.length*textSize());
  for(let i = 0; i<newLines.length; i++) {
    fill(100);
    text(newLines[i], x, y + i*textSize()); 
    
    //let bbox = font.textBounds(newLines[i], 0, i*textSize());
    //rect(bbox.x, bbox.y, bbox.w+1, bbox.h+1);
  }
  pop();
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
        console.log(testLine);
        let metrics = textWidth(testLine);
        console.log(metrics);

        if(metrics <= width) {
          modified_text = modified_text + word + ' ';
          //testLine += ' ';
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