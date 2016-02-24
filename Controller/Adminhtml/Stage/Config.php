<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Stage;

/**
 * Class Config
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Config extends \Magento\Framework\App\Action\Action
{
    /**
     * say hello text
     */
    public function execute()
    {
        die('{
    "contentTypeGroups": {
        "general": {
            "icon": "<i class=\"fa fa-chevron-down\"><\/i>",
            "name": "General"
        },
        "other": {
            "icon": "<i class=\"fa fa-chevron-down\"><\/i>",
            "name": "Other"
        }
    },
    "contentTypes": {
        "heading": {
            "code": "heading",
            "name": "Heading",
            "icon": "<i class=\"fa fa-header\"><\/i>",
            "color": "#779ecb",
            "color_theme": "light",
            "contentType": "",
            "group": "general",
            "fields": {
                "heading_type": {
                    "attribute_id": "146",
                    "code": "heading_type",
                    "type": "select",
                    "label": "Heading Type",
                    "is_global": "0",
                    "group": "General",
                    "options": [{
                        "label": "",
                        "value": ""
                    }, {
                        "value": "6",
                        "label": "H2"
                    }, {
                        "value": "5",
                        "label": "H3"
                    }, {
                        "value": "4",
                        "label": "H4"
                    }, {
                        "value": "3",
                        "label": "H5"
                    }
                    ],
                    "note": "The type of heading you wish to display on the page"
                },
                "title": {
                    "attribute_id": "132",
                    "code": "title",
                    "type": "text",
                    "label": "Title",
                    "is_global": "0",
                    "group": "General",
                    "required": true
                },
                "heading_list": {
                    "attribute_id": "154",
                    "code": "heading_list",
                    "type": "widget",
                    "label": "Headings",
                    "is_global": "0",
                    "group": "Links",
                    "options": [{
                        "label": "{no title} [Type: , ID: 1]",
                        "value": "1"
                    }, {
                        "label": "{no title} [Type: , ID: 5]",
                        "value": "5"
                    }, {
                        "label": "{no title} [Type: , ID: 6]",
                        "value": "6"
                    }, {
                        "label": "{no title} [Type: , ID: 10]",
                        "value": "10"
                    }, {
                        "label": "Text here [Type: , ID: 27]",
                        "value": "27"
                    }, {
                        "label": "Heading 2 [Type: , ID: 28]",
                        "value": "28"
                    }, {
                        "label": "Heading 1 [Type: , ID: 29]",
                        "value": "29"
                    }, {
                        "label": "Testing the title  [Type: , ID: 38]",
                        "value": "38"
                    }, {
                        "label": "Awesome Blog POst [Type: , ID: 40]",
                        "value": "40"
                    }, {
                        "label": "bnvbnbn [Type: , ID: 53]",
                        "value": "53"
                    }, {
                        "label": "jhgjhhjjhg [Type: , ID: 54]",
                        "value": "54"
                    }, {
                        "label": "jkhjkj [Type: , ID: 56]",
                        "value": "56"
                    }, {
                        "label": "Testing [Type: , ID: 58]",
                        "value": "58"
                    }, {
                        "label": "Lemons [Type: , ID: 62]",
                        "value": "62"
                    }, {
                        "label": "Brand new heading [Type: , ID: 63]",
                        "value": "63"
                    }, {
                        "label": "Testing another heading  [Type: , ID: 74]",
                        "value": "74"
                    }
                    ],
                    "widget": "child_block",
                    "child_block_type": "heading"
                },
                "widget_test": {
                    "attribute_id": "170",
                    "code": "widget_test",
                    "type": "widget",
                    "label": "Test",
                    "is_global": "0",
                    "group": "Testing",
                    "widget": "tags"
                }
            },
            "fields_list": ["heading_type", "title", "heading_list", "widget_test"],
            "preview_template": "<div class=\"gene-cms-heading\">\n    <{{ heading_type }}>{{ title }}<\/{{ heading_type }}>\n<\/div>"
        },
        "slider": {
            "code": "slider",
            "name": "Slider",
            "icon": "<i class=\"fa fa-codiepie\"><\/i>",
            "color": "#e2e2e2",
            "color_theme": "dark",
            "contentType": "",
            "group": "general",
            "fields": {
                "slider_items": {
                    "attribute_id": "168",
                    "code": "slider_items",
                    "type": "widget",
                    "label": "Slider Items",
                    "is_global": "0",
                    "group": "General",
                    "options": [{
                        "label": "{no title} [Type: , ID: 34]",
                        "value": "34"
                    }, {
                        "label": "{no title} [Type: , ID: 35]",
                        "value": "35"
                    }, {
                        "label": "{no title} [Type: , ID: 36]",
                        "value": "36"
                    }, {
                        "label": "{no title} [Type: , ID: 76]",
                        "value": "76"
                    }, {
                        "label": "{no title} [Type: , ID: 78]",
                        "value": "78"
                    }, {
                        "label": "{no title} [Type: , ID: 80]",
                        "value": "80"
                    }, {
                        "label": "{no title} [Type: , ID: 82]",
                        "value": "82"
                    }, {
                        "label": "{no title} [Type: , ID: 83]",
                        "value": "83"
                    }
                    ],
                    "widget": "child_block",
                    "child_block_type": "slider_item"
                },
                "fade": {
                    "attribute_id": "164",
                    "code": "fade",
                    "type": "select",
                    "label": "Fade",
                    "is_global": "0",
                    "group": "General",
                    "options": [{
                        "value": 0,
                        "label": "No"
                    }, {
                        "value": 1,
                        "label": "Yes"
                    }
                    ],
                    "note": "Do you want the slider to have a fade affect"
                },
                "autoplay": {
                    "attribute_id": "161",
                    "code": "autoplay",
                    "type": "select",
                    "label": "Autoplay",
                    "is_global": "0",
                    "group": "General",
                    "options": [{
                        "value": 0,
                        "label": "No"
                    }, {
                        "value": 1,
                        "label": "Yes"
                    }
                    ]
                },
                "show_arrows": {
                    "attribute_id": "160",
                    "code": "show_arrows",
                    "type": "select",
                    "label": "Show Arrows",
                    "is_global": "0",
                    "group": "General",
                    "options": [{
                        "value": 0,
                        "label": "No"
                    }, {
                        "value": 1,
                        "label": "Yes"
                    }
                    ]
                },
                "show_dots": {
                    "attribute_id": "159",
                    "code": "show_dots",
                    "type": "select",
                    "label": "Show Dots",
                    "is_global": "0",
                    "group": "General",
                    "options": [{
                        "value": 0,
                        "label": "No"
                    }, {
                        "value": 1,
                        "label": "Yes"
                    }
                    ]
                },
                "slides_to_show": {
                    "attribute_id": "162",
                    "code": "slides_to_show",
                    "type": "text",
                    "label": "Slides to Show",
                    "is_global": "0",
                    "group": "General",
                    "note": "Number of slides to show at once"
                },
                "slides_to_scroll": {
                    "attribute_id": "163",
                    "code": "slides_to_scroll",
                    "type": "text",
                    "label": "Slides to Scroll",
                    "is_global": "0",
                    "group": "General",
                    "note": "The number of slides to scroll at once"
                }
            },
            "fields_list": ["slider_items", "fade", "autoplay", "show_arrows", "show_dots", "slides_to_show", "slides_to_scroll"],
            "preview_template": "<div id=\"gene-cms-slider\" class=\"gene-cms-slider\">\n    {{#child_blocks.slider_items}}\n    {{{html}}}\n    {{\/child_blocks.slider_items}}\n<\/div>\n\n\n<script type=\"text\/javascript\">\n    jQuery(function() {\n        \/* [Slick JS] *\/\n        jQuery(\'#gene-cms-slider\').slick({\n        });\n    });\n\n<\/script>"
        },
        "inception": {
            "code": "inception",
            "name": "Inception",
            "icon": "<i class=\"fa fa-reddit-alien\"><\/i>",
            "color": "#b19cd9",
            "color_theme": "light",
            "contentType": "",
            "group": "general",
            "fields": {
                "inception": {
                    "attribute_id": "149",
                    "code": "inception",
                    "type": "widget",
                    "label": "Inception",
                    "is_global": "0",
                    "group": "General",
                    "options": [{
                        "label": "{no title} [Type: , ID: 7]",
                        "value": "7"
                    }, {
                        "label": "{no title} [Type: , ID: 8]",
                        "value": "8"
                    }, {
                        "label": "{no title} [Type: , ID: 9]",
                        "value": "9"
                    }, {
                        "label": "{no title} [Type: , ID: 13]",
                        "value": "13"
                    }, {
                        "label": "{no title} [Type: , ID: 14]",
                        "value": "14"
                    }, {
                        "label": "{no title} [Type: , ID: 15]",
                        "value": "15"
                    }, {
                        "label": "{no title} [Type: , ID: 16]",
                        "value": "16"
                    }, {
                        "label": "{no title} [Type: , ID: 17]",
                        "value": "17"
                    }, {
                        "label": "{no title} [Type: , ID: 18]",
                        "value": "18"
                    }, {
                        "label": "{no title} [Type: , ID: 19]",
                        "value": "19"
                    }, {
                        "label": "{no title} [Type: , ID: 20]",
                        "value": "20"
                    }, {
                        "label": "{no title} [Type: , ID: 21]",
                        "value": "21"
                    }, {
                        "label": "{no title} [Type: , ID: 22]",
                        "value": "22"
                    }, {
                        "label": "{no title} [Type: , ID: 23]",
                        "value": "23"
                    }, {
                        "label": "{no title} [Type: , ID: 24]",
                        "value": "24"
                    }, {
                        "label": "{no title} [Type: , ID: 25]",
                        "value": "25"
                    }, {
                        "label": "{no title} [Type: , ID: 26]",
                        "value": "26"
                    }
                    ],
                    "widget": "child_block",
                    "child_block_type": "inception"
                }
            },
            "fields_list": ["inception"]
        },
        "link": {
            "code": "link",
            "name": "Link",
            "icon": "<i class=\"fa fa-link\"><\/i>",
            "color": "#fdfd96",
            "color_theme": "dark",
            "contentType": "",
            "group": "general",
            "fields": {
                "link_title": {
                    "attribute_id": "151",
                    "code": "link_title",
                    "type": "text",
                    "label": "Title",
                    "is_global": "0",
                    "group": "General",
                    "required": true
                },
                "link_href": {
                    "attribute_id": "152",
                    "code": "link_href",
                    "type": "text",
                    "label": "Link Href",
                    "is_global": "0",
                    "group": "General",
                    "required": true
                }
            },
            "fields_list": ["link_title", "link_href"]
        },
        "links": {
            "code": "links",
            "name": "Links",
            "icon": "<i class=\"fa fa-anchor\"><\/i>",
            "color": "#e3fd96",
            "color_theme": "dark",
            "contentType": "",
            "group": "general",
            "fields": {
                "links": {
                    "attribute_id": "153",
                    "code": "links",
                    "type": "widget",
                    "label": "Links",
                    "is_global": "0",
                    "group": "General",
                    "options": [{
                        "label": "{no title} [Type: , ID: 11]",
                        "value": "11"
                    }, {
                        "label": "{no title} [Type: , ID: 12]",
                        "value": "12"
                    }
                    ],
                    "widget": "child_block",
                    "child_block_type": "link"
                }
            },
            "fields_list": ["links"]
        },
        "heading_list": {
            "code": "heading_list",
            "name": "Heading List",
            "icon": "<i class=\"fa fa-header\"><\/i>",
            "color": "#779ecb",
            "color_theme": "light",
            "contentType": "",
            "group": "general",
            "fields": {
                "heading_list": {
                    "attribute_id": "154",
                    "code": "heading_list",
                    "type": "widget",
                    "label": "Headings",
                    "is_global": "0",
                    "group": "General",
                    "options": [{
                        "label": "{no title} [Type: , ID: 1]",
                        "value": "1"
                    }, {
                        "label": "{no title} [Type: , ID: 5]",
                        "value": "5"
                    }, {
                        "label": "{no title} [Type: , ID: 6]",
                        "value": "6"
                    }, {
                        "label": "{no title} [Type: , ID: 10]",
                        "value": "10"
                    }, {
                        "label": "Text here [Type: , ID: 27]",
                        "value": "27"
                    }, {
                        "label": "Heading 2 [Type: , ID: 28]",
                        "value": "28"
                    }, {
                        "label": "Heading 1 [Type: , ID: 29]",
                        "value": "29"
                    }, {
                        "label": "Testing the title  [Type: , ID: 38]",
                        "value": "38"
                    }, {
                        "label": "Awesome Blog POst [Type: , ID: 40]",
                        "value": "40"
                    }, {
                        "label": "bnvbnbn [Type: , ID: 53]",
                        "value": "53"
                    }, {
                        "label": "jhgjhhjjhg [Type: , ID: 54]",
                        "value": "54"
                    }, {
                        "label": "jkhjkj [Type: , ID: 56]",
                        "value": "56"
                    }, {
                        "label": "Testing [Type: , ID: 58]",
                        "value": "58"
                    }, {
                        "label": "Lemons [Type: , ID: 62]",
                        "value": "62"
                    }, {
                        "label": "Brand new heading [Type: , ID: 63]",
                        "value": "63"
                    }, {
                        "label": "Testing another heading  [Type: , ID: 74]",
                        "value": "74"
                    }
                    ],
                    "widget": "child_block",
                    "child_block_type": "heading"
                }
            },
            "fields_list": ["heading_list"]
        },
        "accordion_item": {
            "code": "accordion_item",
            "name": "Accordion Item",
            "icon": "<i class=\"fa fa-paragraph\"><\/i>",
            "color": "#d7618d",
            "color_theme": "light",
            "contentType": "",
            "group": "general",
            "fields": {
                "title": {
                    "attribute_id": "132",
                    "code": "title",
                    "type": "text",
                    "label": "Title",
                    "is_global": "0",
                    "group": "General",
                    "required": true
                },
                "textarea": {
                    "attribute_id": "156",
                    "code": "textarea",
                    "type": "widget",
                    "label": "Textarea",
                    "is_global": "0",
                    "group": "General",
                    "widget": "wysiwyg"
                },
                "open_on_load": {
                    "attribute_id": "157",
                    "code": "open_on_load",
                    "type": "select",
                    "label": "Open on load?",
                    "is_global": "0",
                    "group": "Extra",
                    "options": [{
                        "value": 0,
                        "label": "No"
                    }, {
                        "value": 1,
                        "label": "Yes"
                    }
                    ],
                    "note": "Should the accordion item be open on page load"
                },
                "css_classses": {
                    "attribute_id": "155",
                    "code": "css_classses",
                    "type": "text",
                    "label": "CSS Classes",
                    "is_global": "0",
                    "group": "Advanced"
                }
            },
            "fields_list": ["title", "textarea", "open_on_load", "css_classses"],
            "preview_template": "<div class=\"gene-accordion-outer gene-cms-accordion-item\">\n    <h4 class=\"gene-accordion-link gene-cms-accordion-item-heading no-edit\">{{title}}<\/h4>\n    <div class=\"gene-accordion-inner gene-cms-accordion-item-content\" style=\"display: none;\">\n        {{{textarea}}}\n    <\/div>\n<\/div>"
        },
        "accordion": {
            "code": "accordion",
            "name": "Accordion",
            "icon": "<i class=\"fa fa-list\"><\/i>",
            "color": "#d5135c",
            "color_theme": "light",
            "contentType": "",
            "group": "general",
            "fields": {
                "accordion_items": {
                    "attribute_id": "158",
                    "code": "accordion_items",
                    "type": "widget",
                    "label": "Accordion Items",
                    "is_global": "0",
                    "group": "General",
                    "options": [{
                        "label": "Accordion Item Title 1 [Type: , ID: 31]",
                        "value": "31"
                    }, {
                        "label": "Accordion Item Ladies [Type: , ID: 32]",
                        "value": "32"
                    }, {
                        "label": "accordion 1 [Type: , ID: 42]",
                        "value": "42"
                    }
                    ],
                    "widget": "child_block",
                    "child_block_type": "accordion_item"
                },
                "css_classses": {
                    "attribute_id": "155",
                    "code": "css_classses",
                    "type": "text",
                    "label": "CSS Classes",
                    "is_global": "0",
                    "group": "Advanced"
                }
            },
            "fields_list": ["accordion_items", "css_classses"],
            "preview_template": "<div class=\"gene-cms-accordion gene-cms-accordion-need-init\">\n    {{#child_blocks.accordion_items}}\n        {{{html}}}\n    {{\/child_blocks.accordion_items}}\n<\/div>\n\n<script type=\"text\/javascript\">\n    jQuery(\'.gene-cms-accordion-need-init\').geneAccordion();\n    jQuery(\'.gene-cms-accordion-need-init\').find(\'.gene-accordion-outer\').first().addClass(\'active\');\n    jQuery(\'.gene-cms-accordion-need-init\').find(\'.gene-accordion-inner\').first().css(\'display\', \'\');\n    jQuery(\'.gene-cms-accordion-need-init\').removeClass(\'gene-cms-accordion-need-init\');\n<\/script>"
        },
        "slider_item": {
            "code": "slider_item",
            "name": "Slider Item",
            "icon": "<i class=\"fa fa-picture-o\"><\/i>",
            "color": "#4ed1b7",
            "color_theme": "light",
            "contentType": "",
            "group": "general",
            "fields": {
                "image": {
                    "attribute_id": "150",
                    "code": "image",
                    "type": "widget",
                    "label": "Image",
                    "is_global": "0",
                    "group": "General",
                    "widget": "upload"
                },
                "mobile_image": {
                    "attribute_id": "165",
                    "code": "mobile_image",
                    "type": "widget",
                    "label": "Mobile Image",
                    "is_global": "0",
                    "group": "General",
                    "note": "Replace the default image on smaller devices",
                    "widget": "upload"
                },
                "alt_tag": {
                    "attribute_id": "166",
                    "code": "alt_tag",
                    "type": "text",
                    "label": "Alternative Text",
                    "is_global": "0",
                    "group": "SEO"
                },
                "title_tag": {
                    "attribute_id": "167",
                    "code": "title_tag",
                    "type": "text",
                    "label": "Title Tag",
                    "is_global": "0",
                    "group": "SEO"
                },
                "css_classses": {
                    "attribute_id": "155",
                    "code": "css_classses",
                    "type": "text",
                    "label": "CSS Classes",
                    "is_global": "0",
                    "group": "Advanced"
                }
            },
            "fields_list": ["image", "mobile_image", "alt_tag", "title_tag", "css_classses"],
            "preview_template": "<div class=\"gene-cms-slider-item\">\n    <img src=\"\/media\/gene-cms\/{{ image }}\" \/>\n<\/div>\n"
        },
        "product_list": {
            "code": "product_list",
            "name": "Product List",
            "icon": "<i class=\"fa fa-th\"><\/i>",
            "color": "#24bb6b",
            "color_theme": "light",
            "contentType": "",
            "group": "general",
            "fields": {
                "category_id": {
                    "attribute_id": "169",
                    "code": "category_id",
                    "type": "text",
                    "label": "Category ID",
                    "is_global": "0",
                    "group": "General"
                },
                "sku_list": {
                    "attribute_id": "171",
                    "code": "sku_list",
                    "type": "widget",
                    "label": "Sku List",
                    "is_global": "0",
                    "group": "General",
                    "note": "List of Product SKUs, Leave blank to use category ID",
                    "widget": "tags"
                },
                "hide_out_of_stock": {
                    "attribute_id": "172",
                    "code": "hide_out_of_stock",
                    "type": "select",
                    "label": "Hide out of stock products",
                    "is_global": "0",
                    "group": "General",
                    "options": [{
                        "value": 0,
                        "label": "No"
                    }, {
                        "value": 1,
                        "label": "Yes"
                    }
                    ]
                },
                "css_classses": {
                    "attribute_id": "155",
                    "code": "css_classses",
                    "type": "text",
                    "label": "CSS Classes",
                    "is_global": "0",
                    "group": "Advanced"
                }
            },
            "fields_list": ["category_id", "sku_list", "hide_out_of_stock", "css_classses"]
        },
        "html": {
            "code": "html",
            "name": "HTML",
            "icon": "<i class=\"fa fa-code\"><\/i>",
            "color": "#000000",
            "color_theme": "light",
            "contentType": "",
            "group": "general",
            "fields": {
                "html": {
                    "attribute_id": "174",
                    "code": "html",
                    "type": "textarea",
                    "label": "HTML",
                    "is_global": "0",
                    "group": "General"
                }
            },
            "fields_list": ["html"]
        },
        "product": {
            "code": "product",
            "name": "Product",
            "icon": "<i class=\"fa fa-product-hunt\"><\/i>",
            "color": "#66CCFF",
            "color_theme": "light",
            "contentType": "",
            "group": "general",
            "fields": {
                "product_id": {
                    "attribute_id": "175",
                    "code": "product_id",
                    "type": "widget",
                    "label": "Product",
                    "is_global": "0",
                    "group": "General",
                    "data_model": true,
                    "widget": "search\/product"
                },
                "css_classses": {
                    "attribute_id": "155",
                    "code": "css_classses",
                    "type": "text",
                    "label": "CSS Classes",
                    "is_global": "0",
                    "group": "Advanced"
                }
            },
            "fields_list": ["product_id", "css_classses"],
            "preview_template": "<div class=\"gene-cms-product\">\n    <img src=\"{{ product_id.image }}\" class=\"gene-cms-product-image\"\/>\n    <h3 class=\"gene-cms-product-name\">{{ product_id.name }}<\/h3>\n    <p class=\"gene-cms-product-sku\">{{ product_id.sku }}<\/p>\n    <p class=\"gene-cms-product-price\">{{ product_id.price }}<\/p>\n<\/div>"
        },
        "textarea": {
            "code": "textarea",
            "name": "Textarea",
            "icon": "<i class=\"fa fa-font\"><\/i>",
            "color": "#c64545",
            "color_theme": "light",
            "contentType": "",
            "group": "general",
            "fields": {
                "textarea": {
                    "attribute_id": "156",
                    "code": "textarea",
                    "type": "widget",
                    "label": "Textarea",
                    "is_global": "0",
                    "group": "General",
                    "widget": "wysiwyg"
                }
            },
            "fields_list": ["textarea"],
            "preview_template": "<div class=\"gene-cms-textarea\">\n    {{{ textarea }}}\n<\/div>"
        }
    },
    "structural": {
        "row": {
            "icon": "",
            "name": "Row",
            "color": "#a5a5a5",
            "fields": {
                "template": {
                    "label": "Template",
                    "type": "select",
                    "code": "template",
                    "options": [{
                        "label": "Full Width",
                        "value": "full-width.phtml"
                    }, {
                        "label": "Default",
                        "value": "default.phtml"
                    }
                    ]
                },
                "background_color": {
                    "label": "Background Color",
                    "type": "widget",
                    "widget": "color",
                    "code": "background_color"
                },
                "background_image": {
                    "label": "Background Image",
                    "type": "widget",
                    "widget": "upload",
                    "code": "background_image"
                },
                "css_classes": {
                    "group": "Advanced",
                    "label": "CSS Classes",
                    "type": "widget",
                    "widget": "tags",
                    "code": "css_classes"
                }
            }
        },
        "column": {
            "icon": "",
            "name": "Column",
            "color": "#858585",
            "fields": {
                "remove_padding": {
                    "group": "Advanced",
                    "label": "Remove Padding",
                    "type": "select",
                    "code": "remove_padding",
                    "options": [{
                        "value": 1,
                        "label": "Yes"
                    }, {
                        "value": 0,
                        "label": "No"
                    }
                    ]
                },
                "css_classes": {
                    "group": "Advanced",
                    "label": "CSS Classes",
                    "type": "text",
                    "code": "css_classes"
                }
            }
        }
    }
}

');
    }
}