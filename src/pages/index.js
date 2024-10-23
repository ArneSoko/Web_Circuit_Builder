import { Slot, Board } from '../components/board.js';
import { Component } from '../components/comp.js';
import { useEffect, useState, useRef } from 'react';
import LineTo from 'react-lineto';
import { useDroppable, useDraggable, DndContext} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import './index-styles.css';

function SlotDroppable(props){
    const {isOver, setNodeRef} = useDroppable({
        id: props.id,
    });
    return(
        <div ref={setNodeRef} style={props.style} className='slot'>
            {props.children}
        </div>
    );
}

function CompDraggable(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    position: 'absolute'
  };
  
  return (
    <div className={props.className} ref={setNodeRef} style={style} {...listeners} {...attributes}></div>
  );
}

function Index(){
    //Board settings, with default values
    const [rows, setRows] = useState(10);
    const [cols, setCols] = useState(20);
    const [rowHeight, setRowHeight] = useState(10);
    const [board, setBoard] = useState(new Board(cols, rows));
    const boardRef = useRef(0);

    //Drag-and-drop logic
    const [parent, setParent] = useState(null);
    
    function handleDragEnd(event) {
        const {over} = event;
        console.log(over);
        setParent(over ? over.id : null);
    }
    
    const draggable = (
        <CompDraggable id='1' className='wire_1' />
    )

    //Component position
    const [x1, setX1] = useState(100);
    const [x2, setX2] = useState(200);
    const [y1, setY1] = useState(10);
    const [y2, setY2] = useState(20);
    

    var comps = [];
    comps.push(new Component(x1, x2, y1, y2));

    const resetBoard = () => {
        console.log(boardRef.current.clientHeight / rows);
    }

    useEffect(() => {
        setRowHeight(boardRef.current.clientHeight / rows)
    });

    

    
    return(
        <DndContext style={{position: 'absolute'}} onDragEnd={handleDragEnd}>
            <div className='bkgrnd'></div>
            <div className='inputs'>
                <label htmlFor='row_in'>Rows: </label>
                <input type='number' id='row_in' name='row_in' defaultValue={rows} onChange={e => setRows(parseInt(e.target.value))} min={1} max={40}/>
                <input type='button' value="Set Board" onClick={e => resetBoard()}/><br/>
                <label htmlFor='col_in'>Slots per row: </label>
                <input type='number' id='col_in' name='col_in' defaultValue={cols} onChange={e => setCols(parseInt(e.target.value))} min={1} max={40}/>
                
            </div>
            <div className='brd' ref={boardRef}>
                {board.rows.map((row, rindex) => (
                    <div className='row' key={rindex} id={'r'+rindex} style={{height: `${rowHeight}px`}}>
                        {row.map((slot, index) => (
                            <SlotDroppable key={index} id={'s'+(index + 1 + (rindex * cols))} style={{width: `${rowHeight-10}px`}}>
                                {parent === 's'+(index + 1 + (rindex * cols)) ? draggable : null}
                            </SlotDroppable>
                        ))}
                    </div>
                ))}
            </div>
            {parent === null ? draggable : null}
        </DndContext>
    );
}
export default Index;