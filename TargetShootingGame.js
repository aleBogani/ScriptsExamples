//----------------------- SETUP ------------------------//

const ctx = document.getElementById('ctx');
const context = ctx.getContext('2d');
const rect = ctx.getBoundingClientRect();


//--------------- Setup variables ------------------// 


var extendedHEIGHT = 400;
var WIDTH = 500;
var HEIGHT = 300;

mouseX = null;
mouseY = null;

var paused = false;
mouseOut = false; //needed to fix issues when cursor is out of boundaries

endGame = false;
startGame = true;

var score = 0;
scoreInThisShot = 0;
scoreInThisShotRepository = 0;

shotNumber = 1;

countDownTimer = 30040; //30040ms and not 30040ms because when the game is launched it already subtracts 40ms

enterIsPressed = 0;

//Wind values shot 1 (set wind direction as randomly blowing to the left or the right)
if (Math.random() < 0.5) {
    windDirection = -1;
} else {
    windDirection = +1;
}
sortedWindSpeed = 2
windSpeed = windDirection * sortedWindSpeed;


// Variable levels

windSpeed1 = 2;
windSpeed2 = 3;
windSpeed3 = 4;

targetWidth1 = 177;
targetWidth2 = 143;
targetWidth3 = 109;

targetSpeed1 = 3.5;
targetSpeed2 = 5;
targetSpeed3 = 6.5;

obstacleWidth1 = 70;
obstacleWidth2 = 85;
obstacleWidth3 = 100;


//------------------- Bullet variables ---------------------//

bulletHeight = 7;
bulletWidth = 7;
bulletSpeed = 10;
bulletX = WIDTH / 2 - bulletWidth / 2;
bulletY = HEIGHT - bulletHeight / 2;

var aimAngle;
var spdX;
var spdY;

var bullet = {
    x: bulletX,
    y: bulletY,
    width: bulletWidth,
    height: bulletHeight,
    color: 'black',
    aimAngle: aimAngle,
    spdX: spdX,
    spdY: spdY,
}

//------------------- Target variables ---------------------//

//Target width shot 1
centralTargetWidth = 109
targetSpeed = 5

centralTargetHeight = 10;
centralTargetX = Math.random() * 200;      // Randomly determine target starting position

if (Math.random() < 0.5) {         // Randomly determine if target moves to the right or to the left
    var targetDirection = -1;
} else {
    var targetDirection = +1;
}

//----------------- Obstacle variables ---------------------//

//Obstacle width shot 1
obstacleWidth = 100;
farLeftObstacleX = 0;
farCentralObstacleX = WIDTH / 2 - obstacleWidth / 2;
farRightObstacleX = WIDTH - obstacleWidth;

obstacleHeight = 15;

farLeftObstacleY = HEIGHT / 4;
farCentralObstacleY = HEIGHT / 4;
farRightObstacleY = HEIGHT / 4;

obstacleType = ['farLeft', 'farCentral', 'farRight']

obstacleList = {};




//----------------------- FUNCTIONS ------------------------//

//------------------- Draw text --------------------//

drawText = function (text, centerX, centerY, fontsize, fontface) {
    context.save();
    context.font = fontsize + 'px ' + fontface;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, centerX, centerY);
    context.restore();
}

drawTextInfo = function (text, centerX, centerY, fontsize, fontface) {
    context.save();
    context.font = fontsize + 'px ' + fontface;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(text, centerX, centerY);
    context.restore();
}

drawSelectedValue = function (text, centerX, centerY, fontsize, fontface) {
    context.save();
    context.font = 'bold ' + fontsize + 'px ' + fontface;
    context.fillStyle = 'red';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, centerX, centerY);
    context.restore();
}
drawDiscardedValue = function (text, centerX, centerY, fontsize, fontface) {
    context.save();
    context.font = fontsize + 'px ' + fontface;
    context.globalAlpha = 0.5;
    context.fillStyle = 'grey';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, centerX, centerY);
    context.restore();
}


//---------------------- Draw button -----------------------//

var button = {
    x: WIDTH / 2 - 40,
    y: HEIGHT / 2 + 10,
    width: 80,
    height: 50,
    color: 'red',
}

drawButton = function (entity) {
    context.save();
    context.fillStyle = entity.color;
    context.fillRect(entity.x, entity.y, entity.width, entity.height);
    context.restore();
}

