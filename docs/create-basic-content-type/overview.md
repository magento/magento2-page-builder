# Content type Overview

Out of the box, Page Builder comes with several content types (controls) that you can drag onto the stage to build your storefront pages, as shown below. In this topic, you will learn how to create your own content type for use within Page Builder.

![Page Builder Content Types](../images/panel-horizontal.png)

## Prerequisites

Page Builder creates content types from modules. So this topic assumes you have a basic module structure in which to add your content type files.

![](../images/module-minimum-structure.png)

## Overview

The steps for creating a Page Builder content type are briefly outlined here. The remainder of this topic describes these steps in detail.

![Creating Custom Content Types](../images/content-type-overview.png)

1. **Add a configuration** as an XML file to setup all the other files that control the appearances and behaviors of your content type.  
2. **Add templates** as HTML files to control the appearance of your content types on the Admin stage (preview.html) and the storefront (master.html).
3. **Add a component** as a JavaScript file to control the behavior of your content type on the Admin stage (preview.js) and the storefront (master.js).
4. **Add an editor** as a UI component (XML file) to give users the ability to add or edit content with your content type.
5. **Add layout** as an XML file to add your editor to the stage. 
6. **Add styles and icons** as LESS and image files (png, svg) to add specific styling and images to your content types as they appear on the Admin stage and the storefront. 
7. **Add frontend widget** as a JavaScript file to control the UI behavior (user interactivity) of your content type on the storefront.  

![Before and after content type](../images/content-type-files.png)

