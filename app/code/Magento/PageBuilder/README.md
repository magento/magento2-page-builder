# Magento_PageBuilder module

The Magento_PageBuilder module provides an alternative interface for building content.

## Disable the module

You can disable the PageBuilder module for a specific field by adding the following entry to a field configuration in an XML configuration file:

```
<item name="wysiwygConfigData" xsi:type="array">
    <item name="enable_pagebuilder" xsi:type="boolean">false</item>
</item>
```

### Example

The following example disables the PageBuilder editor for the content field.

```
<form xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Ui:etc/ui_configuration.xsd">
    <fieldset name="content" sortOrder="10">
        <field name="content" formElement="wysiwyg">
            <argument name="data" xsi:type="array">
                <item name="config" xsi:type="array">
                    <item name="source" xsi:type="string">page</item>
                    <item name="wysiwygConfigData" xsi:type="array">
                        <item name="enable_pagebuilder" xsi:type="boolean">false</item>
                    </item>
                </item>
            </argument>
        </field>
    </fieldset>
</form>
```
