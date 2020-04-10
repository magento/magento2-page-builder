# How to use attributes for content styling

Attributes in Page Builder give you a way to add a variety of interactive CSS styling options for your content types. For example, Page Builder's Heading content type provides a number of built-in styling options from its form. The Heading form gives users options to set different heading types, text alignments, border properties, margins, and paddings. It also lets users apply multiple static CSS classes.

But what if you want to give users more interactive styling options? For example, maybe you want to add Heading color options. Or Heading text-style options. This topic will explain how to user attributes to provide more content type styling options.

## Install the example module

To help you get started with using attributes, we created an example module that you can clone and install from [magento-devdocs/PageBuilderStylingWithAttributes](https://github.com/magento-devdocs/PageBuilderStylingWithAttributes). The instructions for installing the module are provided from the README file on the repo.

The example module extends the Heading content type because we wanted to focus on learning about attributes instead of sifting through the the additional code that comes with creating a new custom content type.

The following screenshot shows what the Heading content type form looks like after installing the example module. Specifically, you should see three new Heading fields: `Heading Colors`, `Heading Styles`, and `Heading Opacity`.

![How to add an appearance](../images/heading-extension-using-attributes-and-style.png)

_Extended Heading form with color and text style options using attributes_

The example module provides all the code used here to describe the attribute-based styling. It also provides some "bonus code" that shows how to use a `<style>` node to give users an option for setting Heading text opacity. But wait, that's not all! We also added a custom converter for the opacity style to ensure that users can enter the opacity as a percentage.

## Steps for styling with attributes

An overview of the steps is shown here, followed by the detailed instructions for each step:

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

_Two `select` fields added to the native Heading form_

The names of these fields, `heading_color` and `heading_style`, are particularly important. They are the same names you must assign to the attributes in your configuration file. You will do that next in step 2.

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

_Element attributes for `main` mapped to the extended Heading form fields_

In this example, the `source` values (`data-heading-color` and `data-heading-style`) are rendered in the DOM for the Heading's main element, as shown here:

```html
<h2 data-content-type="heading"
    data-appearance="default"
    data-heading-color="brand-green"
    data-heading-style="style-italic"
    data-element="main"
    style="border-style: none; border-width: 1px; border-radius: 0px; opacity: 1;">
    My Heading Text
</h2>
```

The values for these attributes are set by the user from the form fields. In this example, the user selected `brand-green` from the `heading_color` selector field and `style-italic` from the `heading_style` selector field. Page Builder adds the attributes and their values to the DOM where they can be targeted with CSS classes from our content type's `_default.less` files (from the adminhtml and frontend areas). You will create these CSS classes in step 3.

## Step 3: Add attribute-based CSS classes

The CSS classes in your `_default.less` files for both the `adminhtml` and `frontend` should be attribute-based, as shown here in our extended Heading example:

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

The values for these attributes are set by the user from the form field that corresponds to the attribute. This makes it easy to target your content type's elements from your `_default.less` files.

## Step 4: Add Knockout attribute bindings to HTML templates

In order for your attribute selectors to be rendered in the DOM as described in step 2, you must add Knockout attribute bindings to your content type's HTML templates. The Knockout attribute bindings look like this:

```json
attr="data.main.attributes"
```

The Knockout `attr` binding ensures that all the attributes defined for an element in your content type's configuration are rendered in the DOM for that element. In the previous example binding, the `main` node refers to the element defined in the configuration file. And `attributes` refers to all the `<attribute>` nodes defined for the `main` element.

These Knockout bindings are applied to the Heading's `master.html` template (as well as the `preview.html` template). The Heading `master.html` template is here:

```html
<!-- Heading master.html -->

<h1 if="data.main.heading_type() == 'h1'" attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" html="data.main.html"></h1>
<h2 if="data.main.heading_type() == 'h2'" attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" html="data.main.html"></h2>
<h3 if="data.main.heading_type() == 'h3'" attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" html="data.main.html"></h3>
<h4 if="data.main.heading_type() == 'h4'" attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" html="data.main.html"></h4>
<h5 if="data.main.heading_type() == 'h5'" attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" html="data.main.html"></h5>
<h6 if="data.main.heading_type() == 'h6'" attr="data.main.attributes" ko-style="data.main.style" css="data.main.css" html="data.main.html"></h6>
```

_Attribute bindings for the Heading's `data.main` config elements_

## Discussion

Styling with `<attributes>` is only one of three options that you can use to give end users a way to style content from a form. The other two options are using the `<style>` and `<css>` nodes. The differences between these three options are summarized here:

-  `<attribute>` nodes - used to style a content-type element using an attribute-based CSS class.
-  `<style>` nodes - used to style content-type elements using specific CSS properties.
-  `<css>` nodes - used to style content-type elements with static CSS classes entered by the end user.

The `<attribute>` and `<style>` nodes can be added multiple times to a content-type element. But the `<css>` node can only be added once per element. Refer to [Understanding the <css> node](#understadingthe<css>node).

We will use the following snippent from the `heading.xml` configuration file (`Magento/PageBuilder/view/adminhtml/pagebuilder/content_type/heading.xml`) as a reference to our discussion of these nodes and how to use them.

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

{: .bs-callout .bs-callout-info }
The `<tag>` and `<html>` nodes are beyond the scope of this topic, but like the other nodes, they also map to form fields. In this case, the `<tag>` node maps to the Heading's `heading_type` selector field and the `<html>` node maps to the `heading_text` input field from the (`pagebuilder_heading_form.xml`) form.

### Understanding and using `<style>` nodes

In contrast to using attributes for content styling, adding a `<style>` node to a content type config `element` gives you a way to provide end users with a form field that changes a _specific_ CSS property, such as `opacity`.

In the `heading.xml` config example, the `<style>` nodes map to the same-named fields defined in the `pagebuilder_base_form.xml`, which gives users the form fields needed to change each of the CSS properties. When rendered to the DOM, Page Builder adds these CSS properties (and the user-entered values) to the inline `style` attribute for the Heading's DOM element (which could be `<h1>` to `<h6>` depending on the Heading Type selected in the Heading's form).

For example, if a user selected a value for each of the styles defined in the `heading.xml` config shown above, the inline `style` attribute in the storefront DOM would have entries and values for all the `<style>` nodes defined, as shown here:

```html
<h2 data-content-type="heading"
    data-appearance="default"
    data-heading-color="brand-blue"
    data-heading-style="style-default"
    data-element="main"
    style="text-align: left; border-style: solid; border-color: rgb(240, 240, 240); border-width: 1px; border-radius: 3px; margin: 5px; padding: 2px;">
    My Heading Text
</h2>
```

Each `<style>` node defined gets added to the DOM as another CSS property in the inline `style` attribute. In the example module for this topic, we added `<style name="heading_opacity" source="opacity" />` to the `heading.xml` config. So when Page Builder renders the extended Heading content type in the DOM, it adds opacity to all the existing inline styles: `style="... opacity: 1; ..."`.

### Using `<attribute>` nodes instead of `<style>` nodes

Adding an `<attribute>` node to a config `element` gives you a way to provide end users with a form field that can use CSS classes to change _several_ CSS properties at once. This is much more powerful that using `<style>` nodes which can only change single CSS properties.

Using `<attribute>` nodes instead of `<style>` nodes is transparent to users, who are simply interacting with field options to change content styling. But for you, the developer, being able to apply a variety of different CSS classes (based on end user field selections) can provide your content types with powerful styling options.

### Understanding the `<css>` node

The `<css>` config node is a bit different from the `<attribute>` and `<style>` nodes. The `<css>` node wasn't designed to be added to an element more than once like the other two nodes. Instead, it was designed to capture multiple CSS classes from a single form field and render those classes to the DOM within the `class` attribute. For this reason, it is currently not possible to assign CSS classes to an element's `class` attribute from more than the one field mapped to the `<css>` node.

Regardless of that limitation, you can still use the `<css>` node to provide creative styling options for a content type. For example, if a merchant has a set of standard CSS classes they use during the year for holidays, you could map the `<css>` node to a `select` field that allows end users to choose from sets of merchant-approved classes with descriptive names, like Halloween styling, Christmas styling, and so on.

Out of the box, Page Builder maps the `<css>` config node (for each content type) to the `css_classes` input field from the `pagebuilder_base_form.xml`. For example, if you were to enter two CSS classes into this field within the Heading form, Page Builder would add the `class` attribute to the Heading's `main` element (`<h2>`) and populate it with the CSS classes entered, as shown on the first line here:

![CSS Classes input field](../images/css-class-input-output.png)

```html
<h2 class="fall-heading-style halloween-heading-style"
    data-content-type="heading"
    data-appearance="default"
    data-heading-color="brand-blue"
    data-heading-style="style-default"
    data-element="main"
    style="text-align: left; border-style: solid; border-color: rgb(240, 240, 240); border-width: 1px; border-radius: 3px; margin: 5px; padding: 2px; opacity: 1;">
    My Heading Text
</h2>
```

As mentioned, you can override the `<css>` node to map it to a different form field name and field type.

## Final thoughts

Using custom attributes represents one of Page Builder's best practices for adding powerful and flexible content styling options to forms. You can add these styling attributes to both existing content types (as shown in the Heading extension module) and custom content types. The CSS styling options are only limited by the CSS specs targeted by your supported browsers. So get creative and have fun!
