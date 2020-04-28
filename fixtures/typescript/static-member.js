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

  someMethod() {
    const a = {g: 1}
    return a?.g
  }
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