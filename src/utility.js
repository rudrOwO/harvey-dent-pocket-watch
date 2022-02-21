// Utility function for rendering clock hand
clockHand.prototype.draw = function () {
    ctx.lineWidth = this.thickness;
    ctx.beginPath();
    ctx.arc(center.x, center.y, this.length, this.angle, this.angle);
    ctx.lineTo(center.x, center.y);
    ctx.stroke();
};

// Adding utility properties to canvas drawing context
ctx.drawCircle = function (radius, thickness) {
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
};

// This method always maintains an initial context of the clip
ctx.clearClip = function () {
    ctx.restore();
    ctx.save();
    ctx.beginPath();
};

// 0 padding for clock display
const zero = value => (value < 10 ? `0${value}` : value);

// update HTML element for displaying time digitally
function updateTimeHTML(hoursElapsed, minutesElapsed, secondsElapsed) {
    timeHTML.innerText = `${zero(hoursElapsed)}:${zero(minutesElapsed)}:${zero(
        secondsElapsed
    )}`;
}
