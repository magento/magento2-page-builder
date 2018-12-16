# Step 4: Add form

***
The development of this tutorial is currently **IN PROGRESS**.

***

Page Builder provides an editor that slides out from the right of the screen within the Admin UI to give you a way to add content and customize the appearance of your content type, as shown in the screen shot. To use and customize this editor for your needs, you need to create a UI component form along with the layout to display that form.

![Create config file](../images/content-type-editor.png)



## Form conventions

Add the layout and form to your module as shown here:

- `view/adminhtml/web/layout/`
- `view/adminhtml/web/ui-component/`

![Create config file](../images/step4-add-form.png)



## Form configuration

In your configuration file, reference your UI component form as shown here within the `<type>` element:

```xml
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/content_type.xsd">
  <type name="example_quote"
        label="Quote"
        form="pagebuilder_example_quote_form"
        ...
```

| Attribute | Description                                                  |
| --------- | ------------------------------------------------------------ |
| `form`      | `pagebuilder_example_form.xml` - UI component form that provides the editor for your content type. |

## Quote form

Our Quote form extends `pagebuilder_base_form` to provide form controls for editing our content type. The form XML is shown in full here, followed by descriptions of the key parts.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<form xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Ui:etc/ui_configuration.xsd" extends="pagebuilder_base_form">
  <argument name="data" xsi:type="array">
    <item name="js_config" xsi:type="array">
      <item name="provider" xsi:type="string">pagebuilder_example_form.pagebuilder_example_form_data_source</item>
    </item>
    <item name="label" xsi:type="string" translate="true">Heading</item>
  </argument>
  <settings>
    <deps>
      <dep>pagebuilder_example_form.pagebuilder_example_form_data_source</dep>
    </deps>
  </settings>
  <dataSource name="pagebuilder_example_form_data_source">
    <argument name="data" xsi:type="array">
      <item name="js_config" xsi:type="array">
        <item name="component" xsi:type="string">Magento_PageBuilder/js/form/provider</item>
      </item>
    </argument>
    <dataProvider name="pagebuilder_example_form_data_source" class="Magento\PageBuilder\Model\ContentType\DataProvider">
      <settings>
        <requestFieldName/>
        <primaryFieldName/>
      </settings>
    </dataProvider>
  </dataSource>
  <fieldset name="appearance_fieldset" component="Magento_PageBuilder/js/form/element/dependent-fieldset">
    <settings>
      <label translate="true">Appearance</label>
      <additionalClasses>
        <class name="admin__fieldset-visual-select-large">true</class>
      </additionalClasses>
      <collapsible>false</collapsible>
      <opened>true</opened>
      <imports>
        <link name="hideFieldset">${$.name}.appearance:options</link>
        <link name="hideLabel">${$.name}.appearance:options</link>
      </imports>
    </settings>
    <field name="appearance" formElement="select" sortOrder="10" component="Magento_PageBuilder/js/form/element/dependent-visual-select">
      <argument name="data" xsi:type="array">
        <item name="config" xsi:type="array">
          <item name="default" xsi:type="string">default</item>
        </item>
      </argument>
      <settings>
        <additionalClasses>
          <class name="admin__field-wide">true</class>
          <class name="admin__field-visual-select-container">true</class>
        </additionalClasses>
        <dataType>text</dataType>
        <validation>
          <rule name="required-entry" xsi:type="boolean">true</rule>
        </validation>
        <elementTmpl>Magento_PageBuilder/form/element/visual-select</elementTmpl>
      </settings>
      <formElements>
        <select>
          <settings>
            <options class="AppearanceSourceHeading"/>
          </settings>
        </select>
      </formElements>
    </field>
  </fieldset>
  <fieldset name="general" sortOrder="20">
    <settings>
      <label/>
    </settings>
    <field name="heading_type" sortOrder="10" formElement="select">
      <argument name="data" xsi:type="array">
        <item name="config" xsi:type="array">
          <item name="source" xsi:type="string">page</item>
          <item name="default" xsi:type="string">h2</item>
        </item>
      </argument>
      <settings>
        <label translate="true">Heading Type</label>
        <dataType>text</dataType>
        <dataScope>heading_type</dataScope>
      </settings>
      <formElements>
        <select>
          <settings>
            <options>
              <option name="h1" xsi:type="array">
                <item name="value" xsi:type="string">h1</item>
                <item name="label" xsi:type="string" translate="false">H1</item>
              </option>
              <option name="h2" xsi:type="array">
                <item name="value" xsi:type="string">h2</item>
                <item name="label" xsi:type="string" translate="false">H2</item>
              </option>
              <option name="h3" xsi:type="array">
                <item name="value" xsi:type="string">h3</item>
                <item name="label" xsi:type="string" translate="false">H3</item>
              </option>
              <option name="h4" xsi:type="array">
                <item name="value" xsi:type="string">h4</item>
                <item name="label" xsi:type="string" translate="false">H4</item>
              </option>
              <option name="h5" xsi:type="array">
                <item name="value" xsi:type="string">h5</item>
                <item name="label" xsi:type="string" translate="false">H5</item>
              </option>
              <option name="h6" xsi:type="array">
                <item name="value" xsi:type="string">h6</item>
                <item name="label" xsi:type="string" translate="false">H6</item>
              </option>
            </options>
          </settings>
        </select>
      </formElements>
    </field>
    <field name="heading_text" sortOrder="20" formElement="input">
      <argument name="data" xsi:type="array">
        <item name="config" xsi:type="array">
          <item name="source" xsi:type="string">page</item>
        </item>
      </argument>
      <settings>
        <dataScope>example_text</dataScope>
        <dataType>text</dataType>
        <label translate="true">Example Text</label>
      </settings>
    </field>
  </fieldset>
  <fieldset name="advanced">
    <field name="margins_and_padding">
      <argument name="data" xsi:type="array">
        <item name="config" xsi:type="array">
          <item name="default" xsi:type="null"/>
        </item>
      </argument>
    </field>
  </fieldset>
</form>
```



Discuss the extending of forms `extends="pagebuilder_base_form"` and the other form with more stuff.

## Quote form layout

The layout for our Quote form is shown here in full:

```xml
<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" layout="admin-1column" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <update handle="styles"/>
    <body>
        <referenceContainer name="content">
            <uiComponent name="pagebuilder_example_quote_form"/>
        </referenceContainer>
    </body>
</page>
```

This is a standard UI component form layout. For more information, see [ui component reference].

