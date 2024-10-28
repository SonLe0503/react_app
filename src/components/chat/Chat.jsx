/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  getDocs,
} from "firebase/firestore";
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

import ChatContent from "./chatcontent/ChatContent";
import Slidebar from "./slidebar/Slidebar";

function Chat() {
  const history = useHistory();
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
        const dateA = a.createAt.seconds * 1000;
        const dateB = b.createAt.seconds * 1000;
        return dateA - dateB;
      });
      setMessage(sortedMess);
    });
    return () => result();
  }, [selectedRoom]);
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
      <div style={{ width: "100%", display: "flex", height: "100vh" }}>
        <Slidebar
          infoUser={infoUser}
          handleLogOut={handleLogOut}
          rooms={rooms}
          selectedRoom={selectedRoom}
          handleShowMess={handleShowMess}
          handleShowRoomFriend={handleShowRoomFriend}
          handleShowModal={handleShowModal}
          isShowRoomFriend={isShowRoomFriend}
          usersData={usersData}
          userState={userState}
        />
        <ChatContent
          selectedRoom={selectedRoom}
          handleShowModalFriend={handleShowModalFriend}
          usersData={usersData}
          message={message}
          currentUserId={currentUserId}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSend={handleSend}
          handleShowEmoji={handleShowEmoji}
          showEmoji={showEmoji}
          handleSelectedReactIcon={handleSelectedReactIcon}
        />
      </div>
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
