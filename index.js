/*TODO:
  login
  classificaçoes
  implementar Algoritmo bom AI
*/

const getRandom = (min, max) => Math.floor(Math.random() * (max - min) + min);
function delay(n) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n * 1000);
  });
}

var main_user;
var game_code;
var isLoggedIn = false;
const group_id = 55;
var eventSource;

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
  getTop10();
};

function getTop10() {
  //ir a um ficheiro json buscar os maiores top10 classificados em vitorias
  window.game.sendRequest(null, "ranking");
}

function addToClass(data) {
  let classDiv = document.getElementsByClassName("classificacoes")[0];
  createTable(classDiv, data.ranking);
}

function createTable(parent, data) {
  let mytable = document.createElement("table");
  generateTableHead(mytable, data);
  generateTable(mytable, data);
  parent.appendChild(mytable);
}

function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();

  let keys = Object.keys(data[0]);
  for (let key of keys) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

btnConfig.onclick = function () {
  modalConfig.style.display = "block";
};

submit.onclick = function () {
  game.updateGameBoard();
  modalConfig.style.display = "none";
};

login.onclick = function () {
  let user = document.getElementById("username").value;
  let pw = document.getElementById("pw").value;

  main_user = new User(user, pw);
};

function isObjectEmpty(obj) {
  for (const i in obj) return false;
  return true;
}

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
      break;
    case "giveUp":
      game.giveUp();
      break;
  }

  switch (event.target.className) {
    case "box":
      if (
        event.target.id % 2 == 1 &&
        window.turn == "Bot Side" &&
        !window.stopGame
      ) {
        game.play(event.target);
        if (game.adversary == "CPU") game.playComputer();
      }
      break;
  }
};

window.onload = function () {
  window.stopGame = false;
  window.game = new GameBoard();
};

window.hideLogin = function () {
  let btn = document.getElementById("btnLogin");
  btn.style.display = "none";
  btn.zIndex = -1;

  modalLogin.style.display = "none";
};

window.showUsername = function (user) {
  let div = document.createElement("div");
  let top = document.getElementsByClassName("top")[0];
  div.innerHTML = "Logged in as: " + user.name;
  let children = top.children;
  top.insertBefore(div, children[1]);
};

class User {
  constructor(user, pw) {
    this.data = { nick: user, password: pw };
    this.name = user;
    this.pw = pw;
    window.game.sendRequest(this.data, "register", this);
  }

  login() {
    alert("Login bem sucedido.");
    isLoggedIn = true;
    window.hideLogin();
    window.showUsername(this);
  }

  wrongLogin() {
    alert("Palavra passe errada.");
  }

  getUserJSON() {
    return this.data;
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
    select = document.getElementById("Adversary");
    this.adversary = select.options[select.selectedIndex].value;
    select = document.getElementById("Difficulty");
    this.difficulty = select.options[select.selectedIndex].value;
    this.warehouses = [];
    this.warehouses[0] = new Warehouse(0);
    select = document.getElementById("Turn");
    window.turn =
      select.options[select.selectedIndex].value == "Eu"
        ? "Bot Side"
        : "Top Side";
    this.turn = new Turn();

    for (let i = 0; i < cavidades; i++) {
      this.addBoxs();
    }

    this.setIDs();

    for (let i = 0; i < this.boxs.length; i++) {
      for (let j = 0; j < seeds; j++) {
        new Seed(this.boxs[i]);
      }
    }

    if (this.adversary == "Player" && isLoggedIn) {
      let obj = {
        group: 55,
        nick: main_user.name,
        password: main_user.pw,
        size: cavidades,
        initial: seeds,
      };
      this.sendRequest(obj, "join");
    } else if (this.adversary == "Player") {
      alert("Login first!");
    }

    this.warehouses[1] = new Warehouse(1);
    if (window.turn == "Top Side" && this.adversary == "CPU")
      this.playComputer();
  }

  updateGameBoard() {
    this.removeAll();
    let gametmp = new GameBoard();
    this.board = gametmp.board;
    this.boxs = gametmp.boxs;
    this.adversary = gametmp.adversary;
    this.difficulty = gametmp.difficulty;
    this.warehouses = gametmp.warehouses;
    this.warehouses[0].removeSeeds();
    this.warehouses[1].removeSeeds();
    this.turn = gametmp.turn;
    window.stopGame = false;
  }

