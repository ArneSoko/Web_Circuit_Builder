import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

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
        <div id={props.id} className={props.className} ref={(node) => {
            setNodeRef(node);
        }} style={style} {...listeners} {...attributes}></div>
    );
}
export { SlotDroppable, CompDraggable };