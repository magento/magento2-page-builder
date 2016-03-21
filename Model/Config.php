<?php

namespace Gene\BlueFoot\Model;

/**
 * Class Config
 *
 * @package Gene\BlueFoot\Model
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Config extends \Magento\Framework\Config\Data implements \Gene\BlueFoot\Model\Config\ConfigInterface
{
    /**
     * Config constructor.
     *
     * @param \Gene\BlueFoot\Model\Config\Reader       $reader
     * @param \Magento\Framework\Config\CacheInterface $cache
     * @param string                                   $cacheId
     */
    public function __construct(
        \Gene\BlueFoot\Model\Config\Reader $reader,
        \Magento\Framework\Config\CacheInterface $cache,
        $cacheId = 'gene_bluefoot_pagebuilder'
    ) {
        parent::__construct($reader, $cache, $cacheId);
    }

    /**
     * Return the JS plugin configuration
     *
     * @return array|mixed|null
     */
    public function getJsPluginConfig()
    {
        if ($plugins = $this->get('plugins')) {
            return $plugins;
        }

        return [];
    }

    /**
     * Retrieve the templates from the configuration
     *
     * @return array|mixed|null
     */
    public function getTemplates()
    {
        if ($templates = $this->get('templates')) {
            return $templates;
        }

        return [];
    }

    /**
     * Return a specific template
     *
     * @param $code
     *
     * @return array|mixed|null
     */
    public function getTemplate($code)
    {
        return $this->get('templates/' . $code);
    }

    /**
     * Return a template file
     *
     * @param $code
     *
     * @return array|mixed|null
     */
    public function getTemplateFile($code)
    {
        return $this->get('templates/' . $code . '/file');
    }

    /**
     * Retrieve all of the available renderers for the system
     *
     * @return array|mixed|null
     */
    public function getRenderers()
    {
        if ($renderers = $this->get('renderers')) {
            return $renderers;
        }

        return [];
    }

    /**
     * Get a single renderer
     *
     * @param $name
     *
     * @return array|mixed|null
     */
    public function getRendererClass($name)
    {
        return $this->get('renderers/' . $name . '/class');
    }

    /**
     * Get the structural data
     *
     * @return array|mixed|null
     */
    public function getStructurals()
    {
        if ($structurals = $this->get('structurals')) {
            return $structurals;
        }

        return [];
    }

    /**
     * Return information about an individual structural element
     *
     * @param $code
     *
     * @return array|mixed|null
     */
    public function getStructural($code)
    {
        return $this->get('structurals/' . $code);
    }

    /**
     * Get the widget data
     *
     * @return array|mixed|null
     */
    public function getWidgets()
    {
        if ($widgets = $this->get('widgets')) {
            return $widgets;
        }

        return [];
    }

    /**
     * Return a widgets instance
     *
     * @param $name
     *
     * @return array|mixed|null
     */
    public function getWidget($name)
    {
        return $this->get('widgets/' . $name);
    }
}