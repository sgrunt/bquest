var usedGroups = []; //global

function generateCards(boardType, hard = false){
    usedGroups = [];

    var baseObjectiveData = hard ? objectiveDataHard : objectiveData;

    var objectiveDataByDifficulty = Array(9)
        .fill()
	.map((element, index) => baseObjectiveData.filter(e => e.difficulty == index + 1) );

    var houseDifficulty = hard
    ? [ 
        5, 9, 0, 9, 5, //rank 9
        7, 8, 9, 8, 7, //rank 8
        6, 7, 8, 7, 6, //rank 7
        5, 6, 7, 6, 5, //rank 6
        4, 5, 6, 5, 4, //rank 5
        3, 4, 5, 4, 3, //rank 4
        2, 3, 4, 3, 2, //rank 3
        1, 2, 3, 2, 1, //rank 2
        0, 1, 0, 1, 0  //rank 1
    ]
    : [
        3, 4, 0, 4, 3, //rank 9
        3, 3, 4, 3, 3, //rank 8
        3, 3, 3, 3, 3, //rank 7
        2, 3, 3, 3, 2, //rank 6
        2, 2, 3, 2, 2, //rank 5
        2, 2, 2, 2, 2, //rank 4
        1, 2, 2, 2, 1, //rank 3
        1, 1, 2, 1, 1, //rank 2
        0, 1, 0, 1, 0  //rank 1
    ];

    var newBoard = [];
    newBoard[40] = "Open West Gate";
    newBoard[42] = "START";
    newBoard[44] = "Open Orchard Gate";
    newBoard[2] = "GOAL";

    var randomOrder = [];
    for (var i = 0; i < 45; i++) randomOrder.push(i);
    randomOrder = shuffle(randomOrder);

    //bring vhard squares to front
    randomOrder.splice(randomOrder.indexOf(1), 1);
    randomOrder.splice(randomOrder.indexOf(3), 1);
    randomOrder.splice(randomOrder.indexOf(7), 1);
    randomOrder.unshift(7, 1, 3);

    for (let j = 0; j < 45; j++) {
        const currentSquare = randomOrder[j];
        currentDifficulty = houseDifficulty[currentSquare];
	if (currentDifficulty > 0)
	    newBoard[currentSquare] = drawCard(objectiveDataByDifficulty[currentDifficulty - 1])
    }

    if(boardType == "bingosync"){
        var rank10 = ["N/A", "N/A", "N/A", "N/A", "N/A"];  
        var board1 = newBoard.slice(20)
        var board2 = rank10.concat(newBoard.slice(0, 20));

        var output1 = makeBingoSyncCard(board1);
        var output2 = makeBingoSyncCard(board2);
        var output = [output1, output2];
    }
    else if(boardType == "bquest"){
        var output = makeBingoSyncCard(newBoard);
    }

    return output;
}

function drawCard(stack){
    var randomSpot = Math.floor(Math.random() * stack.length);
    var selectedCard = stack[randomSpot];
    stack.splice(randomSpot, 1);

    if(selectedCard.group != null){
        var group = selectedCard.group;
        if(usedGroups.find(x => x == group) != null){
            return drawCard(stack);
        }
        usedGroups.push(group);
    }

    return selectedCard.name;
}

function makeBingoSyncCard(stack){
    var tempArray = [];

    stack.forEach(x => {
        var tempSquare = '{"name": "' + x + '"}';
        tempArray.push(tempSquare);
    });
    
    var output = '[';
    output = output + tempArray.join(",");
    output = output + ']';
    
    return output;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
