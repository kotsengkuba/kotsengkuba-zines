/** */
class Scene {

    constructor({title, subtitle = ""}) {
        this.title = title;
        this.subtitle = subtitle;
        this.pages = [];
        this.images = [];
    }

    addPage(title, textArr) {
        this.pages.push({title: title, texts: textArr, pageImages:[]});
    }

    addPage(title, textArr, imArr) {
        this.pages.push({title: title, texts: textArr, pageImages: imArr});
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

    setTitle(t) {
        this.title = this.title;
    }
    reset(title) {
        this.title = title;
        this.pages = [];
        this.images = [];
    }
}
