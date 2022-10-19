class FiguresMoves {
  // Figure Figure { get; set; }
  // FigurePosition Position { get; set; }
  //pasition = isPassed isPassed = pasition
  constructor(figure, position) {
    this.array = this.getFigureAttr(figure);
    this.Figure = new Figure(
      this.array[0],
      this.array[1],
      this.array[2],
      this.array[4],
      this.array[3]
    );
    this.Position = new FigurePosition(position.X, position.Y);
  }
  getFigureAttr(_figure) {
    let arr = [_figure.Color, _figure.IsAlive, _figure.Dignity, _figure.Position, _figure.IsPassed];
    return arr;
  }
}

class ChessFigure {
  // int MAX_SIZE = 7, min = 0;
  // int[] SizeArr = new int[] { min, MAX_SIZE, min, MAX_SIZE };
  // int[] DignitysArray = { 4, 2, 3, 5, 6, 3, 2, 4 };

  // List<Figure> figureArray;
  // List<Figure> copyFigureArray;
  // List<Figure> FigureArray { get { return figureArray; } }

  // List<List<Field>> copyFieldReserved;
  // List<List<Field>> this.figureArray;

  // FigurePosition[] roqueAcceptedMoves;

  constructor() {
    this.MAX_SIZE = 7;
    this.min = 0;
    this.FieldReserved = [];
    this.roqueAcceptedMoves = [];
    this.copyFigureArray = [];
    this.copyFieldReserved = [];
    this.figureArray = [];
    this.DignitysArray = [4, 2, 3, 5, 6, 3, 2, 4];
    this.SizeArr = [this.min, this.MAX_SIZE, this.min, this.MAX_SIZE];
  }

  // ChessFigure(Ai) {
  //   figureArray = [];
  //   for (let i = 0; i < Ai.figureArray.length; i++) {
  //     let o = Ai.figureArray[i];
  //     figureArray.push(new Figure(o));
  //   }
  //   this.FieldReserved = [];
  //   this.FieldReserved = DeepCopyField(Ai.FieldReserved);
  //   this.copyFigureArray = DeepCopyFigure(figureArray);
  //   this.copyFieldReserved = DeepCopyField(FieldReserved);
  // }

  getFigureAttr(_figure) {
    let pos = new FigurePosition(_figure.Position.x, _figure.Position.y);
    let arr = [_figure.Color, _figure.IsAlive, _figure.Dignity, pos, _figure.IsPassed];
    return arr;
  }

  makeDeepFigure(array) {
    let copy = [];
    for (let i = 0; i < array.length; i++) {
      let parse = this.getFigureAttr(JSON.parse(JSON.stringify(array[i])));
      // let o = this.getFigureAttr(array.figureArray[i]);
      copy.push(new Figure(parse[0], parse[1], parse[2], parse[4], parse[3]));
    }
    return copy;
  }

  makeDeepField(array) {
    let copy = [],
      row = [];
    for (let i = 0; i < array.length; i++) {
      row = [];
      // for (let j = 0; j <= this.MAX_SIZE; j++) {
      //   row.push(second[i][j]);
      // }
      copy = [...array[i]];
      // first.push(row);
    }
    return copy;
  }

  ChessFigureAi(Ai) {
    this.figureArray = [];
    this.figureArray = this.makeDeepFigure(Ai.figureArray);
    // for (let i = 0; i < Ai.figureArray.length; i++) {
    //   let o = this.getFigureAttr(Ai.figureArray[i]);
    //   this.figureArray.push(new Figure(o[0], o[1], o[2], o[4], o[3]));
    // }
    this.FieldReserved = [];
    this.FieldReserved = this.DeepCopyField(Ai.FieldReserved);
    this.copyFigureArray = this.DeepCopyFigure(this.figureArray);
    this.copyFieldReserved = this.DeepCopyField(this.FieldReserved);
  }

