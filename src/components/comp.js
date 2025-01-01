//Integrated circuits and transistors. Like OpAmps.
class IntCirc{
    //Only needs the raw position, pins don't move.
    constructor(x=null, type="chip", name){
        //The only thing that needs to be recorded is the 1st pin. The rest are handled in rendering.
        this.x = x;

        //Component type (Chip or transistor)
        this.type=type;

        //Label. If blank, set type as name.
        if(name === null){
            this.name=type;
        }else{
            this.name=name;
        }
    }
}

class Component{
    //Input is the x and y coordinate of terminals 1 and 2. 
    constructor(x1=null,x2=null, type='wire',name){
        //Terminal plug-in locations. Designation of "in" and "out" are primarily for orientation in rendering.
        this.in=x1;
        this.out=x2;

        //Component type (ie: wire, diode, capacitor, etc), default is wire
        this.type=type;

        //Component label. Checking if the property was given, if left blank, the type will be assigned.
        //Probably don't need the '=== null' check, but I have had grief in the past.
        if(name === null){
            this.name=type;
        }else{
            this.name=name;
        }
    }
    plugIn(terminal){
        this.in=terminal;
    }
    plugOut(terminal){
        this.out=terminal;
    }
}
export { IntCirc, Component };