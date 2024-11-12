import { provider, db } from "@/config/firebase.js";

import { GoogleOutlined, FacebookOutlined } from "@ant-design/icons";

import { Row, Col, Button } from "antd";

import styled from "styled-components";

import { getAuth, signInWithPopup, getAdditionalUserInfo } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

import { useHistory } from "react-router-dom/cjs/react-router-dom";
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  height: 100vh;
  background-image: url(/bgimage1.png);
  .login-container {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 20px;
    border-radius: 10px;
    text-align: center;
  }
`;
function Login() {
  const history = useHistory();
  const auth = getAuth();
  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const detail = getAdditionalUserInfo(result);
        if (detail.isNewUser) {
          const user = await addDoc(collection(db, "users"), {
            displayName: result.user.displayName,
            createdAt: new Date(),
            email: result.user.email,
            photoURL: result.user.photoURL,
            uid: result.user.uid,
            providerId: detail.providerId,
          });
          console.log("Document written with ID: ", user.id);
        }
        history.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <Container>
        <div className="login-container">
          <Row gutter={[16, 16]}>
            <Col style={{ marginLeft: "50px", marginRight: "50px" }}>
              <img src="logo.png" alt="App Logo" style={{ width: 100 }} />
            </Col>
            <Col>
              <Row
                gutter={[16, 16]}
                style={{ height: "100%", alignItems: "flex-start" }}
              >
                <Col span={24}>
                  <Button
                    type="primary"
                    icon={<GoogleOutlined />}
                    style={{ width: "100%" }}
                    onClick={handleLogin}
                  >
                    <span>Login with Google</span>
                  </Button>
                </Col>
                <Col span={24}>
                  <Button
                    type="primary"
                    icon={<FacebookOutlined />}
                    style={{ width: "100%" }}
                  >
                    <span>Login with Facebook</span>
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
}
export default Login;
