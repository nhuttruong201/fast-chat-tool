import { useEffect, useState } from "react";
import moment from "moment";
import getAllAvatar from "../services/getAllAvatar";

const ShowInfo = (props) => {
    const [userAvatar, setUserAvatar] = useState(props.currentAvatar);
    const [userDisplayName, setUserDisplayName] = useState(props.displayName);
    const [okMessage, setOkMessage] = useState("");
    const [errMessage, setErrMessage] = useState("");

    const handleOnChangeDisName = (e) => {
        setUserDisplayName(e.target.value);
    };

    const handleChangeUserAvatar = (newAvatar) => {
        setUserAvatar(newAvatar);
    };

    const handleUpdateUserInfo = () => {
        // console.log("handleUpdateUserInfo: ", userAvatar, userDisplayName);
        props.changeUserInfo({ userAvatar, userDisplayName });
        setErrMessage("");
        setOkMessage(
            "Cập nhật thành công! - " + moment(new Date()).format("hh:mm:ss A")
        );

        setTimeout(() => {
            setOkMessage("");
        }, 3000);
    };

    return (
        <>
            <div className="offcanvas offcanvas-end" id="showInfo">
                <div className="offcanvas-header">
                    <h4 className="offcanvas-title">Thông tin về bạn</h4>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <div>
                        {okMessage && (
                            <p className="text-primary">{okMessage}</p>
                        )}
                        {errMessage && (
                            <p className="text-danger">{errMessage}</p>
                        )}
                        <div className="form-group text-center">
                            <label className="text-black-50">
                                Tên hiển thị
                            </label>
                            <input
                                className="form-control mt-1 text-center"
                                placeholder="nhập tên hiển thị..."
                                value={userDisplayName}
                                onChange={(e) => handleOnChangeDisName(e)}
                            />
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="avatar-current">
                            <img
                                src={userAvatar}
                                alt=""
                                className="rounded-circle"
                            />
                            <p className="text-center text-black-50">
                                Ảnh đại diện
                            </p>
                        </div>
                        <div className="container">
                            <div className="row justify-content-center">
                                {Array.from(getAllAvatar()).map(
                                    (avt, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="col-2 p-1 m-1 rounded-circle bg-info elm-avatar"
                                            >
                                                <img
                                                    src={avt}
                                                    alt=""
                                                    className="rounded-circle"
                                                    onClick={() =>
                                                        handleChangeUserAvatar(
                                                            avt
                                                        )
                                                    }
                                                />
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                        <div className="text-center">
                            <button
                                className="btn btn-primary mt-3 px-5 radius"
                                onClick={() => handleUpdateUserInfo()}
                            >
                                Cập nhật thông tin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShowInfo;
