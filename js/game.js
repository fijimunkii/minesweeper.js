var Game = Game || {};

Game.createBoard = function(size) {
  $('#game-container').html('');

  for (var y=1; y<size+1; y++) {
    for (var x=1; x<size+1; x++) {
      $tile = $('<div>');
      $tile.addClass('tile');
      $tile.addClass('untouched');
      $tile.attr('id', y + '-' + x);

      var randNum = Math.floor(Math.random()*12);
      if (randNum % 2 === 0) {
        $tile.addClass('bomb');
      }

      $('#game-container').append($tile);
    }
  }
  var rowSize = (size*17);
  $('#game-container').css({height: rowSize , width: rowSize});
}

Game.toggle = function(tile, options) {

  // game over if tile was clicked on and was a bomb
  if (options.trigger && $(tile).hasClass('bomb')) {
    $(tile).removeClass('untouched');
    alert('game over son!');

  // check surrounding tiles and toggle them
  } else if ($(tile).hasClass('untouched')) {

    $(tile).removeClass('untouched');

    var id = $(tile).attr('id'),

        dashIndex = id.indexOf('-'),

        yCoord = parseInt(id.slice(0,dashIndex)),
        xCoord = parseInt(id.slice(dashIndex+1, id.length+1)),

        $top = $('#' + (yCoord - 1) + '-' + xCoord),
        $topRight = $('#' + (yCoord - 1) + '-' + (xCoord + 1)),
        $right = $('#' + yCoord + '-' + (xCoord+1)),
        $bottomRight = $('#' + (yCoord + 1) + '-' + (xCoord + 1)),
        $bottom = $('#' + (yCoord + 1) + '-' + xCoord),
        $bottomLeft = $('#' + (yCoord + 1) + '-' + (xCoord - 1)),
        $left = $('#' + yCoord + '-' + (xCoord-1)),
        $topLeft = $('#' + (yCoord - 1) + '-' + (xCoord - 1)),

        surroundingBombs = 0;

    function checkAndToggle(tile, time) {
      if (tile.hasClass('bomb')) {
        surroundingBombs += 1;
      } else {
        setTimeout(function() {
          Game.toggle(tile, {trigger: false});
        }, time);
      }
    }

    checkAndToggle($top, 1);
    checkAndToggle($topRight, 2);
    checkAndToggle($right, 3);
    checkAndToggle($bottomRight, 4);
    checkAndToggle($bottom, 5);
    checkAndToggle($bottomLeft, 6);
    checkAndToggle($left, 7);
    checkAndToggle($topLeft, 8);

    console.log(surroundingBombs);
    if (surroundingBombs) {
      $(tile).text(surroundingBombs);
    }

  }
}


$(function() {
  $('#new-game').on('click', function() {
    var gameSize = $('#board-size-input').val()
    gameSize = gameSize || 33;
    console.log(gameSize);
    Game.createBoard(gameSize);
  });

  $('body').on('click', '.tile', function() {
    Game.toggle(this, {trigger: true});
  });

  Game.createBoard(33);
});