function drawBorder(thickness = 2) {
    context.fillRect(button.x - (thickness), button.y - (thickness), button.width + (thickness * 2), button.height + (thickness * 2));
}


//---------------------- Draw wind arrow -----------------------// 

canvasArrow = function (fromx, fromy, tox, toy) {
    //variables to be used when creating the arrow
    var headlen = 10;

    var angle = Math.atan2(toy - fromy, tox - fromx);

    //starting path of the arrow from the start square to the end square and drawing the stroke
    context.save();
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.strokeStyle = "red";
    context.lineWidth = 1;
    context.stroke();

    //starting a new path from the head of the arrow to one of the sides of the point
    context.beginPath();
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));

    //path from the side point of the arrow, to the other side point
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 7), toy - headlen * Math.sin(angle + Math.PI / 7));

    //path from the side point back to the tip of the arrow, and then again to the opposite side point
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));

    //draws the paths created above
    context.strokeStyle = "red";
    context.lineWidth = 1;
    context.stroke();
    context.fillStyle = "red";
    context.fill();
    context.restore();
}


//------------------- Generate objects --------------------//

Target = function (x, y, width, height, spdX, distancefromTargetEndDx, distanceFromTargetEndSx) {
    window.target = {
        x: x,
        y: y,
        width: width,
        height: height,
        spdX: spdX,
        distanceFromTargetEndDx: distancefromTargetEndDx,
        distanceFromTargetEndSx: distanceFromTargetEndSx,
    };
}

generateTarget = function () {
    var y = centralTargetHeight / 2;
    height = centralTargetHeight;
    spdX = targetDirection * targetSpeed;

    width = centralTargetWidth;
    var x = centralTargetX;

    distanceFromTargetEndDx = x + width;

    distanceFromTargetEndSx = x;


    Target(x, y, width, height, spdX, distanceFromTargetEndDx, distanceFromTargetEndSx)
}


Obstacle = function (obstacleID, x, y, width, height, type) {
    var obstacle = {
        obstacleID: obstacleID,
        x: x,
        y: y,
        width: width,
        height: height,
        color: 'grey',
        type: type,
    };
    obstacleList[obstacleID] = obstacle;
}

generateObstacle = function () {
    obstacleID = Math.random();
    var width = obstacleWidth;
    height = obstacleHeight;
    type = 'farLeft';

    if (type === 'farLeft') {
        x = farLeftObstacleX;
        y = farLeftObstacleY;
        type = obstacleType[key];
    };

    if (type === 'farCentral') {
        x = farCentralObstacleX;
        y = farCentralObstacleY;
        type = obstacleType[key];
    }

    if (type === 'farRight') {
        x = farRightObstacleX;
        y = farRightObstacleY;
        type = obstacleType[key];
    }

    Obstacle(obstacleID, x, y, width, height, type)
};


//---------------- Draw and move entities -----------------//

drawBullet = function (entity) {
    context.save();
    context.fillStyle = entity.color;
    context.fillRect(entity.x, entity.y - entity.height / 2, entity.width, entity.height);
    context.restore();
}

updateBulletPosition = function (entity) {
    entity.x += entity.spdX + windSpeed;
    entity.y -= entity.spdY;
}

drawTarget = function (entity) {
    grdTarget = context.createLinearGradient(entity.x, entity.y - entity.height / 2, entity.x + entity.width, entity.height);
    context.save();
    grdTarget.addColorStop(0, "greenyellow");
    grdTarget.addColorStop(0.5, "darkgreen");
    grdTarget.addColorStop(1, "greenyellow");
    context.fillStyle = grdTarget;
    context.fillRect(entity.x, entity.y - entity.height / 2, entity.width, entity.height);
    context.restore();
}

updateTargetPosition = function (entity) {
    entity.x += entity.spdX;
    entity.distanceFromTargetEndDx += entity.spdX;
    entity.distanceFromTargetEndSx += entity.spdX;
    centralTargetX = entity.x

    if (entity.distanceFromTargetEndSx <= 0 || entity.distanceFromTargetEndDx >= WIDTH) {
        entity.spdX = -entity.spdX;
    }
}

drawObstacle = function (entity) {
    context.save();
    context.fillStyle = entity.color;
    context.fillRect(entity.x, entity.y - entity.height / 2, entity.width, entity.height);
    context.restore();
}


//----------------- Aim and shoot bullet ------------------//

