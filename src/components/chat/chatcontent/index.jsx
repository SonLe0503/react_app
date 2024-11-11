import { AppContext } from "@/context/AppContext";

import { Col } from "antd";

import { useContext } from "react";

import ChatFooter from "./footer";
import ChatHeader from "./header";
import "./index.css";
import ChatMessage from "./message";
function ChatContent() {
  const { selectedRoom, selectedFriend } = useContext(AppContext);
  return (
    <>
      <Col span={18} className="chat_content">
        {selectedRoom || selectedFriend ? (
          <div className="chat_content_container">
            <ChatHeader></ChatHeader>
            <div className="chat_message">
              <ChatMessage></ChatMessage>
              <ChatFooter></ChatFooter>
            </div>
          </div>
        ) : (
          <p className="p">
            Choose a room or a friend to start chatting right away!
          </p>
        )}
      </Col>
    </>
  );
}
export default ChatContent;
