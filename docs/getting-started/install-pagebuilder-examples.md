# Install Page Builder Examples

You can find the Page Builder examples used in this documentation on GitHub in the [pagebuilder-examples repo](https://github.com/magento-devdocs/pagebuilder-examples). The repo contains three types of examples:

- Custom content type modules
- Extension modules for existing content types
- Example code for how-to topics

## Custom content type modules

To learn by example, the [Example directory](https://github.com/magento-devdocs/pagebuilder-examples/tree/master/Example) on the repo provides the following custom content-type modules for you to download and install. Page Builder team members created these modules to serve as examples for learning. We will do our best to keep these updated and functioning with the latest releases of Page Builder. 

- **[PageBuilderQuote](https://github.com/magento-devdocs/pagebuilder-examples/tree/master/Example/PageBuilderQuote)** — Original author: [Bruce Denham](https://github.com/bdenham). This module shows you how to use a simple content type to stylize quotations for things like customer testimonials. This is the completed module featured in the [content type tutorial](../create-custom-content-type/overview.md). Original author: Bruce Denham 
- **[PageBuilderGrid](https://github.com/magento-devdocs/pagebuilder-examples/tree/master/Example/PageBuilderGrid)** — Original author: [Dave Macaulay](https://github.com/davemacaulay). This module shows you how to create a content type to rebuild the Magento Luma home page using a grid structure with grid items.
- **[PageBuilderFaq](https://github.com/magento-devdocs/pagebuilder-examples/tree/master/Example/PageBuilderFaq)** — Original author: [Igor Melnikov](https://github.com/melnikovi). This module shows you how to create a content type for an FAQ page that uses an accordion for the questions and answers.

## Extension modules for existing content types

The [Example directory](https://github.com/magento-devdocs/pagebuilder-examples/tree/master/Example) also provides the completed extension module described in the [Extend a content type tutorial](../extend-existing-content-type/overview.md). More extension modules will be added in the coming weeks.

## Example code for how-to topics

**In Progress**. The how-to directories in the repo correspond to the how-to topics in this documentation. Each how-to directory provides the files and code changes featured in the how-to topics.

For example, the topic [How to add a custom toolbar](../how-to/how-to-add-custom-toolbar.md), has a corresponding directory within the [pagebuilder-examples repo](https://github.com/magento-devdocs/pagebuilder-examples) called [how-to-add-custom-toolbar](https://github.com/magento-devdocs/pagebuilder-examples/tree/master/how-to-add-custom-toolbar). This directory provides the files with the code changes you need to make in order to add a custom toolbar to the `PageBuilderQuote` module.

## Installation

Assuming you have Page Builder 1.0.0 already installed, you can install the example modules as follows:

1. Clone the pagebuilder-examples repo:

    ```terminal
    git clone https://github.com/magento-devdocs/pagebuilder-examples
    ```

2. Navigate to your `<Magento2_installation>/app/code/` directory.

3. Copy or symlink the `Example` directory from your local `pagebuilder-examples` clone into your `app/code/` directory.
    
    **To Symlink**:
    ```terminal
    ln -s <Relative_route_to_cloned_Example_directory>
    ```
    
    ![Examples installation directory](../images/examples-install-location.png)
    
4. Enable the modules using the `setup:upgrade` command:

   ```terminal
   bin/magento setup:upgrade
   ```
   
5. Navigate to a Page Builder instance to ensure the example content types appear in the Page Builder panel, as shown here:

   ![Content type examples shown in panel](../images/example-content-types.png)

 