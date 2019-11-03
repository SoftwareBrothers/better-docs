const input =
`
/**
 * JSON representation of an {@link Action}
 * @see Action
 */
export default interface ActionJSON {
  /**
   * Unique action name
   */
  name: string;
  /**
   * Type of an action
   */
  actionType: 'record' | 'resource' | Array<'record' | 'resource'>;
  /**
   * Action icon
   */
  icon?: string;
  /**
   * Action label - visible on the frontend
   */
  label: string;
  /**
   * Guarding message
   */
  guard?: string;
  /**
   * If action should have a filter (for resource actions)
   */
  showFilter: boolean;
  /**
   * Action component. When set to false action will be invoked immediately after clicking it,
   * to put in another words: tere wont be an action view
   */
  component?: string | false | null;
}
`

const outputs = [
  // main interface
  '* JSON representation of an {@link Action}',
  '* @see Action',
  '* @interface ActionJSON',

  // representation of a name property
  '* Unique action name',
  '* @name ActionJSON#name',
  '* @type {string}',

  // representation for an action property
  '* Type of an action',
  '* @name ActionJSON#actionType',
  '* @type {\'record\' | \'resource\' | Array<\'record\' | \'resource\'>}',
]

module.exports = {
  input,
  outputs,
}