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

const outputs = [
  '* ActionRequest',
  '* @memberof Action',
  '* @alias ActionRequest',
  '* @typedef {object} ActionRequest',
  '* @property {object} params   parameters passed in an URL',
  '* @property {string} params.resourceId   Id of current resource',
  '* @property {string} [params.recordId]   Id of current record',
  '* @property {string} params.action   Name of an action',
  '* @property {any} params.{...}',
]


module.exports = {
  input,
  outputs,
}