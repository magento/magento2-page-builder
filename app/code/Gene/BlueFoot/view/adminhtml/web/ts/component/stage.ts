import EditableArea from './stage/structural/editable-area';
import { StageInterface } from './stage.d';
import { Structural as StructuralInterface } from './stage/structural/abstract.d';
import Row from './stage/structural/row';
import _ from 'underscore';
import DataStore from "./data-store";
import {DataObject} from "./data-store";
import Build from "./stage/build";
import $t from "mage/translate";
import jQuery from 'jquery';

/**
 * Stage class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class Stage extends EditableArea implements StageInterface {
    parent: any;
    stage: Stage;
    active: boolean = true;
    showBorders: KnockoutObservable<boolean>;
    userSelect: KnockoutObservable<boolean>;
    loading: KnockoutObservable<boolean>;
    originalScrollTop: number;
    serializeRole: string = 'stage';
    store: DataStore;

    /**
     * Stage constructor
     *
     * @param parent
     * @param stageContent
     */
    constructor(parent: any, stageContent: KnockoutObservableArray<StructuralInterface>) {
        super();
        this.setChildren(stageContent);
        this.stage = this;
        this.parent = parent;

        this.showBorders = parent.showBorders;
        this.userSelect = parent.userSelect;
        this.loading = parent.loading;
        this.originalScrollTop = 0;

        // Create our state and store objects
        this.store = new DataStore();

        _.bindAll(
            this,
            'onSortingStart',
            'onSortingStop'
        );

        this.on('sortingStart', this.onSortingStart);
        this.on('sortingStop', this.onSortingStop);
    }

    /**
     * Run the build system to initiate from existing structures 
     */
    build() {
        // @todo implement new storage format proposal build system
        this.addRow(this);
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
    addRow(self: Stage, data?: DataObject): Row {
        let row = new Row(self, self);
        this.store.update(row.id, data);
        this.addChild(row);

        return row;
    }

    openTemplateManager() {
        // @todo
    }

    goFullScreen() {
        let isFullScreen = this.parent.isFullScreen();
        if (!isFullScreen) {
            this.originalScrollTop = jQuery(window).scrollTop();
            _.defer(function () {
                jQuery(window).scrollTop(0);
            });
        }

        this.stage.parent.isFullScreen(!isFullScreen);
        if (isFullScreen) {
            jQuery(window).scrollTop(this.originalScrollTop);
        }
    }

    isFullScreen() {
        return this.parent.isFullScreen();
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

    /**
     * Remove a child from the observable array
     *
     * @param child
     */
    removeChild(child: any) :void {
        if (this.children().length == 1) {
            this.parent.alertDialog({
                title: $t('Unable to Remove'),
                content: $t('You are not able to remove the final row from the content.')
            });
            return;
        }
        super.removeChild(child);
    }
}