//Aim
ctx.onmousemove = function (mouse) {

    if (bullet.y > HEIGHT - bulletHeight) {
        mouseX = mouse.clientX - document.getElementById('ctx').getBoundingClientRect().left;
        mouseY = mouse.clientY - document.getElementById('ctx').getBoundingClientRect().top;

        mouseX -= bullet.x;
        mouseY -= bullet.y;

        window.aimAngle = Math.atan2(mouseY, mouseX) / Math.PI * 180;

        bullet.spdX = Math.cos((aimAngle / 180) * Math.PI) * bulletSpeed;
        bullet.spdY = -(Math.sin((aimAngle / 180) * Math.PI) * bulletSpeed);
    }
}

//Shoot
document.addEventListener("keydown", keyShiftDown, false);
function keyShiftDown(e) {
    var keyCode = e.keyCode;
    if (keyCode == 16) {
        updateBulletPosition(bullet)
        shotDuration = Date.now() - timeWhenShotStarted;
    }
}

//------------------- Collision logic --------------------//

bulletCrashWithObstacle = function (entity) {
    var bulletLeft = bullet.x;
    var bulletRight = bullet.x + (bullet.width);
    var bulletTop = bullet.y;
    var bulletBottom = bullet.y + (bullet.height);
    var entityLeft = entity.x;
    var entityRight = entity.x + (entity.width);
    var entityTop = entity.y;
    var entityBottom = entity.y + (entity.height);
    var crash = true;
    if ((bulletBottom < entityTop) ||
        (bulletTop > entityBottom) ||
        (bulletRight < entityLeft) ||
        (bulletLeft > entityRight)) {
        crash = false;
    }
    return crash;
}

bulletCrashWithTarget = function (entity) {
    bulletCenter = bullet.x + bulletWidth / 2;
    bulletTop = bullet.y;
    bulletBottom = bullet.y + (bullet.height);
    entityLeft = entity.x;
    entityRight = entity.x + (entity.width);
    entityTop = entity.y;
    entityBottom = entity.y + (entity.height);
    crash = true;
    if ((bulletBottom < entityTop) ||
        (bulletTop > entityBottom) ||
        (bulletCenter < entityLeft) ||
        (bulletCenter > entityRight)) {
        crash = false;
    }
    return crash;
}

//----------------------- Pause -------------------------//

document.addEventListener("keydown", keyEnterDown, false);
function keyEnterDown(e) {
    var keyCode = e.keyCode;
    if (keyCode == 13) {
        context.clearRect(0, 0, WIDTH, HEIGHT);
        if (enterIsPressed == 0) {
            interval2 = setInterval(timePasses, 40);
            timeWhenShotStarted = Date.now();
        }
        enterIsPressed += 1;
        paused = false;
    }
}


//----------------------- Draw information monitor -------------------------//    

