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
    protected $defaultBlock = '\Gene\BlueFoot\Block\Entity\PageBuilder\Block';

    /**
     * Default template used if a content block doesn't have an assigned template
     *
     * @var string
     */
    protected $defaultTemplate = 'Gene_BlueFoot::pagebuilder/structural/core/default.phtml';

    /**
     * @var \Gene\BlueFoot\Model\Stage\Save\Renderer\BlockFactory
     */
    protected $advancedCmsBlockFactory;

    /**
     * Renderer constructor.
     *
     * @param \Gene\BlueFoot\Model\Config                           $config
     * @param \Magento\Framework\View\LayoutInterface               $layoutInterface
     * @param \Magento\Store\Model\App\Emulation                    $emulation
     * @param \Magento\Framework\App\State                          $appState
     * @param \Gajus\Dindent\Indenter                               $indenter
     * @param \Gene\BlueFoot\Model\Stage\Save\Renderer\BlockFactory $advancedCmsBlockFactory
     * @param int                                                   $storeId
     * @param bool                                                  $object
     * @param bool                                                  $genericBlock
     */
    public function __construct(
        \Gene\BlueFoot\Model\Config $config,
        \Magento\Framework\View\LayoutInterface $layoutInterface,
        \Magento\Store\Model\App\Emulation $emulation,
        \Magento\Framework\App\State $appState,
        \Gajus\Dindent\Indenter $indenter,
        \Gene\BlueFoot\Model\Stage\Save\Renderer\BlockFactory $advancedCmsBlockFactory,
        $storeId = 0,
        $object = false,
        $genericBlock = false
    ) {
        $this->config = $config;
        $this->layoutInterface = $layoutInterface;
        $this->emulation = $emulation;
        $this->appState = $appState;
        $this->indenter = $indenter;
        $this->advancedCmsBlockFactory = $advancedCmsBlockFactory;
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
     *
     * @return string
     */
    public function render(Parser\Element $element)
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

        // Indent the output for human readability
        return $this->indenter->indent($output);
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
        $config = $this->getRenderingConfig($element);
        if ($config && isset($config['frontend']['block'])) {
            $blockType = $config['frontend']['block'];
        } else {
            $blockType = $this->defaultBlock;
        }

        // Determine if the block has a specific template set in the config
        $template = (isset($config['frontend']['template']) ? $config['frontend']['template'] : false);

        // Retrieve the block
        $block = $this->retrieveBlock(
            $blockType,
            $element,
            $template
        );

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
     * Retrieve a block from the front-end application
     *
     * @param                                                $type
     * @param \Gene\BlueFoot\Model\Stage\Save\Parser\Element $element
     * @param bool                                           $template
     *
     * @return \Magento\Framework\View\Element\Template
     * @throws \Exception
     */
    protected function retrieveBlock($type, Parser\Element $element, $template = false)
    {
        /* @var $block \Magento\Framework\View\Element\Template */
        $block = $this->layoutInterface->createBlock($type, '', [
            'element' => $element
        ]);

        // Validate the block correctly implemented the advanced CMS functionality, only in development mode
        if ($this->appState->getMode() == \Magento\Framework\App\State::MODE_DEVELOPER) {
            if (!method_exists($block, 'getAdvancedCms')) {
                throw new \Exception(
                    get_class($block) . ' must implemented a getAdvancedCms() method returning an instance of 
                    \Gene\BlueFoot\Model\Stage\Save\Renderer\Block'
                );
            }
        }

        $block->setTemplate(($template ? $template : $this->defaultTemplate));
        return $block;
    }
}
