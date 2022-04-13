import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import SearchChatRoom from "./components/SearchChatRoom";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={"/"}>
                    <SearchChatRoom />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
