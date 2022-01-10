ctx.drawCircle = function (x, y, radius) {
	ctx.moveTo(x, y);
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.closePath();
};
