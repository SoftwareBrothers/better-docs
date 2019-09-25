import editor from 'vue2-ace-editor'
import _ from 'underscore'

export default {
  template: `
    <div ref="wrapperBox">
      <component :is="userComponent"></component>
      <p class="bd__button"><a href="#" @click.prevent="toggleEditor">Modify Example Code</a></p>
      <div style="margin-bottom: 20px" v-show="isActive">
        <editor
          v-model="code"
          @init="editorInit"
          lang="jsx"
          theme="monokai"
          width="100%"
          height="200"
          mode="jsx">
        </editor>
      </div>
    </div>
  `,
  props: {
    defaultCode: String
  },
  data: function () {
    return {
      code: this.defaultCode,
      userComponent: this.renderComponent(this.defaultCode),
      isActive: false,
    }
  },
  components: {editor},
  created: function () {
    this.debounceRenderComponent = _.debounce(this.renderComponent, 500).bind(this)
  },
  methods: {
    toggleEditor: function () {
      this.isActive = !this.isActive
    },
    editorInit: function () {
      require('brace/ext/language_tools') //language extension prerequsite...      
      require('brace/mode/jsx')    //language
      require('brace/theme/monokai')
    },
    renderComponent: function (originalCode) {
      const code = originalCode || this.code
      let json = {}
      try {
        if (code && code.length && code[0] === '{') {
          json = eval('(' + code + ')')
        }
      } catch(e) {
        // simply example is not a json object
      }

      try {
        json.components = vueComponents
        json.template = json.template || code
        const component = Vue.component('user-component', json)
        this.userComponent = component
        return component
      } catch (error) {
        console.log(error)
      }
    }
  },
  updated: function () {
    this.$nextTick(function () {
      window.updateHeight(this.$refs.wrapperBox.clientHeight)
    })
  },
  mounted: function () {
    this.$nextTick(function () {
      window.updateHeight(this.$refs.wrapperBox.clientHeight)
    })
  },
  watch: {
    // whenever question changes, this function will run
    code: function (newCode, oldCode) {
      this.debounceRenderComponent(newCode)
    }
  },
}