  updateGameBoardMP(data){
    this.removeAll();
    let gametmp = new GameBoard();
    
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
      let parent = elements[0].parentNode;
      parent.removeChild(elements[0]);
    }
    this.boxs = [];
    elements = document.getElementsByClassName("counter");
    while (elements.length > 0) {
      let parent = elements[0].parentNode;
      if (parent.className != "warehouse") parent.removeChild(elements[0]);
    }
  }

  play(boxDiv) {
    if (this.adversary == "CPU") {
      let id = parseInt(boxDiv.id);
      box_if: if (
        (window.turn == "Bot Side" && id % 2 == 1) ||
        (window.turn == "Top Side" && id % 2 == 0)
      ) {
        let box = this.getBox(id);
        if (box.isEmpty()) break box_if;
        let lastBox = this.boxs.length - 1;
        let numSeeds = box.size();

        box.removeSeeds();
        if (id % 2 == 0) {
          id -= 2; //next box
        } else {
          id += 2; //next box
        }

        for (let i = 0; i < numSeeds; i++) {
          box = this.getBox(id);
          if (id > lastBox) {
            this.warehouses[1].addSeed();
            id = lastBox - 1;
          } else if (id < 0) {
            this.warehouses[0].addSeed();
            id = 1;
          } else if (id % 2 == 0 && id < lastBox && id >= 0) {
            //Top side
            box.addSeed();
            id -= 2;
          } else if (id % 2 == 1 && id <= lastBox && id > 0) {
            //bottom side
            box.addSeed();
            id += 2;
          }
        }
        window.turn = window.turn == "Top Side" ? "Bot Side" : "Top Side";
        this.turn.update();
      }
      if (this.isEmpty()) this.endgame();
      else if (this.isTopEmpty() && window.turn == "Top Side") {
        window.turn = "Bot Side";
        this.turn.update();
      } else if (this.isBotEmpty() && window.turn == "Bot Side") {
        window.turn = "Top Side";
        this.turn.update();
        game.playComputer();
      }
    } else {
      let id = parseInt(boxDiv.id);
      box_if: if (
        (window.turn == "Bot Side" && id % 2 == 1) ||
        (window.turn == "Top Side" && id % 2 == 0)
      ) {
      }
    }
  }

  getBox(id) {
    for (let i = 0; i < this.boxs.length; i++) {
      if (this.boxs[i].box.id == id) {
        return this.boxs[i];
      }
    }
    return null;
  }

  isEmpty() {
    if (this.isTopEmpty() && this.isBotEmpty()) return true;
    return false;
  }

  isTopEmpty() {
    for (let i = 0; i < this.boxs.length; i += 2) {
      let box = this.getBox(i);
      if (!box.isEmpty()) return false;
    }
    return true;
  }

  isBotEmpty() {
    for (let i = 1; i < this.boxs.length; i += 2) {
      let box = this.getBox(i);
      if (!box.isEmpty()) return false;
    }
    return true;
  }

  async endgame() {
    await delay(0.5);
    let winner = this.whoWon();
    if (winner == "left") window.alert("Top won");
    else if (winner == "right" && isLoggedIn) window.alert("Bot won");
    else window.alert("It's a tie!!");
    window.stopGame = true;
  }

  whoWon() {
    let left = this.warehouses[0].size();
    let right = this.warehouses[1].size();
    if (left > right) return "left";
    else if (right > left) return "right";
    return "tie";
  }

  async playComputer() {
    await delay(1);
    let n;
    let box;
    switch (this.difficulty) {
      case "Easy":
        do {
          n = getRandom(0, this.boxs.length);
          box = this.getBox(n);
          if (this.isTopEmpty()) break;
        } while (n % 2 == 1 || box.size() == 0);
        if (this.isTopEmpty()) break;
        this.play(box.box);
        break;
      case "Medium":
        break;
      case "Hard":
        break;
    }
  }

  checkRegister(data) {
    if (isObjectEmpty(data)) {
      console.log("Registo sucedido");
      main_user.login();
    }
    if (data.error == "User registered with a different password") {
      isLoggedin = false;
      main_user.wrongLogin();
    }
  }

  checkRanking(data) {
    if (isObjectEmpty(data)) alert("Error checkRanking");
    else {
      addToClass(data);
    }
  }

  checkJoin(data) {
    if (isObjectEmpty(data)) alert("Error: in checkJoin, data is empty.");
    else {
      if (data.hasOwnProperty("game")) {
        game_code = data.game;
        alert("You entered in a game.");
        this.openServer();
        console.log("checkJoing data: ");
        console.log(data);
      } else alert("Error: data doesn't have property game.");
    }
  }

  checkLeave(data) {
    if (isObjectEmpty(data)) {
      eventSource.close();
      console.log("Player left.");
      alert("You left the game.");
    } else {
      console.log(data);
      alert("Error: in checkLeave");
    }
  }

  openServer() {
    //not finished

    if (!isLoggedIn) {
      alert("Please login first.");
      return;
    }
    let server = "twserver.alunos.dcc.fc.up.pt";
    eventSource = new EventSource(
      "http://" +
        server +
        ":" +
        "8008" +
        "/update?nick=" +
        encodeURIComponent(main_user.name) +
        "&game=" +
        encodeURIComponent(game_code)
    );

    eventSource.onmessage = function (event) {
      //ler o que o outro jogador jogou
      let data = JSON.parse(event.data);
      window.turn = data.board.turn;
      updateGameBoardMP(data);
      console.log("openserver: ");
      console.log(data);
    };
  }

  checkUpdate(data){
    console.log("checkUpdate: ");
    console.log(data);
  }

  giveUp() {
    if(window.turn == "Top Side") window.alert("Top Side gave up");
    else window.alert("Bot Side gave up");
    this.leave();
    window.stopGame = true;
  }

  sendRequest(obj, command) {
    const xhr = new XMLHttpRequest();
    let server = "twserver.alunos.dcc.fc.up.pt";
    xhr.open("POST", "http://" + server + ":" + 8008 + "/" + command, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState < 4) return;
      let data = JSON.parse(xhr.responseText);
      switch (command) {
        case "join":
          window.game.checkJoin(data);
          break;
        case "leave":
          window.game.checkLeave(data);
          break;
        case "notify":
          window.game.checkNotify(data);
          break;
        case "ranking":
          window.game.checkRanking(data);
          break;
        case "register":
          window.game.checkRegister(data);
          break;
        case "update":
          window.game.checkUpdate(data);
          break;
      }
    };
    xhr.send(JSON.stringify(obj));
  }

  leave() {
    let data = {
      game: game_code,
      nick: main_user.name,
      password: main_user.pw,
    };
    this.sendRequest(data, "leave");
  }
}

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
    this.counter = new Counter(this.lineTopBox);
  }

  addSeed() {
    let seed = new Seed(this);
  }

  removeSeeds() {
    let children = this.box.children;
    let size = children.length;
    for (let i = 0; i < size; i++) {
      children[0].remove();
    }
    this.counter.reset();
  }

  size() {
    return this.box.childElementCount;
  }

  isEmpty() {
    if (this.size() == 0) return true;
    return false;
  }
}

class Warehouse {
  constructor(i) {
    this.box = document.getElementsByClassName("warehouse")[i];
    // this.warehouse.className = "warehouse";
    // this.lineTop = document.createElement("div");
    // this.lineTop.className = "lineTop";
    // this.lineTop.append(this.warehouse);
    this.lineTop = this.box.parentNode;
    this.counter = new Counter(this.lineTop);
  }

  addSeed() {
    let seed = new Seed(this);
  }

  removeSeeds() {
    let children = this.box.children;
    let size = children.length;
    for (let i = 0; i < size; i++) {
      children[0].remove();
    }
    this.counter.reset();
  }

  size() {
    return this.box.childElementCount;
  }
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
    let top;
    let left;
    // console.log("parent.top = " + top);
    // console.log("parent.left = " + left);
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
    this.seeds = parseInt(0);
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

class Turn {
  constructor() {
    this.turn = document.getElementsByClassName("turn")[0];
    this.turn.innerHTML = "Turn: " + window.turn;
  }

  update() {
    this.turn.innerHTML = "Turn: " + window.turn;
  }
}
