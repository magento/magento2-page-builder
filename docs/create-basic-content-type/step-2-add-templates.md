# Step 2: Add templates

***
The development of this tutorial is currently **IN PROGRESS**.

***

Content type templates are the HTML files (fragments) that define how your content type *appears* on both the Admin stage and on a storefront page. In Page Builder this is called an `appearance`, as discussed in the previous configuration step.

Each `appearance` is defined by exactly two HTML template files: `preview.html` and `master.html`. For example, if you look at the template files for the Page Builder Banner, you see a set of these templates defined for each of Banner's four appearances:

![BannerBlockTemplateSets](../images/BannerBlockTemplateSets.png)

In contrast, the Block content type only has one `appearance`, so it defines it as the default with one set of master-preview template files.

## Conventions

Conventions for adding content type templates are as follows:

- Page Builder requires at least one `appearance` (two HTML templates) for every content type:  `preview.html` for the Admin stage, `master.html` for the storefront page. If your content type has only one appearance (like the Block), then it only needs these two templates.  

- Page Builder requires the names of your templates to be `preview` and `master`.

Content types cannot be rendered without these templates, so add them to your module (they can be blank initially) within the following directory structure (`view/adminhtml/web/template/content-type/<content-type-name>/default/`):

![Create config file](../images/step2-add-templates.png)

As mentioned, these files can be empty initially; they just need to exist in their proper location within your module.

## Configuration

In your configuration file, you need to reference your templates within the `<appearance>` element as follows:

```xml
<appearances>
  <appearance name="default"
              default="true"
              preview_template="Vendor_Module/content-type/quote/default/preview"
              render_template="Vendor_Module/content-type/quote/default/master"
              reader="Magento_PageBuilder/js/master-format/read/configurable">
    <elements...>
  </appearance>
</appearances>
```

| Attribute        | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| `preview_template` | References the`preview.html` template for rendering the preview appearance of your content type on the stage within the Admin UI. |
| `render_template`  | References the `master.html`  template for rendering the appearance of your content type on the storefront for customers to see. |



# **STOP Reviewing Here**



## Create the `preview.html` template



1. Create the `preview.html` file (as noted above) using the example content that follows.

    ```html
    <!--preview.html-->
    <div attr="data.main.attributes" ko-style="data.main.style" class="pagebuilder-content-type" css="data.main.css" event="{ mouseover: onMouseOver, mouseout: onMouseOut }, mouseoverBubble: false">
      <render args="getOptions().template" />
      <blockquote attr="data.quote.attributes" ko-style="data.quote.style" css="data.quote.css" data-bind="liveEdit: { field: 'quote_text', placeholder: $t('Enter Quote') }"></blockquote>
      <div class="quote-author" attr="data.author.attributes" ko-style="data.author.style" css="data.author.css" data-bind="liveEdit: { field: 'quote_author', placeholder: $t('Enter Author') }"></div>
      <div class="quote-title" attr="data.author_title.attributes" ko-style="data.author_title.style" css="data.author_title.css" data-bind="liveEdit: { field: 'quote_author_desc', placeholder: $t('Enter Description') }"></div>
    </div>
    ```

2. Flush your config cache `bin/magento cache:flush config` and view Page Builder from the Home Page editor (as a convenience for storefront viewing later). The Page Builder panel menu should show your content type at the top of the layout group:

   ![Page Builder Panel Config](../images/create-config-file-1.png) 

3. Drag your new content type onto the stage and **Save**. You should see something similar to this:

    ![Admin preview.html template](../images/drag-content-type-to-stage.png) 

    Notice that you also have an options menu when you hover over your content type. This is provided by including the `<render args="getOptions().template" />` within your `preview.html` template. See [Option menu configurations](../configurations/option-menu-configurations.md) for more details.

## Create the `master_template`

```html
<!--master.html-->
<h2 attr="data.main.attributes" 
    ko-style="data.main.style" 
    css="data.main.css" 
    html="data.main.html">
</h2>
```