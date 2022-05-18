import React, { useEffect, useRef, useState } from 'react';
import Board from "./components/Board";
import Go from "./PentaGo";
import S from './App.module.scss';


const PentaGo: React.FC = () => {
  const ref = useRef<Go>();

  const [ state, setState ] = useState<number[][]>();

  useEffect(() => {
    ref.current = new Go();
    setState(ref.current!.getState());
  }, []);

  return (
    <div className={ S.gameWrapper }>
      <Board/><Board/>
      <Board/><Board/>
    </div>
  )
}

export default PentaGo;
