import { useContext } from "react";

import { Input } from "antd";

import { useEffect, useRef  } from "react";

import StickerPicker from "../sticker/StickerPicker";
import { Context } from "../../context/Context";
function ChatFooter() {
  const {
    handleSend,
    handleShowEmoji,
    showEmoji,
    handleSelectedReactIcon,
    inputValue,
    setInputValue,
    setShowEmoji
  } = useContext(Context);
  const showRef = useRef(null);
  const buttonRef = useRef(null);
   const handleClickOutside = (event) => {
    if (
      showRef.current &&
      buttonRef.current &&
      !showRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target)
    ) {
      setShowEmoji(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
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
              ref={buttonRef}
            ></img>
            <div  className="icon_emoji">
              {showEmoji && (
                <div ref={showRef} className="icon_emoji_box">
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
    </>
  );
}
export default ChatFooter;
