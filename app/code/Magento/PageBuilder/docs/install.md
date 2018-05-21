# Installation Guide

## Navigation

1. [Introduction]
2. **Installation guide**
    1. [Overview](#overview)
    1. [Composer installation](#composer-installation)
    1. [GitHub installation](#github-installation)
    1. [Activation](#activation)
3. [Contribution guide]
4. [Developer documentation]
5. [Roadmap and known issues]

[Introduction]: README.md
[Contribution guide]: CONTRIBUTING.md
[Developer documentation]: developer-documentation.md
[Roadmap and known issues]: roadmap.md

## Overview

PageBuilder has two installation paths, one through Composer and the other through GitHub.

If you want to evaluate the PageBuilder module, follow the Composer installation path.

If you want to contribute to the development of PageBuilder, follow the GitHub installation path.

## Composer installation

This installation method uses Composer to install PageBuilder into Magento.
Use this method if you are testing and evaluating PageBuilder for your Magento store.

### Prerequisites

* You submitted us MAGEID and github username and received access to 2.3 alpha and PageBuilder 1.0 alpha. If you didn't submit us github username with will send you an email and request it.

### Installation steps

1. If you have installed 2.3.0 alpha or Page Builder 1.0 alpha version installed, run `composer clearcache` before installing again. If you don’t clear the cache, Composer will not download the latest alpha release from the repo. It will instead use your locally cached packages.
2. Navigate to the directory where you want to install Magento and Page Builder.
3. Install 2.3.0 alpha Commerce package, run composer create-project --repository-url=https://repo.magento.com/ magento/project-enterprise-edition=2.3.0-alpha.
    Enter the access keys for your account (Marketplace / My Profile / Access Keys)
4. Install Page Builder
    ``` sh
    composer require magento/module-page-builder-commerce
    ```
5. Enable Page Builder module using the following command:
    ``` sh
    bin/magento setup:upgrade
    ```

## GitHub installation

This installation method checks out the PageBuilder repository from GitHub and installs it into a development instance of Magento.
Do not use this installation method for evaluation or production instances. 

### Prerequisites

* A local development installation of Magento 2.3.0 alpha
* Access to the PageBuilder repository
* [Yarn package manager]

[Yarn package manager]: https://yarnpkg.com/en/

### Installation steps

1. Navigate to the root directory of your Magento application
2. Clone the PageBuilder repository as a sub-directory using the following command:
    ``` sh
    git clone git@github.com:magento/magento2-page-builder.git pagebuilder
    ```
3. Return to the root directory of your Magento application and navigate to `app/code/Magento`
4. In the Magento modules directory, link the PageBuilder module code to the application code using the following command:
    ``` sh
    ln -s ../../../pagebuilder/app/code/Magento/PageBuilder
    ```
5. Return to the root directory of your Magento application and install the PageBuilder module using the following command:
    ``` sh
    bin/magento setup:upgrade
    ```

## Update steps

When a new version of Page Builder is available, destroy your existing 2.3.0-alpha instance and follow the [composer](install.md#Composer installation) or [GitHub](install.md#GitHub installation) installation steps.

## Installing Node.js dependencies

If you plan to contribute to Page Builder, you need to install Node.js dependencies to compile TypeScript.

Navigate to the `pagebuilder` directory and install PageBuilder dependencies using the following command:
``` sh
cd pagebuilder && yarn install
```

Then you can run `npx gulp` to watch changes to TypeScript files and compile.

To check for TypeScript errors, you can run `npx tslint --fix -p tsconfig.json`.

## Activation

Follow these steps to activate PageBuilder in the Admin:

1. Navigate to the Admin section of you Magento instance.
2. In the **Stores** tab, select **Configuration** under the Settings group.
3. In the **General** group on the page, select **Content Management**.
4. Under **Advanced Content Tools**, select **Yes** for **Enable Page Builder**.
5. Click **Save Config**