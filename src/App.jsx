import { BrowserRouter, Switch, Route } from "react-router-dom";
import Chat from "@/components/chat/Chat";
import { AppProvider } from "@/context/AppContext.jsx";
import Login from "@/components/login/Login";
function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route path="/" component={Chat} />
        </Switch>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
