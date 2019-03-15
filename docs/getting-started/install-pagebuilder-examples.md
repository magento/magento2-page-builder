# Install Page Builder Examples

You can find the Page Builder examples used in this documentation on GitHub in the [pagebuilder-examples repo](https://github.com/magento-devdocs/pagebuilder-examples). This repo contains two types of examples:

- Fully functional modules
- Files for how-to topics

## Fully functional modules

To learn by example, the [Example directory](https://github.com/magento-devdocs/pagebuilder-examples/tree/master/Example) on the repo provides the following custom content-type modules for you to download and install.

- **[PageBuilderQuote](https://github.com/magento-devdocs/pagebuilder-examples/tree/master/Example/PageBuilderQuote)**—This module shows you how to use a simple content type to stylize quotations for things like customer testimonials. This is the completed module featured in the [content type tutorial](../create-custom-content-type/overview.md).
- **[PageBuilderGrid](https://github.com/magento-devdocs/pagebuilder-examples/tree/master/Example/PageBuilderGrid)**—This module shows you how to create a content type to rebuild the Magento Luma home page using a grid structure with grid items.
- **[PageBuilderFaq](https://github.com/magento-devdocs/pagebuilder-examples/tree/master/Example/PageBuilderFaq)**—This module shows you how to create a content type for an FAQ page that uses an accordion for the questions and answers.

## Installation

Assuming you have Page Builder 1.0.0 already installed, you can install the example modules as follows:

1. Clone the pagebuilder-examples repo:

    ```bash
    git clone https://github.com/magento-devdocs/pagebuilder-examples
    ```

2. Navigate to your `<Magento2_installation>/app/code/` directory.

3. Copy or symlink the `Example` directory from your local `pagebuilder-examples` clone into your `app/code/` directory.
    
    **To Symlink**:
    ```bash
    ln -s <Relative_route_to_cloned_Example_directory>
    ```
    
    ![Examples installation directory](../images/examples-install-location.png)
    
4. Enable the modules using the `setup:upgrade` command:

   ```bash
   bin/magento setup:upgrade
   ```
   
5. Navigate to a Page Builder instance to ensure the example content types appear in the Page Builder panel, as shown here:

   ![Content type examples shown in panel](../images/example-content-types.png)
    

## Files for how-to topics

The how-to directories in the repo correspond to the how-to topics in this documentation. They provide the files and code changes required by the how-to topic in order to add the given feature to the `PageBuilderQuote` module.

For example, the topic [How to add a custom toolbar](../how-to/how-to-add-custom-toolbar.md), has a corresponding directory within the [pagebuilder-examples repo](https://github.com/magento-devdocs/pagebuilder-examples) called [how-to-add-custom-toolbar](https://github.com/magento-devdocs/pagebuilder-examples/tree/master/how-to-add-custom-toolbar). This directory provides the files with the code changes you need to make in order to add a custom toolbar to the `PageBuilderQuote` module.



 
