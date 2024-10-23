//Integrated circuits. Like OpAmps.
class IntCirc{
    //Only needs the raw position, pins don't move.
    constructor(x=0, y=0){
        this.x=x;
        this.y=y;
    }
}

class Component{
    //Input is the x and y coordinate of terminals 1 and 2. 
    constructor(x1=0,x2=1,y1=1,y2=2){
        //input terminal coordinates. Designation of "in" and "out" are primarily for orientation in rendering.
        this.in=[x1,y1];
        this.out=[x2,y2];
    }
    //t is a boolean value. If True, then we are moving the "in" terminal. x and y are the new coordinates.
    move(t, x, y){
        if(t){
            this.in=[x,y];
        }
        else{
            this.out=[x,y];
        }
    }
}
export { IntCirc, Component };