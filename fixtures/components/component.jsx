import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Bold = styled.div`
  background: red;
  color: #fff;
  padding: 5px;
`

/**
 * Some documented component
 * 
 * @component
 * @example <caption>Default example</caption>
 * const text = 'Meva'
 * return (
 *   <Documented2>
 *     <Documented text={text} />
 *   </Documented2>
 * )
 * 
 * @example <caption>Ala ma kota</caption>
 * const text = 'some example text 2'
 * return (
 *   <Documented2>
 *     <Documented text={text} header={'sime'} />
 *   </Documented2>
 * )
 */
const Documented = (props) => {
  const { text, header } = props
  return (
    <p>
      {header}
      <Bold>
        {text}
      </Bold>
    </p>
  )
}

Documented.propTypes = {
  /**
   * Text is a text
   */
  text: PropTypes.string,
  header: PropTypes.string.isRequired,
}

Documented.defaultProps = {
  text: 'Hello World',
}

export default Documented
