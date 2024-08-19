export interface Favorite {
  id: string;
  userId: string | null;
  lotId: string | null;
  createdat: Date;
}

export interface User {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string;
  accessToken?: string | null;
}

export interface Lot {
  id: string;
  userId?: string | null;
  name?: string | null;
  description?: string | null;
  exchangeOffer?: string | null
  country?: string | null;
  city?: string | null;
  category?: string | null;
  photolot?: string | null;

  addedcategory?: boolean | null;
  addeddescription?: boolean | null;
  addedlocation?: boolean | null;

  createdAt?: string | Date | null;

  isInFavoriteList?: boolean | null;

  Favorite?: Omit<Favorite, 'createdat'>[] | null;
  favoriteId?: string | null;

  Proposal?: Proposal[]
  ReceivedProposal?: Proposal[]
}

export interface Proposal {
  id: string;
  lotId: string | null;
  offeredLotId: string | null;
  status: 'declined' | 'pending' | 'accepted' | 'done';
  createdat?: Date | null;
  updatedAt?: Date | null;

  lot?: Lot;
  offeredLot?: Lot;
}

export interface ICard {
  id: string;
  userId?: string | null;
  name?: string | null;
  description?: string | null;
  country?: string | null;
  city?: string | null;
  photolot?: string | null;
  isInFavoriteList?: boolean | null;

  handleClick?: (id: string) => void | undefined;
  lotId?: string;
  favoriteId?: string | null;
  pathName?: string;
  updateFavorites?: () => void | undefined;
}