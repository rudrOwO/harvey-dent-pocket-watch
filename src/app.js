// Colors
const background = "#21082c";
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

// Setting up clock properties
const secondHandLength = 0.85 * radius;
const minuteHandLength = secondHandLength / 1.5;
const hourHandLength = minuteHandLength / 1.5;

const secondTickDistance = Math.PI / 30;
const minuteTickDistance = Math.PI / 30;
const hourTickDistance = Math.PI / 6;

const secondHandThickness = 4;
const minuteHandThickness = 5;
const hourHandThickness = 5;

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
    let secondsElapsed = Math.floor(Date.now() / 1000) % 86400;
    let minutesElapsed = Math.floor(secondsElapsed / 60);
    let hoursElapsed = Math.floor(minutesElapsed / 60) + 6; // My local time

    secondsElapsed %= 60;

    // Prevents redundant rendering
    if (secondsElapsed === lastRenderedSecond && !firstRender) return;
    else lastRenderedSecond = secondsElapsed;

    minutesElapsed %= 60;
    hoursElapsed %= 12; // 12 hour time format

    // Map current time to angles of clock hands
    const hourHandAngle = initAngle + hoursElapsed * hourTickDistance;
    const minuteHandAngle = initAngle + minutesElapsed * minuteTickDistance;
    const secondHandAngle = initAngle + secondsElapsed * secondTickDistance;

    ctx.clearClip();

    // Clipping
    ctx.arc(
        center.x,
        center.y,
        clipRadius,
        initAngle + (initAngle === secondHandAngle ? secondTickDistance : 0),
        secondHandAngle
    );
    ctx.lineTo(center.x, center.y);
    ctx.clip();

    const drawClockFrame = (drawSecondHand = true) => {
        ctx.drawImage(harveyImage, 0, 0, dimension, dimension);
        if (firstRender) ctx.clearClip();
        ctx.drawCircle(radius, 3);
        if (drawSecondHand)
            ctx.drawHand(
                secondHandAngle,
                secondHandLength,
                secondHandThickness
            );
        ctx.drawHand(minuteHandAngle, minuteHandLength, minuteHandThickness);
        ctx.drawHand(hourHandAngle, hourHandLength, hourHandThickness);
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
            center.x - secondHandThickness / 1.7,
            center.y - clipRadius,
            secondHandThickness / 1.7,
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
