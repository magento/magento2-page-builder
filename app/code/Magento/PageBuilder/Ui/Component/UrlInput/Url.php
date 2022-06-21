<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
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
