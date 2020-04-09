# How to use attributes to apply CSS styling

Attributes in Page Builder give you a way to add a variety of interactive CSS styling options for your content types. For example, Page Builder's Heading content type provides a number of built-in styling options from its form. The Heading form gives users options to set different heading types, text alignments, border properties, margins, and paddings. It also lets users apply multiple static CSS classes.

But what if you want to give users more interactive styling options? For example, maybe you want to add Heading color options. Or Heading text style options. Using attributes is the way to do it.

## Install the example module

To help you get started with using attributes, we created an example module that you can clone and install from [magento-devdocs/PageBuilderStylingWithAttributes](https://github.com/magento-devdocs/PageBuilderStylingWithAttributes). The instructions for installing the module are provided from the README file on the repo.

The example module extends the Heading content type because we wanted to focus on learning about attributes instead of sifting through the the additional code that comes with creating a new custom content type.

The following screenshot shows what the Heading content type form looks like after installing the example module. Specifically, you should see three new Heading fields: `Heading Colors`, `Heading Styles`, and `Heading Opacity`.

![How to add an appearance](../images/heading-extension-using-attributes-and-style.png)

_Extended Heading form with color and text style options using attributes_

The example module provides all the code used here to describe the attribute-based styling. It also provides some "bonus code" that shows how to use a `<style>` node to give users an option for setting Heading text opacity. But wait, that's not all! We also added a custom converter for the opacity style to ensure that users can enter the opacity as a percentage.

## Steps for styling with attributes

This general steps to follow when using attributes to apply CSS styling are shown here, followed by detailed instructions for each step:

![How to style content types using attributes](../images/how-to-style-using-attributes.svg)

_Steps for styling content type elements with attributes_

## Step 1: Add fields for user input

First, you need to add fields to your content type's form so that users have a way of selecting or entering styling options. In our Heading extension example, we add two fields: `heading_color` for selecting a color for the Heading text and `heading_style` for selecting text styles. The XML code for these fields is shown here:

```xml
<!-- pagebuilder_heading_form.xml form extension -->

<?xml version="1.0" encoding="UTF-8"?>
<form xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Ui:etc/ui_configuration.xsd">
    <fieldset name="general">
        <field name="heading_color" sortOrder="25" formElement="select" component="Magento_PageBuilder/js/form/element/visual-select">
            <argument name="data" xsi:type="array">
                <item name="config" xsi:type="array">
                    <item name="default" xsi:type="string">brand-black</item>
                </item>
            </argument>
            <settings>
                <dataType>text</dataType>
                <label translate="true">Heading Colors</label>
                <elementTmpl>Magento_PageBuilder/form/element/visual-select</elementTmpl>
                <notice translate="true">Select from one of the approved Acme brand colors.</notice>
            </settings>
            <formElements>
                <select>
                    <settings>
                        <options class="BrandColorSource"/>
                    </settings>
                </select>
            </formElements>
        </field>
        <field name="heading_style" sortOrder="26" formElement="select" component="Magento_PageBuilder/js/form/element/visual-select">
            <argument name="data" xsi:type="array">
                <item name="config" xsi:type="array">
                    <item name="default" xsi:type="string">style-default</item>
                </item>
            </argument>
            <settings>
                <dataType>text</dataType>
                <label translate="true">Heading Styles</label>
                <elementTmpl>Magento_PageBuilder/form/element/visual-select</elementTmpl>
            </settings>
            <formElements>
                <select>
                    <settings>
                        <options class="TextStyleSource"/>
                    </settings>
                </select>
            </formElements>
        </field>
    </fieldset>
</form>
```

The names of these fields (`heading_color` and `heading_style`) are particularly important because you will use them as the names of your attributes in your content type configuration file in step 2.

_Select fields added to the native Heading form_

## Step 2: Add configuration attributes for field names

Attributes have a `name` and a `source`. The `name` must correspond to the name of the input field in the form. The `source` defines the attribute name that is added to the DOM for targeting your CSS classes. In our Heading extension, we added two `<attributes>` with names corresponding to the previously defined Heading fields (`heading_color` and `heading_style`). The XML code for these attributes is shown here:

```xml
<!-- heading.xml config extension -->

<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/content_type.xsd">
     <type name="heading">
        <appearances>
            <appearance name="default">
                <elements>
                    <element name="main">
                        <attribute name="heading_color" source="data-heading-color"/>
                        <attribute name="heading_style" source="data-heading-style"/>
                    </element>
                </elements>
            </appearance>
        </appearances>
    </type>
</config>
```

_Element attributes for main mapped to the extended Heading form fields_

In this example, the `source` values (`data-heading-color` and `data-heading-style`) are rendered in the DOM for the Heading's main element, as shown here:

```html
<h2 data-content-type="heading" data-appearance="default" data-heading-color="brand-green" data-heading-style="style-italic" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; opacity: 1;">My Heading Text</h2>
```

The values for these attributes are set by the user from the form fields. In this example, the user selected `brand-green` from the `heading_color` selector field and `style-italic` from the `heading_style` selector field. This adds the attributes and their values to the DOM where they can be targeted with CSS classes from our content type's `_default.less` files (from the adminhtml and frontend areas). These classes are created in step 3.

## Step 3: Add attribute-based CSS classes

The CSS styles in your `_default.less` files for both your `adminhtml` and `frontend` areas of your module should be attribute-based as shown here in our extended Heading example:

```scss
/*-- adminhtml _default.less attribute-based classes */
/*-- the frontend  _default.less is the same, but without the .pagebuilder-stage wrapper */

& when (@media-common = true) {
    // Heading Colors
    .pagebuilder-stage {
        [data-heading-color='brand-black'] {
            color: #333333;
        }
        [data-heading-color='brand-blue'] {
            color: #007ab9;
        }
        [data-heading-color='brand-green'] {
            color: #009900;
        }
        [data-heading-color='brand-red'] {
            color: #990000;
        }
        [data-heading-color='brand-purple'] {
            color: #990099;
        }
    }
    // Heading Styles
    [data-heading-style='style-default'] {
        font-weight: normal;
        font-style: normal;
    }
    [data-heading-style='style-bold'] {
        font-weight: bold;
    }
    [data-heading-style='style-italic'] {
        font-style: italic;
    }
    [data-heading-style='style-quotes'] {
        &:before {
            content: '\201C';
        }
        &:after {
            content: '\201D';
        }
    }
}
```

_Attribute-based styles for the config attributes (source)_

Again, the values for these attributes are set by the user in the content type's form fields. This makes it easy to target your content type's elements in the DOM based on what the user selected in the form.

## Step 4: Add Knockout attribute bindings to HTML templates

In order for your attribute selectors to be rendered in the DOM as described in step 2, you must ensure that you add Knockout attributes to your content type's HTML templates. Knockout attribute bindings look like this:

```json
attr="data.main.attributes"
```

The `main` node refers to the element defined in the configuration file and `attributes` refer to all the `<attributes>` defined for the `main` element.

The Knockout `attr` binding ensures that all the attributes defined for an element in your content type's configuration are rendered in the DOM for that element as described in step 2.

These Knockout bindings are applied to the Heading's `master.html` template (as well as the `preview.html` template) as shown here:

```html
<!-- Heading master.html -->

<h1 if="data.main.heading_type() == 'h1'" attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" html="data.main.html"></h1>
<h2 if="data.main.heading_type() == 'h2'" attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" html="data.main.html"></h2>
<h3 if="data.main.heading_type() == 'h3'" attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" html="data.main.html"></h3>
<h4 if="data.main.heading_type() == 'h4'" attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" html="data.main.html"></h4>
<h5 if="data.main.heading_type() == 'h5'" attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" html="data.main.html"></h5>
<h6 if="data.main.heading_type() == 'h6'" attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" html="data.main.html"></h6>
```

_Attribute bindings for Heading's data.main config element_

## Discussion

Page Builder provides three XML configuration nodes you can use to to provide users with styling options for content type elements:

-  `<attribute>` - styles a content type element using an attribute-based CSS class.
-  `<style>` - styles content type elements using specific CSS properties.
-  `<css>` - styles content types using one or more static CSS classes.

The `<attribute>` and `<style>` nodes can be used multiple times within a content type element. But the `<css>` node can only be used once per element. The `<css>` node was designed to be used only once per element because its purpose is to map user-entered CSS classes from the form to the template, where it adds those classes to the `class` attribute in the DOM.

The following code snippet is from Page Builder's native `heading.xml` configuration file (Magento/PageBuilder/view/adminhtml/pagebuilder/content_type/heading.xml), showing multiple `<style>` nodes, two `<attribute>` nodes and one `<css>` node for the `main` element:

```xml
<!-- snippet from heading.xml -->

<element name="main">
    <style name="text_align" source="text_align"/>
    <style name="border" source="border_style" converter="Magento_PageBuilder/js/converter/style/border-style"/>
    <style name="border_color" source="border_color"/>
    <style name="border_width" source="border_width" converter="Magento_PageBuilder/js/converter/style/border-width"/>
    <style name="border_radius" source="border_radius" converter="Magento_PageBuilder/js/converter/style/remove-px"/>
    <style name="display" source="display" converter="Magento_PageBuilder/js/converter/style/display" preview_converter="Magento_PageBuilder/js/converter/style/preview/display"/>
    <style name="margins" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/margins" converter="Magento_PageBuilder/js/converter/style/margins"/>
    <style name="padding" storage_key="margins_and_padding" reader="Magento_PageBuilder/js/property/paddings" converter="Magento_PageBuilder/js/converter/style/paddings"/>
    <attribute name="name" source="data-content-type"/>
    <attribute name="appearance" source="data-appearance"/>
    <tag name="heading_type"/>
    <html name="heading_text" converter="Magento_PageBuilder/js/converter/html/tag-escaper"/>
    <css name="css_classes"/>
</element>
```

### `<style>` nodes

The `<style>` nodes map to the same-named fields defined in the `pagebuilder_base_form.xml`. These nodes define the inline `style` properties added to the Heading's DOM element. Adding a `<style>` node to a config element provides a way to style your content type using a specific CSS property (such as `opacity`) from within the content type's form.

### `<attribute>` nodes

The `<attribute>` nodes map to the same-named fields defined in the `pagebuilder_heading_form.xml`. These nodes define the custom attributes added to the Heading's DOM element. Adding an `<attribute>` node to a config element provides a way to style your content type using attribute-based CSS classes from within the content type's form.

### `<css>` nodes

The `<css>` node maps to the `css_classes` field from the `pagebuilder_base_form.xml` and adds its values (CSS classes) to the `class` attribute of the Heading's DOM element (h1 through h6).

{: .bs-callout .bs-callout-info }
The `<tag>` and `<html>` nodes are beyond the scope of this topic, but they map to the Heading's `heading_type` selector field and `heading_text` input field from the (`pagebuilder_heading_form.xml`) form.

## Final thoughts

Using custom attributes represents one of Page Builder's best practices for adding powerful content styling options to forms. You can add attributes to both existing content types (as shown with the Heading extension) and custom content types. The CSS styling options are only limited by the CSS specs your targeted browsers support. Have fun!
