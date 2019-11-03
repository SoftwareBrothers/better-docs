const input =
`
/**
 * Type representing the AdminBro.Router
 * @memberof AdminBro
 * @alias RouterType
 */
export type RouterType = {
  assets: Array<{
    path: string;
    src: string;
  }>;
  routes: Array<{
    method: string;
    path: string;
    Controller: any;
    action: string;
    contentType?: string;
  }>;
}
`

const outputs = [
  '* @memberof AdminBro',
  '* @alias RouterType',
  '* @typedef {object} RouterType',
  '* @property {Array<object>} assets',
  '* @property {string} assets[].path',
  '* @property {string} assets[].src',
  '* @property {Array<object>} routes',
  '* @property {string} routes[].method',
  '* @property {string} routes[].path',
  '* @property {any} routes[].Controller',
  '* @property {string} routes[].action',
  '* @property {string} [routes[].contentType]',
]


module.exports = {
  input,
  outputs,
}