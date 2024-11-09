import { Col } from "antd";

import { useContext } from "react";

import { AppContext } from "@/context/AppContext";

import "@/components/chat/chatcontent/ChatContent.css";
import ChatFooter from "@/components/chat/chatcontent/ChatFooter";
import ChatHeader from "@/components/chat/chatcontent/ChatHeader";
import ChatMessage from "@/components/chat/chatcontent/ChatMessage";
function ChatContent() {
  const { selectedRoom, selectedFriend } = useContext(AppContext);
  return (
    <>
      <Col span={18} className="chatcontent">
        {selectedRoom || selectedFriend ? (
          <div className="chatcontent_container">
            <ChatHeader />
            <div className="chat_message">
              <ChatMessage />
              <ChatFooter />
            </div>
          </div>
        ) : (
          <p className="p">Chọn một phòng hoặc một người bạn để bắt đầu trò chuyện ngay nào !!!</p>
        )}
      </Col>
    </>
  );
}
export default ChatContent;
