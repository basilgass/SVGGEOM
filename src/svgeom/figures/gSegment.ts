import {Marker} from "@svgdotjs/svg.js";
import {GeometryDraw} from "../geometryDraw";
import {gPoint} from "./gPoint";
import {gFigure} from "./gFigure";

export class gSegment extends gFigure{
    /**
     * Start point (gPoint) of the segmenet
     */
    private _start: gPoint;
    /**
     * End point (gPoint) of the segment
     */
    private _end: gPoint;
    /**
     * Default marker (arrow for example)
     */
    private _marker: Marker|null;

    constructor(gDraw: GeometryDraw, start: gPoint, end: gPoint, endMarker?:Marker) {
        super(gDraw);

        // Define the start and end of the segment.
        this._start = start;
        this._end = end;

        // Create the svg path
        let line = this.gdraw.draw.line(start.x, start.y, end.x, end.y).stroke('black');

        // Add the marker
        this._marker = endMarker;
        if(this._marker!==undefined){
            line.marker('end', this._marker);
        }

        this.svg = line;
        return this;
    }

    clone = ():gSegment => {
        return new gSegment(this.gdraw, this._start, this._end);
    };

    /**
     * (override default) Set the label according to the extremities or the label value.
     */
    texLabelString = () => {
        if(this.label === '') {
            if (this._start.label !== '' && this._end.label !== '') {
                return this._start.label + this._end.label;
            } else {
                return '';
            }
        }else{
            return this.label;
        }
    };
    /**
     * Place the label to the midpoint of the segment.
     */
    texLabelPosition = ():{x:number, y:number} => {
        return this.getMidPoint(true);
    };
    /**
     * Define the position relative to the midpoint.
     */
    texLabelOffset = ():string|{x:number, y:number, anchor:string} => {
        const dx = this._end.x - this._start.x,
            dy = this._end.y - this._start.y,
            norme = Math.sqrt(dx*dx+dy*dy),
            mp = this.getMidPoint(true);

        return {
            x: dy/norme*10,
                y: - dx/norme*10,
                anchor: `${dy>=0?'l':'r'}${-dx<=0?'b':'t'}`
        };
    };

    /**
     * Get the midpoint coordinate in real AXIS coordinates.
     */
    getMidPoint = (asPixel?:boolean):{x: number, y:number} => {
        return this.gdraw.getMidPoint(this._start, this._end, asPixel);
    };
    showExtremities = () => {
        this._start.showPoint();
        this._end.showPoint();
    };
    showExtremitiesLabels = () => {
        let MP = this.getMidPoint(true);
        this._start.phantom = MP;
        this._start.showLabel();

        this._end.phantom = {
            x: MP.x + this._end.x-this._start.x,
            y: MP.y + this._end.y-this._start.y
        };
        this._end.showLabel();
    };
}

