function Display(canvas) {
    
    this.cvs = canvas;
    var ctx = this.cvs.getContext("2d");
    
    this.update = function (data, players, turn) {
        var x, y, z;
        
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
        for (x in players) {
            y = (Number(x)) ? 490 : 10;
            ctx.textAlign = (Number(x)) ? "right" : "left";
            ctx.fillStyle = players[x].color;
            ctx.fillText(players[x].name, y, 15);
        }
    
        // Show Player Scores
        ctx.textAlign = "center";
        ctx.fillStyle = "#000000";
        ctx.fillText(players[0].score + "  -  " + players[1].score, 250, 15);
        
        // Whose turn is it?
        x = (turn) ? 250 : 0;
        ctx.fillStyle = players[turn].color;
        ctx.fillRect(x, 21, 250, 3);
        if (turn) document.body.style.background = "#FDD";
        else document.body.style.background = "#DDF";
        
        // Draw S and O in their boxes
        for (x in data) {
            ctx.fillStyle = data[x].color;
            ctx.textAlign = "center";
            ctx.font = "40px 'Comic Sans MS'";
            ctx.fillText(data[x].letter, data[x].x + 25, data[x].y + 40);
        }
        
        // Draw SOS lines
        for (x in players) {
          for (y in players[x].lineDir) {
            
            ctx.strokeStyle = players[x].color;
            ctx.lineWidth = 4;
            ctx.beginPath();
            
            for (z in players[x].lineDir[y].dir) {
                switch (players[x].lineDir[y].dir[z]) {
                
                case 1:
                    ctx.moveTo(players[x].lineDir[y].box.x+25, players[x].lineDir[y].box.y+25);
                    ctx.lineTo(players[x].lineDir[y].box.x+25, players[x].lineDir[y].box.y+125);
                    break;
                case 2:
                    ctx.moveTo(players[x].lineDir[y].box.x+25, players[x].lineDir[y].box.y+25);
                    ctx.lineTo(players[x].lineDir[y].box.x-75, players[x].lineDir[y].box.y+125);
                    break;
                case 3:
                    ctx.moveTo(players[x].lineDir[y].box.x+25, players[x].lineDir[y].box.y+25);
                    ctx.lineTo(players[x].lineDir[y].box.x-75, players[x].lineDir[y].box.y+25);
                    break;
                case 4:
                    ctx.moveTo(players[x].lineDir[y].box.x+25, players[x].lineDir[y].box.y+25);
                    ctx.lineTo(players[x].lineDir[y].box.x-75, players[x].lineDir[y].box.y-75);
                    break;
                case 5:
                    ctx.moveTo(players[x].lineDir[y].box.x+25, players[x].lineDir[y].box.y+25);
                    ctx.lineTo(players[x].lineDir[y].box.x+25, players[x].lineDir[y].box.y-75);
                    break;
                case 6:
                    ctx.moveTo(players[x].lineDir[y].box.x+25, players[x].lineDir[y].box.y+25);
                    ctx.lineTo(players[x].lineDir[y].box.x+125, players[x].lineDir[y].box.y-75);
                    break;
                case 7:
                    ctx.moveTo(players[x].lineDir[y].box.x+25, players[x].lineDir[y].box.y+25);
                    ctx.lineTo(players[x].lineDir[y].box.x+125, players[x].lineDir[y].box.y+25);
                  break;
                case 8:
                    ctx.moveTo(players[x].lineDir[y].box.x+25, players[x].lineDir[y].box.y+25);
                    ctx.lineTo(players[x].lineDir[y].box.x+125, players[x].lineDir[y].box.y+125);
                    break;
                case 9:
                    ctx.moveTo(players[x].lineDir[y].box.x+25, players[x].lineDir[y].box.y-25);
                    ctx.lineTo(players[x].lineDir[y].box.x+25, players[x].lineDir[y].box.y+75);
                    break;
                case 10:
                    ctx.moveTo(players[x].lineDir[y].box.x-25, players[x].lineDir[y].box.y+25);
                    ctx.lineTo(players[x].lineDir[y].box.x+75, players[x].lineDir[y].box.y+25);
                    break;
                case 11:
                    ctx.moveTo(players[x].lineDir[y].box.x-25, players[x].lineDir[y].box.y-25);
                    ctx.lineTo(players[x].lineDir[y].box.x+75, players[x].lineDir[y].box.y+75);
                    break;
                case 12:
                    ctx.moveTo(players[x].lineDir[y].box.x-25, players[x].lineDir[y].box.y+75);
                    ctx.lineTo(players[x].lineDir[y].box.x+75, players[x].lineDir[y].box.y-25);
                    break;
                  
                }
            }
            
            ctx.closePath();
            ctx.stroke();
            
          }
        }
        
    };
    
}
