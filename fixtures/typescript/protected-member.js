const input =
`
/**
 * Class name
 */
class ClassName {
  /**
   * Static member
   */
  protected protectedMember: string = 'I am protected'
}
`

const outputs = [
  '* @type {string}',
  '* @protected',
  'ClassName.prototype.protectedMember',
]


module.exports = {
  input,
  outputs,
}