drawInformationMonitor = function () {
    //DISPLAY VARIABILI
    context.fillRect(0, HEIGHT, WIDTH, 5)

    //WIND INFO
    drawTextInfo("Wind level:", 5, 320, 13, "Arial");

    if (sortedWindSpeed == windSpeed1) {
        drawSelectedValue("1", 100, 320, 13, "Arial")
        drawDiscardedValue("2", 118, 320, 13, "Arial")
        drawDiscardedValue("3", 136, 320, 13, "Arial")
    } else if (sortedWindSpeed == windSpeed2) {
        drawDiscardedValue("1", 100, 320, 13, "Arial")
        drawSelectedValue("2", 118, 320, 13, "Arial")
        drawDiscardedValue("3", 136, 320, 13, "Arial")
    } else if (sortedWindSpeed == windSpeed3) {
        drawDiscardedValue("1", 100, 320, 13, "Arial")
        drawDiscardedValue("2", 118, 320, 13, "Arial")
        drawSelectedValue("3", 136, 320, 13, "Arial")
    }

    if (windDirection === -1) {
        canvasArrow(224, 320, 164, 320)
    } else {
        canvasArrow(164, 320, 224, 320)
    };



    //TARGET WIDTH INFO 
    drawTextInfo("Target level:", 5, 364, 13, "Arial");

    if (centralTargetWidth == targetWidth1) {
        drawSelectedValue("1", 100, 364, 13, "Arial")
        drawDiscardedValue("2", 118, 364, 13, "Arial")
        drawDiscardedValue("3", 136, 364, 13, "Arial")
    } else if (centralTargetWidth == targetWidth2) {
        drawDiscardedValue("1", 100, 364, 13, "Arial")
        drawSelectedValue("2", 118, 364, 13, "Arial")
        drawDiscardedValue("3", 136, 364, 13, "Arial")
    } else if (centralTargetWidth == targetWidth3) {
        drawDiscardedValue("1", 100, 364, 13, "Arial")
        drawDiscardedValue("2", 118, 364, 13, "Arial")
        drawSelectedValue("3", 136, 364, 13, "Arial")
    }


    //TARGET SPEED INFO 
    drawTextInfo("Speed level:", 5, 342, 13, "Arial");

    if (targetSpeed == targetSpeed1) {
        drawSelectedValue("1", 100, 342, 13, "Arial")
        drawDiscardedValue("2", 118, 342, 13, "Arial")
        drawDiscardedValue("3", 136, 342, 13, "Arial")
    } else if (targetSpeed == targetSpeed2) {
        drawDiscardedValue("1", 100, 342, 13, "Arial")
        drawSelectedValue("2", 118, 342, 13, "Arial")
        drawDiscardedValue("3", 136, 342, 13, "Arial")
    } else if (targetSpeed == targetSpeed3) {
        drawDiscardedValue("1", 100, 342, 13, "Arial")
        drawDiscardedValue("2", 118, 342, 13, "Arial")
        drawSelectedValue("3", 136, 342, 13, "Arial")
    }


    //OBSTACLE WIDTH INFO 
    drawTextInfo("Obstacle level:", 5, 386, 13, "Arial");

    if (obstacleWidth == obstacleWidth1) {
        drawSelectedValue("1", 100, 386, 13, "Arial")
        drawDiscardedValue("2", 118, 386, 13, "Arial")
        drawDiscardedValue("3", 136, 386, 13, "Arial")
    } else if (obstacleWidth == obstacleWidth2) {
        drawDiscardedValue("1", 100, 386, 13, "Arial")
        drawSelectedValue("2", 118, 386, 13, "Arial")
        drawDiscardedValue("3", 136, 386, 13, "Arial")
    } else if (obstacleWidth == obstacleWidth3) {
        drawDiscardedValue("1", 100, 386, 13, "Arial")
        drawDiscardedValue("2", 118, 386, 13, "Arial")
        drawSelectedValue("3", 136, 386, 13, "Arial")
    }

    //GENERAL INFO 
    context.clearRect(WIDTH / 2, 315, WIDTH / 2, 40)
    drawText("Shot: " + shotNumber + "      Score: " + score, WIDTH / 2 + 125, 335, 20, "Arial")
    drawText("Time left:   " + (countDownTimer / 1000).toFixed(0) + " sec", WIDTH / 2 + 120, 375, 20, "Arial")
}


//----------------------- New shot -------------------------//

