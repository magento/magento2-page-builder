<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model\Attribute\Data\Widget;

/**
 * Class Map
 */
class Video extends \Gene\BlueFoot\Model\Attribute\Data\AbstractWidget implements
    \Gene\BlueFoot\Model\Attribute\Data\WidgetInterface
{

    /**
     * @param \Magento\Framework\Model\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param \Gene\BlueFoot\Helper\Widget\Video $helper
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null $resourceCollection
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Gene\BlueFoot\Helper\Widget\Video $helper,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        $this->helper = $helper;
        parent::__construct($context, $registry, $resource, $resourceCollection, $data);
    }

    /**
     * Return Video data from the given field
     *
     * @return mixed
     */
    public function getVideo()
    {
        return $this->getEntity()->getData($this->getAttribute()->getData('attribute_code'));
    }

    /**
     * Return an array of basic product data used by the page builder
     *
     * @return array
     */
    public function asJson()
    {
        $url = $this->helper->previewAction($this->getVideo());

        return [
            'url' => $url
        ];
    }
}
