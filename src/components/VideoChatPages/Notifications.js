import React, { useContext } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { SocketContext } from "./VideoChatContext";

const Notifications = () => {
    const { answerCall, call, name, refuseCall, callAccepted } =
        useContext(SocketContext);

    const handleAnswerCall = () => {
        // if (name === "") {
        //     alert("Vui lòng nhập tên trước!");
        //     return;
        // }
        answerCall();
    };

    return (
        <>
            {call.isReceivingCall && !callAccepted && (
                <>
                    <Modal isOpen={true} centered={true} autoFocus={false}>
                        <ModalHeader>{call.name} đang gọi cho bạn</ModalHeader>
                        {/* <ModalBody className="p-4"></ModalBody> */}
                        <ModalFooter>
                            <button
                                className="btn text-primary"
                                onClick={() => refuseCall()}
                            >
                                Từ chối
                            </button>
                            <button
                                className="btn btn-primary radius"
                                onClick={() => handleAnswerCall()}
                            >
                                <i className="bi bi-telephone"></i> Chấp nhận
                            </button>
                        </ModalFooter>
                    </Modal>
                </>
            )}
        </>
    );
};

export default Notifications;
