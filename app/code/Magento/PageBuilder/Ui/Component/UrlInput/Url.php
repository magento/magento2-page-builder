<?php
/**
 * Copyright 2021 Adobe
 * All Rights Reserved.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Ui\Component\UrlInput;

/** Provides configuration for url input link */
class Url implements \Magento\Ui\Model\UrlInput\ConfigInterface
{
    /**
     * @inheritdoc
     */
    public function getConfig(): array
    {
        return [
            'label' => __('URL'),
            'component' => 'Magento_Ui/js/form/element/abstract',
            'template' => 'Magento_PageBuilder/form/element/input-no-maxlength',
            'sortOrder' => 20
        ];
    }
}
