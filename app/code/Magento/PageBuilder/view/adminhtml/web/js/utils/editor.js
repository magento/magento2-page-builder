/*eslint-disable */
/* jscs:disable */
define(["jquery", "mageUtils", "Magento_PageBuilder/js/config"], function (_jquery, _mageUtils, _config) {
  /**
   * Is the inline WYSIWYG supported?
   */
  function isWysiwygSupported() {
    return _config.getConfig("can_use_inline_editing_on_stage");
  }
  /**
   * Encode content for TinyMCE
   *
   * @param content
   */


  function encodeContent(content) {
    if (isWysiwygSupported()) {
      return convertVariablesToHtmlPreview(convertWidgetsToHtmlPreview(content));
    }

    return content;
  }
  /**
   * Convert all variables to their HTML preview counterparts
   *
   * Re-implements logic from lib/web/mage/adminhtml/wysiwyg/tiny_mce/plugins/magentovariable/editor_plugin.js to parse
   * and replace the variables within the content.
   *
   * @param content
   */


  function convertVariablesToHtmlPreview(content) {
    var config = _config.getConfig("tinymce").variables;

    var magentoVariables = JSON.parse(config.placeholders);
    return content.replace(/{\{\s?(?:customVar code=|config path=\")([^\}\"]+)[\"]?\s?\}\}/ig, function (match, path) {
      var placeholder = document.createElement("span");
      placeholder.id = btoa(path).replace(/\+/g, ":").replace(/\//g, "_").replace(/=/g, "-");
      placeholder.classList.add("magento-variable");
      placeholder.classList.add("magento-placeholder");
      placeholder.classList.add("mceNonEditable");

      if (magentoVariables[path].variable_type === "custom") {
        placeholder.classList.add("magento-custom-var");
      }

      var variableType = magentoVariables[path].variable_type;

      if (magentoVariables[path] && (variableType === "default" || variableType === "custom")) {
        placeholder.textContent = magentoVariables[path].variable_name;
      } else {
        // If we're unable to find the placeholder we need to attach an error class
        placeholder.classList.add("magento-placeholder-error");
        placeholder.textContent = variableType === "custom" ? path : "Not Found";
      }

      return placeholder.outerHTML;
    });
  }
  /**
   * Convert widgets within content to their HTML counterparts
   *
   * @param content
   */


  function convertWidgetsToHtmlPreview(content) {
    var config = _config.getConfig("tinymce").widgets;

    return content.replace(/\{\{widget(.*?)\}\}/ig, function (match, widgetBody) {
      var attributes = parseAttributesString(widgetBody);
      var imageSrc;

      if (attributes.type) {
        var placeholder = document.createElement("span");
        placeholder.id = _mageUtils.uniqueid();
        placeholder.contentEditable = "false";
        placeholder.classList.add("magento-widget");
        placeholder.classList.add("magento-placeholder");
        placeholder.classList.add("mceNonEditable");
        attributes.type = attributes.type.replace(/\\\\/g, "\\");
        imageSrc = config.placeholders[attributes.type];

        if (!imageSrc) {
          imageSrc = config.error_image_url;
          placeholder.classList.add("magento-placeholder-error");
        }

        var image = document.createElement("img");
        image.id = btoa(match).replace(/\+/g, ":").replace(/\//g, "_").replace(/=/g, "-");
        image.src = imageSrc;
        placeholder.appendChild(image);
        var widgetType = "";

        if (config.types[attributes.type]) {
          widgetType += config.types[attributes.type];
        }

        var text = document.createTextNode(widgetType);
        placeholder.appendChild(text);
        return placeholder.outerHTML;
      }
    });
  }
  /**
   * Parse attributes into a string
   *
   * @param attributes
   */


  function parseAttributesString(attributes) {
    var result = {};
    attributes.replace(/(\w+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g, function (match, key, value) {
      result[key] = value.replace(/&quote;/g, "\"");
      return "";
    });
    return result;
  }
  /**
   * Lock all image sizes before initializing TinyMCE to avoid content jumps
   *
   * @param element
   */


  function lockImageSize(element) {
    [].slice.call(element.querySelectorAll("img")).forEach(function (image) {
      image.style.width = image.width + "px";
      image.style.height = image.height + "px";
    });
  }
  /**
   * Reverse forced image size after TinyMCE is finished initializing
   *
   * @param element
   */


  function unlockImageSize(element) {
    [].slice.call(element.querySelectorAll("img")).forEach(function (image) {
      image.style.width = null;
      image.style.height = null;
    });
  }
  /**
   * Create a bookmark within the content to be restored later
   */


  function createBookmark(event) {
    var wrapperElement = (0, _jquery)(event.target).parents(".inline-wysiwyg"); // Handle direct clicks onto an IMG

    if (event.target.nodeName === "IMG") {
      return {
        name: event.target.nodeName,
        index: findNodeIndex(wrapperElement[0], event.target.nodeName, event.target)
      };
    }

    if (window.getSelection) {
      var selection = window.getSelection();

      var _id = _mageUtils.uniqueid();

      if (selection.getRangeAt && selection.rangeCount) {
        var range = normalizeTableCellSelection(selection.getRangeAt(0).cloneRange());
        var node = range.startContainer.parentNode;

        if (node.nodeName === "IMG" || node.nodeName === "SPAN" && node.classList.contains("magento-placeholder")) {
          return {
            name: node.nodeName,
            index: findNodeIndex(wrapperElement[0], node.nodeName, node)
          };
        }

        if (!range.collapsed) {
          range.collapse(false);
          var endBookmarkNode = createBookmarkSpan(_id + "_end");
          range.insertNode(endBookmarkNode);
        }

        var range2 = normalizeTableCellSelection(selection.getRangeAt(0));
        range2.collapse(true);
        var startBookmarkNode = createBookmarkSpan(_id + "_start");
        range2.insertNode(startBookmarkNode);
        return {
          id: _id
        };
      }
    }

    return null;
  }
  /**
   * Move the cursor to our new bookmark
   *
   * @param bookmark
   */


  function moveToBookmark(bookmark) {
    window.tinymce.activeEditor.selection.moveToBookmark(bookmark);
  }
  /**
   * Create a bookmark span for the selection
   *
   * @param id
   */


  function createBookmarkSpan(id) {
    var bookmark = document.createElement("span");
    bookmark.setAttribute("data-mce-type", "bookmark");
    bookmark.id = id;
    bookmark.style.overflow = "hidden";
    bookmark.style.lineHeight = "0px";
    return bookmark;
  }
  /**
   * Find the index of an element within a wrapper
   *
   * @param wrapperElement
   * @param name
   * @param element
   */


  function findNodeIndex(wrapperElement, name, element) {
    var selector = name.toLowerCase() + ':not([data-mce-bogus="all"])'; // If there is no ID on the element add a unique ID so we can efficiently find it

    if (!element.id) {
      element.id = _mageUtils.uniqueid();
    }

    return (0, _jquery)(wrapperElement).find(selector).toArray().findIndex(function (node) {
      return node.id === element.id;
    });
  }
  /**
   * Get a node by index within a wrapper
   *
   * @param wrapperElement
   * @param name
   * @param index
   */


  function getNodeByIndex(wrapperElement, name, index) {
    var selector = name.toLowerCase() + ':not([data-mce-bogus="all"])';
    return (0, _jquery)(wrapperElement).find(selector).get(index);
  }
  /**
   * Create a double click event that works in all browsers
   */


  function createDoubleClickEvent() {
    try {
      return new MouseEvent("dblclick", {
        view: window,
        bubbles: true,
        cancelable: true
      });
    } catch (e) {
      var dblClickEvent = document.createEvent("MouseEvent");
      dblClickEvent.initMouseEvent("dblclick", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      return dblClickEvent;
    }
  }
  /**
   * Move the end point of a range to handle tables
   *
   * @param range
   * @param start
   */


  function moveEndPoint(range, start) {
    var container;
    var offset;
    var childNodes;

    if (start) {
      container = range.startContainer;
      offset = range.startOffset;
    } else {
      container = range.endContainer;
      offset = range.endOffset;
    }

    if (container.nodeType === Node.ELEMENT_NODE && container.nodeName === "TR") {
      childNodes = container.childNodes;
      container = childNodes[Math.min(start ? offset : offset - 1, childNodes.length - 1)];

      if (container) {
        offset = start ? 0 : container.childNodes.length;

        if (start) {
          range.setStart(container, offset);
        } else {
          range.setEnd(container, offset);
        }
      }
    }
  }
  /**
   * Normalize the table sell selection within a range to better handle selections being inside of tables
   *
   * @param range
   */


  function normalizeTableCellSelection(range) {
    moveEndPoint(range, true);
    moveEndPoint(range, false);
    return range;
  }

  return {
    isWysiwygSupported: isWysiwygSupported,
    encodeContent: encodeContent,
    convertVariablesToHtmlPreview: convertVariablesToHtmlPreview,
    convertWidgetsToHtmlPreview: convertWidgetsToHtmlPreview,
    parseAttributesString: parseAttributesString,
    lockImageSize: lockImageSize,
    unlockImageSize: unlockImageSize,
    createBookmark: createBookmark,
    moveToBookmark: moveToBookmark,
    findNodeIndex: findNodeIndex,
    getNodeByIndex: getNodeByIndex,
    createDoubleClickEvent: createDoubleClickEvent
  };
});
//# sourceMappingURL=editor.js.map