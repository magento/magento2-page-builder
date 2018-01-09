<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

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
     * Check if a JSON string is a valid BlueFoot content, if we require an entire stage we will validate the
     * first child is a row
     *
     * @param string $json
     * @param bool $isStage
     * @return bool
     * @throws \InvalidArgumentException
     */
    public function isValidBlueFootJson($json, $isStage = true)
    {
        try {
            $structure = $this->serializer->unserialize($json);

            $firstContentType = $structure;
            if (!empty($firstContentType)
                && (!isset($firstContentType['type']) && !isset($firstContentType['contentType']))
            ) {
                $firstContentType = current($firstContentType);
            }

            // Determine if the object has items with a key of type or contentType
            $valid = count($firstContentType) > 0
                && (isset($firstContentType['type']) || isset($firstContentType['contentType']));

            // If we're validating an entire stage verify the first item is of type row
            if ($valid && $isStage && isset($firstContentType['type'])) {
                $valid = $firstContentType['type'] === 'row';
            }
            return $valid;
        } catch (\InvalidArgumentException $exception) {
            return false;
        }
    }
}
