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
btnLogin.onclick = function () {
  modalLogin.style.display = "block";
};

btnRegras.onclick = function () {
  modalRegras.style.display = "block";
};

btnClass.onclick = function () {
  modalClass.style.display = "block";
};

btnConfig.onclick = function () {
  modalConfig.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
for (let i = 0; i < span.length; i++) {
  span[i].onclick = function () {
    modalLogin.style.display = "none";
    modalRegras.style.display = "none";
    modalClass.style.display = "none";
    modalConfig.style.display = "none";
  };
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  switch (event.target.id) {
    case "modalLogin":
      modalLogin.style.display = "none";
      break;
    case "modalRegras":
      modalRegras.style.display = "none";
      break;
    case "modalClass":
      modalClass.style.display = "none";
      break;
    case "modalConfig":
      modalConfig.style.display = "none";
      game.updateGameBoard();
      break;
  }

  switch (event.target.className) {
    case "box":
      game.play(event.target);
      console.log(event.target);
  }
};

window.onload = function () {
  window.game = new GameBoard();
};

class Box {
  constructor(board, pos) {
    this.box = document.createElement("div");
    this.box.className = "box";
    this.lineTopBox = document.createElement("div");
    this.lineTopBox.className = "lineTopBox";
    this.lineTopBox.append(this.box);
    let line;
    if (pos == "top") {
      line = board.querySelector(".line-top");
    } else {
      line = board.querySelector(".line-bot");
    }
    line.append(this.lineTopBox);
    this.seeds = [];
    this.counter = new Counter(this.lineTopBox);
  }

  push(seed) {
    let lastEmpty = length(seeds) == 0 ? 0 : length(seeds - 1);
    this.seeds[lastEmpty] = seed;
    this.counter.increment();
  }

  remove() {
    let childs = this.box.children;
    this.box.removeChild(childs[0]);
    this.counter.reduction();
  }
}

class Warehouse {
  constructor(i) {
    let tmp = document.getElementsByClassName("warehouse");
    this.warehouse = tmp[i];
    // this.warehouse.className = "warehouse";
    // this.lineTop = document.createElement("div");
    // this.lineTop.className = "lineTop";
    // this.lineTop.append(this.warehouse);
    this.lineTop = this.warehouse.parentNode;
    this.seeds = [];
    this.counter = new Counter(this.lineTop);
  }
}

class GameBoard {
  constructor() {
    this.board = document.querySelector(".game-board");
    this.boxs = [];
    let select = document.getElementById("Cavidades");
    let cavidades = select.options[select.selectedIndex].value;
    select = document.getElementById("Sementes");
    let seeds = select.options[select.selectedIndex].value;
    this.warehouses = [];
    this.warehouses[0] = new Warehouse(0);

    for (let i = 0; i < cavidades; i++) {
      this.addBoxs();
    }

    this.setIDs();

    for (let i = 0; i < this.boxs.length; i++) {
      for (let j = 0; j < seeds; j++) {
        new Seed(this.boxs[i]);
      }
    }

    this.warehouses[1] = new Warehouse(1);
  }

  updateGameBoard() {
    this.removeAll();
    let gametmp = new GameBoard();
    this.board = gametmp.board;
    this.boxs = gametmp.boxs;
  }

  addBoxs() {
    let boxTop = new Box(this.board, "top");
    let boxBot = new Box(this.board, "bot");
    let i = this.boxs.length;
    if (i != 1) {
      this.boxs[i++] = boxTop;
      this.boxs[i++] = boxBot;
    } else {
      this.boxs[1] = boxTop;
      this.boxs[2] = boxBot;
    }
  }

  setIDs() {
    let id = "0";
    let box;
    for (let i = 0; i < this.boxs.length; i++) {
      box = this.boxs[i].box;
      if (box.className == "box") {
        box.id = id;
        id++;
      }
    }
  }

  removeAll() {
    var elements = document.getElementsByClassName("lineTopBox");
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
    this.boxs = [];
    elements = document.getElementsByClassName("counter");
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  play() {}
}

class Seed {
  constructor(parentBox) {
    this.seed = document.createElement("div");
    this.seed.className = "seed";
    parentBox.box.append(this.seed);
    parentBox.counter.increment();
    this.randomPos();
  }

  randomPos() {
    let maxPercentage = 0.7;
    let minPercentage = 0.03;
    let posInfo = this.seed.parentElement.getBoundingClientRect();
    let height = posInfo.height;
    let width = posInfo.width;
    let top = posInfo.top;
    let left = posInfo.left;
    // console.log("parent.top = " + top);
    // console.log("parent.left = " + left);
    const getRandom = (min, max) =>
      Math.floor(Math.random() * (max - min) + min);
    top = getRandom(height * minPercentage, height * maxPercentage);
    left = getRandom(width * minPercentage, width * maxPercentage);
    // console.log("top = " + top);
    // console.log("left = " + left);
    this.seed.style.top = top + "px";
    this.seed.style.left = left + "px";
  }
}

class Counter {
  constructor(parentBox) {
    this.seeds = 0;
    this.counter = document.createElement("div");
    this.counter.className = "counter";
    this.counter.innerHTML = this.seeds;
    parentBox.append(this.counter);
  }

  increment() {
    this.seeds++;
    this.counter.innerHTML = this.seeds;
  }

  reduction() {
    this.seeds--;
    this.counter.innerHTML = this.seeds;
  }

  reset() {
    this.seeds = 0;
    this.counter.innerHTML = this.seeds;
  }
}
