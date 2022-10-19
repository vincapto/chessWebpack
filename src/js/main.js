class CurrentCell {
  constructor() {
    this.CurrentCell = '';
    this.MovesList = '';
    this.MovesFlag = false;
    this.Turn = true;
    this.AllowedToMove = false;
    this.FieldList = '';
    this.FigureList = '';
    this.ClickedIdCell = '';
    this.ClickedCell = '';
    this.ActiveIdCell = '';
    this.Game = [];
    this.SelectedFigure = null;
    this.FlagIfFigure = false;
    this.RegCell = new RegExp('\\d+');
  }

  clearObject() {
    this.SelectedFigure = null;
    this.MovesList = null;
    this.AllowedToMove = false;
    this.Turn = true;
    this.ActiveIdCell = '';
  }

  transformToPosition(element) {
    let split = element.split('-')[1],
      coord = split.split('');
    this.ClickedCell = new FigurePosition(
      parseInt(coord[1]),
      parseInt(coord[0])
    );
    this.setClickedIdCell();
  }

  setClickedIdCell() {
    // let a = this.SelectedFigure.Position.Y + "" + this.SelectedFigure.Position.X;
    if (this.ClickedIdCell != null)
      this.ClickedIdCell =
        'cell-' + this.ClickedCell.Y + '' + this.ClickedCell.X;
  }
  setActiveIdCell() {
    // let a = this.SelectedFigure.Position.Y + "" + this.SelectedFigure.Position.X;
    if (this.SelectedFigure != null)
      this.ActiveIdCell =
        'cell-' +
        this.SelectedFigure.Position.Y +
        '' +
        this.SelectedFigure.Position.X;
  }

  setFigure() {
    let buf = this.Game.GetFigureAt(this.ClickedCell);
    if (buf != null) {
      this.SelectedFigure = buf;
      this.setActiveIdCell();
      this.MovesList = this.Game.GetMoves(this.SelectedFigure.Position);
    } else {
      this.SelectedFigure = null;
    }
  }

  testElement(e) {
    let element = null;
    if (e.target.parentNode.classList[0] == 'cell')
      element = e.target.parentNode.id;
    else if (this.RegCell.test(e.target.id)) element = e.target.id;
    return element;
  }

  testIfCell(e) {
    let element = this.testElement(e);
    if (element != null) {
      this.transformToPosition(element);
      if (this.SelectedFigure == null) this.setFigure();
      return true;
    } else {
      this.SelectedFigure = null;
      return false;
    }
  }

  checkIfFigure(position) {
    let a = this.FigureList.filter((item) => {
      return (
        item.FigurePosition.X == position.X &&
        item.FigurePosition.Y == position.Y
      );
    });
    this.CurrentCell = a;
  }

  comparePositions(a, b) {
    return a.X == b.X && a.Y == b.Y;
  }

  checkMovesList() {
    this.MovesFlag = [];
    let checkMove = false;
    for (let i = 0; i < this.MovesList.length; i++) {
      if (this.comparePositions(this.MovesList[i], this.ClickedCell)) {
        checkMove = true;
        break;
      } else {
        checkMove = false;
      }
    }
    this.comparePositions(this.ClickedCell, this.SelectedFigure.Position)
      ? (checkMove = true)
      : 0;
    return checkMove;
  }
}

class ChessAI {
  constructor(figures) {
    this.price = 0;
    this.stepCount = 0;
    // this.Figures = [];
    this.Figures = JSON.parse(JSON.stringify(figures));
    // this.Figures = Object.assign({}, figures);
    // this.Figures = [...figures];
    this.BestPices = [];
    this.AllPices = [];
  }

  copyArr(figures) {
    this.Figures.push(figures);
  }

  // ChessFigure Figures { get; }
  // public int price = 0;
  // public int stepCount = 0;
  // public ChessAI(ChessFigure figures)
  // {
  //     Figures = figures;
  // }
  // public List<int> BestPices;
  // public List<int> AllPices;

  // ChessAI(figures) {
  //   this.Figures = figures;
  // }

