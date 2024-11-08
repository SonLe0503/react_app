import { Col } from "antd";

import { useContext } from "react";

import { Context } from "../../context/Context";

import "./ChatContent.css";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
function ChatContent() {
  const { selectedRoom, selectedFriend } = useContext(Context);
  return (
    <>
      <Col span={18} className="chatcontent">
        {selectedRoom || selectedFriend ? (
          <div className="chatcontent_container">
            <ChatHeader></ChatHeader>
            <div className="chat_message">
              <ChatMessage></ChatMessage>
              <ChatFooter></ChatFooter>
            </div>
          </div>
        ) : (
          <p className="p">
            Chọn một phòng hoặc một người bạn để bắt đầu trò chuyện ngay nào !!!
          </p>
        )}
      </Col>
    </>
  );
}
export default ChatContent;