  ChessFigure() {
    let row = [];
    for (let i = 0; i <= this.MAX_SIZE; i++) {
      row = [];
      for (let k = 0; k <= this.MAX_SIZE; k++) {
        row.push(new Field(false, false));
      }
      this.FieldReserved.push(row);
    }
    let color = false;
    this.figureArray = this.InitFigArray(color);
    let darkColor = this.InitFigArray(!color);
    for (let i = 0; i < darkColor.length; i++) {
      this.figureArray.push(darkColor[i]);
    }
    return this.figureArray;
  }

  // zaz() {
  //   alert("3");
  // }

  findStart() {
    let start = 0;
    for (let i = 0; i < this.figureArray.length; i++) {
      if (this.figureArray[i].Color) {
        start = i;
        break;
      }
    }
    return start;
  }

  GetAllFiguresMoves(Color) {
    let allMoves = [];
    let getTrueStart = this.findStart();
    let count = !Color ? getTrueStart : this.figureArray.length,
      start = !Color ? 0 : getTrueStart;

    for (let i = start; i < count; i++) {
      if (this.figureArray[i].IsAlive) {
        let moves = this.GetMoves(this.figureArray[i].Position);
        if (moves != null)
          for (let j = 0; j < moves.length; j++)
            allMoves.push(new FiguresMoves(this.figureArray[i], moves[j]));
      }
    }
    return allMoves;
  }

  InitFigArray(color) {
    let j = color ? 0 : 7,
      reserved = !color ? true : false,
      enemy = color ? true : false,
      ArrayFig = [];
    for (let i = 0; i <= this.MAX_SIZE; i++) {
      let k = color ? j + 1 : j - 1;
      ArrayFig.push(
        new Figure(color, true, EDignity.Pawn, false, new FigurePosition(i, color ? j + 1 : j - 1))
      );
      this.FieldReserved[i][color ? j + 1 : j - 1] = new Field(reserved, enemy);
    }

    for (let i = 0; i <= this.MAX_SIZE; i++) {
      ArrayFig.push(
        new Figure(color, true, this.DignitysArray[i], false, new FigurePosition(i, j))
      );
      this.FieldReserved[i][j] = new Field(reserved, enemy);
    }

    return ArrayFig;
  }

  DeepCopyFigure(second) {
    let first = [];
    for (let i = 0; i < second.length; i++) {
      let parse = this.getFigureAttr(JSON.parse(JSON.stringify(second[i])));
      // let o = this.getFigureAttr(array.figureArray[i]);
      first.push(new Figure(parse[0], parse[1], parse[2], parse[4], parse[3]));
    }
    return first;
    // let first = [];
    // for (let i = 0; i < second.length; i++) {
    //   let o = this.getFigureAttr(second[i]);
    //   first.push(new Figure(o[0], o[1], o[2], o[4], o[3]));
    //   // first.push(second[i]);
    // }
    // // first.push(...second);
    // // second.forEach((item) => {
    // //   first.push(new Figure(item));
    // // });
    // return first;
  }

  DeepCopyField(second) {
    let first = [],
      row = [];
    for (let i = 0; i < second.length; i++) {
      row = [...second[i]];
      first.push(row);
    }
    return first;
    // let first = [],
    //   row;
    // for (let i = 0; i < second.length; i++) {
    //   row = [];
    //   for (let j = 0; j <= this.MAX_SIZE; j++) {
    //     row.push(second[i][j]);
    //   }
    //   first.push(row);
    // }
    // // first.push(...second);
    // return first;
  }

  Undo() {
    this.figureArray = this.DeepCopyFigure(this.copyFigureArray);
    this.FieldReserved = this.DeepCopyField(this.copyFieldReserved);
  }

  GetFigureAt(currentFigPosition) {
    for (let i = 0; i < this.figureArray.length; i++) {
      let a = this.figureArray[i].Position;
      let b = currentFigPosition;
      let check =
        this.figureArray[i].Position.X == currentFigPosition.X &&
        this.figureArray[i].Position.Y == currentFigPosition.Y &&
        this.figureArray[i].IsAlive;
      if (check) return this.figureArray[i];
    }
    return null;
  }

