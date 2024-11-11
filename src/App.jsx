import "@/App.css";
import { AppProvider } from "@/context/AppContext.jsx";
import Chat from "@/components/chat/index.jsx";
import Login from "@/components/login/index.jsx";

import { BrowserRouter, Switch, Route } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <AppProvider>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route path="/" component={Chat} />
          </Switch>
        </AppProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
