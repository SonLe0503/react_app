/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  UserOutlined,
  AppstoreOutlined,
  BellOutlined,
  PlusSquareOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import { useContext, } from "react";

import Contact from "../Contact";
import { Context } from "../../context/Context";

import "./Menu.css";
function Menu() {
  const {activeTab, setActiveTab, handleShowModal, handleShowContact} = useContext(Context);
  return (
    <>
      <div className="menu_container">
        <div
          className={`tab1 ${activeTab === "menu_friends" ? "active" : ""}`}
          onClick={() => setActiveTab("menu_friends")}
        >
          <UserOutlined />
          <span className="menu_text">Friend</span>
        </div>
        <div
          className={`tab1 ${activeTab === "menu_allrooms" ? "active" : ""}`}
          onClick={() => setActiveTab("menu_allrooms")}
        >
          <AppstoreOutlined />
          <span className="menu_text">All Rooms</span>
        </div>
        <div
          className={`tab1 ${
            activeTab === "menu_notifications" ? "active" : ""
          }`}
          onClick={() => setActiveTab("menu_notifications")}
        >
          <BellOutlined />
          <span className="menu_text">Notifications</span>
        </div>
        <div
          className={`tab1 ${activeTab === "menu_addroom" ? "active" : ""}`}
          onClick={handleShowModal}
        >
          <PlusSquareOutlined />
          <span className="menu_text">All Rooms</span>
        </div>
        <div
          className={`tab1 ${activeTab === "menu_addFriend" ? "active" : ""}`}
          onClick={handleShowContact}
        >
          <UserAddOutlined />
          <span className="menu_text">Add Friend</span>
        </div>
      </div>
    </>
  );
}
export default Menu;
