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
    public function getContentBlocks();

    /**
     * @param $identifier
     *
     * @return array
     */
    public function getContentBlock($identifier);
}
