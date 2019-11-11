const input =
`
/**
 * Class name
 */
class ClassName {
  /**
   * Static member
   */
  static somethingIs: number
}
`

const outputs = [
  '* @type {number}',
  'ClassName.somethingIs',
]


module.exports = {
  input,
  outputs,
}