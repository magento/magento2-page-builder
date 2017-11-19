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
     * Constructor
     *
     * @param Config $config
     * @param \Magento\Framework\View\Element\BlockFactory $blockFactory
     * @param \Psr\Log\LoggerInterface $logger
     */
    public function __construct(
        \Gene\BlueFoot\Model\Config $config,
        \Magento\Framework\View\Element\BlockFactory $blockFactory,
        \Psr\Log\LoggerInterface $logger
    ) {
        $this->config = $config;
        $this->blockFactory = $blockFactory;
        $this->logger = $logger;
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
        try {
            $domDocument->loadXML($string);
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
        foreach ($nodes as $node) {
            $backendBlockClassName = $contentTypes[$node->getAttribute('data-role')]['backend_block'];
            $backendBlockTemplate = $contentTypes[$node->getAttribute('data-role')]['backend_template'];
            $data = [];
            foreach ($node->attributes as $attribute) {
                $attributeName = str_replace(['data-', '-'], ['', '_'], $attribute->nodeName);
                $data[$attributeName] = $attribute->nodeValue;
            }
            if ($backendBlockTemplate) {
                $data['template'] = $backendBlockTemplate;
            }
            $backendBlockInstance = $this->blockFactory->createBlock(
                $backendBlockClassName,
                ['data' => $data]
            );
            $documentFragment = $domDocument->createDocumentFragment();
            $documentFragment->appendXML($backendBlockInstance->toHtml());
            $node->parentNode->replaceChild($documentFragment, $node);
        }
        return $domDocument->saveXML(
            $domDocument->documentElement
        );
    }
}
