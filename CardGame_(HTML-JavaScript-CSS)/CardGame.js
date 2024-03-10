//------------ SETUP ------------//

const canvaRound = document.getElementById('canvaRound');
const contextCanvaRound = canvaRound.getContext('2d');
canvaRound.style.top = window.innerHeight - (95 * window.innerHeight / 100);
canvaRound.style.left = "0px";
canvaRound.style.position = "relative";

const ctx = document.getElementById('ctx');
const context = ctx.getContext('2d');
ctx.style.top = window.innerHeight - (108 * window.innerHeight / 100);
ctx.style.position = "relative";

// The x and y offset of the canvas from the edge of the page
const rect = ctx.getBoundingClientRect();

stack = document.querySelector(".stack");

cardDeckRiskyLeft = document.querySelector(".cardDeckRiskyLeft");
cardDeckRiskyRight = document.querySelector(".cardDeckRiskyRight");
cardDeckSafeRight = document.querySelector(".cardDeckSafeRight");
cardDeckSafeLeft = document.querySelector(".cardDeckSafeLeft");
cardRiskyRight = document.querySelector(".cardRiskyRight");
cardRiskyLeft = document.querySelector(".cardRiskyLeft");
cardSafeRight = document.querySelector(".cardSafeRight");
cardSafeLeft = document.querySelector(".cardSafeLeft");

text0Left = document.querySelector(".text0Left");
text0Right = document.querySelector(".text0Right");

text30LoseLeft = document.querySelector(".text30LoseLeft");
text30WinLeft = document.querySelector(".text30WinLeft");
text30LoseRight = document.querySelector(".text30LoseRight");
text30WinRight = document.querySelector(".text30WinRight");
text10LoseLeft = document.querySelector(".text10LoseLeft");
text10WinLeft = document.querySelector(".text10WinLeft");
text10LoseRight = document.querySelector(".text10LoseRight");
text10WinRight = document.querySelector(".text10WinRight");

text60LoseLeft = document.querySelector(".text60LoseLeft");
text60WinLeft = document.querySelector(".text60WinLeft");
text60LoseRight = document.querySelector(".text60LoseRight");
text60WinRight = document.querySelector(".text60WinRight");
text20LoseLeft = document.querySelector(".text20LoseLeft");
text20WinLeft = document.querySelector(".text20WinLeft");
text20LoseRight = document.querySelector(".text20LoseRight");
text20WinRight = document.querySelector(".text20WinRight");

NextTrialChosenRiskyLeft = document.querySelector(".NextTrialChosenRiskyLeft");
NextTrialChosenRiskyRight = document.querySelector(".NextTrialChosenRiskyRight");
forgoneNextTrialChosenRiskyLeft = document.querySelector(".forgoneNextTrialChosenRiskyLeft");
forgoneNextTrialChosenRiskyRight = document.querySelector(".forgoneNextTrialChosenRiskyRight");
NextTrialChosenSafeLeft = document.querySelector(".NextTrialChosenSafeLeft");
NextTrialChosenSafeRight = document.querySelector(".NextTrialChosenSafeRight");
forgoneNextTrialChosenSafeLeft = document.querySelector(".forgoneNextTrialChosenSafeLeft");
forgoneNextTrialChosenSafeRight = document.querySelector(".forgoneNextTrialChosenSafeRight");

LastTrialChosenRiskyLeft = document.querySelector(".LastTrialChosenRiskyLeft");
LastTrialChosenRiskyRight = document.querySelector(".LastTrialChosenRiskyRight");
forgoneLastTrialChosenRiskyLeft = document.querySelector(".forgoneLastTrialChosenRiskyLeft");
forgoneLastTrialChosenRiskyRight = document.querySelector(".forgoneLastTrialChosenRiskyRight");
LastTrialChosenSafeLeft = document.querySelector(".LastTrialChosenSafeLeft");
LastTrialChosenSafeRight = document.querySelector(".LastTrialChosenSafeRight");
forgoneLastTrialChosenSafeLeft = document.querySelector(".forgoneLastTrialChosenSafeLeft");
forgoneLastTrialChosenSafeRight = document.querySelector(".forgoneLastTrialChosenSafeRight");

lose60Left = document.querySelector(".lose60Left");
lose20Left = document.querySelector(".lose20Left");
risky0Left = document.querySelector(".risky0Left");
win20Left = document.querySelector(".win20Left");
win60Left = document.querySelector(".win60Left");
lose60Right = document.querySelector(".lose60Right");
lose20Right = document.querySelector(".lose20Right");
risky0Right = document.querySelector(".risky0Right");
win20Right = document.querySelector(".win20Right");
win60Right = document.querySelector(".win60Right");

lose30Left = document.querySelector(".lose30Left");
lose10Left = document.querySelector(".lose10Left");
safe0Left = document.querySelector(".safe0Left");
win10Left = document.querySelector(".win10Left");
win30Left = document.querySelector(".win30Left");
lose30Right = document.querySelector(".lose30Right");
lose10Right = document.querySelector(".lose10Right");
safe0Right = document.querySelector(".safe0Right");
win10Right = document.querySelector(".win10Right");
win30Right = document.querySelector(".win30Right");



timesRunRiskyLeft = 0;       //needed to terminate the shuffle animation
timesRunRiskyRight = 0;       //needed to terminate the shuffle animation
timesRunSafeLeft = 0;       //needed to terminate the shuffle animation
timesRunSafeRight = 0;       //needed to terminate the shuffle animation

lookedAtForgoneOption = 0;

numberChoices = 20;
numTrial = 0;      // needed to define the first couple presented

endowment = 65;
currentEndowment = endowment; // Initially set equal to endowment to display it before the first endowment computation is run
helpCost = 5;


// Trials //
listTrials = [];              //[a, b]: a = chosen option, b = forgone option; 0 = loss, 1 = gain
possibleOutcomesRisky = ["+60", "+20", "0", "-20", "-60"];
possibleOutcomesSafe = ["+30", "+10", "0", "-10", "-30"];

for (let i = 0; i < numberChoices; i++) {
    repositoryTrial = []

    randomRisky = Math.floor(Math.random() * possibleOutcomesRisky.length)
    randomSafe = Math.floor(Math.random() * possibleOutcomesSafe.length)

    outcomeRisky = possibleOutcomesRisky[randomRisky]            // chosenThisTimeRisky
    outcomeSafe = possibleOutcomesSafe[randomSafe]               // forgoneThisTimeRisky

    repositoryTrial.push(outcomeRisky, outcomeSafe)

    listTrials.push(repositoryTrial);
}

thisTrial = listTrials[numTrial];
outcomeRisky = thisTrial[0];
outcomeSafe = thisTrial[1];


// Decks position //
const makeRepeated = (arr, repeats) =>
    [].concat(...Array.from({ length: repeats }, () => arr));

tempListDeckPositions = makeRepeated([0, 1], numberChoices / 2)

listDeckPositions = shuffle(tempListDeckPositions)            // 0 = Risky left, Safe right; 1 = Safe left, Risky right

deckPosition = listDeckPositions[numTrial];


//------------ FUNCTIONS ------------//

//------------ Generate random integers ------------//

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//------------ Shuffle array ------------//

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

//------------ Drawing text ------------//

drawText = function (text, centerX, centerY, fontsize, fontface) {
    context.save();
    context.font = fontsize + 'px ' + fontface;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, centerX + 50, centerY);
    context.restore();
}

drawTextCanvaRound = function (text, centerX, centerY, fontsize, fontface) {
    contextCanvaRound.save();
    contextCanvaRound.font = fontsize + 'px ' + fontface;
    contextCanvaRound.textAlign = 'center';
    contextCanvaRound.textBaseline = 'middle';
    contextCanvaRound.fillText(text, centerX, centerY);
    contextCanvaRound.restore();
}


//------------ Flow ------------//

//------------ Yes/No ------------//

