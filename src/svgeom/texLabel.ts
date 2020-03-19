import {gPoint} from "./figures/gPoint";

export class texLabel {
    private _pos:{x:number, y:number};
    private _label:string;
    private _offset: string|{x:number, y:number, anchor:string};
    private _htmlTexLabel: HTMLElement;

    constructor(layer:HTMLElement, label?:string, pos?:{x:number,y:number}, offset?:string|{x:number, y:number, anchor:string}) {
        // Create the html element, empty.
        this._htmlTexLabel = document.createElement('div');
        this._htmlTexLabel.style.display = 'block';
        this._htmlTexLabel.style.position = 'absolute';
        layer.appendChild(this._htmlTexLabel);

        // Set teh dafault values.
        if (label !== undefined) {
            this.label = label;
        }

        // Set the position
        this._pos = {x: 0, y: 0};
        if (pos !== undefined && pos.x !== undefined && !isNaN(pos.x)) {
            this._pos.x = +pos.x;
            this._pos.y = +pos.y;
        }

        // Set the offset.
        if (offset !== undefined) {
            this._offset = offset;
        } else {
            this._offset = 'bl';
        }

        // Update all information
        this.update();
    }

    /**
     * Updates the texLabel on the texLayer
     * Must be called every time the figure is changed.
     */
    update = ():texLabel => {
        if(this._label===''){
            this.hide();
            return this;
        }

        let XYoffset = {x: 0, y:0}, anchorX = 0, anchorY = 0;
        if(this._offset===undefined){
            XYoffset = {x:0, y:0};
        }else if(typeof this._offset === 'string'){
            if(this._offset.includes('b')){
                XYoffset.y = 5;
            }else if(this._offset.includes('t')){
                XYoffset.y = -5;
                anchorY = this.height;
            }
            if(this._offset.includes('l')){
                XYoffset.x = -5;
                anchorX = -this.width
            }else if(this._offset.includes('r')){
                XYoffset.x = 5;
            }

        }else{
            XYoffset.x = +this._offset.x;
            XYoffset.y = +this._offset.y
            if(this._offset.anchor.includes('r')){anchorX = -this.width}
            if(this._offset.anchor.includes('b')){anchorY = this.height}
        }

        this._htmlTexLabel.style.left = `${this._pos.x + XYoffset.x + anchorX}px`;
        this._htmlTexLabel.style.top = `${this._pos.y + XYoffset.y - anchorY}px`;

        return this;
    };

    /**
     * Show the texLabel
     */
    show = ():texLabel => {
        this._htmlTexLabel.style.display = 'block';
        return this;
    };

    /**
     * Hide the texLabel
     */
    hide = ():texLabel => {
        this._htmlTexLabel.style.display = 'none';
        return this;
    };

    // Getter and setter
    get label(): string {
        return this._label;
    }

    set label(value: string) {
        this._label = value;
        this._htmlTexLabel.innerHTML = this._label;
    }

    get pos(): { x: number; y: number } {
        return this._pos;
    }

    set pos(value: { x: number; y: number }) {
        this._pos = value;

    }

    get offset(): string|{ x: number; y: number, anchor: string } {
        return this._offset;
    }

    set offset(value: string|{ x: number; y: number, anchor:string }) {
        this._offset = value;
    }

    get htmlTexLabel(): HTMLElement {
        return this._htmlTexLabel;
    }

    set htmlTexLabel(value: HTMLElement) {
        this._htmlTexLabel = value;
    }

    get width():number {
        return this._htmlTexLabel.offsetWidth;
    }
    get height():number {
        return this._htmlTexLabel.offsetHeight;
    }
}