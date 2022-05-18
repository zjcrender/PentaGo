enum CHESSMAN {
  BLACK = 1,
  WHITE = 2,
}

enum WINNER {
  BLACK = CHESSMAN.BLACK,
  WHITE = CHESSMAN.WHITE,
  BOTH = CHESSMAN.WHITE | CHESSMAN.BLACK
}

export enum PART {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export default class PentaGo {

  private SIZE = 6;
  private state: number[][] = [];
  private moves: Set<string> = new Set<string>();
  private chessman: CHESSMAN = CHESSMAN.BLACK;

  constructor() {
    this.init();
  }

  private init() {
    this.state = [];
    this.moves = new Set<string>();
    for (let r = 0; r < this.SIZE; r++) {
      this.state.push(Array(this.SIZE).fill(0));
      for (let c = 0; c < this.SIZE; c++) {
        this.moves.add([ r, c ].join(','));
      }
    }
  }

  public getState() {
    return this.state;
  }

  public getMoves() {
    return this.moves;
  }

  private switchChessman() {
    this.chessman = CHESSMAN.BLACK ^ CHESSMAN.WHITE ^ this.chessman;
  }

  // 检查游戏是否结束
  private checkWinner(): WINNER {
    const reg = /(1|2)\1{4}/;
    let winner = 0;

    let str = '';
    // 横向
    for (let r = 0; r < this.SIZE; r++) {
      str = this.state[r].join('');
      if (reg.test(str)) winner |= Number(RegExp.$1);
    }
    // 纵向
    for (let c = 0; c < this.SIZE; c++) {
      for (let r = 0; r < this.SIZE; r++) str += this.state[r][c];
      if (reg.test(str)) winner |= Number(RegExp.$1);
    }
    // 左上->右下
    let begins = [ [ 0, 1 ], [ 0, 0 ], [ 1, 0 ] ];
    for (let [ r, c ] of begins) {
      for (; r < this.SIZE && c < this.SIZE; r++, c++) str += this.state[r][c];
      if (reg.test(str)) winner |= Number(RegExp.$1);
    }
    // 右上->左下
    begins = [ [ 0, 4 ], [ 0, 5 ], [ 1, 5 ] ];
    for (let [ r, c ] of begins) {
      for (; r >= 0 && c >= 0; r--, c--) str += this.state[r][c];
      if (reg.test(str)) winner |= Number(RegExp.$1);
    }

    return winner;
  }

  // --------- 旋转相关 -----------
  private swap(Ra: number, Ca: number, Rb: number, Cb: number) {
    [
      this.state[Ra][Ca],
      this.state[Rb][Cb],
    ] = [
      this.state[Rb][Cb],
      this.state[Ra][Ca],
    ]
  }

  private upsideDown(Dr: number, Dc: number) {
    const n = this.SIZE / 2;
    for (let r = 0; r < Math.floor(n / 2); r++) {
      for (let c = 0; c < n; c++) {
        this.swap(r + Dr, c + Dc, n - 1 - r + Dr, c + Dc);
      }
    }
  }

  private rotateLeft(Dr: number, Dc: number) {
    const n = this.SIZE / 2;
    this.upsideDown(Dr, Dc);
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n - 1 - r; c++) {
        this.swap(r + Dr, c + Dc, n - 1 - c + Dc, n - 1 - r + Dr)
      }
    }
  }

  private rotateRight(Dr: number, Dc: number) {
    const n = this.SIZE / 2;
    this.upsideDown(Dr, Dc);
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < r; c++) {
        this.swap(r + Dr, c + Dc, c + Dc, r + Dr)
      }
    }
  }

  private rotate(part: PART, left: boolean) {
    let Dr, Dc;
    switch (part) {
      case PART.A:
        Dr = 0, Dc = 0;
        break;
      case PART.B:
        Dr = 0, Dc = 3;
        break;
      case PART.C:
        Dr = 3, Dc = 0;
        break;
      case PART.D:
        Dr = 3, Dc = 3;
        break;
    }
    left ? this.rotateLeft(Dr, Dc) : this.rotateRight(Dr, Dc);
  }

  // ------- 旋转相关 END -----------

  public move(row: number, col: number, part: PART, left: boolean) {
    if (row < 0 || row > this.SIZE || col < 0 || col > this.SIZE) throw new Error('坐标范围错误');
    const coodKey = [ row, col ].join(',');
    if (!this.moves.has(coodKey)) throw new Error('该点已有棋子');

    // 落子
    this.state[row][col] = this.chessman;
    this.moves.delete(coodKey);
    let winner = this.checkWinner();
    if (winner !== 0) return this.gameOver(winner);

    // 旋转棋盘
    this.rotate(part, left);
    winner = this.checkWinner();
    if (winner !== 0) return this.gameOver(winner);
    if (this.moves.size === 0) return this.gameOver(WINNER.BOTH);

    // 变更角色
    this.switchChessman();
  }

  private gameOver(winner: WINNER) {
    switch (winner) {
      case WINNER.WHITE:
        console.log('白棋胜');
        break;
      case WINNER.BLACK:
        console.log('黑棋胜');
        break;
      case WINNER.BOTH:
        console.log('平局');
        break;
    }
    return winner;
  }

}