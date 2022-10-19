class CurrentCell {
  constructor() {
    this.CurrentCell = "";
    this.MovesList = "";
    this.MovesFlag = false;
    this.Turn = true;
    this.AllowedToMove = false;
    this.FieldList = "";
    this.FigureList = "";
    this.ClickedIdCell = "";
    this.ClickedCell = "";
    this.ActiveIdCell = "";
    this.Game = [];
    this.SelectedFigure = null;
    this.FlagIfFigure = false;
    this.RegCell = new RegExp("\\d+");
  }

  clearObject() {
    this.SelectedFigure = null;
    this.MovesList = null;
    this.AllowedToMove = false;
    this.Turn = true;
    this.ActiveIdCell = "";
  }

  transformToPosition(element) {
    let split = element.split("-")[1],
      coord = split.split("");
    this.ClickedCell = new FigurePosition(parseInt(coord[1]), parseInt(coord[0]));
    this.setClickedIdCell();
  }

  setClickedIdCell() {
    // let a = this.SelectedFigure.Position.Y + "" + this.SelectedFigure.Position.X;
    if (this.ClickedIdCell != null)
      this.ClickedIdCell = "cell-" + this.ClickedCell.Y + "" + this.ClickedCell.X;
  }
  setActiveIdCell() {
    // let a = this.SelectedFigure.Position.Y + "" + this.SelectedFigure.Position.X;
    if (this.SelectedFigure != null)
      this.ActiveIdCell =
        "cell-" + this.SelectedFigure.Position.Y + "" + this.SelectedFigure.Position.X;
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
    if (e.target.parentNode.classList[0] == "cell") element = e.target.parentNode.id;
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
      return item.FigurePosition.X == position.X && item.FigurePosition.Y == position.Y;
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
    this.comparePositions(this.ClickedCell, this.SelectedFigure.Position) ? (checkMove = true) : 0;
    return checkMove;
  }
}
