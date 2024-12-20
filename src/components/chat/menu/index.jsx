/* eslint-disable react/prop-types */

import { AppContext } from "@/context/AppContext";

import {
  UserOutlined,
  AppstoreOutlined,
  BellOutlined,
  PlusSquareOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import { useContext } from "react";

import "./index.css";
function Menu({ setIsMenu }) {
  const { activeTab, setActiveTab, handleShowModal, handleShowContact } =
    useContext(AppContext);
  return (
    <>
      <div className="menu_container">
        <div
          className={`tab1 ${activeTab === "menu_friends" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("menu_friends");
            setIsMenu(false);
          }}
        >
          <UserOutlined />
          <span className="menu_text">Friend</span>
        </div>
        <div
          className={`tab1 ${activeTab === "menu_allrooms" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("menu_allrooms");
            setIsMenu(false);
          }}
        >
          <AppstoreOutlined />
          <span className="menu_text">All Rooms</span>
        </div>
        <div
          className={`tab1 ${
            activeTab === "menu_notifications" ? "active" : ""
          }`}
          onClick={() => {
            setActiveTab("menu_notifications");
            setIsMenu(false);
          }}
        >
          <BellOutlined />
          <span className="menu_text">Notifications</span>
        </div>
        <div
          className={`tab1 ${activeTab === "menu_addroom" ? "active" : ""}`}
          onClick={handleShowModal}
        >
          <PlusSquareOutlined />
          <span className="menu_text">Add Rooms</span>
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
