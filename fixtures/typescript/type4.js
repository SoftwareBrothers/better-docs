const input =
`
/**
 * Button props
*/
type Button = {
  children: ReactNode;
  onClick: () => void;
};
`

const outputs = [
  '* Button props',
  '* @typedef {object} Button',
  '* @property {ReactNode} children',
  '* @property {function} onClick',
]


module.exports = {
  input,
  outputs,
}