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

      figures.MoveCurrentFigure(newGameMove.Figure.Position, newGameMove.Position);
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
        bestMove = Math.max(bestMove, this.Minimax(depth - 1, figures, !Maximaise));
        figures.Undo();
      }
      this.AllPices.push(bestMove);
      return bestMove;
    } else {
      let bestMove = 9999;
      let FM = figures.GetAllFiguresMoves(false);
      for (let i = 0; i < FM.length; i++) {
        figures.MoveCurrentFigure(FM[i].Figure.Position, FM[i].Position);
        bestMove = Math.min(bestMove, this.Minimax(depth - 1, figures, !Maximaise));
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
        totalEvaluation = totalEvaluation + 100 * this.GetPieceValue(figArr.figureArray[i]);
    }
    return totalEvaluation;
  }

  GetPieceValue(f) {
    return f.Color ? -f.Dignity : f.Dignity;
  }
}
