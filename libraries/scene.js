/** */
class Scene {

    constructor({title, subtitle = ""}) {
        this.title = title;
        this.subtitle = subtitle;
        this.pages = [];
        this.images = [];
    }

    addPage(title, textArr) {
        this.pages.push({title: title, texts: textArr});
    }

    addImage(im) {
        this.images.push(im);
    }

    getPageCount() {
        return this.pages.length;
    } 

    getPage(index) {
        return this.pages[index];
    }

    getImageCount() { 
        return this.images.length;
    }
}
