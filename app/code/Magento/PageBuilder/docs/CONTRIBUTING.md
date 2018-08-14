# Contributing to Magento 2 code

## Navigation

1. [Introduction]
2. [Installation guide]
3. **Contribution guide**
    1. [Overview](#overview)
    1. [Contribution requirements](#contribution-requirements)
    1. [Contribution process](#contribution-process)
    1. [Code of Conduct](#code-of-conduct)
4. [Developer documentation]
5. [Roadmap and known issues]
6. [How to create custom PageBuilder content type container]

[Introduction]: README.md
[Contribution guide]: CONTRIBUTING.md
[Installation guide]: install.md
[Developer documentation]: developer-documentation.md
[Architecture overview]: architecture-overview.md
[BlueFoot to PageBuilder data migration]: bluefoot-data-migration.md
[Third-party content type migration]: new-content-type-example.md
[Iconography]: iconography.md
[Add image uploader to content type]: image-uploader.md
[Module integration]: module-integration.md
[Additional data configuration]: custom-configuration.md
[Content type configuration]: content-type-configuration.md
[How to add a new content type]: how-to-add-new-content-type.md
[Events]: events.md
[Bindings]: bindings.md
[Master format]: master-format.md
[Visual select]: visual-select.md
[Reuse product conditions in content types]: product-conditions.md
[Store component master format as widget directive]: widget-directive.md
[Use the block chooser UI component]: block-chooser-component.md
[Use the inline text editing component]: inline-editing-component.md
[Render a backend content type preview]: content-type-preview.md
[Custom Toolbar]: toolbar.md
[Full width page layouts]: full-width-page-layouts.md
[Add image uploader to content type]: image-uploader.md
[Roadmap and Known Issues]: roadmap.md
[How to create custom PageBuilder content type container]: how-to-create-custom-content-type-container.md

## Overview

Contributions to the Magento 2 codebase are done using the fork & pull model.
This contribution model has contributors maintaining their own copy of the forked codebase (which can easily be synced with the main copy). The forked repository is then used to submit a request to the base repository to “pull” a set of changes (hence the phrase “pull request”).

Contributions can take the form of new components/features, changes to existing features, tests, documentation (such as developer guides, user guides, examples, or specifications), bug fixes, optimizations or just good suggestions.

The Magento 2 development team will review all issues and contributions submitted by the community of developers in the first in, first out order. During the review we might require clarifications from the contributor. If there is no response from the contributor for two weeks, the issue is closed.


## Contribution requirements

1. Contributions must adhere to [Magento coding standards](http://devdocs.magento.com/guides/v2.0/coding-standards/bk-coding-standards.html).
2. Pull requests (PRs) must be accompanied by a meaningful description of their purpose. Comprehensive descriptions increase the chances of a pull request to be merged quickly and without additional clarification requests.
3. Commits must be accompanied by meaningful commit messages.
4. PRs which include bug fixing, must be accompanied with step-by-step description of how to reproduce the bug.
3. PRs which include new logic or new features must be submitted along with:
* Unit/integration test coverage where applicable.
* Updated documentation in the module directory `app/code/PageBuilder/docs`.
4. For large features or changes, please [open an issue](https://github.com/magento/magento2/issues) and discuss first. This may prevent duplicate or unnecessary effort, and it may gain you some additional contributors.
5. All automated tests are passed successfully locally. After PR submitted Magento team will run builds on continuous integration environment.

## Contribution process

If you are a new GitHub user, we recommend that you create your own [free github account](https://github.com/signup/free). By doing that, you will be able to collaborate with the Magento 2 development team, “fork” the Magento 2 project and be able to easily send “pull requests”.

1. Search current [listed issues](https://github.com/magento/magento2-page-builder/issues) on GitHub (open or closed) and [list of known issues](roadmap.md#Known Issues) on our roadmap for similar proposals of intended contribution before starting work on a new contribution.
2. Please contact us in Slack chanel if you want to work on issue from [list of known issues](roadmap.md#Known Issues).
2. Review the [Contributor License Agreement](https://magento.com/legaldocuments/mca) if this is your first time contributing.
3. Create and test your work.
4. Fork the Magento 2 repository according to [Fork a repository instructions](http://devdocs.magento.com/guides/v2.0/contributor-guide/contributing.html#fork) and when you are ready to send us a pull request – follow [Create a pull request instructions](http://devdocs.magento.com/guides/v2.0/contributor-guide/contributing.html#pull_request). Instructions written for `https://github.com/magento/magento2` repository, but they also apply to `https://github.com/magento/magento2-page-builder`.
5. Once your contribution is received, Magento 2 development team will review the contribution and collaborate with you as needed to improve the quality of the contribution.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. We expect you to agree to its terms when participating in this project.
The full text is available in the repository [Wiki](https://github.com/magento/magento2/wiki/Magento-Code-of-Conduct).
