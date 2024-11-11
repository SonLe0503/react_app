import { AppContext } from "@/context/AppContext";

import { Col, Button, Collapse } from "antd";

import { useContext, useState } from "react";
function AllRooms() {
  const {
    rooms,
    selectedRoom,
    handleShowMess,
    usersData,
    userState,
  } = useContext(AppContext);
  const [isShowRoomFriend, setIsShowRoomFriend] = useState(true);
  const handleShowRoomFriend = () => {
    setIsShowRoomFriend(true);
  };
  return (
    <>
      <Col span={24}>
        <div className="list_content">
          <Collapse
            defaultActiveKey={["1"]}
            className="list_content_col"
            items={[
              {
                key: "1",
                label: "All rooms",
                children: (
                  <div className="list_content_button">
                    {rooms.map((room) => (
                      <Button
                        key={room.id}
                        style={{
                          backgroundColor:
                            selectedRoom.id === room.id
                              ? "rgba(255, 255, 255, 1)"
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
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Col>
      {isShowRoomFriend && (
        <Col className="list2" span={24} style={{ marginTop: "20px" }}>
          <Collapse
            defaultActiveKey={["1"]}
            className="list_content_col2"
            items={[
              {
                key: "1",
                label: `Friend in room: ${selectedRoom.roomName}`,
                children: (
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
                ),
              },
            ]}
          />
        </Col>
      )}
    </>
  );
}
export default AllRooms;