function hideNextTrialChosenRiskyLeft() {
    NextTrialChosenRiskyLeft.style.animation = "hideNextTrialChosenRiskyLeft 1ms 1ms both";
}
function hideForgoneNextTrialChosenRiskyLeft() {
    forgoneNextTrialChosenRiskyLeft.style.animation = "hideForgoneNextTrialChosenRiskyLeft 1ms 1ms both";
}
function hideLastTrialChosenRiskyLeft() {
    LastTrialChosenRiskyLeft.style.animation = "hideLastTrialChosenRiskyLeft 1ms 1ms both";
}
function hideForgoneLastTrialChosenRiskyLeft() {
    forgoneLastTrialChosenRiskyLeft.style.animation = "hideForgoneLastTrialChosenRiskyLeft 1ms 1ms both";
}
function hideNextTrialChosenRiskyRight() {
    NextTrialChosenRiskyRight.style.animation = "hideNextTrialChosenRiskyRight 1ms 1ms both";
}
function hideForgoneNextTrialChosenRiskyRight() {
    forgoneNextTrialChosenRiskyRight.style.animation = "hideForgoneNextTrialChosenRiskyRight 1ms 1ms both";
}
function hideLastTrialChosenRiskyRight() {
    LastTrialChosenRiskyRight.style.animation = "hideLastTrialChosenRiskyRight 1ms 1ms both";
}
function hideForgoneLastTrialChosenRiskyRight() {
    forgoneLastTrialChosenRiskyRight.style.animation = "hideForgoneLastTrialChosenRiskyRight 1ms 1ms both";
}


function hideNextTrialChosenSafeLeft() {
    NextTrialChosenSafeLeft.style.animation = "hideNextTrialChosenSafeLeft 1ms 1ms both";
}
function hideForgoneNextTrialChosenSafeLeft() {
    forgoneNextTrialChosenSafeLeft.style.animation = "hideForgoneNextTrialChosenSafeLeft 1ms 1ms both";
}
function hideLastTrialChosenSafeLeft() {
    LastTrialChosenSafeLeft.style.animation = "hideLastTrialChosenSafeLeft 1ms 1ms both";
}
function hideForgoneLastTrialChosenSafeLeft() {
    forgoneLastTrialChosenSafeLeft.style.animation = "hideForgoneLastTrialChosenSafeLeft 1ms 1ms both";
}
function hideNextTrialChosenSafeRight() {
    NextTrialChosenSafeRight.style.animation = "hideNextTrialChosenSafeRight 1ms 1ms both";
}
function hideForgoneNextTrialChosenSafeRight() {
    forgoneNextTrialChosenSafeRight.style.animation = "hideForgoneNextTrialChosenSafeRight 1ms 1ms both";
}
function hideLastTrialChosenSafeRight() {
    LastTrialChosenSafeRight.style.animation = "hideLastTrialChosenSafeRight 1ms 1ms both";
}
function hideForgoneLastTrialChosenSafeRight() {
    forgoneLastTrialChosenSafeRight.style.animation = "hideForgoneLastTrialChosenSafeRight 1ms 1ms both";
}



//------------ Shuffle initervals ------------//

function inTaskIntervalRiskyLeft() {
    cardDeckRiskyLeft.style.animation = "showRiskyLeftCardDeck 1ms 1ms both";
    cardRiskyLeft.style.animation = "showRiskyLeftCard 1ms 1ms both";
    lose60Left.style.animation = "showRiskyLabelLeft 1ms 1ms both";
    lose20Left.style.animation = "showRiskyLabelLeft 1ms 1ms both";
    risky0Left.style.animation = "showRiskyLabelLeft 1ms 1ms both";
    win20Left.style.animation = "showRiskyLabelLeft 1ms 1ms both";
    win60Left.style.animation = "showRiskyLabelLeft 1ms 1ms both";

    cardDeckRiskyRight.style.animation = "hideRiskyRightCardDeck 1ms 1ms both";
    cardRiskyRight.style.animation = "hideRiskyRightCard 1ms 1ms both";
    lose60Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
    lose20Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
    risky0Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
    win20Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
    win60Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";

    intervalRiskyLeft = setInterval(shuffleRiskyLeft, 800);
}
function inTaskIntervalRiskyRight() {
    cardDeckRiskyLeft.style.animation = "hideRiskyLeftCardDeck 1ms 1ms both";
    cardRiskyLeft.style.animation = "hideRiskyLeftCard 1ms 1ms both";
    lose60Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
    lose20Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
    risky0Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
    win20Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
    win60Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";

    cardDeckRiskyRight.style.animation = "showRiskyRightCardDeck 1ms 1ms both";
    cardRiskyRight.style.animation = "showRiskyRightCard 1ms 1ms both";
    lose60Right.style.animation = "showRiskyLabelRight 1ms 1ms both";
    lose20Right.style.animation = "showRiskyLabelRight 1ms 1ms both";
    risky0Right.style.animation = "showRiskyLabelRight 1ms 1ms both";
    win20Right.style.animation = "showRiskyLabelRight 1ms 1ms both";
    win60Right.style.animation = "showRiskyLabelRight 1ms 1ms both";

    intervalRiskyRight = setInterval(shuffleRiskyRight, 800);
}

function inTaskIntervalSafeLeft() {
    cardDeckSafeLeft.style.animation = "showSafeLeftCardDeck 1ms 1ms both";
    cardSafeLeft.style.animation = "showSafeLeftCard 1ms 1ms both";
    lose30Left.style.animation = "showSafeLabelLeft 1ms 1ms both";
    lose10Left.style.animation = "showSafeLabelLeft 1ms 1ms both";
    safe0Left.style.animation = "showSafeLabelLeft 1ms 1ms both";
    win10Left.style.animation = "showSafeLabelLeft 1ms 1ms both";
    win30Left.style.animation = "showSafeLabelLeft 1ms 1ms both";

    cardDeckSafeRight.style.animation = "hideSafeRightCardDeck 1ms 1ms both";
    cardSafeRight.style.animation = "hideSafeRightCard 1ms 1ms both";
    lose30Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
    lose10Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
    safe0Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
    win10Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
    win30Right.style.animation = "hideSafeLabelRight 1ms 1ms both";

    intervalSafeLeft = setInterval(shuffleSafeLeft, 800);
}
function inTaskIntervalSafeRight() {
    cardDeckSafeLeft.style.animation = "hideSafeLeftCardDeck 1ms 1ms both";
    cardSafeLeft.style.animation = "hideSafeLeftCard 1ms 1ms both";
    lose30Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
    lose10Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
    safe0Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
    win10Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
    win30Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";

    cardDeckSafeRight.style.animation = "showSafeRightCardDeck 1ms 1ms both";
    cardSafeRight.style.animation = "showSafeRightCard 1ms 1ms both";
    lose30Right.style.animation = "showSafeLabelRight 1ms 1ms both";
    lose10Right.style.animation = "showSafeLabelRight 1ms 1ms both";
    safe0Right.style.animation = "showSafeLabelRight 1ms 1ms both";
    win10Right.style.animation = "showSafeLabelRight 1ms 1ms both";
    win30Right.style.animation = "showSafeLabelRight 1ms 1ms both";


    intervalSafeRight = setInterval(shuffleSafeRight, 800);
}












//------------ Risky Left card ------------//

function shuffleRiskyLeft() {

    context.clearRect(0, 0, 600, 170);
    contextCanvaRound.clearRect(0, 0, 500, 110);
    drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
    drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");
    drawText("Preparing the cards", 250, 80, 20, "Arial");

    cardRiskyLeft.style.animation = "shuffleRiskyLeft 700ms both";

    setTimeout(() => {
        cardRiskyLeft.style.animation = "";
        stack.append(cardRiskyLeft);
        stack.append(text0Left);
        stack.append(text60LoseLeft);
        stack.append(text20LoseLeft);
        stack.append(text60WinLeft);
        stack.append(text20WinLeft);
    }, 700);

    timesRunRiskyLeft = timesRunRiskyLeft + 1;

    if (timesRunRiskyLeft === 3) {
        clearInterval(intervalRiskyLeft);
        setTimeout(afterShuffleRiskyLeft, 1000);
        timesRunRiskyLeft = 0;
    }

}


