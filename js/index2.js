var pixelSize = 2;
// const DENSITY = ' _.,-=+:;cba!?0123456789$W#@Ñ';
const DENSITY = ' .\'`^\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
var chromaThreshold = 2500;
var brightnessThreshold = 1;
function loaded() {
    // document.getElementById("image1").addEventListener("load", beaver)
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
                const INDEX = Math.floor(avg / maxBrightness * (DENSITY.length - 1));
                // GRAYSCALE_CTX.fillText(DENSITY[INDEX], x, y, PIXEL_SIZE)
                if (DENSITY[INDEX] == undefined) {
                    console.log(INDEX, DENSITY[INDEX]);
                }
                docString += (INDEX < 4) ? "\b" : DENSITY[INDEX];
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
    document.getElementById("chroma").innerHTML = chromaThreshold + '';
    document.getElementById("pixel").innerHTML = pixelSize + '';
    document.getElementById('brightness').innerHTML = brightnessThreshold + "";
    // document.getElementById("video1").addEventListener('load', zerotwo);
    function zerotwo() {
        document.getElementById("chromaSlider").addEventListener('input', (e) => {
            let t = parseInt(e.target.value);
            chromaThreshold = t;
            document.getElementById("chroma").innerHTML = t + '';
            drawFrame();
        });
        document.getElementById("pixelSlider").addEventListener('input', (e) => {
            let t = parseInt(e.target.value);
            pixelSize = t;
            document.getElementById("pixel").innerHTML = t + '';
            drawFrame();
        });
        document.getElementById("brightSlider").addEventListener('input', (e) => {
            let t = parseInt(e.target.value);
            brightnessThreshold = t;
            document.getElementById('brightness').innerHTML = t + "";
            drawFrame();
        });
        const VIDEO = document.getElementById("video1");
        const w = 1280;
        const h = 720;
        const VIDEO_CANVAS = document.createElement('canvas');
        VIDEO_CANVAS.width = w;
        VIDEO_CANVAS.height = h;
        const ctx = VIDEO_CANVAS.getContext('2d');
        const DIV = document.getElementById("display");
        document.getElementById("zerotwo").appendChild(DIV);
        // document.getElementById("zerotwo").appendChild(VIDEO_CANVAS);
        let loop;
        let shown = false;
        function drawFrame() {
            DIV.innerHTML = "";
            ctx.clearRect(0, 0, VIDEO.videoWidth, VIDEO.videoHeight);
            ctx.drawImage(VIDEO, 0, 0, VIDEO.videoWidth, VIDEO.videoHeight);
            let pixelArr = ctx.getImageData(0, 0, w, h).data;
            let indexString = [];
            let docString = "";
            let maxBrightness = 0;
            let lowestBrightness = 255;
            for (let y = 0; y < h / pixelSize; y += pixelSize) {
                let build = [];
                for (let x = 0; x < w / pixelSize; x += pixelSize) {
                    let p = (x + y * w) * 4 * pixelSize;
                    const r = pixelArr[p];
                    const g = pixelArr[p + 1];
                    const b = pixelArr[p + 2];
                    // Apply the chromekey
                    const distance = (61 - r) ** 2 + (51 - g) ** 2 + (58 - b) ** 2;
                    if (distance < chromaThreshold) {
                        build.push(-1);
                    }
                    else {
                        const avg = (r + g + b) / 3;
                        build.push(avg);
                        maxBrightness = (avg > maxBrightness) ? avg : maxBrightness;
                        lowestBrightness = (avg < lowestBrightness) ? avg : lowestBrightness;
                    }
                }
                indexString.push(build);
            }
            // console.log(indexString);
            // console.log(DENSITY.length);
            let range = maxBrightness - lowestBrightness;
            for (let y = 0; y < indexString.length; y++) {
                for (let x = 0; x < indexString[0].length; x++) {
                    if (indexString[y][x] == -1) {
                        docString += "&nbsp;";
                    }
                    else {
                        const INDEX = Math.floor((indexString[y][x] - lowestBrightness) / range * (DENSITY.length - 1));
                        docString += (INDEX < brightnessThreshold) ? "&nbsp;" : DENSITY[INDEX];
                    }
                    // if (!shown) {
                    //     console.log(INDEX)
                    // }
                }
                docString += "<br />";
            }
            // console.log(docString)
            DIV.innerHTML = docString;
        }
        VIDEO.addEventListener('play', () => {
            loop = window.setInterval(drawFrame, 1000 / 60);
        });
        VIDEO.addEventListener('pause', () => {
            window.clearInterval(loop);
        });
    }
    zerotwo();
}
