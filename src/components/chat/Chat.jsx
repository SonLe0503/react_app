import AddFriend from "./AddFriend";
import AddRoom from "./AddRoom";
import "./Chat.css";
import Contact from "./Contact";

import ChatContent from "./chatcontent/ChatContent";
import Slidebar from "./slidebar/Slidebar";
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
