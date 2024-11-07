import { Avatar, Button, Col } from "antd";

import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { useContext, useEffect, useState } from "react";

import { db } from "../../../firebase";
import { Context } from "../../context/Context";

function Notification() {
  const { infoUser, usersData } = useContext(Context);
  const [friends, setFriends] = useState([]);
  useEffect(() => {
    const q = query(
      collection(db, "friend_requests"),
      where("to", "==", infoUser.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const friendsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFriends(friendsData);
    });
    return () => unsubscribe();
  }, [infoUser]);
  const handleAccept = async (friendRequestId, fromUserId) => {
    const user1Query = query(collection(db, "users"), where("uid", "==", fromUserId));
    const user1Snapshot = await getDocs(user1Query);
    const user1Doc = user1Snapshot.docs[0];
    
    const user2Query = query(collection(db,"users"),where("uid", "==", infoUser.uid));
    const user2Snapshot = await getDocs(user2Query);
    const user2Doc = user2Snapshot.docs[0];
    
    if(user1Doc){
      await updateDoc(user1Doc.ref,{
        friends: arrayUnion(infoUser.uid)
      });
    }
    if(user2Doc){
      await updateDoc(user2Doc.ref, {
        friends: arrayUnion(fromUserId)
      });
    }
    const friendRequestRef = doc(db, "friend_requests", friendRequestId);
    await deleteDoc(friendRequestRef);
    setFriends((prevFriends) =>
      prevFriends.filter((friend) => friend.id !== friendRequestId)
    );
  };
  const handleReject = async (friendRequestId) => {
    const friendRequestRef = doc(db, "friend_requests", friendRequestId);
    await deleteDoc(friendRequestRef);
    setFriends((prevFriends) =>
      prevFriends.filter((friend) => friend.id !== friendRequestId)
    );
  };
  return (
    <>
      <Col span={24}>
        <div className="list_notifications">
          <div className="notifications_element">
            {usersData.map((user) => {
              const friendRequests = friends?.find(
                (friend) =>
                  friend.from === user.uid && friend.status === "pending"
              );
              return (
                <div key={user.uid}>
                  {friendRequests && (
                    <div className="infoUser_notification">
                      <div className="infoUser_details">
                        <Avatar src={user.photoURL}></Avatar>
                        <div style={{ marginLeft: "10px" }}>
                          {user.displayName}
                        </div>
                      </div>
                      <div className="btn_notifications">
                        <Button
                          style={{ margin: "5px" }}
                          type="primary"
                          onClick={() =>
                            handleAccept(friendRequests.id, user.uid)
                          }
                        >
                          Xác nhận
                        </Button>
                        <Button
                          style={{ margin: "5px" }}
                          type="default"
                          onClick={() => handleReject(friendRequests.id)}
                        >
                          Từ chối
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Col>
    </>
  );
}
export default Notification;
