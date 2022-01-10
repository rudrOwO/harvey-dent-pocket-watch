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

// Setting up canvas properties
const proportion = 0.9; // This must remain consistent with CSS rules
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
ctx.lineWidth = 2;
ctx.lineCap = "round";

// Setting up clock properties
const secondHandLength = 0.85 * radius;
const minuteHandLength = secondHandLength / 1.618;
const hourHandLength = minuteHandLength / 1.618;
const boopLength = radius / 50;

harveyImage.addEventListener("load", () => {
	// Inialization code to be run on image load
	ctx.drawImage(harveyImage, 0, 0, dimension, dimension);
	ctx.drawCircle(center.x, center.y, radius);
	ctx.drawCircle(center.x, center.y, boopLength);
	ctx.fill();
});

const renderClockTick = function () {};