  RemoveFigureAt(currentFigPosition) {
    for (let i = 0; i < this.figureArray.length; i++) {
      let check1 = this.figureArray[i].Position.X == currentFigPosition.X;
      let check2 = this.figureArray[i].Position.Y == currentFigPosition.Y;
      let check3 = this.figureArray[i].IsAlive;
      if (check1 && check2 && check3) {
        this.figureArray.splice(i, 1);
        // return this.figureArray[i];
      }
    }
    // return null;
  }

  Roque(curFigure, acceptedPosition) {
    if (
      curFigure.Dignity == 6 &&
      curFigure.IsRoque &&
      (acceptedPosition == roqueAcceptedMoves[0] || acceptedPosition == roqueAcceptedMoves[1])
    ) {
      rook =
        acceptedPosition.X < curFigure.Position.X
          ? this.GetFigureAt(new FigurePosition(0, curFigure.Position.Y))
          : this.GetFigureAt(new FigurePosition(7, curFigure.Position.Y));
      if (rook != null) {
        if (!curFigure.IsPassed && !rook.IsPassed) {
          roquePosition = getRoquePosition(curFigure, rook);
          this.moveFigure(curFigure, roquePosition[0]);
          this.moveFigure(rook, roquePosition[1]);
          curFigure.IsRoque = false;
        }
      }
      return true;
    }
    return false;
  }

  MoveCurrentFigure(currentFigPosition, acceptedPosition) {
    let curFigure = this.GetFigureAt(currentFigPosition);

    if (curFigure.IsAlive) {
      // copyFigureArray = this.DeepCopyFigure(this.figureArray);
      // copyFieldReserved = this.DeepCopyField(this.figureArray);
      if (!this.Roque(curFigure, acceptedPosition)) this.moveFigure(curFigure, acceptedPosition);
    }
  }

  moveFigure(curFigure, acceptedPosition) {
    let enemy = this.GetFigureAt(acceptedPosition);
    if (enemy != null && enemy.Color != curFigure.Color) {
      // enemy.IsAlive = false;
      this.RemoveFigureAt(acceptedPosition);
      // this.checkKing(enemy);
    }
    this.FieldReserved[curFigure.Position.X][curFigure.Position.Y] = new Field(false, false);
    if (!curFigure.Color)
      this.FieldReserved[acceptedPosition.X][acceptedPosition.Y] = new Field(true, false);
    else this.FieldReserved[acceptedPosition.X][acceptedPosition.Y] = new Field(false, true);

    curFigure.Position = acceptedPosition;
    curFigure.IsPassed = true;
  }

  GetMoves(currentFigPosition) {
    let o = this.GetFigureAt(currentFigPosition);
    if (o != null) {
      switch (o.Dignity) {
        case EDignity.Pawn:
          return this.PawnMove(this.FieldReserved, o);
        case EDignity.Knight:
          return o.GetFigureMoves(
            this.SizeArr,
            o.Color,
            EMoveType.Knight,
            o.Position,
            this.FieldReserved
          );
        case EDignity.Queen:
          var arr = o.GetFigureMoves(
            this.SizeArr,
            o.Color,
            EMoveType.Diagonal,
            o.Position,
            this.FieldReserved
          );
          arr.push(
            ...o.GetFigureMoves(
              this.SizeArr,
              o.Color,
              EMoveType.Horisontal,
              o.Position,
              this.FieldReserved
            )
          );
          return arr;
        case EDignity.Bishop:
          return o.GetFigureMoves(
            this.SizeArr,
            o.Color,
            EMoveType.Diagonal,
            o.Position,
            this.FieldReserved
          );
        case EDignity.Rook:
          return o.GetFigureMoves(
            this.SizeArr,
            o.Color,
            EMoveType.Horisontal,
            o.Position,
            this.FieldReserved
          );
        case EDignity.King:
          return this.KingMove(this.FieldReserved, o);
      }
    }
    return [];
  }

