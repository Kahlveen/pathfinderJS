$(document).ready(function () {

    //Canvas variables
    var canvas = $("#myCanvas")[0];
    var ctx = canvas.getContext("2d");
    var canvasWidth = $("#myCanvas").width();
    var canvasHeight = $("#myCanvas").height();

    //Wall variables
    var cellWidth = 50;
    var maxCells = canvasWidth / cellWidth;
    var wallLocation = [];
    var freeSpace = [];
    var goalPos = {x: 1, y: 1};
    var wall = [[1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 1, 1, 1, 0, 1],
                [1, 0, 1, 0, 1, 0, 0, 1],
                [1, 0, 1, 0, 1, 1, 0, 1],
                [1, 0, 1, 0, 1, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1]];

    var mouseGridPos = {x:0, y:0};
    var circlePos = {x:1.5 * cellWidth,y:1.5 * cellWidth, r: 15, gridX: 1, gridY: 1};
    var circleDelta = {x:0, y:0};
    var circleNextGrid = {x: 1, y: 2};
    var timePerFrameMS = 30;
    var moveRate = 5;
    var gridValueCounter = 1;

    //Circle object
    var circle = {
        //For checking which grid circle is at
        gridX: 1,
        gridY: 1,
        destGridX: 1,
        destGridY: 1,

        //For drawing circle
        x: 1.5 * cellWidth,
        y: 1.5 * cellWidth,
        r: 15,

        //To compute how to move to next adjacent grid
        //Since it is moving to adjacent grid, only x or y will changed at any one time
        MoveToNextGrid: function()
        {
            if (this.destGridX > this.gridX)
                this.x += 5;
            else if (this.destGridX < this.gridX)
                this.x -= 5;

            if (this.destGridY > this.gridY)
                this.y += 5;
            else if (this.destGridY < this.gridY)
                this.y -= 5;

            //Check if circle has reached destGrid. If so, update this.gridX and this.gridY accordingly
            if (Math.floor(this.x - ((this.destGridX+0.5) * cellWidth)) == 0)
                this.gridX = this.destGridX;

            if (Math.floor(this.y - ((this.destGridY+0.5) * cellWidth)) == 0)
                this.gridY = this.destGridY;
        }
    }

    //For testing
    var adjacentFreeGrid = [];
    var tmpFreeGrid = [];

    canvas.addEventListener('mousedown', function(e)
    {
        var rect = canvas.getBoundingClientRect();

        mouseGridPos.x = Math.floor((e.pageX - rect.left) / cellWidth);
        mouseGridPos.y = Math.floor((e.pageY - rect.top)/ cellWidth);

        //If mouse position lies within freeSpace
        if(wall[mouseGridPos.y][mouseGridPos.x] == 0)
        {
            circle.destGridX = mouseGridPos.x;
            circle.destGridY = mouseGridPos.y;

            // //Given goalPos, assign values to the adjacent grids until


//            adjacentFreeGrid.push({x:1,y:2});
            //FindFreeGridsToCircle(goalPos.x, goalPos.y);
        }

    }, false);

    function FindAdjacentFreeGrid(gridX,gridY)
    {
        //Find adjacent free space
        var adjacentGrid = [{x: gridX - 1, y: gridY - 1},
                            {x: gridX - 1, y:  gridY},
                            {x: gridX - 1, y: gridY + 1},
                            {x: gridX, y: gridY - 1},
                            {x: gridX, y: gridY + 1},
                            {x: gridX + 1, y: gridY - 1},
                            {x: gridX + 1, y: gridY},
                            {x: gridX + 1, y: gridY + 1}];

        tmpFreeGrid = [];

        for (var i = 0; i < adjacentGrid.length; i++)
        {
            if(wall[adjacentGrid[i].y][adjacentGrid[i].x] == 0)
            {
                adjacentFreeGrid.push({x: adjacentGrid[i].x, y: adjacentGrid[i].y});
                tmpFreeGrid.push({x: adjacentGrid[i].x, y: adjacentGrid[i].y});
            }
        }

    }

    // function FindFreeGridsToCircle()
    // {
    //     //Check if goal grid is on circle grid
    //     while(((gridX+0.5) * cellWidth - circlePos.x) > 0)

    // }

    // function ComputeFreeGridValues()
    // {
    //     while((((goalPos.x+0.5) * cellWidth - circlePos.x) != 0))

    // }

    function DrawCircle(x,y,r)
    {
        ctx.beginPath();
        ctx.arc(x,y,r,0,2*Math.PI);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    function DrawGoalBox(x,y)
    {
        ctx.fillStyle = "pink";
        ctx.fillRect(x*cellWidth,y*cellWidth,cellWidth,cellWidth);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x*cellWidth,y*cellWidth,cellWidth,cellWidth);
    }

    function DrawAdjacentBox()
    {
        for(var i = 0; i < adjacentFreeGrid.length; i++)
        {
            ctx.fillStyle = "green";
            ctx.fillRect(adjacentFreeGrid[i].x*cellWidth,adjacentFreeGrid[i].y*cellWidth,cellWidth,cellWidth);
            ctx.strokeStyle = "white";
            ctx.strokeRect(adjacentFreeGrid[i].x*cellWidth,adjacentFreeGrid[i].y*cellWidth,cellWidth,cellWidth);
        }
    }

    function ComputeWallLocation()
    {
        for (var row = 0; row < wall.length; row++)
        {
            for (var col = 0; col < wall[row].length; col++)
            {
                if(wall[row][col] == 1)
                    wallLocation.push({x: col*cellWidth, y: row*cellWidth});

                else
                    freeSpace.push({x: col*cellWidth, y: row*cellWidth, gridValue: 0});
            }
        }
    }

    function RefreshCanvas()
    {
        //Refresh the canvas
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0,0,canvasWidth,canvasHeight);
    }

    function DrawWall()
    {
        for (var i = 0; i < wallLocation.length; i++)
        {
            ctx.fillStyle = "#BBB";
            ctx.fillRect(wallLocation[i].x,wallLocation[i].y,cellWidth,cellWidth);
            ctx.strokeStyle = "white";
            ctx.strokeRect(wallLocation[i].x,wallLocation[i].y,cellWidth,cellWidth);
        }
    }

    function DisplayMousePosition()
    {
        var mousePosText = "GoalX: " + goalPos.x + ", GoalY: " + goalPos.y +
                            " circleDeltaX: " + circleDelta.x + " circleDeltaY: " + circleDelta.y +
                            " circlePosX: " + circlePos.x + " circlePosY: " + circlePos.y;
        ctx.fillStyle = "black";
        ctx.fillText(mousePosText,5,canvasHeight-5);
    }

    function Init()
    {
        ComputeWallLocation();

        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(main, timePerFrameMS);

    }

    function main()
    {
        RefreshCanvas();
        DrawWall();
        DrawAdjacentBox();
        DrawGoalBox(circle.destGridX, circle.destGridY);
        circle.MoveToNextGrid();
        //MoveCircle();
        DrawCircle(circle.x,circle.y,circle.r);
        DisplayMousePosition();
    }

    Init();

})


// Given goal grid
// Find adjacent grids, assign value of 1 to them
// For grids of value 1, iterate through and find adjacent grids. assign value of 2 to them
// Repeat for all adjacent grids until grid reaches current circle grid