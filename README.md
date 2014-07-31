# umd-logger

Logger for the Browser and NodeJS based on the UMD pattern

## Documentation
This is a console surrogate that works in major Browser vendors (Chrome, Firefox, Safari, IE).
Moreover it runs with node.js and polyfills the console behavior we know from the Browser.
A convenient feature is that additional to the output of user defined common string messages, the location of the execution is supplied as a trace snippet.  

## Getting Started
Install the module with: `npm install umd-logger`

##### Node.js

```javascript
var console = require('umd-logger');
console.setLevel(4);
console.debug('Hello world!'); // default node.js console does not support 'debug'

```

##### Browser using globals 

```javascript
window.console = window.umd_logger;
console.setLevel(5); // default setting
console.log('Hello world!');

// restore the original console
window.console = console.backup;
console.log('Hello again!');


```

##### Browser using AMD 

```javascript
require(['umd-logger'], function (console) {
    console.setLevel(3);
    console.info('Hello world!');
})

```

## License
Copyright (c) 2014 Christian H. Schulz  
Licensed under the MIT license.

<!--
## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
-->