  getSizeArray(figure, stepLengthX, stepLengthY) {
    let minX = figure.Position.X > 0 ? figure.Position.X - stepLengthX : 0,
      maxX = figure.Position.X < 7 ? figure.Position.X + stepLengthX : 7,
      minY = figure.Position.Y > 0 ? figure.Position.Y - stepLengthY : 0,
      maxY = figure.Position.Y < 7 ? figure.Position.Y + stepLengthY : 7;
    return [minX, maxX, minY, maxY];
  }

  GetAcceptedRoqueKingMoves(moves, figure, minX, maxX, arrPosition) {
    let clearPath = [];
    let Y = figure.Position.Y;

    clearPath = figure.GetFigureMoves(
      [minX, maxX, Y, Y],
      figure.Color,
      EMoveType.Horisontal,
      figure.Position,
      this.FieldReserved
    );
    if (this.checkRoque(figure, moves[moves.length])) {
      moves.push(...clearPath);
      this.roqueAcceptedMoves[arrPosition] = moves[moves.length];
      figure.IsRoque = true;
    }
  }

  KingMove(list, figure) {
    let arr = this.getSizeArray(figure, 1, 1),
      moves = [],
      clearPath = [],
      minX = arr[0],
      maxX = arr[1],
      minY = arr[2],
      maxY = arr[3];

    if (!figure.IsPassed) {
      this.roqueAcceptedMoves = [new FigurePosition(-99, -99), new FigurePosition(-99, -99)];
      moves = figure.GetFigureMoves(
        [minX, maxX, minY, maxY],
        figure.Color,
        EMoveType.Diagonal,
        figure.Position,
        this.FieldReserved
      );
      moves.push(
        ...figure.GetFigureMoves(
          [minX, maxX, minY, maxY],
          figure.Color,
          EMoveType.Horisontal,
          figure.Position,
          this.FieldReserved
        )
      );

      if (this.checkClearPath(figure, true)) {
        this.GetAcceptedRoqueKingMoves(moves, figure, figure.Position.X - 2, figure.Position.X, 0);
      }
      if (this.checkClearPath(figure, false)) {
        this.GetAcceptedRoqueKingMoves(moves, figure, figure.Position.X, figure.Position.X + 2, 1);
      }
    } else {
      moves = figure.GetFigureMoves(
        [minX, maxX, minY, maxY],
        figure.Color,
        EMoveType.Diagonal,
        figure.Position,
        this.FieldReserved
      );
      moves.push(
        ...figure.GetFigureMoves(
          [minX, maxX, minY, maxY],
          figure.Color,
          EMoveType.Horisontal,
          figure.Position,
          this.FieldReserved
        )
      );
    }
    return moves;
  }

  checkClearPath(figure, left) {
    return left
      ? this.checkSide(figure, 0, figure.Position.X, figure.Position.Y, 3)
      : this.checkSide(figure, figure.Position.X, 7, figure.Position.Y, 2);
  }

  checkSide(figure, min, max, Y, count) {
    let moves = figure.GetFigureMoves(
      [min, max, Y, Y],
      figure.Color,
      EMoveType.Horisontal,
      figure.Position,
      this.FieldReserved
    );
    if (moves.length == count) return true;
    else return false;
  }

  getRoquePosition(king, rook) {
    let kingPosition, rookPosition;
    if (rook.Position.X == 7) {
      kingPosition = new FigurePosition(king.Position.X + 2, king.Position.Y);
      rookPosition = new FigurePosition(rook.Position.X - 2, rook.Position.Y);
    } else {
      kingPosition = new FigurePosition(king.Position.X - 2, king.Position.Y);
      rookPosition = new FigurePosition(rook.Position.X + 3, rook.Position.Y);
    }
    return [kingPosition, rookPosition];
  }

