$(function() {
    function Application() {
        this.canvas = null;
        this.context = null;

        var frame = new Frame();
        var physics = new Physics();

        var mousePos = [];
        var isGame = true;
        var isAddElement = false;
        var isMouseDown = false;

        var play;
        var pause;
        var stop;

        this.run = function() {
            init();

            setInterval(function() {

                if (isGame) {
                    clearDisplay();

                    if(isMouseDown && isAddElement) {
                        arrow(mousePos['downX'], mousePos['downY'], mousePos['currentX'], mousePos['currentY']);
                    }

                    frame.update(this.canvas, this.context);
                    frame.draw(this.context);

                    physics.updateCross(frame.balls, frame.walls);
                }

            }, 0.001);
        };

        var init = function() {
            this.canvas = document.getElementById("display");
            this.context = this.canvas.getContext("2d");

            this.canvas.onmousedown = function(e) {
                if (isGame) {
                    mousePos = [];
                    isMouseDown = true;
                    isAddElement = true;
                    mousePos['downX'] = e.offsetX;
                    mousePos['downY'] = e.offsetY;
                }

                e.preventDefault();
            };

            this.canvas.onmousemove = function(e) {
                if (isGame && isAddElement) {
                    mousePos['currentX'] = e.offsetX;
                    mousePos['currentY'] = e.offsetY;
                }

                e.preventDefault();
            };

            this.canvas.onmouseout = function(e) {
                if (isGame && isAddElement) {
                    isMouseDown = false;
                    isAddElement = false;
                    if (frame == null) frame = new Frame();

                    if(e.button == 0) {
                        frame.addBall(mousePos['downX'], mousePos['downY'], (e.offsetX - mousePos['downX']), (e.offsetY - mousePos['downY']), 30);
                    }

                    if(e.button == 2) {
                        frame.addWall(mousePos['downX'], mousePos['downY'], e.offsetX, e.offsetY);
                    }
                }

                e.preventDefault();
            }

            this.canvas.onmouseup = function(e) {
                if (isGame && isAddElement) {
                    isMouseDown = false;
                    isAddElement = false;
                    if (frame == null) frame = new Frame();

                    if(e.button == 0) {
                        frame.addBall(mousePos['downX'], mousePos['downY'], (e.offsetX - mousePos['downX']), (e.offsetY - mousePos['downY']), 30);
                    }

                    if(e.button == 2) {
                        frame.addWall(mousePos['downX'], mousePos['downY'], e.offsetX, e.offsetY);
                    }
                }

                e.preventDefault();
            };

            mousePos = [];
            isMouseDown = false;
            isAddElement = false;

            play = $('#play');
            pause = $('#pause');
            stop = $('#stop');

            play.click(function() {
                isGame = true;
            });

            pause.click(function() {
                isGame = false;
            });

            stop.click(function() {
                clearDisplay();
                frame = new Frame();
                isGame = true;
            });
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

                        var tempSpeed = GetNewVector1(balls[j].positionX, balls[j].positionY, balls[j].velosityX, balls[j].velosityY, walls[i].positionX1, walls[i].positionY1, walls[i].positionX2, walls[i].positionY2);
                        balls[j].velosityX = tempSpeed.x;
                        balls[j].velosityY = tempSpeed.y;

//                        balls[j].velosityX *= -1;
//                        balls[j].velosityY *= -1;
                    }
                }
            }
        }

        var GetNewVector = function (Vx, Vy, Vx2, Vy2) {
            var ln, nn, r, rez, rez2;
            ln = Vx * Vx2+Vy * Vy2;
            nn = Vx2 * Vx2 + Vy2 * Vy2;
            nn = nn == 0 ? 1 : nn;
            rez = ln / nn;
            rez2 = {
                x: 2 * Vx2 * rez,
                y: 2 * Vy2 * rez
            };
            r = {
                x: Vx - rez2.x,
                y: Vy - rez2.y
            };
            return r;
        };

        var GetNewVector1 = function (x, y, Mx, My, x1, y1, x2, y2) {
            var r;
            if (Math.abs(x - x1) < 10 && Math.abs(y - y1) < 10 || Math.abs(x - x2) < 10 && Math.abs(y - y2) < 10) {
                r = {
                    x: -Mx,
                    y: -My
                };
                return r;
            }
            r = GetNewVector(Mx, My, y1 - y2, x2 - x1);
            return r;
        };

        var collisionBalls = function (ball1, ball2){
            var dX = ball1.positionX - ball2.positionX;
            var dY = ball1.positionY - ball2.positionY;

            var distance = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
            if (distance+1 < (ball1.radius + ball2.radius)){
                if (distance+1 < (ball1.radius + ball2.radius)){
                    if (ball1.positionX < ball2.positionX){

                        if(ball1.velosityX>0 & ball2.velosityX>=0){
                            ball1.velosityX *=-1;
                        } else
                        if (ball1.velosityX<=0 & ball2.velosityX<0){
                            ball2.velosityX *=-1;
                        } else
                        if(ball1.velosityX>0 & ball2.velosityX<0){
                            ball1.velosityX *=-1;
                            ball2.velosityX *=-1;
                        }


                    }
                    else if (ball1.positionX > ball2.positionX){

                        if(ball1.velosityX>=0 & ball2.velosityX>0){
                            ball2.velosityX *=-1;
                        } else
                        if (ball2.velosityX<=0 & ball1.velosityX<0){
                            ball1.velosityX *=-1;
                        } else
                        if(ball2.velosityX>0 & ball1.velosityX<0){
                            ball1.velosityX *=-1;
                            ball2.velosityX *=-1;
                        }
                    }
                }

                if (distance+1 < (ball1.radius + ball2.radius)){
                    if (ball1.positionY < ball2.positionY){

                        if(ball1.velosityY>0 & ball2.velosityY>=0){
                            ball1.velosityY *=-1;
                        } else
                        if (ball1.velosityY<=0 & ball2.velosityY<0){
                            ball2.velosityY *=-1;
                        } else
                        if(ball1.velosityY>0 & ball2.velosityY<0){
                            ball1.velosityY *=-1;
                            ball2.velosityY *=-1;
                        }

                    }
                    else if ( ball1.positionY > ball2.positionY){

                        if(ball1.velosityY>=0 & ball2.velosityY>0){
                            ball2.velosityY *=-1;
                        } else
                        if (ball2.velosityY<=0 & ball1.velosityY<0){
                            ball1.velosityY *=-1;
                        } else
                        if(ball2.velosityY>0 & ball1.velosityY<0){
                            ball1.velosityY *=-1;
                            ball2.velosityY *=-1;
                        }

                    }
                }
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
    }

    var application = new Application();
    application.run();
});