import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./App.css";

import Chat from "./components/chat/Chat.jsx";
import Login from "./components/login/Login.jsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route path="/" component={Chat} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
