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

        textFont(this.font);
        textSize(this.fontSize);
        textAlign(LEFT, TOP);

        this.textToWidth(this.text, this.width);
    }

    draw(gfx, x, y) {
        let newLines = this.text.split("\n");
        
        gfx.push();
        gfx.translate((-windowWidth/2) + 1, (-windowHeight/2) + 1);
        gfx.textFont(this.font);
        gfx.textSize(this.fontSize);
        gfx.textAlign(LEFT, TOP);

        if(this.hasShadow) {
            gfx.fill(0);
            gfx.noStroke();
            gfx.rect(this.shadowOffset+x, this.shadowOffset+y, this.width+this.padding, newLines.length*this.fontSize); // draw shadow
        }
        
        gfx.stroke(0);
        gfx.strokeWeight(2);
        gfx.fill(255);
        gfx.translate(0,0,0.5);
        gfx.rect(x, y, this.width+this.padding, newLines.length*this.fontSize);
        gfx.translate(0,0,0.5);
        for(let i = 0; i<newLines.length; i++) {
            gfx.fill(100);
            gfx.text(newLines[i], x+this.padding, y + i*this.fontSize); 
        }
        gfx.translate(0,0,-1.5);
        for(let i = 0; i<newLines.length; i++) {
            gfx.fill(100);
            gfx.text(newLines[i], x+this.padding, y + i*this.fontSize); 
        }
        gfx.pop();
    }

    textToWidth(text, width) {
        let lines = text.split("\n");
        let modified_text = "";
        let w = width;
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
        this.text = modified_text;
    }
}