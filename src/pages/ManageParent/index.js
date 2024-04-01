import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteModal from "../../components/Common/DeleteModal";
import * as Yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios"; // Import Axios
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import CustomTimezoneSelect from "../CustomTimezoneSelect";
import moment from "moment-timezone";
import withAuth from "../withAuth";
import {
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageParent = () => {
  document.title = "Manage Parent | RYD Admin";

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // State to hold filtered users
  const [contact, setContact] = useState({});
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State to hold search query

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: contact.firstName || "",
      lastName: contact.lastName || "",
      email: contact.email || "",
      phone: contact.phone || "",
      password: contact.password || "",
      country: contact.country || "",
      state: contact.state || "",
      timezone: contact.timezone || "",
      timeOffset: contact.timeOffset || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter Your First Name"),
      lastName: Yup.string().required("Please Enter Your Last Name"),
      state: Yup.string().required("Please Enter State"),
      email: Yup.string().required("Please Enter Your Email"),
      phone: Yup.string().required("Please Enter Your Phone Number"),
      password: Yup.string().required("Please Enter Your Email"),
      country: Yup.string().required("Please Enter Your Country"),
      timezone: Yup.string().required("Please Enter Time zone"),
      timeOffset: Yup.number().required("Please Enter Time Offset"),
    }),

    onSubmit: async (values) => {
      try {
        const newUser = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          password: values.password,
          state: values.state,
          country: values.country,
          timezone: values.timezone,
          timeOffset: values.timeOffset,
        };

        // Determine the API endpoint based on whether it's an edit or a new creation
        let apiUrl;
        let response;
        if (isEdit) {
          apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
          response = await axios.put(
            `${apiUrl}/admin/parent/edit/${contact.id}`,
            newUser
          );
          toast.success("Parent updated successfully");
        } else {
          apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
          response = await axios.post(`${apiUrl}/admin/parent/create`, newUser);
          toast.success("Parent created successfully");
        }

        // Handle the response accordingly
        const responseData = response.data;

        if (isEdit) {
          // Update the user in the users state array
          const updatedUsers = users.map((user) =>
            user.id === contact.id ? { ...user, ...responseData } : user
          );
          setUsers(updatedUsers);
        } else {
          // Add the newly created user to the users state array
          setUsers([...users, responseData]);
        }

        toggle(); // Close the modal after submission
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  useEffect(() => {
    fetchUsers();
    // setIsEdit();
  }, [modal]);

  const fetchUsers = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
      const response = await axios.get(`${apiUrl}/admin/parent/all`);
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggle = () => {
    setModal(!modal);
  };

  const handleUserClick = (userData) => {
    setContact(userData);
    setIsEdit(true);
    toggle();
  };

  const onClickDelete = (userData) => {
    setContact(userData);
    setDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
      await axios.delete(`${apiUrl}/admin/parent/${contact.id}`);
      const updatedUsers = users.filter((user) => user.id !== contact.id);
      setUsers(updatedUsers);
      setDeleteModal(false);
      toast.success("Parent deleted successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete parent");
    }
  };

  const handleSearch = (e) => {
    // Update search query state
    setSearchQuery(e.target.value);
  };

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteUser}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboard" breadcrumbItem="Manage Parent" />
          <Row>
            <Col lg="12">
              <Row className="align-items-center">
                <Col md={6}>
                  <div className="mb-3">
                    <h5 className="card-title">
                      Parent List{" "}
                      <span className="text-muted fw-normal ms-2">
                        ({users.length})
                      </span>
                    </h5>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                    <div>
                      <Input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                    </div>
                    <div>
                      <Link
                        to="#"
                        className="btn btn-light"
                        onClick={() => {
                          setContact({});
                          setIsEdit(false);
                          toggle();
                        }}
                      >
                        <i className="bx bx-plus me-1"></i> Add New Parent
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xl="12">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>State</th>
                        <th>Country</th>
                        <th>Timezone</th>
                        <th>Offset</th>
                        <th>No.Child</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(users) &&
                        users.map((user, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.state}</td>
                            <td>{user.country}</td>
                            <td>{user.timezone}</td>
                            <td>{user.timeOffset}</td>
                            <td>{user?.children?.length}</td>
                            <td>
                              <div className="d-flex gap-3">
                                <Link
                                  className="text-success"
                                  to="#"
                                  onClick={() => {
                                    handleUserClick(user);
                                    setIsEdit(true);
                                  }}
                                >
                                  <i className="mdi mdi-pencil font-size-18"></i>
                                </Link>
                                <Link
                                  className="text-danger"
                                  to="#"
                                  onClick={() => onClickDelete(user)}
                                >
                                  <i className="mdi mdi-delete font-size-18"></i>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>
                      {isEdit ? "Edit Parent" : "Add New Parent"}
                    </ModalHeader>
                    <ModalBody>
                      <Form onSubmit={validation.handleSubmit}>
                        <Row>
                          <Col xs={12}>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <Label className="form-label">
                                    First Name
                                  </Label>
                                  <Input
                                    name="firstName"
                                    type="text"
                                    placeholder="First Name"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.firstName || ""}
                                    invalid={
                                      validation.touched.firstName &&
                                      validation.errors.firstName
                                    }
                                  />
                                  <FormFeedback type="invalid">
                                    {validation.errors.firstName}
                                  </FormFeedback>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <Label className="form-label">
                                    Last Name
                                  </Label>
                                  <Input
                                    name="lastName"
                                    type="text"
                                    placeholder="Last Name"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.lastName || ""}
                                    invalid={
                                      validation.touched.lastName &&
                                      validation.errors.lastName
                                    }
                                  />
                                  <FormFeedback type="invalid">
                                    {validation.errors.lastName}
                                  </FormFeedback>
                                </div>
                              </div>
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Email</Label>
                              <Input
                                name="email"
                                type="email"
                                placeholder="Email"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.email || ""}
                                invalid={
                                  validation.touched.email &&
                                  validation.errors.email
                                }
                              />
                              <FormFeedback type="invalid">
                                {validation.errors.email}
                              </FormFeedback>
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Phone</Label>
                              <Input
                                name="phone"
                                type="text"
                                placeholder="Phone"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.phone || ""}
                                invalid={
                                  validation.touched.phone &&
                                  validation.errors.phone
                                }
                              />
                              <FormFeedback type="invalid">
                                {validation.errors.phone}
                              </FormFeedback>
                            </div>
                            {!isEdit && (
                              <div className="mb-3">
                                <Label className="form-label">Password</Label>
                                <Input
                                  name="password"
                                  type="password"
                                  placeholder="Password"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.password || ""}
                                  invalid={
                                    validation.touched.password &&
                                    validation.errors.password
                                  }
                                />
                                <FormFeedback type="invalid">
                                  {validation.errors.password}
                                </FormFeedback>
                              </div>
                            )}

                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <Label className="form-label">Country</Label>
                                  <CountryDropdown
                                    name="country"
                                    value={validation.values.country}
                                    onChange={(val) =>
                                      validation.setFieldValue("country", val)
                                    }
                                    onBlur={validation.handleBlur}
                                    className="form-control"
                                  />
                                  {validation.touched.country &&
                                    validation.errors.country && (
                                      <FormFeedback type="invalid">
                                        {validation.errors.country}
                                      </FormFeedback>
                                    )}
                                </div>
                              </div>

                              <div className="col-md-6">
                                <div className="mb-3">
                                  <Label className="form-label">State</Label>
                                  <RegionDropdown
                                    country={validation.values.country}
                                    name="state"
                                    value={validation.values.state}
                                    onChange={(val) =>
                                      validation.setFieldValue("state", val)
                                    }
                                    onBlur={validation.handleBlur}
                                    className="form-control"
                                  />
                                  {validation.touched.state &&
                                    validation.errors.state && (
                                      <FormFeedback type="invalid">
                                        {validation.errors.state}
                                      </FormFeedback>
                                    )}
                                </div>
                              </div>
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Timezone</Label>

                              <CustomTimezoneSelect
                                value={validation.values.timezone}
                                onChange={(timezone) => {
                                  const offsetPattern = /GMT([+-]\d{1,2}):/;
                                  const match = timezone.match(offsetPattern);
                                  let offset = 0;
                                  if (match && match.length > 1) {
                                    offset = parseInt(match[1]); // Extract numerical offset
                                  }
                                  validation.setValues({
                                    ...validation.values,
                                    timezone,
                                    timeOffset: offset,
                                  });
                                }}
                                onBlur={validation.handleBlur}
                                error={
                                  validation.touched.timezone &&
                                  validation.errors.timezone
                                }
                              />

                              {validation.touched.timezone &&
                                validation.errors.timezone && (
                                  <FormFeedback type="invalid">
                                    {validation.errors.timezone}
                                  </FormFeedback>
                                )}
                            </div>

                            <div className="col-md-6">
                              <div className="mb-3">
                                <Input
                                  name="timeOffset"
                                  type="hidden"
                                  placeholder="Time OFFSET"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.timeOffset || ""}
                                  invalid={
                                    validation.touched.timeOffset &&
                                    validation.errors.timeOffset
                                  }
                                />
                                <FormFeedback type="invalid">
                                  {validation.errors.timeOffset}
                                </FormFeedback>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <div className="text-end">
                              {!isEdit ? (
                                <button
                                  type="submit"
                                  className="btn btn-primary save-user"
                                >
                                  Create Parent
                                </button>
                              ) : (
                                <button
                                  type="submit"
                                  className="btn btn-primary save-user"
                                >
                                  Update Parent
                                </button>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </ModalBody>
                  </Modal>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default withAuth(ManageParent);
