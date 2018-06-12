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
        $config = $this->getData('config');
        //todo have config as
//        ['div[data-role="slider"][data-appearance="default]' =>
//            [
//                'componentName' => ['componentConfig']
//            ]
//        ]
        return $this->jsonEncoder->encode($config);
    }
}

