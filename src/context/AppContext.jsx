/* eslint-disable react/prop-types */

import { createContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { onSnapshot, collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { onDisconnect, onValue, ref, set, serverTimestamp } from "firebase/database";
import { auth, db, database } from "@/config/firebase";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const history = useHistory();

  const [infoUser, setInfoUser] = useState({
    displayName: "",
    photoURL: "",
    uid: "",
  });
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [isModalVisible, setIsModalVisible] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [isModalFriend, setIsModalFriend] = useState("");
  const [selectedFriend, setSelectedFriend] = useState("");
  const [showEmoji, setShowEmoji] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState([]);
  const [isShowRoomFriend, setIsShowRoomFriend] = useState(true);
  const [userState, setUserState] = useState("offline");
  const [isMenu, setIsMenu] = useState("");
  const [activeTab, setActiveTab] = useState("menu_notifications");
  const [isContact, setIsContact] = useState(false);
  const [addFriends, setAddFriends] = useState([]);

  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;

  // Authentication state change effect
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setInfoUser({
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        });
        history.push("/");
      } else {
        history.push("/login");
      }
    });
    return () => unsubscribe();
  }, [history]);

  // Fetch rooms and users data effect
  useEffect(() => {
    if (currentUserId) {
      const result = onSnapshot(collection(db, "rooms"), async (snapshot) => {
        const roomsData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((room) => room.members && room.members.includes(currentUserId));
        const memberUids = roomsData.flatMap((room) => room.members);
        const q = query(collection(db, "users"), where("uid", "in", memberUids));
        const querySnapshot = await getDocs(q);
        let usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (selectedRoom) {
          usersData = usersData.filter((elm) => selectedRoom.members.includes(elm.uid));
        }
        setUsersData(usersData);
        setRooms(roomsData);
      });
      return () => result();
    }
  }, [currentUserId, selectedRoom]);

  // Fetch messages effect
  useEffect(() => {
    if (!infoUser || (!selectedRoom && !selectedFriend)) return;

    const roomId = selectedRoom ? selectedRoom.id : [infoUser.uid, selectedFriend.uid].sort().join("_");
    const q = query(collection(db, "messages"), where("roomId", "==", roomId));
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
  }, [infoUser, selectedRoom, selectedFriend]);

  // User presence effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUpPresence(user.uid);
      } else {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userStatusDatabaseRef = ref(database, `/status/${currentUser.uid}`);
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

    const handleBeforeUnload = () => {
      const userStatusDatabaseRef = ref(database, `/status/${auth.currentUser.uid}`);
      set(userStatusDatabaseRef, {
        state: "offline",
        last_changed: serverTimestamp(),
      });
    };

    const handleBlur = () => {
      const userStatusDatabaseRef = ref(database, `/status/${auth.currentUser.uid}`);
      set(userStatusDatabaseRef, {
        state: "away",
        last_changed: serverTimestamp(),
      });
    };

    const handleUserActivity = () => {
      const userStatusDatabaseRef = ref(database, `/status/${auth.currentUser.uid}`);
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

  // User status effect
  useEffect(() => {
    usersData.forEach((user) => {
      const userStatusRef = ref(database, `/status/${user.uid}`);
      const unsubscribe = onValue(userStatusRef, (snapshot) => {
        const statusData = snapshot.val();
        if (statusData) {
          const currentTime = new Date().getTime();
          const lastChangedTime = statusData.last_changed ? statusData.last_changed : currentTime;

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

  // Friend requests effect
  useEffect(() => {
    const q = query(collection(db, "friend_requests"), where("from", "==", infoUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const friendsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAddFriends(friendsData);
    });
    return () => unsubscribe();
  }, [infoUser]);

  // Helper functions
  const handleShowModal = () => {
    setIsModalVisible(!isModalVisible);
    setActiveTab("menu_addroom");
  };

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

  const handleShowModalFriend = () => {
    setIsModalFriend(!isModalFriend);
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
      const roomId = selectedRoom ? selectedRoom.id : [infoUser.uid, selectedFriend.uid].sort().join("_");
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

  const handleShowRoomFriend = () => {
    setIsShowRoomFriend(true);
  };

  const handleShowContact = () => {
    setIsContact(!isContact);
    setActiveTab("menu_friends");
  };

  const handleShowChatFriend = (friend) => {
    setSelectedRoom("");
    if (friend && friend.uid) {
      setSelectedFriend(friend);
    }
  };

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

  return (
    <AppContext.Provider
      value={{
        history,
        infoUser,
        rooms,
        isModalVisible,
        selectedRoom,
        usersData,
        message,
        isShowRoomFriend,
        userState,
        isMenu,
        activeTab,
        showEmoji,
        inputValue,
        currentUserId,
        isContact,
        isModalFriend,
        addFriends,
        selectedFriend,
        setShowEmoji,
        setIsContact,
        setInputValue,
        setInfoUser,
        setSelectedRoom,
        setIsModalVisible,
        setUsersData,
        setMessage,
        setIsModalFriend,
        setUserState,
        setIsMenu,
        setActiveTab,
        handleLogOut,
        handleShowMess,
        handleShowModal,
        handleShowRoomFriend,
        handleShowModalFriend,
        handleSend,
        handleSelectedReactIcon,
        handleShowEmoji,
        handleShowContact,
        handleShowChatFriend,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
