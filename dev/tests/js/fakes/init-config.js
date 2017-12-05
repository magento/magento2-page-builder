module.exports = {
    "form_key": "vhMlJT14SgNrSvJq",
    "init_button_class": ".init-gene-bluefoot",
    "media_url": "http://fake-magento-url.local/media/",
    "columns": 6,
    "column_definitions": [{
        "label": "1 (100%)",
        "breakpoint": "1",
        "className": "bluefoot-structure-wrapper-width-whole",
        "displayed": true
    }, {
        "label": "1/2 (50%)",
        "breakpoint": "0.500",
        "className": "bluefoot-structure-wrapper-width-half",
        "displayed": true
    }, {
        "label": "1/3 (33%)",
        "breakpoint": "0.333",
        "className": "bluefoot-structure-wrapper-width-third",
        "displayed": true
    }, {
        "label": "1/4 (25%)",
        "breakpoint": "0.250",
        "className": "bluefoot-structure-wrapper-width-quarter",
        "displayed": true
    }, {
        "label": "1/6 (16.7%)",
        "breakpoint": "0.167",
        "className": "bluefoot-structure-wrapper-width-sixth",
        "displayed": true
    }, {
        "label": "2/3 (66%)",
        "breakpoint": "0.666",
        "className": "bluefoot-structure-wrapper-width-two-thirds",
        "displayed": false
    }, {
        "label": "3/4 (75%)",
        "breakpoint": "0.750",
        "className": "bluefoot-structure-wrapper-width-three-quarters",
        "displayed": false
    }, {
        "label": "5/6 (82.5%)",
        "breakpoint": "0.825",
        "className": "bluefoot-structure-wrapper-width-five-sixths",
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
            "icon": "icon-bluefoot-row",
            "form": "row_form",
            "contentType": "",
            "group": "general",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "render_template": "Gene_BlueFoot/component/block/render/row.html",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
            "component": "Gene_BlueFoot/js/component/block/block",
            "readers": ["Gene_BlueFoot/js/component/format/read/default"],
            "appearances": {}
        },
        "column": {
            "name": "column",
            "label": "Column",
            "icon": "icon-bluefoot-column",
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
            "render_template": "Gene_BlueFoot/component/block/render/column.html",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
            "component": "Gene_BlueFoot/js/component/block/block",
            "readers": ["Gene_BlueFoot/js/component/format/read/default"],
            "appearances": {
                "align-top": "Gene_BlueFoot/js/component/appearance/column/align-top",
                "align-center": "Gene_BlueFoot/js/component/appearance/column/align-center",
                "align-bottom": "Gene_BlueFoot/js/component/appearance/column/align-bottom"
            }
        },
        "text": {
            "name": "text",
            "label": "Text",
            "icon": "icon-bluefoot-text",
            "form": "text_form",
            "contentType": "",
            "group": "general",
            "fields": {"textarea": {"default": "Type your text here..."}},
            "visible": true,
            "preview_template": "Gene_BlueFoot/component/block/preview/text.html",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
            "component": "Gene_BlueFoot/js/component/block/block"
        },
        "heading": {
            "name": "heading",
            "label": "Header",
            "icon": "icon-bluefoot-heading",
            "form": "heading_form",
            "contentType": "",
            "group": "general",
            "fields": {"heading_type": {"default": "h2"}, "title": {"default": "Type heading content here..."}},
            "visible": true,
            "preview_template": "Gene_BlueFoot/component/block/preview/header.html",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
            "component": "Gene_BlueFoot/js/component/block/block",
            "readers": [
                "Gene_BlueFoot/js/component/format/read/default",
                "Gene_BlueFoot/js/component/format/read/heading"
            ],
            "appearances": {}
        },
        "button": {
            "name": "button",
            "label": "Button",
            "icon": "icon-bluefoot-button",
            "form": "button_form",
            "contentType": "",
            "group": "general",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
            "component": "Gene_BlueFoot/js/component/block/block"
        },
        "divider": {
            "name": "divider",
            "label": "Divider",
            "icon": "icon-bluefoot-divider",
            "form": "divider_form",
            "contentType": "",
            "group": "general",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
            "component": "Gene_BlueFoot/js/component/block/block"
        },
        "image": {
            "name": "image",
            "label": "Image",
            "icon": "icon-bluefoot-image",
            "form": "image_form",
            "contentType": "",
            "group": "media",
            "fields": {"image": {"default": ""}},
            "visible": true,
            "preview_template": "Gene_BlueFoot/component/block/preview/image.html",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/image",
            "component": "Gene_BlueFoot/js/component/block/block"
        },
        "video": {
            "name": "video",
            "label": "Video",
            "icon": "icon-bluefoot-video",
            "form": "image_form",
            "contentType": "",
            "group": "media",
            "fields": {"image": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
            "component": "Gene_BlueFoot/js/component/block/block"
        },
        "banner": {
            "name": "banner",
            "label": "Banner",
            "icon": "icon-bluefoot-block",
            "form": "banner_form",
            "contentType": "",
            "group": "media",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
            "component": "Gene_BlueFoot/js/component/block/block"
        },
        "slider": {
            "name": "slider",
            "label": "Slider",
            "icon": "icon-bluefoot-slider",
            "form": "slider_form",
            "contentType": "",
            "group": "media",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
            "component": "Gene_BlueFoot/js/component/block/block"
        },
        "tabs": {
            "name": "tabs",
            "label": "Tabs",
            "icon": "icon-bluefoot-tabs",
            "form": "tabs_form",
            "contentType": "",
            "group": "interactive",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
            "component": "Gene_BlueFoot/js/component/block/block"
        },
        "accordion": {
            "name": "accordion",
            "label": "Accordion",
            "icon": "icon-bluefoot-accordian",
            "form": "accordion_form",
            "contentType": "",
            "group": "interactive",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
            "component": "Gene_BlueFoot/js/component/block/block"
        },
        "map": {
            "name": "map",
            "label": "Map",
            "icon": "icon-bluefoot-map",
            "form": "map_form",
            "contentType": "",
            "group": "interactive",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
            "component": "Gene_BlueFoot/js/component/block/block"
        },
        "newsletter": {
            "name": "newsletter",
            "label": "Newsletter",
            "icon": "icon-bluefoot-newsletter",
            "form": "newsletter_form",
            "contentType": "",
            "group": "interactive",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
            "component": "Gene_BlueFoot/js/component/block/block"
        },
        "block": {
            "name": "block",
            "label": "Block",
            "icon": "icon-bluefoot-block",
            "form": "block_form",
            "contentType": "",
            "group": "magento",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
            "component": "Gene_BlueFoot/js/component/block/block"
        },
        "segmented_block": {
            "name": "segmented_block",
            "label": "Segmented Block",
            "icon": "icon-bluefoot-block",
            "form": "segmented_block_form",
            "contentType": "",
            "group": "magento",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
            "component": "Gene_BlueFoot/js/component/block/block"
        },
        "products": {
            "name": "products",
            "label": "Products",
            "icon": "icon-bluefoot-products",
            "form": "products_form",
            "contentType": "",
            "group": "magento",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
            "component": "Gene_BlueFoot/js/component/block/block"
        },
        "anchor": {
            "name": "anchor",
            "label": "Anchor",
            "icon": "icon-bluefoot-anchor",
            "form": "anchor_form",
            "contentType": "",
            "group": "other",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
            "component": "Gene_BlueFoot/js/component/block/block"
        },
        "code": {
            "name": "code",
            "label": "Code",
            "icon": "icon-bluefoot-code",
            "form": "code_form",
            "contentType": "",
            "group": "other",
            "fields": {"heading_type": {"default": ""}},
            "visible": true,
            "preview_template": "",
            "preview_component": "Gene_BlueFoot/js/component/block/preview/block",
            "component": "Gene_BlueFoot/js/component/block/block"
        }
    },
    "templates": [],
    "plugins": {
        "gene_widget_upload": {
            "config": {
                "upload_url": "http://fake-magento-url.local/admin/bluefoot/stage/widget_upload/",
                "gallery_url": "http://fake-magento-url.local/admin/cms/wysiwyg_images/",
                "media_url": "//localhost:8888/2.2.x/magento2ce/pub/media//media/gene-cms"
            }
        },
        "gene_widget_magentowidget": {"config": {"widget_url": "http://fake-magento-url.local/admin/admin/widget/index/"}},
        "gene_redactor": {"config": {"magentovar_url": "http://fake-magento-url.local/admin/admin/system_variable/wysiwygPlugin/"}},
        "gene_widget_search_product": {"config": {"source_url": "http://fake-magento-url.local/admin/bluefoot/stage/widget_search/context/product/"}},
        "gene_widget_search_category": {"config": {"source_url": "http://fake-magento-url.local/admin/bluefoot/stage/widget_search/context/category/"}},
        "gene_widget_search_staticblock": {"config": {"source_url": "http://fake-magento-url.local/admin/bluefoot/stage/widget_search/context/staticblock/"}},
        "gene_widget_video": {"config": {"source_url": "http://fake-magento-url.local/admin/bluefoot/stage/widget_video/"}}
    }
};
