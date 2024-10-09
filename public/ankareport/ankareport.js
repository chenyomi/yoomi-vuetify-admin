var AnkaReport = (function (exports) {
    'use strict';

    class EventEmitter {
        constructor() {
            this.callbacks = [];
        }
        add(callback) {
            this.callbacks.push(callback);
        }
        remove(callback) {
            const callbackIndex = this.callbacks.findIndex((x) => x === callback);
            if (callbackIndex >= 0) {
                this.callbacks.splice(callbackIndex, 1);
            }
            else {
                console.warn(new Error(`Callback not found. Callback count: ${this.callbacks.length}.`));
            }
        }
        emit(args) {
            this.callbacks.forEach((f) => f(args));
        }
    }

    class Textbox {
        constructor() {
            this.element = document.createElement("input");
        }
        get value() {
            return this.element.value;
        }
        set value(value) {
            this.element.value = value;
        }
        addEventListener(event, listener) {
            switch (event) {
                case "change":
                    this.element.addEventListener("change", () => {
                        listener({ value: this.value });
                    });
                    break;
            }
        }
    }

    class PropertyGridRow {
        constructor(property, value) {
            this.property = property;
            this.value = value;
            this.element = document.createElement("div");
            this.elementLabel = document.createElement("div");
            this.elementEditorContainer = document.createElement("div");
            this._changeEventEmitter = new EventEmitter();
            this.editor = property.editor || new Textbox();
            this._init();
        }
        _init() {
            this.element.classList.add("anka-property-grid-row");
            this.elementLabel.classList.add("anka-property-grid-row__label");
            this.elementEditorContainer.classList.add("anka-property-grid-row__editor-container");
            this.element.appendChild(this.elementLabel);
            this.element.appendChild(this.elementEditorContainer);
            this.elementEditorContainer.appendChild(this.editor.element);
            this.editor.addEventListener("change", (e) => {
                this._changeEventEmitter.emit({ value: e.value });
            });
            this.refresh();
        }
        refresh() {
            this.elementLabel.innerText = this.property.label;
            // TODO: I think this is wrong. But working.
            this.editor.value = this.value;
        }
        addEventListener(event, callback) {
            switch (event) {
                case "change":
                    this._changeEventEmitter.add(callback);
                    break;
            }
        }
    }

    class PropertyGrid {
        constructor() {
            this.element = document.createElement("div");
            this._properties = [];
            this._dataSource = null;
            this._init();
        }
        get properties() {
            return this._properties;
        }
        set properties(value) {
            this._properties = value;
            this.refresh();
        }
        get dataSource() {
            return this._dataSource;
        }
        set dataSource(value) {
            if (this._dataSource) {
                this._dataSource.removeEventListener("change", this.refresh);
            }
            this._dataSource = value;
            this.refresh();
            if (this._dataSource) {
                this._dataSource.addEventListener("change", this.refresh);
            }
        }
        _init() {
            this.element.classList.add("anka-property-grid");
            this.refresh = this.refresh.bind(this);
            this.onChange = this.onChange.bind(this);
            this.refresh();
        }
        refresh() {
            var _a;
            this.element.innerHTML = "";
            if (!this._dataSource || this._properties.length === 0) {
                this.element.innerText = "选择一个啊";
                this.element.style.padding = "3px";
            }
            else {
                this.element.style.padding = "";
            }
            if (!this._dataSource)
                return;
            for (let i = 0; i < this._properties.length; i++) {
                const property = this._properties[i];
                const value = (_a = this._dataSource[property.field]) !== null && _a !== void 0 ? _a : "";
                const row = new PropertyGridRow(property, value.toString());
                row.addEventListener("change", (e) => {
                    this.onChange(property, e);
                });
                this.element.appendChild(row.element);
            }
        }
        onChange(property, args) {
            if (this._dataSource == null)
                return;
            switch (property.type) {
                case "string":
                    this._dataSource[property.field] = args.value;
                    break;
                case "number":
                    const intValue = parseInt(args.value);
                    if (!isNaN(intValue)) {
                        this._dataSource[property.field] = intValue;
                    }
            }
        }
        setDataSource(properties) {
            if (properties) {
                this.properties = properties.getPropertyDefinitions();
                this.dataSource = properties;
            }
            else {
                this.properties = [];
                this.dataSource = null;
            }
        }
    }
    var logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN8AAAAlCAYAAADC8DxTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArxJREFUeNrsnE1um0AYQMdVDoBvQG7gSl1101Sq2kU3yQninCDJCepld05PEPcG2XTTTdx9pXCDcoNwAzJfTSWLDDDA/JD6PWlkGTzw+WMePwPDrCxLBQDheUUKAJAPAPkAwD9HpolvP3w61R+Xhlm5Lte6FB3Lbat/YRHXUpdzw/SsWr/NukLzXZdNbdpKl3eG3/6q5vkm0WWtS2qY902Xu0C5kRgWljmbZAw/3vy0zfdt9Vnnev61zPYnzEwdLlq+x4YFqKrx33QE0daLc2HxZ9vqn9UaTVusoZnv7ZhkQz+0/PZ1tTPxyVXV6EwUVby+WVYNsolZgBhOdLlvmX9cHRjGyic71C8N83It37HNaWfSYfcY0pH1F47jccmiR1wh4k4ir9/F9o4eo6V4vdfBNR+Af/GMIB9ABPGQDyCSeMjnnowUIJ4tR/95HnPV0YvVgXSg2HZMSC9uQdNFPOTbIfdwVgPrLtWui9pWvA1NFzjtHI+Id4t4HPU48oXlBPEOGrnUWA+smyLfePkQ73BZ92gDnHY6RoQqEA+QLzy5Lu9bBEQ8QD6PZA0CIh4gX2ABC8QD19Dh0i3gnDQA8gH4R8arypi8IUOuUtXjdgPyATw/2zkbWHelmgfTOrnmk4WXHcVnfdexuigymr7vjdl7DzEse8bgOg9/lPlVDVOP4S+ff3+kw+UFIqcoVyruqO1EDX8ywxXy/y8nEMP6JTQa5HO/4WPvBA49B6MIefRDPoBIAiIfQCQBkQ8gkoBN8k15RPbdRGOVOPZfI5FHiCHv+B6C+qs0tpG2RZ82kjkSsG09z/LQdJ9PHqs6naB4uSFRU4l1W0u+xCr3ixYBY6jvmDZq1wmTBGz0G0Ne5NG8NGAebgxyNW2LrcMd+L/1mvJdz4v5jdUA4B+u+QCQDwD5AAD5AJAPABzzJMAAKanyM7blr3sAAAAASUVORK5CYII="

    var img$2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFzSURBVDiNjdNPS9RRFMbxzzEJIf+EaBgkLmKSNkKRoBuJoLIC27RqNYvehtAr8CX4ChQiCCIIxIVECEELI6pdUJuJgooimONi7sVRZmIOPIvfvfd37nO+95zITBExjiW8xUMEhorCUZzCMD5jOzO/wzweYyYzDSJcwAbmh7CMWdyMiLmIGNEnImIkIuZwHaNYDjTxHBPFzXmc6SoB2kW/8AXv8QOrw10XfEQLrSw+ezhYxG28xJgCpMYY7mEqIiq8KtjBJUxjEv+UzWbh8ASvM7PVj0FxMY1ruI9XNcELXMTlkj1wsoy69g3v8Am3aglt7OHgfw4i4ipWsa8D/RiDCTyIiMnyfdLBTnF4ruhv3WhiCzcQAzTR6XJ2C83KYBdX0HBEvReDuv4Bb7BSS/idmdsREf16oDBYwF08w9ljDMrzPIqISrsm2sQdne5bwBRm8Kf+28A6ZgccpHGd2VlHI8o4j2KtZO7VhdmlNr7iaWb+PAQ5CK7LXYnUvgAAAABJRU5ErkJggg==";

    var img$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADSSURBVDiNzdO9SkNBEAXg78b0ksLK0pAutY0EsbOTFBZ5BB8gaVPqO9inFYsgVgbS2FrnBdLamBBEi3sXluWuGkmRAwM7h9kzP8wUaGCAY3/DC16DEz4P0YrsNvEDd4RHnMeK48pifNVkDtwZlrgIFWyLOa4xwWkzE7TGKOFW0XuGe1zmBPro1XAxNpATmFb2K/4zg90KpC20cYWDTPwnHrDICTzhGe8ZgUPlbDo5gRPc/FSyZMn2Y4gL5TF9VFy6gXUYKRfrrkChvMjulsnfMPkGlb0hK3Zvlo0AAAAASUVORK5CYII=";

    var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAACTSURBVDiNzdCxDcIwFIThzyhMQsEAIKpIiKlC6TYjMEdKqBB0DMAY1GmgIIqCFCTHouAa657se+c/4ISbPK0LXBCxxfzLxTsClp1vcUacZW7uFdB0LXJUDk3MSShGZhvsEt+3Q3NE1Z2pisMGV9TeXKrEgNVH2oTNvf6TwUM6g8XYFw4TGvyWQSODQRgZ7vFMDChfZ94cBBBG80sAAAAASUVORK5CYII=";

    const Database = img$2;
    const Save = img$1;
    const TreeStructure = img;

    class TreeItem {
        constructor(options) {
            this.options = options;
            this.element = document.createElement("div");
            this.elementHeader = document.createElement("div");
            this.elementIcon = document.createElement("div");
            this.elementLabel = document.createElement("div");
            this.elementChildren = document.createElement("div");
            this._collapsed = false;
            this._init();
        }
        get collapsed() {
            return this._collapsed;
        }
        set collapsed(value) {
            this._collapsed = value;
            this.refresh();
        }
        _init() {
            this.element.classList.add("anka-tree-item");
            this.elementHeader.classList.add("header");
            this.elementIcon.classList.add("icon");
            if (this.options.collapseByArrow) {
                this.elementIcon.classList.add("hover");
            }
            this.elementLabel.classList.add("label");
            this.elementChildren.classList.add("children");
            this.element.appendChild(this.elementHeader);
            this.elementHeader.appendChild(this.elementIcon);
            this.elementHeader.appendChild(this.elementLabel);
            if (this.options.renderer) {
                this.options.renderer(this, this.options.data);
            }
            if (this.hasChild) {
                this.element.appendChild(this.elementChildren);
                this.options.data.children.forEach((x) => {
                    const item = new TreeItem({
                        data: x,
                        renderer: this.options.renderer,
                    });
                    this.elementChildren.appendChild(item.element);
                });
                this.elementIcon.addEventListener("click", () => {
                    this.collapsed = !this.collapsed;
                });
                if (!this.options.collapseByArrow) {
                    this.elementLabel.addEventListener("click", () => {
                        this.collapsed = !this.collapsed;
                    });
                }
            }
            this.refresh();
        }
        refresh() {
            this.elementLabel.innerText = this.options.data.label;
            if (this.hasChild) {
                if (this.collapsed) {
                    this.elementIcon.innerText = "→";
                }
                else {
                    this.elementIcon.innerText = "↓";
                }
            }
            else {
                this.elementIcon.innerText = "";
            }
            this.elementChildren.style.display = this.collapsed ? "none" : "block";
        }
        addEventListener(event, listener) {
            if (event === "click") {
                this.elementLabel.addEventListener("click", () => listener(undefined));
            }
        }
        get hasChild() {
            return this.options.data.children && this.options.data.children.length > 0;
        }
    }

    class TreeList {
        constructor(options) {
            this.element = document.createElement("div");
            this.dataSource = (options === null || options === void 0 ? void 0 : options.dataSource) || [];
            this.itemRenderer = options === null || options === void 0 ? void 0 : options.itemRenderer;
            this.collapseByArrow = options === null || options === void 0 ? void 0 : options.collapseByArrow;
            this.init();
        }
        init() {
            this.element.classList.add("anka-tree-list");
            this.refresh();
        }
        refresh() {
            this.element.innerHTML = "";
            this.dataSource.forEach((data) => {
                const item = new TreeItem({
                    data,
                    renderer: this.itemRenderer,
                    collapseByArrow: this.collapseByArrow,
                });
                this.element.appendChild(item.element);
            });
        }
    }

    class DataSourceTreeList extends TreeList {
        constructor(options) {
            const dataSource = (options === null || options === void 0 ? void 0 : options.dataSource)
                ? convertToDataSource(options.dataSource)
                : undefined;
            super({
                dataSource,
                itemRenderer: dataSourceItemRenderer,
            });
        }
        setDataSource(dataSource) {
            this.dataSource = convertToDataSource(dataSource);
            this.refresh();
        }
    }
    const convertToDataSource = (data) => {
        return data.map((x) => ({
            label: x.label,
            data: x,
            children: x.children ? convertToDataSource(x.children) : undefined,
        }));
    };
    const dataSourceItemRenderer = (item, itemData) => {
        if (item.hasChild)
            return;
        item.element.draggable = true;
        item.element.addEventListener("dragstart", (e) => {
            var _a, _b;
            (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("label", itemData.label);
            (_b = e.dataTransfer) === null || _b === void 0 ? void 0 : _b.setData("field", itemData.data.field);
        });
    };

    class ElementsTreeList extends TreeList {
        constructor(options) {
            super({
                collapseByArrow: true,
                itemRenderer: (treeItem, data) => this._itemRenderer(treeItem, data),
            });
            this.options = options;
        }
        refresh() {
            if (!this.options)
                return;
            this.dataSource = this.getDataSource();
            super.refresh();
        }
        _itemRenderer(treeItem, treeItemData) {
            switch (treeItemData.data.type) {
                case "section":
                    treeItem.addEventListener("click", () => {
                        treeItemData.data.component.element.focus();
                    });
                    break;
                case "item":
                    treeItem.addEventListener("click", () => {
                        treeItemData.data.component.element.focus();
                    });
                    break;
            }
        }
        getDataSource() {
            const s1 = this.options.reportContainer.report.reportSectionHeader;
            const s2 = this.options.reportContainer.report.reportSectionContent;
            const s3 = this.options.reportContainer.report.reportSectionFooter;
            return [
                this.getSectionData(s1, "Header"),
                this.getSectionData(s2, "Content"),
                this.getSectionData(s3, "Footer"),
            ];
        }
        getSectionData(section, label) {
            return {
                label: label || `Section [${section.properties.binding}]`,
                data: {
                    type: "section",
                    component: section,
                },
                children: [
                    ...section.items.map((x) => {
                        const item = {
                            label: `Text [${x.properties.binding || x.properties.text || ""}]`,
                            data: {
                                type: "item",
                                component: x,
                            },
                        };
                        return item;
                    }),
                    ...section.subsections.map((x) => this.getSectionData(x)),
                ],
            };
        }
    }

    class Point {
        constructor(x, y, onchange) {
            this.onchange = onchange;
            this._x = 0;
            this._y = 0;
            if (x)
                this._x = x;
            if (y)
                this._y = y;
        }
        get x() {
            return this._x;
        }
        set x(value) {
            this._x = value;
            if (this.onchange)
                this.onchange();
        }
        get y() {
            return this._y;
        }
        set y(value) {
            this._y = value;
            if (this.onchange)
                this.onchange();
        }
    }

    class DragDrop {
        constructor(options) {
            this.options = options;
            this.originalLocation = new Point();
            this.newLocation = new Point();
            this.offset = new Point();
            this.onMouseDown = this.onMouseDown.bind(this);
            this.onMouseMove = this.onMouseMove.bind(this);
            this.onMouseUp = this.onMouseUp.bind(this);
            this.options.element.addEventListener("mousedown", this.onMouseDown);
        }
        onMouseDown(e) {
            if (e.target !== this.options.element)
                return;
            this.originalLocation.x = e.x;
            this.originalLocation.y = e.y;
            this.newLocation.x = this.originalLocation.x;
            this.newLocation.y = this.originalLocation.y;
            this.offset.x = e.x;
            this.offset.y = e.y;
            this.onMouseMove(e);
            this.options.container.addEventListener("mousemove", this.onMouseMove);
            document.addEventListener("mouseup", this.onMouseUp, {
                once: true,
            });
        }
        onMouseMove(e) {
            this.newLocation.x = e.x;
            this.newLocation.y = e.y;
            this.offset.x = this.newLocation.x - this.originalLocation.x;
            this.offset.y = this.newLocation.y - this.originalLocation.y;
            const args = {
                originalX: this.originalLocation.x,
                originalY: this.originalLocation.y,
                newX: this.newLocation.x,
                newY: this.newLocation.y,
                offsetX: this.offset.x,
                offsetY: this.offset.y,
            };
            this.options.onMouseMove(args);
        }
        onMouseUp() {
            this.options.container.removeEventListener("mousemove", this.onMouseMove);
            const args = {
                originalX: this.originalLocation.x,
                originalY: this.originalLocation.y,
                newX: this.newLocation.x,
                newY: this.newLocation.y,
                offsetX: this.offset.x,
                offsetY: this.offset.y,
            };
            this.options.onMouseUp(args);
        }
    }

    var ResizerOrientation;
    (function (ResizerOrientation) {
        ResizerOrientation[ResizerOrientation["Horizontal"] = 0] = "Horizontal";
        ResizerOrientation[ResizerOrientation["Vertical"] = 1] = "Vertical";
    })(ResizerOrientation || (ResizerOrientation = {}));
    class Resizer {
        constructor(options) {
            this.options = options;
            this.element = document.createElement("div");
            this.offset = new Point();
            this.init();
        }
        init() {
            this.element.classList.add("anka-resizer");
            switch (this.options.orientation) {
                case ResizerOrientation.Vertical:
                    this.element.classList.add("vertical");
                    break;
                case ResizerOrientation.Horizontal:
                    this.element.classList.add("horizontal");
                    break;
            }
            new DragDrop({
                element: this.element,
                container: document,
                onMouseMove: (e) => this.onMouseMove(e),
                onMouseUp: (e) => this.onMouseUp(e),
            });
        }
        refresh() {
            switch (this.options.orientation) {
                case ResizerOrientation.Vertical:
                    this.element.style.right = -this.offset.x + "px";
                    break;
                case ResizerOrientation.Horizontal:
                    this.element.style.bottom = -this.offset.y + "px";
                    break;
            }
        }
        clear() {
            switch (this.options.orientation) {
                case ResizerOrientation.Vertical:
                    this.element.style.right = "";
                    break;
                case ResizerOrientation.Horizontal:
                    this.element.style.bottom = "";
                    break;
            }
        }
        onMouseMove(e) {
            this.offset.x = e.offsetX;
            this.offset.y = e.offsetY;
            this.refresh();
        }
        onMouseUp(e) {
            this.clear();
            if (this.options.onResize) {
                this.options.onResize(e);
            }
        }
    }

    class Menu {
        constructor(options) {
            this.options = options;
            this.element = document.createElement("div");
            this._clickEventEmitter = new EventEmitter();
            this.init();
        }
        init() {
            this.element.classList.add("anka-menu");
            if (this.options.onClick) {
                this.addEventListener("click", this.options.onClick);
            }
            this.refresh();
        }
        refresh() {
            this.element.innerHTML = "";
            this.element.style.width = this.options.width || "";
            this.element.style.height = this.options.height || "";
            this.options.buttons
                .filter((x) => x)
                .forEach((button) => {
                    const elementButton = document.createElement("div");
                    elementButton.classList.add("anka-menu-button");
                    elementButton.innerText = button.label;
                    elementButton.addEventListener("click", () => {
                        this.emitOnClick(button.key, button.data);
                    });
                    this.element.appendChild(elementButton);
                });
        }
        addEventListener(event, listener) {
            switch (event) {
                case "click":
                    this._clickEventEmitter.add(listener);
                    break;
            }
        }
        emitOnClick(key, data) {
            this._clickEventEmitter.emit({ key, data });
        }
    }

    class ContextMenu {
        constructor(options) {
            this.options = options;
            this.element = document.createElement("div");
            this.menu = new Menu(options);
            this.init();
        }
        init() {
            this.element.classList.add("anka-context-menu-container");
            document.body.appendChild(this.element);
            this.element.appendChild(this.menu.element);
            this.element.addEventListener("click", (e) => {
                if (e.target === this.element) {
                    this.dispose();
                }
            });
            this.menu.addEventListener("click", () => this.dispose());
            this.refresh();
        }
        refresh() {
            this.menu.refresh();
            this.menu.element.style.left = `${this.options.left}px`;
            this.menu.element.style.top = `${this.options.top}px`;
        }
        dispose() {
            this.element.remove();
        }
    }

    function isValidStyle(value) {
        return !(value === undefined || value === null || value === "");
    }
    class MultipleStyles {
        constructor(...styles) {
            this.styles = [];
            this.styles.push(...styles);
        }
        join(styles) {
            this.styles.push(styles);
        }
        getList() {
            return this.styles;
        }
        getStyle(property, defaultValue) {
            for (let i = this.styles.length - 1; i >= 0; i--) {
                const styles = this.styles[i];
                if (isValidStyle(styles[property])) {
                    return styles[property];
                }
            }
            return defaultValue;
        }
    }

    class ColorPicker {
        constructor(options) {
            this.options = options;
            this.element = document.createElement("input");
            this.element.type = "color";
        }
        get value() {
            if (this.element.value === this.options.defaultValue) {
                return "";
            }
            return this.element.value;
        }
        set value(value) {
            if (!value) {
                this.element.value = this.options.defaultValue;
            }
            else {
                this.element.value = value;
            }
        }
        addEventListener(event, listener) {
            switch (event) {
                case "change":
                    this.element.addEventListener("change", () => {
                        listener({ value: this.value });
                    });
                    break;
            }
        }
    }

    class DropdownList {
        constructor(options) {
            this.options = options;
            this.element = document.createElement("select");
            this.items = [];
            this._value = "";
            this._init();
        }
        get value() {
            return this._value;
        }
        set value(value) {
            this._value = value;
            this.refresh();
        }
        _init() {
            this._value = this.options.defaultValue;
            this.refresh();
        }
        refresh() {
            this.element.innerHTML = "";
            this.items.length = 0;
            for (let i = 0; i < this.options.items.length; i++) {
                const item = this.options.items[i];
                const option = document.createElement("option");
                option.innerText = item.label;
                option.value = item.value;
                if (this._value == item.value) {
                    option.selected = true;
                }
                this.element.appendChild(option);
                this.items.push(option);
            }
        }
        addEventListener(event, listener) {
            switch (event) {
                case "change":
                    this.element.addEventListener("change", () => {
                        listener({ value: this.element.value });
                    });
                    break;
            }
        }
    }

    function createBorderStyleDropdownEditor() {
        return new DropdownList({
            defaultValue: "none",
            items: [
                { value: "none", label: "none" },
                { value: "dotted", label: "dotted" },
                { value: "dashed", label: "dashed" },
                { value: "solid", label: "solid" },
                { value: "solid", label: "solid" },
                { value: "double", label: "double" },
                { value: "groove", label: "groove" },
                { value: "ridge", label: "ridge" },
                { value: "inset", label: "inset" },
                { value: "outset", label: "outset" },
            ],
        });
    }

    function createFontFamilyDropdownEditor() {
        return new DropdownList({
            defaultValue: "Arial",
            items: [
                { value: "Arial", label: "Arial" },
                { value: "Helvetica", label: "Helvetica" },
                { value: "Myriad Pro", label: "Myriad Pro" },
                { value: "Delicious", label: "Delicious" },
                { value: "Verdana", label: "Verdana" },
                { value: "Georgia", label: "Georgia" },
                { value: "Courier", label: "Courier" },
                { value: "Comic Sans MS", label: "Comic Sans MS" },
                { value: "Impact", label: "Impact" },
                { value: "Monaco", label: "Monaco" },
                { value: "Optima", label: "Optima" },
                { value: "Hoefler Text", label: "Hoefler Text" },
                { value: "Plaster", label: "Plaster" },
                { value: "Engagement", label: "Engagement" },
            ],
        });
    }

    function createFontSizeDropdownEditor() {
        return new DropdownList({
            defaultValue: "",
            items: [
                { value: "6px", label: "6" },
                { value: "7px", label: "7" },
                { value: "8px", label: "8" },
                { value: "9px", label: "9" },
                { value: "10px", label: "10" },
                { value: "11px", label: "11" },
                { value: "", label: "12" },
                { value: "13px", label: "13" },
                { value: "14px", label: "14" },
                { value: "15px", label: "15" },
                { value: "16px", label: "16" },
                { value: "17px", label: "17" },
                { value: "18px", label: "18" },
                { value: "19px", label: "19" },
                { value: "20px", label: "20" },
                { value: "21px", label: "21" },
                { value: "22px", label: "22" },
                { value: "23px", label: "23" },
                { value: "24px", label: "24" },
                { value: "25px", label: "25" },
                { value: "26px", label: "26" },
                { value: "27px", label: "27" },
                { value: "28px", label: "28" },
                { value: "29px", label: "29" },
                { value: "30px", label: "30" },
                { value: "31px", label: "31" },
                { value: "32px", label: "32" },
                { value: "33px", label: "33" },
                { value: "34px", label: "34" },
                { value: "35px", label: "35" },
                { value: "36px", label: "36" },
                { value: "37px", label: "37" },
                { value: "38px", label: "38" },
                { value: "39px", label: "39" },
                { value: "40px", label: "40" },
                { value: "41px", label: "41" },
                { value: "42px", label: "42" },
                { value: "43px", label: "43" },
                { value: "44px", label: "44" },
                { value: "45px", label: "45" },
                { value: "46px", label: "46" },
                { value: "47px", label: "47" },
                { value: "48px", label: "48" },
                { value: "49px", label: "49" },
                { value: "50px", label: "50" },
                { value: "51px", label: "51" },
                { value: "52px", label: "52" },
                { value: "53px", label: "53" },
                { value: "54px", label: "54" },
                { value: "55px", label: "55" },
                { value: "56px", label: "56" },
                { value: "57px", label: "57" },
                { value: "58px", label: "58" },
                { value: "59px", label: "59" },
                { value: "60px", label: "60" },
                { value: "61px", label: "61" },
                { value: "62px", label: "62" },
                { value: "63px", label: "63" },
                { value: "64px", label: "64" },
                { value: "65px", label: "65" },
                { value: "66px", label: "66" },
                { value: "67px", label: "67" },
                { value: "68px", label: "68" },
                { value: "69px", label: "69" },
                { value: "70px", label: "70" },
                { value: "71px", label: "71" },
                { value: "72px", label: "72" },
                { value: "73px", label: "73" },
                { value: "74px", label: "74" },
                { value: "75px", label: "75" },
                { value: "76px", label: "76" },
                { value: "77px", label: "77" },
                { value: "78px", label: "78" },
                { value: "79px", label: "79" },
                { value: "80px", label: "80" },
                { value: "81px", label: "81" },
                { value: "82px", label: "82" },
                { value: "83px", label: "83" },
                { value: "84px", label: "84" },
                { value: "85px", label: "85" },
                { value: "86px", label: "86" },
                { value: "87px", label: "87" },
                { value: "88px", label: "88" },
                { value: "89px", label: "89" },
                { value: "90px", label: "90" },
                { value: "91px", label: "91" },
                { value: "92px", label: "92" },
                { value: "93px", label: "93" },
                { value: "94px", label: "94" },
                { value: "95px", label: "95" },
                { value: "96px", label: "96" },
                { value: "97px", label: "97" },
                { value: "98px", label: "98" },
                { value: "99px", label: "99" },
            ],
        });
    }

    function createFontWeightDropdownEditor() {
        return new DropdownList({
            defaultValue: "",
            items: [
                { value: "", label: "Normal" },
                { value: "bold", label: "Bold" },
                { value: "lighter", label: "Lighter" },
                { value: "bolder", label: "Bolder" },
                { value: "100", label: "100" },
                { value: "200", label: "200" },
                { value: "300", label: "300" },
                { value: "400", label: "400" },
                { value: "500", label: "500" },
                { value: "600", label: "600" },
                { value: "700", label: "700" },
                { value: "800", label: "800" },
                { value: "900", label: "900" },
            ],
        });
    }

    function createTextAlignDropdownEditor() {
        return new DropdownList({
            defaultValue: "Arial",
            items: [
                { value: "", label: "靠左" },
                { value: "center", label: "居中" },
                { value: "right", label: "靠右" },
            ],
        });
    }

    class Properties {
        constructor() {
            this._cache = [];
            this._updating = false;
            this._changeEventEmitter = new EventEmitter();
        }
        emitOnChange(property, newValue, oldValue) {
            if (oldValue === newValue)
                return;
            this._cache.push({
                property,
                newValue,
                oldValue,
            });
            if (this._updating)
                return;
            this._emitOnChange();
        }
        _emitOnChange() {
            if (this._cache.length === 0)
                return;
            this._changeEventEmitter.emit({ changes: [...this._cache] });
            this._cache.length = 0;
        }
        addEventListener(event, listener) {
            switch (event) {
                case "change":
                    this._changeEventEmitter.add(listener);
                    break;
            }
        }
        removeEventListener(event, listener) {
            switch (event) {
                case "change":
                    this._changeEventEmitter.remove(listener);
                    break;
            }
        }
        beginUpdate() {
            this._updating = true;
        }
        endUpdate() {
            this._updating = false;
            this._emitOnChange();
        }
    }

    class StyleProperties extends Properties {
        constructor(defaultValues) {
            super();
            if (!defaultValues)
                return;
            this.beginUpdate();
            this._color = defaultValues.color;
            this._backgroundColor = defaultValues.backgroundColor;
            this._textAlign = defaultValues.textAlign;
            this._borderWidth = defaultValues.borderWidth;
            this._borderStyle = defaultValues.borderStyle;
            this._borderColor = defaultValues.borderColor;
            this._fontFamily = defaultValues.fontFamily;
            this._fontSize = defaultValues.fontSize;
            this._fontWeight = defaultValues.fontWeight;
            this.endUpdate();
        }
        get color() {
            return this._color;
        }
        get backgroundColor() {
            return this._backgroundColor;
        }
        get textAlign() {
            return this._textAlign;
        }
        get borderWidth() {
            return this._borderWidth;
        }
        get borderStyle() {
            return this._borderStyle;
        }
        get borderColor() {
            return this._borderColor;
        }
        get fontFamily() {
            return this._fontFamily;
        }
        get fontSize() {
            return this._fontSize;
        }
        get fontWeight() {
            return this._fontWeight;
        }
        set color(value) {
            const oldValue = this._color;
            this._color = value;
            this.emitOnChange("color", value, oldValue);
        }
        set backgroundColor(value) {
            const oldValue = this._backgroundColor;
            this._backgroundColor = value;
            this.emitOnChange("backgroundColor", value, oldValue);
        }
        set textAlign(value) {
            const oldValue = this._textAlign;
            this._textAlign = value;
            this.emitOnChange("textAlign", value, oldValue);
        }
        set borderWidth(value) {
            const oldValue = this._borderWidth;
            this._borderWidth = value;
            this.emitOnChange("borderWidth", value, oldValue);
        }
        set borderStyle(value) {
            const oldValue = this._borderStyle;
            this._borderStyle = value;
            this.emitOnChange("borderStyle", value, oldValue);
        }
        set borderColor(value) {
            const oldValue = this._borderColor;
            this._borderColor = value;
            this.emitOnChange("borderColor", value, oldValue);
        }
        set fontFamily(value) {
            const oldValue = this._fontFamily;
            this._fontFamily = value;
            this.emitOnChange("fontFamily", value, oldValue);
        }
        set fontSize(value) {
            const oldValue = this._fontSize;
            this._fontSize = value;
            this.emitOnChange("fontSize", value, oldValue);
        }
        set fontWeight(value) {
            const oldValue = this._fontWeight;
            this._fontWeight = value;
            this.emitOnChange("fontWeight", value, oldValue);
        }
        getPropertyDefinitions() {
            return [
                {
                    field: "color",
                    label: "字体颜色",
                    type: "string",
                    editor: new ColorPicker({ defaultValue: "#000000" }),
                },
                {
                    field: "backgroundColor",
                    label: "背景色",
                    type: "string",
                    editor: new ColorPicker({ defaultValue: "#ffffff" }),
                },
                {
                    field: "textAlign",
                    label: "水平布局",
                    type: "string",
                    editor: createTextAlignDropdownEditor(),
                },
                { field: "borderWidth", label: "边框宽度", type: "number" },
                {
                    field: "borderStyle",
                    label: "边框样式",
                    type: "string",
                    editor: createBorderStyleDropdownEditor(),
                },
                {
                    field: "borderColor",
                    label: "边框颜色",
                    type: "string",
                    editor: new ColorPicker({ defaultValue: "#000000" }),
                },
                {
                    field: "fontFamily",
                    label: "字体",
                    type: "string",
                    editor: createFontFamilyDropdownEditor(),
                },
                {
                    field: "fontSize",
                    label: "字号",
                    type: "string",
                    editor: createFontSizeDropdownEditor(),
                },
                {
                    field: "fontWeight",
                    label: "字体粗细",
                    type: "string",
                    editor: createFontWeightDropdownEditor(),
                },
            ];
        }
    }

    class ReportItemProperties extends StyleProperties {
        constructor() {
            super(...arguments);
            this._x = 0;
            this._y = 0;
            this._width = 0;
            this._height = 0;
            this._name = "";
            this._text = "";
            this._binding = "";
        }
        get x() {
            return this._x;
        }
        get y() {
            return this._y;
        }
        get width() {
            return this._width;
        }
        get height() {
            return this._height;
        }
        get name() {
            return this._name;
        }
        get text() {
            return this._text;
        }
        get binding() {
            return this._binding;
        }
        set x(value) {
            const oldValue = this.x;
            this._x = value;
            this.emitOnChange("x", value, oldValue);
        }
        set y(value) {
            const oldValue = this._y;
            this._y = value;
            this.emitOnChange("y", value, oldValue);
        }
        set width(value) {
            const oldValue = this.width;
            this._width = value;
            this.emitOnChange("width", value, oldValue);
        }
        set height(value) {
            const oldValue = this.height;
            this._height = value;
            this.emitOnChange("height", value, oldValue);
        }
        set name(value) {
            const oldValue = this.name;
            this._name = value;
            this.emitOnChange("name", value, oldValue);
        }
        set text(value) {
            const oldValue = this.text;
            this._text = value;
            this.emitOnChange("text", value, oldValue);
        }
        set binding(value) {
            const oldValue = this.binding;
            this._binding = value;
            this.emitOnChange("binding", value, oldValue);
        }
        getPropertyDefinitions() {
            return [
                { field: "x", label: "X", type: "number" },
                { field: "y", label: "Y", type: "number" },
                { field: "width", label: "宽", type: "number" },
                { field: "height", label: "高", type: "number" },
                { field: "name", label: "标题", type: "string" },
                { field: "text", label: "内容", type: "string" },
                { field: "binding", label: "字段", type: "string" },
                ...super.getPropertyDefinitions(),
            ];
        }
    }

    class ReportItem {
        constructor(options) {
            if (options.defaultProperties && options.defaultProperties.text == 'Image') {
                this.element = document.createElement('img');
            } else {
                this.element = document.createElement(options.tag);
            }

            this.properties = new ReportItemProperties();
            this._changeEventEmitter = new EventEmitter();
            if (options.appendTo) {
                options.appendTo.appendChild(this.element);
            }
            this._styles = new MultipleStyles(...options.parentStyles, this.properties);
            if (options.defaultProperties) {
                this.loadLayout(options.defaultProperties);
            }
            this._init();
        }
        _init() {
            this.element.tabIndex = 0;
            this.element.style.display = "inline-block";
            this.element.style.position = "absolute";
            this.element.style.userSelect = "none";
            this.element.style.outline = "none";
            this.element.style.whiteSpace = "nowrap";
            this.element.style.overflow = "hidden";
            this.element.style.textOverflow = "ellipsis";
            this._styles.getList().forEach((styles) => {
                styles.addEventListener("change", () => this.refresh());
            });
            this.properties.addEventListener("change", (e) => this._onChange(e));
            this.refresh();
        }
        refresh() {
            this.element.style.left = `${this.properties.x}px`;
            this.element.style.top = `${this.properties.y}px`;
            this.element.style.width = `${this.properties.width}px`;
            this.element.style.height = `${this.properties.height}px`;
            this.element.innerText = this.properties.text;
            this.element.style.color = this._styles.getStyle("color", "");
            this.element.style.backgroundColor = this._styles.getStyle("backgroundColor", "");
            this.element.style.textAlign = this._styles.getStyle("textAlign", "");
            this.element.style.borderWidth =
                this._styles.getStyle("borderWidth", "0") + "px";
            this.element.style.borderStyle = this._styles.getStyle("borderStyle", "");
            this.element.style.borderColor = this._styles.getStyle("borderColor", "#000000");
            this.element.style.fontFamily = this._styles.getStyle("fontFamily", "Tahoma");
            this.element.style.fontSize = this._styles.getStyle("fontSize", "12px");
            this.element.style.fontWeight = this._styles.getStyle("fontWeight", "");
        }
        addEventListener(event, listener) {
            switch (event) {
                case "change":
                    const callbackOnChange = listener;
                    this._changeEventEmitter.add(callbackOnChange);
                    break;
                case "focus":
                    const callbackOnFocus = listener;
                    this.element.addEventListener("focus", () => callbackOnFocus(undefined));
                    break;
            }
        }
        dispose() {
            this.element.remove();
        }
        loadLayout(layout) {
            var _a, _b, _c, _d, _e, _f;
            this.properties.beginUpdate();
            this.properties.x = (_a = layout.x) !== null && _a !== void 0 ? _a : 0;
            this.properties.y = (_b = layout.y) !== null && _b !== void 0 ? _b : 0;
            this.properties.width = (_c = layout.width) !== null && _c !== void 0 ? _c : 0;
            this.properties.height = (_d = layout.height) !== null && _d !== void 0 ? _d : 0;
            this.properties.name = (_e = layout.name) !== null && _e !== void 0 ? _e : "";
            this.properties.text = (_f = layout.text) !== null && _f !== void 0 ? _f : "";
            this.properties.binding = layout.binding || "";
            this.properties.color = layout.color;
            this.properties.backgroundColor = layout.backgroundColor;
            this.properties.textAlign = layout.textAlign;
            this.properties.borderWidth = layout.borderWidth;
            this.properties.borderStyle = layout.borderStyle;
            this.properties.borderColor = layout.borderColor;
            this.properties.fontFamily = layout.fontFamily;
            this.properties.fontSize = layout.fontSize;
            this.properties.fontWeight = layout.fontWeight;
            this.properties.endUpdate();
            this.refresh();
        }
        toJSON() {
            return {
                x: this.properties.x,
                y: this.properties.y,
                width: this.properties.width,
                height: this.properties.height,
                name: this.properties.name,
                text: this.properties.text,
                binding: this.properties.binding,
                color: this.properties.color,
                backgroundColor: this.properties.backgroundColor,
                textAlign: this.properties.textAlign,
                borderWidth: this.properties.borderWidth,
                borderStyle: this.properties.borderStyle,
                borderColor: this.properties.borderColor,
                fontFamily: this.properties.fontFamily,
                fontSize: this.properties.fontSize,
                fontWeight: this.properties.fontWeight,
            };
        }
        _onChange(args) {
            this._changeEventEmitter.emit(args);
        }
    }

    class DesignerReportItem extends ReportItem {
        constructor(options) {
            super(options);
            this.element.style.cursor = "pointer";
        }
        refresh() {
            super.refresh();
            if (this.properties.binding) {
                if (this.element.tagName == 'IMG') {
                    this.element.src = logo;
                } else {
                    this.element.innerText = `[${this.properties.binding}]`;
                }
            }
            this.element.style.border =
                this.element.style.border || "1px solid #cccccc";
        }
    }

    class Size {
        constructor(width, height, onchange) {
            this.onchange = onchange;
            this._width = 0;
            this._height = 0;
            if (width)
                this._width = width;
            if (height)
                this._height = height;
        }
        get width() {
            return this._width;
        }
        set width(value) {
            this._width = value;
            if (this.onchange)
                this.onchange();
        }
        get height() {
            return this._height;
        }
        set height(value) {
            this._height = value;
            if (this.onchange)
                this.onchange();
        }
    }

    const NORMALIZE_POINT_TOLERANCE_PX = 3;
    function normalizePoints(edges, selector, items) {
        const isMoving = edges.left && edges.right && edges.top && edges.bottom;
        const normalizedPoints = {
            left: selector.newLocation.x,
            top: selector.newLocation.y,
            right: selector.newLocation.x + selector.newSize.width,
            bottom: selector.newLocation.y + selector.newSize.height,
        };
        items.forEach((item) => {
            const left = item.properties.x;
            const right = left + item.properties.width;
            const top = item.properties.y;
            const bottom = top + item.properties.height;
            // TOP
            // Item Top
            if (edges.top &&
                Math.abs(normalizedPoints.top - top) <= NORMALIZE_POINT_TOLERANCE_PX) {
                normalizedPoints.top = top;
                if (isMoving) {
                    normalizedPoints.bottom = top + selector.newSize.height;
                }
            }
            // Item Bottom
            if (edges.top &&
                Math.abs(normalizedPoints.top - bottom) <= NORMALIZE_POINT_TOLERANCE_PX) {
                normalizedPoints.top = bottom;
                if (isMoving) {
                    normalizedPoints.bottom = bottom + selector.newSize.height;
                }
            }
            // BOTTOM
            // Item Bottom
            if (edges.bottom &&
                Math.abs(normalizedPoints.bottom - bottom) <= NORMALIZE_POINT_TOLERANCE_PX) {
                normalizedPoints.bottom = bottom;
                if (isMoving) {
                    normalizedPoints.top = bottom - selector.newSize.height;
                }
            }
            // Item Top
            if (edges.bottom &&
                Math.abs(normalizedPoints.bottom - top) <= NORMALIZE_POINT_TOLERANCE_PX) {
                normalizedPoints.bottom = top;
                if (isMoving) {
                    normalizedPoints.top = top - selector.newSize.height;
                }
            }
            // LEFT
            // Item Left
            if (edges.left &&
                Math.abs(normalizedPoints.left - left) <= NORMALIZE_POINT_TOLERANCE_PX) {
                normalizedPoints.left = left;
                if (isMoving) {
                    normalizedPoints.right = left + selector.newSize.width;
                }
            }
            // Item Right
            if (edges.left &&
                Math.abs(normalizedPoints.left - right) <= NORMALIZE_POINT_TOLERANCE_PX) {
                normalizedPoints.left = right;
                if (isMoving) {
                    normalizedPoints.right = right + selector.newSize.width;
                }
            }
            // RIGHT
            // Item Right
            if (edges.right &&
                Math.abs(normalizedPoints.right - right) <= NORMALIZE_POINT_TOLERANCE_PX) {
                normalizedPoints.right = right;
                if (isMoving) {
                    normalizedPoints.left = right - selector.newSize.width;
                }
            }
            // Item Left
            if (edges.right &&
                Math.abs(normalizedPoints.right - left) <= NORMALIZE_POINT_TOLERANCE_PX) {
                normalizedPoints.right = left;
                if (isMoving) {
                    normalizedPoints.left = left - selector.newSize.width;
                }
            }
        });
        return normalizedPoints;
    }

    var SelectorBoundOrientation;
    (function (SelectorBoundOrientation) {
        SelectorBoundOrientation["TopLeft"] = "top-left";
        SelectorBoundOrientation["TopCenter"] = "top-center";
        SelectorBoundOrientation["TopRight"] = "top-right";
        SelectorBoundOrientation["MiddleLeft"] = "middle-left";
        SelectorBoundOrientation["MiddleRight"] = "middle-right";
        SelectorBoundOrientation["BottomLeft"] = "bottom-left";
        SelectorBoundOrientation["BottomCenter"] = "bottom-center";
        SelectorBoundOrientation["BottomRight"] = "bottom-right";
    })(SelectorBoundOrientation || (SelectorBoundOrientation = {}));
    class SelectorBound {
        constructor(orientation) {
            this.orientation = orientation;
            this.element = document.createElement("div");
            this.init();
        }
        init() {
            this.element.classList.add("anka-selector-bound");
            this.element.classList.add(this.orientation);
        }
    }

    const LONG_MOVE_DISTANCE = 10;
    const SHORT_MOVE_DISTANCE = 1;
    class ReportItemSelector {
        constructor(mouseMoveContainer) {
            this.mouseMoveContainer = mouseMoveContainer;
            this.element = document.createElement("div");
            this.attachedTo = [];
            this.boundTL = new SelectorBound(SelectorBoundOrientation.TopLeft);
            this.boundTC = new SelectorBound(SelectorBoundOrientation.TopCenter);
            this.boundTR = new SelectorBound(SelectorBoundOrientation.TopRight);
            this.boundML = new SelectorBound(SelectorBoundOrientation.MiddleLeft);
            this.boundMR = new SelectorBound(SelectorBoundOrientation.MiddleRight);
            this.boundBL = new SelectorBound(SelectorBoundOrientation.BottomLeft);
            this.boundBC = new SelectorBound(SelectorBoundOrientation.BottomCenter);
            this.boundBR = new SelectorBound(SelectorBoundOrientation.BottomRight);
            this.originalLocation = new Point();
            this.originalSize = new Size();
            this.newLocation = new Point();
            this.newSize = new Size();
            this.init();
        }
        init() {
            this.onKeyDown = this.onKeyDown.bind(this);
            this.onItemPropertyChange = this.onItemPropertyChange.bind(this);
            this.element.classList.add("anka-report-item-selector");
            this.element.appendChild(this.boundTL.element);
            this.element.appendChild(this.boundTC.element);
            this.element.appendChild(this.boundTR.element);
            this.element.appendChild(this.boundML.element);
            this.element.appendChild(this.boundMR.element);
            this.element.appendChild(this.boundBL.element);
            this.element.appendChild(this.boundBC.element);
            this.element.appendChild(this.boundBR.element);
            this.element.tabIndex = -1;
            this.hide();
            this.initMoveDragDrop();
            this.initBoundsDragDrop();
        }
        initMoveDragDrop() {
            new DragDrop({
                element: this.element,
                container: this.mouseMoveContainer.element,
                onMouseMove: (e) => {
                    this.newLocation.x = this.originalLocation.x + e.offsetX;
                    this.newLocation.y = this.originalLocation.y + e.offsetY;
                    this.normalize({ left: true, right: true, top: true, bottom: true });
                    this.refresh();
                },
                onMouseUp: () => this.applyInfoToElement(),
            });
        }
        initBoundsDragDrop() {
            // Top Left
            new DragDrop({
                element: this.boundTL.element,
                container: this.mouseMoveContainer.element,
                onMouseMove: (e) => {
                    this.newLocation.x = this.originalLocation.x + e.offsetX;
                    this.newLocation.y = this.originalLocation.y + e.offsetY;
                    this.newSize.width = this.originalSize.width - e.offsetX;
                    this.newSize.height = this.originalSize.height - e.offsetY;
                    this.normalize({ top: true, left: true });
                    this.refresh();
                },
                onMouseUp: () => this.applyInfoToElement(),
            });
            // Top Center
            new DragDrop({
                element: this.boundTC.element,
                container: this.mouseMoveContainer.element,
                onMouseMove: (e) => {
                    this.newLocation.y = this.originalLocation.y + e.offsetY;
                    this.newSize.height = this.originalSize.height - e.offsetY;
                    this.normalize({ top: true });
                    this.refresh();
                },
                onMouseUp: () => this.applyInfoToElement(),
            });
            // Top Right
            new DragDrop({
                element: this.boundTR.element,
                container: this.mouseMoveContainer.element,
                onMouseMove: (e) => {
                    this.newLocation.y = this.originalLocation.y + e.offsetY;
                    this.newSize.width = this.originalSize.width + e.offsetX;
                    this.newSize.height = this.originalSize.height - e.offsetY;
                    this.normalize({ top: true, right: true });
                    this.refresh();
                },
                onMouseUp: () => this.applyInfoToElement(),
            });
            // Middle Left
            new DragDrop({
                element: this.boundML.element,
                container: this.mouseMoveContainer.element,
                onMouseMove: (e) => {
                    this.newLocation.x = this.originalLocation.x + e.offsetX;
                    this.newSize.width = this.originalSize.width - e.offsetX;
                    this.normalize({ left: true });
                    this.refresh();
                },
                onMouseUp: () => this.applyInfoToElement(),
            });
            // Middle Right
            new DragDrop({
                element: this.boundMR.element,
                container: this.mouseMoveContainer.element,
                onMouseMove: (e) => {
                    this.newSize.width = this.originalSize.width + e.offsetX;
                    this.normalize({ right: true });
                    this.refresh();
                },
                onMouseUp: () => this.applyInfoToElement(),
            });
            // Bottom Left
            new DragDrop({
                element: this.boundBL.element,
                container: this.mouseMoveContainer.element,
                onMouseMove: (e) => {
                    this.newLocation.x = this.originalLocation.x + e.offsetX;
                    this.newSize.width = this.originalSize.width - e.offsetX;
                    this.newSize.height = this.originalSize.height + e.offsetY;
                    this.normalize({ bottom: true, left: true });
                    this.refresh();
                },
                onMouseUp: () => this.applyInfoToElement(),
            });
            // Bottom Center
            new DragDrop({
                element: this.boundBC.element,
                container: this.mouseMoveContainer.element,
                onMouseMove: (e) => {
                    this.newSize.height = this.originalSize.height + e.offsetY;
                    this.normalize({ bottom: true });
                    this.refresh();
                },
                onMouseUp: () => this.applyInfoToElement(),
            });
            // Bottom Right
            new DragDrop({
                element: this.boundBR.element,
                container: this.mouseMoveContainer.element,
                onMouseMove: (e) => {
                    this.newSize.width = this.originalSize.width + e.offsetX;
                    this.newSize.height = this.originalSize.height + e.offsetY;
                    this.normalize({ bottom: true, right: true });
                    this.refresh();
                },
                onMouseUp: () => this.applyInfoToElement(),
            });
        }
        onKeyDown(e) {
            const moveDistance = e.shiftKey ? SHORT_MOVE_DISTANCE : LONG_MOVE_DISTANCE;
            switch (e.key) {
                case "ArrowUp":
                    this.newLocation.y -= moveDistance;
                    this.applyInfoToElement();
                    break;
                case "ArrowDown":
                    this.newLocation.y += moveDistance;
                    this.applyInfoToElement();
                    break;
                case "ArrowLeft":
                    this.newLocation.x -= moveDistance;
                    this.applyInfoToElement();
                    break;
                case "ArrowRight":
                    this.newLocation.x += moveDistance;
                    this.applyInfoToElement();
                    break;
            }
        }
        normalize(edges) {
            const normalizedPoints = normalizePoints(edges, this, this.mouseMoveContainer.items);
            this.newLocation.x = normalizedPoints.left;
            this.newLocation.y = normalizedPoints.top;
            this.newSize.width = normalizedPoints.right - normalizedPoints.left;
            this.newSize.height = normalizedPoints.bottom - normalizedPoints.top;
        }
        refresh() {
            this.element.style.left = this.newLocation.x + "px";
            this.element.style.top = this.newLocation.y + "px";
            this.element.style.width = this.newSize.width + "px";
            this.element.style.height = this.newSize.height + "px";
        }
        show(items) {
            if (this.attachedTo.length > 0) {
                this.hide();
            }
            this.attachedTo = [...items];
            const maxX = Math.max(...items.map((i) => i.properties.x + i.properties.width));
            const maxY = Math.max(...items.map((i) => i.properties.y + i.properties.height));
            this.originalLocation.x = Math.min(...items.map((i) => i.properties.x));
            this.originalLocation.y = Math.min(...items.map((i) => i.properties.y));
            this.originalSize.width = maxX - this.originalLocation.x;
            this.originalSize.height = maxY - this.originalLocation.y;
            this.newLocation.x = this.originalLocation.x;
            this.newLocation.y = this.originalLocation.y;
            this.newSize.width = this.originalSize.width;
            this.newSize.height = this.originalSize.height;
            this.element.style.display = "block";
            this.element.addEventListener("keydown", this.onKeyDown);
            this.refresh();
            for (const item of items) {
                item.properties.addEventListener("change", this.onItemPropertyChange);
            }
            this.element.focus();
        }
        onItemPropertyChange(e) {
            const properties = ["width", "height", "x", "y"];
            const changedProperties = e.changes.filter((x) => properties.includes(x.property));
            if (changedProperties.length > 0) {
                this.show(this.attachedTo);
            }
        }
        hide() {
            this.element.removeEventListener("keydown", this.onKeyDown);
            if (this.attachedTo.length > 0) {
                for (const item of this.attachedTo) {
                    item.properties.removeEventListener("change", this.onItemPropertyChange);
                }
            }
            this.attachedTo = [];
            this.element.style.display = "none";
        }
        applyInfoToElement() {
            const diffX = this.newLocation.x - this.originalLocation.x;
            const diffY = this.newLocation.y - this.originalLocation.y;
            const diffWidth = this.newSize.width - this.originalSize.width;
            const diffHeight = this.newSize.height - this.originalSize.height;
            for (const item of this.attachedTo) {
                item.properties.beginUpdate();
                item.properties.x = item.properties.x + diffX;
                item.properties.y = item.properties.y + diffY;
                item.properties.width = item.properties.width + diffWidth;
                item.properties.height = item.properties.height + diffHeight;
                item.properties.endUpdate();
            }
            this.show(this.attachedTo);
        }
        addEventListener(event, listener) {
            switch (event) {
                case "contextmenu":
                    this.element.addEventListener("contextmenu", (e) => {
                        if (!this.attachedTo)
                            return;
                        const args = {
                            items: this.attachedTo,
                            width: "150px",
                            buttons: [],
                            onClick: () => { },
                        };
                        listener(args);
                        if (args.buttons.length === 0)
                            return;
                        e.preventDefault();
                        new ContextMenu({
                            width: args.width,
                            buttons: args.buttons,
                            top: e.clientY,
                            left: e.clientX,
                            onClick: args.onClick,
                        });
                    });
                    break;
            }
        }
    }

    function getSubsectionDataList(items, sections) {
        if (!items)
            return [];
        const subsectionDataList = items.filter((x) => x.children && x.children.length > 0);
        const existingFields = sections.map((x) => x.properties.binding);
        return subsectionDataList.filter((x) => !existingFields.includes(x.field));
    }
    function getReportSectionBindings(section) {
        const result = [];
        let iterator = section;
        while (iterator) {
            result.push(iterator.properties.binding);
            iterator = iterator.parent;
        }
        return result;
    }
    function findItemsByRect(items, rect) {
        const selected = [];
        for (const item of items) {
            if (isItemInRect(rect, item)) {
                selected.push(item);
            }
        }
        return selected;
    }
    function isItemInRect(rect, item) {
        if (!isPointInRect(rect, { x: item.properties.x, y: item.properties.y }))
            return false;
        const br = {
            x: item.properties.x + item.properties.width,
            y: item.properties.y + item.properties.height,
        };
        if (!isPointInRect(rect, br))
            return false;
        return true;
    }
    function isPointInRect(rect, point) {
        return (rect.x < point.x &&
            point.x < rect.x + rect.width &&
            rect.y < point.y &&
            point.y < rect.y + rect.height);
    }

    const DEFAULT_SECTION_HEIGHT = 100;
    const MIN_SECTION_HEIGHT = 10;
    class ReportSectionProperties extends StyleProperties {
        constructor() {
            super(...arguments);
            this._height = DEFAULT_SECTION_HEIGHT;
            this._binding = "";
            this._title = "Section";
        }
        get height() {
            return this._height;
        }
        get binding() {
            return this._binding;
        }
        get title() {
            return this._title;
        }
        set height(value) {
            const oldValue = this.height;
            this._height = Math.max(MIN_SECTION_HEIGHT, value);
            this.emitOnChange("height", value, oldValue);
        }
        set binding(value) {
            const oldValue = this.binding;
            this._binding = value;
            this.emitOnChange("binding", value, oldValue);
        }
        set title(value) {
            const oldValue = this.title;
            this._title = value;
            this.emitOnChange("title", value, oldValue);
        }
        getPropertyDefinitions() {
            return [
                { field: "height", label: "高", type: "number" },
                ...super.getPropertyDefinitions(),
            ];
        }
    }

    class AreaSelector {
        constructor(options) {
            this.options = options;
            this.element = document.createElement("div");
            this._selectEventEmitter = new EventEmitter();
            this._x = 0;
            this._y = 0;
            this._startX = 0;
            this._startY = 0;
            this._endX = 0;
            this._endY = 0;
            this._onMouseDown = this._onMouseDown.bind(this);
            this._onMouseMove = this._onMouseMove.bind(this);
            this._onMouseUp = this._onMouseUp.bind(this);
            this._init();
        }
        _init() {
            this.element.classList.add("anka-area-selector");
            this.options.area.appendChild(this.element);
            this.element.style.display = "none";
            this.options.area.addEventListener("mousedown", this._onMouseDown);
        }
        _getRect() {
            let x = this._x;
            let y = this._y;
            let width = this._endX - this._startX;
            let height = this._endY - this._startY;
            if (width < 0) {
                x += width;
                width = width * -1;
            }
            if (height < 0) {
                y += height;
                height = height * -1;
            }
            return { x, y, width, height };
        }
        addEventListener(event, listener) {
            if (event === "select") {
                this._selectEventEmitter.add(listener);
            }
        }
        refresh() {
            const rect = this._getRect();
            this.element.style.left = rect.x + "px";
            this.element.style.top = rect.y + "px";
            this.element.style.width = rect.width + "px";
            this.element.style.height = rect.height + "px";
        }
        _onMouseDown(e) {
            if (e.target !== this.options.area)
                return;
            this._x = e.offsetX;
            this._y = e.offsetY;
            this._startX = e.x;
            this._startY = e.y;
            this._endX = e.x;
            this._endY = e.y;
            this.options.area.addEventListener("mousemove", this._onMouseMove);
            document.body.addEventListener("mouseup", this._onMouseUp);
            this.element.style.display = "";
            this.refresh();
        }
        _onMouseMove(e) {
            this._endX = e.x;
            this._endY = e.y;
            this.refresh();
        }
        _onMouseUp() {
            this.options.area.removeEventListener("mousemove", this._onMouseMove);
            document.body.removeEventListener("mouseup", this._onMouseUp);
            this.element.style.display = "none";
            this._selectEventEmitter.emit(this._getRect());
        }
    }

    class ReportSection {
        constructor(options) {
            this.element = document.createElement("div");
            this.elementHeader = document.createElement("div");
            this.elementContent = document.createElement("div");
            this.reportItemSelector = new ReportItemSelector(this);
            this.areaSelector = new AreaSelector({
                area: this.elementContent,
            });
            this.resizer = new Resizer({
                orientation: ResizerOrientation.Horizontal,
                onResize: (e) => {
                    this.properties.height = this.properties.height + e.offsetY;
                },
            });
            this.items = [];
            this.subsections = [];
            this.properties = new ReportSectionProperties();
            this._changeEventEmitter = new EventEmitter();
            this._selectEventEmitter = new EventEmitter();
            if (options.appendTo) {
                options.appendTo.appendChild(this.element);
            }
            this.properties.binding = options.binding || "";
            this.properties.title = options.title;
            this._designer = options.designer;
            this.parent = options.parent;
            this.styles = new MultipleStyles(...options.parentStyles, this.properties);
            this._init(options.defaultProperties);
        }
        _init(defaultProperties) {
            this.element.classList.add("anka-report-section");
            this.elementHeader.classList.add("anka-report-section__header");
            this.elementContent.classList.add("anka-report-section__content");
            this.element.tabIndex = 0;
            this.element.appendChild(this.elementHeader);
            this.element.appendChild(this.elementContent);
            this.elementContent.appendChild(this.reportItemSelector.element);
            this.elementContent.appendChild(this.resizer.element);
            if (defaultProperties) {
                this.loadLayout(defaultProperties);
            }
            this.refresh();
            this.element.addEventListener("focus", () => {
                this._onSelect({
                    type: "ReportSection",
                    element: this,
                });
            });
            this.properties.addEventListener("change", (e) => {
                this.refresh();
                this._onChange({
                    type: "change-section",
                    section: this,
                    changes: e.changes,
                });
            });
            this.elementContent.ondragover = (e) => e.preventDefault();
            this.elementContent.ondrop = (e) => this._onContentDrop(e);
            this.areaSelector.addEventListener("select", (e) => {
                const items = findItemsByRect(this.items, e);
                this.selectItem(items);
            });
            this.element.addEventListener("contextmenu", (e) => {
                if (!this.properties.binding)
                    return;
                if (e.target !== this.elementContent && e.target !== this.elementHeader) {
                    return;
                }
                const dataSource = this._designer.getDataSource();
                const bindings = getReportSectionBindings(this);
                let sectionDataSource = dataSource;
                for (let i = bindings.length - 1; i >= 0; i--) {
                    const field = bindings[i];
                    const dataSourceItem = sectionDataSource.find((x) => x.field === field);
                    // TODO: Possible null value here
                    sectionDataSource = dataSourceItem === null || dataSourceItem === void 0 ? void 0 : dataSourceItem.children;
                }
                const subsectionDataList = getSubsectionDataList(sectionDataSource, this.subsections);
                const buttons = subsectionDataList.map((x) => ({
                    key: "add-section",
                    label: `Add Section (${x.label})`,
                    data: x,
                }));
                if (this.parent) {
                    buttons.push({
                        key: "remove-section",
                        label: "Remove Section",
                        data: this,
                    });
                }
                if (buttons.length === 0)
                    return;
                e.preventDefault();
                new ContextMenu({
                    width: "150px",
                    buttons,
                    top: e.clientY,
                    left: e.clientX,
                    onClick: (e) => {
                        switch (e.key) {
                            case "remove-section":
                                this.parent.removeSection(this);
                                break;
                            case "add-section":
                                const data = e.data;
                                this.createSection({ binding: data.field });
                                break;
                        }
                    },
                });
            });
            this.reportItemSelector.addEventListener("contextmenu", (e) => {
                e.buttons = [{ key: "remove", label: "Remove" }];
                e.onClick = (args) => {
                    if (args.key === "remove") {
                        this.removeSelectedItem();
                    }
                };
            });
        }
        refresh() {
            this.elementHeader.innerText = this._getHeaderText();
            this.elementContent.style.height = `${this.properties.height}px`;
        }
        addEventListener(event, listener) {
            switch (event) {
                case "select":
                    const callbackSelect = listener;
                    this._selectEventEmitter.add(callbackSelect);
                    break;
                case "change":
                    const callbackOnChange = listener;
                    this._changeEventEmitter.add(callbackOnChange);
                    break;
            }
        }
        createItem(defaultProperties) {
            const item = new DesignerReportItem({
                parentStyles: this.styles.getList(),
                defaultProperties,
                appendTo: this.elementContent,
            });
            item.addEventListener("change", (e) => {
                this._onChange({ type: "change-item", item, changes: e.changes });
            });
            item.addEventListener("focus", () => this.selectItem([item]));
            this.items.push(item);
            this._onChange({ type: "add-item", item });
            return item;
        }
        removeSelectedItem() {
            const items = this.reportItemSelector.attachedTo;
            for (const item of items) {
                this.reportItemSelector.hide();
                this.removeItem(item);
                this._onChange({ type: "remove-item", item });
            }
        }
        removeItem(item) {
            const index = this.items.findIndex((x) => x === item);
            this.items.splice(index, 1);
            item.dispose();
        }
        selectItem(items) {
            this.deselectAll();
            if (items.length === 0)
                return;
            this.reportItemSelector.show(items);
            this._onSelect({ type: "ReportItem", element: items[0] }); // Fix here
        }
        deselectAll() {
            this.reportItemSelector.hide();
            this.subsections.forEach((x) => x.deselectAll());
        }
        createSection(defaultProperties) {
            const section = new ReportSection({
                title: "Content",
                binding: "",
                designer: this._designer,
                parent: this,
                parentStyles: this.styles.getList(),
                defaultProperties,
                appendTo: this.element,
            });
            section.addEventListener("change", (e) => this._onChange(e));
            section.addEventListener("select", (e) => this._onSelect(e));
            this.subsections.push(section);
            this._onChange({ type: "add-section", section });
            return section;
        }
        removeSection(section) {
            const index = this.subsections.findIndex((x) => x === section);
            if (index < 0)
                return;
            this.subsections.splice(index, 1);
            this._onChange({ type: "remove-section", section });
            section.dispose();
        }
        loadLayout(layout) {
            var _a, _b;
            if (layout.height)
                this.properties.height = layout.height;
            if (layout.binding)
                this.properties.binding = layout.binding;
            (_a = layout.items) === null || _a === void 0 ? void 0 : _a.forEach((data) => {
                this.createItem(data);
            });
            (_b = layout.sections) === null || _b === void 0 ? void 0 : _b.forEach((data) => {
                this.createSection(data);
            });
            this.properties.beginUpdate();
            this.properties.color = layout.color;
            this.properties.backgroundColor = layout.backgroundColor;
            this.properties.textAlign = layout.textAlign;
            this.properties.borderWidth = layout.borderWidth;
            this.properties.borderStyle = layout.borderStyle;
            this.properties.borderColor = layout.borderColor;
            this.properties.fontFamily = layout.fontFamily;
            this.properties.fontSize = layout.fontSize;
            this.properties.fontWeight = layout.fontWeight;
            this.properties.endUpdate();
            this.refresh();
        }
        toJSON() {
            return {
                height: this.properties.height,
                binding: this.properties.binding,
                items: this.items.map((x) => x.toJSON()),
                sections: this.subsections.map((x) => x.toJSON()),
                color: this.properties.color,
                backgroundColor: this.properties.backgroundColor,
                textAlign: this.properties.textAlign,
                borderWidth: this.properties.borderWidth,
                borderStyle: this.properties.borderStyle,
                borderColor: this.properties.borderColor,
                fontFamily: this.properties.fontFamily,
                fontSize: this.properties.fontSize,
                fontWeight: this.properties.fontWeight,
            };
        }
        dispose() {
            this.element.remove();
        }
        _getHeaderText() {
            let title = this.properties.title;
            if (this.properties.binding) {
                title += ` (${this.properties.binding})`;
            }
            return title;
        }
        _onChange(args) {
            this._changeEventEmitter.emit(args);
        }
        _onContentDrop(e) {
            var _a, _b;
            e.preventDefault();
            const text = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData("label");
            const item = this.createItem({
                text: text || "Label",
                binding: ((_b = e.dataTransfer) === null || _b === void 0 ? void 0 : _b.getData("field")) || "",
                x: e.offsetX,
                y: e.offsetY,
                width: 100,
                height: 20,
            });
            this.selectItem([item]);
        }
        _onSelect(args) {
            this._selectEventEmitter.emit(args);
        }
    }

    const DEFAULT_REPORT_WIDTH = 400;
    const MIN_REPORT_WIDTH = 100;
    class ReportProperties extends StyleProperties {
        constructor() {
            super(...arguments);
            this._width = DEFAULT_REPORT_WIDTH;
        }
        get width() {
            return this._width;
        }
        set width(value) {
            const oldValue = this.width;
            this._width = Math.max(value, MIN_REPORT_WIDTH);
            this.emitOnChange("width", value, oldValue);
        }
        getPropertyDefinitions() {
            return [
                { field: "width", label: "宽度", type: "number" },
                ...super.getPropertyDefinitions(),
            ];
        }
    }

    class Report {
        constructor(options) {
            this.element = document.createElement("div");
            this.resizer = new Resizer({
                orientation: ResizerOrientation.Vertical,
                onResize: (e) => {
                    this.properties.width = this.properties.width + e.offsetX;
                },
            });
            this.properties = new ReportProperties();
            this._changeEventEmitter = new EventEmitter();
            this.reportSectionHeader = new ReportSection({
                title: "Header",
                designer: options.designer,
                parentStyles: [this.properties],
                appendTo: this.element,
            });
            this.reportSectionContent = new ReportSection({
                title: "Content",
                designer: options.designer,
                parentStyles: [this.properties],
                appendTo: this.element,
            });
            this.reportSectionFooter = new ReportSection({
                title: "Footer",
                designer: options.designer,
                parentStyles: [this.properties],
                appendTo: this.element,
            });
            this._init();
        }
        _init() {
            this.element.classList.add("anka-report");
            this.element.tabIndex = 0;
            this.element.appendChild(this.resizer.element);
            this.properties.addEventListener("change", (e) => {
                this.refresh();
                this._onChange({
                    type: "change-report",
                    report: this,
                    changes: e.changes,
                });
            });
            this._initChangeEvents();
            this._initKeyDownEvents();
            this._initSelectEvents();
            this.refresh();
        }
        _initChangeEvents() {
            this.reportSectionHeader.addEventListener("change", (e) => {
                this._onChange(e);
            });
            this.reportSectionContent.addEventListener("change", (e) => {
                this._onChange(e);
            });
            this.reportSectionFooter.addEventListener("change", (e) => {
                this._onChange(e);
            });
        }
        _initKeyDownEvents() {
            this.element.addEventListener("keydown", (e) => {
                if (e.key === "Delete") {
                    this.reportSectionHeader.removeSelectedItem();
                    this.reportSectionContent.removeSelectedItem();
                    this.reportSectionFooter.removeSelectedItem();
                }
            });
        }
        _initSelectEvents() {
            this.reportSectionHeader.addEventListener("select", (e) => {
                this._deselectExcept(e, this.reportSectionHeader);
            });
            this.reportSectionContent.addEventListener("select", (e) => {
                this._deselectExcept(e, this.reportSectionContent);
            });
            this.reportSectionFooter.addEventListener("select", (e) => {
                this._deselectExcept(e, this.reportSectionFooter);
            });
        }
        _deselectExcept(e, exceptReportSection) {
            if (e.type !== "ReportItem" ||
                exceptReportSection !== this.reportSectionHeader) {
                this.reportSectionHeader.deselectAll();
            }
            if (e.type !== "ReportItem" ||
                exceptReportSection !== this.reportSectionContent) {
                this.reportSectionContent.deselectAll();
            }
            if (e.type !== "ReportItem" ||
                exceptReportSection !== this.reportSectionFooter) {
                this.reportSectionFooter.deselectAll();
            }
        }
        refresh() {
            this.element.style.width = `${this.properties.width}px`;
        }
        addEventListener(event, listener) {
            switch (event) {
                case "select":
                    this.reportSectionHeader.addEventListener(event, listener);
                    this.reportSectionContent.addEventListener(event, listener);
                    this.reportSectionFooter.addEventListener(event, listener);
                    break;
                case "change":
                    const callbackOnChange = listener;
                    this._changeEventEmitter.add(callbackOnChange);
                    break;
            }
        }
        loadLayout(layout) {
            this.properties.width = layout.width;
            this.properties.color = layout.color;
            this.properties.backgroundColor = layout.backgroundColor;
            this.properties.textAlign = layout.textAlign;
            this.properties.borderWidth = layout.borderWidth;
            this.properties.borderStyle = layout.borderStyle;
            this.properties.borderColor = layout.borderColor;
            this.properties.fontFamily = layout.fontFamily;
            this.properties.fontSize = layout.fontSize;
            this.properties.fontWeight = layout.fontWeight;
            this.reportSectionHeader.loadLayout(layout.headerSection);
            this.reportSectionContent.loadLayout(layout.contentSection);
            this.reportSectionFooter.loadLayout(layout.footerSection);
            this.refresh();
        }
        toJSON() {
            return {
                width: this.properties.width,
                color: this.properties.color,
                backgroundColor: this.properties.backgroundColor,
                textAlign: this.properties.textAlign,
                borderWidth: this.properties.borderWidth,
                borderStyle: this.properties.borderStyle,
                borderColor: this.properties.borderColor,
                fontFamily: this.properties.fontFamily,
                fontSize: this.properties.fontSize,
                fontWeight: this.properties.fontWeight,
                headerSection: this.reportSectionHeader.toJSON(),
                contentSection: this.reportSectionContent.toJSON(),
                footerSection: this.reportSectionFooter.toJSON(),
            };
        }
        _onChange(args) {
            this._changeEventEmitter.emit(args);
        }
    }

    class ReportContainer {
        constructor(options) {
            this.element = document.createElement("div");
            this._changeEventEmitter = new EventEmitter();
            this.report = new Report({ designer: options.designer });
            this._init();
        }
        _init() {
            this.element.classList.add("anka-report-container");
            this.element.appendChild(this.report.element);
            this.report.addEventListener("change", (e) => this._onChange(e));
        }
        addEventListener(event, listener) {
            switch (event) {
                case "change":
                    const callbackOnChange = listener;
                    this._changeEventEmitter.add(callbackOnChange);
                    break;
                case "select":
                    const callbackOnSelect = listener;
                    this.report.addEventListener("select", callbackOnSelect);
                    this.element.addEventListener("click", (e) => {
                        if (e.target === this.element) {
                            e.preventDefault();
                            callbackOnSelect({ type: "Report", element: this.report });
                        }
                    });
                    break;
            }
        }
        loadLayout(layout) {
            return this.report.loadLayout(layout);
        }
        toJSON() {
            return this.report.toJSON();
        }
        _onChange(args) {
            this._changeEventEmitter.emit(args);
        }
    }

    class Panel {
        constructor(options) {
            this.options = options;
            this.element = document.createElement("div");
            this.elementHeader = document.createElement("div");
            this.elementHeaderImage = document.createElement("img");
            this.elementHeaderText = document.createElement("span");
            this.elementContentContainer = document.createElement("div");
            this.elementContent = document.createElement("div");
            this.init();
        }
        init() {
            this.element.classList.add("anka-panel");
            this.elementHeader.classList.add("anka-panel__header");
            this.elementContentContainer.classList.add("anka-panel__content-container");
            this.elementContent.classList.add("anka-panel__content");
            this.element.appendChild(this.elementHeader);
            this.element.appendChild(this.elementContentContainer);
            this.elementHeader.appendChild(this.elementHeaderImage);
            this.elementHeader.appendChild(this.elementHeaderText);
            this.elementContentContainer.appendChild(this.elementContent);
            this.refresh();
        }
        refresh() {
            if (this.options.icon) {
                this.elementHeaderImage.src = this.options.icon || "";
                this.elementHeaderImage.style.paddingRight = "5px";
                this.elementHeaderImage.style.display = "";
            }
            else {
                this.elementHeaderImage.style.display = "none";
            }
            this.elementHeaderText.innerText = this.options.title;
        }
        appendChild(child) {
            this.elementContent.appendChild(child);
        }
    }

    class Tab {
        constructor(options) {
            this.options = options;
            this.element = document.createElement("div");
            this.elementIcon = document.createElement("img");
            this.elementText = document.createElement("span");
            this._init();
        }
        get content() {
            return this.options.content;
        }
        _init() {
            this.element.classList.add("anka-tab");
            this.elementIcon.classList.add("anka-tab__icon");
            this.elementText.classList.add("anka-tab__text");
            this.element.appendChild(this.elementIcon);
            this.element.appendChild(this.elementText);
            this.elementText.innerText = this.options.title;
        }
        select() {
            this.element.classList.add("selected");
        }
        unselect() {
            this.element.classList.remove("selected");
        }
        addEventListener(event, listener) {
            if (event === "click") {
                this.element.addEventListener("click", () => {
                    listener(this.options.content);
                });
            }
        }
    }

    class Tabs {
        constructor(options) {
            this.options = options;
            this.element = document.createElement("div");
            this.elementHeader = document.createElement("div");
            this.elementContentContainer = document.createElement("div");
            this.elementContent = document.createElement("div");
            this.tabs = [];
            this._init();
        }
        _init() {
            this.element.classList.add("anka-tabs");
            this.elementHeader.classList.add("anka-tabs__header");
            this.elementContentContainer.classList.add("anka-tabs__content-container");
            this.elementContent.classList.add("anka-tabs__content");
            this.element.appendChild(this.elementHeader);
            this.element.appendChild(this.elementContentContainer);
            this.elementContentContainer.appendChild(this.elementContent);
            this.options.tabs.forEach((tabOptions) => {
                const tab = new Tab(tabOptions);
                tab.addEventListener("click", () => {
                    this.selectTab(tab);
                });
                this.tabs.push(tab);
                this.elementHeader.appendChild(tab.element);
            });
            if (this.tabs.length > 0) {
                this.selectTab(this.tabs[0]);
            }
        }
        selectTab(tab) {
            var _a;
            (_a = this.selectedTab) === null || _a === void 0 ? void 0 : _a.unselect();
            this.selectedTab = tab;
            tab.select();
            this.elementContent.innerHTML = "";
            this.elementContent.appendChild(tab.content);
        }
    }

    class Sidebar {
        constructor() {
            this.element = document.createElement("div");
            this.elementContent = document.createElement("div");
            this._width = 200;
            this.init();
        }
        get width() {
            return this._width;
        }
        set width(value) {
            this._width = value;
            this.refresh();
        }
        init() {
            this.element.classList.add("anka-sidebar");
            this.elementContent.classList.add("anka-sidebar__content");
            this.element.appendChild(this.elementContent);
            this.refresh();
        }
        refresh() {
            this.element.style.width = this._width + "px";
        }
        addPanel(icon, title, content) {
            const panel = new Panel({ icon, title });
            panel.elementContent.appendChild(content);
            this.elementContent.appendChild(panel.element);
        }
        addTabs(tabOptions) {
            const tabs = new Tabs({ tabs: tabOptions });
            this.elementContent.appendChild(tabs.element);
        }
    }

    class ToolbarButton {
        constructor(options) {
            this.element = document.createElement("div");
            this.elementIcon = document.createElement("img");
            this.elementText = document.createElement("span");
            this._text = "";
            this._title = "";
            this._draggable = false;
            this._disabled = false;
            this.element.classList.add("anka-toolbar-button");
            this.element.appendChild(this.elementIcon);
            this.element.appendChild(this.elementText);
            this._icon = options.icon;
            this._text = options.text;
            this._title = options.title;
            this.element.style.width = 25 + "px";
            this.element.style.height = 25 + "px";
            if (options.draggable) {
                this._draggable = options.draggable;
            }
            this.refresh();
        }
        get text() {
            return this._text;
        }
        set text(value) {
            this._text = value;
        }
        get title() {
            return this._title;
        }
        set title(value) {
            this._title = value;
        }
        get draggable() {
            return this._draggable;
        }
        set draggable(value) {
            this._draggable = value;
        }
        get disabled() {
            return this._disabled;
        }
        set disabled(value) {
            this._disabled = value;
            this.refresh();
        }
        refresh() {
            this.element.title = this._title;
            this.element.draggable = this._draggable;
            this.elementIcon.src = this._icon || "";
            this.elementText.innerText = this._text;
            if (this._disabled) {
                this.element.style.backgroundColor = "transparent";
                this.element.style.cursor = "not-allowed";
            }
            else {
                this.element.style.backgroundColor = "";
                this.element.style.cursor = "";
            }
            this.elementIcon.style.display = this._icon ? "" : "none";
        }
        addEventListener(event, callback) {
            switch (event) {
                case "click":
                    this.element.addEventListener("click", callback);
                    break;
            }
        }
    }

    var ToolbarOrientation;
    (function (ToolbarOrientation) {
        ToolbarOrientation[ToolbarOrientation["Horizontal"] = 0] = "Horizontal";
        ToolbarOrientation[ToolbarOrientation["Vertical"] = 1] = "Vertical";
    })(ToolbarOrientation || (ToolbarOrientation = {}));
    class Toolbar {
        constructor(orientation = ToolbarOrientation.Vertical) {
            this.orientation = orientation;
            this.element = document.createElement("div");
            this.buttons = [];
            this.element.classList.add("anka-toolbar");
            switch (orientation) {
                case ToolbarOrientation.Vertical:
                    this.element.classList.add("anka-toolbar-vertical");
                    break;
                case ToolbarOrientation.Horizontal:
                    this.element.classList.add("anka-toolbar-horizontal");
                    break;
            }
        }
        addButton(options) {
            const button = new ToolbarButton(options);
            this.element.appendChild(button.element);
            this.buttons.push(button);
            return button;
        }
    }

    class ToolbarLeftMenu extends Toolbar {
        constructor() {
            super(ToolbarOrientation.Vertical);
            this.labelButton = this.addButton({
                text: "Ͳ",
                title: "Label",
                draggable: true,
            });
        }
    }

    class ToolbarTopMenu extends Toolbar {
        constructor() {
            super(ToolbarOrientation.Horizontal);
            this.saveButton = this.addButton({ icon: Save, text: "", title: "Save" });
            this.undoButton = this.addButton({ text: "↩", title: "Undo" });
            this.redoButton = this.addButton({ text: "↪", title: "Redo" });
        }
    }

    class ChangeStack {
        constructor() {
            this.stack = [];
            this.index = -1;
            this._lock = false;
        }
        get canUndo() {
            return this.index > -1;
        }
        get canRedo() {
            return this.index + 1 < this.stack.length;
        }
        add(change) {
            if (this._lock)
                return;
            this.index++;
            if (this.index < this.stack.length) {
                this.stack.splice(this.index);
            }
            this.stack.push(change);
        }
        undo() {
            if (!this.canUndo)
                return;
            const change = this.stack[this.index];
            this.index--;
            switch (change.type) {
                case "change-report":
                    this._undoProperties(change.report.properties, change.changes);
                    break;
                case "change-section":
                    this._undoProperties(change.section.properties, change.changes);
                    break;
                case "change-item":
                    this._undoProperties(change.item.properties, change.changes);
                    break;
            }
        }
        redo() {
            if (!this.canRedo)
                return;
            this.index++;
            const change = this.stack[this.index];
            switch (change.type) {
                case "change-report":
                    this._redoProperties(change.report.properties, change.changes);
                    break;
                case "change-section":
                    this._redoProperties(change.section.properties, change.changes);
                    break;
                case "change-item":
                    this._redoProperties(change.item.properties, change.changes);
                    break;
            }
        }
        lock() {
            this._lock = true;
        }
        unlock() {
            this._lock = false;
        }
        _undoProperties(properties, changes) {
            this._changeProperties(properties, changes, true);
        }
        _redoProperties(properties, changes) {
            this._changeProperties(properties, changes, false);
        }
        _changeProperties(properties, changes, undo) {
            this.lock();
            properties.beginUpdate();
            for (const change of changes) {
                properties[change.property] = undo
                    ? change.oldValue
                    : change.newValue;
            }
            properties.endUpdate();
            this.unlock();
        }
    }

    class Designer {
        constructor(options) {
            this.elementContent = document.createElement("div");
            this.menu = new ToolbarTopMenu();
            this.toolbar = new ToolbarLeftMenu();
            this.sidebar = new Sidebar();
            this.dataSourceTreeList = new DataSourceTreeList();
            this.propertyGrid = new PropertyGrid();
            this.changeStack = new ChangeStack();
            this._dataSourceChangeEventEmitter = new EventEmitter();
            const { element } = options;
            this.reportContainer = new ReportContainer({
                designer: this,
            });
            this.elementsTreeList = new ElementsTreeList({
                reportContainer: this.reportContainer,
            });
            element.classList.add("anka-designer");
            this.elementContent.classList.add("anka-designer__content");
            element.appendChild(this.menu.element);
            element.appendChild(this.elementContent);
            this.elementContent.appendChild(this.toolbar.element);
            this.elementContent.appendChild(this.reportContainer.element);
            this.elementContent.appendChild(this.sidebar.element);
            this.sidebar.addTabs([
                {
                    icon: Database,
                    title: "组件",
                    content: this.dataSourceTreeList.element,
                },
                {
                    title: "对象",
                    content: this.elementsTreeList.element,
                },
            ]);
            this.sidebar.addPanel(TreeStructure, "属性", this.propertyGrid.element);
            if (options.dataSource)
                this.setDataSource(options.dataSource);
            this.reportContainer.addEventListener("select", (e) => {
                switch (e.type) {
                    case "Report":
                    case "ReportSection":
                    case "ReportItem":
                        this.propertyGrid.setDataSource(e.element.properties);
                        break;
                    default:
                        this.propertyGrid.setDataSource(null);
                        break;
                }
            });
            this.reportContainer.addEventListener("change", (e) => {
                this.changeStack.add(e);
                this.menu.redoButton.disabled = !this.changeStack.canRedo;
                this.menu.undoButton.disabled = !this.changeStack.canUndo;
                switch (e.type) {
                    case "add-section":
                    case "remove-section":
                    case "add-item":
                    case "remove-item":
                        this.elementsTreeList.refresh();
                        break;
                }
            });
            if (options.layout) {
                this.loadLayout(options.layout);
            }
            if (options.onSaveButtonClick) {
                this.menu.saveButton.addEventListener("click", () => {
                    const layout = this.toJSON();
                    options.onSaveButtonClick(layout);
                });
            }
            this.menu.undoButton.addEventListener("click", () => {
                this.changeStack.undo();
                this.menu.undoButton.disabled = !this.changeStack.canUndo;
                this.menu.redoButton.disabled = !this.changeStack.canRedo;
            });
            this.menu.redoButton.addEventListener("click", () => {
                this.changeStack.redo();
                this.menu.undoButton.disabled = !this.changeStack.canUndo;
                this.menu.redoButton.disabled = !this.changeStack.canRedo;
            });
        }
        addEventListener(event, callback) {
            switch (event) {
                case "dataSourceChange":
                    const callbackDataSourceChange = callback;
                    this._dataSourceChangeEventEmitter.add(callbackDataSourceChange);
                    break;
                case "change":
                    const callbackOnChange = callback;
                    this.reportContainer.addEventListener("change", callbackOnChange);
                    break;
            }
        }
        setDataSource(dataSource) {
            this.dataSourceTreeList.setDataSource(dataSource);
            this._dataSourceChangeEventEmitter.emit({ dataSource });
        }
        getDataSource() {
            return this.dataSourceTreeList.dataSource.map((x) => x.data);
        }
        loadLayout(layout) {
            this.changeStack.lock();
            this.reportContainer.loadLayout(layout);
            this.elementsTreeList.refresh();
            this.changeStack.unlock();
        }
        toJSON() {
            return this.reportContainer.toJSON();
        }
    }

    class Section {
        constructor(layout, data, defaultStyles) {
            this.layout = layout;
            this.data = data;
            this.defaultStyles = defaultStyles;
            this.element = document.createElement("div");
            this.elementSections = document.createElement("div");
            this.reportItems = [];
            this._init();
        }
        _init() {
            var _a, _b;
            this.element.classList.add("anka-section");
            this.element.style.height = this.layout.height + "px";
            this.element.style.position = "relative";
            const defaultStylesList = [];
            this.defaultStyles.forEach((x) => defaultStylesList.push(new StyleProperties(x)));
            defaultStylesList.push(new StyleProperties(this.layout));
            (_a = this.layout.items) === null || _a === void 0 ? void 0 : _a.forEach((layout) => {
                const item = new ReportItem({ parentStyles: defaultStylesList, tag: layout.text == "Image" ? 'img' : 'div' });
                item.properties.x = layout.x;
                item.properties.y = layout.y;
                item.properties.width = layout.width;
                item.properties.height = layout.height;
                item.properties.color = layout.color;
                item.properties.backgroundColor = layout.backgroundColor;
                item.properties.borderWidth = layout.borderWidth;
                item.properties.borderStyle = layout.borderStyle;
                item.properties.borderColor = layout.borderColor;
                item.properties.fontFamily = layout.fontFamily;
                item.properties.fontSize = layout.fontSize;
                item.properties.fontWeight = layout.fontWeight;
                item.properties.textAlign = layout.textAlign;
                if (layout.text == "Image") {
                    item.element.src = this.data ? this.data[layout.binding] : "NULL";
                } else if (layout.binding) {
                    item.properties.text = this.data ? this.data[layout.binding] : "NULL";
                }
                else {
                    item.properties.text = layout.text;
                }
                item.refresh();
                this.element.appendChild(item.element);
                this.reportItems.push(item);
            });
            (_b = this.layout.sections) === null || _b === void 0 ? void 0 : _b.forEach((sectionLayout) => {
                const subDataSource = this.data ? this.data[sectionLayout.binding] : {};
                subDataSource === null || subDataSource === void 0 ? void 0 : subDataSource.forEach((sectionDataSource) => {
                    const section = new Section(sectionLayout, sectionDataSource, [
                        ...this.defaultStyles,
                        this.layout,
                    ]);
                    this.elementSections.appendChild(section.element);
                    this.elementSections.appendChild(section.elementSections);
                });
            });
        }
    }

    class Renderer {
        constructor(options) {
            this.options = options;
            if (!options.data)
                throw "Data is required";
            if (Array.isArray(options.data))
                throw "Data must be an object";
            this.headerSection = new Section(this.options.layout.headerSection, this.options.data, [this.options.layout]);
            this.footerSection = new Section(this.options.layout.footerSection, this.options.data, [this.options.layout]);
            this.options.element.style.width = this.options.layout.width + "px";
            this.options.element.style.position = "relative";
            this.options.element.appendChild(this.headerSection.element);
            const contentProperty = this.options.layout.contentSection.binding;
            this.options.data[contentProperty].forEach((data) => {
                const contentSection = new Section(this.options.layout.contentSection, data, [this.options.layout]);
                this.options.element.appendChild(contentSection.element);
                this.options.element.appendChild(contentSection.elementSections);
            });
            this.options.element.appendChild(this.footerSection.element);
        }
    }

    var version$1 = "0.1.0-beta.16";

    const version = version$1;
    function designer(options) {
        return new Designer(options);
    }
    function render(options) {
        return new Renderer(options);
    }

    exports.designer = designer;
    exports.render = render;
    exports.version = version;

    return exports;

})({});
