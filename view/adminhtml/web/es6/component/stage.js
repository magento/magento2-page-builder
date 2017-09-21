import EditableArea from './stage/structural/editable-area';
import Row from './stage/structural/row';
import _ from 'underscore';
/**
 * Stage class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class Stage extends EditableArea {
    /**
     * Stage constructor
     *
     * @param parent
     * @param stageContent
     */
    constructor(parent, stageContent) {
        super();
        this.active = true;
        this.serializeRole = 'stage';
        this.setChildren(stageContent);
        this.stage = this;
        this.parent = parent;
        this.showBorders = parent.showBorder;
        this.userSelect = parent.userSelect;
        this.loading = parent.loading;
        _.bindAll(this, 'onSortingStart', 'onSortingStop');
        this.on('sortingStart', this.onSortingStart);
        this.on('sortingStop', this.onSortingStop);
    }
    build() {
        // @todo
        this.ready();
    }
    /**
     * The stage has been initiated fully and is ready
     */
    ready() {
        this.emit('stageReady');
        this.children.valueHasMutated();
        this.loading(false);
    }
    /**
     * Add a row to the stage
     *
     * @param self
     * @param data
     * @returns {Row}
     */
    addRow(self, data) {
        let row = new Row(self, self);
        row.data(data);
        this.addChild(row);
        return row;
    }
    openTemplateManager() {
        // @todo
    }
    addComponent() {
        // @todo
    }
    /**
     * Event handler for any element being sorted in the stage
     */
    onSortingStart() {
        this.showBorders(true);
    }
    /**
     * Event handler for when sorting stops
     */
    onSortingStop() {
        this.showBorders(false);
    }
}
