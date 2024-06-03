export interface User {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string;
  accessToken?: string | null;
}

export interface Thing {
  id: string;
  name?: string;
  description?: string;
  country?: string;
  city?: string;
  category?: string;
  youneed?: string;
  photothing?: string;
  addedCategory?: boolean;
  addedDescription?: boolean;
  addedLocation?: boolean;
  userId: string | undefined
}