newShot = function () {

    //Set wind direction
    if (Math.random() < 0.5) {
        windDirection = -1;
    } else {
        windDirection = +1;
    }


    mouseX = null;
    mouseY = null;

    document.addEventListener("keydown", keyEnterDown);

    enterIsPressed = 0;
    countDownTimer = 30040;
    scoreInThisShot = 0;
    scoreInThisShotRepository = 0;
    shotNumber += 1;


    //Change difficulty of the shot

    if (shotNumber == 2) {
        //OBSTACLE WIDTH
        obstacleWidth = obstacleWidth3;
        //TARGET SPEED
        targetSpeed = targetSpeed1;
        //TARGET WIDTH
        centralTargetWidth = targetWidth1;
        //WIND
        sortedWindSpeed = windSpeed1;
    }
    if (shotNumber == 3) {
        //OBSTACLE WIDTH
        obstacleWidth = obstacleWidth2;
        //TARGET SPEED
        targetSpeed = targetSpeed2;
        //TARGET WIDTH
        centralTargetWidth = targetWidth2;
        //WIND
        sortedWindSpeed = windSpeed2;
    }
    if (shotNumber == 4) {
        //OBSTACLE WIDTH
        obstacleWidth = obstacleWidth1;
        //TARGET SPEED
        targetSpeed = targetSpeed1;
        //TARGET WIDTH
        centralTargetWidth = targetWidth3;
        //WIND
        sortedWindSpeed = windSpeed1;
    }
    if (shotNumber == 5) {
        //OBSTACLE WIDTH
        obstacleWidth = obstacleWidth2;
        //TARGET SPEED
        targetSpeed = targetSpeed3;
        //TARGET WIDTH
        centralTargetWidth = targetWidth1;
        //WIND
        sortedWindSpeed = windSpeed3;
    }
    if (shotNumber == 6) {
        //OBSTACLE WIDTH
        obstacleWidth = obstacleWidth2;
        //TARGET SPEED
        targetSpeed = targetSpeed2;
        //TARGET WIDTH
        centralTargetWidth = targetWidth2;
        //WIND
        sortedWindSpeed = windSpeed3;
    }
    if (shotNumber == 7) {
        //OBSTACLE WIDTH
        obstacleWidth = obstacleWidth1;
        //TARGET SPEED
        targetSpeed = targetSpeed3;
        //TARGET WIDTH
        centralTargetWidth = targetWidth1;
        //WIND
        sortedWindSpeed = windSpeed1;
    }
    if (shotNumber == 8) {
        //OBSTACLE WIDTH
        obstacleWidth = obstacleWidth2;
        //TARGET SPEED
        targetSpeed = targetSpeed2;
        //TARGET WIDTH
        centralTargetWidth = targetWidth3;
        //WIND
        sortedWindSpeed = windSpeed3;
    }
    if (shotNumber == 9) {
        //OBSTACLE WIDTH
        obstacleWidth = obstacleWidth1;
        //TARGET SPEED
        targetSpeed = targetSpeed3;
        //TARGET WIDTH
        centralTargetWidth = targetWidth2;
        //WIND
        sortedWindSpeed = windSpeed2;
    }
    if (shotNumber == 10) {
        //OBSTACLE WIDTH
        obstacleWidth = obstacleWidth3;
        //TARGET SPEED
        targetSpeed = targetSpeed3;
        //TARGET WIDTH
        centralTargetWidth = targetWidth2;
        //WIND
        sortedWindSpeed = windSpeed2;
    }
    if (shotNumber == 11) {
        //OBSTACLE WIDTH
        obstacleWidth = obstacleWidth1;
        //TARGET SPEED
        targetSpeed = targetSpeed1;
        //TARGET WIDTH
        centralTargetWidth = targetWidth1;
        //WIND
        sortedWindSpeed = windSpeed3;
    }
    if (shotNumber == 12) {
        //OBSTACLE WIDTH
        obstacleWidth = obstacleWidth3;
        //TARGET SPEED
        targetSpeed = targetSpeed1;
        //TARGET WIDTH
        centralTargetWidth = targetWidth3;
        //WIND
        sortedWindSpeed = windSpeed2;
    }
    if (shotNumber == 13) {
        context.clearRect(0, 0, WIDTH, extendedHEIGHT);
        drawText('The End', WIDTH / 2, HEIGHT / 2 - 50, 30, "Arial");
        drawText('Overall score: ' + score + " points", WIDTH / 2, HEIGHT / 2, 30, "Arial");
        document.body.style.cursor = "auto";
        endGame = true;
        context.clearRect(WIDTH / 2, 315, WIDTH / 2, 40)
        return
    }

    //Set windSpeed
    windSpeed = windDirection * sortedWindSpeed;
    //Set onset position of the other obstacles
    farLeftObstacleX = 0;
    farCentralObstacleX = WIDTH / 2 - obstacleWidth / 2;
    farRightObstacleX = WIDTH - obstacleWidth;


    context.clearRect(0, 0, WIDTH, extendedHEIGHT);

    ctx.onmouseout = null


    //Bogus button (to avoid that people shoot by staying in the exact same position with the mouse) + changing round screen
    drawText('To shoot place the pointer on', WIDTH / 2, HEIGHT / 2 - 40, 20, "Arial");
    drawText('the red button and press Enter', WIDTH / 2, HEIGHT / 2 - 10, 20, "Arial")
    var button = {
        x: WIDTH / 2 - 40,
        y: HEIGHT / 2 + 30,
        width: 80,
        height: 50,
        color: 'red',
    }
    context.fillRect(WIDTH / 2 - 40 - (2), HEIGHT / 2 + 30 - (2), 80 + (2 * 2), 50 + (2 * 2))
    drawButton(button);


    //Update bullet
    bullet.x = WIDTH / 2 - bulletWidth / 2;
    bullet.y = HEIGHT - bulletHeight / 2;

    //Update target
    delete centralTargetX;
    centralTargetX = Math.random() * 200;
    delete targetDirection;
    if (Math.random() < 0.5) {
        var targetDirection = -1;
    } else {
        var targetDirection = +1;
    }
    generateTarget = function () {
        var y = centralTargetHeight / 2;
        height = centralTargetHeight;
        spdX = targetDirection * targetSpeed;

        width = centralTargetWidth;
        var x = centralTargetX;

        distanceFromTargetEndDx = x + width;

        distanceFromTargetEndSx = x;


        Target(x, y, width, height, spdX, distanceFromTargetEndDx, distanceFromTargetEndSx)
    }

    generateTarget()



    //Update obstacles
    obstacleList = {};

    generateObstacle = function () {
        obstacleID = Math.random();
        var width = obstacleWidth;
        height = obstacleHeight;
        type = 'farLeft';

        if (type === 'farLeft') {
            x = farLeftObstacleX;
            y = farLeftObstacleY;
            type = obstacleType[key];
        };

        if (type === 'farCentral') {
            x = farCentralObstacleX;
            y = farCentralObstacleY;
            type = obstacleType[key];
        }

        if (type === 'farRight') {
            x = farRightObstacleX;
            y = farRightObstacleY;
            type = obstacleType[key];
        }

        Obstacle(obstacleID, x, y, width, height, type)
    };
    for (var key in obstacleType) {
        Obstacle.type = obstacleType[key];
        generateObstacle();
    }
}


