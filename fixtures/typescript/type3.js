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
  '@property {Array} assets',
  '@property {string} assets[].path'
]


module.exports = {
  input,
  outputs,
}