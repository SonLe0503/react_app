import { AppContext } from "@/context/AppContext";
import { db } from "@/config/firebase.js";

import {
  UserAddOutlined,
  UserDeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import { Avatar, Modal, Input, Button } from "antd";

import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

import { useContext, useEffect, useState } from "react";
function Contact() {
  const { isModalContact, setIsModalContact, infoUser } = useContext(AppContext);
  const [addFriends, setAddFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [users, setUsers] = useState([]);
  const handleCancel = () => {
    setIsModalContact(false);
    setSearchQuery("");
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    const exactMatch = users.filter(
      (user) => user.email && user.email.toLowerCase() === value.toLowerCase()
    );
    setFiltered(exactMatch);
  };
  const handleAddFriend = async (userUid) => {
    const friend = await addDoc(collection(db, "friend_requests"), {
      createAt: new Date(),
      from: infoUser.uid,
      to: userUid,
      status: "pending",
    });
    console.log("Friend request sent", friend.id);
  };
  const handleUnFriend = async (userUid) => {
    const q = query(
      collection(db, "friend_requests"),
      where("from", "==", infoUser.uid),
      where("to", "==", userUid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, "friend_requests", docSnapshot.id));
      console.log("Friends request deleted", docSnapshot.id);
    });
  };
  useEffect(() => {
    const q = query(
      collection(db, "friend_requests"),
      where("from", "==", infoUser.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const friendsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAddFriends(friendsData);
    });
    return () => unsubscribe();
  }, [infoUser]);
  useEffect(() => {
    const q = query(collection(db, "users"), where("uid", "!=", infoUser.uid));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    });
    return () => unsubscribe();
  }, []);
  return (
    <>
      <Modal
        open={isModalContact}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
        title="Contacts"
      >
        <Input
          placeholder="Contacts"
          style={{ width: "100%" }}
          value={searchQuery}
          onChange={handleSearch}
        />
        {searchQuery && filtered.length > 0
          ? filtered.map((user) => {
              const friendRequests = addFriends?.find(
                (friend) =>
                  friend.to === user.uid && friend.status === "pending"
              );
              return (
                <div key={user.uid}>
                  <div
                    style={{ color: "rgba(0, 0, 0, 0.7)", marginTop: "15px" }}
                  >
                    You may be familiar with
                  </div>
                  <div
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      padding: "10px",
                      borderRadius: "10px",
                      marginTop: "5px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar src={user.photoURL}></Avatar>
                      <div style={{ marginLeft: "10px" }}>
                        <div>{user.displayName}</div>
                        <div style={{ color: "rgba(0, 0, 0, 0.5)" }}>
                          Friends suggestions
                        </div>
                      </div>
                    </div>
                    {user.friends && user.friends.includes(infoUser.uid) ? (
                      <div
                        style={{
                          background: "#3366FF",
                          color: "#fff",
                          borderRadius: "10px",
                          padding: "10px",
                          display: "flex",
                        }}
                      >
                        <div style={{ marginRight: "5px" }}>
                          {<CheckCircleOutlined />}
                        </div>
                        <div style={{ marginLeft: "5px" }}>Bạn bè</div>
                      </div>
                    ) : friendRequests ? (
                      <Button
                        icon={<UserDeleteOutlined />}
                        type="default"
                        onClick={() => handleUnFriend(user.uid)}
                      >
                        Huỷ kết bạn
                      </Button>
                    ) : (
                      <Button
                        icon={<UserAddOutlined />}
                        type="primary"
                        onClick={() => handleAddFriend(user.uid)}
                      >
                        Thêm bạn bè
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          : null}
      </Modal>
    </>
  );
}
export default Contact;
