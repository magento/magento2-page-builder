<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilderDataMigration\Setup\DataConverter;

use Magento\Framework\Serialize\Serializer\Json;

class Validator
{
    /**
     * @var Json
     */
    private $serializer;

    /**
     * Constructor
     *
     * @param Json $serializer
     */
    public function __construct(
        Json $serializer
    ) {
        $this->serializer = $serializer;
    }

    /**
     * Check if a JSON string is a valid PageBuilder content
     *
     * @param string $json
     * @return bool
     */
    public function validate($json) : bool
    {
        try {
            $structure = $this->serializer->unserialize($json);
            if (is_array($structure) && (!isset($structure['type']) && !isset($structure['contentType']))) {
                $structure = current($structure);
            }
            $result = is_array($structure) && (isset($structure['type']) || isset($structure['contentType']));
        } catch (\InvalidArgumentException $exception) {
            $result = false;
        }
        return $result;
    }
}
