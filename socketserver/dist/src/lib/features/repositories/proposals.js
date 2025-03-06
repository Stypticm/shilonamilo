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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProposal = exports.declineProposal = exports.acceptProposal = exports.getReceivedProposals = void 0;
exports.updateOwnerConfirmedStatus = updateOwnerConfirmedStatus;
exports.updateUserConfirmedStatus = updateUserConfirmedStatus;
exports.declineTheOffer = declineTheOffer;
const client_1 = require("@/lib/prisma/client");
function updateOwnerConfirmedStatus(proposalId, confirmed) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedProposal = yield client_1.prisma.proposal.update({
                where: { id: proposalId },
                data: {
                    isOwnerConfirmedExchange: confirmed,
                },
            });
            return updatedProposal;
        }
        catch (error) {
            console.error('Error updating proposal status:', error);
            throw new Error('Could not update proposal status');
        }
    });
}
function updateUserConfirmedStatus(proposalId, confirmed) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedProposal = yield client_1.prisma.proposal.update({
                where: { id: proposalId },
                data: {
                    isUserConfirmedExchange: confirmed,
                },
            });
            return updatedProposal;
        }
        catch (error) {
            console.error('Error updating proposal status:', error);
            throw new Error('Could not update proposal status');
        }
    });
}
function declineTheOffer(lotId, chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client_1.prisma.proposal.updateMany({
                where: { lotId },
                data: {
                    status: 'pending',
                },
            });
            yield client_1.prisma.message.deleteMany({
                where: { chatId },
            });
            yield client_1.prisma.chat.delete({
                where: { id: chatId },
            });
            return { success: true, redirect: true };
        }
        catch (error) {
            console.error('Error updating proposal status:', error);
            throw new Error(`Could not update proposal status: ${error}`);
        }
    });
}
const getReceivedProposals = (lotId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const proposals = yield client_1.prisma.proposal.findMany({
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
        yield client_1.prisma.proposal.update({
            where: {
                id: proposalId,
            },
            data: {
                status: 'accepted',
            },
        });
        yield client_1.prisma.proposal.updateMany({
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
        yield client_1.prisma.proposal.update({
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
const addProposal = (lotId, myLotId) => __awaiter(void 0, void 0, void 0, function* () {
    let logginedUserId;
    let itemUserId;
    try {
        logginedUserId = yield client_1.prisma.lot.findUnique({
            where: {
                id: myLotId,
            },
        });
        itemUserId = yield client_1.prisma.lot.findUnique({
            where: {
                id: lotId,
            },
        });
    }
    catch (error) {
        console.error('Error finding user:', error);
    }
    try {
        const data = yield client_1.prisma.proposal.create({
            data: {
                lotId,
                offeredLotId: myLotId,
                status: 'pending',
                ownerIdOfTheLot: itemUserId === null || itemUserId === void 0 ? void 0 : itemUserId.userId,
                userIdOfferedLot: logginedUserId === null || logginedUserId === void 0 ? void 0 : logginedUserId.userId,
            },
        });
        yield client_1.prisma.lot.update({
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
