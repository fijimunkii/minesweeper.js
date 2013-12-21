var Game = Game || {};

Game.difficulty = 'medium';

Game.createBoard = function() {
  var size;
  var rowSize;

  if (Game.difficulty === 'easy') {
    size = 10;
    rowSize = (size*16+4);
  } else if (Game.difficulty === 'medium') {
    size = 20;
    rowSize = (size*16+4);
  } else if (Game.difficulty === 'hard') {
    size = 30;
    rowSize = (size*16+4);
  }

  $('#game-container').html('');

  for (var y=1; y<size+1; y++) {
    for (var x=1; x<size+1; x++) {
      $tile = $('<div>');
      $tile.addClass('tile');
      $tile.addClass('untouched');
      $tile.attr('id', y + '-' + x);

      var randNum = Math.floor(Math.random()*11);
      if (randNum % 777 === 0) {
        $tile.addClass('bomb');
      }

      $('#game-container').append($tile);
    }
  }

  $('#game-container').css({height: rowSize , width: rowSize});

  Game.checkForWin();
}

Game.listeners = function() {
  $('body').on('mousedown', '.tile', function(e) {
    switch (e.which) {
      case 1:
        Game.toggle($(this), {trigger: true});
        break;
      case 3:
        e.preventDefault();
        alert('you right clicker you!!');
        Game.flag($(this));
    }
  });

  $('#easy').on('click', function(e) {
    Game.difficulty = 'easy';
    Game.createBoard();
  });

  $('#medium').on('click', function(e) {
    Game.difficulty = 'medium';
    Game.createBoard();
  });

  $('#hard').on('click', function(e) {
    Game.difficulty = 'hard';
    Game.createBoard();
  });

  $('#new-game').on('click', function(e) {
    Game.createBoard();
  });
}

Game.check = function(tile, time) {
  if (tile.hasClass('bomb')) {
    return 1;
  } else {
    return 0;
  }
}

Game.lookForBombs = function(tileArray) {
  var surroundingBombs = 0;

  for (var i=0, numTiles = tileArray.length; i < numTiles; i++) {
    surroundingBombs += Game.check(tileArray[i], i);
  }

  return surroundingBombs;
}

Game.surroundingTiles = function(tile) {
  var id = $(tile).attr('id'),

      dashIndex = id.indexOf('-'),

      yCoord = parseInt(id.slice(0,dashIndex)),
      xCoord = parseInt(id.slice(dashIndex+1, id.length+1)),

      $top =         $('#' + (yCoord - 1) + '-' + xCoord),
      $topRight =    $('#' + (yCoord - 1) + '-' + (xCoord + 1)),
      $right =       $('#' + yCoord + '-' + (xCoord+1)),
      $bottomRight = $('#' + (yCoord + 1) + '-' + (xCoord + 1)),
      $bottom =      $('#' + (yCoord + 1) + '-' + xCoord),
      $bottomLeft =  $('#' + (yCoord + 1) + '-' + (xCoord - 1)),
      $left =        $('#' + yCoord + '-' + (xCoord-1)),
      $topLeft =     $('#' + (yCoord - 1) + '-' + (xCoord - 1));

  var surroundingTiles = [ $top, $topRight, $right,
           $bottomRight, $bottom, $bottomLeft, $left, $topLeft ];

  return $.grep(surroundingTiles, function(n) { return n });
}

Game.toggle = function($tile, options) {

  // game over if tile was clicked on and was a bomb
  if (options && options.trigger && $tile.hasClass('bomb')) {
    $tile.removeClass('untouched');
    $tile.addClass('game-over');
    alert('game over son!');

  // check surrounding tiles
  } else if ($tile.hasClass('untouched')) {

    $tile.removeClass('untouched');

    var surroundingTiles = Game.surroundingTiles($tile),
        surroundingBombs = Game.lookForBombs(surroundingTiles);

    setTimeout(function() {
      if (surroundingBombs) {
        switch (surroundingBombs) {
          case 1:
            $tile.addClass('one');
            break;
          case 2:
            $tile.addClass('two');
            break;
          case 3:
            $tile.addClass('three');
        }
      } else {
        Game.queueToggles(surroundingTiles);
      }
    }, 100);
  }
}

Game.timeoutToggle = function(tile, time) {
  setTimeout(function() {
    Game.toggle(tile);
  }, time);
}

Game.queueToggles = function(tileArray) {
  for (var i=0, numTiles = tileArray.length; i < numTiles; i++) {
    Game.timeoutToggle(tileArray[i], i*i);
  }
}

Game.checkForWin = function() {
  var checkForWinterval = setInterval(function() {
    var remainingTiles = $('.untouched').not('.bomb');

    if (remainingTiles.length === 0) {
      alert('your a winner!');
      clearInterval(checkForWinterval);
    }
  }, 100);
}


//// Game Initalizer
$(function() {
  Game.listeners();
  Game.createBoard();
});
