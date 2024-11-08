import { UserAddOutlined } from "@ant-design/icons";

import { useContext } from "react";

import { Button, Avatar } from "antd";

import { Context } from "../../context/Context";
function ChatHeader() {
  const { selectedRoom, handleShowModalFriend, usersData, selectedFriend } =
    useContext(Context);
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
              <div className="header_avaname">
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