  MiniaxRoot(depth, color) {
    this.AllPices = [];
    this.BestPices = [];
    let bestMove = -9999,
      bestMoveFound = [],
      figures = new ChessFigure(),
      FM = [],
      a = 0;
    figures.ChessFigure();
    figures.ChessFigureAi(this.Figures);
    FM = figures.GetAllFiguresMoves(color);
    let rand = FM[[Math.floor(Math.random() * FM.length)]];
    for (let i = 0; i < FM.length; i++) if (FM[i].Figure.Color) a++;
    for (let i = 0; i < FM.length; i++) {
      let newGameMove = new FiguresMoves(FM[i].Figure, FM[i].Position);

      figures.MoveCurrentFigure(
        newGameMove.Figure.Position,
        newGameMove.Position
      );
      let value = this.Minimax(depth - 1, figures, !color);
      figures.Undo();
      if (value >= bestMove) {
        this.BestPices.push(value);
        bestMove = value;
        this.price = value;
        bestMoveFound = newGameMove;
      }
    }
    let checkFig = figures.GetFigureAt(bestMoveFound.Position);
    if (checkFig != null) return bestMoveFound;
    else return rand;
    // checkFig==null?return rand:return bestMoveFound;
    // return rand;
  }

  Minimax(depth, fig, Maximaise) {
    this.stepCount++;
    if (depth == 0) {
      this.AllPices.push(-this.EvaluateBoard(fig));
      return -this.EvaluateBoard(fig);
    }
    let figures = new ChessFigure();
    figures.ChessFigure();
    figures.ChessFigureAi(fig);

    if (Maximaise) {
      let FM = figures.GetAllFiguresMoves(false);
      let bestMove = -9999;
      for (let i = 0; i < FM.length; i++) {
        figures.MoveCurrentFigure(FM[i].Figure.Position, FM[i].Position);
        bestMove = Math.max(
          bestMove,
          this.Minimax(depth - 1, figures, !Maximaise)
        );
        figures.Undo();
      }
      this.AllPices.push(bestMove);
      return bestMove;
    } else {
      let bestMove = 9999;
      let FM = figures.GetAllFiguresMoves(false);
      for (let i = 0; i < FM.length; i++) {
        figures.MoveCurrentFigure(FM[i].Figure.Position, FM[i].Position);
        bestMove = Math.min(
          bestMove,
          this.Minimax(depth - 1, figures, !Maximaise)
        );
        figures.Undo();
      }
      this.AllPices.push(bestMove);
      return bestMove;
    }
  }

  EvaluateBoard(figArr) {
    let totalEvaluation = 0;
    for (let i = 0; i < figArr.figureArray.length; i++) {
      if (figArr.figureArray[i].IsAlive)
        totalEvaluation =
          totalEvaluation + 100 * this.GetPieceValue(figArr.figureArray[i]);
    }
    return totalEvaluation;
  }

