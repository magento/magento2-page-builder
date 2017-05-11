<?php

namespace Gene\BlueFoot\Block\Entity\PageBuilder;

/**
 * Class AbstractBlock
 *
 * @package Gene\BlueFoot\Block\Entity\PageBuilder
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class AbstractBlock extends \Magento\Framework\View\Element\Template
{
    /**
     * @var array
     */
    protected $attributes = [];

    /**
     * @var array
     */
    protected $mergeAttributes = [
        'style',
        'class'
    ];

    /**
     * Add an attribute to the blocks wrapping element
     *
     * @param $name
     * @param $value
     */
    public function addAttribute($name, $value)
    {
        // Merge attribute values with a space
        if (isset($this->attributes[$name]) && in_array($name, $this->mergeAttributes)) {
            $value = $this->attributes[$name] . ' ' . $value;
        }

        $this->attributes[$name] = $value;
    }

    /**
     * Return all attributes
     *
     * @return array
     */
    public function getAttributes()
    {
        return $this->attributes;
    }

    /**
     * Render attributes into the block
     *
     * @return string
     */
    public function getAttributeHtml()
    {
        if (count($this->attributes) > 0) {
            $attributeHtml = '';
            foreach ($this->attributes as $name => $value) {
                $attributeHtml .= ' ' . $name . '="' . $value . '"';
            }
            return $attributeHtml;
        }

        return '';
    }

    /**
     * Retrieve the element from the parser
     *
     * @return \Gene\BlueFoot\Model\Stage\Save\Parser\Element
     */
    public function getElement()
    {
        return $this->getData('element');
    }

    /**
     * Return the instance of the renderer used to render this block
     *
     * @return \Gene\BlueFoot\Model\Stage\Save\Renderer
     */
    public function getRenderer()
    {
        return $this->getData('renderer');
    }

    /**
     * Retrieve specific entity data
     *
     * @param bool $key
     *
     * @return mixed
     */
    public function getEntityData($key = false)
    {
        $entityData = $this->getElement()->getData();
        if ($key && isset($entityData[$key])) {
            return $entityData[$key];
        } elseif ($key && !isset($entityData[$key])) {
            return null;
        }

        return $entityData;
    }

    /**
     * Render block HTML, passing it through our block renderer
     *
     * @return string
     * @throws \Exception
     */
    protected function _toHtml()
    {
        if (!$this->getRenderer()) {
            throw new \Exception('All advanced CMS blocks must have a renderer instance set.');
        }

        return $this->getRenderer()->embedMetadataIntoBlockOutput(parent::_toHtml(), $this);
    }
}