//----------------------- Reset shot -------------------------//

//Needed to avoid the bullet-dragging problem

resetShot = function () {

    document.removeEventListener("keydown", keyShiftDown);       //Prevent accidental shoots
    drawText('The pointer must stay within the game screen', WIDTH / 2, HEIGHT / 2 + 90, 15, "Arial");

    if (mouseX == null || mouseY == null) {
        context.clearRect(0, 313, 225, extendedHEIGHT);
    }
}


//------------------- Make time pass --------------------//

timePasses = function () {
    if (shotNumber == 13) {
        context.clearRect(0, 0, WIDTH, extendedHEIGHT);
        drawText('The End', WIDTH / 2, HEIGHT / 2 - 50, 30, "Arial");
        drawText('Overall score: ' + score + " points", WIDTH / 2, HEIGHT / 2, 30, "Arial");
        document.body.style.cursor = "auto";
        endGame = true;
        context.clearRect(WIDTH / 2, 315, WIDTH / 2, 40)
        return
    }

    if (mouseX != null || mouseY != null) {
        context.clearRect(0, HEIGHT, WIDTH, extendedHEIGHT);
        countDownTimer -= 40;


        if (paused == false) {

            drawInformationMonitor()

            if (shotNumber == 13) {
                context.clearRect(0, 0, WIDTH, extendedHEIGHT);
                drawText('The End', WIDTH / 2, HEIGHT / 2 - 50, 30, "Arial");
                drawText('Overall score: ' + score + " points", WIDTH / 2, HEIGHT / 2, 30, "Arial");
                document.body.style.cursor = "auto";

            }

            context.clearRect(WIDTH / 2, 315, WIDTH / 2, 40)
            drawText("Shot: " + shotNumber + "      Score: " + score, WIDTH / 2 + 125, 335, 20, "Arial")
        }

    }
}


//------------------------- Update -------------------------//

