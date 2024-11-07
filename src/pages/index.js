import { Slot, Board } from '../components/board.js';
import { Component, IntCirc } from '../components/comp.js';
import { LineDraw } from '../components/linedraw.js';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { DndContext} from '@dnd-kit/core';
import { SlotDroppable, CompDraggable } from '../components/dragndrop.js';
import './index-styles.css';



// Clickable DOM elements to represent cutting the copper strips, severing the row connection
const StripCut = ({ height })=>{
    // Using HTML and CSS to create toggleable cuts
    return (
        <label className='stripCut' style={{height: height}}>
            <input type='checkbox'/>
            <span className='stripCheck'></span>
        </label>
    );
};

function Index(){

    //Board settings, with default values
    const [rows, setRows] = useState(10);
    const [cols, setCols] = useState(20);
    const [rowHeight, setRowHeight] = useState(10);
    const [board, setBoard] = useState(new Board(cols, rows));
    const boardRef = useRef(0);

    //Drag-and-drop logic
    const [slots, setSlots] = useState({});
    const [comps, setComps] = useState({});
    const [numComps, setNumComps] = useState(0);
    const lines = useRef({});

    /***************************/
    /* ---- DRAG HANDLERS ---- */
    /***************************/

    //Rendering line movements
    function handleDragMove(event){
        const {active} = event;
        const lineId = parseInt(active.id.substr(1));
        lines.current[lineId].update();
    }
    
    //Rendering and updating for slot placements
    function handleDragEnd(event) {

        //Component is 'active', slot is 'over'. 
        const {over, active} = event;
        
        //Storing some important values as const
        const compInd= parseInt(active.id.substr(1));
        const oldSlot = active.id[0] === 'i' ? comps[compInd].in : comps[compInd].out; 

        //Drop into slot
        if(over){
            //Would have put this with the rest of the const values, but over can be null
            const ind = parseInt(over.id.substr(1));

            //Collect a copy of slots for modification
            let newSlots = {...slots};

            //Check that oldSlot is not null and is not the same slot, then delete the slot
            if(oldSlot !== null && oldSlot !== ind){
                delete newSlots[oldSlot];
            }

            //Set new slot
            newSlots[ind] = active.id;
            setSlots(newSlots);

            //Backwards reference, so component can be removed from old space
            let prevComp = comps[compInd];

            setComps((prev) => ({
                ...prev,
                [compInd] : active.id[0] === 'i' ? new Component(ind,prevComp.out) : new Component(prevComp.in, ind)
            }));
        }

        //If no slot, reset terminal to homebase
        else{

            //Only worth doing if the component was plugged into a slot
            if(oldSlot !== null){

                //Delete old slot data
                let newSlots = {...slots};
                delete newSlots[oldSlot];
                setSlots(newSlots);
                
                //Collect the old component data
                let prevComp = comps[compInd]

                //Set the relevant terminal to null
                setComps((prev) =>({
                    ...prev,
                    [compInd] : active.id[0] === 'i' ? new Component(null, prevComp.out) : new Component(prevComp.in, null)
                }));
        }}

        //TODO: update lines on drop from null-to-null
        lines.current[compInd].update();
    };

    /*********************************************/
    /* ---- DRAG N DROP COMPONENT RENDERING ---- */
    /*********************************************/

    //Special const function for rendering on droppables with minimal writing.
    const dragRender = (id) => (
        <CompDraggable id={id} className={id[0] === 'i' ? 'wire_1' : 'wire_2'}/>
    );

    //Set a new board size
    const resetBoard = () => {
        //TODO
        console.log(boardRef.current.clientHeight / rows);
    };

    //Create new components, append them to the components list, and render their terminals
    function newComp(){
        setComps((prev) => ({
            ...prev,
            [numComps] : new Component()
        }));
        setNumComps(numComps + 1);
    };

    //Set lines in a single object ref, so positions can be updated as necessary (ie: on delete)
    function setLineRef(el, key){
        if (el){
            lines.current[key] = el;
        }
    };

    //Update all line positions, necessary after deletion
    function updateLines(){
        let keys = Object.keys(lines.current)
        for(let i = 0; i < keys.length; i++){
            lines.current[keys[i]].update();
        }
    }

    function delComp(id){
        
        //Acquire component terminals
        const termIn = comps[id].in;
        const termOut = comps[id].out;
        
        //Clear slots containing the terminals
        if(termIn){
            setSlots((prev) => ({
            ...prev,
            [termIn] : null
        }));};
        if(termOut){
            setSlots((prev) => ({
            ...prev,
            [termOut] : null
        }));};

        //Remove component from comps, by deleting the attribute from a copied set
        let newComps = {...comps};
        delete newComps[id];

        //Delete the line ref
        delete lines.current[id];

        //Set the new comps, forcing a rerender
        setComps(newComps);
    }

    /*******************/
    /* ---- HOOKS ---- */
    /*******************/

    //Had some weird issue with slots state as an Object, force it to an Object synchronously on render
    useLayoutEffect(() => {
        setSlots({});
    }, []);
    
    //On any render, calculate the height of rows
    useEffect(()=>{
        setRowHeight(boardRef.current.clientHeight / rows);
    });

    //Reading the slots on update, for debugging
    useEffect(()=>{
        console.log("slots");
        console.log(slots);
    }, [slots]);
    
    //Reading comps on update, for debugging
    useEffect(()=>{
        console.log("components");
        console.log(comps);

        //Adding this here and in onDragMove ended up working better.
        updateLines();
    }, [comps])

    /********************/
    /* ---- RENDER ---- */
    /********************/

    return(
        <DndContext style={{position: 'absolute'}} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
            <div className='bkgrnd'></div>
            <div className='inputs'>
                <label htmlFor='row_in'>Rows: </label>
                <input type='number' id='row_in' name='row_in' defaultValue={rows} onChange={e => setRows(parseInt(e.target.value))} min={1} max={40}/>
                <input type='button' value="Set Board" onClick={e => resetBoard()}/><br/>
                <label htmlFor='col_in'>Slots per row: </label>
                <input type='number' id='col_in' name='col_in' defaultValue={cols} onChange={e => setCols(parseInt(e.target.value))} min={1} max={40}/><br/>
                <input type='button' value='Add component' onClick={e => newComp()}/>
                <button onClick={updateLines}>Update Lines</button>
            </div>
            <div className='brd' ref={boardRef}>
                {board.rows.map((row, rindex) => (
                    <div className='row' key={rindex} id={'r'+rindex} style={{height: `${rowHeight}px`}}>
                        {row.map((slot, index) => (
                            <>
                                <SlotDroppable key={index} id={'s'+(index + 1 + (rindex * cols))} style={{width: `${rowHeight-10}px`}}>
                                    {slots[(index + 1 + (rindex * cols))] ?  dragRender(slots[(index + 1 + (rindex * cols))]) : null}
                                </SlotDroppable>
                                { Object.keys(row).length !== index + 1 ? StripCut(rowHeight) : null }
                            </>
                        ))}
                    </div>
                ))}
            </div>
                <div className='homebase'>
                {Object.keys(comps).map((id) => (
                    <div key={id} className='compHome' id={'ch'+id}> <p style={{color: 'white'}}>{id}</p>
                        {comps[id].in === null ? dragRender('i' + id) : null}
                        <br/> 
                        {comps[id].out === null? dragRender('o' + id) : null}<br/>
                        <button onClick={() => delComp(id)} className='delButton'>DELETE</button>
                    </div>))}
                <svg>
                    {Object.keys(comps).map((id) => (
                        <LineDraw key={id} id={id} ref={(el) => setLineRef(el, id)} term1={'i' + id} term2={'o' + id}/>
                    ))}
                </svg>
                </div>
        </DndContext>
    );
}
export default Index;