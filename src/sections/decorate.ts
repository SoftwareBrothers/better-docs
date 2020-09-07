import fs from 'fs'
import path from 'path'

export const SECTIONS_CONFIG_FILE_NAME = 'sections.json'

export type SectionNav = {
  /**
   * Rendered navigation
   */
  nav: string;
}

/**
 * Type of the sections.json file
 */
export type SectionsJSON = {
  [name: string]: {
    title: string;
  };
}

export type SectionInStore = {
  /**
   * Parsed navigation
   */
  nav: string;
  /**
   * unique name (downcased) of the section used to identify it
   */
  name: string;
  /**
   * Link href of the section button. Default to the first element in the list
   */
  href: string;
  /**
   * Section title
   */
  title: string;
  /**
   * Path to the section file
   */
  homePath?: string;
  /**
   * Loaded content of the file
   */
  homeBody?: string;
  /**
   * In which order it should go on the list
   */
  order?: number;
}

export type SectionConfig = {
  title?: string;
  homePath?: string;
  homeBody?: string;
}

/**
 * Builds file name for given section
 * @param section
 */
export function buildFileName(section: string): string {
  return `section-${section.toLowerCase()}.html`
}

/**
 * Normalizes section name so it can be used as a key to search for files
 *
 * @param section
 */
export function buildKey(section: string): string {
  return section.toLowerCase()
}


const loadConfig = (sectionConfigPath?: string): Record<string, SectionConfig> | null => {
  if (!sectionConfigPath) {
    return null
  }

  const files = fs.readdirSync(sectionConfigPath)

  const configFile = files.find(file => file === SECTIONS_CONFIG_FILE_NAME)
  const jsonConfig: SectionsJSON = configFile
    ? JSON.parse(fs.readFileSync(path.join(sectionConfigPath, configFile), 'utf8'))
    : {}

  return files.filter(file => path.parse(file).ext === '.md').reduce((memo, file) => {
    const name = buildKey(path.parse(file).name)
    const config = jsonConfig[name]
    const { title } = config || {}
    const homePath = path.join(sectionConfigPath, file)
    const homeBody = fs.readFileSync(homePath, 'utf8')

    return {
      ...memo,
      [name]: {
        title,
        homePath,
        homeBody,
      },
    }
  }, {})
}

/**
 *
 * @param {Record<string, SectionNav>} sections
 * @param {string} [sectionConfigPath]
 */
export function decorateSections(
  sections: Record<string, SectionNav> = {},
  sectionConfigPath?: string,
): Record<string, SectionInStore> {
  const config = loadConfig(sectionConfigPath) || {}

  return Object.keys(sections).reduce((memo, sectionName, index) => {
    const name = buildKey(sectionName)
    const originalSection = sections[sectionName]
    const configSection = config[name] || null

    // setup default values
    let title = sectionName

    // first href in the navigation by default will be the link
    const hrefMatch = originalSection.nav.match(/href="(.*?)"/)
    let href = hrefMatch && hrefMatch[1]

    let { nav } = originalSection

    // on which place should it go to navigation. By default some big number
    let order = 1000 + index

    if (configSection) {
      href = buildFileName(sectionName)
      if (configSection.title) {
        ({ title } = configSection)
      }
      nav = `<h2><a href="${href}">${title}</a></h2>${nav}`
      order = Object.keys(config).indexOf(name)
    }

    return {
      ...memo,
      [name]: {
        name,
        nav,
        title,
        href,
        order,
        homeBody: configSection?.homeBody,
        homePath: configSection?.homePath,
      },
    }
  }, {})
}
