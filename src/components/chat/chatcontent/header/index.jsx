import { AppContext } from "@/context/AppContext";

import { UserAddOutlined } from "@ant-design/icons";

import { useContext } from "react";

import { Button, Avatar } from "antd";
function ChatHeader() {
  const {
    selectedRoom,
    usersData,
    selectedFriend,
    setIsModalFriend,
    isModalFriend,
    isUserInfo,
    setIsUserInfo,
    userState,
  } = useContext(AppContext);
  const handleShowModalFriend = () => {
    setIsModalFriend(!isModalFriend);
  };
  const showUserInfo = () => {
    setIsUserInfo(!isUserInfo);
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
                <img style={{width:"40px", height:"40px", borderRadius:"50%"}}
                  src={selectedFriend.photoURL}
                  onClick={showUserInfo}
                ></img>
                <div>
                  <div className="info_name2">{selectedFriend.displayName}</div>
                  <div style={{color:"rgba(255,255,255,0.7)", marginLeft:"10px"}}>
                    {userState[selectedFriend.uid] &&
                      userState[selectedFriend.uid].state === "offline" &&
                      userState[selectedFriend.uid].offlineDuration}
                  </div>
                </div>
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
