//create move type for figure
const EMoveType = Object.freeze({
  Horisontal: 0,
  Diagonal: 1,
  Knight: 2,
});

//create type of figure
const EDignity = Object.freeze({
  Pawn: 1,
  Knight: 2,
  Bishop: 3,
  Rook: 4,
  Queen: 5,
  King: 6,
});

class Field {
  constructor(_reserved, _enemy) {
    this.Reserved = _reserved;
    this.Enemy = _enemy;
  }
}

class FigurePosition {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
    // X(_x);
    // Y = y;
  }

  get X() {
    return this.x;
  }
  set X(_x) {
    this.x = _x;
  }
  get Y() {
    return this.y;
  }
  set Y(_y) {
    this.y = _y;
  }

  unequal(c1, c2) {
    return c1.X != c2.X || c1.Y != c2.Y;
  }

  equal(c1, c2) {
    return c1.X == c2.X && c1.Y == c2.Y;
  }
}

class Figure {
  constructor(color, isAlive, dignity, isPassed, position) {
    this.Color = color;
    this.IsAlive = isAlive;
    this.Dignity = dignity;
    this.Position = position;
    this.IsPassed = isPassed;
  }

  Figure(_figure) {
    this.Color = _figure.Color;
    this.IsAlive = _figure.IsAlive;
    this.Dignity = _figure.Dignity;
    this.Position = _figure.Position;
    this.IsPassed = _figure.IsPassed;
  }

  Plus = (firstCondition, secondCondition, firstArg, secondArg) => {
    if (firstArg <= firstCondition) {
      firstArg = firstArg + 1;
      this.changeItem.Start = this.changeItem.Start + 1;
    }
    // return [firstArg <= firstCondition, firstArg, secondArg];
    return firstArg <= firstCondition;
  };

  Minus = (firstCondition, secondCondition, firstArg, secondArg) => {
    if (firstArg >= firstCondition) {
      firstArg = firstArg - 1;
      this.changeItem.Start = this.changeItem.Start - 1;
    }
    // return [firstArg >= firstCondition, firstArg, secondArg];
    return firstArg >= firstCondition;
  };

  KnightMoves = (firstCondition, secondCondition, firstArg, secondArg) => {
    let flag = 0 <= firstCondition && secondCondition <= 7;
    return (
      0 <= firstCondition && 7 >= firstCondition && 0 <= secondCondition && 7 >= secondCondition
    );
  };

  RightTop = (firstCondition, secondCondition, firstArg, secondArg) => {
    firstArg = firstArg + 1;
    secondArg = secondArg - 1;
    this.changeItem.Start = this.changeItem.Start + 1;
    this.changeItem.Unchanged = this.changeItem.Unchanged - 1;
    let flag = firstArg <= firstCondition && secondArg >= secondCondition;
    return flag;
  };

  LeftTop = (firstCondition, secondCondition, firstArg, secondArg) => {
    this.changeItem.Start = this.changeItem.Start - 1;
    this.changeItem.Unchanged = this.changeItem.Unchanged - 1;
    firstArg = firstArg - 1;
    secondArg = secondArg - 1;
    let flag = firstArg >= firstCondition && secondArg >= secondCondition;
    return flag;
  };

  RightBottom = (firstCondition, secondCondition, firstArg, secondArg) => {
    let kek = this.changeItem.Start;
    kek = kek + 1;
    this.changeItem.Start = this.changeItem.Start + 1;
    this.changeItem.Unchanged = this.changeItem.Unchanged + 1;
    firstArg = firstArg + 1;
    secondArg = secondArg + 1;
    let flag = firstArg <= firstCondition && secondArg <= secondCondition;
    return flag;
  };

  LeftBottom = (firstCondition, secondCondition, firstArg, secondArg) => {
    this.changeItem.Start = this.changeItem.Start - 1;
    this.changeItem.Unchanged = this.changeItem.Unchanged + 1;
    firstArg = firstArg - 1;
    secondArg = secondArg + 1;
    let flag = firstArg >= firstCondition && secondArg <= secondCondition;
    return flag;
  };

  IsEnemy(color, a, b) {
    if (!color) {
      if (!a && b) return true;
    } else {
      if (a && !b) return true;
    }
    return false;
  }

  IsEmptyCell(cell) {
    return !cell.Reserved && !cell.Enemy;
  }

