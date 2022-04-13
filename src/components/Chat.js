import "./normalize.min.css";
import "./Chat.css";

import { useEffect, useRef, useState } from "react";
import { useParams, withRouter } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import moment from "moment";

import randomId from "../services/randomId";
import randomAvatar from "../services/randomAvatar";
import ShowInfo from "./ShowInfo";
import ShowUserOnline from "./ShowUserOnline";
import ChatMessage from "./ChatMessage";
import ConversationArea from "./ConversationArea";
import HeaderChat from "./HeaderChat";
import { Prompt } from "react-router-dom";
import { useHistory } from "react-router-dom";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
const serverHost = API_ENDPOINT;
const socket = io(serverHost);

const Chat = (props) => {
    const [textMessage, setTextMessage] = useState("");
    const [displayName, setDisplayName] = useState(randomId(10));
    const [avatar, setAvatar] = useState(randomAvatar);
    const [joinedAt, setJoinedAt] = useState("");
    const [users, setUsers] = useState([]);
    const [listMessages, setListMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const { roomId } = useParams();
    const history = useHistory();

    const handleOnChangeTextMessage = (e) => {
        setTextMessage(e.target.value);
    };
    const handleSendMessage = () => {
        sendMessageRealtime(textMessage);
    };
    const handleSendLike = () => {
        sendMessageRealtime('<i class="fas fa-thumbs-up"></i>');
    };

    const handleOnChangeImage = (e) => {
        let files = e.target.files;
        // console.log("handleOnChangeImage: ", files);
        var formData = new FormData();
        formData.append("image", files[0]);
        axios
            .post("https://api.imgur.com/3/image", formData, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                    Authorization: "Client-ID 58f2ebf29687a0b",
                },
                responseType: "json",
            })
            .then((res) => {
                console.log(res);
                let link = res.data.data.link;
                sendMessageRealtime(`<img src="${link}" />`);
            })
            .catch((e) => {
                console.error(e);
            });
    };

    const handleOnKeyDownSendMessage = (e) => {
        if (e.key === "Enter" && textMessage !== "") {
            handleSendMessage();
        }
    };

    // Todo send message realtime
    const sendMessageRealtime = (message) => {
        socket.emit("send-message-to-room", {
            roomId: roomId,
            avatar: avatar,
            senderName: displayName,
            textMessage: message,
            time: moment(new Date()).format("hh:mm A"),
        });
        setTextMessage("");
    };

    const handleChatRealtime = (roomId) => {
        // console.log("Check disname from realtime: ", displayName);
        // TODO real time
        socket.emit("join-chat-room", { roomId, displayName, avatar });

        socket.on("join-chat-room-succeeded", (dataJoined) => {
            let { message, joinedAt, users } = dataJoined;
            console.log(socket.id, message);
            // console.log("join-chat-room-succeeded: ", dataJoined);
            setJoinedAt(joinedAt);
            setUsers(users.filter((user) => user.clientId !== socket.id));
        });

        //* RECEIVE
        //* caller
        socket.on("send-message-caller-succeed", (dataMessage) => {
            let { textMessage, time } = dataMessage;
            // console.log("send-message-caller-succeed: ", listMessages);
            setListMessages((listMessages) => [
                ...listMessages,
                <ChatMessage
                    key={randomId(10)}
                    avatar={avatar}
                    textMessage={textMessage}
                    time={time}
                    isOwner={true}
                />,
            ]);
        });

        //* others
        socket.on("get-all-users", (dataUsers) => {
            console.log("get-all-users: ", dataUsers);
            setUsers(dataUsers.filter((user) => user.clientId !== socket.id));
        });

        socket.on("send-message-others-succeed", (dataMessage) => {
            let { avatar, senderName, textMessage, time } = dataMessage;
            setListMessages((listMessages) => [
                ...listMessages,
                <ChatMessage
                    key={randomId(10)}
                    avatar={avatar}
                    textMessage={textMessage}
                    time={time}
                    isOwner={false}
                    displayName={senderName}
                />,
            ]);
        });
    };

    const handleChangeUserInfo = (newUserInfo) => {
        let { userAvatar, userDisplayName } = newUserInfo;
        // console.log("check new info: ", newUserInfo);
        socket.emit("update-user-info", {
            roomId: roomId,
            userAvatar,
            userDisplayName,
        });

        setDisplayName(userDisplayName);
        setAvatar(userAvatar);
    };

    const handleLeaveRoom = () => {
        socket.emit("leave-chat-room", roomId);
        history.push("/");
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleGoVideoCall = () => {
        // alert("handleGoVideoCall");
        history.push("/chat/video-call/" + roomId);
    };

    useEffect(() => {
        document.title = `Fast Chat - ${roomId}`;
        handleChatRealtime(roomId);
        //* re load users in room
        const reLoadUsers = setInterval(() => {
            socket.emit("re-load-users", roomId);
        }, 15000);

        return () => {
            setUsers([]);
            setListMessages([]);
            clearInterval(reLoadUsers);
            socket.emit("leave-chat-room", roomId);
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    });

    return (
        <>
            <Prompt when={true} message="Rời khỏi cuộc trò chuyện?" />

            <div className="container main-container-chat p-0">
                <div className="bg-white">
                    <HeaderChat
                        avatar={avatar}
                        roomId={roomId}
                        leaveRoom={() => handleLeaveRoom()}
                        goVideoCall={handleGoVideoCall}
                    />
                </div>
                <div className="wrapper bg-white h-100">
                    <ConversationArea
                        isMobile={false}
                        myInfo={{ joinedAt, displayName, avatar }}
                        users={users}
                    />
                    <ShowUserOnline
                        isMobile={true}
                        myInfo={{ joinedAt, displayName, avatar }}
                        users={users}
                    />

                    <ShowInfo
                        currentAvatar={avatar}
                        displayName={displayName}
                        changeUserInfo={handleChangeUserInfo}
                    />
                    <div className="chat-area">
                        <div className="chat-area-header">
                            <div className="chat-area-title">{roomId}</div>
                            <div className="chat-area-group">
                                <img
                                    className="chat-area-profile"
                                    src="/img/avatars/picture_16.jpg"
                                    alt=""
                                />
                                <img
                                    className="chat-area-profile"
                                    src="/img/avatars/picture_8.jpg"
                                    alt=""
                                />
                                <img
                                    className="chat-area-profile"
                                    src="/img/avatars/picture_12.jpg"
                                    alt=""
                                />

                                <span>{users.length + 1}</span>
                            </div>
                        </div>

                        <div className="chat-area-main">
                            {listMessages.map((item, index) => item)}
                            <div ref={messagesEndRef}></div>
                        </div>
                        {/* TODO FOOTER */}
                        <div className="chat-area-footer">
                            <label htmlFor="image">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-image"
                                >
                                    <rect
                                        x={3}
                                        y={3}
                                        width={18}
                                        height={18}
                                        rx={2}
                                        ry={2}
                                    />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <path d="M21 15l-5-5L5 21" />
                                </svg>
                            </label>
                            <input
                                type={"file"}
                                id={"image"}
                                accept="image/*"
                                onChange={(e) => handleOnChangeImage(e)}
                                hidden
                            />

                            <input
                                type="text"
                                value={textMessage}
                                placeholder="Soạn tin nhắn..."
                                autoFocus
                                onKeyDown={(e) => handleOnKeyDownSendMessage(e)}
                                onChange={(e) => handleOnChangeTextMessage(e)}
                            />

                            {textMessage !== "" ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-send-fill"
                                    viewBox="0 0 16 16"
                                    onClick={() => handleSendMessage()}
                                >
                                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-thumbs-up"
                                    onClick={() => handleSendLike()}
                                >
                                    <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                                </svg>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default withRouter(Chat);
