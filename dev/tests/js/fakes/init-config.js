module.exports = {
    "form_key": "vhMlJT14SgNrSvJq",
    "init_button_class": ".init-magento-pagebuilder",
    "media_url": "http://fake-magento-url.local/media/",
    "columns": 6,
    "column_definitions": [{
        "label": "1 (100%)",
        "breakpoint": "1",
        "className": "pagebuilder-structure-wrapper-width-whole",
        "displayed": true
    }, {
        "label": "1/2 (50%)",
        "breakpoint": "0.500",
        "className": "pagebuilder-structure-wrapper-width-half",
        "displayed": true
    }, {
        "label": "1/3 (33%)",
        "breakpoint": "0.333",
        "className": "pagebuilder-structure-wrapper-width-third",
        "displayed": true
    }, {
        "label": "1/4 (25%)",
        "breakpoint": "0.250",
        "className": "pagebuilder-structure-wrapper-width-quarter",
        "displayed": true
    }, {
        "label": "1/6 (16.7%)",
        "breakpoint": "0.167",
        "className": "pagebuilder-structure-wrapper-width-sixth",
        "displayed": true
    }, {
        "label": "2/3 (66%)",
        "breakpoint": "0.666",
        "className": "pagebuilder-structure-wrapper-width-two-thirds",
        "displayed": false
    }, {
        "label": "3/4 (75%)",
        "breakpoint": "0.750",
        "className": "pagebuilder-structure-wrapper-width-three-quarters",
        "displayed": false
    }, {
        "label": "5/6 (82.5%)",
        "breakpoint": "0.825",
        "className": "pagebuilder-structure-wrapper-width-five-sixths",
        "displayed": false
    }],
    "groups": {
        "general": {"label": "General", "sortOrder": "1"},
        "media": {"label": "Media", "sortOrder": "10"},
        "interactive": {"label": "Interactive", "sortOrder": "20"},
        "magento": {"label": "Magento", "sortOrder": "30"},
        "other": {"label": "Other", "sortOrder": "40"}
    },
    "contentTypes": {
        "row": {
            "name": "row",
            "label": "Row",
            "icon": "icon-pagebuilder-row",
            "form": "row_form",
            "contentType": "",
            "group": "general",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "render_template": "Magento_PageBuilder/component/block/render/row.html",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/block",
            "component": "Magento_PageBuilder/js/component/block/block",
            "readers": ["Magento_PageBuilder/js/component/format/read/default"],
            "appearances": {}
        },
        "column": {
            "name": "column",
            "label": "Column",
            "icon": "icon-pagebuilder-column",
            "form": "column_form",
            "contentType": "",
            "group": "general",
            "fields": {
                "min_height": {"default": ""},
                "background_color": {"default": ""},
                "background_image": {"default": ""},
                "background_position": {"default": "top_aligned"},
                "background_size": {"default": "auto"},
                "background_repeat": {"default": "0"},
                "background_attachment": {"default": "fixed"}
            },
            "visible": true,
            "preview_template": "",
            "render_template": "Magento_PageBuilder/component/block/render/column.html",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/block",
            "component": "Magento_PageBuilder/js/component/block/block",
            "readers": ["Magento_PageBuilder/js/component/format/read/default"],
            "appearances": {
                "align-top": "Magento_PageBuilder/js/component/appearance/column/align-top",
                "align-center": "Magento_PageBuilder/js/component/appearance/column/align-center",
                "align-bottom": "Magento_PageBuilder/js/component/appearance/column/align-bottom"
            }
        },
        "text": {
            "name": "text",
            "label": "Text",
            "icon": "icon-pagebuilder-text",
            "form": "text_form",
            "contentType": "",
            "group": "general",
            "fields": {"textarea": {"default": "Type your text here..."}},
            "visible": true,
            "preview_template": "Magento_PageBuilder/component/block/preview/text.html",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/block",
            "component": "Magento_PageBuilder/js/component/block/block"
        },
        "heading": {
            "name": "heading",
            "label": "Header",
            "icon": "icon-pagebuilder-heading",
            "form": "heading_form",
            "contentType": "",
            "group": "general",
            "fields": {"heading_type": {"default": "h2"}, "title": {"default": "Type heading content here..."}},
            "visible": true,
            "preview_template": "Magento_PageBuilder/component/block/preview/header.html",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/block",
            "component": "Magento_PageBuilder/js/component/block/block",
            "readers": [
                "Magento_PageBuilder/js/component/format/read/default",
                "Magento_PageBuilder/js/component/format/read/heading"
            ],
            "appearances": {}
        },
        "button": {
            "name": "button",
            "label": "Button",
            "icon": "icon-pagebuilder-button",
            "form": "button_form",
            "contentType": "",
            "group": "general",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/block",
            "component": "Magento_PageBuilder/js/component/block/block"
        },
        "divider": {
            "name": "divider",
            "label": "Divider",
            "icon": "icon-pagebuilder-divider",
            "form": "divider_form",
            "contentType": "",
            "group": "general",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/block",
            "component": "Magento_PageBuilder/js/component/block/block"
        },
        "image": {
            "name": "image",
            "label": "Image",
            "icon": "icon-pagebuilder-image",
            "form": "image_form",
            "contentType": "",
            "group": "media",
            "fields": {"image": {"default": ""}},
            "visible": true,
            "preview_template": "Magento_PageBuilder/component/block/preview/image.html",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/image",
            "component": "Magento_PageBuilder/js/component/block/block"
        },
        "video": {
            "name": "video",
            "label": "Video",
            "icon": "icon-pagebuilder-video",
            "form": "image_form",
            "contentType": "",
            "group": "media",
            "fields": {"image": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/block",
            "component": "Magento_PageBuilder/js/component/block/block"
        },
        "banner": {
            "name": "banner",
            "label": "Banner",
            "icon": "icon-pagebuilder-block",
            "form": "banner_form",
            "contentType": "",
            "group": "media",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/block",
            "component": "Magento_PageBuilder/js/component/block/block"
        },
        "slider": {
            "name": "slider",
            "label": "Slider",
            "icon": "icon-pagebuilder-slider",
            "form": "slider_form",
            "contentType": "",
            "group": "media",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/block",
            "component": "Magento_PageBuilder/js/component/block/block"
        },
        "tabs": {
            "name": "tabs",
            "label": "Tabs",
            "icon": "icon-pagebuilder-tabs",
            "form": "tabs_form",
            "contentType": "",
            "group": "interactive",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/block",
            "component": "Magento_PageBuilder/js/component/block/block"
        },
        "accordion": {
            "name": "accordion",
            "label": "Accordion",
            "icon": "icon-pagebuilder-accordian",
            "form": "accordion_form",
            "contentType": "",
            "group": "interactive",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/block",
            "component": "Magento_PageBuilder/js/component/block/block"
        },
        "map": {
            "name": "map",
            "label": "Map",
            "icon": "icon-pagebuilder-map",
            "form": "map_form",
            "contentType": "",
            "group": "interactive",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/block",
            "component": "Magento_PageBuilder/js/component/block/block"
        },
        "newsletter": {
            "name": "newsletter",
            "label": "Newsletter",
            "icon": "icon-pagebuilder-newsletter",
            "form": "newsletter_form",
            "contentType": "",
            "group": "interactive",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/block",
            "component": "Magento_PageBuilder/js/component/block/block"
        },
        "block": {
            "name": "block",
            "label": "Block",
            "icon": "icon-pagebuilder-block",
            "form": "block_form",
            "contentType": "",
            "group": "magento",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/block",
            "component": "Magento_PageBuilder/js/component/block/block"
        },
        "segmented_block": {
            "name": "segmented_block",
            "label": "Segmented Block",
            "icon": "icon-pagebuilder-block",
            "form": "segmented_block_form",
            "contentType": "",
            "group": "magento",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/block",
            "component": "Magento_PageBuilder/js/component/block/block"
        },
        "products": {
            "name": "products",
            "label": "Products",
            "icon": "icon-pagebuilder-products",
            "form": "products_form",
            "contentType": "",
            "group": "magento",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/block",
            "component": "Magento_PageBuilder/js/component/block/block"
        },
        "anchor": {
            "name": "anchor",
            "label": "Anchor",
            "icon": "icon-pagebuilder-anchor",
            "form": "anchor_form",
            "contentType": "",
            "group": "other",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/block",
            "component": "Magento_PageBuilder/js/component/block/block"
        },
        "code": {
            "name": "code",
            "label": "Code",
            "icon": "icon-pagebuilder-code",
            "form": "code_form",
            "contentType": "",
            "group": "other",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Magento_PageBuilder/js/component/block/preview/block",
            "component": "Magento_PageBuilder/js/component/block/block"
        }
    },
    "templates": [],
    "plugins": {
        "gene_widget_upload": {
            "config": {
                "upload_url": "http://fake-magento-url.local/admin/pagebuilder/stage/widget_upload/",
                "gallery_url": "http://fake-magento-url.local/admin/cms/wysiwyg_images/",
                "media_url": "//localhost:8888/2.2.x/magento2ce/pub/media//media/gene-cms"
            }
        },
        "gene_widget_magentowidget": {"config": {"widget_url": "http://fake-magento-url.local/admin/admin/widget/index/"}},
        "gene_redactor": {"config": {"magentovar_url": "http://fake-magento-url.local/admin/admin/system_variable/wysiwygPlugin/"}},
        "gene_widget_search_product": {"config": {"source_url": "http://fake-magento-url.local/admin/pagebuilder/stage/widget_search/context/product/"}},
        "gene_widget_search_category": {"config": {"source_url": "http://fake-magento-url.local/admin/pagebuilder/stage/widget_search/context/category/"}},
        "gene_widget_search_staticblock": {"config": {"source_url": "http://fake-magento-url.local/admin/pagebuilder/stage/widget_search/context/staticblock/"}},
        "gene_widget_video": {"config": {"source_url": "http://fake-magento-url.local/admin/pagebuilder/stage/widget_video/"}}
    }
};
