(function(root) {
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

  var View = SnakeGame.View = function($display){
    this.$display = $display;
  };

  View.prototype.start = function(){
    this.board = new SnakeGame.Board();

    var board = this.board;
    $('body').keydown(function(event){
      var keycode = event.which;
      var snake = board.snake;

      switch (keycode){
      case 37:
        snake.turn("W");
        break;
      case 38:
        snake.turn("N");
        break;
      case 39:
        snake.turn("E");
        break;
      case 40:
        snake.turn("S");
        break;
      }
    });

    var view = this;
    this.intervalHandle = setInterval(function () {
      view.step();
      view.renderBoard();
    }, 80);
  };

  View.prototype.renderBoard = function () {
    $display = this.$display;
    var divs = this.board.render();
    $display.empty();

    $display.append(divs);
  };

  View.prototype.checkForApple = function () {
    if (this.board.checkForApple()) {
      this.board.snake.grow();
      this.deleteApple();

      this.board.generateRandomApple();
    }
  };

  View.prototype.deleteApple = function () {
    this.board.apple = null;
    $('.apple').remove();
  };

  View.prototype.checkIfGameOver = function () {
    if (this.board.isGameOver()) {
      alert("Game over!");
      clearInterval(this.intervalHandle);
    }
  };

  View.prototype.step = function () {
    this.board.snake.move();
    this.checkForApple();
    this.checkIfGameOver();
  };

})(this);
