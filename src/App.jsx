/* eslint-disable no-unused-vars */
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./App.css";

import Chat from "./components/chat/Chat.jsx";
import { Provider } from "./components/context/Context.jsx";
import Login from "./components/login/Login.jsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <Provider>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route path="/" component={Chat} />
          </Switch>
        </Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
