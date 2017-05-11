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
            return $this->indenter->indent($output);
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
        $config = $this->getRenderingConfig($element);
        if ($config && isset($config['frontend']['block'])) {
            $blockType = $config['frontend']['block'];
        } else {
            $blockType = $this->genericBlock;
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
            $block->setData([
                'element' => $element,
                'renderer' => $this
            ]);

            // Convert the block to HTML
            return $block;
        }

        return false;
    }

    /**
     * Embed meta data into the blocks output
     *
     * @param                                                       $html
     * @param \Gene\BlueFoot\Block\Entity\PageBuilder\AbstractBlock $block
     *
     * @return string
     * @throws \Exception
     */
    public function embedMetadataIntoBlockOutput($html, \Gene\BlueFoot\Block\Entity\PageBuilder\AbstractBlock $block)
    {
        // Create a dom document of the blocks output
        $dom = new \DOMDocument();
        $dom->preserveWhiteSpace = false;
        $dom->formatOutput = true;
        $dom->loadHTML(
            mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'),
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );

        // Count nodes within html
        $elementCount = 0;
        $rootNode = false;
        foreach ($dom->childNodes as $childNode) {
            if ($childNode instanceof \DOMElement) {
                ++$elementCount;

                // All blocks must contain a single root level node
                if ($elementCount > 1) {
                    throw new \Exception(
                        'All advanced CMS block templates must contain one root level node. ' . $block->getTemplate() .
                        ' contains ' . $elementCount . '.'
                    );
                }

                $rootNode = $childNode;
            }
        }

        // Add the data-role attribute
        if (!$rootNode->hasAttribute('data-role')) {
            $rootNode->setAttribute('data-role', $block->getElement()->getRole());
        }

        // Add in the data script tag
        $blockData = ($block->getElement()->getData() ? json_encode($block->getElement()->getData()) : '');
        $dataTag = $dom->createElement('script', $blockData);
        $dataTag->setAttribute('type', 'text/advanced-cms-data');
        $dataTag->setAttribute('data-checksum', md5($blockData));
        $rootNode->insertBefore($dataTag, $rootNode->childNodes->item(0));

        // Return the new HTML
        return $dom->saveHTML();
    }
}
