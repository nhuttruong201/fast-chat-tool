import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Chat from "./components/Chat";
import SearchChatRoom from "./components/SearchChatRoom";

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
            </Switch>
        </BrowserRouter>
    );
}

export default App;
