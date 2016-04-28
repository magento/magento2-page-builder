/**
 * - Structural.js
 * Handles building the structural elements
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define(['bluefoot/hook', 'bluefoot/jquery', 'bluefoot/jquery/ui', 'bluefoot/renderer', 'bluefoot/dragdrop', 'bluefoot/config', 'bluefoot/modal', 'bluefoot/edit'], function (Hook, jQuery, jQueryUi, Render, DragDropClass, Config, Modal, EditClass) {

    /**
     * This handles any structural elements, this includes rows and columns.
     *
     * @param stage
     * @constructor
     */
    function Structural(stage) {
        this.stage = stage;

        this.containerInner = this.stage.container.find('.gene-bluefoot-stage-content-inner');

        this.columnMouseDown = false;

        this.init();
    }

    /**
     * Init the structural blocks
     */
    Structural.prototype.init = function () {
        if (!this.containerInner.data('structural-init') && !this.stage.build) {
            // Add an initial row
            this.addRow();
        }

        // Bind event for adding a new row
        this.containerInner.parent().find('.gene-bluefoot-add-row').off('click').on('click', this.addRow.bind(this));

        // Attach events for when the UI is updated
        Hook.attach('gene-bluefoot-stage-ui-updated', this.equalColumnHeights.bind(this), this.stage);

        // Restore the empty text if an element becomes empty
        Hook.attach('gene-bluefoot-stage-updated', this.restoreEmptyText.bind(this), this.stage);
        Hook.attach('gene-bluefoot-stage-restore-empty-text', this.restoreEmptyText.bind(this), this.stage);

        // An event called when the stage becomes visible
        Hook.attach('gene-bluefoot-stage-visible', this.hideDisabledControls.bind(this), this.stage);
    };

    /**
     * Restore empty text to empty rows
     *
     * @param $hook
     */
    Structural.prototype.restoreEmptyText = function ($hook) {
        var rows;
        if (rows = this.getRows()) {
            for (var i = 0; i < rows.length; i++) {
                var element = jQuery(rows[i]);
                var entityLength = element.find('.gene-bluefoot-entity').length;
                var columnLength = element.find('.gene-bluefoot-column').length;
                if (entityLength > 0 || columnLength > 0) {
                    var visibleEntities = 0;
                    var childElements = element.find('.gene-bluefoot-entity,.gene-bluefoot-column,.gene-bluefoot-droparea');
                    for (var childI = 0; childI < childElements.length; childI++) {
                        var childElement = jQuery(childElements[childI]);
                        if (childElement.is(':visible') && childElement.css('position') != 'absolute') {
                            ++visibleEntities;
                        }
                    }

                    if (visibleEntities > 0) {
                        element.find('.empty-text').first().hide();
                    } else {
                        element.find('.empty-text').first().show();
                    }
                } else {
                    // Hide the message if the droparea is present
                    if (element.find('.gene-bluefoot-droparea,.gene-bluefoot-preview').length > 0) {
                        element.find('.empty-text').first().hide();
                    } else {
                        element.find('.empty-text').first().show();
                    }
                }
            }
        }

        $hook.done();
    };

    /**
     * Make sure all the column heights are equal on resize
     */
    Structural.prototype.equalColumnHeights = function ($hook) {

        // The hook can declare blockUiUpdate = true to block this
        if (typeof $hook.params.blockUiUpdate !== 'undefined' && $hook.params.blockUiUpdate === true) {
            return false;
        }

        var columns = this.containerInner.find('.gene-bluefoot-column-content'),
            minHeight = 150;

        if (columns.length) {
            var columnByOffset = {};
            columns.css('minHeight', 0);
            for (var i = 0; i < columns.length; i++) {
                var jElement = jQuery(columns[i]);
                if (typeof columnByOffset[jElement.offset().top] === 'undefined') {
                    columnByOffset[jElement.offset().top] = [];
                }
                columnByOffset[jElement.offset().top].push({
                    element: jElement,
                    height: jElement.outerHeight()
                });

                // Ensure column heights with images
                if (jElement.find('img')) {
                    jElement.find('img').on('load', function (event) {
                        this.equalColumnHeights($hook);
                    }.bind(this));
                }
            }

            // Ensure all columns on the same row have the same height
            for (var key in columnByOffset) {
                if (!columnByOffset.hasOwnProperty(key)) continue;

                var elements = columnByOffset[key];
                elements.sort(function (a, b) {
                    return a.height < b.height ? +1 : -1;
                });

                var tallestHeight = elements[0].height;
                if (tallestHeight < minHeight) {
                    tallestHeight = minHeight;
                }
                for (i = 0; i < elements.length; i++) {
                    jQuery(elements[i].element).css('minHeight', tallestHeight);
                }
                ;
            }
        }

        $hook.done();
    };

    /**
     * Return all rows within the current stage
     *
     * @returns {*}
     */
    Structural.prototype.getRows = function () {
        return this.containerInner.find('.gene-bluefoot-row');
    };

    /**
     * Add a new row to the container inner
     *
     * @returns {*}
     */
    Structural.prototype.addRow = function () {
        // Build up the view for the columns
        var view = {columns: []};

        var columns = Config.getValue('column_options');
        var n = 1;
        jQuery.each(columns, function (columns, label) {
            var previewColumns = [];
            var previewColumnWidth = 100 / columns;
            for (var i = 0; i < columns; i++) {
                previewColumns.push({
                    width: (previewColumnWidth - 4),
                    marginRight: 2,
                    marginLeft: 2
                });
            }
            view.columns.push({
                label: label,
                columnCount: columns,
                previewColumns: previewColumns
            });
        });

        // Render the row template
        var rowHtml = Render.renderFromConfig('row_template', view);

        // Add class to the row
        var row = jQuery(rowHtml);
        this.stage.recordElement(row);

        this.containerInner.append(row);

        this.initRow(row);

        Hook.trigger('gene-bluefoot-stage-ui-updated', false, false, this.stage);
        Hook.trigger('gene-bluefoot-stage-updated', false, false, this.stage);

        this.hideDisabledRowControls();

        return row;
    };

    /**
     * Remove a row from the stage
     *
     * @param row
     */
    Structural.prototype.removeRow = function (row) {
        if (this.getRows().length == 1) {
            require('bluefoot/modal').alert('You cannot remove the final row from the stage');
            return false;
        }

        Modal.confirm('Are you sure you want to delete this row?', false, function () {
            this._removeChildren(row);
            // Remove the row
            row.remove();
            Hook.trigger('gene-bluefoot-stage-ui-updated', false, false, this.stage);
            Hook.trigger('gene-bluefoot-stage-updated', false, false, this.stage);
            Hook.trigger('gene-bluefoot-stage-visible', false, false, this.stage);
        }.bind(this));
    };

    /**
     * Remove a column from the page
     *
     * @param column
     */
    Structural.prototype.removeColumn = function (column) {
        Modal.confirm('Are you sure you want to delete this column?', false, function () {
            var row = column.parents('.gene-bluefoot-row');
            this._removeChildren(column);
            column.remove();

            // Determine if there are any columns left?
            if (!row.find('.gene-bluefoot-column').length && !row.find('.gene-bluefoot-entity').length) {
                row.find('.empty-text').show();
            }

            Hook.trigger('gene-bluefoot-stage-ui-updated', false, false, this.stage);
            Hook.trigger('gene-bluefoot-stage-updated', false, false, this.stage);
            Hook.trigger('gene-bluefoot-stage-visible', false, false, this.stage);
        }.bind(this));
    };

    /**
     * Mark any child elements for delete when the instance is saved
     *
     * @param element
     * @private
     */
    Structural.prototype._removeChildren = function (element) {
        var children = jQuery(element).find('[data-flagged]');
        if (children.length > 0) {
            jQuery.each(children, function (index, element) {
                var elementClass,
                    entityId;
                if (elementClass = jQuery(element).data('class')) {
                    if (entityId = elementClass.getData('entity_id')) {
                        this.stage.save.delete(entityId);
                    }
                }
            }.bind(this));
        }
    };

    /**
     * Init options
     *
     * @param element
     * @param config
     */
    Structural.prototype.initOptions = function (element, config) {

        // Build the option HTML and append into the row
        var optionHtml = Render.renderFromConfig('option_template', config);
        element.append(optionHtml);

        // Iterate through options and bind events
        jQuery.each(config.options, function (index, config) {
            if (typeof config.code === 'undefined') {
                throw Error('Options must have a \'code\'.');
            }
            var option = element.find('[data-code="' + config.code + '"]');
            if (option.length) {
                if (typeof config.onClick !== 'undefined' && typeof config.onClick === 'function') {
                    option.off('click').on('click', function (event) {
                        config.onClick(element);
                        event.stopPropagation();
                        return false;
                    });
                }
            }
        });
    };

    /**
     * Initialize the row options
     *
     * @param row
     */
    Structural.prototype.initRow = function (row) {

        // Init the drop functionality of a row
        var dragDrop = new DragDropClass(this.stage);
        dragDrop.initSortable(row);

        // Declare the configuration for our rows
        var config = {
            options: [
                {
                    code: 'columns',
                    label: 'Add Columns',
                    icon: '<i class="fa fa-columns"></i>',
                    onClick: this.configureAddColumns.bind(this)
                },
                {
                    code: 'duplicate',
                    label: 'Duplicate',
                    icon: '<i class="fa fa-files-o"></i>',
                    onClick: this.duplicate.bind(this)
                },
                {
                    code: 'delete',
                    label: 'Delete',
                    icon: '<i class="fa fa-trash-o"></i>',
                    onClick: this.removeRow.bind(this)
                }
            ]
        };

        /**
         * Add in our config option
         */
        if (typeof this.stage.config.structural !== 'undefined' && this.stage.config.structural.row !== 'undefined') {
            config.options.unshift({
                code: 'configure',
                label: 'Configure',
                icon: '<i class="fa fa-cog"></i>',
                onClick: this.configureRow.bind(this)
            });
        }

        config.options.unshift({
            code: 'move-down',
            label: 'Move Down',
            icon: '<i class="fa fa-chevron-down"></i>',
            onClick: this.moveRowDown.bind(this)
        });

        config.options.unshift({
            code: 'move-up',
            label: 'Move Up',
            icon: '<i class="fa fa-chevron-up"></i>',
            onClick: this.moveRowUp.bind(this)
        });

        // Assign the type of row to a row
        row.data('type', 'row');

        return this.initOptions(row, config);
    };

    /**
     * Duplicate elements
     *
     * @param element
     * @param parent
     */
    Structural.prototype.duplicate = function (element, parent) {
        element = jQuery(element);
        var childElements = this.stage.save.getElementsForSave(element),
            dupParent = false;

        // Are we dealing with a structural element, or an entity?
        if (element.data('class')) {
            var entityClass = element.data('class');
            var clone = entityClass.clone(parent);
            if (clone.entity && !parent) {
                clone.entity.insertAfter(element);
            }
        } else if (element.data('type') == 'row') {
            dupParent = this.addRow();
            dupParent.insertAfter(element);
        } else if (element.data('type') == 'column') {
            var columnParent = (parent && parent.hasClass('gene-bluefoot-row') ? parent : element.parents('.gene-bluefoot-row'));
            dupParent = this.addColumns(columnParent, 1, element.data('width'));
            if (!parent) {
                dupParent.insertAfter(element);
            }
        }

        // Have we duplicated a structural item which will become a parent for child blocks
        if (dupParent) {
            // If we're dealing with a structural element copy over the form data
            if (element.data('type')) {
                jQuery(dupParent).data('formData', element.data('formData'));
            }

            if (childElements.length > 0) {
                jQuery.each(childElements, function (index, child) {
                    this.duplicate(child, dupParent);
                }.bind(this));
            }
        }

        Hook.trigger('gene-bluefoot-stage-ui-updated', false, false, this.stage);
        Hook.trigger('gene-bluefoot-stage-updated', false, false, this.stage);
    };

    /**
     * Create a mock entity to edit
     *
     * @param row
     */
    Structural.prototype.configureRow = function (row) {
        new EditClass(this.stage, this.mockEntity(row, this.stage.config.structural.row));
    };

    /**
     * Move a row down
     *
     * @param row
     * @returns {*}
     */
    Structural.prototype.moveRowDown = function (row) {
        var nextRow = jQuery(row).next('.gene-bluefoot-row');
        if (nextRow.length > 0) {
            return this.swapRows(row, nextRow);
        } else {
            return Modal.alert('This row cannot be moved any further down.');
        }
    };

    /**
     * Move a row up
     *
     * @param row
     * @returns {*}
     */
    Structural.prototype.moveRowUp = function (row) {
        var prevRow = jQuery(row).prev('.gene-bluefoot-row');
        if (prevRow.length > 0) {
            return this.swapRows(row, prevRow);
        } else {
            return Modal.alert('This row cannot be moved any further up.');
        }
    };

    /**
     * Swap two rows around, the rows have to be next to one another for them to swap nicely
     *
     * @param first
     * @param second
     */
    Structural.prototype.swapRows = function (first, second) {

        var firstTransform,
            firstClass,
            secondTransform,
            secondClass,
            dir,
            secondPosition;

        // Detect which order the columns are in
        if (jQuery(first).prevAll().filter(second).length !== 0) {
            // Second row is before to the first
            firstTransform = '-' + (jQuery(second).outerHeight() + parseInt(jQuery(second).css('margin-bottom'))) + 'px';
            secondTransform = (jQuery(first).outerHeight() + parseInt(jQuery(first).css('margin-bottom'))) + 'px';
            firstClass = 'moving-infront';
            secondClass = 'moving-behind';
            dir = 'up';
        } else if (jQuery(first).nextAll().filter(second).length !== 0) {
            // Second row is after to the first
            firstTransform = (jQuery(second).outerHeight() + parseInt(jQuery(second).css('margin-bottom'))) + 'px';
            secondTransform = '-' + (jQuery(first).outerHeight() + parseInt(jQuery(first).css('margin-bottom'))) + 'px';
            firstClass = 'moving-infront';
            secondClass = 'moving-behind';
            dir = 'down'
        }

        // Animate both classes using CSS transitions
        jQuery(first).addClass(firstClass).css({
            'msTransform': 'translateY(' + firstTransform + ')',
            'webkitTransform': 'translateY(' + firstTransform + ')',
            'transform': 'translateY(' + firstTransform + ')'
        });
        jQuery(second).addClass(secondClass).css({
            'msTransform': 'translateY(' + secondTransform + ')',
            'webkitTransform': 'translateY(' + secondTransform + ')',
            'transform': 'translateY(' + secondTransform + ')'
        });

        setTimeout(function () {
            if (dir == 'up') {
                jQuery(first).insertBefore(second);
            } else if (dir == 'down') {
                jQuery(first).insertAfter(second);
            }

            jQuery(first).addClass('no-transition').css({
                'msTransform': '',
                'webkitTransform': '',
                'transform': ''
            });
            jQuery(second).addClass('no-transition').css({
                'msTransform': '',
                'webkitTransform': '',
                'transform': ''
            });

            setTimeout(function () {
                jQuery(first).removeClass('moving-behind moving-infront no-transition');
                jQuery(second).removeClass('moving-infront moving-behind no-transition');
                Hook.trigger('gene-bluefoot-stage-updated', false, false, this.stage);
                this.hideDisabledRowControls();
            }.bind(this), 0);

        }.bind(this), 500);

    };

    /**
     * Init the column options
     *
     * @param column
     */
    Structural.prototype.initColumn = function (column) {

        // Init the drop functionality of a row
        var dragDrop = new DragDropClass(this.stage);
        dragDrop.initSortable(column);

        // Declare the configuration for our rows
        var config = {
            options: [
                {
                    code: 'move-left',
                    label: 'Move Left',
                    icon: '<i class="fa fa-chevron-left"></i>',
                    onClick: this.moveColumnLeft.bind(this)
                },
                {
                    code: 'move-right',
                    label: 'Move Right',
                    icon: '<i class="fa fa-chevron-right"></i>',
                    onClick: this.moveColumnRight.bind(this)
                },
                {
                    code: 'duplicate',
                    label: 'Duplicate',
                    icon: '<i class="fa fa-files-o"></i>',
                    onClick: this.duplicate.bind(this)
                },
                {
                    code: 'delete',
                    label: 'Delete',
                    icon: '<i class="fa fa-trash-o"></i>',
                    onClick: this.removeColumn.bind(this)
                }
            ]
        };

        /**
         * Add in our config option
         */
        if (typeof this.stage.config.structural !== 'undefined' && this.stage.config.structural.column !== 'undefined') {
            config.options.unshift({
                code: 'configure',
                label: 'Configure',
                icon: '<i class="fa fa-cog"></i>',
                onClick: this.configureColumn.bind(this)
            });
        }

        // Assign the type of row to a row
        column.data('type', 'column');
        this.updateFormData(jQuery(column), {width: jQuery(column).data('width')});

        return this.initOptions(column, config);
    };

    /**
     * Create a mock entity to edit
     *
     * @param row
     */
    Structural.prototype.configureColumn = function (row) {
        new EditClass(this.stage, this.mockEntity(row, this.stage.config.structural.column));
    };

    /**
     * Mock an entity, used for row and column configuration
     *
     * @param element
     * @param config
     * @returns {{config: *, setData: (function(this:Structural)), getData: getData}}
     */
    Structural.prototype.mockEntity = function (element, config) {
        var entityData = jQuery(element).data('formData');
        return {
            config: config,
            entity: element,
            setData: function (data) {
                this.updateFormData(jQuery(element), data);
            }.bind(this),
            getData: function (key) {
                if (!entityData) {
                    return null;
                }
                if (key) {
                    if (typeof entityData[key] !== 'undefined') {
                        return entityData[key];
                    }
                    return null;
                } else {
                    return entityData;
                }
            }
        };
    };

    /**
     * Update form data
     *
     * @param element
     * @param data
     * @returns {*}
     */
    Structural.prototype.updateFormData = function (element, data) {
        if (jQuery(element).data('formData')) {
            return jQuery(element).data('formData', jQuery.extend(jQuery(element).data('formData'), data));
        }

        return jQuery(element).data('formData', data);
    };

    /**
     * Move a column left
     *
     * @param column
     * @returns {*}
     */
    Structural.prototype.moveColumnLeft = function (column) {
        var prevColumn = jQuery(column).prevAll('.gene-bluefoot-column').first();
        if (prevColumn.length > 0) {
            return this.swapColumns(column, prevColumn);
        } else {
            return Modal.alert('This column cannot be moved any further left.');
        }
    };

    /**
     * Move a column to the right
     *
     * @param column
     * @returns {*}
     */
    Structural.prototype.moveColumnRight = function (column) {
        var nextColumn = jQuery(column).nextAll('.gene-bluefoot-column').first();
        if (nextColumn.length > 0) {
            return this.swapColumns(column, nextColumn);
        } else {
            return Modal.alert('This column cannot be moved any further right.');
        }
    };

    /**
     * Swap two columns
     *
     * @param first
     * @param second
     *
     * @todo moving between rows
     * @todo animation between 'column rows'
     */
    Structural.prototype.swapColumns = function (first, second) {
        var firstTransform,
            firstClass,
            secondTransform,
            secondClass,
            dir,
            secondPosition;

        // Detect which order the columns are in
        if (jQuery(first).prevAll().filter(second).length !== 0) {
            // Second column is before to the first
            firstTransform = '-' + jQuery(second).outerWidth() + 'px';
            secondTransform = jQuery(first).outerWidth() + 'px';
            firstClass = 'moving-infront';
            secondClass = 'moving-behind';
            dir = 'left';
        } else if (jQuery(first).nextAll().filter(second).length !== 0) {
            // Second column is after to the first
            firstTransform = jQuery(second).outerWidth() + 'px';
            secondTransform = '-' + jQuery(first).outerWidth() + 'px';
            firstClass = 'moving-infront';
            secondClass = 'moving-behind';
            dir = 'right'
        }

        // Animate both classes using CSS transitions
        jQuery(first).addClass(firstClass).css({
            'msTransform': 'translateX(' + firstTransform + ')',
            'webkitTransform': 'translateX(' + firstTransform + ')',
            'transform': 'translateX(' + firstTransform + ')'
        });
        jQuery(second).addClass(secondClass).css({
            'msTransform': 'translateX(' + secondTransform + ')',
            'webkitTransform': 'translateX(' + secondTransform + ')',
            'transform': 'translateX(' + secondTransform + ')'
        });

        setTimeout(function () {
            if (dir == 'left') {
                // Handle columns that aren't directly next to one another
                if (jQuery(first).prev().attr('id') != jQuery(second).attr('id')) {
                    secondPosition = first.next();
                    jQuery(first).insertAfter(second.prev());
                    jQuery(second).insertBefore(secondPosition);
                } else {
                    jQuery(first).insertBefore(second);
                }
            } else if (dir == 'right') {
                // Handle columns that aren't directly next to one another
                if (jQuery(first).next().attr('id') != jQuery(second).attr('id')) {
                    secondPosition = first.prev();
                    jQuery(first).insertBefore(second.next());
                    jQuery(second).insertAfter(secondPosition);
                } else {
                    jQuery(first).insertAfter(second);
                }
            }

            jQuery(first).addClass('no-transition').css({
                'msTransform': '',
                'webkitTransform': '',
                'transform': ''
            });
            jQuery(second).addClass('no-transition').css({
                'msTransform': '',
                'webkitTransform': '',
                'transform': ''
            });

            setTimeout(function () {
                jQuery(first).removeClass('moving-behind moving-infront no-transition');
                jQuery(second).removeClass('moving-infront moving-behind no-transition');
                Hook.trigger('gene-bluefoot-stage-updated', false, false, this.stage);
                Hook.trigger('gene-bluefoot-stage-ui-updated', false, false, this.stage);
                this.hideDisabledColumnControls();
            }.bind(this), 0);

        }.bind(this), 500);
    };

    /**
     * Hide various disabled controls
     */
    Structural.prototype.hideDisabledControls = function () {
        this.hideDisabledColumnControls();
        this.hideDisabledRowControls();
    };

    /**
     * Hide the movement controls on columns that will no longer provide any function
     */
    Structural.prototype.hideDisabledColumnControls = function () {
        var rows = this.getRows();
        jQuery.each(rows, function (index, row) {
            var columns = jQuery(row).find('.gene-bluefoot-column');
            columns.find('[data-code="move-left"],[data-code="move-right"]').show();
            if (columns.length > 1) {
                columns.first().find('[data-code="move-left"]').hide();
                columns.last().find('[data-code="move-right"]').hide();
            } else if (columns.length == 1) {
                columns.find('[data-code="move-left"],[data-code="move-right"]').hide();
            }
        });
    };

    /**
     * Hide the movement controls on rows
     */
    Structural.prototype.hideDisabledRowControls = function () {
        var rows = this.getRows();
        rows.find('[data-code="move-up"],[data-code="move-down"]').show();
        if (rows.length > 1) {
            rows.first().find('[data-code="move-up"]').hide();
            rows.last().find('[data-code="move-down"]').hide();
        } else if (rows.length == 1) {
            rows.find('[data-code="move-up"],[data-code="move-down"]').hide();
        }
    };

    /**
     * Show the UI for configuring the columns
     *
     * @param row
     */
    Structural.prototype.configureAddColumns = function (row) {
        var columnSelection = row.find('.gene-bluefoot-column-selection');

        // Display the column selection div
        columnSelection.toggleClass('active');

        // Enable the user to close the column configuration panel by clicking anywhere on the page
        if (columnSelection.hasClass('active')) {
            var columnSelectionClose = function () {
                columnSelection.removeClass('active');
            };
            jQuery(document).off('click', columnSelectionClose).on('click', columnSelectionClose);
        }

        // Check to see if this column selection has been init
        if (!columnSelection.hasClass('.gene-bluefoot-column-init')) {
            this.initColumnSelection(columnSelection, row);
        }
    };

    /**
     * Bind the events for the column selection functionality
     *
     * @param columnSelection
     * @param row
     */
    Structural.prototype.initColumnSelection = function (columnSelection, row) {

        // Bind the click event to add columns to the UI
        columnSelection.off('click').on('click', '.gene-bluefoot-column-option', function (event) {
            var current = jQuery(event.currentTarget);
            this.addColumns(row, current.data('columns'));
            columnSelection.removeClass('active');
        }.bind(this));
    };

    /**
     * Add columns into a row
     *
     * @param row
     * @param columns
     * @param width
     */
    Structural.prototype.addColumns = function (row, columns, width) {

        // Hide the empty text if present
        if (row.find('.empty-text').is(':visible')) {
            row.find('.empty-text').hide();
        }

        // Set the columns out of the total width
        var columnWidth = parseFloat(1 / columns).toFixed(3);
        if (width) {
            columnWidth = width;
        }

        var columnCssWidth = (columnWidth * 100);

        // Build up the view for the columns
        var view = {columns: []};
        var columnsCount = columns;
        var actualCssSize = Config.getValue('actual_css_size');
        while (columnsCount > 0) {
            var columnView = {
                width: columnWidth,
                cssWidth: columnCssWidth
            };

            // Some columns cause us lots of problems
            if (typeof actualCssSize[columnWidth] !== 'undefined') {
                columnView.cssWidth = actualCssSize[columnWidth];
            }

            // Include a last class on the last column
            if (columns == 1) {
                columnView.class = ' last';
            }

            view.columns.push(columnView);
            --columnsCount;
        }

        // Store the stage HTML in the module
        var columnHtml = Render.renderFromConfig('column_template', view);
        var columnsHtmljQuery = jQuery(columnHtml);

        // Append our columns into the row
        row.find('.gene-bluefoot-row-content').append(columnsHtmljQuery);

        // Bind events for each column
        columnsHtmljQuery.each(function (index, column) {
            if (jQuery(column).hasClass('gene-bluefoot-column')) {
                this.updateFormData(jQuery(column), {width: jQuery(column).data('width')});
                this.stage.recordElement(jQuery(column));
                this.bindColumnEvents(jQuery(column), row.find('.gene-bluefoot-row-content'));
                this.initColumn(jQuery(column));
            }
        }.bind(this));

        // Bind the row events
        this.bindRowEvents(row);

        Hook.trigger('gene-bluefoot-stage-updated', false, false, this.stage);
        Hook.trigger('gene-bluefoot-stage-visible', false, false, this.stage);

        // If we're only adding one column, return the column
        if (columns == 1) {
            return columnsHtmljQuery;
        }
    };

    /**
     * Calculate the row data
     *
     * @param row
     * @returns {{smallestWidth: *, allowedWidthsData: Array}}
     */
    Structural.prototype.calcRowData = function (row) {

        // Work out the potential widths of the columns
        var allowedColumns = Config.getValue('allowed_sizes');
        var contentWidth = row.find('.gene-bluefoot-row-content').width();
        var allowedWidthsData = [];
        jQuery.each(allowedColumns, function (percentage, label) {
            percentage = parseFloat(percentage).toFixed(3);
            var width = Math.floor(contentWidth * percentage);

            allowedWidthsData.push({
                label: label,
                percentage: percentage,
                width: width
            });
        });

        // Sort by the percentage of each object
        allowedWidthsData.sort(this.sortOnPercentage);

        return {
            minWidth: allowedWidthsData[0].width,
            maxWidth: allowedWidthsData[allowedWidthsData.length - 1].width,
            allowedWidthsData: allowedWidthsData
        };
    };

    /**
     * Bind various events to the row
     *
     * @param row
     */
    Structural.prototype.bindRowEvents = function (row) {

        var rowData = this.calcRowData(row);
        var buildRowData = true;

        // Handle the mouse moving whilst dragging
        row.off('mousemove').on('mousemove', function (event) {
            if (this.columnMouseDown) {
                if (buildRowData) {
                    rowData = this.calcRowData(row);
                    buildRowData = false;
                }

                var previousWidth = this.columnMouseDown.data('width');
                var findCurrent = jQuery.grep(rowData.allowedWidthsData, function (n) {
                    return n.percentage == previousWidth;
                });
                if (typeof findCurrent[0] === 'undefined') {
                    console.error('Unable to find allowed column with of ' + previousWidth);
                    return false;
                }
                var current = findCurrent[0];

                // Update the label if it's not already been
                if (!this.columnMouseDown.data('labelUpdated')) {
                    // Grab the current label
                    this.columnMouseDown.find('.gene-bluefoot-column-resize').text(current.label).fadeIn(150);
                    this.columnMouseDown.data('labelUpdated', true);
                }

                // Calculate the widths of the columns
                var offsetLeft = this.columnMouseDown.offset().left;
                var currentWidth = this.columnMouseDown.outerWidth() + (event.clientX - (offsetLeft + this.columnMouseDown.outerWidth()));

                // Verify the width is bigger than the smallest width
                if (currentWidth >= rowData.minWidth && currentWidth <= rowData.maxWidth) {

                    // Update our ghost
                    this.columnMouseDown.find('.gene-bluefoot-column-ghost').css('width', currentWidth + 'px').addClass('active');

                    var actualCssSize = Config.getValue('actual_css_size');
                    jQuery.each(rowData.allowedWidthsData, function (index, widthData) {
                        if (typeof widthData === 'object' &&
                            typeof widthData.width !== 'undefined' &&
                            currentWidth >= (widthData.width - 15) &&
                            currentWidth <= (widthData.width + 15)) {
                            var percentageWidth = (widthData.percentage * 100);
                            // Some columns cause us lots of problems
                            if (typeof actualCssSize[widthData.percentage] !== 'undefined') {
                                percentageWidth = actualCssSize[widthData.percentage];
                            }

                            this.columnMouseDown.find('.gene-bluefoot-column-resize').text(widthData.label);
                            this.columnMouseDown.data('width', widthData.percentage).css({'width': percentageWidth + '%'}).data('labelUpdated', false);
                            this.updateFormData(this.columnMouseDown, {width: widthData.percentage});

                            Hook.trigger('gene-bluefoot-stage-ui-updated', false, false, this.stage);
                            Hook.trigger('gene-bluefoot-stage-updated', false, false, this.stage);
                        }
                    }.bind(this));
                }
            }
        }.bind(this));

        // Handle any mouse up events
        jQuery(window).off('mouseup').on('mouseup', function (event) {
            // If there is a mouse down pointer, reset it
            if (this.columnMouseDown) {
                this.columnMouseDown.data('labelUpdated', false);
                this.columnMouseDown.find('.gene-bluefoot-column-resize').fadeOut(150);
                this.columnMouseDown.find('.gene-bluefoot-column-ghost').css('width', 'auto').removeClass('active');
                buildRowData = true;
            }

            this.columnMouseDown = false;
        }.bind(this));

    };

    /**
     * Sort on percentage
     *
     * @param a
     * @param b
     * @returns {number}
     */
    Structural.prototype.sortOnPercentage = function (a, b) {
        return (a.percentage < b.percentage ? -1 : 1);
    };

    /**
     * Bind the various columns events
     *
     * @param column
     */
    Structural.prototype.bindColumnEvents = function (column) {

        // Determine whether the user is clicking or not
        column.off('mousedown').on('mousedown', '.gene-bluefoot-column-handle', function (event) {
            event.stopPropagation();
            this.columnMouseDown = jQuery(column);
        }.bind(this));

    };

    return Structural;
});