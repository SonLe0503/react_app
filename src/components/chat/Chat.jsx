import AddFriend from "@/components/chat/AddFriend";
import AddRoom from "@/components/chat/AddRoom";
import Contact from "@/components/chat/Contact";
import ChatContent from "@/components/chat/chatcontent/ChatContent";
import Slidebar from "@/components/chat/slidebar/Slidebar";

import "@/components/chat/Chat.css";
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
