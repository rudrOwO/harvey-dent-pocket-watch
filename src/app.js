// Background #21082c
// Clock Foreground #f2dbf0

const proportion = 0.9;
const dimension = Math.min(575, window.innerHeight, window.innerWidth);

const canvas = document.getElementById("harvey-canvas");
canvas.width = `${dimension * proportion}`;
canvas.height = `${dimension * proportion}`;

const ctx = canvas.getContext("2d");
const harveyImage = new Image(canvas.width, canvas.height);
harveyImage.src = "../assets/harvey.png";

harveyImage.addEventListener("load", () => {
	ctx.drawImage(harveyImage, 0, 0);
});

console.log(dimension * proportion);
