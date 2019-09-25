"use strict";

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

window.component = null;

var Wrapper =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Wrapper, _React$Component);

  function Wrapper(props) {
    var _this;

    _classCallCheck(this, Wrapper);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Wrapper).call(this, props));
    window.component = window.component || {};
    _this.iframeRef = _react["default"].createRef();
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
          return _objectSpread2({}, state, {
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
        return _objectSpread2({}, state, {
          example: code
        });
      });
    }
  }, {
    key: "computeHeight",
    value: function computeHeight() {
      var height = this.state.height;
      var padding = 5; // buffer for any unstyled margins

      if (this.iframeRef.current && this.iframeRef.current.node.contentDocument && this.iframeRef.current.node.contentDocument.body.offsetHeight !== 0 && this.iframeRef.current.node.contentDocument.body.offsetHeight !== height - padding) {
        this.setState({
          height: this.iframeRef.current.node.contentDocument.body.offsetHeight + padding
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
        return _objectSpread2({}, state, {
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
      return _react["default"].createElement("div", null, _react["default"].createElement(_reactFrameComponent["default"], {
        className: "component-wrapper",
        ref: this.iframeRef,
        style: {
          width: '100%',
          height: height
        },
        onLoad: this.computeHeight()
      }, _react["default"].createElement("link", {
        type: "text/css",
        rel: "stylesheet",
        href: "./build/entry.css"
      }), _react["default"].createElement(_reactFrameComponent.FrameContextConsumer, null, function (frameContext) {
        return _react["default"].createElement(_componentRenderer["default"], {
          frameContext: frameContext
        }, component);
      })), _react["default"].createElement("div", {
        className: "bd__button"
      }, _react["default"].createElement("a", {
        href: "#",
        onClick: this.toggleEditor
      }, "Modify Example Code")), showEditor ? _react["default"].createElement("div", {
        className: "field"
      }, _react["default"].createElement(_reactAce["default"], {
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

var _default = function _default(props) {
  return _react["default"].createElement(Wrapper, props);
};

exports["default"] = _default;