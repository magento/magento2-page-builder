<?php

namespace Gene\BlueFoot\Block\Entity\PageBuilder\Structural;

/**
 * Class Row
 *
 * @package Gene\BlueFoot\Block\Entity\PageBuilder\Structural
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Row extends \Magento\Framework\View\Element\Template
{
    /**
     * @var \Gene\BlueFoot\Model\Stage\Save\Renderer\Block
     */
    protected $advancedCms;

    /**
     * Row constructor.
     *
     * @param \Magento\Framework\View\Element\Template\Context      $context
     * @param \Gene\BlueFoot\Model\Stage\Save\Renderer\BlockFactory $advancedCmsFactory
     * @param \Gene\BlueFoot\Model\Stage\Save\Parser\Element        $element
     * @param array                                                 $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Gene\BlueFoot\Model\Stage\Save\Renderer\BlockFactory $advancedCmsFactory,
        \Gene\BlueFoot\Model\Stage\Save\Parser\Element $element,
        array $data = []
    ) {
        parent::__construct($context, $data);

        $this->advancedCms = $advancedCmsFactory->create([
            'element' => $element
        ]);
    }

    /**
     * Return advanced CMS instance
     *
     * @return \Gene\BlueFoot\Model\Stage\Save\Renderer\Block
     */
    public function getAdvancedCms()
    {
        return $this->advancedCms;
    }
}
