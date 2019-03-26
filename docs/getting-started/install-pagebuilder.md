# Install Page Builder

{: .bs-callout .bs-callout-info }
These installation instructions are only for contributors to the Page Builder code or documentation. For everyone else, **Page Builder is automatically installed with Magento Commerce 2.3.1. There is nothing else you need to do.**

## GitHub installation for Contributors

Before installing Page Builder for making contributions, make sure you have the following prerequisites:

- A local development installation of Magento Commerce 2.3.1 -- Use the installation instructions from the [DevDocs installation guide](https://devdocs.magento.com/guides/v2.3/install-gde/bk-install-guide.html). 
- Access to the private Page Builder repository
- [npm package manager](https://www.npmjs.com/get-npm)

1. Clone the Page Builder repos into the root directory of your Magento Commerce 2.3+ installation:

    ```bash
    git clone https://github.com/magento/magento2-page-builder
    git clone https://github.com/magento/magento2-page-builder-ee
    ```

2. From the root directory of your Magento Commerce installation, use the `dev/tools/build-ee.php` script to symlink `magento2-page-builder` and `magento2-page-builder-ee` repos into your Magento Commerce installation:

    ```bash
    php dev/tools/build-ee.php --command=link --ee-source="magento2-page-builder" --ce-source="."
    php dev/tools/build-ee.php --command=link --ee-source="magento2-page-builder-ee" --ce-source="."
    ```

    The results should look like this:

    ![Symlinks to Page Builder](../images/symlinked-pagebuilder.png)

3. Enable the Page Builder module using the following command:

    ```bash
    bin/magento setup:upgrade
    ```

### Updating GitHub installation

When a new version of Page Builder is available, simply pull down the latest versions from `magento/magento2-page-builder` and `magento/magento2-page-builder-ee`.

### Installing Node.js dependencies

If you plan to contribute to Page Builder, you need to install Node.js dependencies to compile TypeScript.

Navigate to the `pagebuilder` directory and install Page Builder dependencies using the following command:

```bash
cd pagebuilder && npm install
```

After installing the npm packages, you can run `npm run start`. This command watches for changes to your TypeScript files, compiles, and checks for errors.
