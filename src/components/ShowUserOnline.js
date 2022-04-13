import ConversationArea from "./ConversationArea";

const ShowUserOnline = (props) => {
    let { myInfo, users, isMobile } = props;
    // console.log("check props users: ", users);
    return (
        <>
            <div className="offcanvas offcanvas-start" id="showUserOnline">
                <div className="offcanvas-header">
                    <h4 className="offcanvas-title">Mọi người</h4>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <ConversationArea
                        isMobile={isMobile}
                        myInfo={myInfo}
                        users={users}
                    />
                </div>
            </div>
        </>
    );
};

export default ShowUserOnline;
