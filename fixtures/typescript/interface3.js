const input =
`
/**
 * Represents a logger
 * @category Logging
 */
export interface ILogger {
    /**
     * Logs to the INFO channel
     * @param {string} module The module being logged
     * @param {any[]} messageOrObject The data to log
     */
    info(module: string, ...messageOrObject: any[]);
}
`

const outputs = [
  '* @name ILogger#info',
  '* @type {function}',
  '* @method',
]

module.exports = {
  input,
  outputs,
}