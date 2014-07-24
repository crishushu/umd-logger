(function(factory) {
    "use strict";
    if (typeof module === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.umd_logger = factory();
    }
}).call(this, function() {

    /**
     * Browser independent stack retrieval
     * @param  {error} e
     * @return {String} trace of the invocation
     */
    function getBrowserStack(e) {
           
        var stack;

        switch((function(){

            var _cache;

            if(_cache) {
                return _cache;
            }
            // safari
            if (e.stack && e.sourceURL) {
                return _cache = 'safari';
            }
            // ie
            if (e.stack && e.number) {
                return _cache = 'ie';
            }
            // firefox
            if (e.stack && e.fileName) {
                return _cache = 'firefox';
            }
            // chrome
            if (e['arguments'] && e.stack || e.stack && !e.fileName) {
                return _cache = 'chrome';
            }
        
        }).call(this, e)) {
            case 'safari': stack = e.stack
                                    .replace(/\[native code\]\n/m, '')
                                    .replace(/^(?=\w+Error\:).*$\n/m, '')
                                    .replace(/^@/gm, '{anonymous}()@')
                                    .split('\n');
                            break;
            case 'firefox': stack = e.stack
                                    .replace(/(?:\n@:0)?\s+$/m, '')
                                    .replace(/^(?:\((\S*)\))?@/gm, '{anonymous}($1)@')
                                    .split('\n');
                            break;       
            case 'ie': stack = e.stack
                                .replace(/\[native code\]\n/m, '')
                                .replace(/^(?=\w+Error\:).*$\n/m, '')
                                .replace(/^@/gm, '{anonymous}()@')
                                .split('\n');
                            break;
            case 'chrome': stack = (e.stack + '\n')
                                    .replace(/^[\s\S]+?\s+at\s+/, ' at ') // remove message
                                    .replace(/^\s+(at eval )?at\s+/gm, '') // remove 'at' and indentation
                                    .replace(/^([^\(]+?)([\n$])/gm, '{anonymous}() ($1)$2')
                                    .replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}() ($1)')
                                    .replace(/^(.+) \((.+)\)$/gm, '$1@$2')
                                    .split('\n')
                                    .slice(0, -1);
                            break;
            default: return;
        }

        return stack[1].split('@')[1];
    }

    /**
     * Returns Logger Object (uses shim for node console)
     * Level >4: error, warn, info, debug, log
     * Level 4: error, warn, info, debug
     * Level 3: error, warn, info
     * Level 2: error, warn
     * Leven 1: error
     * Level 0: off   
     * @type {Object}
     */
    
    var _cache = null;
    var log_level = 5;
    return (function () {
            return (function (con) {
                return _cache = _cache ? _cache : (function(logger) {
                    var log_methods = ['error', 'warn', 'info', 'debug', 'log'],
                    i = log_methods.length,
                    logs = [];
                    logger.backup = con;
            
                    while (--i >= 0) {
                        (function(i, level){
                            logger[level] = function() {
                                var args = Array.prototype.slice.call(arguments),
                                    log_arr = [level].concat(args),
                                    stack;
                                logs.push(log_arr);
                                args.unshift('[' + level.toUpperCase() + ']', new Date());
                                if (typeof window !== 'undefined') args.push("\t\t" + getBrowserStack(new Error('umd-logger')));
                                if (!con || !(log_level > 0 ? log_level > i : log_methods.length + log_level <= i)) {
                                    return;
                                }
                                con[level] ? con[level].apply(con, args) : con.log.apply(con, args);
                            };
                        })(i, log_methods[i]);
                    }
                    return logger;
                }).call(this, {
                    setLevel: function(level) {
                        log_level = typeof level === 'number' ? level : log_level;
                    }
                });
            }).call(this, console);
        }());

});