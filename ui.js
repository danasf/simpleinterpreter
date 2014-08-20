 window.addEventListener('load', function() {
  
    // eval input
    function evalInput(input) {
        var tokens = lexer(input);
        var tree = parse(tokens);
        var output = evaluate(tree);
        return output;
    };

    /* Background functions */
    function Background(canvas,radius) {
        this.canvas = document.getElementById(canvas);
        this.context = this.canvas.getContext('2d');
        this.rad = radius
    };

    Background.prototype.draw = function() {
        this.makeCircle(this.canvas.width/3,this.canvas.height/3,this.rad,"#E80C7A"); 
        this.makeCircle(2*this.canvas.width/3,2*this.canvas.height/3,this.rad,"#B0382F"); 
        this.makeCircle(this.canvas.width-this.rad,this.rad,this.rad,"#982E4B"); // tr
        document.getElementById("myBody").style.backgroundImage = "url('"+this.canvas.toDataURL()+"')";
    };


    Background.prototype.makeCircle = function(x,y,r,color) {
        this.context.beginPath();
        this.context.arc(x, y, r, 0, 2 * Math.PI, false);
        this.context.fillStyle = color;
        this.context.fill();
        this.context.closePath();
    };

    // basic setup

    bg = new Background("bgcanvas",30);
    bg.draw();

    var codeToParse = document.getElementById("codeToParse");

    document.getElementById("parse").addEventListener('click',function(e){
        document.getElementById("responseData").innerHTML = evalInput(codeToParse.value).split('\n').join('<br />');
    },false);

});
