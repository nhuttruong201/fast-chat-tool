import { useEffect } from "react";
import { ContextProvider } from "./VideoChatContext";
import Notifications from "./Notifications";
import Sidebar from "./Sidebar";
import VideoPlayer from "./VideoPlayer";

const VideoCallArea = () => {
    useEffect(() => {
        document.title = "Fast Uty - Video call";
    }, []);

    return (
        <ContextProvider>
            <VideoPlayer />
            <Sidebar>
                <Notifications />
            </Sidebar>
        </ContextProvider>
    );
};

export default VideoCallArea;
