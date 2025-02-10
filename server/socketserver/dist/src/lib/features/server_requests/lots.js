"use strict";
'use server';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLotByUserIdAndLotId = exports.addProposal = exports.getLotsByUserId = exports.getLotById = exports.deleteLot = exports.getMyLots = exports.getAllLots = void 0;
exports.createNewLot = createNewLot;
exports.updateLot = updateLot;
const storage_1 = require("firebase/storage");
const db_1 = __importDefault(require("@/lib/prisma/db"));
const navigation_1 = require("next/navigation");
const firebase_1 = require("@/lib/firebase/firebase");
const getAllLots = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let url = `http://localhost:8080/api/lots`;
        if (userId) {
            url += `?userId=${userId}`;
            const response = yield fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch lots');
            }
            const data = yield response.json();
            return data.message || [];
        }
        else {
            const response = yield fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch lots');
            }
            const data = yield response.json();
            return data.message || [];
        }
    }
    catch (error) {
        throw new Error(`Failed to fetch all lots: ${error}`);
    }
});
exports.getAllLots = getAllLots;
const getMyLots = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield db_1.default.lot.findMany({
        where: {
            userId: id,
            AND: [
                { name: { not: null } },
                { category: { not: null } },
                { description: { not: null } },
                { exchangeOffer: { not: null } },
                { photolot: { not: null } },
                { country: { not: null } },
                { city: { not: null } },
            ],
        },
        select: {
            id: true,
            name: true,
            category: true,
            description: true,
            exchangeOffer: true,
            photolot: true,
            country: true,
            city: true,
            createdAt: true,
            Proposal: {
                select: {
                    id: true,
                    status: true,
                },
            },
        },
    });
    return data;
});
exports.getMyLots = getMyLots;
function createNewLot(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId }) {
        const data = yield db_1.default.lot.findFirst({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        if (data === null) {
            const data = yield db_1.default.lot.create({
                data: {
                    userId: userId,
                },
            });
            return (0, navigation_1.redirect)(`/create/${data.id}/structure`);
        }
        else if (!data.addedcategory && !data.addeddescription && !data.addedlocation) {
            return (0, navigation_1.redirect)(`/create/${data.id}/structure`);
        }
        else if (data.addedcategory && !data.addeddescription && !data.addedlocation) {
            return (0, navigation_1.redirect)(`/create/${data.id}/description`);
        }
        else if (!data.addedcategory && data.addeddescription && !data.addedlocation) {
            return (0, navigation_1.redirect)(`/create/${data.id}/location`);
        }
        else if (data.addedcategory && data.addeddescription && data.addedlocation) {
            const data = yield db_1.default.lot.create({
                data: {
                    userId: userId,
                },
            });
            return (0, navigation_1.redirect)(`/create/${data.id}/structure`);
        }
    });
}
function updateLot(formData, lotId) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = formData.get('name');
        const description = formData.get('description');
        const photoLotFile = formData.get('photoLotFile');
        const photoLotURL = formData.get('photoLotURL');
        const exchangeOffer = formData.get('exchangeOffer');
        try {
            const currentData = yield db_1.default.lot.findUnique({
                where: { id: lotId },
            });
            const currentName = currentData === null || currentData === void 0 ? void 0 : currentData.name;
            const currentDescription = currentData === null || currentData === void 0 ? void 0 : currentData.description;
            const currentPhotoURL = currentData === null || currentData === void 0 ? void 0 : currentData.photolot;
            const currentExchangeOffer = currentData === null || currentData === void 0 ? void 0 : currentData.exchangeOffer;
            if (currentName === name &&
                currentDescription === description &&
                currentPhotoURL === currentPhotoURL &&
                currentExchangeOffer === exchangeOffer) {
                return {
                    success: true,
                    text: 'Nothing changed',
                };
            }
            else if (currentName !== name ||
                currentDescription !== description ||
                currentPhotoURL !== currentPhotoURL ||
                currentExchangeOffer !== exchangeOffer) {
                let photoURL = currentPhotoURL;
                if (photoLotFile) {
                    if (photoLotFile && !currentPhotoURL) {
                        const mountainsRef = (0, storage_1.ref)(firebase_1.storage, `${lotId}/${photoLotFile.name}`);
                        yield (0, storage_1.uploadBytes)(mountainsRef, photoLotFile);
                        photoURL = yield (0, storage_1.getDownloadURL)(mountainsRef);
                    }
                }
                else if (photoLotURL) {
                    try {
                        const response = yield fetch(photoLotURL);
                        const blob = yield response.blob();
                        const fileName = `externam-photo.${blob.type.split('/')[1]}`;
                        const urlRef = (0, storage_1.ref)(firebase_1.storage, `${lotId}/${fileName}`);
                        yield (0, storage_1.uploadBytes)(urlRef, blob);
                        photoURL = yield (0, storage_1.getDownloadURL)(urlRef);
                    }
                    catch (error) {
                        console.log(error);
                        return {
                            error: 'Error uploading photo',
                        };
                    }
                }
                yield db_1.default.lot.update({
                    where: {
                        id: lotId,
                    },
                    data: {
                        name: name,
                        description: description,
                        photolot: photoURL,
                        exchangeOffer: exchangeOffer,
                        addeddescription: true,
                    },
                });
                return { success: true, redirect: true };
            }
        }
        catch (error) {
            console.log(error);
            return { error: 'Error uploading photo' };
        }
    });
}
const deleteLot = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.lot.delete({
            where: {
                id: id,
            },
        });
        return true;
    }
    catch (error) {
        console.error('Error deleting thing:', error);
    }
});
exports.deleteLot = deleteLot;
const getLotById = (lotId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lot = yield db_1.default.lot.findUnique({
            where: {
                id: lotId,
            },
            include: {
                Proposal: true,
                Offers: true,
            },
        });
        return lot;
    }
    catch (error) {
        console.error('Error fetching thing:', error);
        return null;
    }
});
exports.getLotById = getLotById;
const getLotsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lots = yield db_1.default.lot.findMany({
            where: {
                userId: userId,
                AND: [
                    { name: { not: null } },
                    { category: { not: null } },
                    { description: { not: null } },
                    { exchangeOffer: { not: null } },
                    { photolot: { not: null } },
                    { country: { not: null } },
                    { city: { not: null } },
                ],
            },
            include: {
                Proposal: true,
                Offers: true,
            },
        });
        const lotsWithoutProposals = lots.filter((lot) => {
            return lot.Offers.length === 0;
        });
        return lotsWithoutProposals;
    }
    catch (error) {
        console.error('Error fetching lots by userId', error);
    }
});
exports.getLotsByUserId = getLotsByUserId;
const addProposal = (lotId, myLotId) => __awaiter(void 0, void 0, void 0, function* () {
    let logginedUserId;
    let itemUserId;
    try {
        logginedUserId = yield db_1.default.lot.findUnique({
            where: {
                id: myLotId,
            },
        });
        itemUserId = yield db_1.default.lot.findUnique({
            where: {
                id: lotId,
            },
        });
    }
    catch (error) {
        console.error('Error finding user:', error);
    }
    try {
        const data = yield db_1.default.proposal.create({
            data: {
                lotId,
                offeredLotId: myLotId,
                status: 'pending',
                ownerIdOfTheLot: itemUserId === null || itemUserId === void 0 ? void 0 : itemUserId.userId,
                userIdOfferedLot: logginedUserId === null || logginedUserId === void 0 ? void 0 : logginedUserId.userId,
            },
        });
        yield db_1.default.lot.update({
            where: {
                id: lotId,
            },
            data: {
                Proposal: {
                    connect: {
                        id: data.id,
                    },
                },
            },
        });
        return data;
    }
    catch (error) {
        console.error('Error adding proposal:', error);
    }
});
exports.addProposal = addProposal;
const findLotByUserIdAndLotId = (userId, lotId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield db_1.default.lot.findFirst({
            where: {
                id: lotId,
                userId: userId,
            },
        });
        return data !== null;
    }
    catch (error) {
        console.error('Error finding lot:', error);
        return false;
    }
});
exports.findLotByUserIdAndLotId = findLotByUserIdAndLotId;