function afterShuffleRiskyLeft() {

    cardRiskyLeft.addEventListener("click", turnRiskyLeft);
    cardSafeRight.addEventListener("click", turnSafeRight);

    if (numTrial < listTrials.length) {
        context.clearRect(0, 0, 600, 170);
        contextCanvaRound.clearRect(0, 0, 500, 110);
        drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
        drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");
        drawText("From which deck do you want to turn over a card?", 250, 130, 20, "Arial");
        drawText("(click directly on it)", 250, 160, 20, "Arial");
    }

}

function turnRiskyLeft() {

    thisTrial = listTrials[numTrial];
    outcomeRisky = thisTrial[0];
    outcomeSafe = thisTrial[1];

    cardRiskyLeft.style.animation = "turnRiskyLeft 500ms both";

    cardRiskyLeft.removeEventListener("click", turnRiskyLeft);
    cardSafeRight.removeEventListener("click", turnSafeRight);


    context.clearRect(0, 0, 600, 170);
    contextCanvaRound.clearRect(0, 0, 500, 110);

    // Present option based on condition
    if (outcomeRisky == "0") {
        text0Left.style.animation = "showTextLeft 500ms both";
        currentEndowment = currentEndowment;
    } else if (outcomeRisky == "-60") {
        text60LoseLeft.style.animation = "showTextLeft 500ms both";
        currentEndowment = currentEndowment - 60;
    } else if (outcomeRisky == "+60") {
        text60WinLeft.style.animation = "showTextLeft 500ms both";
        currentEndowment = currentEndowment + 60;
    } else if (outcomeRisky == "-20") {
        text20LoseLeft.style.animation = "showTextLeft 500ms both";
        currentEndowment = currentEndowment - 20;
    } else if (outcomeRisky == "+20") {
        text20WinLeft.style.animation = "showTextLeft 500ms both";
        currentEndowment = currentEndowment + 20;
    }

    drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
    drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");

    setTimeout(wannaCheckForgoneOptionRiskyLeft, 1000)
}

function wannaCheckForgoneOptionRiskyLeft() {

    context.clearRect(0, 0, 600, 170);
    contextCanvaRound.clearRect(0, 0, 500, 110);
    drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
    drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");
    drawText("If you want to see what would have happened", 250, 90, 20, "Arial");
    drawText("if you had chosen the other deck, click on it (cost: " + helpCost + " pence)", 250, 120, 20, "Arial");

    if (numTrial < listTrials.length - 1) {
        NextTrialChosenRiskyLeft.style.animation = "showNextTrialChosenRiskyLeft 1ms both";
        NextTrialChosenRiskyLeft.addEventListener("click", resetRiskyLeftCard);
    } else if (numTrial == listTrials.length - 1) {
        LastTrialChosenRiskyLeft.style.animation = "showLastTrialChosenRiskyLeft 1ms both";
        LastTrialChosenRiskyLeft.addEventListener("click", resetRiskyLeftCard);
    }

    cardSafeRight.addEventListener("click", showForgoneOptionRiskyLeft);
}


function showForgoneOptionRiskyLeft() {

    currentEndowment = currentEndowment - helpCost;

    context.clearRect(0, 0, 600, 170);
    contextCanvaRound.clearRect(0, 0, 500, 110);
    drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
    drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");

    if (numTrial < listTrials.length - 1) {
        NextTrialChosenRiskyLeft.removeEventListener("click", resetRiskyLeftCard);
        NextTrialChosenRiskyLeft.style.animation = "hideNextTrialChosenRiskyLeft 1ms both";
    } else if (numTrial == listTrials.length - 1) {
        LastTrialChosenRiskyLeft.removeEventListener("click", resetRiskyLeftCard);
        LastTrialChosenRiskyLeft.style.animation = "hideLastTrialChosenRiskyLeft 1ms both";
    }

    cardSafeRight.removeEventListener("click", showForgoneOptionRiskyLeft);

    if (numTrial < listTrials.length - 1) {
        forgoneNextTrialChosenRiskyLeft.style.animation = "showForgoneNextTrialChosenRiskyLeft 1ms both";
        forgoneNextTrialChosenRiskyLeft.addEventListener("click", resetForgoneRiskyLeftCard);
    } if (numTrial == listTrials.length - 1) {
        forgoneLastTrialChosenRiskyLeft.style.animation = "showForgoneLastTrialChosenRiskyLeft 1ms both";
        forgoneLastTrialChosenRiskyLeft.addEventListener("click", resetForgoneRiskyLeftCard);
    }

    cardSafeRight.style.animation = "turnSafeRight 500ms both";

    lookedAtForgoneOption = 1;


    if (outcomeSafe == "0") {
        text0Right.style.animation = "showTextRight 500ms both";
    } else if (outcomeSafe == "-30") {
        text30LoseRight.style.animation = "showTextRight 500ms both";
    } else if (outcomeSafe == "+30") {
        text30WinRight.style.animation = "showTextRight 500ms both";
    } else if (outcomeSafe == "-10") {
        text10LoseRight.style.animation = "showTextRight 500ms both";
    } else if (outcomeSafe == "+10") {
        text10WinRight.style.animation = "showTextRight 500ms both";
    }

    context.clearRect(0, 0, 600, 170);

}


function resetRiskyLeftCard() {

    cardSafeRight.removeEventListener("click", showForgoneOptionRiskyLeft);

    if (numTrial < listTrials.length - 1) {
        NextTrialChosenRiskyLeft.removeEventListener("click", resetRiskyLeftCard);
        NextTrialChosenRiskyLeft.addEventListener("animationend", hideNextTrialChosenRiskyLeft())
    } else if (numTrial == listTrials.length - 1) {
        LastTrialChosenRiskyLeft.removeEventListener("click", resetRiskyLeftCard);
        LastTrialChosenRiskyLeft.addEventListener("animationend", hideLastTrialChosenRiskyLeft())
    }


    cardRiskyLeft.style.animation = "resetRiskyLeftCard 1ms 1ms both";

    if (outcomeRisky == "0") {
        text0Left.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeRisky == "-60") {
        text60LoseLeft.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeRisky == "+60") {
        text60WinLeft.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeRisky == "-20") {
        text20LoseLeft.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeRisky == "+20") {
        text20WinLeft.style.animation = "resetLeftText 1ms 1ms both";
    }

    currentEndowment = endowment;
    numTrial = numTrial + 1;

    context.clearRect(0, 0, 600, 170);

    lookedAtForgoneOption = 0;

    deckPosition = listDeckPositions[numTrial];


    if (numTrial < listTrials.length) {
        if (deckPosition == 0) {
            setTimeout(inTaskIntervalRiskyLeft, 500)
            setTimeout(inTaskIntervalSafeRight, 500)
        } else if (deckPosition == 1) {
            setTimeout(inTaskIntervalRiskyRight, 500)
            setTimeout(inTaskIntervalSafeLeft, 500)
        }
    }

    // End task
    if (numTrial == listTrials.length) {

        stack.style.animation = "hideStackConclusion 1ms 1ms both";

        lose60Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        lose20Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        risky0Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        win20Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        win60Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        lose30Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
        lose10Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
        safe0Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
        win10Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
        win30Right.style.animation = "hideSafeLabelRight 1ms 1ms both";

        context.clearRect(0, 0, 600, 170);
        contextCanvaRound.clearRect(0, 0, 500, 110);
        drawTextCanvaRound("The game is finished", 250, 50, 20, "Arial");
        drawText("Proceed to the next page, ", 250, 10, 20, "Arial");
        drawText("where the software will randomly select one round", 250, 40, 20, "Arial");
        drawText("upon which to compute your bonus payment", 250, 70, 20, "Arial");


    }
}


