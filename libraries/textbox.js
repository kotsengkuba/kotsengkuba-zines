class TextBox {
    /**
     */
    constructor({ text, font, fontSize = 16, width, padding, hasShadow }) {
        this.text = text;
        this.font = font;
        this.fontSize = fontSize;
        this.width = width;
        this.hasShadow = hasShadow;
        this.shadowOffset = 5;
        this.padding = padding;

        this.textToWidth(this.text, this.width);
    }

    setText(t) {
        this.text = t;
        this.textToWidth(this.text, this.width);
        this.output.clear();
        this.drawOutput();
    }

    drawOutput() {
        let newLines = this.text.split("\n");
        this.output.fill(0);
        this.output.noStroke();
        this.output.rect(this.shadowOffset, this.shadowOffset, this.width+this.padding, this.getHeight());

        this.output.stroke(0);
        this.output.strokeWeight(1);
        this.output.fill(255, 255, 255);
        this.output.rect(0, 0, this.width+this.padding, this.getHeight());
        this.output.fill(50);
        for(let i = 0; i<newLines.length; i++) {
            let line = newLines[i];
            this.output.text(newLines[i], this.padding, this.padding + i*this.fontSize); 
        }
    }

    draw(gfx, x, y, isClear = false) {
        let newLines = this.text.split("\n");
        
        gfx.push();
        if(isClear) gfx.clear();
        gfx.translate((-gfx.width/2), (-gfx.height/2));
        gfx.textFont(this.font);
        gfx.textSize(this.fontSize);
        gfx.textAlign(LEFT, CENTER);

        if(this.hasShadow) {
            gfx.fill(0);
            gfx.noStroke();
            gfx.rect(this.shadowOffset+x, this.shadowOffset+y, this.width+this.padding, this.getHeight()); // draw shadow
        }
        
        gfx.stroke(0);
        gfx.strokeWeight(2);
        gfx.fill(255);
        gfx.translate(0,0,0.1);
        gfx.rect(x, y, this.width+this.padding,  this.getHeight());
        gfx.translate(0,0,0.1);
        gfx.fill(50);
        for(let i = 0; i<newLines.length; i++) {
            let line = newLines[i];
            gfx.text(newLines[i], x+this.padding, this.padding + y + i*this.fontSize); 
        }
        /*gfx.translate(0,0,-1.5);
        for(let i = 0; i<newLines.length; i++) {
            gfx.fill(50);
            gfx.text(newLines[i], x+this.padding, y + i*this.fontSize); 
        }*/
        gfx.pop();
    }

    textToWidth(text, width) {
        let lines = text.split("\n");
        this.text = "";
        
        let modified_text = "";
        let w = width;
        push();
        textFont(this.font);
        textSize(this.fontSize);
        for(let i = 0; i < lines.length; i++) {
            if(i!=0) modified_text = modified_text + "\n";
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
        }
        pop();
        this.text = modified_text;
    }

    getHeight() {
        let newLines = this.text.split("\n");
        return (this.padding*2) + (newLines.length*this.fontSize);
    }

    getWidth() {
        return this.width;
    }

    getTexture() {
        if(this.output == undefined) {
            this.output = createGraphics(this.getWidth()  + (2*this.padding), this.getHeight()  + this.shadowOffset);
            this.output.textFont('Courier New');
            this.output.textSize(this.fontSize);
            this.output.textAlign(LEFT, TOP);
            this.drawOutput();
        }
        return this.output;
    }
}