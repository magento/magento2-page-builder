define(function() { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

class XTree {
    constructor(name, attributes, children) {
        this.name = name;
        this.attributes = attributes;
        this.children = children;
    }
}
exports.XTree = XTree;
class Parameter {
    constructor(name) {
        this.name = name;
    }
}
exports.Parameter = Parameter;
class CData {
    constructor(children) {
        this.children = children;
    }
}
exports.CData = CData;
function x(name, attributes, children) {
    if (attributes && Array.isArray(attributes)) {
        children = attributes;
        attributes = null;
    }
    return new XTree(name, attributes || null, children || null);
}
exports.x = x;
function compile(tree, params, opts) {
    opts = Object.assign({
        declaration: true,
        indent: 0,
    }, opts);
    const encode = opts.encode || (s => s);
    const tokens = [];
    flatten(tokens, opts.indent, tree);
    if (opts.declaration) {
        if (!opts.indent) {
            tokens.unshift('\n');
        }
        tokens.unshift('<?xml version="1.0" encoding="UTF-8"?>');
    }
    concat(tokens);
    const args = [null].concat(params.map(p => p.name));
    args.push('return ' + JSON.stringify(encode(tokens[0])) +
        tokens.reduce((lines, token, i) => {
            if (i) {
                lines += ' +\n';
                if (token instanceof Parameter) {
                    lines += token.name;
                }
                else {
                    lines += JSON.stringify(encode(token));
                }
            }
            return lines;
        }, '') +
        ';');
    // variadic constructor shenanigans
    const Factory = Function.bind.apply(Function, args);
    return new Factory();
}
exports.compile = compile;
function param(name) {
    // TODO validate identifier names
    return new Parameter(name);
}
exports.param = param;
exports.cdata = function cdata() {
    return new CData([].slice.call(arguments));
};
function flatten(destination, indent, tree) {
    let prefix = '';
    if (indent > 0) {
        prefix = '\n';
        for (let i = 0; i < indent; i++) {
            prefix += '\t';
        }
        destination.push(prefix);
    }
    destination.push(`<${tree.name}`);
    const keys = tree.attributes && Object.keys(tree.attributes);
    if (keys && keys.length) {
        for (let i = 0; i < keys.length; i++) {
            destination.push(` ${keys[i]}="`);
            let values = tree.attributes[keys[i]];
            if (!Array.isArray(values)) {
                values = [values];
            }
            const before = destination.length;
            for (let j = 0; j < values.length; j++) {
                const value = values[j];
                if (typeof value === 'string' || (value && value instanceof Parameter)) {
                    // TODO string escaping
                    destination.push(values[j]);
                }
            }
            if (before === destination.length) {
                // we didn't push anything get rid of attribute name
                destination.pop();
            }
            else {
                destination.push('"');
            }
        }
    }
    const children = tree.children;
    if (!(children && children.length)) {
        // self closing
        destination.push('/>');
        return;
    }
    destination.push('>');
    let elementChildren = false;
    const before = destination.length;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child instanceof XTree) {
            elementChildren = true;
            flatten(destination, indent + 1, child);
            if (!prefix) {
                // gonna need this now
                prefix = '\n';
            }
        }
        else if (child instanceof CData) {
            destination.push('<![CDATA[');
            for (let j = 0; j < child.children.length; j++) {
                const c = child.children[j];
                if (c && (typeof c === 'string' || c instanceof Parameter)) {
                    destination.push(c);
                }
            }
            destination.push(']]>');
        }
        else if (typeof child === 'string' || (child && child instanceof Parameter)) {
            destination.push(child);
        }
    }
    if (before === destination.length) {
        // change to self closing if we didn't actually push any children
        destination[before - 1] = '/>';
    }
    else {
        if (elementChildren) {
            destination.push(prefix);
        }
        destination.push(`</${tree.name}>`);
    }
}
// concatenates consecutive strings
function concat(items) {
    let i = 1;
    while (i < items.length) {
        const prev = items[i - 1];
        const curr = items[i];
        const isString = typeof curr === 'string';
        if (typeof prev === 'string' && isString) {
            items[i - 1] = prev + curr;
            items.splice(i, 1);
            continue;
        }
        else {
            // skip 2 spots if current thing is not a string
            i += isString ? 1 : 2;
        }
    }
}
/***/ })
/******/ ])});;