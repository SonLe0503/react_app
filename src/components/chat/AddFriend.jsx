/* eslint-disable react/prop-types */

import { DownOutlined, SearchOutlined } from "@ant-design/icons";

import { Button, Form, Modal, Input, Avatar } from "antd";

import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";

import { useEffect, useState } from "react";

import { db } from "../../firebase";
function AddFriend({ isModalFriend, setIsModalFriend, selectedRoom }) {
  const [searchIcon, setSearchIcon] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  function handlesearchIcon() {
    setSearchIcon(!searchIcon);
  }
  function handleForm(e) {
    if (!e.target.closest("input")) {
      setSearchIcon(false);
    }
  }
  const handleOk = async() => {
    if(selectedUser){
      const roomRef = doc(db, "rooms", selectedRoom );
      await updateDoc(roomRef, {
        members: [...selectedUser.members, selectedUser.id],
      })
      handleCancel();
    }
  };

  const handleCancel = () => {
    setIsModalFriend(false);
    setSelectedUser(null);
    form.resetFields();
    setSearchQuery("")
  };
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const result = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    });
    return () => result();
  }, []);
  const filteredUsers = users.filter((user) =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleSearchChange = (e) => {
    if (!selectedUser) {
      setSearchQuery(e.target.value);
    }
  };
  const handleChooseUser = (user) => {
    setSelectedUser(user);
    setSearchQuery("");
  };
  const [form] = Form.useForm();
  return (
    <div>
      <Modal
        title="Invite more members"
        open={isModalFriend}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          name="add_member"
          onClick={handleForm}
          form={form}
        >
          <Form.Item
            name="nameMembers"
          >
            <Input
              placeholder="Enter names of the members"
              suffix={searchIcon ? <SearchOutlined /> : <DownOutlined />}
              onClick={handlesearchIcon}
              value={searchQuery}
              onChange={handleSearchChange}
              addonBefore={
                selectedUser && (
                  <>
                    <Avatar
                      style={{ width: "25px, height:25px" }}
                      src={selectedUser.photoURL}
                    ></Avatar>
                    <span>{selectedUser.displayName}</span>
                  </>
                )
              }
            />
            {searchQuery && !selectedUser && (
            <ul>
              {filteredUsers.map((user) => (
                <div key={user.uid} onClick={() => handleChooseUser(user)}>
                  {user.photoURL && (
                    <Avatar
                      style={{
                        width: "25px",
                        height: "25px",
                        marginRight: "10px",
                      }}
                      src={user.photoURL}
                    ></Avatar>
                  )}
                  <span>{user.displayName}</span>
                </div>
              ))}
            </ul>
          )}
          </Form.Item>
          
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="default"
              onClick={handleCancel}
              style={{ marginRight: "10px" }}
            >
              Cancel
            </Button>
            <Button type="primary" onClick={handleOk}>
              OK
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
export default AddFriend;
