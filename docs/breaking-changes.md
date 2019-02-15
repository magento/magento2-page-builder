# Breaking changes in 1.0.0-beta7

As hard as we tried to avoid breaking changes during our beta program, we felt compelled to clarify certain names within Page Builder to help developers better understand their purpose. As a result these changes **will break** existing content within previous beta versions, along with any custom content types you've created.

A summary of the changes is shown here, followed by the details on how to update your existing content:

- `data-role` to `data-content-type`
- `group` to `menu_section`
- `render_template` to `master_template`
- `is_visible` to `is_system`
- `renderChildTemplate` to `masterTemplate`
- `previewChildTemplate` to `childTemplate`
- `renderTemplate` and `previewTemplate` to `template`

We’re sorry if these changes cause you any disruption. But we strongly believe they will improve product understanding for all future developers.

## Master Format Changes

The `data-role` attribute is now called `data-content-type`.  We strongly believe this makes understanding the purpose of the element and attribute much easier, as `data-role` is already used for several other features in Magento.

This change causes existing content to load as HTML code within your content type. To fix this issue, run the following command on your MySQL database:

```sql
UPDATE cms_page SET content = REPLACE(content, 'data-role="', 'data-content-type="');
UPDATE cms_block SET content = REPLACE(content, 'data-role="', 'data-content-type="');
UPDATE magento_banner_content SET banner_content = REPLACE(banner_content, 'data-role="', 'data-content-type="');
UPDATE catalog_category_entity_text SET value = REPLACE(value, 'data-role="', 'data-content-type="');
UPDATE catalog_product_entity_text SET value = REPLACE(value, 'data-role="', 'data-content-type="');
```

## XML Changes

The `group` system has been renamed to `menu_section`, resulting in the following changes:

- The `group.xml`, `group.xsd`, and `group_merged.xsd` files are now called `menu_section.xml`, `menu_section.xsd`, and `menu_section_merged.xsd`, but are located in the same places and have the same purposes. Nodes within these files have also been updated from `<group />` to `<menu_section />`.

- The `group` attribute is now called `menu_section`. If you've implemented a custom content type, you will need to update this attribute within your content type's configuration file. For example:

  ```xml
  <type name="example_quote"
              label="Quote"
              menu_section="elements"
  ```

- For any panel extensions you may have done, you will need to change your panel import references from `Magento_PageBuilder/js/panel/group` to `Magento_PageBuilder/js/panel/menuSections`, as well as any reader class references from `Magento\PageBuilder\Model\Config\Group` classes to `Magento\PageBuilder\Model\Config\MenuSection` classes, as necessary.

## JavaScript Changes

We've also improved the naming of various properties in the JavaScript classes we ship within Page Builder. These changes may result in your custom extensions referencing properties that are no longer available.

- A content type's parent content type is now referenced as `parentContentType` instead of just `parent`, this was changed in `content-type.ts` and `content-type-collection.ts`. If you're traversing up the tree you will need to update this reference.

- From the `preview` and `master` components, you now access the content type instance through `contentType` instead of previously using `parent`. For example, event code using `parent` will need to be updated to contentType:

  ```js
  events.on(`${this.config.name}:${this.parent.id}:updateAfter`, function (args) {
       console.log(self.parent);
  });
  ```

  Changes to:

  ```js
  events.on(`${this.config.name}:${this.contentType.id}:updateAfter`, function (args) {
       console.log(self.contentType);
  });
  ```

- `render_template` is renamed to `master_template`:

  ```xml
   <appearance name="default"
               preview_template="Example_PageBuilderQuote/content-type/example-quote/default/preview"
               render_template="Example_PageBuilderQuote/content-type/example-quote/default/master"
               reader="Magento_PageBuilder/js/master-format/read/configurable">
  ```

  Changes to:

  ```xml
   <appearance name="default"
               preview_template="Example_PageBuilderQuote/content-type/example-quote/default/preview"
               master_template="Example_PageBuilderQuote/content-type/example-quote/default/master"
               reader="Magento_PageBuilder/js/master-format/read/configurable">
  ```

  

- `is_visible` is renamed to `is_system`. If your content type modifies this attribute, you will need to update your reference in the configuration file.

- `renderChildTemplate` is renamed to `masterTemplate` and `previewChildTemplate` is renamed to `childTemplate`. If you have a container content type which renders children, you will need to update these references in your code.
