import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();
const socket = io(process.env.REACT_APP_API_ENDPOINT);

const ContextProvider = ({ children }) => {
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState(null);
    const [name, setName] = useState("");
    const [call, setCall] = useState({});
    const [me, setMe] = useState("");
    const [callWaiting, setCallWaiting] = useState(false);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        socket.emit("connect-video-call");
    }, []);

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                myVideo.current.srcObject = currentStream;
            });

        socket.on("me", (id) => {
            console.log("me me me me me");
            setMe(id);
        });

        socket.on("callUser", ({ from, name: callerName, signal }) => {
            setCall({ isReceivingCall: true, from, name: callerName, signal });
        });

        socket.on("stop-call", () => {
            // alert("stop-call");
            setCallEnded(true);
        });

        return () => {
            setStream(null);
            window.location.reload(); // tắt web cam
        };
    }, []);

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on("signal", (signalData) => {
            // console.log(">>>>>> check signal peer answerCall: ", signalData);
            socket.emit("answerCall", { signal: signalData, to: call.from });
        });

        peer.on("stream", (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    };

    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on("signal", (signalData) => {
            // console.log(">>>>>> check signal peer callUser: ", signalData);
            socket.emit("callUser", {
                userToCall: id,
                signalData: signalData,
                from: me,
                name: name,
            });
        });

        peer.on("stream", (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        socket.on("callAccepted", (signal) => {
            setCallAccepted(true);
            setCallWaiting(false);

            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);
        socket.emit("leave-call", { to: call.from });

        connectionRef.current.destroy();

        window.location.reload();
    };

    //* từ chối cuộc gọi
    const refuseCall = () => {
        // alert("refuseCall");
        setCall({ isReceivingCall: false });
    };

    return (
        <SocketContext.Provider
            value={{
                callWaiting,
                setCallWaiting,
                call,
                callAccepted,
                myVideo,
                userVideo,
                stream,
                name,
                setName,
                callEnded,
                me,
                callUser,
                leaveCall,
                answerCall,
                refuseCall,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
