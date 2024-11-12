import { db } from "@/config/firebase.js";
import { AppContext } from "@/context/AppContext";

import {  Col } from "antd";

import { collection, onSnapshot, query, where } from "firebase/firestore";

import { useContext, useEffect, useState } from "react";

function Friends() {
  const { infoUser, handleShowChatFriend } = useContext(AppContext);
  const [friendsData, setFriendsData] = useState([]);
  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("friends", "array-contains", infoUser.uid),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const friendsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFriendsData(friendsData);
    });
    return () => unsubscribe();
  }, [infoUser]);
  return (
    <>
      <Col span={24}>
        <div className="list_friends">
          <div className="friends_element">
            {friendsData.map((friend) => (
              <div key={friend.id}>
                <div
                  className="friends_btn"
                  onClick={() => handleShowChatFriend(friend)}
                >
                  <div className="info_friends">
                    <img style={{width:"40px", height:"40px", borderRadius:"50%"}} src={friend.photoURL}/>
                    <div style={{ marginLeft: "10px" }}>
                      {friend.displayName}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Col>
    </>
  );
}
export default Friends;
