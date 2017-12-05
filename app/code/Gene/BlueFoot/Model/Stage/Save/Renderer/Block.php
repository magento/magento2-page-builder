<?php

namespace Gene\BlueFoot\Model\Stage\Save\Renderer;

/**
 * Class Block
 *
 * @package Gene\BlueFoot\Model\Stage\Save\Renderer
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Block
{
    /**
     * @var array
     */
    protected $attributes = [];

    /**
     * @var array
     */
    protected $mergeAttributes = [];

    /**
     * Block constructor.
     *
     * @param \Gene\BlueFoot\Model\Stage\Save\Parser\Element $element
     * @param array                                          $mergeAttributes
     */
    public function __construct(
        \Gene\BlueFoot\Model\Stage\Save\Parser\Element $element,
        $mergeAttributes = []
    ) {
        $this->element = $element;
        $this->mergeAttributes = $mergeAttributes;
    }

    /**
     * Add an attribute to a storage array, default to the class instance
     *
     * @param      $name
     * @param      $value
     */
    public function setAttribute($name, $value)
    {
        // Attributes can only contain strings, luckily these are space separated
        if (is_array($value)) {
            $value = implode(' ', $value);
        }

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
     * Does the instance contain a specific attribute?
     *
     * @param $name
     *
     * @return bool
     */
    public function hasAttribute($name)
    {
        return isset($this->attributes[$name]);
    }

    /**
     * Render attributes into the block
     *
     * @param array $additional include additional attributes in this rendered output, will not persist to instance
     *                          usage is ['attribute_key' => ['value_1', 'value_2']
     *
     * @return string
     */
    public function getAttributeHtml(array $additional = [])
    {
        $attributes = $this->attributes;

        // Iterate and add additional attributes to rendered output
        if (!empty($additional)) {
            foreach ($additional as $name => $value) {
                if (is_array($value)) {
                    $value = implode(' ', $value);
                }

                // Merge attribute values with a space
                if (isset($attributes[$name]) && in_array($name, $this->mergeAttributes)) {
                    $value = $attributes[$name] . ' ' . $value;
                }

                $attributes[$name] = $value;
            }
        }

        // All elements must contain a [data-role], this cannot be overridden
        $attributes['data-role'] = $this->element->getRole();
        if (count($attributes) > 0) {
            $attributeHtml = '';
            foreach ($attributes as $name => $value) {
                // Add any additional values to the string
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
        return $this->element;
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
     * Retrieve the data HTML for the block
     *
     * @return string
     */
    public function getDataHtml()
    {
        // Create a new dom element to generate the script tag within
        $dom = new \DOMDocument();

        // Add in the data script tag
        $blockData = ($this->getElement()->getData() ? json_encode($this->getElement()->getData()) : '');
        $dataTag = $dom->createElement('script', $blockData);
        $dataTag->setAttribute('type', 'text/advanced-cms-data');
        $dataTag->setAttribute('data-checksum', md5($blockData));

        return $dom->saveHTML($dataTag);
    }
}
