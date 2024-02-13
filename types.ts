export interface ContributorResponse {
  managers: Manager[];
  moderators: Moderator[];
  editors: Editor[];
  segmenters: Segmenter[];
  subtitlers: Subtitler[];
}

export interface Manager {
  id: string;
  user: User;
  container: Container;
  role: string;
  language_code: any;
  created_at: string;
  close_role_banned: boolean;
}

export interface User {
  id: string;
  username: string;
  images?: Images;
}

export interface Images {
  avatar?: Avatar;
}

export interface Avatar {
  url?: string;
}

export interface Container {
  id: string;
  type: string;
  flags: Flags;
  titles: Titles;
  images: Images2;
  url: Url;
  i18n_title: string;
}

export interface Flags {
  licensed: boolean;
  hosted: boolean;
  state: string;
  adult: boolean;
  private_watch_party: boolean;
  on_air: boolean;
  exclusive: boolean;
  original: boolean;
}

export interface Titles {
  de: string;
  it: string;
  es: string;
  fr: string;
  zh: string;
  zt: string;
  pt: string;
  ko: string;
  ja: string;
  th: string;
  en: string;
}

export interface Images2 {
  poster: Poster;
}

export interface Poster {
  url: string;
  source: string;
}

export interface Url {
  web: string;
  api: string;
  fb: string;
}

export interface Moderator {
  id: string;
  user: User2;
  container: Container2;
  role: string;
  language_code?: string;
  created_at: string;
  close_role_banned: boolean;
}

export interface User2 {
  id: string;
  username: string;
  images: Images3;
}

export interface Images3 {
  avatar: Avatar2;
}

export interface Avatar2 {
  url: string;
}

export interface Container2 {
  id: string;
  type: string;
  flags: Flags2;
  titles: Titles2;
  images: Images4;
  url: Url2;
  i18n_title: string;
}

export interface Flags2 {
  licensed: boolean;
  hosted: boolean;
  state: string;
  adult: boolean;
  private_watch_party: boolean;
  on_air: boolean;
  exclusive: boolean;
  original: boolean;
}

export interface Titles2 {
  de: string;
  it: string;
  es: string;
  fr: string;
  zh: string;
  zt: string;
  pt: string;
  ko: string;
  ja: string;
  th: string;
  en: string;
}

export interface Images4 {
  poster: Poster2;
}

export interface Poster2 {
  url: string;
  source: string;
}

export interface Url2 {
  web: string;
  api: string;
  fb: string;
}

export interface Editor {
  id: string;
  user: User3;
  container: Container3;
  role: string;
  language_code: string;
  created_at: string;
  close_role_banned: boolean;
}

export interface User3 {
  id: string;
  username: string;
  images: Images5;
}

export interface Images5 {
  avatar: Avatar3;
}

export interface Avatar3 {
  url: string;
}

export interface Container3 {
  id: string;
  type: string;
  flags: Flags3;
  titles: Titles3;
  images: Images6;
  url: Url3;
  i18n_title: string;
}

export interface Flags3 {
  licensed: boolean;
  hosted: boolean;
  state: string;
  adult: boolean;
  private_watch_party: boolean;
  on_air: boolean;
  exclusive: boolean;
  original: boolean;
}

export interface Titles3 {
  de: string;
  it: string;
  es: string;
  fr: string;
  zh: string;
  zt: string;
  pt: string;
  ko: string;
  ja: string;
  th: string;
  en: string;
}

export interface Images6 {
  poster: Poster3;
}

export interface Poster3 {
  url: string;
  source: string;
}

export interface Url3 {
  web: string;
  api: string;
  fb: string;
}

export interface Segmenter {
  id: string;
  user: User4;
  container: Container4;
  role: string;
  language_code: any;
  created_at: string;
  close_role_banned: boolean;
}

export interface User4 {
  id: string;
  username: string;
  images: Images7;
}

export interface Images7 {
  avatar: Avatar4;
}

export interface Avatar4 {
  url: string;
}

export interface Container4 {
  id: string;
  type: string;
  flags: Flags4;
  titles: Titles4;
  images: Images8;
  url: Url4;
  i18n_title: string;
}

export interface Flags4 {
  licensed: boolean;
  hosted: boolean;
  state: string;
  adult: boolean;
  private_watch_party: boolean;
  on_air: boolean;
  exclusive: boolean;
  original: boolean;
}

export interface Titles4 {
  de: string;
  it: string;
  es: string;
  fr: string;
  zh: string;
  zt: string;
  pt: string;
  ko: string;
  ja: string;
  th: string;
  en: string;
}

export interface Images8 {
  poster: Poster4;
}

export interface Poster4 {
  url: string;
  source: string;
}

export interface Url4 {
  web: string;
  api: string;
  fb: string;
}

export interface Subtitler {
  id: string;
  user: User5;
  container: Container5;
  role: string;
  language_code: string;
  created_at: string;
  close_role_banned: boolean;
}

export interface User5 {
  id: string;
  username: string;
  images: Images9;
}

export interface Images9 {
  avatar: Avatar5;
}

export interface Avatar5 {
  url?: string;
}

export interface Container5 {
  id: string;
  type: string;
  flags: Flags5;
  titles: Titles5;
  images: Images10;
  url: Url5;
  i18n_title: string;
}

export interface Flags5 {
  licensed: boolean;
  hosted: boolean;
  state: string;
  adult: boolean;
  private_watch_party: boolean;
  on_air: boolean;
  exclusive: boolean;
  original: boolean;
}

export interface Titles5 {
  de: string;
  it: string;
  es: string;
  fr: string;
  zh: string;
  zt: string;
  pt: string;
  ko: string;
  ja: string;
  th: string;
  en: string;
}

export interface Images10 {
  poster: Poster5;
}

export interface Poster5 {
  url: string;
  source: string;
}

export interface Url5 {
  web: string;
  api: string;
  fb: string;
}
