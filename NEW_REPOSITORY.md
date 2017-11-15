# Development in new repository structure

### Development Installation

1. Install all dependencies
    ```bash
    composer install && yarn install
    ```
        
2. Configure robo (docker or local mysql):

    **Docker mysql** (make sure container has either port or ip address accessible to host)
    ```bash
    vendor/bin/robo build:configuration-from-docker-container [name of mysql container]
    ```
    
    **Local mysql**
    ```bash
    vendor/bin/robo build:configuration [mysql host] [mysql username] [mysql password]
    ```
    
    
### Running Tests

Before running any tests, you need to create a development build

```bash
vendor/bin/robo build:create dev [your prefered url] [magento branch of current story]
```

#### JavaScript Tests

##### Command Line
To run a complete suite you can just execute this simple command

```bash
npx jest --no-cache
```

If you want to execute a separate test file, just specify its path

```bash
npx jest [path-to-file]
```

##### PHPStorm Integration

1. Enable Node & NPM integration in **PHPStorm > Preferences > Language & Frameworks > NodeJs & NPM > Enable**

2. Before you can run any javascript tests you need to export jest configuration file for PHPStorm.
```
npx gulp jestConfig
```

3. Then you have specify jest.config.json in **PHPStorm > Run > Edit Configurations > Defaults -> Jest:**
    
    - Select your jest.config.json into **Configuration File** file
    
    - Specify your repo directory in **Working directory** field
    
    - Specify your "--no-cache" into **Jest options** field
         
    - Node runtime & jest executable should be automatically pre-filled

Now you can just right click on any JS test file and run them in your IDE.

#### Functional Tests

As soon as your build is accessible via specified url in `build:create` command

```bash
vendor/bin/robo run:functional-test --build [buildname]
```

You can also execute tests byt name

```bash
vendor/bin/robo run:functional-test --build [buildname] --test-name [NameOfTestCest]
```
