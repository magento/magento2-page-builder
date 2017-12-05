<?php

namespace Gene\BlueFoot\Block\Entity\PageBuilder;

/**
 * Class Block
 *
 * @package Gene\BlueFoot\Block\Entity\PageBuilder\Structural
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Block extends \Magento\Framework\View\Element\Template implements BlockInterface
{
    /**
     * @var \Gene\BlueFoot\Model\Stage\Save\Parser\Element
     */
    protected $element;

    /**
     * @var \Gene\BlueFoot\Model\Stage\Save\Renderer\BlockFactory
     */
    protected $advancedCmsFactory;

    /**
     * @var \Gene\BlueFoot\Model\Stage\Save\Renderer\Block|null
     */
    protected $advancedCms = null;

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
        $this->element = $element;
        $this->advancedCmsFactory = $advancedCmsFactory;
        parent::__construct($context, $data);
    }

    /**
     * Retrieve the instance of the advanced CMS block
     *
     * @return \Gene\BlueFoot\Model\Stage\Save\Renderer\Block|null
     * @throws \Exception
     */
    public function getAdvancedCms()
    {
        if (!$this->element->getRole()) {
            throw new \Exception(
                'Advanced CMS block must have an instance of \Gene\BlueFoot\Model\Stage\Save\Parser\Element 
                injected into it.'
            );
        }

        if ($this->advancedCms === null) {
            $this->advancedCms = $this->advancedCmsFactory->create([
                'element' => $this->element
            ]);
        }

        return $this->advancedCms;
    }
}
