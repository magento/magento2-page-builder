# Step 1: Add configuration

Creating a configuration file is the first step to creating a new content type. Through the configuration file, you can specify things like the label, location, and icon of your content type within the Page Builder panel menu. You can specify where your content type can be dropped on the stage, and reference the many other files you will use to control the appearance and behavior your content type.

## Create the configuration file

1. Create a new XML file in the following directory structure of your module: `view/adminhtml/pagebuilder/content_type/my-content-type.xml`. 

2. Copy the contents of this example into your `my-content-type.xml` file:
    ``` xml
    <?xml version="1.0"?>
    <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/content_type.xsd">
        <type name="my-content-type"
              label="My Content Type"
              group="layout"
              component="Magento_PageBuilder/js/content-type-collection"
              preview_component="Magento_PageBuilder/js/content-type/preview"
              master_component="Magento_PageBuilder/js/content-type/master"
              form=""
              icon=""
              sortOrder="-1"
              is_hideable="true"
              translate="label">
            <appearances>
                <appearance name="default"
                            default="true"
                            preview_template="Vendor_Module/content-type/my-content-type/default/preview"
                            render_template="Vendor_Module/content-type/my-content-type/default/master"
                            reader="Magento_PageBuilder/js/master-format/read/configurable">
                    <elements>
                        <element name="main">
                            <attribute name="name" source="data-role"/>
                            <attribute name="appearance" source="data-appearance"/>
                        </element>
                    </elements>
                </appearance>
            </appearances>
        </type>
    </config>
    ```

3. Create the required `preview_template` and `render_template` as specified in the configuration file.

    Before seeing the results of our configuration in the Page Builder panel menu, we need to create the two templates specified in the <appearance> element of the configuration file: 
    * preview.html - to display our content type within the Admin UI. 
    * master.html - to display our content type within the CMS page on the storefront. 

    Both templates are required. So for now, just create the files within the following directory structure, `view/adminhtml/web/template/content_type/my-content-type/default/`, using the example content that follows. We will discuss them in detail later:
    
    ```html
    <!--preview.html-->
    <div class="pagebuilder-content-type" event="{ mouseover: onMouseOver, mouseout: onMouseOut }, mouseoverBubble: false">
        <render args="getOptions().template" />
        <div attr="data.main.attributes" css="data.main.css" ko-style="data.main.style">
            <div style="width: 100%; height: 100px; background-color: #f1f1f1; padding: 20px;">Admin template</div>
        </div>
    </div>
    ```
    
    ```html
    <!--master.html-->
    <div class="pagebuilder-content-type" event="{ mouseover: onMouseOver, mouseout: onMouseOut }, mouseoverBubble: false">
        <render args="getOptions().template" />
        <div attr="data.main.attributes" css="data.main.css" ko-style="data.main.style">
            <div style="width: 100%; height: 100px; background-color: #f1f1f1; padding: 20px;">Admin template</div>
        </div>
    </div>
    ```

4. Flush your config cache `bin/magento cache:flush config` and view Page Builder from the Home Page editor (as a convenience for storefront viewing later). The Page Builder panel menu should show your content type at the top of the layout group:
   
   ![Page Builder Panel Config](../images/create-config-file-1.png) 
   
