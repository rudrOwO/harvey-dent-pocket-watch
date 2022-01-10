// Adding utility properties to canvas drawing context
ctx.drawCircle = function (radius) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
};

// uses length and angle - which were determined previously
ctx.drawHand = function (angle, length) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, length, angle, angle);
    ctx.lineTo(center.x, center.y);
    ctx.stroke();
};
