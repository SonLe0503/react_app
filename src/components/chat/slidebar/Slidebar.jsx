import { Col, Row, Button, Avatar } from "antd";

import { useContext, useState, useRef, useEffect} from "react";

import Menu from "../menu/Menu.jsx";
import { Context } from "../../context/Context.jsx";

import AllRooms from "./AllRooms.jsx";
import Friends from "./Friends.jsx";
import Notification from "./Notification.jsx";
import "./Slidebar.css";

function Slidebar() {
  const { infoUser, activeTab, handleLogOut, } =
    useContext(Context);
  const [isMenu, setIsMenu] = useState(false);
  const handleMenu = () => {
    setIsMenu((prev) => !prev);
  };
  const showRef = useRef(null);
  const buttonRef = useRef(null);
   const handleClickOutside = (event) => {
    if (
      showRef.current &&
      buttonRef.current &&
      !showRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target)
    ) {
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
                  <div
                    className="slidebar_content_menu"
                    style={{ position: "relative" }}
                  >
                    <img
                      className="img_menu"
                      src="image_menu.png"
                      alt="Menu"
                      onClick={handleMenu}
                      ref={buttonRef}
                    />
                    {isMenu && (
                      <div ref={showRef}>
                        <Menu />
                      </div>
                    )}
                  </div>
                  <div className="content_user">
                    <Avatar src={infoUser.photoURL}></Avatar>
                    <span className="content_userName">
                      {infoUser.displayName}
                    </span>
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
