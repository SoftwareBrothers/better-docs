"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue2AceEditor = _interopRequireDefault(require("vue2-ace-editor"));

var _underscore = _interopRequireDefault(require("underscore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  template: "\n    <div ref=\"wrapperBox\">\n      <component :is=\"userComponent\"></component>\n      <p class=\"bd__button\"><a href=\"#\" @click.prevent=\"toggleEditor\">Modify Example Code</a></p>\n      <div style=\"margin-bottom: 20px\" v-show=\"isActive\">\n        <editor\n          v-model=\"code\"\n          @init=\"editorInit\"\n          lang=\"jsx\"\n          theme=\"monokai\"\n          width=\"100%\"\n          height=\"200\"\n          mode=\"jsx\">\n        </editor>\n      </div>\n    </div>\n  ",
  props: {
    defaultCode: String
  },
  data: function data() {
    return {
      code: this.defaultCode,
      userComponent: this.renderComponent(this.defaultCode),
      isActive: false
    };
  },
  components: {
    editor: _vue2AceEditor["default"]
  },
  created: function created() {
    this.debounceRenderComponent = _underscore["default"].debounce(this.renderComponent, 500).bind(this);
  },
  methods: {
    toggleEditor: function toggleEditor() {
      this.isActive = !this.isActive;
    },
    editorInit: function editorInit() {
      require('brace/ext/language_tools'); //language extension prerequsite...      


      require('brace/mode/jsx'); //language


      require('brace/theme/monokai');
    },
    renderComponent: function renderComponent(originalCode) {
      var code = originalCode || this.code;
      var json = {};

      try {
        if (code && code.length && code[0] === '{') {
          json = eval('(' + code + ')');
        }
      } catch (e) {// simply example is not a json object
      }

      try {
        json.components = vueComponents;
        json.template = json.template || code;
        var component = Vue.component('user-component', json);
        this.userComponent = component;
        return component;
      } catch (error) {
        console.log(error);
      }
    }
  },
  updated: function updated() {
    this.$nextTick(function () {
      window.updateHeight(this.$refs.wrapperBox.clientHeight);
    });
  },
  mounted: function mounted() {
    this.$nextTick(function () {
      window.updateHeight(this.$refs.wrapperBox.clientHeight);
    });
  },
  watch: {
    // whenever question changes, this function will run
    code: function code(newCode, oldCode) {
      this.debounceRenderComponent(newCode);
    }
  }
};
exports["default"] = _default;