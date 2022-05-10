function videoLoaded() {
    var background;
    var started = false;
    var usingBackground = false;
    var pixelSize = 1;
    // const DENSITY_VIDEO = ' .\'`^\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$'
    const DENSITY_VIDEO = ' .:-=+*#%@';
    var chromaThreshold = 50;
    var brightnessThreshold = 1;
    const VIDEO = document.createElement("video");
    VIDEO.setAttribute('autoplay', 'true');
    const w = 80;
    const h = 60;
    // document.body.appendChild(VIDEO)
    const REFERENCE_CANVAS = document.getElementById('vid');
    // const REFERENCE_CANVAS = document.createElement('canvas') as HTMLCanvasElement;
    REFERENCE_CANVAS.width = w;
    REFERENCE_CANVAS.height = h;
    const ctx_ref = REFERENCE_CANVAS.getContext('2d');
    // document.body.appendChild(REFERENCE_CANVAS)
    const DIV = document.getElementById("display");
    // Get the video stuff
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            width: w,
            height: h
        },
        framerate: 60,
        whiteBalanceMode: false
    }).then((stream) => {
        console.log(stream);
        VIDEO.srcObject = stream;
        ctx_ref.drawImage(VIDEO, 0, 0, w, h);
        started = true;
        let drawLoop = window.setInterval(() => {
            drawFrame(createFrameData());
        }, 1000 / 30);
        // Take care of the reference button
        document.getElementById('backgroundButton').addEventListener('click', () => {
            usingBackground = true;
            background = ctx_ref.getImageData(0, 0, w, h).data;
        });
        document.getElementById('resetButton').addEventListener('click', () => {
            usingBackground = false;
        });
    }).catch(e => {
        console.log("Media Error: " + e);
        if (e instanceof DOMException) {
            console.log("This is not allowed");
        }
    });
    function drawFrame(frameData) {
        let docString = "";
        let range = frameData.maxBrightness - frameData.lowestBrightness;
        for (let y = 0; y < frameData.indexString.length; y++) {
            for (let x = 0; x < frameData.indexString[0].length; x++) {
                if (frameData.indexString[y][x][1] < chromaThreshold && usingBackground) {
                    docString += "&nbsp;";
                }
                else {
                    const INDEX = Math.floor((frameData.indexString[y][x][0] - frameData.lowestBrightness) / range * (DENSITY_VIDEO.length - 1));
                    docString += (INDEX < brightnessThreshold) ? "&nbsp;" : DENSITY_VIDEO[INDEX];
                }
            }
            docString += "<br />";
        }
        DIV.innerHTML = docString;
    }
    function createFrameData() {
        ctx_ref.drawImage(VIDEO, 0, 0, VIDEO.videoWidth, VIDEO.videoHeight);
        let pixelArr = ctx_ref.getImageData(0, 0, w, h).data;
        let DATA = {
            maxBrightness: 0,
            lowestBrightness: 255,
            indexString: []
        };
        for (let y = 0; y < h / pixelSize; y += pixelSize) {
            let build = [];
            for (let x = w / pixelSize; x > 0; x -= pixelSize) {
                let p = (x + y * w) * 4 * pixelSize;
                const r = pixelArr[p];
                const g = pixelArr[p + 1];
                const b = pixelArr[p + 2];
                const distance = usingBackground ? (background[p] - r) ** 2 + (background[p + 1] - g) ** 2 + (background[p + 2] - b) ** 2 : 255;
                const avg = (r + g + b) / 3;
                build.push([avg, distance]);
                DATA.maxBrightness = (avg > DATA.maxBrightness) ? avg : DATA.maxBrightness;
                DATA.lowestBrightness = (avg < DATA.lowestBrightness) ? avg : DATA.lowestBrightness;
            }
            DATA.indexString.push(build);
        }
        return DATA;
    }
}
