import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Chat from "./components/Chat";
import SearchChatRoom from "./components/SearchChatRoom";
import VideoCallArea from "./components/VideoChatPages/VideoCallArea";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={"/"}>
                    <SearchChatRoom />
                </Route>
                <Route exact path={"/chat/:roomId"}>
                    <Chat />
                </Route>
                <Route path="/video-call" exact>
                    <VideoCallArea />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
