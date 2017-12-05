<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model\Template;

class Filter
{
    /**
     * @var Config
     */
    private $config;

    /**
     * @var \Magento\Framework\View\Element\BlockFactory
     */
    private $blockFactory;

    /**
     * @var \Psr\Log\LoggerInterface
     */
    private $logger;

    /**
     * @var \Magento\Framework\View\Layout
     */
    private $layout;

    /**
     * Constructor
     *
     * @param \Gene\BlueFoot\Model\Config $config
     * @param \Magento\Framework\View\Element\BlockFactory $blockFactory
     * @param \Psr\Log\LoggerInterface $logger
     * @param \Magento\Framework\View\Layout $layout
     */
    public function __construct(
        \Gene\BlueFoot\Model\Config $config,
        \Magento\Framework\View\Element\BlockFactory $blockFactory,
        \Psr\Log\LoggerInterface $logger,
        \Magento\Framework\View\Layout $layout
    ) {
        $this->config = $config;
        $this->blockFactory = $blockFactory;
        $this->logger = $logger;
        $this->layout = $layout;
    }

    /**
     * Replace dynamic blocks with actual content
     *
     * @param string $html
     * @return string
     */
    public function filter($html)
    {
        $domDocument = new \DOMDocument('1.0', 'UTF-8');
        set_error_handler(
            function ($errorNumber, $errorString) {
                throw new \Exception($errorString, $errorNumber);
            }
        );
        $string = mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8');
        $wrapperElementId = uniqid();
        try {
            $domDocument->loadHTML(
                '<html><body id="' . $wrapperElementId . '">' . $string . '</body></html>'
            );
        } catch (\Exception $e) {
            restore_error_handler();
            $this->logger->critical($e);
        }
        restore_error_handler();
        $xpath = new \DOMXPath($domDocument);

        $contentTypes = $this->config->getContentTypes();

        $dynamicContentTypes = [];
        foreach ($contentTypes as $contentType => $contentTypeData) {
            if (isset($contentTypeData['backend_block'])) {
                $dynamicContentTypes[] = $contentType;
            }
        }

        if (count($dynamicContentTypes) === 0) {
            return $html;
        }

        $conditions = [];
        foreach ($dynamicContentTypes as $contentType) {
            $conditions[] = '@data-role = "' . $contentType . '"';
        }

        $nodes = $xpath->query('//*[' . implode(' or ', $conditions) . ']');
        $replacements = [];
        foreach ($nodes as $node) {
            $data = [];
            foreach ($node->attributes as $attribute) {
                $attributeName = str_replace(['data-', '-'], ['', '_'], $attribute->nodeName);
                $data[$attributeName] = $attribute->nodeValue;
            }
            $backendBlockClassName = $contentTypes[$node->getAttribute('data-role')]['backend_block'];
            $backendBlockTemplate = isset($contentTypes[$node->getAttribute('data-role')]['backend_template'])
                ? $contentTypes[$node->getAttribute('data-role')]['backend_template'] : false;
            if ($backendBlockTemplate) {
                $data['template'] = $backendBlockTemplate;
            }
            $backendBlockInstance = $this->blockFactory->createBlock(
                $backendBlockClassName,
                ['data' => $data]
            );
            $this->layout->addBlock($backendBlockInstance);
            $uniqueIdentifier = 'block-' . uniqid();
            $replacements[$uniqueIdentifier] = $backendBlockInstance->toHtml();
            $node->parentNode->replaceChild($domDocument->createTextNode($uniqueIdentifier), $node);
        }
        preg_match(
            '/<body id="' . $wrapperElementId . '">(.+)<\/body><\/html>$/si',
            mb_convert_encoding($domDocument->saveHTML(), 'UTF-8', 'HTML-ENTITIES'),
            $matches
        );
        return str_replace(
            array_keys($replacements),
            $replacements,
            !empty($matches) ? $matches[1] : ''
        );
    }
}
