export interface Favorite {
  id: string;
  userId: string | null;
  lotId: string | null;
  createdat: Date;
}

export interface User {
  displayName?: string | null;
  firstname?: string | null;
  email?: string | null;
  photoURL?: string | null;
  uid?: string;
  accessToken?: string | null;
}

export interface ILot {
  id: string;
  userId?: string | null;
  name?: string | null;
  description?: string | null;
  exchangeOffer?: string | null;
  country?: string | null;
  city?: string | null;
  category?: string | null;
  location?: string | null;
  photolot?: string | null;

  addedcategory?: boolean | null;
  addeddescription?: boolean | null;
  addedlocation?: boolean | null;

  createdAt?: string | Date | null;

  isInFavoriteList?: boolean | null;

  Favorite?: Omit<Favorite, 'createdat'>[] | null;
  favoriteId?: string | null;

  Proposal?: Proposal[];
  Offers?: Proposal[];
}

export interface Proposal {
  id: string;
  lotId: string | null;
  offeredLotId: string | null;

  status: 'declined' | 'pending' | 'accepted' | 'done';
  timer?: Date | null;

  createdat?: Date | null;
  updatedAt?: Date | null;

  lot?: ILot;
  offeredLot?: ILot;

  ownerIdOfTheLot?: string | null;
  userIdOfferedLot?: string | null;

  isOwnerConfirmedExchange?: boolean | null;
  isUserConfirmedExchange?: boolean | null;
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
  updateFavorites?: () => Promise<void> | undefined;
}

export interface IChats {
  id: string;

  companionLot?: ILot;
  companionUser?: User;
  lastMessage?: string;
}

export interface IChat {
  id: string;
  lot1Id: string;
  lot2Id: string;

  createdat?: Date | null;
  updatedAt?: Date | null;
}

export interface IChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdat?: Date | null;
  updatedAt?: Date | null;
}

export interface ICardFavorite {
  id: string;
  userId?: string | null;
  lotId?: string | null;

  Lot: ILot;
}

export interface IFeedback {
  id: string;
  userId: string;

  comment?: string;

  rating?: number;
  lotId?: string;

  createdat?: Date | null;
  updatedAt?: Date | null;
}

export interface IRating {
  role: 'owner' | 'participant';
  rating: number;
  comment: string;
  lotId: string;
  userId: string;
  error?: string;
  message?: string;
}
