$(function() {
    function Application() {
        this.canvas = null;
        this.context = null;
        var frame = new Frame();

        var mousePos = [];
        var mouseDown = false;

        this.run = function() {
            init();

            setInterval(function() {
                clearDisplay();

                if(mouseDown) {
                    arrow(mousePos['downX'], mousePos['downY'], mousePos['currentX'], mousePos['currentY']);
                }

                var ph = new Physics();
                ph.updateCross(frame.balls);

                frame.update(this.canvas, this.context);
                frame.draw(this.context);

            }, 12);
        };

        var init = function() {
            this.canvas = document.getElementById("display");
            this.context = this.canvas.getContext("2d");

            this.canvas.onmousedown = function(e) {
                mouseDown = true;
                mousePos['downX'] = e.pageX;
                mousePos['downY'] = e.pageY;
            };

            this.canvas.onmousemove = function(e) {
                mousePos['currentX'] = e.pageX;
                mousePos['currentY'] = e.pageY;
            };

            this.canvas.onmouseup = function(e) {
                mouseDown = false;
                if (frame == null) frame = new Frame();

                frame.addBall(mousePos['downX'], mousePos['downY'], (e.pageX - mousePos['downX']), (e.pageY - mousePos['downY']), 30);
            };

            mousePos = [];
            mouseDown = false;
        };

        var clearDisplay = function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        };

        var arrow = function(fromX, fromY, toX, toY) {
            var headlen = 10;
            var angle = Math.atan2(toY - fromY, toX - fromX);

            this.context.beginPath();
            this.context.moveTo(fromX, fromY);
            this.context.lineTo(toX, toY);
            this.context.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
            this.context.moveTo(toX, toY);
            this.context.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));

            this.context.lineWidth = 3;
            this.context.strokeStyle = "red";
            this.context.lineCap = "round";
            this.context.stroke();
        }
    }

    function Frame() {
        this.balls = [];

        this.update = function(canvas, context) {
            for (var i = 0; i < this.balls.length; i++) {
                this.balls[i].update(canvas, context);
            }
        };

        this.draw = function(context) {
            for (var i = 0; i < this.balls.length; i++) {
                this.balls[i].draw(context);
            }
        };

        this.addBall = function(positionX, positionY, velosityX, velosityY, radius) {
            if (this.balls == null) this.balls = [];
            this.balls.push(new Ball(positionX, positionY, velosityX, velosityY, radius));
        };
    }

    function Ball(positionX, positionY, velosityX, velosityY, radius) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.velosityX = velosityX;
        this.velosityY = velosityY;
        this.radius = radius;

        this.update = function(canvas, context) {
            this.positionX += this.velosityX * 0.05;
            this.positionY += this.velosityY * 0.05;

            if (this.positionX + this.radius > canvas.width) {
                this.positionX = canvas.width - this.radius;
                this.velosityX *= -1;
            }

            if (this.positionX - this.radius < 0) {
                this.positionX = this.radius;
                this.velosityX *= -1;
            }

            if (this.positionY + this.radius > canvas.height) {
                this.positionY = canvas.height - this.radius;
                this.velosityY *= -1;
            }

            if (this.positionY - this.radius < 0) {
                this.positionY = this.radius;
                this.velosityY *= -1;
            }
        };

        this.draw = function(context) {
            context.beginPath();
            context.arc(this.positionX, this.positionY, this.radius, 0, 2 * Math.PI);
            context.fillStyle = "red";
            context.fill();
            context.lineWidth = this.radius * 0.1;
            context.strokeStyle = "#000";
            context.stroke();
        };
    }

    function Physics() {
        this.updateCross = function (balls) {
            for (var i = 0; i < balls.length; i++) {
                for (var j = i; j < balls.length; j++) {

                }
            }
        }
    }

    var application = new Application();
    application.run();
});