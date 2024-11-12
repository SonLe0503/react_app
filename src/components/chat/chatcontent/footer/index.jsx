import { AppContext } from "@/context/AppContext";
import { db } from "@/config/firebase.js";

import { useContext, useState } from "react";

import { Input } from "antd";

import { useEffect, useRef } from "react";

import { addDoc, collection } from "firebase/firestore";

import StickerPicker from "../../sticker";
function ChatFooter() {
  const { infoUser, selectedRoom, selectedFriend } = useContext(AppContext);
  const [showEmoji, setShowEmoji] = useState("");
  const [inputValue, setInputValue] = useState("");
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
  const handleShowEmoji = () => {
    setShowEmoji((prev) => !prev);
  };
  const handleSelectedReactIcon = (obj) => {
    const { type, data } = obj;

    if (type === "emoji") {
      setInputValue((prevInputValue) => prevInputValue + data);
    }

    if (["sticker", "gif"].includes(type)) {
      console.log(data);
      addDoc(collection(db, "messages"), {
        createAt: new Date(),
        text: data,
        uid: infoUser.uid,
        displayName: infoUser.displayName,
        photoURL: infoUser.photoURL,
        roomId: selectedRoom.id,
        type: "sticker",
      });
    }
  };
  const handleSend = async () => {
    if (infoUser) {
      if (inputValue.trim() === "") return;
      const roomId = selectedRoom
        ? selectedRoom.id
        : [infoUser.uid, selectedFriend.uid].sort().join("_");
      try {
        const message = await addDoc(collection(db, "messages"), {
          createAt: new Date(),
          text: inputValue,
          displayName: infoUser.displayName,
          photoURL: infoUser.photoURL,
          roomId: roomId,
          uid: infoUser.uid,
        });
        console.log("Document written with ID: ", message.id);
      } catch (error) {
        console.log(error);
      }
      setInputValue("");
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
                color: "rgba(255, 255, 255, 1)",
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
            <div className="icon_emoji">
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
