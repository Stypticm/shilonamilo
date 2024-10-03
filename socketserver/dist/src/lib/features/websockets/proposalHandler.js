"use strict";
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
exports.offProposalNotification = exports.offProposal = exports.onProposalReceived = exports.onSendProposal = exports.joinRoom = exports.initializeProposalNamespace = void 0;
const socket_1 = require("../../../socket");
const myStuff_1 = require("../myStuff");
const initializeProposalNamespace = (io) => {
    const proposalNamespace = io.of('/proposal');
    proposalNamespace.on('connection', (socket) => {
        console.log(`${socket.id} connected to proposal namespace`);
        socket.on('joinRoom', ({ userId }) => {
            console.log(`User joined proposal room: ${userId}`);
            socket.join(userId);
        });
        socket.on('addProposal', (_a) => __awaiter(void 0, [_a], void 0, function* ({ lotId, myLotId }) {
            try {
                const proposal = yield (0, myStuff_1.addProposal)(lotId, myLotId);
                // console.log(`Owner: ${proposal?.ownerIdOfTheLot}`);
                // console.log(`User: ${proposal?.userIdOfferedLot}`);
                // console.log(`Proposal: ${JSON.stringify(proposal)}`);
                // // Notificate the owner of the lot
                proposalNamespace.to(proposal === null || proposal === void 0 ? void 0 : proposal.ownerIdOfTheLot).emit('proposalReceived', proposal);
                // // Notificate the other user
                proposalNamespace.to(proposal === null || proposal === void 0 ? void 0 : proposal.userIdOfferedLot).emit('proposalReceived', proposal);
                proposalNamespace.to(proposal === null || proposal === void 0 ? void 0 : proposal.ownerIdOfTheLot).emit('newNotification', {
                    type: 'proposal',
                    data: proposal
                });
            }
            catch (error) {
                console.error('Error adding proposal:', error);
            }
        }));
        socket.on('subscribeToNotifications', (userId) => {
            console.log(`User subscribed to notifications: ${userId}`);
            socket.join(userId);
        });
        socket.on('disconect', ({ userId }) => {
            console.log('Client disconnected from notifications namespace');
            socket.leave(userId);
        });
    });
};
exports.initializeProposalNamespace = initializeProposalNamespace;
const joinRoom = (userId) => {
    socket_1.proposalSocket.emit('joinRoom', { userId });
};
exports.joinRoom = joinRoom;
const onSendProposal = (lotId, myLotId) => {
    socket_1.proposalSocket.emit('addProposal', { lotId, myLotId });
};
exports.onSendProposal = onSendProposal;
const onProposalReceived = (callback) => {
    socket_1.proposalSocket.on('proposalReceived', (data) => {
        callback(data);
    });
};
exports.onProposalReceived = onProposalReceived;
const offProposal = () => {
    socket_1.proposalSocket.off('proposalReceived');
};
exports.offProposal = offProposal;
const offProposalNotification = (userId) => {
    socket_1.proposalSocket.emit('disconect', { userId });
};
exports.offProposalNotification = offProposalNotification;
