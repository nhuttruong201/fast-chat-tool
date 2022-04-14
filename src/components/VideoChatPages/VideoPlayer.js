import React, { useContext } from "react";
import { SocketContext } from "./VideoChatContext";

const VideoPlayer = () => {
    const {
        name,
        callAccepted,
        myVideo,
        userVideo,
        callEnded,
        stream,
        call,
        callWaiting,
    } = useContext(SocketContext);

    return (
        <>
            <div className="container py-2">
                {callWaiting && (
                    <h4 className="text-center text-danger">
                        <i className="bi bi-telephone"></i> Đang gọi...
                    </h4>
                )}

                <div className="row justify-content-center">
                    {stream && (
                        <>
                            <div className="col-sm-6 col-12 p-1">
                                <div className="bg-white p-3 radius shadow">
                                    <h6 className="disname-video-call">
                                        {name || "Bạn chưa nhập tên!"}
                                    </h6>
                                    <video
                                        playsInline
                                        ref={myVideo}
                                        autoPlay
                                        className="w-100"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {callAccepted && !callEnded && (
                        <>
                            <div className="col-sm-6 col-12 p-1">
                                <div className="bg-white p-3 radius shadow">
                                    <h6 className="disname-video-call">
                                        {call.name || "Name"}
                                    </h6>
                                    <video
                                        playsInline
                                        ref={userVideo}
                                        autoPlay
                                        className="w-100"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default VideoPlayer;
