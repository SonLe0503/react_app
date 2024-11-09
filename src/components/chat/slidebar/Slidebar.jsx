import { Col, Row, Button, Avatar } from "antd";

import { useContext, useState, useRef, useEffect } from "react";

import { AppContext } from "@/context/AppContext";
import Menu from "@/components/chat/menu/Menu";
import AllRooms from "@/components/chat/slidebar/AllRooms";
import Friends from "@/components/chat/slidebar/Friends";
import Notification from "@/components/chat/slidebar/Notification";
import "@/components/chat/slidebar/Slidebar.css";

function Slidebar() {
  const { infoUser, activeTab, handleLogOut } = useContext(AppContext);
  const [isMenu, setIsMenu] = useState(false);
  const handleMenu = () => {
    setIsMenu((prev) => !prev);
  };
  const showRef = useRef(null);
  const buttonRef = useRef(null);
  const handleClickOutside = (event) => {
    if (showRef.current && buttonRef.current && !showRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
      setIsMenu(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <Col className="slidebar" span={6}>
        <div className="slidebar_rooms">
          <div className="slidebar_content">
            <Row className="slidebar_content_element">
              <Col className="slidebar_content_element_header" span={24}>
                <div
                  className="header-content"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "15.5px",
                    alignItems: "center",
                  }}
                >
                  <div className="slidebar_content_menu" style={{ position: "relative" }}>
                    <img className="img_menu" src="image_menu.png" alt="Menu" onClick={handleMenu} ref={buttonRef} />
                    {isMenu && (
                      <div ref={showRef}>
                        <Menu />
                      </div>
                    )}
                  </div>
                  <div className="content_user">
                    <Avatar src={infoUser.photoURL}></Avatar>
                    <span className="content_userName">{infoUser.displayName}</span>
                  </div>
                  <Button className="btn_Logout">
                    <span onClick={handleLogOut}>Logout</span>
                  </Button>
                </div>
              </Col>
              {activeTab === "menu_allrooms" && <AllRooms />}
              {activeTab === "menu_notifications" && <Notification />}
              {activeTab === "menu_friends" && <Friends />}
            </Row>
          </div>
        </div>
      </Col>
    </>
  );
}
export default Slidebar;
