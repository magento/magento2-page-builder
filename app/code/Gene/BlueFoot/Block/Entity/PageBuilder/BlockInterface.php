<?php

namespace Gene\BlueFoot\Block\Entity\PageBuilder;

/**
 * Interface BlockInterface
 *
 * @package Gene\BlueFoot\Block\Entity\PageBuilder
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
interface BlockInterface
{
    /**
     * Retrieve the instance of the advanced CMS block
     *
     * @return \Gene\BlueFoot\Model\Stage\Save\Renderer\Block|null
     * @throws \Exception
     */
    public function getAdvancedCms();
}