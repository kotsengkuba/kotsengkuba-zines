const title = "para llevar coming soon";
const fontName = 'fonts/VT323-Regular.ttf';

function setup() {
    p5Canvas = createCanvas(windowWidth,windowHeight, WEBGL);
    p5Canvas.parent("main-div");
    frameRate(12);
    font = loadFont(fontName);
    textFont(font);
    fill(100);
    textSize(24);
    textAlign(LEFT, TOP);
}

function draw() {
    text(title, random(-windowWidth, windowWidth), random(-windowHeight, windowHeight)); 
}