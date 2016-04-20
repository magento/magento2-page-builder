<?php

namespace Gene\BlueFoot\Model\Config;

/**
 * Interface ConfigInterface
 *
 * @package Gene\BlueFoot\Model\Config
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
interface ConfigInterface
{
    public function getJsPluginConfig();

    public function getTemplates();

    public function getTemplate($code);

    public function getTemplateFile($code);

    public function getRenderers();

    public function getRendererClass($name);

    public function getStructurals();

    public function getStructural($type);

    public function getWidgets();

    public function getWidget($name);

    public function getGlobalFields();
}