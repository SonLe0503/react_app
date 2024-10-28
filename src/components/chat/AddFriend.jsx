/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { Modal, Avatar, Select } from "antd";

import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { useEffect, useState } from "react";

import { db } from "../../firebase";
function AddFriend({ isModalFriend, setIsModalFriend, selectedRoom }) {
  const handleCancel = () => {
    setIsModalFriend(!isModalFriend);
    setSearchQuery("");
    setSelectedUsers([]);
  };
  const handleOk = async () => {
    if (selectedUsers) {
      const docRef = doc(db, "rooms", selectedRoom.id);
      const roomRef = await updateDoc(docRef, {
        members: [...selectedRoom.members, ...selectedUsers],
      });
      console.log("Room updated successfully", roomRef);
    }
    handleCancel();
  };
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (selectedRoom) {
      const q = query(
        collection(db, "users"),
        where("uid", "not-in", selectedRoom.members)
      );
      const result = onSnapshot(q, async (snapshot) => {
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      });
      return () => result();
    }
  }, [selectedRoom]);
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = users.filter((user) =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [selectedUsers, setSelectedUsers] = useState([]);
  const handleSearch = (value) => {
    setSearchQuery(value);
  };
  return (
    <div>
      <Modal
        open={isModalFriend}
        onCancel={handleCancel}
        title="Inivite"
        onOk={handleOk}
      >
        <Select
          placeholder="Add Friends"
          style={{ width: "100%" }}
          showSearch
          mode="multiple"
          value={selectedUsers}
          onChange={setSelectedUsers}
          onSearch={handleSearch}
        >
          {filtered.map((user) => (
            <Select.Option key={user.id} value={user.uid}>
              <Avatar
                src={user.photoURL}
                style={{ width: "25px", height: "25px" }}
              ></Avatar>
              <span style={{ margin: "10px" }}>{user.displayName}</span>
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
}
export default AddFriend;
