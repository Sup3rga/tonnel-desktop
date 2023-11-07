
export default class ImageTheme {
    __ctx = null;
    __canvas = null;
    __img = null;

    constructor(){
        this.__canvas = document.createElement('canvas');
        this.__ctx = this.__canvas.getContext('2d');
    }

    setImageDataUrl(data){
        const img = new Image();
        img.src = data;
        return this.setImage(img);
    }

    setImage(imgEl){
        this.__img = imgEl;
        return this;
    }

    get(){
        const rgb = [0,0,0];
        const height = this.__canvas.height = this.__img.naturalHeight || this.__img.offsetHeight || this.__img.height;
        const width = this.__canvas.width = this.__img.naturalWidth || this.__img.offsetWidth || this.__img.width;

        this.__ctx.drawImage(this.__img, 0, 0);

        let count = 0,data, blockSize = 5, i = -4;

        try {
            data = this.__ctx.getImageData(0, 0, width, height);
        } catch(e) {
            /* security error, img on diff domain */
            return rgb;
        }

        const length = data.data.length;

        while ( (i += blockSize * 4) < length ) {
            count++;
            rgb[0] += data.data[i];
            rgb[1] += data.data[i+1];
            rgb[2] += data.data[i+2];
        }

        // ~~ used to floor values
        rgb[0] = Math.floor(rgb[0]/count);
        rgb[1] = Math.floor(rgb[1]/count);
        rgb[2] = Math.floor(rgb[2]/count);

        return rgb;
    }
}