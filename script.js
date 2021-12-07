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
  board = new GameBoard();
  for(let i  = 0; i < box.length; i++){
    seed = new Seed(box[i]);
    board.pushSeed(seed);
  }
}
class Box{
  constructor(board){
    this.box = document.createElement("div");
    this.box.className= "box";
    board.board.append(this.box);
    this.seeds = [];
    this.counter = 0;
  }

  pushSeed(seed){
    this.seeds.push(seed);
    counter++;
  }
}

class GameBoard{
  constructor(){
    this.board = document.createElement("div");
    this.board.className= "game-board";
    this.boxs = [];
    for(let i = 0; i < 3; i++){
      box = new Box(this.board);
      for(let j = 0; j < 4; j++){
        seed = new Seed(box);
      }
      this.boxs[i] = box;
    }
  }
  
}

class Seed{
  constructor(parentBox){
    this.seed = document.createElement("div");
    this.seed.className= "seed";
    parentBox.box.append(this.seed);    
  }
  randomPos(p){

  }

}

class Counter{
  constructor(){

  }
}