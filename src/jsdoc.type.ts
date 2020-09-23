export type JSDocTag = {
  originalTitle: string;
  title: string;
  value: string;
  text: string;
}

export type DocLetBetterDocs = {
  new?: string;
}


export type DocLet = {
  /** an actual comment string with comment start and end */
  comment: string;
  meta:
   { range: [any];
     filename: string;
     lineno: number;
     columnno: number;
     path: string;
     code: [any];
     shortpath: string;
  };
  classdesc?: string;
  description?: string;
  deprecated?: string;
  name: string;
  longname: string;
  scope: string | 'global';
  kind: string | 'class';
  __id: string;
  __s: boolean;
  // '<span class="signature">()</span><span class="type-signature"></span>'
  signature?: 'string';
  rawAttribs?: Array<any>;
  ancestors?: Array<any>;
  tutorials?: Array<string>;
  children?: Array<any>;
} & DocLetBetterDocs
