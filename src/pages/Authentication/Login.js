import PropTypes from "prop-types"
import React, { useState } from "react"

import { Row, Col, Container, Form, Input, FormFeedback, Label } from "reactstrap";
//redux
import { useSelector, useDispatch } from "react-redux"

import { Link } from "react-router-dom"
import withRouter from "../../components/Common/withRouter"

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// actions
import { loginUser, socialLogin } from "../../store/actions"

// import images
import logo from "../../assets/images/favicon.png"

//Import config
import CarouselPage from "./CarouselPage"
import { createSelector } from "reselect";

const Login = props => {

  const [passwordShow, setPasswordShow] = useState(false);

  const dispatch = useDispatch()

  const errorData = createSelector(

    (state) => state.Login,
    (state) => ({
      error: state.error,
    })
  );
  // Inside your component
  const { error } = useSelector(errorData);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "admin@themesbrand.com" || '',
      password: "123456" || '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      dispatch(loginUser(values, props.router.navigate));
    }
  });

  const signIn = type => {
    dispatch(socialLogin(type, props.router.navigate));
  };

  //for facebook and google authentication
  const socialResponse = type => {
    signIn(type);
  };

  document.title = "Login | RYD Admin";

  return (
    <React.Fragment>
      <div className="auth-page">
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col lg={4} md={5} className="col-xxl-3">
              <div className="auth-full-page-content d-flex p-sm-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-5 text-center">
                      <Link to="/dashboard" className="d-block auth-logo">
                        <img src={logo} alt="" height="28" /> <span className="logo-txt">RYD Admin</span>
                      </Link>
                    </div>

                    <div className="avatar-xl mx-auto">
                      <div className="avatar-title bg-light-subtle text-primary h1 rounded-circle">
                        <i className="bx bxs-user"></i>
                      </div>
                    </div>

                    <div className="auth-content my-auto">
                      <div className="text-center">
                        <h5 className="mb-0">Welcome Back !</h5>
                        <p className="text-muted mt-2">Sign in to continue to RYD Admin.</p>
                      </div>
                      <Form
                        className="custom-form mt-4 pt-2"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        {/* {error ? <Alert color="danger">{error}</Alert> : null} */}
                        <div className="mb-3">
                          <Label className="form-label">Email</Label>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email && validation.errors.email ? true : false
                            }
                          />
                          {validation.touched.email && validation.errors.email ? (
                            <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <div className="d-flex align-items-start">
                            <div className="flex-grow-1">
                              <Label className="form-label">Password</Label>
                            </div>
                            <div className="flex-shrink-0">
                              <div className="">
                                <Link to="/auth/forgot" className="text-muted">Forgot password?</Link>
                              </div>
                            </div>
                          </div>
                          <div className="input-group auth-pass-inputgroup">
                            <Input
                              name="password"
                              value={validation.values.password || ""}
                              type={passwordShow ? "text" : "password"}
                              placeholder="Enter Password"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.password && validation.errors.password ? true : false
                              }
                            />
                            <button onClick={() => setPasswordShow(!passwordShow)} className="btn btn-light shadow-none ms-0" type="button" id="password-addon"><i className="mdi mdi-eye-outline"></i></button>
                            {validation.touched.password && validation.errors.password ? (
                              <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                            ) : null}
                          </div>
                        </div>

                        <div className="row mb-4">
                          <div className="col">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="remember-check"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="remember-check"
                              >
                                Remember me
                              </label>
                            </div>

                            <div className="mt-3 d-grid">
                              <button
                                className="btn btn-primary btn-block"
                                type="submit"
                              >
                                Log In
                              </button>
                            </div>
                          </div>
                        </div>
                      </Form>

                      <div className="mt-5 text-center">
                        <p className="text-muted mb-0">Don't have an account ? | Talk with Devs </p>
                      </div>
                    </div>
                    <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">© {new Date().getFullYear()} RYD Admin. | SlantApp Group</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <CarouselPage />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(Login)

Login.propTypes = {
  history: PropTypes.object,
}
