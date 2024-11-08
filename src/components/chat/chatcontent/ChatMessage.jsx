import { useContext } from "react";

import { isToday, format, isYesterday, isSameWeek } from "date-fns";

import { Avatar } from "antd";

import { Context } from "../../context/Context";
function ChatMessage() {
  const { message, currentUserId } = useContext(Context);
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
                    msg.uid === currentUserId ? "flex-end" : "flex-start",
                }}
                className="message"
              >
                <div>
                  <span>
                    <Avatar src={msg.photoURL} className="mess_avatar" />
                  </span>
                  <span className="mess_username">{msg.displayName}</span>
                  <span className="mess_time">{timeFormatted}</span>
                </div>
                <div
                  style={{
                    textAlign: msg.uid === currentUserId ? "right" : "left",
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
                          msg.uid === currentUserId ? "#27A4F2" : "gray",
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
    </>
  );
}
export default ChatMessage;
