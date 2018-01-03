<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model\Attribute\Data\Widget;

/**
 * Class StaticBlock
 */
class StaticBlock extends \Gene\BlueFoot\Model\Attribute\Data\AbstractWidget implements
    \Gene\BlueFoot\Model\Attribute\Data\WidgetInterface
{

    /**
     * StaticBlock constructor.
     *
     * @param \Magento\Framework\Model\Context                             $context
     * @param \Magento\Framework\Registry                                  $registry
     * @param \Magento\Cms\Model\BlockFactory                              $blockFactory
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null           $resourceCollection
     * @param array                                                        $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Cms\Model\BlockFactory $blockFactory,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        parent::__construct($context, $registry, $resource, $resourceCollection, $data);
        $this->blockFactory = $blockFactory;
        $this->render = $render;
    }

    /**
     * Return Video data from the given field
     *
     * @return mixed
     */
    public function getBlock()
    {
        $block = $this->blockFactory->create();
        return $block->load($this->getEntity()->getData($this->getAttribute()->getData('attribute_code')));
    }

    /**
     * Return an array of basic block data used by the page builder
     *
     * @return array
     */
    public function asJson()
    {
        $block = $this->getBlock();

        $content = $this->render->renderPlaceholders($block->getContent());

        return [
            'title' => $block->getTitle(),
            'identifier' => $block->getIdentifier(),
            'content' => $content
        ];
    }
}
