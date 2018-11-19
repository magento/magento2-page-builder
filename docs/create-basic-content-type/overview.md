# Overview

Out of the box, Page Builder comes with several content types (controls) that you can drag onto the stage to build your storefront pages, as shown below. In this topic, you will learn how to create your own content type for use within Page Builder.

![Page Builder Content Types](../images/panel-horizontal.png)

## Prerequisites
{:.tutorial-before}

Page Builder creates content types from modules. So this topic assumes you have a basic module structure in which to add your content type files.

![Minimum module structure](../images/module-minimum-structure.png)

## Overview

An overview of the steps for creating a Page Builder content type are briefly illustrated and described here.

![Creating Custom Content Types](../images/content-type-overview.png)

1. **Add configuration**: an XML file to setup all the other files that control the appearances and behaviors of your content type.  
2. **Add templates**: HTML files to control the appearance of your content types on the Admin stage (preview.html) and the storefront (master.html).
3. **Add component**: a JavaScript file to control the behavior of your content type on the Admin stage (preview.js) and the storefront (master.js).
4. **Add form (editor)**: a UI component (XML file) to give users the ability to add or edit content using your content type.
5. **Add layout**: an XML file to add your form editor to the stage. 
6. **Add styles and icons**: LESS and image files (png, svg) to add specific styling and images to your content types as they appear on the Admin stage and the storefront. 
7. **Add frontend widget**: a JavaScript file to control the UI behavior (user interactivity) of your content type on the storefront.  

## Content type files

The files you will need to create in order to build a basic content type are shown here.

![Before and after content type](../images/content-type-files.png)

This tutorial walks you through creating these files, step by step.