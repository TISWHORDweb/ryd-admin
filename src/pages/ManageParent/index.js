import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteModal from "../../components/Common/DeleteModal";
import * as Yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import withAuth from "../withAuth";
import CountrySelectInput from "../Custom/CountrySelect";
import StateSelectInput from "../Custom/StateSelect";
import TimezoneSelect from "../Custom/TimezoneSelect";
import { baseUrl } from "../../Network";
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
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [contact, setContact] = useState({});
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [country, setCountry] = useState({});
  const [state, setState] = useState({});
  const [timezone, setTimezone] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [modal]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/admin/parent/all`);
      setUsers(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      subject: "",
      message: "",
    },
    validationSchema: Yup.object({
      subject: Yup.string().required("Please enter the subject"),
      message: Yup.string().required("Please enter the message"),
    }),
  });

  const handleSendEmailAll = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${baseUrl}/admin/parent/send/all`, {
        body: validation.values.message,
        subject: validation.values.subject,
      });
      toast.success("Email sent to all parents successfully");
      toggle();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to send email to parents");
    }
  };

  const handleSendEmailSingle = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${baseUrl}/admin/parent/send/${selectedUserId}`, {
        body: validation.values.message,
        subject: validation.values.subject,
      });
      toast.success("Email sent to the parent successfully");
      toggle();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to send email to the parent");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSingleSendEmail = (userId) => {
    setSelectedUserId(userId);
    toggle();
  };


  const onClickDelete = (userData) => {
    setContact(userData);
    setDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`${baseUrl}/admin/parent/${contact.id}`);
      const updatedUsers = users.filter((user) => user.id !== contact.id);
      setUsers(updatedUsers);
      setDeleteModal(false);
      toast.success("Parent deleted successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete parent");
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
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => toggle()}
                        >
                          <i className="mdi mdi-email-variant"></i> Message All
                          Parents
                        </button>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xl="12">
                    {loading ? (
                        <div className="text-center mt-5">
                          <div
                              className="spinner-border text-primary"
                              role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                    ) : users.length === 0 ? (
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
                            <th>Email</th>
                            <th>Phone</th>
                            <th>State</th>
                            <th>Country</th>
                            <th>Timezone</th>
                            <th>No.Child</th>
                            <th>Action</th>
                          </tr>
                          </thead>
                          <tbody>
                          {Array.isArray(users) &&
                              users
                                  .filter((user) =>
                                      `${user.firstName} ${user.lastName}`
                                          .toLowerCase()
                                          .includes(searchQuery.toLowerCase())
                                  )
                                  .map((user, index) => (
                                      <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.state}</td>
                                        <td>{user.country}</td>
                                        <td>{user.timezone}</td>
                                        <td>{user?.children?.length}</td>
                                        <td>
                                          <div className="d-flex gap-3">
                                            <Link
                                                className="text-primary"
                                                to="#"
                                                onClick={() =>
                                                    handleSingleSendEmail(user.id)
                                                }
                                            >
                                              <i className="mdi mdi-email-variant font-size-18"></i>
                                            </Link>
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
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Compose Email</ModalHeader>
          <ModalBody>
            <Form onSubmit={validation.handleSubmit}>
              <Row>
                <Col xs={12}>
                  <div className="mb-3">
                    <Label className="form-label">Subject</Label>
                    <Input
                        name="subject"
                        type="text"
                        placeholder="Subject"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.subject}
                    />
                  </div>
                  <div className="mb-3">
                    <Label className="form-label">Message</Label>
                    <Input
                        name="message"
                        type="textarea"
                        placeholder="Message"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.message}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="text-end">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={toggle}
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        className="ms-2 btn btn-primary ml-2"
                        onClick={handleSendEmailSingle}
                    >
                      Send
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal>
        <ToastContainer />
      </React.Fragment>
  );
};
export default withAuth(ManageParent);
