import React, { useState, useContext } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { SocketContext } from "./VideoChatContext";

const Sidebar = ({ children }) => {
    const {
        me,
        callAccepted,
        name,
        setName,
        callEnded,
        leaveCall,
        callUser,
        setCallWaiting,
    } = useContext(SocketContext);
    
    const [idToCall, setIdToCall] = useState("");
    const [isCopy, setIsCopy] = useState(false);
    const [errMsg, setErrMsg] = useState(null);

    const handleCall = () => {
        if (name === "" || idToCall === "") {
            setErrMsg("Bạn chưa nhập đủ thông tin!");
            return;
        }
        setErrMsg(null);
        callUser(idToCall);
        setCallWaiting(true);
    };

    const handleCopyUserId = () => {
        setIsCopy(true);
        setTimeout(() => {
            setIsCopy(false);
        }, 3000);
    };

    return (
        <>
            <div className="container">
                <div className="row justify-content-center px-2">
                    <div className="col-md-6 col-sm-10 col-12 bg-white p-3 radius border shadow">
                        {children}
                        {errMsg && (
                            <span className="text-danger">{errMsg}</span>
                        )}
                        <form noValidate autoComplete="off">
                            <div className="row">
                                <div className="col-12 p-0">
                                    <div className="border radius d-flex justify-content-between m-1">
                                        <div className="flex-grow-1 btn">
                                            <span style={{ fontSize: "14px" }}>
                                                ID: <strong>{me}</strong>
                                            </span>
                                        </div>
                                        <div>
                                            <CopyToClipboard text={me}>
                                                <button
                                                    type="button"
                                                    className="btn text-primary"
                                                    onClick={() =>
                                                        handleCopyUserId()
                                                    }
                                                >
                                                    {!isCopy ? (
                                                        <i className="bi bi-clipboard"></i>
                                                    ) : (
                                                        <i className="fas fa-check"></i>
                                                    )}
                                                </button>
                                            </CopyToClipboard>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 p-0">
                                    <div className="form-group p-1">
                                        <input
                                            placeholder="nhập tên của bạn..."
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            className="form-control radius text-center"
                                        />
                                    </div>
                                </div>
                                <div className="col-6 p-0">
                                    <div className="form-group p-1">
                                        <input
                                            placeholder="nhập id người nhận..."
                                            value={idToCall}
                                            onChange={(e) =>
                                                setIdToCall(e.target.value)
                                            }
                                            className="form-control radius text-center"
                                        />
                                    </div>
                                </div>
                                <div className="col-12 p-0">
                                    <div className="form-group text-center p-1">
                                        {callAccepted && !callEnded ? (
                                            <button
                                                type="button"
                                                onClick={leaveCall}
                                                className="btn btn-danger radius px-5"
                                            >
                                                <i className="bi bi-telephone"></i>{" "}
                                                Kết thúc
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleCall()}
                                                className="btn btn-primary radius px-5"
                                            >
                                                <i className="bi bi-telephone"></i>{" "}
                                                Gọi
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
