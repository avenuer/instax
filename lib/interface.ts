export interface FBMediaResponse {
  data: Media[];
  paging: Paging2;
}

export interface Paging2 {
  cursors: Cursors2;
  next: string;
}

interface Cursors2 {
  after: string;
}

interface Media {
  name: string;
  rating_count: number;
  id: string;
  photos?: Photos;
}

interface Photos {
  data: Datum[];
  paging: Paging;
}

interface Paging {
  cursors: Cursors;
}

interface Cursors {
  before: string;
  after: string;
}

export interface Datum {
  height: number;
  link: string;
  images: Image[];
  id: string;
  name?: string;
}

interface Image {
  height: number;
  source: string;
  width: number;
}