function resetForgoneRiskyLeftCard() {

    if (numTrial < listTrials.length - 1) {
        forgoneNextTrialChosenRiskyLeft.removeEventListener("click", resetForgoneRiskyLeftCard);
        forgoneNextTrialChosenRiskyLeft.addEventListener("animationend", hideForgoneNextTrialChosenRiskyLeft())
    } else if (numTrial == listTrials.length - 1) {
        forgoneLastTrialChosenRiskyLeft.removeEventListener("click", resetForgoneRiskyLeftCard);
        forgoneLastTrialChosenRiskyLeft.addEventListener("animationend", hideForgoneLastTrialChosenRiskyLeft())
    }


    cardRiskyLeft.style.animation = "resetRiskyLeftCard 1ms 1ms both";
    cardSafeRight.style.animation = "resetSafeRightCard 1ms 1ms both";

    if (outcomeRisky == "0") {
        text0Left.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeRisky == "-60") {
        text60LoseLeft.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeRisky == "+60") {
        text60WinLeft.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeRisky == "-20") {
        text20LoseLeft.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeRisky == "+20") {
        text20WinLeft.style.animation = "resetLeftText 1ms 1ms both";
    }

    if (outcomeSafe == "0") {
        text0Right.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeSafe == "-30") {
        text30LoseRight.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeSafe == "+30") {
        text30WinRight.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeSafe == "-10") {
        text10LoseRight.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeSafe == "+10") {
        text10WinRight.style.animation = "resetRightText 1ms 1ms both";
    }


    currentEndowment = endowment;
    numTrial = numTrial + 1;

    context.clearRect(0, 0, 600, 170);

    lookedAtForgoneOption = 0;

    deckPosition = listDeckPositions[numTrial];

    if (numTrial < listTrials.length) {
        if (deckPosition == 0) {
            setTimeout(inTaskIntervalRiskyLeft, 500)
            setTimeout(inTaskIntervalSafeRight, 500)
        } else if (deckPosition == 1) {
            setTimeout(inTaskIntervalRiskyRight, 500)
            setTimeout(inTaskIntervalSafeLeft, 500)
        }
    }


    // End task
    if (numTrial == listTrials.length) {

        stack.style.animation = "hideStackConclusion 1ms 1ms both";

        lose60Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        lose20Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        risky0Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        win20Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        win60Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        lose30Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
        lose10Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
        safe0Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
        win10Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
        win30Right.style.animation = "hideSafeLabelRight 1ms 1ms both";

        context.clearRect(0, 0, 600, 170);
        contextCanvaRound.clearRect(0, 0, 500, 110);
        drawTextCanvaRound("The game is finished", 250, 50, 20, "Arial");
        drawText("Proceed to the next page, ", 250, 10, 20, "Arial");
        drawText("where the software will randomly select one round", 250, 40, 20, "Arial");
        drawText(" upon which to compute your bonus payment", 250, 70, 20, "Arial");
    }
}












//------------ Risky Right card ------------//

function shuffleRiskyRight() {

    context.clearRect(0, 0, 600, 170);
    contextCanvaRound.clearRect(0, 0, 500, 110);
    drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
    drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");
    drawText("Preparing the cards", 250, 80, 20, "Arial");

    cardRiskyRight.style.animation = "shuffleRiskyRight 700ms both";

    setTimeout(() => {
        cardRiskyRight.style.animation = "";
        stack.append(cardRiskyRight);
        stack.append(text0Right);
        stack.append(text60LoseRight);
        stack.append(text20LoseRight);
        stack.append(text60WinRight);
        stack.append(text20WinRight);

    }, 700);

    timesRunRiskyRight = timesRunRiskyRight + 1;

    if (timesRunRiskyRight === 3) {
        clearInterval(intervalRiskyRight);
        setTimeout(afterShuffleRiskyRight, 1000);
        timesRunRiskyRight = 0;
    }

}


function afterShuffleRiskyRight() {

    cardRiskyRight.addEventListener("click", turnRiskyRight);
    cardSafeLeft.addEventListener("click", turnSafeLeft);

    if (numTrial < listTrials.length) {
        context.clearRect(0, 0, 600, 170);
        contextCanvaRound.clearRect(0, 0, 500, 110);
        drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
        drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");
        drawText("From which deck do you want to turn over a card?", 250, 130, 18, "Arial");
        drawText("(click directly on it)", 250, 160, 18, "Arial");
    }

}

function turnRiskyRight() {

    thisTrial = listTrials[numTrial];
    outcomeRisky = thisTrial[0];
    outcomeSafe = thisTrial[1];

    cardRiskyRight.style.animation = "turnRiskyRight 500ms both";

    cardRiskyRight.removeEventListener("click", turnRiskyRight);
    cardSafeLeft.removeEventListener("click", turnSafeLeft);


    // Present option based on condition
    context.clearRect(0, 0, 600, 170);
    contextCanvaRound.clearRect(0, 0, 500, 110);

    if (outcomeRisky == "0") {
        text0Right.style.animation = "showTextRight 500ms both";
        currentEndowment = currentEndowment;
    } else if (outcomeRisky == "-60") {
        text60LoseRight.style.animation = "showTextRight 500ms both";
        currentEndowment = currentEndowment - 60;
    } else if (outcomeRisky == "+60") {
        text60WinRight.style.animation = "showTextRight 500ms both";
        currentEndowment = currentEndowment + 60;
    } else if (outcomeRisky == "-20") {
        text20LoseRight.style.animation = "showTextRight 500ms both";
        currentEndowment = currentEndowment - 20;
    } else if (outcomeRisky == "+20") {
        text20WinRight.style.animation = "showTextRight 500ms both";
        currentEndowment = currentEndowment + 20;
    }

    drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
    drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");

    setTimeout(wannaCheckForgoneOptionRiskyRight, 1000)
}

function wannaCheckForgoneOptionRiskyRight() {

    context.clearRect(0, 0, 600, 170);
    contextCanvaRound.clearRect(0, 0, 500, 110);
    drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
    drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");
    drawText("If you want to see what would have happened", 250, 90, 20, "Arial");
    drawText("if you had chosen the other deck, click on it (cost: " + helpCost + " pence)", 250, 120, 20, "Arial");

    if (numTrial < listTrials.length - 1) {
        NextTrialChosenRiskyRight.style.animation = "showNextTrialChosenRiskyRight 1ms both";
        NextTrialChosenRiskyRight.addEventListener("click", resetRiskyRightCard);
    } else if (numTrial == listTrials.length - 1) {
        LastTrialChosenRiskyRight.style.animation = "showLastTrialChosenRiskyLeft 1ms both";
        LastTrialChosenRiskyRight.addEventListener("click", resetRiskyRightCard);
    }

    cardSafeLeft.addEventListener("click", showForgoneOptionRiskyRight);
}


function showForgoneOptionRiskyRight() {

    currentEndowment = currentEndowment - helpCost;

    context.clearRect(0, 0, 600, 170);
    contextCanvaRound.clearRect(0, 0, 500, 110);
    drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
    drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");

    if (numTrial < listTrials.length - 1) {
        NextTrialChosenRiskyRight.removeEventListener("click", resetRiskyRightCard);
        NextTrialChosenRiskyRight.style.animation = "hideNextTrialChosenRiskyRight 1ms both";
    } else if (numTrial == listTrials.length - 1) {
        LastTrialChosenRiskyRight.removeEventListener("click", resetRiskyRightCard);
        LastTrialChosenRiskyRight.style.animation = "hideLastTrialChosenRiskyRight 1ms both";
    }

    cardSafeLeft.removeEventListener("click", showForgoneOptionRiskyRight);

    if (numTrial < listTrials.length - 1) {
        forgoneNextTrialChosenRiskyRight.style.animation = "showForgoneNextTrialChosenRiskyRight 1ms both";
        forgoneNextTrialChosenRiskyRight.addEventListener("click", resetForgoneRiskyRightCard);
    } if (numTrial == listTrials.length - 1) {
        forgoneLastTrialChosenRiskyRight.style.animation = "showForgoneLastTrialChosenRiskyRight 1ms both";
        forgoneLastTrialChosenRiskyRight.addEventListener("click", resetForgoneRiskyRightCard);
    }

    cardSafeLeft.style.animation = "turnSafeLeft 500ms both";

    lookedAtForgoneOption = 1;

    if (outcomeSafe == "0") {
        text0Left.style.animation = "showTextLeft 500ms both";
    } else if (outcomeSafe == "-30") {
        text30LoseLeft.style.animation = "showTextLeft 500ms both";
    } else if (outcomeSafe == "+30") {
        text30WinLeft.style.animation = "showTextLeft 500ms both";
    } else if (outcomeSafe == "-10") {
        text10LoseLeft.style.animation = "showTextLeft 500ms both";
    } else if (outcomeSafe == "+10") {
        text10WinLeft.style.animation = "showTextLeft 500ms both";
    }

    context.clearRect(0, 0, 600, 170);

}


