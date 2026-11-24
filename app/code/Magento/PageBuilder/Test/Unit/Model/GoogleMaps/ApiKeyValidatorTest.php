<?php
/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Test\Unit\Model\GoogleMaps;

use Magento\Framework\App\ObjectManager;
use Magento\Framework\HTTP\ClientFactory;
use Magento\Framework\HTTP\ClientInterface;
use Magento\Framework\ObjectManagerInterface;
use Magento\PageBuilder\Model\GoogleMaps\ApiKeyValidator;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class ApiKeyValidatorTest extends TestCase
{
    #[DataProvider('responseDataProvider')]
    public function testValidateResponse(int $status, string $apiKey, string $encodedKey, array $expected): void
    {
        $client = $this->createMock(ClientInterface::class);
        $client->expects($this->once())->method('setTimeout')->with(10);
        $client->expects($this->once())->method('get')->with(
            'https://www.google.com/maps/embed/v1/place?key=' . $encodedKey . '&q=Austin+TX'
        );
        $client->expects($this->once())->method('getStatus')->willReturn($status);
        $client->expects($status === 200 ? $this->never() : $this->once())
            ->method('getBody')
            ->willReturn('Response body');
        $factory = $this->createMock(ClientFactory::class);
        $factory->expects($this->once())->method('create')->willReturn($client);

        $validator = new ApiKeyValidator($factory);

        $this->assertSame($expected, $validator->validate($apiKey));
    }

    public static function responseDataProvider(): array
    {
        return [
            'success' => [200, 'test-key_123', 'test-key_123', ['responseMessage' => '', 'success' => true]],
            'forbidden' => [
                403,
                'test-key_123',
                'test-key_123',
                ['responseMessage' => 'Response body', 'success' => false]
            ],
            'redirect' => [
                302,
                'test-key_123',
                'test-key_123',
                ['responseMessage' => 'Response body', 'success' => false]
            ],
            'encoded key' => [200, 'key&+# =', 'key%26%2B%23+%3D', ['responseMessage' => '', 'success' => true]]
        ];
    }

    public function testValidateTransportException(): void
    {
        $client = $this->createMock(ClientInterface::class);
        $client->expects($this->once())->method('setTimeout')->with(10);
        $client->expects($this->once())->method('get')
            ->with('https://www.google.com/maps/embed/v1/place?key=test-key&q=Austin+TX')
            ->willThrowException(new \Exception('Connection timed out'));
        $client->expects($this->never())->method('getStatus');
        $client->expects($this->never())->method('getBody');
        $factory = $this->createMock(ClientFactory::class);
        $factory->expects($this->once())->method('create')->willReturn($client);

        $validator = new ApiKeyValidator($factory);

        $this->assertSame(
            ['responseMessage' => 'Connection timed out', 'success' => false],
            $validator->validate('test-key')
        );
    }

    public function testValidateCreatesFreshClientForEachCall(): void
    {
        $firstClient = $this->createMock(ClientInterface::class);
        $secondClient = $this->createMock(ClientInterface::class);
        foreach ([$firstClient, $secondClient] as $client) {
            $client->expects($this->once())->method('setTimeout')->with(10);
            $client->expects($this->once())->method('get')
                ->with('https://www.google.com/maps/embed/v1/place?key=test-key&q=Austin+TX');
            $client->expects($this->once())->method('getStatus')->willReturn(200);
            $client->expects($this->never())->method('getBody');
        }
        $factory = $this->createMock(ClientFactory::class);
        $factory->expects($this->exactly(2))->method('create')->willReturn($firstClient, $secondClient);

        $validator = new ApiKeyValidator($factory);

        $this->assertSame(['responseMessage' => '', 'success' => true], $validator->validate('test-key'));
        $this->assertSame(['responseMessage' => '', 'success' => true], $validator->validate('test-key'));
    }

    public function testInjectedFactoryDoesNotUseObjectManager(): void
    {
        $instanceProperty = new \ReflectionProperty(ObjectManager::class, '_instance');
        $originalInstance = $instanceProperty->getValue();
        $objectManager = $this->createMock(ObjectManagerInterface::class);
        $objectManager->expects($this->never())->method('get');
        $client = $this->createMock(ClientInterface::class);
        $client->expects($this->once())->method('setTimeout')->with(10);
        $client->expects($this->once())->method('get')
            ->with('https://www.google.com/maps/embed/v1/place?key=test-key&q=Austin+TX');
        $client->expects($this->once())->method('getStatus')->willReturn(200);
        $client->expects($this->never())->method('getBody');
        $factory = $this->createMock(ClientFactory::class);
        $factory->expects($this->once())->method('create')->willReturn($client);

        try {
            ObjectManager::setInstance($objectManager);
            $validator = new ApiKeyValidator($factory);

            $this->assertSame(['responseMessage' => '', 'success' => true], $validator->validate('test-key'));
        } finally {
            $instanceProperty->setValue(null, $originalInstance);
        }
    }
}
