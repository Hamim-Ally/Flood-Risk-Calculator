import { Container, Label } from '../../vendor/Sugar/index.js';

class Table extends Container {

    #tableheader = new Container({
        class: 'tableheader',
        flex: true,
        flexDirection: 'column',
    });

    #tablebody = new Container({
        class: 'tablebody',
        flex: true,
        flexDirection: 'column',
        scrollable: true
    });

    constructor(args = {}) {
        super(args);

        this.class.add('table');
        this.height = '100%';
        this.flex = true;
        this.flexDirection = 'column';
        this.cellWidth = args.cellWidth || [];
        this.header = args.header || [];
        this.dataKeys = args.dataKeys || [];
        this.renderers = args.renderers || []; // 👈 support for custom cell rendering
        this.tableAlign = args.tableAlign || 'left';

        this.setHeader(this.header);

        this.append(this.#tableheader);
        this.append(this.#tablebody);
    }

    // ----- HEADER -----
    setHeader(headerArray) {
        this.#tableheader.clear();
        this.header = headerArray;

        const row = new Container({
            flex: true,
            flexDirection: 'row',
        });

        headerArray.forEach((label, i) => {
            const cellRoot = this.createCellComponent(label, i);
            row.append(cellRoot);
        });

        this.#tableheader.append(row);
    }

    // ----- ROWS -----
    addRow(dataArray = [], onClick = null, rowIndex = null) {
        const row = new Container({
            class: 'tablerow',
            flex: true,
            flexDirection: 'row',
        });

        row.on('click', () => {
            if (typeof onClick === 'function') {
                onClick(rowIndex, dataArray);
            }
        });

        dataArray.forEach((cell, i) => {
            const renderer = this.renderers[i];
            const custom = typeof renderer === 'function' ? renderer(cell, dataArray) : null;
            const cellComponent = this.createCellComponent(custom || cell, i);
            row.append(cellComponent);
        });

        this.#tablebody.append(row);
    }

    clearRows() {
        this.#tablebody.clear();
    }

    getData() {
        return this.#tablebody.children.map(row => {
            return row.children.map(cell => cell.text);
        });
    }

    getRow(index) {
        const row = this.#tablebody.children[index];
        if (!row) return null;
        return row.children.map(cell => cell.text);
    }

    updateRow(index, newDataArray = []) {
        const row = this.#tablebody.children[index];
        if (!row) return;

        newDataArray.forEach((cellText, i) => {
            const cell = row.children[i];
            if (cell) {
                cell.text = String(cellText);
            }
        });
    }

    removeRow(index) {
        const row = this.#tablebody.children[index];
        if (row) {
            this.#tablebody.remove(row);
        }
    }

    // ----- SPECIFIC CELLS -----
    setCell(rowIndex, colIndex, newValue) {
        const row = this.#tablebody.children[rowIndex];
        if (!row) return;

        const cell = row.children[colIndex];
        if (cell) {
            cell.text = String(newValue);
        }
    }

    getCell(rowIndex, colIndex) {
        const row = this.#tablebody.children[rowIndex];
        if (!row) return null;

        const cell = row.children[colIndex];
        return cell ? cell.text : null;
    }

    setCellByName(rowIndex, colName, newValue) {
        const colIndex = this.header.indexOf(colName);
        if (colIndex === -1) {
            console.warn(`Column "${colName}" not found.`);
            return;
        }

        const row = this.#tablebody.children[rowIndex];
        if (!row) {
            console.warn(`Row index "${rowIndex}" out of bounds.`);
            return;
        }

        const cell = row.children[colIndex];
        if (cell) {
            cell.text = String(newValue);
        }
    }

    getCellByName(rowIndex, colName) {
        const colIndex = this.header.indexOf(colName);
        const row = this.#tablebody.children[rowIndex];
        if (!row || colIndex === -1) return null;

        const cell = row.children[colIndex];
        return cell ? cell.text : null;
    }

    // ----- Cells -----
    createCellComponent(cell, index) {
        let component;

        if (cell instanceof HTMLElement) {
            component = cell;
        } else {
            component = new Label({ text: String(cell) });
        }

        const cellRoot = new Container({
            class: 'tablerow-cell',
            flex: true,
            flexDirection: 'row',
            flexGrow: 1,
            width: this.cellWidth[index] || 'auto',
            justifyContent: this.tableAlign || 'start',
        });

        cellRoot.append(component);

        return cellRoot;
    }

    // ----- Data Loader -----
    load(data = [], onRowClick = null) {
        if (!Array.isArray(data) || data.length === 0) return;

        if (!this.header || this.header.length === 0) {
            this.setHeader(Object.keys(data[0]));
        }

        this.clearRows();

        data.forEach((item, rowIndex) => {
            const rowData = this.dataKeys.map(key => {
                const value = item[key];
                if (value instanceof Object && typeof value.render === 'function') {
                    return value;
                }
                return value ?? '';
            });

            // 🔥 patch: pass the full `item` on click
            this.addRow(rowData, (rowIdx) => {
                if (typeof onRowClick === 'function') {
                    onRowClick(rowIdx, item);
                }
            }, rowIndex);
        });
    }

}

export { Table };
