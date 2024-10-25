//Integrated circuits. Like OpAmps.
class IntCirc{
    //Only needs the raw position, pins don't move.
    constructor(x=null){
        //The only thing that needs to be recorded is the 1st pin. The rest are handled in rendering.
        this.x = x;
    }
}

class Component{
    //Input is the x and y coordinate of terminals 1 and 2. 
    constructor(x1=null,x2=null){
        //input terminal coordinates. Designation of "in" and "out" are primarily for orientation in rendering.
        this.in=x1;
        this.out=x2;
    }
    plugIn(terminal){
        this.in=terminal;
    }
    plugOut(terminal){
        this.out=terminal;
    }
}
export { IntCirc, Component };