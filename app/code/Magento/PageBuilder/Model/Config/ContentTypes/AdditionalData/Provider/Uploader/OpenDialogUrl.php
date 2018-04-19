<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentTypes\AdditionalData\Provider\Uploader;

use Magento\PageBuilder\Model\Config\ContentTypes\AdditionalData\ProviderInterface;
use Magento\Framework\View\Element\UiComponent\ContextInterface;

class OpenDialogUrl implements ProviderInterface
{
    /**
     * @var ContextInterface
     */
    private $context;

    /**
     * @param ContextInterface $context
     */
    public function __construct(ContextInterface $context)
    {
        $this->context = $context;
    }

    /**
     * @inheritdoc
     */
    public function getData()
    {
        return $this->context->getUrl('cms/wysiwyg_images/index');
    }
}
