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
    /**
     * @return array
     */
    public function getGroups();

    /**
     * @param string $name
     * 
     * @return array
     */
    public function getGroup($name);

    /**
     * @return array
     */
    public function getContentTypes();

    /**
     * @param string $name
     *
     * @return array
     */
    public function getContentType($name);
}
