<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Block;

use Magento\Framework\View\Element\Template;

/**
 * Class WidgetInitializer provides configuration for content types widgets need to be loaded on frontend
 * @api
 */
class WidgetInitializer extends Template
{
    /**
     * @var \Magento\Framework\Serialize\SerializerInterface
     */
    private $jsonEncoder;

    /**
     * WidgetInitializer constructor.
     * @param Template\Context $context
     * @param \Magento\Framework\Serialize\SerializerInterface $jsonEncoder
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\Serialize\SerializerInterface $jsonEncoder,
        array $data = []
    ) {
        $this->jsonEncoder = $jsonEncoder;
        parent::__construct($context, $data);
    }

    /**
     * Returns config for widgets initializer component.
     * @return string
     * @api
     */
    public function getConfig() : string
    {
        $widgetsConfig = $this->getData('config');
        $resultConfig = [];
        foreach ($widgetsConfig as $contentTypeName => $config) {
            $selector = sprintf('div[data-role="%s"]', $contentTypeName);
            foreach ($config as $item) {
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
        return $this->jsonEncoder->serialize($resultConfig);
    }
}
