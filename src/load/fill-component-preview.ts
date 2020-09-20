const regex = /^```reactComponent[\r\n]+(.*?)[\r\n]+```$/gms

export const fillComponentPreview = (text: string, mdParser): string => {
  let number = 0

  const components = {}

  const result = text.replace(regex, (match, group) => {
    const uniqId = ['BetterDocsPreviewComponent', number += 1].join('')

    components[uniqId] = `
      <div id="${uniqId}"></div>

      <script>
        ReactDOM.render(ReactWrapper({
          example: ${JSON.stringify(group)},
          uniqId: ${JSON.stringify(uniqId)},
        }), document.getElementById('${uniqId}'));
      </script>
    `

    return uniqId
  })

  let markdown = mdParser(result)

  Object.keys(components).forEach((componentId) => {
    markdown = markdown.replace(componentId, components[componentId])
  })

  return markdown
}
