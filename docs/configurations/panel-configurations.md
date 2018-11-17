<!-- {% raw %} -->

# Customize the Panel

By default, the Page Builder panel has four groups (Layout, Elements, Media, Add Content) and 16 content types as shown here:

![Panel menu](../images/panel-horizontal-default.png)

You can customize the panel menu in four ways:

1. Rename panel groups.
2. Reorder panel groups.
2. Add new panel groups.
3. Add content types to different panel groups.

## Rename panel groups

To rename the panel groups, you need to override the defaults configured in the Page Builder `group.xml` file as follows:

1. Add a file called `group.xml` to your module's `view/adminhtml/pagebuilder/` directory:

    ![Custom group file](../images/custom-group-file.png)

2. Copy the contents from `app/code/Magento/PageBuilder/view/adminhtml/pagebuilder/group.xml` :

    ```xml
    <?xml version="1.0"?>
    <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/group.xsd">
        <group name="layout" translate="label" sortOrder="1" label="Layout"/>
        <group name="elements" translate="label" sortOrder="10" label="Elements"/>
        <group name="media" translate="label" sortOrder="20" label="Media"/>
        <group name="add_content" translate="label" sortOrder="30" label="Add Content"/>
    </config>
    ```

3. Change the `label` values to suit your preferences:

    ```xml
    <?xml version="1.0"?>
    <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/group.xsd">
        <group name="layout" translate="label" sortOrder="1" label="Structure"/>
        <group name="elements" translate="label" sortOrder="10" label="Form Controls"/>
        <group name="media" translate="label" sortOrder="20" label="Visual Controls"/>
        <group name="add_content" translate="label" sortOrder="30" label="Content"/>
    </config>
    ```

    If you only want to change one of the group labels, you only have to include the `<group>` element you want to change, as shown here:

    ```xml
    <?xml version="1.0"?>
    <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/group.xsd">
        <group name="add_content" translate="label" sortOrder="30" label="Content"/>
    </config>
    ```

## Reorder panel groups

To reorder panel groups, you need to override the default `sortOrder`s applied to the existing panel groups:

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/group.xsd">
    <group name="layout" translate="label" sortOrder="30" label="Structure"/>
    <group name="elements" translate="label" sortOrder="20" label="Form Controls"/>
    <group name="media" translate="label" sortOrder="10" label="Visual Controls"/>
    <group name="add_content" translate="label" sortOrder="1" label="Content"/>
</config>
```

In this example, the `sortOrder`'s of the groups have been reversed from their defaults. The result looks like this:

![Reorder panel groups](../images/panel-reorder-groups.png)

## Add new panel groups

To add a new panel group, add a new `<group>` element  in your module's `group.xml` file with a unique `name` as shown here:

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/group.xsd">
    <group name="my_controls" translate="label" sortOrder="0" label="My Controls"/>
</config>
```

The result shows the new group (My Controls) positioned at the top of the panel because the `sortOrder` is set to `0`, less than the sort order of `1` set for the `layout` group. You can also use negative numbers (`-1`) for the sort order as needed.

![New panel group](../images/panel-group-new.png)

Now to populate the new and existing groups with content types.

## Add content types to different panel groups

To add content types to other panel groups, set your configuration's `group` attribute to the new `<group>` element's name. For example, to add your content type to a new group called My Controls,

```xml
<group name="my_controls" translate="label" sortOrder="0" label="My Controls"/>
```

You specify "my_controls" as the value of the `group` attribute in your configuration file, as shown here:

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/content_type.xsd">
    <type name="bestcontrolever"
          label="Best Control Ever"
          group="my_controls"
          ...
          >
```

![Group with content type](../images/group-with-content-type.png)

The same technique applies when you want to add a new content type (or move existing content types) to one of the default groups: `layout`, `elements`, `media`, and `add_content` as shown here:

```xml
<group name="layout" translate="label" sortOrder="1" label="Layout"/>
<group name="elements" translate="label" sortOrder="10" label="Elements"/>
<group name="media" translate="label" sortOrder="20" label="Media"/>
<group name="add_content" translate="label" sortOrder="30" label="Add Content"/>
```

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_PageBuilder:etc/content_type.xsd">
    <type name="bestcontrolever"
          label="Best Control Ever"
          group="elements"
          ...
          >
```

<!-- {% endraw %} -->