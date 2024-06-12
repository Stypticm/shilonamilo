export interface User {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string;
  accessToken?: string | null;
}

export interface Thing {
  id: string;
  name?: string | null;
  description?: string | null;
  country?: string | null;
  city?: string | null;
  category?: string | null;
  youneed?: string | null;
  photothing?: string | null;
  photoyouneed?: string | null;
  userid?: string | null;
  addedcategory?: boolean | null;
  addeddescription?: boolean | null;
  addedlocation?: boolean | null;
  addedyouneed?: boolean | null;
}