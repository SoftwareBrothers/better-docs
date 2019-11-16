const input =
`
/**
 * Represents an application service's registration file. This is expected to be
 * loaded from another source, such as a YAML file.
 * @category Application services
 */
export interface IAppserviceRegistration {
    /**
     * The various namespaces the application service can support.
     */
    namespaces: {
        /**
         * The room alias namespaces the application service is requesting.
         */
        aliases: {
            /**
             * Whether or not the application service holds an exclusive lock on the namespace. This means
             * that no other user on the homeserver may register aliases that match this namespace.
             */
            exclusive: boolean;

            /**
             * The regular expression that the homeserver uses to determine if an alias is in this namespace.
             */
            regex: string;
        }[];
    };
}
`

const outputs = [
  '* @property {Array} aliases   The room alias namespaces the application service is requesting.',
  '* @property {boolean} aliases[].exclusive   Whether or not the application service holds an exclusive lock on the namespace. This means,',
  '* that no other user on the homeserver may register aliases that match this namespace.',
  '* @property {string} aliases[].regex   The regular expression that the homeserver uses to determine if an alias is in this namespace.',
  '* @type {object}',
]

module.exports = {
  input,
  outputs,
}