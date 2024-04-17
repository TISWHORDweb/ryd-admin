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
import { baseUrl } from '../../Network';
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
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [contact, setContact] = useState({});
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const  [ country, setCountry ] = useState({});
  const  [ state, setState ] = useState({});
  const  [ timezone, setTimezone ] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
          state: state.name,
          country: country.name,
          timezone: timezone.zoneName,
          timeOffset: values.timeOffset,
        };

   
        let response;
        if (isEdit) {
         
          response = await axios.put(
            `${baseUrl}/admin/parent/edit/${contact.id}`,
            newUser
          );
          toast.success("Parent updated successfully");
        } else {
         
          response = await axios.post(`${baseUrl}/admin/parent/create`, newUser);
          toast.success("Parent created successfully");
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

  const handleCountryChange = (data) => {
    setCountry(data)
  }

  const handleStateChange = (data) => {
    setState(data)
  }

  const handleTimezoneChange = (data) => {
    setTimezone(data)
  }

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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSendEmail = async (event) => {
    event.preventDefault();
    try {
     
      await axios.post(`${baseUrl}/admin/parent/send/all`, {
        body: "Your email body",
        subject: "Your email subject",
      });
      toast.success("Email sent to all parents successfully");
      toggle();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to send email to parents");
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
                      <Link
                        to="#"
                        className="btn btn-light"
                        onClick={() => {
                          setIsEdit(false);
                          toggle();
                        }}
                      >
                        <i className="mdi mdi-email-variant"></i> Message All
                        Parents
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xl="12">
                  {loading ? ( 
                     <div className="text-center mt-5">
                     <div className="spinner-border text-primary" role="status">
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
                                    <Link className="text-primary" to="#">
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

                 
<Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>
                      {isEdit ? "Edit Parent" : "Message All Parents"}
                    </ModalHeader>
                    <ModalBody>
                      {isEdit ? (
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
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <Label className="form-label">
                                      Country
                                    </Label>
                                    <CountrySelectInput
                                     handleCountryChange={handleCountryChange}
                                     value={country}
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
                                    <Label className="form-label">
                                      State
                                    </Label>
                                    <StateSelectInput
                                      country={country}
                                      handleStateChange={handleStateChange}
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

                                <TimezoneSelect
                                  country={country}
                                  handleTimezoneChange={handleTimezoneChange}
                                  className="form-control"
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
                                <button
                                  type="submit"
                                  className="btn btn-primary save-user"
                                >
                                  Update Parent
                                </button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      ) : (
                        <Form onSubmit={handleSendEmail}>
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
                                  value={validation.values.subject || ""}
                                  invalid={
                                    validation.touched.subject &&
                                    validation.errors.subject
                                  }
                                />
                                <FormFeedback type="invalid">
                                  {validation.errors.subject}
                                </FormFeedback>
                              </div>
                              <div className="mb-3">
                                <Label className="form-label">Message</Label>
                                <Input
                                  name="message"
                                  type="textarea"
                                  placeholder="Message"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.message || ""}
                                  invalid={
                                    validation.touched.message &&
                                    validation.errors.message
                                  }
                                />
                                <FormFeedback type="invalid">
                                  {validation.errors.message}
                                </FormFeedback>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <div className="text-end">
                                <button
                                  type="submit"
                                  className="btn btn-primary save-user"
                                >
                                  Send Message
                                </button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      )}
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
