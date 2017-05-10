<?php

namespace Gene\BlueFoot\Model\Stage\Save;

/**
 * Class Renderer
 *
 * @package Gene\BlueFoot\Model\Stage\Save
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Renderer
{
    /**
     * @var \Gene\BlueFoot\Model\Config
     */
    protected $config;

    /**
     * @var \Magento\Framework\View\LayoutInterface
     */
    protected $layoutInterface;

    /**
     * @var \Magento\Store\Model\App\Emulation
     */
    protected $emulation;

    /**
     * @var int
     */
    protected $storeId;

    /**
     * @var \Magento\Framework\App\State
     */
    protected $appState;

    /**
     * @var bool
     */
    protected $object;

    /**
     * @var \Gajus\Dindent\Indenter
     */
    protected $indenter;

    /**
     * @var string
     */
    protected $genericBlock = '\Gene\BlueFoot\Block\Entity\PageBuilder\Generic';

    /**
     * Dictate which attributes will be merged on the wrapping elements
     *
     * @var array
     */
    protected $mergeAttributes = [
        'style',
        'class'
    ];

    /**
     * Which attributes should never be merged?
     *
     * @var array
     */
    protected $protectedAttributes = [
        'data-role'
    ];

    /**
     * Renderer constructor.
     *
     * @param \Gene\BlueFoot\Model\Config             $config
     * @param \Magento\Framework\View\LayoutInterface $layoutInterface
     * @param \Magento\Store\Model\App\Emulation      $emulation
     * @param \Magento\Framework\App\State            $appState
     * @param \Gajus\Dindent\Indenter                 $indenter
     * @param int                                     $storeId
     * @param bool                                    $object
     * @param bool                                    $genericBlock
     */
    public function __construct(
        \Gene\BlueFoot\Model\Config $config,
        \Magento\Framework\View\LayoutInterface $layoutInterface,
        \Magento\Store\Model\App\Emulation $emulation,
        \Magento\Framework\App\State $appState,
        \Gajus\Dindent\Indenter $indenter,
        $storeId = 0,
        $object = false,
        $genericBlock = false
    ) {
        $this->config = $config;
        $this->layoutInterface = $layoutInterface;
        $this->emulation = $emulation;
        $this->appState = $appState;
        $this->indenter = $indenter;
        $this->storeId = $storeId;
        $this->object = $object;

        if ($genericBlock) {
            $this->genericBlock = $genericBlock;
        }
    }

    /**
     * Render an individual element
     *
     * @param \Gene\BlueFoot\Model\Stage\Save\Parser\Element $element
     * @param bool                                           $indentOutput
     *
     * @return string
     */
    public function render(Parser\Element $element, $indentOutput = true)
    {
        // Emulate the store ID
        $this->emulation->startEnvironmentEmulation(
            $this->storeId,
            \Magento\Framework\App\Area::AREA_FRONTEND,
            true
        );

        // Emulate the app state's area code
        $output = $this->appState->emulateAreaCode(
            \Magento\Framework\App\Area::AREA_FRONTEND,
            function () use ($element) {
                // Retrieve the block and it's children for the current element
                $block = $this->retrieveBlockTree($element);
                return $block->toHtml();
            }
        );

        $this->emulation->stopEnvironmentEmulation();
        if ($indentOutput) {
            $output = $this->indenter->indent($output);
        }
        return $output;
    }

    /**
     * Retrieve the block tree for a specific element
     *
     * @param \Gene\BlueFoot\Model\Stage\Save\Parser\Element $element
     *
     * @return \Magento\Framework\View\Element\Template
     */
    public function retrieveBlockTree(Parser\Element $element)
    {
        // Retrieve the content block for an element
        if ($config = $this->getRenderingConfig($element)) {
            $block = $this->retrieveElementBlock($element, $config);
        } else {
            $block = $this->retrieveGenericBlock($element);
        }

        // Iterate through children and render them
        if ($element->hasChildren()) {
            $count = 0;
            /* @var $child Parser\Element */
            foreach ($element->getChildren() as $child) {
                $alias = $element->getRole() . '.' . $child->getRole() . '_' . $count;
                $block->setChild(
                    $alias, /* Generate an alias for the block */
                    $this->retrieveBlockTree($child)
                );
                ++$count;
            }
        }

        return $block;
    }

    /**
     * Retrieve the rendering config
     *
     * @param \Gene\BlueFoot\Model\Stage\Save\Parser\Element $element
     *
     * @return array|mixed|null
     */
    protected function getRenderingConfig(Parser\Element $element)
    {
        return $this->config->getContentBlock($element->getRole());
    }

    /**
     * Retrieve an elements block
     *
     * @param \Gene\BlueFoot\Model\Stage\Save\Parser\Element $element
     * @param                                                $config
     *
     * @return \Magento\Framework\View\Element\Template
     */
    protected function retrieveElementBlock(Parser\Element $element, $config)
    {
        if (isset($config['frontend']['block'])) {
            $template = (isset($config['frontend']['template']) ? $config['frontend']['template'] : false);
            $block = $this->retrieveBlock(
                $config['frontend']['block'],
                $element,
                $template
            );
            return $block;
        }

        return $this->retrieveGenericBlock($element);
    }

    /**
     * Retrieve a generic block for elements that don't have a custom block renderer
     *
     * @param \Gene\BlueFoot\Model\Stage\Save\Parser\Element $element
     *
     * @return \Magento\Framework\View\Element\Template
     */
    protected function retrieveGenericBlock(Parser\Element $element)
    {
        return $this->retrieveBlock($this->genericBlock, $element);
    }

    /**
     * Retrieve a block from the front-end application
     *
     * @param                                                $type
     * @param \Gene\BlueFoot\Model\Stage\Save\Parser\Element $element
     * @param bool                                           $template
     *
     * @return mixed
     */
    protected function retrieveBlock($type, Parser\Element $element, $template = false)
    {
        /* @var $block \Gene\BlueFoot\Block\Entity\PageBuilder\AbstractBlock */
        $block = $this->layoutInterface->createBlock($type);
        if ($block) {
            if ($template) {
                $block->setTemplate($template);
            }

            // Pass over the entity data to the block
            $block->setData('entity_data', $element->getData());

            // Add required attributes to the block
            $block->addAttribute('data-role', $element->getRole());

            // Convert the block to HTML
            return $block;
        }

        return false;
    }
}
