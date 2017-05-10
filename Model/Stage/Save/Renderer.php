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
     * Renderer constructor.
     *
     * @param \Gene\BlueFoot\Model\Config             $config
     * @param \Magento\Framework\View\LayoutInterface $layoutInterface
     * @param \Magento\Store\Model\App\Emulation      $emulation
     * @param \Magento\Framework\App\State            $appState
     * @param int                                     $storeId
     */
    public function __construct(
        \Gene\BlueFoot\Model\Config $config,
        \Magento\Framework\View\LayoutInterface $layoutInterface,
        \Magento\Store\Model\App\Emulation $emulation,
        \Magento\Framework\App\State $appState,
        $storeId = 0
    ) {
        $this->config = $config;
        $this->layoutInterface = $layoutInterface;
        $this->emulation = $emulation;
        $this->appState = $appState;
        $this->storeId = $storeId;
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
        $domElement = $element->getDOMElement();

        // Retrieve the content block for an element
        if ($config = $this->getRenderingConfig($element)) {
            $blockHtml = $this->renderElementBlock($element, $config);

            // Append the block HTML into the child of the dom element
            $fragment = $domElement->ownerDocument->createDocumentFragment();
            $fragment->appendXML($blockHtml);
            $domElement->appendChild($fragment);
        }

        if ($element->hasChildren()) {
            $childHtml = '';
            foreach ($element->getChildren() as $child) {
                $childHtml = $this->render($child);
            }
        }

        return $domElement->ownerDocument->saveHTML($domElement);
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
     * Render an elements block
     *
     * @param \Gene\BlueFoot\Model\Stage\Save\Parser\Element $element
     * @param                                                $config
     *
     * @return string
     */
    protected function renderElementBlock(Parser\Element $element, $config)
    {
        if (isset($config['frontend']['block'])) {
            // Emulate the store ID
            $this->emulation->startEnvironmentEmulation(
                $this->storeId,
                \Magento\Framework\App\Area::AREA_FRONTEND,
                true
            );

            // Emulate the app state's area code
            $html = $this->appState->emulateAreaCode(
                \Magento\Framework\App\Area::AREA_FRONTEND,
                function () use ($element, $config) {
                    /* @var $block \Magento\Framework\View\Element\Template */
                    $block = $this->layoutInterface->createBlock($config['frontend']['block']);
                    if ($block) {
                        if (isset($config['frontend']['template'])) {
                            $block->setTemplate($config['frontend']['template']);
                        }

                        // Hand over the entity data
                        $block->setData('entity_data', $element->getData());

                        // Convert the block to HTML
                        return $block->toHtml();
                    }
                }
            );

            $this->emulation->stopEnvironmentEmulation();
            return $html;
        }

        return '';
    }
}
