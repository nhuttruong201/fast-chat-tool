import moment from "moment";

let initSocketServer = (server) => {
    const io = require("socket.io")(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("connection: ", socket.id);
        // TODO chat
        socket.on("disconnect", (reason) => {
            console.log("disconnect: ", reason);
        });

        socket.on("leave-chat-room", async (roomId) => {
            await socket.leave(roomId);
            let sockets = await io.in(roomId).fetchSockets();
            let users = [];
            sockets.map((item) => {
                users.push({
                    clientId: item.data.id,
                    avatar: item.data.avatar,
                    displayName: item.data.displayName,
                    joinedAt: item.data.joinedAt,
                });
            });
            socket.to(roomId).emit("get-all-users", users);
        });

        socket.on("join-chat-room", async (dataJoin) => {
            console.log(">> socket id: ", socket.id);
            // console.log("Client chat room: ", roomId);
            let { roomId, displayName, avatar } = dataJoin;

            socket.join(roomId);
            //* set data socket
            socket.data.id = socket.id;
            socket.data.avatar = avatar;
            socket.data.displayName = displayName;
            socket.data.joinedAt = moment(new Date()).format("hh:mm A");

            let sockets = await io.in(roomId).fetchSockets();

            // console.log(sockets[0].data);
            let users = [];
            sockets.map((item, index) => {
                // console.log(index + ": ", item);
                users.push({
                    clientId: item.data.id,
                    avatar: item.data.avatar,
                    displayName: item.data.displayName,
                    joinedAt: item.data.joinedAt,
                });
            });

            // to caller
            socket.emit("join-chat-room-succeeded", {
                message: `Join chat room [${roomId}] succeeded!`,
                joinedAt: moment(new Date()).format("hh:mm A"),
                users: users,
            });

            // to others
            socket.to(roomId).emit("get-all-users", users);

            // io.to(roomId).emit => tất cả trong room
        });

        socket.on("send-message-to-room", (dataMessgae) => {
            let { roomId, avatar, senderName, textMessage, time } = dataMessgae;
            socket.to(roomId).emit("send-message-others-succeed", {
                avatar,
                senderName,
                textMessage,
                time,
            });

            socket.emit("send-message-caller-succeed", { textMessage, time });
        });

        socket.on("update-user-info", async (dataUpdate) => {
            let { roomId, userAvatar, userDisplayName } = dataUpdate;

            let sockets = await io.in(roomId).fetchSockets();

            let users = [];
            sockets.map((item, index) => {
                if (item.data.id === socket.id) {
                    item.data.displayName = userDisplayName;
                    item.data.avatar = userAvatar;
                }

                users.push({
                    clientId: item.data.id,
                    avatar: item.data.avatar,
                    displayName: item.data.displayName,
                    joinedAt: item.data.joinedAt,
                });
                return item;
            });

            io.to(roomId).emit("get-all-users", users);
        });

        socket.on("re-load-users", async (roomId) => {
            console.log(
                "re-load-users",
                moment(new Date()).format("hh:mm:ss A")
            );
            let sockets = await io.in(roomId).fetchSockets();
            let users = [];
            sockets.map((item) => {
                users.push({
                    clientId: item.data.id,
                    avatar: item.data.avatar,
                    displayName: item.data.displayName,
                    joinedAt: item.data.joinedAt,
                });
            });

            socket.emit("get-all-users", users);
        });

        // todo video call

        socket.on("connect-video-call", () => {
            socket.emit("me", socket.id);
        });

        socket.on("disconnect", () => {
            socket.broadcast.emit("callEnded");
        });

        socket.on("callUser", ({ userToCall, signalData, from, name }) => {
            io.to(userToCall).emit("callUser", {
                signal: signalData,
                from,
                name,
            });
        });

        socket.on("answerCall", (data) => {
            let { signal, to, answerName } = data;
            console.log("caller name: ", to);
            console.log("answer name:", answerName);
            io.to(data.to).emit("callAccepted", data);
        });

        socket.on("leave-call", (data) => {
            io.to(data.to).emit("stop-call");
        });
    });
};

export default initSocketServer;
