# How to add a block chooser

This topic describes how to use the block chooser UI component for a custom content type.

## Configuration options

Extends all `abstract` configuration.

`Magento_PageBuilder/js/form/element/block-chooser` configuration options:

<table>
  <tr>
    <th>Option </th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>dataUrlConfigPath</code></td>
    <td>String</td>
    <td>The path inside the Page Builder configuration object that points to the controller URL used to request data for display in the grid. </br>For example, if you use the <code>additional_data</code> configuration feature and add the URL, you could specify <code>content_types.mycontenttype.additional_data.my_cusom_property.my_data_url</code>.</td>
  </tr>
  <tr>
    <td><code>requestParameter</code></td>
    <td>String</td>
    <td>The parameter name under which the selected entity ID will be sent when the component retrieves the metadata from the controller (which is specified by <code>dataUrlConfigPath</code>). </br>The default template is expecting the associated controller to return (at minimum) <code>title</code> and <code>is_active</code>. You can override the component template with the <code>template</code> attribute for the <code>component</code> element, and display desired data using a custom controller.</td>
  </tr>
  <tr>
    <td><code>modalName</code></td>
    <td>String</td>
    <td>The UI registry key to the UI component that is representing the modal containing the <code>pagebuild_block_select_grid</code> listing. </br>For example, if you include the modal element with the name <code>modal</code> in the root of your content type form, you could set it to <code>ns = ${ $.ns }, index = modal</code>.</td>
  </tr>
  <tr>
    <td><code>buttonTitle</code></td>
    <td>String</td>
    <td>The text displayed on the button used to open the block selection modal.</td>
  </tr>
  <tr>
    <td><code>displayMetadata</code></td>
    <td>Boolean</td>
    <td>Denotes whether to display the information grid describing the block in more detail; <code>true</code> by default.</td>
  </tr>
</table>

## Add the block select grid listing modal to content type XML

To add the block select grid listing modal, `pagebuilder_block_select_grid`, to the XML file for a content type, `Magento_PageBuilder/view/base/pagebuilder/content_type/<your-content-type>.xml`:

``` xml
<modal name="modal" sortOrder="30">
    <settings>
        <options>
            <option name="title" xsi:type="string" translate="true">Select Block...</option>
            <option name="buttons" xsi:type="array">
                <item name="0" xsi:type="array">
                    <item name="text" xsi:type="string" translate="true">Cancel</item>
                    <item name="actions" xsi:type="array">
                        <item name="0" xsi:type="string">closeModal</item>
                    </item>
                </item>
                <item name="1" xsi:type="array">
                    <item name="text" xsi:type="string">Add Selected</item>
                    <item name="class" xsi:type="string">action-primary</item>
                    <item name="actions" xsi:type="array">
                        <item name="0" xsi:type="array">
                            <item name="targetName" xsi:type="string">${ $.name }.pagebuilder_block_select_grid</item>
                            <item name="actionName" xsi:type="string">save</item>
                        </item>
                        <item name="1" xsi:type="string">closeModal</item>
                    </item>
                </item>
            </option>
        </options>
    </settings>
    <insertListing name="pagebuilder_block_select_grid" sortOrder="10">
        <settings>
            <externalData>block_id</externalData>
            <externalProvider>${ $.ns }.pagebuilder_block_select_grid_data_source</externalProvider>
            <loading>false</loading>
            <selectionsProvider>${ $.ns }.${ $.ns }.columns.ids</selectionsProvider>
            <autoRender>true</autoRender>
            <dataScope>select_id</dataScope>
            <ns>pagebuilder_block_select_grid</ns>
            <dataLinks>
                <imports>false</imports>
                <exports>true</exports>
            </dataLinks>
        </settings>
    </insertListing>
</modal>
```

If desired, modify the `title` option to fit your situation.

## Add component to content type XML

To insert the block chooser UI component, `Magento_PageBuilder/js/form/element/block-chooser`, into the XML file for a content type, `Magento_PageBuilder/view/base/pagebuilder/content_type/<your-content-type>.xml`:

``` xml
<component component="Magento_PageBuilder/js/form/element/block-chooser" name="block_chooser" sortOrder="10">
    <argument name="data" xsi:type="array">
        <item name="config" xsi:type="array">
            <item name="requestParameter" xsi:type="string">block_id</item>
            <item name="dataUrlConfigPath" xsi:type="string">content_types.block.additional_data.chooserConfig.dataUrl</item>
            <item name="modalName" xsi:type="string">ns = ${ $.ns }, index = modal</item>
            <item name="buttonTitle" xsi:type="string" translate="true">Select Block...</item>
        </item>
    </argument>
    <settings>
        <imports>
            <!-- This references the value of the block_id field below -->
            <link name="id">${ $.ns }.${ $.ns }.general.block_id:value</link>
        </imports>
    </settings>
</component>
<field name="block_id" formElement="hidden" sortOrder="20">
    <settings>
        <dataType>text</dataType>
        <imports>
            <link name="value">${ $.ns }.${ $.ns }.modal.pagebuilder_block_select_grid:externalValue</link>
        </imports>
    </settings>
</field>
```

The `block_id` field pulls in the selected value from the modal.

Then the `block_chooser` component pulls in the value from the `block_id` field to ascertain when it should commence updating.
