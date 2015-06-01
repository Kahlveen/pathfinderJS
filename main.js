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
    var circlePos = {x:1.5 * cellWidth,y:1.5 * cellWidth, r: 15};
    var circleDelta = {x:0, y:0};
    var circleNextGrid = {x: 1, y: 2};
    var frameRate = 60;
    var moveRate = frameRate / 2;
        
    canvas.addEventListener('mousedown', function(e) 
    {
        var rect = canvas.getBoundingClientRect();
        
        mouseGridPos.x = Math.floor((e.pageX - rect.left) / cellWidth);
        mouseGridPos.y = Math.floor((e.pageY - rect.top)/ cellWidth);
        
        //If mouse position lies within freeSpace
        if(wall[mouseGridPos.y][mouseGridPos.x] == 0)
        {
            goalPos.x = mouseGridPos.x;
            goalPos.y = mouseGridPos.y;
                
            if(((goalPos.x+0.5) * cellWidth - circlePos.x) > 0)
                circleDelta.x = 5;
            else if (((goalPos.x+0.5) * cellWidth - circlePos.x) < 0)
                circleDelta.x = -5;
            else 
                circleDelta.x = 0;
            
            if(((goalPos.y+0.5) * cellWidth - circlePos.y) > 0)
                circleDelta.y = 5;
            else if (((goalPos.y+0.5) * cellWidth - circlePos.y) < 0)
                circleDelta.y = -5;
            else 
                circleDelta.y = 0;
        }      
    
    }, false);
    
    function DrawCircle()
    {
        ctx.beginPath();
        ctx.arc(circlePos.x,circlePos.y,circlePos.r,0,2*Math.PI);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();        
    }
    
    function MoveCircle()
    {
        if (Math.floor(circlePos.x - ((goalPos.x+0.5) * cellWidth)) != 0)
            circlePos.x += circleDelta.x;

        if (Math.floor(circlePos.y - ((goalPos.y+0.5) * cellWidth)) != 0)
            circlePos.y += circleDelta.y;          
    }
    
    function DrawGoalBox()
    {
        ctx.fillStyle = "pink";
        ctx.fillRect(goalPos.x*cellWidth,goalPos.y*cellWidth,cellWidth,cellWidth);
        ctx.strokeStyle = "white";
        ctx.strokeRect(goalPos.x*cellWidth,goalPos.y*cellWidth,cellWidth,cellWidth);
    }
    
    function ComputeWallLocation()
    {
        for (var row = 0; row < wall.length; row++)
        {
            for (var col = 0; col < wall[row].length; col++)
            {
                if(wall[row][col] == 1)
                    wallLocation.push({x: col*cellWidth, y: row*cellWidth});  
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
		game_loop = setInterval(main, frameRate);

    }
    
    function main()
    {
        RefreshCanvas();
        DrawWall();
        DrawGoalBox();
        MoveCircle();
        DrawCircle();        
        DisplayMousePosition();
    }
    
    Init();

})