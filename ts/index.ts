var pixelSize = 2;
const DENSITY_ZERO = ' .\'`^\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$'
var chromaThreshold = 6923
var brightnessThreshold = 24;
var currentFrameData: {maxBrightness: number, lowestBrightness: number, indexString: number[][][]};
function loaded() {
    // document.getElementById("image1").addEventListener("load", beaver)

    
    document.getElementById("chroma").innerHTML = chromaThreshold + '';
    document.getElementById("pixel").innerHTML = pixelSize + '';
    document.getElementById('brightness').innerHTML = brightnessThreshold + "";
    let densityString = "<mark>" + DENSITY_ZERO.substring(0,brightnessThreshold) + "</mark>" + DENSITY_ZERO.substring(brightnessThreshold);
    document.getElementById("densitySlider").innerHTML = densityString;



    document.getElementById("chromaSlider").addEventListener('input', (e) => {
        let t = parseInt((e.target as HTMLInputElement).value);
        chromaThreshold = t;
        document.getElementById("chroma").innerHTML = t + '';
        if (!playing && started) {
            drawFrame(currentFrameData);
        }
    });

    const R: HTMLHtmlElement = document.querySelector(':root');
    const SIZING_REF = [0,0,0,10,24,40]
    // R.style.setProperty('--main-offset', SIZING_REF[brightnessThreshold] + 'px');

    document.getElementById("pixelSlider").addEventListener('input', (e) => {
        let t = parseInt((e.target as HTMLInputElement).value);
        pixelSize = t;
        document.getElementById("pixel").innerHTML = t + '';
        R.style.setProperty('--calc-val', t + "");
        if (!playing && started) {
            currentFrameData = createFrameData();
            drawFrame(currentFrameData);
        }
    })

    document.getElementById("brightSlider").addEventListener('input', (e) => {
        let t = parseInt((e.target as HTMLInputElement).value);
        brightnessThreshold = t;
        document.getElementById('brightness').innerHTML = t + "";
        let densityString = "<mark>" + DENSITY_ZERO.substring(0,brightnessThreshold) + "</mark>" + DENSITY_ZERO.substring(brightnessThreshold);
        document.getElementById("densitySlider").innerHTML = densityString;
        if (!playing && started) {
            drawFrame(currentFrameData);
        }
    })

    var started = false;
    var playing = false;


    // Main Meat
    const VIDEO = document.getElementById("video1") as HTMLVideoElement;
    const w = 1280;
    const h = 720;
    const VIDEO_CANVAS = document.createElement('canvas') as HTMLCanvasElement;
        VIDEO_CANVAS.width = w;
        VIDEO_CANVAS.height = h;
    const ctx = VIDEO_CANVAS.getContext('2d');
    const DIV = document.getElementById("display") as HTMLDivElement;
    document.getElementById("zerotwo").appendChild(DIV);

    let loop: number;

    function drawFrame(frameData: {maxBrightness: number, lowestBrightness: number, indexString: number[][][]}) {
        DIV.innerHTML = "";

        let docString = "";

        let range = frameData.maxBrightness - frameData.lowestBrightness;
        for (let y = 0; y < frameData.indexString.length; y++) {
            for (let x = 0; x < frameData.indexString[0].length; x++) {
                if (frameData.indexString[y][x][1] < chromaThreshold) {
                    docString += "&nbsp;";
                } else {
                    const INDEX = Math.floor((frameData.indexString[y][x][0] - frameData.lowestBrightness) / range * (DENSITY_ZERO.length - 1));
                    docString += (INDEX < brightnessThreshold) ? "&nbsp;" : DENSITY_ZERO[INDEX];
                }
            }
            docString += "<br />";
        }

        DIV.innerHTML = docString;
    }

    function createFrameData(): {maxBrightness: number, lowestBrightness: number, indexString: number[][][]} {
        ctx.clearRect(0, 0, VIDEO.videoWidth, VIDEO.videoHeight);
        ctx.drawImage(VIDEO, 0, 0, VIDEO.videoWidth, VIDEO.videoHeight);
        
        let pixelArr = ctx.getImageData(0, 0, w, h).data;

        let DATA = {
            maxBrightness: 0,
            lowestBrightness: 255,
            indexString: []
        }
        for (let y = 0; y < h / pixelSize; y += pixelSize) {
            let build: number[][] = [];
            for (let x = 0; x < w / pixelSize; x += pixelSize) {
                let p = (x + y * w) * 4 * pixelSize;
                const r = pixelArr[p];
                const g = pixelArr[p + 1];
                const b = pixelArr[p + 2];

                const distance = (61-r)**2 + (51-g)**2 + (58-b)**2;
                const avg = ( r + g + b) / 3;
                build.push([avg, distance]);

                DATA.maxBrightness = (avg > DATA.maxBrightness) ? avg : DATA.maxBrightness;
                DATA.lowestBrightness = (avg < DATA.lowestBrightness) ? avg : DATA.lowestBrightness;
            }
            DATA.indexString.push(build);
        }

        return DATA;
    }
    
    VIDEO.addEventListener('play', () => {
        started = true;
        playing = true;
        loop = window.setInterval(() => {
            currentFrameData = createFrameData();
            drawFrame(currentFrameData);

        }, 1000/60);
    });
    
    VIDEO.addEventListener('pause', () => {
        playing = false;
        window.clearInterval(loop);
    })
}
