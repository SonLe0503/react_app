import { AppContext } from "@/context/AppContext";
import { db } from "@/config/firebase.js";

import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";

import { useContext } from "react";

import { Drawer } from "antd";

import {
  arrayRemove,
  collection,
  query,
  updateDoc,
  where,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";

import "./index.css";
function UserInfo() {
  const { selectedFriend, closeUserInfo, isUserInfo, infoUser, userState } =
    useContext(AppContext);
  const handleDeleteContact = async () => {
    const q = query(
      collection(db, "users"),
      where("uid", "==", selectedFriend.uid)
    );
    const unsubscribe1 = onSnapshot(q, async (querySnapshot) => {
      querySnapshot.forEach(async (docSnap) => {
        const userRef = docSnap.ref;
        await updateDoc(userRef, {
          friends: arrayRemove(infoUser.uid),
        });
      });
    });
    const q2 = query(collection(db, "users"), where("uid", "==", infoUser.uid));
    const unsubscribe2 = onSnapshot(q2, async (querySnapshot2) => {
      querySnapshot2.forEach(async (docSnap) => {
        const userRef = docSnap.ref;
        await updateDoc(userRef, {
          friends: arrayRemove(selectedFriend.uid),
        });
      });
    });
    const messageId = [infoUser.uid, selectedFriend.uid].sort().join("_");
    const q3 = query(
      collection(db, "messages"),
      where("roomId", "==", messageId)
    );
    const unsubscribe3 = onSnapshot(q3, async (messageSnapshot) => {
      messageSnapshot.forEach(async (messageDoc) => {
        const messageRef = messageDoc.ref;
        await deleteDoc(messageRef);
      });
    });
    setTimeout(() => {
      unsubscribe1();
      unsubscribe2();
      unsubscribe3();
    }, 1000);
  };
  return (
    <>
      <Drawer
        onClose={closeUserInfo}
        open={isUserInfo}
        title={<div style={{ padding: "9px" }}>User Information</div>}
        style={{ backgroundColor: "gray", color: "rgba(255,255,255,1)" }}
        closeIcon={<CloseOutlined />}
        headerStyle={{ borderBottom: "1px solid white" }}
      >
        <div className="user_content">
          <img className="img_user " src={selectedFriend.photoURL}></img>
          <div className="name_user">{selectedFriend.displayName}</div>
          <div style={{color:"rgba(255,255,255,0.7)"}}>{userState[selectedFriend.uid] &&
            userState[selectedFriend.uid].state === "offline" &&
            userState[selectedFriend.uid].offlineDuration}</div>
        </div>
        <div className="user_contact" onClick={handleDeleteContact}>
          <DeleteOutlined />
          <div className="delete_contact">Delete Contact</div>
        </div>
      </Drawer>
    </>
  );
}
export default UserInfo;
