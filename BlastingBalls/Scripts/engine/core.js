$(function() {
    function Application() {
        this.canvas = null;
        this.context = null;

        var frame = new Frame();
        var physics = new Physics();

        var mousePos = [];
        var mouseDown = false;

        this.run = function() {
            init();

            setInterval(function() {
                clearDisplay();

                if(mouseDown) {
                    arrow(mousePos['downX'], mousePos['downY'], mousePos['currentX'], mousePos['currentY']);
                }

                frame.update(this.canvas, this.context);
                frame.draw(this.context);

                physics.updateCross(frame.balls, frame.walls);
            }, 0.1);
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

                if(e.button == 0) {
                    frame.addBall(mousePos['downX'], mousePos['downY'], (e.pageX - mousePos['downX']), (e.pageY - mousePos['downY']), 30);
                }

                if(e.button == 2) {
                    frame.addWall(mousePos['downX'], mousePos['downY'], e.pageX, e.pageY);
                }
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

        document.addEventListener("contextmenu", function(event){
            event.preventDefault();
        });
    }

    function Frame() {
        this.balls = [];
        this.walls = [];

        this.update = function(canvas, context) {
            for (var i = 0; i < this.balls.length; i++) {
                this.balls[i].update(canvas, context);
            }
        };

        this.draw = function(context) {
            for (var i = 0; i < this.balls.length; i++) {
                this.balls[i].draw(context);
            }

            for (var j = 0; j < this.walls.length; j++) {
                this.walls[j].draw(context);
            }
        };

        this.addBall = function(positionX, positionY, velosityX, velosityY, radius) {
            if (this.balls == null) this.balls = [];
            this.balls.push(new Ball(positionX, positionY, velosityX, velosityY, radius));
        };

        this.addWall = function(positionX1, positionY1, positionX2, positionY2) {
            if (this.walls == null) this.walls = [];
            this.walls.push(new Wall(positionX1, positionY1, positionX2, positionY2));
        };
    }

    function Ball(positionX, positionY, velosityX, velosityY, radius) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.velosityX = velosityX;
        this.velosityY = velosityY;
        this.radius = radius;

        this.update = function(canvas, context) {
            this.positionX += this.velosityX * 0.01;
            this.positionY += this.velosityY * 0.01;

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

    function Wall(positionX1, positionY1, positionX2, positionY2) {
        this.positionX1 = positionX1;
        this.positionY1 = positionY1;
        this.positionX2 = positionX2;
        this.positionY2 = positionY2;

        this.draw = function(context) {
            context.beginPath();
            context.moveTo(this.positionX1, this.positionY1);
            context.lineTo(this.positionX2, this.positionY2);
            context.lineWidth = 2;
            context.strokeStyle = "#000";
            context.stroke();
        }
    }

    function Physics() {
        this.updateCross = function (balls, walls) {
            for (var i = 0; i < balls.length; i++) {
                for (var j = i + 1; j < balls.length; j++) {
                    collisionBalls(balls[i], balls[j]);
                }
            }

            for (var i = 0; i < walls.length; i++) {
                for (var j = 0; j < balls.length; j++) {
                    if (collisionBallsAndWalls(walls[i].positionX1, walls[i].positionY1, walls[i].positionX2, walls[i].positionY2,
                        balls[j].positionX, balls[j].positionY, balls[j].radius)) {
                        RectCircleColliding(balls[j], walls[i]);
                    }
                }
            }
        }

        var collisionBalls = function (ball1, ball2){
            var dX = ball1.positionX - ball2.positionX;
            var dY = ball1.positionY - ball2.positionY;

            var disnance = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
            if (disnance <= (ball1.radius + ball2.radius)){
                if (disnance < (ball1.radius + ball2.radius)){
                    if (ball1.positionX < ball2.positionX){
                        ball1.positionX--;
                        ball2.positionX++;
                    }
                    else if (ball1.positionX > ball2.positionX){
                        ball1.positionX++;
                        ball2.positionX--;
                    }
                }

                if (disnance < (ball1.radius + ball2.radius)){
                    if (ball1.positionY < ball2.positionY){
                        ball1.positionY--;
                        ball2.positionY++;
                    }
                    else if ( ball1.positionY > ball2.positionY){
                        ball1.positionY++;
                        ball2.positionY--;
                    }
                }

                var objVx = ball1.velosityX;
                var objVy = ball1.velosityY;

                ball1.velosityX = ball2.velosityX;
                ball2.velosityX = objVx;

                ball1.velosityY = ball2.velosityY;
                ball2.velosityY = objVy;
            }
        }

        var collisionBallsAndWalls = function (positionX1, positionY1, positionX2, positionY2, positionCircleX, positionCircleY, radiusCircle) {
            positionX1 -= positionCircleX;
            positionY1 -= positionCircleY;
            positionX2 -= positionCircleX;
            positionY2 -= positionCircleY;

            var dx = positionX2 - positionX1;
            var dy = positionY2 - positionY1;

            var a = dx*dx + dy*dy;
            var b = 2*(positionX1*dx + positionY1*dy);
            var c = positionX1 * positionX1 + positionY1 * positionY1 - radiusCircle * radiusCircle;

            if (-b < 0)
                return (c < 0);

            if (-b < (2*a))
                return ((4*a*c - b*b) < 0);

            return (a+b+c < 0);
        }

        function RectCircleColliding(ball, wall) {
            var A = Math.sqrt(Math.pow(ball.positionX - wall.positionX1, 2) + Math.pow(ball.positionY - wall.positionY1, 2));
            var B = Math.sqrt(Math.pow(ball.positionX - wall.positionX2, 2) + Math.pow(ball.positionY - wall.positionY2, 2));

            var C1 = Math.pow(A, 2) - Math.pow(ball.radius, 2);
            var C2 = Math.pow(B, 2) - Math.pow(ball.radius, 2);

            var alpha = Math.cos(C1 / A);
            var beta = Math.cos(C2 / B);

            A = Math.sqrt(Math.pow(ball.positionX + 3 - wall.positionX1, 2) + Math.pow(ball.positionY + 3 - wall.positionY1, 2));
            B = Math.sqrt(Math.pow(ball.positionX + 3 - wall.positionX2, 2) + Math.pow(ball.positionY + 3 - wall.positionY2, 2));

            C1 = Math.pow(A, 2) - Math.pow(ball.radius, 2);
            C2 = Math.pow(B, 2) - Math.pow(ball.radius, 2);

            var alphaNext = Math.cos(C1 / A);
            var betaNext = Math.cos(C2 / B);

            if(alpha > alphaNext && beta > betaNext) {
                ball.velosityX *= -1;
                ball.velosityY *= -1;
                return;
            }

            if(alpha > alphaNext) {
                ball.velosityX *= -1;
                return;
            }

            if(beta > betaNext) {
                ball.velosityY *= -1;
                return;
            }
        }
    }

    var application = new Application();
    application.run();
});