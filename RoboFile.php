<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * Robo tasks container
 *
 */
class RoboFile extends \Robo\Tasks
{
    use Magento\RoboFile\loadTasks;

    /**
     * Sets root project directory for dev tasks
     */
    public function __construct()
    {
        $this->projectRoot = __DIR__;
    }
}
