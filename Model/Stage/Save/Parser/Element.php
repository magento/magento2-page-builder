<?php

namespace Gene\BlueFoot\Model\Stage\Save\Parser;

/**
 * Class Element
 *
 * @package Gene\BlueFoot\Model\Stage\Save\Parser
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Element
{
    /**
     * @var \DOMElement
     */
    protected $element;

    /**
     * @var string
     */
    protected $role = null;

    /**
     * @var array
     */
    protected $children = [];

    /**
     * @var array
     */
    protected $data = null;

    /**
     * Element constructor.
     *
     * @param \DOMElement $element
     */
    public function __construct(
        \DOMElement $element
    ) {
        $this->element = $element;
    }

    /**
     * Return the DOM Element for the element
     *
     * @return \DOMElement
     */
    public function getDOMElement()
    {
        return $this->element;
    }

    /**
     * Retrieve data for the current element
     *
     * @return array|null
     */
    public function getData()
    {
        if ($this->data === null) {
            if ($this->element->hasChildNodes()) {
                /* @var $childNode \DOMElement */
                foreach ($this->element->childNodes as $childNode) {
                    if ($childNode->tagName === 'script') {
                        var_dump($childNode);
                        exit;
                    }
                }
            } else {
                $this->data = [];
            }
        }

        return $this->data;
    }

    /**
     * Retrieve the role of the current element
     *
     * @return string
     */
    public function getRole()
    {
        if ($this->role === null) {
            $this->role = $this->element->getAttribute('data-role');
        }

        return $this->role;
    }

    /**
     * Retrieve the children of the current element
     *
     * @return array
     */
    public function getChildren()
    {
        return $this->children;
    }

    /**
     * Does the element have any children?
     *
     * @return bool
     */
    public function hasChildren()
    {
        return count($this->getChildren()) > 0;
    }

    /**
     * Add a child into the element
     *
     * @param \Gene\BlueFoot\Model\Stage\Save\Parser\Element $element
     * @param string                                         $name
     */
    public function addChild(Element $element, $name = '')
    {
        $this->children[$name] = $element;
    }
}
