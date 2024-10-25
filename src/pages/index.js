import { Slot, Board } from '../components/board.js';
import { Component, IntCirc } from '../components/comp.js';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import LineTo from 'react-lineto';
import { useDroppable, useDraggable, DndContext} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import './index-styles.css';

function SlotDroppable(props){
    const {setNodeRef} = useDroppable({
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
    const [slots, setSlots] = useState({});
    const [comps, setComps] = useState({});

    function handleDragEnd(event) {
        const {over, active} = event;
        if(over){
            const ind = parseInt(over.id.substr(1));
            let newSlots = slots;
            newSlots[ind] = active.id;
            const compInd= parseInt(active.id.substr(1));
            const oldSlot = active.id[0] === 'i' ? comps[compInd].in : comps[compInd].out; 
            //Set new slot, remove old slot
            setSlots((prev) => ({
                ...prev,
                [ind]: active.id,
                [oldSlot]: null
            }));

            //Backwards reference, for removing from old space
            let prevComp = comps[compInd];
            setComps((prev) => ({
                ...prev,
                [compInd] : active.id[0] === 'i' ? new Component(ind,prevComp.out) : new Component(prevComp.in, ind)
            }));
        }
        else{
            console.log('null');
        }
    };
    
    const draggableOne = (id) => (
        <CompDraggable id={id} className='wire_1' />
    );
    const draggableTwo = (id) => (
        <CompDraggable id={id} className='wire_2' />
    );
    
    const dragRender = (id) => (
        id[0] === 'i' ? draggableOne(id) : draggableTwo(id)
    );

    const resetBoard = () => {
        console.log(boardRef.current.clientHeight / rows);
    };

    //Create new components, append them to the components list, and render their terminals
    function newComp(){
        setComps((prev) => ({
            ...prev,
            [Object.keys(prev).length] : new Component()
    }));
        //TODO: render new terminals
    };

    useLayoutEffect(() => {
        setSlots({});
    }, []);
    useEffect(()=>{
        setRowHeight(boardRef.current.clientHeight / rows);
    });

    //Reading the slots on update, for debugging
    useEffect(()=>{
        console.log(slots);
        console.log(comps)
    }, [slots, comps]);


    return(
        <DndContext style={{position: 'absolute'}} onDragEnd={handleDragEnd}>
            <div className='bkgrnd'></div>
            <div className='inputs'>
                <label htmlFor='row_in'>Rows: </label>
                <input type='number' id='row_in' name='row_in' defaultValue={rows} onChange={e => setRows(parseInt(e.target.value))} min={1} max={40}/>
                <input type='button' value="Set Board" onClick={e => resetBoard()}/><br/>
                <label htmlFor='col_in'>Slots per row: </label>
                <input type='number' id='col_in' name='col_in' defaultValue={cols} onChange={e => setCols(parseInt(e.target.value))} min={1} max={40}/><br/>
                <input type='button' value='Add component' onClick={e => newComp()}/>
                
            </div>
            <div className='brd' ref={boardRef}>
                {board.rows.map((row, rindex) => (
                    <div className='row' key={rindex} id={'r'+rindex} style={{height: `${rowHeight}px`}}>
                        {row.map((slot, index) => (
                            <SlotDroppable key={index} id={'s'+(index + 1 + (rindex * cols))} style={{width: `${rowHeight-10}px`}}>
                                {/*parent === 's'+(index + 1 + (rindex * cols)) ? draggableOne('1') : null*/}
                                {slots[(index + 1 + (rindex * cols))] ?  dragRender(slots[(index + 1 + (rindex * cols))]) : null}
                            </SlotDroppable>
                        ))}
                    </div>
                ))}
            </div>
                <div className='homebase'>
                {Object.keys(comps).map((id) => (
                    <div key={id}>
                        {comps[id].in === null ? draggableOne('i' + id) : null}
                        <br/> 
                        {comps[id].out === null ? draggableTwo('o' + id) : null}
                    </div>))}
                </div>
        </DndContext>
    );
}
export default Index;