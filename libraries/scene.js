/** */
class Scene {

    constructor({title, subtitle = ""}) {
        this.title = title;
        this.subtitle = subtitle;
        this.pages = [];
        this.images = [];
    }

    addPage(title, textArr, imArr = []) {
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

    getImageIndexOf(str) {
        return this.images.indexOf(str);
    }

    getPageImageCount(pageIndex) {
        return this.pages[pageIndex].pageImages.length;
    }

    getPageImage(pageIndex, imIndex) {
        return this.pages[pageIndex].pageImages[imIndex];
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
