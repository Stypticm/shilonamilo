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
exports.declineProposal = exports.acceptProposal = exports.getReceivedProposals = exports.getLotsById = exports.addProposal = exports.getLotById = exports.deleteLot = exports.findLotByUserIdAndLotId = exports.getMyStuff = void 0;
const db_1 = __importDefault(require("../prisma/db"));
const getMyStuff = (id) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getMyStuff = getMyStuff;
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
const getLotsById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getLotsById = getLotsById;
const getReceivedProposals = (lotId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const proposals = yield db_1.default.proposal.findMany({
            where: {
                lotId,
            },
            include: {
                offeredLot: true,
            },
        });
        return proposals;
    }
    catch (error) {
        console.error('Error fetching proposals for lot:', error);
        throw error;
    }
});
exports.getReceivedProposals = getReceivedProposals;
const acceptProposal = (proposalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.proposal.update({
            where: {
                id: proposalId,
            },
            data: {
                status: 'accepted',
            },
        });
        yield db_1.default.proposal.updateMany({
            where: {
                id: {
                    not: proposalId,
                },
            },
            data: {
                status: 'declined',
            },
        });
    }
    catch (error) {
        console.error('Error accepting proposal:', error);
    }
});
exports.acceptProposal = acceptProposal;
const declineProposal = (proposalId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.proposal.update({
            where: {
                id: proposalId,
            },
            data: {
                status: 'declined',
            },
        });
    }
    catch (error) {
        console.error('Error declining proposal:', error);
    }
});
exports.declineProposal = declineProposal;
