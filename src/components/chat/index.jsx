

import "./index.css";

import ChatContent from "./chatcontent/index.jsx";
import Slidebar from "./slidebar/index.jsx";
import AddFriend from "./modal/addfriend/index.jsx";
import AddRoom from "./modal/addroom/index.jsx";
import Contact from "./modal/contact/index.jsx";
function Chat() {
  
  return (
    <>
      <div className="chat_container">
        <Slidebar />
        <ChatContent />
      </div>
      <AddRoom></AddRoom>
      <AddFriend></AddFriend>
      <Contact></Contact>
    </>
  );
}
export default Chat;
