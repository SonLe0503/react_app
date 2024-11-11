import { db } from "@/firebase.js";
import { AppContext } from "@/context/AppContext";

import { Modal, Button, Form, Input } from "antd";

import {
  addDoc,
  arrayUnion,
  collection,
  updateDoc,
  doc,
} from "firebase/firestore";

import { useContext } from "react";
function AddRoom() {
  const { isModalVisible, setIsModalVisible, infoUser } =
    useContext(AppContext);
  const [form] = Form.useForm();
  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        handleOk(values);
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Failed:", info);
      });
  };
  const handleOk = async (values) => {
    const room = await addDoc(collection(db, "rooms"), {
      createdAt: new Date(),
      roomName: values.roomName,
      description: values.description,
      members: [infoUser.uid],
    });
    console.log("Document written with ID:", room.id);
    const roomId = room.id;
    await updateDoc(doc(db, "rooms", roomId), {
      members: arrayUnion(infoUser.uid),
    });
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };
  return (
    <div>
      <Modal
        open={isModalVisible}
        title="Create Room"
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          name="add_room"
          initialValues={{ remember: true }}
          form={form}
        >
          <Form.Item
            label="Room Name"
            name="roomName"
            rules={[{ required: true, message: "Please enter room name!" }]}
          >
            <Input placeholder="Enter room name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description!" }]}
          >
            <Input placeholder="Enter description" />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="default"
              onClick={handleCancel}
              style={{ marginRight: "10px" }}
            >
              Cancel
            </Button>
            <Button type="primary" onClick={onSubmit}>
              OK
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default AddRoom;
