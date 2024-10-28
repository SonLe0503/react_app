/* eslint-disable react/prop-types */

import { UserAddOutlined } from "@ant-design/icons";

import { Col, Button, Avatar, Input } from "antd";

import { isToday, format, isYesterday, isSameWeek } from "date-fns";

import StickerPicker from "../sticker/StickerPicker";

import "./ChatContent.css";
function ChatContent({
  selectedRoom,
  handleShowModalFriend,
  usersData,
  message,
  currentUserId,
  inputValue,
  setInputValue,
  handleSend,
  handleShowEmoji,
  showEmoji,
  handleSelectedReactIcon,
}) {
  const isImageUrl = (url) => {
    return (
      typeof url === "string" &&
      (/\.(jpg|jpeg|png|bmp|webp|svg)$/i.test(url) ||
        /giphy\.com\/media\/.+\/\d+\.gif/.test(url) ||
        url.endsWith(".gif"))
    );
  };
  const convertTimestampToDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      return new Date(
        timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000)
      );
    }
    return null;
  };
  const formatCustomTime = (date) => {
    if (isToday(date)) {
      return `Today at ${format(date, "h:mm a")}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, "h:mm a")}`;
    } else if (isSameWeek(date, new Date())) {
      return `Last ${format(date, "EEEE")} at ${format(date, "h:mm a")}`;
    }
    return format(date, "MM/dd/yyyy");
  };
  return (
    <>
      <Col span={18} className="chatcontent">
        {selectedRoom ? (
          <div className="chat_container">
            <div className="chat_header">
              <div className="header">
                <div className="header_info">
                  <div>
                    <div className="info_name">{selectedRoom.roomName}</div>
                    <div className="info_des">{selectedRoom.description}</div>
                  </div>
                </div>
                <div className="header_invitation">
                  <div className="invitation_button">
                    <Button
                      className="btn_inivite"
                      onClick={() => handleShowModalFriend()}
                      icon={<UserAddOutlined />}
                    >
                      Inivite
                    </Button>
                    <Avatar.Group max={2}>
                      {usersData.map((user) => (
                        <Avatar key={user.id} src={user.photoURL}></Avatar>
                      ))}
                    </Avatar.Group>
                  </div>
                </div>
              </div>
            </div>
            <div className="chat_message">
              <div className="chat_listmessage">
                <div className="list_message">
                  {message.map((msg) => {
                    const createAtDate = convertTimestampToDate(msg.createAt);
                    const timeFormatted = formatCustomTime(createAtDate);
                    return (
                      <div
                        key={msg.id}
                        style={{
                          alignItems:
                            msg.uid === currentUserId
                              ? "flex-end"
                              : "flex-start",
                        }}
                        className="message"
                      >
                        <div>
                          <span>
                            <Avatar
                              src={msg.photoURL}
                              className="mess_avatar"
                            />
                          </span>
                          <span className="mess_username">
                            {msg.displayName}
                          </span>
                          <span className="mess_time">{timeFormatted}</span>
                        </div>
                        <div
                          style={{
                            textAlign:
                              msg.uid === currentUserId ? "right" : "left",
                          }}
                          className="mess_text"
                        >
                          {isImageUrl(msg.text) ? (
                            <img
                              src={msg.text}
                              alt="sticker or gif"
                              className="img_display"
                            />
                          ) : (
                            <span
                              style={{
                                background:
                                  msg.uid === currentUserId
                                    ? "#27A4F2"
                                    : "gray",
                              }}
                              className="text_display"
                            >
                              {msg.text}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="footer">
                <div className="footer_send">
                  <div className="footer_send_mess">
                    <Input
                      style={{
                        flex: "1",
                        border: "none",
                        background: "none",
                        color: "#fff",
                      }}
                      placeholder="Type a message...."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSend();
                        }
                      }}
                    ></Input>
                    <img
                      className="send_icon"
                      onClick={handleShowEmoji}
                      src="/happy-icon.png"
                    ></img>
                    <div className="icon_emoji">
                      {showEmoji && (
                        <div>
                          {
                            <StickerPicker
                              handleSelectedReactIcon={handleSelectedReactIcon}
                            />
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </Col>
    </>
  );
}
export default ChatContent;