function resetRiskyRightCard() {

    cardSafeLeft.removeEventListener("click", showForgoneOptionRiskyRight);

    if (numTrial < listTrials.length - 1) {
        NextTrialChosenRiskyRight.removeEventListener("click", resetRiskyRightCard);
        NextTrialChosenRiskyRight.addEventListener("animationend", hideNextTrialChosenRiskyRight())
    } else if (numTrial == listTrials.length - 1) {
        LastTrialChosenRiskyRight.removeEventListener("click", resetRiskyRightCard);
        LastTrialChosenRiskyRight.addEventListener("animationend", hideLastTrialChosenRiskyRight())
    }

    cardRiskyRight.style.animation = "resetRiskyRightCard 1ms 1ms both";

    if (outcomeRisky == "0") {
        text0Right.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeRisky == "-60") {
        text60LoseRight.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeRisky == "+60") {
        text60WinRight.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeRisky == "-20") {
        text20LoseRight.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeRisky == "+20") {
        text20WinRight.style.animation = "resetRightText 1ms 1ms both";
    }


    currentEndowment = endowment;
    numTrial = numTrial + 1;

    context.clearRect(0, 0, 600, 170);

    lookedAtForgoneOption = 0;

    deckPosition = listDeckPositions[numTrial];


    if (numTrial < listTrials.length) {
        if (deckPosition == 0) {
            setTimeout(inTaskIntervalRiskyLeft, 500)
            setTimeout(inTaskIntervalSafeRight, 500)
        } else if (deckPosition == 1) {
            setTimeout(inTaskIntervalRiskyRight, 500)
            setTimeout(inTaskIntervalSafeLeft, 500)
        }
    }

    // End task
    if (numTrial == listTrials.length) {

        stack.style.animation = "hideStackConclusion 1ms 1ms both";

        lose60Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        lose20Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        risky0Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        win20Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        win60Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        lose30Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
        lose10Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
        safe0Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
        win10Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
        win30Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";

        context.clearRect(0, 0, 600, 170);
        contextCanvaRound.clearRect(0, 0, 500, 110);
        drawTextCanvaRound("The game is finished", 250, 50, 20, "Arial");
        drawText("Proceed to the next page, ", 250, 10, 20, "Arial");
        drawText("where the software will randomly select one round", 250, 40, 20, "Arial");
        drawText(" upon which to compute your bonus payment", 250, 70, 20, "Arial");

    }
}


function resetForgoneRiskyRightCard() {

    if (numTrial < listTrials.length - 1) {
        forgoneNextTrialChosenRiskyRight.removeEventListener("click", resetForgoneRiskyRightCard);
        forgoneNextTrialChosenRiskyRight.addEventListener("animationend", hideForgoneNextTrialChosenRiskyRight())
    } else if (numTrial == listTrials.length - 1) {
        forgoneLastTrialChosenRiskyRight.removeEventListener("click", resetForgoneRiskyRightCard);
        forgoneLastTrialChosenRiskyRight.addEventListener("animationend", hideForgoneLastTrialChosenRiskyRight())
    }


    cardRiskyRight.style.animation = "resetRiskyRightCard 1ms 1ms both";
    cardSafeLeft.style.animation = "resetSafeLeftCard 1ms 1ms both";

    if (outcomeRisky == "0") {
        text0Right.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeRisky == "-60") {
        text60LoseRight.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeRisky == "+60") {
        text60WinRight.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeRisky == "-20") {
        text20LoseRight.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeRisky == "+20") {
        text20WinRight.style.animation = "resetRightText 1ms 1ms both";
    }

    if (outcomeSafe == "0") {
        text0Left.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeSafe == "-30") {
        text30LoseLeft.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeSafe == "+30") {
        text30WinLeft.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeSafe == "-10") {
        text10LoseLeft.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeSafe == "+10") {
        text10WinLeft.style.animation = "resetLeftText 1ms 1ms both";
    }


    currentEndowment = endowment;
    numTrial = numTrial + 1;

    context.clearRect(0, 0, 600, 170);

    lookedAtForgoneOption = 0;

    deckPosition = listDeckPositions[numTrial];

    if (numTrial < listTrials.length) {
        if (deckPosition == 0) {
            setTimeout(inTaskIntervalRiskyLeft, 500)
            setTimeout(inTaskIntervalSafeRight, 500)
        } else if (deckPosition == 1) {
            setTimeout(inTaskIntervalRiskyRight, 500)
            setTimeout(inTaskIntervalSafeLeft, 500)
        }
    }


    // End task
    if (numTrial == listTrials.length) {

        stack.style.animation = "hideStackConclusion 1ms 1ms both";

        lose60Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        lose20Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        risky0Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        win20Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        win60Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        lose30Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
        lose10Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
        safe0Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
        win10Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
        win30Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";

        context.clearRect(0, 0, 600, 170);
        contextCanvaRound.clearRect(0, 0, 500, 110);
        drawTextCanvaRound("The game is finished", 250, 50, 20, "Arial");
        drawText("Proceed to the next page, ", 250, 10, 20, "Arial");
        drawText("where the software will randomly select one round", 250, 40, 20, "Arial");
        drawText(" upon which to compute your bonus payment", 250, 70, 20, "Arial");
    }
}











//------------ Safe Left card ------------//

function shuffleSafeLeft() {

    context.clearRect(0, 0, 600, 170);
    contextCanvaRound.clearRect(0, 0, 500, 110);
    drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
    drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");
    drawText("Preparing the cards", 250, 80, 20, "Arial");

    cardSafeLeft.style.animation = "shuffleSafeLeft 700ms both";

    setTimeout(() => {
        cardSafeLeft.style.animation = "";
        stack.append(cardSafeLeft);
        stack.append(text0Left);
        stack.append(text30LoseLeft);
        stack.append(text10LoseLeft);
        stack.append(text30WinLeft);
        stack.append(text10WinLeft);

    }, 700);

    timesRunSafeLeft = timesRunSafeLeft + 1;

    if (timesRunSafeLeft === 3) {
        clearInterval(intervalSafeLeft);
        setTimeout(afterShuffleSafeLeft, 1000);
        timesRunSafeLeft = 0;
    }

}


function afterShuffleSafeLeft() {

    cardSafeLeft.addEventListener("click", turnSafeLeft);
    cardRiskyRight.addEventListener("click", turnRiskyRight);

    if (numTrial < listTrials.length) {
        context.clearRect(0, 0, 600, 170);
        contextCanvaRound.clearRect(0, 0, 500, 110);
        drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
        drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");
        drawText("From which deck do you want to turn over a card?", 250, 130, 18, "Arial");
        drawText("(click directly on it)", 250, 160, 18, "Arial");
    }

}

function turnSafeLeft() {

    thisTrial = listTrials[numTrial];
    outcomeRisky = thisTrial[0];
    outcomeSafe = thisTrial[1];

    cardSafeLeft.style.animation = "turnSafeLeft 500ms both";

    cardSafeLeft.removeEventListener("click", turnSafeLeft);
    cardRiskyRight.removeEventListener("click", turnRiskyRight);


    // Present option based on condition

    context.clearRect(0, 0, 600, 170);
    contextCanvaRound.clearRect(0, 0, 500, 110);

    if (outcomeSafe == "0") {
        text0Left.style.animation = "showTextLeft 500ms both";
        currentEndowment = currentEndowment;
    } else if (outcomeSafe == "-30") {
        text30LoseLeft.style.animation = "showTextLeft 500ms both";
        currentEndowment = currentEndowment - 30;
    } else if (outcomeSafe == "+30") {
        text30WinLeft.style.animation = "showTextLeft 500ms both";
        currentEndowment = currentEndowment + 30;
    } else if (outcomeSafe == "-10") {
        text10LoseLeft.style.animation = "showTextLeft 500ms both";
        currentEndowment = currentEndowment - 10;
    } else if (outcomeSafe == "+10") {
        text10WinLeft.style.animation = "showTextLeft 500ms both";
        currentEndowment = currentEndowment + 10;
    }

    drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
    drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");

    setTimeout(wannaCheckForgoneOptionSafeLeft, 1000)
}

