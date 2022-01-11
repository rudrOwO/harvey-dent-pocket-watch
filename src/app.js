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
let imgSemaphore = true;

// Initiate clock ticks once all images have finished loading
Promise.all(imagesLoaded).then(() => {
    requestAnimationFrame(renderClockTick);
});

function renderClockTick() {
    // Map current time to angles of clock hands

    // Conditional image switch

    // save, clip, restore cycle

    // Draw clock frame
    ctx.drawImage(harveyImage, 0, 0, dimension, dimension);
    ctx.drawCircle(radius, 2);
    ctx.drawHand(1.6 * Math.PI, secondHandLength, 2);
    ctx.drawHand(0, minuteHandLength, 3);
    ctx.drawHand(0.5 * Math.PI, hourHandLength, 4);

    // Boop
    ctx.drawCircle(boopLength, 3);
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.strokeStyle = foreground;

    // Recursive callback
    // requestAnimationFrame(renderClockTick);
}
