const ConversationArea = (props) => {
    let { isMobile, myInfo, users } = props;
    // console.log("check props myInfo from ConversationArea: ", myInfo);
    // console.log("check props users from ConversationArea: ", users);

    let classContainer = isMobile
        ? "conversation-area-mobile"
        : "conversation-area";

    return (
        <div className={classContainer}>
            <div className="msg online active">
                <img className="msg-profile" src={myInfo.avatar} alt="" />
                <div className="msg-detail">
                    <div className="msg-username">
                        {myInfo.displayName + "(Bạn)"}
                    </div>
                    <div className="msg-content">
                        <span className="msg-message">Tham gia lúc</span>
                        <span className="msg-date">{myInfo.joinedAt}</span>
                    </div>
                </div>
            </div>
            {users &&
                users.map((user, index) => (
                    <div key={index} className="msg online">
                        <img className="msg-profile" src={user.avatar} alt="" />
                        <div className="msg-detail">
                            <div className="msg-username">
                                {user.displayName}
                            </div>
                            <div className="msg-content">
                                <span className="msg-message">
                                    Tham gia lúc
                                </span>
                                <span className="msg-date">
                                    {user.joinedAt}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            <div className="overlay" />
        </div>
    );
};

export default ConversationArea;
