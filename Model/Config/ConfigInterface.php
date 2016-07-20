<?php

namespace Gene\BlueFoot\Model\Config;

/**
 * Interface ConfigInterface
 *
 * @package Gene\BlueFoot\Model\Config
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 * @todo Comment methods
 */
interface ConfigInterface
{
    /**
     * @return mixed
     */
    public function getJsPluginConfig();

    /**
     * @return mixed
     */
    public function getTemplates();

    /**
     * @param $code
     * @return mixed
     */
    public function getTemplate($code);

    /**
     * @param $code
     * @return mixed
     */
    public function getTemplateFile($code);

    /**
     * @return mixed
     */
    public function getRenderers();

    /**
     * @param $name
     * @return mixed
     */
    public function getRendererClass($name);

    /**
     * @return mixed
     */
    public function getStructurals();

    /**
     * @param $type
     * @return mixed
     */
    public function getStructural($type);

    /**
     * @return mixed
     */
    public function getWidgets();

    /**
     * @param $name
     * @return mixed
     */
    public function getWidget($name);

    /**
     * @return mixed
     */
    public function getGlobalFields();
}