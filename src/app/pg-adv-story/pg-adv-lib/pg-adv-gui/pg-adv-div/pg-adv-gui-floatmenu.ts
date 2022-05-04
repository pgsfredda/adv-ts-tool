import { pgAdvDIVArea } from "./pg-adv-div-area";
import { pgAdvLibItemsData } from "../../pg-adv-lib-defs";

export class pgAdvFloatMenu extends pgAdvDIVArea {

    protected _listElement: HTMLElement;

    protected _deleteItems() {
        let n = this._listElement.childElementCount;

        for (let i = 0; i < n; i++) {
            const el = this._listElement.firstChild;
            this._listElement.removeChild(el);
        }

        this.hide();
        document.onclick = undefined;
        document.onkeydown = undefined;
    }

    protected _createItems(config: {
        data     : Array<{label: string, value: string}>,
        onCLick ?:(data: pgAdvLibItemsData) => any,
    }) {
        let n = config.data.length;

        for (let i = 0; i < n; i++) {
            let optEl = document.createElement("DIV");
            optEl.innerHTML = config.data[i].label;
            optEl.setAttribute('value', config.data[i].value);
            optEl.setAttribute('index', i + '');
            optEl.onclick = (e) => {
                config.onCLick({label: config.data[i].label, value: optEl.getAttribute('value')});
            };
            this._listElement.appendChild(optEl);
        }
        this.hide(false);
        document.onclick = () => this.onDelete();
        document.onkeydown = (e) => { if(e.key === 'Escape') this.onDelete() };
    }

    protected update(config: {
        width   ?: number,
        posX    ?: number,
        posY    ?: number,
        data     : Array<pgAdvLibItemsData>,
        onClick ?:(data: pgAdvLibItemsData) => any,
    }) {
        this.element.style.width = (config.width || 100) + 'px';
        this.element.style.top = (config.posY || 0) + 'px'
        this.element.style.left = (config.posX || 0) + 'px';

        this._deleteItems();
        this._createItems({data: config.data, onCLick: config.onClick});
    }

    constructor(config: {
        ID            : string,
        floatClass   ?: string,
        width        ?: number,
        posX         ?: number,
        posY         ?: number,
        listClass    ?: string,
        listID       ?: string,
    }) {
        super(config);

        this.element = document.createElement("DIV");
        this.element.id = config.ID;
        this.element.setAttribute("class", config.floatClass || 'pgadv-float-select');

        this.element.onclick = (e) => {
            e.stopPropagation();
            this.hide();
        };

        this._listElement = document.createElement("DIV");
        this._listElement.setAttribute("class", config.listClass || "pgadv-float-items");
        this._listElement.id = config.listID || 'pgadv-floating-menu';

        this.element.appendChild(this._listElement);
        document.body.appendChild(this.element);
    };

    onClick(config: {
        event, 
        data: Array<pgAdvLibItemsData>, 
        onClick ?:(data: pgAdvLibItemsData) => any
    }) {
        config.event.stopPropagation();

        this.update({
            width  : 100,
            posX   : config.event.clientX,
            posY   : config.event.y + config.event.srcElement.offsetHeight + 2,
            data   : config.data,
            onClick: config.onClick
        })
    }

    onDelete() {
        this._deleteItems();
    }
}

