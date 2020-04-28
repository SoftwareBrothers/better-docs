const input =
`
/**
 * Some comment
 */
export type RecordActionAPIParams = AxiosRequestConfig & {
  /**
   * Id of a record taken from {@link RecordJSON}
   */
  recordId: string;
}
`

const outputs = [
  '/**',
  '* Some comment',
  '* @typedef {object} RecordActionAPIParams',
  '* @property {string} recordId   Id of a record taken from {@link RecordJSON}',
  '*/',
]


module.exports = {
  input,
  outputs,
}