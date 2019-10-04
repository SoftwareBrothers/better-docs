const input =
`
/**
 * Before action hook. When it is given - it is performed before the {@link ActionHandler}
 * method.
 * @alias Before
 * @memberof Action
 */
export type Before = (
  /**
   * Request object
   */
  request: ActionRequest
) => ActionRequest
`

const output = 
`/**
 * Before action hook. When it is given - it is performed before the {@link ActionHandler}
 * method.
 * @alias Before
 * @memberof Action
 * @typedef {function} Before
 * @param {ActionRequest} request   Request object
 * @return {ActionRequest}
 */
`


module.exports = {
  input,
  output,
}