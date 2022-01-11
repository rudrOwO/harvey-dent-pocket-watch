// Colors
const background = "#21082c";
const foreground = "#f2dbf0";

// Getting HTML Elements
const canvas = document.getElementById("harvey-canvas");
const timeHTML = document.getElementById("current-time");
let harveyImage = new Image(canvas.width, canvas.height);
let mirrorImage = new Image(canvas.width, canvas.height);
harveyImage.src = "../assets/harvey.png";
mirrorImage.src = "../assets/mirror.png";

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
const minuteHandLength = secondHandLength / 1.618;
const hourHandLength = minuteHandLength / 1.618;
const boopLength = radius / 30;
const initAngle = 1.5 * Math.PI; // 12 AM
const secondTickDistance = Math.PI / 30;
const minuteTickDistance = Math.PI / 30;
const hourTickDistance = Math.PI / 6;
let imgSemaphore = true;
let lastRenderedSecond;

// Initiate clock ticks once all images have finished loading
Promise.all(imagesLoaded).then(() => {
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
    if (secondsElapsed === lastRenderedSecond) {
        return;
    } else {
        lastRenderedSecond = secondsElapsed;
    }

    minutesElapsed %= 60;
    hoursElapsed %= 12; // 12 hour time format

    // Map current time to angles of clock hands
    const hourHandAngle = initAngle + hoursElapsed * hourTickDistance;
    const minuteHandAngle = initAngle + minutesElapsed * minuteTickDistance;
    const secondHandAngle = initAngle + secondsElapsed * secondTickDistance;

    // Conditional image switch
    if (secondsElapsed === 0)
        [harveyImage, mirrorImage] = [mirrorImage, harveyImage];

    // save, clip, restore cycle

    // (Re)Draw clock frame
    ctx.drawImage(harveyImage, 0, 0, dimension, dimension);
    ctx.drawHand(secondHandAngle, secondHandLength, 3);

    ctx.drawCircle(radius, 3);
    ctx.drawHand(minuteHandAngle, minuteHandLength, 4);
    ctx.drawHand(hourHandAngle, hourHandLength, 4);
    ctx.drawCircle(boopLength, 3); // Boop
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.strokeStyle = foreground;

    // update HTML element for displaying time digitally
}
