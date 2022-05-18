import React, { FC, useState } from "react";
import S from './index.module.scss';

type BoardProps = {}

function renew() {
  return Array(3).fill(0).map(_ => Array(3).fill(0));
}

const Board: FC<BoardProps> = props => {

  const [ state, setState ] = useState<number[][]>(renew());

  const updateState = (r: number, c: number) => () => {
    state[r][c] = 1;
    setState([ ...state ]);
  }

  return (
    <div className={ S.partWrapper }>
      {
        state.map((row, rowIdx) => row.map((value, colIdx) => {
          return (
            <div
              key={ `${ rowIdx }-${ colIdx }` }
              className={ S.circle }
              onClick={ updateState(rowIdx, colIdx) }
            >
            </div>
          )
        }))
      }
    </div>
  )
}

export default Board;