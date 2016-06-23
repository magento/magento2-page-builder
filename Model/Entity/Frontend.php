<?php

namespace Gene\BlueFoot\Model\Entity;

/**
 * Class Frontend
 *
 * @package Gene\BlueFoot\Model\Entity
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Frontend extends \Magento\Framework\Model\AbstractModel
{
    /**
     * The default renderer for any block without a defined renderer
     *
     * @var string
     */
    protected $_defaultRenderer = 'Gene\BlueFoot\Block\Entity\PageBuilder\Block\AbstractBlock';

    /**
     * The default template for any block without a template
     *
     * @var string
     */
    protected $_defaultTemplate = 'Gene_BlueFoot::pagebuilder/blocks/core/basic/blank.phtml';

    /**
     * @var \Gene\BlueFoot\Model\Config\ConfigInterface
     */
    protected $_configInterface;

    /**
     * Frontend constructor.
     *
     * @param \Magento\Framework\Model\Context                             $context
     * @param \Magento\Framework\Registry                                  $registry
     * @param \Gene\BlueFoot\Model\Config\ConfigInterface                  $configInterface
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null           $resourceCollection
     * @param array                                                        $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        $this->_configInterface = $configInterface;

        parent::__construct($context, $registry, $resource, $resourceCollection, $data);
    }

    /**
     * Return the rendering block for this entity
     *
     * @param \Magento\Framework\View\Layout $layout
     *
     * @return bool|\Magento\Framework\View\Element\BlockInterface
     */
    public function getRenderBlock(\Magento\Framework\View\Layout $layout)
    {
        /* @var $entity \Gene\BlueFoot\Model\Entity */
        if ($entity = $this->getEntity()) {
            $blockName = $this->_defaultRenderer;

            // Can we load the content block, and does the content block have a renderer?
            if (($contentBlock = $entity->getContentBlock()) && $renderer = $contentBlock->getRenderer()) {
                if ($blockClass = $this->_configInterface->getRendererClass($renderer)) {
                    $blockName = $blockClass;
                }
            }

            $block = $layout->createBlock($blockName);
            if ($block && method_exists($block, 'toHtml')) {
                $block->setEntity($entity);
                return $block;
            }
        }

        return false;
    }

    /**
     * Return the view template for the entity
     *
     * @return bool|string
     */
    public function getViewTemplate()
    {
        /* @var $entity \Gene\BlueFoot\Model\Entity */
        if ($entity = $this->getEntity()) {
            $viewTemplate = $this->_defaultTemplate;

            // Can we load the content block, and does the content block have a renderer?
            if (($contentBlock = $entity->getContentBlock()) && $itemViewTemplate = $contentBlock->getItemViewTemplate()) {
                if ($templateFile = $this->_configInterface->getTemplateFile($itemViewTemplate)) {
                    $viewTemplate = $templateFile;
                }
            }

            return $viewTemplate;
        }

        return false;
    }
}