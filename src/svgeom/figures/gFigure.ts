import {GeometryDraw} from "../geometryDraw";
import {off, Shape} from "@svgdotjs/svg.js";
import {texLabel} from "../texLabel";
import {gPoint} from "./gPoint";

export class gFigure {
    private _gdraw: GeometryDraw;
    private _svg: any;
    private _label: string;
    private _texLabel: texLabel;

    constructor(gDraw: GeometryDraw) {
        this._gdraw = gDraw;
        this._gdraw.constructionList.push(this);
    }

    /**
     * Set the label string. By default, it uses the this._label
     */
    texLabelString = ():string => {
        return this.label;
    };
    /**
     * Set the label position. The corrdinates given are in pixels
     */
    texLabelPosition = ():{x: number, y:number} => {
        return {x: this._svg.x(), y: this._svg.y()};
    };
    /**
     * Set the position of the label, relative to the position.
     */
    texLabelOffset = ():{x:number, y:number, anchor:string}|string => {
        return 'bl';
    };

    /**
     * Show (and create if necessary) the texLabel.
     * @param label
     */
    showLabel = (label?:string):gFigure => {
        if(this._texLabel===undefined){
            this._texLabel = this._gdraw.texElement(
                label===undefined?this.texLabelString():label,
                this.texLabelPosition(),
                this.texLabelOffset()
            );
        }else{
            this._texLabel.update();
            this._texLabel.show();
        }
        return this;
    };
    /**
     * Hide the texLabel
     */
    hideLabel = ():gFigure => {
        if(this._texLabel!==undefined){this._texLabel.hide();}
        return this;
    };
    /**
     * Update the texLabel
     */
    updateLabel = ():gFigure => {
        this._texLabel.label = this.texLabelString();
        this._texLabel.pos = this.texLabelPosition();
        this._texLabel.offset = this.texLabelOffset();
        this._texLabel.update();
        return this;
    };

    // Getter and setter
    get gdraw(): GeometryDraw {
        return this._gdraw;
    }

    get label(): string {
        return this._label===undefined?'':this._label;
    }

    set label(value: string) {
        this._label = value;
        if(this._texLabel===undefined){
            this.showLabel(value);
        }else{
            this._texLabel.label = value;
        }
    }

    get svg(): Shape {
        return this._svg;
    }

    set svg(svg:Shape) {
        this._svg = svg;
    }

    get texLabel(): texLabel {
        return this._texLabel;
    }

    set texLabel(value: texLabel) {
        this._texLabel = value;
    }
}