function wannaCheckForgoneOptionSafeLeft() {

    context.clearRect(0, 0, 600, 170);
    contextCanvaRound.clearRect(0, 0, 500, 110);
    drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
    drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");
    drawText("If you want to see what would have happened", 250, 90, 20, "Arial");
    drawText("if you had chosen the other deck, click on it (cost: " + helpCost + " pence)", 250, 120, 20, "Arial");


    if (numTrial < listTrials.length - 1) {
        NextTrialChosenSafeLeft.style.animation = "showNextTrialChosenSafeLeft 1ms both";
        NextTrialChosenSafeLeft.addEventListener("click", resetSafeLeftCard);
    } else if (numTrial == listTrials.length - 1) {
        LastTrialChosenSafeLeft.style.animation = "showLastTrialChosenSafeLeft 1ms both";
        LastTrialChosenSafeLeft.addEventListener("click", resetSafeLeftCard);
    }

    cardRiskyRight.addEventListener("click", showForgoneOptionSafeLeft);
}


function showForgoneOptionSafeLeft() {

    currentEndowment = currentEndowment - helpCost;

    context.clearRect(0, 0, 600, 170);
    contextCanvaRound.clearRect(0, 0, 500, 110);
    drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
    drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");


    if (numTrial < listTrials.length - 1) {
        NextTrialChosenSafeLeft.removeEventListener("click", resetSafeLeftCard);
        NextTrialChosenSafeLeft.style.animation = "hideNextTrialChosenSafeLeft 1ms both";
    } else if (numTrial == listTrials.length - 1) {
        LastTrialChosenSafeLeft.removeEventListener("click", resetSafeLeftCard);
        LastTrialChosenSafeLeft.style.animation = "hideLastTrialChosenSafeLeft 1ms both";
    }

    cardRiskyRight.removeEventListener("click", showForgoneOptionSafeLeft);

    if (numTrial < listTrials.length - 1) {
        forgoneNextTrialChosenSafeLeft.style.animation = "showForgoneNextTrialChosenSafeLeft 1ms both";
        forgoneNextTrialChosenSafeLeft.addEventListener("click", resetForgoneSafeLeftCard);
    } if (numTrial == listTrials.length - 1) {
        forgoneLastTrialChosenSafeLeft.style.animation = "showForgoneLastTrialChosenSafeLeft 1ms both";
        forgoneLastTrialChosenSafeLeft.addEventListener("click", resetForgoneSafeLeftCard);
    }

    cardRiskyRight.style.animation = "turnRiskyRight 500ms both";

    lookedAtForgoneOption = 1;

    if (outcomeRisky == "0") {
        text0Right.style.animation = "showTextRight 500ms both";
    } else if (outcomeRisky == "-60") {
        text60LoseRight.style.animation = "showTextRight 500ms both";
    } else if (outcomeRisky == "+60") {
        text60WinRight.style.animation = "showTextRight 500ms both";
    } else if (outcomeRisky == "-20") {
        text20LoseRight.style.animation = "showTextRight 500ms both";
    } else if (outcomeRisky == "+20") {
        text20WinRight.style.animation = "showTextRight 500ms both";
    }

}


function resetSafeLeftCard() {

    cardRiskyRight.removeEventListener("click", showForgoneOptionSafeLeft);

    if (numTrial < listTrials.length - 1) {
        NextTrialChosenSafeLeft.removeEventListener("click", resetSafeLeftCard);
        NextTrialChosenSafeLeft.addEventListener("animationend", hideNextTrialChosenSafeLeft())
    } else if (numTrial == listTrials.length - 1) {
        LastTrialChosenSafeLeft.removeEventListener("click", resetSafeLeftCard);
        LastTrialChosenSafeLeft.addEventListener("animationend", hideLastTrialChosenSafeLeft())
    }

    cardSafeLeft.style.animation = "resetSafeLeftCard 1ms 1ms both";

    if (outcomeSafe == "0") {
        text0Left.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeSafe == "-30") {
        text30LoseLeft.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeSafe == "+30") {
        text30WinLeft.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeSafe == "-10") {
        text10LoseLeft.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeSafe == "+10") {
        text10WinLeft.style.animation = "resetLeftText 1ms 1ms both";
    }


    currentEndowment = endowment;
    numTrial = numTrial + 1;

    context.clearRect(0, 0, 600, 170);

    lookedAtForgoneOption = 0;

    deckPosition = listDeckPositions[numTrial];


    if (numTrial < listTrials.length) {
        if (deckPosition == 0) {
            setTimeout(inTaskIntervalRiskyLeft, 500)
            setTimeout(inTaskIntervalSafeRight, 500)
        } else if (deckPosition == 1) {
            setTimeout(inTaskIntervalRiskyRight, 500)
            setTimeout(inTaskIntervalSafeLeft, 500)
        }
    }

    // End task
    if (numTrial == listTrials.length) {

        stack.style.animation = "hideStackConclusion 1ms 1ms both";

        lose60Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        lose20Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        risky0Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        win20Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        win60Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        lose30Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
        lose10Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
        safe0Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
        win10Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
        win30Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";

        context.clearRect(0, 0, 600, 170);
        contextCanvaRound.clearRect(0, 0, 500, 110);
        drawTextCanvaRound("The game is finished", 250, 50, 20, "Arial");
        drawText("Proceed to the next page, ", 250, 10, 20, "Arial");
        drawText("where the software will randomly select one round", 250, 40, 20, "Arial");
        drawText(" upon which to compute your bonus payment", 250, 70, 20, "Arial");

    }
}


function resetForgoneSafeLeftCard() {

    if (numTrial < listTrials.length - 1) {
        forgoneNextTrialChosenSafeLeft.removeEventListener("click", resetForgoneSafeLeftCard);
        forgoneNextTrialChosenSafeLeft.addEventListener("animationend", hideForgoneNextTrialChosenSafeLeft())
    } else if (numTrial == listTrials.length - 1) {
        forgoneLastTrialChosenSafeLeft.removeEventListener("click", resetForgoneSafeLeftCard);
        forgoneLastTrialChosenSafeLeft.addEventListener("animationend", hideForgoneLastTrialChosenSafeLeft())
    }


    cardSafeLeft.style.animation = "resetSafeLeftCard 1ms 1ms both";
    cardRiskyRight.style.animation = "resetRiskyRightCard 1ms 1ms both";

    if (outcomeSafe == "0") {
        text0Left.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeSafe == "-30") {
        text30LoseLeft.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeSafe == "+30") {
        text30WinLeft.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeSafe == "-10") {
        text10LoseLeft.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeSafe == "+10") {
        text10WinLeft.style.animation = "resetLeftText 1ms 1ms both";
    }

    if (outcomeRisky == "0") {
        text0Right.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeRisky == "-60") {
        text60LoseRight.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeRisky == "+60") {
        text60WinRight.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeRisky == "-20") {
        text20LoseRight.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeRisky == "+20") {
        text20WinRight.style.animation = "resetRightText 1ms 1ms both";
    }


    currentEndowment = endowment;
    numTrial = numTrial + 1;

    context.clearRect(0, 0, 600, 170);

    lookedAtForgoneOption = 0;

    deckPosition = listDeckPositions[numTrial];

    if (numTrial < listTrials.length) {
        if (deckPosition == 0) {
            setTimeout(inTaskIntervalRiskyLeft, 500)
            setTimeout(inTaskIntervalSafeRight, 500)
        } else if (deckPosition == 1) {
            setTimeout(inTaskIntervalRiskyRight, 500)
            setTimeout(inTaskIntervalSafeLeft, 500)
        }
    }


    // End task
    if (numTrial == listTrials.length) {

        stack.style.animation = "hideStackConclusion 1ms 1ms both";

        lose60Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        lose20Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        risky0Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        win20Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        win60Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
        lose30Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
        lose10Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
        safe0Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
        win10Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
        win30Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";

        context.clearRect(0, 0, 600, 170);
        contextCanvaRound.clearRect(0, 0, 500, 110);
        drawTextCanvaRound("The game is finished", 250, 50, 20, "Arial");
        drawText("Proceed to the next page, ", 250, 10, 20, "Arial");
        drawText("where the software will randomly select one round", 250, 40, 20, "Arial");
        drawText(" upon which to compute your bonus payment", 250, 70, 20, "Arial");
    }
}










