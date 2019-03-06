# Install Page Builder

How you install the pre-release version of Page Builder depends on whether you are a member of the Early Adopters Program (EAP):

- **All Partners** (not EAP members) must use the [GitHub installation](#githubInstructions).
- **EAP Members** can install using the [Composer installation](#composerInstallation).

## Prerequisite for both installations

Magento Commerce 2.3+ -- Use the installation instructions from the [DevDocs installation guide](https://devdocs.magento.com/guides/v2.3/install-gde/bk-install-guide.html). 

## **All Partners**: GitHub Installation {#githubInstructions}

Partners who are not members of the Early Adopters Program (EAP) must install the pre-release version of Page Builder by cloning the Page Builder GitHub repository (https://github.com/magento/magento2-page-builder) into a development instance of Magento. 
Before installing Page Builder, make sure you have:

* A local development installation of Magento Commerce 2.3+
* Access to the Page Builder repository
* [npm package manager](https://www.npmjs.com/get-npm)

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

## **EAP Participants Only**: Composer Installation {#composerInstallation}

To use the Composer installation described below, you must be an active member in the Page Builder EAP program and have submitted your MAGEID to get access to the Page Builder Composer packages through `repo.magento.com`. 
If you are experiencing problems _as an EAP member_, please contact us at `pagebuilderEAP@adobe.com`.

{: .bs-callout .bs-callout-info }
If you already have Magento 2.3.0 or Page Builder installed, clear your composer cache (`composer clearcache`) before you install the latest packages.

1. Ensure your composer has `minimum-stability` set to `beta`:

    ```bash
    composer config minimum-stability beta
    ```

2. Navigate to the root of the project and require the `magento/module-page-builder-commerce` package:

    ```bash
    composer require magento/page-builder-commerce:^1.0.0
    ```
    
3. Enable the module within Magento:

    ``` bash
    bin/magento setup:upgrade
    ```
    
4. Activate Page Builder from the Admin UI as described in [Activate Page Builder](activate-pagebuilder.md).

### Updating Composer installation

You can install updates by completing a `composer update` within your project.

### Composer installation issues

If you run into the following issue:

```shell
Could not find a matching version of package magento/page-builder-commerce. Check the package spelling, your version constraint and that the package is available in a stability which matches your minimum-stability (stable).
```

Please ensure the credentials you're using to connect with `repo.magento.com` belong to the MAGEID you provided when you signed up to the EAP program.