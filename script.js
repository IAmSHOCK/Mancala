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
  switch(event.target.id){
    case 'modalLogin':
      modalLogin.style.display = "none";
      break;
    case 'modalRegras':
      modalRegras.style.display = "none";
      break;
    case 'modalClass':
      modalClass.style.display = "none";
      break;
    case 'modalConfig':
      modalConfig.style.display = "none";
      game.updateGameBoard();
      break;
  }
}

window.onload = function(){
  window.game = new GameBoard(3,4);
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
    let lastEmpty = (length(seeds) == 0) ? 0: length(seeds-1);
    this.seeds[lastEmpty] = seed;
    this.counter.increment();
  }

  remove(){

  }
}

class GameBoard{
  constructor(nboxs, yseeds){
    this.board = document.querySelector(".game-board");
    this.boxs = [];
    for(let i = 0; i < nboxs; i++){
      this.addBoxs();
    }

    for(let i = 0; i < this.boxs.length; i++){
      for (let j = 0; j < yseeds; j++) {
        new Seed(this.boxs[i]);          
      }
    }
  }

  updateGameBoard(){
    let select = document.getElementById("Cavidades");
    let cavidades = select.options[select.selectedIndex].value;
    select = document.getElementById("Sementes");
    let seeds = select.options[select.selectedIndex].value;
    this.removeAll();
    for(let i = 0; i < cavidades; i++){
      this.addBoxs();
    }

    for(let i = 0; i < this.boxs.length; i++){
      for (let j = 0; j < seeds; j++) {
        new Seed(this.boxs[i]);          
      }
    }

    let warehouse = document.getElementById("warehouse1");
    warehouse[0]  
  }

  addBoxs(){
    let boxTop = new Box(this.board, "top");
    let boxBot = new Box(this.board, "bot");
    let i = this.boxs.length;
    if(i != 0){
        this.boxs[i++] = boxTop;
      this.boxs[i++ ] = boxBot;
    }
    else{
      this.boxs[0] = boxTop;
      this.boxs[1] = boxBot;
    }
  }

  removeAll(){
    var elements = document.getElementsByClassName("box");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }

    elements = document.getElementsByClassName("counter");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
  }
}

class Seed{
  constructor(parentBox){
    this.seed = document.createElement("div");
    this.seed.className= "seed";
    parentBox.box.append(this.seed);   
    parentBox.counter.increment();
    this.randomPos();
  }

  randomPos(){
    let percentage = 0.15;
    let posInfo = this.seed.parentElement.getBoundingClientRect();
    let height = posInfo.height;
    let width = posInfo.width;
    let top = posInfo.top;
    let left = posInfo.left;
    // console.log("parent.top = " + top);
    // console.log("parent.left = " + left);
    const getRandom = (min, max) => Math.floor(Math.random()*(max-min)+min);
    top = getRandom(height*percentage, height*(1-percentage));
    left = getRandom(width*percentage, width*(1-percentage));
    // console.log("top = " + top);
    // console.log("left = " + left);
    this.seed.style.top= top+"px";
    this.seed.style.left= left+"px";
  }
}

class Counter{
  constructor(parentBox){
    this.seeds = 0;
    this.counter = document.createElement("div");
    this.counter.className= "counter";
    this.counter.innerHTML = this.seeds;
    parentBox.append(this.counter);   
  }

  increment(){
    this.seeds++;
    this.counter.innerHTML = this.seeds;
  }

  reset(){
    this.seeds = 0;
    this.counter.innerHTML = this.seeds;
  }
}