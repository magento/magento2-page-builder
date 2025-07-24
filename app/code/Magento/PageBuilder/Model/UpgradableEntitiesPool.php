<?php
/**
 * Copyright 2020 Adobe
 * All Rights Reserved.
 */
namespace Magento\PageBuilder\Model;

/**
 * Class EntityPool
 *
 * Pool of entities
 */
class UpgradableEntitiesPool
{
    /**
     * @var array
     */
    private $entities;

    /**
     * @param array $entities
     */
    public function __construct(array $entities = [])
    {
        $this->entities = $entities;
    }

    /**
     * Retrieve entities
     *
     * @return array
     */
    public function getEntities()
    {
        return $this->entities;
    }
}
