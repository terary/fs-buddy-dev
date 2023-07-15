/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 671:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ _classCallCheck; }
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ 144:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ _createClass; }
/* harmony export */ });
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/* unused harmony export MessageRouter */
/* harmony import */ var _mypart_tmc_projects_chrome_extensions_stack_buddy_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(671);
/* harmony import */ var _mypart_tmc_projects_chrome_extensions_stack_buddy_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(144);
var MessageRouter=/*#__PURE__*/function(){function MessageRouter(){(0,_mypart_tmc_projects_chrome_extensions_stack_buddy_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(this,MessageRouter);this._messageListeners={};}(0,_mypart_tmc_projects_chrome_extensions_stack_buddy_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(MessageRouter,[{key:"route",value:function route(message,port){if(message.messageType in this._messageListeners){this._messageListeners[message.messageType].forEach(function(listener){listener.listener(message,port);});}}// public recv(message: TMessage<any>, port: chrome.runtime.Port) {
//   this.route(message, port);
// }
},{key:"recvMessageFromWire",value:function recvMessageFromWire(message,port){this.route(message,port);}},{key:"recvMessageFromWire2",value:function recvMessageFromWire2(message,sender,sendResponse){if(message.messageType in this._messageListeners){this._messageListeners[message.messageType].forEach(function(listener){listener.listener(message,sender,sendResponse);});}}},{key:"registerListener2",value:function registerListener2(key,listener){if(!this._messageListeners[key]){this._messageListeners[key]=[];}// @ts-ignore - port missing
this._messageListeners[key].push({listener:listener});console.log("Registered Listeners",this._messageListeners);}},{key:"getListeners",value:function getListeners(key){return this._messageListeners[key]||[];}},{key:"putMessageOnTheWire",value:function putMessageOnTheWire(message,port){if(message.messageType in this._messageListeners){this._messageListeners[message.messageType].forEach(function(listener){listener.port.postMessage(message);});}}},{key:"registerListener",value:function registerListener(key,listener){if(!this._messageListeners[key]){this._messageListeners[key]=[];}this._messageListeners[key].push(listener);console.log("Registered Listeners",this._messageListeners);}},{key:"removeAllListeners",value:function removeAllListeners(key){MessageRouter._instance._messageListeners[key]=[];}}],[{key:"getInstance",value:function getInstance(){if(!MessageRouter._instance){MessageRouter._instance=new MessageRouter();}return MessageRouter._instance;}}]);return MessageRouter;}();MessageRouter._instance=void 0;MessageRouter.sendMessageToActiveTab=function(message,responseHandler){//
//   This has not been tested here - use at your own risk
//
// avoid using this.  It requires user have formstack form page open
// and in-focus.   Have page open but not active window - this will not seed
// and will log error condition
chrome.tabs.query({active:true,currentWindow:true},function(tabs){console.log("sending message to front end",{message:message,tabs:tabs});if(tabs.length===0){console.log("No active tab found",{tabs:tabs});}else{// @ts-ignore
chrome.tabs.sendMessage(tabs[0].id,message,function(response){// console.log("Received message response", { response });
if(chrome.runtime.lastError){console.log("background chrome.runtime.lastError",{lastError:chrome.runtime.lastError});}else{// console.log("background received response", response);
responseHandler(response);}});}});};
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFNBQVV3QixRQUFWLENBQW9CLENBQy9EO0FBRUEsR0FBSVIsTUFBTSxDQUFDUyxPQUFQLENBQWVDLFNBQW5CLENBQThCLENBQzVCaEIsT0FBTyxDQUFDQyxHQUFSLENBQVkscUNBQVosQ0FBbUQsQ0FDakRlLFNBQVMsQ0FBRVYsTUFBTSxDQUFDUyxPQUFQLENBQWVDLFNBRHVCLENBQW5ELEVBR0QsQ0FKRCxJQUlPLENBQ0w7QUFDQVgsZUFBZSxDQUFDUyxRQUFELENBQWYsQ0FDRCxDQUNGLENBWEQsRUFZRCxDQUNGLENBbkJELEVBb0JELEUiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9jbGFzc0NhbGxDaGVjay5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9jcmVhdGVDbGFzcy5qcyIsIi4uL3dlYnBhY2svYm9vdHN0cmFwIiwiLi4vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwiLi4vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsImNocm9tZS1leHRlbnNpb24vTWVzc2FnZVJvdXRlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufSIsImZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb25zdHJ1Y3RvciwgXCJwcm90b3R5cGVcIiwge1xuICAgIHdyaXRhYmxlOiBmYWxzZVxuICB9KTtcbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCJpbXBvcnQgeyBUTWVzc2FnZSwgVE1lc3NhZ2VUeXBlcyB9IGZyb20gXCIuL1RNZXNzYWdlXCI7XG50eXBlIFRNZXNzYWdlTGlzdGVuZXIgPSB7XG4gIGxpc3RlbmVyOiBGdW5jdGlvbjtcbiAgcG9ydDogY2hyb21lLnJ1bnRpbWUuUG9ydDtcbn07XG5cbmV4cG9ydCBjbGFzcyBNZXNzYWdlUm91dGVyIHtcbiAgcHJpdmF0ZSBfbWVzc2FnZUxpc3RlbmVyczogeyBbcm91dGluZ1RhZzogc3RyaW5nXTogVE1lc3NhZ2VMaXN0ZW5lcltdIH0gPSB7fTtcbiAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBNZXNzYWdlUm91dGVyO1xuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cblxuICBwdWJsaWMgcm91dGUobWVzc2FnZTogVE1lc3NhZ2U8YW55PiwgcG9ydD86IGNocm9tZS5ydW50aW1lLlBvcnQpIHtcbiAgICBpZiAobWVzc2FnZS5tZXNzYWdlVHlwZSBpbiB0aGlzLl9tZXNzYWdlTGlzdGVuZXJzKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlTGlzdGVuZXJzW21lc3NhZ2UubWVzc2FnZVR5cGVdLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XG4gICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyKG1lc3NhZ2UsIHBvcnQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gcHVibGljIHJlY3YobWVzc2FnZTogVE1lc3NhZ2U8YW55PiwgcG9ydDogY2hyb21lLnJ1bnRpbWUuUG9ydCkge1xuICAvLyAgIHRoaXMucm91dGUobWVzc2FnZSwgcG9ydCk7XG4gIC8vIH1cblxuICBwdWJsaWMgcmVjdk1lc3NhZ2VGcm9tV2lyZShtZXNzYWdlOiBUTWVzc2FnZTxhbnk+LCBwb3J0OiBjaHJvbWUucnVudGltZS5Qb3J0KSB7XG4gICAgdGhpcy5yb3V0ZShtZXNzYWdlLCBwb3J0KTtcbiAgfVxuXG4gIHB1YmxpYyByZWN2TWVzc2FnZUZyb21XaXJlMihcbiAgICBtZXNzYWdlOiBUTWVzc2FnZTxhbnk+LFxuICAgIHNlbmRlcjogY2hyb21lLnJ1bnRpbWUuTWVzc2FnZVNlbmRlcixcbiAgICBzZW5kUmVzcG9uc2U6IEZ1bmN0aW9uXG4gICkge1xuICAgIGlmIChtZXNzYWdlLm1lc3NhZ2VUeXBlIGluIHRoaXMuX21lc3NhZ2VMaXN0ZW5lcnMpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VMaXN0ZW5lcnNbbWVzc2FnZS5tZXNzYWdlVHlwZV0uZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcbiAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIobWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyTGlzdGVuZXIyKGtleTogVE1lc3NhZ2VUeXBlcywgbGlzdGVuZXI6IEZ1bmN0aW9uKSB7XG4gICAgaWYgKCF0aGlzLl9tZXNzYWdlTGlzdGVuZXJzW2tleV0pIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VMaXN0ZW5lcnNba2V5XSA9IFtdO1xuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmUgLSBwb3J0IG1pc3NpbmdcbiAgICB0aGlzLl9tZXNzYWdlTGlzdGVuZXJzW2tleV0ucHVzaCh7IGxpc3RlbmVyIH0pO1xuICAgIGNvbnNvbGUubG9nKFwiUmVnaXN0ZXJlZCBMaXN0ZW5lcnNcIiwgdGhpcy5fbWVzc2FnZUxpc3RlbmVycyk7XG4gIH1cblxuICBwdWJsaWMgZ2V0TGlzdGVuZXJzKGtleTogc3RyaW5nKTogVE1lc3NhZ2VMaXN0ZW5lcltdIHtcbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZUxpc3RlbmVyc1trZXldIHx8IFtdO1xuICB9XG5cbiAgcHVibGljIHB1dE1lc3NhZ2VPblRoZVdpcmUobWVzc2FnZTogVE1lc3NhZ2U8YW55PiwgcG9ydD86IGNocm9tZS5ydW50aW1lLlBvcnQpIHtcbiAgICBpZiAobWVzc2FnZS5tZXNzYWdlVHlwZSBpbiB0aGlzLl9tZXNzYWdlTGlzdGVuZXJzKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlTGlzdGVuZXJzW21lc3NhZ2UubWVzc2FnZVR5cGVdLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XG4gICAgICAgIGxpc3RlbmVyLnBvcnQucG9zdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJMaXN0ZW5lcihcbiAgICBrZXk6IFRNZXNzYWdlVHlwZXMsXG4gICAgbGlzdGVuZXI6IFRNZXNzYWdlTGlzdGVuZXJcbiAgICAvLyBwb3J0OiBjaHJvbWUucnVudGltZS5Qb3J0XG4gICkge1xuICAgIGlmICghdGhpcy5fbWVzc2FnZUxpc3RlbmVyc1trZXldKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlTGlzdGVuZXJzW2tleV0gPSBbXTtcbiAgICB9XG4gICAgdGhpcy5fbWVzc2FnZUxpc3RlbmVyc1trZXldLnB1c2gobGlzdGVuZXIpO1xuICAgIGNvbnNvbGUubG9nKFwiUmVnaXN0ZXJlZCBMaXN0ZW5lcnNcIiwgdGhpcy5fbWVzc2FnZUxpc3RlbmVycyk7XG4gIH1cblxuICByZW1vdmVBbGxMaXN0ZW5lcnMoa2V5OiBUTWVzc2FnZVR5cGVzKSB7XG4gICAgTWVzc2FnZVJvdXRlci5faW5zdGFuY2UuX21lc3NhZ2VMaXN0ZW5lcnNba2V5XSA9IFtdO1xuICB9XG5cbiAgc3RhdGljIGdldEluc3RhbmNlKCk6IE1lc3NhZ2VSb3V0ZXIge1xuICAgIGlmICghTWVzc2FnZVJvdXRlci5faW5zdGFuY2UpIHtcbiAgICAgIE1lc3NhZ2VSb3V0ZXIuX2luc3RhbmNlID0gbmV3IE1lc3NhZ2VSb3V0ZXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIE1lc3NhZ2VSb3V0ZXIuX2luc3RhbmNlO1xuICB9XG5cbiAgc3RhdGljIHNlbmRNZXNzYWdlVG9BY3RpdmVUYWIgPSAobWVzc2FnZTogVE1lc3NhZ2U8YW55PiwgcmVzcG9uc2VIYW5kbGVyOiBGdW5jdGlvbikgPT4ge1xuICAgIC8vXG4gICAgLy8gICBUaGlzIGhhcyBub3QgYmVlbiB0ZXN0ZWQgaGVyZSAtIHVzZSBhdCB5b3VyIG93biByaXNrXG4gICAgLy9cbiAgICAvLyBhdm9pZCB1c2luZyB0aGlzLiAgSXQgcmVxdWlyZXMgdXNlciBoYXZlIGZvcm1zdGFjayBmb3JtIHBhZ2Ugb3BlblxuICAgIC8vIGFuZCBpbi1mb2N1cy4gICBIYXZlIHBhZ2Ugb3BlbiBidXQgbm90IGFjdGl2ZSB3aW5kb3cgLSB0aGlzIHdpbGwgbm90IHNlZWRcbiAgICAvLyBhbmQgd2lsbCBsb2cgZXJyb3IgY29uZGl0aW9uXG4gICAgY2hyb21lLnRhYnMucXVlcnkoeyBhY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWUgfSwgZnVuY3Rpb24gKHRhYnMpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBzZW5kaW5nIG1lc3NhZ2UgdG8gZnJvbnQgZW5kYCwgeyBtZXNzYWdlLCB0YWJzIH0pO1xuICAgICAgaWYgKHRhYnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTm8gYWN0aXZlIHRhYiBmb3VuZFwiLCB7IHRhYnMgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQsIG1lc3NhZ2UsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVjZWl2ZWQgbWVzc2FnZSByZXNwb25zZVwiLCB7IHJlc3BvbnNlIH0pO1xuXG4gICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJiYWNrZ3JvdW5kIGNocm9tZS5ydW50aW1lLmxhc3RFcnJvclwiLCB7XG4gICAgICAgICAgICAgIGxhc3RFcnJvcjogY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYmFja2dyb3VuZCByZWNlaXZlZCByZXNwb25zZVwiLCByZXNwb25zZSk7XG4gICAgICAgICAgICByZXNwb25zZUhhbmRsZXIocmVzcG9uc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59XG4iXSwibmFtZXMiOlsiTWVzc2FnZVJvdXRlciIsIl9tZXNzYWdlTGlzdGVuZXJzIiwibWVzc2FnZSIsInBvcnQiLCJtZXNzYWdlVHlwZSIsImZvckVhY2giLCJsaXN0ZW5lciIsInJvdXRlIiwic2VuZGVyIiwic2VuZFJlc3BvbnNlIiwia2V5IiwicHVzaCIsImNvbnNvbGUiLCJsb2ciLCJwb3N0TWVzc2FnZSIsIl9pbnN0YW5jZSIsInNlbmRNZXNzYWdlVG9BY3RpdmVUYWIiLCJyZXNwb25zZUhhbmRsZXIiLCJjaHJvbWUiLCJ0YWJzIiwicXVlcnkiLCJhY3RpdmUiLCJjdXJyZW50V2luZG93IiwibGVuZ3RoIiwic2VuZE1lc3NhZ2UiLCJpZCIsInJlc3BvbnNlIiwicnVudGltZSIsImxhc3RFcnJvciJdLCJzb3VyY2VSb290IjoiIn0=