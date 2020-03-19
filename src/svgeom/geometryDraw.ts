import {Svg, Marker, Point, off} from '@svgdotjs/svg.js'
import {gPoint} from "./figures/gPoint";
import {gCircle} from "./figures/gCircle";
import {gSegment} from "./figures/gSegment";
import {gGrid} from "./grid";
import {texLabel} from "./texLabel";
import {makeLogger} from "ts-loader/dist/logger";

export class GeometryDraw {
    private _draw: Svg;
    private _container: HTMLElement;
    private _arrow: Marker;
    private _arrowScale: number;
    private _xAxis: {x:number, y:number};
    private _yAxis: {x:number, y:number};
    private _origin: {x: number, y:number};
    private _texLayer: HTMLElement;
    private _constructionList: any[];

    private _gOrigin: gPoint;
    private _gGrid: gGrid;
    private _gAxis: gSegment[];

    constructor(draw: Svg, xAxis?: number, yAxis?: number) {
        this._draw = draw;
        this._container = this._draw.node.parentElement;

        // Create the tex layer.
        this.texLayer();

        this.arrowScale = 10;
        this._xAxis = new Point(xAxis === undefined ? 72 : xAxis, 0);
        this._yAxis = new Point(0, yAxis === undefined ? 72 : yAxis);
        this._origin = {x:0, y:0};

        this._constructionList = [];
        return this;
    }

    // Create a layer for tex data.
    texLayer = ():void => {
        this._container.style.position = 'relative';
        //this._container.style.width = this._draw.width().toString();
        //this._container.style.height = this._draw.height().toString();

        this._draw.node.style.position = 'absolute';
        this._draw.node.style.left = '0';
        this._draw.node.style.right = '0';
        this._draw.node.style.width = this._draw.width().toString();
        this._draw.node.style.height = this._draw.height().toString();

        this._texLayer = document.createElement('div');
        this._texLayer.id = `${this._draw.id()}-texLayer`;
        this._texLayer.style.position = 'absolute';
        this._texLayer.style.left = '0';
        this._texLayer.style.top = '0';
        this._texLayer.style.width = this._draw.width().toString();
        this._texLayer.style.height = this._draw.height().toString();
        this._texLayer.style.zIndex = this._draw.node.style.zIndex + 10;
        this._container.appendChild(this._texLayer);
    };
    texElement = (tex?:string, pos?:{x:number, y:number}, offset?:{x:number, y:number, anchor:string}|string):texLabel => {
        return new texLabel(this._texLayer, tex, pos, offset);
    };

    // Mathematical function
    // Display functions
    showOrigin = (label='O', pos:string|{x:number, y:number} = 'bl'): GeometryDraw => {
        this._gOrigin = new gPoint(this, 0, 0, label ).showPoint();
        this._gOrigin.showLabel();
        // let OPixel = this._AxesToCanvas(new Point(0, 0));
        // return this._draw.circle(4).center(OPixel.x, OPixel.y).stroke('black').fill('black')
        return this;
    };
    showAxis = (): GeometryDraw => {
        this._gAxis = [
            this.addVector(this.addPoint(0,0), this.addPoint(1, 0)),
            this.addVector(this.addPoint(0,0), this.addPoint(0, 1))
        ];

        return this;
    };
    showGrid = (dimensions?: { x: number, y: number }, stroke: { width: number, color: string } = {
        width: 0.5,
        color: 'grey'
    }): GeometryDraw => {
        this._gGrid = new gGrid(this, dimensions, stroke);
        return this;
    };



    sizeToCanvas = (value: number):number => {
        return Math.sqrt(Math.pow(value*this._xAxis.x, 2) + Math.pow(value*this._xAxis.y, 2));
    };
    private _AxesToCanvas = (P: Point): Point => {
        let origineXpixels = this._origin.x * this._xAxis.x + this._origin.y * this._yAxis.x,
            origineYpixels = this._origin.x * this._xAxis.y + this._origin.y * this._yAxis.y;

        return new Point(
            origineXpixels + P.x * this._xAxis.x + P.y * this._yAxis.x,
            this._draw.height() - (origineYpixels + P.x * this._xAxis.y + P.y * this._yAxis.y)
        );
    };
    _XYToCanvas = (P:{x:number, y:number}): {x:number, y:number} => {
        let origineXpixels = this._origin.x * this._xAxis.x + this._origin.y * this._yAxis.x,
            origineYpixels = this._origin.x * this._xAxis.y + this._origin.y * this._yAxis.y;

        return {
            x: origineXpixels + P.x * this._xAxis.x + P.y * this._yAxis.x,
            y: this._draw.height() - (origineYpixels + P.x * this._xAxis.y + P.y * this._yAxis.y)
        };
    };

    private _CanvasToAxes = (P: Point): Point => {
        let R = new Point();
        return R;
    };

    /**
     * Add a point, given by x, y and label
     * @param x
     * @param y
     * @param label
     */
    addPoint = (x: number, y: number, label?:string):gPoint => {
        return new gPoint(this, x, y, label);
    };

    midPoint = (A:gPoint, B:gPoint):gPoint => {
        return new gPoint(this, (A.realX+B.realX)/2, (A.realY+B.realY)/2);
    };

    addSegment = (A:gPoint, B: gPoint): gSegment => {
        return new gSegment(this, A, B);
    };

    // These functions uses the "alternate" coordinates.
    addVector = (A: gPoint, B: gPoint): gSegment => {
        return new gSegment(this, A, B, this._arrow);
    };




    /**
     * Draw a circle using the center and the radius.
     * @param center
     * @param radius
     */
    addCircle = (center: gPoint, radius: number): gCircle => {
        return new gCircle(this, center, radius);
    };

    // Helpers.
    getMidPoint = (A:gPoint, B:gPoint, asPixel?:boolean):{x: number, y:number} => {
        const MP = {x: (A.realX+B.realX)/2, y: (A.realY+B.realY)/2};
        if(asPixel===undefined || asPixel===false){
            return MP;
        }else{
            return this._XYToCanvas(MP);
        }
    };
    getMidPointAsPixel = (A:{x:number, y:number}, B:{x:number, y:number}):{x:number, y:number} => {
        return this._XYToCanvas({x: (A.x+B.x)/2, y: (A.y+B.y)/2});
    }
    // Getter and setter
    get xAxis(): {x:number, y:number} {
        return this._xAxis;
    }

    set xAxis(value: {x:number, y:number}) {
        this._xAxis = value;
    }

    get yAxis(): {x:number, y:number} {
        return this._yAxis;
    }

    set yAxis(value: {x:number, y:number}) {
        this._yAxis = value;
    }

    get origin(): {x:number, y:number} {
        return this._origin;
    }

    set origin(value: {x:number, y:number}) {
        // Must calculate the origin manually.
        this._origin = value;
    }

    get arrowScale(): number {
        return this._arrowScale;
    }

    set arrowScale(value: number) {
        this._arrowScale = value;

        let aScale = +this._arrowScale;
        this._arrow = this._draw.marker(aScale, aScale, function (add) {
            add.path(`M1,0 L1,${aScale}, L${aScale*1.2},${aScale/2} L1,0z`)
        }).ref(aScale, aScale/2);

    }

    get draw(): Svg {
        return this._draw;
    }

    get constructionList(): any[] {
        return this._constructionList;
    }

    // Getter for gObjects:

    get gOrigin(): gPoint {
        return this._gOrigin;
    }

    get gGrid(): gGrid {
        return this._gGrid;
    }

    get gAxis(): gSegment[] {
        return this._gAxis;
    }
}