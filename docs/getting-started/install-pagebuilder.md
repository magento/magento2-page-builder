# Install Page Builder

## Prerequisites

You must be an active member in the Page Builder EAP program and have submitted your MAGEID to be provided access to the Page Builder composer packages through `repo.magento.com`. If you have not done so, or are experiencing problems please contact us at `pagebuilderEAP@adobe.com`. 

## Installation Steps

1. Upgrade an existing project to Magento 2.3.0 Commerce or install a fresh copy. Instructions for installation can be found [here](https://devdocs.magento.com/guides/v2.3/install-gde/bk-install-guide.html). **Use the MAGEID assigned to you when you signed up to the program.**

2. Navigate to the root of the project and require the `magento/module-page-builder-commerce` package:
    ```
    composer require magento/page-builder-commerce
    ```
    
3. Enable the module within Magento:
    ``` sh
    bin/magento setup:upgrade
    ```
    
{: .bs-callout .bs-callout-info }
If you have had a previous version of Magento 2.3.0 or Page Builder installed you may need to clear your composer cache (`composer clearcache`) to ensure the latest packages of both versions are installed.

## Updating

We plan to release a new version of Page Builder beta every week.
This can be install by completing a `composer update` within your project.

## Troubleshooting

### Composer Installation issues

If you run into the following issue:

```shell
Could not find a matching version of package magento/module-page-builder-commerce. Check the package spelling, your version constraint and that the package is available in a stability which matches your minimum-stability (stable).
```

Please ensure the credentials you're using to connect with `repo.magento.com` belong to the MAGEID you provided when you signed up to the EAP program.