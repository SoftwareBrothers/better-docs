import React from 'react'

import brace from 'brace';
import AceEditor from 'react-ace'

import 'brace/mode/jsx';
import 'brace/theme/monokai';
import ComponentRenderer from './component-renderer'

window.component = null

class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    window.component = window.component || {}
    this.handleChange = this.handleChange.bind(this)
    let { example } = props
    example = example || 'return (<div>Example</div>)'
    this.state = {
      example,
    }
    this.executeScript(example)
  }

  executeScript(source) {
    const { uniqId } = this.props
    const script = document.createElement('script');
    const self = this
    script.onload = script.onerror = function() {
      this.remove();
      self.setState(state =>({
        ...state,
        component: window.component[uniqId] || '',
      }))
    };
    const wrapper = `window.component['${uniqId}'] = (() => {
      ${Object.keys(Components).map(k => `const ${k} = Components.${k};`).join('\n')}
      try {
        ${source}
      } catch (error) {
        console.log(error)
      }
    })()`
    try {
      const src = Babel.transform(wrapper, { presets: ['react', 'es2015'] }).code;
      script.src = "data:text/plain;base64," + btoa(src);
    } catch (error) {
      console.log(error);
    }
    
    document.body.appendChild(script);
  }

  handleChange(code) {
    this.executeScript(code)
    this.setState(state => ({
      ...state,
      example: code,
    }))
  }

  render () {
    const { component } = this.state
    return (
      <div>
        <div>
          <div className="field">
            <AceEditor
              style={{width: '100%', height: '200px', marginBottom: '20px'}}
              value={this.state.example}
              mode="jsx"
              theme="monokai"
              onChange={(code) => this.handleChange(code)}
              name="editor-div"
              editorProps={{ $useSoftTabs: true }}
            />
          </div>
        </div>
        <div>
          <h5>Preview</h5>
          <div className="component-wrapper">
            <ComponentRenderer>
              {component}
            </ComponentRenderer>
          </div>
        </div>
      </div>
    )
  }
}

export default (props) => {
  return (
    <Wrapper {...props} />
  )
}