//------------ Safe Right card ------------//

function shuffleSafeRight() {

    context.clearRect(0, 0, 600, 170);
    contextCanvaRound.clearRect(0, 0, 500, 110);
    drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
    drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");
    drawText("Preparing the cards", 250, 80, 20, "Arial");

    cardSafeRight.style.animation = "shuffleSafeRight 700ms both";

    setTimeout(() => {
        cardSafeRight.style.animation = "";
        stack.append(cardSafeRight);
        stack.append(text0Right);
        stack.append(text30LoseRight);
        stack.append(text10LoseRight);
        stack.append(text30WinRight);
        stack.append(text10WinRight);

    }, 700);

    timesRunSafeRight = timesRunSafeRight + 1;

    if (timesRunSafeRight === 3) {
        clearInterval(intervalSafeRight);
        setTimeout(afterShuffleSafeRight, 1000);
        timesRunSafeRight = 0;
    }

}


function afterShuffleSafeRight() {

    cardSafeRight.addEventListener("click", turnSafeRight);
    cardRiskyLeft.addEventListener("click", turnRiskyLeft);

    if (numTrial < listTrials.length) {
        context.clearRect(0, 0, 600, 170);
        contextCanvaRound.clearRect(0, 0, 500, 110);
        drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
        drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");
        drawText("From which deck do you want to turn over a card?", 250, 130, 18, "Arial");
        drawText("(click directly on it)", 250, 160, 18, "Arial");
    }

}

function turnSafeRight() {

    thisTrial = listTrials[numTrial];
    outcomeRisky = thisTrial[0];
    outcomeSafe = thisTrial[1];

    cardSafeRight.style.animation = "turnSafeRight 500ms both";

    cardSafeRight.removeEventListener("click", turnSafeRight);
    cardRiskyLeft.removeEventListener("click", turnRiskyLeft);

    // Present option based on condition

    context.clearRect(0, 0, 600, 170);
    contextCanvaRound.clearRect(0, 0, 500, 110);

    if (outcomeSafe == "0") {
        text0Right.style.animation = "showTextRight 500ms both";
        currentEndowment = currentEndowment;
    } else if (outcomeSafe == "-30") {
        text30LoseRight.style.animation = "showTextRight 500ms both";
        currentEndowment = currentEndowment - 30;
    } else if (outcomeSafe == "+30") {
        text30WinRight.style.animation = "showTextRight 500ms both";
        currentEndowment = currentEndowment + 30;
    } else if (outcomeSafe == "-10") {
        text10LoseRight.style.animation = "showTextRight 500ms both";
        currentEndowment = currentEndowment - 10;
    } else if (outcomeSafe == "+10") {
        text10WinRight.style.animation = "showTextRight 500ms both";
        currentEndowment = currentEndowment + 10;
    }

    drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
    drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");

    setTimeout(wannaCheckForgoneOptionSafeRight, 1000)
}

function wannaCheckForgoneOptionSafeRight() {

    context.clearRect(0, 0, 600, 170);
    contextCanvaRound.clearRect(0, 0, 500, 110);
    drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
    drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");
    drawText("If you want to see what would have happened", 250, 90, 20, "Arial");
    drawText("if you had chosen the other deck, click on it (cost: " + helpCost + " pence)", 250, 120, 20, "Arial");

    if (numTrial < listTrials.length - 1) {
        NextTrialChosenSafeRight.style.animation = "showNextTrialChosenSafeRight 1ms both";
        NextTrialChosenSafeRight.addEventListener("click", resetSafeRightCard);
    } else if (numTrial == listTrials.length - 1) {
        LastTrialChosenSafeRight.style.animation = "showLastTrialChosenSafeRight 1ms both";
        LastTrialChosenSafeRight.addEventListener("click", resetSafeRightCard);
    }

    cardRiskyLeft.addEventListener("click", showForgoneOptionSafeRight);
}


function showForgoneOptionSafeRight() {

    currentEndowment = currentEndowment - helpCost;

    context.clearRect(0, 0, 600, 170);
    contextCanvaRound.clearRect(0, 0, 500, 110);
    drawTextCanvaRound("Round " + (numTrial + 1) + " of " + numberChoices, 250, 30, 20, "Arial");
    drawTextCanvaRound("Current endowment: " + currentEndowment + " pence", 250, 60, 18, "Arial");


    if (numTrial < listTrials.length - 1) {
        NextTrialChosenSafeRight.removeEventListener("click", resetSafeRightCard);
        NextTrialChosenSafeRight.style.animation = "hideNextTrialChosenSafeRight 1ms both";
    } else if (numTrial == listTrials.length - 1) {
        LastTrialChosenSafeRight.removeEventListener("click", resetSafeRightCard);
        LastTrialChosenSafeRight.style.animation = "hideLastTrialChosenSafeRight 1ms both";
    }

    cardRiskyLeft.removeEventListener("click", showForgoneOptionSafeRight);

    if (numTrial < listTrials.length - 1) {
        forgoneNextTrialChosenSafeRight.style.animation = "showForgoneNextTrialChosenSafeRight 1ms both";
        forgoneNextTrialChosenSafeRight.addEventListener("click", resetForgoneSafeRightCard);
    } if (numTrial == listTrials.length - 1) {
        forgoneLastTrialChosenSafeRight.style.animation = "showForgoneLastTrialChosenSafeRight 1ms both";
        forgoneLastTrialChosenSafeRight.addEventListener("click", resetForgoneSafeRightCard);
    }

    cardRiskyLeft.style.animation = "turnRiskyLeft 500ms both";

    lookedAtForgoneOption = 1;


    if (outcomeRisky == "0") {
        text0Left.style.animation = "showTextLeft 500ms both";
    } else if (outcomeRisky == "-60") {
        text60LoseLeft.style.animation = "showTextLeft 500ms both";
    } else if (outcomeRisky == "+60") {
        text60WinLeft.style.animation = "showTextLeft 500ms both";
    } else if (outcomeRisky == "-20") {
        text20LoseLeft.style.animation = "showTextLeft 500ms both";
    } else if (outcomeRisky == "+20") {
        text20WinLeft.style.animation = "showTextLeft 500ms both";
    }

}


function resetSafeRightCard() {

    cardRiskyLeft.removeEventListener("click", showForgoneOptionSafeRight);

    if (numTrial < listTrials.length - 1) {
        NextTrialChosenSafeRight.removeEventListener("click", resetSafeRightCard);
        NextTrialChosenSafeRight.addEventListener("animationend", hideNextTrialChosenSafeRight())
    } else if (numTrial == listTrials.length - 1) {
        LastTrialChosenSafeRight.removeEventListener("click", resetSafeRightCard);
        LastTrialChosenSafeRight.addEventListener("animationend", hideLastTrialChosenSafeRight())
    }

    cardSafeRight.style.animation = "resetSafeRightCard 1ms 1ms both";

    if (outcomeSafe == "0") {
        text0Right.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeSafe == "-30") {
        text30LoseRight.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeSafe == "+30") {
        text30WinRight.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeSafe == "-10") {
        text10LoseRight.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeSafe == "+10") {
        text10WinRight.style.animation = "resetRightText 1ms 1ms both";
    }


    currentEndowment = endowment;
    numTrial = numTrial + 1;

    context.clearRect(0, 0, 600, 170);

    lookedAtForgoneOption = 0;

    deckPosition = listDeckPositions[numTrial];


    if (numTrial < listTrials.length) {
        if (deckPosition == 0) {
            setTimeout(inTaskIntervalRiskyLeft, 500)
            setTimeout(inTaskIntervalSafeRight, 500)
        } else if (deckPosition == 1) {
            setTimeout(inTaskIntervalRiskyRight, 500)
            setTimeout(inTaskIntervalSafeLeft, 500)
        }
    }

    // End task
    if (numTrial == listTrials.length) {

        stack.style.animation = "hideStackConclusion 1ms 1ms both";

        lose60Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        lose20Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        risky0Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        win20Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        win60Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        lose30Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
        lose10Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
        safe0Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
        win10Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
        win30Right.style.animation = "hideSafeLabelRight 1ms 1ms both";

        context.clearRect(0, 0, 600, 170);
        contextCanvaRound.clearRect(0, 0, 500, 110);
        drawTextCanvaRound("The game is finished", 250, 50, 20, "Arial");
        drawText("Proceed to the next page, ", 250, 10, 20, "Arial");
        drawText("where the software will randomly select one round", 250, 40, 20, "Arial");
        drawText(" upon which to compute your bonus payment", 250, 70, 20, "Arial");

    }
}


