<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Block\Element;

use Magento\Framework\View\Element\Template;

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

    public function getConfig()
    {
        $widgetsConfig = $this->getData('config');
        $resultConfig = [];
//        ['div[data-role="slider"][data-appearance="default]' =>
//            [
//                'componentName' => ['componentConfig']
//            ]
//        ]
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

