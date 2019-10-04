const input =
`
/**
 * ActionRequest
 * @memberof Action
 * @alias ActionRequest
 */
export type ActionRequest = {
  /**
   * parameters passed in an URL
   */
  params: {
    /**
     * Id of current resource
     */
    resourceId: string;
    /**
     * Id of current record
     */
    recordId?: string;
    /**
     * Name of an action
     */
    action: string;

    [key: string]: any;
  };
}
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