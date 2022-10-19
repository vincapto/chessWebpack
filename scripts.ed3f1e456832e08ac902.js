(()=>{var e={927:()=>{class e{constructor(e){this.price=0,this.stepCount=0,this.Figures=JSON.parse(JSON.stringify(e)),this.BestPices=[],this.AllPices=[]}copyArr(e){this.Figures.push(e)}MiniaxRoot(e,s){this.AllPices=[],this.BestPices=[];let o=-9999,r=[],n=new i,l=[];n.ChessFigure(),n.ChessFigureAi(this.Figures),l=n.GetAllFiguresMoves(s);let h=l[[Math.floor(Math.random()*l.length)]];for(let e=0;e<l.length;e++)l[e].Figure.Color;for(let i=0;i<l.length;i++){let h=new t(l[i].Figure,l[i].Position);n.MoveCurrentFigure(h.Figure.Position,h.Position);let a=this.Minimax(e-1,n,!s);n.Undo(),a>=o&&(this.BestPices.push(a),o=a,this.price=a,r=h)}return null!=n.GetFigureAt(r.Position)?r:h}Minimax(e,t,s){if(this.stepCount++,0==e)return this.AllPices.push(-this.EvaluateBoard(t)),-this.EvaluateBoard(t);let o=new i;if(o.ChessFigure(),o.ChessFigureAi(t),s){let t=o.GetAllFiguresMoves(!1),i=-9999;for(let r=0;r<t.length;r++)o.MoveCurrentFigure(t[r].Figure.Position,t[r].Position),i=Math.max(i,this.Minimax(e-1,o,!s)),o.Undo();return this.AllPices.push(i),i}{let t=9999,i=o.GetAllFiguresMoves(!1);for(let r=0;r<i.length;r++)o.MoveCurrentFigure(i[r].Figure.Position,i[r].Position),t=Math.min(t,this.Minimax(e-1,o,!s)),o.Undo();return this.AllPices.push(t),t}}EvaluateBoard(e){let t=0;for(let i=0;i<e.figureArray.length;i++)e.figureArray[i].IsAlive&&(t+=100*this.GetPieceValue(e.figureArray[i]));return t}GetPieceValue(e){return e.Color?-e.Dignity:e.Dignity}}class t{constructor(e,t){this.array=this.getFigureAttr(e),this.Figure=new l(this.array[0],this.array[1],this.array[2],this.array[4],this.array[3]),this.Position=new n(t.X,t.Y)}getFigureAttr(e){return[e.Color,e.IsAlive,e.Dignity,e.Position,e.IsPassed]}}class i{constructor(){this.MAX_SIZE=7,this.min=0,this.FieldReserved=[],this.roqueAcceptedMoves=[],this.copyFigureArray=[],this.copyFieldReserved=[],this.figureArray=[],this.DignitysArray=[4,2,3,5,6,3,2,4],this.SizeArr=[this.min,this.MAX_SIZE,this.min,this.MAX_SIZE]}getFigureAttr(e){let t=new n(e.Position.x,e.Position.y);return[e.Color,e.IsAlive,e.Dignity,t,e.IsPassed]}makeDeepFigure(e){let t=[];for(let i=0;i<e.length;i++){let s=this.getFigureAttr(JSON.parse(JSON.stringify(e[i])));t.push(new l(s[0],s[1],s[2],s[4],s[3]))}return t}makeDeepField(e){let t=[],i=[];for(let s=0;s<e.length;s++)i=[],t=[...e[s]];return t}ChessFigureAi(e){this.figureArray=[],this.figureArray=this.makeDeepFigure(e.figureArray),this.FieldReserved=[],this.FieldReserved=this.DeepCopyField(e.FieldReserved),this.copyFigureArray=this.DeepCopyFigure(this.figureArray),this.copyFieldReserved=this.DeepCopyField(this.FieldReserved)}ChessFigure(){let e=[];for(let t=0;t<=this.MAX_SIZE;t++){e=[];for(let t=0;t<=this.MAX_SIZE;t++)e.push(new r(!1,!1));this.FieldReserved.push(e)}this.figureArray=this.InitFigArray(!1);let t=this.InitFigArray(!0);for(let e=0;e<t.length;e++)this.figureArray.push(t[e]);return this.figureArray}findStart(){let e=0;for(let t=0;t<this.figureArray.length;t++)if(this.figureArray[t].Color){e=t;break}return e}GetAllFiguresMoves(e){let i=[],s=this.findStart(),o=e?this.figureArray.length:s;for(let r=e?s:0;r<o;r++)if(this.figureArray[r].IsAlive){let e=this.GetMoves(this.figureArray[r].Position);if(null!=e)for(let s=0;s<e.length;s++)i.push(new t(this.figureArray[r],e[s]))}return i}InitFigArray(e){let t=e?0:7,i=!e,s=!!e,h=[];for(let a=0;a<=this.MAX_SIZE;a++)h.push(new l(e,!0,o.Pawn,!1,new n(a,e?t+1:t-1))),this.FieldReserved[a][e?t+1:t-1]=new r(i,s);for(let o=0;o<=this.MAX_SIZE;o++)h.push(new l(e,!0,this.DignitysArray[o],!1,new n(o,t))),this.FieldReserved[o][t]=new r(i,s);return h}DeepCopyFigure(e){let t=[];for(let i=0;i<e.length;i++){let s=this.getFigureAttr(JSON.parse(JSON.stringify(e[i])));t.push(new l(s[0],s[1],s[2],s[4],s[3]))}return t}DeepCopyField(e){let t=[],i=[];for(let s=0;s<e.length;s++)i=[...e[s]],t.push(i);return t}Undo(){this.figureArray=this.DeepCopyFigure(this.copyFigureArray),this.FieldReserved=this.DeepCopyField(this.copyFieldReserved)}GetFigureAt(e){for(let t=0;t<this.figureArray.length;t++)if(this.figureArray[t].Position,this.figureArray[t].Position.X==e.X&&this.figureArray[t].Position.Y==e.Y&&this.figureArray[t].IsAlive)return this.figureArray[t];return null}RemoveFigureAt(e){for(let t=0;t<this.figureArray.length;t++){let i=this.figureArray[t].Position.X==e.X,s=this.figureArray[t].Position.Y==e.Y,o=this.figureArray[t].IsAlive;i&&s&&o&&this.figureArray.splice(t,1)}}Roque(e,t){return!(6!=e.Dignity||!e.IsRoque||t!=roqueAcceptedMoves[0]&&t!=roqueAcceptedMoves[1]||(rook=t.X<e.Position.X?this.GetFigureAt(new n(0,e.Position.Y)):this.GetFigureAt(new n(7,e.Position.Y)),null!=rook&&(e.IsPassed||rook.IsPassed||(roquePosition=getRoquePosition(e,rook),this.moveFigure(e,roquePosition[0]),this.moveFigure(rook,roquePosition[1]),e.IsRoque=!1)),0))}MoveCurrentFigure(e,t){let i=this.GetFigureAt(e);i.IsAlive&&(this.Roque(i,t)||this.moveFigure(i,t))}moveFigure(e,t){let i=this.GetFigureAt(t);null!=i&&i.Color!=e.Color&&this.RemoveFigureAt(t),this.FieldReserved[e.Position.X][e.Position.Y]=new r(!1,!1),e.Color?this.FieldReserved[t.X][t.Y]=new r(!1,!0):this.FieldReserved[t.X][t.Y]=new r(!0,!1),e.Position=t,e.IsPassed=!0}GetMoves(e){let t=this.GetFigureAt(e);if(null!=t)switch(t.Dignity){case o.Pawn:return this.PawnMove(this.FieldReserved,t);case o.Knight:return t.GetFigureMoves(this.SizeArr,t.Color,s.Knight,t.Position,this.FieldReserved);case o.Queen:var i=t.GetFigureMoves(this.SizeArr,t.Color,s.Diagonal,t.Position,this.FieldReserved);return i.push(...t.GetFigureMoves(this.SizeArr,t.Color,s.Horisontal,t.Position,this.FieldReserved)),i;case o.Bishop:return t.GetFigureMoves(this.SizeArr,t.Color,s.Diagonal,t.Position,this.FieldReserved);case o.Rook:return t.GetFigureMoves(this.SizeArr,t.Color,s.Horisontal,t.Position,this.FieldReserved);case o.King:return this.KingMove(this.FieldReserved,t)}return[]}getSizeArray(e,t,i){return[e.Position.X>0?e.Position.X-t:0,e.Position.X<7?e.Position.X+t:7,e.Position.Y>0?e.Position.Y-i:0,e.Position.Y<7?e.Position.Y+i:7]}GetAcceptedRoqueKingMoves(e,t,i,o,r){let n=[],l=t.Position.Y;n=t.GetFigureMoves([i,o,l,l],t.Color,s.Horisontal,t.Position,this.FieldReserved),this.checkRoque(t,e[e.length])&&(e.push(...n),this.roqueAcceptedMoves[r]=e[e.length],t.IsRoque=!0)}KingMove(e,t){let i=this.getSizeArray(t,1,1),o=[],r=i[0],l=i[1],h=i[2],a=i[3];return t.IsPassed?(o=t.GetFigureMoves([r,l,h,a],t.Color,s.Diagonal,t.Position,this.FieldReserved),o.push(...t.GetFigureMoves([r,l,h,a],t.Color,s.Horisontal,t.Position,this.FieldReserved))):(this.roqueAcceptedMoves=[new n(-99,-99),new n(-99,-99)],o=t.GetFigureMoves([r,l,h,a],t.Color,s.Diagonal,t.Position,this.FieldReserved),o.push(...t.GetFigureMoves([r,l,h,a],t.Color,s.Horisontal,t.Position,this.FieldReserved)),this.checkClearPath(t,!0)&&this.GetAcceptedRoqueKingMoves(o,t,t.Position.X-2,t.Position.X,0),this.checkClearPath(t,!1)&&this.GetAcceptedRoqueKingMoves(o,t,t.Position.X,t.Position.X+2,1)),o}checkClearPath(e,t){return t?this.checkSide(e,0,e.Position.X,e.Position.Y,3):this.checkSide(e,e.Position.X,7,e.Position.Y,2)}checkSide(e,t,i,o,r){return e.GetFigureMoves([t,i,o,o],e.Color,s.Horisontal,e.Position,this.FieldReserved).length==r}getRoquePosition(e,t){let i,s;return 7==t.Position.X?(i=new n(e.Position.X+2,e.Position.Y),s=new n(t.Position.X-2,t.Position.Y)):(i=new n(e.Position.X-2,e.Position.Y),s=new n(t.Position.X+3,t.Position.Y)),[i,s]}checkRoque(e,t){let i,s=!1;return i=t.X<e.Position.X?this.GetFigureAt(new n(0,e.Position.Y)):this.GetFigureAt(new n(7,e.Position.Y)),null!=i&&(e.IsPassed||i.IsPassed||(s=!0)),s}PawnMove(e,t){let i,s,o,r,n=this.getSizeArray(t,1,1),l=n[0],h=n[1],a=n[2],u=n[3],g=[];return t.Color?(i=[l,t.Position.X,t.Position.Y,u],s=[t.Position.X,h,t.Position.Y,u],o=[t.Position.X,t.Position.X,t.Position.Y,u],r=[e[l][u],e[h][u],e[t.Position.X][u]]):(i=[l,t.Position.X,a,t.Position.Y],s=[t.Position.X,h,a,t.Position.Y],o=[t.Position.X,t.Position.X,a,t.Position.Y],r=[e[l][a],e[h][a],e[t.Position.X][a]]),this.checkEnemy(t,g,i,s,o,r,e),t.IsPassed||this.pawnTwoStep(g,t,e),g.flat()}pawnTwoStep(e,t,i){let o=this.getSizeArray(t,1,2),r=(o[0],o[1],o[2]),n=o[3],l=[],h=[],a=[];t.Color?(l=[t.Position.X,t.Position.X,t.Position.Y,n],h=[i[t.Position.X][n],i[t.Position.X][n-1]]):(l=[t.Position.X,t.Position.X,r,t.Position.Y],h=[i[t.Position.X][r],i[t.Position.X][r+1]]),t.IsEnemy(t.Color,h[0].Reserved,h[0].Enemy)||t.IsEnemy(t.Color,h[1].Reserved,h[1].Enemy)||(a=t.GetFigureMoves(l,t.Color,s.Horisontal,t.Position,i),e.push(...a))}checkEnemy(e,t,i,o,r,n,l){return e.IsEnemy(!1,!1,!1),e.IsEnemy(e.Color,n[0].Reserved,n[0].Enemy)&&t.push(e.GetFigureMoves(i,e.Color,s.Diagonal,e.Position,l)),e.IsEnemy(e.Color,n[1].Reserved,n[1].Enemy)&&t.push(e.GetFigureMoves(o,e.Color,s.Diagonal,e.Position,l)),e.IsEnemy(e.Color,n[2].Reserved,n[2].Enemy)||t.push(...e.GetFigureMoves(r,e.Color,s.Horisontal,e.Position,l)),t}}const s=Object.freeze({Horisontal:0,Diagonal:1,Knight:2}),o=Object.freeze({Pawn:1,Knight:2,Bishop:3,Rook:4,Queen:5,King:6});class r{constructor(e,t){this.Reserved=e,this.Enemy=t}}class n{constructor(e,t){this.x=e,this.y=t}get X(){return this.x}set X(e){this.x=e}get Y(){return this.y}set Y(e){this.y=e}unequal(e,t){return e.X!=t.X||e.Y!=t.Y}equal(e,t){return e.X==t.X&&e.Y==t.Y}}class l{constructor(e,t,i,s,o){this.Color=e,this.IsAlive=t,this.Dignity=i,this.Position=o,this.IsPassed=s}Figure(e){this.Color=e.Color,this.IsAlive=e.IsAlive,this.Dignity=e.Dignity,this.Position=e.Position,this.IsPassed=e.IsPassed}Plus=(e,t,i,s)=>(i<=e&&(i+=1,this.changeItem.Start=this.changeItem.Start+1),i<=e);Minus=(e,t,i,s)=>(i>=e&&(i-=1,this.changeItem.Start=this.changeItem.Start-1),i>=e);KnightMoves=(e,t,i,s)=>0<=e&&7>=e&&0<=t&&7>=t;RightTop=(e,t,i,s)=>(i+=1,s-=1,this.changeItem.Start=this.changeItem.Start+1,this.changeItem.Unchanged=this.changeItem.Unchanged-1,i<=e&&s>=t);LeftTop=(e,t,i,s)=>(this.changeItem.Start=this.changeItem.Start-1,this.changeItem.Unchanged=this.changeItem.Unchanged-1,(i-=1)>=e&&(s-=1)>=t);RightBottom=(e,t,i,s)=>{let o=this.changeItem.Start;return o+=1,this.changeItem.Start=this.changeItem.Start+1,this.changeItem.Unchanged=this.changeItem.Unchanged+1,(i+=1)<=e&&(s+=1)<=t};LeftBottom=(e,t,i,s)=>(this.changeItem.Start=this.changeItem.Start-1,this.changeItem.Unchanged=this.changeItem.Unchanged+1,(i-=1)>=e&&(s+=1)<=t);IsEnemy(e,t,i){if(e){if(t&&!i)return!0}else if(!t&&i)return!0;return!1}IsEmptyCell(e){return!e.Reserved&&!e.Enemy}GetListOfMoves(e,t,i,s,o,r,n){switch(n){case 0:return[new h(this.Plus,r,s,0,1),new h(this.Minus,r,i,0,1),new h(this.Plus,r,t,0,0),new h(this.Minus,r,e,0,0)];case 1:return[new h(this.RightTop,r,t,i,0),new h(this.LeftTop,r,e,i,0),new h(this.RightBottom,r,t,s,0),new h(this.LeftBottom,r,e,s,0)];case 2:return[new h(this.KnightMoves,r,r.X+1,r.Y+2,2),new h(this.KnightMoves,r,r.X-1,r.Y+2,2),new h(this.KnightMoves,r,r.X+1,r.Y-2,2),new h(this.KnightMoves,r,r.X-1,r.Y-2,2),new h(this.KnightMoves,r,r.X+2,r.Y-1,2),new h(this.KnightMoves,r,r.X-2,r.Y-1,2),new h(this.KnightMoves,r,r.X+2,r.Y+1,2),new h(this.KnightMoves,r,r.X-2,r.Y+1,2)];default:return null}}GetFigureMoves(e,t,i,s,o){let r=[],l="",h=!1,a=!1,u=0,g=0,c=this.GetListOfMoves(e[0],e[1],e[2],e[3],t,s,i);for(let e=0;e<c.length;e++){let i=c[e].TypeOfIncrement;for(this.changeItem=c[e];i(c[e].FirstCondition,c[e].SecondCondition,c[e].Start,c[e].Unchanged);)if(c[e].InitXY(),u=c[e].X,g=c[e].Y,s.X!=c[e].X||s.Y!=c[e].Y){if(l=o[u][g],null==l)break;if(a=this.IsEmptyCell(l),h=this.IsEnemy(t,l.Reserved,l.Enemy),!a&&!h)break;if(r.push(new n(u,g)),h)break}}return r.flat(),r.flat()}}class h{constructor(e,t,i,s,o){this.flag=!0,this.TypeOfIncrement=e,this.Figure=t,this.FirstCondition=i,this.SecondCondition=s,this.TypeOfMove=o,this.Init(this.TypeOfMove)}GetKnightMoves(){this.flag?(this.X=this.FirstCondition,this.Y=this.SecondCondition,this.FirstCondition=-999,this.SecondCondition=-999,this.flag=!1):(this.FirstCondition=-999,this.SecondCondition=-999)}Init(e){switch(e){case 0:this.Start=this.Figure.X,this.Unchanged=this.Figure.Y;break;case 1:this.Unchanged=this.Figure.X,this.Start=this.Figure.Y}}InitXY(){switch(this.TypeOfMove){case 0:this.X=this.Start,this.Y=this.Unchanged;break;case 1:this.X=this.Unchanged,this.Y=this.Start;break;case 2:this.GetKnightMoves()}}}var a=new i,u=(new i,new class{constructor(){this.CurrentCell="",this.MovesList="",this.MovesFlag=!1,this.Turn=!0,this.AllowedToMove=!1,this.FieldList="",this.FigureList="",this.ClickedIdCell="",this.ClickedCell="",this.ActiveIdCell="",this.Game=[],this.SelectedFigure=null,this.FlagIfFigure=!1,this.RegCell=new RegExp("\\d+")}clearObject(){this.SelectedFigure=null,this.MovesList=null,this.AllowedToMove=!1,this.Turn=!0,this.ActiveIdCell=""}transformToPosition(e){let t=e.split("-")[1].split("");this.ClickedCell=new n(parseInt(t[1]),parseInt(t[0])),this.setClickedIdCell()}setClickedIdCell(){null!=this.ClickedIdCell&&(this.ClickedIdCell="cell-"+this.ClickedCell.Y+this.ClickedCell.X)}setActiveIdCell(){null!=this.SelectedFigure&&(this.ActiveIdCell="cell-"+this.SelectedFigure.Position.Y+this.SelectedFigure.Position.X)}setFigure(){let e=this.Game.GetFigureAt(this.ClickedCell);null!=e?(this.SelectedFigure=e,this.setActiveIdCell(),this.MovesList=this.Game.GetMoves(this.SelectedFigure.Position)):this.SelectedFigure=null}testElement(e){let t=null;return"cell"==e.target.parentNode.classList[0]?t=e.target.parentNode.id:this.RegCell.test(e.target.id)&&(t=e.target.id),t}testIfCell(e){let t=this.testElement(e);return null!=t?(this.transformToPosition(t),null==this.SelectedFigure&&this.setFigure(),!0):(this.SelectedFigure=null,!1)}checkIfFigure(e){let t=this.FigureList.filter((t=>t.FigurePosition.X==e.X&&t.FigurePosition.Y==e.Y));this.CurrentCell=t}comparePositions(e,t){return e.X==t.X&&e.Y==t.Y}checkMovesList(){this.MovesFlag=[];let e=!1;for(let t=0;t<this.MovesList.length;t++){if(this.comparePositions(this.MovesList[t],this.ClickedCell)){e=!0;break}e=!1}return this.comparePositions(this.ClickedCell,this.SelectedFigure.Position)&&(e=!0),e}});a.ChessFigure();let g=a.figureArray;function c(e){return"cell-"+e.Y+e.X}function d(e,t){coord={x:"",y:""};let i=(t.offsetWidth-e.offsetWidth)/2,s=(t.offsetHeight-e.offsetHeight)/2,o=e.offsetLeft-t.offsetLeft-i,r=e.offsetTop-t.offsetTop-s;return coord.x=e.offsetLeft>t.offsetLeft?-o:Math.abs(o),coord.y=e.offsetTop>t.offsetTop?-r:Math.abs(r),coord}function P(e,t){let i=c(e),s=c(t),o=document.getElementById(i).getElementsByClassName("figure")[0],r=d(o,document.getElementById(s)),{x:n,y:l}=r;return u.Turn=!1,o.animate([{transform:"translate3D(0, 0, 0)"},{transform:`translate3D(${n}px, ${l}px, 0)`}],{duration:300})}function f(e,t,i,s){var o=document.createElement("div");t.Position.X==s&&t.Position.Y==i&&(o.classList.add("figure",function(e,t){let i="";switch(e){case 1:i="pawn",i+=t?"--black":"--white";break;case 2:i="knight",i+=t?"--black":"--white";break;case 3:i="bishop",i+=t?"--black":"--white";break;case 4:i="rook",i+=t?"--black":"--white";break;case 5:i="queen",i+=t?"--black":"--white";break;case 6:i="king",i+=t?"--black":"--white"}return i}(t.Dignity,t.Color)),e.classList.add("cell--reserved"),!t.Color&&e.classList.add("player"),e.appendChild(o))}function v(){var e=document.createElement("ul");e.id="field";for(var t=0;t<8;t++)for(var i=0;i<8;i++){var s=document.createElement("li");s.classList.add("cell"),(t+i)%2==0&&s.classList.add("cell--dark"),g.forEach((e=>{f(s,e,t,i)})),s.id="cell-"+t+i,e.appendChild(s)}return e}u.Game=a;var F=new RegExp("\\d+");function y(e,t){a.MoveCurrentFigure(e,t),document.getElementById("field").remove(),document.getElementById("div1").appendChild(v())}document.getElementById("div1").appendChild(v(a.FieldReserved)),window.onclick=t=>{var i;console.log("cell? "+t.target.parentNode.id+F.test(t.target.parentNode.id)),console.log("cell"==t.target.parentNode.classList[0]),u.Turn&&u.testIfCell(t)&&null!=u.SelectedFigure&&(i=u.ActiveIdCell,document.getElementById(i).classList.add("activeCell"),u.AllowedToMove?u.checkMovesList()&&(P(u.SelectedFigure.Position,u.ClickedCell).onfinish=()=>{y(u.SelectedFigure.Position,u.ClickedCell),u.clearObject(),function(){let t=new e(a).MiniaxRoot(1,!0);P(t.Figure.Position,t.Position).onfinish=()=>{y(t.Figure.Position,t.Position),u.clearObject()}}()}):(u.checkMovesList(),function(e){if(console.log(e),0!=e.length)for(let t=0;t<e.length;t++){let i="cell-"+e[t].Y+e[t].X;console.log(i),document.getElementById(i).classList.add("aMove")}}(u.MovesList),u.AllowedToMove=!0))}}},t={};function i(s){var o=t[s];if(void 0!==o)return o.exports;var r=t[s]={exports:{}};return e[s](r,r.exports,i),r.exports}i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var s in t)i.o(t,s)&&!i.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";i(927)})()})();
//# sourceMappingURL=scripts.ed3f1e456832e08ac902.js.map