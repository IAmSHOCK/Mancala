// Get the modal
const modalLogin = document.getElementById("modalLogin");
const modalRegras = document.getElementById("modalRegras");
const modalClass = document.getElementById("modalClass");
const modalConfig = document.getElementById("modalConfig");

// Get the button that opens the modal
const btnLogin = document.getElementById("btnLogin");
const btnRegras = document.getElementById("btnRegras");
const btnClass = document.getElementById("btnClass");
const btnConfig = document.getElementById("btnConfig");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close");

// When the user clicks the button, open the modal 
btnLogin.onclick = function() {
  modalLogin.style.display = "block";
}

btnRegras.onclick = function() {
  modalRegras.style.display = "block";
}

btnClass.onclick = function() {
  modalClass.style.display = "block";
}

btnConfig.onclick = function() {
  modalConfig.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
for(let i = 0; i < span.length; i++){
  span[i].onclick = function() {
    modalLogin.style.display = "none";
    modalRegras.style.display = "none";
    modalClass.style.display = "none";
    modalConfig.style.display = "none";
  }
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  switch(event.target.className){
    case 'modal': event.target.style.display = "none"; break;
    /*
    case 'modalLogin': modalLogin.style.display = "none"; break;
    case 'modalRegras': modalRegras.style.display = "none"; break;
    case 'modalClass': modalClass.style.display = "none"; break;
    case 'modalConfig': modalConfig.style.display = "none"; break;
  */}
}

window.onload = function(){
  box = document.getElementsByClassName("box");
  board = new GameBoard(3,4);
}

class Box{
  constructor(board, pos){
    this.box = document.createElement("div");
    this.box.className= "box";
    this.lineTop = document.createElement("div");
    this.lineTop.className="lineTop";
    this.lineTop.append(this.box);
    let line;
    if(pos == "top"){
      line = board.querySelector(".line-top");
    }
    else{
      line = board.querySelector(".line-bot");  
    }
    line.append(this.lineTop);
    this.seeds = [];
    this.counter = new Counter(this.lineTop);
  }
  
  push(seed){
    let lastEmpty = length(seeds-1);
    this.seeds[lastEmpty] = seed;
    this.counter.increment();
  }

  
}

class GameBoard{
  constructor(nboxs, yseeds){
    this.board = document.querySelector(".game-board");
    this.boxs = [];
    nboxs *= 2; //nboxs is the number of boxes in one line
    for(let i = 0; i < nboxs-1; i++){
      let boxTop = new Box(this.board, "top");
      let boxBot = new Box(this.board, "bot");
      for(let j = 0; j < yseeds; j++){
        let seedTop = new Seed(boxTop);
        let seedBot = new Seed(boxBot);
      }
      this.boxs[i++] = boxTop;
      this.boxs[i] = boxBot;
    }
  }

  pushSeed(seed, box){
    box.push(seed);
  }
}

class Seed{
  constructor(parentBox){
    this.seed = document.createElement("div");
    this.seed.className= "seed";
    parentBox.box.append(this.seed);   
    this.randomPos(this.seed); 
  }

  randomPos(){
    let percentage = 0.05;
    let posInfo = this.seed.parentElement.getBoundingClientRect();
    let height = posInfo.height;
    let width = posInfo.width;
    let top = posInfo.top;
    let left = posInfo.left;
    console.log(top);
    console.log(left);
    const getRandom = (min, max) => Math.floor(Math.random()*(max-min)+min);
    top += getRandom(height*percentage, height*(1-percentage));
    left += getRandom(width*percentage, width*(1-percentage));
    // console.log("top = " + top);
    // console.log("left = " + left);
    this.seed.style.top+=top+"px";
    this.seed.style.left+= left+"px";
  }
}

class Counter{
  constructor(parentBox){
    this.seeds = 0;
    this.counter = document.createElement("div");
    this.counter.className= "counter";
    parentBox.append(this.counter);   
  }
  increment(){
    this.seeds++;
  }

  reset(){
    this.seeds = 0;
  }
}