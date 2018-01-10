<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

class ColorConverter
{
    /**
     * Convert a hex value into it's corresponding RGB values
     *
     * @param $hex
     *
     * @return string
     */
    public function convert($hex)
    {
        list($r, $g, $b) = sscanf(ltrim($hex, '#'), "%02x%02x%02x");
        return "rgb($r, $g, $b)";
    }
}