  GetPieceValue(f) {
    return f.Color ? -f.Dignity : f.Dignity;
  }
}

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
    let arr = [
      _figure.Color,
      _figure.IsAlive,
      _figure.Dignity,
      _figure.Position,
      _figure.IsPassed,
    ];
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
    let arr = [
      _figure.Color,
      _figure.IsAlive,
      _figure.Dignity,
      pos,
      _figure.IsPassed,
    ];
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
        new Figure(
          color,
          true,
          EDignity.Pawn,
          false,
          new FigurePosition(i, color ? j + 1 : j - 1)
        )
      );
      this.FieldReserved[i][color ? j + 1 : j - 1] = new Field(reserved, enemy);
    }

    for (let i = 0; i <= this.MAX_SIZE; i++) {
      ArrayFig.push(
        new Figure(
          color,
          true,
          this.DignitysArray[i],
          false,
          new FigurePosition(i, j)
        )
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
      (acceptedPosition == roqueAcceptedMoves[0] ||
        acceptedPosition == roqueAcceptedMoves[1])
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
      if (!this.Roque(curFigure, acceptedPosition))
        this.moveFigure(curFigure, acceptedPosition);
    }
  }

  moveFigure(curFigure, acceptedPosition) {
    let enemy = this.GetFigureAt(acceptedPosition);
    if (enemy != null && enemy.Color != curFigure.Color) {
      // enemy.IsAlive = false;
      this.RemoveFigureAt(acceptedPosition);
      // this.checkKing(enemy);
    }
    this.FieldReserved[curFigure.Position.X][curFigure.Position.Y] = new Field(
      false,
      false
    );
    if (!curFigure.Color)
      this.FieldReserved[acceptedPosition.X][acceptedPosition.Y] = new Field(
        true,
        false
      );
    else
      this.FieldReserved[acceptedPosition.X][acceptedPosition.Y] = new Field(
        false,
        true
      );

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
      this.roqueAcceptedMoves = [
        new FigurePosition(-99, -99),
        new FigurePosition(-99, -99),
      ];
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
        this.GetAcceptedRoqueKingMoves(
          moves,
          figure,
          figure.Position.X - 2,
          figure.Position.X,
          0
        );
      }
      if (this.checkClearPath(figure, false)) {
        this.GetAcceptedRoqueKingMoves(
          moves,
          figure,
          figure.Position.X,
          figure.Position.X + 2,
          1
        );
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
      sizeForMove = [
        figure.Position.X,
        figure.Position.X,
        minY,
        figure.Position.Y,
      ];
      fieldArr = [
        list[minX][minY],
        list[maxX][minY],
        list[figure.Position.X][minY],
      ];
    } else {
      leftAttack = [minX, figure.Position.X, figure.Position.Y, maxY];
      rightAttack = [figure.Position.X, maxX, figure.Position.Y, maxY];
      sizeForMove = [
        figure.Position.X,
        figure.Position.X,
        figure.Position.Y,
        maxY,
      ];
      fieldArr = [
        list[minX][maxY],
        list[maxX][maxY],
        list[figure.Position.X][maxY],
      ];
    }

    this.checkEnemy(
      figure,
      moves,
      leftAttack,
      rightAttack,
      sizeForMove,
      fieldArr,
      list
    );

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
      sizeForMove = [
        figure.Position.X,
        figure.Position.X,
        minY,
        figure.Position.Y,
      ];
      fieldArr = [
        list[figure.Position.X][minY],
        list[figure.Position.X][minY + 1],
      ];
    } else {
      sizeForMove = [
        figure.Position.X,
        figure.Position.X,
        figure.Position.Y,
        maxY,
      ];
      fieldArr = [
        list[figure.Position.X][maxY],
        list[figure.Position.X][maxY - 1],
      ];
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

  checkEnemy(
    figure,
    moves,
    leftAttack,
    rightAttack,
    sizeForMove,
    fieldArr,
    list
  ) {
    let fig = figure.IsEnemy(false, false, false);
    if (figure.IsEnemy(figure.Color, fieldArr[0].Reserved, fieldArr[0].Enemy))
      moves.push(
        figure.GetFigureMoves(
          leftAttack,
          figure.Color,
          EMoveType.Diagonal,
          figure.Position,
          list
        )
      );
    if (figure.IsEnemy(figure.Color, fieldArr[1].Reserved, fieldArr[1].Enemy))
      moves.push(
        figure.GetFigureMoves(
          rightAttack,
          figure.Color,
          EMoveType.Diagonal,
          figure.Position,
          list
        )
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
      0 <= firstCondition &&
      7 >= firstCondition &&
      0 <= secondCondition &&
      7 >= secondCondition
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

  GetListOfMoves(
    minStepX,
    maxStepX,
    minStepY,
    maxStepY,
    color,
    figurePosition,
    flag
  ) {
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
    let cell = '';
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
        if (
          figurePosition.X == list[counter].X &&
          figurePosition.Y == list[counter].Y
        )
          continue;
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

  constructor(
    typeOfIncrement,
    figure,
    firstConditon,
    secondCondition,
    typeOfMove
  ) {
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

var Game = new ChessFigure();
var GameAi = new ChessFigure();
var cellObj = new CurrentCell();
Game.ChessFigure();
let mes = Game.figureArray;
// let werwerwer = Game.ChessFigure();
cellObj.Game = Game;
// let fig = mes[1];
// var ai = new ChessAI(Game);
// let bestMoveFound = ai.MiniaxRoot(2, true);

// Game.MoveCurrentFigure(bestMoveFound.Figure.Position, bestMoveFound.Position);

function transformToId(position) {
  return 'cell-' + position.Y + '' + position.X;
}

function getCoordAnim(a, b) {
  coord = { x: '', y: '' };
  let width = (b.offsetWidth - a.offsetWidth) / 2;
  let height = (b.offsetHeight - a.offsetHeight) / 2;

  let x = a.offsetLeft - b.offsetLeft - width;
  let y = a.offsetTop - b.offsetTop - height;
  coord.x = a.offsetLeft > b.offsetLeft ? -x : Math.abs(x); // /-
  coord.y = a.offsetTop > b.offsetTop ? -y : Math.abs(y);
  // alert("a " + a.offsetTop + " b" + b.offsetTop);
  return coord;
}

function animateElement(currentFigPosition, acceptedPosition) {
  let a = transformToId(currentFigPosition),
    b = transformToId(acceptedPosition);

  let animEl = document.getElementById(a).getElementsByClassName('figure')[0];
  let destination = document.getElementById(b);

  let coord = getCoordAnim(animEl, destination);
  let { x, y } = coord;
  cellObj.Turn = false;
  let animation = animEl.animate(
    [
      // keyframes
      { transform: 'translate3D(0, 0, 0)' },
      { transform: `translate3D(${x}px, ${y}px, 0)` },
    ],
    {
      // timing options
      duration: 300,
      // iterations: Infinity,
    }
  );

  return animation;
  animation.onfinish = () => {
    moveElement(currentFigPosition, acceptedPosition);
  };
}

function moveAi() {
  var ai = new ChessAI(Game);
  let bestMoveFound = ai.MiniaxRoot(1, true);

  let animation = animateElement(
    bestMoveFound.Figure.Position,
    bestMoveFound.Position
  );
  animation.onfinish = () => {
    moveElement(bestMoveFound.Figure.Position, bestMoveFound.Position);
    cellObj.clearObject();
  };

  // Game.MoveCurrentFigure(bestMoveFound.Figure.Position, bestMoveFound.Position);
  // document.getElementById("div1").appendChild(makeUL(Game.FieldReserved));
  // DrawChess();
}

function getFigureImg(dignity, color) {
  let className = '';
  switch (dignity) {
    case 1:
      className = 'pawn';
      color ? (className += '--black') : (className += '--white');
      break;
    case 2:
      className = 'knight';
      color ? (className += '--black') : (className += '--white');
      break;
    case 3:
      className = 'bishop';
      color ? (className += '--black') : (className += '--white');
      break;
    case 4:
      className = 'rook';
      color ? (className += '--black') : (className += '--white');
      break;
    case 5:
      className = 'queen';
      color ? (className += '--black') : (className += '--white');
      break;
    case 6:
      className = 'king';
      color ? (className += '--black') : (className += '--white');
      break;
  }
  return className;
}

function drawFigure(item, f, i, j) {
  var figureBlock = document.createElement('div');
  if (f.Position.X == j && f.Position.Y == i) {
    // figureBlock.appendChild(
    //   document.createTextNode(f.Position.X + "" + f.Position.Y + "" + f.Dignity)
    // );
    figureBlock.classList.add('figure', getFigureImg(f.Dignity, f.Color));
    item.classList.add('cell--reserved');
    !f.Color ? item.classList.add('player') : 0;
    // f.Position.X == j && f.Position.Y == i && f.Color
    //   ? figureBlock.appendChild(document.createTextNode(" b"))
    //   : 0;
    item.appendChild(figureBlock);
  }
}

function drawField() {
  var list = document.createElement('ul');
  list.id = 'field';
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      var item = document.createElement('li');
      item.classList.add('cell');
      if ((i + j) % 2 == 0) {
        item.classList.add('cell--dark');
      }
      mes.forEach((f) => {
        drawFigure(item, f, i, j);
      });
      item.id = 'cell-' + i + '' + j;

      list.appendChild(item);
    }
  }
  return list;
}

function writeFieldList() {
  const myNode = document.getElementById('listField');
  myNode.textContent = '';
  let array = Game.FieldReserved;
  let desc = '';
  for (var i = 0; i < array.length; i++) {
    var list = document.createElement('ul');
    for (var j = 0; j < array.length; j++) {
      desc = document.createElement('p');

      desc.appendChild(
        document.createTextNode(
          'Reserved ' + array[i][j].Reserved + ' Enemy ' + array[i][j].Enemy
        )
      );
      list.appendChild(desc);
    }
    document.getElementById('listField').appendChild(list);
  }
  document.getElementById('listField').appendChild(desc);
}
function writeFigureList() {
  const myNode = document.getElementById('listFigures');
  myNode.textContent = '';
  for (let i = 0; i < Game.figureArray.length; i++) {
    let desc = document.createElement('p');
    desc.appendChild(
      document.createTextNode(
        Game.figureArray[i].IsAlive +
          ' ' +
          Game.figureArray[i].Color +
          ' XY' +
          Game.figureArray[i].Position.X +
          ' ' +
          Game.figureArray[i].Position.Y +
          ' ' +
          Game.figureArray[i].Dignity
      )
    );
    document.getElementById('listFigures').appendChild(desc);
  }
}

var flag = false;
var curFig = '';
var aMoves = [];

var regCell = new RegExp('\\d+');

function moveElement(currentFigPosition, acceptedPosition) {
  Game.MoveCurrentFigure(currentFigPosition, acceptedPosition);
  document.getElementById('field').remove();
  document.getElementById('div1').appendChild(drawField());
}

function checkMovesList(acceptedPosition) {
  let checkMove = false;
  for (let i = 0; i < aMoves.length; i++) {
    if (aMoves[i].X == acceptedPosition.X && aMoves[i].Y == acceptedPosition.Y)
      checkMove = true;
  }
  return checkMove;
}

function drawMoves(array) {
  console.log(array);
  if (array.length != 0) {
    for (let i = 0; i < array.length; i++) {
      let pos = 'cell-' + array[i].Y + '' + array[i].X;
      console.log(pos);
      let li = document.getElementById(pos);
      li.classList.add('aMove');
    }
  }
  return array;
}

function showActiveCell(text) {
  let cell = document.getElementById(text);
  cell.classList.add('activeCell');
}

document.getElementById('div1').appendChild(drawField(Game.FieldReserved));
// document.getElementById("div1").appendChild(makeUL(Game.FieldReserved));

window.onclick = (e) => {
  console.log(
    'cell? ' + e.target.parentNode.id + regCell.test(e.target.parentNode.id)
  );
  console.log(e.target.parentNode.classList[0] == 'cell');

  if (cellObj.Turn) {
    if (cellObj.testIfCell(e)) {
      if (cellObj.SelectedFigure != null) {
        showActiveCell(cellObj.ActiveIdCell);
        if (!cellObj.AllowedToMove) {
          cellObj.checkMovesList();
          aMoves = drawMoves(cellObj.MovesList);
          cellObj.AllowedToMove = true;
        } else if (cellObj.checkMovesList()) {
          let animation = animateElement(
            cellObj.SelectedFigure.Position,
            cellObj.ClickedCell
          );
          animation.onfinish = () => {
            moveElement(cellObj.SelectedFigure.Position, cellObj.ClickedCell);
            cellObj.clearObject();

            moveAi();
          };
          // moveElement(cellObj.SelectedFigure.Position, cellObj.ClickedCell);
          // cellObj.clearObject();
        }
      }
    }
  }
};
