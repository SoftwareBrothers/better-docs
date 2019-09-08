import editor from 'vue2-ace-editor'
import _ from 'underscore'

export default {
  template: `
    <div>
      <label>Code:</label>
      <div style="margin-bottom: 20px">
        <editor
          v-model="code"
          @init="editorInit"
          lang="html"
          theme="monokai"
          width="100%"
          height="200"
          mode="jsx">
        </editor>
      </div>
      <component :is="userComponent"></component>
    </div>
  `,
  props: {
    defaultCode: String
  },
  data: function () {
    return {
      code: this.defaultCode,
      userComponent: Vue.component('user-component', {
        template: this.defaultCode,
        components: Components,
      })
    }
  },
  components: {editor},
  created: function () {
    this.debounceRenderComponent = _.debounce(this.renderComponent, 500).bind(this)
  },
  methods: {
    editorInit: function () {
      require('brace/ext/language_tools') //language extension prerequsite...      
      require('brace/mode/html')    //language
      require('brace/theme/monokai')
    },
    renderComponent: function (code) {
      try {
        const component = Vue.component('user-component', {
          template: this.code,
          components: Components,
        })
        this.userComponent = component
      } catch (error) {
        console.log(error)
      }
    }
  },
  watch: {
    // whenever question changes, this function will run
    code: function (newCode, oldCode) {
      this.debounceRenderComponent(newCode)
    }
  },
}