import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteModal from "../../components/Common/DeleteModal";
import * as Yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import CustomTimezoneSelect from "../CustomTimezoneSelect";
import withAuth from '../withAuth';
import axios from "axios";
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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageChild = () => {
  document.title = "Manage Child | RYD Admin";

  const [users, setUsers] = useState([]);
  const [contact, setContact] = useState({});
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [parentOptions, setParentOptions] = useState([]);

  useEffect(() => {
    fetchParents();
    fetchChildren(); // Fetch children initially
  }, []); // Fetch parents once on component mount

  const fetchParents = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const response = await axios.get(`${apiUrl}/admin/parent/all`);
      setParentOptions(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: contact.firstName || "",
      lastName: contact.lastName || "",
      age: contact.age || "",
      gender: contact.gender || "",
      parentId: contact.parentId || "", // New field for parent ID
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter Child's First Name"),
      lastName: Yup.string().required("Please Enter Child's Last Name"),
      age: Yup.string().required("Please Enter Child's Age"),
      gender: Yup.string().required("Please Enter Child's Gender"),
      parentId: Yup.string().required("Please Select a Parent"), // Validation for parent ID
    }),

    onSubmit: async (values) => {
      try {
        const newChild = {
          firstName: values.firstName,
          lastName: values.lastName,
          age: values.age,
          gender: values.gender,
          parentId: values.parentId, // Include parent ID in the new child object
        };

        let apiUrl;
        let response;
        if (isEdit) {
          apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
          response = await axios.put(`${apiUrl}/admin/child/edit/${contact.id}`, newChild);
          toast.success('Child updated successfully');
        } else {
          apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
          response = await axios.post(`${apiUrl}/admin/child/create`, newChild);
          toast.success('Child created successfully');
        }

        const responseData = response.data;

        if (isEdit) {
          const updatedUsers = users.map((user) =>
            user.id === contact.id ? { ...user, ...responseData } : user
          );
          setUsers(updatedUsers);
        } else {
          setUsers([...users, responseData]);
        }

        toggle();
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  const fetchChildren = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://api-pro.rydlearning.com';
      const response = await axios.get(`${apiUrl}/admin/child/all`);
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
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000'; 
      await axios.delete(`${apiUrl}/admin/child/${contact.id}`);
      const updatedUsers = users.filter((user) => user.id !== contact.id);
      setUsers(updatedUsers);
      setDeleteModal(false);
      toast.success('Child deleted successfully');
    } catch (error) {
      console.error("Error:", error);
      toast.error('Failed to delete child');
    }
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
          <Breadcrumbs title="Dashboard" breadcrumbItem="Manage Child" />
          <Row>
            <Col lg="12">
              <Row className="align-items-center">
                <Col md={6}>
                  <div className="mb-3">
                    <h5 className="card-title">
                      Child List{" "}
                      <span className="text-muted fw-normal ms-2">
                        ({users.length})
                      </span>
                    </h5>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xl="12">
                  {users.length === 0 ? (
                    <div className="text-center mt-5">
                    <h3>No data available</h3>
                  </div>
                  ) : (
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Age</th>
                          <th>Gender</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.age}</td>
                            <td>{user.gender}</td>
                            <td>
                              <div className="d-flex gap-3">
                                <Link
                                  className="text-success"
                                  to="#"
                                  onClick={() => {
                                    handleUserClick(user)
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
                  )}
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>
                      {isEdit ? "Edit Child" : "Add New Child"}
                    </ModalHeader>
                    <ModalBody>
                      <Form onSubmit={validation.handleSubmit}>
                        <Row>
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label className="form-label">First Name</Label>
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
                            <div className="mb-3">
                              <Label className="form-label">Last Name</Label>
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
                            <div className="mb-3">
                              <Label className="form-label">Age</Label>
                              <Input
                                name="age"
                                type="text"
                                placeholder="Age"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.age || ""}
                                invalid={
                                  validation.touched.age &&
                                  validation.errors.age
                                }
                              />
                              <FormFeedback type="invalid">
                                {validation.errors.age}
                              </FormFeedback>
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Gender</Label>
                              <Input
                                type="select"
                                name="gender"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.gender || ""}
                                invalid={
                                  validation.touched.gender &&
                                  validation.errors.gender
                                }
                              >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="other">Other</option>
                              </Input>
                              <FormFeedback type="invalid">
                                {validation.errors.gender}
                              </FormFeedback>
                            </div>
                        {/*    <div className="mb-3">
                              <Label className="form-label">Parent</Label>
                              <Input
                                type="select"
                                name="parentId"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.parentId || ""}
                                invalid={
                                  validation.touched.parentId &&
                                  validation.errors.parentId
                                }
                              >
                                <option value="">Select Parent</option>
                                {parentOptions.map(parent => (
                                  <option key={parent.id} value={parent.id}>
                                    {parent.firstName} {parent.lastName}
                                  </option>
                                ))}
                              </Input>
                              <FormFeedback type="invalid">
                                {validation.errors.parentId}
                              </FormFeedback>
                            </div>
                                */}
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
                                  Create Child
                                </button>
                              ) : (
                                <button
                                  type="submit"
                                  className="btn btn-primary save-user"
                                >
                                  Update Child
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

export default withAuth(ManageChild);
