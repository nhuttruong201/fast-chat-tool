const ChatMessage = (props) => {
    let { time, textMessage, displayName, avatar, isOwner } = props;
    let classMessage = isOwner ? "chat-msg owner" : "chat-msg";

    return (
        <>
            <div className={classMessage}>
                <div className="chat-msg-profile">
                    {!isOwner && (
                        <img className="chat-msg-img" src={avatar} alt="" />
                    )}
                    <div className="chat-msg-date">
                        {time}
                        {displayName && ", " + displayName}
                    </div>
                </div>
                <div className="chat-msg-content">
                    <div
                        className="chat-msg-text"
                        dangerouslySetInnerHTML={{ __html: textMessage }}
                    ></div>
                </div>
            </div>
        </>
    );
};

export default ChatMessage;