function resetForgoneSafeRightCard() {

    if (numTrial < listTrials.length - 1) {
        forgoneNextTrialChosenSafeRight.removeEventListener("click", resetForgoneSafeRightCard);
        forgoneNextTrialChosenSafeRight.addEventListener("animationend", hideForgoneNextTrialChosenSafeRight())
    } else if (numTrial == listTrials.length - 1) {
        forgoneLastTrialChosenSafeRight.removeEventListener("click", resetForgoneSafeRightCard);
        forgoneLastTrialChosenSafeRight.addEventListener("animationend", hideForgoneLastTrialChosenSafeRight())
    }


    cardSafeRight.style.animation = "resetSafeRightCard 1ms 1ms both";
    cardRiskyLeft.style.animation = "resetRiskyLeftCard 1ms 1ms both";

    if (outcomeSafe == "0") {
        text0Right.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeSafe == "-30") {
        text30LoseRight.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeSafe == "+30") {
        text30WinRight.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeSafe == "-10") {
        text10LoseRight.style.animation = "resetRightText 1ms 1ms both";
    } else if (outcomeSafe == "+10") {
        text10WinRight.style.animation = "resetRightText 1ms 1ms both";
    }

    if (outcomeRisky == "0") {
        text0Left.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeRisky == "-60") {
        text60LoseLeft.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeRisky == "+60") {
        text60WinLeft.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeRisky == "-20") {
        text20LoseLeft.style.animation = "resetLeftText 1ms 1ms both";
    } else if (outcomeRisky == "+20") {
        text20WinLeft.style.animation = "resetLeftText 1ms 1ms both";
    }

    currentEndowment = endowment;
    numTrial = numTrial + 1;

    context.clearRect(0, 0, 600, 170);

    lookedAtForgoneOption = 0;

    deckPosition = listDeckPositions[numTrial];

    if (numTrial < listTrials.length) {
        if (deckPosition == 0) {
            setTimeout(inTaskIntervalRiskyLeft, 500)
            setTimeout(inTaskIntervalSafeRight, 500)
        } else if (deckPosition == 1) {
            setTimeout(inTaskIntervalRiskyRight, 500)
            setTimeout(inTaskIntervalSafeLeft, 500)
        }
    }


    // End task
    if (numTrial == listTrials.length) {

        stack.style.animation = "hideStackConclusion 1ms 1ms both";

        lose60Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        lose20Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        risky0Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        win20Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        win60Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
        lose30Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
        lose10Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
        safe0Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
        win10Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
        win30Right.style.animation = "hideSafeLabelRight 1ms 1ms both";

        context.clearRect(0, 0, 600, 170);
        contextCanvaRound.clearRect(0, 0, 500, 110);
        drawTextCanvaRound("The game is finished", 250, 50, 20, "Arial");
        drawText("Proceed to the next page, ", 250, 10, 20, "Arial");
        drawText("where the software will randomly select one round", 250, 40, 20, "Arial");
        drawText(" upon which to compute your bonus payment", 250, 70, 20, "Arial");
    }
}



//------------ START ------------//

// Hide next button


if (deckPosition == 0) {
    cardDeckRiskyLeft.style.animation = "showRiskyLeftCardDeck 1ms 1ms both";
    cardRiskyLeft.style.animation = "showRiskyLeftCard 1ms 1ms both";
    lose60Left.style.animation = "showRiskyLabelLeft 1ms 1ms both";
    lose20Left.style.animation = "showRiskyLabelLeft 1ms 1ms both";
    risky0Left.style.animation = "showRiskyLabelLeft 1ms 1ms both";
    win20Left.style.animation = "showRiskyLabelLeft 1ms 1ms both";
    win60Left.style.animation = "showRiskyLabelLeft 1ms 1ms both";

    cardDeckRiskyRight.style.animation = "hideRiskyRightCardDeck 1ms 1ms both";
    cardRiskyRight.style.animation = "hideRiskyRightCard 1ms 1ms both";
    lose60Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
    lose20Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
    risky0Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
    win20Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";
    win60Right.style.animation = "hideRiskyLabelRight 1ms 1ms both";


    cardDeckSafeLeft.style.animation = "hideSafeLeftCardDeck 1ms 1ms both";
    cardSafeLeft.style.animation = "hideSafeLeftCard 1ms 1ms both";
    lose30Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
    lose10Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
    safe0Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
    win10Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";
    win30Left.style.animation = "hideSafeLabelLeft 1ms 1ms both";

    cardDeckSafeRight.style.animation = "showSafeRightCardDeck 1ms 1ms both";
    cardSafeRight.style.animation = "showSafeRightCard 1ms 1ms both";
    lose30Right.style.animation = "showSafeLabelRight 1ms 1ms both";
    lose10Right.style.animation = "showSafeLabelRight 1ms 1ms both";
    safe0Right.style.animation = "showSafeLabelRight 1ms 1ms both";
    win10Right.style.animation = "showSafeLabelRight 1ms 1ms both";
    win30Right.style.animation = "showSafeLabelRight 1ms 1ms both";

    intervalRiskyLeft = setInterval(shuffleRiskyLeft, 800)
    intervalSafeRight = setInterval(shuffleSafeRight, 800)

} else if (deckPosition == 1) {
    cardDeckRiskyRight.style.animation = "showRiskyRightCardDeck 1ms 1ms both";
    cardRiskyRight.style.animation = "showRiskyRightCard 1ms 1ms both";
    lose60Right.style.animation = "showRiskyLabelRight 1ms 1ms both";
    lose20Right.style.animation = "showRiskyLabelRight 1ms 1ms both";
    risky0Right.style.animation = "showRiskyLabelRight 1ms 1ms both";
    win20Right.style.animation = "showRiskyLabelRight 1ms 1ms both";
    win60Right.style.animation = "showRiskyLabelRight 1ms 1ms both";

    cardDeckRiskyLeft.style.animation = "hideRiskyLeftCardDeck 1ms 1ms both";
    cardRiskyLeft.style.animation = "hideRiskyLeftCard 1ms 1ms both";
    lose60Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
    lose20Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
    risky0Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
    win20Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";
    win60Left.style.animation = "hideRiskyLabelLeft 1ms 1ms both";


    cardDeckSafeLeft.style.animation = "showSafeLeftCardDeck 1ms 1ms both";
    cardSafeLeft.style.animation = "showSafeLeftCard 1ms 1ms both";
    lose30Left.style.animation = "showSafeLabelLeft 1ms 1ms both";
    lose10Left.style.animation = "showSafeLabelLeft 1ms 1ms both";
    safe0Left.style.animation = "showSafeLabelLeft 1ms 1ms both";
    win10Left.style.animation = "showSafeLabelLeft 1ms 1ms both";
    win30Left.style.animation = "showSafeLabelLeft 1ms 1ms both";

    cardDeckSafeRight.style.animation = "hideSafeRightCardDeck 1ms 1ms both";
    cardSafeRight.style.animation = "hideSafeRightCard 1ms 1ms both";
    lose30Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
    lose10Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
    safe0Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
    win10Right.style.animation = "hideSafeLabelRight 1ms 1ms both";
    win30Right.style.animation = "hideSafeLabelRight 1ms 1ms both";

    intervalRiskyRight = setInterval(shuffleRiskyRight, 800)
    intervalSafeLeft = setInterval(shuffleSafeLeft, 800)

}