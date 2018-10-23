# Install Page Builder

<!-- {% raw %} -->

## Overview

Follow these steps to install Page Builder.

### Prerequisites

* You submitted your MAGEID and github username and received access to 2.3 alpha and PageBuilder 100.0.0 alpha.
  If you didn't submit this information, send us an email to request access.

### Steps

1. If you already have 2.3.0 alpha or Page Builder 100.0.0 alpha version installed, run the following command before installing again:
    ``` sh
    composer clearcache
    ```
    If you don’t clear the cache, Composer will not download the latest alpha release from the repo and will use the local, cached packages instead.
2. Navigate to the directory where you want to install Magento and Page Builder.
3. Install the 2.3.0 alpha Commerce package using the following command: 
    ``` sh
    composer create-project --repository-url=https://repo.magento.com/ magento/project-enterprise-edition:^2.3.0-alpha72
    ```

    Enter the access keys for your account (Marketplace / My Profile / Access Keys)
4. Clone Page Builder repos
    ``` sh
    git clone https://github.com/magento/magento2-page-builder
    git clone https://github.com/magento/magento2-page-builder-ee
    ```
5. Copy dev and app directories in magento2-page-builder and magento2-page-builder-ee to the directory with Magento Commerce 2.3 alpha
    ``` sh
    cp -r magento2-page-builder/app project-enterprise-edition/
    cp -r magento2-page-builder/dev project-enterprise-edition/
    cp -r magento2-page-builder-ee/app project-enterprise-edition/
    cp -r magento2-page-builder-ee/dev project-enterprise-edition/
    ```
6. Enable Page Builder module using the following command:
    ``` sh
    bin/magento setup:upgrade
    ```

## Update steps

When a new version of Page Builder is available, destroy your existing 2.3.0-alpha instance and follow the [composer](install-pagebuilder.md#composer-installation) or [GitHub](install-pagebuilder.md#github-installation) installation steps.

## Troubleshooting

### Page Builder repositories access problems

If you are having trouble accessing PageBuilder repositories, please contact [Igor Melnykov] or [Olena Tkacheva].

### 2.3 alpha installation problems

If you run into any of the following errors:

```shell
Could not find package magento/project-enterprise-edition with version 2.3.0-alpha.
```

```shell
Could not find a matching version of package magento/module-page-builder-commerce. Check the package spelling, your version constraint and that the package is available in a stability which matches your minimum-stability (stable).
```

Check your composer keys in the `auth.json` file.
If these keys are correct and you still encounter these errors, please contact [Igor Melnykov] or [Olena Tkacheva].

[Olena Tkacheva]: https://magentocommeng.slack.com/messages/@UAFV915FB

<!-- {% endraw %} -->
