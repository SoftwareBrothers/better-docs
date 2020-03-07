const input =
`
/**
 * @alias BuildHandlerOptions
 *
 * @memberof module:admin-bro-firebase-functions
 */
export type BuildHandlerOptions = {
  /** Function region */
  region: string;
  /** Optional before async hook which can be used to initialize database */
  before?: () => Promise<any>;
  /** 
   * custom authentication options
   */
  auth?: {
    /** 
     * secret which is used to encrypt the session cookie
     */
    secret: string;
    /** 
     * authenticate function
     */
    authenticate?: (
      email: string,
      password: string) => Promise<CurrentAdmin | null> | CurrentAdmin | null;
  };
}
`

const outputs = [
  '/**',
  '* @property {object} [auth]   custom authentication options',
  '* @property {string} auth.secret   secret which is used to encrypt the session cookie',
  '* @property {function} [auth.authenticate]   authenticate function',
  '*/',
]


module.exports = {
  input,
  outputs,
}