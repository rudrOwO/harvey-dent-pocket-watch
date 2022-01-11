// Adding utility properties to canvas drawing context
ctx.drawCircle = function (radius, thickness) {
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
};

// uses length and angle - which were determined previously
ctx.drawHand = function (angle, length, thickness) {
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.arc(center.x, center.y, length, angle, angle);
    ctx.lineTo(center.x, center.y);
    ctx.stroke();
};

const zero = (value) => (value < 10 ? `0${value}` : value);

// update HTML element for displaying time digitally
function updateTimeHTML(hoursElapsed, minutesElapsed, secondsElapsed) {
    timeHTML.innerText = `${zero(hoursElapsed)}:${zero(minutesElapsed)}:${zero(
        secondsElapsed
    )}`;
}
