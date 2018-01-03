<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model\Stage\Save;

/**
 * Class Parser
 */
class Parser
{
    /**
     * @var \DOMDocument
     */
    protected $html;

    /**
     * @var bool|\DOMElement|null
     */
    protected $stage = null;

    /**
     * @var \Gene\BlueFoot\Model\Stage\Save\Parser\ElementFactory
     */
    protected $elementFactory;

    /**
     * @var \DOMXPath
     */
    protected $xpath;

    /**
     * Parser constructor.
     *
     * @param \Gene\BlueFoot\Model\Stage\Save\Parser\ElementFactory $elementFactory
     * @param string                                                $html
     */
    public function __construct(
        \Gene\BlueFoot\Model\Stage\Save\Parser\ElementFactory $elementFactory,
        $html = ''
    ) {
        $this->elementFactory = $elementFactory;
        $this->html = $html;
    }

    /**
     * Retrieve the stage from the loaded HTML
     *
     * @return bool|\DOMElement|null
     */
    public function getStage()
    {
        if ($this->stage === null) {
            if (empty($this->html)) {
                throw new \InvalidArgumentException('HTML must be provided in factory create function.');
            }
            if (!is_string($this->html)) {
                throw new \InvalidArgumentException('The parser can only only accept a HTML string.');
            }

            $domDocument = new \DOMDocument();
            $domDocument->loadHTML(
                mb_convert_encoding($this->html, 'HTML-ENTITIES', 'UTF-8'),
                LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
            );

            $this->xpath = new \DOMXPath($domDocument);
            $query = $this->xpath->query('//*[@data-role="stage"]');
            if ($query->length > 0) {
                $this->stage = $query->item(0);
            } else {
                $this->stage = false;
            }
        }

        return $this->stage;
    }

    /**
     * Does the loaded HTML contain a valid stage
     *
     * @return bool|\DOMNode|null
     */
    public function hasStage()
    {
        return (bool) $this->getStage();
    }

    /**
     * Parse the HTML into parser elements
     *
     * @param bool $element
     *
     * @return \Gene\BlueFoot\Model\Stage\Save\Parser\Element
     */
    public function parse($element = false)
    {
        if (!$element) {
            $element = $this->getStage();
        }

        // Create a new element
        $parserElement = $this->elementFactory->create([
            'element' => $element
        ]);

        // Retrieve any valid child nodes and append them to the element
        $childNodes = $this->retrieveValidChildNodes($element);
        if ($childNodes && $childNodes->length > 0) {
            /* @var $childNode \DOMElement */
            foreach ($childNodes as $childNode) {
                $parserElement->addChild($this->parse($childNode));
            }
        }

        return $parserElement;
    }

    /**
     * Retrieve valid child nodes containing [data-role]
     *
     * @param \DOMElement $element
     *
     * @return bool|\DOMNodeList
     */
    protected function retrieveValidChildNodes(\DOMElement $element)
    {
        if ($element->hasChildNodes()) {
            $childRoleNodes = $this->xpath->query('*[@data-role]', $element);
            if ($childRoleNodes->length > 0) {
                return $childRoleNodes;
            }
        }

        return false;
    }
}
