/* eslint-disable no-unused-vars */
import { PlusSquareOutlined, UserAddOutlined } from "@ant-design/icons";
import create from "@ant-design/icons/lib/components/IconFont";

import styled from "styled-components";

import { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

import { Collapse, Col, Row, Button, Input, Typography } from "antd";
import { Avatar } from "antd";

import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDoc,
  doc,
  addDoc,
  getDocs,
  orderBy,
} from "firebase/firestore";

import EmojiPicker from "emoji-picker-react";

import {
  formatDistanceToNow,
  isToday,
  format,
  isYesterday,
  isSameWeek,
} from "date-fns";

import {
  onDisconnect,
  onValue,
  ref,
  set,
  serverTimestamp,
} from "firebase/database";

import { auth, db, database } from "../../firebase";

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
  const [selectedRoom, setSelectedRoom] = useState("");
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
  const [usersData, setUsersData] = useState([]);
  useEffect(() => {
    if (currentUserId) {
      const result = onSnapshot(collection(db, "rooms"), async (snapshot) => {
        const roomsData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (room) => room.members && room.members.includes(currentUserId)
          );
        const memberUids = roomsData.flatMap((room) => room.members);
        const q = query(
          collection(db, "users"),
          where("uid", "in", memberUids)
        );
        const querySnapshot = await getDocs(q);
        let usersData = [];
        usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (selectedRoom) {
          usersData = usersData.filter((elm) =>
            selectedRoom.members.includes(elm.uid)
          );
        }
        setUsersData(usersData);
        setRooms(roomsData);
      });
      return () => result();
    }
  }, [currentUserId, selectedRoom]);

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };
  const handleShowMess = (room) => {
    setSelectedRoom(room);
  };
  const [isModalFriend, setIsModalFriend] = useState("");
  const handleShowModalFriend = () => {
    setIsModalFriend(!isModalFriend);
  };
  const [showEmoji, setShowEmoji] = useState("");
  const handleShowEmoji = () => {
    setShowEmoji((prev) => !prev);
  };
  const [inputValue, setInputValue] = useState("");
  const handleEmojiClick = (emojiObject) => {
    setInputValue((prev) => prev + emojiObject.emoji);
  };
  const handleSend = async () => {
    if (infoUser) {
      if (inputValue.trim() === "") return;
      console.log(collection(db, "messages"));
      try {
        const message = await addDoc(collection(db, "messages"), {
          createAt: new Date(),
          text: inputValue,
          displayName: infoUser.displayName,
          photoURL: infoUser.photoURL,
          roomId: selectedRoom.id,
          uid: infoUser.uid,
        });
        console.log("Document written with ID: ", message.id);
      } catch (error) {
        console.log(error);
      }
      setInputValue("");
    }
  };
  const [message, setMessage] = useState([
    {
      id: "",
      createAt: "",
      displayName: "",
      photoURL: "",
      roomId: "",
      text: "",
      uid: "",
    },
  ]);
  useEffect(() => {
    if (!selectedRoom.id) return;
    const q = query(
      collection(db, "messages"),
      where("roomId", "==", selectedRoom.id)
    );
    const result = onSnapshot(q, (snapshot) => {
      const messData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sortedMess = messData.sort((a, b) => {
        const dateA = a.createAt.seconds * 1000; // Chuyển đổi giây thành mili giây
        const dateB = b.createAt.seconds * 1000; // Chuyển đổi giây thành mili giây
        return dateA - dateB;
      });
      setMessage(sortedMess);
    });
    return () => result();
  }, [selectedRoom]);
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
  const [showRoomFriend, setShowRoomFriend] = useState(false);
  const handleRoomFriend = () => {
    setShowRoomFriend(!showRoomFriend);
  };
  const [isShowRoomFriend, setIsShowRoomFriend] = useState(false);
  const handleShowRoomFriend = () => {
    setIsShowRoomFriend(true);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUpPresence(user.uid);
      } else {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userStatusDatabaseRef = ref(
            database,
            `/status/${currentUser.uid}`
          );
          set(userStatusDatabaseRef, {
            state: "offline",
            last_changed: serverTimestamp(),
          })
            .then(() => {
              console.log("User is offline");
            })
            .catch((error) => {
              console.error("Error updating status to offline: ", error);
            });
        }
      }
    });
    const handleBeforeUnload = (event) => {
      const userStatusDatabaseRef = ref(
        database,
        `/status/${auth.currentUser.uid}`
      );
      set(userStatusDatabaseRef, {
        state: "offline",
        last_changed: serverTimestamp(),
      });
    };

    // Hàm xử lý khi cửa sổ mất focus
    const handleBlur = () => {
      const userStatusDatabaseRef = ref(
        database,
        `/status/${auth.currentUser.uid}`
      );
      set(userStatusDatabaseRef, {
        state: "away",
        last_changed: serverTimestamp(),
      });
    };

    // Hàm theo dõi hoạt động của người dùng
    const handleUserActivity = () => {
      const userStatusDatabaseRef = ref(
        database,
        `/status/${auth.currentUser.uid}`
      );
      set(userStatusDatabaseRef, {
        state: "online",
        last_changed: serverTimestamp(),
      });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("mousedown", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);

    return () => {
      unsubscribe();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("mousedown", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
    };
  }, [auth, database]);
  const setUpPresence = (userId) => {
    const userStatusDatabaseRef = ref(database, `/status/${userId}`);
    const connectedRef = ref(database, ".info/connected");

    onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === false) {
        return;
      }
      onDisconnect(userStatusDatabaseRef).set({
        state: "offline",
        last_changed: serverTimestamp(),
      });
      set(userStatusDatabaseRef, {
        state: "online",
        last_changed: serverTimestamp(),
      });
    });
  };
  const [userState, setUserState] = useState("offline");
  const handleOfflineDuration = (lastChangedTime) => {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - lastChangedTime;

    const secondsOffline = Math.floor(timeDifference / 1000);
    const minutesOffline = Math.floor(secondsOffline / 60);
    const hoursOffline = Math.floor(minutesOffline / 60);
    const daysOffline = Math.floor(hoursOffline / 24);

    if (secondsOffline < 60) {
      return ` - Last seen: a few seconds ago`;
    } else if (minutesOffline < 60) {
      return ` - Last seen: ${minutesOffline} minutes ago`;
    } else if (hoursOffline < 24) {
      return ` - Last seen: ${hoursOffline} hours ago`;
    } else {
      return ` - Last seen: ${daysOffline} days ago`;
    }
  };
  useEffect(() => {
    usersData.forEach((user) => {
      const userStatusRef = ref(database, `/status/${user.uid}`);
      const unsubscribe = onValue(userStatusRef, (snapshot) => {
        const statusData = snapshot.val();
        if (statusData) {
          const currentTime = new Date().getTime();
          const lastChangedTime = statusData.last_changed
            ? statusData.last_changed
            : currentTime;

          let offlineDuration = "";
          if (statusData.state === "offline") {
            offlineDuration = handleOfflineDuration(lastChangedTime);
          }
          setUserState((prevStates) => ({
            ...prevStates,
            [user.uid]: {
              state: statusData.state,
              offlineDuration: offlineDuration,
            },
          }));
        }
      });
      return () => unsubscribe();
    });
  }, [usersData]);
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
                    <Button style={{ background: "none" }}>
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
                          <span
                            style={{
                              transform: isShowAdd
                                ? "rotate(90deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.3s",
                            }}
                          >
                            &gt;
                          </span>
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
                                  border: "none",
                                }}
                                onClick={() => handleShowMess(room)}
                              >
                                <span onClick={handleShowRoomFriend}>
                                  {room.roomName}
                                </span>
                              </Button>
                            ))}
                            <Button
                              icon={<PlusSquareOutlined />}
                              onClick={handleShowModal}
                              style={{ background: "none", boder: "none" }}
                            >
                              Add room
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
                {isShowRoomFriend && (
                  <Col span={24} style={{ marginTop: "20px" }}>
                    <div style={{ position: "relative", flex: "1" }}>
                      <Button
                        style={{
                          width: "100%",
                          background: "none",
                          border: "none",
                          wordWrap: "break-word",
                        }}
                        onClick={handleRoomFriend}
                      >
                        <span>Friend in room: </span>
                        <span style={{ fontWeight: "bold" }}>
                          {selectedRoom.roomName}
                        </span>
                      </Button>
                      {showRoomFriend && (
                        <div
                          style={{
                            position: "absolute",
                            width: "100%",
                            flex: "1",
                            padding: "10px",
                            boxSizing: "border-box",
                          }}
                        >
                          {usersData.map((user) => (
                            <div
                              key={user.id}
                              style={{
                                marginTop: "10px",
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                border: "none",
                                width: "100%",
                                padding: "10px",
                                flex: "1",
                                boxSizing: "border-box",
                                overflow: "hidden",
                                wordWrap: "break-word",
                                display: "flex",
                                borderRadius: "5px",
                              }}
                            >
                              <div
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  marginRight: "10px",
                                  backgroundColor:
                                    userState[user.uid] &&
                                    userState[user.uid].state === "offline"
                                      ? "transparent"
                                      : "green",
                                }}
                              ></div>
                              <span>
                                {user.displayName}{" "}
                                {userState[user.uid] &&
                                  userState[user.uid].state === "offline" &&
                                  userState[user.uid].offlineDuration}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          </div>
        </Col>
        <Col
          span={18}
          style={{
            backgroundImage: "url(/bgimage.png)",
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {selectedRoom ? (
            <div
              style={{ position: "relative", height: "100vh", width: "100%" }}
            >
              <div className="header" style={{ width: "100%" }}>
                <div
                  style={{
                    padding: "15px",
                    borderBottom: "1px solid white",
                    display: "flex",
                    justifyContent: "space-between",
                    zIndex: "10",
                  }}
                >
                  <div className="header-info">
                    <div>
                      <div style={{ color: "#fff", fontWeight: "bold" }}>
                        {selectedRoom.roomName}
                      </div>
                      <div style={{ color: "#fff", fontSize: "13px" }}>
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
                        Inviite
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
              <div
                style={{
                  flex: "1",
                  width: "100%",
                  position: "absolute",
                  bottom: "0",
                }}
              >
                <div
                  className="body"
                  style={{
                    flex: "1",
                    overflowY: "auto",
                    display: "flex",
                    width: "100%",
                    flexDirection: "column-reverse",
                    height: "calc(100vh - 140px)",
                  }}
                >
                  <div className="body-message">
                    {message.map((msg) => {
                      const createAtDate = convertTimestampToDate(msg.createAt);
                      const timeFormatted = formatCustomTime(createAtDate);
                      return (
                        <div
                          key={msg.id}
                          style={{
                            marginLeft: "10px",
                            marginRight: "10px",
                            marginTop: "15px",
                            marginBottom: "15px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems:
                              msg.uid === currentUserId
                                ? "flex-end"
                                : "flex-start",
                          }}
                        >
                          <div>
                            <span>
                              <Avatar
                                style={{ width: "25px", height: "25px" }}
                                src={msg.photoURL}
                              />
                            </span>
                            <span
                              style={{
                                color: "#fff",
                                fontWeight: "bold",
                                marginLeft: "5px",
                                marginRight: "5px",
                              }}
                            >
                              {msg.displayName}
                            </span>
                            <span
                              style={{
                                color: "#fff",
                                marginLeft: "5px",
                                fontSize: "12px",
                              }}
                            >
                              {timeFormatted}
                            </span>
                          </div>
                          <div
                            style={{
                              marginTop: "10px",
                              width: "70%",
                              textAlign:
                                msg.uid === currentUserId ? "right" : "left",
                            }}
                          >
                            <span
                              style={{
                                marginLeft: "35px",
                                color: "#fff",
                                fontSize: "14px",
                                background:
                                  msg.uid === currentUserId
                                    ? "#27A4F2"
                                    : "gray",
                                padding: "7px",
                                borderRadius: "15px",
                                display: "inline-block",
                                wordWrap: "break-word",
                                maxWidth: "100%",
                                textAlign: "left",
                              }}
                            >
                              {msg.text}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div
                  className="footer"
                  style={{
                    display: "flex",
                    position: "relative",
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
                    <div
                      style={{
                        display: "flex",
                        border: "1px solid white",
                        borderRadius: "15px",
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      <Input
                        className="input"
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
                        onClick={handleShowEmoji}
                        style={{
                          background: "none",
                          border: "none",
                          width: "20px",
                          height: "20px",
                          marginTop: "auto",
                          marginBottom: "auto",
                          marginRight: "5px",
                        }}
                        src="/happy-icon.png"
                      ></img>
                      <div
                        style={{
                          position: "absolute",
                          bottom: "50px",
                          right: "20px",
                        }}
                      >
                        {showEmoji && (
                          <div>
                            {<EmojiPicker onEmojiClick={handleEmojiClick} />}
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
