import { AppContext } from "@/context/AppContext";

import { UserAddOutlined } from "@ant-design/icons";

import { useContext, useState } from "react";

import { Button, Avatar } from "antd";
function ChatHeader() {
  const { selectedRoom, usersData, selectedFriend } =
    useContext(AppContext);
    const [isModalFriend, setIsModalFriend] = useState("");
    const handleShowModalFriend = () => {
      setIsModalFriend(!isModalFriend);
    };
  return (
    <>
      <div className="chat_header">
        {selectedRoom ? (
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
                <Avatar.Group max={{ count: 2 }}>
                  {usersData.map((user) => (
                    <Avatar key={user.id} src={user.photoURL}></Avatar>
                  ))}
                </Avatar.Group>
              </div>
            </div>
          </div>
        ) : selectedFriend ? (
          <div className="header">
            <div className="header_info">
              <div className="header_avatar_name">
                <Avatar src={selectedFriend.photoURL}></Avatar>
                <div className="info_name2">{selectedFriend.displayName}</div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
export default ChatHeader;
