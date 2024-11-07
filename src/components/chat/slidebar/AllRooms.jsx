import { Col, Button, Collapse } from "antd";

import { useContext } from "react";

import { Context } from "../../context/Context";
const { Panel } = Collapse;
function AllRooms() {
  const {
    rooms,
    selectedRoom,
    handleShowMess,
    handleShowRoomFriend,
    isShowRoomFriend,
    usersData,
    userState,
  } = useContext(Context);
  return (
    <>
      <Col span={24}>
        <div className="list_content">
          <Collapse defaultActiveKey={["1"]} className="list_content_col">
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
                        selectedRoom.id === room.id ? "#fff" : "transparent ",
                    }}
                    className="btn_roomName"
                    onClick={() => handleShowMess(room)}
                  >
                    <span onClick={handleShowRoomFriend}>{room.roomName}</span>
                  </Button>
                ))}
              </div>
            </Panel>
          </Collapse>
        </div>
      </Col>
      {isShowRoomFriend && (
        <Col className="list2" span={24} style={{ marginTop: "20px" }}>
          <Collapse defaultActiveKey={["1"]} className="list_content_col2">
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
    </>
  );
}
export default AllRooms;
