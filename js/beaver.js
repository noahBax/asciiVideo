function beaver() {
    const TEST_IMAGE = document.getElementById("image1");
    const C1 = document.createElement("canvas");
    const BASE_IMAGE = C1.getContext("2d");
    const IMG_1 = new Image();
    IMG_1.src = TEST_IMAGE.src;
    console.log("Pixelating");
    // TEST_IMAGE.remove();
    let w = IMG_1.width;
    let h = IMG_1.height;
    C1.width = w;
    C1.height = h;
    BASE_IMAGE.drawImage(IMG_1, 0, 0);
    // Pixelate the image first
    // const PIXELATED_CANVAS = document.createElement("canvas");
    // PIXELATED_CANVAS.width = w;
    // PIXELATED_CANVAS.height = h;
    // const PIXELATED_CTX = PIXELATED_CANVAS.getContext("2d");
    let pixelArr = BASE_IMAGE.getImageData(0, 0, w, h).data;
    console.log("Here");
    let maxBrightness = 0;
    for (let y = 0; y < h; y += pixelSize) {
        for (let x = 0; x < w; x += pixelSize) {
            let p = (x + y * w) * 4;
            const r = pixelArr[p];
            const g = pixelArr[p + 1];
            const b = pixelArr[p + 2];
            const avg = (r + g + b) / 3;
            maxBrightness = (avg > maxBrightness) ? avg : maxBrightness;
            // PIXELATED_CTX.fillStyle = "rgba(" + pixelArr[p] + ", " + pixelArr[p + 1] + ", " + pixelArr[p + 2] + pixelArr[p + 3] + ")";
            // PIXELATED_CTX.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
        }
    }
    // const PIXELATED = new Image();
    // PIXELATED.src = PIXELATED_CANVAS.toDataURL("image/jpeg");
    // PIXELATED.width = 600;
    // PIXELATED.id = "image2";
    // document.body.appendChild(PIXELATED)
    // console.log(PIXELATED);
    console.log("Grayscaling");
    // const GRAYSCALE_CANVAS = document.createElement("canvas") as HTMLCanvasElement;
    // const GRAYSCALE_CTX = GRAYSCALE_CANVAS.getContext("2d");
    // GRAYSCALE_CANVAS.width = w;
    // GRAYSCALE_CANVAS.height = h;
    // GRAYSCALE_CTX.font = "20px Arial";
    let docString = "";
    // Get the brightness values and fill those in
    for (let y = 0; y < h; y += pixelSize) {
        for (let x = 0; x < w; x += pixelSize) {
            let p = (x + y * w) * 4;
            const r = pixelArr[p];
            const g = pixelArr[p + 1];
            const b = pixelArr[p + 2];
            const avg = (r + g + b) / 3;
            // console.log(avg)
            // GRAYSCALE_CTX.fillStyle = "rgb(" + avg + "," + avg + "," + avg + ")";
            // GRAYSCALE_CTX.fillStyle = "white";
            // ctx2.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
            const INDEX = Math.floor(avg / maxBrightness * (DENSITY_ZERO.length - 1));
            // GRAYSCALE_CTX.fillText(DENSITY[INDEX], x, y, PIXEL_SIZE)
            if (DENSITY_ZERO[INDEX] == undefined) {
                console.log(INDEX, DENSITY_ZERO[INDEX]);
            }
            docString += (INDEX < 4) ? "\b" : DENSITY_ZERO[INDEX];
        }
        docString += "<br />";
    }
    // const GRAYSCALE = new Image();
    // GRAYSCALE.src = GRAYSCALE_CANVAS.toDataURL("image/jpeg");
    // GRAYSCALE.width = 600;
    // GRAYSCALE.id = "grayscale";
    // document.body.appendChild(GRAYSCALE)
    // console.log(GRAYSCALE);
    const SPAN = document.createElement("span");
    SPAN.innerHTML = docString;
    document.getElementById("beaver").appendChild(SPAN);
}
// beaver();
