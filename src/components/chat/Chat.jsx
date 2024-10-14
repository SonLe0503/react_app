/* eslint-disable no-unused-vars */
import { PlusSquareOutlined, UserAddOutlined } from "@ant-design/icons";

import styled from "styled-components";

import { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

import { Collapse, Col, Row, Button, Input } from "antd";
import { Avatar } from "antd";

import { signOut } from "firebase/auth";

import Panel from "antd/es/splitter/Panel";

import { collection, onSnapshot, query, where } from "firebase/firestore";

import EmojiPicker from "emoji-picker-react";

import { auth, db } from "../../firebase";

import AddFriend from "./AddFriend";
import AddRoom from "./AddRoom";
const ChatContainer = styled.div`
  width: 100%;
  display: flex;
  height: 100vh;
  .slidebar {
    background: gray;
    width: 100%;
    height: 100vh;
  }
  .slidebar-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
  .header-content {
    display: flex;
    justify-content: space-between;
    padding: 20px;
  }
  .input::placeholder {
    color: white;
  }
`;
function Chat() {
  const history = useHistory();
  const [isShowAdd, setIsShowAdd] = useState(false);
  const [infoUser, setInfoUser] = useState({
    displayName: "",
    photoURL: "",
  });
  const [rooms, setRooms] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState("");
  const handleShowModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const handleShowAdd = () => {
    setIsShowAdd(!isShowAdd);
  };
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const infoUser = {
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        };
        setInfoUser(infoUser);
        history.push("/");
        return;
      }
      history.push("/login");
      return;
    });
  }, []);
  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
  useEffect(() => {
    if (currentUserId) {
      const result = onSnapshot(collection(db, "rooms"), (snapshot) => {
        const roomsData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (room) => room.members && room.members.includes(currentUserId)
          );
        setRooms(roomsData);
      });
      return () => result();
    }
  }, [currentUserId]);

  console.log(isShowAdd);

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };
  const [selectedRoom, setSelectedRoom] = useState("");
  const handleShowMess = (room) => {
    setSelectedRoom(room);
  };
  const [isModalFriend, setIsModalFriend] = useState("");
  const handleShowModalFriend = () => {
    setIsModalFriend(!isModalFriend);
  };
  const [showEmoji, setShowEmoji] = useState("");
  const handleShowEmoji = () => {
    setShowEmoji(!showEmoji);
  };
  return (
    <>
      <ChatContainer>
        <Col span={6} style={{ with: "100%" }}>
          <div className="slidebar">
            <div className="slidebar-content">
              <Row style={{ display: "flex" }}>
                <Col span={24} style={{ borderBottom: "1px solid white" }}>
                  <div className="header-content">
                    <div className="content-user">
                      <Avatar src={infoUser.photoURL}></Avatar>
                      <span style={{ margin: "5px" }}>
                        {infoUser.displayName}
                      </span>
                    </div>
                    <Button>
                      <span onClick={handleLogOut}>Logout</span>
                    </Button>
                  </div>
                </Col>
                <Col span={24}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      flex: "1",
                    }}
                  >
                    <div
                      key="1"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: "1",
                        width: "100%",
                        border: "none",
                        background: "none",
                        paddingLeft: 0,
                        alignItems: "flex-start",
                        marginTop: "20px",
                      }}
                    >
                      <div
                        className="All rooms"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          flex: "1",
                          width: "100%",
                        }}
                      >
                        <Button
                          onClick={handleShowAdd}
                          style={{
                            flex: "1",
                            display: "flex",
                            width: "100%",
                            background: "none",
                            border: "none",
                            marginBottom: "10px",
                          }}
                        >
                          All rooms
                        </Button>
                        {isShowAdd && (
                          <>
                            {rooms.map((room) => (
                              <Button
                                key={room.id}
                                style={{
                                  marginBottom: "10px",
                                  background:
                                    selectedRoom === room ? "#fff" : "none",
                                }}
                                onClick={() => handleShowMess(room)}
                              >
                                <span>{room.roomName}</span>
                              </Button>
                            ))}
                            <Button
                              icon={<PlusSquareOutlined />}
                              onClick={handleShowModal}
                              style={{ background: "none" }}
                            >
                              Add room
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
        <Col
          span={18}
          style={{
            backgroundImage: "url(/bgimage1.png)",
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {selectedRoom ? (
            <div>
              <div
                className="header"
                style={{
                  padding: "10px",
                  borderBottom: "1px solid white",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div className="header-info">
                  <div>
                    <div style={{ color: "#fff", fontSize: "20px" }}>
                      {selectedRoom.roomName}
                    </div>
                    <div style={{ color: "#fff" }}>
                      {selectedRoom.description}
                    </div>
                  </div>
                </div>
                <div className="header-invitation">
                  <div>
                    <Button
                      style={{
                        background: "none",
                        color: "#fff",
                        border: "none",
                        marginTop: "auto",
                      }}
                      onClick={() => handleShowModalFriend()}
                      icon={<UserAddOutlined />}
                    >
                      Mời
                    </Button>
                    <Avatar src={infoUser.photoURL}></Avatar>
                  </div>
                </div>
              </div>
              <div className="body" style={{ flex: "1" }}>
                <div className="body-message"></div>
              </div>
              <div
                className="footer"
                style={{
                  display: "flex",
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  left: 0,
                  marginTop: "auto",
                  justifyContent: "center",
                }}
              >
                <div
                  className="body-sendmess"
                  style={{ width: "100%", margin: "10px" }}
                >
                  <div style={{ display: "flex", border: "1px solid white" }}>
                    <Input
                      className="input"
                      style={{
                        flex: "1",
                        border: "none",
                        background: "none",
                        color: "#fff",
                      }}
                      placeholder="Type a message...."
                    ></Input>
                    <Button
                      onClick={handleShowEmoji}
                      style={{ background: "none", border: "none" }}
                    >
                      {"😀"}
                    </Button>
                    <div
                      style={{
                        position: "absolute",
                        bottom: "50px",
                        right: "10px",
                      }}
                    >
                      {showEmoji && <div>{<EmojiPicker />}</div>}
                    </div>
                    <Button type="primary">Send</Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </Col>
      </ChatContainer>
      <AddRoom
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        infoUser={infoUser}
      ></AddRoom>
      <AddFriend
        isModalFriend={isModalFriend}
        setIsModalFriend={setIsModalFriend}
        selectedRoom={selectedRoom}
      ></AddFriend>
    </>
  );
}
export default Chat;