  GetListOfMoves(minStepX, maxStepX, minStepY, maxStepY, color, figurePosition, flag) {
    switch (flag) {
      case 0:
        return [
          new Element(this.Plus, figurePosition, maxStepY, 0, 1),
          new Element(this.Minus, figurePosition, minStepY, 0, 1),
          new Element(this.Plus, figurePosition, maxStepX, 0, 0),
          new Element(this.Minus, figurePosition, minStepX, 0, 0),
        ];
      case 1:
        return [
          new Element(this.RightTop, figurePosition, maxStepX, minStepY, 0),
          new Element(this.LeftTop, figurePosition, minStepX, minStepY, 0),
          new Element(this.RightBottom, figurePosition, maxStepX, maxStepY, 0),
          new Element(this.LeftBottom, figurePosition, minStepX, maxStepY, 0),
        ];
      case 2:
        return [
          new Element(
            this.KnightMoves,
            figurePosition,
            figurePosition.X + 1,
            figurePosition.Y + 2,
            2
          ),
          new Element(
            this.KnightMoves,
            figurePosition,
            figurePosition.X - 1,
            figurePosition.Y + 2,
            2
          ),
          new Element(
            this.KnightMoves,
            figurePosition,
            figurePosition.X + 1,
            figurePosition.Y - 2,
            2
          ),
          new Element(
            this.KnightMoves,
            figurePosition,
            figurePosition.X - 1,
            figurePosition.Y - 2,
            2
          ),
          new Element(
            this.KnightMoves,
            figurePosition,
            figurePosition.X + 2,
            figurePosition.Y - 1,
            2
          ),
          new Element(
            this.KnightMoves,
            figurePosition,
            figurePosition.X - 2,
            figurePosition.Y - 1,
            2
          ),
          new Element(
            this.KnightMoves,
            figurePosition,
            figurePosition.X + 2,
            figurePosition.Y + 1,
            2
          ),
          new Element(
            this.KnightMoves,
            figurePosition,
            figurePosition.X - 2,
            figurePosition.Y + 1,
            2
          ),
        ];
      default:
        return null;
    }
  }

  GetFigureMoves(array, color, TypeOfMove, figurePosition, reservedCell) {
    let Moves = [];
    let cell = "";
    let enemy = false,
      flag = false;
    let i = 0,
      j = 0;
    let list = this.GetListOfMoves(
      array[0],
      array[1],
      array[2],
      array[3],
      color,
      figurePosition,
      TypeOfMove
    );

    for (let counter = 0; counter < list.length; counter++) {
      let increment = list[counter].TypeOfIncrement;
      this.changeItem = list[counter];
      while (
        increment(
          list[counter].FirstCondition,
          list[counter].SecondCondition,
          list[counter].Start,
          list[counter].Unchanged
        )
      ) {
        list[counter].InitXY();
        i = list[counter].X;
        j = list[counter].Y;
        if (figurePosition.X == list[counter].X && figurePosition.Y == list[counter].Y) continue;
        cell = reservedCell[i][j];
        if (cell == null) break;
        flag = this.IsEmptyCell(cell);
        enemy = this.IsEnemy(color, cell.Reserved, cell.Enemy);
        if (flag || enemy) {
          Moves.push(new FigurePosition(i, j));
          if (enemy) break;
        } else break;
      }
    }
    let rez = Moves.flat();
    return Moves.flat();
  }
}

class Element {
  // public Increment TypeOfIncrement { get; set; }
  // public int Unchanged = 0;
  // public int Start = 0;
  // private bool flag=true;
  // private FigurePosition Figure;
  // public int FirstCondition { get; set; }
  // public int SecondCondition { get; set; }
  // public int TypeOfMove { get; set; }
  // public int X { get; set; }
  // public int Y { get; set; }

  constructor(typeOfIncrement, figure, firstConditon, secondCondition, typeOfMove) {
    this.flag = true;
    this.TypeOfIncrement = typeOfIncrement;
    this.Figure = figure;
    this.FirstCondition = firstConditon;
    this.SecondCondition = secondCondition;
    this.TypeOfMove = typeOfMove;
    this.Init(this.TypeOfMove);
  }

  GetKnightMoves() {
    if (this.flag) {
      this.X = this.FirstCondition;
      this.Y = this.SecondCondition;
      this.FirstCondition = -999;
      this.SecondCondition = -999;
      this.flag = false;
    } else {
      this.FirstCondition = -999;
      this.SecondCondition = -999;
    }
  }

  Init(i) {
    switch (i) {
      case 0: {
        this.Start = this.Figure.X;
        this.Unchanged = this.Figure.Y;
        break;
      }
      case 1: {
        this.Unchanged = this.Figure.X;
        this.Start = this.Figure.Y;
        break;
      }
      case 2: {
        break;
      }
    }
  }

  InitXY() {
    switch (this.TypeOfMove) {
      case 0: {
        this.X = this.Start;
        this.Y = this.Unchanged;
        break;
      }
      case 1: {
        this.X = this.Unchanged;
        this.Y = this.Start;
        break;
      }
      case 2: {
        this.GetKnightMoves();
        break;
      }
    }
  }
}
