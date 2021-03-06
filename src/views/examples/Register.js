/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Spinner
} from "reactstrap";

import { getAuth, createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import firebase from "../../firebase";
import { useHistory } from "react-router";
import { useState, useEffect } from "react";
import AuthNavbar from "components/Navbars/AuthNavbar";
import axios from 'axios'
import 'rsuite/dist/styles/rsuite.min.css';

import { Alert } from 'rsuite';



const Register = () => {
  const auth = getAuth();
  const history = useHistory();

  const [FormData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    PrivacyPolicy: false,
  });

  const [Disabled, setDisabled] = useState(true);
  const [isprocess,setisprocess] = useState(false);

  useEffect(() => {
    if (
      FormData.name === "" ||
      FormData.email === "" ||
      FormData.password === "" ||
      FormData.PrivacyPolicy === false
    )
      setDisabled(true);
    else {
      setDisabled(false);
    }
  }, [FormData]);

  function makeAPI(config,bodyParams) {
    axios
    .post(
      "https://glassball-auth.herokuapp.com/customer/login",
      bodyParams,
      config
    )
    .then(function (response) {
      console.log(response);

      const {data} = response;
      if(data.status === 0)
      {
          alert("Login Failed")
          history.push("/auth/register");
      }else{
        history.push("/")
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const onSubmit = () => {
    createUserWithEmailAndPassword(auth, FormData.email, FormData.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        updateProfile(user,{
            displayName: FormData.name,
          })
          .then(() => {
            // Update successful.
            user.getIdToken().then(function (idToken) {
              const config = {
                headers: {
                  Authorization: `Bearer ${idToken}`,
                },
              };
    
              const bodyParams = {
                uid: user.uid,
                firstName: user.displayName,
                email: user.email,
              };

              console.log(bodyParams);
              console.log(config);

              makeAPI(config,bodyParams);
            });
            setisprocess(false)
          })
          .catch((error) => {
            // An error happened.
            console.log(error);
            Alert.error("Register Failed");

            setisprocess(false)
          });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        console.log("Alerting");
        Alert.error("Register Failed");
        setisprocess(false)

        // ..
      });
  };

  useEffect(() => {
    console.log(isprocess);
  },[isprocess]);

  return (
    <>
      <AuthNavbar />

      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          {/* <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-4">
              <small>Sign up with</small>
            </div>
            <div className="text-center">
              <Button
                className="btn-neutral btn-icon mr-4"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require("../../assets/img/icons/common/github.svg")
                        .default
                    }
                  />
                </span>
                <span className="btn-inner--text">Github</span>
              </Button>
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require("../../assets/img/icons/common/google.svg")
                        .default
                    }
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardHeader> */}
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Enter your name, email and password to get started</small>
            </div>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Name"
                    type="text"
                    name={FormData.name}
                    onChange={(e) => {
                      setFormData({ ...FormData, name: e.target.value });
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    name={FormData.email}
                    onChange={(e) => {
                      setFormData({
                        ...FormData,
                        email: e.target.value,
                      });
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    value={FormData.password}
                    onChange={(e) => {
                      setFormData({
                        ...FormData,
                        password: e.target.value,
                      });
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <Row className="my-4">
                <Col xs="12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                      onClick={() => {
                        setFormData({
                          ...FormData,
                          PrivacyPolicy: !FormData.PrivacyPolicy,
                        });
                      }}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckRegister"
                    >
                      <span className="text-muted">
                        I agree with the{" "}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                </Col>
              </Row>
              <div className="text-center">
                <Button
                  className="mt-4 w-50"
                  color="primary"
                  type="button"
                  onClick={() => {
                    console.log("Falseprocess");
                    setisprocess(true)
                    // Alert.success("Registering");
                    if (!Disabled) {
                      onSubmit();
                    }else{
                      setisprocess(false)
                    }

                  }}
                  disabled={Disabled}
                  style={{
                    opacity: Disabled ? "0.5" : "1",
                  }}
                >

                  {!isprocess ? 
                  <span className="py-4">Create account</span>: null}

                  {isprocess ?  <Spinner className="" size="sm">Loading</Spinner>: null}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
