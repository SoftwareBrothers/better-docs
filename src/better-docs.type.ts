export type NavButton = {
  label: string;
  href: string;
  target: string;
  className?: string;
}

export type NavLink = {
  label: string;
  href: string;
  className?: string;
}

export type OgTags = {
  /**
   * Value for @ogTitle tag
   */
  title?: string;
  /**
   * Value for @ogDescription tag
   */
  description?: string;
  /**
   * Value for @ogImage tag
   */
  image?: string;
  /**
   * Value for @ogLocale tag
   */
  locale?: string;
  /**
   * Value for @ogUrl tag
   */
  url?: string;
  /**
   * Value for @ogType tag
   */
  type?: string;
}

export type BetterDocsConfig = {
  /**
   * Path to the landing page
   */
  landing?: string;
  /**
   * Logo
   */
  logo?: string;
  /**
   * Page Title
   */
  title?: string;
  /**
   * Default OgTags
   */
  ogTags: OgTags;
  /**
   * Component config
   */
  component?: {
    /**
     * Wrapping Component
     */
    wrapper: string;
  };
  /**
   * Tracking code
   */
  trackingCode?: string;
  /**
   * Custom text injected to the HEAD
   */
  head?: string;

  /**
   * NavButtons showed in the TOP section
   */
  navButtons: Array<NavButton>;
  /**
   * Navigation links
   */
  navLinks: Array<NavLink>;

  /**
   * Indicates if SoftwareBrothers logo should be seen in the UI
   */
  softwareBrothers?: false | true | 'slightly-paranoid' | 'paranoid';
}
