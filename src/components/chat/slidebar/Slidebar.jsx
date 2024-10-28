/* eslint-disable react/prop-types */
import { PlusSquareOutlined } from "@ant-design/icons";

import { Col, Row, Button, Avatar, Collapse } from "antd";

import "./Slidebar.css";
const { Panel } = Collapse;

function Slidebar({
  infoUser,
  handleLogOut,
  rooms,
  selectedRoom,
  handleShowMess,
  handleShowRoomFriend,
  handleShowModal,
  isShowRoomFriend,
  usersData,
  userState,
}) {
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
                  }}
                >
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
              <Col span={24}>
                <div className="list_content">
                  <Collapse
                    defaultActiveKey={["1"]}
                    className="list_content_col"
                  >
                    <Panel
                      header="All rooms "
                      key={["1"]}
                      className="list_content_panel"
                    >
                      <div className="list_content_button">
                        {rooms.map((room) => (
                          <Button
                            key={room.id}
                            style={{
                              backgroundColor:
                                selectedRoom.id === room.id
                                  ? "#fff"
                                  : "transparent ",
                            }}
                            className="btn_roomName"
                            onClick={() => handleShowMess(room)}
                          >
                            <span onClick={handleShowRoomFriend}>
                              {room.roomName}
                            </span>
                          </Button>
                        ))}
                        <Button
                          icon={<PlusSquareOutlined />}
                          onClick={handleShowModal}
                          className="btn_addRoom"
                          style={{ background: "none", border: "none" }}
                        >
                          Add room
                        </Button>
                      </div>
                    </Panel>
                  </Collapse>
                </div>
              </Col>
              {isShowRoomFriend && (
                <Col className="list2" span={24} style={{ marginTop: "20px" }}>
                  <Collapse
                    defaultActiveKey={["1"]}
                    className="list_content_col2"
                  >
                    <Panel
                      header={`Friend in room: ${selectedRoom.roomName} `}
                      key={["1"]}
                      className="list_content_panel2"
                    >
                      <div className="list_content_panel2_element">
                        {usersData.map((user) => (
                          <div key={user.id} className="roomMembers">
                            <div
                              style={{
                                backgroundColor:
                                  userState[user.uid] &&
                                  userState[user.uid].state === "offline"
                                    ? "transparent"
                                    : "green",
                              }}
                              className="roomMembers_element"
                            ></div>
                            <span>
                              {user.displayName}{" "}
                              {userState[user.uid] &&
                                userState[user.uid].state === "offline" &&
                                userState[user.uid].offlineDuration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Panel>
                  </Collapse>
                </Col>
              )}
            </Row>
          </div>
        </div>
      </Col>
    </>
  );
}
export default Slidebar;
