export interface Favorite {
  id: string;
  userid: string | null;
  thingid: string | null;
  createdat: Date;
}

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
  isInFavoriteList?: boolean | null;
  Favorite?: Omit<Favorite, 'createdat'>[] | null;
}

export interface ICard {
  id: string;
  name?: string | null;
  description?: string | null;
  country?: string | null;
  city?: string | null;
  photothing?: string | null;
  photoyouneed?: string | null;
  isInFavoriteList?: boolean | null;
  handleClick?: (id: string) => void | undefined;
  userId?: string | undefined;
  thingId?: string;
  favoriteId?: string;
  pathName?: string;
  updateFavorites?: () => void | undefined;
}