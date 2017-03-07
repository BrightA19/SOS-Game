(function () {
  
  // Initialize variables
  var cvs = null;         // Canvas variable
  var ctx = null;         // Context of canvas
  var mouse = [];         // [x, y, mousedown(true/false)]
  var mouseP = false;     // Previous state of mousedown
  var frame = 0;          // Frames (used at specific times)
  var turn = 0;           // Whose turn is it?
  var turnP = 1;          // Previous state of turn variable
  var player = [{},{}];   // Two players
  var data = [];          // Contains [x, y, ("S" or "O"), color] arrays
  var boxExists = false;  // If there already is an "S" or "O"
  var goAgain = false;    // If they scored, they get to go again
  
  function init() {
    
    // Set cvs and ctx variables
    cvs = document.getElementById("c");
    ctx = cvs.getContext("2d");
    
    // Add mousedown event listener to modify mouse variable (puts coords)
    cvs.addEventListener("mousedown", function (e) {
      mouse = [
        true, // Mouse down
        e.clientX - cvs.offsetLeft,
        e.clientY - cvs.offsetTop
      ];
      
    });
    
    // Add mouseup event listener to modify mouse variable (clears coords)
    cvs.addEventListener("mouseup", function (e) {
      mouse = [
        false, // Mouse up
        0,
        0
      ];
    });
    
    // Set properties for players
    for (var i in player) {
      var I = Number(i);
      player[i].name = "Player " + (I+1);
      player[i].score = 0;
      player[i].color = (I) ? "red" : "blue";
      player[i].box = {x: 0, y: 0, letter: null, color: null};
      player[i].lineDir = [];
    }
    
    
    
    // Start game loop
    start();
    
  }
  
  function start() {
  
    var x, y, i;
    
    // Clear screen
    ctx.clearRect(0, 0, 500, 500);
    
    // Create background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 500, 500);
    
    // Create lines
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    for (x = 0; x < 10; x++) {
      ctx.beginPath();
      ctx.moveTo((x+0.5)*50, 0);
      ctx.lineTo((x+0.5)*50, 500);
      ctx.closePath();
      ctx.stroke();
    }
    for (x = 0; x < 10; x++) {
      ctx.beginPath();
      ctx.moveTo(0, (x+0.5)*50);
      ctx.lineTo(500, (x+0.5)*50);
      ctx.closePath();
      ctx.stroke();
    }
    
    // Show Player Names
    ctx.fillRect(0, 0, 500, 24);
    ctx.font = "15px Arial";
    for (x in player) {
      i = (Number(x)) ? 490 : 10;
      ctx.textAlign = (Number(x)) ? "right" : "left";
      ctx.fillStyle = player[x].color;
      ctx.fillText(player[x].name, i, 15);
    }
    
    // Show Player Scores
    ctx.textAlign = "center";
    ctx.fillStyle = "#000000";
    ctx.fillText(player[0].score + "  -  " + player[1].score, 250, 15);
    
    // Whose turn is it?
    x = (turn) ? 250 : 0;
    ctx.fillStyle = player[turn].color;
    ctx.fillRect(x, 21, 250, 3);
    
    
    // If NOT zero, increase
    if (frame) frame++;
    
    // Determine box clicked in, and if double clicked
    for (x = 0; x < 9; x++) {
      for (var i = 0; i < 9; i++) {
        
        var box = {x: (25+(x*50)), y: (25+(i*50))}; // w=50, h=50
        box.color = player[turn].color;
        
        // Detect the box that was clicked in
        if (
          mouse[0] && !mouseP &&
          mouse[1] > box.x && mouse[1] < (box.x)+50 &&
          mouse[2] > box.y && mouse[2] < (box.y)+50
          ) {
          
          // Determines if second click was made on same box (double clicked)
          if (
            player[turn].box.x == box.x &&
            player[turn].box.y == box.y
          ) {
            // Two Clicks = O
            box.letter = "O";
            player[turn].box = box;
          }
          else {
            // One Click = S
            box.letter = "S";
            player[turn].box = box;
            frame = 1;
          }
          
        }
        
      }
    }
    
    // Players have 30 frames to click a second time before it is official
    if (frame == 30) {
      
      // Box is pushed in data array
      for (x in data) {
        if (
          data[x].x == player[turn].box.x &&
          data[x].y == player[turn].box.y
          ) {
            boxExists = true;
            break;
        }
      }
      
      // Check for S O S
      if (!boxExists) checkSOS(player[turn]);
      
      if (!boxExists) {
        
        data.push({
          x: player[turn].box.x,
          y: player[turn].box.y,
          letter: player[turn].box.letter,
          color: player[turn].box.color
        });
        
        player[turn].box.x = 0;
        player[turn].box.y = 0;
        player[turn].box.letter = null;
        
        // Switch turns
        if (!goAgain) {
          turn = (turn) ? 0 : 1;
        }
        else goAgain = false;
        
        // Match background color to player's turn 
        if (turn) document.body.style.background = "#FDD";
        else document.body.style.background = "#DDF";
        
      }
      else {
        console.info("Choose another!");
        
        player[turn].box.x = 0;
        player[turn].box.y = 0;
        player[turn].box.letter = null;
        
        boxExists = false;
      }
      
      // Will not increase anymore if set to zero
      frame = 0;
    }
  
    
    // Draw S and O in their boxes
    for (x in data) {
      ctx.fillStyle = data[x].color;
      ctx.textAlign = "center";
      ctx.font = "40px 'Comic Sans MS'";
      ctx.fillText(data[x].letter, data[x].x + 25, data[x].y + 40);
    }
    // Draw lines
    for (x in player) {
      for (y in player[x].lineDir) {
        
        ctx.strokeStyle = player[x].color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        
        for (i in player[x].lineDir[y].dir) {
          switch (player[x].lineDir[y].dir[i]) {
            
            case 1:
              ctx.moveTo(player[x].lineDir[y].box.x+25, player[x].lineDir[y].box.y+25);
              ctx.lineTo(player[x].lineDir[y].box.x+25, player[x].lineDir[y].box.y+125);
              break;
            case 2:
              ctx.moveTo(player[x].lineDir[y].box.x+25, player[x].lineDir[y].box.y+25);
              ctx.lineTo(player[x].lineDir[y].box.x-75, player[x].lineDir[y].box.y+125);
              break;
            case 3:
              ctx.moveTo(player[x].lineDir[y].box.x+25, player[x].lineDir[y].box.y+25);
              ctx.lineTo(player[x].lineDir[y].box.x-75, player[x].lineDir[y].box.y+25);
              break;
            case 4:
              ctx.moveTo(player[x].lineDir[y].box.x+25, player[x].lineDir[y].box.y+25);
              ctx.lineTo(player[x].lineDir[y].box.x-75, player[x].lineDir[y].box.y-75);
              break;
            case 5:
              ctx.moveTo(player[x].lineDir[y].box.x+25, player[x].lineDir[y].box.y+25);
              ctx.lineTo(player[x].lineDir[y].box.x+25, player[x].lineDir[y].box.y-75);
              break;
            case 6:
              ctx.moveTo(player[x].lineDir[y].box.x+25, player[x].lineDir[y].box.y+25);
              ctx.lineTo(player[x].lineDir[y].box.x+125, player[x].lineDir[y].box.y-75);
              break;
            case 7:
              ctx.moveTo(player[x].lineDir[y].box.x+25, player[x].lineDir[y].box.y+25);
              ctx.lineTo(player[x].lineDir[y].box.x+125, player[x].lineDir[y].box.y+25);
              break;
            case 8:
              ctx.moveTo(player[x].lineDir[y].box.x+25, player[x].lineDir[y].box.y+25);
              ctx.lineTo(player[x].lineDir[y].box.x+125, player[x].lineDir[y].box.y+125);
              break;
            case 9:
              ctx.moveTo(player[x].lineDir[y].box.x+25, player[x].lineDir[y].box.y-25);
              ctx.lineTo(player[x].lineDir[y].box.x+25, player[x].lineDir[y].box.y+75);
              break;
            case 10:
              ctx.moveTo(player[x].lineDir[y].box.x-25, player[x].lineDir[y].box.y+25);
              ctx.lineTo(player[x].lineDir[y].box.x+75, player[x].lineDir[y].box.y+25);
              break;
            case 11:
              ctx.moveTo(player[x].lineDir[y].box.x-25, player[x].lineDir[y].box.y-25);
              ctx.lineTo(player[x].lineDir[y].box.x+75, player[x].lineDir[y].box.y+75);
              break;
            case 12:
              ctx.moveTo(player[x].lineDir[y].box.x-25, player[x].lineDir[y].box.y+75);
              ctx.lineTo(player[x].lineDir[y].box.x+75, player[x].lineDir[y].box.y-25);
              break;
              
          }
        }
        
        ctx.closePath();
        ctx.stroke();
      }
    }
    
    
    // Set the previous mouse state to mouseP
    mouseP = mouse[0];
    
    // Request animation frame (this makes the function loop)
    window.requestAnimationFrame(start);
    
  }
  
  function checkSOS(player) {
    
    var x, y;
    var lineData = {box: {x: player.box.x, y: player.box.y}, dir: []};
    
    if (player.box.letter == "S") {
      
      for (x in data) {
        
        // Up (1)
        if (
          data[x].letter == "O" &&
          player.box.x == data[x].x &&
          player.box.y == data[x].y-50
        ) {
          for (y in data) {
            if (
              data[y].letter == "S" &&
              player.box.x == data[y].x &&
              player.box.y == data[y].y-100
            ) {
              player.score++;
              console.log("SOS 1");
              lineData.dir.push(1);
              player.lineDir.push(lineData);
              goAgain = true;
            }
          }
        }
        
        // Up-Right (2)
        if (
          data[x].letter == "O" &&
          player.box.x == data[x].x+50 &&
          player.box.y == data[x].y-50
        ) {
          for (y in data) {
            if (
              data[y].letter == "S" &&
              player.box.x == data[y].x+100 &&
              player.box.y == data[y].y-100
            ) {
              player.score++;
              console.log("SOS 2");
              lineData.dir.push(2);
              player.lineDir.push(lineData);
              goAgain = true;
            }
          }
        }
        
        // Right (3)
        if (
          data[x].letter == "O" &&
          player.box.x == data[x].x+50 &&
          player.box.y == data[x].y
        ) {
          for (y in data) {
            if (
              data[y].letter == "S" &&
              player.box.x == data[y].x+100 &&
              player.box.y == data[y].y
            ) {
              player.score++;
              console.log("SOS 3");
              lineData.dir.push(3);
              player.lineDir.push(lineData);
              goAgain = true;
            }
          }
        }
        
        // Down-Right (4)
        if (
          data[x].letter == "O" &&
          player.box.x == data[x].x+50 &&
          player.box.y == data[x].y+50
        ) {
          for (y in data) {
            if (
              data[y].letter == "S" &&
              player.box.x == data[y].x+100 &&
              player.box.y == data[y].y+100
            ) {
              player.score++;
              console.log("SOS 4");
              lineData.dir.push(4);
              player.lineDir.push(lineData);
              goAgain = true;
            }
          }
        }
        
        // Down (5)
        if (
          data[x].letter == "O" &&
          player.box.x == data[x].x &&
          player.box.y == data[x].y+50
        ) {
          for (y in data) {
            if (
              data[y].letter == "S" &&
              player.box.x == data[y].x &&
              player.box.y == data[y].y+100
            ) {
              player.score++;
              console.log("SOS 5");
              lineData.dir.push(5);
              player.lineDir.push(lineData);
              goAgain = true;
            }
          }
        }
        
        // Down-Left (6)
        if (
          data[x].letter == "O" &&
          player.box.x == data[x].x-50 &&
          player.box.y == data[x].y+50
        ) {
          for (y in data) {
            if (
              data[y].letter == "S" &&
              player.box.x == data[y].x-100 &&
              player.box.y == data[y].y+100
            ) {
              player.score++;
              console.log("SOS 6");
              lineData.dir.push(6);
              player.lineDir.push(lineData);
              goAgain = true;
            }
          }
        }
        
        // Left (7)
        if (
          data[x].letter == "O" &&
          player.box.x == data[x].x-50 &&
          player.box.y == data[x].y
        ) {
          for (y in data) {
            if (
              data[y].letter == "S" &&
              player.box.x == data[y].x-100 &&
              player.box.y == data[y].y
            ) {
              player.score++;
              console.log("SOS 7");
              lineData.dir.push(7);
              player.lineDir.push(lineData);
              goAgain = true;
            }
          }
        }
        
        // Up-Left (8)
        if (
          data[x].letter == "O" &&
          player.box.x == data[x].x-50 &&
          player.box.y == data[x].y-50
        ) {
          for (y in data) {
            if (
              data[y].letter == "S" &&
              player.box.x == data[y].x-100 &&
              player.box.y == data[y].y-100
            ) {
              player.score++;
              console.log("SOS 8");
              lineData.dir.push(8);
              player.lineDir.push(lineData);
              goAgain = true;
            }
          }
        }
        
      }
    }
    else if (player.box.letter == "O") {
      
      for (x in data) {
        
        // Vertical (9)
        if (
          data[x].letter == "S" &&
          player.box.x == data[x].x &&
          player.box.y == data[x].y-50
        ) {
          for (y in data) {
            if (
              data[y].letter == "S" &&
              player.box.x == data[y].x &&
              player.box.y == data[y].y+50
            ) {
              player.score++;
              console.log("SOS 9");
              lineData.dir.push(9);
              player.lineDir.push(lineData);
              goAgain = true;
            }
          }
        }
        
        // Horizontal (10)
        if (
          data[x].letter == "S" &&
          player.box.x == data[x].x-50 &&
          player.box.y == data[x].y
        ) {
          for (y in data) {
            if (
              data[y].letter == "S" &&
              player.box.x == data[y].x+50 &&
              player.box.y == data[y].y
            ) {
              player.score++;
              console.log("SOS 10");
              lineData.dir.push(10);
              player.lineDir.push(lineData);
              goAgain = true;
            }
          }
        }
        
        // Decreasing-Diagonal (11)
        if (
          data[x].letter == "S" &&
          player.box.x == data[x].x-50 &&
          player.box.y == data[x].y-50
        ) {
          for (y in data) {
            if (
              data[y].letter == "S" &&
              player.box.x == data[y].x+50 &&
              player.box.y == data[y].y+50
            ) {
              player.score++;
              console.log("SOS 11");
              lineData.dir.push(11);
              player.lineDir.push(lineData);
              goAgain = true;
            }
          }
        }
        
        // Increasing-Diagonal (12)
        if (
          data[x].letter == "S" &&
          player.box.x == data[x].x-50 &&
          player.box.y == data[x].y+50
        ) {
          for (y in data) {
            if (
              data[y].letter == "S" &&
              player.box.x == data[y].x+50 &&
              player.box.y == data[y].y-50
            ) {
              player.score++;
              console.log("SOS 12");
              lineData.dir.push(12);
              player.lineDir.push(lineData);
              goAgain = true;
            }
          }
        }
        
      }
    }
    
  }
  
  init();
  
  
})();
