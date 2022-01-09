// Colors
const background = "#21082c";
const foreground = "#f2dbf0";

// Getting HTML Elements
const canvas = document.getElementById("harvey-canvas");
const timeHTML = document.getElementById("current-time");
const harveyImage = new Image(canvas.width, canvas.height);
const mirrorImage = new Image(canvas.width, canvas.height);
harveyImage.src = "../assets/harvey.png";
mirrorImage.src = "../assets/mirror.png";

// Setting up canvas properties
const proportion = 0.9; // This must remain consistent with CSS rules
const dimension =
	Math.min(575, window.innerHeight, window.innerWidth) * proportion;
canvas.width = `${dimension}`;
canvas.height = `${dimension}`;
const radius = dimension / 2.1;
const center = {
	x: canvas.width / 2,
	y: canvas.width / 2,
};

const ctx = canvas.getContext("2d");
ctx.strokeStyle = foreground;
ctx.fillStyle = foreground;
ctx.lineWidth = 2;
ctx.lineCap = "round";

// angle = 1.5 * Math.PI,
// increment = Math.PI / 30,
// Setting up clock properties
const secondHandLength = 0.8 * radius;

harveyImage.addEventListener("load", () => {
	// ctx.beginPath();
	// ctx.moveTo(center.x, center.y);
	// ctx.lineTo(dimension, radius);
	// ctx.arc(center.x, center.y, radius, Math.PI / 2, 0);
	// ctx.lineTo(center.x, center.y);
	// ctx.fill();
	// ctx.clip();
	ctx.drawImage(harveyImage, 0, 0, canvas.width, canvas.height);
	// Draw Clock
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(center.x, center.y, radius * 0.05, 0, 2 * Math.PI);
	ctx.fill();
	ctx.moveTo(center.x, center.y);
});

const animationCallback = function () {};
