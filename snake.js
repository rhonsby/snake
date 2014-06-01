(function(root) {
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

  var Snake = SnakeGame.Snake = function () {
    this.segments = [new Coord([9, 9], "E"), new Coord([9,8], "E"), new Coord([9,7], 'E')];
  };

  Snake.prototype.move = function () {
    var snake = this;

    this.moveTail();
    this.segments[0].plus();
  };

  Snake.prototype.moveTail = function() {
    for (var i = this.segments.length - 1; i > 0; i--) {
      var prevSeg = this.segments[i - 1];
      var currentSeg = this.segments[i];

      currentSeg.x = prevSeg.x;
      currentSeg.y = prevSeg.y;
      currentSeg.pos = prevSeg.pos;
      currentSeg.dir = prevSeg.dir;
    }
  };

  Snake.prototype.turn = function (newDir) {
    if (this.oppositeDir() !== newDir) this.segments[0].dir = newDir;
  };

  Snake.prototype.oppositeDir = function () {
    switch (this.segments[0].dir) {
    case "E":
      return "W";
    case "W":
      return "E";
    case "N":
      return "S";
    case "S":
      return "N";
    }
  };

  Snake.prototype.grow = function (pos) {
    // var lastCoord = this.segments[this.segments.length - 1];
    var lastCoord = this.segments[this.segments.length - 1];

    switch(lastCoord.dir) {
    case "E":
      newCordPos = [lastCoord.x, lastCoord.y - 1];
      break;
    case "W":
      newCordPos = [lastCoord.x, lastCoord.y + 1];
      break;
    case "N":
      newCordPos = [lastCoord.x + 1, lastCoord.y];
      break;
    case "S":
      newCordPos = [lastCoord.x - 1, lastCoord.y];
      break;
    }

    this.segments.push(new Coord(newCordPos, lastCoord.dir));
  };

  var Coord = SnakeGame.Coord = function (pos, dir) {
    this.x = pos[0];
    this.y = pos[1];
    this.pos = pos;
    this.dir = dir;
  };

  Coord.prototype.plus = function () {
    switch(this.dir) {
    case "N":
      this.x -= 1;
      break;
    case "S":
      this.x += 1;
      break;
    case "W":
      this.y -= 1;
      break;
    case "E":
      this.y += 1;
      break;
    }

    this.checkForWrapping();
    this.pos = [this.x, this.y];
  };

  Coord.prototype.checkForWrapping = function () {
    if (this.x > 29) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = 29;
    }

    if (this.y > 39) {
      this.y = 0;
    } else if (this.y < 0) {
      this.y = 39;
    }
  };

  var Board = SnakeGame.Board = function () {
    this.snake = new Snake();
    this.apple = new Apple([0, 0]);
  };

  Board.prototype.render = function() {
    var str = "";
    var board = this;
    for (var i = 0; i < 30; i++) {
      for (var j = 0; j < 40; j++) {

        if (board.isSnake([i, j])) {
          str += "<div class='snake square'></div>";
        } else if (board.isApple([i, j])) {
          str += "<div class='apple square'></div>";
        } else {
          str += "<div class='square'></div>";
        }
      }
    }
    return str;
  };

  Board.prototype.isApple = function (pos) {
    if (!this.apple) return false;
    return this.apple.x === pos[0] && this.apple.y === pos[1];
  };

  Board.prototype.isSnake = function (pos, segments) {
    var board = this;
    var segmentFound = false;
    segments = (segments || this.snake.segments);

    segments.forEach(function (snakeSegment) {
      if (snakeSegment.x === pos[0] && snakeSegment.y === pos[1]) {
        segmentFound = true;
        return;
      }
    });

    return segmentFound;
  };

  var Apple = SnakeGame.Apple = function (pos) {
    this.x = pos[0];
    this.y = pos[1];
    this.pos = pos;
  };

  Board.prototype.generateRandomApple = function() {
    var validPos = false;

    while (!validPos) {
      var x = Math.floor(Math.random() * 20);
      var y = Math.floor(Math.random() * 20);
      if (!this.isSnake([x, y])) validPos = [x, y];
    }

    this.apple = new Apple(validPos);
  };

  Board.prototype.checkForApple = function () {
    var head = this.snake.segments[0];
    return this.isApple(head.pos);
  };

  Board.prototype.isGameOver = function () {
    var head = this.snake.segments[0];
    return this.isSnake(head.pos, this.snake.segments.slice(1));
  };
})(this);
