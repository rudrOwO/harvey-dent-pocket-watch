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
const boopLength = radius / 45;

// Inialization callback to be run once all images have finished loading
Promise.all(imagesLoaded).then(() => {
    ctx.drawImage(harveyImage, 0, 0, dimension, dimension);
    ctx.lineWidth = 2;
    // Caveat : These two lines work only because they are executed asynchronously
    ctx.drawCircle(radius);
    ctx.drawCircle(boopLength);
    ctx.fill();
    ctx.drawHand(1.6 * Math.PI, secondHandLength);
    ctx.lineWidth = 3;
    ctx.drawHand(0, minuteHandLength);
    ctx.lineWidth = 4;
    ctx.drawHand(0.5 * Math.PI, hourHandLength);
    ctx.drawHand(Math.PI, hourHandLength);
});

function renderClockTick() {}
