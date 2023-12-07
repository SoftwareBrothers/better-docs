"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _brace = _interopRequireDefault(require("brace"));
var _reactAce = _interopRequireDefault(require("react-ace"));
var _reactFrameComponent = _interopRequireWildcard(require("react-frame-component"));
require("brace/mode/jsx");
require("brace/theme/monokai");
var _componentRenderer = _interopRequireDefault(require("./component-renderer"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
window.component = null;
var Wrapper = /*#__PURE__*/function (_React$Component) {
  _inherits(Wrapper, _React$Component);
  var _super = _createSuper(Wrapper);
  function Wrapper(props) {
    var _this;
    _classCallCheck(this, Wrapper);
    _this = _super.call(this, props);
    window.component = window.component || {};
    _this.iframeRef = /*#__PURE__*/_react["default"].createRef();
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.toggleEditor = _this.toggleEditor.bind(_assertThisInitialized(_this));
    var example = props.example;
    example = example || 'return (<div>Example</div>)';
    _this.state = {
      example: example,
      height: 200,
      showEditor: false
    };
    _this.executeScript(example);
    return _this;
  }
  _createClass(Wrapper, [{
    key: "executeScript",
    value: function executeScript(source) {
      var uniqId = this.props.uniqId;
      var script = document.createElement('script');
      var self = this;
      script.onload = script.onerror = function () {
        this.remove();
        self.setState(function (state) {
          return _objectSpread(_objectSpread({}, state), {}, {
            component: window.component[uniqId] || ''
          });
        });
      };
      var wrapper = "window.component['".concat(uniqId, "'] = (() => {\n      ").concat(Object.keys(reactComponents).map(function (k) {
        return "const ".concat(k, " = reactComponents['").concat(k, "'];");
      }).join('\n'), "\n      try {\n        ").concat(source, "\n      } catch (error) {\n        console.log(error)\n      }\n    })()");
      try {
        var src = Babel.transform(wrapper, {
          presets: ['react', 'es2015']
        }).code;
        script.src = 'data:text/plain;base64,' + btoa(src);
      } catch (error) {
        console.log(error);
      }
      document.body.appendChild(script);
    }
  }, {
    key: "handleChange",
    value: function handleChange(code) {
      this.executeScript(code);
      this.setState(function (state) {
        return _objectSpread(_objectSpread({}, state), {}, {
          example: code
        });
      });
    }
  }, {
    key: "computeHeight",
    value: function computeHeight() {
      var height = this.state.height;
      var padding = 5; // buffer for any unstyled margins
      if (this.iframeRef.current && this.iframeRef.current.contentDocument && this.iframeRef.current.contentDocument.body && this.iframeRef.current.contentDocument.body.offsetHeight !== 0 && this.iframeRef.current.contentDocument.body.offsetHeight !== height - padding) {
        this.setState({
          height: this.iframeRef.current.contentDocument.body.offsetHeight + padding
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.computeHeight();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;
      this.heightInterval = setInterval(function () {
        _this2.computeHeight();
      }, 1000);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearInterval(this.heightInterval);
    }
  }, {
    key: "toggleEditor",
    value: function toggleEditor(event) {
      event.preventDefault();
      this.setState(function (state) {
        return _objectSpread(_objectSpread({}, state), {}, {
          showEditor: !state.showEditor
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var _this$state = this.state,
        component = _this$state.component,
        height = _this$state.height,
        showEditor = _this$state.showEditor;
      return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_reactFrameComponent["default"], {
        className: "component-wrapper",
        ref: this.iframeRef,
        style: {
          width: '100%',
          height: height
        },
        onLoad: this.computeHeight()
      }, /*#__PURE__*/_react["default"].createElement("link", {
        type: "text/css",
        rel: "stylesheet",
        href: "./build/entry.css"
      }), /*#__PURE__*/_react["default"].createElement(_reactFrameComponent.FrameContextConsumer, null, function (frameContext) {
        return /*#__PURE__*/_react["default"].createElement(_componentRenderer["default"], {
          frameContext: frameContext
        }, component);
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "bd__button"
      }, /*#__PURE__*/_react["default"].createElement("a", {
        href: "#",
        onClick: this.toggleEditor
      }, "Modify Example Code")), showEditor ? /*#__PURE__*/_react["default"].createElement("div", {
        className: "field"
      }, /*#__PURE__*/_react["default"].createElement(_reactAce["default"], {
        style: {
          width: '100%',
          height: '200px',
          marginBottom: '20px'
        },
        value: this.state.example,
        mode: "jsx",
        theme: "monokai",
        onChange: function onChange(code) {
          return _this3.handleChange(code);
        },
        name: "editor-div",
        editorProps: {
          $useSoftTabs: true
        }
      })) : '');
    }
  }]);
  return Wrapper;
}(_react["default"].Component);
var _default = exports["default"] = function _default(props) {
  return /*#__PURE__*/_react["default"].createElement(Wrapper, props);
};