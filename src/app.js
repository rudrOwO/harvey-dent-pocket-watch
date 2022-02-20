const foreground = "#f2dbf0";

// Getting HTML Elements
const canvas = document.getElementById("harvey-canvas");
const timeHTML = document.getElementById("current-time");
let harveyImage = new Image(canvas.width, canvas.height);
let mirrorImage = new Image(canvas.width, canvas.height);
harveyImage.src = "./assets/harvey.png";
mirrorImage.src = "./assets/mirror.png";

// This array of promises ensures that initialization code is run only after both images have finished loading
const imagesLoaded = [
    new Promise((resolve) => {
        harveyImage.addEventListener("load", () => {
            resolve();
        });
    }),
    new Promise((resolve) => {
        mirrorImage.addEventListener("load", () => {
            resolve();
        });
    }),
];

// Setting up canvas properties
const proportion = 0.9; // This must remain consistent with CSS Flexbox proportions
const dimension =
    Math.min(575, window.innerHeight, window.innerWidth) * proportion;
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

// Setting up clock-hand data-class
class clockHand {
    length;
    tickDistance;     
    thickness;
    angle;
    
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
let firstRender = true;
let lastRenderedSecond;

// Initiate clock ticks once all images have finished loading
Promise.all(imagesLoaded).then(() => {
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
    const secondsElapsed = currentTime.getSeconds();
    const minutesElapsed = currentTime.getMinutes();
    const hoursElapsed = (() => {  // 12-hour time format
        let hoursElapsed = currentTime.getHours() % 12;
        return hoursElapsed === 0 ? 12 : hoursElapsed;
    })();

    // Prevents redundant rendering
    if (secondsElapsed === lastRenderedSecond && !firstRender) return;
    else lastRenderedSecond = secondsElapsed;

    // Map current time to angles of clock hands
    hourHand.angle = initAngle + hoursElapsed * hourHand.tickDistance;
    minuteHand.angle = initAngle + minutesElapsed * minuteHand.tickDistance;
    secondHand.angle = initAngle + secondsElapsed * secondHand.tickDistance;

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

    const drawClockFrame = (drawSecondHand = true) => {
        ctx.drawImage(harveyImage, 0, 0, dimension, dimension);
        if (firstRender) ctx.clearClip();
        ctx.drawCircle(radius, 3);
        if (drawSecondHand)
            ctx.drawHand(
                secondHand.angle,
                secondHand.length,
                secondHand.thickness
            );
        ctx.drawHand(minuteHand.angle, minuteHand.length, minuteHand.thickness);
        ctx.drawHand(hourHand.angle, hourHand.length, hourHand.thickness);
        ctx.drawCircle(boopLength, 3); // Boop
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        ctx.strokeStyle = foreground;
    };

    drawClockFrame();

    // Removing second-hand's residue at the 1st second
    if (secondsElapsed === 1) {
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
    if (secondsElapsed === 0)
        [harveyImage, mirrorImage] = [mirrorImage, harveyImage];

    firstRender = false;

    // update HTML element for displaying time digitally
    updateTimeHTML(hoursElapsed, minutesElapsed, secondsElapsed);
}
