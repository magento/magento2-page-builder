/**
 * - Panel.js
 * Handles all interactions with the panel
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define(['bluefoot/jquery', 'bluefoot/renderer', 'bluefoot/cms-config', 'bluefoot/hook', 'bluefoot/dragdrop', 'jquery/bluefoot-accordion'], function (jQuery, Render, InitConfig, Hook, DragDropClass) {

    /**
     * Our Panel class
     *
     * @constructor
     */
    function Panel(stage, config) {
        this.stage = stage;
        this.panelHtml = false;

        // Init the panel
        this.initPanel(config);
        this.bindPanelEvents();
    }

    /**
     * Init the panel
     *
     * @param config
     */
    Panel.prototype.initPanel = function (config) {
        this.panelHtml = Render.renderFromConfig('panel_template', this.getPanelConfig(config));
    };

    /**
     * Return the panel configuration
     *
     * @param config
     * @returns {{content-type-groups: Array}}
     */
    Panel.prototype.getPanelConfig = function (config) {

        var panelConfig = {
            'content-type-groups': []
        };

        // Firstly build up our groups
        jQuery.each(config.contentTypeGroups, function (code, contentTypeGroupConfig) {
            panelConfig['content-type-groups'].push({
                code: code,
                sort: contentTypeGroupConfig.sort,
                name: contentTypeGroupConfig.name,
                icon: contentTypeGroupConfig.icon,
                types: []
            });
        });

        // Sort the groups by sort, then by name
        panelConfig['content-type-groups']  = panelConfig['content-type-groups'].sort(function(a, b) {
            return a.sort - b.sort  ||  a.name.localeCompare(b.name);
        });

        // Loop through content types
        jQuery.each(config.contentTypes, function (code, contentTypeConfig) {

            // Check has a group or default to general
            if (typeof contentTypeConfig.group === 'undefined') {
                contentTypeConfig.group = 'general';
            }

            // Grab the content type group
            var contentTypeGroupSearch = jQuery.grep(panelConfig['content-type-groups'], function (group) {
                return group.code == contentTypeConfig.group;
            });
            var contentTypeGroup = contentTypeGroupSearch[0];

            // Check group exists
            if (!contentTypeGroup) {
                return false;
            }

            // Add the code into the config
            contentTypeConfig.code = code;

            // Push into the content group
            if (contentTypeConfig.visible) {
                contentTypeGroup.types.push(contentTypeConfig);
            }
        });

        // Hide any empty groups from the panel
        var enabledGroups = [];
        jQuery.each(panelConfig['content-type-groups'], function (index, group) {
            if (group.types.length > 0) {
                enabledGroups.push(group);
            }
        });
        panelConfig['content-type-groups'] = enabledGroups;

        Hook.trigger('gene-bluefoot-panel-get-config', {panelConfig: panelConfig}, false, this.stage);

        return panelConfig;
    };

    /**
     * Bind the panels events
     */
    Panel.prototype.bindPanelEvents = function () {
        Hook.attach('gene-bluefoot-after-stage-init', function ($hook) {
            // Only run for the current stage
            if ($hook.params.id == this.stage.id) {
                this.contentTypesElements = this.stage.container.find('ul.gene-bluefoot-stage-panel-group-types li.gene-bluefoot-content-type a');
                jQuery.each(this.contentTypesElements, function (index, contentType) {
                    this.initContentType(contentType);
                }.bind(this));

                // Init Gene Accordions
                jQuery(this.stage.container).find('.gene-bluefoot-stage-panel-content-types-ul').bluefootAccordion({
                    links: '.gene-bluefoot-group-name',
                    inner: '.gene-bluefoot-stage-panel-group-types',
                    outer: '.gene-bluefoot-group'
                });
                // Hide accordion items
                jQuery(this.stage.container).find('.gene-bluefoot-stage-panel-group-types').hide();

                // Show first + add class active
                jQuery(this.stage.container).find('.gene-bluefoot-stage-panel-group-types').first().show();
                jQuery(this.stage.container).find('.gene-bluefoot-group').first().addClass('active');

                //Panel hide show button
                jQuery(this.stage.container).find('.gene-bluefoot-stage-panel-control').on('click', function () {
                    if (jQuery(this.stage.container).find('.gene-bluefoot-stage').hasClass('active')) {
                        jQuery(this.stage.container).find('.gene-bluefoot-stage').removeClass('active');
                    } else {
                        jQuery(this.stage.container).find('.gene-bluefoot-stage').addClass('active');
                    }
                    jQuery(this.stage.container).find('.gene-bluefoot-stage').on(
                        'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
                        function () {
                            Hook.trigger('gene-bluefoot-stage-ui-updated', false, false, this.stage);
                            Hook.trigger('gene-bluefoot-stage-updated', false, false, this.stage);
                        }.bind(this)
                    );
                    return false;
                }.bind(this));

                jQuery(this.stage.container).find('.gene-bluefoot-stage-full-screen').on('click', this.stage.fullscreen.bind(this));
            }

            $hook.done();
        }.bind(this), this.stage);
    };

    /**
     * Init each individual content type
     *
     * @param element
     */
    Panel.prototype.initContentType = function (element) {
        // Init the drag and drop functionality of the content type
        var dragDrop = new DragDropClass(this.stage);
        dragDrop.initDrag(element);

        // Disable clicking on content types
        jQuery(element).off('click').on('click', function (event) {
            event.preventDefault();
        });
    };

    return Panel;
});