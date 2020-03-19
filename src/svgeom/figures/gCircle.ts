import {Circle, Shape} from "@svgdotjs/svg.js";
import {GeometryDraw} from "../geometryDraw";
import {gPoint} from "./gPoint";
import {gFigure} from "./gFigure";
import {texLabel} from "../texLabel";

export class gCircle extends gFigure{
    private _center: gPoint;
    private _radius: number;

    constructor(gDraw: GeometryDraw, center:gPoint, radius:number) {
        super(gDraw);
        this._center = center;
        this.svg = this.gdraw.draw.circle(this.gdraw.sizeToCanvas(radius)*2).cx(center.x).cy(center.y);
        return this;
    }

    clone = ():gCircle => {
        return new gCircle(this.gdraw, this._center, this._radius);
    };

    showCenter = ():gCircle => {
        this._center.showPoint();
        return this;
    };

    texLabelPosition = ():{x:number, y:number} => {
        return {x:this._center.x, y: this._center.y};
    };

    private _updateCenter = ():gCircle => {
        // Move the circle (the point has already been moved)
        this.svg.cx(this._center.x).cy(this._center.y);
        return this;
    };

    setCenter = (cx:number, cy:number):gCircle => {
        this._center.realX = cx;
        this._center.realY = cy;
        this._updateCenter();
        this.updateLabel();
        return this;
    };

    moveCenter = (dx:number, dy: number):gCircle => {
        this._center.realX = this._center.realX + dx;
        this._center.realY = this._center.realY + dy;
        this._updateCenter();
        this.updateLabel();
        return this;
    };

    get center(): gPoint {
        return this._center;
    }
    set center(value: gPoint) {
        this._center = value;
        // Move the circle.
        this._updateCenter();
    }

    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;
        // @ts-ignore
        this.svg.radius(this.gdraw.sizeToCanvas(this._radius));
    }
}

