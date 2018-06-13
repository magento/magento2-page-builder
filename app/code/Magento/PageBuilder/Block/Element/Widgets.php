<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Block\Element;

use Magento\Framework\View\Element\Template;

/**
 * Class Widgets provides configuration for content types widgets need to be loaded on frontend
 */
class Widgets extends Template
{

    /**
     * @var \Magento\Framework\Json\EncoderInterface
     */
    private $jsonEncoder;

    /**
     * Widgets constructor.
     * @param \Magento\Framework\Json\EncoderInterface $jsonEncoder
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\Json\EncoderInterface $jsonEncoder,
        array $data = []
    ) {
        $this->jsonEncoder = $jsonEncoder;
        parent::__construct($context, $data);
    }

    /**
     * Returns config for widgets initializer component
     * @return string
     */
    public function getConfig() : string
    {
        $widgetsConfig = $this->getData('config');
        $resultConfig = [];
        foreach ($widgetsConfig as $contentTypeName => $config) {
            $selector = sprintf('div[data-role="%s"]', $contentTypeName);
            foreach ($config as $appearanceName => $item) {
                if (!isset($item['component'])) {
                    continue;
                }
                if (isset($item['appearance'])) {
                    $selector .= sprintf('[data-appearance="%s"]', $item['appearance']);
                }
                $componentConfig = isset($item['config']) ? $item['config'] : '{}';
                $resultConfig[$selector] = [$item['component'] => $componentConfig];
            }

        }
        return $this->jsonEncoder->encode($resultConfig);
    }
}
