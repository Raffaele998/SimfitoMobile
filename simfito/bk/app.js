/*
 jQuery v1.8.2 jquery.com | jquery.org/license */
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = false;
$jscomp.ASSUME_NO_NATIVE_MAP = false;
$jscomp.ASSUME_NO_NATIVE_SET = false;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || typeof Object.defineProperties == 'function' ? Object.defineProperty : function(target, property, descriptor) {
  descriptor = descriptor;
  if (target == Array.prototype || target == Object.prototype) {
    return;
  }
  target[property] = descriptor.value;
};
$jscomp.getGlobal = function(maybeGlobal) {
  return typeof window != 'undefined' && window === maybeGlobal ? maybeGlobal : typeof global != 'undefined' && global != null ? global : maybeGlobal;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(target, polyfill, fromLang, toLang) {
  if (!polyfill) {
    return;
  }
  var obj = $jscomp.global;
  var split = target.split('.');
  for (var i = 0; i < split.length - 1; i++) {
    var key = split[i];
    if (!(key in obj)) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  var property = split[split.length - 1];
  var orig = obj[property];
  var impl = polyfill(orig);
  if (impl == orig || impl == null) {
    return;
  }
  $jscomp.defineProperty(obj, property, {configurable:true, writable:true, value:impl});
};
$jscomp.polyfill('Array.prototype.copyWithin', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, start, opt_end) {
    var len = this.length;
    target = Number(target);
    start = Number(start);
    opt_end = Number(opt_end != null ? opt_end : len);
    if (target < start) {
      opt_end = Math.min(opt_end, len);
      while (start < opt_end) {
        if (start in this) {
          this[target++] = this[start++];
        } else {
          delete this[target++];
          start++;
        }
      }
    } else {
      opt_end = Math.min(opt_end, len + start - target);
      target += opt_end - start;
      while (opt_end > start) {
        if (--opt_end in this) {
          this[--target] = this[opt_end];
        } else {
          delete this[target];
        }
      }
    }
    return this;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.SYMBOL_PREFIX = 'jscomp_symbol_';
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  if (!$jscomp.global['Symbol']) {
    $jscomp.global['Symbol'] = $jscomp.Symbol;
  }
};
$jscomp.Symbol = function() {
  var counter = 0;
  function Symbol(opt_description) {
    return $jscomp.SYMBOL_PREFIX + (opt_description || '') + counter++;
  }
  return Symbol;
}();
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var symbolIterator = $jscomp.global['Symbol'].iterator;
  if (!symbolIterator) {
    symbolIterator = $jscomp.global['Symbol'].iterator = $jscomp.global['Symbol']('iterator');
  }
  if (typeof Array.prototype[symbolIterator] != 'function') {
    $jscomp.defineProperty(Array.prototype, symbolIterator, {configurable:true, writable:true, value:function() {
      return $jscomp.arrayIterator(this);
    }});
  }
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.arrayIterator = function(array) {
  var index = 0;
  return $jscomp.iteratorPrototype(function() {
    if (index < array.length) {
      return {done:false, value:array[index++]};
    } else {
      return {done:true};
    }
  });
};
$jscomp.iteratorPrototype = function(next) {
  $jscomp.initSymbolIterator();
  var iterator = {next:next};
  iterator[$jscomp.global['Symbol'].iterator] = function() {
    return this;
  };
  return iterator;
};
$jscomp.iteratorFromArray = function(array, transform) {
  $jscomp.initSymbolIterator();
  if (array instanceof String) {
    array = array + '';
  }
  var i = 0;
  var iter = {next:function() {
    if (i < array.length) {
      var index = i++;
      return {value:transform(index, array[index]), done:false};
    }
    iter.next = function() {
      return {done:true, value:void 0};
    };
    return iter.next();
  }};
  iter[Symbol.iterator] = function() {
    return iter;
  };
  return iter;
};
$jscomp.polyfill('Array.prototype.entries', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(i, v) {
      return [i, v];
    });
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.fill', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(value, opt_start, opt_end) {
    var length = this.length || 0;
    if (opt_start < 0) {
      opt_start = Math.max(0, length + opt_start);
    }
    if (opt_end == null || opt_end > length) {
      opt_end = length;
    }
    opt_end = Number(opt_end);
    if (opt_end < 0) {
      opt_end = Math.max(0, length + opt_end);
    }
    for (var i = Number(opt_start || 0); i < opt_end; i++) {
      this[i] = value;
    }
    return this;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.findInternal = function(array, callback, thisArg) {
  if (array instanceof String) {
    array = String(array);
  }
  var len = array.length;
  for (var i = 0; i < len; i++) {
    var value = array[i];
    if (callback.call(thisArg, value, i, array)) {
      return {i:i, v:value};
    }
  }
  return {i:-1, v:void 0};
};
$jscomp.polyfill('Array.prototype.find', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(callback, opt_thisArg) {
    return $jscomp.findInternal(this, callback, opt_thisArg).v;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.findIndex', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(callback, opt_thisArg) {
    return $jscomp.findInternal(this, callback, opt_thisArg).i;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.from', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(arrayLike, opt_mapFn, opt_thisArg) {
    $jscomp.initSymbolIterator();
    opt_mapFn = opt_mapFn != null ? opt_mapFn : function(x) {
      return x;
    };
    var result = [];
    var iteratorFunction = arrayLike[Symbol.iterator];
    if (typeof iteratorFunction == 'function') {
      arrayLike = iteratorFunction.call(arrayLike);
      var next;
      var k = 0;
      while (!(next = arrayLike.next()).done) {
        result.push(opt_mapFn.call(opt_thisArg, next.value, k++));
      }
    } else {
      var len = arrayLike.length;
      for (var i = 0; i < len; i++) {
        result.push(opt_mapFn.call(opt_thisArg, arrayLike[i], i));
      }
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Object.is', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(left, right) {
    if (left === right) {
      return left !== 0 || 1 / left === 1 / right;
    } else {
      return left !== left && right !== right;
    }
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.includes', function(orig) {
  if (orig) {
    return orig;
  }
  var includes = function(searchElement, opt_fromIndex) {
    var array = this;
    if (array instanceof String) {
      array = String(array);
    }
    var len = array.length;
    var i = opt_fromIndex || 0;
    if (i < 0) {
      i = Math.max(i + len, 0);
    }
    for (; i < len; i++) {
      var element = array[i];
      if (element === searchElement || Object.is(element, searchElement)) {
        return true;
      }
    }
    return false;
  };
  return includes;
}, 'es7', 'es3');
$jscomp.polyfill('Array.prototype.keys', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(i) {
      return i;
    });
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.of', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(var_args) {
    return Array.from(arguments);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.values', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(k, v) {
      return v;
    });
  };
  return polyfill;
}, 'es8', 'es3');
$jscomp.makeIterator = function(iterable) {
  $jscomp.initSymbolIterator();
  var iteratorFunction = iterable[Symbol.iterator];
  return iteratorFunction ? iteratorFunction.call(iterable) : $jscomp.arrayIterator(iterable);
};
$jscomp.FORCE_POLYFILL_PROMISE = false;
$jscomp.polyfill('Promise', function(NativePromise) {
  if (NativePromise && !$jscomp.FORCE_POLYFILL_PROMISE) {
    return NativePromise;
  }
  function AsyncExecutor() {
    this.batch_ = null;
  }
  AsyncExecutor.prototype.asyncExecute = function(f) {
    if (this.batch_ == null) {
      this.batch_ = [];
      this.asyncExecuteBatch_();
    }
    this.batch_.push(f);
    return this;
  };
  AsyncExecutor.prototype.asyncExecuteBatch_ = function() {
    var self = this;
    this.asyncExecuteFunction(function() {
      self.executeBatch_();
    });
  };
  var nativeSetTimeout = $jscomp.global['setTimeout'];
  AsyncExecutor.prototype.asyncExecuteFunction = function(f) {
    nativeSetTimeout(f, 0);
  };
  AsyncExecutor.prototype.executeBatch_ = function() {
    while (this.batch_ && this.batch_.length) {
      var executingBatch = this.batch_;
      this.batch_ = [];
      for (var i = 0; i < executingBatch.length; ++i) {
        var f = executingBatch[i];
        executingBatch[i] = null;
        try {
          f();
        } catch (error) {
          this.asyncThrow_(error);
        }
      }
    }
    this.batch_ = null;
  };
  AsyncExecutor.prototype.asyncThrow_ = function(exception) {
    this.asyncExecuteFunction(function() {
      throw exception;
    });
  };
  var PromiseState = {PENDING:0, FULFILLED:1, REJECTED:2};
  var PolyfillPromise = function(executor) {
    this.state_ = PromiseState.PENDING;
    this.result_ = undefined;
    this.onSettledCallbacks_ = [];
    var resolveAndReject = this.createResolveAndReject_();
    try {
      executor(resolveAndReject.resolve, resolveAndReject.reject);
    } catch (e) {
      resolveAndReject.reject(e);
    }
  };
  PolyfillPromise.prototype.createResolveAndReject_ = function() {
    var thisPromise = this;
    var alreadyCalled = false;
    function firstCallWins(method) {
      return function(x) {
        if (!alreadyCalled) {
          alreadyCalled = true;
          method.call(thisPromise, x);
        }
      };
    }
    return {resolve:firstCallWins(this.resolveTo_), reject:firstCallWins(this.reject_)};
  };
  PolyfillPromise.prototype.resolveTo_ = function(value) {
    if (value === this) {
      this.reject_(new TypeError('A Promise cannot resolve to itself'));
    } else {
      if (value instanceof PolyfillPromise) {
        this.settleSameAsPromise_(value);
      } else {
        if (isObject(value)) {
          this.resolveToNonPromiseObj_(value);
        } else {
          this.fulfill_(value);
        }
      }
    }
  };
  PolyfillPromise.prototype.resolveToNonPromiseObj_ = function(obj) {
    var thenMethod = undefined;
    try {
      thenMethod = obj.then;
    } catch (error) {
      this.reject_(error);
      return;
    }
    if (typeof thenMethod == 'function') {
      this.settleSameAsThenable_(thenMethod, obj);
    } else {
      this.fulfill_(obj);
    }
  };
  function isObject(value) {
    switch(typeof value) {
      case 'object':
        return value != null;
      case 'function':
        return true;
      default:
        return false;
    }
  }
  PolyfillPromise.prototype.reject_ = function(reason) {
    this.settle_(PromiseState.REJECTED, reason);
  };
  PolyfillPromise.prototype.fulfill_ = function(value) {
    this.settle_(PromiseState.FULFILLED, value);
  };
  PolyfillPromise.prototype.settle_ = function(settledState, valueOrReason) {
    if (this.state_ != PromiseState.PENDING) {
      throw new Error('Cannot settle(' + settledState + ', ' + valueOrReason + '): Promise already settled in state' + this.state_);
    }
    this.state_ = settledState;
    this.result_ = valueOrReason;
    this.executeOnSettledCallbacks_();
  };
  PolyfillPromise.prototype.executeOnSettledCallbacks_ = function() {
    if (this.onSettledCallbacks_ != null) {
      for (var i = 0; i < this.onSettledCallbacks_.length; ++i) {
        asyncExecutor.asyncExecute(this.onSettledCallbacks_[i]);
      }
      this.onSettledCallbacks_ = null;
    }
  };
  var asyncExecutor = new AsyncExecutor;
  PolyfillPromise.prototype.settleSameAsPromise_ = function(promise) {
    var methods = this.createResolveAndReject_();
    promise.callWhenSettled_(methods.resolve, methods.reject);
  };
  PolyfillPromise.prototype.settleSameAsThenable_ = function(thenMethod, thenable) {
    var methods = this.createResolveAndReject_();
    try {
      thenMethod.call(thenable, methods.resolve, methods.reject);
    } catch (error) {
      methods.reject(error);
    }
  };
  PolyfillPromise.prototype.then = function(onFulfilled, onRejected) {
    var resolveChild;
    var rejectChild;
    var childPromise = new PolyfillPromise(function(resolve, reject) {
      resolveChild = resolve;
      rejectChild = reject;
    });
    function createCallback(paramF, defaultF) {
      if (typeof paramF == 'function') {
        return function(x) {
          try {
            resolveChild(paramF(x));
          } catch (error) {
            rejectChild(error);
          }
        };
      } else {
        return defaultF;
      }
    }
    this.callWhenSettled_(createCallback(onFulfilled, resolveChild), createCallback(onRejected, rejectChild));
    return childPromise;
  };
  PolyfillPromise.prototype['catch'] = function(onRejected) {
    return this.then(undefined, onRejected);
  };
  PolyfillPromise.prototype.callWhenSettled_ = function(onFulfilled, onRejected) {
    var thisPromise = this;
    function callback() {
      switch(thisPromise.state_) {
        case PromiseState.FULFILLED:
          onFulfilled(thisPromise.result_);
          break;
        case PromiseState.REJECTED:
          onRejected(thisPromise.result_);
          break;
        default:
          throw new Error('Unexpected state: ' + thisPromise.state_);
      }
    }
    if (this.onSettledCallbacks_ == null) {
      asyncExecutor.asyncExecute(callback);
    } else {
      this.onSettledCallbacks_.push(callback);
    }
  };
  function resolvingPromise(opt_value) {
    if (opt_value instanceof PolyfillPromise) {
      return opt_value;
    } else {
      return new PolyfillPromise(function(resolve, reject) {
        resolve(opt_value);
      });
    }
  }
  PolyfillPromise['resolve'] = resolvingPromise;
  PolyfillPromise['reject'] = function(opt_reason) {
    return new PolyfillPromise(function(resolve, reject) {
      reject(opt_reason);
    });
  };
  PolyfillPromise['race'] = function(thenablesOrValues) {
    return new PolyfillPromise(function(resolve, reject) {
      var iterator = $jscomp.makeIterator(thenablesOrValues);
      for (var iterRec = iterator.next(); !iterRec.done; iterRec = iterator.next()) {
        resolvingPromise(iterRec.value).callWhenSettled_(resolve, reject);
      }
    });
  };
  PolyfillPromise['all'] = function(thenablesOrValues) {
    var iterator = $jscomp.makeIterator(thenablesOrValues);
    var iterRec = iterator.next();
    if (iterRec.done) {
      return resolvingPromise([]);
    } else {
      return new PolyfillPromise(function(resolveAll, rejectAll) {
        var resultsArray = [];
        var unresolvedCount = 0;
        function onFulfilled(i) {
          return function(ithResult) {
            resultsArray[i] = ithResult;
            unresolvedCount--;
            if (unresolvedCount == 0) {
              resolveAll(resultsArray);
            }
          };
        }
        do {
          resultsArray.push(undefined);
          unresolvedCount++;
          resolvingPromise(iterRec.value).callWhenSettled_(onFulfilled(resultsArray.length - 1), rejectAll);
          iterRec = iterator.next();
        } while (!iterRec.done);
      });
    }
  };
  return PolyfillPromise;
}, 'es6', 'es3');
$jscomp.polyfill('Promise.prototype.finally', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(onFinally) {
    return this.then(function(value) {
      var promise = Promise.resolve(onFinally());
      return promise.then(function() {
        return value;
      });
    }, function(reason) {
      var promise = Promise.resolve(onFinally());
      return promise.then(function() {
        throw reason;
      });
    });
  };
  return polyfill;
}, 'es9', 'es3');
$jscomp.underscoreProtoCanBeSet = function() {
  var x = {a:true};
  var y = {};
  try {
    y.__proto__ = x;
    return y.a;
  } catch (e) {
  }
  return false;
};
$jscomp.setPrototypeOf = typeof Object.setPrototypeOf == 'function' ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function(target, proto) {
  target.__proto__ = proto;
  if (target.__proto__ !== proto) {
    throw new TypeError(target + ' is not extensible');
  }
  return target;
} : null;
$jscomp.generator = {};
$jscomp.generator.ensureIteratorResultIsObject_ = function(result) {
  if (result instanceof Object) {
    return;
  }
  throw new TypeError('Iterator result ' + result + ' is not an object');
};
$jscomp.generator.Context = function() {
  this.isRunning_ = false;
  this.yieldAllIterator_ = null;
  this.yieldResult = undefined;
  this.nextAddress = 1;
  this.catchAddress_ = 0;
  this.finallyAddress_ = 0;
  this.abruptCompletion_ = null;
  this.finallyContexts_ = null;
};
$jscomp.generator.Context.prototype.start_ = function() {
  if (this.isRunning_) {
    throw new TypeError('Generator is already running');
  }
  this.isRunning_ = true;
};
$jscomp.generator.Context.prototype.stop_ = function() {
  this.isRunning_ = false;
};
$jscomp.generator.Context.prototype.jumpToErrorHandler_ = function() {
  this.nextAddress = this.catchAddress_ || this.finallyAddress_;
};
$jscomp.generator.Context.prototype.next_ = function(value) {
  this.yieldResult = value;
};
$jscomp.generator.Context.prototype.throw_ = function(e) {
  this.abruptCompletion_ = {exception:e, isException:true};
  this.jumpToErrorHandler_();
};
$jscomp.generator.Context.prototype['return'] = function(value) {
  this.abruptCompletion_ = {'return':value};
  this.nextAddress = this.finallyAddress_;
};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function(nextAddress) {
  this.abruptCompletion_ = {jumpTo:nextAddress};
  this.nextAddress = this.finallyAddress_;
};
$jscomp.generator.Context.prototype.yield = function(value, resumeAddress) {
  this.nextAddress = resumeAddress;
  return {value:value};
};
$jscomp.generator.Context.prototype.yieldAll = function(iterable, resumeAddress) {
  var iterator = $jscomp.makeIterator(iterable);
  var result = iterator.next();
  $jscomp.generator.ensureIteratorResultIsObject_(result);
  if (result.done) {
    this.yieldResult = result.value;
    this.nextAddress = resumeAddress;
    return;
  }
  this.yieldAllIterator_ = iterator;
  return this.yield(result.value, resumeAddress);
};
$jscomp.generator.Context.prototype.jumpTo = function(nextAddress) {
  this.nextAddress = nextAddress;
};
$jscomp.generator.Context.prototype.jumpToEnd = function() {
  this.nextAddress = 0;
};
$jscomp.generator.Context.prototype.setCatchFinallyBlocks = function(catchAddress, finallyAddress) {
  this.catchAddress_ = catchAddress;
  if (finallyAddress != undefined) {
    this.finallyAddress_ = finallyAddress;
  }
};
$jscomp.generator.Context.prototype.setFinallyBlock = function(finallyAddress) {
  this.catchAddress_ = 0;
  this.finallyAddress_ = finallyAddress || 0;
};
$jscomp.generator.Context.prototype.leaveTryBlock = function(nextAddress, catchAddress) {
  this.nextAddress = nextAddress;
  this.catchAddress_ = catchAddress || 0;
};
$jscomp.generator.Context.prototype.enterCatchBlock = function(nextCatchBlockAddress) {
  this.catchAddress_ = nextCatchBlockAddress || 0;
  var exception = this.abruptCompletion_.exception;
  this.abruptCompletion_ = null;
  return exception;
};
$jscomp.generator.Context.prototype.enterFinallyBlock = function(nextCatchAddress, nextFinallyAddress, finallyDepth) {
  if (!finallyDepth) {
    this.finallyContexts_ = [this.abruptCompletion_];
  } else {
    this.finallyContexts_[finallyDepth] = this.abruptCompletion_;
  }
  this.catchAddress_ = nextCatchAddress || 0;
  this.finallyAddress_ = nextFinallyAddress || 0;
};
$jscomp.generator.Context.prototype.leaveFinallyBlock = function(nextAddress, finallyDepth) {
  var preservedContext = this.finallyContexts_.splice(finallyDepth || 0)[0];
  var abruptCompletion = this.abruptCompletion_ = this.abruptCompletion_ || preservedContext;
  if (abruptCompletion) {
    if (abruptCompletion.isException) {
      return this.jumpToErrorHandler_();
    }
    if (abruptCompletion.jumpTo != undefined && this.finallyAddress_ < abruptCompletion.jumpTo) {
      this.nextAddress = abruptCompletion.jumpTo;
      this.abruptCompletion_ = null;
    } else {
      this.nextAddress = this.finallyAddress_;
    }
  } else {
    this.nextAddress = nextAddress;
  }
};
$jscomp.generator.Context.prototype.forIn = function(object) {
  return new $jscomp.generator.Context.PropertyIterator(object);
};
$jscomp.generator.Context.PropertyIterator = function(object) {
  this.object_ = object;
  this.properties_ = [];
  for (var property in object) {
    this.properties_.push(property);
  }
  this.properties_.reverse();
};
$jscomp.generator.Context.PropertyIterator.prototype.getNext = function() {
  while (this.properties_.length > 0) {
    var property = this.properties_.pop();
    if (property in this.object_) {
      return property;
    }
  }
  return null;
};
$jscomp.generator.Engine_ = function(program) {
  this.context_ = new $jscomp.generator.Context;
  this.program_ = program;
};
$jscomp.generator.Engine_.prototype.next_ = function(value) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_) {
    return this.yieldAllStep_(this.context_.yieldAllIterator_.next, value, this.context_.next_);
  }
  this.context_.next_(value);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.return_ = function(value) {
  this.context_.start_();
  var yieldAllIterator = this.context_.yieldAllIterator_;
  if (yieldAllIterator) {
    var returnFunction = 'return' in yieldAllIterator ? yieldAllIterator['return'] : function(v) {
      return {value:v, done:true};
    };
    return this.yieldAllStep_(returnFunction, value, this.context_['return']);
  }
  this.context_['return'](value);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.throw_ = function(exception) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_) {
    return this.yieldAllStep_(this.context_.yieldAllIterator_['throw'], exception, this.context_.next_);
  }
  this.context_.throw_(exception);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.yieldAllStep_ = function(action, value, nextAction) {
  try {
    var result = action.call(this.context_.yieldAllIterator_, value);
    $jscomp.generator.ensureIteratorResultIsObject_(result);
    if (!result.done) {
      this.context_.stop_();
      return result;
    }
    var resultValue = result.value;
  } catch (e) {
    this.context_.yieldAllIterator_ = null;
    this.context_.throw_(e);
    return this.nextStep_();
  }
  this.context_.yieldAllIterator_ = null;
  nextAction.call(this.context_, resultValue);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.nextStep_ = function() {
  while (this.context_.nextAddress) {
    try {
      var yieldValue = this.program_(this.context_);
      if (yieldValue) {
        this.context_.stop_();
        return {value:yieldValue.value, done:false};
      }
    } catch (e) {
      this.context_.yieldResult = undefined;
      this.context_.throw_(e);
    }
  }
  this.context_.stop_();
  if (this.context_.abruptCompletion_) {
    var abruptCompletion = this.context_.abruptCompletion_;
    this.context_.abruptCompletion_ = null;
    if (abruptCompletion.isException) {
      throw abruptCompletion.exception;
    }
    return {value:abruptCompletion['return'], done:true};
  }
  return {value:undefined, done:true};
};
$jscomp.generator.Generator_ = function(engine) {
  this.next = function(opt_value) {
    return engine.next_(opt_value);
  };
  this['throw'] = function(exception) {
    return engine.throw_(exception);
  };
  this['return'] = function(value) {
    return engine.return_(value);
  };
  $jscomp.initSymbolIterator();
  this[Symbol.iterator] = function() {
    return this;
  };
};
$jscomp.generator.createGenerator = function(generator, program) {
  var result = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(program));
  if ($jscomp.setPrototypeOf) {
    $jscomp.setPrototypeOf(result, generator.prototype);
  }
  return result;
};
$jscomp.asyncExecutePromiseGenerator = function(generator) {
  function passValueToGenerator(value) {
    return generator.next(value);
  }
  function passErrorToGenerator(error) {
    return generator['throw'](error);
  }
  return new Promise(function(resolve, reject) {
    function handleGeneratorRecord(genRec) {
      if (genRec.done) {
        resolve(genRec.value);
      } else {
        Promise.resolve(genRec.value).then(passValueToGenerator, passErrorToGenerator).then(handleGeneratorRecord, reject);
      }
    }
    handleGeneratorRecord(generator.next());
  });
};
$jscomp.asyncExecutePromiseGeneratorFunction = function(generatorFunction) {
  return $jscomp.asyncExecutePromiseGenerator(generatorFunction());
};
$jscomp.asyncExecutePromiseGeneratorProgram = function(program) {
  return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(program)));
};
$jscomp.checkEs6ConformanceViaProxy = function() {
  try {
    var proxied = {};
    var proxy = Object.create(new $jscomp.global['Proxy'](proxied, {'get':function(target, key, receiver) {
      return target == proxied && key == 'q' && receiver == proxy;
    }}));
    return proxy['q'] === true;
  } catch (err) {
    return false;
  }
};
$jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS = false;
$jscomp.ES6_CONFORMANCE = $jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS && $jscomp.checkEs6ConformanceViaProxy();
$jscomp.owns = function(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};
$jscomp.polyfill('WeakMap', function(NativeWeakMap) {
  function isConformant() {
    if (!NativeWeakMap || !Object.seal) {
      return false;
    }
    try {
      var x = Object.seal({});
      var y = Object.seal({});
      var map = new NativeWeakMap([[x, 2], [y, 3]]);
      if (map.get(x) != 2 || map.get(y) != 3) {
        return false;
      }
      map['delete'](x);
      map.set(y, 4);
      return !map.has(x) && map.get(y) == 4;
    } catch (err) {
      return false;
    }
  }
  if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
    if (NativeWeakMap && $jscomp.ES6_CONFORMANCE) {
      return NativeWeakMap;
    }
  } else {
    if (isConformant()) {
      return NativeWeakMap;
    }
  }
  var prop = '$jscomp_hidden_' + Math.random();
  function insert(target) {
    if (!$jscomp.owns(target, prop)) {
      var obj = {};
      $jscomp.defineProperty(target, prop, {value:obj});
    }
  }
  function patch(name) {
    var prev = Object[name];
    if (prev) {
      Object[name] = function(target) {
        insert(target);
        return prev(target);
      };
    }
  }
  patch('freeze');
  patch('preventExtensions');
  patch('seal');
  var index = 0;
  var PolyfillWeakMap = function(opt_iterable) {
    this.id_ = (index += Math.random() + 1).toString();
    if (opt_iterable) {
      $jscomp.initSymbol();
      $jscomp.initSymbolIterator();
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.set(item[0], item[1]);
      }
    }
  };
  PolyfillWeakMap.prototype.set = function(key, value) {
    insert(key);
    if (!$jscomp.owns(key, prop)) {
      throw new Error('WeakMap key fail: ' + key);
    }
    key[prop][this.id_] = value;
    return this;
  };
  PolyfillWeakMap.prototype.get = function(key) {
    return $jscomp.owns(key, prop) ? key[prop][this.id_] : undefined;
  };
  PolyfillWeakMap.prototype.has = function(key) {
    return $jscomp.owns(key, prop) && $jscomp.owns(key[prop], this.id_);
  };
  PolyfillWeakMap.prototype['delete'] = function(key) {
    if (!$jscomp.owns(key, prop) || !$jscomp.owns(key[prop], this.id_)) {
      return false;
    }
    return delete key[prop][this.id_];
  };
  return PolyfillWeakMap;
}, 'es6', 'es3');
$jscomp.MapEntry = function() {
  this.previous;
  this.next;
  this.head;
  this.key;
  this.value;
};
$jscomp.polyfill('Map', function(NativeMap) {
  function isConformant() {
    if ($jscomp.ASSUME_NO_NATIVE_MAP || !NativeMap || typeof NativeMap != 'function' || !NativeMap.prototype.entries || typeof Object.seal != 'function') {
      return false;
    }
    try {
      NativeMap = NativeMap;
      var key = Object.seal({x:4});
      var map = new NativeMap($jscomp.makeIterator([[key, 's']]));
      if (map.get(key) != 's' || map.size != 1 || map.get({x:4}) || map.set({x:4}, 't') != map || map.size != 2) {
        return false;
      }
      var iter = map.entries();
      var item = iter.next();
      if (item.done || item.value[0] != key || item.value[1] != 's') {
        return false;
      }
      item = iter.next();
      if (item.done || item.value[0].x != 4 || item.value[1] != 't' || !iter.next().done) {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }
  if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
    if (NativeMap && $jscomp.ES6_CONFORMANCE) {
      return NativeMap;
    }
  } else {
    if (isConformant()) {
      return NativeMap;
    }
  }
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  var idMap = new WeakMap;
  var PolyfillMap = function(opt_iterable) {
    this.data_ = {};
    this.head_ = createHead();
    this.size = 0;
    if (opt_iterable) {
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.set(item[0], item[1]);
      }
    }
  };
  PolyfillMap.prototype.set = function(key, value) {
    key = key === 0 ? 0 : key;
    var r = maybeGetEntry(this, key);
    if (!r.list) {
      r.list = this.data_[r.id] = [];
    }
    if (!r.entry) {
      r.entry = {next:this.head_, previous:this.head_.previous, head:this.head_, key:key, value:value};
      r.list.push(r.entry);
      this.head_.previous.next = r.entry;
      this.head_.previous = r.entry;
      this.size++;
    } else {
      r.entry.value = value;
    }
    return this;
  };
  PolyfillMap.prototype['delete'] = function(key) {
    var r = maybeGetEntry(this, key);
    if (r.entry && r.list) {
      r.list.splice(r.index, 1);
      if (!r.list.length) {
        delete this.data_[r.id];
      }
      r.entry.previous.next = r.entry.next;
      r.entry.next.previous = r.entry.previous;
      r.entry.head = null;
      this.size--;
      return true;
    }
    return false;
  };
  PolyfillMap.prototype.clear = function() {
    this.data_ = {};
    this.head_ = this.head_.previous = createHead();
    this.size = 0;
  };
  PolyfillMap.prototype.has = function(key) {
    return !!maybeGetEntry(this, key).entry;
  };
  PolyfillMap.prototype.get = function(key) {
    var entry = maybeGetEntry(this, key).entry;
    return entry && entry.value;
  };
  PolyfillMap.prototype.entries = function() {
    return makeIterator(this, function(entry) {
      return [entry.key, entry.value];
    });
  };
  PolyfillMap.prototype.keys = function() {
    return makeIterator(this, function(entry) {
      return entry.key;
    });
  };
  PolyfillMap.prototype.values = function() {
    return makeIterator(this, function(entry) {
      return entry.value;
    });
  };
  PolyfillMap.prototype.forEach = function(callback, opt_thisArg) {
    var iter = this.entries();
    var item;
    while (!(item = iter.next()).done) {
      var entry = item.value;
      callback.call(opt_thisArg, entry[1], entry[0], this);
    }
  };
  PolyfillMap.prototype[Symbol.iterator] = PolyfillMap.prototype.entries;
  var maybeGetEntry = function(map, key) {
    var id = getId(key);
    var list = map.data_[id];
    if (list && $jscomp.owns(map.data_, id)) {
      for (var index = 0; index < list.length; index++) {
        var entry = list[index];
        if (key !== key && entry.key !== entry.key || key === entry.key) {
          return {id:id, list:list, index:index, entry:entry};
        }
      }
    }
    return {id:id, list:list, index:-1, entry:undefined};
  };
  var makeIterator = function(map, func) {
    var entry = map.head_;
    return $jscomp.iteratorPrototype(function() {
      if (entry) {
        while (entry.head != map.head_) {
          entry = entry.previous;
        }
        while (entry.next != entry.head) {
          entry = entry.next;
          return {done:false, value:func(entry)};
        }
        entry = null;
      }
      return {done:true, value:void 0};
    });
  };
  var createHead = function() {
    var head = {};
    head.previous = head.next = head.head = head;
    return head;
  };
  var mapIndex = 0;
  var getId = function(obj) {
    var type = obj && typeof obj;
    if (type == 'object' || type == 'function') {
      obj = obj;
      if (!idMap.has(obj)) {
        var id = '' + ++mapIndex;
        idMap.set(obj, id);
        return id;
      }
      return idMap.get(obj);
    }
    return 'p_' + obj;
  };
  return PolyfillMap;
}, 'es6', 'es3');
$jscomp.polyfill('Math.acosh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    return Math.log(x + Math.sqrt(x * x - 1));
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.asinh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    var y = Math.log(Math.abs(x) + Math.sqrt(x * x + 1));
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.log1p', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x < 0.25 && x > -0.25) {
      var y = x;
      var d = 1;
      var z = x;
      var zPrev = 0;
      var s = 1;
      while (zPrev != z) {
        y *= x;
        s *= -1;
        z = (zPrev = z) + s * y / ++d;
      }
      return z;
    }
    return Math.log(1 + x);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.atanh', function(orig) {
  if (orig) {
    return orig;
  }
  var log1p = Math.log1p;
  var polyfill = function(x) {
    x = Number(x);
    return (log1p(x) - log1p(-x)) / 2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.cbrt', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (x === 0) {
      return x;
    }
    x = Number(x);
    var y = Math.pow(Math.abs(x), 1 / 3);
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.clz32', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x) >>> 0;
    if (x === 0) {
      return 32;
    }
    var result = 0;
    if ((x & 4294901760) === 0) {
      x <<= 16;
      result += 16;
    }
    if ((x & 4278190080) === 0) {
      x <<= 8;
      result += 8;
    }
    if ((x & 4026531840) === 0) {
      x <<= 4;
      result += 4;
    }
    if ((x & 3221225472) === 0) {
      x <<= 2;
      result += 2;
    }
    if ((x & 2147483648) === 0) {
      result++;
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.cosh', function(orig) {
  if (orig) {
    return orig;
  }
  var exp = Math.exp;
  var polyfill = function(x) {
    x = Number(x);
    return (exp(x) + exp(-x)) / 2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.expm1', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x < .25 && x > -.25) {
      var y = x;
      var d = 1;
      var z = x;
      var zPrev = 0;
      while (zPrev != z) {
        y *= x / ++d;
        z = (zPrev = z) + y;
      }
      return z;
    }
    return Math.exp(x) - 1;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.hypot', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x, y, var_args) {
    x = Number(x);
    y = Number(y);
    var i, z, sum;
    var max = Math.max(Math.abs(x), Math.abs(y));
    for (i = 2; i < arguments.length; i++) {
      max = Math.max(max, Math.abs(arguments[i]));
    }
    if (max > 1e100 || max < 1e-100) {
      if (!max) {
        return max;
      }
      x = x / max;
      y = y / max;
      sum = x * x + y * y;
      for (i = 2; i < arguments.length; i++) {
        z = Number(arguments[i]) / max;
        sum += z * z;
      }
      return Math.sqrt(sum) * max;
    } else {
      sum = x * x + y * y;
      for (i = 2; i < arguments.length; i++) {
        z = Number(arguments[i]);
        sum += z * z;
      }
      return Math.sqrt(sum);
    }
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.imul', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(a, b) {
    a = Number(a);
    b = Number(b);
    var ah = a >>> 16 & 65535;
    var al = a & 65535;
    var bh = b >>> 16 & 65535;
    var bl = b & 65535;
    var lh = ah * bl + al * bh << 16 >>> 0;
    return al * bl + lh | 0;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.log10', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Math.log(x) / Math.LN10;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.log2', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Math.log(x) / Math.LN2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.sign', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    return x === 0 || isNaN(x) ? x : x > 0 ? 1 : -1;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.sinh', function(orig) {
  if (orig) {
    return orig;
  }
  var exp = Math.exp;
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    return (exp(x) - exp(-x)) / 2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.tanh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    var y = Math.exp(-2 * Math.abs(x));
    var z = (1 - y) / (1 + y);
    return x < 0 ? -z : z;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.trunc', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (isNaN(x) || x === Infinity || x === -Infinity || x === 0) {
      return x;
    }
    var y = Math.floor(Math.abs(x));
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.EPSILON', function(orig) {
  return Math.pow(2, -52);
}, 'es6', 'es3');
$jscomp.polyfill('Number.MAX_SAFE_INTEGER', function() {
  return 9007199254740991;
}, 'es6', 'es3');
$jscomp.polyfill('Number.MIN_SAFE_INTEGER', function() {
  return -9007199254740991;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isFinite', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (typeof x !== 'number') {
      return false;
    }
    return !isNaN(x) && x !== Infinity && x !== -Infinity;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isInteger', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (!Number.isFinite(x)) {
      return false;
    }
    return x === Math.floor(x);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isNaN', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return typeof x === 'number' && isNaN(x);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isSafeInteger', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Number.isInteger(x) && Math.abs(x) <= Number.MAX_SAFE_INTEGER;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.parseFloat', function(orig) {
  return orig || parseFloat;
}, 'es6', 'es3');
$jscomp.polyfill('Number.parseInt', function(orig) {
  return orig || parseInt;
}, 'es6', 'es3');
$jscomp.assign = typeof Object.assign == 'function' ? Object.assign : function(target, var_args) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    if (!source) {
      continue;
    }
    for (var key in source) {
      if ($jscomp.owns(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};
$jscomp.polyfill('Object.assign', function(orig) {
  return orig || $jscomp.assign;
}, 'es6', 'es3');
$jscomp.polyfill('Object.entries', function(orig) {
  if (orig) {
    return orig;
  }
  var entries = function(obj) {
    var result = [];
    for (var key in obj) {
      if ($jscomp.owns(obj, key)) {
        result.push([key, obj[key]]);
      }
    }
    return result;
  };
  return entries;
}, 'es8', 'es3');
$jscomp.polyfill('Object.getOwnPropertySymbols', function(orig) {
  if (orig) {
    return orig;
  }
  return function() {
    return [];
  };
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.ownKeys', function(orig) {
  if (orig) {
    return orig;
  }
  var symbolPrefix = 'jscomp_symbol_';
  function isSymbol(key) {
    return key.substring(0, symbolPrefix.length) == symbolPrefix;
  }
  var polyfill = function(target) {
    var keys = [];
    var names = Object.getOwnPropertyNames(target);
    var symbols = Object.getOwnPropertySymbols(target);
    for (var i = 0; i < names.length; i++) {
      (isSymbol(names[i]) ? symbols : keys).push(names[i]);
    }
    return keys.concat(symbols);
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Object.getOwnPropertyDescriptors', function(orig) {
  if (orig) {
    return orig;
  }
  var getOwnPropertyDescriptors = function(obj) {
    var result = {};
    var keys = Reflect.ownKeys(obj);
    for (var i = 0; i < keys.length; i++) {
      result[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return result;
  };
  return getOwnPropertyDescriptors;
}, 'es8', 'es5');
$jscomp.polyfill('Object.setPrototypeOf', function(orig) {
  return orig || $jscomp.setPrototypeOf;
}, 'es6', 'es5');
$jscomp.polyfill('Object.values', function(orig) {
  if (orig) {
    return orig;
  }
  var values = function(obj) {
    var result = [];
    for (var key in obj) {
      if ($jscomp.owns(obj, key)) {
        result.push(obj[key]);
      }
    }
    return result;
  };
  return values;
}, 'es8', 'es3');
$jscomp.polyfill('Reflect.apply', function(orig) {
  if (orig) {
    return orig;
  }
  var apply = Function.prototype.apply;
  var polyfill = function(target, thisArg, argList) {
    return apply.call(target, thisArg, argList);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.objectCreate = $jscomp.ASSUME_ES5 || typeof Object.create == 'function' ? Object.create : function(prototype) {
  var ctor = function() {
  };
  ctor.prototype = prototype;
  return new ctor;
};
$jscomp.construct = function() {
  function reflectConstructWorks() {
    function Base() {
    }
    function Derived() {
    }
    new Base;
    Reflect.construct(Base, [], Derived);
    return new Base instanceof Base;
  }
  if (typeof Reflect != 'undefined' && Reflect.construct) {
    if (reflectConstructWorks()) {
      return Reflect.construct;
    }
    var brokenConstruct = Reflect.construct;
    var patchedConstruct = function(target, argList, opt_newTarget) {
      var out = brokenConstruct(target, argList);
      if (opt_newTarget) {
        Reflect.setPrototypeOf(out, opt_newTarget.prototype);
      }
      return out;
    };
    return patchedConstruct;
  }
  function construct(target, argList, opt_newTarget) {
    if (opt_newTarget === undefined) {
      opt_newTarget = target;
    }
    var proto = opt_newTarget.prototype || Object.prototype;
    var obj = $jscomp.objectCreate(proto);
    var apply = Function.prototype.apply;
    var out = apply.call(target, obj, argList);
    return out || obj;
  }
  return construct;
}();
$jscomp.polyfill('Reflect.construct', function(orig) {
  return $jscomp.construct;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.defineProperty', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, attributes) {
    try {
      Object.defineProperty(target, propertyKey, attributes);
      var desc = Object.getOwnPropertyDescriptor(target, propertyKey);
      if (!desc) {
        return false;
      }
      return desc.configurable === (attributes.configurable || false) && desc.enumerable === (attributes.enumerable || false) && ('value' in desc ? desc.value === attributes.value && desc.writable === (attributes.writable || false) : desc.get === attributes.get && desc.set === attributes.set);
    } catch (err) {
      return false;
    }
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.deleteProperty', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey) {
    if (!$jscomp.owns(target, propertyKey)) {
      return true;
    }
    try {
      return delete target[propertyKey];
    } catch (err) {
      return false;
    }
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.getOwnPropertyDescriptor', function(orig) {
  return orig || Object.getOwnPropertyDescriptor;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.getPrototypeOf', function(orig) {
  return orig || Object.getPrototypeOf;
}, 'es6', 'es5');
$jscomp.findDescriptor = function(target, propertyKey) {
  var obj = target;
  while (obj) {
    var property = Reflect.getOwnPropertyDescriptor(obj, propertyKey);
    if (property) {
      return property;
    }
    obj = Reflect.getPrototypeOf(obj);
  }
  return undefined;
};
$jscomp.polyfill('Reflect.get', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, opt_receiver) {
    if (arguments.length <= 2) {
      return target[propertyKey];
    }
    var property = $jscomp.findDescriptor(target, propertyKey);
    if (property) {
      return property.get ? property.get.call(opt_receiver) : property.value;
    }
    return undefined;
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.has', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey) {
    return propertyKey in target;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.isExtensible', function(orig) {
  if (orig) {
    return orig;
  }
  if ($jscomp.ASSUME_ES5 || typeof Object.isExtensible == 'function') {
    return Object.isExtensible;
  }
  return function() {
    return true;
  };
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.preventExtensions', function(orig) {
  if (orig) {
    return orig;
  }
  if (!($jscomp.ASSUME_ES5 || typeof Object.preventExtensions == 'function')) {
    return function() {
      return false;
    };
  }
  var polyfill = function(target) {
    Object.preventExtensions(target);
    return !Object.isExtensible(target);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.set', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, value, opt_receiver) {
    var property = $jscomp.findDescriptor(target, propertyKey);
    if (!property) {
      if (Reflect.isExtensible(target)) {
        target[propertyKey] = value;
        return true;
      }
      return false;
    }
    if (property.set) {
      property.set.call(arguments.length > 3 ? opt_receiver : target, value);
      return true;
    } else {
      if (property.writable && !Object.isFrozen(target)) {
        target[propertyKey] = value;
        return true;
      }
    }
    return false;
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.setPrototypeOf', function(orig) {
  if (orig) {
    return orig;
  } else {
    if ($jscomp.setPrototypeOf) {
      var setPrototypeOf = $jscomp.setPrototypeOf;
      var polyfill = function(target, proto) {
        try {
          setPrototypeOf(target, proto);
          return true;
        } catch (e) {
          return false;
        }
      };
      return polyfill;
    } else {
      return null;
    }
  }
}, 'es6', 'es5');
$jscomp.polyfill('Set', function(NativeSet) {
  function isConformant() {
    if ($jscomp.ASSUME_NO_NATIVE_SET || !NativeSet || typeof NativeSet != 'function' || !NativeSet.prototype.entries || typeof Object.seal != 'function') {
      return false;
    }
    try {
      NativeSet = NativeSet;
      var value = Object.seal({x:4});
      var set = new NativeSet($jscomp.makeIterator([value]));
      if (!set.has(value) || set.size != 1 || set.add(value) != set || set.size != 1 || set.add({x:4}) != set || set.size != 2) {
        return false;
      }
      var iter = set.entries();
      var item = iter.next();
      if (item.done || item.value[0] != value || item.value[1] != value) {
        return false;
      }
      item = iter.next();
      if (item.done || item.value[0] == value || item.value[0].x != 4 || item.value[1] != item.value[0]) {
        return false;
      }
      return iter.next().done;
    } catch (err) {
      return false;
    }
  }
  if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
    if (NativeSet && $jscomp.ES6_CONFORMANCE) {
      return NativeSet;
    }
  } else {
    if (isConformant()) {
      return NativeSet;
    }
  }
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  var PolyfillSet = function(opt_iterable) {
    this.map_ = new Map;
    if (opt_iterable) {
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.add(item);
      }
    }
    this.size = this.map_.size;
  };
  PolyfillSet.prototype.add = function(value) {
    value = value === 0 ? 0 : value;
    this.map_.set(value, value);
    this.size = this.map_.size;
    return this;
  };
  PolyfillSet.prototype['delete'] = function(value) {
    var result = this.map_['delete'](value);
    this.size = this.map_.size;
    return result;
  };
  PolyfillSet.prototype.clear = function() {
    this.map_.clear();
    this.size = 0;
  };
  PolyfillSet.prototype.has = function(value) {
    return this.map_.has(value);
  };
  PolyfillSet.prototype.entries = function() {
    return this.map_.entries();
  };
  PolyfillSet.prototype.values = function() {
    return this.map_.values();
  };
  PolyfillSet.prototype.keys = PolyfillSet.prototype.values;
  PolyfillSet.prototype[Symbol.iterator] = PolyfillSet.prototype.values;
  PolyfillSet.prototype.forEach = function(callback, opt_thisArg) {
    var set = this;
    this.map_.forEach(function(value) {
      return callback.call(opt_thisArg, value, value, set);
    });
  };
  return PolyfillSet;
}, 'es6', 'es3');
$jscomp.checkStringArgs = function(thisArg, arg, func) {
  if (thisArg == null) {
    throw new TypeError("The 'this' value for String.prototype." + func + ' must not be null or undefined');
  }
  if (arg instanceof RegExp) {
    throw new TypeError('First argument to String.prototype.' + func + ' must not be a regular expression');
  }
  return thisArg + '';
};
$jscomp.polyfill('String.prototype.codePointAt', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(position) {
    var string = $jscomp.checkStringArgs(this, null, 'codePointAt');
    var size = string.length;
    position = Number(position) || 0;
    if (!(position >= 0 && position < size)) {
      return void 0;
    }
    position = position | 0;
    var first = string.charCodeAt(position);
    if (first < 55296 || first > 56319 || position + 1 === size) {
      return first;
    }
    var second = string.charCodeAt(position + 1);
    if (second < 56320 || second > 57343) {
      return first;
    }
    return (first - 55296) * 1024 + second + 9216;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.prototype.endsWith', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'endsWith');
    searchString = searchString + '';
    if (opt_position === void 0) {
      opt_position = string.length;
    }
    var i = Math.max(0, Math.min(opt_position | 0, string.length));
    var j = searchString.length;
    while (j > 0 && i > 0) {
      if (string[--i] != searchString[--j]) {
        return false;
      }
    }
    return j <= 0;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.fromCodePoint', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(var_args) {
    var result = '';
    for (var i = 0; i < arguments.length; i++) {
      var code = Number(arguments[i]);
      if (code < 0 || code > 1114111 || code !== Math.floor(code)) {
        throw new RangeError('invalid_code_point ' + code);
      }
      if (code <= 65535) {
        result += String.fromCharCode(code);
      } else {
        code -= 65536;
        result += String.fromCharCode(code >>> 10 & 1023 | 55296);
        result += String.fromCharCode(code & 1023 | 56320);
      }
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.prototype.includes', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'includes');
    return string.indexOf(searchString, opt_position || 0) !== -1;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.prototype.repeat', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(copies) {
    var string = $jscomp.checkStringArgs(this, null, 'repeat');
    if (copies < 0 || copies > 1342177279) {
      throw new RangeError('Invalid count value');
    }
    copies = copies | 0;
    var result = '';
    while (copies) {
      if (copies & 1) {
        result += string;
      }
      if (copies >>>= 1) {
        string += string;
      }
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.stringPadding = function(padString, padLength) {
  var padding = padString !== undefined ? String(padString) : ' ';
  if (!(padLength > 0) || !padding) {
    return '';
  }
  var repeats = Math.ceil(padLength / padding.length);
  return padding.repeat(repeats).substring(0, padLength);
};
$jscomp.polyfill('String.prototype.padEnd', function(orig) {
  if (orig) {
    return orig;
  }
  var padEnd = function(targetLength, opt_padString) {
    var string = $jscomp.checkStringArgs(this, null, 'padStart');
    var padLength = targetLength - string.length;
    return string + $jscomp.stringPadding(opt_padString, padLength);
  };
  return padEnd;
}, 'es8', 'es3');
$jscomp.polyfill('String.prototype.padStart', function(orig) {
  if (orig) {
    return orig;
  }
  var padStart = function(targetLength, opt_padString) {
    var string = $jscomp.checkStringArgs(this, null, 'padStart');
    var padLength = targetLength - string.length;
    return $jscomp.stringPadding(opt_padString, padLength) + string;
  };
  return padStart;
}, 'es8', 'es3');
$jscomp.polyfill('String.prototype.startsWith', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'startsWith');
    searchString = searchString + '';
    var strLen = string.length;
    var searchLen = searchString.length;
    var i = Math.max(0, Math.min(opt_position | 0, string.length));
    var j = 0;
    while (j < searchLen && i < strLen) {
      if (string[i++] != searchString[j++]) {
        return false;
      }
    }
    return j >= searchLen;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.arrayFromIterator = function(iterator) {
  var i;
  var arr = [];
  while (!(i = iterator.next()).done) {
    arr.push(i.value);
  }
  return arr;
};
$jscomp.arrayFromIterable = function(iterable) {
  if (iterable instanceof Array) {
    return iterable;
  } else {
    return $jscomp.arrayFromIterator($jscomp.makeIterator(iterable));
  }
};
$jscomp.inherits = function(childCtor, parentCtor) {
  childCtor.prototype = $jscomp.objectCreate(parentCtor.prototype);
  childCtor.prototype.constructor = childCtor;
  if ($jscomp.setPrototypeOf) {
    var setPrototypeOf = $jscomp.setPrototypeOf;
    setPrototypeOf(childCtor, parentCtor);
  } else {
    for (var p in parentCtor) {
      if (p == 'prototype') {
        continue;
      }
      if (Object.defineProperties) {
        var descriptor = Object.getOwnPropertyDescriptor(parentCtor, p);
        if (descriptor) {
          Object.defineProperty(childCtor, p, descriptor);
        }
      } else {
        childCtor[p] = parentCtor[p];
      }
    }
  }
  childCtor.superClass_ = parentCtor.prototype;
};
$jscomp.polyfill('WeakSet', function(NativeWeakSet) {
  function isConformant() {
    if (!NativeWeakSet || !Object.seal) {
      return false;
    }
    try {
      var x = Object.seal({});
      var y = Object.seal({});
      var set = new NativeWeakSet([x]);
      if (!set.has(x) || set.has(y)) {
        return false;
      }
      set['delete'](x);
      set.add(y);
      return !set.has(x) && set.has(y);
    } catch (err) {
      return false;
    }
  }
  if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
    if (NativeWeakSet && $jscomp.ES6_CONFORMANCE) {
      return NativeWeakSet;
    }
  } else {
    if (isConformant()) {
      return NativeWeakSet;
    }
  }
  var PolyfillWeakSet = function(opt_iterable) {
    this.map_ = new WeakMap;
    if (opt_iterable) {
      $jscomp.initSymbol();
      $jscomp.initSymbolIterator();
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.add(item);
      }
    }
  };
  PolyfillWeakSet.prototype.add = function(elem) {
    this.map_.set(elem, true);
    return this;
  };
  PolyfillWeakSet.prototype.has = function(elem) {
    return this.map_.has(elem);
  };
  PolyfillWeakSet.prototype['delete'] = function(elem) {
    return this.map_['delete'](elem);
  };
  return PolyfillWeakSet;
}, 'es6', 'es3');
try {
  if (Array.prototype.values.toString().indexOf('[native code]') == -1) {
    delete Array.prototype.values;
  }
} catch (e) {
}
Ext.define('Ext.theme.neptune.Component', {override:'Ext.Component', initComponent:function() {
  this.callParent();
  if (this.dock && this.border === undefined) {
    this.border = false;
  }
}, privates:{initStyles:function() {
  var me = this, hasOwnBorder = me.hasOwnProperty('border'), border = me.border;
  if (me.dock) {
    me.border = null;
  }
  me.callParent(arguments);
  if (hasOwnBorder) {
    me.border = border;
  } else {
    delete me.border;
  }
}}}, function() {
  Ext.namespace('Ext.theme.is').Neptune = true;
  Ext.theme.name = 'Neptune';
});
Ext.define('Ext.theme.triton.Component', {override:'Ext.Component'}, function() {
  Ext.namespace('Ext.theme.is').Triton = true;
  Ext.theme.name = 'Triton';
});
Ext.define('Ext.theme.neptune.resizer.Splitter', {override:'Ext.resizer.Splitter', size:8});
Ext.define('Ext.theme.triton.resizer.Splitter', {override:'Ext.resizer.Splitter', size:10});
Ext.define('Ext.theme.neptune.toolbar.Toolbar', {override:'Ext.toolbar.Toolbar', usePlainButtons:false, border:false});
Ext.define('Ext.theme.neptune.toolbar.Paging', {override:'Ext.toolbar.Paging', defaultButtonUI:'plain-toolbar', inputItemWidth:40});
Ext.define('Ext.theme.triton.toolbar.Paging', {override:'Ext.toolbar.Paging', inputItemWidth:50});
Ext.define('Ext.theme.neptune.layout.component.Dock', {override:'Ext.layout.component.Dock', noBorderClassTable:[0, Ext.baseCSSPrefix + 'noborder-l', Ext.baseCSSPrefix + 'noborder-b', Ext.baseCSSPrefix + 'noborder-bl', Ext.baseCSSPrefix + 'noborder-r', Ext.baseCSSPrefix + 'noborder-rl', Ext.baseCSSPrefix + 'noborder-rb', Ext.baseCSSPrefix + 'noborder-rbl', Ext.baseCSSPrefix + 'noborder-t', Ext.baseCSSPrefix + 'noborder-tl', Ext.baseCSSPrefix + 'noborder-tb', Ext.baseCSSPrefix + 'noborder-tbl', Ext.baseCSSPrefix + 
'noborder-tr', Ext.baseCSSPrefix + 'noborder-trl', Ext.baseCSSPrefix + 'noborder-trb', Ext.baseCSSPrefix + 'noborder-trbl'], edgeMasks:{top:8, right:4, bottom:2, left:1}, handleItemBorders:function() {
  var me = this, edges = 0, maskT = 8, maskR = 4, maskB = 2, maskL = 1, owner = me.owner, bodyBorder = owner.bodyBorder, ownerBorder = owner.border, collapsed = me.collapsed, edgeMasks = me.edgeMasks, noBorderCls = me.noBorderClassTable, dockedItemsGen = owner.dockedItems.generation, b, borderCls, docked, edgesTouched, i, ln, item, dock, lastValue, mask, addCls, removeCls;
  if (me.initializedBorders === dockedItemsGen) {
    return;
  }
  addCls = [];
  removeCls = [];
  borderCls = me.getBorderCollapseTable();
  noBorderCls = me.getBorderClassTable ? me.getBorderClassTable() : noBorderCls;
  me.initializedBorders = dockedItemsGen;
  me.collapsed = false;
  docked = me.getDockedItems('visual');
  me.collapsed = collapsed;
  for (i = 0, ln = docked.length; i < ln; i++) {
    item = docked[i];
    if (item.ignoreBorderManagement) {
      continue;
    }
    dock = item.dock;
    mask = edgesTouched = 0;
    addCls.length = 0;
    removeCls.length = 0;
    if (dock !== 'bottom') {
      if (edges & maskT) {
        b = item.border;
      } else {
        b = ownerBorder;
        if (b !== false) {
          edgesTouched += maskT;
        }
      }
      if (b === false) {
        mask += maskT;
      }
    }
    if (dock !== 'left') {
      if (edges & maskR) {
        b = item.border;
      } else {
        b = ownerBorder;
        if (b !== false) {
          edgesTouched += maskR;
        }
      }
      if (b === false) {
        mask += maskR;
      }
    }
    if (dock !== 'top') {
      if (edges & maskB) {
        b = item.border;
      } else {
        b = ownerBorder;
        if (b !== false) {
          edgesTouched += maskB;
        }
      }
      if (b === false) {
        mask += maskB;
      }
    }
    if (dock !== 'right') {
      if (edges & maskL) {
        b = item.border;
      } else {
        b = ownerBorder;
        if (b !== false) {
          edgesTouched += maskL;
        }
      }
      if (b === false) {
        mask += maskL;
      }
    }
    if ((lastValue = item.lastBorderMask) !== mask) {
      item.lastBorderMask = mask;
      if (lastValue) {
        removeCls[0] = noBorderCls[lastValue];
      }
      if (mask) {
        addCls[0] = noBorderCls[mask];
      }
    }
    if ((lastValue = item.lastBorderCollapse) !== edgesTouched) {
      item.lastBorderCollapse = edgesTouched;
      if (lastValue) {
        removeCls[removeCls.length] = borderCls[lastValue];
      }
      if (edgesTouched) {
        addCls[addCls.length] = borderCls[edgesTouched];
      }
    }
    if (removeCls.length) {
      item.removeCls(removeCls);
    }
    if (addCls.length) {
      item.addCls(addCls);
    }
    edges |= edgeMasks[dock];
  }
  mask = edgesTouched = 0;
  addCls.length = 0;
  removeCls.length = 0;
  if (edges & maskT) {
    b = bodyBorder;
  } else {
    b = ownerBorder;
    if (b !== false) {
      edgesTouched += maskT;
    }
  }
  if (b === false) {
    mask += maskT;
  }
  if (edges & maskR) {
    b = bodyBorder;
  } else {
    b = ownerBorder;
    if (b !== false) {
      edgesTouched += maskR;
    }
  }
  if (b === false) {
    mask += maskR;
  }
  if (edges & maskB) {
    b = bodyBorder;
  } else {
    b = ownerBorder;
    if (b !== false) {
      edgesTouched += maskB;
    }
  }
  if (b === false) {
    mask += maskB;
  }
  if (edges & maskL) {
    b = bodyBorder;
  } else {
    b = ownerBorder;
    if (b !== false) {
      edgesTouched += maskL;
    }
  }
  if (b === false) {
    mask += maskL;
  }
  if ((lastValue = me.lastBodyBorderMask) !== mask) {
    me.lastBodyBorderMask = mask;
    if (lastValue) {
      removeCls[0] = noBorderCls[lastValue];
    }
    if (mask) {
      addCls[0] = noBorderCls[mask];
    }
  }
  if ((lastValue = me.lastBodyBorderCollapse) !== edgesTouched) {
    me.lastBodyBorderCollapse = edgesTouched;
    if (lastValue) {
      removeCls[removeCls.length] = borderCls[lastValue];
    }
    if (edgesTouched) {
      addCls[addCls.length] = borderCls[edgesTouched];
    }
  }
  if (removeCls.length) {
    owner.removeBodyCls(removeCls);
  }
  if (addCls.length) {
    owner.addBodyCls(addCls);
  }
}, onRemove:function(item) {
  var me = this, lastBorderMask = item.lastBorderMask, lastBorderCollapse = item.lastBorderCollapse;
  if (!item.destroyed && !item.ignoreBorderManagement) {
    if (lastBorderMask) {
      item.lastBorderMask = 0;
      item.removeCls(me.noBorderClassTable[lastBorderMask]);
    }
    if (lastBorderCollapse) {
      item.lastBorderCollapse = 0;
      item.removeCls(me.getBorderCollapseTable()[lastBorderCollapse]);
    }
  }
  me.callParent([item]);
}});
Ext.define('Ext.theme.neptune.panel.Panel', {override:'Ext.panel.Panel', border:false, bodyBorder:false, initBorderProps:Ext.emptyFn, initBodyBorder:function() {
  if (this.bodyBorder !== true) {
    this.callParent();
  }
}});
Ext.define('Ext.theme.neptune.form.field.HtmlEditor', {override:'Ext.form.field.HtmlEditor', defaultButtonUI:'plain-toolbar'});
Ext.define('Ext.theme.triton.form.field.Checkbox', {override:'Ext.form.field.Checkbox', compatibility:Ext.isIE8, initComponent:function() {
  this.callParent();
  Ext.on({show:'onGlobalShow', scope:this});
}, onFocus:function(e) {
  var focusClsEl;
  this.callParent([e]);
  focusClsEl = this.getFocusClsEl();
  if (focusClsEl) {
    focusClsEl.syncRepaint();
  }
}, onBlur:function(e) {
  var focusClsEl;
  this.callParent([e]);
  focusClsEl = this.getFocusClsEl();
  if (focusClsEl) {
    focusClsEl.syncRepaint();
  }
}, onGlobalShow:function(cmp) {
  if (cmp.isAncestor(this)) {
    this.getFocusClsEl().syncRepaint();
  }
}});
Ext.define('Ext.theme.neptune.picker.Month', {override:'Ext.picker.Month', measureMaxHeight:36});
Ext.define('Ext.theme.triton.picker.Month', {override:'Ext.picker.Month', footerButtonUI:'default-toolbar', calculateMonthMargin:Ext.emptyFn});
Ext.define('Ext.theme.triton.picker.Date', {override:'Ext.picker.Date', footerButtonUI:'default-toolbar'});
Ext.define('Ext.theme.neptune.panel.Table', {override:'Ext.panel.Table', lockableBodyBorder:true, initComponent:function() {
  var me = this;
  me.callParent();
  if (!me.hasOwnProperty('bodyBorder') && !me.hideHeaders && (me.lockableBodyBorder || !me.lockable)) {
    me.bodyBorder = true;
  }
}});
Ext.define('Ext.theme.triton.grid.column.Column', {override:'Ext.grid.column.Column', compatibility:Ext.isIE8, onTitleMouseOver:function() {
  var triggerEl = this.triggerEl;
  this.callParent(arguments);
  if (triggerEl) {
    triggerEl.syncRepaint();
  }
}});
Ext.define('Ext.theme.triton.grid.column.Check', {override:'Ext.grid.column.Check', compatibility:Ext.isIE8, setRecordCheck:function(record, index, checked, cell) {
  this.callParent(arguments);
  Ext.fly(cell).syncRepaint();
}});
Ext.define('Ext.theme.neptune.grid.column.RowNumberer', {override:'Ext.grid.column.RowNumberer', width:25});
Ext.define('Ext.theme.triton.grid.column.RowNumberer', {override:'Ext.grid.column.RowNumberer', width:32});
Ext.define('Ext.theme.triton.menu.Item', {override:'Ext.menu.Item', compatibility:Ext.isIE8, onFocus:function(e) {
  this.callParent([e]);
  this.repaintIcons();
}, onFocusLeave:function(e) {
  this.callParent([e]);
  this.repaintIcons();
}, privates:{repaintIcons:function() {
  var iconEl = this.iconEl, arrowEl = this.arrowEl, checkEl = this.checkEl;
  if (iconEl) {
    iconEl.syncRepaint();
  }
  if (arrowEl) {
    arrowEl.syncRepaint();
  }
  if (checkEl) {
    checkEl.syncRepaint();
  }
}}});
Ext.define('Ext.theme.neptune.menu.Separator', {override:'Ext.menu.Separator', border:true});
Ext.define('Ext.theme.neptune.menu.Menu', {override:'Ext.menu.Menu', showSeparator:false});
Ext.define('Ext.theme.triton.menu.Menu', {override:'Ext.menu.Menu', compatibility:Ext.isIE8, afterShow:function() {
  var me = this, items, item, i, len;
  me.callParent(arguments);
  items = me.items.getRange();
  for (i = 0, len = items.length; i < len; i++) {
    item = items[i];
    if (item && item.repaintIcons) {
      item.repaintIcons();
    }
  }
}});
Ext.define('Ext.theme.triton.grid.plugin.RowExpander', {override:'Ext.grid.plugin.RowExpander', headerWidth:32});
Ext.define('Ext.theme.triton.selection.CheckboxModel', {override:'Ext.selection.CheckboxModel', headerWidth:32, onHeaderClick:function(headerCt, header, e) {
  this.callParent([headerCt, header, e]);
  if (Ext.isIE8) {
    header.getView().ownerGrid.el.syncRepaint();
  }
}});
Ext.namespace('Ext.theme.is')['theme-triton-02c84041-4924-46e1-99ec-cfe11f16d8b3'] = true;
Ext.theme.name = 'theme-triton-02c84041-4924-46e1-99ec-cfe11f16d8b3';
Ext.define('SIMFito.model.AbbattimentiModel', {extend:Ext.data.Model, alias:'model.abbattimentimodel', fields:[{type:'int', allowNull:true, name:'id'}, {type:'int', name:'quantity'}, {type:'date', name:'date'}, {type:'date', name:'data_sopralluogo'}, {type:'int', name:'osservazioni_id'}, {type:'string', name:'descrizione'}, {type:'string', name:'tecnico'}]});
Ext.define('SIMFito.model.AllorgModel', {extend:Ext.data.Model, alias:'model.allorgmodel', fields:[{type:'int', name:'nameid'}, {type:'int', name:'codeid'}, {type:'string', name:'name'}, {type:'string', name:'b_code'}, {type:'string', name:'dt_code'}]});
Ext.define('SIMFito.model.AnalisysProvinceModel', {extend:Ext.data.Model, alias:'model.analisysprovincemodel', fields:[{name:'provincia'}]});
Ext.define('SIMFito.model.AnalisysReasonModel', {extend:Ext.data.Model, alias:'model.analisysreasonmodel', fields:[{type:'int', name:'id'}, {type:'string', name:'description'}]});
Ext.define('SIMFito.model.AnalisysStatisticsModel', {extend:Ext.data.Model, alias:'model.analisysstatisticsmodel', fields:[{type:'int', name:'pri'}, {type:'string', name:'hostname'}, {type:'string', name:'pestname'}, {type:'string', name:'section'}, {type:'string', name:'testname'}, {type:'string', name:'erason'}, {type:'string', name:'resultname'}, {type:'string', name:'provincename'}, {type:'int', name:'cc'}]});
Ext.define('SIMFito.model.AreasModel', {extend:Ext.data.Model, alias:'model.areasmodel', fields:[{type:'string', name:'id'}, {type:'string', name:'params'}, {type:'string', name:'pest'}, {type:'string', name:'name'}, {type:'int', name:'anno'}, {type:'int', name:'tampone'}, {type:'int', name:'contenimento'}, {type:'int', name:'area_infestata'}, {type:'int', name:'area_user_infestata'}, {type:'int', name:'area_tampone'}, {type:'int', name:'area_user_tampone'}, {type:'int', name:'area_contenimento'}, 
{type:'int', name:'area_user_contenimento'}, {type:'boolean', name:'enabled'}, {type:'date', name:'datefrom', dateFormat:'d/m/Y', dateReadFormat:'Y-m-d'}, {type:'date', name:'dateto', dateFormat:'d/m/Y', dateReadFormat:'Y-m-d'}]});
Ext.define('SIMFito.model.AssociaTecniciModel', {extend:Ext.data.Model, alias:'model.associatecnicimodel', fields:[{type:'int', name:'id_tecnico'}, {type:'string', name:'nome'}, {type:'string', name:'tipotecnico'}, {type:'int', name:'idtipo_tecnico'}, {type:'string', name:'codicefiscale'}, {type:'string', name:'ufficio'}, {type:'string', name:'email'}]});
Ext.define('SIMFito.model.AttaccogModel', {extend:Ext.data.Model, alias:'model.attaccogmodel', fields:[{type:'int', name:'id'}, {type:'int', name:'id_grado'}, {type:'string', name:'nome_grado'}]});
Ext.define('SIMFito.model.AttaccoiModel', {extend:Ext.data.Model, alias:'model.attaccoimodel', fields:[{type:'int', name:'id'}, {type:'string', name:'nome_intensity'}, {type:'int', name:'id_intensity'}]});
Ext.define('SIMFito.model.AttachmentModel', {extend:Ext.data.Model, alias:'model.attachmentmodel', fields:[{type:'string', name:'file_name'}]});
Ext.define('SIMFito.model.AziendeModel', {extend:Ext.data.Model, alias:'model.aziendemodel', fields:[{type:'int', name:'id_azienda'}, {type:'string', name:'partita_iva'}, {type:'string', name:'rag_soc'}, {type:'string', name:'tipo'}, {type:'string', name:'istat_comune'}, {type:'string', name:'indirizzo'}, {type:'string', name:'cap'}, {type:'string', name:'comune'}, {type:'string', name:'provincia'}, {type:'string', name:'referente'}, {type:'string', name:'posizione_ref'}, {type:'string', name:'telefono'}, 
{type:'string', name:'fax'}, {type:'string', name:'email'}, {type:'string', name:'bbox'}]});
Ext.define('SIMFito.model.AziendeModel2', {extend:Ext.data.Model, fields:[{type:'int', name:'id_azienda'}, {type:'string', name:'partita_iva'}, {type:'string', name:'rag_soc'}, {type:'string', name:'istat_comune'}, {type:'string', name:'indirizzo'}, {type:'string', name:'cap'}, {type:'string', name:'comune'}, {type:'string', name:'provincia'}, {type:'string', name:'referente'}, {type:'string', name:'posizione_ref'}, {type:'string', name:'telefono'}, {type:'string', name:'fax'}, {type:'string', name:'email'}]});
Ext.define('SIMFito.model.CampionecodeModel', {extend:Ext.data.Model, alias:'model.campionecodemodel', fields:[{type:'int', name:'id'}, {type:'string', name:'codice'}, {type:'string', name:'descrizione'}, {type:'boolean', name:'nuovo'}, {type:'string', name:'campioncode'}, {type:'int', name:'code'}, {type:'int', allowNull:true, name:'tipocampione_id'}]});
Ext.define('SIMFito.model.ChangeLogModel', {extend:Ext.data.Model, alias:'model.changelogmodel', fields:[{type:'int', name:'id'}, {type:'date', name:'date', dateReadFormat:'Y-m-d'}, {type:'string', name:'changelog'}, {type:'boolean', name:'read'}]});
Ext.define('SIMFito.model.ComuniModel', {extend:Ext.data.Model, alias:'model.comunimodel', fields:[{type:'string', name:'istat'}, {type:'string', name:'nome'}, {type:'string', name:'provincia'}]});
Ext.define('SIMFito.model.FarmModel', {extend:Ext.data.Model, fields:[{type:'int', name:'id_azienda'}, {type:'string', name:'partita_iva'}, {type:'string', name:'rag_soc'}, {type:'string', name:'tipo'}, {type:'string', name:'istat_comune'}, {type:'string', name:'indirizzo'}, {type:'string', name:'cap'}, {type:'string', name:'comune'}, {type:'string', name:'provincia'}, {type:'string', name:'referente'}, {type:'string', name:'posizione_ref'}, {type:'string', name:'telefono'}, {type:'string', name:'fax'}, 
{type:'string', name:'email'}]});
Ext.define('SIMFito.model.FasifenologicheModel', {extend:Ext.data.Model, alias:'model.fasifenologichemodel', fields:[{type:'int', name:'id_fase_fenologicha'}, {type:'string', name:'fase_fenologica'}, {type:'string', name:'info'}]});
Ext.define('SIMFito.model.HostPestModel', {extend:Ext.data.Model, alias:'model.hostpestmodel', fields:[{type:'string', name:'b_code'}, {type:'string', name:'full_name'}]});
Ext.define('SIMFito.model.HostrdModel', {extend:Ext.data.Model, alias:'model.hostrdmodel', fields:[{type:'int', name:'nameid'}, {type:'int', name:'codeid'}, {type:'string', name:'name'}, {name:'b_code'}, {type:'string', name:'dt_code'}]});
Ext.define('SIMFito.model.LaboratorioModel', {extend:Ext.data.Model, alias:'model.laboratoriomodel', fields:[{type:'int', name:'id'}, {type:'string', name:'codice'}, {type:'string', name:'denominazione'}]});
Ext.define('SIMFito.model.LegendsModel', {extend:Ext.data.Model, alias:'model.legendsmodel', fields:[{type:'string', name:'src'}, {type:'string', name:'caption'}, {type:'int', name:'id'}]});
Ext.define('SIMFito.model.MotivovisitaModel', {extend:Ext.data.Model, alias:'model.motivovisitamodel', fields:[{type:'int', name:'id'}, {type:'string', name:'motivo'}]});
Ext.define('SIMFito.model.MotivovisitaModel1', {extend:Ext.data.Model, fields:[{type:'int', name:'id'}, {type:'string', name:'motivo'}, {type:'boolean', name:'enabled'}]});
Ext.define('SIMFito.model.MyModel', {extend:Ext.data.Model, alias:'model.mymodel', fields:[{type:'int', name:'id'}, {type:'string', name:'descrizione'}, {type:'string', name:'description'}, {type:'boolean', name:'enabled'}]});
Ext.define('SIMFito.model.NewsModel', {extend:Ext.data.Model, alias:'model.newsmodel', fields:[{type:'int', name:'id'}, {type:'string', name:'date'}, {type:'string', name:'news'}, {type:'boolean', name:'deleted'}]});
Ext.define('SIMFito.model.OsservazionModel', {extend:Ext.data.Model, alias:'model.osservazionmodel', fields:[{type:'int', name:'idosservazioni'}, {type:'string', name:'ospite'}, {type:'string', name:'parassita'}, {type:'string', name:'presente'}, {type:'int', name:'rilevato'}, {type:'string', name:'sospetti'}, {type:'boolean', name:'campione'}, {type:'string', name:'codice'}, {type:'string', name:'risultato'}, {type:'string', name:'nome_intensity'}, {type:'string', name:'nome_grado'}, {type:'string', 
name:'fase_fenologica'}, {type:'string', name:'varieta'}, {type:'string', name:'eta'}, {type:'string', name:'organi'}, {type:'string', name:'pericolosita'}, {name:'data_impianto'}, {type:'int', name:'n_trappole'}, {type:'int', allowNull:true, name:'appezzamento'}, {type:'int', name:'dens_piante'}, {type:'string', name:'coltura_prec'}, {type:'int', name:'n_abbattute'}, {type:'int', name:'n_osservate'}, {type:'int', name:'piante_camp_vis'}, {type:'int', name:'piante_infest'}, {type:'int', name:'sup_vis'}, 
{type:'int', name:'sup_infest'}, {type:'boolean', name:'completa'}, {type:'string', name:'lobaratory_result'}, {type:'int', name:'laboratory_positive'}, {type:'float', name:'elementicampione'}, {type:'float', allowNull:true, name:'tempo'}, {type:'int', name:'tipocampione_id'}, {type:'string', name:'tipocampione_description'}, {type:'int', allowNull:true, name:'unit_tot'}, {type:'int', allowNull:true, name:'unit_chk'}, {type:'float', allowNull:true, name:'peso_tot'}, {type:'float', allowNull:true, 
name:'peso_chk'}, {type:'int', allowNull:true, name:'lotti_tot'}, {type:'int', allowNull:true, name:'lotti_chk'}, {type:'int', allowNull:true, name:'lotti_camp'}, {type:'int', name:'tipologia_id'}, {type:'string', name:'tipologiacontrollata_descrizione'}]});
Ext.define('SIMFito.model.ParassitiModel', {extend:Ext.data.Model, alias:'model.parassitimodel', fields:[{type:'string', name:'pestcode'}, {type:'string', name:'name'}, {type:'int', name:'totale'}, {type:'date', name:'start'}, {type:'date', name:'end'}]});
Ext.define('SIMFito.model.PestHostModel', {extend:Ext.data.Model, alias:'model.pesthostmodel', fields:[{type:'string', name:'hostcode'}, {type:'string', name:'name'}]});
Ext.define('SIMFito.model.PestModel', {extend:Ext.data.Model, alias:'model.pestmodel', fields:[{type:'string', name:'host_name'}, {type:'boolean', name:'present'}, {type:'string', name:'pest_name'}, {type:'int', name:'pest_id'}, {type:'string', name:'baycode_pest'}, {type:'string', name:'class'}, {type:'string', name:'priority'}]});
Ext.define('SIMFito.model.PresenteModel', {extend:Ext.data.Model, alias:'model.presentemodel', fields:[{type:'int', name:'rilevato'}, {type:'string', name:'descrizione'}]});
Ext.define('SIMFito.model.ProvinceModel', {extend:Ext.data.Model, alias:'model.provincemodel', fields:[{type:'int', name:'id'}, {type:'string', name:'provincia'}]});
Ext.define('SIMFito.model.RefertiModel', {extend:Ext.data.Model, alias:'model.refertimodel', fields:[{type:'int', name:'report_id'}, {type:'string', name:'codice'}, {type:'string', name:'datareport'}, {type:'int', name:'idscheda'}, {type:'int', name:'id_tecnico'}, {type:'string', name:'motivo'}, {type:'string', name:'data_sopralluogo'}, {type:'int', name:'stato'}, {type:'string', name:'statodesc'}, {type:'int', name:'id_azienda'}, {type:'int', name:'gid_sito'}, {name:'rigetto'}, {type:'string', name:'azienda'}, 
{type:'string', name:'iva_azienda'}, {type:'string', name:'sito'}, {type:'string', name:'comune'}, {type:'string', name:'tecnici'}, {type:'int', name:'laboratoriostato_position'}, {type:'string', name:'laboratorio_stato'}, {type:'boolean', name:'daverificare'}]});
Ext.define('SIMFito.model.SchedeModel', {extend:Ext.data.Model, alias:'model.schedemodel', fields:[{type:'int', name:'idscheda'}, {type:'int', name:'idschedatecnico'}, {type:'int', name:'id_tecnico'}, {type:'string', name:'motivo'}, {type:'boolean', name:'motivo_enabled'}, {type:'string', name:'data_sopralluogo'}, {type:'int', name:'stato'}, {type:'string', name:'statodesc'}, {type:'string', name:'azienda'}, {type:'string', name:'iva_azienda'}, {type:'int', name:'id_azienda'}, {type:'int', name:'gid_sito'}, 
{type:'string', name:'sito'}, {type:'string', name:'rigetto'}, {type:'string', name:'lat'}, {type:'string', name:'lon'}, {type:'string', name:'comune'}, {type:'string', name:'tecnici'}, {type:'string', name:'mainname'}, {type:'string', name:'mainsurname'}, {type:'string', name:'geometry'}, {type:'string', name:'laboratorio_stato'}, {type:'int', allowNull:true, name:'laboratoriostato_posotion'}, {type:'boolean', name:'allegati'}, {type:'boolean', name:'daverificare'}, {type:'boolean', name:'siti_cancellato'}, 
{type:'string', name:'protocollo'}, {type:'int', name:'numpositive'}, {type:'string', name:'laboratorio'}, {type:'int', name:'totcatture'}, {type:'string', name:'tipo_visita_theme'}, {type:'int', name:'tipo_visita_id'}]});
Ext.define('SIMFito.model.SessoModel', {extend:Ext.data.Model, alias:'model.sessomodel', fields:[{type:'string', name:'id'}, {type:'string', name:'descrizione'}]});
Ext.define('SIMFito.model.SitiModel', {extend:Ext.data.Model, alias:'model.sitimodel', fields:[{type:'int', name:'id'}, {type:'string', name:'rag_soc'}, {type:'string', name:'localita'}, {type:'string', name:'denominazione'}, {type:'string', name:'comune'}, {type:'string', name:'provincia'}, {type:'string', name:'geometry'}, {type:'float', name:'superficie_ha'}, {type:'float', allowNull:true, name:'tipologiasito_id'}, {type:'string', allowNull:true, name:'tipologiasito'}, {type:'int', allowNull:true, 
name:'theme_id'}]});
Ext.define('SIMFito.model.ThemeTSModel', {extend:Ext.data.Model, alias:'model.themetsmodel', fields:[{type:'int', name:'id'}, {type:'string', name:'theme'}]});
Ext.define('SIMFito.model.TipoCampioneModelAll', {extend:Ext.data.Model, alias:'model.tipocampionemodelall', fields:[{type:'int', name:'id'}, {type:'string', name:'description'}, {type:'string', name:'extra'}, {type:'boolean', name:'enabled'}, {type:'boolean', name:'system'}]});
Ext.define('SIMFito.model.TipoTecnico', {extend:Ext.data.Model, alias:'model.tipotecnico', fields:[{type:'int', name:'idtipo_tecnico'}, {type:'string', name:'tipotecnico'}]});
Ext.define('SIMFito.model.TipoaziendaModel', {extend:Ext.data.Model, alias:'model.tipoaziendamodel', fields:[{type:'int', name:'id'}, {type:'string', name:'descrizione'}]});
Ext.define('SIMFito.model.TipoaziendaallModel', {extend:Ext.data.Model, fields:[{type:'int', name:'id'}, {type:'string', name:'descrizione'}, {type:'boolean', name:'attiva'}]});
Ext.define('SIMFito.model.TipocampioneModel', {extend:Ext.data.Model, alias:'model.tipocampionemodel', fields:[{type:'int', name:'tipocampione_id'}, {type:'string', name:'tipocampione_description'}]});
Ext.define('SIMFito.model.TipologiasitiModel', {extend:Ext.data.Model, alias:'model.tipologiasitimodel', fields:[{type:'int', name:'id'}, {type:'string', name:'description'}, {type:'int', name:'order'}]});
Ext.define('SIMFito.model.TipotrappoleModel', {extend:Ext.data.Model, fields:[{type:'int', name:'id'}, {type:'string', name:'descrizione'}]});
Ext.define('SIMFito.model.TrapModel', {extend:Ext.data.Model, alias:'model.mymodel', fields:[{type:'int', name:'id'}, {type:'int', name:'idtrp'}, {type:'int', name:'t_g_id'}, {type:'int', name:'stato_id'}, {type:'int', name:'anno'}, {type:'string', name:'codice'}, {type:'string', name:'nome'}, {type:'date', name:'datacreazione'}, {type:'date', name:'datavariazione'}, {type:'string', name:'geometry'}, {type:'string', name:'stato'}, {type:'string', name:'denominaz'}, {type:'string', name:'aziendasito'}, 
{type:'string', name:'tipotrappola'}, {type:'string', name:'tecnico'}, {type:'string', name:'mainpest'}, {type:'float', name:'durata_erogatore'}, {type:'string', name:'tecnico_rimozione'}, {type:'float', name:'tempo_rimozione'}, {type:'int', name:'scheda_id'}, {type:'boolean', name:'singleuse'}]});
Ext.define('SIMFito.model.TrappoleModel', {extend:Ext.data.Model, alias:'model.trappolemodel', fields:[{type:'int', name:'id'}, {type:'int', name:'id_tipo'}, {type:'string', name:'codice'}, {type:'string', name:'nome'}, {type:'int', name:'numero_individui'}, {type:'string', name:'descrizione'}, {type:'int', name:'n_piante_rap'}, {type:'string', name:'note'}]});
Ext.define('SIMFito.model.TrappoleReportComboModel', {extend:Ext.data.Model, alias:'model.trappolereportcombomodel', fields:[{type:'string', name:'mainpest'}, {type:'string', name:'organismo'}]});
Ext.define('SIMFito.model.TrapreferenceModel', {extend:Ext.data.Model, alias:'model.trapreferencemodel', fields:[{type:'int', name:'id'}, {type:'string', name:'b_code'}, {type:'string', name:'full_name'}]});
Ext.define('SIMFito.model.UEPest', {extend:Ext.data.Model, alias:'model.uepest', fields:[{type:'int', name:'id'}, {type:'string', name:'nomereport'}, {type:'string', name:'pest'}, {type:'string', name:'pestx'}, {type:'int', name:'anno'}, {type:'boolean', name:'enabled'}]});
Ext.define('SIMFito.model.UserModel', {extend:Ext.data.Model, fields:[{type:'int', name:'id_tecnico'}, {type:'string', name:'cap_ufficio'}, {type:'string', name:'codicefiscale'}, {type:'string', name:'cognome'}, {type:'string', name:'comune_nascita'}, {type:'date', name:'data_nascita', dateFormat:'Y-m-d'}, {type:'string', name:'email'}, {type:'string', name:'mobile'}, {type:'string', name:'nome'}, {type:'string', name:'pswrd'}, {type:'string', name:'residenza_comune'}, {type:'string', name:'residenza_indirizzo'}, 
{type:'string', name:'sesso'}, {type:'string', name:'telefono'}, {type:'string', name:'titolo'}, {type:'string', name:'ufficio'}, {type:'string', name:'username'}, {type:'string', name:'web'}]});
Ext.define('SIMFito.model.UserTypeModel', {extend:Ext.data.Model, alias:'model.usertypemodel', fields:[{type:'int', name:'idtipo_tecnico'}, {type:'string', name:'tipotecnico'}]});
Ext.define('SIMFito.model.UsersModel', {extend:Ext.data.Model, alias:'model.usersmodel', fields:[{type:'string', name:'id_tecnico'}, {type:'string', name:'tipotecnico'}, {type:'string', name:'idtipo_tecnico'}, {type:'string', name:'cognome'}, {type:'string', name:'nome'}, {type:'string', name:'username'}, {type:'string', name:'email'}, {type:'string', name:'ufficio'}, {type:'string', name:'codicefiscale'}, {type:'string', name:'data_inizio_att'}, {type:'string', name:'data_nascita'}, {type:'string', 
name:'sesso'}, {type:'string', name:'comune_nascita'}, {type:'string', name:'provincia_nascita'}, {type:'string', name:'titolo'}, {type:'string', name:'cap_ufficio'}, {type:'string', name:'id_provincia'}, {type:'string', name:'sigla'}, {type:'string', name:'pswrd'}, {type:'string', name:'residenza_comune'}, {type:'string', name:'residenza_indirizzo'}, {type:'string', name:'telefono'}, {type:'string', name:'mobile'}, {type:'string', name:'web'}, {type:'boolean', name:'validated'}]});
Ext.define('SIMFito.model.UsersModel1', {extend:Ext.data.Model, fields:[{type:'int', name:'id_tecnico'}, {type:'string', name:'tipotecnico'}, {type:'int', name:'idtipo_tecnico'}, {type:'string', name:'cognome'}, {type:'string', name:'nome'}, {type:'string', name:'cognomeenome'}, {type:'string', name:'email'}]});
Ext.define('SIMFito.model.WarningsModel', {extend:Ext.data.Model, alias:'model.warningsmodel', fields:[{type:'string', name:'id'}, {type:'string', name:'host'}, {type:'string', name:'host_name'}, {type:'string', name:'pest'}, {type:'string', name:'pest_name'}, {type:'string', name:'nome'}, {type:'string', name:'cognome'}, {type:'string', name:'rigetto'}, {type:'string', name:'data'}, {type:'boolean', name:'validato'}, {type:'boolean', name:'nuova'}]});
Ext.define('SIMFito.model.combo', {extend:Ext.data.Model, alias:'model.combo', fields:[{type:'int', name:'id'}, {type:'string', name:'descrizione'}]});
Ext.define('SIMFito.model.laboratoryModel', {extend:Ext.data.Model, alias:'model.laboratorymodel', fields:[{type:'int', name:'id'}, {type:'int', name:'elementindex'}, {type:'string', name:'name'}, {type:'int', name:'positive'}]});
Ext.define('SIMFito.model.officialuemodel', {extend:Ext.data.Model, alias:'model.officialuemodel', fields:[{type:'int', name:'id'}, {type:'int', defaultValue:2014, name:'anno'}, {name:'owner_name'}, {name:'fullfilename'}, {type:'date', name:'date'}]});
Ext.define('SIMFito.model.reportsStore', {extend:Ext.data.Model, alias:'model.reportsstore', fields:[{type:'int', name:'id'}, {type:'string', name:'owner'}, {name:'name'}, {type:'date', name:'date'}, {type:'int', name:'statoreport_id'}, {name:'statoreport_descrizione'}, {allowNull:true, name:'runstart'}, {allowNull:true, name:'runend'}, {name:'owner_name'}]});
Ext.define('SIMFito.model.tableHostModel', {extend:Ext.data.Model, alias:'model.tablehostmodel', fields:[{type:'string', name:'hostcode'}, {type:'string', name:'name'}]});
Ext.define('SIMFito.model.tablePestModel', {extend:Ext.data.Model, fields:[{type:'string', name:'pestcode'}, {type:'string', name:'name'}]});
Ext.define('SIMFito.model.userPrjModel', {extend:Ext.data.Model, alias:'model.userprjmodel', fields:[{type:'string', name:'title'}, {type:'string', name:'srs'}, {type:'string', name:'def'}]});
Ext.define('SIMFito.store.AbbattimentiModels', {extend:Ext.data.Store, alias:'store.abbattimentimodels', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'AbbattimentiModels', model:'SIMFito.model.AbbattimentiModel', proxy:{type:'ajax', extraParams:{mode:'abbattimenti', osservazioni_id:1}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.AllTrapStore', {extend:Ext.data.Store, alias:'store.alltrapstore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({remoteFilter:true, remoteSort:true, storeId:'AllTrapStore', model:'SIMFito.model.TrapModel', proxy:{type:'ajax', extraParams:{mode:'trappole_geom2', gid:-1, x:null, y:null, prj:null, r:null}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'totaldata'}}}, cfg)]);
}});
Ext.define('SIMFito.store.AllorgStore', {extend:Ext.data.Store, alias:'store.allorgstore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'AllorgStore', model:'SIMFito.model.AllorgModel', proxy:{type:'ajax', extraParams:{mode:'allorg'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.AreasStore', {extend:Ext.data.Store, alias:'store.areasstore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'AreasStore', model:'SIMFito.model.AreasModel', proxy:{type:'ajax', extraParams:{mode:'areas'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'totaldata'}}}, cfg)]);
}});
Ext.define('SIMFito.store.AssociaTecniciStore', {extend:Ext.data.Store, alias:'store.associatecnicistore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'AssociaTecniciStore', model:'SIMFito.model.AssociaTecniciModel', proxy:{type:'ajax', extraParams:{mode:'associatecnico'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.AttaccogStore', {extend:Ext.data.Store, alias:'store.attaggogstore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'AttaccogStore', model:'SIMFito.model.AttaccogModel', proxy:{type:'ajax', extraParams:{mode:'attacco-grado'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.AttaccoiStore', {extend:Ext.data.Store, alias:'store.attaccoistore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'AttaccoiStore', model:'SIMFito.model.AttaccoiModel', proxy:{type:'ajax', extraParams:{mode:'attacco-int'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.AttachmentStore', {extend:Ext.data.Store, alias:'store.attachmentstore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'AttachmentStore', model:'SIMFito.model.AttachmentModel', proxy:{type:'ajax', extraParams:{mode:'allegati'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'result'}}}, cfg)]);
}});
Ext.define('SIMFito.store.AziendeStore', {extend:Ext.data.Store, alias:'store.aziendestore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({remoteFilter:true, remoteSort:true, storeId:'AziendeStore', model:'SIMFito.model.AziendeModel', proxy:{type:'ajax', extraParams:{mode:'aziendeall'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'totaldata'}}}, cfg)]);
}});
Ext.define('SIMFito.store.AziendeStore2', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'AziendeStore2', model:'SIMFito.model.AziendeModel2', proxy:{type:'ajax', extraParams:{mode:'aziendeall2'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'totaldata'}}}, cfg)]);
}});
Ext.define('SIMFito.store.CampionecodeStore', {extend:Ext.data.Store, alias:'store.campionecodestore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'CampionecodeStore', model:'SIMFito.model.CampionecodeModel', proxy:{type:'ajax', extraParams:{mode:'codici_new'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.ChangeLogStore', {extend:Ext.data.Store, alias:'store.changelogstore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'ChangeLogStore', asynchronousLoad:true, model:'SIMFito.model.ChangeLogModel', proxy:{type:'ajax', extraParams:{mode:'changelog'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'results'}}}, cfg)]);
}});
Ext.define('SIMFito.store.ComuniStore', {extend:Ext.data.Store, alias:'store.comunistore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'ComuniStore', model:'SIMFito.model.ComuniModel', proxy:{type:'ajax', extraParams:{mode:'comuni'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.DatasetTreeStore', {extend:Ext.data.TreeStore, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'DatasetTreeStore', defaultRootText:'Layers', rootVisible:true, proxy:{type:'ajax', timeout:1000000, url:'services/proxy.php', reader:{type:'json'}}}, cfg)]);
}});
Ext.define('SIMFito.store.FarmStore', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'FarmStore', model:'SIMFito.model.FarmModel', proxy:{type:'ajax', extraParams:{mode:'aziendeall2'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'totaldata'}}}, cfg)]);
}});
Ext.define('SIMFito.store.FasifenologicheStore', {extend:Ext.data.Store, alias:'store.fasifenologichestore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'FasifenologicheStore', model:'SIMFito.model.FasifenologicheModel', proxy:{type:'ajax', extraParams:{mode:'fasifenologiche', idobs:-1}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.HostrdStore', {extend:Ext.data.Store, alias:'store.hostrdstore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'HostrdStore', model:'SIMFito.model.HostrdModel', proxy:{type:'ajax', extraParams:{mode:'host_ord'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.HostrndStore', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'HostrndStore', model:'SIMFito.model.HostrdModel', proxy:{type:'ajax', extraParams:{mode:'host_rend'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.LaboratorioStore', {extend:Ext.data.Store, alias:'store.laboratoriostore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'LaboratorioStore', model:'SIMFito.model.LaboratorioModel', proxy:{type:'ajax', extraParams:{mode:'laboratorio'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.LegendsStore', {extend:Ext.data.ArrayStore, alias:'store.legendsstore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'LegendsStore', autoLoad:true, model:'SIMFito.model.LegendsModel'}, cfg)]);
}});
Ext.define('SIMFito.store.MotivovisitaStore', {extend:Ext.data.Store, alias:'store.motivovisitastore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'MotivovisitaStore', model:'SIMFito.model.MotivovisitaModel', proxy:{type:'ajax', extraParams:{mode:'motivoVisita'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'tataldata'}}}, cfg)]);
}});
Ext.define('SIMFito.store.MotivovisitaStore1', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'MotivovisitaStore1', model:'SIMFito.model.MotivovisitaModel1', proxy:{type:'ajax', extraParams:{mode:'motivoVisitaAll'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'tataldata'}}}, cfg)]);
}});
Ext.define('SIMFito.store.NewsStore', {extend:Ext.data.Store, alias:'store.newsstore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'NewsStore', model:'SIMFito.model.NewsModel', proxy:{type:'ajax', extraParams:{mode:'news'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'totaldata'}}}, cfg)]);
}});
Ext.define('SIMFito.store.OsservazioniStore', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'OsservazioniStore', model:'SIMFito.model.OsservazionModel', proxy:{type:'ajax', extraParams:{mode:'osservazioni', idscheda:0}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.OsservazioniStore1', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'OsservazioniStore1', model:'SIMFito.model.OsservazionModel', proxy:{type:'ajax', extraParams:{mode:'osservazionicatture', idscheda:0, idtrappola:0}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.ParassitiStore', {extend:Ext.data.Store, alias:'store.parassitistore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'ParassitiStore', model:'SIMFito.model.ParassitiModel', proxy:{type:'ajax', extraParams:{mode:'parassitinew', provincia:null}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'results'}}}, cfg)]);
}});
Ext.define('SIMFito.store.ParassitiStore1', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'ParassitiStore1', model:'SIMFito.model.ParassitiModel', proxy:{type:'ajax', extraParams:{mode:'parassitinewpositivi', provincia:null}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'results'}}}, cfg)]);
}});
Ext.define('SIMFito.store.ParassitiStore2', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'ParassitiStore2', model:'SIMFito.model.ParassitiModel', proxy:{type:'ajax', extraParams:{mode:'parassititrappole'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'results'}}}, cfg)]);
}});
Ext.define('SIMFito.store.PestHostStore', {extend:Ext.data.Store, alias:'store.pesthoststore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'PestHostStore', model:'SIMFito.model.PestHostModel', proxy:{type:'ajax', extraParams:{mode:'pest_host'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.PestStore', {extend:Ext.data.Store, alias:'store.peststore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'PestStore', model:'SIMFito.model.PestModel', proxy:{type:'ajax', extraParams:{mode:'ordPests', bcode:''}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.PlantStore', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'PlantStore', model:'SIMFito.model.HostrdModel', proxy:{type:'ajax', extraParams:{mode:'plant'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.ProvinceStore', {extend:Ext.data.Store, alias:'store.provincestore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'ProvinceStore', model:'SIMFito.model.ProvinceModel', proxy:{type:'ajax', extraParams:{mode:'province'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.RefertiStore', {extend:Ext.data.BufferedStore, alias:'store.refertistore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'RefertiStore', model:'SIMFito.model.RefertiModel', proxy:{type:'ajax', extraParams:{mode:'referti'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'totaldata'}}}, cfg)]);
}});
Ext.define('SIMFito.store.RimuoviTecniciStore', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'RimuoviTecniciStore', model:'SIMFito.model.AssociaTecniciModel', proxy:{type:'ajax', extraParams:{mode:'rimuovitecnico'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.SchedeStore', {extend:Ext.data.Store, alias:'store.schedestore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({remoteFilter:true, remoteSort:true, storeId:'SchedeStore', model:'SIMFito.model.SchedeModel', proxy:{type:'ajax', extraParams:{mode:'schede', idTecnico:0}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'totaldata'}}}, cfg)]);
}});
Ext.define('SIMFito.store.SessoStore', {extend:Ext.data.Store, alias:'store.sessostore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'SessoStore', model:'SIMFito.model.SessoModel', proxy:{type:'ajax', extraParams:{mode:'sesso'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.SitiStore', {extend:Ext.data.Store, alias:'store.sitistore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({pageSize:150, storeId:'SitiStore', model:'SIMFito.model.SitiModel', proxy:{type:'ajax', extraParams:{mode:'siti'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.SitiStore1', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({pageSize:150, storeId:'SitiStore1', model:'SIMFito.model.SitiModel', proxy:{type:'ajax', extraParams:{mode:'siti1'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'totaldata'}}}, cfg)]);
}});
Ext.define('SIMFito.store.ThemeTSStore', {extend:Ext.data.Store, alias:'store.themetsstore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'ThemeTSStore', model:'SIMFito.model.ThemeTSModel', proxy:{type:'ajax', extraParams:{mode:'themes'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.ThemeTSStore1', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'ThemeTSStore1', model:'SIMFito.model.ThemeTSModel', proxy:{type:'ajax', extraParams:{mode:'themes1'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.TipoCampioneStoreAll', {extend:Ext.data.Store, alias:'store.tipocampionestoreall', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'TipoCampioneStoreAll', model:'SIMFito.model.TipoCampioneModelAll', proxy:{type:'ajax', extraParams:{mode:'tipocampioniall'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'results'}}}, cfg)]);
}});
Ext.define('SIMFito.store.TipoTecnicoStore', {extend:Ext.data.Store, alias:'store.tipotecnicostore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'TipoTecnicoStore', model:'SIMFito.model.TipoTecnico', proxy:{type:'ajax', extraParams:{mode:'tipotecnico'}, timeout:1000000, url:'services/login.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.TipoTecnicoStore1', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'TipoTecnicoStore1', autoLoad:true, model:'SIMFito.model.TipoTecnico', proxy:{type:'ajax', extraParams:{mode:'tipotecnico1'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.TipoaziendaStore', {extend:Ext.data.Store, alias:'store.tipoaziendastore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'TipoaziendaStore', model:'SIMFito.model.TipoaziendaModel', proxy:{type:'ajax', extraParams:{mode:'tipoazienda'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.TipoaziendaallStore', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'TipoaziendaallStore', model:'SIMFito.model.TipoaziendaallModel', proxy:{type:'ajax', extraParams:{mode:'tipoaziendaall'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.TipocampioneStore', {extend:Ext.data.Store, alias:'store.tipocampionestore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'TipocampioneStore', model:'SIMFito.model.TipocampioneModel', proxy:{type:'ajax', extraParams:{mode:'tipocampione'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'results'}}}, cfg)]);
}});
Ext.define('SIMFito.store.TipologiasitiStore', {extend:Ext.data.Store, alias:'store.tipologiasitistore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'TipologiasitiStore', model:'SIMFito.model.TipologiasitiModel', proxy:{type:'ajax', extraParams:{mode:'tipologiasito'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.TipologiasitiStore1', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'TipologiasitiStore1', model:'SIMFito.model.TipologiasitiModel', proxy:{type:'ajax', extraParams:{mode:'tipologiasito1'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.TipotrappoleStore', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'TipotrappoleStore', model:'SIMFito.model.TipotrappoleModel', proxy:{type:'ajax', extraParams:{mode:'tipo_trappole'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.TrapStore', {extend:Ext.data.Store, alias:'store.trapstore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'TrapStore', model:'SIMFito.model.TrapModel', proxy:{type:'ajax', extraParams:{mode:'trappole_geom', gid:-1}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.TrappoleReportComboStore', {extend:Ext.data.Store, alias:'store.trappolereportcombostore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'TrappoleReportComboStore', model:'SIMFito.model.TrappoleReportComboModel', proxy:{type:'ajax', extraParams:{mode:'trappole_report_combo'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.TrappoleStore', {extend:Ext.data.Store, alias:'store.trappolestore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'TrappoleStore', model:'SIMFito.model.TrappoleModel', proxy:{type:'ajax', extraParams:{mode:'trappole', idosservazione:0}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.TrapreferenceStore', {extend:Ext.data.Store, alias:'store.trapreferencestore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'TrapreferenceStore', model:'SIMFito.model.TrapreferenceModel', proxy:{type:'ajax', extraParams:{mode:'preferred1'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.UEPestsStore', {extend:Ext.data.Store, alias:'store.uepestsstore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'UEPestsStore', model:'SIMFito.model.UEPest', proxy:{type:'ajax', extraParams:{mode:'reportue'}, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'totalData'}}}, cfg)]);
}});
Ext.define('SIMFito.store.UserTypeStore', {extend:Ext.data.Store, alias:'store.usertypestore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'UserTypeStore', model:'SIMFito.model.UserTypeModel', proxy:{type:'ajax', extraParams:{mode:'tipotecnico'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.UsersStore', {extend:Ext.data.Store, alias:'store.usersstore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'UsersStore', model:'SIMFito.model.UsersModel', proxy:{type:'ajax', extraParams:{mode:'users', requesterid:null}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', metaProperty:'nuovi'}}}, cfg)]);
}});
Ext.define('SIMFito.store.UsersStore1', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'UsersStore1', autoLoad:true, model:'SIMFito.model.UsersModel1', proxy:{type:'ajax', extraParams:{mode:'usersformail', requesterid:null}, idParam:'id_tecnico', timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'results'}}}, cfg)]);
}});
Ext.define('SIMFito.store.WarningsStore', {extend:Ext.data.BufferedStore, alias:'store.warningsstore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'WarningsStore', autoLoad:false, model:'SIMFito.model.WarningsModel', leadingBufferZone:25, purgePageCount:0, proxy:{type:'ajax', extraParams:{mode:'lista_segnalazioni'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'totaldata', metaProperty:'nuovi'}}}, cfg)]);
}});
Ext.define('SIMFito.store.areelinkabili', {extend:Ext.data.Store, alias:'store.areelinkabili', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'areelinkabili', model:'SIMFito.model.combo', proxy:{type:'ajax', extraParams:{mode:'areasmerge'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'totaldata'}}}, cfg)]);
}});
Ext.define('SIMFito.store.laboratoryStore', {extend:Ext.data.Store, alias:'store.laboratorystore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'laboratoryStore', model:'SIMFito.model.laboratoryModel', proxy:{type:'ajax', extraParams:{mode:'osservazioneanalisi', idosservazione:0}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'results'}}}, cfg)]);
}});
Ext.define('SIMFito.store.officialuestore', {extend:Ext.data.Store, alias:'store.officialuestore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'officialuestore', model:'SIMFito.model.officialuemodel', proxy:{type:'ajax', extraParams:{mode:'read'}, url:'services/manage_reports.php', reader:{type:'json', rootProperty:'data', totalProperty:'totaldata'}}}, cfg)]);
}});
Ext.define('SIMFito.store.paeseprovenienza', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'paeseprovenienza', model:'SIMFito.model.combo', proxy:{type:'ajax', extraParams:{mode:'paeseprovenienza'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'results'}}}, cfg)]);
}});
Ext.define('SIMFito.store.reportsStores', {extend:Ext.data.Store, alias:'store.reportsstores', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'reportsStores', model:'SIMFito.model.reportsStore', proxy:{type:'ajax', extraParams:{mode:'reports', idTecnico:-1, tipoTecnico:-1}, timeout:10000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'totaldata'}}}, cfg)]);
}});
Ext.define('SIMFito.store.tableHostStore', {extend:Ext.data.Store, alias:'store.tablehoststore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'tableHostStore', model:'SIMFito.model.tableHostModel', proxy:{type:'ajax', extraParams:{mode:'ospiti'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'results'}}}, cfg)]);
}});
Ext.define('SIMFito.store.tablePestStore', {extend:Ext.data.Store, constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'tablePestStore', model:'SIMFito.model.tablePestModel', proxy:{type:'ajax', extraParams:{mode:'parassiticontrollati'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'results'}}}, cfg)]);
}});
Ext.define('SIMFito.store.tipoTrappoleAllStore', {extend:Ext.data.Store, alias:'store.tipotrappoleallstore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'tipoTrappoleAllStore', model:'SIMFito.model.MyModel', proxy:{type:'ajax', extraParams:{mode:'tipotrappole'}, url:'services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, cfg)]);
}});
Ext.define('SIMFito.store.tipologiecontrollate', {extend:Ext.data.Store, alias:'store.tipologiecontrollate', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'tipologiecontrollate', model:'SIMFito.model.combo', proxy:{type:'ajax', extraParams:{mode:'tipologiecontrollate'}, timeout:1000000, url:'services/ajax.php', reader:{type:'json', rootProperty:'data', totalProperty:'results'}}}, cfg)]);
}});
Ext.define('SIMFito.store.userPrjStore', {extend:Ext.data.Store, alias:'store.userprjstore', constructor:function(cfg) {
  var me = this;
  cfg = cfg || {};
  me.callParent([Ext.apply({storeId:'userPrjStore', autoLoad:false, model:'SIMFito.model.userPrjModel', proxy:{type:'ajax', timeout:1000000, url:'etc/prj.php', reader:{type:'json', rootProperty:'userprj'}}}, cfg)]);
}});
Ext.define('SIMFito.view.AbbattimentiWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.abbattimentiwindow'});
Ext.define('SIMFito.view.AbbattimentiWindow', {extend:Ext.window.Window, alias:'widget.abbattimentiwindow', viewModel:{type:'abbattimentiwindow'}, constrain:true, height:650, width:800, layout:'fit', title:'Abbattimenti', items:[{xtype:'panel', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'gridpanel', flex:1, scrollable:true, autoLoad:true, store:'AbbattimentiModels', columns:[{xtype:'numbercolumn', hidden:true, sortable:false, dataIndex:'id', text:'ID', format:'0'}, {xtype:'gridcolumn', 
summaryRenderer:function(val, params, data, metaData) {
  return '\x3cb\x3eTotale\x3c/b\x3e';
}, sortable:true, dataIndex:'tecnico', text:'Descrizione'}, {xtype:'numbercolumn', summaryType:'sum', flex:1, sortable:true, dataIndex:'quantity', text:'Piante Abbattute (numero)', format:'0'}, {xtype:'datecolumn', summaryRenderer:function(val, params, data, metaData) {
  return Ext.util.Format.date(val, 'd/m/Y');
}, summaryType:'max', flex:2, sortable:true, dataIndex:'date', text:'Data', format:'d/m/Y'}, {xtype:'gridcolumn', flex:2, dataIndex:'tecnico', text:'Tecnico'}, {xtype:'actioncolumn', text:'Azioni', items:[{handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('id');
  var daRecuperare = record.get('quantity');
  Ext.MessageBox.confirm('Conferma', 'Eliminare la registrazione dell\x26apos;abbattimento?', function(btn) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'elimina-abbattimento', id:id}, success:function(resp) {
        var obj = Ext.util.JSON.decode(resp.responseText);
        if (obj.success) {
          Ext.getCmp('id').setValue(-1);
          var maxValue = Ext.getCmp('abbattute').maxValue + daRecuperare > 0 ? Ext.getCmp('abbattute').maxValue + daRecuperare : 0;
          Ext.getCmp('abbattute').setMaxValue(maxValue);
          Ext.getCmp('abbattute').setValue(0);
          Ext.StoreMgr.get('AbbattimentiModels').reload();
          Ext.StoreMgr.get('OsservazioniStore').reload();
          Ext.Msg.alert('Info', 'Registrazione eliminata con successo!');
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore!', obj.errors.reason);
        } else {
          Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
        }
      }});
    }
  });
}, iconCls:'delete', tooltip:'Elimina Registrazione Abbattimento'}]}], features:[{ftype:'summary'}]}, {xtype:'form', flex:1, scrollable:true, bodyPadding:10, url:'services/ajax-save-form.php', items:[{xtype:'hiddenfield', anchor:'100%', name:'fase', value:'abbattimenti'}, {xtype:'hiddenfield', anchor:'100%', id:'osservazione_id', name:'osservazione_id'}, {xtype:'hiddenfield', id:'id', name:'abbattimenti_id', value:'-1'}, {xtype:'numberfield', anchor:'100%', id:'abbattute', fieldLabel:'Numero di Piante Abbattute', 
labelAlign:'top', msgTarget:'under', name:'abbattute', value:0, allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', allowDecimals:false, allowExponential:false, minValue:0}, {xtype:'datefield', anchor:'100%', id:'date', fieldLabel:'Data Intervento', labelAlign:'top', msgTarget:'under', name:'date', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', submitFormat:'Ymd'}, {xtype:'textfield', 
anchor:'100%', fieldLabel:'Cognome e nome dle tecnico', labelAlign:'top', name:'tecnico'}], dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'button', handler:function(button, e) {
  var form = button.up('form').getForm();
  var daAbbattere = Ext.getCmp('abbattute').getValue();
  if (form.isValid()) {
    form.submit({method:'POST', waitTitle:'Connessione', waitMsg:'Invio dei dati...', success:function(form, action) {
      var obj = Ext.util.JSON.decode(action.response.responseText);
      if (obj.success) {
        var maxValue = Ext.getCmp('abbattute').maxValue - daAbbattere > 0 ? Ext.getCmp('abbattute').maxValue - daAbbattere : 0;
        Ext.getCmp('abbattute').setMaxValue(maxValue);
        Ext.getCmp('abbattute').setValue(0);
        Ext.StoreMgr.get('AbbattimentiModels').reload();
        Ext.StoreMgr.get('OsservazioniStore').reload();
        Ext.Msg.alert('Info', 'Abbattimento registrato con successo!');
      } else {
        Ext.Msg.alert('Errore', obj.errors.reason);
      }
    }, failure:function(form, action) {
      switch(action.failureType) {
        case Ext.form.action.Action.CLIENT_INVALID:
          Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
          break;
        case Ext.form.action.Action.CONNECT_FAILURE:
          Ext.Msg.alert('Failure', 'Ajax communication failed');
          break;
        case Ext.form.action.Action.SERVER_INVALID:
          Ext.Msg.alert('Failure', action.result.errors.reason);
          break;
      }
    }});
  }
}, formBind:true, flex:1, text:'Registra'}]}]}]}], dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/osservazioni.html#osservazioniabbattimenti', 'Help');
}, iconCls:'help'}]}], initialize:function(data) {
  console.log(data.get('laboratory_positive'));
  Ext.getCmp('osservazione_id').setValue(data.get('idosservazioni'));
  if (Number(data.get('laboratory_positive')) != 1) {
    Ext.getCmp('abbattute').setMaxValue(data.get('piante_infest') - data.get('n_abbattute'));
  } else {
    if (Number(data.get('laboratory_positive')) === 1) {
      Ext.getCmp('abbattute').setMaxValue(null);
    }
  }
  Ext.StoreManager.get('AbbattimentiModels').getProxy().setExtraParam('osservazioni_id', data.get('idosservazioni'));
  this.show();
}});
Ext.define('SIMFito.view.AddopsWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.addopswindow'});
Ext.define('SIMFito.view.AddopsWindowViewController', {extend:Ext.app.ViewController, alias:'controller.addopswindow', onOrdinariSelect1:function(combo, record, eOpts) {
  var SProxy = Ext.StoreMgr.get('PestStore').getProxy();
  SProxy.setExtraParam('mode', 'rndPests');
  SProxy.setExtraParam('bcode', record.get('b_code'));
  SProxy.setExtraParam('codeid', record.get('codeid'));
  var userData = combo.up('window').userData;
  userData.hostId = record.get('codeid');
  Ext.create('SIMFito.view.PestWindow', {title:'Ospiti per ' + record.get('name'), userData:userData}).show();
}, onComboboxSelect:function(combo, record, eOpts) {
  var SProxy = Ext.StoreMgr.get('PestStore').getProxy();
  SProxy.setExtraParam('mode', 'pests');
  SProxy.setExtraParam('bcode', record.get('b_code'));
  SProxy.setExtraParam('codeid', record.get('codeid'));
  var userData = combo.up('window').userData;
  userData.hostId = record.get('codeid');
  Ext.create('SIMFito.view.PestWindow', {title:'Ospiti per ' + record.get('name'), userData:userData}).show();
}, onOrdinariSelect:function(combo, record, eOpts) {
  var SProxy = Ext.StoreMgr.get('PestStore').getProxy();
  SProxy.setExtraParam('mode', 'ordPests');
  SProxy.setExtraParam('bcode', record.get('b_code'));
  SProxy.setExtraParam('codeid', record.get('codeid'));
  var userData = combo.up('window').userData;
  userData.hostId = record.get('codeid');
  Ext.create('SIMFito.view.PestWindow', {title:'Ospiti per ' + record.get('name'), userData:userData}).show();
}});
Ext.define('SIMFito.view.AddopsWindow', {extend:Ext.window.Window, alias:'widget.addopswindow', controller:'addopswindow', viewModel:{type:'addopswindow'}, constrain:true, height:250, id:'hosts', width:400, layout:'fit', title:'Aggiungi Osservazione', items:[{xtype:'tabpanel', activeTab:0, items:[{xtype:'panel', layout:'fit', title:'Pianta Ospite\x3cbr/\x3e(DB Rendicontazione)', items:[{xtype:'form', id:'ordinariForm1', bodyPadding:10, items:[{xtype:'combobox', anchor:'100%', id:'ordinari1', fieldLabel:'Pianta Ospite', 
blankText:'Selezionare una pianta!', emptyText:'Selezionare una pianta...', displayField:'name', store:'HostrndStore', valueField:'b_code', listeners:{select:'onOrdinariSelect1'}}]}]}, {xtype:'panel', layout:'fit', title:'Pianta Ospite\x3cbr/\x3e(DB EPPO)', items:[{xtype:'form', id:'eppoForm', bodyPadding:10, items:[{xtype:'combobox', anchor:'100%', id:'eppo', fieldLabel:'Pianta Ospite', blankText:'Selezionare una pianta!', emptyText:'Selezionare una pianta...', displayField:'name', store:'PlantStore', 
valueField:'b_code', listeners:{select:'onComboboxSelect'}}]}]}, {xtype:'panel', layout:'fit', title:'Pianta Ospite\x3cbr/\x3e(DB Regionale)', items:[{xtype:'form', id:'ordinariForm', bodyPadding:10, items:[{xtype:'combobox', anchor:'100%', id:'ordinari', fieldLabel:'Pianta Ospite', blankText:'Selezionare una pianta!', emptyText:'Selezionare una pianta...', displayField:'name', store:'HostrdStore', valueField:'b_code', listeners:{select:'onOrdinariSelect'}}]}]}]}], dockedItems:[{xtype:'toolbar', 
dock:'top', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/osservazioni.html#nuovaosservazione', 'Help');
}, iconCls:'help'}]}]});
Ext.define('SIMFito.view.AllTrapPanelViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.alltrappanel'});
Ext.define('SIMFito.view.AllTrapPanelViewController', {extend:Ext.app.ViewController, alias:'controller.alltrappanel', onGridpanelSelect:function(rowmodel, record, index, eOpts) {
  var xgeometry = record.get('geometry');
  var label = record.get('codice');
  if (xgeometry !== null && xgeometry !== '') {
    var geometry = Ext.util.JSON.decode(xgeometry);
    geometry.label = label;
    gExtent = addGeometry(id, geometry, false, 'trappole', 'map3');
  }
}, onGridpanelRowbodyClick:function(view, rowBodyEl, e, eOpts) {
  var xgeometry = record.get('geometry');
  var label = record.get('codice');
  if (xgeometry !== null && xgeometry !== '') {
    var geometry = Ext.util.JSON.decode(xgeometry);
    geometry.label = label;
    gExtent = addGeometry(id, geometry, true, 'trappole', 'map3');
  }
}, onTrappolegridallAfterRender:function(component, eOpts) {
  if (localStore.getItem('TipoUtente') * 1 < 2) {
    Ext.getCmp('ManageTrapType').setHidden(false);
    Ext.getCmp('trappoleadata').setHidden(false);
    Ext.getCmp('SIMFItoCatturePer').setHidden(false);
    Ext.getCmp('SIMFItoCatturePer1').setHidden(false);
  } else {
    Ext.getCmp('ManageTrapType').setHidden(true);
    Ext.getCmp('trappoleadata').setHidden(true);
    Ext.getCmp('SIMFItoCatturePer').setHidden(true);
    Ext.getCmp('SIMFItoCatturePer1').setHidden(true);
  }
}, onTrappolegridallRowDblClick:function(tableview, record, element, rowIndex, e, eOpts) {
  var xgeometry = record.get('geometry');
  var label = record.get('codice');
  if (xgeometry !== null && xgeometry !== '') {
    var geometry = Ext.util.JSON.decode(xgeometry);
    geometry.label = label;
    gExtent = addGeometry(id, geometry, true, 'trappole', 'map3');
  }
}, onMypanel6AfterRender:function(component, eOpts) {
  console.info('Initializating map3');
  mapInit(3);
}, onMypanel6Resize:function(component, width, height, oldWidth, oldHeight, eOpts) {
  var size = [width, height];
  map3.setSize(size);
}, onPanelShow:function(component, eOpts) {
  map3.removeLayer(sitiLayer1);
  map3.removeLayer(trappoleLayer);
  trappoleLayer = new ol.layer.Tile({visible:true, source:new ol.source.TileWMS({url:wmsUrl, params:{'LAYERS':'simfito:trappole_all', 'TILED':true}, serverType:'geoserver'}), title:'trappole'});
  sitiLayer1 = new ol.layer.Tile({visible:true, source:new ol.source.TileWMS({url:wmsUrl, params:{'LAYERS':'simfito:siti_all_new', 'TILED':true}, serverType:'geoserver'}), title:'siti'});
  map3.on('singleclick', function(evt) {
    var trappola = getFeatureInfo(trappoleLayer, evt.coordinate, 'map3');
    if (trappola.features.length > 0) {
      var id = trappola.features[0].properties.id;
      var grid = Ext.getCmp('trappolegridall');
      var store = grid.getStore();
      var record = store.getAt(store.findExact('id', id));
      grid.setSelection(record);
      grid.getView().focusRow(record);
    }
  });
  map3.addLayer(trappoleLayer);
  map3.addLayer(sitiLayer1);
  Ext.Ajax.request({async:true, timeout:1000000, url:'services/ajax.php?mode\x3dbounds\x26shp\x3dtrappole_geometry', success:function(response, opts) {
    var obj = Ext.decode(response.responseText);
    if (obj.results > 0) {
      var tBbox = obj.data[0];
      var Bbox = [tBbox.xmin * 1, tBbox.ymin * 1, tBbox.xmax * 1, tBbox.ymax * 1];
      var BboxCampania = [1542502, 4892629, 1692986, 5070443];
      Ext.getCmp('zoomtrappole').setDisabled(false);
      map3.once('postrender', function(evt) {
        map3.getView().fit(BboxCampania, map3.getSize());
      });
      map3.getView().fit(BboxCampania, map3.getSize());
      component.userData = {tbbox:BboxCampania};
    }
  }, faillure:function(response, opts) {
    Ext.Msg.alert('Errore', 'Il server ha risponso con status code: ' + response.status);
  }});
}});
Ext.define('SIMFito.view.AllTrapPanel', {extend:Ext.panel.Panel, alias:'widget.alltrappanel', controller:'alltrappanel', viewModel:{type:'alltrappanel'}, layout:'border', iconCls:'target', title:'Gestione Trappole', items:[{xtype:'gridpanel', region:'center', flex:2, id:'trappolegridall', scrollable:true, store:'AllTrapStore', columns:[{xtype:'numbercolumn', width:75, dataIndex:'id', text:'ID', tooltip:'ID', format:'0', filter:{type:'number'}}, {xtype:'numbercolumn', width:50, dataIndex:'anno', text:'Anno', 
tooltip:'Anno', format:'0', filter:{type:'number'}}, {xtype:'gridcolumn', flex:1, dataIndex:'tipotrappola', text:'Tipo', tooltip:'Tipo', filter:{type:'string'}}, {xtype:'gridcolumn', flex:2, dataIndex:'codice', text:'Codice', tooltip:'Codice', filter:{type:'string'}}, {xtype:'gridcolumn', flex:1, dataIndex:'nome', text:'Codifica interna', tooltip:'Codifica interna', filter:{type:'string'}}, {xtype:'gridcolumn', flex:1, dataIndex:'mainpest', text:'Parassita', tooltip:'Parassita di riferimento', filter:{type:'string'}}, 
{xtype:'gridcolumn', flex:2, dataIndex:'aziendasito', text:'Sito', tooltip:'Sito', filter:{type:'string'}}, {xtype:'gridcolumn', flex:1, dataIndex:'tecnico', text:'Tecnico', tooltip:'Tecnico cha ha posizionato la trappola', filter:{type:'string'}}, {xtype:'datecolumn', dataIndex:'datacreazione', text:'Posizionamento', tooltip:'Data di posizionamento', format:'d/m/Y', filter:{type:'date'}}, {xtype:'datecolumn', dataIndex:'datavariazione', text:'Ultima modifica', tooltip:'Data di ultima modifica', 
format:'d/m/Y', filter:{type:'date'}}, {xtype:'actioncolumn', width:75, text:'Azioni', tooltip:'Azioni', items:[{handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('id');
  Ext.MessageBox.show({title:'ELIMINAZIONE TRAPPOLA ID: ' + id, message:'\x3cb\x3eATTENZIONE la trappola verrà definitivamente cancellata\x3c/b\x3e. Per rimuoverla solo utilizare il pulsante rimuovi.', buttons:Ext.Msg.OKCANCEL, icon:Ext.Msg.QUESTION, fn:function(btn, opt) {
    console.log(btn);
    var idtecnico = localStore.getItem('ID');
    var patt = /^\d+$/;
    if (btn == 'ok') {
      console.log(idtecnico);
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'cancella-trappola', id:id, tecnicoid:idtecnico}, success:function(resp) {
        var obj = Ext.util.JSON.decode(resp.responseText);
        if (obj.success) {
          trappoleLayer.getSource().updateParams({'time':Date.now()});
          Ext.StoreMgr.get('AllTrapStore').reload();
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore!', obj.errors.reason);
        } else {
          Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
        }
      }});
    }
  }});
}, iconCls:'delete', tooltip:'Elimina trappola'}]}], listeners:{select:'onGridpanelSelect', rowbodyclick:'onGridpanelRowbodyClick', afterrender:'onTrappolegridallAfterRender', rowdblclick:'onTrappolegridallRowDblClick'}, dockedItems:[{xtype:'pagingtoolbar', dock:'bottom', width:360, displayInfo:true}, {xtype:'toolbar', dock:'top', items:[{xtype:'button', handler:function(button, e) {
  Ext.StoreManager.get('AllTrapStore').reload();
}, iconCls:'fas fa-redo-alt', text:'Ricarica Lista'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.FilterTrapWindow').show();
}, iconCls:'fas fa-bullseye', text:'Filtra per centro'}, {xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.TrapReportWindow3').show();
}, hidden:true, id:'trappoleadata', iconCls:'xls', text:'Trappole\x3cbr/\x3eAttive al..'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.TipotrappolaWindow1').show();
}, hidden:true, id:'ManageTrapType', iconCls:'xls', text:'Tipo trappola'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.CatturePerWindow').show();
}, hidden:true, id:'SIMFItoCatturePer', iconCls:'xls', text:'Catture per'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.CatturePerWindow1').show();
}, hidden:true, id:'SIMFItoCatturePer1', iconCls:'xls', text:'Catture per (dettaglio osservazione)'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.TrapReportWindow2').show();
}, iconCls:'xls', text:'Nuovo Report'}, {xtype:'splitter'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.TrapReportWindow').show();
}, iconCls:'xls', text:'Report trappole'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.TrapReportWindow1').show();
}, iconCls:'xls', text:'Report Attivit\x26agrave;'}]}], plugins:[{ptype:'rowexpander', expandOnDblClick:false, rowBodyTpl:['\x3cdiv\x3e', '    \x3cp\x3eTrappola: {codice} ({nome}); posizionata il {datacreazione} nel sito {denominaz} presso l\x26apos;azienda {aziendasito}, in {tempo}.\x3c/p\x3e', '    \x3cp\x3eTrappola tipo: {tipotrappola}; feromone per: {mainpest}; durata erogatore: {durata_erogatore}gg; stato: {stato}.\x3c/p\x3e', '\x3c/div\x3e']}, {ptype:'gridfilters'}]}, {xtype:'panel', flex:1, 
region:'west', split:true, html:'\x3cdiv id\x3d"myMap3"\x3e\x3c/div\x3e', id:'MapPanelTrap', itemId:'mypanel6', listeners:{afterrender:'onMypanel6AfterRender', resize:'onMypanel6Resize'}}], listeners:{show:'onPanelShow'}});
Ext.define('SIMFito.view.AnalysysStatisticsWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.analysysstatisticswindow', stores:{hostStore:{model:'SIMFito.model.HostPestModel', proxy:{type:'ajax', extraParams:{mode:'stats', table:'analisyshost2'}, url:'../simfitolab/services/ajax.php', reader:{type:'json', rootProperty:'data'}}}, pestStore:{model:'SIMFito.model.HostPestModel', proxy:{type:'ajax', extraParams:{mode:'stats', table:'analisyspest2'}, url:'../simfitolab/services/ajax.php', 
reader:{type:'json', rootProperty:'data'}}}}});
Ext.define('SIMFito.view.AnalysysStatisticsWindowViewController', {extend:Ext.app.ViewController, alias:'controller.analysysstatisticswindow', onMycombobox2Select:function(combo, record, eOpts) {
  var hostCB = Ext.getCmp('simfitoAnalysisStatisticsHost');
  var pestCB = Ext.getCmp('simfitoAnalysisStatisticsPest');
  var labs = Ext.util.JSON.encode(combo.getValue());
  hostCB.getStore().getProxy().setExtraParam('lid', labs);
  pestCB.getStore().getProxy().setExtraParam('lid', labs);
  hostCB.setDisabled(false);
  pestCB.setDisabled(false);
}});
Ext.define('SIMFito.view.AnalysysStatisticsWindow', {extend:Ext.window.Window, alias:'widget.analysysstatisticswindow', controller:'analysysstatisticswindow', viewModel:{type:'analysysstatisticswindow'}, height:500, width:400, title:'Statistiche sulle Analisi', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'form', flex:1.5, scrollable:true, bodyPadding:10, layout:{type:'vbox', align:'stretch'}, dockedItems:[{xtype:'toolbar', flex:1, dock:'bottom', items:[{xtype:'button', handler:function(button, 
e) {
  var form = button.up('form').getForm();
  var items = form.getFields().items;
  form.reset();
  for (var i in items) {
    if (items[i].name == 'method') {
      items[i].hiddenValue = null;
    }
  }
}, flex:1, text:'Svuota'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form').getForm();
  var url = simfitoLabUrl + 'services/ajax.php?mode\x3dstats\x26table\x3danalisysresult\x26submode\x3dxls\x26';
  var items = form.getFields().items;
  for (var i in items) {
    field = items[i].name;
    if (items[i].name == 'method') {
      value = items[i].hiddenValue;
    } else {
      if (items[i].name == 'host' || items[i].name == 'pest') {
        value = Ext.util.JSON.encode(items[i].value);
      } else {
        if (items[i].name == 'start' || items[i].name == 'end') {
          value = items[i].getSubmitValue();
        } else {
          value = items[i].value;
        }
      }
    }
    if (value == null) {
      value = '';
    }
    url += items[i].name + '\x3d' + value + '\x26';
  }
  console.info(url);
  window.open(url, '_blank');
}, flex:1, text:'Esporta'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form').getForm();
  var url = simfitoLabUrl + 'services/ajax.php?mode\x3dstats\x26table\x3danalisysreport\x26submode\x3dxls\x26';
  var items = form.getFields().items;
  for (var i in items) {
    field = items[i].name;
    if (items[i].name == 'method') {
      value = items[i].hiddenValue;
    } else {
      if (items[i].name == 'host' || items[i].name == 'pest') {
        value = Ext.util.JSON.encode(items[i].value);
      } else {
        if (items[i].name == 'start' || items[i].name == 'end') {
          value = items[i].getSubmitValue();
        } else {
          value = items[i].value;
        }
      }
    }
    if (value == null) {
      value = '';
    }
    url += items[i].name + '\x3d' + value + '\x26';
  }
  window.open(url, '_blank');
}, flex:1, text:'Reports'}]}], items:[{xtype:'tagfield', itemId:'mycombobox2', fieldLabel:'Laboratorio', labelAlign:'top', name:'lid', displayField:'denominazione', store:'LaboratorioStore', valueField:'id', encodeSubmitValue:true, filterPickList:true, listeners:{select:'onMycombobox2Select'}}, {xtype:'datefield', fieldLabel:'Inizio', labelAlign:'top', name:'start', submitFormat:'Ymd'}, {xtype:'datefield', fieldLabel:'fine', labelAlign:'top', name:'end', submitFormat:'Ymd'}, {xtype:'tagfield', disabled:true, 
id:'simfitoAnalysisStatisticsHost', fieldLabel:'Coltura', labelAlign:'top', name:'host', displayField:'full_name', valueField:'b_code', encodeSubmitValue:true, filterPickList:true, bind:{store:'{hostStore}'}}, {xtype:'tagfield', disabled:true, id:'simfitoAnalysisStatisticsPest', fieldLabel:'Agente Nocivo', labelAlign:'top', name:'pest', displayField:'full_name', valueField:'b_code', encodeSubmitValue:true, filterPickList:true, bind:{store:'{pestStore}'}}]}]});
Ext.define('SIMFito.view.PerParassitaWindowViewModel2', {extend:Ext.app.ViewModel, alias:'viewmodel.areaincidenzawindow'});
Ext.define('SIMFito.view.PerParassitaWindowViewController2', {extend:Ext.app.ViewController, alias:'controller.areaincidenzawindow', onComboboxSelect:function(combo, record, eOpts) {
  var start = Ext.getCmp('start2');
  var end = Ext.getCmp('end2');
  var hostCombo = Ext.getCmp('bufferhostcode');
  var hostStore = Ext.StoreMgr.get('PestHostStore');
  var incidenza = Ext.getCmp('bufferincidenza');
  hostStore.getProxy().setExtraParam('pestcode', record.get('pestcode'));
  hostStore.reload();
  hostCombo.clearValue();
  start.setValue(record.get('start'));
  start.setMinValue(record.get('start'));
  end.setValue(record.get('end'));
  end.setMaxValue(record.get('end'));
  start.setDisabled(false);
  end.setDisabled(false);
  hostCombo.setDisabled(false);
  incidenza.setDisabled(false);
}});
Ext.define('SIMFito.view.AreaincidenzaWindow', {extend:Ext.window.Window, alias:'widget.areaincidenzawindow', controller:'areaincidenzawindow', viewModel:{type:'areaincidenzawindow'}, constrain:true, height:480, scrollable:true, width:640, layout:'fit', title:'Punti monitorati per parassita', dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var treeStore = Ext.StoreManager.get('DatasetTreeStore');
  var root = treeStore.getRoot();
  if (!root.isExpanded()) {
    root.expand();
  }
  var pestcode = Ext.getCmp('bufferpestcode1').getValue();
  var start = Ext.Date.format(Ext.getCmp('start1').getValue(), 'Ymd');
  var end = Ext.Date.format(Ext.getCmp('end1').getValue(), 'Ymd');
  var variables = {title:'Punti monitorate per: ' + pestcode + ' dal ' + start + ' al ' + end, pestcode:pestcode, start:start, end:end};
  var leaf = createElabElement(1, variables);
  extraLayerFromLeaf(leaf);
  var branch = treeStore.getById('elaborazioni');
  branch.appendChild(leaf);
}, text:'Esegui'}, {xtype:'button', handler:function(button, e) {
  console.log(button);
  button.up('window').close();
}, text:'Chiudi'}]}], items:[{xtype:'form', flex:1, scrollable:true, bodyPadding:5, url:'services/ajax.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldset', flex:1, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', anchor:'95%', id:'bufferpestcode2', fieldLabel:'Parassita', labelAlign:'top', name:'code', allowBlank:false, allowOnlyWhitespace:false, displayField:'name', store:'ParassitiStore', valueField:'pestcode', listeners:{select:'onComboboxSelect'}}, {xtype:'combobox', 
disabled:true, id:'bufferhostcode', fieldLabel:'Pianta ospite', labelAlign:'top', allowBlank:false, allowOnlyWhitespace:false, displayField:'name', store:'PestHostStore', valueField:'hostcode'}, {xtype:'numberfield', disabled:true, id:'bufferincidenza', fieldLabel:'Buffer [m]', labelAlign:'top', value:1000, allowBlank:false, allowOnlyWhitespace:false, allowDecimals:false, allowExponential:false, minValue:0}, {xtype:'fieldcontainer', flex:1, defaults:{padding:'2'}, layout:'hbox', items:[{xtype:'datefield', 
flex:1, disabled:true, id:'start2', fieldLabel:'Da', labelAlign:'top', name:'start', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'datefield', flex:1, disabled:true, id:'end2', fieldLabel:'A', labelAlign:'top', name:'end', allowBlank:false, allowOnlyWhitespace:false}]}]}, {xtype:'hiddenfield', flex:1, fieldLabel:'Label', name:'mode', value:'multibuffer'}, {xtype:'hiddenfield', flex:1, fieldLabel:'Label', name:'type', value:'pest'}, {xtype:'hiddenfield', flex:1, id:'prv2', fieldLabel:'Label', 
name:'prv', value:null}]}], inizialize:function() {
  Ext.getCmp('prv2').setValue(localStore.getItem('Provincia'));
}});
Ext.define('SIMFito.view.AssociaTecnicoWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.associatecnicowindow'});
Ext.define('SIMFito.view.AssociaTecnicoWindow', {extend:Ext.window.Window, alias:'widget.associatecnicowindow', viewModel:{type:'associatecnicowindow'}, constrain:true, height:480, id:'associatecnico', minHeight:480, minWidth:640, width:800, layout:'fit', title:'Associa Tecnici', items:[{xtype:'gridpanel', autoLoad:true, store:'AssociaTecniciStore', columns:[{xtype:'gridcolumn', flex:2, dataIndex:'nome', text:'Nome', tooltip:'Nome', filter:{type:'string'}}, {xtype:'gridcolumn', flex:1, dataIndex:'tipotecnico', 
text:'Tipo Tecnico', tooltip:'Tipo Tecnico', filter:{type:'list'}}, {xtype:'gridcolumn', flex:2, dataIndex:'codicefiscale', text:'Codice Fiscale', tooltip:'Codice Fiscale', filter:{type:'string'}}, {xtype:'gridcolumn', flex:2, dataIndex:'ufficio', text:'Ufficio', tooltip:'Ufficio', filter:{type:'list'}}, {xtype:'gridcolumn', flex:2, dataIndex:'email', text:'Email', tooltip:'Email'}], selModel:{selType:'checkboxmodel'}, plugins:[{ptype:'gridfilters'}]}], dockedItems:[{xtype:'toolbar', dock:'bottom', 
items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var selected = button.up('window').down('grid').getSelection();
  var idscheda = button.up('window').userData.idscheda;
  var couples = [];
  if (selected.length > 0) {
    for (var i = 0; i < selected.length; i++) {
      couples.push({idscheda:idscheda, id_tecnico:selected[i].get('id_tecnico')});
    }
  }
  var url = 'services/ajax-save-form.php';
  var params = {fase:'associa_tecnici', tecnici:Ext.util.JSON.encode(couples)};
  Ext.Ajax.request({url:url, method:'POST', params:params, success:function(response, opts) {
    var obj = Ext.util.JSON.decode(response.responseText);
    if (obj.success) {
      Ext.StoreMgr.get('SchedeStore').reload();
      Ext.Msg.alert('Info', 'Tecnici associati con successo');
      button.up('window').close();
    } else {
      Ext.Msg.alert('Errore', obj.errors.reason);
    }
  }, failure:function(response, opts) {
    if (opts.failureType == 'server') {
      var obj = Ext.util.JSON.decode(opts.response.responseText);
      Ext.Msg.alert('Errore!', obj.errors.reason);
    } else {
      Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + opts.response.responseText);
    }
  }});
}, text:'Usa Selezionati'}]}, {xtype:'toolbar', dock:'top', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/scheda.html#associatecnico', 'Help');
}, iconCls:'help'}]}]});
Ext.define('SIMFito.view.AssociaTecnicoWindowViewController1', {extend:Ext.app.ViewController, alias:'controller.rimuovitecnicowindow', onAssociatecnico1BeforeRender:function(component, eOpts) {
  var idscheda = component.userData.idscheda;
  var store = Ext.StoreMgr.get('RimuoviTecniciStore').getProxy().setExtraParam('idscheda', idscheda);
}});
Ext.define('SIMFito.view.AssociaTecnicoWindowViewModel1', {extend:Ext.app.ViewModel, alias:'viewmodel.rimuovitecnicowindow'});
Ext.define('SIMFito.view.AttachmentWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.attachmentwindow'});
Ext.define('SIMFito.view.AttachmentWindow', {extend:Ext.window.Window, alias:'widget.attachmentwindow', viewModel:{type:'attachmentwindow'}, constrain:true, height:600, width:800, title:'Allegati', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'gridpanel', flex:2, id:'attachmentgrid', autoLoad:true, store:'AttachmentStore', columns:[{xtype:'rownumberer'}, {xtype:'gridcolumn', flex:2, dataIndex:'file_name', text:'Files'}, {xtype:'actioncolumn', text:'Azioni', items:[{handler:function(view, 
rowIndex, colIndex, item, e, record, row) {
  var idscheda = Ext.getCmp('idScheda').getValue();
  var file = record.get('file_name');
  window.open(urlPrefix + 'uploads/' + idscheda + '/' + file, '_blank', 'width\x3d640,height\x3d480');
}, iconCls:'cloud_download', tooltip:'Scarica'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var idscheda = Ext.getCmp('idScheda').getValue();
  var file = record.get('file_name');
  Ext.Msg.confirm('Conferma', 'Confermi eliminazione del File?', function(buttonid) {
    console.log(buttonid);
    if (buttonid == 'yes') {
      Ext.Ajax.request({url:'services/manage_file.php', params:{dir:idscheda, file:file, mode:'delete'}, method:'POST', success:function(response, opts) {
        var obj = Ext.util.JSON.decode(response.responseText);
        if (obj.success) {
          Ext.StoreMgr.get('AttachmentStore').load();
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        switch(action.failureType) {
          case Ext.form.action.Action.CLIENT_INVALID:
            Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
            break;
          case Ext.form.action.Action.CONNECT_FAILURE:
            Ext.Msg.alert('Failure', 'Ajax communication failed');
            break;
          case Ext.form.action.Action.SERVER_INVALID:
            Ext.Msg.alert('Failure', action.result.errors.reason);
            break;
        }
      }});
    }
  });
}, isDisabled:function(view, rowIndex, colIndex, item, record) {
  var stato = view.up('gridpanel').userData.stato;
  if (stato === 0) {
    return false;
  } else {
    return true;
  }
}, iconCls:'delete', tooltip:'Elimina'}]}], dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'button', handler:function(button, e) {
  var store = Ext.StoreMgr.get('AttachmentStore');
  if (store.getCount() > 0) {
    var idscheda = Ext.getCmp('idScheda').getValue();
    var url = urlPrefix + 'services/manage_file.php?mode\x3dzip\x26dir\x3d' + idscheda;
    console.log(url);
    window.open(url, '_blank', 'width\x3d640,height\x3d480');
  } else {
    Ext.Msg.alert('Info', 'Non sono presenti allegati per questa scheda!');
  }
}, text:'Scarica tutti'}, {xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/allegati.html', 'Help');
}, iconCls:'help'}]}]}, {xtype:'form', flex:1, bodyPadding:10, title:'Carica Allegati', url:'services/file-upload.php', items:[{xtype:'filefield', anchor:'100%', id:'file', fieldLabel:'File', name:'file', allowBlank:false, allowOnlyWhitespace:false, buttonText:'Sfoglia...'}, {xtype:'hiddenfield', anchor:'100%', id:'idScheda', name:'scheda'}], dockedItems:[{xtype:'button', handler:function(button, e) {
  var form = button.up('form').getForm();
  if (form.isValid()) {
    form.submit({waitTitle:'Connessione', waitMsg:'Invio dei dati...', headers:{'Accept':'application/json', 'Content-Type':'application/json'}, success:function(form, action) {
      var obj = Ext.util.JSON.decode(action.response.responseText);
      console.log(action);
      if (obj.success) {
        Ext.StoreMgr.get('AttachmentStore').reload();
      } else {
        Ext.Msg.alert('Errore', obj.errors.reason);
      }
    }, failure:function(form, action) {
      console.log('fali');
      var obj = Ext.util.JSON.decode(action.response.responseText);
      switch(action.failureType) {
        case Ext.form.action.Action.CLIENT_INVALID:
          Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
          break;
        case Ext.form.action.Action.CONNECT_FAILURE:
          Ext.Msg.alert('Failure', 'Ajax communication failed');
          break;
        case Ext.form.action.Action.SERVER_INVALID:
          Ext.Msg.alert('Failure', action.result.errors.reason);
          break;
      }
    }});
  }
}, dock:'bottom', id:'carica', text:'Carica'}]}], init:function(userdata) {
  var idScheda = userdata.idScheda;
  var stato = userdata.statoScheda;
  Ext.StoreMgr.get('AttachmentStore').getProxy().setExtraParam('idscheda', idScheda);
  Ext.getCmp('idScheda').setValue(idScheda);
  Ext.getCmp('attachmentgrid').userData = {stato:stato};
  if (stato !== 0) {
    Ext.getCmp('carica').setDisabled(true);
    Ext.getCmp('file').setDisabled(true);
  }
  this.show();
}});
Ext.define('SIMFito.view.CLWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.clwindow'});
Ext.define('SIMFito.view.CLWindowViewController', {extend:Ext.app.ViewController, alias:'controller.clwindow', onPanelBeforeRender:function(component, eOpts) {
  var store = Ext.StoreMgr.get('ChangeLogStore');
  if (store.getCount() > 0) {
    var items = [];
    for (var i = 0; i < store.getCount(); i++) {
      var record = store.getAt(i);
      items.push({id:'card-' + i, title:'Log ' + Ext.util.Format.date(record.get('data'), 'd/m/Y'), html:record.get('changelog'), scrollable:true});
    }
    component.add(items);
  }
}});
Ext.define('SIMFito.view.CLWindow', {extend:Ext.window.Window, alias:'widget.clwindow', controller:'clwindow', viewModel:{type:'clwindow'}, constrain:true, height:480, scrollable:true, width:640, layout:'fit', closable:false, title:'Change Log', items:[{xtype:'panel', doCardNavigation:function(incr) {
  var me = this;
  var l = me.getLayout();
  var i = l.activeItem.id.split('card-')[1];
  var max = Ext.StoreMgr.get('ChangeLogStore').getCount();
  var next = parseInt(i, 10) + incr;
  l.setActiveItem(next);
  me.down('#card-prev').setDisabled(next === 0);
  me.down('#card-next').setDisabled(next === max - 1);
}, defaultListenerScope:true, scrollable:'vertical', defaults:{border:false}, layout:'card', bodyPadding:10, listeners:{beforerender:'onPanelBeforeRender'}, dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  button.up('panel').doCardNavigation(-1);
}, disabled:true, itemId:'card-prev', text:'\x26laquo; Precedente'}, {xtype:'button', handler:function(button, e) {
  button.up('panel').doCardNavigation(1);
}, itemId:'card-next', text:'Successivo \x26raquo;'}]}, {xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'checkboxfield', id:'nonpiu', boxLabel:'Non mostrare pi\x26ugrave;'}, {xtype:'button', handler:function(button, e) {
  if (Ext.getCmp('nonpiu').getValue()) {
    Ext.Ajax.request({url:'services/ajax-save-form.php', params:{uid:localStore.getItem('ID'), fase:'changelogread'}, success:function(response, opts) {
    }, failure:function(response, opts) {
      Ext.Msg.alret('Errore', 'server-side failure with status code ' + response.status);
    }});
  }
  button.up('window').close();
}, cls:'action', text:'Ho capito'}]}]}]});
Ext.define('SIMFito.view.PerParassitaWindowViewModel12', {extend:Ext.app.ViewModel, alias:'viewmodel.cattureperwindow'});
Ext.define('SIMFito.view.PerParassitaWindowViewController12', {extend:Ext.app.ViewController, alias:'controller.cattureperwindow', onComboboxSelect:function(combo, record, eOpts) {
}});
Ext.define('SIMFito.view.CatturePerWindow', {extend:Ext.window.Window, alias:'widget.cattureperwindow', controller:'cattureperwindow', viewModel:{type:'cattureperwindow'}, constrain:true, height:278, scrollable:true, width:571, layout:'fit', title:'Controlli per', dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var url = urlPrefix + 'services/export.php?mode\x3dxls\x26data\x3dcatture\x26';
  var win = button.up('window');
  var form = win.down('form');
  if (form.isValid()) {
    for (var i in form.getValues()) {
      url += i + '\x3d' + form.getValues()[i] + '\x26';
    }
    console.log(url);
    window.open(url, '_blank');
    win.close();
  }
}, text:'Esegui'}, {xtype:'button', handler:function(button, e) {
  console.log(button);
  button.up('window').close();
}, text:'Chiudi'}]}], items:[{xtype:'form', flex:1, scrollable:true, bodyPadding:5, url:'services/ajax.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldset', flex:1, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', anchor:'95%', id:'bufferpestcode12', fieldLabel:'Parassita', labelAlign:'top', name:'code', allowBlank:false, allowOnlyWhitespace:false, displayField:'name', store:'ParassitiStore2', valueField:'pestcode', listeners:{select:'onComboboxSelect'}}, {xtype:'fieldcontainer', 
defaults:{padding:'2'}, layout:'hbox', items:[{xtype:'datefield', flex:1, id:'start12', fieldLabel:'Da', labelAlign:'top', name:'start', allowBlank:false, allowOnlyWhitespace:false, submitFormat:'Y-m-d'}, {xtype:'datefield', flex:1, id:'end12', fieldLabel:'A', labelAlign:'top', name:'end', allowBlank:false, allowOnlyWhitespace:false, submitFormat:'Y-m-d'}]}]}]}], inizialize:function() {
}});
Ext.define('SIMFito.view.PerParassitaWindowViewModel13', {extend:Ext.app.ViewModel, alias:'viewmodel.cattureperwindow1'});
Ext.define('SIMFito.view.PerParassitaWindowViewController13', {extend:Ext.app.ViewController, alias:'controller.cattureperwindow1', onComboboxSelect:function(combo, record, eOpts) {
}});
Ext.define('SIMFito.view.CatturePerWindow1', {extend:Ext.window.Window, alias:'widget.cattureperwindow1', controller:'cattureperwindow1', viewModel:{type:'cattureperwindow1'}, constrain:true, height:278, scrollable:true, width:571, layout:'fit', title:'Controlli per (dettaglio osservazione)', dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var url = urlPrefix + 'services/export.php?mode\x3dxls\x26data\x3dcatture2\x26';
  var win = button.up('window');
  var form = win.down('form');
  if (form.isValid()) {
    for (var i in form.getValues()) {
      url += i + '\x3d' + form.getValues()[i] + '\x26';
    }
    console.log(url);
    window.open(url, '_blank');
    win.close();
  }
}, text:'Esegui'}, {xtype:'button', handler:function(button, e) {
  console.log(button);
  button.up('window').close();
}, text:'Chiudi'}]}], items:[{xtype:'form', flex:1, scrollable:true, bodyPadding:5, url:'services/ajax.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldset', flex:1, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', anchor:'95%', id:'bufferpestcode13', fieldLabel:'Parassita', labelAlign:'top', name:'code', allowBlank:false, allowOnlyWhitespace:false, displayField:'name', store:'ParassitiStore2', valueField:'pestcode', listeners:{select:'onComboboxSelect'}}, {xtype:'fieldcontainer', 
defaults:{padding:'2'}, layout:'hbox', items:[{xtype:'datefield', flex:1, id:'start13', fieldLabel:'Da', labelAlign:'top', name:'start', allowBlank:false, allowOnlyWhitespace:false, submitFormat:'Y-m-d'}, {xtype:'datefield', flex:1, id:'end13', fieldLabel:'A', labelAlign:'top', name:'end', allowBlank:false, allowOnlyWhitespace:false, submitFormat:'Y-m-d'}]}]}]}], inizialize:function() {
}});
Ext.define('SIMFito.view.CodeWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.codewindow'});
Ext.define('SIMFito.view.CodeWindowViewController', {extend:Ext.app.ViewController, alias:'controller.codewindow', onWindowAfterRender:function(component, eOpts) {
  var datum = component.userData;
  var code = component.userData.codice;
  JsBarcode('#barcode', code, {format:'CODE128', width:1, height:50, fontSize:11, textPosition:'top'});
}});
Ext.define('SIMFito.view.CodeWindow', {extend:Ext.window.Window, alias:'widget.codewindow', controller:'codewindow', viewModel:{type:'codewindow'}, constrain:true, height:200, width:400, layout:'fit', title:'Codice a Barre', listeners:{afterrender:'onWindowAfterRender'}, dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var datum = button.up('window').userData;
  var code = datum.codice;
  var a = document.getElementById('barcode');
  ww = window.open(a.toDataURL(), '_blank', 'width\x3d400,height\x3d200');
  ww.setTimeout(function() {
    ww.print();
    ww.close();
  }, 100);
}, text:'Stampa'}]}], items:[{xtype:'container', html:'\x3ccanvas id\x3d"barcode"\x3e\x3c/canvas\x3e', layout:'fit'}]});
Ext.define('SIMFito.view.DuplicaWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.duplicawindow'});
Ext.define('SIMFito.view.DuplicaWindowViewController', {extend:Ext.app.ViewController, alias:'controller.duplicawindow', onCambiatema2Select:function(combo, record, eOpts) {
  Ext.getCmp('SIMFitoMotivo2').clearValue();
  var store = Ext.StoreMgr.get('TipologiasitiStore');
  store.getProxy().setExtraParam('theme', record.get('id'));
  store.reload();
  Ext.getCmp('SIMFitoMotivo2').setDisabled();
}, onFormAfterRender:function(component, eOpts) {
  Ext.getCmp('idscheda2').setValue(component.up('window').userData.idscheda);
  Ext.getCmp('nuovadata').setMinValue(new Date);
  var delay = localStore.getItem('scheda0001') !== null ? localStore.getItem('scheda0001') * 1 : 0;
  var toDay = new Date;
  var d = toDay.getDate();
  var minDate = toDay.setDate(d - delay);
  Ext.getCmp('nuovadata').setMinValue(new Date(minDate));
  console.info('motivo della visita abilitato: ' + component.up('window').userData.record.get('motivo_enabled'));
  if (component.up('window').userData.record.get('motivo_enabled')) {
    var store = Ext.StoreMgr.get('ThemeTSStore');
    store.on({load:function(s, r, successful, operation, eOpts) {
      if (successful) {
        var idx = s.findExact('theme', Ext.getCmp('DuplicaWindow').userData.record.get('tipo_visita_theme'));
        Ext.getCmp('cambiatema2').select(s.getAt(idx));
        Ext.getCmp('SIMFitoMotivo2').setDisabled(false);
        Ext.StoreMgr.get('TipologiasitiStore').getProxy().setExtraParam('theme', s.getAt(idx).get('id'));
        Ext.StoreMgr.get('TipologiasitiStore').on({load:function(sx, rx, successfulx, operationx, eOptsx) {
          if (successfulx) {
            var idxx = sx.findExact('id', Ext.getCmp('DuplicaWindow').userData.record.get('tipo_visita_id'));
            Ext.getCmp('SIMFitoMotivo2').select(sx.getAt(idxx));
          } else {
            Ext.Msg.alert('Errore', 'Errore nel caricamento delle tipologie Siti');
          }
        }});
        Ext.StoreMgr.get('TipologiasitiStore').load();
      } else {
        Ext.Msg.alert('Errore', 'Errore nel caricamento dei temi delle tipologie Siti');
      }
    }});
    Ext.StoreMgr.get('ThemeTSStore').load();
  }
}, onFormBeforeRender:function(component, eOpts) {
  Ext.getCmp('tecnicoID').setValue(localStore.getItem('ID'));
}});
Ext.define('SIMFito.view.DuplicaWindow', {extend:Ext.window.Window, alias:'widget.duplicawindow', controller:'duplicawindow', viewModel:{type:'duplicawindow'}, constrain:true, height:337, id:'DuplicaWindow', width:608, layout:'fit', title:'Duplica Scheda', items:[{xtype:'form', bodyPadding:10, url:'services/ajax-save-form.php', items:[{xtype:'datefield', anchor:'100%', id:'nuovadata', fieldLabel:'Data Scheda', msgTarget:'under', name:'nuovadata', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', 
emptyText:'Campo obbligatorio', format:'d/m/Y'}, {xtype:'fieldset', title:'Modifica tipologia sito', items:[{xtype:'combobox', anchor:'100%', id:'cambiatema2', fieldLabel:'tema', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', displayField:'theme', store:'ThemeTSStore', valueField:'id', listeners:{select:'onCambiatema2Select'}}, {xtype:'combobox', anchor:'100%', disabled:true, id:'SIMFitoMotivo2', fieldLabel:'tipologia di sito', name:'motivo', 
allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', displayField:'description', store:'TipologiasitiStore', valueField:'id'}]}, {xtype:'textfield', anchor:'100%', fieldLabel:'Protocollo', name:'protocollo'}, {xtype:'hiddenfield', anchor:'100%', name:'fase', value:'duplica'}, {xtype:'hiddenfield', anchor:'100%', id:'idscheda2', name:'idscheda'}, {xtype:'hiddenfield', anchor:'100%', id:'tecnicoID', 
name:'tecnicoid'}], dockedItems:[{xtype:'button', handler:function(button, e) {
  var form = button.up('form').getForm();
  if (form.isValid()) {
    form.submit({method:'POST', waitTitle:'Connessione', waitMsg:'Invio dei dati...', success:function(form, action) {
      obj = Ext.util.JSON.decode(action.response.responseText);
      var success = obj.success;
      if (success) {
        Ext.StoreMgr.get('SchedeStore').reload();
        Ext.Msg.alert('Info', 'Scheda duplicata con successo');
        button.up('window').close();
      } else {
        Ext.Msg.alert('Errore', obj.errors.reason);
      }
    }, failure:function(form, action) {
      switch(action.failureType) {
        case Ext.form.action.Action.CLIENT_INVALID:
          Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
          break;
        case Ext.form.action.Action.CONNECT_FAILURE:
          Ext.Msg.alert('Failure', 'Ajax communication failed');
          break;
        case Ext.form.action.Action.SERVER_INVALID:
          Ext.Msg.alert('Failure', action.result.errors.reason);
          break;
      }
    }});
  }
}, formBind:true, dock:'bottom', text:'Esegui'}], listeners:{afterrender:'onFormAfterRender', beforerender:'onFormBeforeRender'}}]});
Ext.define('SIMFito.view.TableWindowViewModel1', {extend:Ext.app.ViewModel, alias:'viewmodel.europhitwindow'});
Ext.define('SIMFito.view.TableWindowViewController1', {extend:Ext.app.ViewController, alias:'controller.europhitwindow', onFormBeforeRender:function(component, eOpts) {
  component.getForm().baseParams = {mode:'xlsasync', tipoTecnico:localStore.getItem('TipoUtente'), 'uid':localStore.getItem('ID')};
}});
Ext.define('SIMFito.view.EuroPhitWindow', {extend:Ext.window.Window, alias:'widget.europhitwindow', controller:'europhitwindow', viewModel:{type:'europhitwindow'}, constrain:true, height:300, id:'SIMFitoTableWindow1', width:581, layout:'fit', title:'EuroPhyt', items:[{xtype:'form', scrollable:true, bodyPadding:10, baseParams:{mode:'xlsasync', tipoTecnico:null, uid:null}, url:'services/export_ep.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldcontainer', width:400, defaults:{labelAlign:'right', 
labelWidth:80}, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'numberfield', flex:1, fieldLabel:'Anno', name:'anno', value:2022, allowBlank:false, allowOnlyWhitespace:false, allowDecimals:false, allowExponential:false, minValue:2010}]}, {xtype:'fieldcontainer', flex:1, height:120, width:800, defaults:{labelAlign:'right', labelWidth:80, blankText:'Lasciare vuoto o scrivere "tutti" per non filtrare per questo campo'}, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'tagfield', id:'pest1', 
fieldLabel:'Parassita', name:'pest', emptyText:'', anyMatch:true, autoLoadOnValue:true, displayField:'name', store:'tablePestStore', valueField:'pestcode', encodeSubmitValue:true}]}, {xtype:'radiogroup', width:400, fieldLabel:'Ruop', items:[{xtype:'radiofield', name:'ruop', boxLabel:'ruop', inputValue:'ruop'}, {xtype:'radiofield', name:'ruop', boxLabel:'no ruop', inputValue:'norup'}, {xtype:'radiofield', name:'ruop', boxLabel:'Tutte', checked:true, inputValue:'all'}]}, {xtype:'button', handler:function(button, 
e) {
  var window = button.up('window');
  var form = button.up('form');
  if (form.isValid()) {
    form.submit({method:'GET', waitTitle:'Connecting', waitMsg:'Sending data...', success:function(form, action) {
      obj = Ext.util.JSON.decode(action.response.responseText);
      var success = obj.success;
      if (success) {
        Ext.StoreManager.get('reportsStores').reload();
        window.close();
        Ext.Msg.alert('Info', 'Generazione del report avviata.');
      } else {
        Ext.Msg.alert('Errore', obj.errors.reason);
      }
    }, failure:function(form, action) {
      if (action.failureType == 'server') {
        obj = Ext.util.JSON.decode(action.response.responseText);
        Ext.Msg.alert('Login Fallito!', obj.errors.reason);
      } else {
        Ext.Msg.alert('Attenzione!', 'Server non raggiungibile: ' + action.response.responseText);
      }
    }});
  }
}, text:'Continua'}, {xtype:'fieldcontainer', width:400, defaults:{labelAlign:'right', labelWidth:80}, layout:{type:'hbox', align:'stretch'}}], listeners:{beforerender:'onFormBeforeRender'}}], init:function(params) {
  for (var i in params) {
    if (i == 'uid') {
      Ext.getCmp('uidx').setValue(params[i]);
    } else {
      Ext.getCmp(i).setValue(params[i]);
    }
  }
  if (params.uty == 1) {
    if (params.upr !== null) {
      var prvCombo = Ext.getCmp('provinciacombo');
      prvCombo.setReadOnly();
      Ext.StoreMgr.get('ProvinceStore').on('load', function(store, records, successfull, operation, eOpts) {
        var prvCode = Number(localStore.getItem('Provincia'));
        var idx = store.findExact('id', prvCode);
        console.log(idx);
        if (Ext.getCmp('provinciacombo') !== undefined) {
          Ext.getCmp('provinciacombo').setValue(store.getAt(idx).get('provincia'));
          Ext.getCmp('provinciacombo').setReadOnly(true);
        }
      });
      Ext.StoreMgr.get('ProvinceStore').load();
    } else {
      Ext.Msg.alert('Error', 'Utente di tipo amministratore provinciale con provincia non settata: contattare l\x26apos;assistenza!');
    }
  }
  this.params = params;
  this.show();
}});
Ext.define('SIMFito.view.FarmmergefWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.farmmergefwindow'});
Ext.define('SIMFito.view.FarmmergefWindowViewController', {extend:Ext.app.ViewController, alias:'controller.farmmergefwindow', onSourcefarmChange:function(field, newValue, oldValue, eOpts) {
  var text = '';
  var coma = '';
  var store = field.getStore();
  if (store.findExact('id_azienda', newValue) != -1) {
    var record = store.getAt(store.findExact('id_azienda', newValue));
    var data = record.data;
    var first = true;
    for (var i in data) {
      if (i != 'id' && i != 'bbox' && i != 'rup' && i != 'fito' && i != 'vivaio') {
        if (first) {
          coma = '';
          first = false;
        } else {
          coma = '; ';
        }
        var valore = data[i];
        if (data[i] == '') {
          valore = 'NON DISPONIBILE';
        }
        text += coma + '\x3cb\x3e' + i + '\x3c/b\x3e: ' + valore;
      }
    }
  }
  Ext.getCmp('sorgente').setHtml('\x3cdiv\x3e' + text + '\x3c/div\x3e');
}, onDestinationframChange:function(field, newValue, oldValue, eOpts) {
  var text = '';
  var coma = '';
  var store = field.getStore();
  if (store.findExact('id_azienda', newValue) != -1) {
    var record = store.getAt(store.findExact('id_azienda', newValue));
    var data = record.data;
    var first = true;
    for (var i in data) {
      if (i != 'id' && i != 'bbox' && i != 'rup' && i != 'fito' && i != 'vivaio') {
        if (first) {
          coma = '';
          first = false;
        } else {
          coma = '; ';
        }
        var valore = data[i];
        if (data[i] == '') {
          valore = 'NON DISPONIBILE';
        }
        text += coma + '\x3cb\x3e' + i + '\x3c/b\x3e: ' + valore;
      }
    }
  }
  Ext.getCmp('destinazione').setHtml('\x3cdiv\x3e' + text + '\x3c/div\x3e');
}});
Ext.define('SIMFito.view.FarmmergefWindow', {extend:Ext.window.Window, alias:'widget.farmmergefwindow', controller:'farmmergefwindow', viewModel:{type:'farmmergefwindow'}, constrain:true, height:600, width:800, layout:'fit', collapsible:true, title:'Unisci Aziente', items:[{xtype:'form', bodyPadding:5, url:'services/mergeaziende.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldset', flex:1, title:'Sorgente (DA ELIMINARE)', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', 
id:'sourcefarm', fieldLabel:'Partita IVA Azienda Sorgente', labelAlign:'top', name:'srcid', allowBlank:false, blankText:'Codice Fiscale/Partita IVA', emptyText:'Codice Fiscale/Partita IVA', displayField:'partita_iva', store:'FarmStore', valueField:'id_azienda', listeners:{change:'onSourcefarmChange'}}, {xtype:'panel', flex:1, id:'sorgente'}]}, {xtype:'fieldset', flex:1, title:'Destinazione (DA MANTENERE)', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', id:'destinationfram', fieldLabel:'Partita IVA Azienda Destinazione', 
labelAlign:'top', name:'destid', allowBlank:false, blankText:'Codice Fiscale/Partita IVA', emptyText:'Codice Fiscale/Partita IVA', displayField:'partita_iva', store:'FarmStore', valueField:'id_azienda', listeners:{change:'onDestinationframChange'}}, {xtype:'panel', flex:1, id:'destinazione'}]}], dockedItems:[{xtype:'button', handler:function(button, e) {
  var form = button.up('form');
  if (form.isValid()) {
    if (Ext.getCmp('sourcefarm').getValue() != Ext.getCmp('destinationfram').getValue()) {
      Ext.MessageBox.confirm('Conferma', 'Continuando l\x26apos;azienda Sorgente sar\x26agrave; eliminata e tutti gli elementi ad essa collegati (siti, schede, etc), passeranno all\x26apos;azineda destinazione. L\x26apos;operazione non \x26egrave; refersibile! Confermare l\x26apos;azione?', function(btn) {
        if (btn == 'yes') {
          form.submit({method:'POST', waitTitle:'Connecting', waitMsg:'Sending data...', success:function(form, action) {
            obj = Ext.util.JSON.decode(action.response.responseText);
            var success = obj.success;
            if (success) {
              form.reset();
              Ext.Msg.alert('Info', 'Aziende unite con successo');
            } else {
              Ext.Msg.alert('Errore', obj.errors.reason);
            }
          }, failure:function(form, action) {
            if (action.failureType == 'server') {
              obj = Ext.util.JSON.decode(action.response.responseText);
              Ext.Msg.alert('Login Fallito!', obj.errors.reason);
            } else {
              Ext.Msg.alert('Attenzione!', 'Server non raggiungibile: ' + action.response.responseText);
            }
          }});
        }
      });
    } else {
      Ext.Msg.alert('Errore', 'Le azienda sorgente e destinazione non possono essere la stessa!');
    }
  }
}, flex:1, dock:'bottom', text:'Unisci'}]}], dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'tbfill'}, {xtype:'button', iconCls:'help'}]}]});
Ext.define('SIMFito.view.FilterTrapWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.filtertrapwindow'});
Ext.define('SIMFito.view.FilterTrapWindowViewController', {extend:Ext.app.ViewController, alias:'controller.filtertrapwindow', onFormAfterRender:function(component, eOpts) {
  var store = Ext.StoreManager.lookup('AllTrapStore');
  var eP = store.getProxy().getExtraParams();
  if (eP.x != null) {
    Ext.getCmp('filterTrapX').setValue(eP.x);
  }
  if (eP.y != null) {
    Ext.getCmp('filterTrapY').setValue(eP.y);
  }
  if (eP.prj != null) {
    Ext.getCmp('filterTrapPrj').setValue(eP.prj);
  }
  if (eP.r != null) {
    Ext.getCmp('filterTrapR').setValue(eP.r);
  }
}});
Ext.define('SIMFito.view.FilterTrapWindow', {extend:Ext.window.Window, alias:'widget.filtertrapwindow', controller:'filtertrapwindow', viewModel:{type:'filtertrapwindow'}, constrain:true, height:400, scrollable:true, width:400, layout:'fit', title:'Filtra per centro', items:[{xtype:'form', bodyPadding:10, items:[{xtype:'numberfield', anchor:'100%', id:'filterTrapX', fieldLabel:'X/Long', labelAlign:'top', name:'x', allowBlank:false, allowOnlyWhitespace:false, decimalPrecision:6}, {xtype:'numberfield', 
anchor:'100%', id:'filterTrapY', fieldLabel:'Y/Lat', labelAlign:'top', name:'y', allowBlank:false, allowOnlyWhitespace:false, decimalPrecision:6}, {xtype:'combobox', anchor:'100%', id:'filterTrapPrj', fieldLabel:'Sistema di riferimento', labelAlign:'top', allowBlank:false, allowOnlyWhitespace:false, autoLoadOnValue:true, displayField:'title', store:'userPrjStore', valueField:'srs'}, {xtype:'numberfield', anchor:'100%', id:'filterTrapR', fieldLabel:'Raggio [m]', labelAlign:'top', name:'r', allowBlank:false, 
allowOnlyWhitespace:false, allowDecimals:false, minValue:0}], dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'button', handler:function(button, e) {
  var form = button.up('form');
  if (form.isValid()) {
    var store = Ext.StoreManager.lookup('AllTrapStore');
    var proxy = store.getProxy();
    proxy.setExtraParam('x', Ext.getCmp('filterTrapX').getValue());
    proxy.setExtraParam('y', Ext.getCmp('filterTrapY').getValue());
    proxy.setExtraParam('prj', Ext.getCmp('filterTrapPrj').getValue());
    proxy.setExtraParam('r', Ext.getCmp('filterTrapR').getValue());
    store.reload();
  }
}, flex:1, iconCls:'x-fa fa-search', text:'Cerca'}, {xtype:'button', handler:function(button, e) {
  var store = Ext.StoreManager.lookup('AllTrapStore');
  var proxy = store.getProxy();
  if (proxy.getExtraParams().x != null) {
    proxy.setExtraParam('x', null);
    proxy.setExtraParam('y', null);
    proxy.setExtraParam('prj', null);
    store.reload();
  }
  button.up('form').reset();
}, flex:1, iconCls:'x-fa fa-trash', text:'Svuota/Rimuovi filtro'}]}], listeners:{afterrender:'onFormAfterRender'}}]});
Ext.define('SIMFito.view.GetFeaturesInfoWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.getfeaturesinfowindow'});
Ext.define('SIMFito.view.GetFeaturesInfoWindow', {extend:Ext.window.Window, alias:'widget.getfeaturesinfowindow', viewModel:{type:'getfeaturesinfowindow'}, constrain:true, height:480, scrollable:true, width:640, layout:'fit', title:'Info', init:function(urls) {
  var innerHTML = '';
  for (var idx in urls) {
    if (urls) {
      innerHTML += '\x3ciframe width\x3d"100%" height\x3d"400" src\x3d"' + urls[idx] + '"\x3e\x3c/iframe\x3e';
    }
  }
  this.inHTML = innerHTML;
  this.setListeners({afterrender:{fn:function(w, eOpts) {
    w.setHtml('\x3cdiv\x3e' + this.inHTML + '\x3c/div\x3e');
    console.info(this.inHTML);
  }}});
  this.show();
}});
Ext.define('SIMFito.view.LaboratorioWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.laboratoriowindow'});
Ext.define('SIMFito.view.LaboratorioWindow', {extend:Ext.window.Window, alias:'widget.laboratoriowindow', viewModel:{type:'laboratoriowindow'}, constrain:true, height:300, width:400, bodyPadding:10, title:'Attenzione', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'container', flex:1, html:'\x3ch3\x3e\n    \x26Egrave; stato scelto un nuovo campione.\x3cbr/\x3e\n    Si prega di indicare a quale laboratorio verr\x26agrave; conferito.\x3cbr/\x3e\n    Grazie.\n\x3c/h3\x3e'}, {xtype:'form', flex:1, 
bodyPadding:10, items:[{xtype:'combobox', anchor:'100%', id:'laboratorio', fieldLabel:'Laboratorio', msgTarget:'under', name:'laboratorio', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', displayField:'denominazione', store:'LaboratorioStore', valueField:'id'}], dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form');
  var win = button.up('window');
  if (form.isValid()) {
    var idlaboratorio = Ext.getCmp('laboratorio').getValue();
    formToTrasmit = button.up('window').userData;
    formToTrasmit.add({xtype:'hiddenfield', name:'laboratorio', value:idlaboratorio});
    formToTrasmit.getForm().submit({method:'POST', waitTitle:'Connessione', waitMsg:'Invio dei dati...', success:function(form, action) {
      osservazioneFormReset();
      win.close();
      removeInteraction();
      removeLayerBy('idItem', 'osservazione');
      Ext.StoreMgr.get('OsservazioniStore').reload();
    }, failure:function(form, action) {
      osservazioneFormReset();
      if (action.failureType == 'server') {
        var obj = Ext.util.JSON.decode(action.response.responseText);
        Ext.Msg.alert('Errore!', obj.errors.reason);
      } else {
        Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
      }
    }});
  }
}, formBind:true, text:'Salva'}, {xtype:'button', handler:function(button, e) {
  button.up('window').close();
}, text:'Annulla'}]}]}], dockedItems:[{xtype:'toolbar', flex:1, dock:'top', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/osservazioni.html#nuovaosservazione', 'Help');
}, iconCls:'help'}]}]});
Ext.define('SIMFito.view.LoginFormViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.loginform'});
Ext.define('SIMFito.view.LoginFormViewController', {extend:Ext.app.ViewController, alias:'controller.loginform', onFormClose:function(panel, eOpts) {
  Ext.create('SIMFito.view.MainViewport');
}, onFormBeforeClose:function(panel, eOpts) {
  var ID = localStore.getItem('ID');
  var ss = Ext.StoreMgr.get('SchedeStore');
  ss.getProxy().setExtraParam('idTecnico', ID);
  ss.reload();
}});
Ext.define('SIMFito.view.LoginForm', {extend:Ext.form.Panel, alias:'widget.loginform', controller:'loginform', viewModel:{type:'loginform'}, height:340, scrollable:true, style:'margin: 5px auto auto auto;', width:400, bodyPadding:10, title:'SIMFito V.4.1.0', url:'services/login.php', items:[{xtype:'textfield', anchor:'100%', fieldLabel:'Utente', msgTarget:'under', name:'loginUsername', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio'}, {xtype:'textfield', anchor:'100%', 
fieldLabel:'Password', msgTarget:'under', name:'loginPassword', inputType:'password', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio'}, {xtype:'hiddenfield', anchor:'100%', name:'mode', value:'simfito'}], dockedItems:[{xtype:'fieldcontainer', dock:'bottom', margin:'25px 5px', layout:'hbox', items:[{xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.RichiestaWindow').show();
}, flex:1, cls:'arequest-btn', margin:10, text:'Richiedi Accesso'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.RecuperoWindow').show();
}, flex:1, cls:'aget-btn', margin:10, text:'Recupero Credenziali'}]}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form').getForm();
  if (form.isValid()) {
    form.submit({method:'POST', waitTitle:'Connecting', waitMsg:'Sending data...', success:function(form, action) {
      obj = Ext.util.JSON.decode(action.response.responseText);
      var success = obj.success;
      if (success) {
        checkConfig();
        var id = obj.id;
        var tipo = obj.tipo;
        var provincia = obj.provincia;
        var nome = obj.nome;
        var tipotecnico = obj.tipotecnico;
        Ext.StoreMgr.get('SchedeStore').getProxy().setExtraParam('idTecnico', id);
        Ext.StoreMgr.get('CampionecodeStore').getProxy().setExtraParam('idtecnico', id);
        localStore.setItem('ID', id);
        localStore.setItem('TipoUtente', tipo);
        localStore.setItem('Provincia', provincia);
        localStore.setItem('Nome', nome);
        localStore.setItem('TipoTecnicoDesc', tipotecnico);
        form.owner.close();
      } else {
        Ext.Msg.alert('Login Fallito', obj.errors.reason);
      }
    }, failure:function(form, action) {
      if (action.failureType == 'server') {
        obj = Ext.util.JSON.decode(action.response.responseText);
        Ext.Msg.alert('Login Fallito!', obj.errors.reason);
      } else {
        Ext.Msg.alert('Attenzione!', 'Server non raggiungibile: ' + action.response.responseText);
      }
    }});
  }
}, formBind:false, cls:'login-btn', dock:'bottom', text:'Login'}, {xtype:'toolbar', dock:'top', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/accesso.html', 'Help');
}, iconCls:'help'}]}], listeners:{close:'onFormClose', beforeclose:'onFormBeforeClose'}});
Ext.define('SIMFito.view.MailWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.mailwindow'});
Ext.define('SIMFito.view.MailWindowViewController', {extend:Ext.app.ViewController, alias:'controller.mailwindow', onWindowAfterRender:function(component, eOpts) {
  var cmb = Ext.getCmp('mailto1');
  cmb.setValue(Ext.StoreManager.get('TipoTecnicoStore1').getAt(0));
}});
Ext.define('SIMFito.view.MailWindow', {extend:Ext.window.Window, alias:'widget.mailwindow', controller:'mailwindow', viewModel:{type:'mailwindow'}, constrain:true, height:480, minHeight:220, minWidth:300, width:640, layout:'fit', title:'Comunicazioni', maximizable:true, plain:true, items:[{xtype:'form', border:false, bodyPadding:5, fieldDefaults:'labelWidth:60', url:'services/messageajax.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'tagfield', id:'mailto', fieldLabel:'A:', msgTarget:'under', 
name:'to', emptyText:'Campo obbligatorio', displayField:'cognomeenome', queryMode:'local', store:'UsersStore1', valueField:'id_tecnico', encodeSubmitValue:true, filterPickList:true}, {xtype:'tagfield', id:'mailto1', fieldLabel:'Gruppi', msgTarget:'under', name:'toGroup', allowBlank:false, emptyText:'Campo obbligatorio', displayField:'tipotecnico', queryMode:'local', store:'TipoTecnicoStore1', valueField:'idtipo_tecnico', encodeSubmitValue:true, filterPickList:true}, {xtype:'textfield', fieldLabel:'Oggetto', 
msgTarget:'under', name:'subject', allowBlank:false, allowOnlyWhitespace:false, emptyText:'Campo obbligatorio'}, {xtype:'textareafield', flex:1, msgTarget:'under', name:'msg', allowBlank:false, allowOnlyWhitespace:false, emptyText:'Campo obbligatorio'}, {xtype:'hiddenfield', flex:1, name:'mode', value:'mailtecnici1'}]}], dockedItems:[{xtype:'button', handler:function(button, e) {
  var form = button.up('window').down('form').getForm();
  if (form.isValid()) {
    console.log(form.getValues());
    form.submit({success:function(form, action) {
      console.log(action);
      var response = Ext.JSON.decode(action.response.responseText);
      if (response.success) {
        Ext.Msg.alert('Successo', 'Inviate ' + response.sentmail + ' mail!');
      } else {
        Ext.Msg.alert('Errore', response.errors.reason);
      }
    }, failure:function(form, action) {
      switch(action.failureType) {
        case Ext.form.action.Action.CLIENT_INVALID:
          Ext.Msg.alert('Errore', 'Il form non pu\x26ograve; essere inviato con parametri non validi');
          break;
        case Ext.form.action.Action.CONNECT_FAILURE:
          Ext.Msg.alert('Errore', 'Errore di connessione');
          break;
        case Ext.form.action.Action.SERVER_INVALID:
          Ext.Msg.alert('Errore', action.result.msg);
      }
    }});
  } else {
    Ext.Msg.alert('Attenzione!', 'Completare i campi obbgligatori');
  }
}, dock:'bottom', text:'Invia'}], listeners:{afterrender:'onWindowAfterRender'}});
Ext.define('SIMFito.view.MainViewportViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.mainviewport'});
Ext.define('SIMFito.view.MainViewportViewController', {extend:Ext.app.ViewController, alias:'controller.mainviewport', onMainHeaderBeforeRender:function(component, eOpts) {
  var tipoUtente = localStore.getItem('TipoUtente');
  if (tipoUtente == '0' || tipoUtente == '1') {
    var titolo = '\x3cspan class\x3d"headerAdmin"\x3e' + component.getTitle() + ' (' + localStore.getItem('Nome') + ' - ' + localStore.getItem('TipoTecnicoDesc') + ')' + '\x3c/span\x3e';
    component.setTitle(titolo);
  } else {
    component.setTitle(component.getTitle() + ' (' + localStore.getItem('Nome') + ' - ' + localStore.getItem('TipoTecnicoDesc') + ')');
  }
}, onSchedeBeforeRender:function(component, eOpts) {
  var tipo_utente = localStore.getItem('TipoUtente');
  if (tipo_utente < 2) {
    Ext.getCmp('aggiungischeda').setHidden(true);
  }
  if (Number(tipo_utente) === 0) {
    Ext.getCmp('schedesettings').setHidden(false);
  }
}, onMapAfterRender:function(component, eOpts) {
  console.info('Initializating map');
  mapInit(0);
  if (firstTime) {
    component.up('tabpanel').setActiveTab('schede');
    Ext.getCmp('dettagli').setDisabled(true);
    firstTime = true;
  }
}, onMapResize:function(component, width, height, oldWidth, oldHeight, eOpts) {
  var size = [width, height];
  map.setSize(size);
}, onMainpanelBeforeRender:function(component, eOpts) {
  var WS = Ext.StoreManager.get('WarningsStore');
  WS.getProxy().setExtraParam('uid', localStore.getItem('ID'));
  WS.getProxy().setExtraParam('tuid', localStore.getItem('TipoUtente'));
  Ext.StoreMgr.get('RefertiStore').getProxy().setExtraParam('idTecnico', localStore.getItem('ID'));
  WS.on('load', function(store) {
    var nuovi = store.getProxy().getReader().metaData;
    Ext.getCmp('warnings').setText('Segnalazioni (' + nuovi + ')');
  });
  WS.load();
  Ext.StoreManager.get('UsersStore').getProxy().setExtraParam('requesterid', localStore.getItem('ID'));
  Ext.StoreMgr.get('ChangeLogStore').getProxy().setExtraParam('idTecnico', localStore.getItem('ID'));
  Ext.StoreMgr.get('ChangeLogStore').load(function(records, operation, success) {
    if (success) {
      if (records.length > 0) {
        if (!records[0].get('read')) {
          Ext.create('SIMFito.view.CLWindow').show();
        }
      }
    }
  });
  if (localStore.getItem('TipoUtente') * 1 >= 2) {
    Ext.StoreManager.get('DatasetTreeStore').getProxy().setExtraParams({url:urlPrefix + 'etc/dataset.json'});
    Ext.StoreManager.get('DatasetTreeStore').load();
    Ext.getCmp('report').setDisabled(false);
    Ext.getCmp('farmmerger').setDisabled(true);
    Ext.getCmp('farmmerger').setHidden(true);
    Ext.getCmp('farmtypemanager').setDisabled(true);
    Ext.getCmp('farmtypemanager').setHidden(true);
    Ext.getCmp('schedesettings').setDisabled(true);
    Ext.getCmp('schedesettings').setHidden(true);
    Ext.getCmp('mail').setHidden(true);
    Ext.getCmp('news').setHidden(true);
    Ext.getCmp('warnings').setHidden(true);
    Ext.getCmp('UEPest').setHidden(true);
    Ext.getCmp('ReportUEUfficiali').setHidden(true);
    Ext.getCmp('statistiche_laboratorio').setHidden(true);
  }
  if (localStore.getItem('TipoUtente') * 1 == 1) {
    Ext.StoreManager.get('DatasetTreeStore').getProxy().setExtraParams({url:urlPrefix + 'etc/dataset.json'});
    Ext.StoreManager.get('DatasetTreeStore').load();
    Ext.getCmp('report').setDisabled(false);
    Ext.getCmp('farmmerger').setDisabled(true);
    Ext.getCmp('farmmerger').setHidden(true);
    Ext.getCmp('farmtypemanager').setDisabled(true);
    Ext.getCmp('farmtypemanager').setHidden(true);
    Ext.getCmp('schedesettings').setDisabled(true);
    Ext.getCmp('schedesettings').setHidden(true);
    Ext.getCmp('mail').setHidden(true);
    Ext.getCmp('news').setHidden(true);
    Ext.getCmp('warnings').setHidden(false);
    Ext.getCmp('UEPest').setHidden(true);
    Ext.getCmp('prossimoCampione').setHidden(true);
    Ext.getCmp('statistiche_laboratorio').setHidden(true);
    Ext.getCmp('ReportUEUfficiali').setHidden(true);
  }
  if (localStore.getItem('TipoUtente') * 1 == 0) {
    Ext.StoreManager.get('DatasetTreeStore').getProxy().setExtraParams({url:urlPrefix + 'etc/dataset.json'});
    Ext.StoreManager.get('DatasetTreeStore').load();
    Ext.getCmp('report').setDisabled(false);
    Ext.getCmp('farmmerger').setDisabled(false);
    Ext.getCmp('farmmerger').setHidden(false);
    Ext.getCmp('farmtypemanager').setDisabled(false);
    Ext.getCmp('farmtypemanager').setHidden(false);
    Ext.getCmp('schedesettings').setDisabled(false);
    Ext.getCmp('schedesettings').setHidden(false);
    Ext.getCmp('mail').setHidden(false);
    Ext.getCmp('news').setHidden(false);
    Ext.getCmp('warnings').setHidden(false);
    Ext.getCmp('UEPest').setHidden(false);
    Ext.getCmp('statistiche_laboratorio').setHidden(false);
    Ext.getCmp('prossimoCampione').setHidden(true);
    Ext.getCmp('ReportUEUfficiali').setHidden(false);
    Ext.StoreMgr.get('UsersStore').on('load', function(store) {
      var nuoviUtenti = store.getProxy().getReader().metaData;
      Ext.getCmp('users').setText('Dati \x3cbr/\x3e Utenti (' + nuoviUtenti + ')');
    });
    Ext.StoreMgr.get('UsersStore').load();
  }
}, onMainpanelAfterRender:function(component, eOpts) {
}});
Ext.define('SIMFito.view.TrappolePanelViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.trappolepanel'});
Ext.define('SIMFito.view.TrappolePanelViewController', {extend:Ext.app.ViewController, alias:'controller.trappolepanel', onDatefieldRender:function(component, eOpts) {
}, onButtonBeforeRender:function(component, eOpts) {
  if (localStore.getItem('TipoUtente') == 0) {
    component.setDisabled(true);
  }
}, onDisegnaTrappoleButton12Toggle:function(button, pressed, eOpts) {
  if (pressed) {
    var userData = button.up('trappolepanel').userData;
    var extras = {gid_sito:userData.gid_sito};
    addInteraction('Point', 'newTrap', extras);
  } else {
    removeInteraction();
  }
}, onCheckboxfieldChangetp1:function(field, newValue, oldValue, eOpts) {
  map1.getLayers().array_[1].setVisible(newValue);
  map1.getLayers().array_[2].setVisible(newValue);
  map1.getLayers().array_[3].setVisible(newValue);
  Ext.getCmp('SIMFitoSliderTP').setValue(100);
}, onCheckboxfieldAfterRender:function(component, eOpts) {
  component.setValue(false);
  if (map1 != undefined) {
    map1.getLayers().array_[1].setVisible(false);
    map1.getLayers().array_[2].setVisible(false);
    map1.getLayers().array_[5].setVisible(false);
  }
  Ext.getCmp('SIMFitoSliderTP').setValue(100);
}, onSliderChange:function(slider, newValue, thumb, type, eOpts) {
  setAEOpacity(newValue);
}, onSliderAfterRender:function(component, eOpts) {
  component.setValue(100);
}, onGridpanelSelect:function(rowmodel, record, index, eOpts) {
  var xgeometry = record.get('geometry');
  var label = record.get('codice');
  if (xgeometry !== null && xgeometry !== '') {
    var geometry = Ext.util.JSON.decode(xgeometry);
    geometry.label = label;
    gExtent = addGeometry(id, geometry, false, 'trappole', 'map1');
  }
}, onGridpanelRowbodyClick:function(view, rowBodyEl, e, eOpts) {
  var xgeometry = record.get('geometry');
  var label = record.get('codice');
  if (xgeometry !== null && xgeometry !== '') {
    var geometry = Ext.util.JSON.decode(xgeometry);
    geometry.label = label;
    gExtent = addGeometry(id, geometry, true, 'trappole', 'map1');
  }
}, onMapAfterRender1:function(component, eOpts) {
  console.info('Initializating map1');
  mapInit(1);
}, onMapResize1:function(component, width, height, oldWidth, oldHeight, eOpts) {
  var size = [width, height];
  map1.setSize(size);
}, onTrappoleShow:function(component, eOpts) {
  map1.removeLayer(sitiLayer1);
  map1.removeLayer(trappoleLayer);
  map1.removeLayer(trappoleLayer_All);
  removeInteraction('map1');
  var gid = Ext.StoreMgr.get('TrapStore').getProxy().getExtraParams().gid;
  Ext.Ajax.request({url:'services/ajax.php?mode\x3dbounds2\x26shp\x3dsiti\x26idfield\x3dgid\x26id\x3d' + gid, timeout:1000000, success:function(response, opts) {
    var obj = Ext.decode(response.responseText);
    if (obj.results > 0) {
      var tBbox = obj.data[0];
      var Bbox = [tBbox.xmin * 1, tBbox.ymin * 1, tBbox.xmax * 1, tBbox.ymax * 1];
      Ext.getCmp('zoomtrappole').setDisabled(false);
      map1.getView().fit(Bbox, map1.getSize());
      component.userData.tbbox = Bbox;
      component.setTitle('Nuova trappola per ' + component.userData.sito + ' (' + component.userData.azienda + ')');
      Ext.getCmp('trapSuptot').setValue(Number(tBbox.superficie));
    }
  }, faillure:function(response, opts) {
    Ext.Msg.alert('Errore', 'Il server ha risponso con status code: ' + response.status);
  }});
  Ext.Ajax.request({url:'services/ajax.php?mode\x3dscheda\x26schedaid\x3d' + component.userData.idScheda, timeout:1000000, success:function(response, opts) {
    var obj = Ext.decode(response.responseText);
    if (obj.results > 0) {
      var scheda = obj.data[0];
      console.log(obj);
      Ext.getCmp('trappoladataposizione').setValue(scheda.data_sopralluogo);
    }
  }, faillure:function(response, opts) {
    Ext.Msg.alert('Errore', 'Il server ha risponso con status code: ' + response.status);
  }});
  trappoleLayer = new ol.layer.Tile({visible:true, source:new ol.source.TileWMS({url:wmsUrl, params:{'LAYERS':'simfito:trappole', 'TILED':true, 'VIEWPARAMS':'gid:' + gid}, serverType:'geoserver'}), title:'trappole'});
  sitiLayer1 = new ol.layer.Tile({visible:true, source:new ol.source.TileWMS({url:wmsUrl, params:{'LAYERS':'simfito:siti_bygid', 'TILED':true, 'VIEWPARAMS':'gid:' + gid}, serverType:'geoserver'}), title:'siti'});
  trappoleLayer_All = new ol.layer.Tile({visible:true, source:new ol.source.TileWMS({url:wmsUrl, params:{'LAYERS':'simfito:trappole_all', 'TILED':true}, serverType:'geoserver'}), title:'trappole'});
  map1.on('singleclick', function(evt) {
  });
  Ext.getCmp('idsito').setValue(gid);
  Ext.getCmp('trapSchedaId').setValue(component.userData.idScheda);
  map1.addLayer(trappoleLayer);
  map1.addLayer(sitiLayer1);
  map1.addLayer(trappoleLayer_All);
}, onTrappoleAfterRender:function(component, eOpts) {
  var xgeometry = component.userData.geometry;
  var azienda = component.userData.azienda;
  var sito = component.userData.sito;
  var label = azienda + '\n' + sito;
  var id = component.userData.idScheda;
  console.log(xgeometry);
  if (xgeometry !== null && xgeometry !== '') {
    var geometry = Ext.util.JSON.decode(xgeometry);
    geometry.label = label;
    gExtent = addGeometry2(id, geometry, true, 'siti', 'map1');
  }
}, onTrappoleDeactivate:function(component, eOpts) {
  var fieldList = ['trapNome', 'trapId', 'trapHost', 'trapSuprap', 'trapPest', 'trapErogatore', 'trapUnitrap', 'trapTempo'];
  for (var i in fieldList) {
    Ext.getCmp(fieldList[i]).reset();
  }
  removeInteraction('map1');
  addInteraction('Point', 'newTrap');
  Ext.getCmp('zoomtrappola').setDisabled(true);
  Ext.getCmp('trappole').setTitle('Trappole');
  Ext.getCmp('trappole').setDisabled('true');
  Ext.getCmp('mainpanel').setActiveItem('dettagli');
}, onTrappoleBeforeDestroy:function(component, eOpts) {
  map1.removeLayer(sitiLayer1);
  map1.removeLayer(trappoleLayer);
  map1.removeLayer(trappoleLayer_All);
}});
Ext.define('SIMFito.view.TrappolePanel', {extend:Ext.panel.Panel, alias:'widget.trappolepanel', controller:'trappolepanel', viewModel:{type:'trappolepanel'}, disabled:true, id:'trappole', layout:'border', iconCls:'page_full', title:'Trappole', items:[{xtype:'container', flex:1, region:'center', split:false, flex:1, id:'maintrappolecontainer', scrollable:true, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'form', flex:2, flex:2, id:'nuovositoform2', minHeight:550, scrollable:true, bodyPadding:10, 
standardSubmit:false, url:'services/ajax-save-form.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldcontainer', flex:1, minHeight:300, scrollable:true, defaults:{labelAlign:'top', bodyPadding:10}, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'fieldcontainer', flex:1, margin:5, scrollable:true, fieldDefaults:{labelAlign:'top'}, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'textfield', id:'trapNome', tabIndex:1, fieldLabel:'Codifica interna', name:'nome', allowBlank:false, 
allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio'}, {xtype:'combobox', id:'trapId', tabIndex:3, fieldLabel:'Tipo', msgTarget:'under', name:'id', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', displayField:'descrizione', hiddenName:'id', store:'TipotrappoleStore', valueField:'id'}, {xtype:'combobox', id:'trapHost', tabIndex:5, fieldLabel:'Pianta Ospite Associata', msgTarget:'under', name:'host', allowBlank:false, 
allowOnlyWhitespace:false, blankText:'Campo Obbligatorio', emptyText:'Digitare almento 4 lettere e SELEZIONARE!', hideTrigger:true, displayField:'name', forceSelection:true, store:'PlantStore', valueField:'b_code'}, {xtype:'numberfield', id:'trapSuprap', tabIndex:7, fieldLabel:'Superficie Rappresentativa', msgTarget:'under', name:'suprap', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', allowDecimals:false, allowExponential:false, decimalPrecision:0, 
minValue:0}, {xtype:'datefield', id:'trappoladataposizione', fieldLabel:'Data di posizionamento', name:'datacreazione', readOnly:true, format:'d/m/Y', submitFormat:'Y-m-d H:i', listeners:{render:'onDatefieldRender'}}]}, {xtype:'fieldcontainer', flex:1, margin:5, scrollable:true, fieldDefaults:{labelAlign:'top'}, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', id:'trapPest', tabIndex:2, fieldLabel:'Trappola per', msgTarget:'under', name:'organismo', blankText:'Campo Obbligatorio', 
emptyText:'Digitare almeno 4 lettere e SELEZIONARE!', hideTrigger:true, displayField:'full_name', forceSelection:true, store:'TrapreferenceStore', typeAhead:true, valueField:'b_code'}, {xtype:'numberfield', id:'trapErogatore', tabIndex:4, fieldLabel:'Durata erogatore [gg]', msgTarget:'under', name:'durata_erogatore', allowDecimals:false, allowExponential:false, decimalPrecision:0, minValue:0}, {xtype:'numberfield', id:'trapSuptot', tabIndex:6, fieldLabel:'Superficie Totale', msgTarget:'under', name:'suptot', 
allowBlank:false, allowOnlyWhitespace:false, emptyText:'Campo obbligatorio', allowDecimals:false, allowExponential:false, decimalPrecision:0, minValue:0}, {xtype:'numberfield', id:'trapUnitrap', tabIndex:8, fieldLabel:'Unit\x26agrave; Rappresentativa', msgTarget:'under', name:'unitrap', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Cmapo obbligatorio', allowDecimals:false, allowExponential:false, minValue:0}, {xtype:'numberfield', validator:function(value) {
  var uid = localStore.getItem('ID');
  var originalValue = this.originalValue;
  var toReturn = false;
  var date = Ext.getCmp('trappoladataposizione').getValue();
  Ext.Ajax.request({url:'services/ajax.php', params:{mode:'temporesiduo2', idtecnico:uid, data:date}, async:false, method:'POST', success:function(response, opts) {
    var obj = Ext.util.JSON.decode(response.responseText);
    if (obj.success) {
      var residuo = Number(obj.data[0].residuo) + Number(originalValue);
      if (residuo - value >= 0) {
        toReturn = true;
      } else {
        toReturn = 'Restano solo ' + residuo + ' disponibili.';
      }
    } else {
      toReturn = 'Errore: ' + obj.errors.reason;
    }
  }, failure:function(form, action) {
    switch(action.failureType) {
      case Ext.form.action.Action.CLIENT_INVALID:
        Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
        break;
      case Ext.form.action.Action.CONNECT_FAILURE:
        Ext.Msg.alert('Failure', 'Ajax communication failed');
        break;
      case Ext.form.action.Action.SERVER_INVALID:
        Ext.Msg.alert('Failure', action.result.errors.reason);
        break;
    }
  }});
  return toReturn;
}, id:'trapTempo', tabIndex:9, fieldLabel:'Tempo impiegato [minuti x uomo]', msgTarget:'under', name:'tempo', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo Obbligatorio', emptyText:'Campo Obbligatorio', allowDecimals:false, allowExponential:false, decimalPrecision:0, minValue:1}]}]}, {xtype:'hiddenfield', id:'userid2', name:'userId'}, {xtype:'hiddenfield', id:'idsito', name:'idsito'}, {xtype:'hiddenfield', name:'fase', value:'trappola'}, {xtype:'hiddenfield', flex:1, id:'trapSchedaId', 
name:'schedaid'}, {xtype:'hiddenfield', id:'geometry2', name:'geometry'}], dockedItems:[{xtype:'toolbar', flex:1, dock:'top', scrollable:true, items:[{xtype:'button', handler:function(button, e) {
  var bbox = Ext.getCmp('trappole').userData.tbbox;
  map1.getView().fit(bbox, map1.getSize());
}, disabled:true, id:'zoomtrappole', text:'Zoom sulle Trappole'}, {xtype:'button', handler:function(button, e) {
  var extent = features1.getArray()[0].getGeometry().getExtent();
  map1.getView().fit(extent, map1.getSize());
}, disabled:true, id:'zoomtrappola', text:'Zoom sulla Trappola'}, {xtype:'button', handler:function(button, e) {
  var userData = button.up('trappolepanel').userData;
  var extras = {gid_sito:userData.gid_sito};
  removeInteraction('map1');
  addInteraction('Point', 'newTrap', extras);
  Ext.getCmp('zoomtrappola').setDisabled(true);
  button.setDisabled(true);
}, disabled:true, id:'ridisegnatrappola', text:'Ridisegna Trappola'}, {xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  mapLayer = map1.getLayers().array_;
  for (var i in mapLayer) {
    if (typeof mapLayer[i].getSource().getParams == 'function') {
      if (mapLayer[i].getSource().getParams().LAYERS == 'simfito:trappole_all') {
        mapLayer[i].setVisible(!mapLayer[i].getVisible());
      }
    }
  }
}, text:'Mostra/Nascondi tutte'}, {xtype:'button', handler:function(button, e) {
  var uid = localStore.getItem('ID');
  var scheda = button.up('#trappole').userData.idScheda;
  Ext.Ajax.request({url:'services/ajax.php', params:{mode:'temporesiduo', idtecnico:uid, idscheda:scheda}, method:'POST', success:function(response, opts) {
    var obj = Ext.util.JSON.decode(response.responseText);
    if (obj.success) {
      var text = 'Tempo residuo  per il ' + obj.data[0].data + ': \x3cb\x3e' + obj.data[0].residuo + 'min.\x3c/b\x3e';
      Ext.Msg.alert('Tempo Residuo', text);
    } else {
      Ext.Msg.alert('Errore', obj.errors.reason);
    }
  }, failure:function(form, action) {
    switch(action.failureType) {
      case Ext.form.action.Action.CLIENT_INVALID:
        Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
        break;
      case Ext.form.action.Action.CONNECT_FAILURE:
        Ext.Msg.alert('Failure', 'Ajax communication failed');
        break;
      case Ext.form.action.Action.SERVER_INVALID:
        Ext.Msg.alert('Failure', action.result.errors.reason);
        break;
    }
  }});
}, iconCls:'fas fa-stopwatch', text:'Valuta Tempo Residuo', listeners:{beforerender:'onButtonBeforeRender'}}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/trappole.html#nuovatrappolatrappole', 'Help');
}, iconCls:'help'}]}, {xtype:'toolbar', flex:1, dock:'top', scrollable:true, items:[{xtype:'button', itemId:'mybutton12', enableToggle:true, text:'Posiziona Trappola Manualmente', listeners:{toggle:'onDisegnaTrappoleButton12Toggle'}}, {xtype:'splitter'}, {xtype:'checkboxfield', boxLabel:'AE Layer', listeners:{change:'onCheckboxfieldChangetp1', afterrender:'onCheckboxfieldAfterRender'}}, {xtype:'slider', id:'SIMFitoSliderTP', width:300, fieldLabel:'Opacità layer agenzia delle entrate', value:100, 
listeners:{change:'onSliderChange', afterrender:'onSliderAfterRender'}}]}, {xtype:'toolbar', flex:1, dock:'top', scrollable:true, items:[{xtype:'label', text:'Aiuto al posizionamento: '}, {xtype:'tbfill'}, {xtype:'numberfield', id:'X2', width:150, fieldLabel:'X (o Longitudine)', labelAlign:'top', submitValue:false, allowExponential:false, decimalPrecision:4, decimalSeparator:'.'}, {xtype:'numberfield', id:'Y2', width:150, fieldLabel:'Y (o Latitudine)', labelAlign:'top', submitValue:false, allowExponential:false, 
decimalPrecision:4, decimalSeparator:'.'}, {xtype:'combobox', id:'prjstore2', width:150, fieldLabel:'Proiezione', labelAlign:'top', submitValue:false, autoLoadOnValue:true, displayField:'title', store:'userPrjStore', valueField:'srs'}, {xtype:'button', handler:function(button, e) {
  var errorMsg = null;
  var x = Ext.getCmp('X2');
  var y = Ext.getCmp('Y2');
  var prj = Ext.getCmp('prjstore2');
  if (x.getValue() === null || x.getValue() === '') {
    errorMsg = 'Inserire la coordinata x';
  }
  if (y.getValue() === null || y.getValue() === '') {
    if (errorMsg === null) {
      errorMsg = 'Inserire la cooradinata y';
    } else {
      errorMsg += ', la coordinata y';
    }
  }
  if (prj.getValue() === null || prj.getValue() === '') {
    if (errorMsg === null) {
      errorMsg = 'Scegliere la proiezione in cui sono state espresse le coordinate';
    } else {
      errorMsg += ' e scegliere la proiezione in cui sono state espresse le coordinate';
    }
  }
  if (errorMsg !== null) {
    errorMsg += '. Quindi riprovare.';
  }
  if (errorMsg === null) {
    var point = ol.proj.transform([x.getValue(), y.getValue()], prj.getValue(), map.getView().getProjection().getCode());
    var iconFeature = new ol.Feature({geometry:new ol.geom.Point(point), name:'Punto inserito'});
    var iconStyle = new ol.style.Style({image:new ol.style.Icon({anchor:[0.5, 46], anchorXUnits:'fraction', anchorYUnits:'pixel', src:'resources/icons/24x24/map_pin.png'})});
    iconFeature.setStyle(iconStyle);
    markerLayer1.getSource().clear();
    markerLayer1.getSource().addFeature(iconFeature);
    map1.getView().animate({center:point, zoom:16, duration:200});
    var msg = 'Questo strumento serve solo a visualizzare il punto relativo alle coordinate inserite. ';
    msg += '\x3cbr/\x3e\x3cb\x3eIl punto relativo alla trappola andr\x26agrave;, comunque, poiszionata manualmente!!\x3c/b\x3e\x3cbr/\x3eGrazie.';
    Ext.Msg.alert('ATTENZIONE', msg);
  } else {
    Ext.Msg.alert('Attenzione', errorMsg);
  }
}, text:'Centra'}, {xtype:'button', handler:function(button, e) {
  markerLayer1.getSource().clear();
}, text:'Elimina Marker'}]}, {xtype:'toolbar', flex:1, dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  Ext.getCmp('userid2').setValue(localStore.getItem('ID'));
  var form = button.up('form').getForm();
  if (features1.getArray()[0] !== undefined) {
    var geoJson = feat2GeoJson(features1.getArray()[0]);
    Ext.getCmp('geometry2').setValue(Ext.util.JSON.encode(geoJson));
    if (form.isValid()) {
      form.submit({method:'POST', waitTitle:'Connessione in corso', waitMsg:'Invio informazioni', success:function(form, action) {
        obj = Ext.util.JSON.decode(action.response.responseText);
        var success = obj.success;
        if (success) {
          trappoleLayer.getSource().updateParams({'time':Date.now()});
          var fieldList = ['trapNome', 'trapId', 'trapHost', 'trapSuprap', 'trapPest', 'trapErogatore', 'trapUnitrap', 'trapTempo'];
          for (var i in fieldList) {
            Ext.getCmp(fieldList[i]).reset();
          }
          removeInteraction('map1');
          addInteraction('Point', 'newTrap');
          Ext.getCmp('zoomtrappola').setDisabled(true);
          Ext.getCmp('trappole').setTitle('Trappole');
          Ext.getCmp('trappole').setDisabled('true');
          Ext.getCmp('mainpanel').setActiveItem('dettagli');
          Ext.Msg.alert('Info', 'Inserimento avvenuto con successo. Verificare l\x26apos;elenco delle trappole ed, eventualmente, usare l\x26apos;apposito pulsante per ricaricare la lista. Grazie');
          Ext.StoreMgr.get('TrapStore').reload();
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore', obj.errors.reason);
        } else {
          Ext.Msg.alert('Errore', 'Server non raggiungibile: ' + action.response.responseText);
        }
      }});
    }
  } else {
    Ext.Msg.alert('Info', 'Disegnare un punto! Grazie.');
  }
}, formBind:true, text:'Salva'}, {xtype:'button', handler:function(button, e) {
  var fieldList = ['trapNome', 'trapId', 'trapHost', 'trapSuprap', 'trapPest', 'trapErogatore', 'trapUnitrap', 'trapTempo'];
  for (var i in fieldList) {
    Ext.getCmp(fieldList[i]).reset();
  }
  removeInteraction('map1');
  addInteraction('Point', 'newTrap');
  Ext.getCmp('zoomtrappola').setDisabled(true);
  Ext.getCmp('trappole').setTitle('Trappole');
  Ext.getCmp('trappole').setDisabled('true');
  Ext.getCmp('mainpanel').setActiveItem('dettagli');
}, text:'Annulla'}]}]}, {xtype:'gridpanel', flex:1, flex:2, hidden:true, id:'trappoleallgrid', minHeight:300, scrollable:true, title:'Trappole', autoLoad:true, store:'TrapStore', columns:[{xtype:'numbercolumn', flex:1, dataIndex:'id', text:'Id', tooltip:'Id', format:'0'}, {xtype:'gridcolumn', flex:4, dataIndex:'codice', text:'Codice', tooltip:'Codice'}, {xtype:'gridcolumn', flex:5, dataIndex:'nome', text:'Codifica interna', tooltip:'Codifica Interna'}, {xtype:'datecolumn', flex:3, dataIndex:'datacreazione', 
text:'Posizionamento', tooltip:'Posizionamento', format:'d/m/Y'}, {xtype:'datecolumn', flex:3, dataIndex:'datavariazione', text:'Ultima modifica', tooltip:'Ultima Modifica', format:'d/m/Y'}, {xtype:'gridcolumn', flex:2, dataIndex:'stato', text:'Stato', tooltip:'Stato'}, {xtype:'gridcolumn', flex:3, dataIndex:'tecnico', text:'Tecnico posizionamento', tooltip:'Tecnico posizionamento'}, {xtype:'actioncolumn', text:'Azioni', items:[{handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('id');
  Ext.MessageBox.show({title:'ELIMINAZIONE TRAPPOLA ID: ' + id, message:'\x3cb\x3eATTENZIONE la trappola verrà definitivamente cancellata\x3c/b\x3e. Per rimuoverla solo utilizare il pulsante rimuovi.', buttons:Ext.Msg.OKCANCEL, icon:Ext.Msg.QUESTION, fn:function(btn, opt) {
    var idtecnico = localStore.getItem('ID');
    var patt = /^\d+$/;
    if (btn == 'ok') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'cancella-trappola', id:id, tecnicoid:idtecnico}, success:function(resp) {
        var obj = Ext.util.JSON.decode(resp.responseText);
        if (obj.success) {
          trappoleLayer.getSource().updateParams({'time':Date.now()});
          Ext.StoreMgr.get('TrapStore').reload();
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore!', obj.errors.reason);
        } else {
          Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
        }
      }});
    }
  }});
}, iconCls:'delete', tooltip:'Elimina'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('id');
  Ext.MessageBox.prompt('Conferma', 'Prima di confermare la rimozione inserire il tempo impiegato in minuti', function(btn, tempo, opt) {
    var idtecnico = localStore.getItem('ID');
    var patt = /^\d+$/;
    if (patt.test(tempo)) {
      if (btn == 'ok') {
        Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'rimuovi-trappola', id:id, tecnicoid:idtecnico, tempo:tempo}, success:function(resp) {
          var obj = Ext.util.JSON.decode(resp.responseText);
          if (obj.success) {
            trappoleLayer.getSource().updateParams({'time':Date.now()});
            Ext.StoreMgr.get('TrapStore').reload();
          } else {
            Ext.Msg.alert('Errore', obj.errors.reason);
          }
        }, failure:function(form, action) {
          if (action.failureType == 'server') {
            obj = Ext.util.JSON.decode(action.response.responseText);
            Ext.Msg.alert('Errore!', obj.errors.reason);
          } else {
            Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
          }
        }});
      }
    } else {
      Ext.Msg.alert('Errore', tempo + ' non \x26egrave; valido! Riprovare inserendo un numero intero!');
    }
  });
}, isDisabled:function(view, rowIndex, colIndex, item, record) {
  var disabled = record.get('stato_id') === 0 ? false : true;
  return disabled;
}, iconCls:'delete1', tooltip:'Rimuovi'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  Ext.create('SIMFito.view.CodeWindow', {userData:{codice:record.get('codice')}}).show();
}, iconCls:'barcode', tooltip:'Mostra Codice'}, {isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  var disabled = record.get('stato_id') === 0 || record.get('mainpest') == 'N/A' ? true : false;
  return disabled;
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('id');
  Ext.MessageBox.prompt('Conferma', 'Prima di confermare il riutilizzo inserire il tempo impiegato in minuti', function(btn, tempo, opt) {
    var idtecnico = localStore.getItem('ID');
    var patt = /^\d+$/;
    if (patt.test(tempo)) {
      if (btn == 'ok') {
        var idtecnico = localStore.getItem('ID');
        Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'riusa-trappola', id:id, tecnicoid:idtecnico, tempo:tempo}, success:function(resp) {
          var obj = Ext.util.JSON.decode(resp.responseText);
          if (obj.success) {
            trappoleLayer.getSource().updateParams({'time':Date.now()});
            Ext.StoreMgr.get('AllTrapStore').reload();
          } else {
            Ext.Msg.alert('Errore', obj.errors.reason);
          }
        }, failure:function(form, action) {
          if (action.failureType == 'server') {
            obj = Ext.util.JSON.decode(action.response.responseText);
            Ext.Msg.alert('Errore!', obj.errors.reason);
          } else {
            Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
          }
        }});
      }
    }
  });
}, iconCls:'refresh', tooltip:'Riutilizza'}]}], listeners:{select:'onGridpanelSelect', rowbodyclick:'onGridpanelRowbodyClick'}}]}, {xtype:'panel', flex:1, region:'west', split:true, html:'\x3cdiv id\x3d"myMap1"\x3e\x3c/div\x3e', id:'map1', layout:'fit', collapsible:true, frameHeader:false, header:false, listeners:{afterrender:'onMapAfterRender1', resize:'onMapResize1'}}], listeners:{show:'onTrappoleShow', afterrender:'onTrappoleAfterRender', deactivate:'onTrappoleDeactivate', beforedestroy:'onTrappoleBeforeDestroy'}});
Ext.define('SIMFito.view.TrappolePanelViewModel1', {extend:Ext.app.ViewModel, alias:'viewmodel.reportpanel'});
Ext.define('SIMFito.view.TrappolePanelViewController1', {extend:Ext.app.ViewController, alias:'controller.reportpanel', onMapAfterRender1:function(component, eOpts) {
  console.info('Initializating map1');
  mapInit(2);
  var store = Ext.StoreManager.get('DatasetTreeStore');
  if (store.isLoaded()) {
    store.each(function(record, index) {
      record.eachChild(function(newChild) {
        extractLayer(newChild);
      });
    });
    var root = store.getRoot();
    if (!root.isExpanded()) {
      root.expand();
    }
  } else {
    console.log('DataTreeStore not loaded');
  }
}, onMapResize1:function(component, width, height, oldWidth, oldHeight, eOpts) {
  var size = [width, height];
  map2.setSize(size);
}, onTreepanelCheckChange:function(node, checked, e, eOpts) {
  var title = node.get('text');
  var id = node.get('idx');
  var lay = layersList[node.get('id')];
  if (lay.get('baseLayer')) {
    var chkd = Ext.getCmp('layersTree').getChecked();
    for (var i in chkd) {
      if (chkd[i].data.baseLayer != undefined) {
        chkd[i].set('checked', false);
      }
    }
    for (var i in layersList) {
      if (layersList[i].get('baseLayer')) {
        layersList[i].setVisible(false);
      }
    }
    node.set('checked', checked);
  } else {
    if (checked) {
      legendAdd(lay, title, id);
    } else {
      legendRemove(lay, id);
    }
  }
  lay.setVisible(checked);
}, onLayersTreeSelect:function(rowmodel, record, index, eOpts) {
  var layId = record.get('id');
  var lay = layersList[layId];
  if (lay != undefined) {
    if (record.get('extras') != undefined) {
      lay.extras = record.get('extras');
    }
    selectedLayer = lay;
  } else {
    selectedLayer = null;
  }
}, onSliderAfterRender:function(component, eOpts) {
  component.setValue(100);
}, onSliderChange:function(slider, newValue, thumb, type, eOpts) {
  if (selectedLayer == null) {
    Ext.Msg.alert('Attenzione!', 'Selezionare il layer!');
  } else {
    selectedLayer.setOpacity(newValue / 100);
  }
}, onMytabpanel1AfterRender:function(component, eOpts) {
  if (localStore.getItem('TipoUtente') * 1 == 0) {
    Ext.getCmp('SIMFitoAreeUfficiali').setDisabled(false);
    Ext.getCmp('SIMFitoAreeSalvate').setDisabled(false);
    Ext.getCmp('SIMFitoDisegnaAreeUfficiali').setDisabled(false);
  } else {
    Ext.getCmp('SIMFitoAreeUfficiali').setDisabled(true);
    Ext.getCmp('SIMFitoAreeSalvate').setDisabled(true);
    Ext.getCmp('SIMFitoDisegnaAreeUfficiali').setDisabled(true);
  }
}});
Ext.define('SIMFito.view.ReportPanel', {extend:Ext.panel.Panel, alias:'widget.reportpanel', controller:'reportpanel', viewModel:{type:'reportpanel'}, disabled:true, id:'report', layout:'border', iconCls:'page_full', title:'Cartografia', items:[{xtype:'panel', flex:2, region:'west', split:true, html:'\x3cdiv id\x3d"myMap2"\x3e\x3c/div\x3e', id:'map3', layout:'fit', collapsible:true, frameHeader:false, header:false, listeners:{afterrender:'onMapAfterRender1', resize:'onMapResize1'}}, {xtype:'tabpanel', 
flex:1, region:'center', itemId:'mytabpanel1', activeTab:0, dockedItems:[{xtype:'toolbar', dock:'top', scrollable:true, items:[{xtype:'button', text:'Elaborazione Mappe', menu:{xtype:'menu', items:[{xtype:'menuitem', handler:function(item, e) {
  var win = Ext.create('SIMFito.view.PerParassitaWindow');
  win.inizialize();
  win.show();
}, text:'Buffers per parassiti'}, {xtype:'menuseparator', text:'Menu Item'}, {xtype:'menuitem', handler:function(item, e) {
  var win = Ext.create('SIMFito.view.PresenzaparassitiWindow');
  win.inizialize();
  win.show();
}, text:'Punti monitorati per parassita'}, {xtype:'menuseparator', text:'Menu Item'}, {xtype:'menuitem', handler:function(item, e) {
  var win = Ext.create('SIMFito.view.PresenzaparassitiWindow4');
  win.inizialize();
  win.show();
}, text:'Punti monitorati con parassita presente'}, {xtype:'menuitem', handler:function(item, e) {
  var win = Ext.create('SIMFito.view.PresenzaparassitiWindow1');
  win.inizialize();
  win.show();
}, text:'Parassiti per Comune'}, {xtype:'menuitem', handler:function(item, e) {
  var win = Ext.create('SIMFito.view.PresenzaparassitiWindow2');
  win.inizialize();
  win.show();
}, text:'Parassiti Con Area d\x26apos;incidenza'}, {xtype:'menuitem', handler:function(item, e) {
  var win = Ext.create('SIMFito.view.PresenzaparassitiWindow3');
  win.inizialize();
  win.show();
}, text:'Parassiti con Incidenza Comunale'}, {xtype:'menuseparator', text:'Menu Item'}, {xtype:'menuitem', handler:function(item, e) {
  var win = Ext.create('SIMFito.view.PresenzaparassitiWindow5');
  win.inizialize();
  win.show();
}, hidden:true, text:'Trappole'}, {xtype:'menuitem', handler:function(item, e) {
  var win = Ext.create('SIMFito.view.TrappolePosizionateNelWindow');
  win.inizialize();
  win.show();
}, text:'Trappole posizionate'}, {xtype:'menuitem', handler:function(item, e) {
  var win = Ext.create('SIMFito.view.TrappoleAttiveNelWindow');
  win.inizialize();
  win.show();
}, text:'Trappole attive in un periodo'}, {xtype:'menuitem', handler:function(item, e) {
  var win = Ext.create('SIMFito.view.TrappolealWindow');
  win.inizialize();
  win.show();
}, text:'Trappole attive alla data'}, {xtype:'menuitem', handler:function(item, e) {
  var win = Ext.create('SIMFito.view.ParassitaCatturatoNelWindow');
  win.inizialize();
  win.show();
}, text:'Parassita catturato nel periodo'}]}}, {xtype:'button', toggleHandler:function(button, state) {
  if (state) {
    var layer = selectedLayer;
    if (layer != null) {
      var params = layer.getSource().getParams();
      if (params.LAYERS == 'simfito:simbuffer') {
        button.setText('Salva/Annulla Disegno');
        if (typeof draw2 != 'undefined') {
          removeInteraction('map2');
        }
        if (layer.extras != undefined) {
          addInteraction('Polygon', 'areaBuffer', Ext.JSON.decode(layer.extras));
        } else {
          addInteraction('Polygon', 'areaBuffer');
        }
      } else {
        Ext.Msg.alert('Attenzione', 'Il layer selezionato non pu\x26ograve; essere usato allo scopo');
        button.toggle(false);
      }
    } else {
      Ext.Msg.alert('Attenzione', 'Selezionare un layer');
      button.toggle(false);
    }
  } else {
    if (typeof draw2 != 'undefined') {
      if (draw2.features_.getArray().length > 0) {
        var geoJson = feats2GeoJson(draw2.features_.getArray());
        var layer = selectedLayer;
        var params = layer.getSource().getParams();
        var vector = geoJson;
        var vector = Ext.JSON.encode(geoJson);
        Ext.create('SIMFito.view.delimitazioneWindow1', {params:params, vector:vector}).show();
      } else {
        removeInteraction('map2');
      }
    }
    button.setText('Disenga Delimitazione');
  }
}, id:'SIMFitoDisegnaAreeUfficiali', enableToggle:true, text:'Disegna Delimitazione', toggleGroup:'map2Report'}, {xtype:'button', handler:function(button, e) {
  var layer = selectedLayer;
  if (layer != null) {
    var params = layer.getSource().getParams();
    if (params.LAYERS == 'simfito:simbuffer') {
      var pp = Ext.JSON.encode(params);
      Ext.create('SIMFito.view.delimitazioneWindow', {params:params}).show();
    } else {
      Ext.Msg.alert('Attenzione', 'Il layer selezionato non pu\x26ograve; essere usato allo scopo');
    }
  } else {
    Ext.Msg.alert('Attenzione', 'Selezionare un layer');
  }
}, id:'SIMFitoAreeUfficiali', text:'Delimitazione aree ufficiali'}, {xtype:'tbfill'}]}], items:[{xtype:'panel', layout:'fit', title:'Layers', items:[{xtype:'treepanel', id:'layersTree', scrollable:true, width:150, autoLoad:true, store:'DatasetTreeStore', viewConfig:{itemId:'mytreeview1'}, listeners:{checkchange:'onTreepanelCheckChange', select:'onLayersTreeSelect'}}], dockedItems:[{xtype:'toolbar', dock:'bottom', scrollable:true, items:[{xtype:'button', toggleHandler:function(button, state) {
  if (state) {
    map2Info = true;
  } else {
    map2Info = false;
  }
}, enableToggle:true, iconCls:'fad fa-info', text:'Info', toggleGroup:'nemo'}, {xtype:'button', toggleHandler:function(button, state) {
  if (state) {
    if (typeof draw2M != 'undefined') {
      removeInteraction('map2');
    }
    addInteraction('LineString', 'lenght');
  } else {
    if (typeof draw2M != 'undefined') {
      removeInteraction('map2', 'lenght');
    }
  }
}, enableToggle:true, iconCls:'fad fa-info', text:'Misura', toggleGroup:'map2Report'}, {xtype:'slider', width:300, fieldLabel:'Opacità', value:100, listeners:{afterrender:'onSliderAfterRender', change:'onSliderChange'}}, {xtype:'button', handler:function(button, e) {
  if (selectedLayer == null) {
    Ext.Msg.alert('Attenzione!', 'Selezionare il layer da scaricare!');
  } else {
    var typeName = selectedLayer.getSource().getParams().LAYERS;
    var viewParams = selectedLayer.getSource().getParams().viewparams;
    var fileName = selectedLayer.getSource().getParams().title.toLowerCase();
    fileName = fileName.replace(/ /g, '_');
    var url = wfsUrl + '?version\x3d1.0.0\x26request\x3dGetFeature\x26typeNames\x3d' + typeName + '\x26outputFormat\x3dshape-zip\x26viewParams\x3d' + viewParams + '\x26format_options\x3dfilename:' + fileName + '.zip';
    window.open(url, '_blank');
  }
}, iconCls:'cloud_download', text:'Scarica'}, {xtype:'button', handler:function(button, e) {
  var printParameters;
  var extent = map2.getView().calculateExtent(map2.getSize());
  var epsg = map2.getView().getProjection().getCode();
  var layers = map2.getLayers().getArray();
  var ll = [];
  var url = urlPrefix + 'services/export.php?mode\x3dprint\x26data\x3d';
  for (var i in layers) {
    if (layers[i].getProperties().visible) {
      if (!layers[i].getProperties().baseLayer) {
        var laySource = layers[i].getSource();
        ll.push({url:laySource.getUrls()[0], params:laySource.getParams()});
      }
    }
  }
  printParameters = {extent:extent, epsg:epsg, layers:ll};
  url += Ext.JSON.encode(printParameters);
  window.open(url, '_blnak');
}, iconCls:'printer', text:'Stampa'}]}]}, {xtype:'panel', layout:'fit', title:'Legende', items:[{xtype:'dataview', itemTpl:['\x3cdiv style\x3d"margin: 10px;" class\x3d"thumb-wrap"\x3e \x3cspan\x3e{caption}\x3c/span\x3e\x3cbr/\x3e \x3cimg src\x3d"{src}" /\x3e \x3c/div\x3e'], store:'LegendsStore'}]}, {xtype:'panel', id:'SIMFitoAreeSalvate', scrollable:true, title:'Aree Salvate', items:[{xtype:'gridpanel', itemId:'mygridpanel3', scrollable:true, autoLoad:true, store:'AreasStore', columns:[{xtype:'numbercolumn', 
width:60, dataIndex:'id', text:'Id', format:'000', filter:{type:'number'}}, {xtype:'gridcolumn', flex:1, dataIndex:'name', text:'Nome', filter:{type:'string'}}, {xtype:'datecolumn', dataIndex:'datefrom', text:'Dal', format:'d/m/Y', filter:{type:'date'}}, {xtype:'datecolumn', dataIndex:'dateto', text:'Al', format:'d/m/Y', filter:{type:'date'}}, {xtype:'numbercolumn', hidden:true, width:60, dataIndex:'tampone', text:'Tampone', format:'000'}, {xtype:'numbercolumn', hidden:true, width:60, dataIndex:'area_user_tampone', 
text:'Conteminemto', format:'000'}, {xtype:'gridcolumn', flex:1, dataIndex:'pest', text:'Parassita', filter:{type:'list'}}, {xtype:'gridcolumn', flex:1, hidden:true, dataIndex:'name', text:'Params'}, {xtype:'booleancolumn', width:60, dataIndex:'enabled', text:'Enabled', filter:{type:'boolean', active:true, defaultValue:true}}, {xtype:'numbercolumn', hidden:true, width:60, dataIndex:'area_user_infestata', text:'Area Infestata [ha]', format:'000'}, {xtype:'numbercolumn', hidden:true, width:60, dataIndex:'area_user_tampone', 
text:'Area Tampone [ha]', format:'000'}, {xtype:'numbercolumn', hidden:true, width:60, dataIndex:'area_user_contenimento', text:'Area Contenimento [ha]', format:'000'}, {xtype:'actioncolumn', width:125, items:[{isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  if (record.get('enabled')) {
    return false;
  } else {
    return true;
  }
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('id');
  Ext.MessageBox.confirm('Conferma', 'Cancellare il record id: ' + id, function(btn) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'cancella-area', id:id}, success:function(resp) {
        view.getStore().reload();
      }, failure:function(response, opts) {
        console.error('server-side failure with status code ' + response.status);
      }});
    }
  });
}, iconCls:'delete', tooltip:'Elimina'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var myId = Ext.StoreManager.get('DatasetTreeStore').getById('elaborazioni').childNodes.length;
  var parameters = Ext.JSON.decode(record.get('params'));
  var pestcodeA = parameters.title.split(':')[1];
  var vpar = Ext.JSON.decode(record.get('params'));
  var name = record.get('name');
  vpar.viewparams += ';areaid:' + record.get('id');
  var leaf = {'text':myId + ' ID: ' + record.get('id') + ' ' + name + ' - Valido dal: ' + Ext.Date.format(record.get('datefrom'), 'd/m/Y') + ', al: ' + Ext.Date.format(record.get('dateto'), 'd/m/Y') + ' (' + parameters.title + ') calcolata', 'id':'areas' + record.get('id'), 'idx':bufferedLayer++, 'leaf':true, 'checked':false, 'layerSource':{'url':wmsUrl, 'params':vpar, 'serverType':'geoserver'}};
  extraLayerFromLeaf(leaf);
  var treeStore = Ext.StoreMgr.get('DatasetTreeStore');
  var index = treeStore.findExact('id', 'areas' + record.get('id'));
  if (index == -1) {
    var branch = treeStore.getById('elaborazioni');
    branch.appendChild(leaf);
    Ext.Msg.alert('Info', 'Layer aggiunto!');
  } else {
    Ext.Msg.alert('Info', 'Il layer \x26egrave; gi\x26agrave; presente!');
  }
  vpar = Ext.JSON.decode(record.get('params'));
  vpar.LAYERS += '2';
  vpar.viewparams = 'id:' + record.get('id') + ';tampone:' + record.get('tampone') + ';contenimento:' + record.get('contenimento');
  leaf = {'text':myId + 1 + ' ID: ' + record.get('id') + ' ' + name + ' - Valido dal: ' + Ext.Date.format(record.get('datefrom'), 'd/m/Y') + ', al: ' + Ext.Date.format(record.get('dateto'), 'd/m/Y') + ' (' + parameters.title + ') disegnata da utente', 'id':'areas2' + record.get('id'), 'idx':bufferedLayer++, 'leaf':true, 'checked':false, 'layerSource':{'url':wmsUrl, 'params':vpar, 'serverType':'geoserver'}};
  extraLayerFromLeaf(leaf);
  treeStore = Ext.StoreMgr.get('DatasetTreeStore');
  index = treeStore.findExact('id', 'areas2' + record.get('id'));
  if (index == -1) {
    var branch = treeStore.getById('elaborazioni');
    branch.appendChild(leaf);
    Ext.Msg.alert('Info', 'Layer aggiunti!');
  } else {
    Ext.Msg.alert('Info', 'Il layer \x26egrave; gi\x26agrave; presente!');
  }
}, iconCls:'map_pin', tooltip:'Aggiungi come layer'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  Ext.create('SIMFito.view.delimitazioniChiusuraWindow', {params:record}).show();
}, isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  if (record.get('enabled')) {
    return false;
  } else {
    return true;
  }
}, iconCls:'calendar_xmark', tooltip:'Chiudi Periodo'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var myId = Ext.StoreManager.get('DatasetTreeStore').getById('elaborazioni').childNodes.length;
  var parameters = Ext.JSON.decode(record.get('params'));
  var pestcodeA = parameters.title.split(':')[1];
  var vpar = Ext.JSON.decode(record.get('params'));
  vpar.viewparams += ';areaid:' + record.get('id');
  var leaf = {'text':myId + ' ID: ' + record.get('id') + ' ' + name + ' - Valido dal: ' + Ext.Date.format(record.get('datefrom'), 'd/m/Y') + ', al: ' + Ext.Date.format(record.get('dateto'), 'd/m/Y') + ' (' + parameters.title + ') calcolata', 'id':'areas' + record.get('id'), 'idx':bufferedLayer++, 'leaf':true, 'checked':false, 'extras':record.get('geometry'), 'layerSource':{'url':wmsUrl, 'params':vpar, 'serverType':'geoserver'}};
  extraLayerFromLeaf(leaf);
  var treeStore = Ext.StoreMgr.get('DatasetTreeStore');
  var index = treeStore.findExact('id', 'areas' + record.get('id'));
  if (index == -1) {
    var branch = treeStore.getById('elaborazioni');
    branch.appendChild(leaf);
    Ext.Msg.alert('Info', 'Layer aggiunto!');
  } else {
    Ext.Msg.alert('Info', 'Il layer \x26egrave; gi\x26agrave; presente!');
  }
}, isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  if (record.get('geometry') === null) {
    return true;
  } else {
    return false;
  }
}, iconCls:'copy', tooltip:'Riparti da qui'}, {isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  if (record.get('geometry') === null) {
    return true;
  } else {
    return false;
  }
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  Ext.create('SIMFito.view.unisciArea', {params:record}).show();
}, iconCls:'link', tooltip:'Collega a...'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('id');
  window.open(urlPrefix + 'services/ajax.php?mode\x3dbuffer_lista_comuni\x26id\x3d' + id, '_blank');
}, iconCls:'download', tooltip:'Scarica lista comuni interessati'}]}], plugins:[{ptype:'rowexpander', expandOnDblClick:false, rowBodyTpl:['\x3ch4\x3e{name}\x3c/h4\x3e\x3cdiv\x3eid: {id}, dal: {datefrom:date("d/m/Y")}, al: {dateto:date("d/m/Y")}\x3cbr/\x3e parametri: {params}\x3c/div\x3e\x3cdiv\x3e\x3cul\x3e\x3cli\x3eArea infestata: {area_user_infestata}[ha]\x3c/li\x3e\x3cli\x3eArea tampone: {area_user_tampone}[ha]\x3c/li\x3e\x3cli\x3eArea di contenimento: {area_user_contenimento}[ha]\x3c/li\x3e\x3c/ul\x3e\x3c/div\x3e\x3cdiv\x3e\x3cb\x3eATTENZIONE\x3c/b\x3e Se l\x26apos;area infestata non \x26egrave; disegnata i valori relativi a: \x3cul\x3e\x3cli\x3eArea infestata;\x3c/li\x3e\x3cli\x3eArea tampone;\x3c/li\x3e\x3cli\x3eArea di conteminemto;\x3c/li\x3e\x3c/ul\x3e saranno indicate come uguale a zero.\x3c/div\x3e']}, 
{ptype:'gridfilters'}], dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'button', handler:function(button, e) {
  button.up('grid').getStore().reload();
}, iconCls:'fas fa-redo-alt', text:'Ricarica lista'}]}]}]}], listeners:{afterrender:'onMytabpanel1AfterRender'}}]});
Ext.define('SIMFito.view.MainViewport', {extend:Ext.container.Viewport, alias:'widget.mainviewport', controller:'mainviewport', viewModel:{type:'mainviewport'}, layout:'border', items:[{xtype:'panel', region:'north', height:105, id:'mainHeader', scrollable:true, collapsible:true, iconCls:'fas fa-bells', title:'SIMFito V.4.3.0', titleAlign:'center', titleCollapse:true, dockedItems:[{xtype:'toolbar', dock:'top', scrollable:true, items:[{xtype:'button', handler:function(button, e) {
  location.reload();
}, hidden:true, iconCls:'refresh', text:'Relaod'}, {xtype:'tbseparator'}, {xtype:'button', handler:function(button, e) {
  var tipoUtente = localStore.getItem('TipoUtente');
  if (tipoUtente > 1) {
    Ext.create('SIMFito.view.UserData').show();
  } else {
    Ext.StoreManager.get('UsersStore').getProxy().setExtraParam('requesterid', localStore.getItem('ID'));
    Ext.create('SIMFito.view.UsersWindow').show();
  }
}, id:'users', iconCls:'fad fa-users', text:'Dati \x3cbr/\x3e Utente'}, {xtype:'tbseparator'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.MailWindow').show();
}, hidden:true, id:'mail', iconCls:'mail', text:'Comunicazioni'}, {xtype:'button', handler:function(button, e) {
  var dettagli = Ext.getCmp('dettagli');
  dettagli.setDisabled(false);
  dettagli.setTitle('Siti');
  clearContainer();
  var siti = Ext.create('SIMFito.view.SitiAllContainer');
  var mscheda = Ext.getCmp('mainschedepanel');
  mscheda.add(siti);
  Ext.getCmp('mainpanel').setActiveItem('dettagli');
}, iconCls:'fas fa-map-signs', text:'Cerca \x3cbr\x3e Sito'}, {xtype:'tbseparator'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.WarningsWindow').show();
}, id:'warnings', iconCls:'fas fa-exclamation-triangle', text:'Segnalazioni'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.NewsWindow').show();
}, id:'news', iconCls:'fas fa-bullhorn', text:'Avvisi \x3cbr/\x3e bollettini'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.CLWindow').show();
}, iconCls:'fas fa-newspaper', text:'Aggiornamenti \x3cbr/\x3e recenti'}, {xtype:'tbseparator'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.UEPestWindow').show();
}, id:'UEPest', iconCls:'fad fa-spider', text:'Parassiti \x3cbr/\x3e Rendicontati'}, {xtype:'button', hidden:true, iconCls:'xls', text:'Reports', menu:{xtype:'menu', items:[{xtype:'menuitem', handler:function(item, e) {
  var uid = localStore.getItem('ID');
  var uty = localStore.getItem('TipoUtente');
  var upr = localStore.getItem('Provincia');
  Ext.create('SIMFito.view.TableWindow').init({uid:uid, uty:uty, upr:upr});
}, text:'Report generale'}, {xtype:'menuitem', handler:function(item, e) {
  Ext.create('SIMFito.view.UEReportWindow').show();
}, id:'reportue2', text:'Report UE'}, {xtype:'menuitem', handler:function(item, e) {
  Ext.create('SIMFito.view.UEPestWindow').show();
}, id:'UEPest2', text:'Parassiti rendicontazione'}]}}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.ReportsWindow').show();
}, iconCls:'xls', text:'Reports'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.OfficialEUReportsWin').show();
}, hidden:true, id:'ReportUEUfficiali', iconCls:'fas fa-clipboard', text:'Reports UE\x3cbr/\x3eUfficiali'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.AnalysysStatisticsWindow', {}).show();
}, id:'statistiche_laboratorio', iconCls:'fas fa-analytics', text:'Statistiche \x3cbr/\x3e laboratorio'}, {xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var doc = 'Relazioni_rev_settembre2015.xls';
  window.open(urlPrefix + 'documenti/schedaOffline.xls', 'Documenti');
}, iconCls:'xls', text:'Scheda \x3cbr/\x3e Offline'}, {xtype:'button', handler:function(button, e) {
  var doc = 'Piano_Regionale_Indagine_2025.xlsx';
  window.open(urlPrefix + 'documenti/' + doc, 'Documenti');
}, iconCls:'xls', text:'Piano regionale \x3cbr/\x3e indagine 2025'}, {xtype:'button', handler:function(button, e) {
  var doc = 'Scheda_Cofinanziato_2018_definitiva.pdf';
  window.open(urlPrefix + 'documenti/' + doc, 'Documenti');
}, hidden:true, iconCls:'pdf', text:'Cofinanziamento 2018'}, {xtype:'tbseparator'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'documenti/Linee guida SIMFito.pdf');
}, iconCls:'pdf', text:'Linee \x3cbr/\x3e Guida'}, {xtype:'tbseparator'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/index.html', 'Help');
}, iconCls:'help', text:'Manuale'}, {xtype:'button', handler:function(button, e) {
  window.open('https://ariespace.atlassian.net/servicedesk/customer/portal/6', '_blnak');
}, iconCls:'x-fa fa-info', text:'Help \x3cbr/\x3e Desk'}, {xtype:'tbseparator'}, {xtype:'button', handler:function(button, e) {
  localStore.clear();
  window.location = 'index.html';
}, iconCls:'fas fa-sign-out-alt', text:'Esci'}]}], listeners:{beforerender:'onMainHeaderBeforeRender'}}, {xtype:'tabpanel', flex:1, region:'center', id:'mainpanel', activeTab:3, items:[{xtype:'gridpanel', id:'schede', scrollable:true, iconCls:'notes', title:'Schede', store:'SchedeStore', dockedItems:[{xtype:'toolbar', dock:'top', id:'gridTB', items:[{xtype:'button', handler:function(button, e) {
  button.up('gridpanel').getStore().reload();
}, iconCls:'fas fa-redo-alt', text:'Ricarica Lista'}, {xtype:'tbseparator'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.NuovaSchdaWindow').show();
}, id:'aggiungischeda', iconCls:'fas fa-file-plus', text:'Aggiungi Scheda'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.RefertiWindow').show();
}, iconCls:'fas fa-notes-medical', text:'Referti'}, {xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  if (localStore.getItem('TipoUtente') > 1) {
    var userId = localStore.getItem('ID');
    var text1 = 'Il codice campione \x26egrave; costituito da una parte fissa (dipendente dall\x26apos;utente): in questo caso ' + userId + 'C; ed un numero progressivo.';
    var text2 = 'L\x26apos;ultimo codice utilizzato \x26egrave; stato: ';
    var text3 = 'Il prossimo codice che verr\x26agrave; generato sar\x26agrave;: ';
    Ext.Ajax.request({url:'services/ajax.php', params:{mode:'codici_prossimo', idtecnico:userId}, method:'POST', success:function(response, opts) {
      var obj = Ext.util.JSON.decode(response.responseText);
      if (obj.success) {
        console.log(obj);
        var text = text1 + '\x3cbr/\x3e\x3cbr/\x3e' + text2 + obj.data[0].ultimo + '.\x3cbr/\x3e\x3cb\x3e' + text3 + obj.data[0].prossimo + '.\x3c/b\x3e';
        Ext.Msg.alert('Prossimo Codice Disponibile', text);
      } else {
        Ext.Msg.alert('Errore', obj.errors.reason);
      }
    }, failure:function(form, action) {
      switch(action.failureType) {
        case Ext.form.action.Action.CLIENT_INVALID:
          Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
          break;
        case Ext.form.action.Action.CONNECT_FAILURE:
          Ext.Msg.alert('Failure', 'Ajax communication failed');
          break;
        case Ext.form.action.Action.SERVER_INVALID:
          Ext.Msg.alert('Failure', action.result.errors.reason);
          break;
      }
    }});
  } else {
    Ext.Msg.alert('Attenzione', 'Questo tasto non è abilitato per gli utenti amministratori');
  }
}, id:'prossimoCampione', text:'Prossimo Codice Campione Disponibile'}, {xtype:'button', disabled:true, hidden:true, id:'schedesettings', iconCls:'settings', text:'Impostazioni Schede', tooltip:'Impostazioni scheda', menu:{xtype:'menu', width:150, items:[{xtype:'menuitem', handler:function(item, e) {
  Ext.create('SIMFito.view.SchedaSettingsWindow').show();
}, text:'Posticipo Scheda'}, {xtype:'menuitem', handler:function(item, e) {
  Ext.create('SIMFito.view.MotivoIspezioneWindow').show();
}, hidden:true, text:'Moivi d\x26apos;Ispezione'}, {xtype:'menuitem', handler:function(item, e) {
  Ext.create('SIMFito.view.TipocampioneWindow').show();
}, text:'Tipo serie campioni'}, {xtype:'menuseparator'}, {xtype:'menuitem', handler:function(item, e) {
  Ext.create('SIMFito.view.TipotrappolaWindow1').show();
}, text:'Tipo trappole'}]}}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/scheda.html', 'Help');
}, iconCls:'help', tooltip:'Help'}]}, {xtype:'pagingtoolbar', dock:'bottom', width:360, displayInfo:true, store:'SchedeStore'}], columns:[{xtype:'numbercolumn', flex:0, dataIndex:'idscheda', text:'Id Scheda', format:'00', filter:{type:'number'}}, {xtype:'gridcolumn', flex:11, dataIndex:'mainname', text:'Nome principale', filter:{type:'string'}}, {xtype:'gridcolumn', flex:11, dataIndex:'mainsurname', text:'Cognome principale', filter:{type:'string'}}, {xtype:'gridcolumn', flex:11, dataIndex:'tecnici', 
text:'Tutti i Tecnici'}, {xtype:'datecolumn', flex:9, maxWidth:100, dataIndex:'data_sopralluogo', text:'Data Sopralluogo', format:'d/m/Y', filter:{type:'date', dateFormat:'d/m/Y'}}, {xtype:'gridcolumn', flex:6, dataIndex:'protocollo', text:'Protocollo', filter:{type:'string'}}, {xtype:'gridcolumn', flex:10, dataIndex:'azienda', text:'Azienda', filter:{type:'string'}}, {xtype:'gridcolumn', flex:8, dataIndex:'sito', text:'Sito', filter:{type:'string'}}, {xtype:'gridcolumn', flex:9, dataIndex:'comune', 
text:'Comune', filter:{type:'string'}}, {xtype:'gridcolumn', flex:9, dataIndex:'laboratorio', text:'Laboratorio'}, {xtype:'gridcolumn', renderer:function(value, metaData, record, rowIndex, colIndex, store, view) {
  var level = record.get('laboratoriostato_posotion');
  var toReturn = 'Nessuna analisi richiesta o scheda appartenente alla precedente versione.';
  metaData.tdAttr = 'data-qtip\x3d"La descrizione si riferisce al campione con lo stato meno avanzato"';
  if (level == 1) {
    toReturn = '\x3cspan class\x3d"sred"\x3e\x3cspan class\x3d"fas fa-paper-plane"\x3e\x26nbsp;' + value + '\x3cspan\x3e\x3cspan\x3e';
  } else {
    if (level == 2) {
      metaData.tdAttr = 'data-qtip\x3d"Almeno un campione \x26egrave; stato ritenuto non idoneo!"';
      toReturn = '\x3cspan class\x3d"sblack"\x3e\x3cspan class\x3d"fas fa-exclamation-triangle"\x3e\x26nbsp;' + value + '\x3cspan\x3e\x3cspan\x3e';
    } else {
      if (level < 6 && level !== null) {
        toReturn = '\x3cspan class\x3d"syellow"\x3e\x3cspan class\x3d"fas fa-flask"\x3e\x26nbsp;' + value + '\x3cspan\x3e\x3cspan\x3e';
      } else {
        if (level == 6) {
          if (record.get('numpositive') > 0) {
            toReturn = '\x3cspan class\x3d"sgreenred"\x3e\x3cspan class\x3d"fas fa-check"\x3e\x26nbsp;' + value + '\x3cspan\x3e\x3cspan\x3e';
          } else {
            toReturn = '\x3cspan class\x3d"sgreen"\x3e\x3cspan class\x3d"fas fa-check"\x3e\x26nbsp;' + value + '\x3cspan\x3e\x3cspan\x3e';
          }
        }
      }
    }
  }
  return toReturn;
}, flex:9, dataIndex:'laboratorio_stato', text:'Stato Analisi'}, {xtype:'numbercolumn', dataIndex:'tipo_visita_theme', text:'Catture', format:'000'}, {xtype:'booleancolumn', dataIndex:'siti_cancellato', text:'Da Verificare', falseText:'No', trueText:'Si'}, {xtype:'gridcolumn', dataIndex:'rigetto', text:'Rigetto'}, {xtype:'gridcolumn', renderer:function(value, metaData, record, rowIndex, colIndex, store, view) {
  var stato = Number(record.get('stato'));
  var nval = value;
  var returning = nval;
  if (stato == 1) {
    nval = 'DA CONVALIDARE';
    returning = '\x3cspan class\x3d"ssred"\x3e' + nval + '\x3c/span\x3e';
  }
  return returning;
}, width:150, defaultWidth:150, dataIndex:'statodesc', text:'Stato'}, {xtype:'booleancolumn', dataIndex:'allegati', text:'Allegati', falseText:'Nessuno', trueText:'S\x26igrave;'}, {xtype:'actioncolumn', minWidth:270, width:270, sortable:false, text:'Azioni', items:[{handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('idscheda');
  var stato = record.get('stato');
  var geometry = record.get('geometry');
  var sito = record.get('sito');
  var gid_sito = record.get('gid_sito');
  var azienda = record.get('azienda');
  var piva = record.get('iva_azienda');
  var dettagli = Ext.getCmp('dettagli');
  dettagli.setDisabled(false);
  dettagli.setTitle('Dettagli Scheda n. ' + id);
  clearContainer();
  var schede = Ext.create('SIMFito.view.SchedaContainer', {userData:{'idScheda':id, 'statoScheda':stato, 'azienda':azienda, 'piva':piva, 'sito':sito, 'gid_sito':gid_sito, 'geometry':geometry}});
  var mscheda = Ext.getCmp('mainschedepanel');
  mscheda.add(schede);
  Ext.getCmp('mainpanel').setActiveItem('dettagli');
}, getClass:function(v, metadata, r, rowIndex, colIndex, store) {
  var stato = Number(r.get('stato'));
  if (stato >= 1 || stato == -1) {
    return 'search';
  } else {
    return 'edit_notes';
  }
}, iconCls:'search', tooltip:'Osservazioni visive'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('idscheda');
  var stato = record.get('stato');
  var geometry = record.get('geometry');
  var sito = record.get('sito');
  var gid_sito = record.get('gid_sito');
  var azienda = record.get('azienda');
  var piva = record.get('iva_azienda');
  var dettagli = Ext.getCmp('dettagli');
  var data_sopralluogo = record.get('data_sopralluogo');
  dettagli.setDisabled(false);
  dettagli.setTitle('Gestione Trappole Scheda n. ' + id);
  clearContainer();
  var store = Ext.StoreMgr.get('TrapStore');
  store.getProxy().setExtraParam('gid', gid_sito);
  store.reload();
  var trappoleManager = Ext.create('SIMFito.view.TrappolePanel1', {userData:{'idScheda':id, 'statoScheda':stato, 'data_sopralluogo':data_sopralluogo, 'azienda':azienda, 'piva':piva, 'sito':sito, 'gid_sito':gid_sito, 'geometry':geometry}});
  var mscheda = Ext.getCmp('mainschedepanel');
  mscheda.add(trappoleManager);
  Ext.getCmp('mainpanel').setActiveItem('dettagli');
}, getClass:function(v, metadata, r, rowIndex, colIndex, store) {
  var stato = Number(r.get('stato'));
  if (stato >= 1 || stato == -1) {
    return 'debug';
  } else {
    return 'spider';
  }
}, isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  var disabled = record.get('gid_sito') == '-1' ? true : false;
  return disabled;
}, iconCls:'debug', tooltip:'Gestione trappole'}, {isDisabled:function(view, rowIndex, colIndex, item, record) {
  if (record.get('stato') === 0) {
    if (record.get('gid_sito') === -1) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('idscheda');
  var dettagli = Ext.getCmp('dettagli');
  dettagli.setDisabled(false);
  dettagli.setTitle('Associa Sito alla Scheda n. ' + id);
  clearContainer();
  var schede = Ext.create('SIMFito.view.SitiContainer1', {userData:{'idScheda':id}});
  var mscheda = Ext.getCmp('mainschedepanel');
  mscheda.add(schede);
  Ext.getCmp('mainpanel').setActiveItem('dettagli');
}, iconCls:'map_pin', tooltip:'Collega ad un Sito'}, {isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  var stato = Number(record.get('stato'));
  var protocollo = record.get('protocollo');
  var tipoUtente = Number(localStore.getItem('TipoUtente'));
  if (tipoUtente <= 1) {
    return true;
  } else {
    if (stato == 2) {
      if (protocollo.trim() == '' || protocollo == null) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('idscheda');
  var stato = Number(record.get('stato'));
  var protocollo = record.get('protocollo');
  var tipoUtente = Number(localStore.getItem('TipoUtente'));
  Ext.create('SIMFito.view.ProtocolloWindow', {record:record}).show();
}, iconCls:'file_signature', tooltip:'Protocollo'}, {isDisabled:function(view, rowIndex, colIndex, item, record) {
  var stato = Number(record.get('stato'));
  if (localStore.getItem('TipoUtente') <= 1) {
    if (stato == 1) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('idscheda');
  if (localStore.getItem('TipoUtente') <= 1) {
    Ext.MessageBox.confirm('Attenzione', 'validare la scheda ' + id + '?', function(btn) {
      if (btn == 'yes') {
        Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'valida-scheda', id_scheda:id, validazione:2}, success:function(response, opts) {
          var obj = Ext.decode(response.responseText);
          if (!obj.success) {
            Ext.Msg.alert('Errore', obj.errors.reason);
          }
          view.getStore().reload();
        }, failure:function(form, action) {
          switch(action.failureType) {
            case Ext.form.action.Action.CLIENT_INVALID:
              Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
              break;
            case Ext.form.action.Action.CONNECT_FAILURE:
              Ext.Msg.alert('Failure', 'Ajax communication failed');
              break;
            case Ext.form.action.Action.SERVER_INVALID:
              Ext.Msg.alert('Failure', action.result.errors.reason);
              break;
          }
        }});
      }
    });
  }
}, iconCls:'like', tooltip:'Convalida'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('idscheda');
  var userType = localStore.getItem('TipoUtente');
  if (localStore.getItem('TipoUtente') == 0) {
    console.log(record.get('laboratoriostato_posotion'));
    if (record.get('laboratoriostato_posotion') >= 1) {
      Ext.Msg.alert('ATTENZIONE!', 'La scheda non pu\x26ograve; essere riggettata inquanto ha almeno un campione associato in analisi!');
    } else {
      Ext.create('SIMFito.view.RigettoWindow').init(id);
    }
  } else {
    Ext.MessageBox.confirm('Conferma', 'Confermare la scheda ' + id + '? Non sar\x26agrave; pi\x26ugrave; possibile modificarla!', function(btn) {
      if (btn == 'yes') {
        Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'salva-scheda', id_scheda:id, rule:userType}, success:function(response, opts) {
          var obj = Ext.decode(response.responseText);
          if (!obj.success) {
            Ext.Msg.alert('Errore', obj.errors.reason);
          }
          view.getStore().reload();
        }, failure:function(form, action) {
          switch(action.failureType) {
            case Ext.form.action.Action.CLIENT_INVALID:
              Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
              break;
            case Ext.form.action.Action.CONNECT_FAILURE:
              Ext.Msg.alert('Failure', 'Ajax communication failed');
              break;
            case Ext.form.action.Action.SERVER_INVALID:
              Ext.Msg.alert('Failure', action.result.errors.reason);
              break;
          }
        }});
      }
    });
  }
}, isDisabled:function(view, rowIndex, colIndex, item, record) {
  if (localStore.getItem('TipoUtente') == 0) {
    item.tooltip = 'Rigetta';
    return false;
  } else {
    item.tooltip = 'Conferma';
    if (record.get('stato') === 0) {
      if (record.get('gid_sito') === -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}, getClass:function(v, metadata, r, rowIndex, colIndex, store) {
  if (localStore.getItem('TipoUtente') == 0) {
    return 'dislike';
  } else {
    return 'check';
  }
}, iconCls:'check', tooltip:'Conferma'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var userData = {idscheda:record.get('idscheda')};
  Ext.create('SIMFito.view.AssociaTecnicoWindow', {userData:userData}).show();
}, isDisabled:function(view, rowIndex, colIndex, item, record) {
  if (localStore.getItem('TipoUtente') <= 1) {
    return false;
  } else {
    if (record.get('id_tecnico') != localStore.getItem('ID')) {
      return true;
    } else {
      if (record.get('stato') === 0) {
        return false;
      } else {
        return true;
      }
    }
  }
}, iconCls:'add_user', tooltip:'Associa Tecnico'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var userData = {idscheda:record.get('idscheda')};
  Ext.create('SIMFito.view.RimuoviTecnicoWindow', {userData:userData}).show();
}, isDisabled:function(view, rowIndex, colIndex, item, record) {
  if (localStore.getItem('TipoUtente') <= 1) {
    return false;
  } else {
    if (record.get('id_tecnico') != localStore.getItem('ID')) {
      return true;
    } else {
      if (record.get('stato') === 0) {
        return false;
      } else {
        return true;
      }
    }
  }
}, iconCls:'delete_user', tooltip:'Disassocia Tecnico'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('idscheda');
  Ext.MessageBox.confirm('Conferma', 'Cancellare la scheda n.' + id, function(btn) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'cancella-scheda', id_scheda:id}, success:function(resp) {
        view.getStore().reload();
      }, failure:function(response, opts) {
        console.error('server-side failure with status code ' + response.status);
      }});
    }
  });
}, isDisabled:function(view, rowIndex, colIndex, item, record) {
  if (record.get('stato') === 0) {
    return false;
  } else {
    return true;
  }
}, iconCls:'delete', tooltip:'Elimina Scheda'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var userData = {idscheda:record.get('idscheda'), record:record};
  var g = record.get('geometry');
  if (g != '') {
    var geom = Ext.JSON.decode(g, true);
    if (!record.get('siti_cancellato')) {
      if (geom.type == 'Point') {
        Ext.create('SIMFito.view.DuplicaWindow', {userData:userData}).show();
        Ext.Msg.alert('Attenzione', 'Questa scheda non potrebbe; essere duplicata in quanto riferita ad un sito che \x26egrave; rappresentato da un punto.');
      } else {
        Ext.create('SIMFito.view.DuplicaWindow', {userData:userData}).show();
        Ext.Msg.alert('Attenzione', "Attenzione le specie monitorate devono essere allineate al Piano di monitoraggio per l'anno in corso.");
      }
    } else {
      Ext.Msg.alert('Attenzione', 'Questa scheda non pu\x26ograve; essere duplicata poich\x26eacute; associata ad un sito non pi\x26ugrave attivo.');
    }
  } else {
    Ext.Msg.alert('Attenzione', 'Questa scheda non pu\x26ograve; essere duplicata poich\x26eacute; non \x26egrave; associata ad alcun sito');
  }
}, isDisabled:function(view, rowIndex, colIndex, item, record) {
  if (localStore.getItem('TipoUtente') > 1) {
    return false;
  } else {
    return true;
  }
}, iconCls:'magic_wand', tooltip:'Duplica Scheda'}, {isDisabled:function(view, rowIndex, colIndex, item, record) {
  return false;
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('idscheda');
  var url = urlPrefix + 'services/export.php?mode\x3dpdf\x26data\x3dscheda\x26id\x3d' + id + '\x26status\x3d' + record.get('stato');
  window.open(url, 'Scheda numero: ' + id, 'width\x3d800,height\x3d600');
}, disabled:false, iconCls:'pdf', tooltip:'PDF'}, {isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  var toReturn = true;
  if (record.get('laboratoriostato_posotion') == 6) {
    toReturn = false;
  }
  return toReturn;
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('idscheda');
  var url = simfitoLabUrl + 'services/report.php?mode\x3dpdf\x26table\x3dschedareport\x26idv\x3d' + id;
  window.open(url, '_blank');
}, iconCls:'lab', tooltip:'Certificato Analisi'}]}], tabConfig:{xtype:'tab', dock:'left', width:100, iconCls:'fas fa-clipboard-list'}, plugins:[{ptype:'gridfilters'}], listeners:{beforerender:'onSchedeBeforeRender'}}, {xtype:'gridpanel', id:'aziende', iconCls:'apple', title:'Aziende', store:'AziendeStore', tabConfig:{xtype:'tab', dock:'left', width:100, iconCls:'fad fa-farm'}, columns:[{xtype:'numbercolumn', dataIndex:'id_azienda', text:'Id Azienda', format:'00', filter:{type:'number'}}, {xtype:'gridcolumn', 
flex:9, dataIndex:'partita_iva', text:'Partita IVA', filter:{type:'string'}}, {xtype:'gridcolumn', flex:10, dataIndex:'rag_soc', text:'Ragione Sociale', filter:{type:'string'}}, {xtype:'gridcolumn', dataIndex:'tipo', text:'Tipologia Sito'}, {xtype:'gridcolumn', flex:8, dataIndex:'indirizzo', text:'Indirizzo', filter:{type:'string'}}, {xtype:'gridcolumn', dataIndex:'cap', text:'CAP', filter:{type:'string'}}, {xtype:'gridcolumn', dataIndex:'provincia', text:'Provincia', filter:{type:'string'}}, {xtype:'gridcolumn', 
flex:7, dataIndex:'comune', text:'Comune', filter:{type:'string'}}, {xtype:'gridcolumn', hidden:true, dataIndex:'referente', text:'Referente', filter:{type:'string'}}, {xtype:'gridcolumn', hidden:true, dataIndex:'posizione_ref', text:'Posizione Referente'}, {xtype:'gridcolumn', flex:5, dataIndex:'telefono', text:'Telefono', filter:{type:'string'}}, {xtype:'gridcolumn', dataIndex:'fax', text:'Fax', filter:{type:'string'}}, {xtype:'templatecolumn', flex:6, tpl:['\x3ca href\x3d"mailto:{email}"\x3e{email}\x3c/a\x3e'], 
dataIndex:'email', text:'Email'}, {xtype:'actioncolumn', sortable:false, text:'Azioni', items:[{handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var idAzienda = record.get('id_azienda');
  var rsAzienda = record.get('rag_soc');
  var bbox = record.get('bbox');
  var piva = record.get('partita_iva');
  var dettagli = Ext.getCmp('dettagli');
  dettagli.setDisabled(false);
  dettagli.setTitle('Nuovo sito per l\x26apos;azienda ' + rsAzienda);
  clearContainer();
  var sito = Ext.create('SIMFito.view.SitiContainer', {userData:{'idAzienda':idAzienda, 'piva':piva, 'bbox':bbox}});
  var mscheda = Ext.getCmp('mainschedepanel');
  mscheda.add(sito);
  Ext.getCmp('mainpanel').setActiveItem('dettagli');
}, iconCls:'favourite_place', tooltip:'Nuovo Sito'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var dettagli = Ext.getCmp('dettagli');
  dettagli.setDisabled(false);
  dettagli.setTitle('Siti dell\x26apos;Azienda ' + record.get('rag_soc'));
  clearContainer();
  var siti = Ext.create('SIMFito.view.SitiAllContainer', {userData:{piva:record.get('partita_iva')}});
  var mscheda = Ext.getCmp('mainschedepanel');
  mscheda.add(siti);
  Ext.getCmp('mainpanel').setActiveItem('dettagli');
}, iconCls:'route', tooltip:'Mostra i Siti dell\x26apos;Azienda'}]}], plugins:[{ptype:'gridfilters'}], dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'button', handler:function(button, e) {
  button.up('gridpanel').getStore().reload();
}, iconCls:'fas fa-redo-alt', text:'Ricarica Lista'}, {xtype:'tbseparator'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.NuovaAzienda').show();
}, iconCls:'fad fa-plus', text:'Aggiungi Azienda'}, {xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.TipoaziendaWindow').show();
}, disabled:true, hidden:true, id:'farmtypemanager', iconCls:'settings', text:'Tipi di Aziende'}, {xtype:'button', handler:function(button, e) {
  if (localStore.getItem('TipoUtente') * 1 == 0) {
    Ext.create('SIMFito.view.FarmmergefWindow').show();
  } else {
    Ext.Msg.alert('Errore', 'Permessi non sufficienti!');
  }
}, disabled:true, hidden:true, id:'farmmerger', text:'Unione Aziende'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/aziende.html', 'Help');
}, iconCls:'help'}]}, {xtype:'pagingtoolbar', dock:'bottom', width:360, displayInfo:true, store:'AziendeStore'}]}, {xtype:'alltrappanel', title:'Tutte le Trappole', tabConfig:{xtype:'tab', iconCls:'fad fa-spider'}}, {xtype:'panel', id:'dettagli', layout:'border', iconCls:'page_full', title:'Dettagli', tabConfig:{xtype:'tab', iconCls:'fad fa-info'}, items:[{xtype:'panel', region:'center', split:false, flex:1, id:'mainschedepanel', layout:'fit', collapsible:false, hideCollapseTool:true}, {xtype:'panel', 
flex:1, region:'west', split:true, html:'\x3cdiv id\x3d"myMap"\x3e\x3c/div\x3e', id:'map', layout:'fit', collapsible:true, frameHeader:false, header:false, listeners:{afterrender:'onMapAfterRender', resize:'onMapResize'}}]}, {xtype:'trappolepanel', iconCls:'fad fa-spider-black-widow'}, {xtype:'reportpanel', iconCls:'fad fa-globe-europe'}], listeners:{beforerender:'onMainpanelBeforeRender', afterrender:'onMainpanelAfterRender'}}]});
Ext.define('SIMFito.view.MotivoIspezioneWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.motivoispezionewindow'});
Ext.define('SIMFito.view.MotivoIspezioneWindow', {extend:Ext.window.Window, alias:'widget.motivoispezionewindow', viewModel:{type:'motivoispezionewindow'}, constrain:true, height:600, width:800, layout:'fit', title:'Motivi Ispezione', items:[{xtype:'gridpanel', autoLoad:true, store:'MotivovisitaStore1', dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.NuovoMotivoWindow').show();
}, iconCls:'add', text:'Aggiungi'}]}], columns:[{xtype:'gridcolumn', flex:2, dataIndex:'motivo', text:'Motivo'}, {xtype:'booleancolumn', dataIndex:'enabled', text:'Attivo', falseText:'No', trueText:'Si', filter:{type:'boolean'}}, {xtype:'actioncolumn', text:'Azioni', items:[{isDisabled:function(view, rowIndex, colIndex, item, record) {
  return record.get('enabled');
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var text = 'Attivare il motivo di ispezione: "' + record.get('motivo') + '"?';
  var idmotivo = record.get('id');
  var store = Ext.StoreMgr.get('MotivovisitaStore1');
  Ext.Msg.confirm('Conferma', text, function(btn, value, opt) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'update_motivi_visita', field:'enabled', value:'true', id:idmotivo}, success:function(response, opts) {
        obj = Ext.util.JSON.decode(response.responseText);
        var success = obj.success;
        if (success) {
          store.reload();
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore', obj.errors.reason);
        } else {
          Ext.Msg.alert('Errore', 'Server non raggiungibile: ' + action.response.responseText);
        }
      }});
    }
  });
}, iconCls:'check', tooltip:'Attiva'}, {isDisabled:function(view, rowIndex, colIndex, item, record) {
  return !record.get('enabled');
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var text = 'Disattivare il motivo di ispezione: "' + record.get('motivo') + '"?';
  var idmotivo = record.get('id');
  var store = Ext.StoreMgr.get('MotivovisitaStore1');
  Ext.Msg.confirm('Conferma', text, function(btn, value, opt) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'update_motivi_visita', field:'enabled', value:'false', id:idmotivo}, success:function(response, opts) {
        obj = Ext.util.JSON.decode(response.responseText);
        var success = obj.success;
        if (success) {
          store.reload();
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore', obj.errors.reason);
        } else {
          Ext.Msg.alert('Errore', 'Server non raggiungibile: ' + action.response.responseText);
        }
      }});
    }
  });
}, iconCls:'delete', tooltip:'Disattiva'}]}], plugins:[{ptype:'gridfilters'}]}]});
Ext.define('SIMFito.view.MotivoIspezioneWindowViewModel1', {extend:Ext.app.ViewModel, alias:'viewmodel.tipoaziendawindow'});
Ext.define('SIMFito.view.MotivoIspezioneWindowViewModel2', {extend:Ext.app.ViewModel, alias:'viewmodel.tipocampionewindow'});
Ext.define('SIMFito.view.MotivoIspezioneWindowViewModel3', {extend:Ext.app.ViewModel, alias:'viewmodel.tipotrappolawindow1'});
Ext.define('SIMFito.view.NewsWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.newswindow'});
Ext.define('SIMFito.view.NewsWindow', {extend:Ext.window.Window, alias:'widget.newswindow', viewModel:{type:'newswindow'}, constrain:true, height:480, width:640, layout:'fit', title:'Avvisi bollettini', items:[{xtype:'gridpanel', scrollable:true, autoLoad:true, store:'NewsStore', columns:[{xtype:'numbercolumn', width:50, dataIndex:'id', text:'ID', tooltip:'ID', format:'0'}, {xtype:'datecolumn', flex:1, dataIndex:'date', text:'Data', tooltip:'Data', format:'d/m/Y'}, {xtype:'gridcolumn', flex:2, dataIndex:'news', 
text:'Testo', tooltip:'Testo'}, {xtype:'booleancolumn', width:75, dataIndex:'deleted', text:'Disabilitato', tooltip:'Disabilitato'}, {xtype:'actioncolumn', width:75, text:'Azioni', items:[{handler:function(view, rowIndex, colIndex, item, e, record, row) {
  Ext.create('SIMFito.view.newsEditWindow').init(record);
}, iconCls:'edit_notes', tooltip:'Modifica'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('id');
  var text = 'Nascondere';
  if (record.get('deleted')) {
    text = 'Mostrare';
  }
  if (localStore.getItem('TipoUtente') <= 1) {
    Ext.MessageBox.confirm('Attenzione', text + ' l\x26apos;avviso ' + id + '?', function(btn) {
      if (btn == 'yes') {
        Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'hide-news', 'id':id}, success:function(response, opts) {
          var obj = Ext.decode(response.responseText);
          if (!obj.success) {
            Ext.Msg.alert('Errore', obj.errors.reason);
          }
          view.getStore().reload();
        }, failure:function(form, action) {
          switch(action.failureType) {
            case Ext.form.action.Action.CLIENT_INVALID:
              Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
              break;
            case Ext.form.action.Action.CONNECT_FAILURE:
              Ext.Msg.alert('Failure', 'Ajax communication failed');
              break;
            case Ext.form.action.Action.SERVER_INVALID:
              Ext.Msg.alert('Failure', action.result.errors.reason);
              break;
          }
        }});
      }
    });
  }
}, iconCls:'block', tooltip:'Abilita/Disabilita'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('id');
  if (localStore.getItem('TipoUtente') <= 1) {
    Ext.MessageBox.confirm('Attenzione', 'Eliminare l\x26apos;avviso ' + id + '?', function(btn) {
      if (btn == 'yes') {
        Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'delete-news', 'id':id}, success:function(response, opts) {
          var obj = Ext.decode(response.responseText);
          if (!obj.success) {
            Ext.Msg.alert('Errore', obj.errors.reason);
          }
          view.getStore().reload();
        }, failure:function(form, action) {
          switch(action.failureType) {
            case Ext.form.action.Action.CLIENT_INVALID:
              Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
              break;
            case Ext.form.action.Action.CONNECT_FAILURE:
              Ext.Msg.alert('Failure', 'Ajax communication failed');
              break;
            case Ext.form.action.Action.SERVER_INVALID:
              Ext.Msg.alert('Failure', action.result.errors.reason);
              break;
          }
        }});
      }
    });
  }
}, iconCls:'delete', tooltip:'Elimina'}]}], dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.newsEditWindow').show();
}, iconCls:'add', text:'Aggiungi avviso'}]}]}]});
Ext.define('SIMFito.view.NuovaAssociazioneWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.nuovaassociazionewindow'});
Ext.define('SIMFito.view.NuovaAssociazioneWindowViewController', {extend:Ext.app.ViewController, alias:'controller.nuovaassociazionewindow', onFormAfterRender:function(component, eOpts) {
  var userdata = component.up('window').userData;
  Ext.getCmp('nuovaassociazioneidscheda').setValue(userdata.idscheda);
  Ext.getCmp('nuovafaseidtecnico').setValue(localStore.getItem('ID'));
}});
Ext.define('SIMFito.view.NuovaAssociazioneWindow', {extend:Ext.window.Window, alias:'widget.nuovaassociazionewindow', controller:'nuovaassociazionewindow', viewModel:{type:'nuovaassociazionewindow'}, constrain:true, height:300, width:400, layout:'fit', title:'Nuova Associazione', items:[{xtype:'form', bodyPadding:10, url:'services/ajax-save-form.php', items:[{xtype:'combobox', anchor:'100%', fieldLabel:'Organismi Nocivi (digitare almeno 4 caratteri)', name:'parassita', allowBlank:false, allowOnlyWhitespace:false, 
displayField:'name', forceSelection:true, hiddenName:'parassita', store:'AllorgStore', valueField:'b_code'}, {xtype:'combobox', anchor:'100%', fieldLabel:'Pianta Ospite (digitare almeno 4 caratteri)', name:'ospite', allowBlank:false, allowOnlyWhitespace:false, displayField:'name', forceSelection:true, hiddenName:'ospite', store:'PlantStore', valueField:'b_code'}, {xtype:'hiddenfield', anchor:'100%', id:'nuovaassociazionefase', name:'fase', value:'prsinsert'}, {xtype:'hiddenfield', anchor:'100%', 
id:'nuovaassociazioneidscheda', name:'idscheda'}, {xtype:'hiddenfield', anchor:'100%', id:'nuovafaseidtecnico', name:'idTecnico'}], listeners:{afterrender:'onFormAfterRender'}, dockedItems:[{xtype:'button', handler:function(button, e) {
  var form = button.up('form').getForm();
  var window = button.up('window');
  if (form.isValid()) {
    var text = 'Segnalare la nuova associazione: ?';
    Ext.Msg.confirm('Conferma', text, function(btn, value, opt) {
      if (btn == 'yes') {
        form.submit({method:'POST', waitTitle:'Connessione in corso', waitMsg:'Invio informazioni', success:function(form, action) {
          obj = Ext.util.JSON.decode(action.response.responseText);
          var success = obj.success;
          if (success) {
            window.close();
          } else {
            Ext.Msg.alert('Errore', obj.errors.reason);
          }
        }, failure:function(form, action) {
          if (action.failureType == 'server') {
            obj = Ext.util.JSON.decode(action.response.responseText);
            Ext.Msg.alert('Errore', obj.errors.reason);
          } else {
            Ext.Msg.alert('Errore', 'Server non raggiungibile: ' + action.response.responseText);
          }
        }});
      }
    });
  }
}, formBind:true, dock:'bottom', text:'Segnala'}, {xtype:'toolbar', dock:'top', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/associazioni.html', 'Help');
}, iconCls:'help'}]}]}]});
Ext.define('SIMFito.view.NuovaAziendaViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.nuovaazienda'});
Ext.define('SIMFito.view.NuovaAziendaViewController', {extend:Ext.app.ViewController, alias:'controller.nuovaazienda', onProvinciaSelect:function(combo, record, eOpts) {
  var provincia = record.get('provincia');
  var store = Ext.StoreMgr.get('ComuniStore');
  store.getProxy().setExtraParam('provincia', provincia);
  var comune = Ext.getCmp('comune');
  comune.setDisabled(false);
  if (store.isLoaded) {
    comune.clearValue();
    store.reload();
  }
}});
Ext.define('SIMFito.view.NuovaAzienda', {extend:Ext.window.Window, alias:'widget.nuovaazienda', controller:'nuovaazienda', viewModel:{type:'nuovaazienda'}, constrain:true, height:600, minHeight:600, minWidth:800, scrollable:true, width:800, layout:'fit', title:'Nuova Azienda', items:[{xtype:'form', scrollable:true, bodyPadding:10, url:'services/ajax-save-form.php', items:[{xtype:'combobox', validator:function(value) {
  var store = Ext.StoreMgr.get('FarmStore');
  var foundPosition = store.findExact('partita_iva', value);
  if (foundPosition == -1) {
    return true;
  } else {
    var record = store.getAt(foundPosition);
    var testo = 'Azienda gi\x26agrave; registarta:\x3cbr/\x3e\x26nbsp;\x26nbsp;\x26nbsp;\x26nbsp;Partia iva/CF: \x3cb\x3e' + record.get('partita_iva') + '\x3c/b\x3e\x3cbr/\x3e\x26nbsp;\x26nbsp;\x26nbsp;\x26nbsp;Ragione Sociale: \x3cb\x3e' + record.get('rag_soc') + '\x3c/b\x3e';
    return testo;
  }
}, anchor:'100%', id:'piva', fieldLabel:'Partita IVA/C.F.', msgTarget:'under', name:'piva', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', regex:/^([0-9]{11}|[A-Za-z]{6}[0-9]{2}[A-Za-z]{1}[0-9]{2}[A-Za-z]{1}[0-9]{3}[A-Za-z]{1})$/, autoLoadOnValue:true, displayField:'partita_iva', store:'FarmStore', valueField:'partita_iva'}, {xtype:'textfield', anchor:'100%', id:'ragionesociale', fieldLabel:'Ragione Sociale', msgTarget:'under', name:'ragionesociale', 
allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio'}, {xtype:'tagfield', anchor:'100%', id:'tipoazienda', fieldLabel:'Tipo', msgTarget:'under', name:'tipoazienda', allowBlank:false, displayField:'descrizione', hiddenName:'tipoazienda', store:'TipoaziendaStore', valueField:'id', encodeSubmitValue:true, filterPickList:true}, {xtype:'fieldset', title:'Indirizzo', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldcontainer', layout:{type:'hbox', 
align:'stretch'}, items:[{xtype:'textfield', flex:2, id:'indirizzo', fieldLabel:'Via', name:'indirizzo'}, {xtype:'numberfield', flex:1, id:'cap', fieldLabel:'C.A.P.', name:'cap'}]}, {xtype:'fieldcontainer', flex:1, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'combobox', flex:1, id:'provincia', fieldLabel:'Provincia', msgTarget:'under', name:'provincia', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', displayField:'provincia', forceSelection:true, 
hiddenName:'provincia', store:'ProvinceStore', valueField:'provincia', listeners:{select:'onProvinciaSelect'}}, {xtype:'combobox', flex:2, disabled:true, id:'comune', fieldLabel:'Comune', msgTarget:'under', name:'comune', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', selectOnFocus:true, displayField:'nome', forceSelection:true, hiddenName:'comune', store:'ComuniStore', valueField:'istat'}]}]}, {xtype:'fieldset', collapsible:true, title:'Dettagli', 
items:[{xtype:'textfield', anchor:'100%', id:'referente', fieldLabel:'Referente', name:'referente'}, {xtype:'textfield', anchor:'100%', id:'posizione_ref', fieldLabel:'Posizione Referente', name:'posizione_ref'}, {xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, id:'telefono', fieldLabel:'Telefono', name:'telefono'}, {xtype:'textfield', flex:1, id:'fax', fieldLabel:'Fax', name:'fax'}]}, {xtype:'textfield', anchor:'100%', id:'email', fieldLabel:'EMail', 
name:'email', vtype:'email'}]}, {xtype:'hiddenfield', anchor:'100%', id:'fase', name:'fase', value:'scheda-azienda'}, {xtype:'hiddenfield', anchor:'100%', id:'id_azienda', fieldLabel:'Label', name:'id_azienda', value:'-1'}, {xtype:'hiddenfield', anchor:'100%', id:'idTecnico', name:'idTecnico'}], dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form').getForm();
  form.reset();
}, text:'Reset'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form').getForm();
  Ext.getCmp('idTecnico').setValue(localStore.getItem('ID'));
  var window = button.up('window');
  if (form.isValid()) {
    form.submit({method:'POST', waitTitle:'Connessione', waitMsg:'Invio dei dati...', success:function(form, action) {
      var obj = Ext.util.JSON.decode(action.response.responseText);
      window.close();
      var idOsservazione = obj.returned;
      Ext.StoreMgr.get('AziendeStore').reload();
      Ext.StoreMgr.get('AziendeStore2').reload();
      Ext.Msg.alert('Info', 'Azienda registrata con successo!');
    }, failure:function(form, action) {
      switch(action.failureType) {
        case Ext.form.action.Action.CLIENT_INVALID:
          Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
          break;
        case Ext.form.action.Action.CONNECT_FAILURE:
          Ext.Msg.alert('Failure', 'Ajax communication failed');
          break;
        case Ext.form.action.Action.SERVER_INVALID:
          Ext.Msg.alert('Failure', action.result.errors.reason);
          break;
      }
    }});
  }
}, formBind:true, text:'Salva'}]}]}], dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/aziende.html#aggiungiazienda', 'Help');
}, iconCls:'help'}]}]});
Ext.define('SIMFito.view.NuovaSchdaWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.nuovaschdawindow'});
Ext.define('SIMFito.view.NuovaSchdaWindowViewController', {extend:Ext.app.ViewController, alias:'controller.nuovaschdawindow', onAziendaComboSelect:function(combo, record, eOpts) {
  var piva = record.get('partita_iva');
  var store = Ext.StoreMgr.get('SitiStore1');
  var sitiCombo = Ext.getCmp('sitiCombo');
  var aggiungiSito = Ext.getCmp('aggiungisito');
  sitiCombo.setValue(null);
  store.getProxy().setExtraParam('piva', piva);
  if (sitiCombo.isDisabled()) {
    sitiCombo.setDisabled(false);
    aggiungiSito.setDisabled(false);
  }
  store.reload();
}, onSitiComboSelect:function(combo, record, eOpts) {
  var geom = Ext.JSON.decode(record.get('geometry'), true);
  console.log(geom);
  if (geom.type == 'Point') {
    Ext.Msg.alert('Attenzione', 'Questo sito \x26egrave; rappresentato da un punto. Per poter essere usato dovrebbe essere ridisegnato come un Poligono');
  }
  if (record.get('tipologiasito_id') === null) {
    Ext.create('SIMFito.view.addtipologiasitoWindow').init(record.get('id'), record.get('denominazione'));
  }
  if (record.get('theme_id') === null) {
    Ext.getCmp('SIMFitoMotivo').clearValue();
    Ext.getCmp('SIMFitoMotivo').setDisabled(true);
    Ext.getCmp('cambiatema').clearValue();
  } else {
    var store = Ext.StoreMgr.get('TipologiasitiStore');
    store.getProxy().setExtraParam('theme', record.get('theme_id'));
    Ext.getCmp('SIMFitoMotivo').setDisabled(false);
    Ext.getCmp('cambiatema').setValue(record.get('theme_id'));
    Ext.getCmp('cambiatema').select(record.get('theme_id'));
    Ext.getCmp('SIMFitoMotivo').setValue(record.get('tipologiasito_id'));
  }
}, onMycomboboxSelect:function(combo, record, eOpts) {
  Ext.getCmp('SIMFitoMotivo').clearValue();
  var store = Ext.StoreMgr.get('TipologiasitiStore');
  store.getProxy().setExtraParam('theme', record.get('id'));
  store.reload();
  Ext.getCmp('SIMFitoMotivo').setDisabled();
}, onDatefieldAfterRender:function(component, eOpts) {
  component.setMinValue(new Date);
  var delay = localStore.getItem('scheda0001') !== null ? localStore.getItem('scheda0001') * 1 : 0;
  var toDay = new Date;
  var d = toDay.getDate();
  var minDate = toDay.setDate(d - delay);
  var maxDate = toDay;
  component.setMinValue(new Date(minDate));
  component.setMaxValue(new Date);
}, onFormAfterRender:function(component, eOpts) {
  component.getForm().setValues({idTecnico:localStore.getItem('ID')});
}});
Ext.define('SIMFito.view.NuovaSchdaWindow', {extend:Ext.window.Window, alias:'widget.nuovaschdawindow', controller:'nuovaschdawindow', viewModel:{type:'nuovaschdawindow'}, constrain:true, height:640, minHeight:480, minWidth:640, width:664, layout:'fit', collapsible:true, title:'Nuova Scheda', items:[{xtype:'form', scrollable:true, bodyPadding:10, url:'services/ajax-save-form.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', formBind:false, id:'aziendaCombo', fieldLabel:'Azienda', 
name:'partita_iva', invalidText:'Selezionare un\x26agrave;azienda', blankText:'Lascia vuoto', emptyText:"Scegli un'azienda o lascia vuoto", displayField:'rag_soc', forceSelection:true, hiddenName:'partita_iva', store:'AziendeStore2', valueField:'partita_iva', listeners:{select:'onAziendaComboSelect'}}, {xtype:'fieldcontainer', width:578, layout:{type:'hbox', align:'middle'}, items:[{xtype:'combobox', flex:3, formBind:false, disabled:true, id:'sitiCombo', resizable:false, width:308, fieldLabel:'Sito', 
msgTarget:'under', name:'id_sito', invalidText:'Selezionare un sito', blankText:'Campo obbligatorio', emptyText:'Scegli un sito', selectOnFocus:true, displayField:'denominazione', forceSelection:true, hiddenName:'id_sito', pageSize:100, store:'SitiStore1', valueField:'id', listeners:{select:'onSitiComboSelect'}}, {xtype:'displayfield', width:61, fieldLabel:'', value:'\x26nbsp;\x26nbsp;\x26nbsp;\x26nbsp;Oppure'}, {xtype:'button', handler:function(button, e) {
  var record = Ext.getCmp('aziendaCombo').getSelection();
  var idAzienda = record.get('id_azienda');
  var rsAzienda = record.get('rag_soc');
  var bbox = record.get('bbox');
  var piva = record.get('partita_iva');
  var dettagli = Ext.getCmp('dettagli');
  dettagli.setDisabled(false);
  dettagli.setTitle('Nuovo sito per l\x26apos;azienda ' + rsAzienda);
  if (Ext.getCmp('scheda') !== undefined) {
    Ext.getCmp('scheda').destroy();
  }
  if (Ext.getCmp('sito') !== undefined) {
    Ext.getCmp('sito').destroy();
  }
  var sito = Ext.create('SIMFito.view.SitiContainer', {userData:{'idAzienda':idAzienda, 'piva':piva, 'bbox':bbox}});
  var mscheda = Ext.getCmp('mainschedepanel');
  mscheda.add(sito);
  Ext.getCmp('mainpanel').setActiveItem('dettagli');
}, disabled:true, id:'aggiungisito', text:'Aggiungi Sito'}]}, {xtype:'fieldset', frame:false, title:'Modifica tipologia sito', items:[{xtype:'combobox', formBind:false, id:'cambiatema', itemId:'mycombobox', width:'99%', fieldLabel:'tema', msgTarget:'under', name:'theme', invalidText:'Selezionare un tema', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', autoLoadOnValue:true, displayField:'theme', store:'ThemeTSStore', valueField:'id', listeners:{select:'onMycomboboxSelect'}}, 
{xtype:'combobox', formBind:false, disabled:true, id:'SIMFitoMotivo', width:'99%', fieldLabel:'tipologia di sito', msgTarget:'under', name:'motivo', invalidText:'Selezionare una tipologia', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', autoLoadOnValue:true, displayField:'description', store:'TipologiasitiStore', valueField:'id'}]}, {xtype:'datefield', formBind:false, id:'datascheda', fieldLabel:'Data', msgTarget:'under', name:'data', 
invalidText:'Selezionare una data valida', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', validateBlank:true, format:'d/m/Y', listeners:{afterrender:'onDatefieldAfterRender'}}, {xtype:'textfield', flex:1, fieldLabel:'Protocollo', name:'protocollo'}, {xtype:'textareafield', flex:3, fieldLabel:'Note', name:'note'}, {xtype:'hiddenfield', flex:1, name:'fase', value:'scheda-generale'}, {xtype:'hiddenfield', flex:1, id:'idtecnico', name:'idTecnico'}], 
listeners:{afterrender:'onFormAfterRender'}, dockedItems:[{xtype:'toolbar', flex:1, dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form').getForm();
  if (form.isValid()) {
    form.submit({method:'POST', waitTitle:'Connessione', waitMsg:'Invio dei dati...', success:function(form, action) {
      var obj = Ext.util.JSON.decode(action.response.responseText);
      button.up('window').close();
      Ext.StoreMgr.get('SchedeStore').reload();
      Ext.Msg.alert('Info', 'Nuova scheda inizializzata con successo');
    }, failure:function(form, action) {
      switch(action.failureType) {
        case Ext.form.action.Action.CLIENT_INVALID:
          Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
          break;
        case Ext.form.action.Action.CONNECT_FAILURE:
          Ext.Msg.alert('Failure', 'Ajax communication failed');
          break;
        case Ext.form.action.Action.SERVER_INVALID:
          Ext.Msg.alert('Failure', action.result.errors.reason);
          break;
      }
    }});
  }
}, formBind:true, text:'Salva'}]}]}], dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/scheda.html#aggiungischeda', 'Help');
}, iconCls:'help'}]}]});
Ext.define('SIMFito.view.NuovoMotivoWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.nuovomotivowindow'});
Ext.define('SIMFito.view.NuovoMotivoWindow', {extend:Ext.window.Window, alias:'widget.nuovomotivowindow', viewModel:{type:'nuovomotivowindow'}, constrain:true, height:250, width:400, layout:'fit', title:'Aggiungi Motivo Ispezione', items:[{xtype:'form', bodyPadding:10, url:'services/ajax-save-form.php', items:[{xtype:'textfield', anchor:'100%', fieldLabel:'Motivo', labelAlign:'top', name:'motivo'}, {xtype:'hiddenfield', anchor:'100%', name:'fase', value:'nuovo_motivo'}], dockedItems:[{xtype:'button', 
handler:function(button, e) {
  var form = button.up('form').getForm();
  var window = button.up('window');
  if (form.isValid()) {
    form.submit({method:'POST', waitTitle:'Connessione', waitMsg:'Invio dei dati...', success:function(form, action) {
      var obj = Ext.util.JSON.decode(action.response.responseText);
      if (obj.success) {
        Ext.StoreMgr.get('MotivovisitaStore1').reload();
        window.close();
      } else {
        Ext.Msg.alert('Errore', obj.errors.reason);
      }
    }, failure:function(form, action) {
      switch(action.failureType) {
        case Ext.form.action.Action.CLIENT_INVALID:
          Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
          break;
        case Ext.form.action.Action.CONNECT_FAILURE:
          Ext.Msg.alert('Failure', 'Ajax communication failed');
          break;
        case Ext.form.action.Action.SERVER_INVALID:
          Ext.Msg.alert('Failure', action.result.errors.reason);
          break;
      }
    }});
  }
}, dock:'bottom', text:'Aggiungi'}]}]});
Ext.define('SIMFito.view.NuovoMotivoWindowViewModel1', {extend:Ext.app.ViewModel, alias:'viewmodel.nuovotipoaziendawindow'});
Ext.define('SIMFito.view.NuovoMotivoWindowViewModel2', {extend:Ext.app.ViewModel, alias:'viewmodel.nuovotipocampionewindow'});
Ext.define('SIMFito.view.NuovoMotivoWindowViewModel3', {extend:Ext.app.ViewModel, alias:'viewmodel.nuovotipotrappolawindow'});
Ext.define('SIMFito.view.NuovoTipoCampioneWindow', {extend:Ext.window.Window, alias:'widget.nuovotipocampionewindow', viewModel:{type:'nuovotipocampionewindow'}, constrain:true, height:250, width:400, layout:'fit', title:'Aggiungi Tipo Serie Campione', items:[{xtype:'form', bodyPadding:10, url:'services/ajax-save-form.php', items:[{xtype:'textfield', anchor:'100%', fieldLabel:'Tipo Serie Campione', labelAlign:'top', name:'tipocampione'}, {xtype:'hiddenfield', anchor:'100%', name:'fase', value:'nuovo_tipocampione'}], 
dockedItems:[{xtype:'button', handler:function(button, e) {
  var form = button.up('form').getForm();
  var window = button.up('window');
  if (form.isValid()) {
    form.submit({method:'POST', waitTitle:'Connessione', waitMsg:'Invio dei dati...', success:function(form, action) {
      var obj = Ext.util.JSON.decode(action.response.responseText);
      if (obj.success) {
        Ext.StoreMgr.get('TipoCampioneStoreAll').reload();
        window.close();
      } else {
        Ext.Msg.alert('Errore', obj.errors.reason);
      }
    }, failure:function(form, action) {
      switch(action.failureType) {
        case Ext.form.action.Action.CLIENT_INVALID:
          Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
          break;
        case Ext.form.action.Action.CONNECT_FAILURE:
          Ext.Msg.alert('Failure', 'Ajax communication failed');
          break;
        case Ext.form.action.Action.SERVER_INVALID:
          Ext.Msg.alert('Failure', action.result.errors.reason);
          break;
      }
    }});
  }
}, dock:'bottom', text:'Aggiungi'}]}]});
Ext.define('SIMFito.view.NuovoTipoTrappolaWindow', {extend:Ext.window.Window, alias:'widget.nuovotipotrappolawindow', viewModel:{type:'nuovotipotrappolawindow'}, constrain:true, height:250, width:400, layout:'fit', title:'Aggiungi Motivo Ispezione', items:[{xtype:'form', bodyPadding:10, baseParams:{fase:'add_tipotrappola'}, url:'services/ajax-save-form.php', items:[{xtype:'textfield', anchor:'100%', fieldLabel:'Descrizione (Italiano)', labelAlign:'top', name:'descrizione', allowBlank:false, allowOnlyWhitespace:false}, 
{xtype:'textfield', anchor:'100%', fieldLabel:'Descrizione (Inglese)', labelAlign:'top', name:'description', allowBlank:false, allowOnlyWhitespace:false}], dockedItems:[{xtype:'button', handler:function(button, e) {
  var form = button.up('form').getForm();
  var window = button.up('window');
  if (form.isValid()) {
    form.submit({method:'POST', waitTitle:'Connessione', waitMsg:'Invio dei dati...', success:function(form, action) {
      var obj = Ext.util.JSON.decode(action.response.responseText);
      if (obj.success) {
        Ext.StoreMgr.get('tipoTrappoleAllStore').reload();
        window.close();
      } else {
        Ext.Msg.alert('Errore', obj.errors.reason);
      }
    }, failure:function(form, action) {
      switch(action.failureType) {
        case Ext.form.action.Action.CLIENT_INVALID:
          Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
          break;
        case Ext.form.action.Action.CONNECT_FAILURE:
          Ext.Msg.alert('Failure', 'Ajax communication failed');
          break;
        case Ext.form.action.Action.SERVER_INVALID:
          Ext.Msg.alert('Failure', action.result.errors.reason);
          break;
      }
    }});
  }
}, dock:'bottom', text:'Aggiungi'}]}]});
Ext.define('SIMFito.view.NuovoTipoaziendaWindow', {extend:Ext.window.Window, alias:'widget.nuovotipoaziendawindow', viewModel:{type:'nuovotipoaziendawindow'}, constrain:true, height:250, width:400, layout:'fit', title:'Aggiungi Tipo Azienda', items:[{xtype:'form', bodyPadding:10, url:'services/ajax-save-form.php', items:[{xtype:'textfield', anchor:'100%', fieldLabel:'Tipo', labelAlign:'top', name:'tipo'}, {xtype:'hiddenfield', anchor:'100%', name:'fase', value:'nuovo_tipo_azienda'}], dockedItems:[{xtype:'button', 
handler:function(button, e) {
  var form = button.up('form').getForm();
  var window = button.up('window');
  if (form.isValid()) {
    form.submit({method:'POST', waitTitle:'Connessione', waitMsg:'Invio dei dati...', success:function(form, action) {
      var obj = Ext.util.JSON.decode(action.response.responseText);
      if (obj.success) {
        Ext.StoreMgr.get('TipoaziendaallStore').reload();
      } else {
        Ext.Msg.alert('Errore', obj.errors.reason);
      }
    }, failure:function(form, action) {
      switch(action.failureType) {
        case Ext.form.action.Action.CLIENT_INVALID:
          Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
          break;
        case Ext.form.action.Action.CONNECT_FAILURE:
          Ext.Msg.alert('Failure', 'Ajax communication failed');
          break;
        case Ext.form.action.Action.SERVER_INVALID:
          Ext.Msg.alert('Failure', action.result.errors.reason);
          break;
      }
    }});
  }
}, dock:'bottom', text:'Aggiungi'}]}]});
Ext.define('SIMFito.view.OfficialEUReportsWinViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.officialeureportswin'});
Ext.define('SIMFito.view.OfficialEUReportsWin', {extend:Ext.window.Window, alias:'widget.officialeureportswin', viewModel:{type:'officialeureportswin'}, height:600, width:800, layout:'fit', iconCls:'fas fa-clipboard', title:'Report UE Ufficiali', items:[{xtype:'gridpanel', scrollable:true, autoLoad:true, store:'officialuestore', columns:[{xtype:'numbercolumn', dataIndex:'id', text:'ID', tooltip:'ID', format:'000'}, {xtype:'numbercolumn', dataIndex:'anno', text:'Anno', tooltip:'Anno', format:'0000', 
filter:{type:'number'}}, {xtype:'gridcolumn', flex:1, dataIndex:'owner_name', text:'Utente', tooltip:'Utente', filter:{type:'string'}}, {xtype:'gridcolumn', flex:1, dataIndex:'fullfilename', text:'Nome file', tooltip:'Nome file', filter:{type:'string'}}, {xtype:'datecolumn', dataIndex:'date', text:'Date', tooltip:'Data', filter:{type:'date'}}, {xtype:'actioncolumn', text:'Azioni', tooltip:'Azioni', items:[{handler:function(view, rowIndex, colIndex, item, e, record, row) {
  location.href = urlPrefix + 'services/manage_reports.php?mode\x3dget\x26id\x3d' + record.get('id');
}, iconCls:'fas fa-download', tooltip:'Scarica'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  Ext.Msg.show({title:'Elimina report', message:'Confermare l\x26apos;eliminazione del report id: ' + record.get('id'), buttons:Ext.Msg.YESNOCANCEL, icon:Ext.Msg.QUESTION, fn:function(btn) {
    if (btn === 'yes') {
      Ext.Ajax.request({url:'services/manage_reports.php', params:{mode:'delete', id:record.get('id')}, success:function(response, opts) {
        Ext.StoreMgr.get('officialuestore').reload();
      }, failure:function(response, opts) {
        console.log('server-side failure with status code ' + response.status);
      }});
    } else {
      if (btn === 'no') {
        console.log('No pressed');
      } else {
        console.log('Cancel pressed');
      }
    }
  }});
}, iconCls:'fas fa-trash', tooltip:'Elimina'}]}], dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.officialUELoadWin').show();
}, text:'Carica', tooltip:'Carica'}, {xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  button.up('grid').getStore().reload();
}, iconCls:'fas fa-redo-alt', text:'Reload', tooltip:'reload'}]}], plugins:[{ptype:'gridfilters'}]}]});
Ext.define('SIMFito.view.PerParassitaWindowViewModel11', {extend:Ext.app.ViewModel, alias:'viewmodel.parassitacatturatonelwindow'});
Ext.define('SIMFito.view.PerParassitaWindowViewController11', {extend:Ext.app.ViewController, alias:'controller.parassitacatturatonelwindow', onComboboxSelect:function(combo, record, eOpts) {
}});
Ext.define('SIMFito.view.ParassitaCatturatoNelWindow', {extend:Ext.window.Window, alias:'widget.parassitacatturatonelwindow', controller:'parassitacatturatonelwindow', viewModel:{type:'parassitacatturatonelwindow'}, constrain:true, height:278, scrollable:true, width:571, layout:'fit', title:'Trappole attive nel periodo', dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('window').down('form');
  if (form.isValid()) {
    var treeStore = Ext.StoreManager.get('DatasetTreeStore');
    var root = treeStore.getRoot();
    if (!root.isExpanded()) {
      root.expand();
    }
    var pestcode = Ext.getCmp('bufferpestcode11').getValue();
    var start = Ext.Date.format(Ext.getCmp('start11').getValue(), 'Ymd');
    var end = Ext.Date.format(Ext.getCmp('end11').getValue(), 'Ymd');
    var title = 'Positivi per: ' + pestcode + ' dal ' + start + ' al ' + end;
    var variables = {title:title, pestcode:pestcode, start:start, end:end};
    var leaf = createElabElement(13, variables);
    var branch = treeStore.getById('elaborazioni');
    var form = button.up('window').down('form');
    if (form.isValid()) {
      extraLayerFromLeaf(leaf, 1);
      branch.appendChild(leaf);
    }
    var title = 'Positivi per: ' + pestcode + ' dal ' + start + ' al ' + end + ' per comune';
    var variables = {title:title, pestcode:pestcode, start:start, end:end};
    var leaf = createElabElement(14, variables);
    var branch = treeStore.getById('elaborazioni');
    var form = button.up('window').down('form');
    if (form.isValid()) {
      extraLayerFromLeaf(leaf, 1);
      branch.appendChild(leaf);
    }
  }
}, text:'Esegui'}, {xtype:'button', handler:function(button, e) {
  console.log(button);
  button.up('window').close();
}, text:'Chiudi'}]}], items:[{xtype:'form', flex:1, scrollable:true, bodyPadding:5, url:'services/ajax.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldset', flex:1, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', anchor:'95%', id:'bufferpestcode11', fieldLabel:'Parassita', labelAlign:'top', name:'code', allowBlank:false, allowOnlyWhitespace:false, displayField:'name', store:'ParassitiStore2', valueField:'pestcode', listeners:{select:'onComboboxSelect'}}, {xtype:'fieldcontainer', 
defaults:{padding:'2'}, layout:'hbox', items:[{xtype:'datefield', flex:1, id:'start11', fieldLabel:'Da', labelAlign:'top', name:'start', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'datefield', flex:1, id:'end11', fieldLabel:'A', labelAlign:'top', name:'end', allowBlank:false, allowOnlyWhitespace:false}]}]}]}], inizialize:function() {
}});
Ext.define('SIMFito.view.PerParassitaWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.perparassitawindow'});
Ext.define('SIMFito.view.PerParassitaWindowViewController', {extend:Ext.app.ViewController, alias:'controller.perparassitawindow', onComboboxSelect:function(combo, record, eOpts) {
  var start = Ext.getCmp('start');
  var end = Ext.getCmp('end');
  start.setValue(record.get('start'));
  end.setValue(record.get('end'));
  start.setDisabled(false);
  end.setDisabled(false);
}, onComboboxSelect1:function(combo, record, eOpts) {
  Ext.getCmp('tipologiasitox1').clearValue();
  Ext.getCmp('tipologiasitox1').setDisabled(true);
  var store = Ext.StoreManager.get('TipologiasitiStore1');
  store.getProxy().setExtraParam('theme', record.get('id'));
  store.load();
  Ext.getCmp('tipologiasitox1').setDisabled(false);
}, onComboboxChange:function(field, newValue, oldValue, eOpts) {
  Ext.getCmp('tipologiasitox1').clearValue();
  Ext.getCmp('tipologiasitox1').setDisabled(true);
}});
Ext.define('SIMFito.view.PerParassitaWindow', {extend:Ext.window.Window, alias:'widget.perparassitawindow', controller:'perparassitawindow', viewModel:{type:'perparassitawindow'}, constrain:true, height:480, scrollable:true, width:640, layout:'anchor', title:'Buffers per parassita', dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('window').down('form');
  if (form.isValid()) {
    var treeStore = Ext.StoreManager.get('DatasetTreeStore');
    var root = treeStore.getRoot();
    if (!root.isExpanded()) {
      root.expand();
    }
    var pestcode = Ext.getCmp('bufferpestcode').getValue();
    var start = Ext.Date.format(Ext.getCmp('start').getValue(), 'Ymd');
    var end = Ext.Date.format(Ext.getCmp('end').getValue(), 'Ymd');
    var buffer1 = Ext.getCmp('buffer0').getValue();
    var buffer2 = Ext.getCmp('buffer1').getValue();
    var buffer3 = Ext.getCmp('buffer2').getValue();
    var tipoSito = Ext.getCmp('tipologiasitox1').getValue();
    var title = 'Aree infestate per: ' + pestcode + ' dal ' + start + ' al ' + end;
    if (tipoSito != null) {
      title += ' (' + Ext.getCmp('tipologiasitox1').getRawValue() + ')';
    }
    var variables = {title:title, pestcode:pestcode, start:start, end:end, buffer1:buffer1, buffer2:buffer2, buffer3:buffer3, tiposito:tipoSito};
    var leaf = createElabElement(0, variables);
    extraLayerFromLeaf(leaf);
    var branch = treeStore.getById('elaborazioni');
    branch.appendChild(leaf);
    var leafSiti = createElabElement(6, variables);
    extraLayerFromLeaf(leafSiti, 1);
    branch.appendChild(leafSiti);
  }
}, text:'Esegui'}, {xtype:'button', handler:function(button, e) {
  button.up('window').close();
}, text:'Chiudi'}]}], items:[{xtype:'form', flex:1, scrollable:true, bodyPadding:5, url:'services/ajax.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldset', flex:1, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', anchor:'95%', id:'bufferpestcode', fieldLabel:'Parassita', labelAlign:'top', name:'code', allowBlank:false, allowOnlyWhitespace:false, displayField:'name', forceSelection:true, store:'ParassitiStore1', valueField:'pestcode', listeners:{select:'onComboboxSelect'}}, 
{xtype:'fieldcontainer', flex:1, defaults:{padding:'2'}, layout:'hbox', items:[{xtype:'datefield', flex:1, disabled:true, id:'start', fieldLabel:'Da', labelAlign:'top', name:'start', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'datefield', flex:1, disabled:true, id:'end', fieldLabel:'A', labelAlign:'top', name:'end', allowBlank:false, allowOnlyWhitespace:false}]}, {xtype:'combobox', flex:1, fieldLabel:'Tema Tipologia Sito', labelAlign:'top', blankText:'Lasciare vuoto per tutti i tipi di sito', 
emptyText:'Lasciare vuoto per tutti i tipi di sito', displayField:'theme', store:'ThemeTSStore1', valueField:'id', listeners:{select:'onComboboxSelect1', change:'onComboboxChange'}}, {xtype:'combobox', flex:1, disabled:true, id:'tipologiasitox1', fieldLabel:'Tipologia Sito', labelAlign:'top', name:'tipologiasito', displayField:'description', store:'TipologiasitiStore1', valueField:'id'}]}, {xtype:'fieldset', flex:2, checkbox:{name:'zone'}, checkboxToggle:true, collapsed:true, title:'Zone', items:[{xtype:'numberfield', 
anchor:'100%', id:'buffer0', fieldLabel:'Raggio zona infestata [m]', labelAlign:'top', name:'buffer0', value:1000, allowDecimals:false, allowExponential:false, decimalPrecision:0, minValue:0}, {xtype:'numberfield', anchor:'100%', id:'buffer1', fieldLabel:'Raggio zona tampone [m]', labelAlign:'top', name:'buffer1', value:5000, allowDecimals:false, allowExponential:false, minValue:0}, {xtype:'numberfield', anchor:'100%', id:'buffer2', fieldLabel:'Raggio zona di contenimento [m]', labelAlign:'top', 
name:'buffer2', value:10000, allowDecimals:false, allowExponential:false, minValue:0}]}, {xtype:'hiddenfield', flex:1, fieldLabel:'Label', name:'mode', value:'multibuffer'}, {xtype:'hiddenfield', flex:1, fieldLabel:'Label', name:'type', value:'pest'}, {xtype:'hiddenfield', flex:1, id:'prv', fieldLabel:'Label', name:'prv', value:null}]}], inizialize:function() {
  Ext.getCmp('prv').setValue(localStore.getItem('Provincia'));
}});
Ext.define('SIMFito.view.PerParassitaWindowViewController1', {extend:Ext.app.ViewController, alias:'controller.presenzaparassitiwindow', onComboboxSelect:function(combo, record, eOpts) {
  var start = Ext.getCmp('start1');
  var end = Ext.getCmp('end1');
  start.setValue(record.get('start'));
  start.setMinValue(record.get('start'));
  end.setValue(record.get('end'));
  end.setMaxValue(record.get('end'));
  start.setDisabled(false);
  end.setDisabled(false);
}, onComboboxSelect1:function(combo, record, eOpts) {
  Ext.getCmp('tipologiasitox2').clearValue();
  Ext.getCmp('tipologiasitox2').setDisabled(true);
  var store = Ext.StoreManager.get('TipologiasitiStore1');
  store.getProxy().setExtraParam('theme', record.get('id'));
  store.load();
  Ext.getCmp('tipologiasitox2').setDisabled(false);
}, onComboboxChange:function(field, newValue, oldValue, eOpts) {
  Ext.getCmp('tipologiasitox2').clearValue();
  Ext.getCmp('tipologiasitox2').setDisabled(true);
}});
Ext.define('SIMFito.view.PerParassitaWindowViewController10', {extend:Ext.app.ViewController, alias:'controller.trappoleattivenelwindow', onComboboxSelect:function(combo, record, eOpts) {
}});
Ext.define('SIMFito.view.PerParassitaWindowViewController3', {extend:Ext.app.ViewController, alias:'controller.presenzaparassitiwindow1', onComboboxSelect:function(combo, record, eOpts) {
  var start = Ext.getCmp('start3');
  var end = Ext.getCmp('end3');
  start.setValue(record.get('start'));
  start.setMinValue(record.get('start'));
  end.setValue(record.get('end'));
  end.setMaxValue(record.get('end'));
  start.setDisabled(false);
  end.setDisabled(false);
}, onComboboxSelect1:function(combo, record, eOpts) {
  Ext.getCmp('tipologiasitox4').clearValue();
  Ext.getCmp('tipologiasitox4').setDisabled(true);
  var store = Ext.StoreManager.get('TipologiasitiStore1');
  store.getProxy().setExtraParam('theme', record.get('id'));
  store.load();
  Ext.getCmp('tipologiasitox4').setDisabled(false);
}, onComboboxChange:function(field, newValue, oldValue, eOpts) {
  Ext.getCmp('tipologiasitox4').clearValue();
  Ext.getCmp('tipologiasitox4').setDisabled(true);
}});
Ext.define('SIMFito.view.PerParassitaWindowViewController4', {extend:Ext.app.ViewController, alias:'controller.presenzaparassitiwindow2', onComboboxSelect:function(combo, record, eOpts) {
  var start = Ext.getCmp('start4');
  var end = Ext.getCmp('end4');
  var incidence = Ext.getCmp('incidence');
  start.setValue(record.get('start'));
  start.setMinValue(record.get('start'));
  end.setValue(record.get('end'));
  end.setMaxValue(record.get('end'));
  start.setDisabled(false);
  end.setDisabled(false);
  incidence.setDisabled(false);
}, onComboboxSelect1:function(combo, record, eOpts) {
  Ext.getCmp('tipologiasitox5').clearValue();
  Ext.getCmp('tipologiasitox5').setDisabled(true);
  var store = Ext.StoreManager.get('TipologiasitiStore1');
  store.getProxy().setExtraParam('theme', record.get('id'));
  store.load();
  Ext.getCmp('tipologiasitox5').setDisabled(false);
}, onComboboxChange:function(field, newValue, oldValue, eOpts) {
  Ext.getCmp('tipologiasitox5').clearValue();
  Ext.getCmp('tipologiasitox5').setDisabled(true);
}});
Ext.define('SIMFito.view.PerParassitaWindowViewController5', {extend:Ext.app.ViewController, alias:'controller.presenzaparassitiwindow3', onComboboxSelect:function(combo, record, eOpts) {
  var start = Ext.getCmp('start5');
  var end = Ext.getCmp('end5');
  var incidence = Ext.getCmp('incidence1');
  start.setValue(record.get('start'));
  start.setMinValue(record.get('start'));
  end.setValue(record.get('end'));
  end.setMaxValue(record.get('end'));
  start.setDisabled(false);
  end.setDisabled(false);
  incidence.setDisabled(false);
}, onMycombobox13Select1:function(combo, record, eOpts) {
  Ext.getCmp('tipologiasitox6').clearValue();
  Ext.getCmp('tipologiasitox6').setDisabled(true);
  var store = Ext.StoreManager.get('TipologiasitiStore1');
  store.getProxy().setExtraParam('theme', record.get('id'));
  store.load();
  Ext.getCmp('tipologiasitox6').setDisabled(false);
}, onMycombobox13Change:function(field, newValue, oldValue, eOpts) {
  Ext.getCmp('tipologiasitox6').clearValue();
  Ext.getCmp('tipologiasitox6').setDisabled(true);
}});
Ext.define('SIMFito.view.PerParassitaWindowViewController6', {extend:Ext.app.ViewController, alias:'controller.presenzaparassitiwindow4', onComboboxSelect:function(combo, record, eOpts) {
  var start = Ext.getCmp('start6');
  var end = Ext.getCmp('end6');
  start.setValue(record.get('start'));
  start.setMinValue(record.get('start'));
  end.setValue(record.get('end'));
  end.setMaxValue(record.get('end'));
  start.setDisabled(false);
  end.setDisabled(false);
}, onComboboxSelect1:function(combo, record, eOpts) {
  Ext.getCmp('tipologiasitox3').clearValue();
  Ext.getCmp('tipologiasitox3').setDisabled(true);
  var store = Ext.StoreManager.get('TipologiasitiStore1');
  store.getProxy().setExtraParam('theme', record.get('id'));
  store.load();
  Ext.getCmp('tipologiasitox3').setDisabled(false);
}, onComboboxChange:function(field, newValue, oldValue, eOpts) {
  Ext.getCmp('tipologiasitox3').clearValue();
  Ext.getCmp('tipologiasitox3').setDisabled(true);
}});
Ext.define('SIMFito.view.PerParassitaWindowViewController7', {extend:Ext.app.ViewController, alias:'controller.presenzaparassitiwindow5', onComboboxSelect:function(combo, record, eOpts) {
}});
Ext.define('SIMFito.view.PerParassitaWindowViewController8', {extend:Ext.app.ViewController, alias:'controller.trappolealwindow', onComboboxSelect:function(combo, record, eOpts) {
}});
Ext.define('SIMFito.view.PerParassitaWindowViewController9', {extend:Ext.app.ViewController, alias:'controller.trappoleposizionatenelwindow', onComboboxSelect:function(combo, record, eOpts) {
}});
Ext.define('SIMFito.view.PerParassitaWindowViewModel1', {extend:Ext.app.ViewModel, alias:'viewmodel.presenzaparassitiwindow'});
Ext.define('SIMFito.view.PerParassitaWindowViewModel10', {extend:Ext.app.ViewModel, alias:'viewmodel.trappoleattivenelwindow'});
Ext.define('SIMFito.view.PerParassitaWindowViewModel3', {extend:Ext.app.ViewModel, alias:'viewmodel.presenzaparassitiwindow1'});
Ext.define('SIMFito.view.PerParassitaWindowViewModel4', {extend:Ext.app.ViewModel, alias:'viewmodel.presenzaparassitiwindow2'});
Ext.define('SIMFito.view.PerParassitaWindowViewModel5', {extend:Ext.app.ViewModel, alias:'viewmodel.presenzaparassitiwindow3'});
Ext.define('SIMFito.view.PerParassitaWindowViewModel6', {extend:Ext.app.ViewModel, alias:'viewmodel.presenzaparassitiwindow4'});
Ext.define('SIMFito.view.PerParassitaWindowViewModel7', {extend:Ext.app.ViewModel, alias:'viewmodel.presenzaparassitiwindow5'});
Ext.define('SIMFito.view.PerParassitaWindowViewModel8', {extend:Ext.app.ViewModel, alias:'viewmodel.trappolealwindow'});
Ext.define('SIMFito.view.PerParassitaWindowViewModel9', {extend:Ext.app.ViewModel, alias:'viewmodel.trappoleposizionatenelwindow'});
Ext.define('SIMFito.view.PestWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.pestwindow'});
Ext.define('SIMFito.view.PestWindow', {extend:Ext.window.Window, alias:'widget.pestwindow', viewModel:{type:'pestwindow'}, constrain:true, height:480, minHeight:480, minWidth:640, width:640, layout:'fit', title:'Agenti nocivi', items:[{xtype:'gridpanel', autoLoad:true, store:'PestStore', columns:[{xtype:'gridcolumn', flex:1, dataIndex:'pest_name', text:'Parassita'}, {xtype:'gridcolumn', flex:1, dataIndex:'class', text:'Classe'}, {xtype:'gridcolumn', flex:1, dataIndex:'baycode_pest', text:'Bayer Code'}, 
{xtype:'gridcolumn', flex:1, dataIndex:'priority', text:'Priorit\x26agrave;'}], selModel:{selType:'checkboxmodel'}, dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/osservazioni.html#nuovaosservazione', 'Help');
}, iconCls:'help'}]}]}], dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var grid = button.up('window').down('grid');
  var organismi = grid.getSelection();
  var idpests = '';
  var coma = '';
  for (var i = 0; i < organismi.length; i++) {
    coma = i > 0 ? ',' : '';
    idpests += coma + organismi[i].data.pest_id;
  }
  var id_tecnico = localStore.getItem('ID');
  var nScheda = button.up('window').userData.idScheda;
  var hostId = button.up('window').userData.hostId;
  var params = {fase:'pestobs', idtecnico:id_tecnico, host:hostId, idscheda:nScheda, id_pest:idpests};
  Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:params, success:function(resp) {
    Ext.WindowMgr.get('hosts').close();
    button.up('window').close();
    Ext.StoreMgr.get('OsservazioniStore').reload();
  }, failure:function(response, opts) {
    console.error('server-side failure with status code ' + response.status);
  }});
}, text:'Usa Selezionati'}]}]});
Ext.define('SIMFito.view.PresenzaparassitiWindow', {extend:Ext.window.Window, alias:'widget.presenzaparassitiwindow', controller:'presenzaparassitiwindow', viewModel:{type:'presenzaparassitiwindow'}, constrain:true, height:480, scrollable:true, width:640, layout:'fit', title:'Punti monitorati per parassita', dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('window').down('form');
  if (form.isValid()) {
    var treeStore = Ext.StoreManager.get('DatasetTreeStore');
    var root = treeStore.getRoot();
    if (!root.isExpanded()) {
      root.expand();
    }
    var pestcode = Ext.getCmp('bufferpestcode1').getValue();
    var start = Ext.Date.format(Ext.getCmp('start1').getValue(), 'Ymd');
    var end = Ext.Date.format(Ext.getCmp('end1').getValue(), 'Ymd');
    var tipoSito = Ext.getCmp('tipologiasitox2').getValue();
    var title = 'Punti monitorate per: ' + pestcode + ' dal ' + start + ' al ' + end;
    var comune = Ext.getCmp('PuntiPerParassitaComune').getValue();
    if (comune != null) {
      title += ' Comune: ' + Ext.getCmp('PuntiPerParassitaComune').getRawValue();
    }
    if (tipoSito != null) {
      title += ' (' + Ext.getCmp('tipologiasitox2').getRawValue() + ')';
    }
    var variables = {title:title, pestcode:pestcode, start:start, end:end, tiposito:tipoSito, comune:comune};
    var leaf = createElabElement(1, variables);
    extraLayerFromLeaf(leaf, 1);
    var branch = treeStore.getById('elaborazioni');
    branch.appendChild(leaf);
    var leafSiti = createElabElement(7, variables);
    extraLayerFromLeaf(leafSiti, 1);
    branch.appendChild(leafSiti);
  }
}, text:'Esegui'}, {xtype:'button', handler:function(button, e) {
  console.log(button);
  button.up('window').close();
}, text:'Chiudi'}]}], items:[{xtype:'form', flex:1, scrollable:true, bodyPadding:5, url:'services/ajax.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldset', flex:1, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', anchor:'95%', id:'bufferpestcode1', fieldLabel:'Parassita', labelAlign:'top', name:'code', allowBlank:false, allowOnlyWhitespace:false, displayField:'name', store:'ParassitiStore', valueField:'pestcode', listeners:{select:'onComboboxSelect'}}, {xtype:'fieldcontainer', 
defaults:{padding:'2'}, layout:'hbox', items:[{xtype:'datefield', flex:1, disabled:true, id:'start1', fieldLabel:'Da', labelAlign:'top', name:'start', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'datefield', flex:1, disabled:true, id:'end1', fieldLabel:'A', labelAlign:'top', name:'end', allowBlank:false, allowOnlyWhitespace:false}]}, {xtype:'combobox', flex:1, id:'PuntiPerParassitaComune', fieldLabel:'Comune', labelAlign:'top', name:'comune', displayField:'nome', store:'ComuniStore', valueField:'istat'}, 
{xtype:'combobox', fieldLabel:'Tema Tipologia Sito', labelAlign:'top', blankText:'Lasciare vuoto per tutti i tipi di sito', emptyText:'Lasciare vuoto per tutti i tipi di sito', displayField:'theme', store:'ThemeTSStore1', valueField:'id', listeners:{select:'onComboboxSelect1', change:'onComboboxChange'}}, {xtype:'combobox', disabled:true, id:'tipologiasitox2', fieldLabel:'Tipologia Sito', labelAlign:'top', name:'tipologiasito', displayField:'description', store:'TipologiasitiStore1', valueField:'id'}]}, 
{xtype:'hiddenfield', flex:1, fieldLabel:'Label', name:'mode', value:'multibuffer'}, {xtype:'hiddenfield', flex:1, fieldLabel:'Label', name:'type', value:'pest'}, {xtype:'hiddenfield', flex:1, id:'prv1', fieldLabel:'Label', name:'prv', value:null}]}], inizialize:function() {
  Ext.getCmp('prv1').setValue(localStore.getItem('Provincia'));
}});
Ext.define('SIMFito.view.PresenzaparassitiWindow1', {extend:Ext.window.Window, alias:'widget.presenzaparassitiwindow1', controller:'presenzaparassitiwindow1', viewModel:{type:'presenzaparassitiwindow1'}, constrain:true, height:480, scrollable:true, width:640, layout:'fit', title:'Comuni monitorati per parassita', dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('window').down('form');
  if (form.isValid()) {
    var treeStore = Ext.StoreManager.get('DatasetTreeStore');
    var root = treeStore.getRoot();
    if (!root.isExpanded()) {
      root.expand();
    }
    var pestcode = Ext.getCmp('bufferpestcode3').getValue();
    var start = Ext.Date.format(Ext.getCmp('start3').getValue(), 'Ymd');
    var end = Ext.Date.format(Ext.getCmp('end3').getValue(), 'Ymd');
    var tipoSito = Ext.getCmp('tipologiasitox4').getValue();
    var title = 'Comuni monitorate per: ' + pestcode + ' dal ' + start + ' al ' + end;
    if (tipoSito != null) {
      title += ' (' + Ext.getCmp('tipologiasitox4').getRawValue() + ')';
    }
    var variables = {title:title, pestcode:pestcode, start:start, end:end, tiposito:tipoSito};
    var leaf = createElabElement(2, variables);
    extraLayerFromLeaf(leaf);
    var branch = treeStore.getById('elaborazioni');
    branch.appendChild(leaf);
    var leafSiti = createElabElement(8, variables);
    extraLayerFromLeaf(leafSiti, 1);
    branch.appendChild(leafSiti);
  }
}, text:'Esegui'}, {xtype:'button', handler:function(button, e) {
  console.log(button);
  button.up('window').close();
}, text:'Chiudi'}]}], items:[{xtype:'form', flex:1, scrollable:true, bodyPadding:5, url:'services/ajax.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldset', flex:1, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', anchor:'95%', id:'bufferpestcode3', fieldLabel:'Parassita', labelAlign:'top', name:'code', allowBlank:false, allowOnlyWhitespace:false, displayField:'name', store:'ParassitiStore', valueField:'pestcode', listeners:{select:'onComboboxSelect'}}, {xtype:'fieldcontainer', 
defaults:{padding:'2'}, layout:'hbox', items:[{xtype:'datefield', flex:1, disabled:true, id:'start3', fieldLabel:'Da', labelAlign:'top', name:'start', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'datefield', flex:1, disabled:true, id:'end3', fieldLabel:'A', labelAlign:'top', name:'end', allowBlank:false, allowOnlyWhitespace:false}]}, {xtype:'combobox', fieldLabel:'Tema Tipologia Sito', labelAlign:'top', blankText:'Lasciare vuoto per tutti i tipi di sito', emptyText:'Lasciare vuoto per tutti i tipi di sito', 
displayField:'theme', store:'ThemeTSStore1', valueField:'id', listeners:{select:'onComboboxSelect1', change:'onComboboxChange'}}, {xtype:'combobox', disabled:true, id:'tipologiasitox4', fieldLabel:'Tipologia Sito', labelAlign:'top', displayField:'description', store:'TipologiasitiStore1', valueField:'id'}]}, {xtype:'hiddenfield', flex:1, fieldLabel:'Label', name:'mode', value:'multibuffer'}, {xtype:'hiddenfield', flex:1, fieldLabel:'Label', name:'type', value:'pest'}, {xtype:'hiddenfield', flex:1, 
id:'prv3', fieldLabel:'Label', name:'prv', value:null}]}], inizialize:function() {
  Ext.getCmp('prv3').setValue(localStore.getItem('Provincia'));
}});
Ext.define('SIMFito.view.PresenzaparassitiWindow2', {extend:Ext.window.Window, alias:'widget.presenzaparassitiwindow2', controller:'presenzaparassitiwindow2', viewModel:{type:'presenzaparassitiwindow2'}, constrain:true, height:480, scrollable:true, width:640, layout:'fit', title:'Parassiti con area d\x26apos;incidenza', dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('window').down('form');
  if (form.isValid()) {
    var treeStore = Ext.StoreManager.get('DatasetTreeStore');
    var root = treeStore.getRoot();
    if (!root.isExpanded()) {
      root.expand();
    }
    var pestcode = Ext.getCmp('bufferpestcode4').getValue();
    var start = Ext.Date.format(Ext.getCmp('start4').getValue(), 'Ymd');
    var end = Ext.Date.format(Ext.getCmp('end4').getValue(), 'Ymd');
    var incidence = Ext.getCmp('incidence').getValue();
    var tipoSito = Ext.getCmp('tipologiasitox5').getValue();
    var title = 'Comuni monitorate per: ' + pestcode + ' dal ' + start + ' al ' + end;
    if (tipoSito != null) {
      title += ' (' + Ext.getCmp('tipologiasitox5').getRawValue() + ')';
    }
    var variables = {title:title, pestcode:pestcode, start:start, end:end, incidence:incidence, tiposito:tipoSito};
    var leaf = createElabElement(3, variables);
    extraLayerFromLeaf(leaf);
    var branch = treeStore.getById('elaborazioni');
    branch.appendChild(leaf);
    var leafSiti = createElabElement(8, variables);
    extraLayerFromLeaf(leafSiti, 1);
    branch.appendChild(leafSiti);
  }
}, text:'Esegui'}, {xtype:'button', handler:function(button, e) {
  console.log(button);
  button.up('window').close();
}, text:'Chiudi'}]}], items:[{xtype:'form', flex:1, scrollable:true, bodyPadding:5, url:'services/ajax.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldset', flex:1, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', anchor:'95%', id:'bufferpestcode4', fieldLabel:'Parassita', labelAlign:'top', name:'code', allowBlank:false, allowOnlyWhitespace:false, displayField:'name', store:'ParassitiStore1', valueField:'pestcode', listeners:{select:'onComboboxSelect'}}, {xtype:'fieldcontainer', 
flex:0, defaults:{padding:'2'}, layout:'hbox', items:[{xtype:'datefield', flex:1, disabled:true, id:'start4', fieldLabel:'Da', labelAlign:'top', name:'start', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'datefield', flex:1, disabled:true, id:'end4', fieldLabel:'A', labelAlign:'top', name:'end', allowBlank:false, allowOnlyWhitespace:false}]}, {xtype:'fieldcontainer', width:400, layout:'hbox', items:[{xtype:'numberfield', flex:1, disabled:true, id:'incidence', fieldLabel:"Area d'incidenza [m]", 
labelAlign:'top', value:1000, allowBlank:false, allowOnlyWhitespace:false, allowExponential:false}]}, {xtype:'combobox', fieldLabel:'Tema Tipologia Sito', labelAlign:'top', blankText:'Lasciare Vuoto per tutti i tipi di sito', emptyText:'Lasciare Vuoto per tutti i tipi di sito', displayField:'theme', store:'ThemeTSStore1', valueField:'theme', listeners:{select:'onComboboxSelect1', change:'onComboboxChange'}}, {xtype:'combobox', flex:1, disabled:true, id:'tipologiasitox5', fieldLabel:'Tipologia Sito', 
labelAlign:'top', displayField:'description', store:'TipologiasitiStore1', valueField:'id'}]}, {xtype:'hiddenfield', flex:1, fieldLabel:'Label', name:'mode', value:'multibuffer'}, {xtype:'hiddenfield', flex:1, fieldLabel:'Label', name:'type', value:'pest'}, {xtype:'hiddenfield', flex:1, id:'prv4', fieldLabel:'Label', name:'prv', value:null}]}], inizialize:function() {
  Ext.getCmp('prv4').setValue(localStore.getItem('Provincia'));
}});
Ext.define('SIMFito.view.PresenzaparassitiWindow3', {extend:Ext.window.Window, alias:'widget.presenzaparassitiwindow3', controller:'presenzaparassitiwindow3', viewModel:{type:'presenzaparassitiwindow3'}, constrain:true, height:480, scrollable:true, width:640, layout:'fit', title:'Parassiti con incidenza comunale', dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('window').down('form');
  if (form.isValid()) {
    var treeStore = Ext.StoreManager.get('DatasetTreeStore');
    var root = treeStore.getRoot();
    if (!root.isExpanded()) {
      root.expand();
    }
    var pestcode = Ext.getCmp('bufferpestcode5').getValue();
    var start = Ext.Date.format(Ext.getCmp('start5').getValue(), 'Ymd');
    var end = Ext.Date.format(Ext.getCmp('end5').getValue(), 'Ymd');
    var incidence = Ext.getCmp('incidence1').getValue();
    var tipoSito = Ext.getCmp('tipologiasitox6').getValue();
    var title = 'Comuni per siti con area di incidenza per: ' + pestcode + ' dal ' + start + ' al ' + end;
    if (tipoSito != null) {
      title += ' (' + Ext.getCmp('tipologiasitox6').getRawValue() + ')';
    }
    var variables = {title:title, pestcode:pestcode, start:start, end:end, incidence:incidence, tiposito:tipoSito};
    var leaf = createElabElement(4, variables);
    extraLayerFromLeaf(leaf);
    var branch = treeStore.getById('elaborazioni');
    branch.appendChild(leaf);
    var leafSiti = createElabElement(8, variables);
    extraLayerFromLeaf(leafSiti, 1);
    branch.appendChild(leafSiti);
  }
}, text:'Esegui'}, {xtype:'button', handler:function(button, e) {
  console.log(button);
  button.up('window').close();
}, text:'Chiudi'}]}], items:[{xtype:'form', flex:1, scrollable:true, bodyPadding:5, url:'services/ajax.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldset', flex:1, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', anchor:'95%', id:'bufferpestcode5', fieldLabel:'Parassita', labelAlign:'top', name:'code', allowBlank:false, allowOnlyWhitespace:false, displayField:'name', store:'ParassitiStore1', valueField:'pestcode', listeners:{select:'onComboboxSelect'}}, {xtype:'fieldcontainer', 
flex:0, defaults:{padding:'2'}, layout:'hbox', items:[{xtype:'datefield', flex:1, disabled:true, id:'start5', fieldLabel:'Da', labelAlign:'top', name:'start', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'datefield', flex:1, disabled:true, id:'end5', fieldLabel:'A', labelAlign:'top', name:'end', allowBlank:false, allowOnlyWhitespace:false}]}, {xtype:'fieldcontainer', width:400, layout:'hbox', items:[{xtype:'numberfield', flex:1, disabled:true, id:'incidence1', fieldLabel:"Area d'incidenza [m]", 
labelAlign:'top', value:1000, allowBlank:false, allowOnlyWhitespace:false, allowExponential:false}]}, {xtype:'combobox', itemId:'mycombobox13', fieldLabel:'Tema Tipologia Sito', labelAlign:'top', blankText:'Lasciare vuoto per tutti i tipi di sito', emptyText:'Lasciare vuoto per tutti i tipi di sito', displayField:'theme', store:'ThemeTSStore1', valueField:'id', listeners:{select:'onMycombobox13Select1', change:'onMycombobox13Change'}}, {xtype:'combobox', disabled:true, id:'tipologiasitox6', fieldLabel:'Tipologia Sito', 
labelAlign:'top', displayField:'description', store:'TipologiasitiStore1', valueField:'id'}]}, {xtype:'hiddenfield', flex:1, fieldLabel:'Label', name:'mode', value:'multibuffer'}, {xtype:'hiddenfield', flex:1, fieldLabel:'Label', name:'type', value:'pest'}, {xtype:'hiddenfield', flex:1, id:'prv5', fieldLabel:'Label', name:'prv', value:null}]}], inizialize:function() {
  Ext.getCmp('prv5').setValue(localStore.getItem('Provincia'));
}});
Ext.define('SIMFito.view.PresenzaparassitiWindow4', {extend:Ext.window.Window, alias:'widget.presenzaparassitiwindow4', controller:'presenzaparassitiwindow4', viewModel:{type:'presenzaparassitiwindow4'}, constrain:true, height:480, scrollable:true, width:640, layout:'fit', title:'Punti monitorati per parassita', dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('window').down('form');
  if (form.isValid()) {
    var treeStore = Ext.StoreManager.get('DatasetTreeStore');
    var root = treeStore.getRoot();
    if (!root.isExpanded()) {
      root.expand();
    }
    var pestcode = Ext.getCmp('bufferpestcode6').getValue();
    var start = Ext.Date.format(Ext.getCmp('start6').getValue(), 'Ymd');
    var end = Ext.Date.format(Ext.getCmp('end6').getValue(), 'Ymd');
    var tipoSito = Ext.getCmp('tipologiasitox3').getValue();
    var title = 'Punti monitorati con parassita presente per: ' + pestcode + ' dal ' + start + ' al ' + end;
    var comune = Ext.getCmp('PuntiPerParassitaComune4').getValue();
    console.log(comune);
    if (comune != null) {
      title += ' Comune: ' + Ext.getCmp('PuntiPerParassitaComune4').getRawValue();
    }
    if (tipoSito != null) {
      title += ' (' + Ext.getCmp('tipologiasitox3').getRawValue() + ')';
    }
    var variables = {title:title, pestcode:pestcode, start:start, end:end, tiposito:tipoSito, comune:comune};
    var leaf = createElabElement(5, variables);
    extraLayerFromLeaf(leaf, 1);
    var branch = treeStore.getById('elaborazioni');
    branch.appendChild(leaf);
    var leafSiti = createElabElement(8, variables);
    extraLayerFromLeaf(leafSiti, 1);
    branch.appendChild(leafSiti);
  }
}, text:'Esegui'}, {xtype:'button', handler:function(button, e) {
  console.log(button);
  button.up('window').close();
}, text:'Chiudi'}]}], items:[{xtype:'form', flex:1, scrollable:true, bodyPadding:5, url:'services/ajax.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldset', flex:1, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', anchor:'95%', id:'bufferpestcode6', fieldLabel:'Parassita', labelAlign:'top', name:'code', allowBlank:false, allowOnlyWhitespace:false, displayField:'name', store:'ParassitiStore', valueField:'pestcode', listeners:{select:'onComboboxSelect'}}, {xtype:'fieldcontainer', 
defaults:{padding:'2'}, layout:'hbox', items:[{xtype:'datefield', flex:1, disabled:true, id:'start6', fieldLabel:'Da', labelAlign:'top', name:'start', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'datefield', flex:1, disabled:true, id:'end6', fieldLabel:'A', labelAlign:'top', name:'end', allowBlank:false, allowOnlyWhitespace:false}]}, {xtype:'combobox', flex:1, id:'PuntiPerParassitaComune4', fieldLabel:'Comune', labelAlign:'top', displayField:'nome', store:'ComuniStore', valueField:'istat'}, 
{xtype:'combobox', fieldLabel:'Tema Tipologia Sito', labelAlign:'top', blankText:'Lasciare vuoto per tutti i tipi di sito', emptyText:'Lasciare vuoto per tutti i tipi di sito', displayField:'theme', store:'ThemeTSStore1', valueField:'id', listeners:{select:'onComboboxSelect1', change:'onComboboxChange'}}, {xtype:'combobox', disabled:true, id:'tipologiasitox3', fieldLabel:'Tipologia Sito', labelAlign:'top', displayField:'description', store:'TipologiasitiStore1', valueField:'id'}]}, {xtype:'hiddenfield', 
flex:1, fieldLabel:'Label', name:'mode', value:'multibuffer'}, {xtype:'hiddenfield', flex:1, fieldLabel:'Label', name:'type', value:'pest'}, {xtype:'hiddenfield', flex:1, id:'prv6', fieldLabel:'Label', name:'prv', value:null}]}], inizialize:function() {
  Ext.getCmp('prv6').setValue(localStore.getItem('Provincia'));
}});
Ext.define('SIMFito.view.PresenzaparassitiWindow5', {extend:Ext.window.Window, alias:'widget.presenzaparassitiwindow5', controller:'presenzaparassitiwindow5', viewModel:{type:'presenzaparassitiwindow5'}, constrain:true, height:337, scrollable:true, width:601, layout:'fit', title:'Trappole per parassiti', dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('window').down('form');
  if (form.isValid()) {
    var treeStore = Ext.StoreManager.get('DatasetTreeStore');
    var root = treeStore.getRoot();
    if (!root.isExpanded()) {
      root.expand();
    }
    var pestcode = Ext.getCmp('bufferpestcode7').getValue();
    var start = Ext.Date.format(Ext.getCmp('start7').getValue(), 'Ymd');
    var end = Ext.Date.format(Ext.getCmp('end7').getValue(), 'Ymd');
    var title = 'Trappole per: ' + pestcode + ' dal ' + start + ' al ' + end;
    var com = Ext.getCmp('trapReportParassitiComune').getValue();
    var comunefilt = 'true';
    var comune = '';
    if (com.length > 0) {
      for (var i in com) {
        if (i > 0) {
          var coma = '\\,';
        } else {
          coma = '';
        }
        comune += coma + "'" + com[i] + "'";
      }
      comunefilt = 'false';
      title += ' (' + comune + ')';
    } else {
      comune = "'-1'";
      title += ' (Tutti i comuni)';
    }
    console.log(comune);
    var variables = {title:title, pestcode:pestcode, start:start, end:end, comune:comune, comunefilt:comunefilt};
    var leaf = createElabElement(9, variables);
    var branch = treeStore.getById('elaborazioni');
    var form = button.up('window').down('form');
    if (form.isValid()) {
      extraLayerFromLeaf(leaf, 1);
      branch.appendChild(leaf);
    }
  }
}, text:'Esegui'}, {xtype:'button', handler:function(button, e) {
  console.log(button);
  button.up('window').close();
}, text:'Chiudi'}]}], items:[{xtype:'form', flex:1, scrollable:true, bodyPadding:5, url:'services/ajax.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldset', flex:1, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', anchor:'95%', id:'bufferpestcode7', fieldLabel:'Parassita', labelAlign:'top', name:'code', allowBlank:false, allowOnlyWhitespace:false, displayField:'name', store:'ParassitiStore2', valueField:'pestcode', listeners:{select:'onComboboxSelect'}}, {xtype:'tagfield', 
flex:1, id:'trapReportParassitiComune', fieldLabel:'Comune', labelAlign:'top', name:'comune', displayField:'nome', store:'ComuniStore', valueField:'istat', encodeSubmitValue:true}, {xtype:'fieldcontainer', defaults:{padding:'2'}, layout:'hbox', items:[{xtype:'datefield', flex:1, id:'start7', fieldLabel:'Da', labelAlign:'top', name:'start', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'datefield', flex:1, id:'end7', fieldLabel:'A', labelAlign:'top', name:'end', allowBlank:false, allowOnlyWhitespace:false}]}]}, 
{xtype:'hiddenfield', flex:1, fieldLabel:'Label', name:'mode', value:'multibuffer'}, {xtype:'hiddenfield', flex:1, fieldLabel:'Label', name:'type', value:'pest'}, {xtype:'hiddenfield', flex:1, id:'prv7', fieldLabel:'Label', name:'prv', value:null}]}], inizialize:function() {
}});
Ext.define('SIMFito.view.RigettoWindowViewModel1', {extend:Ext.app.ViewModel, alias:'viewmodel.protocollowindow'});
Ext.define('SIMFito.view.RigettoWindowViewController1', {extend:Ext.app.ViewController, alias:'controller.protocollowindow', onFormBeforeRender:function(component, eOpts) {
  var record = component.up('window').record;
  var protocollo = record.get('protocollo');
  component.baseParams.idscheda = record.get('idscheda');
  if (protocollo.trim() == '' || protocollo == null) {
  } else {
    Ext.getCmp('SIMFitoProtocolloW').setValue(protocollo);
  }
}});
Ext.define('SIMFito.view.ProtocolloWindow', {extend:Ext.window.Window, alias:'widget.protocollowindow', controller:'protocollowindow', viewModel:{type:'protocollowindow'}, constrain:true, height:166, id:'protocolloWindow', width:415, layout:'fit', title:'Protocollo', items:[{xtype:'form', bodyPadding:10, baseParams:{fase:'update_protocollo', idscheda:null}, url:'services/ajax-save-form.php', items:[{xtype:'textfield', anchor:'100%', id:'SIMFitoProtocolloW', fieldLabel:'Protocollo', labelAlign:'top', 
name:'protocollo', allowBlank: false, allowOnlyWhitespace:false}], dockedItems:[{xtype:'button', handler:function(button, e) {
  var win = button.up('window');
  var form = button.up('form');
  if (form.isValid()) {
    form.getForm().submit({submitEmptyText:false, method:'POST', waitTitle:'Connessione', waitMsg:'Invio dei dati...', success:function(form, action) {
      var result = action.result;
      if (result.success) {
        Ext.StoreMgr.get('SchedeStore').reload();
        win.close();
        Ext.Msg.alert('Successo', 'Protocollo modificato con successo!');
      } else {
        Ext.Msg.alert('ERRORE', result.errors.reason);
      }
    }, failure:function(form, action) {
      if (action.failureType == 'server') {
        var obj = Ext.util.JSON.decode(action.response.responseText);
        Ext.Msg.alert('Errore!', obj.errors.reason);
      } else {
        Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
      }
    }});
  }
}, dock:'bottom', text:'Salva'}], listeners:{beforerender:'onFormBeforeRender'}}]});
Ext.define('SIMFito.view.RecuperoWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.recuperowindow'});
Ext.define('SIMFito.view.RecuperoWindow', {extend:Ext.window.Window, alias:'widget.recuperowindow', viewModel:{type:'recuperowindow'}, constrain:true, height:250, width:400, layout:'fit', title:'Recupera Credenziali', items:[{xtype:'form', scrollable:true, bodyPadding:10, url:'services/login.php', items:[{xtype:'textfield', anchor:'100%', fieldLabel:'Codice Fiscale', msgTarget:'under', name:'codicefiscale', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'hiddenfield', anchor:'100%', name:'mode', 
value:'pswresend'}], dockedItems:[{xtype:'button', handler:function(button, e) {
  var form = button.up('form').getForm();
  if (form.isValid()) {
    form.submit({method:'POST', waitTitle:'Connecting', waitMsg:'Sending data...', success:function(form, action) {
      obj = Ext.util.JSON.decode(action.response.responseText);
      var success = obj.success;
      if (success) {
        Ext.Msg.alert('Info', "La informazioni saranno spedite all'indirizzo email registrato!");
      } else {
        Ext.Msg.alert('Login Fallito', obj.errors.reason);
      }
    }, failure:function(form, action) {
      if (action.failureType == 'server') {
        obj = Ext.util.JSON.decode(action.response.responseText);
        Ext.Msg.alert('Login Fallito!', obj.errors.reason);
      } else {
        Ext.Msg.alert('Attenzione!', 'Server non raggiungibile: ' + action.response.responseText);
      }
    }});
  }
}, dock:'bottom', text:'Invia Richiesta'}]}], dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/passworddimenticata.html', 'Help');
}, iconCls:'help'}]}]});
Ext.define('SIMFito.view.RefertiWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.refertiwindow'});
Ext.define('SIMFito.view.RefertiWindow', {extend:Ext.window.Window, alias:'widget.refertiwindow', viewModel:{type:'refertiwindow'}, constrain:true, height:600, width:800, layout:'fit', title:'Referti', items:[{xtype:'gridpanel', scrollable:true, autoLoad:true, store:'RefertiStore', columns:[{xtype:'datecolumn', flex:2, dataIndex:'datareport', text:'Data Referto', format:'d/m/Y'}, {xtype:'gridcolumn', dataIndex:'codice', text:'Codice Campione', filter:{type:'string'}}, {xtype:'numbercolumn', flex:1, 
dataIndex:'idscheda', text:'id scheda', format:'0', filter:{type:'number'}}, {xtype:'datecolumn', flex:2, dataIndex:'data_sopralluogo', text:'Data Sopralluogo', format:'d/m/Y'}, {xtype:'gridcolumn', flex:2, dataIndex:'tecnici', text:'Tecnico/i'}, {xtype:'gridcolumn', flex:2, hidden:true, dataIndex:'azienda', text:'Azienda'}, {xtype:'gridcolumn', flex:2, hidden:true, dataIndex:'sito', text:'sito'}, {xtype:'gridcolumn', flex:2, hidden:true, dataIndex:'comune', text:'Comune'}, {xtype:'actioncolumn', 
text:'Azioni', items:[{handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var reportId = record.get('report_id');
  var url = simfitoLabUrl + 'services/report.php?mode\x3dpdf\x26table\x3dreport\x26idv\x3d' + reportId;
  console.log(url);
  window.open(url, '_blank');
}, iconCls:'pdf'}]}], plugins:[{ptype:'gridfilters'}]}], dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'services/ajax.php?mode\x3dreferti\x26sub\x3dxls\x26idTecnico\x3d' + localStore.getItem('ID'), '_blanck');
}, iconCls:'x-fa fa-download', text:'Exporta xls'}]}]});
Ext.define('SIMFito.view.ReportsWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.reportswindow'});
Ext.define('SIMFito.view.ReportsWindowViewController', {extend:Ext.app.ViewController, alias:'controller.reportswindow', onWindowBeforeRender:function(component, eOpts) {
  Ext.StoreManager.get('reportsStores').getProxy().setExtraParam('tipoTecnico', localStore.getItem('TipoUtente'));
  Ext.StoreMgr.get('reportsStores').getProxy().setExtraParam('idTecnico', localStore.getItem('ID'));
  Ext.StoreManager.get('reportsStores').reload();
  if (localStore.getItem('TipoUtente') * 1 >= 2) {
    Ext.getCmp('reportue').setDisabled(true);
    Ext.getCmp('reportue').setHidden(true);
  }
  if (localStore.getItem('TipoUtente') * 1 == 1) {
    Ext.getCmp('reportue').setDisabled(true);
    Ext.getCmp('reportue').setHidden(true);
  }
  if (localStore.getItem('TipoUtente') * 1 == 0) {
    Ext.getCmp('reportue').setDisabled(false);
    Ext.getCmp('reportue').setHidden(false);
  }
  task = reportsRunner.start({run:function() {
    Ext.StoreManager.get('reportsStores').reload();
  }, interval:30000});
}, onWindowClose:function(panel, eOpts) {
  reportsRunner.stop(task);
}});
Ext.define('SIMFito.view.ReportsWindow', {extend:Ext.window.Window, alias:'widget.reportswindow', controller:'reportswindow', viewModel:{type:'reportswindow'}, height:600, width:800, layout:'fit', title:'Report', dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'button', handler:function(button, e) {
  var uid = localStore.getItem('ID');
  var uty = localStore.getItem('TipoUtente');
  var upr = localStore.getItem('Provincia');
  Ext.create('SIMFito.view.TableWindow').init({uid:uid, uty:uty, upr:upr});
}, text:'Report Generale'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.UEReportWindow').show();
}, id:'reportue', text:'Report UE'}, {xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.EuroPhitWindow').show();
}, id:'reportue1', text:'EuroPhyt'}, {xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  Ext.StoreManager.get('reportsStores').reload();
}, iconCls:'fas fa-redo-alt', text:'Ricarica', tooltip:'Ricarica'}]}], items:[{xtype:'gridpanel', store:'reportsStores', viewConfig:{scrollable:true}, columns:[{xtype:'numbercolumn', width:50, dataIndex:'id', text:'ID', format:'000'}, {xtype:'gridcolumn', dataIndex:'owner_name', text:'Utente'}, {xtype:'gridcolumn', flex:1, dataIndex:'name', text:'Report'}, {xtype:'datecolumn', hidden:true, dataIndex:'date', text:'Data', format:'d/m/Y'}, {xtype:'gridcolumn', renderer:function(value, metaData, record, 
rowIndex, colIndex, store, view) {
  if (value == null) {
    return '';
  } else {
    return value.split('.')[0];
  }
}, flex:1, dataIndex:'runstart', text:'Inizio\x3cbr/\x3eesecuzione'}, {xtype:'gridcolumn', renderer:function(value, metaData, record, rowIndex, colIndex, store, view) {
  if (value == null) {
    return '';
  } else {
    return value.split('.')[0];
  }
}, flex:1, dataIndex:'runend', text:'fine\x3cbr/\x3eesecuzione'}, {xtype:'gridcolumn', dataIndex:'statoreport_descrizione', text:'stato'}, {xtype:'actioncolumn', width:60, text:'Azioni', items:[{isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  if (record.get('statoreport_id') == '2') {
    return false;
  } else {
    return true;
  }
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('id');
  var url = urlPrefix + 'services/ajax.php?mode\x3dreportsdownload\x26id\x3d' + id;
  window.open(url, '_blank');
}, iconCls:'download', tooltip:'Scarica'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('id');
  Ext.MessageBox.confirm('Conferma', 'Cancellare il report id: ' + id + ' ?\x3cbr/\x3e\x3cb\x3eN.b. L\x26apos;operazione non potr\x26agrave; essere annullata!\x3c/b\x3e', function(btn) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax.php', method:'POST', params:{mode:'reportsdelete', id:id}, success:function(resp) {
        Ext.StoreManager.get('reportsStores').reload();
      }, failure:function(response, opts) {
        console.error('server-side failure with status code ' + response.status);
      }});
    }
  });
}, isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  if (record.get('statoreport_id') == '1') {
    return true;
  } else {
    return false;
  }
}, iconCls:'delete', tooltip:'Elimina'}]}], plugins:[{ptype:'rowexpander', rowBodyTpl:['\x3cp\x3e\x3cb\x3eDettagli: \x3c/b\x3e{query}\x3c/p\x3e']}]}], listeners:{beforerender:'onWindowBeforeRender', close:'onWindowClose'}});
Ext.define('SIMFito.view.RichiestaWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.richiestawindow'});
Ext.define('SIMFito.view.RichiestaWindowViewController', {extend:Ext.app.ViewController, alias:'controller.richiestawindow', onComboboxChange:function(field, newValue, oldValue, eOpts) {
  var provincia = Ext.getCmp('provinciaAdmin');
  if (newValue == 1) {
    provincia.setDisabled(false);
  } else {
    if (!provincia.isDisabled()) {
      provincia.clearValue();
      provincia.setDisabled(true);
    }
  }
}, onWindowBeforeRender:function(component, eOpts) {
  var toDay = new Date;
  var maxDate = new Date(toDay.getFullYear() - 18, toDay.getMonth(), toDay.getDay());
  Ext.getCmp('nascita').setMaxValue(maxDate);
}});
Ext.define('SIMFito.view.RichiestaWindow', {extend:Ext.window.Window, alias:'widget.richiestawindow', controller:'richiestawindow', viewModel:{type:'richiestawindow'}, constrain:true, height:710, width:800, layout:'fit', title:'Richiesta Credenziali', items:[{xtype:'form', scrollable:true, bodyPadding:7, url:'services/login.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldset', flex:2, flex:1, title:'Informazioni Generali', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldcontainer', 
width:400, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, fieldLabel:'Nome', labelAlign:'right', labelWidth:120, name:'nome', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'textfield', flex:1, fieldLabel:'Cognome', labelAlign:'right', labelWidth:120, name:'cognome', allowBlank:false, allowOnlyWhitespace:false}]}, {xtype:'fieldcontainer', width:400, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, fieldLabel:'Codice Fiscale', labelAlign:'right', 
labelWidth:120, name:'codicefiscale', allowBlank:false, allowOnlyWhitespace:false, regex:/^(?:[B-DF-HJ-NP-TV-Z](?:[AEIOU]{2}|[AEIOU]X)|[AEIOU]{2}X|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[1256LMRS][\dLMNP-V])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[\dLMNP-V][1-9MNP-V]|[1-9MNP-V][0L]))[A-Z]$/i}, {xtype:'combobox', flex:1, fieldLabel:'Sesso', labelAlign:'right', labelWidth:120, name:'sesso', allowBlank:false, allowOnlyWhitespace:false, 
displayField:'descrizione', store:'SessoStore', valueField:'id'}]}, {xtype:'fieldcontainer', width:400, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, fieldLabel:'Comune di Nascita', labelAlign:'right', labelWidth:120, name:'comune_nascita'}, {xtype:'datefield', flex:1, id:'nascita', fieldLabel:'Data di Nascita', labelAlign:'right', labelWidth:120, name:'data_nascita', format:'d/m/Y'}]}]}, {xtype:'fieldset', flex:2, flex:1, title:'Recapiti', layout:{type:'vbox', align:'stretch'}, 
items:[{xtype:'fieldcontainer', width:400, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, fieldLabel:'Indirizzo', labelAlign:'right', labelWidth:120, name:'residenza_indirizzo', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'textfield', flex:1, fieldLabel:'Comune Residenza', labelAlign:'right', labelWidth:120, name:'residenza_comune', allowBlank:false, allowOnlyWhitespace:false}]}, {xtype:'fieldcontainer', width:400, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', 
flex:1, fieldLabel:'Telefono Fisso', labelAlign:'right', labelWidth:120, name:'telefono', allowBlank:false, allowOnlyWhitespace:false, regex:/^[0-9]{5,10}$/}, {xtype:'textfield', flex:1, fieldLabel:'Telefono Mobile', labelAlign:'right', labelWidth:120, name:'mobile', regex:/^[0-9]{5,10}$/}]}, {xtype:'fieldcontainer', width:400, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, fieldLabel:'Email', labelAlign:'right', labelWidth:120, name:'email', allowBlank:false, allowOnlyWhitespace:false, 
vtype:'email'}, {xtype:'textfield', flex:1, fieldLabel:'Pagina Web', labelAlign:'right', labelWidth:120, name:'web', vtype:'url'}]}]}, {xtype:'fieldset', flex:1, flex:1, title:'Informazioni Professionali', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldcontainer', width:400, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, fieldLabel:'Ente/Libero Prof.', labelAlign:'right', labelWidth:120, name:'ufficio', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'textfield', 
flex:1, fieldLabel:'Titolo di Studio', labelAlign:'right', labelWidth:120, name:'titolo'}]}, {xtype:'fieldcontainer', width:400, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, fieldLabel:'Capo Ufficio', labelAlign:'right', labelWidth:120, name:'cap_ufficio'}]}, {xtype:'fieldcontainer', width:400, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'combobox', flex:1, fieldLabel:'Tipo Tecnico', labelAlign:'right', labelWidth:120, name:'idtipo_tecnico', allowBlank:false, 
allowOnlyWhitespace:false, displayField:'tipotecnico', store:'TipoTecnicoStore', valueField:'idtipo_tecnico', listeners:{change:'onComboboxChange'}}, {xtype:'combobox', disabled:true, flex:1, id:'provinciaAdmin', fieldLabel:'Provincia', labelAlign:'right', labelWidth:120, name:'id', allowBlank:false, allowOnlyWhitespace:false, displayField:'provincia', store:'ProvinceStore', valueField:'id'}]}]}, {xtype:'hiddenfield', flex:1, name:'mode', value:'newuser'}], dockedItems:[{xtype:'toolbar', flex:1, 
dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form');
  form.reset();
}, text:'Svuota'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form');
  if (form.isValid()) {
    form.submit({method:'POST', waitTitle:'Connecting', waitMsg:'Sending data...', success:function(form, action) {
      obj = Ext.util.JSON.decode(action.response.responseText);
      var success = obj.success;
      if (success) {
        Ext.Msg.alert('Info', 'La richiesta \x26egrave; stata memorizzata correttamente!');
      } else {
        Ext.Msg.alert('Login Fallito', obj.errors.reason);
      }
    }, failure:function(form, action) {
      if (action.failureType == 'server') {
        obj = Ext.util.JSON.decode(action.response.responseText);
        Ext.Msg.alert('Login Fallito!', obj.errors.reason);
      } else {
        Ext.Msg.alert('Attenzione!', 'Server non raggiungibile: ' + action.response.responseText);
      }
    }});
  }
}, text:'Invia'}]}, {xtype:'toolbar', flex:1, dock:'top', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/richiestacredenziali.html', 'Help');
}, iconCls:'help'}]}]}], listeners:{beforerender:'onWindowBeforeRender'}});
Ext.define('SIMFito.view.RigettoWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.rigettowindow'});
Ext.define('SIMFito.view.RigettoWindow', {extend:Ext.window.Window, alias:'widget.rigettowindow', viewModel:{type:'rigettowindow'}, constrain:true, height:250, width:400, layout:'fit', title:'Motivo di Rigetto', items:[{xtype:'form', bodyPadding:10, url:'services/ajax-save-form.php', items:[{xtype:'textareafield', anchor:'100%', id:'motivorigetto', fieldLabel:'Motivo di rigetto', labelAlign:'top', name:'motivo', allowBlank:false}, {xtype:'hiddenfield', id:'idschedarigettata', fieldLabel:'Label', 
name:'id_scheda'}, {xtype:'hiddenfield', anchor:'100%', name:'fase', value:'valida-scheda'}, {xtype:'hiddenfield', anchor:'100%', name:'validazione', value:'-1'}], dockedItems:[{xtype:'button', handler:function(button, e) {
  var win = button.up('window');
  var form = button.up('form');
  if (form.isValid()) {
    form.getForm().submit({submitEmptyText:false, method:'POST', waitTitle:'Connessione', waitMsg:'Invio dei dati...', success:function(form, action) {
      var result = action.result;
      if (result.success) {
        Ext.StoreMgr.get('SchedeStore').reload();
        win.close();
      } else {
        Ext.Msg.alert('ERRORE', result.errors.reason);
      }
    }, failure:function(form, action) {
      if (action.failureType == 'server') {
        var obj = Ext.util.JSON.decode(action.response.responseText);
        Ext.Msg.alert('Errore!', obj.errors.reason);
      } else {
        Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
      }
    }});
  }
}, dock:'bottom', text:'Rigetta'}]}], init:function(idscheda) {
  Ext.getCmp('idschedarigettata').setValue(idscheda);
  this.setTitle(this.getTitle() + ' (schda id:' + Ext.getCmp('idschedarigettata').getValue() + ')');
  this.show();
}});
Ext.define('SIMFito.view.RimuoviTecnicoWindow', {extend:Ext.window.Window, alias:'widget.rimuovitecnicowindow', controller:'rimuovitecnicowindow', viewModel:{type:'rimuovitecnicowindow'}, constrain:true, height:480, id:'associatecnico1', minHeight:480, minWidth:640, width:800, layout:'fit', title:'Associa Tecnici', items:[{xtype:'gridpanel', autoLoad:true, store:'RimuoviTecniciStore', columns:[{xtype:'gridcolumn', flex:2, dataIndex:'nome', text:'Nome', tooltip:'Nome'}, {xtype:'gridcolumn', flex:1, 
dataIndex:'tipotecnico', text:'Tipo Tecnico', tooltip:'Tipo Tecnico'}, {xtype:'gridcolumn', flex:2, dataIndex:'codicefiscale', text:'Codice Fiscale', tooltip:'Codice Fiscale'}, {xtype:'gridcolumn', flex:2, dataIndex:'ufficio', text:'Ufficio', tooltip:'Ufficio'}, {xtype:'gridcolumn', flex:2, dataIndex:'email', text:'Email', tooltip:'Email'}], selModel:{selType:'checkboxmodel'}}], dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var selected = button.up('window').down('grid').getSelection();
  var idscheda = button.up('window').userData.idscheda;
  var couples = [];
  if (selected.length > 0) {
    for (var i = 0; i < selected.length; i++) {
      couples.push({idscheda:idscheda, id_tecnico:selected[i].get('id_tecnico')});
    }
  }
  var url = 'services/ajax-save-form.php';
  var params = {fase:'rimuovi_tecnici', tecnici:Ext.util.JSON.encode(couples)};
  Ext.Ajax.request({url:url, method:'POST', params:params, success:function(response, opts) {
    var obj = Ext.util.JSON.decode(response.responseText);
    if (obj.success) {
      Ext.StoreMgr.get('SchedeStore').reload();
      Ext.Msg.alert('Info', 'Tecnici disassociati con successo');
      button.up('window').close();
    } else {
      Ext.Msg.alert('Errore', obj.errors.reason);
    }
  }, failure:function(response, opts) {
    if (opts.failureType == 'server') {
      var obj = Ext.util.JSON.decode(opts.response.responseText);
      Ext.Msg.alert('Errore!', obj.errors.reason);
    } else {
      Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + opts.response.responseText);
    }
  }});
}, text:'Usa Selezionati'}]}], listeners:{beforerender:'onAssociatecnico1BeforeRender'}});
Ext.define('SIMFito.view.SchedaContainerViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.schedacontainer', stores:{PresenteStore:{data:[{rilevato:0, descrizione:'non presente'}, {rilevato:1, descrizione:'presente'}, {rilevato:2, descrizione:'da verificare'}], fields:[{type:'int', name:'rilevato'}, {type:'string', name:'descrizione'}]}}});
Ext.define('SIMFito.view.SchedaContainerViewController', {extend:Ext.app.ViewController, alias:'controller.schedacontainer', onCheckboxfieldChange:function(field, newValue, oldValue, eOpts) {
  map.getLayers().array_[1].setVisible(newValue);
  map.getLayers().array_[2].setVisible(newValue);
  map.getLayers().array_[3].setVisible(newValue);
  Ext.getCmp('SIMFitoSliderSC').setValue(100);
}, onCheckboxfieldAfterRender:function(component, eOpts) {
  component.setValue(false);
  map.getLayers().array_[1].setVisible(false);
  map.getLayers().array_[2].setVisible(false);
  map.getLayers().array_[3].setVisible(false);
  Ext.getCmp('SIMFitoSliderSC').setValue(100);
}, onSliderChange:function(slider, newValue, thumb, type, eOpts) {
  setAEOpacity(newValue);
}, onSliderAfterRender:function(component, eOpts) {
  component.setValue(100);
}, onSIMFitoValutaTempo1BeforeRender:function(component, eOpts) {
  if (localStore.getItem('TipoUtente') == 0) {
    component.setDisabled(true);
  }
}, rowRender:function(value, metaData, record, rowIndex, colIndex, store, view) {
  if (!record.get('completa')) {
    return '\x3cspan style\x3d"color:red;"\x3e' + value + '\x3c/span\x3e';
  } else {
    return value;
  }
}, onGridpanelAfterRender:function(component, eOpts) {
  Ext.StoreMgr.get('OsservazioniStore').load();
  Ext.StoreMgr.get('AttaccoiStore').load();
  Ext.StoreMgr.get('AttaccogStore').load();
}, onGridpanelSelectionChange:function(model, selected, eOpts) {
  var rec = selected[0];
  if (rec) {
    Ext.getCmp('SchedaContainerFields').setDisabled(false);
    removeInteraction();
    var idObs = rec.get('idosservazioni');
    var ffstore = Ext.StoreMgr.get('FasifenologicheStore');
    ffstore.getProxy().setExtraParam('idobs', idObs);
    ffstore.reload();
    Ext.getCmp('osservazioniform').getForm().loadRecord(rec);
  }
}, onGridpanelRowClick:function(tableview, record, element, rowIndex, e, eOpts) {
  Ext.getCmp('osservazioniform').getForm().reset();
  Ext.getCmp('fasifenologicheinfo').setDisabled(false);
  var id = 'osservaione';
  removeLayerBy('idItem', id);
  var sgeometry = record.get('geometry');
  if (sgeometry !== null && sgeometry !== '') {
    var geometry = Ext.util.JSON.decode(sgeometry);
    var label = record.get('ospite') + '/' + record.get('parassita');
    geometry.label = label;
    addGeometry(id, geometry, true, 'osservazioni');
  }
}, onRilevatoSelect:function(combo, record, eOpts) {
}, onRilevatoChange:function(field, newValue, oldValue, eOpts) {
  if (newValue === 1) {
    Ext.getCmp('sup_infest').setDisabled(false);
    Ext.getCmp('piante_infest').setDisabled(false);
    Ext.getCmp('sup_infest').setValue(0);
    Ext.getCmp('piante_infest').setValue(0);
  } else {
    Ext.getCmp('sup_infest').setDisabled(true);
    Ext.getCmp('piante_infest').setDisabled(true);
    Ext.getCmp('sup_infest').setValue(0);
    Ext.getCmp('piante_infest').setValue(0);
  }
}, onCampioneChange:function(field, newValue, oldValue, eOpts) {
  var combo = Ext.getCmp('campionecode');
  var elementi = Ext.getCmp('elementicampione');
  var tipo = Ext.getCmp('tipocampione');
  var stato = combo.up('#scheda').userData.statoScheda;
  if (stato != 2) {
    if (newValue) {
      combo.setDisabled(false);
      elementi.setDisabled(false);
      tipo.setDisabled(false);
    } else {
      combo.setValue(null);
      combo.setDisabled(true);
      elementi.setValue(null);
      elementi.setDisabled(true);
      tipo.setValue(null);
      tipo.setDisabled(true);
    }
  }
}, onCampionecodeSelect:function(combo, record, eOpts) {
  Ext.getCmp('idcampione').setValue(record.get('id'));
  Ext.getCmp('elementicampione').setValue(record.get('elementicampione'));
}, onOsservazioniformFieldValidityChange:function(fieldancestor, field, isValid, eOpts) {
}, onSchedaAfterRender:function(component, eOpts) {
  Ext.Msg.alert('Attenzione', 'Selezionare un\x26apos;osservazione per visualizzare il form di inserimento. Se non ci sono osservazioni aggiungerne una');
  removeInteraction();
  var piva = component.userData.piva;
  var gid = component.userData.gid_sito;
  Ext.getCmp('SIMFitoSliderSC').setValue(100);
  map.removeLayer(sitiLayer);
  sitiLayer = new ol.layer.Tile({visible:true, source:new ol.source.TileWMS({url:wmsUrl, params:{'LAYERS':'simfito:siti', 'TILED':true, 'VIEWPARAMS':'id:' + piva}, serverType:'geoserver'}), title:'siti ' + piva});
  trappoleLayer2 = new ol.layer.Tile({visible:true, source:new ol.source.TileWMS({url:wmsUrl, params:{'LAYERS':'simfito:trappole', 'TILED':true, 'VIEWPARAMS':'gid:' + gid}, serverType:'geoserver'}), title:'trappole'});
  map.addLayer(sitiLayer);
  map.addLayer(trappoleLayer2);
  map.getView().fit(extent, map.getSize());
  var stato = component.userData.statoScheda;
  var form = component.down('form');
  if (stato != 0) {
    form.getForm().getFields().each(function(field) {
      field.setReadOnly(true);
      field.setDisabled(false);
    });
    Ext.getCmp('schedasubmit').setDisabled(true);
    Ext.getCmp('AddObs').setDisabled(true);
    Ext.getCmp('NuovaAssociazione').setDisabled(true);
    Ext.getCmp('tempoOsservazione').setReadOnly(true);
  } else {
    Ext.getCmp('AddObs').setDisabled(false);
    Ext.getCmp('NuovaAssociazione').setDisabled(false);
  }
  var xgeometry = component.userData.geometry;
  var azienda = component.userData.azienda;
  var sito = component.userData.sito;
  var label = azienda + '\n' + sito;
  var id = component.userData.idScheda;
  if (xgeometry !== null && xgeometry !== '') {
    var geometry = Ext.util.JSON.decode(xgeometry);
    geometry.label = label;
    gExtent = addGeometry(id, geometry, true, 'siti');
  }
}, onSchedaBeforeDestroy:function(component, eOpts) {
  var id = component.userData.idScheda;
  removeLayerBy('idItem', id);
  removeLayerBy('myGroup', 'siti');
  removeLayerBy('myGroup', 'osservazioni');
}, onSchedaRender:function(component, eOpts) {
  Ext.StoreMgr.get('CampionecodeStore').load();
  Ext.StoreMgr.get('TipocampioneStore').load();
}, onSchedaBeforeRender:function(component, eOpts) {
  var id = component.userData.idScheda;
  Ext.StoreMgr.get('OsservazioniStore').getProxy().setExtraParam('idscheda', id);
  Ext.StoreMgr.get('OsservazioniStore').getProxy().setExtraParam('idtecnico', localStore.getItem('ID'));
  Ext.StoreMgr.get('CampionecodeStore').getProxy().setExtraParam('idscheda', id);
  Ext.getCmp('SIMFitoSliderSC').setValue(100);
}});
Ext.define('SIMFito.view.SchedaContainer', {extend:Ext.container.Container, alias:'widget.schedacontainer', controller:'schedacontainer', viewModel:{type:'schedacontainer'}, id:'scheda', layout:'fit', items:[{xtype:'form', id:'osservazioniform', bodyPadding:10, trackResetOnLoad:true, url:'services/ajax-save-form.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'gridpanel', flex:1, formBind:false, border:true, id:'osservazionigrid', scrollable:true, store:'OsservazioniStore', dockedItems:[{xtype:'toolbar', 
dock:'top', scrollable:true, items:[{xtype:'button', handler:function(button, e) {
  var userData = button.up('#scheda').userData;
  Ext.create('SIMFito.view.AddopsWindow', {title:'Aggiungi Osservazione alla Scheda ' + button.up('#scheda').userData.idScheda, userData:userData}).show();
}, id:'AddObs', iconCls:'fas fa-eye', text:'Aggiungi Osservazione'}, {xtype:'tbseparator'}, {xtype:'button', handler:function(button, e) {
  var idscheda = button.up('#scheda').userData.idScheda;
  Ext.create('SIMFito.view.NuovaAssociazioneWindow', {userData:{idscheda:idscheda}}).show();
}, id:'NuovaAssociazione', iconCls:'fas fa-link', text:'Nuova Associazione'}, {xtype:'button', handler:function(button, e) {
  var userData = button.up('schedacontainer').userData;
  console.log(userData);
  Ext.create('SIMFito.view.AttachmentWindow').init(userData);
}, id:'Allegati', iconCls:'fas fa-paperclip', text:'Allegati'}, {xtype:'tbfill'}, {xtype:'checkboxfield', fieldLabel:'', boxLabel:'AE Layer', listeners:{change:'onCheckboxfieldChange', afterrender:'onCheckboxfieldAfterRender'}}, {xtype:'slider', id:'SIMFitoSliderSC', width:300, fieldLabel:'Opacità AE', value:75, listeners:{change:'onSliderChange', afterrender:'onSliderAfterRender'}}, {xtype:'button', handler:function(button, e) {
  var uid = localStore.getItem('ID');
  var scheda = button.up('#scheda').userData.idScheda;
  Ext.Ajax.request({url:'services/ajax.php', params:{mode:'temporesiduo', idtecnico:uid, idscheda:scheda}, method:'POST', success:function(response, opts) {
    var obj = Ext.util.JSON.decode(response.responseText);
    if (obj.success) {
      var text = 'Tempo residuo  per il ' + obj.data[0].data + ': \x3cb\x3e' + obj.data[0].residuo + 'min.\x3c/b\x3e';
      Ext.Msg.alert('Tempo Residuo', text);
    } else {
      Ext.Msg.alert('Errore', obj.errors.reason);
    }
  }, failure:function(form, action) {
    switch(action.failureType) {
      case Ext.form.action.Action.CLIENT_INVALID:
        Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
        break;
      case Ext.form.action.Action.CONNECT_FAILURE:
        Ext.Msg.alert('Failure', 'Ajax communication failed');
        break;
      case Ext.form.action.Action.SERVER_INVALID:
        Ext.Msg.alert('Failure', action.result.errors.reason);
        break;
    }
  }});
}, id:'SIMFitoValutaTempo1', iconCls:'fas fa-stopwatch', text:'Valuta tempo residuo', listeners:{beforerender:'onSIMFitoValutaTempo1BeforeRender'}}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/osservazioni.html', 'Help');
}, iconCls:'help'}]}], columns:[{xtype:'gridcolumn', renderer:'rowRender', flex:9, dataIndex:'ospite', text:'Ospite', tooltip:'Ospite'}, {xtype:'gridcolumn', flex:9, dataIndex:'parassita', renderer:'rowRender', text:'Parassita', tooltip:'Parassita'}, {xtype:'gridcolumn', flex:6, hidden:true, dataIndex:'appezzamento', renderer:'rowRender', text:'Appezzamento [m\x26#178;]', tooltip:'Appezzamento [m\x26lt;small\x26gt;\x26lt;sup\x26gt;2\x26lt;/sup\x26gt;\x26lt;/small\x26gt;]'}, {xtype:'gridcolumn', flex:6, 
dataIndex:'presente', renderer:'rowRender', text:'Presente', tooltip:'Parassita Presente'}, {xtype:'gridcolumn', renderer:function(value, metaData, record, rowIndex, colIndex, store, view) {
  var returning = value;
  if (value !== null && value !== '') {
    switch(record.get('laboratory_positive') * 1) {
      case 0:
        returning = '\x3cspan style\x3d"color:green;"\x3e' + value + '\x3c/span\x3e';
        break;
      case 1:
        returning = '\x3cspan style\x3d"color:red;"\x3e' + value + '\x3c/span\x3e';
        break;
      case 2:
        returning = '\x3cspan style\x3d"color:yellow;"\x3e' + value + '\x3c/span\x3e';
        break;
    }
  }
  return returning;
}, flex:6, dataIndex:'lobaratory_result', text:'Risultato Analisi', tooltip:'Risultato Analisi'}, {xtype:'gridcolumn', flex:8, hidden:true, dataIndex:'nome_intensity', renderer:'rowRender', text:'Intensit\x26agrave; Attacco', tooltip:'Intensit\x26agrave; Attacco'}, {xtype:'booleancolumn', flex:4, hidden:true, dataIndex:'campione', text:'Campione Prelevato', tooltip:'Campione per il laboratorio', falseText:'No', trueText:'Si'}, {xtype:'gridcolumn', flex:7, dataIndex:'codice', renderer:'rowRender', 
text:'Serie Campione', tooltip:'Codice Campione'}, {xtype:'actioncolumn', minWidth:140, scrollable:'horizontal', text:'Azioni', items:[{isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  if (record.get('lobaratory_result') === null || record.get('lobaratory_result') == '') {
    return true;
  } else {
    return false;
  }
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var store = Ext.StoreMgr.get('laboratoryStore');
  store.getProxy().setExtraParam('idosservazione', record.get('idosservazioni'));
  var campioneCode = record.get('codice');
  Ext.create('SIMFito.view.labResultWindow', {title:'Dettaglio Risultati Campione ' + campioneCode}).show();
}, iconCls:'lab', tooltip:'Dettaglio Analisi'}, {isDisabled:function(view, rowIndex, colIndex, item, record) {
  var stato = view.up('#scheda').userData.statoScheda;
  if (stato == 2) {
    return true;
  } else {
    return false;
  }
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  if (view.isSelected(row)) {
    features.clear();
    addInteraction('Point', 'osservazioni');
  } else {
    Ext.Msg.alert('Attenzione', 'Per attivare il disegno selezionare l\x26apos;osservazione');
  }
}, disabled:true, iconCls:'map_pin', tooltip:'Disegna Punto'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('idosservazioni');
  Ext.MessageBox.confirm('Conferma', "Duplicare l'osservazione?", function(btn) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'duplica-osservazione', idosservazione:id}, success:function(resp) {
        var obj = Ext.util.JSON.decode(resp.responseText);
        if (obj.success) {
          Ext.StoreMgr.get('OsservazioniStore').reload();
          Ext.Msg.alert('Info', 'Osservazione duplicata con successo');
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore!', obj.errors.reason);
        } else {
          Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
        }
      }});
    }
  });
}, isDisabled:function(view, rowIndex, colIndex, item, record) {
  var stato = view.up('#scheda').userData.statoScheda;
  if (stato == 2) {
    return true;
  } else {
    return false;
  }
}, iconCls:'magic_wand', tooltip:'Duplica Osservazione'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('idosservazioni');
  Ext.MessageBox.confirm('Conferma', "Eliminare l'osservazione?", function(btn) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'cancella-osservazione', id_osservazione:id}, success:function(resp) {
        var obj = Ext.util.JSON.decode(resp.responseText);
        if (obj.success) {
          Ext.StoreMgr.get('OsservazioniStore').reload();
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore!', obj.errors.reason);
        } else {
          Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
        }
      }});
    }
  });
}, isDisabled:function(view, rowIndex, colIndex, item, record) {
  var stato = view.up('#scheda').userData.statoScheda;
  if (stato == 2) {
    return true;
  } else {
    return false;
  }
}, iconCls:'delete', tooltip:'Elimina'}, {isDisabled:function(view, rowIndex, colIndex, item, record) {
  var campione = record.get('campione');
  return !campione;
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  if (record.get('campione')) {
    Ext.create('SIMFito.view.CodeWindow', {userData:{codice:record.get('codice')}}).show();
  }
}, iconCls:'barcode', tooltip:'Codice Campione'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  Ext.create('SIMFito.view.AbbattimentiWindow').initialize(record);
}, isDisabled:function(view, rowIndex, colIndex, item, record) {
  return record.get('rilevato') === 0 ? true : false;
}, iconCls:'exclamination_mark', tooltip:'Abbattimenti'}]}], listeners:{afterrender:'onGridpanelAfterRender', selectionchange:'onGridpanelSelectionChange', rowclick:'onGridpanelRowClick'}}, {xtype:'fieldcontainer', flex:2, disabled:true, height:120, id:'SchedaContainerFields', scrollable:true, width:400, layout:{type:'hbox', align:'stretchmax'}, items:[{xtype:'fieldset', flex:1, defaults:{anchor:'99%', labelAlign:'top'}, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', fieldLabel:'Tipologia Controllata', 
name:'tipologia_id', allowBlank:false, allowOnlyWhitespace:false, autoLoadOnValue:true, displayField:'descrizione', store:'tipologiecontrollate', valueField:'id'}, {xtype:'fieldset', dock:'top', title:'Superficie', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'numberfield', init:{value:null, disabled:true}, id:'appezzamento', padding:1, fieldLabel:'Sup. Totale sito [m\x26#178;]', labelAlign:'top', name:'appezzamento', allowBlank:false, allowOnlyWhitespace:false, allowDecimals:false, allowExponential:false, 
minValue:1}, {xtype:'numberfield', validator:function(value) {
  var returning;
  if (value > Ext.getCmp('appezzamento').getValue()) {
    returning = 'Questo valore non pu\x26ograve; essere maggiore della superfice totale dell\x26apos;appezzamento!';
  } else {
    returning = true;
  }
  return returning;
}, init:{value:null, disabled:true}, dock:'top', id:'sup_vis', padding:1, fieldLabel:'Sup. controllata  [m\x26#178;]', labelAlign:'top', msgTarget:'under', name:'sup_vis', value:0, allowBlank:false, allowOnlyWhitespace:false, allowDecimals:false, allowExponential:false, minText:'Campo obbligatorio.', minValue:1}]}, {xtype:'fieldset', dock:'top', title:'Unit\x26agrave;', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'numberfield', init:{value:null, disabled:true}, dock:'top', id:'unita_tot', 
padding:1, fieldLabel:'Unit\x26agrave; totali', labelAlign:'top', msgTarget:'under', name:'unit_tot', value:0, allowDecimals:false, allowExponential:false, minValue:0}, {xtype:'numberfield', validator:function(value) {
  var returning;
  if (value > Ext.getCmp('unita_tot').getValue()) {
    returning = 'Questo valore non pu\x26ograve; essere maggiore delle unit\x26agrave; totale!';
  } else {
    returning = chkObsMainFields();
  }
  return returning;
}, init:{value:null, disabled:true}, dock:'top', id:'unit_chk', padding:1, fieldLabel:'Unit\x26agrave; controllate', labelAlign:'top', msgTarget:'under', name:'unit_chk', allowDecimals:false, allowExponential:false}]}, {xtype:'fieldset', dock:'top', title:'Peso [kg]', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'numberfield', init:{value:null, disabled:true}, dock:'top', id:'peso_tot', padding:1, fieldLabel:'Peso totale', labelAlign:'top', msgTarget:'under', name:'peso_tot', value:0, allowExponential:false, 
decimalSeparator:'.', minValue:0}, {xtype:'numberfield', validator:function(value) {
  var returning;
  if (value > Ext.getCmp('peso_tot').getValue()) {
    returning = 'Questo valore non pu\x26ograve; essere maggiore del peso totale!';
  } else {
    returning = chkObsMainFields();
  }
  return returning;
}, init:{value:null, disabled:true}, dock:'top', id:'peso_chk', padding:1, fieldLabel:'Peso controllato', labelAlign:'top', msgTarget:'under', name:'peso_chk', allowExponential:false, decimalSeparator:'.'}]}, {xtype:'fieldset', dock:'top', title:'Lotti', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'numberfield', init:{value:null, disabled:true}, flex:1, id:'lotti_tot', padding:1, fieldLabel:'Lotti totali', labelAlign:'top', msgTarget:'under', name:'lotti_tot', value:0, allowDecimals:false, 
allowExponential:false, minValue:0}, {xtype:'fieldcontainer', width:400, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'numberfield', validator:function(value) {
  var returning;
  if (value > Ext.getCmp('lotti_tot').getValue()) {
    returning = 'Questo valore non pu\x26ograve; essere maggiore dei lotti totali!';
  } else {
    returning = chkObsMainFields();
  }
  return returning;
}, init:{value:null, disabled:true}, id:'lotti_chk', padding:1, fieldLabel:'Lotti controllati', labelAlign:'top', msgTarget:'under', name:'lotti_chk', allowDecimals:false, allowExponential:false}, {xtype:'numberfield', validator:function(value) {
  var returning;
  if (value > Ext.getCmp('lotti_tot').getValue()) {
    returning = 'Questo valore non pu\x26ograve; essere maggiore dei lotti totali!';
  } else {
    returning = chkObsMainFields();
  }
  return returning;
}, init:{value:null, disabled:true}, id:'lotti_camp', padding:1, fieldLabel:'Lotti campionati', labelAlign:'top', msgTarget:'under', name:'lotti_camp', allowDecimals:false, allowExponential:false}]}]}, {xtype:'datefield', init:{value:null, disabled:false}, hidden:true, fieldLabel:'Data D\x26apos;impianto', labelAlign:'top', name:'data_impianto', format:'d/m/Y'}, {xtype:'textfield', init:{value:null, disabled:false}, hidden:true, fieldLabel:'Variet\x26agrave;', labelAlign:'top', name:'varieta'}, {xtype:'textfield', 
init:{value:null, disabled:false}, hidden:true, fieldLabel:'Coltura Precedente', name:'coltura_prec'}, {xtype:'combobox', flex:1, fieldLabel:'Paese di provenienza', name:'provenienza', displayField:'descrizione', minChars:3, store:'paeseprovenienza', typeAhead:true, valueField:'descrizione'}, {xtype:'hiddenfield', name:'fase', value:'obsupdate_new'}, {xtype:'hiddenfield', id:'completa', name:'completata', value:true}, {xtype:'hiddenfield', name:'idosservazioni'}, {xtype:'hiddenfield', id:'obsgeometry', 
name:'geometry'}]}, {xtype:'fieldset', flex:1, defaults:{anchor:'99%', labelAlign:'top'}, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldcontainer', init:{value:null, disabled:false}, fieldLabel:'Fase Fenologica', labelAlign:'top', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'combobox', flex:1, name:'fase_fenologica', autoLoadOnValue:true, displayField:'fase_fenologica', hiddenName:'fase_fenologica', store:'FasifenologicheStore', valueField:'fase_fenologica'}, {xtype:'button', 
handler:function(button, e) {
  var selOspite = button.up('#scheda').down('grid').getSelection();
  if (selOspite.length > 0) {
    var ospite = selOspite[0].get('ospite');
    var fInfo = '';
    var store = Ext.StoreMgr.get('FasifenologicheStore');
    for (var i = 0; i < store.getCount(); i++) {
      var record = store.getAt(i).data;
      fInfo += '\x3cp\x3e\x3cb\x3e' + record.fase_fenologica + '\x3c/b\x3e: ' + record.info + '\x3c/p\x3e';
    }
    var infoWin = new Ext.Window({title:'Fasi fenologiche per ' + ospite, collapsible:false, maximizable:false, autoScroll:true, width:400, height:300, minWidth:375, minHeight:250, plain:true, bodiStyle:'padding:5px', buttonAlign:'center', html:fInfo, buttons:[{text:'Chiudi', handler:function() {
      infoWin.close();
    }}]});
    infoWin.show();
  }
}, flex:0, disabled:true, id:'fasifenologicheinfo', iconCls:'help'}]}, {xtype:'combobox', validator:function(value) {
  var rilevato = Ext.getCmp('rilevato').getValue();
  var toReturn = true;
  if (rilevato == 0) {
    if (Ext.getCmp('sup_infest').getValue() > 0 || Ext.getCmp('piante_infest').getValue() > 0) {
      return 'Si \x26egrave; è indicato una superficie inferata e/o un numero di piante infestate diverso da zero pur avnedo indicato che il parassinat non \x26egrave presente!';
    }
  }
  return toReturn;
}, init:{value:null, disabled:false}, id:'rilevato', fieldLabel:'Parassita Presente', name:'rilevato', autoLoadOnValue:true, displayField:'descrizione', hiddenName:'rilevato', valueField:'rilevato', bind:{store:'{PresenteStore}'}, listeners:{select:'onRilevatoSelect', change:'onRilevatoChange'}}, {xtype:'numberfield', validator:function(value) {
  var retunring;
  var sup = Ext.getCmp('appezzamento').getValue();
  if (value >= sup) {
    returning = 'La superficie infestata non pu\x26ograve; essere maggiore della superficie totale';
  } else {
    returning = true;
  }
  return returning;
}, init:{value:null, disabled:true}, disabled:true, id:'sup_infest', fieldLabel:'Superficie Infestata  [m\x26#178;]', msgTarget:'under', name:'sup_infest', value:0, allowBlank:false, allowOnlyWhitespace:false, allowExponential:false, minValue:0}, {xtype:'numberfield', validator:function(value) {
  var retunring;
  if (Ext.getCmp('rilevato').getValue() > 0) {
    if (value == 0 && Ext.getCmp('sup_infest').getValue() == 0) {
      returning = 'Valorizzare questo compo con un valore diverso da zero o indicare la superficie inferstata se il parassita \x26egrave; presente!';
    } else {
      returning = true;
    }
  } else {
    returning = true;
  }
  return returning;
}, init:{value:null, disabled:true}, disabled:true, id:'piante_infest', fieldLabel:'N. Piante infestate', msgTarget:'under', name:'piante_infest', value:0, allowBlank:false, allowOnlyWhitespace:false, blankText:'Obbligatorio se presente il parassita', allowDecimals:false, allowExponential:false, minValue:0}, {xtype:'combobox', validator:function(value) {
  var returning = true;
  return returning;
}, init:{value:null, disabled:false}, hidden:true, id:'id_intensity', fieldLabel:'Intensit\x26agrave; Attacco', msgTarget:'under', name:'id_intensity', value:null, invalidText:'L\x26apos;intensit\x26agrave; di attacco deve essere conseguente alla rilevazione del parassita', autoLoadOnValue:true, displayField:'nome_intensity', hiddenName:'id_intensity', store:'AttaccoiStore', valueField:'id_intensity'}, {xtype:'hiddenfield', flex:1, id:'schedaid', fieldLabel:'Label', name:'idscheda'}, {xtype:'numberfield', 
fieldLabel:'Numero piante abbattute', name:'n_abbattute', readOnly:true, allowBlank:false, allowOnlyWhitespace:false, allowDecimals:false, allowExponential:false}, {xtype:'fieldcontainer', height:200, maxHeight:250, fieldLabel:'Serie campione', labelAlign:'top', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldcontainer', flex:1, maxHeight:35, width:400, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'checkboxfield', init:{value:null, disabled:false}, id:'campione', name:'campione', 
value:false, listeners:{change:'onCampioneChange'}}, {xtype:'combobox', init:{value:null, disabled:true}, flex:1, disabled:true, id:'campionecode', maxHeight:20, name:'codice', value:'', allowBlank:false, allowOnlyWhitespace:false, editable:false, displayField:'descrizione', hiddenName:'codice', queryCaching:false, store:'CampionecodeStore', valueField:'codice', listeners:{select:'onCampionecodeSelect'}}]}, {xtype:'fieldcontainer', flex:1, maxHeight:60, width:400, layout:'fit', items:[{xtype:'numberfield', 
init:{value:0, disabled:true}, disabled:true, height:35, id:'elementicampione', fieldLabel:'Elementi della serie', labelAlign:'top', name:'elementicampione', allowBlank:false, allowOnlyWhitespace:false, allowDecimals:false, allowExponential:false, minValue:1}, {xtype:'combobox', disabled:true, id:'tipocampione', fieldLabel:'Tipo serie campione', labelAlign:'top', name:'tipocampione_id', allowBlank:false, allowOnlyWhitespace:false, editable:false, displayField:'tipocampione_description', hiddenName:'tipocampione_id', 
queryCaching:false, store:'TipocampioneStore', valueField:'tipocampione_id'}]}]}, {xtype:'numberfield', validator:function(value) {
  var uid = localStore.getItem('ID');
  var scheda = this.up('#scheda').userData.idScheda;
  var originalValue = this.originalValue;
  var toReturn = false;
  Ext.Ajax.request({url:'services/ajax.php', params:{mode:'temporesiduo', idtecnico:uid, idscheda:scheda}, async:false, method:'POST', success:function(response, opts) {
    var obj = Ext.util.JSON.decode(response.responseText);
    if (obj.success) {
      var residuo = Number(obj.data[0].residuo) + Number(originalValue);
      if (residuo - value >= 0) {
        toReturn = true;
      } else {
        toReturn = 'Restano solo ' + residuo + ' disponibili.';
      }
    } else {
      toReturn = 'Errore: ' + obj.errors.reason;
    }
  }, failure:function(form, action) {
    switch(action.failureType) {
      case Ext.form.action.Action.CLIENT_INVALID:
        Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
        break;
      case Ext.form.action.Action.CONNECT_FAILURE:
        Ext.Msg.alert('Failure', 'Ajax communication failed');
        break;
      case Ext.form.action.Action.SERVER_INVALID:
        Ext.Msg.alert('Failure', action.result.errors.reason);
        break;
    }
  }});
  return toReturn;
}, flex:1, id:'tempoOsservazione', fieldLabel:'Tempo impiegato [minuti x uomo]', msgTarget:'under', name:'tempo', decimalPrecision:0, minValue:0}, {xtype:'textareafield', init:{value:null, disabled:false}, fieldLabel:'Note', msgTarget:'under', name:'sospetti', invalidText:'', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo Obbligatorio', emptyText:'Campo obbligatorio'}, {xtype:'hiddenfield', flex:1, id:'nuovocampione', fieldLabel:'Label', name:'nuovocampione', value:false}, {xtype:'hiddenfield', 
flex:1, id:'idcampione', fieldLabel:'Label', name:'idcampione'}]}]}], dockedItems:[{xtype:'toolbar', flex:1, dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  Ext.getCmp('schedaid').setValue(button.up('schedacontainer').userData.idScheda);
  console.log(features.getArray()[0]);
  if (features.getArray()[0] !== undefined) {
    var geoJson = feat2GeoJson(features.getArray()[0]);
    Ext.getCmp('obsgeometry').setValue(Ext.util.JSON.encode(geoJson));
  }
  var form = button.up('form');
  if (form.isValid()) {
    Ext.getCmp('completa').setValue('true');
    var Continue = true;
    if (form.getValues().campione !== undefined) {
      if (Ext.getCmp('campionecode').getSelection() !== null) {
        var combo = Ext.getCmp('campionecode');
        var data = combo.getSelection();
        Ext.getCmp('idcampione').setValue(data.get('id'));
        var duplicatedCode = checkDuplicatedCode(Ext.StoreManager.get('OsservazioniStore'), combo.getValue(), Ext.getCmp('osservazionigrid').getSelection()[0].get('idosservazioni'));
        if (duplicatedCode) {
        } else {
          if (data.get('nuovo')) {
            Ext.getCmp('nuovocampione').setValue('true');
            Ext.create('SIMFito.view.LaboratorioWindow', {userData:form}).show();
            Continue = false;
          }
        }
      }
    }
    if (Continue) {
      form.getForm().submit({submitEmptyText:false, method:'POST', waitTitle:'Connessione', waitMsg:'Invio dei dati...', success:function(form, action) {
        var result = action.result;
        if (result.success) {
          osservazioneReloadId = result.gid;
          osservazioneFormReset();
          removeInteraction();
          removeLayerBy('idItem', 'osservazione');
          Ext.StoreMgr.get('OsservazioniStore').reload();
        } else {
          Ext.Msg.alert('ERRORE', result.errors.reason);
        }
      }, failure:function(form, action) {
        osservazioneFormReset();
        if (action.failureType == 'server') {
          var obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore!', obj.errors.reason);
        } else {
          Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
        }
      }});
    }
  } else {
    Ext.Msg.alert('Attenzione', 'Verificare che tutti i campi siano stati inseriti correttamente!');
  }
}, formBind:false, id:'schedasubmit', text:'Salva'}]}], listeners:{fieldvaliditychange:'onOsservazioniformFieldValidityChange'}}], listeners:{afterrender:'onSchedaAfterRender', beforedestroy:'onSchedaBeforeDestroy', render:'onSchedaRender', beforerender:'onSchedaBeforeRender'}});
Ext.define('SIMFito.view.SchedaSettingsWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.schedasettingswindow'});
Ext.define('SIMFito.view.SchedaSettingsWindowViewController', {extend:Ext.app.ViewController, alias:'controller.schedasettingswindow', onWindowBeforeRender:function(component, eOpts) {
  Ext.Ajax.request({url:'services/ajax.php', params:{mode:'config', sub:'scheda0001'}, method:'POST', success:function(response, opts) {
    var obj = Ext.decode(response.responseText);
    if (obj.success) {
      var dayField = Ext.getCmp('scheda0001');
      dayField.setValue(obj.data[0].value);
      dayField.setDisabled(false);
      console.dir(obj);
    } else {
      Ext.Msg.alert('Errore', obj.errors.reason);
    }
  }, failure:function(response, opts) {
    console.log('server-side failure with status code ' + response.status);
  }});
}});
Ext.define('SIMFito.view.SchedaSettingsWindow', {extend:Ext.window.Window, alias:'widget.schedasettingswindow', controller:'schedasettingswindow', viewModel:{type:'schedasettingswindow'}, constrain:true, height:250, width:400, layout:'fit', title:'Impostazioni Scheda', items:[{xtype:'form', scrollable:true, bodyPadding:10, url:'services/ajax-save-form.php', items:[{xtype:'numberfield', anchor:'100%', disabled:true, id:'scheda0001', fieldLabel:'Giorni di posticipo scheda', labelAlign:'top', name:'scheda0001', 
allowBlank:false, allowOnlyWhitespace:false, allowDecimals:false, allowExponential:false, minValue:0}, {xtype:'hiddenfield', anchor:'100%', name:'fase', value:'settings'}], dockedItems:[{xtype:'button', handler:function(button, e) {
  var form = button.up('form');
  if (form.isValid()) {
    form.submit({method:'POST', waitTitle:'Connecting', waitMsg:'Sending data...', success:function(form, action) {
      obj = Ext.util.JSON.decode(action.response.responseText);
      var success = obj.success;
      if (success) {
        Ext.Msg.alert('Info', 'Configurazione salvata con successo');
      } else {
        Ext.Msg.alert('Errore', obj.errors.reason);
      }
    }, failure:function(form, action) {
      if (action.failureType == 'server') {
        obj = Ext.util.JSON.decode(action.response.responseText);
        Ext.Msg.alert('Login Fallito!', obj.errors.reason);
      } else {
        Ext.Msg.alert('Attenzione!', 'Server non raggiungibile: ' + action.response.responseText);
      }
    }});
  }
}, formBind:true, dock:'bottom', text:'Modifica'}]}], listeners:{beforerender:'onWindowBeforeRender'}});
Ext.define('SIMFito.view.SitiAllContainerViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.sitiallcontainer'});
Ext.define('SIMFito.view.SitiAllContainerViewController', {extend:Ext.app.ViewController, alias:'controller.sitiallcontainer', onGridpanelSelect:function(rowmodel, record, index, eOpts) {
  var xgeometry = record.get('geometry');
  var label = record.get('denominazione');
  if (xgeometry !== null && xgeometry !== '') {
    var geometry = Ext.util.JSON.decode(xgeometry);
    geometry.label = label;
    gExtent = addGeometry(id, geometry, false, 'siti', 'map');
  }
}, onGridpanelRowDblClick:function(tableview, record, element, rowIndex, e, eOpts) {
  var xgeometry = record.get('geometry');
  var label = record.get('denominazione');
  if (xgeometry !== null && xgeometry !== '') {
    var geometry = Ext.util.JSON.decode(xgeometry);
    geometry.label = label;
    gExtent = addGeometry(id, geometry, true, 'siti', 'map');
  }
}, onSitiallAfterRender:function(component, eOpts) {
  map.removeLayer(sitiLayer);
  map.removeLayer(aeCat);
  map.removeLayer(aeFab);
  if (component.userData !== undefined) {
    var piva = component.userData.piva;
    sitiLayer = new ol.layer.Tile({visible:true, source:new ol.source.TileWMS({url:wmsUrl, params:{'LAYERS':'simfito:siti', 'TILED':true, 'VIEWPARAMS':'id:' + piva}, serverType:'geoserver'}), title:'siti ' + piva});
  } else {
    sitiLayer = new ol.layer.Tile({visible:true, source:new ol.source.TileWMS({url:wmsUrl, params:{'LAYERS':'simfito:siti_all', 'TILED':true}, serverType:'geoserver'}), title:'siti'});
  }
  sitiLayer.on('postcompose', function() {
    if (layerFirstTime) {
      map.getView().fit(extent, map.getSize());
      layerFirstTime = false;
    }
  });
  map.addLayer(sitiLayer);
  map.addLayer(aeCat);
  map.addLayer(aeFab);
  map.getView().fit(extent, map.getSize());
  map.on('singleclick', function(evt) {
    var sito = getFeatureInfo(sitiLayer, evt.coordinate);
    if (sito.features.length > 0) {
      var id = sito.features[0].properties.gid;
      var grid = Ext.getCmp('sitiallgrid');
      var store = grid.getStore();
      var record = store.getAt(store.findExact('id', id));
      grid.setSelection(record);
      grid.getView().focusRow(record);
    }
  });
}, onSitiallBeforeDestroy:function(component, eOpts) {
  removeLayerBy('myGroup', 'siti');
  Ext.StoreMgr.get('SitiStore').getProxy().setExtraParams({mode:'siti'});
  map.removeLayer(aeCat);
  map.removeLayer(aeFab);
}, onSitiallBeforeRender:function(component, eOpts) {
  if (component.userData !== undefined) {
    var piva = component.userData.piva;
    Ext.StoreMgr.get('SitiStore').getProxy().setExtraParam('piva', piva);
  }
}});
Ext.define('SIMFito.view.SitiAllContainer', {extend:Ext.container.Container, alias:'widget.sitiallcontainer', controller:'sitiallcontainer', viewModel:{type:'sitiallcontainer'}, id:'sitiall', layout:'fit', items:[{xtype:'gridpanel', id:'sitiallgrid', autoLoad:true, store:'SitiStore', columns:[{xtype:'numbercolumn', width:60, dataIndex:'id', text:'Id', format:'0'}, {xtype:'gridcolumn', flex:3, dataIndex:'denominazione', text:'Denominazione', filter:{type:'string'}}, {xtype:'gridcolumn', dataIndex:'tipologiasito', 
text:'Tipologia', filter:{type:'string'}}, {xtype:'gridcolumn', flex:2, dataIndex:'localita', text:'Via/Localit\x26agrave;', filter:{type:'string'}}, {xtype:'numbercolumn', dataIndex:'superficie_ha', text:'Superficie [m2]', format:'0.00'}, {xtype:'gridcolumn', flex:2, dataIndex:'comune', text:'Comune', filter:{type:'string'}}, {xtype:'gridcolumn', flex:0, width:75, dataIndex:'provincia', text:'Provincia', filter:{type:'list'}}, {xtype:'gridcolumn', flex:2, dataIndex:'rag_soc', text:'Azienda', filter:{type:'string'}}], 
plugins:[{ptype:'gridfilters'}], listeners:{select:'onGridpanelSelect', rowdblclick:'onGridpanelRowDblClick'}, dockedItems:[{xtype:'toolbar', dock:'top', scrollable:true, items:[{xtype:'tbfill'}, {xtype:'numberfield', id:'X1', width:150, fieldLabel:'X (o Longitudine)', labelAlign:'top', allowBlank:false, allowOnlyWhitespace:false, allowExponential:false, decimalPrecision:4, decimalSeparator:'.'}, {xtype:'numberfield', id:'Y1', width:150, fieldLabel:'Y (o Latitudine)', labelAlign:'top', allowBlank:false, 
allowOnlyWhitespace:false, allowExponential:false, decimalPrecision:4, decimalSeparator:'.'}, {xtype:'combobox', id:'prjstore1', width:150, fieldLabel:'Proiezione', labelAlign:'top', labelWidth:75, allowBlank:false, allowOnlyWhitespace:false, autoLoadOnValue:true, displayField:'title', store:'userPrjStore', valueField:'srs'}, {xtype:'button', handler:function(button, e) {
  var errorMsg = null;
  var x = Ext.getCmp('X1');
  var y = Ext.getCmp('Y1');
  var prj = Ext.getCmp('prjstore1');
  if (!x.isValid()) {
    errorMsg = 'Inserire la coordinata x';
  }
  if (!y.isValid()) {
    if (errorMsg === null) {
      errorMsg = 'Inserire la cooradinata y';
    } else {
      errorMsg += ', la coordinata y';
    }
  }
  if (!prj.isValid()) {
    if (errorMsg === null) {
      errorMsg = 'Scegliere la proiezione in cui sono state espresse le coordinate';
    } else {
      errorMsg += ' e scegliere la proiezione in cui sono state espresse le coordinate';
    }
  }
  if (errorMsg !== null) {
    errorMsg += '. Quindi riprovare.';
  }
  if (errorMsg === null) {
    console.log(map.getView().getProjection().getCode());
    console.log(prj.getValue());
    var point = ol.proj.transform([x.getValue(), y.getValue()], prj.getValue(), map.getView().getProjection().getCode());
    var iconFeature = new ol.Feature({geometry:new ol.geom.Point(point), name:'Punto inserito'});
    var iconStyle = new ol.style.Style({image:new ol.style.Icon({anchor:[0.5, 0.5], anchorXUnits:'fraction', anchorYUnits:'fraction', src:'resources/icons/24x24/map_pin.png'})});
    iconFeature.setStyle(iconStyle);
    markerLayer.getSource().clear();
    markerLayer.getSource().addFeature(iconFeature);
    map.getView().animate({center:point, zoom:18, duration:200});
  } else {
    Ext.Msg.alert('Attenzione', errorMsg);
  }
}, text:'Centra'}, {xtype:'button', handler:function(button, e) {
  markerLayer.getSource().clear();
}, text:'Elimina Marker'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/siti.html#cercasito', 'Help');
}, iconCls:'help'}]}, {xtype:'toolbar', dock:'top', items:[{xtype:'button', handler:function(button, e) {
  map.getView().fit(extent, map.getSize());
}, text:'Zoom su Estensione'}]}]}], listeners:{afterrender:'onSitiallAfterRender', beforedestroy:'onSitiallBeforeDestroy', beforerender:'onSitiallBeforeRender'}});
Ext.define('SIMFito.view.SitiContainerViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.siticontainer', stores:{sitiGeometryType:{autoLoad:false, data:[{type:'Polygon', description:'Poligono'}], fields:[{type:'string', name:'type'}, {type:'string', name:'description'}]}}});
Ext.define('SIMFito.view.SitiContainerViewController', {extend:Ext.app.ViewController, alias:'controller.siticontainer', onProvinciaSelect1:function(combo, record, eOpts) {
  var provincia = record.get('provincia');
  var store = Ext.StoreMgr.get('ComuniStore');
  store.getProxy().setExtraParam('provincia', provincia);
  var comune = Ext.getCmp('siticomune');
  comune.setDisabled(false);
  if (store.isLoaded) {
    comune.clearValue();
    store.reload();
  }
}, onSiticomuneSelect:function(combo, record, eOpts) {
  var params = {mode:'bounds', shp:'comuni', idfield:'istat', id:record.get('istat')};
  Ext.Ajax.request({url:'services/ajax.php', method:'POST', params:params, success:function(resp) {
    var response = Ext.util.JSON.decode(resp.responseText);
    if (response.data !== undefined && response.data.length > 0) {
      var bbox = [response.data[0].xmin * 1, response.data[0].ymin * 1, response.data[0].xmax * 1, response.data[0].ymax * 1];
      map.getView().fit(bbox, map.getSize());
    }
  }, failure:function(response, opts) {
    console.error('server-side failure with status code ' + response.status);
  }});
}, onFormAfterRender:function(component, eOpts) {
  map.getView().setZoom(8);
  var piva = component.up('container').userData.piva;
  var bboxs = component.up('container').userData.bbox;
  var bbox = bboxs2bbox(bboxs);
  if (bboxs === '') {
    console.info('Nessun sito inserito');
  }
  var extent = ol.proj.transform(bbox, 'EPSG:900913', 'EPSG:3857');
  map.removeLayer(sitiLayer);
  sitiLayer = new ol.layer.Tile({visible:true, source:new ol.source.TileWMS({url:wmsUrl, params:{'LAYERS':'simfito:siti', 'TILED':true, 'VIEWPARAMS':'id:' + piva}, serverType:'geoserver'}), title:'siti ' + piva});
  sitiLayer.on('postcompose', function() {
    if (layerFirstTime) {
      map.getView().fit(extent, map.getSize());
      layerFirstTime = false;
    }
  });
  map.addLayer(sitiLayer);
  map.getView().fit(extent, map.getSize());
  Ext.getCmp('SIMFitoSitiToggle').toggle(true);
}, onSIMFitoSitiToggleToggle:function(button, pressed, eOpts) {
  if (pressed) {
    map0Info = false;
    addInteraction('Polygon', 'newSite');
  } else {
    map0Info = true;
    removeInteraction();
  }
}, onCheckboxfieldChangeSCo:function(field, newValue, oldValue, eOpts) {
  map.getLayers().array_[1].setVisible(newValue);
  map.getLayers().array_[2].setVisible(newValue);
  map.getLayers().array_[3].setVisible(newValue);
  Ext.getCmp('SIMFitoSliderSCo').setValue(100);
}, onCheckboxfieldAfterRender:function(component, eOpts) {
  component.setValue(false);
  map.getLayers().array_[1].setVisible(false);
  map.getLayers().array_[2].setVisible(false);
  map.getLayers().array_[3].setVisible(false);
  Ext.getCmp('SIMFitoSliderSCo').setValue(100);
}, onSliderChange:function(slider, newValue, thumb, type, eOpts) {
  setAEOpacity(newValue);
}, onSliderAfterRender:function(component, eOpts) {
  component.setValue(100);
}, onComboboxSelect:function(combo, record, eOpts) {
  removeInteraction();
  addInteraction(record.get('type'), 'newSite');
  Ext.getCmp('sitizoom').setDisabled(true);
  Ext.getCmp('ridisegnasito').setDisabled(true);
}, onMycombobox5Select:function(combo, record, eOpts) {
  Ext.getCmp('tipologiasitocombo').clearValue();
  var store = Ext.StoreMgr.get('TipologiasitiStore');
  store.getProxy().setExtraParam('theme', record.get('id'));
  store.reload();
  Ext.getCmp('tipologiasitocombo').setDisabled();
}, onSitoAfterRender:function(component, eOpts) {
}});
Ext.define('SIMFito.view.SitiContainer', {extend:Ext.container.Container, alias:'widget.siticontainer', controller:'siticontainer', viewModel:{type:'siticontainer'}, id:'sito', layout:'fit', items:[{xtype:'form', id:'nuovositoform', scrollable:true, bodyPadding:10, standardSubmit:false, url:'services/ajax-save-form.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'combobox', flex:2, id:'sitiprovincia', fieldLabel:'Provincia', 
msgTarget:'under', name:'provincia', allowBlank:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', displayField:'provincia', hiddenName:'provincia', store:'ProvinceStore', valueField:'provincia', listeners:{select:'onProvinciaSelect1'}}, {xtype:'combobox', flex:3, disabled:true, id:'siticomune', fieldLabel:'Comune', msgTarget:'under', name:'comune', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', selectOnFocus:true, 
displayField:'nome', forceSelection:true, hiddenName:'comune', store:'ComuniStore', valueField:'istat', listeners:{select:'onSiticomuneSelect'}}]}, {xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, fieldLabel:'Via/Localit\x26agrave;', name:'indirizzo'}, {xtype:'textfield', flex:1, fieldLabel:'Denominazione', msgTarget:'under', name:'denominazione', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio'}]}, 
{xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'numberfield', flex:1, id:'superficie', fieldLabel:'Superficie [m\x26#178;]', msgTarget:'under', name:'superficie', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', allowDecimals:false, allowExponential:false, minValue:0}, {xtype:'numberfield', flex:1, id:'quota', scrollable:false, fieldLabel:'Quota [m]', msgTarget:'under', name:'quota', allowBlank:false, allowOnlyWhitespace:false, 
blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', allowDecimals:false, allowExponential:false, minValue:0}]}, {xtype:'hiddenfield', id:'userid', name:'userId'}, {xtype:'hiddenfield', id:'sitipiva', name:'piva'}, {xtype:'hiddenfield', name:'fase', value:'scheda-sito'}, {xtype:'hiddenfield', id:'geometry', name:'geometry'}, {xtype:'combobox', itemId:'mycombobox5', fieldLabel:'Tema', name:'theme', allowBlank:false, allowOnlyWhitespace:false, displayField:'theme', store:'ThemeTSStore', 
valueField:'id', listeners:{select:'onMycombobox5Select'}}, {xtype:'combobox', disabled:true, id:'tipologiasitocombo', fieldLabel:'Tipologia Sito', name:'tipologiasito_id', allowBlank:false, allowOnlyWhitespace:false, editable:false, displayField:'description', forceSelection:true, store:'TipologiasitiStore', valueField:'id'}], listeners:{afterrender:'onFormAfterRender'}, dockedItems:[{xtype:'toolbar', flex:1, dock:'top', scrollable:true, items:[{xtype:'tbfill'}, {xtype:'numberfield', id:'X', width:150, 
fieldLabel:'X (o Longitudine)', labelAlign:'top', submitValue:false, allowExponential:false, decimalPrecision:4, decimalSeparator:'.'}, {xtype:'numberfield', id:'Y', width:150, fieldLabel:'Y (o Latitudine)', labelAlign:'top', submitValue:false, allowExponential:false, decimalPrecision:4, decimalSeparator:'.'}, {xtype:'combobox', id:'prjstore', width:150, fieldLabel:'Proiezione', labelAlign:'top', submitValue:false, autoLoadOnValue:true, displayField:'title', store:'userPrjStore', valueField:'srs'}, 
{xtype:'button', handler:function(button, e) {
  var errorMsg = null;
  var x = Ext.getCmp('X');
  var y = Ext.getCmp('Y');
  var prj = Ext.getCmp('prjstore');
  if (x.getValue() === null || x.getValue() === '') {
    errorMsg = 'Inserire la coordinata x';
  }
  if (y.getValue() === null || y.getValue() === '') {
    if (errorMsg === null) {
      errorMsg = 'Inserire la cooradinata y';
    } else {
      errorMsg += ', la coordinata y';
    }
  }
  if (prj.getValue() === null || prj.getValue() === '') {
    if (errorMsg === null) {
      errorMsg = 'Scegliere la proiezione in cui sono state espresse le coordinate';
    } else {
      errorMsg += ' e scegliere la proiezione in cui sono state espresse le coordinate';
    }
  }
  if (errorMsg !== null) {
    errorMsg += '. Quindi riprovare.';
  }
  if (errorMsg === null) {
    console.log(map.getView().getProjection().getCode());
    console.log(prj.getValue());
    var point = ol.proj.transform([x.getValue(), y.getValue()], prj.getValue(), map.getView().getProjection().getCode());
    var iconFeature = new ol.Feature({geometry:new ol.geom.Point(point), name:'Punto inserito'});
    var iconStyle = new ol.style.Style({image:new ol.style.Icon({anchor:[0.5, 0.5], anchorXUnits:'fraction', anchorYUnits:'fraction', src:'resources/icons/24x24/map_pin.png'})});
    iconFeature.setStyle(iconStyle);
    markerLayer.getSource().clear();
    markerLayer.getSource().addFeature(iconFeature);
    map.getView().animate({center:point, zoom:18, duration:200});
  } else {
    Ext.Msg.alert('Attenzione', errorMsg);
  }
}, text:'Centra'}, {xtype:'button', handler:function(button, e) {
  markerLayer.getSource().clear();
}, text:'Elimina Marker'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/siti.html#disegnasito', 'Help');
}, iconCls:'help'}]}, {xtype:'toolbar', flex:1, dock:'top', scrollable:true, items:[{xtype:'button', handler:function(button, e) {
  var bboxs = button.up('siticontainer').userData.bbox;
  var bbox = extent;
  if (bboxs !== '') {
    bbox = bboxs2bbox(bboxs);
  } else {
    console.info('Nessun sito inserito');
  }
  map.getView().fit(bbox, map.getSize());
}, text:'Zoom sui Siti'}, {xtype:'button', handler:function(button, e) {
  var extent = features.getArray()[0].getGeometry().getExtent();
  map.getView().fit(extent, map.getSize());
}, disabled:true, id:'sitizoom', text:'Zoom sul Sito'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form').getForm().reset();
  removeInteraction();
  addInteraction('Polygon', 'newSite');
  Ext.getCmp('sitizoom').setDisabled(true);
  button.setDisabled(true);
}, disabled:true, id:'ridisegnasito', text:'Ridisegna Sito'}, {xtype:'button', id:'SIMFitoSitiToggle', enableToggle:true, text:'Abilita/Disabilita Disegno', listeners:{toggle:'onSIMFitoSitiToggleToggle'}}, {xtype:'splitter'}, {xtype:'checkboxfield', fieldLabel:'', boxLabel:'Ae Layer', listeners:{change:'onCheckboxfieldChangeSCo', afterrender:'onCheckboxfieldAfterRender'}}, {xtype:'slider', id:'SIMFitoSliderSCo', width:300, fieldLabel:'Opacità layers agenzia entrate', value:100, listeners:{change:'onSliderChange', 
afterrender:'onSliderAfterRender'}}]}, {xtype:'toolbar', flex:1, dock:'top', items:[{xtype:'combobox', fieldLabel:'Disegna', value:'Polygon', displayField:'description', valueField:'type', bind:{store:'{sitiGeometryType}'}, listeners:{select:'onComboboxSelect'}}]}, {xtype:'toolbar', flex:1, dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  Ext.getCmp('userid').setValue(localStore.getItem('ID'));
  Ext.getCmp('sitipiva').setValue(button.up('siticontainer').userData.piva);
  var form = button.up('form').getForm();
  if (features.getArray()[0] !== undefined) {
    var geoJson = feat2GeoJson(features.getArray()[0]);
    Ext.getCmp('geometry').setValue(Ext.util.JSON.encode(geoJson));
    if (form.isValid()) {
      form.submit({method:'POST', waitTitle:'Connessione in corso', waitMsg:'Invio informazioni', success:function(form, action) {
        obj = Ext.util.JSON.decode(action.response.responseText);
        var success = obj.success;
        if (success) {
          sitiLayer.getSource().updateParams({'time':Date.now()});
          form.reset();
          features.clear();
          removeInteraction();
          addInteraction('Polygon', 'newSite');
          Ext.getCmp('sitizoom').setDisabled(true);
          Ext.getCmp('ridisegnasito').setDisabled(true);
          Ext.StoreMgr.get('SitiStore').reload();
          Ext.Msg.alert('Info', 'Sito aggiunto con successo!');
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore', obj.errors.reason);
        } else {
          Ext.Msg.alert('Errore', 'Server non raggiungibile: ' + action.response.responseText);
        }
      }});
    }
  } else {
    Ext.Msg.alert('Info', 'Disegnare il sito! Grazie.');
  }
}, text:'Salva'}]}]}], listeners:{afterrender:'onSitoAfterRender'}});
Ext.define('SIMFito.view.SitiContainerViewModel1', {extend:Ext.app.ViewModel, alias:'viewmodel.siticontainer1', stores:{sitiGeometryType:{autoLoad:false, data:[{type:'Polygon', description:'Poligono'}, {type:'Null', description:'Non Disegnare'}], fields:[{type:'string', name:'type'}, {type:'string', name:'description'}]}}});
Ext.define('SIMFito.view.SitiContainerViewController1', {extend:Ext.app.ViewController, alias:'controller.siticontainer1', onAziendaComboSelect1:function(combo, record, eOpts) {
  var grid = Ext.getCmp('sitiallgrid1');
  var piva = record.get('partita_iva');
  grid.getView().getColumnManager().getColumns()[5].filter.setValue(record.get('rag_soc'));
  map.removeLayer(sitiLayer);
  sitiLayer = new ol.layer.Tile({visible:true, source:new ol.source.TileWMS({url:wmsUrl, params:{'LAYERS':'simfito:siti', 'TILED':true, 'VIEWPARAMS':'id:' + piva}, serverType:'geoserver'}), title:'siti ' + piva});
  map.addLayer(sitiLayer);
}, onProvinciaSelect1:function(combo, record, eOpts) {
  var provincia = record.get('provincia');
  var store = Ext.StoreMgr.get('ComuniStore');
  store.getProxy().setExtraParam('provincia', provincia);
  var comune = Ext.getCmp('siticomune');
  comune.setDisabled(false);
  if (store.isLoaded) {
    comune.clearValue();
    store.reload();
  }
}, onSiticomuneSelect:function(combo, record, eOpts) {
  var params = {mode:'bounds', shp:'comuni', idfield:'istat', id:record.get('istat')};
  Ext.Ajax.request({url:'services/ajax.php', method:'POST', params:params, success:function(resp) {
    var response = Ext.util.JSON.decode(resp.responseText);
    if (response.data !== undefined && response.data.length > 0) {
      var bbox = [response.data[0].xmin * 1, response.data[0].ymin * 1, response.data[0].xmax * 1, response.data[0].ymax * 1];
      map.getView().fit(bbox, map.getSize());
    }
  }, failure:function(response, opts) {
    console.error('server-side failure with status code ' + response.status);
  }});
}, onSIMFitoSitiToggle1Toggle:function(button, pressed, eOpts) {
  if (pressed) {
    addInteraction('Polygon', 'newSite2');
  } else {
    removeInteraction();
  }
}, onCheckboxfieldAfterRender:function(component, eOpts) {
  component.setValue(false);
  map.getLayers().array_[1].setVisible(false);
  map.getLayers().array_[2].setVisible(false);
  map.getLayers().array_[3].setVisible(false);
  Ext.getCmp('SIMFitoSliderSCo1').setValue(100);
}, onCheckboxfieldChange:function(field, newValue, oldValue, eOpts) {
  map.getLayers().array_[1].setVisible(newValue);
  map.getLayers().array_[2].setVisible(newValue);
  map.getLayers().array_[3].setVisible(newValue);
  Ext.getCmp('SIMFitoSliderSCo1').setValue(100);
}, onSliderChange:function(slider, newValue, thumb, type, eOpts) {
  setAEOpacity(newValue);
}, onSliderAfterRender:function(component, eOpts) {
  component.setValue(100);
}, onComboboxSelect:function(combo, record, eOpts) {
  removeInteraction();
  if (record.get('type') != 'Null') {
    addInteraction(record.get('type'), 'newSite2');
    Ext.getCmp('sitizoom').setDisabled(true);
    Ext.getCmp('ridisegnasito').setDisabled(true);
  }
}, onMycombobox7Select:function(combo, record, eOpts) {
  var store = Ext.StoreMgr.get('TipologiasitiStore');
  store.getProxy().setExtraParam('theme', record.get('id'));
  store.reload();
  Ext.getCmp('tipologiasitocombo1').setDisabled();
}, onGridpanelSelect1:function(rowmodel, record, index, eOpts) {
  var xgeometry = record.get('geometry');
  var label = record.get('denominazione');
  if (xgeometry !== null && xgeometry !== '') {
    var geometry = Ext.util.JSON.decode(xgeometry);
    geometry.label = label;
    gExtent = addGeometry(id, geometry, false, 'siti');
  }
}, onGridpanelRowDblClick1:function(tableview, record, element, rowIndex, e, eOpts) {
  var xgeometry = record.get('geometry');
  var label = record.get('denominazione');
  if (xgeometry !== null && xgeometry !== '') {
    var geometry = Ext.util.JSON.decode(xgeometry);
    geometry.label = label;
    gExtent = addGeometry(id, geometry, true, 'siti');
  }
}, onSito1AfterRender:function(component, eOpts) {
  map.getView().setZoom(8);
  var bboxs = extent;
  var bbox = extent;
  var idscheda = component.userData.idScheda;
  map.removeLayer(sitiLayer);
  sitiLayer = new ol.layer.Tile({visible:true, source:new ol.source.TileWMS({url:wmsUrl, params:{'LAYERS':'simfito:siti_all', 'TILED':true}, serverType:'geoserver'}), title:'siti'});
  sitiLayer.on('postcompose', function() {
    if (layerFirstTime) {
      map.getView().fit(bbox, map.getSize());
      layerFirstTime = false;
    }
  });
  osservazioniLayer = new ol.layer.Tile({visible:true, source:new ol.source.TileWMS({url:wmsUrl, params:{'LAYERS':'simfito:osservazioni', 'TILED':true, 'VIEWPARAMS':'idscheda:' + idscheda}, serverType:'geoserver'}), title:'siti ' + idscheda});
  map.addLayer(sitiLayer);
  map.addLayer(osservazioniLayer);
  map.getView().fit(bbox, map.getSize());
  Ext.getCmp('SIMFitoSitiToggle1').toggle(true);
  map.on('singleclick', function(evt) {
    var sito = getFeatureInfo(sitiLayer, evt.coordinate);
    if (sito.features.length > 0) {
      var id = sito.features[0].properties.gid;
      var grid = Ext.getCmp('sitiallgrid1');
      var store = grid.getStore();
      var record = store.getAt(store.findExact('id', id));
      grid.setSelection(record);
      grid.getView().focusRow(record);
    }
  });
  Ext.Ajax.request({url:'services/ajax.php', method:'POST', params:{mode:'osservazionibbox', idscheda:idscheda}, success:function(response, opt) {
    var resp = Ext.util.JSON.decode(response.responseText);
    var bboxs = resp.data[0].bbox;
    var bbox = bboxs2bbox(bboxs);
    map.getView().fit(bbox, map.getSize());
  }, failure:function(resp, action) {
    if (action.failureType == 'server') {
      obj = Ext.util.JSON.decode(action.response.responseText);
      Ext.Msg.alert('Errore!', obj.errors.reason);
    } else {
      Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
    }
  }});
}, onSito1BeforeDestroy:function(component, eOpts) {
  map.removeLayer(sitiLayer);
  map.removeLayer(osservazioniLayer);
}});
Ext.define('SIMFito.view.SitiContainer1', {extend:Ext.container.Container, alias:'widget.siticontainer1', controller:'siticontainer1', viewModel:{type:'siticontainer1'}, id:'sito1', scrollable:false, width:1121, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'form', flex:2, id:'nuovositoform1', scrollable:true, bodyPadding:10, standardSubmit:false, url:'services/ajax-save-form.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, 
items:[{xtype:'combobox', flex:2, formBind:false, id:'aziendaCombo1', fieldLabel:'Azienda', msgTarget:'under', name:'piva', invalidText:'Selezionare un\x26agrave;azienda', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', selectOnFocus:true, displayField:'rag_soc', forceSelection:true, hiddenName:'piva', store:'AziendeStore2', valueField:'partita_iva', listeners:{select:'onAziendaComboSelect1'}}, {xtype:'button', handler:function(button, 
e) {
  if (Ext.getCmp('aziendaCombo1').getValue() !== null) {
    Ext.getCmp('aziendaCombo1').setValue(null);
    var grid = Ext.getCmp('sitiallgrid1').getView().getColumnManager().getColumns()[5].filter.setValue(null);
    map.removeLayer(sitiLayer);
    sitiLayer = new ol.layer.Tile({visible:true, source:new ol.source.TileWMS({url:wmsUrl, params:{'LAYERS':'simfito:siti_all', 'TILED':true}, serverType:'geoserver'}), title:'siti'});
    map.addLayer(sitiLayer);
  }
}, flex:1, text:'Resetta'}]}, {xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'combobox', flex:2, id:'sitiprovincia1', fieldLabel:'Provincia', msgTarget:'under', name:'provincia', allowBlank:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', displayField:'provincia', hiddenName:'provincia', store:'ProvinceStore', valueField:'provincia', listeners:{select:'onProvinciaSelect1'}}, {xtype:'combobox', flex:3, disabled:true, id:'siticomune1', fieldLabel:'Comune', 
msgTarget:'under', name:'comune', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', selectOnFocus:true, displayField:'nome', forceSelection:true, hiddenName:'comune', store:'ComuniStore', valueField:'istat', listeners:{select:'onSiticomuneSelect'}}]}, {xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, fieldLabel:'Via/Localit\x26agrave;', name:'indirizzo'}, {xtype:'textfield', flex:1, fieldLabel:'Denominazione', 
msgTarget:'under', name:'denominazione', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio'}]}, {xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'numberfield', flex:1, id:'superficie1', minWidth:0, fieldLabel:'Superficie [m\x26#178;]', msgTarget:'under', name:'superficie', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', allowDecimals:false, allowExponential:false}, 
{xtype:'numberfield', flex:1, id:'quota1', scrollable:false, fieldLabel:'Quota [m]', msgTarget:'under', name:'quota', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', allowDecimals:false, allowExponential:false}]}, {xtype:'hiddenfield', id:'userid1', name:'userId'}, {xtype:'hiddenfield', id:'idscheda', name:'idscheda'}, {xtype:'hiddenfield', name:'fase', value:'scheda-sito-1'}, {xtype:'hiddenfield', id:'geometry1', name:'geometry'}, {xtype:'combobox', 
itemId:'mycombobox7', fieldLabel:'Tema', displayField:'theme', store:'ThemeTSStore', valueField:'id', listeners:{select:'onMycombobox7Select'}}, {xtype:'combobox', disabled:true, id:'tipologiasitocombo1', fieldLabel:'Tipologia sito', name:'tipologiasito_id', allowBlank:false, allowOnlyWhitespace:false, editable:false, displayField:'description', forceSelection:true, store:'TipologiasitiStore', valueField:'id'}], dockedItems:[{xtype:'toolbar', flex:1, dock:'top', scrollable:true, items:[{xtype:'tbfill'}, 
{xtype:'numberfield', id:'X3', width:150, fieldLabel:'X (o Longitudine)', labelAlign:'top', submitValue:false, allowExponential:false, decimalPrecision:10}, {xtype:'numberfield', id:'Y3', width:150, fieldLabel:'Y (o Latitudine)', labelAlign:'top', submitValue:false, allowExponential:false, decimalPrecision:10}, {xtype:'combobox', id:'prjstore3', width:150, fieldLabel:'Proiezione', labelAlign:'top', submitValue:false, autoLoadOnValue:true, displayField:'title', store:'userPrjStore', valueField:'srs'}, 
{xtype:'button', handler:function(button, e) {
  var errorMsg = null;
  var x = Ext.getCmp('X3');
  var y = Ext.getCmp('Y3');
  var prj = Ext.getCmp('prjstore3');
  if (x.getValue() === null || x.getValue() === '') {
    errorMsg = 'Inserire la coordinata x';
  }
  if (y.getValue() === null || y.getValue() === '') {
    if (errorMsg === null) {
      errorMsg = 'Inserire la cooradinata y';
    } else {
      errorMsg += ', la coordinata y';
    }
  }
  if (prj.getValue() === null || prj.getValue() === '') {
    if (errorMsg === null) {
      errorMsg = 'Scegliere la proiezione in cui sono state espresse le coordinate';
    } else {
      errorMsg += ' e scegliere la proiezione in cui sono state espresse le coordinate';
    }
  }
  if (errorMsg !== null) {
    errorMsg += '. Quindi riprovare.';
  }
  if (errorMsg === null) {
    console.log(map.getView().getProjection().getCode());
    console.log(prj.getValue());
    var point = ol.proj.transform([x.getValue(), y.getValue()], prj.getValue(), map.getView().getProjection().getCode());
    var iconFeature = new ol.Feature({geometry:new ol.geom.Point(point), name:'Punto inserito'});
    var iconStyle = new ol.style.Style({image:new ol.style.Icon({anchor:[0.5, 0.5], anchorXUnits:'fraction', anchorYUnits:'fraction', src:'resources/icons/24x24/map_pin.png'})});
    iconFeature.setStyle(iconStyle);
    markerLayer.getSource().clear();
    markerLayer.getSource().addFeature(iconFeature);
    map.getView().animate({center:point, zoom:18, duration:200});
  } else {
    Ext.Msg.alert('Attenzione', errorMsg);
  }
}, text:'Centra'}, {xtype:'button', handler:function(button, e) {
  markerLayer.getSource().clear();
}, text:'Elimina Marker'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/siti.html#disegnasito', 'Help');
}, iconCls:'help'}]}, {xtype:'toolbar', flex:1, dock:'top', items:[{xtype:'button', handler:function(button, e) {
  var bboxs = button.up('siticontainer').userData.bbox;
  var bbox = extent;
  if (bboxs !== '') {
    bbox = bboxs2bbox(bboxs);
  } else {
    console.info('Nessun sito inserito');
  }
  map.getView().fit(bbox, map.getSize());
}, text:'Zoom sui Siti'}, {xtype:'button', handler:function(button, e) {
  var extent = features.getArray()[0].getGeometry().getExtent();
  map.getView().fit(extent, map.getSize());
}, disabled:true, id:'sitizoom1', text:'Zoom sul Sito'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form').getForm().reset();
  removeInteraction();
  addInteraction('Polygon', 'newSite2');
  Ext.getCmp('sitizoom').setDisabled(true);
  button.setDisabled(true);
}, disabled:true, id:'ridisegnasito1', text:'Ridisegna Sito'}, {xtype:'button', id:'SIMFitoSitiToggle1', enableToggle:true, text:'Attiva/Disattiva Disegno', listeners:{toggle:'onSIMFitoSitiToggle1Toggle'}}, {xtype:'splitter'}, {xtype:'checkboxfield', boxLabel:'AE Layer', listeners:{afterrender:'onCheckboxfieldAfterRender', change:'onCheckboxfieldChange'}}, {xtype:'slider', id:'SIMFitoSliderSCo1', width:300, fieldLabel:'Opacità layer agenzia entrate', value:100, listeners:{change:'onSliderChange', 
afterrender:'onSliderAfterRender'}}]}, {xtype:'toolbar', flex:1, dock:'top', items:[{xtype:'combobox', fieldLabel:'Disegna', value:'Polygon', displayField:'description', valueField:'type', bind:{store:'{sitiGeometryType}'}, listeners:{select:'onComboboxSelect'}}]}, {xtype:'toolbar', flex:1, dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  Ext.getCmp('userid1').setValue(localStore.getItem('ID'));
  var idscheda = button.up('siticontainer1').userData.idScheda;
  Ext.getCmp('idscheda').setValue(idscheda);
  var form = button.up('form').getForm();
  if (features.getArray()[0] !== undefined) {
    var geoJson = feat2GeoJson(features.getArray()[0]);
    Ext.getCmp('geometry1').setValue(Ext.util.JSON.encode(geoJson));
    if (form.isValid()) {
      form.submit({method:'POST', waitTitle:'Connessione in corso', waitMsg:'Invio informazioni', success:function(form, action) {
        obj = Ext.util.JSON.decode(action.response.responseText);
        var success = obj.success;
        if (success) {
          sitiLayer.getSource().updateParams({'time':Date.now()});
          form.reset();
          features.clear();
          removeInteraction();
          Ext.StoreMgr.get('SchedeStore').reload();
          Ext.Msg.alert('Info', 'Sito aggiunto e collegato con successo!');
          Ext.getCmp('mainpanel').setActiveItem('schede');
          Ext.getCmp('sito1').destroy();
          var dettagli = Ext.getCmp('dettagli');
          dettagli.setDisabled(true);
          dettagli.setTitle('Dettagli');
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore', obj.errors.reason);
        } else {
          Ext.Msg.alert('Errore', 'Server non raggiungibile: ' + action.response.responseText);
        }
      }});
    }
  } else {
    Ext.Msg.alert('Info', 'Disegnare il sito! Grazie.');
  }
}, formBind:true, text:'Salva'}]}]}, {xtype:'gridpanel', flex:1, id:'sitiallgrid1', scrollable:true, autoLoad:true, store:'SitiStore', columns:[{xtype:'numbercolumn', width:60, dataIndex:'id', text:'Id', format:'0'}, {xtype:'gridcolumn', flex:3, dataIndex:'denominazione', text:'Denominazione', filter:{type:'string'}}, {xtype:'gridcolumn', flex:2, dataIndex:'localita', text:'Localit\x26agrave;', filter:{type:'string'}}, {xtype:'gridcolumn', dataIndex:'tipologiasito', text:'Tipologia', filter:{type:'string'}}, 
{xtype:'numbercolumn', dataIndex:'superficie_ha', text:'Superficie [m2]', format:'0.00'}, {xtype:'gridcolumn', flex:2, dataIndex:'comune', text:'Comune', filter:{type:'string'}}, {xtype:'gridcolumn', flex:0, width:75, dataIndex:'tipologiasito', text:'Provincia', filter:{type:'list'}}, {xtype:'gridcolumn', flex:2, dataIndex:'rag_soc', text:'Azienda', filter:{type:'string'}}, {xtype:'actioncolumn', text:'Azioni', items:[{handler:function(view, rowIndex, colIndex, item, e, record, row) {
  console.log(record);
  var idscheda = view.up('siticontainer1').userData.idScheda;
  var idsito = record.get('id');
  var nomesito = record.get('denominazione');
  if (record.get('tipologiasito_id') === null) {
    Ext.create('SIMFito.view.addtipologiasitoWindow').init(idsito, nomesito);
  } else {
    var text = 'Associare alla schda n\x26#186; ' + idscheda + ', il sito ' + record.get('denominazione') + ' (id: ' + idsito + ')?';
    Ext.Msg.confirm('Conferma', text, function(btn, value, opt) {
      if (btn == 'yes') {
        Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'addsito2scheda', idscheda:idscheda, idsito:idsito}, success:function(response, opts) {
          obj = Ext.util.JSON.decode(response.responseText);
          var success = obj.success;
          if (success) {
            features.clear();
            removeInteraction();
            Ext.StoreMgr.get('SchedeStore').reload();
            Ext.Msg.alert('Info', 'Sito collegato con successo!');
            Ext.getCmp('mainpanel').setActiveItem('schede');
            Ext.getCmp('sito1').destroy();
            var dettagli = Ext.getCmp('dettagli');
            dettagli.setDisabled(true);
            dettagli.setTitle('Dettagli');
          } else {
            Ext.Msg.alert('Errore', obj.errors.reason);
          }
        }, failure:function(form, action) {
          if (action.failureType == 'server') {
            obj = Ext.util.JSON.decode(action.response.responseText);
            Ext.Msg.alert('Errore', obj.errors.reason);
          } else {
            Ext.Msg.alert('Errore', 'Server non raggiungibile: ' + action.response.responseText);
          }
        }});
      }
    });
  }
}, isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  var geom = Ext.JSON.decode(record.get('geometry'), true);
  return false;
  console.log(geom.type);
}, iconCls:'favourite_place', tooltip:'Usa Questo Sito'}]}], plugins:[{ptype:'gridfilters'}], listeners:{select:'onGridpanelSelect1', rowdblclick:'onGridpanelRowDblClick1'}, dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'button', handler:function(button, e) {
  map.getView().fit(extent, map.getSize());
}, text:'Zoom su Estensione'}]}]}], listeners:{afterrender:'onSito1AfterRender', beforedestroy:'onSito1BeforeDestroy'}});
Ext.define('SIMFito.view.TableWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.tablewindow'});
Ext.define('SIMFito.view.TableWindowViewController', {extend:Ext.app.ViewController, alias:'controller.tablewindow', onProvinciacomboChange:function(field, newValue, oldValue, eOpts) {
  var cs = Ext.StoreMgr.get('ComuniStore');
  var ps = Ext.StoreMgr.get('tablePestStore');
  var hs = Ext.StoreMgr.get('tableHostStore');
  Ext.getCmp('comuni').setValue(null);
  if (newValue === null) {
    cs.getProxy().setExtraParam('provincia', '');
    ps.getProxy().setExtraParam('provincia', '');
    hs.getProxy().setExtraParam('provincia', '');
    cs.reload();
    ps.reload();
    hs.reload();
    Ext.getCmp('comuni').setDisabled(true);
  } else {
    cs.getProxy().setExtraParam('provincia', newValue);
    ps.getProxy().setExtraParam('provincia', newValue);
    hs.getProxy().setExtraParam('provincia', newValue);
    cs.reload();
    ps.reload();
    hs.reload();
    Ext.getCmp('comuni').setDisabled(false);
  }
}, onComuniChange:function(field, newValue, oldValue, eOpts) {
  var ps = Ext.StoreMgr.get('tablePestStore');
  var hs = Ext.StoreMgr.get('tableHostStore');
  if (newValue === null) {
    ps.getProxy().setExtraParam('cistat', '');
    hs.getProxy().setExtraParam('cistat', '');
    ps.reload();
    hs.reload();
  } else {
    ps.getProxy().setExtraParam('cistat', newValue);
    hs.getProxy().setExtraParam('cistat', newValue);
    ps.reload();
    hs.reload();
  }
}, onHostChange:function(field, newValue, oldValue, eOpts) {
  var ss = Ext.StoreMgr.get('tablePestStore');
  var pest = Ext.getCmp('pest');
  if (newValue === null) {
    ss.getProxy().setExtraParam('hostcode', '');
  } else {
    ss.getProxy().setExtraParam('hostcode', newValue);
  }
  ss.reload();
}, onPestChange:function(field, newValue, oldValue, eOpts) {
  var ss = Ext.StoreMgr.get('tableHostStore');
  var pest = Ext.getCmp('host');
  if (newValue === null) {
    ss.getProxy().setExtraParam('pestcode', '');
  } else {
    ss.getProxy().setExtraParam('pestcode', newValue);
  }
  ss.reload();
}, onTagfieldBeforeRender:function(component, eOpts) {
  if (Number(component.up('window').params.uty) > 1) {
    component.setHidden(true);
  }
}, onWindowBeforeRender:function(component, eOpts) {
  Ext.Ajax.request({url:'services/ajax.php', params:{mode:'periodo_disponibile'}, method:'POST', success:function(response, opts) {
    var obj = Ext.util.JSON.decode(response.responseText);
    if (obj.success) {
      var start = obj.data[0].first_date;
      var end = obj.data[0].last_date;
      Ext.getCmp('da').setMinValue(start);
      Ext.getCmp('da').setValue(start);
      Ext.getCmp('da').setDisabled(false);
      Ext.getCmp('a').setMaxValue(end);
      Ext.getCmp('a').setValue(end);
      Ext.getCmp('a').setDisabled(false);
    } else {
      Ext.Msg.alert('Errore', obj.errors.reason);
    }
  }, failure:function(form, action) {
    switch(action.failureType) {
      case Ext.form.action.Action.CLIENT_INVALID:
        Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
        break;
      case Ext.form.action.Action.CONNECT_FAILURE:
        Ext.Msg.alert('Failure', 'Ajax communication failed');
        break;
      case Ext.form.action.Action.SERVER_INVALID:
        Ext.Msg.alert('Failure', action.result.errors.reason);
        break;
    }
  }});
}});
Ext.define('SIMFito.view.TableWindow', {extend:Ext.window.Window, alias:'widget.tablewindow', controller:'tablewindow', viewModel:{type:'tablewindow'}, constrain:true, height:455, id:'SIMFitoTableWindow', width:600, layout:'fit', title:'Scarica Schede', items:[{xtype:'form', scrollable:true, bodyPadding:10, url:'services/export.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldcontainer', width:400, defaults:{labelAlign:'right', labelWidth:80}, layout:{type:'hbox', align:'stretch'}, 
items:[{xtype:'datefield', flex:1, disabled:true, id:'da', fieldLabel:'Da', name:'start', format:'d/m/Y'}, {xtype:'datefield', flex:1, disabled:true, id:'a', fieldLabel:'A', name:'end', format:'d/m/Y'}]}, {xtype:'fieldcontainer', flex:1, height:120, width:800, defaults:{labelAlign:'right', labelWidth:80, blankText:'Lasciare vuoto o scrivere "tutti" per non filtrare per questo campo'}, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', id:'provinciacombo', fieldLabel:'Provincia', name:'provincia', 
anyMatch:true, autoLoadOnValue:true, displayField:'provincia', forceSelection:true, store:'ProvinceStore', listeners:{change:'onProvinciacomboChange'}}, {xtype:'combobox', disabled:true, id:'comuni', fieldLabel:'Comuni', name:'comune', anyMatch:true, autoLoadOnValue:true, displayField:'nome', forceSelection:true, store:'ComuniStore', valueField:'istat', listeners:{change:'onComuniChange'}}, {xtype:'combobox', id:'host', fieldLabel:'Pianta', name:'host', anyMatch:true, autoLoadOnValue:true, displayField:'name', 
forceSelection:true, store:'tableHostStore', valueField:'hostcode', listeners:{change:'onHostChange'}}, {xtype:'combobox', id:'pest', fieldLabel:'Parassita', name:'pest', anyMatch:true, autoLoadOnValue:true, displayField:'name', forceSelection:true, store:'tablePestStore', valueField:'pestcode', listeners:{change:'onPestChange'}}, {xtype:'combobox', fieldLabel:'Tipo Azienda', name:'tipoazienda', anyMatch:true, autoLoadOnValue:true, displayField:'descrizione', forceSelection:true, store:'TipoaziendaStore', 
valueField:'id'}, {xtype:'tagfield', flex:1, fieldLabel:'Tecnici', name:'tecnici', displayField:'nome', store:'AssociaTecniciStore', valueField:'id_tecnico', encodeSubmitValue:true, listeners:{beforerender:'onTagfieldBeforeRender'}}]}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form');
  var url = form.url;
  var get = '?';
  var preGet = '?';
  if (form.isValid()) {
    for (var i in form.getValues()) {
      get += i + '\x3d' + form.getValues()[i] + '\x26';
      if (i == 'mode') {
        preGet += i + '\x3dxlsasync\x26';
      } else {
        preGet += i + '\x3d' + form.getValues()[i] + '\x26';
      }
    }
    console.log(preGet);
    Ext.Ajax.request({url:url + preGet, method:'GET', success:function(resp) {
      var obj = Ext.util.JSON.decode(resp.responseText);
      if (obj.success) {
        if (obj.count <= obj.maxcount) {
          Ext.StoreManager.get('reportsStores').reload();
          Ext.getCmp('SIMFitoTableWindow').close();
          Ext.Msg.alert('Info', 'Generazione del report avviata.');
        } else {
          Ext.Msg.alert('Errore', 'Troppi record selezionati dalla richiesta (' + obj.count + '), impossibile generare il foglio elettronico. Modificare i parametri della richiesta per ridurre il numero di risultati:');
        }
      } else {
        Ext.Msg.alert('Errore', obj.errors.reason);
      }
    }, failure:function(form, action) {
      if (action.failureType == 'server') {
        obj = Ext.util.JSON.decode(action.response.responseText);
        Ext.Msg.alert('Errore!', obj.errors.reason);
      } else {
        Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
      }
    }});
  }
}, text:'Continua'}, {xtype:'hiddenfield', flex:1, id:'uidx', name:'uid'}, {xtype:'hiddenfield', flex:1, id:'uty', fieldLabel:'Label', name:'uty'}, {xtype:'hiddenfield', flex:1, id:'upr', fieldLabel:'Label', name:'upr'}, {xtype:'hiddenfield', flex:1, name:'mode', value:'xls'}, {xtype:'hiddenfield', flex:1, name:'data', value:'tabbellone'}]}], listeners:{beforerender:'onWindowBeforeRender'}, init:function(params) {
  for (var i in params) {
    if (i == 'uid') {
      Ext.getCmp('uidx').setValue(params[i]);
    } else {
      Ext.getCmp(i).setValue(params[i]);
    }
  }
  if (params.uty == 1) {
    if (params.upr !== null) {
      var prvCombo = Ext.getCmp('provinciacombo');
      prvCombo.setReadOnly();
      Ext.StoreMgr.get('ProvinceStore').on('load', function(store, records, successfull, operation, eOpts) {
        var prvCode = Number(localStore.getItem('Provincia'));
        var idx = store.findExact('id', prvCode);
        console.log(idx);
        if (Ext.getCmp('provinciacombo') !== undefined) {
          Ext.getCmp('provinciacombo').setValue(store.getAt(idx).get('provincia'));
          Ext.getCmp('provinciacombo').setReadOnly(true);
        }
      });
      Ext.StoreMgr.get('ProvinceStore').load();
    } else {
      Ext.Msg.alert('Error', 'Utente di tipo amministratore provinciale con provincia non settata: contattare l\x26apos;assistenza!');
    }
  }
  this.params = params;
  this.show();
}});
Ext.define('SIMFito.view.TipoaziendaWindow', {extend:Ext.window.Window, alias:'widget.tipoaziendawindow', viewModel:{type:'tipoaziendawindow'}, constrain:true, height:600, width:800, layout:'fit', title:'Tipi Azienda', items:[{xtype:'gridpanel', autoLoad:true, store:'TipoaziendaallStore', dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.NuovoTipoaziendaWindow').show();
}, iconCls:'add', text:'Aggiungi'}]}], columns:[{xtype:'gridcolumn', flex:2, dataIndex:'descrizione', text:'Tipo'}, {xtype:'booleancolumn', dataIndex:'enabled', text:'Attivo', falseText:'No', trueText:'Si', filter:{type:'boolean'}}, {xtype:'actioncolumn', text:'Azioni', items:[{isDisabled:function(view, rowIndex, colIndex, item, record) {
  return record.get('attiva');
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var text = 'Attivare il tipo azienda: "' + record.get('descrizione') + '"?';
  var idmotivo = record.get('id');
  var store = Ext.StoreMgr.get('TipoaziendaallStore');
  Ext.Msg.confirm('Conferma', text, function(btn, value, opt) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'update_tipoazienda_visita', field:'attiva', value:'true', id:idmotivo}, success:function(response, opts) {
        obj = Ext.util.JSON.decode(response.responseText);
        var success = obj.success;
        if (success) {
          store.reload();
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore', obj.errors.reason);
        } else {
          Ext.Msg.alert('Errore', 'Server non raggiungibile: ' + action.response.responseText);
        }
      }});
    }
  });
}, iconCls:'check', tooltip:'Attiva'}, {isDisabled:function(view, rowIndex, colIndex, item, record) {
  return !record.get('attiva');
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var text = 'Disattivare il tipo azienda: "' + record.get('descrizione') + '"?';
  var idmotivo = record.get('id');
  var store = Ext.StoreMgr.get('TipoaziendaallStore');
  Ext.Msg.confirm('Conferma', text, function(btn, value, opt) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'update_tipoazienda_visita', field:'attiva', value:'false', id:idmotivo}, success:function(response, opts) {
        obj = Ext.util.JSON.decode(response.responseText);
        var success = obj.success;
        if (success) {
          store.reload();
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore', obj.errors.reason);
        } else {
          Ext.Msg.alert('Errore', 'Server non raggiungibile: ' + action.response.responseText);
        }
      }});
    }
  });
}, iconCls:'delete', tooltip:'Disattiva'}]}], plugins:[{ptype:'gridfilters'}]}]});
Ext.define('SIMFito.view.TipocampioneWindow', {extend:Ext.window.Window, alias:'widget.tipocampionewindow', viewModel:{type:'tipocampionewindow'}, constrain:true, height:600, width:800, layout:'fit', title:'Tipo Serie Campioni', items:[{xtype:'gridpanel', autoLoad:true, store:'TipoCampioneStoreAll', dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.NuovoTipoCampioneWindow').show();
}, iconCls:'add', text:'Aggiungi'}]}], columns:[{xtype:'gridcolumn', flex:2, dataIndex:'description', text:'Descrizione'}, {xtype:'booleancolumn', dataIndex:'enabled', text:'Attivo', falseText:'No', trueText:'Si', filter:{type:'boolean'}}, {xtype:'actioncolumn', text:'Azioni', items:[{isDisabled:function(view, rowIndex, colIndex, item, record) {
  return record.get('enabled');
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var text = 'Attivare il tipo serie campione: "' + record.get('description') + '"?';
  var idtipo = record.get('id');
  var store = Ext.StoreMgr.get('TipoCampioneStoreAll');
  Ext.Msg.confirm('Conferma', text, function(btn, value, opt) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'update_tipocampione', field:'enabled', value:'true', id:idtipo}, success:function(response, opts) {
        obj = Ext.util.JSON.decode(response.responseText);
        var success = obj.success;
        if (success) {
          store.reload();
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore', obj.errors.reason);
        } else {
          Ext.Msg.alert('Errore', 'Server non raggiungibile: ' + action.response.responseText);
        }
      }});
    }
  });
}, iconCls:'check', tooltip:'Attiva'}, {isDisabled:function(view, rowIndex, colIndex, item, record) {
  return !record.get('enabled');
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var text = 'Disattivare il tipo serie campione: "' + record.get('description') + '"?';
  var idtipo = record.get('id');
  var store = Ext.StoreMgr.get('TipoCampioneStoreAll');
  Ext.Msg.confirm('Conferma', text, function(btn, value, opt) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'update_tipocampione', field:'enabled', value:'false', id:idtipo}, success:function(response, opts) {
        obj = Ext.util.JSON.decode(response.responseText);
        var success = obj.success;
        if (success) {
          store.reload();
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore', obj.errors.reason);
        } else {
          Ext.Msg.alert('Errore', 'Server non raggiungibile: ' + action.response.responseText);
        }
      }});
    }
  });
}, iconCls:'delete', tooltip:'Disattiva'}]}], plugins:[{ptype:'gridfilters'}]}]});
Ext.define('SIMFito.view.TipotrappolaWindow1', {extend:Ext.window.Window, alias:'widget.tipotrappolawindow1', viewModel:{type:'tipotrappolawindow1'}, constrain:true, height:600, width:800, layout:'fit', title:'Tipo Trappola', items:[{xtype:'gridpanel', autoLoad:true, store:'tipoTrappoleAllStore', dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'button', handler:function(button, e) {
  Ext.create('SIMFito.view.NuovoTipoTrappolaWindow').show();
}, iconCls:'add', text:'Aggiungi'}]}], columns:[{xtype:'gridcolumn', flex:2, dataIndex:'descrizione', text:'Descrizione (italiano)'}, {xtype:'gridcolumn', flex:2, dataIndex:'description', text:'Descrizione (inglese)'}, {xtype:'booleancolumn', dataIndex:'enabled', text:'Attivo', falseText:'No', trueText:'Si', filter:{type:'boolean'}}, {xtype:'actioncolumn', text:'Azioni', items:[{isDisabled:function(view, rowIndex, colIndex, item, record) {
  return record.get('enabled');
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var text = 'Attivare il tipo serie campione: "' + record.get('descrizione') + '"?';
  var idtipo = record.get('id');
  var store = Ext.StoreMgr.get('tipoTrappoleAllStore');
  Ext.Msg.confirm('Conferma', text, function(btn, value, opt) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'update_tipotrappola', field:'deleted', value:'false', id:idtipo}, success:function(response, opts) {
        obj = Ext.util.JSON.decode(response.responseText);
        var success = obj.success;
        if (success) {
          store.reload();
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore', obj.errors.reason);
        } else {
          Ext.Msg.alert('Errore', 'Server non raggiungibile: ' + action.response.responseText);
        }
      }});
    }
  });
}, iconCls:'check', tooltip:'Attiva'}, {isDisabled:function(view, rowIndex, colIndex, item, record) {
  return !record.get('enabled');
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var text = 'Disattivare il tipo serie campione: "' + record.get('description') + '"?';
  var idtipo = record.get('id');
  var store = Ext.StoreMgr.get('tipoTrappoleAllStore');
  Ext.Msg.confirm('Conferma', text, function(btn, value, opt) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'update_tipotrappola', field:'deleted', value:'true', id:idtipo}, success:function(response, opts) {
        obj = Ext.util.JSON.decode(response.responseText);
        var success = obj.success;
        if (success) {
          store.reload();
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore', obj.errors.reason);
        } else {
          Ext.Msg.alert('Errore', 'Server non raggiungibile: ' + action.response.responseText);
        }
      }});
    }
  });
}, iconCls:'delete', tooltip:'Disattiva'}]}], plugins:[{ptype:'gridfilters'}]}]});
Ext.define('SIMFito.view.TrapReportWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.trapreportwindow'});
Ext.define('SIMFito.view.TrapReportWindow', {extend:Ext.window.Window, alias:'widget.trapreportwindow', viewModel:{type:'trapreportwindow'}, constrain:true, height:314, scrollable:true, weight:600, width:400, layout:'fit', title:'Report Trappole', items:[{xtype:'form', scrollable:true, defaults:{labelAlign:'top'}, bodyPadding:10, baseParams:{mode:'xls', data:'trappole'}, url:'services/export.php', items:[{xtype:'datefield', anchor:'100%', fieldLabel:'Dal', name:'from', emptyText:'Lasciare vuoto per tutte le date', 
submitFormat:'Y-m-d'}, {xtype:'datefield', anchor:'100%', fieldLabel:'Al', name:'to', emptyText:'Lasciare vuoto per tutte le date', maxValue:'01/01/2022', submitFormat:'Y-m-d'}, {xtype:'tagfield', anchor:'100%', fieldLabel:'Parassita di riferimento', name:'mainpest', emptyText:'Lasciare vuoto per tutti i parassiti di riferimento', displayField:'mainpest', store:'TrappoleReportComboStore', valueField:'organismo', encodeSubmitValue:true}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form');
  var url = urlPrefix + 'services/export.php?mode\x3dxls\x26data\x3dtrappole\x26';
  for (var i in form.getValues()) {
    console.log(form.getValues()[i]);
    url += i + '\x3d' + form.getValues()[i] + '\x26';
  }
  url += '\x26uid\x3d' + localStore.getItem('ID');
  window.open(url, '_blank');
}, anchor:'100%', text:'Estrai'}]}]});
Ext.define('SIMFito.view.TrapReportWindowViewModel1', {extend:Ext.app.ViewModel, alias:'viewmodel.trapreportwindow1'});
Ext.define('SIMFito.view.TrapReportWindow1', {extend:Ext.window.Window, alias:'widget.trapreportwindow1', viewModel:{type:'trapreportwindow1'}, constrain:true, height:314, scrollable:true, weight:600, width:400, layout:'fit', title:'Report Attivit\x26agrave;', items:[{xtype:'form', scrollable:true, defaults:{labelAlign:'top'}, bodyPadding:10, baseParams:{mode:'xls', data:'trappole1'}, url:'services/export.php', items:[{xtype:'datefield', anchor:'100%', fieldLabel:'Dal', name:'from', emptyText:'Lasciare vuoto per tutte le date', 
submitFormat:'Y-m-d'}, {xtype:'datefield', anchor:'100%', fieldLabel:'Al', name:'to', emptyText:'Lasciare vuoto per tutte le date', maxValue:'01/01/2022', submitFormat:'Y-m-d'}, {xtype:'tagfield', anchor:'100%', fieldLabel:'Parassita di riferimento', name:'mainpest', emptyText:'Lasciare vuoto per tutti i parassiti di riferimento', displayField:'mainpest', store:'TrappoleReportComboStore', valueField:'organismo', encodeSubmitValue:true}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form');
  var url = urlPrefix + 'services/export.php?mode\x3dxls\x26data\x3dtrappole1\x26';
  for (var i in form.getValues()) {
    console.log(form.getValues()[i]);
    url += i + '\x3d' + form.getValues()[i] + '\x26';
  }
  if (Number(localStore.getItem('TipoUtente')) != 0) {
    if (Number(localStore.getItem(1)) == 1) {
      url += '\x26prv\x3d' + localStore.getItem('Provincia');
    } else {
      url += '\x26uid\x3d' + localStore.getItem('ID');
    }
  }
  window.open(url, '_blank');
}, anchor:'100%', text:'Estrai'}]}]});
Ext.define('SIMFito.view.TrapReportWindowViewModel2', {extend:Ext.app.ViewModel, alias:'viewmodel.trapreportwindow2'});
Ext.define('SIMFito.view.TrapReportWindow2', {extend:Ext.window.Window, alias:'widget.trapreportwindow2', viewModel:{type:'trapreportwindow2'}, constrain:true, height:397, scrollable:true, weight:600, width:400, layout:'fit', title:'Nuovo Report', items:[{xtype:'form', scrollable:true, defaults:{labelAlign:'top'}, bodyPadding:10, baseParams:{mode:'xls', data:'trappole1'}, url:'services/export.php', items:[{xtype:'datefield', anchor:'100%', fieldLabel:'Dal', name:'from', emptyText:'Lasciare vuoto per tutte le date', 
minValue:'01/01/2022', submitFormat:'Y-m-d'}, {xtype:'datefield', anchor:'100%', fieldLabel:'Al', name:'to', emptyText:'Lasciare vuoto per tutte le date', minValue:'01/01/2022', submitFormat:'Y-m-d'}, {xtype:'tagfield', anchor:'100%', fieldLabel:'Comune', name:'comuni', emptyText:'Lasciare vuoto per tutti', displayField:'nome', store:'ComuniStore', valueField:'istat', encodeSubmitValue:true}, {xtype:'tagfield', anchor:'100%', fieldLabel:'Parassita di riferimento', name:'mainpest', emptyText:'Lasciare vuoto per tutti i parassiti di riferimento', 
displayField:'mainpest', store:'TrappoleReportComboStore', valueField:'organismo', encodeSubmitValue:true}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form');
  var url = urlPrefix + 'services/export.php?mode\x3dxls\x26data\x3dtrappole2\x26';
  for (var i in form.getValues()) {
    console.log(form.getValues()[i]);
    url += i + '\x3d' + form.getValues()[i] + '\x26';
  }
  if (Number(localStore.getItem('TipoUtente')) != 0) {
    if (Number(localStore.getItem(1)) == 1) {
      url += '\x26prv\x3d' + localStore.getItem('Provincia');
    } else {
      url += '\x26uid\x3d' + localStore.getItem('ID');
    }
  }
  window.open(url, '_blank');
}, anchor:'100%', text:'Estrai'}]}]});
Ext.define('SIMFito.view.TrapReportWindowViewModel3', {extend:Ext.app.ViewModel, alias:'viewmodel.trapreportwindow3'});
Ext.define('SIMFito.view.TrapReportWindow3', {extend:Ext.window.Window, alias:'widget.trapreportwindow3', viewModel:{type:'trapreportwindow3'}, constrain:true, height:296, scrollable:true, weight:600, width:405, layout:'fit', title:'Trappole attive al ...', items:[{xtype:'form', scrollable:true, defaults:{labelAlign:'top'}, bodyPadding:10, baseParams:{mode:'xls', data:'trappole1'}, url:'services/export.php', items:[{xtype:'datefield', anchor:'100%', fieldLabel:'Data', name:'from', allowBlank:false, 
allowOnlyWhitespace:false, minValue:'01/01/2022', submitFormat:'Y-m-d'}, {xtype:'tagfield', anchor:'100%', fieldLabel:'Parassita di riferimento', name:'mainpest', emptyText:'Lasciare vuoto per tutti i parassiti di riferimento', displayField:'mainpest', store:'TrappoleReportComboStore', valueField:'organismo', encodeSubmitValue:true}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form');
  var url = urlPrefix + 'services/export.php?mode\x3dxls\x26data\x3dtrappole3\x26';
  for (var i in form.getValues()) {
    url += i + '\x3d' + form.getValues()[i] + '\x26';
  }
  if (Number(localStore.getItem('TipoUtente')) != 0) {
    if (Number(localStore.getItem(1)) == 1) {
      url += '\x26prv\x3d' + localStore.getItem('Provincia');
    } else {
      url += '\x26uid\x3d' + localStore.getItem('ID');
    }
  }
  console.log(url);
  window.open(url, '_blank');
}, anchor:'100%', text:'Estrai'}]}]});
Ext.define('SIMFito.view.TrappoleAttiveNelWindow', {extend:Ext.window.Window, alias:'widget.trappoleattivenelwindow', controller:'trappoleattivenelwindow', viewModel:{type:'trappoleattivenelwindow'}, constrain:true, height:278, scrollable:true, width:571, layout:'fit', title:'Trappole attive in un periodo', dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('window').down('form');
  if (form.isValid()) {
    var treeStore = Ext.StoreManager.get('DatasetTreeStore');
    var root = treeStore.getRoot();
    if (!root.isExpanded()) {
      root.expand();
    }
    var pestcode = Ext.getCmp('bufferpestcode10').getValue();
    var start = Ext.Date.format(Ext.getCmp('start10').getValue(), 'Ymd');
    var end = Ext.Date.format(Ext.getCmp('end10').getValue(), 'Ymd');
    var title = 'Trappole attive per: ' + pestcode + ' dal ' + start + ' al ' + end;
    var variables = {title:title, pestcode:pestcode, start:start, end:end};
    var leaf = createElabElement(12, variables);
    var branch = treeStore.getById('elaborazioni');
    var form = button.up('window').down('form');
    if (form.isValid()) {
      extraLayerFromLeaf(leaf, 1);
      branch.appendChild(leaf);
    }
  }
}, text:'Esegui'}, {xtype:'button', handler:function(button, e) {
  console.log(button);
  button.up('window').close();
}, text:'Chiudi'}]}], items:[{xtype:'form', flex:1, scrollable:true, bodyPadding:5, url:'services/ajax.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldset', flex:1, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', anchor:'95%', id:'bufferpestcode10', fieldLabel:'Parassita', labelAlign:'top', name:'code', allowBlank:false, allowOnlyWhitespace:false, displayField:'name', store:'ParassitiStore2', valueField:'pestcode', listeners:{select:'onComboboxSelect'}}, {xtype:'fieldcontainer', 
defaults:{padding:'2'}, layout:'hbox', items:[{xtype:'datefield', flex:1, id:'start10', fieldLabel:'Da', labelAlign:'top', name:'start', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'datefield', flex:1, id:'end10', fieldLabel:'A', labelAlign:'top', name:'end', allowBlank:false, allowOnlyWhitespace:false}]}]}]}], inizialize:function() {
}});
Ext.define('SIMFito.view.TrappolePanelViewModel2', {extend:Ext.app.ViewModel, alias:'viewmodel.trappolepanel1'});
Ext.define('SIMFito.view.TrappolePanelViewController2', {extend:Ext.app.ViewController, alias:'controller.trappolepanel1', onGridpanelSelect:function(rowmodel, record, index, eOpts) {
  var xgeometry = record.get('geometry');
  var label = record.get('codice');
  var userData = Ext.getCmp('trappole1').userData;
  Ext.StoreManager.get('OsservazioniStore1').getProxy().setExtraParam('idtrappola', record.get('id'));
  if (xgeometry !== null && xgeometry !== '') {
    var geometry = Ext.util.JSON.decode(xgeometry);
    geometry.label = label;
    gExtent = addGeometry(id, geometry, false, 'trappole');
    var datascheda = new Date(Ext.getCmp('trappole1').userData.data_sopralluogo);
    var datacreazione = record.get('datacreazione');
    if (record.get('stato_id') == 0) {
      if (record.get('singleuse') && record.get('scheda_id') == userData.idScheda) {
        Ext.StoreManager.get('OsservazioniStore1').reload();
      } else {
        if (datacreazione.valueOf() < datascheda.valueOf()) {
          Ext.StoreManager.get('OsservazioniStore1').reload();
        } else {
          Ext.getCmp('trap1Controllo').setDisabled(true);
          Ext.Msg.alert('Attenzione', 'La trappola selezionata ha una data di creazione successiva o uguale alla data di questa scheda (' + Ext.util.Format.date(datascheda, 'd-m-Y') + '). Pertanto nessun controllo \x26egrave; possibile! Grazie.');
        }
      }
    } else {
      Ext.getCmp('trap1Controllo').setDisabled(true);
      Ext.Msg.alert('Attenzione', 'La trappola selezionata \x26egrave; nello stato: \x3cb\x3e' + record.get('stato') + '\x3c/b\x3e; pertanto nessun controllo \x26egrave possibile! Grazie.');
    }
  }
  Ext.getCmp('trap1Controllo').reset();
  Ext.getCmp('trap1Controllo').setDisabled(true);
}, onGridpanelRowbodyClick:function(view, rowBodyEl, e, eOpts) {
  var xgeometry = record.get('geometry');
  var label = record.get('codice');
  if (xgeometry !== null && xgeometry !== '') {
    var geometry = Ext.util.JSON.decode(xgeometry);
    geometry.label = label;
    gExtent = addGeometry(id, geometry, true, 'trappole');
  }
}, onCheckboxfieldChange1:function(field, newValue, oldValue, eOpts) {
  map.getLayers().array_[1].setVisible(newValue);
  map.getLayers().array_[2].setVisible(newValue);
  map.getLayers().array_[3].setVisible(newValue);
  Ext.getCmp('SIMFitoSliderTP1').setValue(100);
}, onCheckboxfieldAfterRender:function(component, eOpts) {
  component.setValue(false);
  map.getLayers().array_[1].setVisible(false);
  map.getLayers().array_[2].setVisible(false);
  map.getLayers().array_[3].setVisible(false);
  Ext.getCmp('SIMFitoSliderTP1').setValue(100);
}, onSliderChange:function(slider, newValue, thumb, type, eOpts) {
  setAEOpacity(newValue);
}, onSliderAfterRender:function(component, eOpts) {
  component.setValue(100);
}, onButtonBeforeRender:function(component, eOpts) {
  if (localStore.getItem('TipoUtente') == 0) {
    component.setDisabled(true);
  }
}, onGridpanelControlloSelect:function(rowmodel, record, index, eOpts) {
  var stato = Ext.getCmp('trappole1').userData.statoScheda;
  console.log(stato);
  Ext.getCmp('trap1Controllo').setDisabled(false);
  Ext.getCmp('trap1Suprap').setValue(record.get('sup_vis'));
  Ext.getCmp('trap1Unitrap').setValue(record.get('unit_chk'));
  var mainHost = record.get('hostcode');
  var cb = Ext.getCmp('trap1Host');
  cb.store.on('load', setMainHost = function(records, operation, success) {
    cb.select(records.getAt(0));
    cb.store.un('load', setMainHost);
  });
  cb.doQuery(record.get('ospite'));
  cbpest = Ext.getCmp('trap1Pest');
  if (record.get('parassita') != '' && record.get('parassita') != null) {
    cbpest.store.on('load', setMainPest = function(records, operation, success) {
      cbpest.select(records.getAt(0));
      cbpest.store.un('load', setMainPest);
    });
    cbpest.doQuery(record.get('parassita'));
  }
  Ext.getCmp('trap1Controllo').baseParams.idosservazioni = record.get('idosservazioni');
  var cbCampioneCode = Ext.getCmp('trap1Campione');
  var campCode = record.get('codice');
  if (record.get('campione')) {
    cbCampioneCode.getStore().on('load', setCampioneCode = function(records, operation, success) {
      cbCampioneCode.setValue(campCode);
      var rec = cbCampioneCode.getSelectedRecord();
      Ext.getCmp('trap1Controllo').baseParams.nuovocampione = rec.get('nuovo');
      Ext.getCmp('trap1Controllo').baseParams.idcampione = rec.get('id');
      Ext.getCmp('trap1Elementiserie').setValue(rec.get('elementicampione'));
      Ext.getCmp('trap1Tiposerie').setValue(rec.get('tipocampione_id'));
      cbCampioneCode.getStore().un('load', setCampioneCode);
    });
    Ext.getCmp('trap1campionechk').setValue(true);
    cbCampioneCode.getStore().load();
  } else {
    Ext.getCmp('trap1campionechk').setValue(false);
  }
  if (record.get('tempo') != '') {
    Ext.getCmp('trap1Tempo').setValue(record.get('tempo'));
    Ext.getCmp('trap1Tempo').originalValue = record.get('tempo');
  }
  if (record.get('catture') != '') {
    Ext.getCmp('trap1Catture').setValue(record.get('catture'));
  }
  if (record.get('cambioferomone') != '') {
    Ext.getCmp('trap1Cambioferomone').setValue(record.get('cambioferomone'));
  }
  var items = ['Host', 'Pest', 'Suprap', 'Unitrap', 'Catture', 'Cambioferomone', 'campionechk', 'Campione', 'Elementiserie', 'Tiposerie', 'Tempo'];
  if (stato > 0) {
    Ext.getCmp('trap1Salva').setDisabled(true);
    for (var i in items) {
      Ext.getCmp('trap1' + items[i]).setReadOnly(true);
    }
  } else {
    Ext.getCmp('trap1Salva').setDisabled(false);
    for (var i in items) {
      Ext.getCmp('trap1' + items[i]).setReadOnly(false);
    }
  }
}, onCheckboxfieldChange:function(field, newValue, oldValue, eOpts) {
  var fieldList = ['trap1Campione', 'trap1Elementiserie', 'trap1Tiposerie'];
  if (newValue) {
    for (var i in fieldList) {
      Ext.getCmp(fieldList[i]).setDisabled(false);
    }
  } else {
    for (var i in fieldList) {
      Ext.getCmp(fieldList[i]).reset();
      Ext.getCmp(fieldList[i]).setDisabled(true);
    }
  }
}, onTrap1CampioneSelect:function(combo, record, eOpts) {
  Ext.getCmp('trap1Controllo').baseParams.nuovocampione = record.get('nuovo');
  Ext.getCmp('trap1Controllo').baseParams.idcampione = record.get('id');
  Ext.getCmp('trap1Elementiserie').setValue(record.get('elementicampione'));
  Ext.getCmp('trap1Tiposerie').setValue(record.get('tipocampione_id'));
}, onTrappoleShow:function(component, eOpts) {
}, onTrappole1AfterRender:function(component, eOpts) {
  Ext.StoreMgr.get('TipocampioneStore').load();
  Ext.Msg.alert('Attenzione', 'Selezionare una trappola per poter registrare le catture! Grazie.');
  removeInteraction();
  var piva = component.userData.piva;
  var gid = component.userData.gid_sito;
  map.removeLayer(sitiLayer);
  sitiLayer = new ol.layer.Tile({visible:true, source:new ol.source.TileWMS({url:wmsUrl, params:{'LAYERS':'simfito:siti', 'TILED':true, 'VIEWPARAMS':'id:' + piva}, serverType:'geoserver'}), title:'siti ' + piva});
  trappoleLayer2 = new ol.layer.Tile({visible:true, source:new ol.source.TileWMS({url:wmsUrl, params:{'LAYERS':'simfito:trappole', 'TILED':true, 'VIEWPARAMS':'gid:' + gid}, serverType:'geoserver'}), title:'trappole'});
  trappoleLayer = new ol.layer.Tile({visible:true, source:new ol.source.TileWMS({url:wmsUrl, params:{'LAYERS':'simfito:trappole_all', 'TILED':true}, serverType:'geoserver'}), title:'trappole'});
  map.addLayer(sitiLayer);
  map.addLayer(trappoleLayer2);
  map.addLayer(trappoleLayer);
  map.getView().fit(extent, map.getSize());
  var xgeometry = component.userData.geometry;
  var azienda = component.userData.azienda;
  var sito = component.userData.sito;
  var label = azienda + '\n' + sito;
  var id = component.userData.idScheda;
  if (xgeometry !== null && xgeometry !== '') {
    var geometry = Ext.util.JSON.decode(xgeometry);
    geometry.label = label;
    gExtent = addGeometry(id, geometry, true, 'siti');
  }
  var stato = Ext.getCmp('trappole1').userData.statoScheda;
  if (stato >= 1 || stato == -1) {
    Ext.getCmp('trapNuovatrappola').setDisabled(true);
  } else {
    Ext.getCmp('trapNuovatrappola').setDisabled(false);
  }
}, onTrappole1BeforeDestroy:function(component, eOpts) {
  var id = component.userData.idScheda;
  removeLayerBy('idItem', id);
  removeLayerBy('myGroup', 'siti');
  removeLayerBy('myGroup', 'osservazioni');
  map.removeLayer(sitiLayer);
  map.removeLayer(trappoleLayer2);
  map.removeLayer(trappoleLayer);
}, onTrappole1BeforeRender:function(component, eOpts) {
  var id = component.userData.idScheda;
  Ext.StoreMgr.get('CampionecodeStore').getProxy().setExtraParam('idscheda', id);
  Ext.StoreManager.get('OsservazioniStore1').getProxy().setExtraParam('idscheda', id);
  Ext.StoreManager.get('OsservazioniStore1').getProxy().setExtraParam('idtrappola', null);
  Ext.StoreManager.get('OsservazioniStore1').reload();
  Ext.getCmp('trap1Controllo').baseParams.idscheda = id;
}});
Ext.define('SIMFito.view.TrappolePanel1', {extend:Ext.container.Container, alias:'widget.trappolepanel1', controller:'trappolepanel1', viewModel:{type:'trappolepanel1'}, id:'trappole1', scrollable:true, layout:'border', items:[{xtype:'container', flex:1, region:'center', split:false, flex:1, id:'maintrappolecontainer1', minHeight:700, scrollable:true, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'gridpanel', flex:4, flex:2, id:'trappoleallgrid1', minHeight:200, scrollable:true, collapsible:true, 
title:'Trappole', autoLoad:true, store:'TrapStore', columns:[{xtype:'numbercolumn', flex:1, minWidth:75, dataIndex:'id', text:'Id', tooltip:'Id', format:'0'}, {xtype:'gridcolumn', flex:4, dataIndex:'codice', text:'Codice', tooltip:'Codice'}, {xtype:'gridcolumn', flex:5, dataIndex:'nome', text:'Codifica interna', tooltip:'Codifica Interna'}, {xtype:'datecolumn', flex:3, dataIndex:'datacreazione', text:'Posizionamento', tooltip:'Posizionamento', format:'d/m/Y'}, {xtype:'datecolumn', flex:3, dataIndex:'datavariazione', 
text:'Ultima modifica', tooltip:'Ultima Modifica', format:'d/m/Y'}, {xtype:'gridcolumn', flex:2, dataIndex:'stato', text:'Stato', tooltip:'Stato'}, {xtype:'gridcolumn', flex:3, dataIndex:'tecnico', text:'Tecnico posizionamento', tooltip:'Tecnico posizionamento'}, {xtype:'actioncolumn', minWidth:120, text:'Azioni', items:[{handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var idscheda = Ext.getCmp('trappole1').userData.idScheda;
  var pestcode = record.get('pest');
  var hostcode = record.get('host');
  var idtrappola = record.get('id');
  var appezzamento = record.get('suptot');
  var sup_vis = record.get('suprap');
  var unit_chk = record.get('unitrap');
  var extraParams = {fase:'pestobscatture', idscheda:idscheda, pestcode:pestcode, hostcode:hostcode, trappole_geometry_id:idtrappola, appezzamento:appezzamento, sup_vis:sup_vis, unita_chk:unit_chk};
  Ext.StoreManager.get('OsservazioniStore1').getProxy().setExtraParam('idtrappola', idtrappola);
  Ext.Ajax.request({url:'services/ajax-save-form.php', timeout:1000000, params:extraParams, success:function(response, opts) {
    var obj = Ext.decode(response.responseText);
    if (obj.success) {
      Ext.StoreManager.get('OsservazioniStore1').reload();
    } else {
      Ext.Msg.alert('Errore', obj.errors.reason);
    }
  }, faillure:function(response, opts) {
    Ext.Msg.alert('Errore', 'Il server ha risponso con status code: ' + response.status);
  }});
}, isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  var stato = Ext.getCmp('trappole1').userData.statoScheda;
  var datascheda = new Date(Ext.getCmp('trappole1').userData.data_sopralluogo);
  var datacreazione = record.get('datacreazione');
  var userData = Ext.getCmp('trappole1').userData;
  if (record.get('stato_id') > 0) {
    return true;
  } else {
    if (record.get('singleuse') && record.get('scheda_id') == userData.idScheda) {
      if (stato == 0) {
        return false;
      } else {
        return true;
      }
    } else {
      if (datacreazione.valueOf() < datascheda.valueOf()) {
        if (stato == 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  }
}, iconCls:'controllo', tooltip:'Controllo/cambio feromone'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('id');
  var datacreazione = record.get('datacreazione');
  var datascheda = new Date(Ext.getCmp('trappole1').userData.data_sopralluogo);
  if (datacreazione.valueOf() <= datascheda.valueOf()) {
    Ext.MessageBox.prompt('Conferma', 'Prima di confermare la rimozione inserire il tempo impiegato in minuti', function(btn, tempo, opt) {
      var idtecnico = localStore.getItem('ID');
      var patt = /^\d+$/;
      var idscheda = Ext.getCmp('trappole1').userData.idScheda;
      var dataSopralluogo = Ext.getCmp('trappole1').userData.data_sopralluogo;
      if (patt.test(tempo)) {
        if (btn == 'ok') {
          Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'rimuovi-trappola', id:id, tecnicoid:idtecnico, tempo:tempo, idscheda:idscheda, data:dataSopralluogo}, success:function(resp) {
            var obj = Ext.util.JSON.decode(resp.responseText);
            if (obj.success) {
              if (typeof trappoleLayer != 'undefined') {
                trappoleLayer.getSource().updateParams({'time':Date.now()});
              }
              Ext.StoreMgr.get('TrapStore').reload();
              Ext.StoreMgr.get('AllTrapStore').reload();
            } else {
              Ext.Msg.alert('Errore', obj.errors.reason);
            }
          }, failure:function(form, action) {
            if (action.failureType == 'server') {
              obj = Ext.util.JSON.decode(action.response.responseText);
              Ext.Msg.alert('Errore!', obj.errors.reason);
            } else {
              Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
            }
          }});
        }
      } else {
        Ext.Msg.alert('Errore', tempo + ' non \x26egrave; valido! Riprovare inserendo un numero intero!');
      }
    });
  } else {
    Ext.Msg.alert('Attenzione', 'La trappola selezionata ha una data di creazione successiva alla data di questa scheda (' + Ext.util.Format.date(datascheda, 'd-m-Y') + '). Pertanto non pu\x26ograve; essere rimossa! Grazie.');
  }
}, isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  var disabled = record.get('stato_id') === 0 ? false : true;
  var stato = Ext.getCmp('trappole1').userData.statoScheda;
  var datascheda = new Date(Ext.getCmp('trappole1').userData.data_sopralluogo);
  var datacreazione = record.get('datacreazione');
  if (datacreazione.valueOf() < datascheda.valueOf()) {
    if (!disabled) {
      var stato = Ext.getCmp('trappole1').userData.statoScheda;
      if (stato >= 1 || stato == -1) {
        disabled = true;
      } else {
        disabled = false;
      }
    }
    return disabled;
  } else {
    return true;
  }
}, iconCls:'delete1', tooltip:'Rimozione'}, {isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  var disabled = record.get('stato_id') === 0 || record.get('mainpest') == 'N/A' ? true : false;
  var stato = Ext.getCmp('trappole1').userData.statoScheda;
  var datascheda = new Date(Ext.getCmp('trappole1').userData.data_sopralluogo);
  var datacreazione = record.get('datacreazione');
  if (datacreazione.valueOf() < datascheda.valueOf()) {
    if (!disabled) {
      var stato = Ext.getCmp('trappole1').userData.statoScheda;
      if (stato >= 1 || stato == -1) {
        disabled = true;
      } else {
        disabled = false;
      }
    }
    return disabled;
  } else {
    return true;
  }
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('id');
  var datacreazione = record.get('datacreazione');
  var datascheda = new Date(Ext.getCmp('trappole1').userData.data_sopralluogo);
  if (datacreazione.valueOf() <= datascheda.valueOf()) {
    Ext.MessageBox.prompt('Conferma', 'Prima di confermare il riutilizzo inserire il tempo impiegato in minuti', function(btn, tempo, opt) {
      var idtecnico = localStore.getItem('ID');
      var patt = /^\d+$/;
      if (btn == 'ok') {
        var idtecnico = localStore.getItem('ID');
        var idscheda = Ext.getCmp('trappole1').userData.idScheda;
        var dataSopralluogo = Ext.getCmp('trappole1').userData.data_sopralluogo;
        if (patt.test(tempo)) {
          var uid = localStore.getItem('ID');
          var scheda = Ext.getCmp('trappole1').userData.idScheda;
          var originalValue = tempo;
          var toReturn = false;
          var toReturn;
          Ext.Ajax.request({url:'services/ajax.php', params:{mode:'temporesiduo', idtecnico:uid, idscheda:scheda}, async:false, method:'POST', success:function(response, opts) {
            var obj = Ext.util.JSON.decode(response.responseText);
            if (obj.success) {
              var residuo = Number(obj.data[0].residuo);
              var value = Number(tempo);
              if (residuo - value >= 0) {
                toReturn = true;
              } else {
                toReturn = 'Restano solo ' + residuo + ' disponibili.';
              }
            } else {
              toReturn = 'Errore: ' + obj.errors.reason;
            }
          }, failure:function(form, action) {
            switch(action.failureType) {
              case Ext.form.action.Action.CLIENT_INVALID:
                Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
                break;
              case Ext.form.action.Action.CONNECT_FAILURE:
                Ext.Msg.alert('Failure', 'Ajax communication failed');
                break;
              case Ext.form.action.Action.SERVER_INVALID:
                Ext.Msg.alert('Failure', action.result.errors.reason);
                break;
            }
          }});
          if (toReturn === true) {
            Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'riusa-trappola', id:id, tecnicoid:idtecnico, tempo:tempo, idscheda:idscheda, data:dataSopralluogo}, success:function(resp) {
              var obj = Ext.util.JSON.decode(resp.responseText);
              if (obj.success) {
                if (typeof trappoleLayer != 'undefined') {
                  trappoleLayer.getSource().updateParams({'time':Date.now()});
                }
                Ext.StoreMgr.get('TrapStore').reload();
                Ext.StoreMgr.get('AllTrapStore').reload();
              } else {
                Ext.Msg.alert('Errore', obj.errors.reason);
              }
            }, failure:function(form, action) {
              if (action.failureType == 'server') {
                obj = Ext.util.JSON.decode(action.response.responseText);
                Ext.Msg.alert('Errore!', obj.errors.reason);
              } else {
                Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
              }
            }});
          } else {
            Ext.Msg.alert('attenzione', toReturn);
          }
        } else {
          Ext.Msg.alert('Attenzione', 'Inserire un numero intero positivo!');
        }
      }
    });
  } else {
    Ext.Msg.alert('Attenzione', 'La trappola selezionata ha una data di creazione successiva alla data di questa scheda (' + Ext.util.Format.date(datascheda, 'd-m-Y') + '). Pertanto non pu\x26ograve; essere riutilizzata! Grazie.');
  }
}, iconCls:'refresh', tooltip:'Riutilizza'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('id');
  Ext.MessageBox.show({title:'ELIMINAZIONE TRAPPOLA ID: ' + id, message:'\x3cb\x3eATTENZIONE la trappola verrà definitivamente cancellata\x3c/b\x3e. Per rimuoverla solo utilizare il pulsante rimuovi.', buttons:Ext.Msg.OKCANCEL, icon:Ext.Msg.QUESTION, fn:function(btn, opt) {
    var idtecnico = localStore.getItem('ID');
    var patt = /^\d+$/;
    if (btn == 'ok') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'cancella-trappola', id:id, tecnicoid:idtecnico}, success:function(resp) {
        var obj = Ext.util.JSON.decode(resp.responseText);
        if (obj.success) {
          if (typeof trappoleLayer != 'undefined') {
            trappoleLayer.getSource().updateParams({'time':Date.now()});
          }
          Ext.StoreMgr.get('TrapStore').reload();
          Ext.StoreMgr.get('AllTrapStore').reload();
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore!', obj.errors.reason);
        } else {
          Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
        }
      }});
    }
  }});
}, isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  var stato = Ext.getCmp('trappole1').userData.statoScheda;
  var datascheda = new Date(Ext.getCmp('trappole1').userData.data_sopralluogo);
  var datacreazione = record.get('datacreazione');
  var stato = Ext.getCmp('trappole1').userData.statoScheda;
  if (stato >= 1 || stato == -1) {
    disabled = true;
  } else {
    disabled = false;
  }
  return disabled;
}, iconCls:'delete', tooltip:'Elimina definitivamente'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  Ext.create('SIMFito.view.CodeWindow', {userData:{codice:record.get('codice')}}).show();
}, iconCls:'barcode', tooltip:'Mostra Codice'}]}], listeners:{select:'onGridpanelSelect', rowbodyclick:'onGridpanelRowbodyClick'}, plugins:[{ptype:'gridfilters'}], dockedItems:[{xtype:'toolbar', dock:'top', scrollable:true, items:[{xtype:'button', handler:function(button, e) {
  Ext.StoreMgr.get('TrapStore').reload();
}, iconCls:'fas fa-redo-alt', text:'Ricarica lista'}, {xtype:'button', handler:function(button, e) {
  var userData = button.up('#trappole1').userData;
  var gid = userData.gid_sito;
  var store = Ext.StoreMgr.get('TrapStore');
  store.getProxy().setExtraParam('gid', gid);
  store.reload();
  Ext.getCmp('trappole').setDisabled(false);
  Ext.getCmp('trappole').userData = userData;
  Ext.getCmp('mainpanel').setActiveItem('trappole');
}, id:'trapNuovatrappola', iconCls:'fas fa-biohazard', text:'Posiziona Nuova Trappola'}, {xtype:'tbfill'}, {xtype:'checkboxfield', fieldLabel:'', boxLabel:'AE Layer', listeners:{change:'onCheckboxfieldChange1', afterrender:'onCheckboxfieldAfterRender'}}, {xtype:'slider', id:'SIMFitoSliderTP1', width:300, fieldLabel:'Opacità AE', value:100, listeners:{change:'onSliderChange', afterrender:'onSliderAfterRender'}}, {xtype:'button', handler:function(button, e) {
  mapLayer = map.getLayers().array_;
  for (var i in mapLayer) {
    if (typeof mapLayer[i].getSource().getParams == 'function') {
      if (mapLayer[i].getSource().getParams().LAYERS == 'simfito:trappole_all') {
        mapLayer[i].setVisible(!mapLayer[i].getVisible());
      }
    }
  }
}, text:'Visualizza/Nascondi le trappole'}, {xtype:'button', handler:function(button, e) {
  var uid = localStore.getItem('ID');
  var scheda = button.up('#trappole1').userData.idScheda;
  Ext.Ajax.request({url:'services/ajax.php', params:{mode:'temporesiduo', idtecnico:uid, idscheda:scheda}, method:'POST', success:function(response, opts) {
    var obj = Ext.util.JSON.decode(response.responseText);
    if (obj.success) {
      var text = 'Tempo residuo  per il ' + obj.data[0].data + ': \x3cb\x3e' + obj.data[0].residuo + 'min.\x3c/b\x3e';
      Ext.Msg.alert('Tempo Residuo', text);
    } else {
      Ext.Msg.alert('Errore', obj.errors.reason);
    }
  }, failure:function(form, action) {
    switch(action.failureType) {
      case Ext.form.action.Action.CLIENT_INVALID:
        Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
        break;
      case Ext.form.action.Action.CONNECT_FAILURE:
        Ext.Msg.alert('Failure', 'Ajax communication failed');
        break;
      case Ext.form.action.Action.SERVER_INVALID:
        Ext.Msg.alert('Failure', action.result.errors.reason);
        break;
    }
  }});
}, iconCls:'fas fa-stopwatch', text:'Valuta Tempo Residuo', listeners:{beforerender:'onButtonBeforeRender'}}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/trappole.html#controllotrappole', 'Help');
}, iconCls:'help'}]}]}, {xtype:'gridpanel', flex:2, minHeight:200, scrollable:true, collapsible:true, title:'Controllo', store:'OsservazioniStore1', columns:[{xtype:'numbercolumn', dataIndex:'idosservazioni', text:'Id', format:'0000'}, {xtype:'gridcolumn', renderer:function(value, metaData, record, rowIndex, colIndex, store, view) {
  if (!record.get('completa')) {
    return '\x3cspan style\x3d"color:red;"\x3e' + value + '\x3c/span\x3e';
  } else {
    return value;
  }
}, flex:1, dataIndex:'parassita', text:'Agente nocivo'}, {xtype:'gridcolumn', renderer:function(value, metaData, record, rowIndex, colIndex, store, view) {
  if (!record.get('completa')) {
    return '\x3cspan style\x3d"color:red;"\x3e' + value + '\x3c/span\x3e';
  } else {
    return value;
  }
}, flex:1, dataIndex:'ospite', text:'Pianta ospite'}, {xtype:'numbercolumn', dataIndex:'sup_vis', text:'Superficie rappresentativa [m2]', format:'000'}, {xtype:'actioncolumn', text:'Azioni', items:[{isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  var stato = Ext.getCmp('trappole1').userData.statoScheda;
  if (stato == 0) {
    return false;
  } else {
    return true;
  }
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('idosservazioni');
  Ext.MessageBox.confirm('Conferma', "Eliminare l'osservazione?", function(btn) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'cancella-osservazione', id_osservazione:id}, success:function(resp) {
        var obj = Ext.util.JSON.decode(resp.responseText);
        if (obj.success) {
          Ext.StoreMgr.get('OsservazioniStore1').reload();
          Ext.getCmp('trap1Controllo').reset();
          Ext.getCmp('trap1Controllo').setDisabled(true);
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore!', obj.errors.reason);
        } else {
          Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
        }
      }});
    }
  });
}, iconCls:'delete', tooltip:'Elimina'}]}], listeners:{select:'onGridpanelControlloSelect'}, dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'button', handler:function(button, e) {
  Ext.getCmp('trap1Controllo').setDisabled(true);
  button.up('grid').getStore().reload();
}, iconCls:'fas fa-redo-alt', text:'Ricarica lista'}]}], plugins:[{ptype:'gridfilters'}]}, {xtype:'form', flex:3, disabled:true, id:'trap1Controllo', minHeight:200, scrollable:true, defaults:{labelAlign:'top'}, bodyPadding:10, baseParams:{fase:'obsupdate_new2'}, url:'services/ajax-save-form.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldset', flex:1, scrollable:true, layout:{type:'hbox', align:'stretch', pack:'center'}, items:[{xtype:'fieldset', flex:1, height:120, scrollable:true, 
width:400, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', id:'trap1Host', fieldLabel:'Pianta ospite associata', labelAlign:'top', msgTarget:'under', name:'host', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Digitare almeno 4 lettere e SELEZIONARE!', hideTrigger:true, displayField:'name', forceSelection:true, store:'PlantStore', valueField:'b_code'}, {xtype:'combobox', id:'trap1Pest', fieldLabel:'Organismo nocivo', labelAlign:'top', msgTarget:'under', 
name:'pest', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Digitare almeno 4 lettere e SELEZIONARE!', hideTrigger:true, displayField:'full_name', forceSelection:true, store:'TrapreferenceStore', valueField:'b_code'}, {xtype:'numberfield', id:'trap1Suprap', fieldLabel:'Superficie rappresentativa [m2]', labelAlign:'top', name:'sup_vis', blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', allowDecimals:false, allowExponential:false}, {xtype:'numberfield', 
id:'trap1Unitrap', fieldLabel:'Unit\x26agrave; rappresentative', labelAlign:'top', name:'n_osservate', blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', allowDecimals:false, allowExponential:false}, {xtype:'numberfield', id:'trap1Catture', fieldLabel:'Numero individui catturati', labelAlign:'top', name:'catture', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', allowDecimals:false, allowExponential:false}, {xtype:'checkboxfield', 
id:'trap1Cambioferomone', fieldLabel:'', name:'cambioferomone', boxLabel:'Cambio feromone/Attrattivo'}]}, {xtype:'fieldset', flex:1, height:120, scrollable:true, width:400, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldcontainer', flex:1, dock:'top', height:86, minHeight:207, width:400, fieldLabel:'Serie Campione', labelAlign:'top', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldcontainer', dock:'top', maxHeight:35, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'checkboxfield', 
id:'trap1campionechk', name:'campione', value:false, listeners:{change:'onCheckboxfieldChange'}}, {xtype:'combobox', flex:1, disabled:true, id:'trap1Campione', maxHeight:20, name:'codice', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', editable:false, emptyText:'Campo obbligatorio', displayField:'descrizione', queryCaching:false, store:'CampionecodeStore', valueField:'codice', listeners:{select:'onTrap1CampioneSelect'}}]}, {xtype:'fieldcontainer', layout:{type:'vbox', 
align:'stretch'}, items:[{xtype:'numberfield', disabled:true, id:'trap1Elementiserie', fieldLabel:'Elementi della serie', labelAlign:'top', name:'elementicampione', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatori', allowDecimals:false, allowExponential:false, minValue:1}, {xtype:'combobox', disabled:true, id:'trap1Tiposerie', fieldLabel:'Tipo serie campione', labelAlign:'top', name:'tipocampione_id', allowBlank:false, allowOnlyWhitespace:false, 
blankText:'Campo obbligatorio', editable:false, emptyText:'Campo obbligatorio', displayField:'tipocampione_description', queryCaching:false, store:'TipocampioneStore', valueField:'tipocampione_id'}]}]}, {xtype:'fieldcontainer', width:400, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'numberfield', validator:function(value) {
  var uid = localStore.getItem('ID');
  var scheda = this.up('#trappole1').userData.idScheda;
  var originalValue = this.originalValue;
  var toReturn = false;
  Ext.Ajax.request({url:'services/ajax.php', params:{mode:'temporesiduo', idtecnico:uid, idscheda:scheda}, async:false, method:'POST', success:function(response, opts) {
    var obj = Ext.util.JSON.decode(response.responseText);
    if (obj.success) {
      var residuo = Number(obj.data[0].residuo) + Number(originalValue);
      if (residuo - value >= 0) {
        toReturn = true;
      } else {
        toReturn = 'Restano solo ' + residuo + ' disponibili.';
      }
    } else {
      toReturn = 'Errore: ' + obj.errors.reason;
    }
  }, failure:function(form, action) {
    switch(action.failureType) {
      case Ext.form.action.Action.CLIENT_INVALID:
        Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
        break;
      case Ext.form.action.Action.CONNECT_FAILURE:
        Ext.Msg.alert('Failure', 'Ajax communication failed');
        break;
      case Ext.form.action.Action.SERVER_INVALID:
        Ext.Msg.alert('Failure', action.result.errors.reason);
        break;
    }
  }});
  return toReturn;
}, id:'trap1Tempo', fieldLabel:'Tempo impiegato [minuti x uomo]', labelAlign:'top', msgTarget:'under', name:'tempo', allowDecimals:false, allowExponential:false, minValue:1}]}]}]}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form');
  var stato = Ext.getCmp('trappole1').userData.statoScheda;
  if (stato > 0) {
    Ext.Msg.alert('Attenzione', 'Questa scheda non pu\x26ograve; pi\x26ugrave; essere modificata!');
  } else {
    if (form.isValid()) {
      var Continue = true;
      if (form.getValues().campione !== undefined) {
        if (Ext.getCmp('trap1Campione').getSelection() !== null) {
          var combo = Ext.getCmp('trap1Campione');
          var data = combo.getSelection();
          if (data.get('nuovo')) {
            Ext.create('SIMFito.view.LaboratorioWindow', {userData:form}).show();
            Continue = false;
          }
        }
      }
      if (Continue) {
        form.getForm().submit({submitEmptyText:false, method:'POST', waitTitle:'Connessione', waitMsg:'Invio dei dati...', success:function(form, action) {
          var result = action.result;
          if (result.success) {
            Ext.getCmp('trap1Controllo').setDisabled(true);
            Ext.StoreMgr.get('OsservazioniStore1').reload();
            Ext.Msg.alert('Info', 'Controllo salvato con successo');
          } else {
            Ext.Msg.alert('ERRORE', result.errors.reason);
          }
        }, failure:function(form, action) {
          osservazioneFormReset();
          if (action.failureType == 'server') {
            var obj = Ext.util.JSON.decode(action.response.responseText);
            Ext.Msg.alert('Errore!', obj.errors.reason);
          } else {
            Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
          }
        }});
      }
    }
  }
}, formBind:true, id:'trap1Salva', text:'Salva'}]}]}], listeners:{show:'onTrappoleShow', afterrender:'onTrappole1AfterRender', beforedestroy:'onTrappole1BeforeDestroy', beforerender:'onTrappole1BeforeRender'}});
Ext.define('SIMFito.view.TrappolePosizionateNelWindow', {extend:Ext.window.Window, alias:'widget.trappoleposizionatenelwindow', controller:'trappoleposizionatenelwindow', viewModel:{type:'trappoleposizionatenelwindow'}, constrain:true, height:278, scrollable:true, width:571, layout:'fit', title:'Trappole posizionate', dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('window').down('form');
  if (form.isValid()) {
    var treeStore = Ext.StoreManager.get('DatasetTreeStore');
    var root = treeStore.getRoot();
    if (!root.isExpanded()) {
      root.expand();
    }
    var pestcode = Ext.getCmp('bufferpestcode9').getValue();
    var start = Ext.Date.format(Ext.getCmp('start9').getValue(), 'Ymd');
    var end = Ext.Date.format(Ext.getCmp('end9').getValue(), 'Ymd');
    var title = 'Trappole posizionate per: ' + pestcode + ' dal ' + start + ' al ' + end;
    var variables = {title:title, pestcode:pestcode, start:start, end:end};
    var leaf = createElabElement(11, variables);
    var branch = treeStore.getById('elaborazioni');
    var form = button.up('window').down('form');
    if (form.isValid()) {
      extraLayerFromLeaf(leaf, 1);
      branch.appendChild(leaf);
    }
  }
}, text:'Esegui'}, {xtype:'button', handler:function(button, e) {
  console.log(button);
  button.up('window').close();
}, text:'Chiudi'}]}], items:[{xtype:'form', flex:1, scrollable:true, bodyPadding:5, url:'services/ajax.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldset', flex:1, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', anchor:'95%', id:'bufferpestcode9', fieldLabel:'Parassita', labelAlign:'top', name:'code', allowBlank:false, allowOnlyWhitespace:false, displayField:'name', store:'ParassitiStore2', valueField:'pestcode', listeners:{select:'onComboboxSelect'}}, {xtype:'fieldcontainer', 
defaults:{padding:'2'}, layout:'hbox', items:[{xtype:'datefield', flex:1, id:'start9', fieldLabel:'Da', labelAlign:'top', name:'start', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'datefield', flex:1, id:'end9', fieldLabel:'A', labelAlign:'top', name:'end', allowBlank:false, allowOnlyWhitespace:false}]}]}]}], inizialize:function() {
}});
Ext.define('SIMFito.view.TrappoleWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.trappolewindow'});
Ext.define('SIMFito.view.TrappoleWindowViewController', {extend:Ext.app.ViewController, alias:'controller.trappolewindow', onGridpanelSelect:function(rowmodel, record, index, eOpts) {
  for (var i in record.data) {
    if (Ext.getCmp(i) !== undefined) {
      Ext.getCmp(i).setValue(record.data[i]);
    }
  }
}, onTrappoleformAfterRender:function(component, eOpts) {
  var idOsservazione = component.up('window').userData.idosservazione;
  Ext.getCmp('idosservazione').setValue(idOsservazione);
}, onWindowBeforeRender:function(component, eOpts) {
  var idOsservazione = component.userData.idosservazione;
  var gid = component.userData.gid;
  Ext.StoreMgr.get('TrappoleStore').getProxy().setExtraParam('idosservazione', idOsservazione);
  Ext.StoreMgr.get('TrappoleStore').getProxy().setExtraParam('gid', gid);
}, onWindowAfterRender:function(component, eOpts) {
  var stato = component.userData.statoScheda;
  var form = component.down('form');
  if (stato == 2) {
    form.getForm().getFields().each(function(field) {
      field.setReadOnly(true);
    });
    Ext.getCmp('trappolasubmit').setDisabled(true);
  }
}});
Ext.define('SIMFito.view.TrappoleWindow', {extend:Ext.window.Window, alias:'widget.trappolewindow', controller:'trappolewindow', viewModel:{type:'trappolewindow'}, constrain:true, height:600, minHeight:600, minWidth:800, width:800, layout:'fit', iconCls:'target', title:'Trappole', items:[{xtype:'form', id:'trappoleform', url:'services/ajax-save-form.php', layout:{type:'vbox', align:'stretch', pack:'center'}, items:[{xtype:'gridpanel', flex:4, id:'trapgrid', autoLoad:true, store:'TrappoleStore', columns:[{xtype:'gridcolumn', 
flex:2, dataIndex:'codice', text:'Codice'}, {xtype:'gridcolumn', flex:2, dataIndex:'nome', text:'Nome'}, {xtype:'gridcolumn', flex:1, dataIndex:'descrizione', text:'Tipo'}, {xtype:'numbercolumn', flex:0, dataIndex:'numero_individui', text:'N\x26deg; Individui', format:'0'}, {xtype:'numbercolumn', flex:0, dataIndex:'n_piante_rap', text:'N\x26deg; Piante Rappresentative', format:'0'}, {xtype:'actioncolumn', text:'Azioni', items:[{handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('idtrp');
  Ext.MessageBox.confirm('Conferma', 'Eliminare la riga?', function(btn) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'cancella-trappola', id:id}, success:function(resp) {
        Ext.StoreMgr.get('TrappoleStore').reload();
        Ext.StoreMgr.get('OsservazioniStore').reload();
        Ext.getCmp('n_piante_rap').setValue(null);
        Ext.getCmp('numero_individui').setValue(null);
        Ext.getCmp('note').setValue(null);
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          var obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore!', obj.errors.reason);
        } else {
          Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
        }
      }});
    }
  });
}, isDisabled:function(view, rowIndex, colIndex, item, record) {
  var stato = view.up('window').userData.statoScheda;
  if (stato == 2 || record.get('idtrp') == -1) {
    return true;
  } else {
    return false;
  }
}, iconCls:'delete', tooltip:'Elimina'}]}], listeners:{select:'onGridpanelSelect'}}, {xtype:'fieldcontainer', flex:3, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'fieldset', flex:1, defaults:{labelAlign:'top'}, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'numberfield', id:'n_piante_rap', fieldLabel:'N\x26deg; Piante Rappresentative', msgTarget:'under', name:'n_piante_rap', allowDecimals:false, allowExponential:false, minValue:0}, {xtype:'numberfield', id:'numero_individui', fieldLabel:'N\x26deg; individui catturati', 
msgTarget:'under', name:'n_individui', allowBlank:false, allowOnlyWhitespace:false, blankText:'Campo obbligatorio', emptyText:'Campo obbligatorio', allowDecimals:false, allowExponential:false, minValue:0}, {xtype:'hiddenfield', name:'fase', value:'set-trappole'}, {xtype:'hiddenfield', id:'idosservazione', name:'idosservazione'}, {xtype:'hiddenfield', flex:1, id:'idtrp', name:'idtrp'}, {xtype:'hiddenfield', flex:1, id:'t_g_id', name:'t_g_id'}]}, {xtype:'fieldset', flex:1, defaults:{labelAlign:'top'}, 
layout:{type:'vbox', align:'stretch'}, items:[{xtype:'textareafield', flex:1, dock:'top', id:'note', fieldLabel:'Note', name:'note'}]}]}], dockedItems:[{xtype:'toolbar', flex:1, dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form');
  var grid = Ext.getCmp('trapgrid');
  if (grid.getSelection().length > 0) {
    if (form.isValid()) {
      form.getForm().submit({method:'POST', waitTitle:'Connessione', waitMsg:'Invio dei dati...', success:function(form, action) {
        Ext.StoreMgr.get('TrappoleStore').reload();
        Ext.StoreMgr.get('OsservazioniStore').reload();
        Ext.getCmp('n_piante_rap').setValue(null);
        Ext.getCmp('numero_individui').setValue(null);
        Ext.getCmp('note').setValue(null);
      }, failure:function(form, action) {
        if (action.failureType == 'server') {
          var obj = Ext.util.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore!', obj.errors.reason);
        } else {
          Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + action.response.responseText);
        }
      }});
    }
  } else {
    Ext.Msg.alert('Errore', 'Selezionare una trappola di cui si vuol fare la cota!');
  }
}, formBind:false, id:'trappolasubmit', text:'Salva'}]}], listeners:{afterrender:'onTrappoleformAfterRender'}}], listeners:{beforerender:'onWindowBeforeRender', afterrender:'onWindowAfterRender'}, dockedItems:[{xtype:'toolbar', dock:'top', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  window.open(urlPrefix + 'help/osservazioni.html#osservazionitrappole', 'Help');
}, iconCls:'help'}]}]});
Ext.define('SIMFito.view.TrappolealWindow', {extend:Ext.window.Window, alias:'widget.trappolealwindow', controller:'trappolealwindow', viewModel:{type:'trappolealwindow'}, constrain:true, height:337, scrollable:true, width:601, layout:'fit', title:'Trappole attive alla data', dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('window').down('form');
  if (form.isValid()) {
    var treeStore = Ext.StoreManager.get('DatasetTreeStore');
    var root = treeStore.getRoot();
    if (!root.isExpanded()) {
      root.expand();
    }
    var pestcode = Ext.getCmp('bufferpestcode8').getValue();
    var date = Ext.Date.format(Ext.getCmp('start8').getValue(), 'Ymd');
    var title = 'Trappole per: ' + pestcode + ' attive al: ' + date;
    var variables = {title:title, pestcode:pestcode, date:date};
    var leaf = createElabElement(10, variables);
    var branch = treeStore.getById('elaborazioni');
    var form = button.up('window').down('form');
    if (form.isValid()) {
      extraLayerFromLeaf(leaf, 1);
      branch.appendChild(leaf);
    }
  }
}, text:'Esegui'}, {xtype:'button', handler:function(button, e) {
  console.log(button);
  button.up('window').close();
}, text:'Chiudi'}]}], items:[{xtype:'form', flex:1, scrollable:true, bodyPadding:5, url:'services/ajax.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldset', flex:1, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'combobox', anchor:'95%', id:'bufferpestcode8', fieldLabel:'Parassita', labelAlign:'top', name:'code', allowBlank:false, allowOnlyWhitespace:false, displayField:'name', store:'ParassitiStore2', valueField:'pestcode', listeners:{select:'onComboboxSelect'}}, {xtype:'datefield', 
id:'start8', fieldLabel:'Data', labelAlign:'top', name:'start', allowBlank:false, allowOnlyWhitespace:false}]}, {xtype:'hiddenfield', flex:1, fieldLabel:'Label', name:'mode', value:'multibuffer'}, {xtype:'hiddenfield', flex:1, fieldLabel:'Label', name:'type', value:'pest'}]}], inizialize:function() {
}});
Ext.define('SIMFito.view.UEPestWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.uepestwindow'});
Ext.define('SIMFito.view.UEPestWindow', {extend:Ext.window.Window, alias:'widget.uepestwindow', viewModel:{type:'uepestwindow'}, constrain:true, height:600, scrollable:true, width:800, title:'Agenti nocivi per rendicontazione', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'gridpanel', flex:1, scrollable:true, autoLoad:true, store:'UEPestsStore', columns:[{xtype:'numbercolumn', width:75, dataIndex:'id', text:'id', format:'0'}, {xtype:'gridcolumn', flex:1, dataIndex:'nomereport', text:'Descrizione'}, 
{xtype:'numbercolumn', width:100, dataIndex:'anno', text:'Anno', format:'0000'}, {xtype:'booleancolumn', dataIndex:'enabled', text:'Abilitato'}, {xtype:'actioncolumn', text:'Azioni', items:[{isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  return !record.get('enabled');
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'disable-reportue', id:record.get('id')}, success:function(resp) {
    view.getStore().reload();
  }, failure:function(response, opts) {
    console.error('server-side failure with status code ' + response.status);
  }});
}, iconCls:'delete', tooltip:'Disabilita'}, {isActionDisabled:function(view, rowIndex, colIndex, item, record) {
  return record.get('enabled');
}, handler:function(view, rowIndex, colIndex, item, e, record, row) {
  Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'enable-reportue', id:record.get('id')}, success:function(resp) {
    view.getStore().reload();
  }, failure:function(response, opts) {
    console.error('server-side failure with status code ' + response.status);
  }});
}, iconCls:'check', tooltip:'Riabilita'}]}], plugins:[{ptype:'rowexpander', rowBodyTpl:['\x3cp\x3e\x3ch3\x3eCodici EPPO pests:\x3c/h3\x3e{pestx}\x3c/p\x3e']}]}], dockedItems:[{xtype:'form', dock:'bottom', scrollable:true, bodyPadding:10, title:'Nuovo Gruppo', baseParams:{fase:'insert-reportue'}, url:'services/ajax-save-form.php', layout:{type:'hbox', align:'stretch'}, dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form').getForm();
  if (form.isValid()) {
    form.submit({method:'POST', waitTitle:'Connessione', waitMsg:'Invio dei dati...', success:function(form, action) {
      var obj = Ext.util.JSON.decode(action.response.responseText);
      form.reset();
      Ext.StoreMgr.get('UEPestsStore').reload();
    }, failure:function(form, action) {
      switch(action.failureType) {
        case Ext.form.action.Action.CLIENT_INVALID:
          Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
          break;
        case Ext.form.action.Action.CONNECT_FAILURE:
          Ext.Msg.alert('Failure', 'Ajax communication failed');
          break;
        case Ext.form.action.Action.SERVER_INVALID:
          Ext.Msg.alert('Failure', action.result.errors.reason);
          break;
      }
    }});
  }
}, text:'Salva'}, {xtype:'button', handler:function(button, e) {
  button.up('window').close();
}, text:'Chiudi'}]}], items:[{xtype:'textfield', flex:1, fieldLabel:'Descrizione', labelAlign:'top', name:'nomereport', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'tagfield', flex:1, fieldLabel:'Agenti nocivi', labelAlign:'top', name:'pest', allowBlank:false, displayField:'name', store:'ParassitiStore', valueField:'pestcode', encodeSubmitValue:true}, {xtype:'numberfield', fieldLabel:'Anno di riferimento', labelAlign:'top', name:'anno', allowBlank:false, allowOnlyWhitespace:false, allowDecimals:false, 
decimalPrecision:0, minValue:2015}]}]});
Ext.define('SIMFito.view.UEReportWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.uereportwindow'});
Ext.define('SIMFito.view.UEReportWindowViewController', {extend:Ext.app.ViewController, alias:'controller.uereportwindow', onFormBeforeRender:function(component, eOpts) {
  console.log(component);
  component.getForm().baseParams = {mode:'xlsasync', tipoTecnico:localStore.getItem('TipoUtente'), 'uid':localStore.getItem('ID')};
}});
Ext.define('SIMFito.view.UEReportWindow', {extend:Ext.window.Window, alias:'widget.uereportwindow', controller:'uereportwindow', viewModel:{type:'uereportwindow'}, constrain:true, height:250, width:400, layout:'fit', title:'Report UE', items:[{xtype:'form', scrollable:true, bodyPadding:10, url:'services/export5_1.php', items:[{xtype:'datefield', anchor:'100%', id:'uestart', fieldLabel:'Dal', name:'start', allowBlank:false, allowOnlyWhitespace:false, format:'d/m/Y', submitFormat:'Y-m-d'}, {xtype:'datefield', 
anchor:'100%', id:'ueend', fieldLabel:'Al', name:'end', allowBlank:false, allowOnlyWhitespace:false, format:'d/m/Y', submitFormat:'Y-m-d'}], listeners:{beforerender:'onFormBeforeRender'}}], dockedItems:[{xtype:'button', handler:function(button, e) {
  var window = button.up('window');
  var form = window.down('form').getForm();
  if (form.isValid()) {
    form.submit({method:'GET', waitTitle:'Connecting', waitMsg:'Sending data...', success:function(form, action) {
      obj = Ext.util.JSON.decode(action.response.responseText);
      var success = obj.success;
      if (success) {
        Ext.StoreManager.get('reportsStores').reload();
        window.close();
        Ext.Msg.alert('Info', 'Generazione del report avviata.');
      } else {
        Ext.Msg.alert('Errore', obj.errors.reason);
      }
    }, failure:function(form, action) {
      if (action.failureType == 'server') {
        obj = Ext.util.JSON.decode(action.response.responseText);
        Ext.Msg.alert('Login Fallito!', obj.errors.reason);
      } else {
        Ext.Msg.alert('Attenzione!', 'Server non raggiungibile: ' + action.response.responseText);
      }
    }});
  }
}, dock:'bottom', text:'Continua'}]});
Ext.define('SIMFito.view.UserDataViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.userdata'});
Ext.define('SIMFito.view.UserDataViewController', {extend:Ext.app.ViewController, alias:'controller.userdata', onWindowAfterRender:function(component, eOpts) {
  Ext.Ajax.request({url:'services/ajax.php', method:'POST', params:{mode:'user', id:localStore.getItem('ID')}, success:function(response, opts) {
    var resp = Ext.util.JSON.decode(response.responseText);
    if (resp.data.length > 0) {
      var data = resp.data[0];
      var user = Ext.create('SIMFito.model.UserModel', {cap_ufficio:data.cap_ufficio, codicefiscale:data.codicefiscale, cognome:data.cognome, comune_nascita:data.comune_nascita, data_nascita:data.data_nascita, email:data.email, mobile:data.mobile, nome:data.nome, pswrd:data.pswrd, residenza_comune:data.residenza_comune, residenza_indirizzo:data.residenza_indirizzo, sesso:data.sesso, telefono:data.telefono, titolo:data.titolo, ufficio:data.ufficio, username:data.username, web:data.web});
      component.down('form').loadRecord(user);
      component.down('form').getForm().setValues({uid:localStore.getItem('ID')});
    } else {
      Ext.Msg.alert('Attenzione', 'Nessun dato disponibile!');
    }
  }, failure:function(response, opts) {
    Ext.Msg.alert('Errore', 'server-side failure with status code ' + response.status);
  }});
}});
Ext.define('SIMFito.view.UserData', {extend:Ext.window.Window, alias:'widget.userdata', controller:'userdata', viewModel:{type:'userdata'}, constrain:true, height:600, minHeight:600, minWidth:800, scrollable:true, width:800, layout:'fit', closable:false, title:'Dati Utente', items:[{xtype:'form', id:'userform', scrollable:true, bodyPadding:5, trackResetOnLoad:true, url:'services/ajax-save-form.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldset', title:'Informazioni Generali', layout:{type:'vbox', 
align:'stretch'}, items:[{xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, id:'username', fieldLabel:'Username', name:'username', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'textfield', flex:1, id:'pswrd', fieldLabel:'Password', name:'pswrd', allowBlank:false, allowOnlyWhitespace:false}]}, {xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, id:'nome', fieldLabel:'Nome', name:'nome', allowBlank:false, 
allowOnlyWhitespace:false}, {xtype:'textfield', flex:1, id:'cognome', fieldLabel:'Cognome', name:'cognome', allowBlank:false, allowOnlyWhitespace:false}]}, {xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:2, id:'codicefiscale', fieldLabel:'Codice Fiscale', name:'codicefiscale', allowBlank:false, allowOnlyWhitespace:false, regex:/[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]/}, {xtype:'combobox', flex:1, id:'sesso', fieldLabel:'Sesso', name:'sesso', 
allowBlank:false, allowOnlyWhitespace:false, editable:false, autoLoadOnValue:true, displayField:'descrizione', hiddenName:'sesso', store:'SessoStore', valueField:'id'}]}, {xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, id:'comune_nascita', fieldLabel:'Comune di Nascita', name:'comune_nascita'}, {xtype:'datefield', flex:1, id:'data_nascita', fieldLabel:'Data di Nascita', name:'data_nascita', format:'d/m/Y'}]}]}, {xtype:'fieldset', title:'Recapiti', 
layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, id:'residenza_indirizzo', fieldLabel:'Indirizzo', name:'residenza_indirizzo'}, {xtype:'textfield', flex:1, id:'residenza_comune', fieldLabel:'Comune di Residenza', name:'residenza_comune'}]}, {xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, id:'telefono0', fieldLabel:'Telefono', name:'telefono', regex:/^\+?\d[0-9 .]{7,12}\d$/}, 
{xtype:'textfield', flex:1, id:'mobile', fieldLabel:'Cellulare', name:'mobile', regex:/^\+?\d[0-9 .]{7,12}\d$/}]}, {xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, id:'email0', fieldLabel:'Email', name:'email', allowBlank:false, allowOnlyWhitespace:false, vtype:'email'}, {xtype:'textfield', flex:1, id:'web', fieldLabel:'Pagina Web', name:'web', vtype:'url'}]}]}, {xtype:'fieldset', title:'Informazioni Professionali', layout:{type:'vbox', align:'stretch'}, 
items:[{xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, id:'ufficio', fieldLabel:'Ente', name:'ufficio'}, {xtype:'textfield', flex:1, id:'cap_ufficio', fieldLabel:'Capo Ufficio', name:'cap_ufficio'}]}, {xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, id:'titolo', fieldLabel:'Titolo di Studio', name:'titolo'}]}]}, {xtype:'hiddenfield', flex:1, id:'uid', name:'uid'}, {xtype:'hiddenfield', flex:1, id:'fase0', 
name:'fase', value:'modUser'}], dockedItems:[{xtype:'toolbar', flex:1, dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  if (button.up('form').isDirty()) {
    var form = button.up('form').getForm();
    var window = button.up('window');
    if (form.isValid()) {
      form.submit({method:'POST', waitTitle:'Connessione', waitMsg:'Invio dei dati...', success:function(form, action) {
        var obj = Ext.util.JSON.decode(action.response.responseText);
        if (obj.success) {
          window.close();
          Ext.Msg.alert('Info', 'Dati modificati con successo');
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        switch(action.failureType) {
          case Ext.form.action.Action.CLIENT_INVALID:
            Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
            break;
          case Ext.form.action.Action.CONNECT_FAILURE:
            Ext.Msg.alert('Failure', 'Ajax communication failed');
            break;
          case Ext.form.action.Action.SERVER_INVALID:
            Ext.Msg.alert('Failure', action.result.errors.reason);
            break;
        }
      }});
    } else {
      Ext.Msg.alert('Attenzione', 'Verificare che tutti i dati siano stati inseriti correttamente');
    }
  } else {
    Ext.Msg.alert('Info', 'Nessun dato modificato!');
  }
}, formBind:true, text:'Salva'}, {xtype:'button', handler:function(button, e) {
  if (button.up('form').isDirty()) {
    var text = 'Ci sono dei dati modificati e non salvati.\x3cbr/\x3eChiudendo questa finestra le modifiche verranno perse\x3cbr/\x3eChiudere la finestra?';
    Ext.Msg.confirm('Conferma', text, function(btn, value, opt) {
      if (btn == 'yes') {
        button.up('window').close();
      }
    });
  } else {
    button.up('window').close();
  }
}, text:'chiudi'}]}]}], listeners:{afterrender:'onWindowAfterRender'}});
Ext.define('SIMFito.view.UserDataViewController1', {extend:Ext.app.ViewController, alias:'controller.userswindow', onGridpanelSelect:function(rowmodel, record, index, eOpts) {
  Ext.getCmp('uid1').setValue(record.get('id_tecnico'));
  var data = record.getData();
  for (var i in data) {
    if (Ext.getCmp(i + '1') !== undefined) {
      Ext.getCmp(i + '1').setValue(data[i]);
    }
  }
}});
Ext.define('SIMFito.view.UserDataViewModel1', {extend:Ext.app.ViewModel, alias:'viewmodel.userswindow'});
Ext.define('SIMFito.view.UsersWindow', {extend:Ext.window.Window, alias:'widget.userswindow', controller:'userswindow', viewModel:{type:'userswindow'}, constrain:true, height:600, minHeight:600, minWidth:800, padding:'', scrollable:true, width:800, layout:'anchor', closable:false, title:'Utenti', dockedItems:[{xtype:'gridpanel', dock:'top', flex:1, maxHeight:250, scrollable:true, bodyBorder:false, autoLoad:true, store:'UsersStore', columns:[{xtype:'gridcolumn', flex:1, dataIndex:'tipotecnico', text:'Qualifica', 
filter:{type:'list'}}, {xtype:'gridcolumn', flex:2, dataIndex:'cognome', text:'Cognome', filter:{type:'string'}}, {xtype:'gridcolumn', flex:1, dataIndex:'nome', text:'Nome', filter:{type:'string'}}, {xtype:'gridcolumn', hidden:true, dataIndex:'username', text:'User Name', filter:{type:'string'}}, {xtype:'gridcolumn', hidden:true, dataIndex:'email', text:'e-mail', filter:{type:'string'}}, {xtype:'gridcolumn', flex:1, dataIndex:'ufficio', text:'Ente', filter:{type:'list'}}, {xtype:'actioncolumn', text:'Azioni', 
items:[{handler:function(view, rowIndex, colIndex, item, e, record, row) {
  console.log(record.get('id_tecnico'));
  Ext.MessageBox.confirm('Conferma', 'Confermare il tecnico: ' + record.get('nome') + ' ' + record.get('cognome') + '?', function(btn) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', params:{fase:'conferma-utente', id_tecnico:record.get('id_tecnico')}, method:'POST', success:function(response, opts) {
        var obj = Ext.util.JSON.decode(response.responseText);
        if (obj.success) {
          Ext.StoreManager.get('UsersStore').reload();
          Ext.getCmp('userform1').reset();
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        switch(action.failureType) {
          case Ext.form.action.Action.CLIENT_INVALID:
            Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
            break;
          case Ext.form.action.Action.CONNECT_FAILURE:
            Ext.Msg.alert('Failure', 'Ajax communication failed');
            break;
          case Ext.form.action.Action.SERVER_INVALID:
            Ext.Msg.alert('Failure', action.result.errors.reason);
            break;
        }
      }});
    }
  });
}, isDisabled:function(view, rowIndex, colIndex, item, record) {
  if (record.get('validated')) {
    return true;
  } else {
    return false;
  }
}, iconCls:'check', tooltip:'Valida'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  console.log(record.get('id_tecnico'));
  Ext.MessageBox.confirm('Conferma', 'Eliminare il tecnico: ' + record.get('nome') + ' ' + record.get('cognome') + '?', function(btn) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', params:{fase:'cancella-utente', id_tecnico:record.get('id_tecnico')}, method:'POST', success:function(response, opts) {
        var obj = Ext.util.JSON.decode(response.responseText);
        if (obj.success) {
          Ext.StoreManager.get('UsersStore').reload();
          Ext.getCmp('userform1').reset();
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        switch(action.failureType) {
          case Ext.form.action.Action.CLIENT_INVALID:
            Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
            break;
          case Ext.form.action.Action.CONNECT_FAILURE:
            Ext.Msg.alert('Failure', 'Ajax communication failed');
            break;
          case Ext.form.action.Action.SERVER_INVALID:
            Ext.Msg.alert('Failure', action.result.errors.reason);
            break;
        }
      }});
    }
  });
}, iconCls:'delete', tooltip:'Elimina'}]}], listeners:{select:'onGridpanelSelect'}, plugins:[{ptype:'gridfilters'}]}, {xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var formPanel = button.up('window').down('form');
  var window = button.up('window');
  var grid = button.up('window').down('grid');
  if (formPanel.isDirty()) {
    Ext.getCmp('fase1').setValue('modUser');
    var form = formPanel.getForm();
    if (form.isValid()) {
      form.submit({method:'POST', waitTitle:'Connessione', waitMsg:'Invio dei dati...', success:function(form, action) {
        var obj = Ext.util.JSON.decode(action.response.responseText);
        if (obj.success) {
          Ext.Msg.alert('Info', 'Dati modificati con successo');
          formPanel.reset();
          grid.getStore().reload();
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        switch(action.failureType) {
          case Ext.form.action.Action.CLIENT_INVALID:
            Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
            break;
          case Ext.form.action.Action.CONNECT_FAILURE:
            Ext.Msg.alert('Failure', 'Ajax communication failed');
            break;
          case Ext.form.action.Action.SERVER_INVALID:
            Ext.Msg.alert('Failure', action.result.errors.reason);
            break;
        }
      }});
    } else {
      Ext.Msg.alert('Attenzione', 'Verificare che tutti i dati siano stati inseriti correttamente');
    }
  } else {
    Ext.Msg.alert('Info', 'Nessun dato modificato!');
  }
}, text:'Modifica'}, {xtype:'button', handler:function(button, e) {
  console.log(button);
  var formPanel = button.up('window').down('form');
  var window = button.up('window');
  var grid = button.up('window').down('grid');
  if (formPanel.isDirty()) {
    Ext.getCmp('fase1').setValue('newuser');
    Ext.getCmp('uid1').setValue('-1');
    var form = formPanel.getForm();
    if (form.isValid()) {
      form.submit({method:'POST', waitTitle:'Connessione', waitMsg:'Invio dei dati...', success:function(form, action) {
        var obj = Ext.util.JSON.decode(action.response.responseText);
        if (obj.success) {
          Ext.Msg.alert('Info', 'Dati modificati con successo');
          formPanel.reset();
          grid.getStore().reload();
        } else {
          Ext.Msg.alert('Errore', obj.errors.reason);
        }
      }, failure:function(form, action) {
        switch(action.failureType) {
          case Ext.form.action.Action.CLIENT_INVALID:
            Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
            break;
          case Ext.form.action.Action.CONNECT_FAILURE:
            Ext.Msg.alert('Failure', 'Ajax communication failed');
            break;
          case Ext.form.action.Action.SERVER_INVALID:
            Ext.Msg.alert('Failure', action.result.errors.reason);
            break;
        }
      }});
    } else {
      Ext.Msg.alert('Attenzione', 'Verificare che tutti i dati siano stati inseriti correttamente');
    }
  } else {
    Ext.Msg.alert('Info', 'Nessun dato modificato!');
  }
  Ext.getCmp('fase1').setValue('modUser');
}, text:'Nuovo'}, {xtype:'button', handler:function(button, e) {
  var formPanel = button.up('window').down('form');
  var window = button.up('window');
  if (formPanel.isDirty()) {
    var text = 'Ci sono dei dati modificati e non salvati.\x3cbr/\x3eChiudendo questa finestra le modifiche verranno perse\x3cbr/\x3eChiudere la finestra?';
    Ext.Msg.confirm('Conferma', text, function(btn, value, opt) {
      if (btn == 'yes') {
        window.close();
      }
    });
  } else {
    window.close();
  }
}, text:'chiudi'}]}], items:[{xtype:'form', id:'userform1', scrollable:true, layout:'auto', bodyPadding:5, trackResetOnLoad:true, url:'services/ajax-save-form.php', items:[{xtype:'fieldset', scrollable:true, title:'Informazioni Generali', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldcontainer', flex:1, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, id:'username1', padding:2, fieldLabel:'Username', labelAlign:'top', name:'username', allowBlank:false, allowOnlyWhitespace:false}, 
{xtype:'textfield', flex:1, id:'pswrd1', padding:2, fieldLabel:'Password', labelAlign:'top', name:'pswrd', allowBlank:false, allowOnlyWhitespace:false}]}, {xtype:'fieldcontainer', flex:1, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, id:'nome1', padding:2, fieldLabel:'Nome', labelAlign:'top', name:'nome', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'textfield', flex:1, id:'cognome1', padding:2, fieldLabel:'Cognome', labelAlign:'top', name:'cognome', allowBlank:false, 
allowOnlyWhitespace:false}]}, {xtype:'fieldcontainer', flex:1, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, id:'codicefiscale1', padding:2, fieldLabel:'Codice Fiscale', labelAlign:'top', name:'codicefiscale', allowBlank:false, allowOnlyWhitespace:false, regex:/[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]/}, {xtype:'combobox', flex:1, id:'sesso1', padding:2, fieldLabel:'Sesso', labelAlign:'top', name:'sesso', allowBlank:false, allowOnlyWhitespace:false, 
editable:false, autoLoadOnValue:true, displayField:'descrizione', hiddenName:'sesso', store:'SessoStore', valueField:'id'}]}, {xtype:'fieldcontainer', flex:1, layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, id:'comune_nascita1', padding:2, fieldLabel:'Comune di Nascita', labelAlign:'top', name:'comune_nascita'}, {xtype:'datefield', flex:1, id:'data_nascita1', padding:2, fieldLabel:'Data di Nascita', labelAlign:'top', name:'data_nascita', format:'d/m/Y'}]}]}, {xtype:'fieldset', 
title:'Recapiti', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, id:'residenza_indirizzo1', padding:2, fieldLabel:'Indirizzo', labelAlign:'top', name:'residenza_indirizzo'}, {xtype:'textfield', flex:1, id:'residenza_comune1', padding:2, fieldLabel:'Comune di Residenza', labelAlign:'top', name:'residenza_comune'}]}, {xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', 
flex:1, id:'telefono1', padding:2, fieldLabel:'Telefono', labelAlign:'top', name:'telefono', regex:/^\+?\d[0-9 .]{7,12}\d$/}, {xtype:'textfield', flex:1, id:'mobile1', padding:2, fieldLabel:'Cellulare', labelAlign:'top', name:'mobile', regex:/^\+?\d[0-9 .]{7,12}\d$/}]}, {xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, id:'email1', padding:2, fieldLabel:'Email', labelAlign:'top', name:'email', allowBlank:false, allowOnlyWhitespace:false, vtype:'email'}, 
{xtype:'textfield', flex:1, id:'web1', padding:2, fieldLabel:'Pagina Web', labelAlign:'top', name:'web', vtype:'url'}]}]}, {xtype:'fieldset', title:'Informazioni Professionali', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'textfield', flex:1, id:'ufficio1', padding:2, fieldLabel:'Ente', labelAlign:'top', name:'ufficio'}, {xtype:'textfield', flex:1, id:'cap_ufficio1', padding:2, fieldLabel:'Capo Ufficio', labelAlign:'top', 
name:'cap_ufficio'}]}, {xtype:'fieldcontainer', layout:{type:'hbox', align:'stretch'}, items:[{xtype:'combobox', flex:1, id:'id_provincia1', padding:2, fieldLabel:'Provincia', labelAlign:'top', name:'id_provincia', autoLoadOnValue:true, displayField:'provincia', store:'ProvinceStore', valueField:'id'}, {xtype:'textfield', flex:1, id:'titolo1', padding:2, fieldLabel:'Titolo di Studio', labelAlign:'top', name:'titolo'}]}, {xtype:'fieldcontainer', flex:1, flex:1, width:400, layout:{type:'hbox', align:'stretch'}, 
items:[{xtype:'combobox', flex:1, id:'idtipo_tecnico1', fieldLabel:'Tipo utente', labelAlign:'top', name:'idtipo_tecnico', allowBlank:false, allowOnlyWhitespace:false, autoLoadOnValue:true, displayField:'tipotecnico', store:'UserTypeStore', valueField:'idtipo_tecnico'}]}]}, {xtype:'hiddenfield', id:'uid1', name:'uid'}, {xtype:'hiddenfield', id:'fase1', name:'fase', value:'modUser'}]}]});
Ext.define('SIMFito.view.WarningsWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.warningswindow'});
Ext.define('SIMFito.view.WarningsWindowViewController', {extend:Ext.app.ViewController, alias:'controller.warningswindow', onWindowAfterRender:function(component, eOpts) {
}});
Ext.define('SIMFito.view.WarningsWindow', {extend:Ext.window.Window, alias:'widget.warningswindow', controller:'warningswindow', viewModel:{type:'warningswindow'}, constrain:true, height:600, width:900, layout:'fit', title:'Nuove Segnalazioni', listeners:{afterrender:'onWindowAfterRender'}, items:[{xtype:'gridpanel', scrollable:true, autoLoad:true, store:'WarningsStore', columns:[{xtype:'gridcolumn', flex:2, dataIndex:'host_name', text:'Pianta', tooltip:'Pianta', filter:{type:'string'}}, {xtype:'gridcolumn', 
flex:2, dataIndex:'pest_name', text:'Organismo Nocivo', tooltip:'Organismo Nocivo', filter:{type:'string'}}, {xtype:'gridcolumn', flex:1, dataIndex:'nome', text:'Nome Tecnico', tooltip:'Nome Tecnico', filter:{type:'string'}}, {xtype:'gridcolumn', flex:2, dataIndex:'cognome', text:'Cognome Tecnico', tooltip:'Nome Tecnico', filter:{type:'string'}}, {xtype:'gridcolumn', flex:2, dataIndex:'rigetto', text:'Motivo Rigetto', tooltip:'Nome Tecnico'}, {xtype:'datecolumn', flex:1, dataIndex:'data', text:'Data', 
tooltip:'Data', format:'d/m/Y', filter:{type:'date', dateFormat:'Ymd'}}, {xtype:'booleancolumn', width:50, dataIndex:'validato', text:'Validato', tooltip:'Validato', falseText:'No', trueText:'Si'}, {xtype:'booleancolumn', width:50, dataIndex:'nuova', text:'Nuova', tooltip:'Nuova', falseText:'No', trueText:'Si'}, {xtype:'actioncolumn', flex:1, text:'Azioni', items:[{handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('id');
  var userType = localStore.getItem('TipoUtente');
  Ext.MessageBox.confirm('Conferma', 'Confermare come NUOVA SEGNALAZIONE', function(btn) {
    if (btn == 'yes') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'validato', id:id}, success:function(response, opts) {
        var obj = Ext.decode(response.responseText);
        if (!obj.success) {
          Ext.Msg.alert('Errore', obj.errors.reason);
        } else {
          Ext.Msg.alert('INFO', 'Operazione effettuata con successo');
          view.getStore().reload();
        }
      }, failure:function(response, opts) {
        if (opts.failureType == 'server') {
          var obj = Ext.util.JSON.decode(opts.response.responseText);
          Ext.Msg.alert('Errore!', obj.errors.reason);
        } else {
          Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + opts.response.responseText);
        }
      }});
    }
  });
}, isDisabled:function(view, rowIndex, colIndex, item, record) {
  var returning = false;
  if (!record.get('nuova') || Number(localStore.getItem('TipoUtente')) > 0) {
    returning = true;
  }
  return returning;
}, iconCls:'check', tooltip:'Valida'}, {handler:function(view, rowIndex, colIndex, item, e, record, row) {
  var id = record.get('id');
  var userType = localStore.getItem('TipoUtente');
  Ext.MessageBox.prompt('Rigetto segnalazione!', 'Inserire il motivo di rigetto della segnalazione', function(btn, rigetto) {
    if (btn == 'ok') {
      Ext.Ajax.request({url:'services/ajax-save-form.php', method:'POST', params:{fase:'novalidato', id:id, rigetto:rigetto}, success:function(response, opts) {
        var obj = Ext.util.JSON.decode(response.responseText);
        if (!obj.success) {
          Ext.Msg.alert('Errore', obj.errors.reason);
        } else {
          Ext.Msg.alert('INFO', 'Operazione effettuata con successo');
          view.getStore().reload();
        }
      }, failure:function(response, opts) {
        if (opts.failureType == 'server') {
          var obj = Ext.util.JSON.decode(opts.response.responseText);
          Ext.Msg.alert('Errore!', obj.errors.reason);
        } else {
          Ext.Msg.alert('Attenzione!', 'Il server non \x26egrave raggiungibile : ' + opts.response.responseText);
        }
      }});
    }
  });
}, isDisabled:function(view, rowIndex, colIndex, item, record) {
  var returning = false;
  if (!record.get('nuova') || Number(localStore.getItem('TipoUtente')) > 0) {
    returning = true;
  }
  return returning;
}, iconCls:'delete', tooltip:'Rifiuto'}]}], plugins:[{ptype:'gridfilters'}]}]});
Ext.define('SIMFito.view.addtipologiasitoWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.addtipologiasitowindow'});
Ext.define('SIMFito.view.addtipologiasitoWindowViewController', {extend:Ext.app.ViewController, alias:'controller.addtipologiasitowindow', onComboboxSelect:function(combo, record, eOpts) {
  var store = Ext.StoreMgr.get('TipologiasitiStore');
  store.getProxy().setExtraParam('theme', record.get('id'));
  store.reload();
  Ext.getCmp('tipologiasitocombo2').setDisabled();
}, onMywindowClose:function(panel, eOpts) {
  var sitiCombo = Ext.getCmp('sitiCombo');
  if (sitiCombo != undefined) {
    sitiCombo.clearValue();
  }
  Ext.getCmp('tipologiasitocombo2').destroy();
}});
Ext.define('SIMFito.view.addtipologiasitoWindow', {extend:Ext.window.Window, alias:'widget.addtipologiasitowindow', controller:'addtipologiasitowindow', viewModel:{type:'addtipologiasitowindow'}, constrain:true, modal:true, height:300, itemId:'mywindow', width:600, layout:'fit', title:'Aggiornamento tipologia', items:[{xtype:'form', bodyPadding:10, url:'services/ajax-save-form.php', items:[{xtype:'combobox', anchor:'100%', fieldLabel:'Tema', labelAlign:'top', displayField:'theme', store:'ThemeTSStore', 
valueField:'id', listeners:{select:'onComboboxSelect'}}, {xtype:'combobox', anchor:'100%', disabled:true, id:'tipologiasitocombo2', fieldLabel:'Tipologia sito', labelAlign:'top', name:'tipologiasito_id', allowBlank:false, allowOnlyWhitespace:false, editable:false, displayField:'description', store:'TipologiasitiStore', valueField:'id'}, {xtype:'hiddenfield', anchor:'100%', id:'tipo2sito_id', fieldLabel:'Label', name:'sito_id'}, {xtype:'hiddenfield', anchor:'100%', fieldLabel:'Label', name:'fase', 
value:'update_tipologiasito'}], dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form');
  if (form.isValid()) {
    form.submit({success:function(form, action) {
      console.log(action);
      var res = Ext.JSON.decode(action.response.responseText);
      if (res.success) {
        Ext.StoreMgr.get('SitiStore').reload();
        Ext.Msg.alert('Info', 'Sito aggiornato con successo');
        form.owner.up('window').close();
      } else {
        Ext.Msg.alert('Errore', res.errors.reason);
      }
    }, failure:function(form, action) {
      console.log(action);
      switch(action.failureType) {
        case Ext.form.action.Action.CLIENT_INVALID:
          Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
          break;
        case Ext.form.action.Action.CONNECT_FAILURE:
          Ext.Msg.alert('Failure', 'Ajax communication failed');
          break;
        case Ext.form.action.Action.SERVER_INVALID:
          var res = Ext.JSON.decode(action.response.responseText);
          Ext.Msg.alert('Errore', res.errors.reason);
          break;
      }
    }});
  }
}, text:'Salva'}]}]}], listeners:{close:'onMywindowClose'}, init:function(sitoId, sitoName) {
  this.setTitle(this.getTitle() + ' per il sito ' + sitoName);
  this.down('form').on({afterrender:function(win, eOpts) {
    Ext.getCmp('tipo2sito_id').setValue(sitoId);
  }});
  this.show();
}});
Ext.define('SIMFito.view.delimitazioneWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.delimitazionewindow'});
Ext.define('SIMFito.view.delimitazioneWindowViewController', {extend:Ext.app.ViewController, alias:'controller.delimitazionewindow', onFormRender:function(component, eOpts) {
  var params = Ext.JSON.encode(component.up('window').params);
  var viewparams = component.up('window').params.viewparams;
  var pp = viewparams.split(';');
  var pestcode;
  for (var i in pp) {
    if (pp[i].split(':')[0] == 'pestcode') {
      pestcode = pp[i].split(':')[1];
    }
  }
  var bp = {fase:'delimitazione2', params:params, vector:null, pest:pestcode};
  component.getForm().setConfig('baseParams', bp);
}, onDatefieldFromAfterRender:function(component, eOpts) {
  var pp = component.up('window').params;
  var a = pp.viewparams.split(';');
  var b = {};
  for (var i in a) {
    b[a[i].split(':')[0]] = a[i].split(':')[1];
  }
  component.setValue(Ext.Date.parse(b.start, 'Ymd'));
}, onDatefieldToAfterRender:function(component, eOpts) {
  var pp = component.up('window').params;
  var a = pp.viewparams.split(';');
  var b = {};
  for (var i in a) {
    b[a[i].split(':')[0]] = a[i].split(':')[1];
  }
  component.setValue(Ext.Date.parse(b.end, 'Ymd'));
}});
Ext.define('SIMFito.view.delimitazioneWindow', {extend:Ext.window.Window, alias:'widget.delimitazionewindow', controller:'delimitazionewindow', viewModel:{type:'delimitazionewindow'}, modal:true, height:244, width:400, layout:'fit', title:'Salva Area per Delimitazione', dockedItems:[{xtype:'form', dock:'top', bodyPadding:10, url:'services/ajax-save-form.php', layout:{type:'vbox', align:'stretch'}, listeners:{render:'onFormRender'}, items:[{xtype:'textfield', flex:1, fieldLabel:'Denominazione area', 
labelAlign:'top', name:'name', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'datefield', flex:1, padding:1, fieldLabel:'Dal', labelAlign:'top', name:'from', allowBlank:false, allowOnlyWhitespace:false, format:'d/m/Y', submitFormat:'Ymd', listeners:{afterrender:'onDatefieldFromAfterRender'}}, {xtype:'datefield', flex:1, hidden:true, padding:1, fieldLabel:'Al', labelAlign:'top', name:'to', submitValue:false, listeners:{afterrender:'onDatefieldToAfterRender'}}]}], items:[{xtype:'button', handler:function(button, 
e) {
  var form = button.up('window').down('form');
  var window = button.up('window');
  if (form.isValid()) {
    Ext.MessageBox.confirm('Conferma', 'Salvare come area per delimitazione ufficiale?', function(btn) {
      if (btn == 'yes') {
        form.submit({method:'POST', waitTitle:'Connecting', waitMsg:'Sending data...', success:function(form, action) {
          obj = Ext.util.JSON.decode(action.response.responseText);
          var success = obj.success;
          if (success) {
            window.close();
            Ext.StoreMgr.get('AreasStore').reload();
            Ext.Msg.alert('Info', 'Area salvata con successo.');
          } else {
            Ext.Msg.alert('Errore', obj.errors.reason);
          }
        }, failure:function(form, action) {
          if (action.failureType == 'server') {
            obj = Ext.util.JSON.decode(action.response.responseText);
            Ext.Msg.alert('Login Fallito!', obj.errors.reason);
          } else {
            Ext.Msg.alert('Attenzione!', 'Server non raggiungibile: ' + action.response.responseText);
          }
        }});
      }
    });
  }
}, text:'Salva'}]});
Ext.define('SIMFito.view.delimitazioneWindowViewModel1', {extend:Ext.app.ViewModel, alias:'viewmodel.delimitazionewindow1'});
Ext.define('SIMFito.view.delimitazioneWindowViewController1', {extend:Ext.app.ViewController, alias:'controller.delimitazionewindow1', onAreeBufferStartAfterRender:function(component, eOpts) {
  var pp = component.up('window').params;
  var a = pp.viewparams.split(';');
  var b = {};
  for (var i in a) {
    b[a[i].split(':')[0]] = a[i].split(':')[1];
  }
  component.setValue(Ext.Date.parse(b.start, 'Ymd'));
}, onNumberfieldAAfterRender:function(component, eOpts) {
  var pp = component.up('window').params;
  var a = pp.viewparams.split(';');
  var b = {};
  for (var i in a) {
    b[a[i].split(':')[0]] = a[i].split(':')[1];
  }
  component.setValue(Number(b.buffer2));
}, onNumberfieldAfterRender:function(component, eOpts) {
  var pp = component.up('window').params;
  var a = pp.viewparams.split(';');
  var b = {};
  for (var i in a) {
    b[a[i].split(':')[0]] = a[i].split(':')[1];
  }
  component.setValue(Number(b.buffer3));
}, onHtmleditorAfterRender:function(component, eOpts) {
  var pp = component.up('window').params;
  var a = pp.viewparams.split(';');
  var b = {};
  for (var i in a) {
    b[a[i].split(':')[0]] = a[i].split(':')[1];
  }
  var HTML = '\x3ch3\x3e' + pp.title + '\x3c/h3\x3e';
  HTML += '\x3cdiv\x3e\x3cp\x3e\x3cb\x3eParametri utilizzati per le "aree buffer":\x3c/b\x3e';
  HTML += '\x3cul\x3e';
  HTML += '\x3cli\x3estart : ' + Ext.Date.format(Ext.Date.parse(b.start, 'Ymd'), 'd/m/Y') + '\x3c/li\x3e';
  HTML += '\x3cli\x3eend : ' + Ext.Date.format(Ext.Date.parse(b.end, 'Ymd'), 'd/m/Y') + '\x3c/li\x3e';
  for (var i in b) {
    if (i != 'start' && i != 'end') {
      var value = b[i];
      if (value == null || value == 'null') {
        value = 'non definito';
      }
      HTML += '\x3cli\x3e' + i + ' : ' + value + '\x3c/li\x3e';
    }
  }
  HTML += '\x3c/ul\x3e\x3c/p\x3e\x3c/div\x3e';
  component.setHtml(HTML);
}, onFormRender:function(component, eOpts) {
  var params = Ext.JSON.encode(component.up('window').params);
  var viewparams = component.up('window').params.viewparams;
  var pp = viewparams.split(';');
  var pestcode;
  for (var i in pp) {
    if (pp[i].split(':')[0] == 'pestcode') {
      pestcode = pp[i].split(':')[1];
    }
  }
  var vector = component.up('window').vector;
  var bp = {fase:'delimitazione2', params:params, vector:vector, pest:pestcode};
  component.getForm().setConfig('baseParams', bp);
}, onWindowClose:function(panel, eOpts) {
  if (modifyL != undefined) {
    map2.removeLayer(modifyL);
    modifyL = undefined;
  }
  measureTooltipElement.innerHTML = null;
  removeInteraction('map2');
}});
Ext.define('SIMFito.view.delimitazioneWindow1', {extend:Ext.window.Window, alias:'widget.delimitazionewindow1', controller:'delimitazionewindow1', viewModel:{type:'delimitazionewindow1'}, height:511, scrollable:true, width:600, title:'Salva Area per Delimitazione', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'form', flex:1, height:254, scrollable:true, bodyPadding:10, url:'services/ajax-save-form.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'textfield', fieldLabel:'Denominazione area', 
labelAlign:'top', name:'name', allowBlank:false, allowOnlyWhitespace:false}, {xtype:'datefield', id:'areeBufferStart', padding:2, fieldLabel:'Dal', labelAlign:'top', name:'from', allowBlank:false, allowOnlyWhitespace:false, format:'d/m/Y', submitFormat:'Ymd', listeners:{afterrender:'onAreeBufferStartAfterRender'}}, {xtype:'fieldcontainer', height:130, width:400, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'numberfield', flex:1, fieldLabel:'Buffer zona tampone [m]', labelAlign:'top', name:'tampone', 
allowBlank:false, allowOnlyWhitespace:false, minValue:0, listeners:{afterrender:'onNumberfieldAAfterRender'}}, {xtype:'numberfield', flex:1, fieldLabel:'Buffer zona contenimento [m]', labelAlign:'top', name:'contenimento', allowBlank:false, allowOnlyWhitespace:false, minValue:0, listeners:{afterrender:'onNumberfieldAfterRender'}}]}, {xtype:'displayfield', flex:1, flex:2, scrollable:true, labelAlign:'top', listeners:{afterrender:'onHtmleditorAfterRender'}}], listeners:{render:'onFormRender'}}, {xtype:'button', 
handler:function(button, e) {
  var form = button.up('window').down('form');
  var window = button.up('window');
  if (form.isValid()) {
    Ext.MessageBox.confirm('Conferma', 'Salvare come area per delimitazione ufficiale?', function(btn) {
      if (btn == 'yes') {
        console.log(form);
        form.submit({method:'POST', waitTitle:'Connecting', waitMsg:'Sending data...', success:function(form, action) {
          obj = Ext.util.JSON.decode(action.response.responseText);
          var success = obj.success;
          if (success) {
            window.close();
            Ext.Msg.alert('Info', 'Area salvata con successo.');
            Ext.StoreMgr.get('AreasStore').reload();
          } else {
            Ext.Msg.alert('Errore', obj.errors.reason);
          }
        }, failure:function(form, action) {
          if (action.failureType == 'server') {
            obj = Ext.util.JSON.decode(action.response.responseText);
            Ext.Msg.alert('Login Fallito!', obj.errors.reason);
          } else {
            Ext.Msg.alert('Attenzione!', 'Server non raggiungibile: ' + action.response.responseText);
          }
        }});
      }
    });
  }
}, text:'Salva'}], listeners:{close:'onWindowClose'}});
Ext.define('SIMFito.view.delimitazioniChiusuraWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.delimitazionichiusurawindow'});
Ext.define('SIMFito.view.delimitazioniChiusuraWindowViewController', {extend:Ext.app.ViewController, alias:'controller.delimitazionichiusurawindow', onDatefieldAfterRender:function(component, eOpts) {
  record = component.up('window').params;
  component.setMinValue(record.get('datefrom'));
  if (record.get('dateto') != null && record.get('dateto') != '') {
    component.setValue(record.get('dateto'));
  }
}, onFormBeforeRender:function(component, eOpts) {
  var record = component.up('window').params;
  component.getForm().baseParams.id = record.get('id');
}, onWindowBeforeRender:function(component, eOpts) {
  var record = component.params;
  component.setTitle(component.getTitle() + ' (id: ' + record.get('id') + ')');
}});
Ext.define('SIMFito.view.delimitazioniChiusuraWindow', {extend:Ext.window.Window, alias:'widget.delimitazionichiusurawindow', controller:'delimitazionichiusurawindow', viewModel:{type:'delimitazionichiusurawindow'}, height:250, width:400, iconCls:'fas fa-calendar-times', title:'Chiudi periodo', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'form', flex:1, bodyPadding:10, baseParams:{fase:'chiudidelimitazione'}, url:'services/ajax-save-form.php', items:[{xtype:'datefield', anchor:'100%', fieldLabel:'Data di chiusura', 
labelAlign:'top', name:'dateto', allowBlank:false, allowOnlyWhitespace:false, format:'d/m/Y', submitFormat:'Ymd', listeners:{afterrender:'onDatefieldAfterRender'}}], listeners:{beforerender:'onFormBeforeRender'}}, {xtype:'button', handler:function(button, e) {
  var window = button.up('window');
  var form = window.down('form');
  if (form.isValid()) {
    Ext.MessageBox.confirm('Conferma', 'Chiudere il periodo di delimitazione?', function(btn) {
      if (btn == 'yes') {
        form.submit({method:'POST', waitTitle:'Connecting', waitMsg:'Sending data...', success:function(form, action) {
          obj = Ext.util.JSON.decode(action.response.responseText);
          var success = obj.success;
          if (success) {
            window.close();
            Ext.StoreMgr.get('AreasStore').reload();
            Ext.Msg.alert('Info', 'Operazione eseguita con successo');
          } else {
            Ext.Msg.alert('Errore', obj.errors.reason);
          }
        }, failure:function(form, action) {
          if (action.failureType == 'server') {
            obj = Ext.util.JSON.decode(action.response.responseText);
            Ext.Msg.alert('Login Fallito!', obj.errors.reason);
          } else {
            Ext.Msg.alert('Attenzione!', 'Server non raggiungibile: ' + action.response.responseText);
          }
        }});
      }
    });
  }
}, text:'Salva'}], listeners:{beforerender:'onWindowBeforeRender'}});
Ext.define('SIMFito.view.labResultWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.labresultwindow'});
Ext.define('SIMFito.view.labResultWindow', {extend:Ext.window.Window, alias:'widget.labresultwindow', viewModel:{type:'labresultwindow'}, constrain:true, height:250, width:400, layout:'fit', title:'Dettaglio Risultati', items:[{xtype:'gridpanel', scrollable:true, autoLoad:true, store:'laboratoryStore', columns:[{xtype:'numbercolumn', width:125, dataIndex:'elementindex', text:'Sottocampione', format:'0'}, {xtype:'gridcolumn', renderer:function(value, metaData, record, rowIndex, colIndex, store, view) {
  var returning = value;
  if (value !== null && value !== '') {
    switch(record.get('positive') * 1) {
      case 0:
        returning = '\x3cspan style\x3d"color:green;"\x3e' + value + '\x3c/span\x3e';
        break;
      case 1:
        returning = '\x3cspan style\x3d"color:red;"\x3e' + value + '\x3c/span\x3e';
        break;
      case 2:
        returning = '\x3cspan style\x3d"color:yellow;"\x3e' + value + '\x3c/span\x3e';
        break;
    }
  }
  return returning;
}, flex:1, dataIndex:'name', text:'Risultato'}]}]});
Ext.define('SIMFito.view.newsEditWindowViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.newseditwindow'});
Ext.define('SIMFito.view.newsEditWindow', {extend:Ext.window.Window, alias:'widget.newseditwindow', viewModel:{type:'newseditwindow'}, constrain:true, height:480, width:640, layout:'fit', title:'Avviso', items:[{xtype:'form', scrollable:true, bodyPadding:10, url:'services/ajax-save-form.php', layout:{type:'vbox', align:'stretch'}, items:[{xtype:'htmleditor', flex:1, flex:1, height:150, id:'newsText', labelAlign:'top', name:'news'}, {xtype:'hiddenfield', flex:1, id:'newsid', fieldLabel:'Label', name:'id', 
value:'-1'}, {xtype:'hiddenfield', flex:1, fieldLabel:'Label', name:'fase', value:'update-news'}], dockedItems:[{xtype:'button', handler:function(button, e) {
  var form = button.up('form').getForm();
  var id = Ext.getCmp('newsid').getValue();
  var window = button.up('window');
  var text = 'Modificare la news';
  if (id == -1) {
    text = 'Inserire la news';
  }
  if (Ext.getCmp('newsText').getValue() != '') {
    Ext.Msg.confirm('Conferma', text, function(btn, value, opt) {
      if (btn == 'yes') {
        form.submit({method:'POST', waitTitle:'Connessione in corso', waitMsg:'Invio informazioni', success:function(form, action) {
          obj = Ext.util.JSON.decode(action.response.responseText);
          var success = obj.success;
          if (success) {
            Ext.StoreMgr.get('NewsStore').reload();
            window.close();
          } else {
            Ext.Msg.alert('Errore', obj.errors.reason);
          }
        }, failure:function(form, action) {
          if (action.failureType == 'server') {
            obj = Ext.util.JSON.decode(action.response.responseText);
            Ext.Msg.alert('Errore', obj.errors.reason);
          } else {
            Ext.Msg.alert('Errore', 'Server non raggiungibile: ' + action.response.responseText);
          }
        }});
      }
    });
  }
}, flex:1, dock:'bottom', text:'Salva'}]}], init:function(record) {
  console.log(record);
  Ext.getCmp('newsid').setValue(record.get('id'));
  Ext.getCmp('newsText').setValue(record.get('news'));
  this.show();
}});
Ext.define('SIMFito.view.officialUELoadWinViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.officialueloadwin'});
Ext.define('SIMFito.view.officialUELoadWinViewController', {extend:Ext.app.ViewController, alias:'controller.officialueloadwin', onFormRender:function(component, eOpts) {
  var form = component.getForm();
  form.baseParams.uid = localStore.getItem('ID');
}});
Ext.define('SIMFito.view.officialUELoadWin', {extend:Ext.window.Window, alias:'widget.officialueloadwin', controller:'officialueloadwin', viewModel:{type:'officialueloadwin'}, modal:true, height:250, width:400, layout:'fit', title:'Carica Report', items:[{xtype:'form', scrollable:true, bodyPadding:10, baseParams:{mode:'add'}, url:'services/manage_reports.php', items:[{xtype:'numberfield', anchor:'100%', fieldLabel:'Anno:', msgTarget:'under', name:'year', allowBlank:false, allowOnlyWhitespace:false, 
allowDecimals:false, allowExponential:false, decimalPrecision:0, minValue:2020}, {xtype:'filefield', anchor:'100%', fieldLabel:'File', msgTarget:'under', name:'report'}], dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var form = button.up('form');
  if (form.isValid()) {
    form.submit({clientValidation:true, method:'POST', success:function(form, action) {
      Ext.Msg.alert('Successo', 'Report caricato');
      Ext.StoreMgr.get('officialuestore').reload();
      form.up('window').close();
    }, faillure:function(form, action) {
      switch(action.failureType) {
        case Ext.form.action.Action.CLIENT_INVALID:
          Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
          break;
        case Ext.form.action.Action.CONNECT_FAILURE:
          Ext.Msg.alert('Failure', 'Ajax communication failed');
          break;
        case Ext.form.action.Action.SERVER_INVALID:
          Ext.Msg.alert('Failure', action.result.msg);
          break;
        default:
          Ext.Msg.alert('Faiilure', action.result.errors.reason);
          console.log(action.result);
          break;
      }
    }});
  }
}, text:'Carica'}]}], listeners:{render:'onFormRender'}}]});
Ext.define('SIMFito.view.tableHostModelsViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.tablehostmodels'});
Ext.define('SIMFito.view.tableHostModelsViewController', {extend:Ext.app.ViewController, alias:'controller.tablehostmodels', select:function(rowmodel, record, index, eOpts) {
}});
Ext.define('SIMFito.view.tableHostModels', {extend:Ext.grid.Panel, alias:'widget.tablehostmodels', controller:'tablehostmodels', viewModel:{type:'tablehostmodels'}, reference:'list', height:250, width:400, title:'My Grid Panel', forceFit:true, store:'tableHostStore', columns:[{xtype:'gridcolumn', dataIndex:'string', text:'String'}, {xtype:'numbercolumn', dataIndex:'number', text:'Number'}, {xtype:'datecolumn', dataIndex:'date', text:'Date'}, {xtype:'booleancolumn', dataIndex:'bool', text:'Boolean'}, 
{xtype:'gridcolumn', dataIndex:'hostcode', text:'Hostcode'}, {xtype:'gridcolumn', dataIndex:'name', text:'Name'}], listeners:{select:'select'}});
Ext.define('SIMFito.view.unisciAreaViewModel', {extend:Ext.app.ViewModel, alias:'viewmodel.unisciarea'});
Ext.define('SIMFito.view.unisciAreaViewController', {extend:Ext.app.ViewController, alias:'controller.unisciarea', onFormAfterRender:function(component, eOpts) {
  var record = component.up('window').params;
  component.getForm().baseParams.idto = record.get('id');
  console.log(component);
}});
Ext.define('SIMFito.view.unisciArea', {extend:Ext.window.Window, alias:'widget.unisciarea', controller:'unisciarea', viewModel:{type:'unisciarea'}, height:250, width:400, layout:'fit', iconCls:'fas fa-link', title:'Unisci Aree', items:[{xtype:'form', bodyPadding:10, baseParams:{fase:'unisciaree'}, url:'services/ajax-save-form.php', items:[{xtype:'combobox', validator:function(value) {
  var record = this.up('window').params;
  if (this.getValue() == record.get('id')) {
    return 'Un\x26apos;area non pu\x26ograve; essere collegata a se stessa!';
  } else {
    return true;
  }
}, anchor:'100%', fieldLabel:'Area alla quale unire', labelAlign:'top', msgTarget:'under', name:'idfrom', allowBlank:false, allowOnlyWhitespace:false, displayField:'descrizione', store:'areelinkabili', valueField:'id'}], dockedItems:[{xtype:'toolbar', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', handler:function(button, e) {
  var window = button.up('window');
  var form = button.up('form');
  var record = window.params;
  if (form.isValid()) {
    Ext.MessageBox.confirm('Conferma', 'Aggiungere all\x26apos; area ' + record.get('name') + ' l\x26apos;area selezionata?', function(btn) {
      if (btn == 'yes') {
        form.submit({method:'POST', waitTitle:'Connecting', waitMsg:'Sending data...', success:function(form, action) {
          obj = Ext.util.JSON.decode(action.response.responseText);
          var success = obj.success;
          if (success) {
            window.close();
            Ext.StoreMgr.get('AreasStore').reload();
            Ext.Msg.alert('Info', 'Operazione eseguita con successo');
          } else {
            Ext.Msg.alert('Errore', obj.errors.reason);
          }
        }, failure:function(form, action) {
          if (action.failureType == 'server') {
            obj = Ext.util.JSON.decode(action.response.responseText);
            Ext.Msg.alert('Login Fallito!', obj.errors.reason);
          } else {
            Ext.Msg.alert('Attenzione!', 'Server non raggiungibile: ' + action.response.responseText);
          }
        }});
      }
    });
  }
}, text:'Collega'}]}], listeners:{afterrender:'onFormAfterRender'}}]});
(function(a, b) {
  function G(a) {
    var b = F[a] = {};
    return p.each(a.split(s), function(a, c) {
      b[c] = !0;
    }), b;
  }
  function J(a, c, d) {
    if (d === b && a.nodeType === 1) {
      var e = 'data-' + c.replace(I, '-$1').toLowerCase();
      d = a.getAttribute(e);
      if (typeof d == 'string') {
        try {
          d = d === 'true' ? !0 : d === 'false' ? !1 : d === 'null' ? null : +d + '' === d ? +d : H.test(d) ? p.parseJSON(d) : d;
        } catch (f$0) {
        }
        p.data(a, c, d);
      } else {
        d = b;
      }
    }
    return d;
  }
  function K(a) {
    var b;
    for (b in a) {
      if (b === 'data' && p.isEmptyObject(a[b])) {
        continue;
      }
      if (b !== 'toJSON') {
        return !1;
      }
    }
    return !0;
  }
  function ba() {
    return !1;
  }
  function bb() {
    return !0;
  }
  function bh(a) {
    return !a || !a.parentNode || a.parentNode.nodeType === 11;
  }
  function bi(a, b) {
    do {
      a = a[b];
    } while (a && a.nodeType !== 1);
    return a;
  }
  function bj(a, b, c) {
    b = b || 0;
    if (p.isFunction(b)) {
      return p.grep(a, function(a, d) {
        var e = !!b.call(a, d, a);
        return e === c;
      });
    }
    if (b.nodeType) {
      return p.grep(a, function(a, d) {
        return a === b === c;
      });
    }
    if (typeof b == 'string') {
      var d = p.grep(a, function(a) {
        return a.nodeType === 1;
      });
      if (be.test(b)) {
        return p.filter(b, d, !c);
      }
      b = p.filter(b, d);
    }
    return p.grep(a, function(a, d) {
      return p.inArray(a, b) >= 0 === c;
    });
  }
  function bk(a) {
    var b = bl.split('|'), c = a.createDocumentFragment();
    if (c.createElement) {
      while (b.length) {
        c.createElement(b.pop());
      }
    }
    return c;
  }
  function bC(a, b) {
    return a.getElementsByTagName(b)[0] || a.appendChild(a.ownerDocument.createElement(b));
  }
  function bD(a, b) {
    if (b.nodeType !== 1 || !p.hasData(a)) {
      return;
    }
    var c, d, e, f = p._data(a), g = p._data(b, f), h = f.events;
    if (h) {
      delete g.handle, g.events = {};
      for (c in h) {
        for (d = 0, e = h[c].length; d < e; d++) {
          p.event.add(b, c, h[c][d]);
        }
      }
    }
    g.data && (g.data = p.extend({}, g.data));
  }
  function bE(a, b) {
    var c;
    if (b.nodeType !== 1) {
      return;
    }
    b.clearAttributes && b.clearAttributes(), b.mergeAttributes && b.mergeAttributes(a), c = b.nodeName.toLowerCase(), c === 'object' ? (b.parentNode && (b.outerHTML = a.outerHTML), p.support.html5Clone && a.innerHTML && !p.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : c === 'input' && bv.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : c === 'option' ? b.selected = a.defaultSelected : c === 'input' || c === 'textarea' ? b.defaultValue = 
    a.defaultValue : c === 'script' && b.text !== a.text && (b.text = a.text), b.removeAttribute(p.expando);
  }
  function bF(a) {
    return typeof a.getElementsByTagName != 'undefined' ? a.getElementsByTagName('*') : typeof a.querySelectorAll != 'undefined' ? a.querySelectorAll('*') : [];
  }
  function bG(a) {
    bv.test(a.type) && (a.defaultChecked = a.checked);
  }
  function bY(a, b) {
    if (b in a) {
      return b;
    }
    var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, e = bW.length;
    while (e--) {
      b = bW[e] + c;
      if (b in a) {
        return b;
      }
    }
    return d;
  }
  function bZ(a, b) {
    return a = b || a, p.css(a, 'display') === 'none' || !p.contains(a.ownerDocument, a);
  }
  function b$(a, b) {
    var c, d, e = [], f = 0, g = a.length;
    for (; f < g; f++) {
      c = a[f];
      if (!c.style) {
        continue;
      }
      e[f] = p._data(c, 'olddisplay'), b ? (!e[f] && c.style.display === 'none' && (c.style.display = ''), c.style.display === '' && bZ(c) && (e[f] = p._data(c, 'olddisplay', cc(c.nodeName)))) : (d = bH(c, 'display'), !e[f] && d !== 'none' && p._data(c, 'olddisplay', d));
    }
    for (f = 0; f < g; f++) {
      c = a[f];
      if (!c.style) {
        continue;
      }
      if (!b || c.style.display === 'none' || c.style.display === '') {
        c.style.display = b ? e[f] || '' : 'none';
      }
    }
    return a;
  }
  function b_(a, b, c) {
    var d = bP.exec(b);
    return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || 'px') : b;
  }
  function ca(a, b, c, d) {
    var e = c === (d ? 'border' : 'content') ? 4 : b === 'width' ? 1 : 0, f = 0;
    for (; e < 4; e += 2) {
      c === 'margin' && (f += p.css(a, c + bV[e], !0)), d ? (c === 'content' && (f -= parseFloat(bH(a, 'padding' + bV[e])) || 0), c !== 'margin' && (f -= parseFloat(bH(a, 'border' + bV[e] + 'Width')) || 0)) : (f += parseFloat(bH(a, 'padding' + bV[e])) || 0, c !== 'padding' && (f += parseFloat(bH(a, 'border' + bV[e] + 'Width')) || 0));
    }
    return f;
  }
  function cb(a, b, c) {
    var d = b === 'width' ? a.offsetWidth : a.offsetHeight, e = !0, f = p.support.boxSizing && p.css(a, 'boxSizing') === 'border-box';
    if (d <= 0 || d == null) {
      d = bH(a, b);
      if (d < 0 || d == null) {
        d = a.style[b];
      }
      if (bQ.test(d)) {
        return d;
      }
      e = f && (p.support.boxSizingReliable || d === a.style[b]), d = parseFloat(d) || 0;
    }
    return d + ca(a, b, c || (f ? 'border' : 'content'), e) + 'px';
  }
  function cc(a) {
    if (bS[a]) {
      return bS[a];
    }
    var b = p('\x3c' + a + '\x3e').appendTo(e.body), c = b.css('display');
    b.remove();
    if (c === 'none' || c === '') {
      bI = e.body.appendChild(bI || p.extend(e.createElement('iframe'), {frameBorder:0, width:0, height:0}));
      if (!bJ || !bI.createElement) {
        bJ = (bI.contentWindow || bI.contentDocument).document, bJ.write('\x3c!doctype html\x3e\x3chtml\x3e\x3cbody\x3e'), bJ.close();
      }
      b = bJ.body.appendChild(bJ.createElement(a)), c = bH(b, 'display'), e.body.removeChild(bI);
    }
    return bS[a] = c, c;
  }
  function ci(a, b, c, d) {
    var e;
    if (p.isArray(b)) {
      p.each(b, function(b, e) {
        c || ce.test(a) ? d(a, e) : ci(a + '[' + (typeof e == 'object' ? b : '') + ']', e, c, d);
      });
    } else {
      if (!c && p.type(b) === 'object') {
        for (e in b) {
          ci(a + '[' + e + ']', b[e], c, d);
        }
      } else {
        d(a, b);
      }
    }
  }
  function cz(a) {
    return function(b, c) {
      typeof b != 'string' && (c = b, b = '*');
      var d, e, f, g = b.toLowerCase().split(s), h = 0, i = g.length;
      if (p.isFunction(c)) {
        for (; h < i; h++) {
          d = g[h], f = /^\+/.test(d), f && (d = d.substr(1) || '*'), e = a[d] = a[d] || [], e[f ? 'unshift' : 'push'](c);
        }
      }
    };
  }
  function cA(a, c, d, e, f, g) {
    f = f || c.dataTypes[0], g = g || {}, g[f] = !0;
    var h, i = a[f], j = 0, k = i ? i.length : 0, l = a === cv;
    for (; j < k && (l || !h); j++) {
      h = i[j](c, d, e), typeof h == 'string' && (!l || g[h] ? h = b : (c.dataTypes.unshift(h), h = cA(a, c, d, e, h, g)));
    }
    return (l || !h) && !g['*'] && (h = cA(a, c, d, e, '*', g)), h;
  }
  function cB(a, c) {
    var d, e, f = p.ajaxSettings.flatOptions || {};
    for (d in c) {
      c[d] !== b && ((f[d] ? a : e || (e = {}))[d] = c[d]);
    }
    e && p.extend(!0, a, e);
  }
  function cC(a, c, d) {
    var e, f, g, h, i = a.contents, j = a.dataTypes, k = a.responseFields;
    for (f in k) {
      f in d && (c[k[f]] = d[f]);
    }
    while (j[0] === '*') {
      j.shift(), e === b && (e = a.mimeType || c.getResponseHeader('content-type'));
    }
    if (e) {
      for (f in i) {
        if (i[f] && i[f].test(e)) {
          j.unshift(f);
          break;
        }
      }
    }
    if (j[0] in d) {
      g = j[0];
    } else {
      for (f in d) {
        if (!j[0] || a.converters[f + ' ' + j[0]]) {
          g = f;
          break;
        }
        h || (h = f);
      }
      g = g || h;
    }
    if (g) {
      return g !== j[0] && j.unshift(g), d[g];
    }
  }
  function cD(a, b) {
    var c, d, e, f, g = a.dataTypes.slice(), h = g[0], i = {}, j = 0;
    a.dataFilter && (b = a.dataFilter(b, a.dataType));
    if (g[1]) {
      for (c in a.converters) {
        i[c.toLowerCase()] = a.converters[c];
      }
    }
    for (; e = g[++j];) {
      if (e !== '*') {
        if (h !== '*' && h !== e) {
          c = i[h + ' ' + e] || i['* ' + e];
          if (!c) {
            for (d in i) {
              f = d.split(' ');
              if (f[1] === e) {
                c = i[h + ' ' + f[0]] || i['* ' + f[0]];
                if (c) {
                  c === !0 ? c = i[d] : i[d] !== !0 && (e = f[0], g.splice(j--, 0, e));
                  break;
                }
              }
            }
          }
          if (c !== !0) {
            if (c && a['throws']) {
              b = c(b);
            } else {
              try {
                b = c(b);
              } catch (k$1) {
                return {state:'parsererror', error:c ? k$1 : 'No conversion from ' + h + ' to ' + e};
              }
            }
          }
        }
        h = e;
      }
    }
    return {state:'success', data:b};
  }
  function cL() {
    try {
      return new a.XMLHttpRequest;
    } catch (b$2) {
    }
  }
  function cM() {
    try {
      return new a.ActiveXObject('Microsoft.XMLHTTP');
    } catch (b$3) {
    }
  }
  function cU() {
    return setTimeout(function() {
      cN = b;
    }, 0), cN = p.now();
  }
  function cV(a, b) {
    p.each(b, function(b, c) {
      var d = (cT[b] || []).concat(cT['*']), e = 0, f = d.length;
      for (; e < f; e++) {
        if (d[e].call(a, b, c)) {
          return;
        }
      }
    });
  }
  function cW(a, b, c) {
    var d, e = 0, f = 0, g = cS.length, h = p.Deferred().always(function() {
      delete i.elem;
    }), i = function() {
      var b = cN || cU(), c = Math.max(0, j.startTime + j.duration - b), d = 1 - (c / j.duration || 0), e = 0, f = j.tweens.length;
      for (; e < f; e++) {
        j.tweens[e].run(d);
      }
      return h.notifyWith(a, [j, d, c]), d < 1 && f ? c : (h.resolveWith(a, [j]), !1);
    }, j = h.promise({elem:a, props:p.extend({}, b), opts:p.extend(!0, {specialEasing:{}}, c), originalProperties:b, originalOptions:c, startTime:cN || cU(), duration:c.duration, tweens:[], createTween:function(b, c, d) {
      var e = p.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
      return j.tweens.push(e), e;
    }, stop:function(b) {
      var c = 0, d = b ? j.tweens.length : 0;
      for (; c < d; c++) {
        j.tweens[c].run(1);
      }
      return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this;
    }}), k = j.props;
    cX(k, j.opts.specialEasing);
    for (; e < g; e++) {
      d = cS[e].call(j, a, k, j.opts);
      if (d) {
        return d;
      }
    }
    return cV(j, k), p.isFunction(j.opts.start) && j.opts.start.call(a, j), p.fx.timer(p.extend(i, {anim:j, queue:j.opts.queue, elem:a})), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always);
  }
  function cX(a, b) {
    var c, d, e, f, g;
    for (c in a) {
      d = p.camelCase(c), e = b[d], f = a[c], p.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = p.cssHooks[d];
      if (g && 'expand' in g) {
        f = g.expand(f), delete a[d];
        for (c in f) {
          c in a || (a[c] = f[c], b[c] = e);
        }
      } else {
        b[d] = e;
      }
    }
  }
  function cY(a, b, c) {
    var d, e, f, g, h, i, j, k, l = this, m = a.style, n = {}, o = [], q = a.nodeType && bZ(a);
    c.queue || (j = p._queueHooks(a, 'fx'), j.unqueued == null && (j.unqueued = 0, k = j.empty.fire, j.empty.fire = function() {
      j.unqueued || k();
    }), j.unqueued++, l.always(function() {
      l.always(function() {
        j.unqueued--, p.queue(a, 'fx').length || j.empty.fire();
      });
    })), a.nodeType === 1 && ('height' in b || 'width' in b) && (c.overflow = [m.overflow, m.overflowX, m.overflowY], p.css(a, 'display') === 'inline' && p.css(a, 'float') === 'none' && (!p.support.inlineBlockNeedsLayout || cc(a.nodeName) === 'inline' ? m.display = 'inline-block' : m.zoom = 1)), c.overflow && (m.overflow = 'hidden', p.support.shrinkWrapBlocks || l.done(function() {
      m.overflow = c.overflow[0], m.overflowX = c.overflow[1], m.overflowY = c.overflow[2];
    }));
    for (d in b) {
      f = b[d];
      if (cP.exec(f)) {
        delete b[d];
        if (f === (q ? 'hide' : 'show')) {
          continue;
        }
        o.push(d);
      }
    }
    g = o.length;
    if (g) {
      h = p._data(a, 'fxshow') || p._data(a, 'fxshow', {}), q ? p(a).show() : l.done(function() {
        p(a).hide();
      }), l.done(function() {
        var b;
        p.removeData(a, 'fxshow', !0);
        for (b in n) {
          p.style(a, b, n[b]);
        }
      });
      for (d = 0; d < g; d++) {
        e = o[d], i = l.createTween(e, q ? h[e] : 0), n[e] = h[e] || p.style(a, e), e in h || (h[e] = i.start, q && (i.end = i.start, i.start = e === 'width' || e === 'height' ? 1 : 0));
      }
    }
  }
  function cZ(a, b, c, d, e) {
    return new cZ.prototype.init(a, b, c, d, e);
  }
  function c$(a, b) {
    var c, d = {height:a}, e = 0;
    b = b ? 1 : 0;
    for (; e < 4; e += 2 - b) {
      c = bV[e], d['margin' + c] = d['padding' + c] = a;
    }
    return b && (d.opacity = d.width = a), d;
  }
  function da(a) {
    return p.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : !1;
  }
  var c, d, e = a.document, f = a.location, g = a.navigator, h = a.jQuery, i = a.$, j = Array.prototype.push, k = Array.prototype.slice, l = Array.prototype.indexOf, m = Object.prototype.toString, n = Object.prototype.hasOwnProperty, o = String.prototype.trim, p = function(a, b) {
    return new p.fn.init(a, b, c);
  }, q = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source, r = /\S/, s = /\s+/, t = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, u = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, v = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, w = /^[\],:{}\s]*$/, x = /(?:^|:|,)(?:\s*\[)+/g, y = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, z = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g, A = /^-ms-/, B = /-([\da-z])/gi, C = function(a, b) {
    return (b + '').toUpperCase();
  }, D = function() {
    e.addEventListener ? (e.removeEventListener('DOMContentLoaded', D, !1), p.ready()) : e.readyState === 'complete' && (e.detachEvent('onreadystatechange', D), p.ready());
  }, E = {};
  p.fn = p.prototype = {constructor:p, init:function(a, c, d) {
    var f, g, h, i;
    if (!a) {
      return this;
    }
    if (a.nodeType) {
      return this.context = this[0] = a, this.length = 1, this;
    }
    if (typeof a == 'string') {
      a.charAt(0) === '\x3c' && a.charAt(a.length - 1) === '\x3e' && a.length >= 3 ? f = [null, a, null] : f = u.exec(a);
      if (f && (f[1] || !c)) {
        if (f[1]) {
          return c = c instanceof p ? c[0] : c, i = c && c.nodeType ? c.ownerDocument || c : e, a = p.parseHTML(f[1], i, !0), v.test(f[1]) && p.isPlainObject(c) && this.attr.call(a, c, !0), p.merge(this, a);
        }
        g = e.getElementById(f[2]);
        if (g && g.parentNode) {
          if (g.id !== f[2]) {
            return d.find(a);
          }
          this.length = 1, this[0] = g;
        }
        return this.context = e, this.selector = a, this;
      }
      return !c || c.jquery ? (c || d).find(a) : this.constructor(c).find(a);
    }
    return p.isFunction(a) ? d.ready(a) : (a.selector !== b && (this.selector = a.selector, this.context = a.context), p.makeArray(a, this));
  }, selector:'', jquery:'1.8.2', length:0, size:function() {
    return this.length;
  }, toArray:function() {
    return k.call(this);
  }, get:function(a) {
    return a == null ? this.toArray() : a < 0 ? this[this.length + a] : this[a];
  }, pushStack:function(a, b, c) {
    var d = p.merge(this.constructor(), a);
    return d.prevObject = this, d.context = this.context, b === 'find' ? d.selector = this.selector + (this.selector ? ' ' : '') + c : b && (d.selector = this.selector + '.' + b + '(' + c + ')'), d;
  }, each:function(a, b) {
    return p.each(this, a, b);
  }, ready:function(a) {
    return p.ready.promise().done(a), this;
  }, eq:function(a) {
    return a = +a, a === -1 ? this.slice(a) : this.slice(a, a + 1);
  }, first:function() {
    return this.eq(0);
  }, last:function() {
    return this.eq(-1);
  }, slice:function() {
    return this.pushStack(k.apply(this, arguments), 'slice', k.call(arguments).join(','));
  }, map:function(a) {
    return this.pushStack(p.map(this, function(b, c) {
      return a.call(b, c, b);
    }));
  }, end:function() {
    return this.prevObject || this.constructor(null);
  }, push:j, sort:[].sort, splice:[].splice}, p.fn.init.prototype = p.fn, p.extend = p.fn.extend = function() {
    var a, c, d, e, f, g, h = arguments[0] || {}, i = 1, j = arguments.length, k = !1;
    typeof h == 'boolean' && (k = h, h = arguments[1] || {}, i = 2), typeof h != 'object' && !p.isFunction(h) && (h = {}), j === i && (h = this, --i);
    for (; i < j; i++) {
      if ((a = arguments[i]) != null) {
        for (c in a) {
          d = h[c], e = a[c];
          if (h === e) {
            continue;
          }
          k && e && (p.isPlainObject(e) || (f = p.isArray(e))) ? (f ? (f = !1, g = d && p.isArray(d) ? d : []) : g = d && p.isPlainObject(d) ? d : {}, h[c] = p.extend(k, g, e)) : e !== b && (h[c] = e);
        }
      }
    }
    return h;
  }, p.extend({noConflict:function(b) {
    return a.$ === p && (a.$ = i), b && a.jQuery === p && (a.jQuery = h), p;
  }, isReady:!1, readyWait:1, holdReady:function(a) {
    a ? p.readyWait++ : p.ready(!0);
  }, ready:function(a) {
    if (a === !0 ? --p.readyWait : p.isReady) {
      return;
    }
    if (!e.body) {
      return setTimeout(p.ready, 1);
    }
    p.isReady = !0;
    if (a !== !0 && --p.readyWait > 0) {
      return;
    }
    d.resolveWith(e, [p]), p.fn.trigger && p(e).trigger('ready').off('ready');
  }, isFunction:function(a) {
    return p.type(a) === 'function';
  }, isArray:Array.isArray || function(a) {
    return p.type(a) === 'array';
  }, isWindow:function(a) {
    return a != null && a == a.window;
  }, isNumeric:function(a) {
    return !isNaN(parseFloat(a)) && isFinite(a);
  }, type:function(a) {
    return a == null ? String(a) : E[m.call(a)] || 'object';
  }, isPlainObject:function(a) {
    if (!a || p.type(a) !== 'object' || a.nodeType || p.isWindow(a)) {
      return !1;
    }
    try {
      if (a.constructor && !n.call(a, 'constructor') && !n.call(a.constructor.prototype, 'isPrototypeOf')) {
        return !1;
      }
    } catch (c$4) {
      return !1;
    }
    var d;
    for (d in a) {
      return d === b || n.call(a, d);
    }
  }, isEmptyObject:function(a) {
    var b;
    for (b in a) {
      return !1;
    }
    return !0;
  }, error:function(a) {
    throw new Error(a);
  }, parseHTML:function(a, b, c) {
    var d;
    return !a || typeof a != 'string' ? null : (typeof b == 'boolean' && (c = b, b = 0), b = b || e, (d = v.exec(a)) ? [b.createElement(d[1])] : (d = p.buildFragment([a], b, c ? null : []), p.merge([], (d.cacheable ? p.clone(d.fragment) : d.fragment).childNodes)));
  }, parseJSON:function(b) {
    if (!b || typeof b != 'string') {
      return null;
    }
    b = p.trim(b);
    if (a.JSON && a.JSON.parse) {
      return a.JSON.parse(b);
    }
    if (w.test(b.replace(y, '@').replace(z, ']').replace(x, ''))) {
      return (new Function('return ' + b))();
    }
    p.error('Invalid JSON: ' + b);
  }, parseXML:function(c) {
    var d, e;
    if (!c || typeof c != 'string') {
      return null;
    }
    try {
      a.DOMParser ? (e = new DOMParser, d = e.parseFromString(c, 'text/xml')) : (d = new ActiveXObject('Microsoft.XMLDOM'), d.async = 'false', d.loadXML(c));
    } catch (f$5) {
      d = b;
    }
    return (!d || !d.documentElement || d.getElementsByTagName('parsererror').length) && p.error('Invalid XML: ' + c), d;
  }, noop:function() {
  }, globalEval:function(b) {
    b && r.test(b) && (a.execScript || function(b) {
      a.eval.call(a, b);
    })(b);
  }, camelCase:function(a) {
    return a.replace(A, 'ms-').replace(B, C);
  }, nodeName:function(a, b) {
    return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase();
  }, each:function(a, c, d) {
    var e, f = 0, g = a.length, h = g === b || p.isFunction(a);
    if (d) {
      if (h) {
        for (e in a) {
          if (c.apply(a[e], d) === !1) {
            break;
          }
        }
      } else {
        for (; f < g;) {
          if (c.apply(a[f++], d) === !1) {
            break;
          }
        }
      }
    } else {
      if (h) {
        for (e in a) {
          if (c.call(a[e], e, a[e]) === !1) {
            break;
          }
        }
      } else {
        for (; f < g;) {
          if (c.call(a[f], f, a[f++]) === !1) {
            break;
          }
        }
      }
    }
    return a;
  }, trim:o && !o.call('﻿ ') ? function(a) {
    return a == null ? '' : o.call(a);
  } : function(a) {
    return a == null ? '' : (a + '').replace(t, '');
  }, makeArray:function(a, b) {
    var c, d = b || [];
    return a != null && (c = p.type(a), a.length == null || c === 'string' || c === 'function' || c === 'regexp' || p.isWindow(a) ? j.call(d, a) : p.merge(d, a)), d;
  }, inArray:function(a, b, c) {
    var d;
    if (b) {
      if (l) {
        return l.call(b, a, c);
      }
      d = b.length, c = c ? c < 0 ? Math.max(0, d + c) : c : 0;
      for (; c < d; c++) {
        if (c in b && b[c] === a) {
          return c;
        }
      }
    }
    return -1;
  }, merge:function(a, c) {
    var d = c.length, e = a.length, f = 0;
    if (typeof d == 'number') {
      for (; f < d; f++) {
        a[e++] = c[f];
      }
    } else {
      while (c[f] !== b) {
        a[e++] = c[f++];
      }
    }
    return a.length = e, a;
  }, grep:function(a, b, c) {
    var d, e = [], f = 0, g = a.length;
    c = !!c;
    for (; f < g; f++) {
      d = !!b(a[f], f), c !== d && e.push(a[f]);
    }
    return e;
  }, map:function(a, c, d) {
    var e, f, g = [], h = 0, i = a.length, j = a instanceof p || i !== b && typeof i == 'number' && (i > 0 && a[0] && a[i - 1] || i === 0 || p.isArray(a));
    if (j) {
      for (; h < i; h++) {
        e = c(a[h], h, d), e != null && (g[g.length] = e);
      }
    } else {
      for (f in a) {
        e = c(a[f], f, d), e != null && (g[g.length] = e);
      }
    }
    return g.concat.apply([], g);
  }, guid:1, proxy:function(a, c) {
    var d, e, f;
    return typeof c == 'string' && (d = a[c], c = a, a = d), p.isFunction(a) ? (e = k.call(arguments, 2), f = function() {
      return a.apply(c, e.concat(k.call(arguments)));
    }, f.guid = a.guid = a.guid || p.guid++, f) : b;
  }, access:function(a, c, d, e, f, g, h) {
    var i, j = d == null, k = 0, l = a.length;
    if (d && typeof d == 'object') {
      for (k in d) {
        p.access(a, c, k, d[k], 1, g, e);
      }
      f = 1;
    } else {
      if (e !== b) {
        i = h === b && p.isFunction(e), j && (i ? (i = c, c = function(a, b, c) {
          return i.call(p(a), c);
        }) : (c.call(a, e), c = null));
        if (c) {
          for (; k < l; k++) {
            c(a[k], d, i ? e.call(a[k], k, c(a[k], d)) : e, h);
          }
        }
        f = 1;
      }
    }
    return f ? a : j ? c.call(a) : l ? c(a[0], d) : g;
  }, now:function() {
    return (new Date).getTime();
  }}), p.ready.promise = function(b) {
    if (!d) {
      d = p.Deferred();
      if (e.readyState === 'complete') {
        setTimeout(p.ready, 1);
      } else {
        if (e.addEventListener) {
          e.addEventListener('DOMContentLoaded', D, !1), a.addEventListener('load', p.ready, !1);
        } else {
          e.attachEvent('onreadystatechange', D), a.attachEvent('onload', p.ready);
          var c = !1;
          try {
            c = a.frameElement == null && e.documentElement;
          } catch (f$6) {
          }
          c && c.doScroll && function g() {
            if (!p.isReady) {
              try {
                c.doScroll('left');
              } catch (a$7) {
                return setTimeout(g, 50);
              }
              p.ready();
            }
          }();
        }
      }
    }
    return d.promise(b);
  }, p.each('Boolean Number String Function Array Date RegExp Object'.split(' '), function(a, b) {
    E['[object ' + b + ']'] = b.toLowerCase();
  }), c = p(e);
  var F = {};
  p.Callbacks = function(a) {
    a = typeof a == 'string' ? F[a] || G(a) : p.extend({}, a);
    var c, d, e, f, g, h, i = [], j = !a.once && [], k = function(b) {
      c = a.memory && b, d = !0, h = f || 0, f = 0, g = i.length, e = !0;
      for (; i && h < g; h++) {
        if (i[h].apply(b[0], b[1]) === !1 && a.stopOnFalse) {
          c = !1;
          break;
        }
      }
      e = !1, i && (j ? j.length && k(j.shift()) : c ? i = [] : l.disable());
    }, l = {add:function() {
      if (i) {
        var b = i.length;
        (function d(b) {
          p.each(b, function(b, c) {
            var e = p.type(c);
            e === 'function' && (!a.unique || !l.has(c)) ? i.push(c) : c && c.length && e !== 'string' && d(c);
          });
        })(arguments), e ? g = i.length : c && (f = b, k(c));
      }
      return this;
    }, remove:function() {
      return i && p.each(arguments, function(a, b) {
        var c;
        while ((c = p.inArray(b, i, c)) > -1) {
          i.splice(c, 1), e && (c <= g && g--, c <= h && h--);
        }
      }), this;
    }, has:function(a) {
      return p.inArray(a, i) > -1;
    }, empty:function() {
      return i = [], this;
    }, disable:function() {
      return i = j = c = b, this;
    }, disabled:function() {
      return !i;
    }, lock:function() {
      return j = b, c || l.disable(), this;
    }, locked:function() {
      return !j;
    }, fireWith:function(a, b) {
      return b = b || [], b = [a, b.slice ? b.slice() : b], i && (!d || j) && (e ? j.push(b) : k(b)), this;
    }, fire:function() {
      return l.fireWith(this, arguments), this;
    }, fired:function() {
      return !!d;
    }};
    return l;
  }, p.extend({Deferred:function(a) {
    var b = [['resolve', 'done', p.Callbacks('once memory'), 'resolved'], ['reject', 'fail', p.Callbacks('once memory'), 'rejected'], ['notify', 'progress', p.Callbacks('memory')]], c = 'pending', d = {state:function() {
      return c;
    }, always:function() {
      return e.done(arguments).fail(arguments), this;
    }, then:function() {
      var a = arguments;
      return p.Deferred(function(c) {
        p.each(b, function(b, d) {
          var f = d[0], g = a[b];
          e[d[1]](p.isFunction(g) ? function() {
            var a = g.apply(this, arguments);
            a && p.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f + 'With'](this === e ? c : this, [a]);
          } : c[f]);
        }), a = null;
      }).promise();
    }, promise:function(a) {
      return a != null ? p.extend(a, d) : d;
    }}, e = {};
    return d.pipe = d.then, p.each(b, function(a, f) {
      var g = f[2], h = f[3];
      d[f[1]] = g.add, h && g.add(function() {
        c = h;
      }, b[a ^ 1][2].disable, b[2][2].lock), e[f[0]] = g.fire, e[f[0] + 'With'] = g.fireWith;
    }), d.promise(e), a && a.call(e, e), e;
  }, when:function(a) {
    var b = 0, c = k.call(arguments), d = c.length, e = d !== 1 || a && p.isFunction(a.promise) ? d : 0, f = e === 1 ? a : p.Deferred(), g = function(a, b, c) {
      return function(d) {
        b[a] = this, c[a] = arguments.length > 1 ? k.call(arguments) : d, c === h ? f.notifyWith(b, c) : --e || f.resolveWith(b, c);
      };
    }, h, i, j;
    if (d > 1) {
      h = new Array(d), i = new Array(d), j = new Array(d);
      for (; b < d; b++) {
        c[b] && p.isFunction(c[b].promise) ? c[b].promise().done(g(b, j, c)).fail(f.reject).progress(g(b, i, h)) : --e;
      }
    }
    return e || f.resolveWith(j, c), f.promise();
  }}), p.support = function() {
    var b, c, d, f, g, h, i, j, k, l, m, n = e.createElement('div');
    n.setAttribute('className', 't'), n.innerHTML = "  \x3clink/\x3e\x3ctable\x3e\x3c/table\x3e\x3ca href\x3d'/a'\x3ea\x3c/a\x3e\x3cinput type\x3d'checkbox'/\x3e", c = n.getElementsByTagName('*'), d = n.getElementsByTagName('a')[0], d.style.cssText = 'top:1px;float:left;opacity:.5';
    if (!c || !c.length) {
      return {};
    }
    f = e.createElement('select'), g = f.appendChild(e.createElement('option')), h = n.getElementsByTagName('input')[0], b = {leadingWhitespace:n.firstChild.nodeType === 3, tbody:!n.getElementsByTagName('tbody').length, htmlSerialize:!!n.getElementsByTagName('link').length, style:/top/.test(d.getAttribute('style')), hrefNormalized:d.getAttribute('href') === '/a', opacity:/^0.5/.test(d.style.opacity), cssFloat:!!d.style.cssFloat, checkOn:h.value === 'on', optSelected:g.selected, getSetAttribute:n.className !== 
    't', enctype:!!e.createElement('form').enctype, html5Clone:e.createElement('nav').cloneNode(!0).outerHTML !== '\x3c:nav\x3e\x3c/:nav\x3e', boxModel:e.compatMode === 'CSS1Compat', submitBubbles:!0, changeBubbles:!0, focusinBubbles:!1, deleteExpando:!0, noCloneEvent:!0, inlineBlockNeedsLayout:!1, shrinkWrapBlocks:!1, reliableMarginRight:!0, boxSizingReliable:!0, pixelPosition:!1}, h.checked = !0, b.noCloneChecked = h.cloneNode(!0).checked, f.disabled = !0, b.optDisabled = !g.disabled;
    try {
      delete n.test;
    } catch (o$8) {
      b.deleteExpando = !1;
    }
    !n.addEventListener && n.attachEvent && n.fireEvent && (n.attachEvent('onclick', m = function() {
      b.noCloneEvent = !1;
    }), n.cloneNode(!0).fireEvent('onclick'), n.detachEvent('onclick', m)), h = e.createElement('input'), h.value = 't', h.setAttribute('type', 'radio'), b.radioValue = h.value === 't', h.setAttribute('checked', 'checked'), h.setAttribute('name', 't'), n.appendChild(h), i = e.createDocumentFragment(), i.appendChild(n.lastChild), b.checkClone = i.cloneNode(!0).cloneNode(!0).lastChild.checked, b.appendChecked = h.checked, i.removeChild(h), i.appendChild(n);
    if (n.attachEvent) {
      for (k in{submit:!0, change:!0, focusin:!0}) {
        j = 'on' + k, l = j in n, l || (n.setAttribute(j, 'return;'), l = typeof n[j] == 'function'), b[k + 'Bubbles'] = l;
      }
    }
    return p(function() {
      var c, d, f, g, h = 'padding:0;margin:0;border:0;display:block;overflow:hidden;', i = e.getElementsByTagName('body')[0];
      if (!i) {
        return;
      }
      c = e.createElement('div'), c.style.cssText = 'visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px', i.insertBefore(c, i.firstChild), d = e.createElement('div'), c.appendChild(d), d.innerHTML = '\x3ctable\x3e\x3ctr\x3e\x3ctd\x3e\x3c/td\x3e\x3ctd\x3et\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e', f = d.getElementsByTagName('td'), f[0].style.cssText = 'padding:0;margin:0;border:0;display:none', l = f[0].offsetHeight === 0, f[0].style.display = '', f[1].style.display = 'none', 
      b.reliableHiddenOffsets = l && f[0].offsetHeight === 0, d.innerHTML = '', d.style.cssText = 'box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;', b.boxSizing = d.offsetWidth === 4, b.doesNotIncludeMarginInBodyOffset = i.offsetTop !== 1, a.getComputedStyle && (b.pixelPosition = (a.getComputedStyle(d, null) || {}).top !== '1%', b.boxSizingReliable = (a.getComputedStyle(d, null) || 
      {width:'4px'}).width === '4px', g = e.createElement('div'), g.style.cssText = d.style.cssText = h, g.style.marginRight = g.style.width = '0', d.style.width = '1px', d.appendChild(g), b.reliableMarginRight = !parseFloat((a.getComputedStyle(g, null) || {}).marginRight)), typeof d.style.zoom != 'undefined' && (d.innerHTML = '', d.style.cssText = h + 'width:1px;padding:1px;display:inline;zoom:1', b.inlineBlockNeedsLayout = d.offsetWidth === 3, d.style.display = 'block', d.style.overflow = 'visible', 
      d.innerHTML = '\x3cdiv\x3e\x3c/div\x3e', d.firstChild.style.width = '5px', b.shrinkWrapBlocks = d.offsetWidth !== 3, c.style.zoom = 1), i.removeChild(c), c = d = f = g = null;
    }), i.removeChild(n), c = d = f = g = h = i = n = null, b;
  }();
  var H = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, I = /([A-Z])/g;
  p.extend({cache:{}, deletedIds:[], uuid:0, expando:'jQuery' + (p.fn.jquery + Math.random()).replace(/\D/g, ''), noData:{embed:!0, object:'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000', applet:!0}, hasData:function(a) {
    return a = a.nodeType ? p.cache[a[p.expando]] : a[p.expando], !!a && !K(a);
  }, data:function(a, c, d, e) {
    if (!p.acceptData(a)) {
      return;
    }
    var f, g, h = p.expando, i = typeof c == 'string', j = a.nodeType, k = j ? p.cache : a, l = j ? a[h] : a[h] && h;
    if ((!l || !k[l] || !e && !k[l].data) && i && d === b) {
      return;
    }
    l || (j ? a[h] = l = p.deletedIds.pop() || p.guid++ : l = h), k[l] || (k[l] = {}, j || (k[l].toJSON = p.noop));
    if (typeof c == 'object' || typeof c == 'function') {
      e ? k[l] = p.extend(k[l], c) : k[l].data = p.extend(k[l].data, c);
    }
    return f = k[l], e || (f.data || (f.data = {}), f = f.data), d !== b && (f[p.camelCase(c)] = d), i ? (g = f[c], g == null && (g = f[p.camelCase(c)])) : g = f, g;
  }, removeData:function(a, b, c) {
    if (!p.acceptData(a)) {
      return;
    }
    var d, e, f, g = a.nodeType, h = g ? p.cache : a, i = g ? a[p.expando] : p.expando;
    if (!h[i]) {
      return;
    }
    if (b) {
      d = c ? h[i] : h[i].data;
      if (d) {
        p.isArray(b) || (b in d ? b = [b] : (b = p.camelCase(b), b in d ? b = [b] : b = b.split(' ')));
        for (e = 0, f = b.length; e < f; e++) {
          delete d[b[e]];
        }
        if (!(c ? K : p.isEmptyObject)(d)) {
          return;
        }
      }
    }
    if (!c) {
      delete h[i].data;
      if (!K(h[i])) {
        return;
      }
    }
    g ? p.cleanData([a], !0) : p.support.deleteExpando || h != h.window ? delete h[i] : h[i] = null;
  }, _data:function(a, b, c) {
    return p.data(a, b, c, !0);
  }, acceptData:function(a) {
    var b = a.nodeName && p.noData[a.nodeName.toLowerCase()];
    return !b || b !== !0 && a.getAttribute('classid') === b;
  }}), p.fn.extend({data:function(a, c) {
    var d, e, f, g, h, i = this[0], j = 0, k = null;
    if (a === b) {
      if (this.length) {
        k = p.data(i);
        if (i.nodeType === 1 && !p._data(i, 'parsedAttrs')) {
          f = i.attributes;
          for (h = f.length; j < h; j++) {
            g = f[j].name, g.indexOf('data-') || (g = p.camelCase(g.substring(5)), J(i, g, k[g]));
          }
          p._data(i, 'parsedAttrs', !0);
        }
      }
      return k;
    }
    return typeof a == 'object' ? this.each(function() {
      p.data(this, a);
    }) : (d = a.split('.', 2), d[1] = d[1] ? '.' + d[1] : '', e = d[1] + '!', p.access(this, function(c) {
      if (c === b) {
        return k = this.triggerHandler('getData' + e, [d[0]]), k === b && i && (k = p.data(i, a), k = J(i, a, k)), k === b && d[1] ? this.data(d[0]) : k;
      }
      d[1] = c, this.each(function() {
        var b = p(this);
        b.triggerHandler('setData' + e, d), p.data(this, a, c), b.triggerHandler('changeData' + e, d);
      });
    }, null, c, arguments.length > 1, null, !1));
  }, removeData:function(a) {
    return this.each(function() {
      p.removeData(this, a);
    });
  }}), p.extend({queue:function(a, b, c) {
    var d;
    if (a) {
      return b = (b || 'fx') + 'queue', d = p._data(a, b), c && (!d || p.isArray(c) ? d = p._data(a, b, p.makeArray(c)) : d.push(c)), d || [];
    }
  }, dequeue:function(a, b) {
    b = b || 'fx';
    var c = p.queue(a, b), d = c.length, e = c.shift(), f = p._queueHooks(a, b), g = function() {
      p.dequeue(a, b);
    };
    e === 'inprogress' && (e = c.shift(), d--), e && (b === 'fx' && c.unshift('inprogress'), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire();
  }, _queueHooks:function(a, b) {
    var c = b + 'queueHooks';
    return p._data(a, c) || p._data(a, c, {empty:p.Callbacks('once memory').add(function() {
      p.removeData(a, b + 'queue', !0), p.removeData(a, c, !0);
    })});
  }}), p.fn.extend({queue:function(a, c) {
    var d = 2;
    return typeof a != 'string' && (c = a, a = 'fx', d--), arguments.length < d ? p.queue(this[0], a) : c === b ? this : this.each(function() {
      var b = p.queue(this, a, c);
      p._queueHooks(this, a), a === 'fx' && b[0] !== 'inprogress' && p.dequeue(this, a);
    });
  }, dequeue:function(a) {
    return this.each(function() {
      p.dequeue(this, a);
    });
  }, delay:function(a, b) {
    return a = p.fx ? p.fx.speeds[a] || a : a, b = b || 'fx', this.queue(b, function(b, c) {
      var d = setTimeout(b, a);
      c.stop = function() {
        clearTimeout(d);
      };
    });
  }, clearQueue:function(a) {
    return this.queue(a || 'fx', []);
  }, promise:function(a, c) {
    var d, e = 1, f = p.Deferred(), g = this, h = this.length, i = function() {
      --e || f.resolveWith(g, [g]);
    };
    typeof a != 'string' && (c = a, a = b), a = a || 'fx';
    while (h--) {
      d = p._data(g[h], a + 'queueHooks'), d && d.empty && (e++, d.empty.add(i));
    }
    return i(), f.promise(c);
  }});
  var L, M, N, O = /[\t\r\n]/g, P = /\r/g, Q = /^(?:button|input)$/i, R = /^(?:button|input|object|select|textarea)$/i, S = /^a(?:rea|)$/i, T = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, U = p.support.getSetAttribute;
  p.fn.extend({attr:function(a, b) {
    return p.access(this, p.attr, a, b, arguments.length > 1);
  }, removeAttr:function(a) {
    return this.each(function() {
      p.removeAttr(this, a);
    });
  }, prop:function(a, b) {
    return p.access(this, p.prop, a, b, arguments.length > 1);
  }, removeProp:function(a) {
    return a = p.propFix[a] || a, this.each(function() {
      try {
        this[a] = b, delete this[a];
      } catch (c$9) {
      }
    });
  }, addClass:function(a) {
    var b, c, d, e, f, g, h;
    if (p.isFunction(a)) {
      return this.each(function(b) {
        p(this).addClass(a.call(this, b, this.className));
      });
    }
    if (a && typeof a == 'string') {
      b = a.split(s);
      for (c = 0, d = this.length; c < d; c++) {
        e = this[c];
        if (e.nodeType === 1) {
          if (!e.className && b.length === 1) {
            e.className = a;
          } else {
            f = ' ' + e.className + ' ';
            for (g = 0, h = b.length; g < h; g++) {
              f.indexOf(' ' + b[g] + ' ') < 0 && (f += b[g] + ' ');
            }
            e.className = p.trim(f);
          }
        }
      }
    }
    return this;
  }, removeClass:function(a) {
    var c, d, e, f, g, h, i;
    if (p.isFunction(a)) {
      return this.each(function(b) {
        p(this).removeClass(a.call(this, b, this.className));
      });
    }
    if (a && typeof a == 'string' || a === b) {
      c = (a || '').split(s);
      for (h = 0, i = this.length; h < i; h++) {
        e = this[h];
        if (e.nodeType === 1 && e.className) {
          d = (' ' + e.className + ' ').replace(O, ' ');
          for (f = 0, g = c.length; f < g; f++) {
            while (d.indexOf(' ' + c[f] + ' ') >= 0) {
              d = d.replace(' ' + c[f] + ' ', ' ');
            }
          }
          e.className = a ? p.trim(d) : '';
        }
      }
    }
    return this;
  }, toggleClass:function(a, b) {
    var c = typeof a, d = typeof b == 'boolean';
    return p.isFunction(a) ? this.each(function(c) {
      p(this).toggleClass(a.call(this, c, this.className, b), b);
    }) : this.each(function() {
      if (c === 'string') {
        var e, f = 0, g = p(this), h = b, i = a.split(s);
        while (e = i[f++]) {
          h = d ? h : !g.hasClass(e), g[h ? 'addClass' : 'removeClass'](e);
        }
      } else {
        if (c === 'undefined' || c === 'boolean') {
          this.className && p._data(this, '__className__', this.className), this.className = this.className || a === !1 ? '' : p._data(this, '__className__') || '';
        }
      }
    });
  }, hasClass:function(a) {
    var b = ' ' + a + ' ', c = 0, d = this.length;
    for (; c < d; c++) {
      if (this[c].nodeType === 1 && (' ' + this[c].className + ' ').replace(O, ' ').indexOf(b) >= 0) {
        return !0;
      }
    }
    return !1;
  }, val:function(a) {
    var c, d, e, f = this[0];
    if (!arguments.length) {
      if (f) {
        return c = p.valHooks[f.type] || p.valHooks[f.nodeName.toLowerCase()], c && 'get' in c && (d = c.get(f, 'value')) !== b ? d : (d = f.value, typeof d == 'string' ? d.replace(P, '') : d == null ? '' : d);
      }
      return;
    }
    return e = p.isFunction(a), this.each(function(d) {
      var f, g = p(this);
      if (this.nodeType !== 1) {
        return;
      }
      e ? f = a.call(this, d, g.val()) : f = a, f == null ? f = '' : typeof f == 'number' ? f += '' : p.isArray(f) && (f = p.map(f, function(a) {
        return a == null ? '' : a + '';
      })), c = p.valHooks[this.type] || p.valHooks[this.nodeName.toLowerCase()];
      if (!c || !('set' in c) || c.set(this, f, 'value') === b) {
        this.value = f;
      }
    });
  }}), p.extend({valHooks:{option:{get:function(a) {
    var b = a.attributes.value;
    return !b || b.specified ? a.value : a.text;
  }}, select:{get:function(a) {
    var b, c, d, e, f = a.selectedIndex, g = [], h = a.options, i = a.type === 'select-one';
    if (f < 0) {
      return null;
    }
    c = i ? f : 0, d = i ? f + 1 : h.length;
    for (; c < d; c++) {
      e = h[c];
      if (e.selected && (p.support.optDisabled ? !e.disabled : e.getAttribute('disabled') === null) && (!e.parentNode.disabled || !p.nodeName(e.parentNode, 'optgroup'))) {
        b = p(e).val();
        if (i) {
          return b;
        }
        g.push(b);
      }
    }
    return i && !g.length && h.length ? p(h[f]).val() : g;
  }, set:function(a, b) {
    var c = p.makeArray(b);
    return p(a).find('option').each(function() {
      this.selected = p.inArray(p(this).val(), c) >= 0;
    }), c.length || (a.selectedIndex = -1), c;
  }}}, attrFn:{}, attr:function(a, c, d, e) {
    var f, g, h, i = a.nodeType;
    if (!a || i === 3 || i === 8 || i === 2) {
      return;
    }
    if (e && p.isFunction(p.fn[c])) {
      return p(a)[c](d);
    }
    if (typeof a.getAttribute == 'undefined') {
      return p.prop(a, c, d);
    }
    h = i !== 1 || !p.isXMLDoc(a), h && (c = c.toLowerCase(), g = p.attrHooks[c] || (T.test(c) ? M : L));
    if (d !== b) {
      if (d === null) {
        p.removeAttr(a, c);
        return;
      }
      return g && 'set' in g && h && (f = g.set(a, d, c)) !== b ? f : (a.setAttribute(c, d + ''), d);
    }
    return g && 'get' in g && h && (f = g.get(a, c)) !== null ? f : (f = a.getAttribute(c), f === null ? b : f);
  }, removeAttr:function(a, b) {
    var c, d, e, f, g = 0;
    if (b && a.nodeType === 1) {
      d = b.split(s);
      for (; g < d.length; g++) {
        e = d[g], e && (c = p.propFix[e] || e, f = T.test(e), f || p.attr(a, e, ''), a.removeAttribute(U ? e : c), f && c in a && (a[c] = !1));
      }
    }
  }, attrHooks:{type:{set:function(a, b) {
    if (Q.test(a.nodeName) && a.parentNode) {
      p.error("type property can't be changed");
    } else {
      if (!p.support.radioValue && b === 'radio' && p.nodeName(a, 'input')) {
        var c = a.value;
        return a.setAttribute('type', b), c && (a.value = c), b;
      }
    }
  }}, value:{get:function(a, b) {
    return L && p.nodeName(a, 'button') ? L.get(a, b) : b in a ? a.value : null;
  }, set:function(a, b, c) {
    if (L && p.nodeName(a, 'button')) {
      return L.set(a, b, c);
    }
    a.value = b;
  }}}, propFix:{tabindex:'tabIndex', readonly:'readOnly', 'for':'htmlFor', 'class':'className', maxlength:'maxLength', cellspacing:'cellSpacing', cellpadding:'cellPadding', rowspan:'rowSpan', colspan:'colSpan', usemap:'useMap', frameborder:'frameBorder', contenteditable:'contentEditable'}, prop:function(a, c, d) {
    var e, f, g, h = a.nodeType;
    if (!a || h === 3 || h === 8 || h === 2) {
      return;
    }
    return g = h !== 1 || !p.isXMLDoc(a), g && (c = p.propFix[c] || c, f = p.propHooks[c]), d !== b ? f && 'set' in f && (e = f.set(a, d, c)) !== b ? e : a[c] = d : f && 'get' in f && (e = f.get(a, c)) !== null ? e : a[c];
  }, propHooks:{tabIndex:{get:function(a) {
    var c = a.getAttributeNode('tabindex');
    return c && c.specified ? parseInt(c.value, 10) : R.test(a.nodeName) || S.test(a.nodeName) && a.href ? 0 : b;
  }}}}), M = {get:function(a, c) {
    var d, e = p.prop(a, c);
    return e === !0 || typeof e != 'boolean' && (d = a.getAttributeNode(c)) && d.nodeValue !== !1 ? c.toLowerCase() : b;
  }, set:function(a, b, c) {
    var d;
    return b === !1 ? p.removeAttr(a, c) : (d = p.propFix[c] || c, d in a && (a[d] = !0), a.setAttribute(c, c.toLowerCase())), c;
  }}, U || (N = {name:!0, id:!0, coords:!0}, L = p.valHooks.button = {get:function(a, c) {
    var d;
    return d = a.getAttributeNode(c), d && (N[c] ? d.value !== '' : d.specified) ? d.value : b;
  }, set:function(a, b, c) {
    var d = a.getAttributeNode(c);
    return d || (d = e.createAttribute(c), a.setAttributeNode(d)), d.value = b + '';
  }}, p.each(['width', 'height'], function(a, b) {
    p.attrHooks[b] = p.extend(p.attrHooks[b], {set:function(a, c) {
      if (c === '') {
        return a.setAttribute(b, 'auto'), c;
      }
    }});
  }), p.attrHooks.contenteditable = {get:L.get, set:function(a, b, c) {
    b === '' && (b = 'false'), L.set(a, b, c);
  }}), p.support.hrefNormalized || p.each(['href', 'src', 'width', 'height'], function(a, c) {
    p.attrHooks[c] = p.extend(p.attrHooks[c], {get:function(a) {
      var d = a.getAttribute(c, 2);
      return d === null ? b : d;
    }});
  }), p.support.style || (p.attrHooks.style = {get:function(a) {
    return a.style.cssText.toLowerCase() || b;
  }, set:function(a, b) {
    return a.style.cssText = b + '';
  }}), p.support.optSelected || (p.propHooks.selected = p.extend(p.propHooks.selected, {get:function(a) {
    var b = a.parentNode;
    return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null;
  }})), p.support.enctype || (p.propFix.enctype = 'encoding'), p.support.checkOn || p.each(['radio', 'checkbox'], function() {
    p.valHooks[this] = {get:function(a) {
      return a.getAttribute('value') === null ? 'on' : a.value;
    }};
  }), p.each(['radio', 'checkbox'], function() {
    p.valHooks[this] = p.extend(p.valHooks[this], {set:function(a, b) {
      if (p.isArray(b)) {
        return a.checked = p.inArray(p(a).val(), b) >= 0;
      }
    }});
  });
  var V = /^(?:textarea|input|select)$/i, W = /^([^\.]*|)(?:\.(.+)|)$/, X = /(?:^|\s)hover(\.\S+|)\b/, Y = /^key/, Z = /^(?:mouse|contextmenu)|click/, $ = /^(?:focusinfocus|focusoutblur)$/, _ = function(a) {
    return p.event.special.hover ? a : a.replace(X, 'mouseenter$1 mouseleave$1');
  };
  p.event = {add:function(a, c, d, e, f) {
    var g, h, i, j, k, l, m, n, o, q, r;
    if (a.nodeType === 3 || a.nodeType === 8 || !c || !d || !(g = p._data(a))) {
      return;
    }
    d.handler && (o = d, d = o.handler, f = o.selector), d.guid || (d.guid = p.guid++), i = g.events, i || (g.events = i = {}), h = g.handle, h || (g.handle = h = function(a) {
      return typeof p != 'undefined' && (!a || p.event.triggered !== a.type) ? p.event.dispatch.apply(h.elem, arguments) : b;
    }, h.elem = a), c = p.trim(_(c)).split(' ');
    for (j = 0; j < c.length; j++) {
      k = W.exec(c[j]) || [], l = k[1], m = (k[2] || '').split('.').sort(), r = p.event.special[l] || {}, l = (f ? r.delegateType : r.bindType) || l, r = p.event.special[l] || {}, n = p.extend({type:l, origType:k[1], data:e, handler:d, guid:d.guid, selector:f, needsContext:f && p.expr.match.needsContext.test(f), namespace:m.join('.')}, o), q = i[l];
      if (!q) {
        q = i[l] = [], q.delegateCount = 0;
        if (!r.setup || r.setup.call(a, e, m, h) === !1) {
          a.addEventListener ? a.addEventListener(l, h, !1) : a.attachEvent && a.attachEvent('on' + l, h);
        }
      }
      r.add && (r.add.call(a, n), n.handler.guid || (n.handler.guid = d.guid)), f ? q.splice(q.delegateCount++, 0, n) : q.push(n), p.event.global[l] = !0;
    }
    a = null;
  }, global:{}, remove:function(a, b, c, d, e) {
    var f, g, h, i, j, k, l, m, n, o, q, r = p.hasData(a) && p._data(a);
    if (!r || !(m = r.events)) {
      return;
    }
    b = p.trim(_(b || '')).split(' ');
    for (f = 0; f < b.length; f++) {
      g = W.exec(b[f]) || [], h = i = g[1], j = g[2];
      if (!h) {
        for (h in m) {
          p.event.remove(a, h + b[f], c, d, !0);
        }
        continue;
      }
      n = p.event.special[h] || {}, h = (d ? n.delegateType : n.bindType) || h, o = m[h] || [], k = o.length, j = j ? new RegExp('(^|\\.)' + j.split('.').sort().join('\\.(?:.*\\.|)') + '(\\.|$)') : null;
      for (l = 0; l < o.length; l++) {
        q = o[l], (e || i === q.origType) && (!c || c.guid === q.guid) && (!j || j.test(q.namespace)) && (!d || d === q.selector || d === '**' && q.selector) && (o.splice(l--, 1), q.selector && o.delegateCount--, n.remove && n.remove.call(a, q));
      }
      o.length === 0 && k !== o.length && ((!n.teardown || n.teardown.call(a, j, r.handle) === !1) && p.removeEvent(a, h, r.handle), delete m[h]);
    }
    p.isEmptyObject(m) && (delete r.handle, p.removeData(a, 'events', !0));
  }, customEvent:{getData:!0, setData:!0, changeData:!0}, trigger:function(c, d, f, g) {
    if (!f || f.nodeType !== 3 && f.nodeType !== 8) {
      var h, i, j, k, l, m, n, o, q, r, s = c.type || c, t = [];
      if ($.test(s + p.event.triggered)) {
        return;
      }
      s.indexOf('!') >= 0 && (s = s.slice(0, -1), i = !0), s.indexOf('.') >= 0 && (t = s.split('.'), s = t.shift(), t.sort());
      if ((!f || p.event.customEvent[s]) && !p.event.global[s]) {
        return;
      }
      c = typeof c == 'object' ? c[p.expando] ? c : new p.Event(s, c) : new p.Event(s), c.type = s, c.isTrigger = !0, c.exclusive = i, c.namespace = t.join('.'), c.namespace_re = c.namespace ? new RegExp('(^|\\.)' + t.join('\\.(?:.*\\.|)') + '(\\.|$)') : null, m = s.indexOf(':') < 0 ? 'on' + s : '';
      if (!f) {
        h = p.cache;
        for (j in h) {
          h[j].events && h[j].events[s] && p.event.trigger(c, d, h[j].handle.elem, !0);
        }
        return;
      }
      c.result = b, c.target || (c.target = f), d = d != null ? p.makeArray(d) : [], d.unshift(c), n = p.event.special[s] || {};
      if (n.trigger && n.trigger.apply(f, d) === !1) {
        return;
      }
      q = [[f, n.bindType || s]];
      if (!g && !n.noBubble && !p.isWindow(f)) {
        r = n.delegateType || s, k = $.test(r + s) ? f : f.parentNode;
        for (l = f; k; k = k.parentNode) {
          q.push([k, r]), l = k;
        }
        l === (f.ownerDocument || e) && q.push([l.defaultView || l.parentWindow || a, r]);
      }
      for (j = 0; j < q.length && !c.isPropagationStopped(); j++) {
        k = q[j][0], c.type = q[j][1], o = (p._data(k, 'events') || {})[c.type] && p._data(k, 'handle'), o && o.apply(k, d), o = m && k[m], o && p.acceptData(k) && o.apply && o.apply(k, d) === !1 && c.preventDefault();
      }
      return c.type = s, !g && !c.isDefaultPrevented() && (!n._default || n._default.apply(f.ownerDocument, d) === !1) && (s !== 'click' || !p.nodeName(f, 'a')) && p.acceptData(f) && m && f[s] && (s !== 'focus' && s !== 'blur' || c.target.offsetWidth !== 0) && !p.isWindow(f) && (l = f[m], l && (f[m] = null), p.event.triggered = s, f[s](), p.event.triggered = b, l && (f[m] = l)), c.result;
    }
    return;
  }, dispatch:function(c) {
    c = p.event.fix(c || a.event);
    var d, e, f, g, h, i, j, l, m, n, o = (p._data(this, 'events') || {})[c.type] || [], q = o.delegateCount, r = k.call(arguments), s = !c.exclusive && !c.namespace, t = p.event.special[c.type] || {}, u = [];
    r[0] = c, c.delegateTarget = this;
    if (t.preDispatch && t.preDispatch.call(this, c) === !1) {
      return;
    }
    if (q && (!c.button || c.type !== 'click')) {
      for (f = c.target; f != this; f = f.parentNode || this) {
        if (f.disabled !== !0 || c.type !== 'click') {
          h = {}, j = [];
          for (d = 0; d < q; d++) {
            l = o[d], m = l.selector, h[m] === b && (h[m] = l.needsContext ? p(m, this).index(f) >= 0 : p.find(m, this, null, [f]).length), h[m] && j.push(l);
          }
          j.length && u.push({elem:f, matches:j});
        }
      }
    }
    o.length > q && u.push({elem:this, matches:o.slice(q)});
    for (d = 0; d < u.length && !c.isPropagationStopped(); d++) {
      i = u[d], c.currentTarget = i.elem;
      for (e = 0; e < i.matches.length && !c.isImmediatePropagationStopped(); e++) {
        l = i.matches[e];
        if (s || !c.namespace && !l.namespace || c.namespace_re && c.namespace_re.test(l.namespace)) {
          c.data = l.data, c.handleObj = l, g = ((p.event.special[l.origType] || {}).handle || l.handler).apply(i.elem, r), g !== b && (c.result = g, g === !1 && (c.preventDefault(), c.stopPropagation()));
        }
      }
    }
    return t.postDispatch && t.postDispatch.call(this, c), c.result;
  }, props:'attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which'.split(' '), fixHooks:{}, keyHooks:{props:'char charCode key keyCode'.split(' '), filter:function(a, b) {
    return a.which == null && (a.which = b.charCode != null ? b.charCode : b.keyCode), a;
  }}, mouseHooks:{props:'button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement'.split(' '), filter:function(a, c) {
    var d, f, g, h = c.button, i = c.fromElement;
    return a.pageX == null && c.clientX != null && (d = a.target.ownerDocument || e, f = d.documentElement, g = d.body, a.pageX = c.clientX + (f && f.scrollLeft || g && g.scrollLeft || 0) - (f && f.clientLeft || g && g.clientLeft || 0), a.pageY = c.clientY + (f && f.scrollTop || g && g.scrollTop || 0) - (f && f.clientTop || g && g.clientTop || 0)), !a.relatedTarget && i && (a.relatedTarget = i === a.target ? c.toElement : i), !a.which && h !== b && (a.which = h & 1 ? 1 : h & 2 ? 3 : h & 4 ? 2 : 0), 
    a;
  }}, fix:function(a) {
    if (a[p.expando]) {
      return a;
    }
    var b, c, d = a, f = p.event.fixHooks[a.type] || {}, g = f.props ? this.props.concat(f.props) : this.props;
    a = p.Event(d);
    for (b = g.length; b;) {
      c = g[--b], a[c] = d[c];
    }
    return a.target || (a.target = d.srcElement || e), a.target.nodeType === 3 && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, f.filter ? f.filter(a, d) : a;
  }, special:{load:{noBubble:!0}, focus:{delegateType:'focusin'}, blur:{delegateType:'focusout'}, beforeunload:{setup:function(a, b, c) {
    p.isWindow(this) && (this.onbeforeunload = c);
  }, teardown:function(a, b) {
    this.onbeforeunload === b && (this.onbeforeunload = null);
  }}}, simulate:function(a, b, c, d) {
    var e = p.extend(new p.Event, c, {type:a, isSimulated:!0, originalEvent:{}});
    d ? p.event.trigger(e, null, b) : p.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault();
  }}, p.event.handle = p.event.dispatch, p.removeEvent = e.removeEventListener ? function(a, b, c) {
    a.removeEventListener && a.removeEventListener(b, c, !1);
  } : function(a, b, c) {
    var d = 'on' + b;
    a.detachEvent && (typeof a[d] == 'undefined' && (a[d] = null), a.detachEvent(d, c));
  }, p.Event = function(a, b) {
    if (this instanceof p.Event) {
      a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? bb : ba) : this.type = a, b && p.extend(this, b), this.timeStamp = a && a.timeStamp || p.now(), this[p.expando] = !0;
    } else {
      return new p.Event(a, b);
    }
  }, p.Event.prototype = {preventDefault:function() {
    this.isDefaultPrevented = bb;
    var a = this.originalEvent;
    if (!a) {
      return;
    }
    a.preventDefault ? a.preventDefault() : a.returnValue = !1;
  }, stopPropagation:function() {
    this.isPropagationStopped = bb;
    var a = this.originalEvent;
    if (!a) {
      return;
    }
    a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0;
  }, stopImmediatePropagation:function() {
    this.isImmediatePropagationStopped = bb, this.stopPropagation();
  }, isDefaultPrevented:ba, isPropagationStopped:ba, isImmediatePropagationStopped:ba}, p.each({mouseenter:'mouseover', mouseleave:'mouseout'}, function(a, b) {
    p.event.special[a] = {delegateType:b, bindType:b, handle:function(a) {
      var c, d = this, e = a.relatedTarget, f = a.handleObj, g = f.selector;
      if (!e || e !== d && !p.contains(d, e)) {
        a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b;
      }
      return c;
    }};
  }), p.support.submitBubbles || (p.event.special.submit = {setup:function() {
    if (p.nodeName(this, 'form')) {
      return !1;
    }
    p.event.add(this, 'click._submit keypress._submit', function(a) {
      var c = a.target, d = p.nodeName(c, 'input') || p.nodeName(c, 'button') ? c.form : b;
      d && !p._data(d, '_submit_attached') && (p.event.add(d, 'submit._submit', function(a) {
        a._submit_bubble = !0;
      }), p._data(d, '_submit_attached', !0));
    });
  }, postDispatch:function(a) {
    a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && p.event.simulate('submit', this.parentNode, a, !0));
  }, teardown:function() {
    if (p.nodeName(this, 'form')) {
      return !1;
    }
    p.event.remove(this, '._submit');
  }}), p.support.changeBubbles || (p.event.special.change = {setup:function() {
    if (V.test(this.nodeName)) {
      if (this.type === 'checkbox' || this.type === 'radio') {
        p.event.add(this, 'propertychange._change', function(a) {
          a.originalEvent.propertyName === 'checked' && (this._just_changed = !0);
        }), p.event.add(this, 'click._change', function(a) {
          this._just_changed && !a.isTrigger && (this._just_changed = !1), p.event.simulate('change', this, a, !0);
        });
      }
      return !1;
    }
    p.event.add(this, 'beforeactivate._change', function(a) {
      var b = a.target;
      V.test(b.nodeName) && !p._data(b, '_change_attached') && (p.event.add(b, 'change._change', function(a) {
        this.parentNode && !a.isSimulated && !a.isTrigger && p.event.simulate('change', this.parentNode, a, !0);
      }), p._data(b, '_change_attached', !0));
    });
  }, handle:function(a) {
    var b = a.target;
    if (this !== b || a.isSimulated || a.isTrigger || b.type !== 'radio' && b.type !== 'checkbox') {
      return a.handleObj.handler.apply(this, arguments);
    }
  }, teardown:function() {
    return p.event.remove(this, '._change'), !V.test(this.nodeName);
  }}), p.support.focusinBubbles || p.each({focus:'focusin', blur:'focusout'}, function(a, b) {
    var c = 0, d = function(a) {
      p.event.simulate(b, a.target, p.event.fix(a), !0);
    };
    p.event.special[b] = {setup:function() {
      c++ === 0 && e.addEventListener(a, d, !0);
    }, teardown:function() {
      --c === 0 && e.removeEventListener(a, d, !0);
    }};
  }), p.fn.extend({on:function(a, c, d, e, f) {
    var g, h;
    if (typeof a == 'object') {
      typeof c != 'string' && (d = d || c, c = b);
      for (h in a) {
        this.on(h, c, d, a[h], f);
      }
      return this;
    }
    d == null && e == null ? (e = c, d = c = b) : e == null && (typeof c == 'string' ? (e = d, d = b) : (e = d, d = c, c = b));
    if (e === !1) {
      e = ba;
    } else {
      if (!e) {
        return this;
      }
    }
    return f === 1 && (g = e, e = function(a) {
      return p().off(a), g.apply(this, arguments);
    }, e.guid = g.guid || (g.guid = p.guid++)), this.each(function() {
      p.event.add(this, a, e, d, c);
    });
  }, one:function(a, b, c, d) {
    return this.on(a, b, c, d, 1);
  }, off:function(a, c, d) {
    var e, f;
    if (a && a.preventDefault && a.handleObj) {
      return e = a.handleObj, p(a.delegateTarget).off(e.namespace ? e.origType + '.' + e.namespace : e.origType, e.selector, e.handler), this;
    }
    if (typeof a == 'object') {
      for (f in a) {
        this.off(f, c, a[f]);
      }
      return this;
    }
    if (c === !1 || typeof c == 'function') {
      d = c, c = b;
    }
    return d === !1 && (d = ba), this.each(function() {
      p.event.remove(this, a, d, c);
    });
  }, bind:function(a, b, c) {
    return this.on(a, null, b, c);
  }, unbind:function(a, b) {
    return this.off(a, null, b);
  }, live:function(a, b, c) {
    return p(this.context).on(a, this.selector, b, c), this;
  }, die:function(a, b) {
    return p(this.context).off(a, this.selector || '**', b), this;
  }, delegate:function(a, b, c, d) {
    return this.on(b, a, c, d);
  }, undelegate:function(a, b, c) {
    return arguments.length === 1 ? this.off(a, '**') : this.off(b, a || '**', c);
  }, trigger:function(a, b) {
    return this.each(function() {
      p.event.trigger(a, b, this);
    });
  }, triggerHandler:function(a, b) {
    if (this[0]) {
      return p.event.trigger(a, b, this[0], !0);
    }
  }, toggle:function(a) {
    var b = arguments, c = a.guid || p.guid++, d = 0, e = function(c) {
      var e = (p._data(this, 'lastToggle' + a.guid) || 0) % d;
      return p._data(this, 'lastToggle' + a.guid, e + 1), c.preventDefault(), b[e].apply(this, arguments) || !1;
    };
    e.guid = c;
    while (d < b.length) {
      b[d++].guid = c;
    }
    return this.click(e);
  }, hover:function(a, b) {
    return this.mouseenter(a).mouseleave(b || a);
  }}), p.each('blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu'.split(' '), function(a, b) {
    p.fn[b] = function(a, c) {
      return c == null && (c = a, a = null), arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b);
    }, Y.test(b) && (p.event.fixHooks[b] = p.event.keyHooks), Z.test(b) && (p.event.fixHooks[b] = p.event.mouseHooks);
  }), function(a, b) {
    function bc(a, b, c, d) {
      c = c || [], b = b || r;
      var e, f, i, j, k = b.nodeType;
      if (!a || typeof a != 'string') {
        return c;
      }
      if (k !== 1 && k !== 9) {
        return [];
      }
      i = g(b);
      if (!i && !d) {
        if (e = P.exec(a)) {
          if (j = e[1]) {
            if (k === 9) {
              f = b.getElementById(j);
              if (!f || !f.parentNode) {
                return c;
              }
              if (f.id === j) {
                return c.push(f), c;
              }
            } else {
              if (b.ownerDocument && (f = b.ownerDocument.getElementById(j)) && h(b, f) && f.id === j) {
                return c.push(f), c;
              }
            }
          } else {
            if (e[2]) {
              return w.apply(c, x.call(b.getElementsByTagName(a), 0)), c;
            }
            if ((j = e[3]) && _ && b.getElementsByClassName) {
              return w.apply(c, x.call(b.getElementsByClassName(j), 0)), c;
            }
          }
        }
      }
      return bp(a.replace(L, '$1'), b, c, d, i);
    }
    function bd(a) {
      return function(b) {
        var c = b.nodeName.toLowerCase();
        return c === 'input' && b.type === a;
      };
    }
    function be(a) {
      return function(b) {
        var c = b.nodeName.toLowerCase();
        return (c === 'input' || c === 'button') && b.type === a;
      };
    }
    function bf(a) {
      return z(function(b) {
        return b = +b, z(function(c, d) {
          var e, f = a([], c.length, b), g = f.length;
          while (g--) {
            c[e = f[g]] && (c[e] = !(d[e] = c[e]));
          }
        });
      });
    }
    function bg(a, b, c) {
      if (a === b) {
        return c;
      }
      var d = a.nextSibling;
      while (d) {
        if (d === b) {
          return -1;
        }
        d = d.nextSibling;
      }
      return 1;
    }
    function bh(a, b) {
      var c, d, f, g, h, i, j, k = C[o][a];
      if (k) {
        return b ? 0 : k.slice(0);
      }
      h = a, i = [], j = e.preFilter;
      while (h) {
        if (!c || (d = M.exec(h))) {
          d && (h = h.slice(d[0].length)), i.push(f = []);
        }
        c = !1;
        if (d = N.exec(h)) {
          f.push(c = new q(d.shift())), h = h.slice(c.length), c.type = d[0].replace(L, ' ');
        }
        for (g in e.filter) {
          (d = W[g].exec(h)) && (!j[g] || (d = j[g](d, r, !0))) && (f.push(c = new q(d.shift())), h = h.slice(c.length), c.type = g, c.matches = d);
        }
        if (!c) {
          break;
        }
      }
      return b ? h.length : h ? bc.error(a) : C(a, i).slice(0);
    }
    function bi(a, b, d) {
      var e = b.dir, f = d && b.dir === 'parentNode', g = u++;
      return b.first ? function(b, c, d) {
        while (b = b[e]) {
          if (f || b.nodeType === 1) {
            return a(b, c, d);
          }
        }
      } : function(b, d, h) {
        if (!h) {
          var i, j = t + ' ' + g + ' ', k = j + c;
          while (b = b[e]) {
            if (f || b.nodeType === 1) {
              if ((i = b[o]) === k) {
                return b.sizset;
              }
              if (typeof i == 'string' && i.indexOf(j) === 0) {
                if (b.sizset) {
                  return b;
                }
              } else {
                b[o] = k;
                if (a(b, d, h)) {
                  return b.sizset = !0, b;
                }
                b.sizset = !1;
              }
            }
          }
        } else {
          while (b = b[e]) {
            if (f || b.nodeType === 1) {
              if (a(b, d, h)) {
                return b;
              }
            }
          }
        }
      };
    }
    function bj(a) {
      return a.length > 1 ? function(b, c, d) {
        var e = a.length;
        while (e--) {
          if (!a[e](b, c, d)) {
            return !1;
          }
        }
        return !0;
      } : a[0];
    }
    function bk(a, b, c, d, e) {
      var f, g = [], h = 0, i = a.length, j = b != null;
      for (; h < i; h++) {
        if (f = a[h]) {
          if (!c || c(f, d, e)) {
            g.push(f), j && b.push(h);
          }
        }
      }
      return g;
    }
    function bl(a, b, c, d, e, f) {
      return d && !d[o] && (d = bl(d)), e && !e[o] && (e = bl(e, f)), z(function(f, g, h, i) {
        if (f && e) {
          return;
        }
        var j, k, l, m = [], n = [], o = g.length, p = f || bo(b || '*', h.nodeType ? [h] : h, [], f), q = a && (f || !b) ? bk(p, m, a, h, i) : p, r = c ? e || (f ? a : o || d) ? [] : g : q;
        c && c(q, r, h, i);
        if (d) {
          l = bk(r, n), d(l, [], h, i), j = l.length;
          while (j--) {
            if (k = l[j]) {
              r[n[j]] = !(q[n[j]] = k);
            }
          }
        }
        if (f) {
          j = a && r.length;
          while (j--) {
            if (k = r[j]) {
              f[m[j]] = !(g[m[j]] = k);
            }
          }
        } else {
          r = bk(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : w.apply(g, r);
        }
      });
    }
    function bm(a) {
      var b, c, d, f = a.length, g = e.relative[a[0].type], h = g || e.relative[' '], i = g ? 1 : 0, j = bi(function(a) {
        return a === b;
      }, h, !0), k = bi(function(a) {
        return y.call(b, a) > -1;
      }, h, !0), m = [function(a, c, d) {
        return !g && (d || c !== l) || ((b = c).nodeType ? j(a, c, d) : k(a, c, d));
      }];
      for (; i < f; i++) {
        if (c = e.relative[a[i].type]) {
          m = [bi(bj(m), c)];
        } else {
          c = e.filter[a[i].type].apply(null, a[i].matches);
          if (c[o]) {
            d = ++i;
            for (; d < f; d++) {
              if (e.relative[a[d].type]) {
                break;
              }
            }
            return bl(i > 1 && bj(m), i > 1 && a.slice(0, i - 1).join('').replace(L, '$1'), c, i < d && bm(a.slice(i, d)), d < f && bm(a = a.slice(d)), d < f && a.join(''));
          }
          m.push(c);
        }
      }
      return bj(m);
    }
    function bn(a, b) {
      var d = b.length > 0, f = a.length > 0, g = function(h, i, j, k, m) {
        var n, o, p, q = [], s = 0, u = '0', x = h && [], y = m != null, z = l, A = h || f && e.find.TAG('*', m && i.parentNode || i), B = t += z == null ? 1 : Math.E;
        y && (l = i !== r && i, c = g.el);
        for (; (n = A[u]) != null; u++) {
          if (f && n) {
            for (o = 0; p = a[o]; o++) {
              if (p(n, i, j)) {
                k.push(n);
                break;
              }
            }
            y && (t = B, c = ++g.el);
          }
          d && ((n = !p && n) && s--, h && x.push(n));
        }
        s += u;
        if (d && u !== s) {
          for (o = 0; p = b[o]; o++) {
            p(x, q, i, j);
          }
          if (h) {
            if (s > 0) {
              while (u--) {
                !x[u] && !q[u] && (q[u] = v.call(k));
              }
            }
            q = bk(q);
          }
          w.apply(k, q), y && !h && q.length > 0 && s + b.length > 1 && bc.uniqueSort(k);
        }
        return y && (t = B, l = z), x;
      };
      return g.el = 0, d ? z(g) : g;
    }
    function bo(a, b, c, d) {
      var e = 0, f = b.length;
      for (; e < f; e++) {
        bc(a, b[e], c, d);
      }
      return c;
    }
    function bp(a, b, c, d, f) {
      var g, h, j, k, l, m = bh(a), n = m.length;
      if (!d && m.length === 1) {
        h = m[0] = m[0].slice(0);
        if (h.length > 2 && (j = h[0]).type === 'ID' && b.nodeType === 9 && !f && e.relative[h[1].type]) {
          b = e.find.ID(j.matches[0].replace(V, ''), b, f)[0];
          if (!b) {
            return c;
          }
          a = a.slice(h.shift().length);
        }
        for (g = W.POS.test(a) ? -1 : h.length - 1; g >= 0; g--) {
          j = h[g];
          if (e.relative[k = j.type]) {
            break;
          }
          if (l = e.find[k]) {
            if (d = l(j.matches[0].replace(V, ''), R.test(h[0].type) && b.parentNode || b, f)) {
              h.splice(g, 1), a = d.length && h.join('');
              if (!a) {
                return w.apply(c, x.call(d, 0)), c;
              }
              break;
            }
          }
        }
      }
      return i(a, m)(d, b, f, c, R.test(a)), c;
    }
    function bq() {
    }
    var c, d, e, f, g, h, i, j, k, l, m = !0, n = 'undefined', o = ('sizcache' + Math.random()).replace('.', ''), q = String, r = a.document, s = r.documentElement, t = 0, u = 0, v = [].pop, w = [].push, x = [].slice, y = [].indexOf || function(a) {
      var b = 0, c = this.length;
      for (; b < c; b++) {
        if (this[b] === a) {
          return b;
        }
      }
      return -1;
    }, z = function(a, b) {
      return a[o] = b == null || b, a;
    }, A = function() {
      var a = {}, b = [];
      return z(function(c, d) {
        return b.push(c) > e.cacheLength && delete a[b.shift()], a[c] = d;
      }, a);
    }, B = A(), C = A(), D = A(), E = '[\\x20\\t\\r\\n\\f]', F = '(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+', G = F.replace('w', 'w#'), H = '([*^$|!~]?\x3d)', I = '\\[' + E + '*(' + F + ')' + E + '*(?:' + H + E + '*(?:([\'"])((?:\\\\.|[^\\\\])*?)\\3|(' + G + ')|)|)' + E + '*\\]', J = ':(' + F + ')(?:\\((?:([\'"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:' + I + ')|[^:]|\\\\.)*|.*))\\)|)', K = ':(even|odd|eq|gt|lt|nth|first|last)(?:\\(' + E + '*((?:-\\d)?\\d*)' + E + '*\\)|)(?\x3d[^-]|$)', L = new RegExp('^' + 
    E + '+|((?:^|[^\\\\])(?:\\\\.)*)' + E + '+$', 'g'), M = new RegExp('^' + E + '*,' + E + '*'), N = new RegExp('^' + E + '*([\\x20\\t\\r\\n\\f\x3e+~])' + E + '*'), O = new RegExp(J), P = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/, Q = /^:not/, R = /[\x20\t\r\n\f]*[+~]/, S = /:not\($/, T = /h\d/i, U = /input|select|textarea|button/i, V = /\\(?!\\)/g, W = {ID:new RegExp('^#(' + F + ')'), CLASS:new RegExp('^\\.(' + F + ')'), NAME:new RegExp('^\\[name\x3d[\'"]?(' + F + ')[\'"]?\\]'), TAG:new RegExp('^(' + 
    F.replace('w', 'w*') + ')'), ATTR:new RegExp('^' + I), PSEUDO:new RegExp('^' + J), POS:new RegExp(K, 'i'), CHILD:new RegExp('^:(only|nth|first|last)-child(?:\\(' + E + '*(even|odd|(([+-]|)(\\d*)n|)' + E + '*(?:([+-]|)' + E + '*(\\d+)|))' + E + '*\\)|)', 'i'), needsContext:new RegExp('^' + E + '*[\x3e+~]|' + K, 'i')}, X = function(a) {
      var b = r.createElement('div');
      try {
        return a(b);
      } catch (c$10) {
        return !1;
      } finally {
        b = null;
      }
    }, Y = X(function(a) {
      return a.appendChild(r.createComment('')), !a.getElementsByTagName('*').length;
    }), Z = X(function(a) {
      return a.innerHTML = "\x3ca href\x3d'#'\x3e\x3c/a\x3e", a.firstChild && typeof a.firstChild.getAttribute !== n && a.firstChild.getAttribute('href') === '#';
    }), $ = X(function(a) {
      a.innerHTML = '\x3cselect\x3e\x3c/select\x3e';
      var b = typeof a.lastChild.getAttribute('multiple');
      return b !== 'boolean' && b !== 'string';
    }), _ = X(function(a) {
      return a.innerHTML = "\x3cdiv class\x3d'hidden e'\x3e\x3c/div\x3e\x3cdiv class\x3d'hidden'\x3e\x3c/div\x3e", !a.getElementsByClassName || !a.getElementsByClassName('e').length ? !1 : (a.lastChild.className = 'e', a.getElementsByClassName('e').length === 2);
    }), ba = X(function(a) {
      a.id = o + 0, a.innerHTML = "\x3ca name\x3d'" + o + "'\x3e\x3c/a\x3e\x3cdiv name\x3d'" + o + "'\x3e\x3c/div\x3e", s.insertBefore(a, s.firstChild);
      var b = r.getElementsByName && r.getElementsByName(o).length === 2 + r.getElementsByName(o + 0).length;
      return d = !r.getElementById(o), s.removeChild(a), b;
    });
    try {
      x.call(s.childNodes, 0)[0].nodeType;
    } catch (bb$11) {
      x = function(a) {
        var b, c = [];
        for (; b = this[a]; a++) {
          c.push(b);
        }
        return c;
      };
    }
    bc.matches = function(a, b) {
      return bc(a, null, null, b);
    }, bc.matchesSelector = function(a, b) {
      return bc(b, null, null, [a]).length > 0;
    }, f = bc.getText = function(a) {
      var b, c = '', d = 0, e = a.nodeType;
      if (e) {
        if (e === 1 || e === 9 || e === 11) {
          if (typeof a.textContent == 'string') {
            return a.textContent;
          }
          for (a = a.firstChild; a; a = a.nextSibling) {
            c += f(a);
          }
        } else {
          if (e === 3 || e === 4) {
            return a.nodeValue;
          }
        }
      } else {
        for (; b = a[d]; d++) {
          c += f(b);
        }
      }
      return c;
    }, g = bc.isXML = function(a) {
      var b = a && (a.ownerDocument || a).documentElement;
      return b ? b.nodeName !== 'HTML' : !1;
    }, h = bc.contains = s.contains ? function(a, b) {
      var c = a.nodeType === 9 ? a.documentElement : a, d = b && b.parentNode;
      return a === d || !!(d && d.nodeType === 1 && c.contains && c.contains(d));
    } : s.compareDocumentPosition ? function(a, b) {
      return b && !!(a.compareDocumentPosition(b) & 16);
    } : function(a, b) {
      while (b = b.parentNode) {
        if (b === a) {
          return !0;
        }
      }
      return !1;
    }, bc.attr = function(a, b) {
      var c, d = g(a);
      return d || (b = b.toLowerCase()), (c = e.attrHandle[b]) ? c(a) : d || $ ? a.getAttribute(b) : (c = a.getAttributeNode(b), c ? typeof a[b] == 'boolean' ? a[b] ? b : null : c.specified ? c.value : null : null);
    }, e = bc.selectors = {cacheLength:50, createPseudo:z, match:W, attrHandle:Z ? {} : {href:function(a) {
      return a.getAttribute('href', 2);
    }, type:function(a) {
      return a.getAttribute('type');
    }}, find:{ID:d ? function(a, b, c) {
      if (typeof b.getElementById !== n && !c) {
        var d = b.getElementById(a);
        return d && d.parentNode ? [d] : [];
      }
    } : function(a, c, d) {
      if (typeof c.getElementById !== n && !d) {
        var e = c.getElementById(a);
        return e ? e.id === a || typeof e.getAttributeNode !== n && e.getAttributeNode('id').value === a ? [e] : b : [];
      }
    }, TAG:Y ? function(a, b) {
      if (typeof b.getElementsByTagName !== n) {
        return b.getElementsByTagName(a);
      }
    } : function(a, b) {
      var c = b.getElementsByTagName(a);
      if (a === '*') {
        var d, e = [], f = 0;
        for (; d = c[f]; f++) {
          d.nodeType === 1 && e.push(d);
        }
        return e;
      }
      return c;
    }, NAME:ba && function(a, b) {
      if (typeof b.getElementsByName !== n) {
        return b.getElementsByName(name);
      }
    }, CLASS:_ && function(a, b, c) {
      if (typeof b.getElementsByClassName !== n && !c) {
        return b.getElementsByClassName(a);
      }
    }}, relative:{'\x3e':{dir:'parentNode', first:!0}, ' ':{dir:'parentNode'}, '+':{dir:'previousSibling', first:!0}, '~':{dir:'previousSibling'}}, preFilter:{ATTR:function(a) {
      return a[1] = a[1].replace(V, ''), a[3] = (a[4] || a[5] || '').replace(V, ''), a[2] === '~\x3d' && (a[3] = ' ' + a[3] + ' '), a.slice(0, 4);
    }, CHILD:function(a) {
      return a[1] = a[1].toLowerCase(), a[1] === 'nth' ? (a[2] || bc.error(a[0]), a[3] = +(a[3] ? a[4] + (a[5] || 1) : 2 * (a[2] === 'even' || a[2] === 'odd')), a[4] = +(a[6] + a[7] || a[2] === 'odd')) : a[2] && bc.error(a[0]), a;
    }, PSEUDO:function(a) {
      var b, c;
      if (W.CHILD.test(a[0])) {
        return null;
      }
      if (a[3]) {
        a[2] = a[3];
      } else {
        if (b = a[4]) {
          O.test(b) && (c = bh(b, !0)) && (c = b.indexOf(')', b.length - c) - b.length) && (b = b.slice(0, c), a[0] = a[0].slice(0, c)), a[2] = b;
        }
      }
      return a.slice(0, 3);
    }}, filter:{ID:d ? function(a) {
      return a = a.replace(V, ''), function(b) {
        return b.getAttribute('id') === a;
      };
    } : function(a) {
      return a = a.replace(V, ''), function(b) {
        var c = typeof b.getAttributeNode !== n && b.getAttributeNode('id');
        return c && c.value === a;
      };
    }, TAG:function(a) {
      return a === '*' ? function() {
        return !0;
      } : (a = a.replace(V, '').toLowerCase(), function(b) {
        return b.nodeName && b.nodeName.toLowerCase() === a;
      });
    }, CLASS:function(a) {
      var b = B[o][a];
      return b || (b = B(a, new RegExp('(^|' + E + ')' + a + '(' + E + '|$)'))), function(a) {
        return b.test(a.className || typeof a.getAttribute !== n && a.getAttribute('class') || '');
      };
    }, ATTR:function(a, b, c) {
      return function(d, e) {
        var f = bc.attr(d, a);
        return f == null ? b === '!\x3d' : b ? (f += '', b === '\x3d' ? f === c : b === '!\x3d' ? f !== c : b === '^\x3d' ? c && f.indexOf(c) === 0 : b === '*\x3d' ? c && f.indexOf(c) > -1 : b === '$\x3d' ? c && f.substr(f.length - c.length) === c : b === '~\x3d' ? (' ' + f + ' ').indexOf(c) > -1 : b === '|\x3d' ? f === c || f.substr(0, c.length + 1) === c + '-' : !1) : !0;
      };
    }, CHILD:function(a, b, c, d) {
      return a === 'nth' ? function(a) {
        var b, e, f = a.parentNode;
        if (c === 1 && d === 0) {
          return !0;
        }
        if (f) {
          e = 0;
          for (b = f.firstChild; b; b = b.nextSibling) {
            if (b.nodeType === 1) {
              e++;
              if (a === b) {
                break;
              }
            }
          }
        }
        return e -= d, e === c || e % c === 0 && e / c >= 0;
      } : function(b) {
        var c = b;
        switch(a) {
          case 'only':
          case 'first':
            while (c = c.previousSibling) {
              if (c.nodeType === 1) {
                return !1;
              }
            }
            if (a === 'first') {
              return !0;
            }
            c = b;
          case 'last':
            while (c = c.nextSibling) {
              if (c.nodeType === 1) {
                return !1;
              }
            }
            return !0;
        }
      };
    }, PSEUDO:function(a, b) {
      var c, d = e.pseudos[a] || e.setFilters[a.toLowerCase()] || bc.error('unsupported pseudo: ' + a);
      return d[o] ? d(b) : d.length > 1 ? (c = [a, a, '', b], e.setFilters.hasOwnProperty(a.toLowerCase()) ? z(function(a, c) {
        var e, f = d(a, b), g = f.length;
        while (g--) {
          e = y.call(a, f[g]), a[e] = !(c[e] = f[g]);
        }
      }) : function(a) {
        return d(a, 0, c);
      }) : d;
    }}, pseudos:{not:z(function(a) {
      var b = [], c = [], d = i(a.replace(L, '$1'));
      return d[o] ? z(function(a, b, c, e) {
        var f, g = d(a, null, e, []), h = a.length;
        while (h--) {
          if (f = g[h]) {
            a[h] = !(b[h] = f);
          }
        }
      }) : function(a, e, f) {
        return b[0] = a, d(b, null, f, c), !c.pop();
      };
    }), has:z(function(a) {
      return function(b) {
        return bc(a, b).length > 0;
      };
    }), contains:z(function(a) {
      return function(b) {
        return (b.textContent || b.innerText || f(b)).indexOf(a) > -1;
      };
    }), enabled:function(a) {
      return a.disabled === !1;
    }, disabled:function(a) {
      return a.disabled === !0;
    }, checked:function(a) {
      var b = a.nodeName.toLowerCase();
      return b === 'input' && !!a.checked || b === 'option' && !!a.selected;
    }, selected:function(a) {
      return a.parentNode && a.parentNode.selectedIndex, a.selected === !0;
    }, parent:function(a) {
      return !e.pseudos.empty(a);
    }, empty:function(a) {
      var b;
      a = a.firstChild;
      while (a) {
        if (a.nodeName > '@' || (b = a.nodeType) === 3 || b === 4) {
          return !1;
        }
        a = a.nextSibling;
      }
      return !0;
    }, header:function(a) {
      return T.test(a.nodeName);
    }, text:function(a) {
      var b, c;
      return a.nodeName.toLowerCase() === 'input' && (b = a.type) === 'text' && ((c = a.getAttribute('type')) == null || c.toLowerCase() === b);
    }, radio:bd('radio'), checkbox:bd('checkbox'), file:bd('file'), password:bd('password'), image:bd('image'), submit:be('submit'), reset:be('reset'), button:function(a) {
      var b = a.nodeName.toLowerCase();
      return b === 'input' && a.type === 'button' || b === 'button';
    }, input:function(a) {
      return U.test(a.nodeName);
    }, focus:function(a) {
      var b = a.ownerDocument;
      return a === b.activeElement && (!b.hasFocus || b.hasFocus()) && (!!a.type || !!a.href);
    }, active:function(a) {
      return a === a.ownerDocument.activeElement;
    }, first:bf(function(a, b, c) {
      return [0];
    }), last:bf(function(a, b, c) {
      return [b - 1];
    }), eq:bf(function(a, b, c) {
      return [c < 0 ? c + b : c];
    }), even:bf(function(a, b, c) {
      for (var d = 0; d < b; d += 2) {
        a.push(d);
      }
      return a;
    }), odd:bf(function(a, b, c) {
      for (var d = 1; d < b; d += 2) {
        a.push(d);
      }
      return a;
    }), lt:bf(function(a, b, c) {
      for (var d = c < 0 ? c + b : c; --d >= 0;) {
        a.push(d);
      }
      return a;
    }), gt:bf(function(a, b, c) {
      for (var d = c < 0 ? c + b : c; ++d < b;) {
        a.push(d);
      }
      return a;
    })}}, j = s.compareDocumentPosition ? function(a, b) {
      return a === b ? (k = !0, 0) : (!a.compareDocumentPosition || !b.compareDocumentPosition ? a.compareDocumentPosition : a.compareDocumentPosition(b) & 4) ? -1 : 1;
    } : function(a, b) {
      if (a === b) {
        return k = !0, 0;
      }
      if (a.sourceIndex && b.sourceIndex) {
        return a.sourceIndex - b.sourceIndex;
      }
      var c, d, e = [], f = [], g = a.parentNode, h = b.parentNode, i = g;
      if (g === h) {
        return bg(a, b);
      }
      if (!g) {
        return -1;
      }
      if (!h) {
        return 1;
      }
      while (i) {
        e.unshift(i), i = i.parentNode;
      }
      i = h;
      while (i) {
        f.unshift(i), i = i.parentNode;
      }
      c = e.length, d = f.length;
      for (var j = 0; j < c && j < d; j++) {
        if (e[j] !== f[j]) {
          return bg(e[j], f[j]);
        }
      }
      return j === c ? bg(a, f[j], -1) : bg(e[j], b, 1);
    }, [0, 0].sort(j), m = !k, bc.uniqueSort = function(a) {
      var b, c = 1;
      k = m, a.sort(j);
      if (k) {
        for (; b = a[c]; c++) {
          b === a[c - 1] && a.splice(c--, 1);
        }
      }
      return a;
    }, bc.error = function(a) {
      throw new Error('Syntax error, unrecognized expression: ' + a);
    }, i = bc.compile = function(a, b) {
      var c, d = [], e = [], f = D[o][a];
      if (!f) {
        b || (b = bh(a)), c = b.length;
        while (c--) {
          f = bm(b[c]), f[o] ? d.push(f) : e.push(f);
        }
        f = D(a, bn(e, d));
      }
      return f;
    }, r.querySelectorAll && function() {
      var a, b = bp, c = /'|\\/g, d = /=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g, e = [':focus'], f = [':active', ':focus'], h = s.matchesSelector || s.mozMatchesSelector || s.webkitMatchesSelector || s.oMatchesSelector || s.msMatchesSelector;
      X(function(a) {
        a.innerHTML = "\x3cselect\x3e\x3coption selected\x3d''\x3e\x3c/option\x3e\x3c/select\x3e", a.querySelectorAll('[selected]').length || e.push('\\[' + E + '*(?:checked|disabled|ismap|multiple|readonly|selected|value)'), a.querySelectorAll(':checked').length || e.push(':checked');
      }), X(function(a) {
        a.innerHTML = "\x3cp test\x3d''\x3e\x3c/p\x3e", a.querySelectorAll("[test^\x3d'']").length && e.push('[*^$]\x3d' + E + '*(?:""|\'\')'), a.innerHTML = "\x3cinput type\x3d'hidden'/\x3e", a.querySelectorAll(':enabled').length || e.push(':enabled', ':disabled');
      }), e = new RegExp(e.join('|')), bp = function(a, d, f, g, h) {
        if (!g && !h && (!e || !e.test(a))) {
          var i, j, k = !0, l = o, m = d, n = d.nodeType === 9 && a;
          if (d.nodeType === 1 && d.nodeName.toLowerCase() !== 'object') {
            i = bh(a), (k = d.getAttribute('id')) ? l = k.replace(c, '\\$\x26') : d.setAttribute('id', l), l = "[id\x3d'" + l + "'] ", j = i.length;
            while (j--) {
              i[j] = l + i[j].join('');
            }
            m = R.test(a) && d.parentNode || d, n = i.join(',');
          }
          if (n) {
            try {
              return w.apply(f, x.call(m.querySelectorAll(n), 0)), f;
            } catch (p$12) {
            } finally {
              k || d.removeAttribute('id');
            }
          }
        }
        return b(a, d, f, g, h);
      }, h && (X(function(b) {
        a = h.call(b, 'div');
        try {
          h.call(b, "[test!\x3d'']:sizzle"), f.push('!\x3d', J);
        } catch (c$13) {
        }
      }), f = new RegExp(f.join('|')), bc.matchesSelector = function(b, c) {
        c = c.replace(d, "\x3d'$1']");
        if (!g(b) && !f.test(c) && (!e || !e.test(c))) {
          try {
            var i = h.call(b, c);
            if (i || a || b.document && b.document.nodeType !== 11) {
              return i;
            }
          } catch (j$14) {
          }
        }
        return bc(c, null, null, [b]).length > 0;
      });
    }(), e.pseudos.nth = e.pseudos.eq, e.filters = bq.prototype = e.pseudos, e.setFilters = new bq, bc.attr = p.attr, p.find = bc, p.expr = bc.selectors, p.expr[':'] = p.expr.pseudos, p.unique = bc.uniqueSort, p.text = bc.getText, p.isXMLDoc = bc.isXML, p.contains = bc.contains;
  }(a);
  var bc = /Until$/, bd = /^(?:parents|prev(?:Until|All))/, be = /^.[^:#\[\.,]*$/, bf = p.expr.match.needsContext, bg = {children:!0, contents:!0, next:!0, prev:!0};
  p.fn.extend({find:function(a) {
    var b, c, d, e, f, g, h = this;
    if (typeof a != 'string') {
      return p(a).filter(function() {
        for (b = 0, c = h.length; b < c; b++) {
          if (p.contains(h[b], this)) {
            return !0;
          }
        }
      });
    }
    g = this.pushStack('', 'find', a);
    for (b = 0, c = this.length; b < c; b++) {
      d = g.length, p.find(a, this[b], g);
      if (b > 0) {
        for (e = d; e < g.length; e++) {
          for (f = 0; f < d; f++) {
            if (g[f] === g[e]) {
              g.splice(e--, 1);
              break;
            }
          }
        }
      }
    }
    return g;
  }, has:function(a) {
    var b, c = p(a, this), d = c.length;
    return this.filter(function() {
      for (b = 0; b < d; b++) {
        if (p.contains(this, c[b])) {
          return !0;
        }
      }
    });
  }, not:function(a) {
    return this.pushStack(bj(this, a, !1), 'not', a);
  }, filter:function(a) {
    return this.pushStack(bj(this, a, !0), 'filter', a);
  }, is:function(a) {
    return !!a && (typeof a == 'string' ? bf.test(a) ? p(a, this.context).index(this[0]) >= 0 : p.filter(a, this).length > 0 : this.filter(a).length > 0);
  }, closest:function(a, b) {
    var c, d = 0, e = this.length, f = [], g = bf.test(a) || typeof a != 'string' ? p(a, b || this.context) : 0;
    for (; d < e; d++) {
      c = this[d];
      while (c && c.ownerDocument && c !== b && c.nodeType !== 11) {
        if (g ? g.index(c) > -1 : p.find.matchesSelector(c, a)) {
          f.push(c);
          break;
        }
        c = c.parentNode;
      }
    }
    return f = f.length > 1 ? p.unique(f) : f, this.pushStack(f, 'closest', a);
  }, index:function(a) {
    return a ? typeof a == 'string' ? p.inArray(this[0], p(a)) : p.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1;
  }, add:function(a, b) {
    var c = typeof a == 'string' ? p(a, b) : p.makeArray(a && a.nodeType ? [a] : a), d = p.merge(this.get(), c);
    return this.pushStack(bh(c[0]) || bh(d[0]) ? d : p.unique(d));
  }, addBack:function(a) {
    return this.add(a == null ? this.prevObject : this.prevObject.filter(a));
  }}), p.fn.andSelf = p.fn.addBack, p.each({parent:function(a) {
    var b = a.parentNode;
    return b && b.nodeType !== 11 ? b : null;
  }, parents:function(a) {
    return p.dir(a, 'parentNode');
  }, parentsUntil:function(a, b, c) {
    return p.dir(a, 'parentNode', c);
  }, next:function(a) {
    return bi(a, 'nextSibling');
  }, prev:function(a) {
    return bi(a, 'previousSibling');
  }, nextAll:function(a) {
    return p.dir(a, 'nextSibling');
  }, prevAll:function(a) {
    return p.dir(a, 'previousSibling');
  }, nextUntil:function(a, b, c) {
    return p.dir(a, 'nextSibling', c);
  }, prevUntil:function(a, b, c) {
    return p.dir(a, 'previousSibling', c);
  }, siblings:function(a) {
    return p.sibling((a.parentNode || {}).firstChild, a);
  }, children:function(a) {
    return p.sibling(a.firstChild);
  }, contents:function(a) {
    return p.nodeName(a, 'iframe') ? a.contentDocument || a.contentWindow.document : p.merge([], a.childNodes);
  }}, function(a, b) {
    p.fn[a] = function(c, d) {
      var e = p.map(this, b, c);
      return bc.test(a) || (d = c), d && typeof d == 'string' && (e = p.filter(d, e)), e = this.length > 1 && !bg[a] ? p.unique(e) : e, this.length > 1 && bd.test(a) && (e = e.reverse()), this.pushStack(e, a, k.call(arguments).join(','));
    };
  }), p.extend({filter:function(a, b, c) {
    return c && (a = ':not(' + a + ')'), b.length === 1 ? p.find.matchesSelector(b[0], a) ? [b[0]] : [] : p.find.matches(a, b);
  }, dir:function(a, c, d) {
    var e = [], f = a[c];
    while (f && f.nodeType !== 9 && (d === b || f.nodeType !== 1 || !p(f).is(d))) {
      f.nodeType === 1 && e.push(f), f = f[c];
    }
    return e;
  }, sibling:function(a, b) {
    var c = [];
    for (; a; a = a.nextSibling) {
      a.nodeType === 1 && a !== b && c.push(a);
    }
    return c;
  }});
  var bl = 'abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video', bm = / jQuery\d+="(?:null|\d+)"/g, bn = /^\s+/, bo = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, bp = /<([\w:]+)/, bq = /<tbody/i, br = /<|&#?\w+;/, bs = /<(?:script|style|link)/i, bt = /<(?:script|object|embed|option|style)/i, bu = new RegExp('\x3c(?:' + bl + ')[\\s/\x3e]', 'i'), bv = /^(?:checkbox|radio)$/, 
  bw = /checked\s*(?:[^=]|=\s*.checked.)/i, bx = /\/(java|ecma)script/i, by = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g, bz = {option:[1, "\x3cselect multiple\x3d'multiple'\x3e", '\x3c/select\x3e'], legend:[1, '\x3cfieldset\x3e', '\x3c/fieldset\x3e'], thead:[1, '\x3ctable\x3e', '\x3c/table\x3e'], tr:[2, '\x3ctable\x3e\x3ctbody\x3e', '\x3c/tbody\x3e\x3c/table\x3e'], td:[3, '\x3ctable\x3e\x3ctbody\x3e\x3ctr\x3e', '\x3c/tr\x3e\x3c/tbody\x3e\x3c/table\x3e'], col:[2, '\x3ctable\x3e\x3ctbody\x3e\x3c/tbody\x3e\x3ccolgroup\x3e', 
  '\x3c/colgroup\x3e\x3c/table\x3e'], area:[1, '\x3cmap\x3e', '\x3c/map\x3e'], _default:[0, '', '']}, bA = bk(e), bB = bA.appendChild(e.createElement('div'));
  bz.optgroup = bz.option, bz.tbody = bz.tfoot = bz.colgroup = bz.caption = bz.thead, bz.th = bz.td, p.support.htmlSerialize || (bz._default = [1, 'X\x3cdiv\x3e', '\x3c/div\x3e']), p.fn.extend({text:function(a) {
    return p.access(this, function(a) {
      return a === b ? p.text(this) : this.empty().append((this[0] && this[0].ownerDocument || e).createTextNode(a));
    }, null, a, arguments.length);
  }, wrapAll:function(a) {
    if (p.isFunction(a)) {
      return this.each(function(b) {
        p(this).wrapAll(a.call(this, b));
      });
    }
    if (this[0]) {
      var b = p(a, this[0].ownerDocument).eq(0).clone(!0);
      this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
        var a = this;
        while (a.firstChild && a.firstChild.nodeType === 1) {
          a = a.firstChild;
        }
        return a;
      }).append(this);
    }
    return this;
  }, wrapInner:function(a) {
    return p.isFunction(a) ? this.each(function(b) {
      p(this).wrapInner(a.call(this, b));
    }) : this.each(function() {
      var b = p(this), c = b.contents();
      c.length ? c.wrapAll(a) : b.append(a);
    });
  }, wrap:function(a) {
    var b = p.isFunction(a);
    return this.each(function(c) {
      p(this).wrapAll(b ? a.call(this, c) : a);
    });
  }, unwrap:function() {
    return this.parent().each(function() {
      p.nodeName(this, 'body') || p(this).replaceWith(this.childNodes);
    }).end();
  }, append:function() {
    return this.domManip(arguments, !0, function(a) {
      (this.nodeType === 1 || this.nodeType === 11) && this.appendChild(a);
    });
  }, prepend:function() {
    return this.domManip(arguments, !0, function(a) {
      (this.nodeType === 1 || this.nodeType === 11) && this.insertBefore(a, this.firstChild);
    });
  }, before:function() {
    if (!bh(this[0])) {
      return this.domManip(arguments, !1, function(a) {
        this.parentNode.insertBefore(a, this);
      });
    }
    if (arguments.length) {
      var a = p.clean(arguments);
      return this.pushStack(p.merge(a, this), 'before', this.selector);
    }
  }, after:function() {
    if (!bh(this[0])) {
      return this.domManip(arguments, !1, function(a) {
        this.parentNode.insertBefore(a, this.nextSibling);
      });
    }
    if (arguments.length) {
      var a = p.clean(arguments);
      return this.pushStack(p.merge(this, a), 'after', this.selector);
    }
  }, remove:function(a, b) {
    var c, d = 0;
    for (; (c = this[d]) != null; d++) {
      if (!a || p.filter(a, [c]).length) {
        !b && c.nodeType === 1 && (p.cleanData(c.getElementsByTagName('*')), p.cleanData([c])), c.parentNode && c.parentNode.removeChild(c);
      }
    }
    return this;
  }, empty:function() {
    var a, b = 0;
    for (; (a = this[b]) != null; b++) {
      a.nodeType === 1 && p.cleanData(a.getElementsByTagName('*'));
      while (a.firstChild) {
        a.removeChild(a.firstChild);
      }
    }
    return this;
  }, clone:function(a, b) {
    return a = a == null ? !1 : a, b = b == null ? a : b, this.map(function() {
      return p.clone(this, a, b);
    });
  }, html:function(a) {
    return p.access(this, function(a) {
      var c = this[0] || {}, d = 0, e = this.length;
      if (a === b) {
        return c.nodeType === 1 ? c.innerHTML.replace(bm, '') : b;
      }
      if (typeof a == 'string' && !bs.test(a) && (p.support.htmlSerialize || !bu.test(a)) && (p.support.leadingWhitespace || !bn.test(a)) && !bz[(bp.exec(a) || ['', ''])[1].toLowerCase()]) {
        a = a.replace(bo, '\x3c$1\x3e\x3c/$2\x3e');
        try {
          for (; d < e; d++) {
            c = this[d] || {}, c.nodeType === 1 && (p.cleanData(c.getElementsByTagName('*')), c.innerHTML = a);
          }
          c = 0;
        } catch (f$15) {
        }
      }
      c && this.empty().append(a);
    }, null, a, arguments.length);
  }, replaceWith:function(a) {
    return bh(this[0]) ? this.length ? this.pushStack(p(p.isFunction(a) ? a() : a), 'replaceWith', a) : this : p.isFunction(a) ? this.each(function(b) {
      var c = p(this), d = c.html();
      c.replaceWith(a.call(this, b, d));
    }) : (typeof a != 'string' && (a = p(a).detach()), this.each(function() {
      var b = this.nextSibling, c = this.parentNode;
      p(this).remove(), b ? p(b).before(a) : p(c).append(a);
    }));
  }, detach:function(a) {
    return this.remove(a, !0);
  }, domManip:function(a, c, d) {
    a = [].concat.apply([], a);
    var e, f, g, h, i = 0, j = a[0], k = [], l = this.length;
    if (!p.support.checkClone && l > 1 && typeof j == 'string' && bw.test(j)) {
      return this.each(function() {
        p(this).domManip(a, c, d);
      });
    }
    if (p.isFunction(j)) {
      return this.each(function(e) {
        var f = p(this);
        a[0] = j.call(this, e, c ? f.html() : b), f.domManip(a, c, d);
      });
    }
    if (this[0]) {
      e = p.buildFragment(a, this, k), g = e.fragment, f = g.firstChild, g.childNodes.length === 1 && (g = f);
      if (f) {
        c = c && p.nodeName(f, 'tr');
        for (h = e.cacheable || l - 1; i < l; i++) {
          d.call(c && p.nodeName(this[i], 'table') ? bC(this[i], 'tbody') : this[i], i === h ? g : p.clone(g, !0, !0));
        }
      }
      g = f = null, k.length && p.each(k, function(a, b) {
        b.src ? p.ajax ? p.ajax({url:b.src, type:'GET', dataType:'script', async:!1, global:!1, 'throws':!0}) : p.error('no ajax') : p.globalEval((b.text || b.textContent || b.innerHTML || '').replace(by, '')), b.parentNode && b.parentNode.removeChild(b);
      });
    }
    return this;
  }}), p.buildFragment = function(a, c, d) {
    var f, g, h, i = a[0];
    return c = c || e, c = !c.nodeType && c[0] || c, c = c.ownerDocument || c, a.length === 1 && typeof i == 'string' && i.length < 512 && c === e && i.charAt(0) === '\x3c' && !bt.test(i) && (p.support.checkClone || !bw.test(i)) && (p.support.html5Clone || !bu.test(i)) && (g = !0, f = p.fragments[i], h = f !== b), f || (f = c.createDocumentFragment(), p.clean(a, c, f, d), g && (p.fragments[i] = h && f)), {fragment:f, cacheable:g};
  }, p.fragments = {}, p.each({appendTo:'append', prependTo:'prepend', insertBefore:'before', insertAfter:'after', replaceAll:'replaceWith'}, function(a, b) {
    p.fn[a] = function(c) {
      var d, e = 0, f = [], g = p(c), h = g.length, i = this.length === 1 && this[0].parentNode;
      if ((i == null || i && i.nodeType === 11 && i.childNodes.length === 1) && h === 1) {
        return g[b](this[0]), this;
      }
      for (; e < h; e++) {
        d = (e > 0 ? this.clone(!0) : this).get(), p(g[e])[b](d), f = f.concat(d);
      }
      return this.pushStack(f, a, g.selector);
    };
  }), p.extend({clone:function(a, b, c) {
    var d, e, f, g;
    p.support.html5Clone || p.isXMLDoc(a) || !bu.test('\x3c' + a.nodeName + '\x3e') ? g = a.cloneNode(!0) : (bB.innerHTML = a.outerHTML, bB.removeChild(g = bB.firstChild));
    if ((!p.support.noCloneEvent || !p.support.noCloneChecked) && (a.nodeType === 1 || a.nodeType === 11) && !p.isXMLDoc(a)) {
      bE(a, g), d = bF(a), e = bF(g);
      for (f = 0; d[f]; ++f) {
        e[f] && bE(d[f], e[f]);
      }
    }
    if (b) {
      bD(a, g);
      if (c) {
        d = bF(a), e = bF(g);
        for (f = 0; d[f]; ++f) {
          bD(d[f], e[f]);
        }
      }
    }
    return d = e = null, g;
  }, clean:function(a, b, c, d) {
    var f, g, h, i, j, k, l, m, n, o, q, r, s = b === e && bA, t = [];
    if (!b || typeof b.createDocumentFragment == 'undefined') {
      b = e;
    }
    for (f = 0; (h = a[f]) != null; f++) {
      typeof h == 'number' && (h += '');
      if (!h) {
        continue;
      }
      if (typeof h == 'string') {
        if (!br.test(h)) {
          h = b.createTextNode(h);
        } else {
          s = s || bk(b), l = b.createElement('div'), s.appendChild(l), h = h.replace(bo, '\x3c$1\x3e\x3c/$2\x3e'), i = (bp.exec(h) || ['', ''])[1].toLowerCase(), j = bz[i] || bz._default, k = j[0], l.innerHTML = j[1] + h + j[2];
          while (k--) {
            l = l.lastChild;
          }
          if (!p.support.tbody) {
            m = bq.test(h), n = i === 'table' && !m ? l.firstChild && l.firstChild.childNodes : j[1] === '\x3ctable\x3e' && !m ? l.childNodes : [];
            for (g = n.length - 1; g >= 0; --g) {
              p.nodeName(n[g], 'tbody') && !n[g].childNodes.length && n[g].parentNode.removeChild(n[g]);
            }
          }
          !p.support.leadingWhitespace && bn.test(h) && l.insertBefore(b.createTextNode(bn.exec(h)[0]), l.firstChild), h = l.childNodes, l.parentNode.removeChild(l);
        }
      }
      h.nodeType ? t.push(h) : p.merge(t, h);
    }
    l && (h = l = s = null);
    if (!p.support.appendChecked) {
      for (f = 0; (h = t[f]) != null; f++) {
        p.nodeName(h, 'input') ? bG(h) : typeof h.getElementsByTagName != 'undefined' && p.grep(h.getElementsByTagName('input'), bG);
      }
    }
    if (c) {
      q = function(a) {
        if (!a.type || bx.test(a.type)) {
          return d ? d.push(a.parentNode ? a.parentNode.removeChild(a) : a) : c.appendChild(a);
        }
      };
      for (f = 0; (h = t[f]) != null; f++) {
        if (!p.nodeName(h, 'script') || !q(h)) {
          c.appendChild(h), typeof h.getElementsByTagName != 'undefined' && (r = p.grep(p.merge([], h.getElementsByTagName('script')), q), t.splice.apply(t, [f + 1, 0].concat(r)), f += r.length);
        }
      }
    }
    return t;
  }, cleanData:function(a, b) {
    var c, d, e, f, g = 0, h = p.expando, i = p.cache, j = p.support.deleteExpando, k = p.event.special;
    for (; (e = a[g]) != null; g++) {
      if (b || p.acceptData(e)) {
        d = e[h], c = d && i[d];
        if (c) {
          if (c.events) {
            for (f in c.events) {
              k[f] ? p.event.remove(e, f) : p.removeEvent(e, f, c.handle);
            }
          }
          i[d] && (delete i[d], j ? delete e[h] : e.removeAttribute ? e.removeAttribute(h) : e[h] = null, p.deletedIds.push(d));
        }
      }
    }
  }}), function() {
    var a, b;
    p.uaMatch = function(a) {
      a = a.toLowerCase();
      var b = /(chrome)[ \/]([\w.]+)/.exec(a) || /(webkit)[ \/]([\w.]+)/.exec(a) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a) || /(msie) ([\w.]+)/.exec(a) || a.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a) || [];
      return {browser:b[1] || '', version:b[2] || '0'};
    }, a = p.uaMatch(g.userAgent), b = {}, a.browser && (b[a.browser] = !0, b.version = a.version), b.chrome ? b.webkit = !0 : b.webkit && (b.safari = !0), p.browser = b, p.sub = function() {
      function a(b, c) {
        return new a.fn.init(b, c);
      }
      p.extend(!0, a, this), a.superclass = this, a.fn = a.prototype = this(), a.fn.constructor = a, a.sub = this.sub, a.fn.init = function c(c, d) {
        return d && d instanceof p && !(d instanceof a) && (d = a(d)), p.fn.init.call(this, c, d, b);
      }, a.fn.init.prototype = a.fn;
      var b = a(e);
      return a;
    };
  }();
  var bH, bI, bJ, bK = /alpha\([^)]*\)/i, bL = /opacity=([^)]*)/, bM = /^(top|right|bottom|left)$/, bN = /^(none|table(?!-c[ea]).+)/, bO = /^margin/, bP = new RegExp('^(' + q + ')(.*)$', 'i'), bQ = new RegExp('^(' + q + ')(?!px)[a-z%]+$', 'i'), bR = new RegExp('^([-+])\x3d(' + q + ')', 'i'), bS = {}, bT = {position:'absolute', visibility:'hidden', display:'block'}, bU = {letterSpacing:0, fontWeight:400}, bV = ['Top', 'Right', 'Bottom', 'Left'], bW = ['Webkit', 'O', 'Moz', 'ms'], bX = p.fn.toggle;
  p.fn.extend({css:function(a, c) {
    return p.access(this, function(a, c, d) {
      return d !== b ? p.style(a, c, d) : p.css(a, c);
    }, a, c, arguments.length > 1);
  }, show:function() {
    return b$(this, !0);
  }, hide:function() {
    return b$(this);
  }, toggle:function(a, b) {
    var c = typeof a == 'boolean';
    return p.isFunction(a) && p.isFunction(b) ? bX.apply(this, arguments) : this.each(function() {
      (c ? a : bZ(this)) ? p(this).show() : p(this).hide();
    });
  }}), p.extend({cssHooks:{opacity:{get:function(a, b) {
    if (b) {
      var c = bH(a, 'opacity');
      return c === '' ? '1' : c;
    }
  }}}, cssNumber:{fillOpacity:!0, fontWeight:!0, lineHeight:!0, opacity:!0, orphans:!0, widows:!0, zIndex:!0, zoom:!0}, cssProps:{'float':p.support.cssFloat ? 'cssFloat' : 'styleFloat'}, style:function(a, c, d, e) {
    if (!a || a.nodeType === 3 || a.nodeType === 8 || !a.style) {
      return;
    }
    var f, g, h, i = p.camelCase(c), j = a.style;
    c = p.cssProps[i] || (p.cssProps[i] = bY(j, i)), h = p.cssHooks[c] || p.cssHooks[i];
    if (d === b) {
      return h && 'get' in h && (f = h.get(a, !1, e)) !== b ? f : j[c];
    }
    g = typeof d, g === 'string' && (f = bR.exec(d)) && (d = (f[1] + 1) * f[2] + parseFloat(p.css(a, c)), g = 'number');
    if (d == null || g === 'number' && isNaN(d)) {
      return;
    }
    g === 'number' && !p.cssNumber[i] && (d += 'px');
    if (!h || !('set' in h) || (d = h.set(a, d, e)) !== b) {
      try {
        j[c] = d;
      } catch (k$16) {
      }
    }
  }, css:function(a, c, d, e) {
    var f, g, h, i = p.camelCase(c);
    return c = p.cssProps[i] || (p.cssProps[i] = bY(a.style, i)), h = p.cssHooks[c] || p.cssHooks[i], h && 'get' in h && (f = h.get(a, !0, e)), f === b && (f = bH(a, c)), f === 'normal' && c in bU && (f = bU[c]), d || e !== b ? (g = parseFloat(f), d || p.isNumeric(g) ? g || 0 : f) : f;
  }, swap:function(a, b, c) {
    var d, e, f = {};
    for (e in b) {
      f[e] = a.style[e], a.style[e] = b[e];
    }
    d = c.call(a);
    for (e in b) {
      a.style[e] = f[e];
    }
    return d;
  }}), a.getComputedStyle ? bH = function(b, c) {
    var d, e, f, g, h = a.getComputedStyle(b, null), i = b.style;
    return h && (d = h[c], d === '' && !p.contains(b.ownerDocument, b) && (d = p.style(b, c)), bQ.test(d) && bO.test(c) && (e = i.width, f = i.minWidth, g = i.maxWidth, i.minWidth = i.maxWidth = i.width = d, d = h.width, i.width = e, i.minWidth = f, i.maxWidth = g)), d;
  } : e.documentElement.currentStyle && (bH = function(a, b) {
    var c, d, e = a.currentStyle && a.currentStyle[b], f = a.style;
    return e == null && f && f[b] && (e = f[b]), bQ.test(e) && !bM.test(b) && (c = f.left, d = a.runtimeStyle && a.runtimeStyle.left, d && (a.runtimeStyle.left = a.currentStyle.left), f.left = b === 'fontSize' ? '1em' : e, e = f.pixelLeft + 'px', f.left = c, d && (a.runtimeStyle.left = d)), e === '' ? 'auto' : e;
  }), p.each(['height', 'width'], function(a, b) {
    p.cssHooks[b] = {get:function(a, c, d) {
      if (c) {
        return a.offsetWidth === 0 && bN.test(bH(a, 'display')) ? p.swap(a, bT, function() {
          return cb(a, b, d);
        }) : cb(a, b, d);
      }
    }, set:function(a, c, d) {
      return b_(a, c, d ? ca(a, b, d, p.support.boxSizing && p.css(a, 'boxSizing') === 'border-box') : 0);
    }};
  }), p.support.opacity || (p.cssHooks.opacity = {get:function(a, b) {
    return bL.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || '') ? 0.01 * parseFloat(RegExp.$1) + '' : b ? '1' : '';
  }, set:function(a, b) {
    var c = a.style, d = a.currentStyle, e = p.isNumeric(b) ? 'alpha(opacity\x3d' + b * 100 + ')' : '', f = d && d.filter || c.filter || '';
    c.zoom = 1;
    if (b >= 1 && p.trim(f.replace(bK, '')) === '' && c.removeAttribute) {
      c.removeAttribute('filter');
      if (d && !d.filter) {
        return;
      }
    }
    c.filter = bK.test(f) ? f.replace(bK, e) : f + ' ' + e;
  }}), p(function() {
    p.support.reliableMarginRight || (p.cssHooks.marginRight = {get:function(a, b) {
      return p.swap(a, {display:'inline-block'}, function() {
        if (b) {
          return bH(a, 'marginRight');
        }
      });
    }}), !p.support.pixelPosition && p.fn.position && p.each(['top', 'left'], function(a, b) {
      p.cssHooks[b] = {get:function(a, c) {
        if (c) {
          var d = bH(a, b);
          return bQ.test(d) ? p(a).position()[b] + 'px' : d;
        }
      }};
    });
  }), p.expr && p.expr.filters && (p.expr.filters.hidden = function(a) {
    return a.offsetWidth === 0 && a.offsetHeight === 0 || !p.support.reliableHiddenOffsets && (a.style && a.style.display || bH(a, 'display')) === 'none';
  }, p.expr.filters.visible = function(a) {
    return !p.expr.filters.hidden(a);
  }), p.each({margin:'', padding:'', border:'Width'}, function(a, b) {
    p.cssHooks[a + b] = {expand:function(c) {
      var d, e = typeof c == 'string' ? c.split(' ') : [c], f = {};
      for (d = 0; d < 4; d++) {
        f[a + bV[d] + b] = e[d] || e[d - 2] || e[0];
      }
      return f;
    }}, bO.test(a) || (p.cssHooks[a + b].set = b_);
  });
  var cd = /%20/g, ce = /\[\]$/, cf = /\r?\n/g, cg = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, ch = /^(?:select|textarea)/i;
  p.fn.extend({serialize:function() {
    return p.param(this.serializeArray());
  }, serializeArray:function() {
    return this.map(function() {
      return this.elements ? p.makeArray(this.elements) : this;
    }).filter(function() {
      return this.name && !this.disabled && (this.checked || ch.test(this.nodeName) || cg.test(this.type));
    }).map(function(a, b) {
      var c = p(this).val();
      return c == null ? null : p.isArray(c) ? p.map(c, function(a, c) {
        return {name:b.name, value:a.replace(cf, '\r\n')};
      }) : {name:b.name, value:c.replace(cf, '\r\n')};
    }).get();
  }}), p.param = function(a, c) {
    var d, e = [], f = function(a, b) {
      b = p.isFunction(b) ? b() : b == null ? '' : b, e[e.length] = encodeURIComponent(a) + '\x3d' + encodeURIComponent(b);
    };
    c === b && (c = p.ajaxSettings && p.ajaxSettings.traditional);
    if (p.isArray(a) || a.jquery && !p.isPlainObject(a)) {
      p.each(a, function() {
        f(this.name, this.value);
      });
    } else {
      for (d in a) {
        ci(d, a[d], c, f);
      }
    }
    return e.join('\x26').replace(cd, '+');
  };
  var cj, ck, cl = /#.*$/, cm = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, cn = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, co = /^(?:GET|HEAD)$/, cp = /^\/\//, cq = /\?/, cr = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, cs = /([?&])_=[^&]*/, ct = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, cu = p.fn.load, cv = {}, cw = {}, cx = ['*/'] + ['*'];
  try {
    ck = f.href;
  } catch (cy) {
    ck = e.createElement('a'), ck.href = '', ck = ck.href;
  }
  cj = ct.exec(ck.toLowerCase()) || [], p.fn.load = function(a, c, d) {
    if (typeof a != 'string' && cu) {
      return cu.apply(this, arguments);
    }
    if (!this.length) {
      return this;
    }
    var e, f, g, h = this, i = a.indexOf(' ');
    return i >= 0 && (e = a.slice(i, a.length), a = a.slice(0, i)), p.isFunction(c) ? (d = c, c = b) : c && typeof c == 'object' && (f = 'POST'), p.ajax({url:a, type:f, dataType:'html', data:c, complete:function(a, b) {
      d && h.each(d, g || [a.responseText, b, a]);
    }}).done(function(a) {
      g = arguments, h.html(e ? p('\x3cdiv\x3e').append(a.replace(cr, '')).find(e) : a);
    }), this;
  }, p.each('ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend'.split(' '), function(a, b) {
    p.fn[b] = function(a) {
      return this.on(b, a);
    };
  }), p.each(['get', 'post'], function(a, c) {
    p[c] = function(a, d, e, f) {
      return p.isFunction(d) && (f = f || e, e = d, d = b), p.ajax({type:c, url:a, data:d, success:e, dataType:f});
    };
  }), p.extend({getScript:function(a, c) {
    return p.get(a, b, c, 'script');
  }, getJSON:function(a, b, c) {
    return p.get(a, b, c, 'json');
  }, ajaxSetup:function(a, b) {
    return b ? cB(a, p.ajaxSettings) : (b = a, a = p.ajaxSettings), cB(a, b), a;
  }, ajaxSettings:{url:ck, isLocal:cn.test(cj[1]), global:!0, type:'GET', contentType:'application/x-www-form-urlencoded; charset\x3dUTF-8', processData:!0, async:!0, accepts:{xml:'application/xml, text/xml', html:'text/html', text:'text/plain', json:'application/json, text/javascript', '*':cx}, contents:{xml:/xml/, html:/html/, json:/json/}, responseFields:{xml:'responseXML', text:'responseText'}, converters:{'* text':a.String, 'text html':!0, 'text json':p.parseJSON, 'text xml':p.parseXML}, flatOptions:{context:!0, 
  url:!0}}, ajaxPrefilter:cz(cv), ajaxTransport:cz(cw), ajax:function(a, c) {
    function y(a, c, f, i) {
      var k, s, t, u, w, y = c;
      if (v === 2) {
        return;
      }
      v = 2, h && clearTimeout(h), g = b, e = i || '', x.readyState = a > 0 ? 4 : 0, f && (u = cC(l, x, f));
      if (a >= 200 && a < 300 || a === 304) {
        l.ifModified && (w = x.getResponseHeader('Last-Modified'), w && (p.lastModified[d] = w), w = x.getResponseHeader('Etag'), w && (p.etag[d] = w)), a === 304 ? (y = 'notmodified', k = !0) : (k = cD(l, u), y = k.state, s = k.data, t = k.error, k = !t);
      } else {
        t = y;
        if (!y || a) {
          y = 'error', a < 0 && (a = 0);
        }
      }
      x.status = a, x.statusText = (c || y) + '', k ? o.resolveWith(m, [s, y, x]) : o.rejectWith(m, [x, y, t]), x.statusCode(r), r = b, j && n.trigger('ajax' + (k ? 'Success' : 'Error'), [x, l, k ? s : t]), q.fireWith(m, [x, y]), j && (n.trigger('ajaxComplete', [x, l]), --p.active || p.event.trigger('ajaxStop'));
    }
    typeof a == 'object' && (c = a, a = b), c = c || {};
    var d, e, f, g, h, i, j, k, l = p.ajaxSetup({}, c), m = l.context || l, n = m !== l && (m.nodeType || m instanceof p) ? p(m) : p.event, o = p.Deferred(), q = p.Callbacks('once memory'), r = l.statusCode || {}, t = {}, u = {}, v = 0, w = 'canceled', x = {readyState:0, setRequestHeader:function(a, b) {
      if (!v) {
        var c = a.toLowerCase();
        a = u[c] = u[c] || a, t[a] = b;
      }
      return this;
    }, getAllResponseHeaders:function() {
      return v === 2 ? e : null;
    }, getResponseHeader:function(a) {
      var c;
      if (v === 2) {
        if (!f) {
          f = {};
          while (c = cm.exec(e)) {
            f[c[1].toLowerCase()] = c[2];
          }
        }
        c = f[a.toLowerCase()];
      }
      return c === b ? null : c;
    }, overrideMimeType:function(a) {
      return v || (l.mimeType = a), this;
    }, abort:function(a) {
      return a = a || w, g && g.abort(a), y(0, a), this;
    }};
    o.promise(x), x.success = x.done, x.error = x.fail, x.complete = q.add, x.statusCode = function(a) {
      if (a) {
        var b;
        if (v < 2) {
          for (b in a) {
            r[b] = [r[b], a[b]];
          }
        } else {
          b = a[x.status], x.always(b);
        }
      }
      return this;
    }, l.url = ((a || l.url) + '').replace(cl, '').replace(cp, cj[1] + '//'), l.dataTypes = p.trim(l.dataType || '*').toLowerCase().split(s), l.crossDomain == null && (i = ct.exec(l.url.toLowerCase()) || !1, l.crossDomain = i && i.join(':') + (i[3] ? '' : i[1] === 'http:' ? 80 : 443) !== cj.join(':') + (cj[3] ? '' : cj[1] === 'http:' ? 80 : 443)), l.data && l.processData && typeof l.data != 'string' && (l.data = p.param(l.data, l.traditional)), cA(cv, l, c, x);
    if (v === 2) {
      return x;
    }
    j = l.global, l.type = l.type.toUpperCase(), l.hasContent = !co.test(l.type), j && p.active++ === 0 && p.event.trigger('ajaxStart');
    if (!l.hasContent) {
      l.data && (l.url += (cq.test(l.url) ? '\x26' : '?') + l.data, delete l.data), d = l.url;
      if (l.cache === !1) {
        var z = p.now(), A = l.url.replace(cs, '$1_\x3d' + z);
        l.url = A + (A === l.url ? (cq.test(l.url) ? '\x26' : '?') + '_\x3d' + z : '');
      }
    }
    (l.data && l.hasContent && l.contentType !== !1 || c.contentType) && x.setRequestHeader('Content-Type', l.contentType), l.ifModified && (d = d || l.url, p.lastModified[d] && x.setRequestHeader('If-Modified-Since', p.lastModified[d]), p.etag[d] && x.setRequestHeader('If-None-Match', p.etag[d])), x.setRequestHeader('Accept', l.dataTypes[0] && l.accepts[l.dataTypes[0]] ? l.accepts[l.dataTypes[0]] + (l.dataTypes[0] !== '*' ? ', ' + cx + '; q\x3d0.01' : '') : l.accepts['*']);
    for (k in l.headers) {
      x.setRequestHeader(k, l.headers[k]);
    }
    if (!l.beforeSend || l.beforeSend.call(m, x, l) !== !1 && v !== 2) {
      w = 'abort';
      for (k in{success:1, error:1, complete:1}) {
        x[k](l[k]);
      }
      g = cA(cw, l, c, x);
      if (!g) {
        y(-1, 'No Transport');
      } else {
        x.readyState = 1, j && n.trigger('ajaxSend', [x, l]), l.async && l.timeout > 0 && (h = setTimeout(function() {
          x.abort('timeout');
        }, l.timeout));
        try {
          v = 1, g.send(t, y);
        } catch (B$17) {
          if (v < 2) {
            y(-1, B$17);
          } else {
            throw B$17;
          }
        }
      }
      return x;
    }
    return x.abort();
  }, active:0, lastModified:{}, etag:{}});
  var cE = [], cF = /\?/, cG = /(=)\?(?=&|$)|\?\?/, cH = p.now();
  p.ajaxSetup({jsonp:'callback', jsonpCallback:function() {
    var a = cE.pop() || p.expando + '_' + cH++;
    return this[a] = !0, a;
  }}), p.ajaxPrefilter('json jsonp', function(c, d, e) {
    var f, g, h, i = c.data, j = c.url, k = c.jsonp !== !1, l = k && cG.test(j), m = k && !l && typeof i == 'string' && !(c.contentType || '').indexOf('application/x-www-form-urlencoded') && cG.test(i);
    if (c.dataTypes[0] === 'jsonp' || l || m) {
      return f = c.jsonpCallback = p.isFunction(c.jsonpCallback) ? c.jsonpCallback() : c.jsonpCallback, g = a[f], l ? c.url = j.replace(cG, '$1' + f) : m ? c.data = i.replace(cG, '$1' + f) : k && (c.url += (cF.test(j) ? '\x26' : '?') + c.jsonp + '\x3d' + f), c.converters['script json'] = function() {
        return h || p.error(f + ' was not called'), h[0];
      }, c.dataTypes[0] = 'json', a[f] = function() {
        h = arguments;
      }, e.always(function() {
        a[f] = g, c[f] && (c.jsonpCallback = d.jsonpCallback, cE.push(f)), h && p.isFunction(g) && g(h[0]), h = g = b;
      }), 'script';
    }
  }), p.ajaxSetup({accepts:{script:'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'}, contents:{script:/javascript|ecmascript/}, converters:{'text script':function(a) {
    return p.globalEval(a), a;
  }}}), p.ajaxPrefilter('script', function(a) {
    a.cache === b && (a.cache = !1), a.crossDomain && (a.type = 'GET', a.global = !1);
  }), p.ajaxTransport('script', function(a) {
    if (a.crossDomain) {
      var c, d = e.head || e.getElementsByTagName('head')[0] || e.documentElement;
      return {send:function(f, g) {
        c = e.createElement('script'), c.async = 'async', a.scriptCharset && (c.charset = a.scriptCharset), c.src = a.url, c.onload = c.onreadystatechange = function(a, e) {
          if (e || !c.readyState || /loaded|complete/.test(c.readyState)) {
            c.onload = c.onreadystatechange = null, d && c.parentNode && d.removeChild(c), c = b, e || g(200, 'success');
          }
        }, d.insertBefore(c, d.firstChild);
      }, abort:function() {
        c && c.onload(0, 1);
      }};
    }
  });
  var cI, cJ = a.ActiveXObject ? function() {
    for (var a in cI) {
      cI[a](0, 1);
    }
  } : !1, cK = 0;
  p.ajaxSettings.xhr = a.ActiveXObject ? function() {
    return !this.isLocal && cL() || cM();
  } : cL, function(a) {
    p.extend(p.support, {ajax:!!a, cors:!!a && 'withCredentials' in a});
  }(p.ajaxSettings.xhr()), p.support.ajax && p.ajaxTransport(function(c) {
    if (!c.crossDomain || p.support.cors) {
      var d;
      return {send:function(e, f) {
        var g, h, i = c.xhr();
        c.username ? i.open(c.type, c.url, c.async, c.username, c.password) : i.open(c.type, c.url, c.async);
        if (c.xhrFields) {
          for (h in c.xhrFields) {
            i[h] = c.xhrFields[h];
          }
        }
        c.mimeType && i.overrideMimeType && i.overrideMimeType(c.mimeType), !c.crossDomain && !e['X-Requested-With'] && (e['X-Requested-With'] = 'XMLHttpRequest');
        try {
          for (h in e) {
            i.setRequestHeader(h, e[h]);
          }
        } catch (j$18) {
        }
        i.send(c.hasContent && c.data || null), d = function(a, e) {
          var h, j, k, l, m;
          try {
            if (d && (e || i.readyState === 4)) {
              d = b, g && (i.onreadystatechange = p.noop, cJ && delete cI[g]);
              if (e) {
                i.readyState !== 4 && i.abort();
              } else {
                h = i.status, k = i.getAllResponseHeaders(), l = {}, m = i.responseXML, m && m.documentElement && (l.xml = m);
                try {
                  l.text = i.responseText;
                } catch (a$19) {
                }
                try {
                  j = i.statusText;
                } catch (n$20) {
                  j = '';
                }
                !h && c.isLocal && !c.crossDomain ? h = l.text ? 200 : 404 : h === 1223 && (h = 204);
              }
            }
          } catch (o$21) {
            e || f(-1, o$21);
          }
          l && f(h, j, l, k);
        }, c.async ? i.readyState === 4 ? setTimeout(d, 0) : (g = ++cK, cJ && (cI || (cI = {}, p(a).unload(cJ)), cI[g] = d), i.onreadystatechange = d) : d();
      }, abort:function() {
        d && d(0, 1);
      }};
    }
  });
  var cN, cO, cP = /^(?:toggle|show|hide)$/, cQ = new RegExp('^(?:([-+])\x3d|)(' + q + ')([a-z%]*)$', 'i'), cR = /queueHooks$/, cS = [cY], cT = {'*':[function(a, b) {
    var c, d, e = this.createTween(a, b), f = cQ.exec(b), g = e.cur(), h = +g || 0, i = 1, j = 20;
    if (f) {
      c = +f[2], d = f[3] || (p.cssNumber[a] ? '' : 'px');
      if (d !== 'px' && h) {
        h = p.css(e.elem, a, !0) || c || 1;
        do {
          i = i || '.5', h = h / i, p.style(e.elem, a, h + d);
        } while (i !== (i = e.cur() / g) && i !== 1 && --j);
      }
      e.unit = d, e.start = h, e.end = f[1] ? h + (f[1] + 1) * c : c;
    }
    return e;
  }]};
  p.Animation = p.extend(cW, {tweener:function(a, b) {
    p.isFunction(a) ? (b = a, a = ['*']) : a = a.split(' ');
    var c, d = 0, e = a.length;
    for (; d < e; d++) {
      c = a[d], cT[c] = cT[c] || [], cT[c].unshift(b);
    }
  }, prefilter:function(a, b) {
    b ? cS.unshift(a) : cS.push(a);
  }}), p.Tween = cZ, cZ.prototype = {constructor:cZ, init:function(a, b, c, d, e, f) {
    this.elem = a, this.prop = c, this.easing = e || 'swing', this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (p.cssNumber[c] ? '' : 'px');
  }, cur:function() {
    var a = cZ.propHooks[this.prop];
    return a && a.get ? a.get(this) : cZ.propHooks._default.get(this);
  }, run:function(a) {
    var b, c = cZ.propHooks[this.prop];
    return this.options.duration ? this.pos = b = p.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : this.pos = b = a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : cZ.propHooks._default.set(this), this;
  }}, cZ.prototype.init.prototype = cZ.prototype, cZ.propHooks = {_default:{get:function(a) {
    var b;
    return a.elem[a.prop] == null || !!a.elem.style && a.elem.style[a.prop] != null ? (b = p.css(a.elem, a.prop, !1, ''), !b || b === 'auto' ? 0 : b) : a.elem[a.prop];
  }, set:function(a) {
    p.fx.step[a.prop] ? p.fx.step[a.prop](a) : a.elem.style && (a.elem.style[p.cssProps[a.prop]] != null || p.cssHooks[a.prop]) ? p.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now;
  }}}, cZ.propHooks.scrollTop = cZ.propHooks.scrollLeft = {set:function(a) {
    a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now);
  }}, p.each(['toggle', 'show', 'hide'], function(a, b) {
    var c = p.fn[b];
    p.fn[b] = function(d, e, f) {
      return d == null || typeof d == 'boolean' || !a && p.isFunction(d) && p.isFunction(e) ? c.apply(this, arguments) : this.animate(c$(b, !0), d, e, f);
    };
  }), p.fn.extend({fadeTo:function(a, b, c, d) {
    return this.filter(bZ).css('opacity', 0).show().end().animate({opacity:b}, a, c, d);
  }, animate:function(a, b, c, d) {
    var e = p.isEmptyObject(a), f = p.speed(b, c, d), g = function() {
      var b = cW(this, p.extend({}, a), f);
      e && b.stop(!0);
    };
    return e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g);
  }, stop:function(a, c, d) {
    var e = function(a) {
      var b = a.stop;
      delete a.stop, b(d);
    };
    return typeof a != 'string' && (d = c, c = a, a = b), c && a !== !1 && this.queue(a || 'fx', []), this.each(function() {
      var b = !0, c = a != null && a + 'queueHooks', f = p.timers, g = p._data(this);
      if (c) {
        g[c] && g[c].stop && e(g[c]);
      } else {
        for (c in g) {
          g[c] && g[c].stop && cR.test(c) && e(g[c]);
        }
      }
      for (c = f.length; c--;) {
        f[c].elem === this && (a == null || f[c].queue === a) && (f[c].anim.stop(d), b = !1, f.splice(c, 1));
      }
      (b || !d) && p.dequeue(this, a);
    });
  }}), p.each({slideDown:c$('show'), slideUp:c$('hide'), slideToggle:c$('toggle'), fadeIn:{opacity:'show'}, fadeOut:{opacity:'hide'}, fadeToggle:{opacity:'toggle'}}, function(a, b) {
    p.fn[a] = function(a, c, d) {
      return this.animate(b, a, c, d);
    };
  }), p.speed = function(a, b, c) {
    var d = a && typeof a == 'object' ? p.extend({}, a) : {complete:c || !c && b || p.isFunction(a) && a, duration:a, easing:c && b || b && !p.isFunction(b) && b};
    d.duration = p.fx.off ? 0 : typeof d.duration == 'number' ? d.duration : d.duration in p.fx.speeds ? p.fx.speeds[d.duration] : p.fx.speeds._default;
    if (d.queue == null || d.queue === !0) {
      d.queue = 'fx';
    }
    return d.old = d.complete, d.complete = function() {
      p.isFunction(d.old) && d.old.call(this), d.queue && p.dequeue(this, d.queue);
    }, d;
  }, p.easing = {linear:function(a) {
    return a;
  }, swing:function(a) {
    return 0.5 - Math.cos(a * Math.PI) / 2;
  }}, p.timers = [], p.fx = cZ.prototype.init, p.fx.tick = function() {
    var a, b = p.timers, c = 0;
    for (; c < b.length; c++) {
      a = b[c], !a() && b[c] === a && b.splice(c--, 1);
    }
    b.length || p.fx.stop();
  }, p.fx.timer = function(a) {
    a() && p.timers.push(a) && !cO && (cO = setInterval(p.fx.tick, p.fx.interval));
  }, p.fx.interval = 13, p.fx.stop = function() {
    clearInterval(cO), cO = null;
  }, p.fx.speeds = {slow:600, fast:200, _default:400}, p.fx.step = {}, p.expr && p.expr.filters && (p.expr.filters.animated = function(a) {
    return p.grep(p.timers, function(b) {
      return a === b.elem;
    }).length;
  });
  var c_ = /^(?:body|html)$/i;
  p.fn.offset = function(a) {
    if (arguments.length) {
      return a === b ? this : this.each(function(b) {
        p.offset.setOffset(this, a, b);
      });
    }
    var c, d, e, f, g, h, i, j = {top:0, left:0}, k = this[0], l = k && k.ownerDocument;
    if (!l) {
      return;
    }
    return (d = l.body) === k ? p.offset.bodyOffset(k) : (c = l.documentElement, p.contains(c, k) ? (typeof k.getBoundingClientRect != 'undefined' && (j = k.getBoundingClientRect()), e = da(l), f = c.clientTop || d.clientTop || 0, g = c.clientLeft || d.clientLeft || 0, h = e.pageYOffset || c.scrollTop, i = e.pageXOffset || c.scrollLeft, {top:j.top + h - f, left:j.left + i - g}) : j);
  }, p.offset = {bodyOffset:function(a) {
    var b = a.offsetTop, c = a.offsetLeft;
    return p.support.doesNotIncludeMarginInBodyOffset && (b += parseFloat(p.css(a, 'marginTop')) || 0, c += parseFloat(p.css(a, 'marginLeft')) || 0), {top:b, left:c};
  }, setOffset:function(a, b, c) {
    var d = p.css(a, 'position');
    d === 'static' && (a.style.position = 'relative');
    var e = p(a), f = e.offset(), g = p.css(a, 'top'), h = p.css(a, 'left'), i = (d === 'absolute' || d === 'fixed') && p.inArray('auto', [g, h]) > -1, j = {}, k = {}, l, m;
    i ? (k = e.position(), l = k.top, m = k.left) : (l = parseFloat(g) || 0, m = parseFloat(h) || 0), p.isFunction(b) && (b = b.call(a, c, f)), b.top != null && (j.top = b.top - f.top + l), b.left != null && (j.left = b.left - f.left + m), 'using' in b ? b.using.call(a, j) : e.css(j);
  }}, p.fn.extend({position:function() {
    if (!this[0]) {
      return;
    }
    var a = this[0], b = this.offsetParent(), c = this.offset(), d = c_.test(b[0].nodeName) ? {top:0, left:0} : b.offset();
    return c.top -= parseFloat(p.css(a, 'marginTop')) || 0, c.left -= parseFloat(p.css(a, 'marginLeft')) || 0, d.top += parseFloat(p.css(b[0], 'borderTopWidth')) || 0, d.left += parseFloat(p.css(b[0], 'borderLeftWidth')) || 0, {top:c.top - d.top, left:c.left - d.left};
  }, offsetParent:function() {
    return this.map(function() {
      var a = this.offsetParent || e.body;
      while (a && !c_.test(a.nodeName) && p.css(a, 'position') === 'static') {
        a = a.offsetParent;
      }
      return a || e.body;
    });
  }}), p.each({scrollLeft:'pageXOffset', scrollTop:'pageYOffset'}, function(a, c) {
    var d = /Y/.test(c);
    p.fn[a] = function(e) {
      return p.access(this, function(a, e, f) {
        var g = da(a);
        if (f === b) {
          return g ? c in g ? g[c] : g.document.documentElement[e] : a[e];
        }
        g ? g.scrollTo(d ? p(g).scrollLeft() : f, d ? f : p(g).scrollTop()) : a[e] = f;
      }, a, e, arguments.length, null);
    };
  }), p.each({Height:'height', Width:'width'}, function(a, c) {
    p.each({padding:'inner' + a, content:c, '':'outer' + a}, function(d, e) {
      p.fn[e] = function(e, f) {
        var g = arguments.length && (d || typeof e != 'boolean'), h = d || (e === !0 || f === !0 ? 'margin' : 'border');
        return p.access(this, function(c, d, e) {
          var f;
          return p.isWindow(c) ? c.document.documentElement['client' + a] : c.nodeType === 9 ? (f = c.documentElement, Math.max(c.body['scroll' + a], f['scroll' + a], c.body['offset' + a], f['offset' + a], f['client' + a])) : e === b ? p.css(c, d, e, h) : p.style(c, d, e, h);
        }, c, g ? e : b, g, null);
      };
    });
  }), a.jQuery = a.$ = p, typeof define == 'function' && define.amd && define.amd.jQuery && define('jquery', [], function() {
    return p;
  });
})(window);
Ext.Loader.setConfig({});
Ext.application({models:['AttaccogModel', 'AttaccoiModel', 'AziendeModel', 'AziendeModel2', 'CampionecodeModel', 'ComuniModel', 'FarmModel', 'FasifenologicheModel', 'HostrdModel', 'MotivovisitaModel', 'OsservazionModel', 'PestModel', 'PresenteModel', 'ProvinceModel', 'SchedeModel', 'SessoModel', 'SitiModel', 'TipoaziendaModel', 'TipotrappoleModel', 'TrappoleModel', 'UserModel', 'AssociaTecniciModel', 'AllorgModel', 'TrapModel', 'LaboratorioModel', 'AbbattimentiModel', 'UsersModel', 'WarningsModel', 
'userPrjModel', 'UserTypeModel', 'LegendsModel', 'ParassitiModel', 'AttachmentModel', 'tableHostModel', 'tablePestModel', 'TipoTecnico', 'RefertiModel', 'MotivovisitaModel1', 'TipoaziendaallModel', 'PestHostModel', 'UsersModel1', 'NewsModel', 'ChangeLogModel', 'laboratoryModel', 'TipocampioneModel', 'TipoCampioneModelAll', 'TipologiasitiModel', 'TrapreferenceModel', 'TrappoleReportComboModel', 'ThemeTSModel', 'combo', 'UEPest', 'MyModel', 'AnalisysStatisticsModel', 'HostPestModel', 'AnalisysReasonModel', 
'AnalisysProvinceModel', 'AreasModel', 'reportsStore', 'officialuemodel'], stores:['AttaccogStore', 'AttaccoiStore', 'AziendeStore', 'CampionecodeStore', 'ComuniStore', 'FasifenologicheStore', 'HostrdStore', 'MotivovisitaStore', 'PestStore', 'ProvinceStore', 'SchedeStore', 'SessoStore', 'SitiStore', 'TipoaziendaStore', 'TrappoleStore', 'AziendeStore2', 'FarmStore', 'OsservazioniStore', 'PlantStore', 'TipotrappoleStore', 'AssociaTecniciStore', 'RimuoviTecniciStore', 'AllorgStore', 'TrapStore', 'LaboratorioStore', 
'AbbattimentiModels', 'UsersStore', 'WarningsStore', 'userPrjStore', 'UserTypeStore', 'DatasetTreeStore', 'LegendsStore', 'ParassitiStore', 'AttachmentStore', 'tableHostStore', 'tablePestStore', 'TipoTecnicoStore', 'RefertiStore', 'MotivovisitaStore1', 'TipoaziendaallStore', 'PestHostStore', 'UsersStore1', 'ParassitiStore1', 'TipoTecnicoStore1', 'NewsStore', 'ChangeLogStore', 'laboratoryStore', 'TipocampioneStore', 'TipoCampioneStoreAll', 'TipologiasitiStore', 'TrapreferenceStore', 'AllTrapStore', 
'TrappoleReportComboStore', 'ThemeTSStore', 'ThemeTSStore1', 'TipologiasitiStore1', 'tipologiecontrollate', 'paeseprovenienza', 'UEPestsStore', 'tipoTrappoleAllStore', 'HostrndStore', 'OsservazioniStore1', 'AreasStore', 'ParassitiStore2', 'SitiStore1', 'areelinkabili', 'reportsStores', 'officialuestore'], views:['LoginForm', 'MainViewport', 'SchedaContainer', 'AddopsWindow', 'PestWindow', 'TrappoleWindow', 'NuovaAzienda', 'SitiContainer', 'UserData', 'NuovaSchdaWindow', 'AssociaTecnicoWindow', 'RimuoviTecnicoWindow', 
'SitiAllContainer', 'SitiContainer1', 'DuplicaWindow', 'NuovaAssociazioneWindow', 'LaboratorioWindow', 'TrappolePanel', 'CodeWindow', 'AbbattimentiWindow', 'UsersWindow', 'WarningsWindow', 'ReportPanel', 'PerParassitaWindow', 'AttachmentWindow', 'TableWindow', 'tableHostModels', 'RecuperoWindow', 'RichiestaWindow', 'FarmmergefWindow', 'SchedaSettingsWindow', 'RefertiWindow', 'MotivoIspezioneWindow', 'NuovoMotivoWindow', 'TipoaziendaWindow', 'NuovoTipoaziendaWindow', 'PresenzaparassitiWindow', 'AreaincidenzaWindow', 
'RigettoWindow', 'GetFeaturesInfoWindow', 'PresenzaparassitiWindow1', 'PresenzaparassitiWindow2', 'PresenzaparassitiWindow3', 'MailWindow', 'NewsWindow', 'newsEditWindow', 'CLWindow', 'labResultWindow', 'TipocampioneWindow', 'NuovoTipoCampioneWindow', 'PresenzaparassitiWindow4', 'UEReportWindow', 'addtipologiasitoWindow', 'AllTrapPanel', 'TrapReportWindow', 'UEPestWindow', 'TipotrappolaWindow1', 'NuovoTipoTrappolaWindow', 'FilterTrapWindow', 'TrappolePanel1', 'AnalysysStatisticsWindow', 'delimitazioneWindow', 
'PresenzaparassitiWindow5', 'TrapReportWindow1', 'TrapReportWindow2', 'delimitazioneWindow1', 'delimitazioniChiusuraWindow', 'unisciArea', 'ReportsWindow', 'TrapReportWindow3', 'EuroPhitWindow', 'ProtocolloWindow', 'TrappolealWindow', 'TrappolePosizionateNelWindow', 'TrappoleAttiveNelWindow', 'ParassitaCatturatoNelWindow', 'CatturePerWindow', 'CatturePerWindow1', 'OfficialEUReportsWin', 'officialUELoadWin'], name:'SIMFito', launch:function() {
  firstTime = firstTime1 = firstTime2 = firstTime4 = firstTimePrjStore = true;
  osservazioneReloadId = null;
  layerFirstTime = true;
  selectedLayer = null;
  urlPrefix = 'https://simfito.regione.campania.it/simfito/';
  simfitoLabUrl = 'https://simfito.regione.campania.it/simfitolab/';
  wmsUrl = 'https://simfito.regione.campania.it/geoserver/wms';
  wfsUrl = 'https://simfito.regione.campania.it/geoserver/wfs';
  reportsRunner = new Ext.util.TaskRunner;
  task = null;
  var prjStore = Ext.StoreMgr.get('userPrjStore');
  prjStore.load();
  var osservazioniFormInitValues;
  var simfitoTimeOut = 1000000;
  Ext.Ajax.timeout = simfitoTimeOut;
  Ext.Ajax.setupUrl = function(options, url) {
    var b = url.split('/');
    if (b.indexOf('geoserver') == -1) {
      url = urlPrefix + url;
    }
    return url;
  };
  Ext.Ajax.setConfig('cors', true);
  Ext.Ajax.on('requestexception', function(proxy, response, operation) {
    if (response.status != -1) {
      var message = response.statusText;
      if (message != '') {
        Ext.MessageBox.show({title:'REMOTE EXCEPTION', msg:message, icon:Ext.MessageBox.ERROR, buttons:Ext.Msg.OK});
      }
    }
  });
  Ext.MessageBox.buttonText.yes = 'Sì';
  localStore = new Ext.util.LocalStorage({id:'simfito'});
  if (localStore.getItem('ID') === null) {
    checkConfig();
    Ext.create('SIMFito.view.LoginForm', {renderTo:Ext.getBody()});
  } else {
    checkConfig();
    setInterval(checkConfig, 1000 * 60 * 5);
    var ID = localStore.getItem('ID');
    Ext.StoreMgr.get('SchedeStore').getProxy().setExtraParam('idTecnico', ID);
    Ext.StoreMgr.get('RefertiStore').getProxy().setExtraParam('idTecnico', ID);
    Ext.StoreMgr.get('CampionecodeStore').getProxy().setExtraParam('idtecnico', ID);
    console.log('CampionicodeStore extraParam updated');
    Ext.create('SIMFito.view.MainViewport');
    var prjStore = Ext.StoreMgr.get('userPrjStore');
    prjStore.on('load', function(store, records, successfull, operation, eOpts) {
      if (successfull) {
        if (firstTimePrjStore) {
          store.each(function(record, index, count) {
            proj4.defs(record.get('srs'), record.get('def'));
            console.info(record.get('srs') + ' added');
          });
          firstTimePrjStore = false;
          var aeFabSource1 = new ol.source.TileWMS({url:'https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php', params:{'LAYERS':'fabbricati'}, title:'Agenzia Delle Entrate Fabbricati', projection:new ol.proj.Projection({code:'EPSG:25832', units:'m', axisOrientation:'enu'}), serverType:'geoserver'});
          aeFab1 = new ol.layer.Tile({source:aeFabSource1, visible:false});
          var aeCatSource1 = new ol.source.TileWMS({url:'https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php', params:{'LAYERS':'CP.CadastralParcel'}, title:'Agenzia Delle Entrate Fabbricati', projection:new ol.proj.Projection({code:'EPSG:25832'}), serverType:'geoserver'});
          aeCat1 = new ol.layer.Tile({source:aeCatSource1, visible:false});
          var aeCodiceSource1 = new ol.source.TileWMS({url:'https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php', params:{'LAYERS':'codice_plla'}, title:'Agenzia Delle Entrate codice', projection:new ol.proj.Projection({code:'EPSG:25832', units:'m', axisOrientation:'enu'}), serverType:'geoserver'});
          aeCod1 = new ol.layer.Tile({source:aeCodiceSource1, visible:false});
          map.addLayer(layer);
          map.addLayer(aeCat1);
          map.addLayer(aeFab1);
          map.addLayer(aeCod1);
          map.addLayer(Catasto);
          map.addLayer(markerLayer);
        }
      } else {
        console.error('prjStore load failled');
      }
    });
  }
  Ext.StoreMgr.get('OsservazioniStore').on('load', function(store, records, successful, operation, eOpts) {
    if (osservazioneReloadId != null && osservazioneReloadId != undefined) {
      var idrec = store.find('idosservazioni', osservazioneReloadId);
      if (rec != -1) {
        var rec = store.getAt(idrec);
        var grid = Ext.getCmp('osservazionigrid');
        grid.getSelectionModel().select(rec);
      }
      osservazioneReloadId = null;
    }
  });
}});
