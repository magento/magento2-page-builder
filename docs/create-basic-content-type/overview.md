# Introduction

***
The development of this tutorial is currently **IN PROGRESS**.

***

Page Builder comes with 16 content types (controls) you can use to build your storefront pages. In this tutorial, you will add a new content type: a Quote control, which you can use to show customer testimonials or other quotations on a page.

![Page Builder Content Types](../images/panel-horizontal.png)

## Prerequisites

Page Builder creates content types from a module with UI components. This tutorial assumes you have a basic module structure (as follows) in which to add your content type files.

![Minimum module structure](../images/module-minimum-structure.png)

## Overview

![Creating Custom Content Types](../images/content-type-overview.png)

1. **Add configuration**: Create an XML file to define your content type and reference the other files that control the appearances and behaviors of your content type.  
2. **Add templates**: Create HTML templates that define the appearance of your content types on the Admin stage (preview.html) and the storefront (master.html).
3. **Add component**: Create a JavaScript file that defines the behavior of your content type on the Admin stage (preview.js) and the storefront (master.js).
4. **Add form**: Create a UI component form and a layout so users can edit your content type within the Page Builder editor.
5. **Add styles**: Create LESS files to style your content types when rendered in the Admin UI and on the storefront. 
6. **Add frontend widget**: Create a JavaScript file to control the UI behavior (user interactivity) of your content type on the storefront.  

## Content type files

The files you will need to create in order to build a basic content type are shown here.

![Before and after content type](../images/content-type-files.png)

## Next
[Step 1: Add configuration](step-1-add-configuration.md). 
