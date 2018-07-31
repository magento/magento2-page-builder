<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Block;

use Magento\Framework\View\Element\Template;
use Magento\Framework\DataObject;

/**
 * @api
 */
class WysiwygSetup extends Template
{
    /**
     * @var \Magento\Ui\Component\Wysiwyg\ConfigInterface
     */
    private $config;

    /**
     * @param Template\Context $context
     * @param \Magento\Ui\Component\Wysiwyg\ConfigInterface $config
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Ui\Component\Wysiwyg\ConfigInterface $config,
        array $data = []
    ) {
        $this->config = $config;
        parent::__construct($context, $data);
    }

    /**
     * Get config for wysiwyg initialization
     *
     * @return string
     */
    public function getConfigJson() : string
    {
        $config = $this->config->getConfig();

        if (is_array($config)) {
            $config = new DataObject($config);
        }

        return $config->toJson();
    }
}
