/* eslint-disable react/prop-types */

import { auth, db, database } from "@/config/firebase.js";

import { createContext } from "react";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { useHistory } from "react-router-dom";

import { useState, useEffect } from "react";

import {
  onSnapshot,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  onDisconnect,
  onValue,
  ref,
  set,
  serverTimestamp,
} from "firebase/database";
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
  const [isModalAddRoom, setIsModalAddRoom] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState("");

  const [userState, setUserState] = useState("offline");
  const [activeTab, setActiveTab] = useState("menu_allrooms");
  const [isModalContact, setIsModalContact] = useState(false);
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
  const [isModalFriend, setIsModalFriend] = useState("");

  const [isUserInfo, setIsUserInfo] = useState("");
  const closeUserInfo = () => {
    setIsUserInfo(false);
  };
  const handleShowChatFriend = (friend) => {
    setSelectedRoom("");
    if (friend && friend.uid) {
      setSelectedFriend(friend);
    }
  };
  const handleShowModal = () => {
    setIsModalAddRoom(!isModalAddRoom);
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

  const setUpPresence = (userId) => {
    const userStatusDatabaseRef = ref(database, `/status/${userId}`);
    const connectedRef = ref(database, ".info/connected");

    onValue(connectedRef, (snapshot) => {
      if (!snapshot.val()) {
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
      return `  Last seen: a few seconds ago`;
    } else if (minutesOffline < 60) {
      return `  Last seen: ${minutesOffline} minutes ago`;
    } else if (hoursOffline < 24) {
      return `  Last seen: ${hoursOffline} hours ago`;
    } else {
      return `  Last seen: ${daysOffline} days ago`;
    }
  };

  const handleShowContact = () => {
    setIsModalContact(!isModalContact);
    setActiveTab("menu_addFriend");
  };
  useEffect(() => {
    if (!infoUser || (!selectedRoom && !selectedFriend)) return;

    const roomId = selectedRoom
      ? selectedRoom.id
      : [infoUser.uid, selectedFriend.uid].sort().join("_");
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
    const handleBeforeUnload = () => {
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
  useEffect(() => {
    if (infoUser.uid) {
      const result = onSnapshot(collection(db, "rooms"), async (snapshot) => {
        const roomsData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (room) => room.members && room.members.includes(infoUser.uid)
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
  }, [infoUser.uid, selectedRoom]);
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
    <AppContext.Provider
      value={{
        infoUser,
        rooms,
        isModalAddRoom,
        selectedRoom,
        usersData,
        message,
        userState,
        activeTab,
        isModalContact,
        selectedFriend,
        isModalFriend,
        isUserInfo,
        setIsUserInfo,
        setIsModalFriend,
        setIsModalContact,
        setSelectedRoom,
        setIsModalAddRoom,
        setMessage,
        setUserState,
        setActiveTab,
        closeUserInfo,
        handleLogOut,
        handleShowMess,
        handleShowModal,
        handleShowContact,
        handleShowChatFriend,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