  checkRoque(king, position) {
    let rook;
    let flag = false;
    if (position.X < king.Position.X)
      rook = this.GetFigureAt(new FigurePosition(0, king.Position.Y));
    else rook = this.GetFigureAt(new FigurePosition(7, king.Position.Y));
    if (rook != null) {
      if (!king.IsPassed && !rook.IsPassed) {
        flag = true;
      }
    }
    return flag;
  }

  PawnMove(list, figure) {
    let arr = this.getSizeArray(figure, 1, 1),
      minX = arr[0],
      maxX = arr[1],
      minY = arr[2],
      maxY = arr[3],
      moves = [],
      leftAttack,
      rightAttack,
      sizeForMove,
      fieldArr;
    if (!figure.Color) {
      leftAttack = [minX, figure.Position.X, minY, figure.Position.Y];
      rightAttack = [figure.Position.X, maxX, minY, figure.Position.Y];
      sizeForMove = [figure.Position.X, figure.Position.X, minY, figure.Position.Y];
      fieldArr = [list[minX][minY], list[maxX][minY], list[figure.Position.X][minY]];
    } else {
      leftAttack = [minX, figure.Position.X, figure.Position.Y, maxY];
      rightAttack = [figure.Position.X, maxX, figure.Position.Y, maxY];
      sizeForMove = [figure.Position.X, figure.Position.X, figure.Position.Y, maxY];
      fieldArr = [list[minX][maxY], list[maxX][maxY], list[figure.Position.X][maxY]];
    }

    this.checkEnemy(figure, moves, leftAttack, rightAttack, sizeForMove, fieldArr, list);

    if (!figure.IsPassed) {
      this.pawnTwoStep(moves, figure, list);
    }
    return moves.flat();
  }

  pawnTwoStep(moves, figure, list) {
    let arr = this.getSizeArray(figure, 1, 2),
      minX = arr[0],
      maxX = arr[1],
      minY = arr[2],
      maxY = arr[3],
      sizeForMove = [],
      fieldArr = [];
    let twoSteps = [];
    if (!figure.Color) {
      sizeForMove = [figure.Position.X, figure.Position.X, minY, figure.Position.Y];
      fieldArr = [list[figure.Position.X][minY], list[figure.Position.X][minY + 1]];
    } else {
      sizeForMove = [figure.Position.X, figure.Position.X, figure.Position.Y, maxY];
      fieldArr = [list[figure.Position.X][maxY], list[figure.Position.X][maxY - 1]];
    }
    if (
      !figure.IsEnemy(figure.Color, fieldArr[0].Reserved, fieldArr[0].Enemy) &&
      !figure.IsEnemy(figure.Color, fieldArr[1].Reserved, fieldArr[1].Enemy)
    ) {
      twoSteps = figure.GetFigureMoves(
        sizeForMove,
        figure.Color,
        EMoveType.Horisontal,
        figure.Position,
        list
      );
      moves.push(...twoSteps);
    }
  }

  checkEnemy(figure, moves, leftAttack, rightAttack, sizeForMove, fieldArr, list) {
    let fig = figure.IsEnemy(false, false, false);
    if (figure.IsEnemy(figure.Color, fieldArr[0].Reserved, fieldArr[0].Enemy))
      moves.push(
        figure.GetFigureMoves(leftAttack, figure.Color, EMoveType.Diagonal, figure.Position, list)
      );
    if (figure.IsEnemy(figure.Color, fieldArr[1].Reserved, fieldArr[1].Enemy))
      moves.push(
        figure.GetFigureMoves(rightAttack, figure.Color, EMoveType.Diagonal, figure.Position, list)
      );
    if (!figure.IsEnemy(figure.Color, fieldArr[2].Reserved, fieldArr[2].Enemy))
      moves.push(
        ...figure.GetFigureMoves(
          sizeForMove,
          figure.Color,
          EMoveType.Horisontal,
          figure.Position,
          list
        )
      );
    return moves;
  }
}
