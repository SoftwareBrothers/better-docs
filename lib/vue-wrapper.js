"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue2AceEditor = _interopRequireDefault(require("vue2-ace-editor"));

var _underscore = _interopRequireDefault(require("underscore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  template: "\n    <div>\n      <label>Code:</label>\n      <div style=\"margin-bottom: 20px\">\n        <editor\n          v-model=\"code\"\n          @init=\"editorInit\"\n          lang=\"html\"\n          theme=\"monokai\"\n          width=\"100%\"\n          height=\"200\"\n          mode=\"jsx\">\n        </editor>\n      </div>\n      <component :is=\"userComponent\"></component>\n    </div>\n  ",
  props: {
    defaultCode: String
  },
  data: function data() {
    return {
      code: this.defaultCode,
      userComponent: Vue.component('user-component', {
        template: this.defaultCode,
        components: Components
      })
    };
  },
  components: {
    editor: _vue2AceEditor["default"]
  },
  created: function created() {
    this.debounceRenderComponent = _underscore["default"].debounce(this.renderComponent, 500).bind(this);
  },
  methods: {
    editorInit: function editorInit() {
      require('brace/ext/language_tools'); //language extension prerequsite...      


      require('brace/mode/html'); //language


      require('brace/theme/monokai');
    },
    renderComponent: function renderComponent(code) {
      try {
        var component = Vue.component('user-component', {
          template: this.code,
          components: Components
        });
        this.userComponent = component;
      } catch (error) {
        console.log(error);
      }
    }
  },
  watch: {
    // whenever question changes, this function will run
    code: function code(newCode, oldCode) {
      this.debounceRenderComponent(newCode);
    }
  }
};
exports["default"] = _default;