const foreground = "#f2dbf0";

// Getting HTML Elements
const canvas = document.getElementById("harvey-canvas");
const timeHTML = document.getElementById("current-time");
let harveyImage = new Image(canvas.width, canvas.height);
let mirrorImage = new Image(canvas.width, canvas.height);
harveyImage.src = "./assets/harvey.png";
mirrorImage.src = "./assets/mirror.png";

// Setting up canvas properties
const proportion = 0.9; // This must remain consistent with CSS Flexbox proportions
const dimension = Math.min(575, window.innerHeight, window.innerWidth) * proportion;
canvas.width = `${dimension}`;
canvas.height = `${dimension}`;
const radius = dimension / 2.15;
const clipRadius = radius * 0.9;
const center = {
    x: dimension / 2,
    y: dimension / 2,
};
const ctx = canvas.getContext("2d");
ctx.strokeStyle = foreground;
ctx.fillStyle = foreground;
ctx.lineCap = "round";

// Setting up clock properties
class clockHand {
    length;
    tickDistance;
    thickness;
    angle;
    timeElapsed;

    constructor(handLength, tickDistance, thickness) {
        this.length = handLength;
        this.tickDistance = tickDistance;
        this.thickness = thickness;
    }
}
const secondHand = new clockHand(0.85 * radius, Math.PI / 30, 4);
const minuteHand = new clockHand(secondHand.length / 1.5, Math.PI / 30, 5);
const hourHand = new clockHand(minuteHand.length / 1.5, Math.PI / 6, 5);
const boopLength = radius / 30;
const initAngle = 1.5 * Math.PI; // 12 AM

// Needed for some render logic in animation function
let firstRender = true;
let lastRenderedSecond;

// Initiate clock ticks once all images have finished loading
Promise.all(
    [harveyImage, mirrorImage].map(image =>
        new Promise(resolve => {
            image.addEventListener("load", () => {
                resolve();
            });
        })
    )
).then(() => {
    ctx.drawImage(mirrorImage, 0, 0, dimension, dimension);
    ctx.drawCircle(radius, 3);
    ctx.save();
    lastRenderedSecond = (Math.floor(Date.now() / 1000) % 86400) % 60;
    requestAnimationFrame(renderClockTick);
});

function renderClockTick() {
    requestAnimationFrame(renderClockTick); // Recursive Callback

    // Time Elapsed since beginning of day
    const currentTime = new Date();
    secondHand.timeElapsed = currentTime.getSeconds();
    minuteHand.timeElapsed = currentTime.getMinutes();
    hourHand.timeElapsed = (() => {
        // 12-hour time format
        let hoursElapsed = currentTime.getHours() % 12;
        return hoursElapsed === 0 ? 12 : hoursElapsed;
    })();

    // Prevents redundant rendering
    if (secondHand.timeElapsed === lastRenderedSecond && !firstRender) return;
    else lastRenderedSecond = secondHand.timeElapsed;

    // Map current time to angles of clock hands
    for (const hand of [secondHand, minuteHand, hourHand])
        hand.angle = initAngle + hand.timeElapsed * hand.tickDistance;

    ctx.clearClip();

    // Clipping
    ctx.arc(
        center.x,
        center.y,
        clipRadius,
        initAngle + (initAngle === secondHand.angle ? secondHand.tickDistance : 0),
        secondHand.angle
    );
    ctx.lineTo(center.x, center.y);
    ctx.clip();
    drawClockFrame(true);

    // Removing second-hand's residue at the 1st second
    if (secondHand.timeElapsed === 1) {
        ctx.clearClip();
        ctx.beginPath();
        ctx.rect(
            center.x - secondHand.thickness / 1.7,
            center.y - clipRadius,
            secondHand.thickness / 1.7,
            clipRadius
        );
        ctx.clip();
        drawClockFrame(false);
    }

    // Conditional image swap
    if (secondHand.timeElapsed === 0)
        [harveyImage, mirrorImage] = [mirrorImage, harveyImage];

    firstRender = false;

    // update HTML element for displaying time digitally
    updateTimeHTML(hourHand.timeElapsed, minuteHand.timeElapsed, secondHand.timeElapsed);
}
