import {GeometryDraw} from "../geometryDraw";
import {gFigure} from "./gFigure";

export class gPoint extends gFigure{
    /**
     * _realyX is the X coordinate using the e1, e2 axis
     */
    private _realX: number;
    /**
     * _realY is the Y coordinate using the e1, e2 axis
     */
    private _realY: number;
    /**
     * x is the x axis pixel coordinates
     */
    private _x: number;
    /**
     * y is the y axis pixel coordinates
     */
    private _y:number;
    /**
     * Pixels coordinate of a phantom point, used as reference for placing the label
     */
    private _phantom:{x: number, y:number}

    constructor(gDraw:GeometryDraw, x:number, y:number, label?:string) {
        super(gDraw);

        this.realX = +x;
        this.realY = +y;

        // Set the label if given.
        this.label = label===undefined?'':label;

        // Update the point data
        this._updatePoint();
        return this;
    }

    clone = ():gPoint => {
        return new gPoint(this.gdraw, this.realX, this.realY, this.label);
    };


    private _updatePoint = ():gPoint => {
        // Convert the realXY coordinates to pixels.
        const XY = this.gdraw._XYToCanvas({x: this._realX, y: this._realY});
        // Get the deltas
        const dx = XY.x - this._x,
            dy = XY.y - this._y;

        // Update the new pixels position
        this._x = XY.x;
        this._y = XY.y;

        // Move the path
        if(this.svg!==undefined) {
            this.svg.dmove(dx, dy);
        }

        return this;
    };

    /**
     * Shoe the point as a cross
     */
    showPoint = ():gPoint => {
        if(this.svg === undefined) {
            this.svg = this.gdraw.draw.path(`M${this.x - 3},${this.y - 3}L${this.x + 3},${this.y + 3}M${this.x + 3},${this.y - 3}L${this.x - 3},${this.y + 3}`).stroke('black');
        }else{
            this.svg.show();
        }
        return this;
    };

    /**
     * Hide the point cross path
     */
    hidePoint = ():gPoint => {
        if(this.svg!==undefined){this.svg.hide();}
        return this;
    };

    /**
     * Calculate the label position. It depends of the point.
     */
    texLabelPosition = ():{x:number, y:number} => {
        return {x: this.x, y: this.y};
    };

    /**
     * Define the offset
     */
    texLabelOffset = ():{x: number, y:number, anchor: string}|string => {
        if(this._phantom===undefined){return 'bl';}

        const dx = this._phantom.x - this.x,
            dy = this._phantom.y - this.y,
            norme = Math.sqrt(dx*dx+dy*dy),
            mp = this.gdraw.getMidPointAsPixel(this._phantom, this);

        return {
            x: dy/norme*10,
            y: - dx/norme*10,
            anchor: `${dy>=0?'l':'r'}${-dx<=0?'b':'t'}`
        };
    };


    // Getter and setter
    get realXY():{x:number, y:number}{
        return {x: this._realX, y: this._realY};
    }

    set realXY(value:{x:number,y:number}){
        this._realX = value.x;
        this._realY = value.y;
        this._updatePoint();
    }

    get realX(): number {
        return this._realX;
    }

    set realX(value: number) {
        this.realXY = {x: value, y: this._realY};
    }

    get realY(): number {
        return this._realY;
    }

    set realY(value: number) {
        this.realXY = {x: this._realX, y: value};
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get phantom(): { x: number; y: number } {
        return this._phantom;
    }

    set phantom(value: { x: number; y: number }) {
        this._phantom = value;
        this.texLabel.offset = this.texLabelOffset();
    }
}