# Install Page Builder

How you install the pre-release version of Page Builder depends on whether or not you are a member of the Early Adopters Program (EAP):

- **All Partners** (not EAP members) must use the [GitHub installation](#githubInstructions).
- **EAP Members** can install using the [Composer installation](#composerInstallation).

## Prerequisite for both installations

Magento 2.3+ Commerce -- Use the installation instructions from the [DevDocs installation guide](https://devdocs.magento.com/guides/v2.3/install-gde/bk-install-guide.html). 

## **All Partners**: GitHub Installation {#githubInstructions}

Partners who are not members of the Early Adopters Program (EAP) must install the pre-release version of Page Builder by cloning the Page Builder GitHub repository (https://github.com/magento/magento2-page-builder) into a development instance of Magento. 
Before installing Page Builder, make sure you have:

* A local development installation of Magento 2.3.0 alpha
* Access to the Page Builder repository
* [Yarn package manager](https://yarnpkg.com/en/)

1. Navigate to the root directory of your Magento application.

2. Clone the Page Builder repository as a subdirectory using the following command:
    ``` bash
    git clone git@github.com:magento/magento2-page-builder.git pagebuilder
    ```
    
3. Return to the root directory of your Magento application and navigate to `app/code/Magento`

4. In the Magento modules directory, link the Page Builder module code to the application code using the following command:
    ``` bash
    ln -s ../../../pagebuilder/app/code/Magento/PageBuilder
    ```
    
5. Return to the root directory of your Magento application and install the Page Builder module using the following command:
    ``` bash
    bin/magento setup:upgrade
    ```

### Updating GitHub installation

When a new version of Page Builder is available, delete your previous Page Builder clone/subdirectory and clone the latest again.

### Installing Node.js dependencies

If you plan to contribute to Page Builder, you need to install Node.js dependencies to compile TypeScript.

Navigate to the `pagebuilder` directory and install Page Builder dependencies using the following command:
``` sh
cd pagebuilder && yarn install
```

Then you can run `npx gulp` to watch changes to TypeScript files and compile.
To check for TypeScript errors, you can run `npx tslint --fix -p tsconfig.json`.

## **EAP Participants Only**: Composer Installation {#composerInstallation}

To use the Composer installation described below, you must be an active member in the Page Builder EAP program and have submitted your MAGEID to get access to the Page Builder Composer packages through `repo.magento.com`. 
If you are experiencing problems _as an EAP member_, please contact us at `pagebuilderEAP@adobe.com`.

{: .bs-callout .bs-callout-info }
If you have had a previous version of Magento 2.3.0 or Page Builder installed, clear your composer cache (`composer clearcache`) before you install the latest packages.

1. Ensure your composer has `minimum-stability` set to `beta`:
    ```
    composer config minimum-stability beta
    ```

2. Navigate to the root of the project and require the `magento/module-page-builder-commerce` package:
    ```
    composer require magento/page-builder-commerce:^1.0.0
    ```
    
3. Enable the module within Magento:
    ``` sh
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