//Update canvas
update = function () {

    if (mouseY == null || mouseX == null) {
        document.body.style.cursor = "none";
    } else {
        document.body.style.cursor = "auto";
    }

    if (shotNumber == 13) {
        context.clearRect(0, 0, WIDTH, extendedHEIGHT);
        drawText('The End', WIDTH / 2, HEIGHT / 2 - 50, 30, "Arial");
        drawText('Overall score: ' + score + " points", WIDTH / 2, HEIGHT / 2, 30, "Arial");
        document.body.style.cursor = "auto";
        endGame = true;
        context.clearRect(WIDTH / 2, 315, WIDTH / 2, 40)
        return
    }

    if (paused) {
        return
    };

    if (endGame) {
        return
    };

    document.addEventListener("keydown", keyShiftDown);     //Prevent accidental shoots


    context.clearRect(0, 0, WIDTH, extendedHEIGHT);

    drawInformationMonitor()

    //Draw entities
    drawTarget(target)

    for (var key in obstacleList) {
        drawObstacle(obstacleList[key])
    };

    drawBullet(bullet);


    //Movement and collision

    //This is needed because if the player shoots while mouse is null the game gives 10 points
    if (startGame == true) {
        ctx.onmouseleave = function (mouse) {
            if (bullet.y == bulletY && bullet.x == bulletX) {
                mouseOut = true;
            }
        }
        ctx.onmouseover = function (mouse) {
            if (bullet.y == bulletY && bullet.x == bulletX) {
                document.addEventListener("keydown", keyEnterDown);
                mouseOut = false;
            }
        }
        if (mouseOut) {
            document.removeEventListener("keydown", keyShiftDown);
            document.removeEventListener("keydown", keyEnterDown);
            resetShot();
        };

        context.clearRect(0, 0, WIDTH, extendedHEIGHT);
        paused = true;
        startGame = false;
        drawText('To shoot place the pointer on', WIDTH / 2, HEIGHT / 2 - 40, 20, "Arial");
        drawText('the red button and press Enter', WIDTH / 2, HEIGHT / 2 - 10, 20, "Arial")
        var button = {
            x: WIDTH / 2 - 40,
            y: HEIGHT / 2 + 30,
            width: 80,
            height: 50,
            color: 'red',
        }
        context.fillRect(WIDTH / 2 - 40 - (2), HEIGHT / 2 + 30 - (2), 80 + (2 * 2), 50 + (2 * 2))
        drawButton(button);
        bullet.x = bulletX;
        bullet.y = bulletY;
        document.removeEventListener("keydown", keyShiftDown);     //Prevent accidental shoots
        return
    }


    if (bulletCrashWithTarget(target)) {
        clearInterval(interval2);

        // Assign score based on how close to the center of the target the bullet ends
        if (bulletCenter <= centralTargetX + centralTargetWidth / 19 || bulletCenter >= centralTargetX + centralTargetWidth - centralTargetWidth / 19) {
            scoreInThisShot += 1;
        } else if (bulletCenter <= centralTargetX + 2 * centralTargetWidth / 19 || bulletCenter >= centralTargetX + centralTargetWidth - 2 * centralTargetWidth / 19) {
            scoreInThisShot += 2;
        } else if (bulletCenter <= centralTargetX + 3 * centralTargetWidth / 19 || bulletCenter >= centralTargetX + centralTargetWidth - 3 * centralTargetWidth / 19) {
            scoreInThisShot += 3;
        } else if (bulletCenter <= centralTargetX + 4 * centralTargetWidth / 19 || bulletCenter >= centralTargetX + centralTargetWidth - 4 * centralTargetWidth / 19) {
            scoreInThisShot += 4;
        } else if (bulletCenter <= centralTargetX + 5 * centralTargetWidth / 19 || bulletCenter >= centralTargetX + centralTargetWidth - 5 * centralTargetWidth / 19) {
            scoreInThisShot += 5;
        } else if (bulletCenter <= centralTargetX + 6 * centralTargetWidth / 19 || bulletCenter >= centralTargetX + centralTargetWidth - 6 * centralTargetWidth / 19) {
            scoreInThisShot += 6;
        } else if (bulletCenter <= centralTargetX + 7 * centralTargetWidth / 19 || bulletCenter >= centralTargetX + centralTargetWidth - 7 * centralTargetWidth / 19) {
            scoreInThisShot += 7;
        } else if (bulletCenter <= centralTargetX + 8 * centralTargetWidth / 19 || bulletCenter >= centralTargetX + centralTargetWidth - 8 * centralTargetWidth / 19) {
            scoreInThisShot += 8;
        } else if (bulletCenter <= centralTargetX + 9 * centralTargetWidth / 19 || bulletCenter >= centralTargetX + centralTargetWidth - 9 * centralTargetWidth / 19) {
            scoreInThisShot += 9;
        } else if (bulletCenter <= centralTargetX + 10 * centralTargetWidth / 19 || bulletCenter >= centralTargetX + centralTargetWidth - 10 * centralTargetWidth / 19) {
            scoreInThisShot += 10;
        }

        scoreInThisShotRepository = scoreInThisShot;
        score += scoreInThisShot;
        delete scoreInThisShot;
        context.clearRect(WIDTH / 2, 315, WIDTH / 2, 40)
        drawText("Points: " + scoreInThisShotRepository, WIDTH / 2, HEIGHT / 2, 30, "Arial");
        drawText("Shot: " + shotNumber + "      Score: " + score, WIDTH / 2 + 125, 335, 20, "Arial")
        paused = true;
        setTimeout(newShot, 700);
        document.removeEventListener("keydown", keyShiftDown);     //Prevent accidental shoots
        document.removeEventListener("keydown", keyEnterDown);
        return
    } else {
        updateTargetPosition(target)
    }

    for (var key in obstacleList) {
        if (bulletCrashWithObstacle(obstacleList[key])) {
            clearInterval(interval2);
            scoreInThisShot += 0;
            console.log(shotDuration)
            scoreInThisShotRepository = scoreInThisShot;
            score += scoreInThisShot;
            delete scoreInThisShot;
            context.clearRect(WIDTH / 2, 315, WIDTH / 2, 40)
            drawText("Points: " + scoreInThisShotRepository, WIDTH / 2, HEIGHT / 2 + 20, 30, "Arial");
            drawText("Shot: " + shotNumber + "      Score: " + score, WIDTH / 2 + 125, 335, 20, "Arial")
            paused = true;
            setTimeout(newShot, 700);
            document.removeEventListener("keydown", keyShiftDown);     //Prevent accidental shoots
            document.removeEventListener("keydown", keyEnterDown);
            return
        }
    }


    if ((bullet.y - 30 && bullet.y < -15) || bullet.x <= -bulletWidth / 2 || bullet.x >= WIDTH + bulletWidth) {
        clearInterval(interval2);
        scoreInThisShot += 0;
        scoreInThisShotRepository = scoreInThisShot;
        score += scoreInThisShot;
        delete scoreInThisShot;
        context.clearRect(WIDTH / 2, 315, WIDTH / 2, 40)
        drawText("Points: " + scoreInThisShotRepository, WIDTH / 2, HEIGHT / 2, 30, "Arial");
        drawText("Shot: " + shotNumber + "      Score: " + score, WIDTH / 2 + 125, 335, 20, "Arial")
        paused = true;
        enterIsPressed = 0
        setTimeout(newShot, 700);
        document.removeEventListener("keydown", keyShiftDown);     //Prevent accidental shoots
        document.removeEventListener("keydown", keyEnterDown);
        return
    }
    if (bullet.y < HEIGHT - bulletHeight / 2 && bullet.y > -30 && bullet.x != bulletX) {
        updateBulletPosition(bullet)
    }


    bY = bulletY - 15;  // This variable is needed (see below) to avoid people "dragging" around the bullet before shooting

    if (bullet.y == bulletY && bullet.x == bulletX) {
        if (mouseY + bulletY > bY || mouseY + bulletY < 0) {
            document.removeEventListener("keydown", keyEnterDown);
            resetShot();
        } else {
            document.addEventListener("keydown", keyEnterDown);
        }

    }

    ctx.onmouseleave = function (mouse) {
        if (bullet.y == bulletY && bullet.x == bulletX) {
            mouseOut = true;
        }
    }

    ctx.onmouseover = function (mouse) {
        if (bullet.y == bulletY && bullet.x == bulletX) {
            document.addEventListener("keydown", keyEnterDown);
            mouseOut = false;
        }
    }

    if (mouseOut) {
        document.removeEventListener("keydown", keyShiftDown);
        document.removeEventListener("keydown", keyEnterDown);
        resetShot();
    };


    if (countDownTimer <= 0) {
        clearInterval(interval2);
        scoreInThisShot += 0;
        scoreInThisShotRepository = scoreInThisShot;
        score += scoreInThisShot;
        delete scoreInThisShot;
        drawText("Time's up!", WIDTH / 2, HEIGHT / 2 - 30, 30, "Arial");
        drawText("Points: " + scoreInThisShotRepository, WIDTH / 2, HEIGHT / 2 + 30, 30, "Arial");
        context.clearRect(WIDTH / 2, 315, WIDTH / 2, 40)
        drawText("Shot: " + shotNumber + "      Score: " + score, WIDTH / 2 + 125, 335, 20, "Arial")
        shotDuration = Date.now() - timeWhenShotStarted;
        paused = true;
        setTimeout(newShot, 700);
        document.removeEventListener("keydown", keyShiftDown);   //Prevent accidental shoots
        document.removeEventListener("keydown", keyEnterDown);
        return
    }

    context.clearRect(WIDTH / 2, 315, WIDTH / 2, 40)
    drawText("Shot: " + shotNumber + "      Score: " + score, WIDTH / 2 + 125, 335, 20, "Arial")
}



//------------------- GAME LOOP --------------------//

generateTarget();

for (var key in obstacleType) {
    Obstacle.type = obstacleType[key];
    generateObstacle();
}

var interval = setInterval(update, 40);