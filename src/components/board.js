class Slot{
    constructor(){
        this.conn = null;
    }
    //Insert a component
    plug(comp){
    if(this.conn !== null){
        this.conn=comp;
    }
    }
    //Remove a component
    unplug(){
        this.conn=null;
    }
}

class Board {
    //x is the number of slots per strip, y is the number of strips
    constructor(x,y){
        this.rows = new Array();
        for(let i=0; i < y; i++){
            //create the strips of slots
            this.rows.push(Array.from({ length: x }, () => new Slot()));
        }
    }/* 
    //Create a cut in strip y after hole x
    cut(x,y){
        if(this.rows[y][x] !== '/'){
            this.rows[y].splice(x, 0, '/');
        }
    }
    //Undo a cut
    mend(x,y){
        if(this.rows[y][x] === '/'){
            this.rows[y].splice(x,1);
        }
    } */
}

export {Slot, Board};