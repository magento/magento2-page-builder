<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

use Magento\Framework\Serialize\Serializer\Json;

class Validator
{
    const BLUEFOOT_KEY = 'GENE_BLUEFOOT';
    const UNMIGRATED_KEY = 'UNMIGRATED_CONTENT';

    /**
     * @var Json
     */
    private $serializer;

    /**
     * @var string
     */
    private $json;

    /**
     * Validator constructor.
     *
     * @param Json $serializer
     */
    public function __construct(
        Json $serializer
    ) {
        $this->serializer = $serializer;
    }

    /**
     * Determine if a value is a combination of mixed and un-migrated content, for this we just scan for an instance
     * of the un-migrated key
     *
     * @param $value
     *
     * @return bool
     */
    public function isMixed($value)
    {
        return strstr($value, self::UNMIGRATED_KEY) !== false;
    }

    /**
     * Determine if the value is a valid BlueFoot structure
     *
     * @param $value
     *
     * @return bool
     */
    public function isBlueFoot($value)
    {
        if (preg_match('/<!--' . self::BLUEFOOT_KEY . '="(.*)"-->/', $value, $matches)) {
            $this->json = $matches[1];
            return $this->isValidBlueFootJson($this->json);
        }

        return false;
    }

    /**
     * Retrieve the JSON value
     *
     * @return string
     */
    public function getJson()
    {
        return $this->json;
    }

    /**
     * Check if a JSON string is a valid instance of BlueFoot content
     *
     * @param string $json
     * @param bool $isStage if we require an entire stage we will validate the first child is a row
     *
     * @return bool
     */
    public function isValidBlueFootJson($json, $isStage = true)
    {
        try {
            $structure = $this->serializer->unserialize($json);

            // Determine if the object has items with a key of type or contentType
            $valid = count($structure) > 0
                && (isset(current($structure)["type"]) || isset(current($structure)["contentType"]));

            // If we're validating an entire stage verify the first item is of type row
            if ($valid && $isStage && isset(current($structure)["type"])) {
                return current($structure)["type"] === "row";
            }

            return $valid;
        } catch (\InvalidArgumentException $e) {
            return false;
        }
    }
}
