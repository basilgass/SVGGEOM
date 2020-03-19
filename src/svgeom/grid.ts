import {GeometryDraw} from "./geometryDraw";
import {Container, Line, Point, Svg} from "@svgdotjs/svg.js";

export class gGrid {
    private _gdraw: GeometryDraw;
    private _draw: Svg;
    private _svg: Container;

    constructor(gDraw: GeometryDraw, dimensions?:{x: number, y: number}, stroke?:{width: number, color: string}) {
        this._gdraw = gDraw;
        this._draw = gDraw.draw;
        this._svg = gDraw.draw.group();

        let W: number, H: number;

        if (dimensions === undefined) {
            // Use the current dimensions to fill the rectangle.
            dimensions = {
                x: this._draw.width(),
                y: this._draw.height()
            };
        }

        if (stroke === undefined){
            stroke = {
                width: 1,
                color: 'black'
            }
        }

        this._gridPartial('gridE1', this._gdraw.yAxis, this._gdraw.xAxis, dimensions.x, dimensions.y, stroke);
        this._gridPartial('gridE2', this._gdraw.xAxis, this._gdraw.yAxis, dimensions.x, dimensions.y, stroke);

        return this;
    }



    private _gridPartial = (className: string, e1: {x:number, y:number}, e2: {x:number, y:number}, W: number, H: number, stroke: { width: number, color: string } = {
        width: 0.5,
        color: 'grey'
    }) => {
        // Direction of the line (opposed because the SVG canvas y axis is reverted.
        const m = -e1.y / e1.x,
            bbox = {x: [0, W], y: [0, H]};
        let y1 = 0, y2 = 0, x = 0, px = 0, py = 0, line, attr;
        let securityEscape = 0, nbLines = 0;

        let P = {x: 0, y:0},
            P1 = {x: 0, y:0},
            P2 = {x: 0, y:0},
            continueP1: boolean = true,
            continueP2: boolean = true;

        line = this._line(P, e2, bbox).stroke(stroke).addClass(className);
        this._svg.add(line);

        while (true) {
            P1.x += e1.x;
            P1.y += e1.y;
            P2.x -= e1.x;
            P2.y -= e1.y;

            if (continueP1) {
                line = this._line(P1, e2, bbox).stroke(stroke).addClass(className);
                attr = line.attr();
                // Determine if the line is visible in the bounding box.
                if (!this._isLineVisible(line, bbox)) {
                    line.remove();
                    continueP1 = false;
                }else{
                    this._svg.add(line);
                    nbLines++;
                }
            }

            if (continueP2) {
                line = this._line(P2, e2, bbox).stroke(stroke).addClass(className);
                attr = line.attr();
                // Determine if the line is visible in the bounding box.
                if (!this._isLineVisible(line, bbox)) {
                    line.remove();
                    continueP2 = false;
                }else{
                    this._svg.add(line);
                    nbLines++;
                }
            }

            if (!continueP1 && !continueP2) {
                // Both are done - escape the loop
                break;
            }

            securityEscape++;
            if (securityEscape > 1000) {
                break;
            }
        }
    };

    private _isLineVisible = (line: Line, bbox: {x: number[], y: number[]}):boolean => {
        const attr = line.attr();

        // The start and end of the line is on the left of the bbox
        if(attr.x1 < bbox.x[0] && attr.x2<bbox.x[0]){return false;}

        // The start and end of the line is on the right of the bbox
        if(attr.x1 > bbox.x[1] && attr.x2>bbox.x[1]){return false;}

        // The start and end of the line is over the bbox
        if(attr.y1 < bbox.y[0] && attr.y2<bbox.y[0]){return false;}

        // The start and end of the line is below the bbox
        if(attr.y1 > bbox.y[1] && attr.y2>bbox.y[1]){return false;}

        return true;
    };

    // Get the line function through this point and a direction.
    // Used for internal use.
    private _line = (point: {x: number, y:number}, direction: {x:number, y:number}, boundingBox?: { x: number[], y: number[] }): Line => {
        if (boundingBox === undefined) {
            boundingBox = {
                x: [0, 100],
                y: [0, 100]
            }
        }

        if (direction.x === 0) {
            // Vertical lines.
            return this._draw.line(point.x, boundingBox.y[0], point.x, boundingBox.y[1]);
        }

        // Get the line slope (opposed because the y axis is inverted)
        const m = direction.y / direction.x;
        // Get the line height.
        const h = point.y - m * point.x;


        // Draw the line.
        let P1 = new Point(boundingBox.x[0], h),
            P2 = new Point(boundingBox.x[1], h + m * boundingBox.x[1]);

        return this._draw.line(P1.x, boundingBox.y[1] - P1.y, P2.x, boundingBox.y[1] - P2.y);
    };

    set e1Stroke(value:{}) {
        this._svg.find('.gridE1').each('stroke', value);
    }

    set e2Stroke(value:{}) {
        this._svg.find('.gridE2').each('stroke', value);
    }

    set stroke(value:{}) {
        this.e1Stroke = value;
        this.e2Stroke = value;
    }

    get svg(): Container {
        return this._svg;
    }
}