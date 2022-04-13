import moment from "moment";

let initSocketServer = (server) => {
    const io = require("socket.io")(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("connection: ", socket.id);
        // TODO Fast note
        socket.on("join-room", (code) => {
            let room = code;
            console.log("Client note room: ", room);

            socket.join(room);
            io.to(room).emit("join-room-success", `Join [${room}] succeeded!`);
        });

        socket.on("update-note", async (data) => {
            // console.log(data);
            let { code, password, content } = data;
            let room = code;

            socket.to(room).emit("update-note-other-succeed", {
                socketId: socket.id,
                content: content,
                updatedAt: moment(new Date()).format("DD/MM/YYYY hh:mm:ss A"),
            });

            socket.emit(
                "update-note-caller-succeed",
                moment(new Date()).format("DD/MM/YYYY hh:mm:ss A")
            );
        });

        // TODO Fast chat
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
    });
};

export default initSocketServer;
