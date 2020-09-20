export type JSDocTag = {
  originalTitle: string;
  title: string;
  value: string;
  text: string;
}

export type DocLet = {
  comment: string;
  meta:
   { range: [any];
     filename: string;
     lineno: number;
     columnno: number;
     path: string;
     code: [any];
  };
  classdesc?: string;
  description?: string;
}
