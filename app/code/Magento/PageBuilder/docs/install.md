# Installation Guide

## Navigation

1. [Introduction]
2. **Installation guide**
    1. [Overview](#overview)
    1. [Composer installation](#composer-installation)
    1. [GitHub installation](#github-installation)
    1. [Activation](#activation)
    1. [Troubleshooting](#troubleshooting)
3. [Contribution guide]
4. [Developer documentation]
5. [Roadmap and known issues]
6. [How to create custom PageBuilder content type container]

[Introduction]: README.md
[Contribution guide]: CONTRIBUTING.md
[Developer documentation]: developer-documentation.md
[Roadmap and known issues]: roadmap.md
[How to create custom PageBuilder content type container]: how-to-create-custom-content-type-container.md

## Overview

PageBuilder has two installation paths, one through Composer and the other through GitHub.

If you want to evaluate the PageBuilder module, follow the Composer installation path.

If you want to contribute to the development of PageBuilder, follow the GitHub installation path.

## Composer installation

This installation method uses Composer to install PageBuilder into Magento.
Use this method if you are testing and evaluating PageBuilder for your Magento store.

### Prerequisites

* You submitted your MAGEID and github username and received access to 2.3 alpha and PageBuilder 100.0.0 alpha.
  If you didn't submit this information, send us an email to request access.

### Installation steps

1. If you already have 2.3.0 alpha or Page Builder 100.0.0 alpha version installed, run the following command before installing again:
    ``` sh
    composer clearcache
    ```
    If you don’t clear the cache, Composer will not download the latest alpha release from the repo and will use the local, cached packages instead.
2. Navigate to the directory where you want to install Magento and Page Builder.
3. Install the 2.3.0 alpha Commerce package using the following command: 
    ``` sh
    composer create-project --repository-url=https://repo.magento.com/ magento/project-enterprise-edition=2.3.0-alpha
    ```

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

When a new version of Page Builder is available, destroy your existing 2.3.0-alpha instance and follow the [composer](install.md#composer-installation) or [GitHub](install.md#github-installation) installation steps.

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

## Troubleshooting

### Common access problems

If you are having trouble installing PageBuilder, please verify that the `MAGEID` account you provided for the Early Access Program (EAP) belongs to an active Magento partner account.

**Note:**
*Your company may have multiple Magento accounts, and only one or two may be active.*
*Ask your company to provide you with an active Magento account.*

Log into www.magento.com and see if the **Support** and **Downloads** tabs are available.

![Support and downloads tabs](images/support-downloads-tab.png)

If these tabs do not appear in your Magento account, it is not an active Magento partner account, and
you will not be able to access PageBuilder.

If you provided incorrect `MAGEID` by mistake and have another one that is valid, please resubmit this form:
https://goo.gl/forms/unvuDikl9wydmKt12

### Errors

If you run into any of the following errors:

```
Could not find package magento/project-enterprise-edition with version 2.3.0-alpha.
```
```
Could not find a matching version of package magento/module-page-builder-commerce. Check the package spelling, your version constraint and that the package is available in a stability which matches your minimum-stability (stable).
```

Check your composer keys in the `auth.json` file.
If these keys are correct and you still encounter these errors, please contact [Olena Tkacheva].

[Olena Tkacheva]: https://magentocommeng.slack.com/messages/@UAFV915FB
