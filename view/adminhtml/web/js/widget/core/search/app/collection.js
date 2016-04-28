/**
 * - Taxonomy.js
 *
 * @author Vicki Tingle <vicki@gene.co.uk>
 */

define(['bluefoot/config', 'bluefoot/jquery', 'bluefoot/hook', 'bluefoot/widget/abstract', 'bluefoot/ajax'], function (Config, jQuery, Hook, AbstractField, AjaxClass) {

    /**
     * Extend our abstract class
     *
     * @param field
     * @param value
     * @param edit
     * @constructor
     */
    function InputField(field, value, edit) {
        AbstractField.call(this, field, value, edit);
        this.hiddenInput = false;
    }
    InputField.prototype = Object.create(AbstractField.prototype);
    var $super = AbstractField.prototype;

    /**
     * Attach hooks for the widget
     */
    InputField.prototype.attachHooks = function () {
        Hook.attach('gene-bluefoot-after-render-field-' + this.field.fieldType, this.edit.stage, this.toggleFilter);
    };

    /**
     * Toggle the taxononmy term filter display
     *
     * @returns object
     */
    InputField.prototype.toggleFilter = function(remove, mainId) {

        if (remove) {
            jQuery('#' + mainId + '-taxonomy-term-multiselect').hide();

        } else {
            jQuery('#' + mainId + '-taxonomy-term-multiselect').show();
        }
    };

    /**
     * Build the dom element to represent this widget within the edit panel
     *
     * @returns object
     */
    InputField.prototype.buildHtml = function() {

        var mainId = this.getId(),
            fakeId = this.getId() + "_autocomplete",
            taxonomyId,
            savedData = false;

        if(this.entity.data.hasOwnProperty(this.field.code)) {
            savedData = JSON.parse(this.entity.data[this.field.code]);
            taxonomyId = savedData['taxonomy_ids'];
        }

        this.element = jQuery('<div />').addClass('gene-bluefoot-search-field gene-bluefoot-input-field gene-bluefoot-input-loading-indicator');
        this.element.attr("id", this.getId() + "_wrapper");

        //Prepare select box of apps
        this.buildAppSelect(mainId, fakeId, savedData);

        //Prepare the multiselects for taxonomies & taxonomy terms
        var taxonomySelect = jQuery('<select />')
                .attr('id', mainId + '-taxonomy-multiselect')
                .attr('multiple', true).css('height', '100%')
                .attr('name', mainId + '-taxonomy-multiselect')
                .val(this.value)
                .addClass('gene-bluefoot-taxonomy-search-taxonomies'),

            termSelect = jQuery('<select />')
                .attr('id', mainId + '-taxonomy-term-multiselect')
                .attr('multiple', true)
                .attr('name', mainId + '-taxonomy-term-multiselect')
                .css('height', '100%')
                .val(this.value)
                .addClass('gene-bluefoot-taxonomy-search-taxonomy-terms');

        if (!this.entity.data.hasOwnProperty("preview_view")) {
            termSelect.css('display', 'none');
        }

        this.buildTaxonomySelect(taxonomyId, taxonomySelect, termSelect, savedData, mainId);

        //If there is saved data, build it onto the page, otherwise hide and show appropriate fields
        if (this.entity.data.hasOwnProperty("preview_view") && savedData['taxonomy_ids'] !== null) {
            this.rebuildSavedData(termSelect, taxonomySelect, savedData, mainId);

        } else if (this.entity.data.hasOwnProperty("preview_view") && savedData['taxonomy_ids'] === null) {
            termSelect.css('display', 'none');
            taxonomySelect.append(
                jQuery('<option />')
                    .text('There are no associated taxonomies for this app.')
                    .attr('disabled', true)
                    .addClass('no-taxonomies-available')
            );

        } else {
            termSelect.css('display', 'none');
        }

        jQuery(taxonomySelect).change(function () {
            InputField.prototype.selectTaxonomyAjax(taxonomySelect, termSelect, mainId);
        });

        taxonomySelect.change(function() {
            InputField.prototype.buildSaveData(hasNoData = false, mainId);
        });

        this.element.append(
            jQuery('<label />').attr('for', fakeId).html('Select a taxonomy filter'),
            taxonomySelect);

        this.element.append(termSelect);

        jQuery(termSelect).change(function() {
            InputField.prototype.buildSaveData(hasNoData = false, mainId);
        });

        this.hiddenInput = jQuery('<input />').attr({
            name: this.field.code,
            type: 'hidden',
            id: mainId
        }).val(this.value);

        this.element.append(
            jQuery('<i class="fa fa-spinner fa-pulse"></i>')
        );

        // Append the actual input the bluefoot uses for saving
        this.element.append(
            this.hiddenInput
        );

        return this.element;
    };

    /**
     * Pre-populate elements with saved data
     *
     * @param termSelect
     * @param taxonomySelect
     * @param savedData
     */
    InputField.prototype.rebuildSavedData = function(termSelect, taxonomySelect, savedData, mainId) {

        var terms = this.entity.data['preview_view'][this.field.code],
            savedTerms;
        if (savedData['term_ids']) {
            savedTerms = savedData['term_ids'];
        }
        //Check to see if there are saved taxonomies and terms, then populate the appropriate fields with the saved data
        if (this.entity.data.hasOwnProperty('preview_view') && savedData['term_ids'] === null) {
            termSelect.find('option').remove();
            termSelect.css('display', 'none');
        } else {

            for (var i = 0; i < savedData['taxonomy_ids'].length; i++) {

                if (savedData['taxonomy_ids'][i] === '0') {
                    taxonomySelect.append(
                        jQuery('<option />')
                            .text('None')
                            .addClass('no_taxonomies_filter_option')
                            .val(0)
                            .attr('selected', true)
                    );

                    termSelect.css('display', 'none');

                } else {

                    var optGroupLabel = taxonomySelect.find('[value="' + savedData['taxonomy_ids'][i] + '"]').text(),
                        termSelectOptionsGroup = jQuery('<optgroup label="' + optGroupLabel + '"/>').attr('taxonomy_ids', savedData['taxonomy_ids'][i]);

                    jQuery.each(terms, function (key, value) {

                        var termSelectOptions = jQuery('<option />').text(value['term']).val(savedData['term_ids'][i]);

                        if (savedTerms !== '0') {
                            jQuery.each(savedTerms, function (key, termId) {

                                if (termId == value['id'] || termId == 0) {
                                    termSelectOptions.attr('selected', true);
                                }
                            });

                        } else {
                            var allSelected = termSelect.find('[value="' + savedTerms + '"]');
                            allSelected.attr('selected', true);
                        }

                        if (value['taxonomy_ids'] === termSelectOptionsGroup.attr('taxonomy_ids')) {

                            termSelectOptionsGroup.append(
                                termSelectOptions
                            );
                        }
                    });
                }

                termSelect.append(
                    termSelectOptionsGroup
                );
            }
        }
    };

    /**
     * Build the json object for saving
     * @param hasNoData
     */
    InputField.prototype.buildSaveData = function(hasNoData, mainId) {

        var taxonomyField = jQuery('#' + mainId + '-taxonomy-multiselect').val(),
            saveData,
            dataString;

        //If no terms have been chosen
        if (hasNoData) {
            saveData = {
                app_id: jQuery('#' + mainId + '-app-select').val(),
                taxonomy_ids: taxonomyField,
                term_ids: '0'
            };

        } else if(taxonomyField != '0') {
            saveData = {
                app_id: jQuery('#' + mainId + '-app-select').val(),
                taxonomy_ids: taxonomyField,
                term_ids: jQuery('#' + mainId + '-taxonomy-term-multiselect').val()
            };

        } else {
            saveData = {
                app_id: jQuery('#' + mainId + '-app-select').val(),
                taxonomy_ids: taxonomyField,
                term_ids: 0
            };
        }

        //Turn the object into a string value of the hidden input
        dataString = JSON.stringify(saveData);
        jQuery('#' + mainId).val(dataString);
    };

    /**
     * Build the multiselect boxes for taxonomies and taxonomy terms
     * @param taxonomyId
     * @param taxonomySelect
     * @param termSelect
     * @param savedData
     * @returns jQuery object
     */
    InputField.prototype.buildTaxonomySelect = function(taxonomyId, taxonomySelect, termSelect, savedData, mainId) {

        var taxonomySelectOptions = Config.getPluginConfig('gene_widget_search_app_collection', 'taxonomy_title');

        for(var i=0; i<taxonomySelectOptions.length; i++) {

            var appendSelected = false;

            //Load the saved taxonomy if there is one
            if (this.entity.data.hasOwnProperty("preview_view") && savedData['taxonomy_ids'] !== null) {
                jQuery.each(savedData['taxonomy_ids'], function(key, value) {
                    if(value == taxonomySelectOptions[i].id) {
                        appendSelected = true;
                    }
                });
            }

            //Add 'selected' attribute to saved content app
            if (taxonomySelectOptions[i].content_app_id == savedData['app_id']) {
                taxonomySelect.append(
                    jQuery('<option />')
                        .text(taxonomySelectOptions[i].title)
                        .addClass('taxonomy_options')
                        .val(taxonomySelectOptions[i].id)
                        .attr('selected', appendSelected)
                );
            }
        }

        //Add select all option
        if (this.entity.data.hasOwnProperty('preview_view') && this.entity.data['preview_view'][this.field.code]) {
            var selectAll = jQuery('<option />')
                .text('All')
                .attr('taxonomy_id', taxonomySelect.val())
                .attr('select_all', true)
                .addClass('gene-bluefoottext_taxonomy-select-all-options')
                .val('0');

            termSelect.append(
                selectAll
            );
        }
    };

    /**
     * Build the select box for content apps
     * @param id
     * @param fakeId
     * @param savedData
     * @returns jQuery object
     */
    InputField.prototype.buildAppSelect = function(id, fakeId, savedData) {

        var appId,
            appSelect = jQuery('<select />').attr('id', id + '-app-select').addClass('gene-bluefoot-taxonomy-search-content-apps').attr('name', id + '-app-multiselect');

        appSelect.append(
            jQuery('<option />').text('--').addClass('content_app_options').val('0')
        );

        var appSelectOptions = Config.getPluginConfig('gene_widget_search_app_collection', 'content_apps');

        for(var j=0; j<appSelectOptions.length; j++) {

            var appendAppSelected = false;

            //Load the saved app if there is one
            if( this.entity.data.hasOwnProperty(this.field.code)) {
                if (appSelectOptions[j].id == savedData['app_id']) {
                    appendAppSelected = true;
                }
            }

            if(this.entity.data.hasOwnProperty(this.field.code)) {
                appId = savedData['app_id'];

            } else {
                appId = appSelect.find('option').val();
            }

            appSelect.val(appId);

            appSelect.append(
                jQuery('<option />').text(appSelectOptions[j].title).addClass('content_app_options').val(appSelectOptions[j].id).attr('selected', appendAppSelected)
            );
        }

        appSelect.change(function() {
            InputField.prototype.selectAppAjax(id);
            InputField.prototype.buildSaveData(hasNoData = false, id);

        });

        this.element.append(
            jQuery('<label />').attr('for', fakeId).html('Select a content app'),
            appSelect);
    };

    /**
     * Ajax request for retrieving the taxonomy collection
     * @returns object
     */
    InputField.prototype.selectAppAjax = function(mainId) {

        var selectedApp = jQuery('#' + mainId + '-app-select').val();

        var Ajax = new AjaxClass();
        Ajax.get(Config.getPluginConfig('gene_widget_search_content_apps', 'source_url'), {
            app_id: selectedApp

        }, function (data) {

            var taxonomySelect = jQuery('#' + mainId + '-taxonomy-multiselect');

            //If no taxonomies are returned, show the disabled option, otherwise, populate the fields
            var noTaxonomies = jQuery('<option />')
                .text('There are no associated taxonomies for this app.')
                .attr('disabled', true)
                .addClass('no-taxonomies-available');

            if (data.length < 1) {
                taxonomySelect.find('option').remove();
                taxonomySelect.append(
                    noTaxonomies
                );

                var hasNoData = true;
                InputField.prototype.buildSaveData(hasNoData, mainId);

                jQuery('#' + mainId + '-taxonomy-term-multiselect').css('display', 'none');

            } else {

                if(noTaxonomies.length) {
                    noTaxonomies.remove();
                }

                taxonomySelect.find('option').remove();
                taxonomySelect.append(
                    jQuery('<option />')
                        .text('None')
                        .addClass('no_taxonomies_filter_option')
                        .val(0)
                );

                for (var i = 0; i < data.length; i++) {
                    taxonomySelect.append(
                        jQuery('<option />')
                            .text(data[i].content_app + ' - ' + data[i].taxonomy_title)
                            .val(data[i].taxonomy_id)
                            .addClass('taxonomy_options')
                    );
                }
            }
        });
    };

    /**
     * Ajax request for retrieving the taxonomy term collection
     * @param termSelect
     * @param taxonomySelect
     * @returns object
     */
    InputField.prototype.selectTaxonomyAjax = function(taxonomySelect, termSelect, mainId) {

        var selectedTaxonomy = taxonomySelect.val();

        if(selectedTaxonomy == '0') {
            this.toggleFilter(true, mainId);

        } else {
            this.toggleFilter(false, mainId);

            var Ajax = new AjaxClass();
            Ajax.get(Config.getPluginConfig('gene_widget_search_app_collection', 'source_url'), {
                taxonomy_ids: selectedTaxonomy

            }, function (data) {
                //If no terms are returned, show the disabled option, otherwise, populate the fields
                var noTerms = jQuery('<option />')
                    .text('There are no associated terms for this taxonomy.')
                    .attr('disabled', true)
                    .addClass('no-terms-available');

                if (data.results === 0) {
                    termSelect.find('optgroup').remove();
                    termSelect.find('option').remove();
                    termSelect.append(
                        noTerms
                    );

                    var hasNoData = true;

                    InputField.prototype.buildSaveData(hasNoData, mainId);

                } else {

                    termSelect.find('option').remove();
                    termSelect.find('optgroup').remove();

                    var selectAll = jQuery('<option />')
                        .text('All')
                        .attr('taxonomy_id', taxonomySelect.val())
                        .attr('select_all', true)
                        .addClass('gene-bluefoottext_taxonomy-select-all-options')
                        .val('0');

                    termSelect.append(selectAll);

                    for (var x = 0; x < selectedTaxonomy.length; x++) {

                        var optGroupLabel = taxonomySelect.find('[value="' + selectedTaxonomy[x] + '"]').text(),
                            termSelectOptionsGroup = jQuery('<optgroup label="' + optGroupLabel + '"/>').val(selectedTaxonomy).attr('id', selectedTaxonomy[x]);

                        for (var y = 0; y < data.length; y++) {

                            var termSelectOptions = jQuery('<option />')
                                .text(data[y].label)
                                .attr('taxonomy_id', data[y].taxonomyid)
                                .attr('id', data[y].id)
                                .val(data[y].id);

                            if (selectedTaxonomy != '0') {
                                termSelect.append(termSelectOptionsGroup);
                                jQuery.each(termSelectOptionsGroup, function () {

                                    if (termSelectOptions.attr('taxonomy_id') === termSelectOptionsGroup.attr('id')) {
                                        termSelectOptionsGroup.append(termSelectOptions);
                                    }
                                });
                            }
                        }
                    }
                }
            });
        }
    };

    return InputField;
});
