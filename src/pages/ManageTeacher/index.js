import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteModal from "../../components/Common/DeleteModal";
import * as Yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
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
import { DaysSelect, TimeSelect } from "../DaysOfWeekSelect";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import CustomTimezoneSelect from "../CustomTimezoneSelect"

const ManageTeacher = () => {
  document.title = "Manage Teacher | RYD Admin";

  const [teachers, setTeachers] = useState([]);
  const [teacherData, setTeacherData] = useState({});
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: teacherData.firstName || "",
      lastName: teacherData.lastName || "",
      email: teacherData.email || "",
      password: teacherData.password || "",
      gender: teacherData.gender || "",
      phone: teacherData.phone || "",
      country: teacherData.country || "",
      timezone: teacherData.timezone || "",
      timeOffset: teacherData.timeOffset || "",
      qualification: teacherData.qualification || "",
      docUrl: teacherData.docUrl || "",
      experience: teacherData.experience || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please enter first name"),
      lastName: Yup.string().required("Please enter last name"),
      email: Yup.string().required("Please enter email"),
      password: Yup.string().required("Please enter password"),
      gender: Yup.string().required("Please enter gender"),
      phone: Yup.string().required("Please enter phone number"),
      country: Yup.string().required("Please enter country"),
      timezone: Yup.string().required("Please enter time zone"),
      timeOffset: Yup.number().required("Please enter time offset"),
      qualification: Yup.string().required("Please enter qualification"),
      docUrl: Yup.string().required("Please enter document URL"),
      experience: Yup.string().required("Please enter work experience"),
    }),
    onSubmit: async (values) => {
      try {
        const newTeacher = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          gender: values.gender,
          phone: values.phone,
          country: values.country,
          timezone: values.timezone,
          timeOffset: values.timeOffset,
          qualification: values.qualification,
          docUrl: values.docUrl,
          experience: values.experience,
        };

        let apiUrl;
        let response;
        if (isEdit) {
          apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
          response = await axios.put(
            `${apiUrl}/admin/teacher/edit/${teacherData.id}`,
            newTeacher
          );
          toast.success("Teacher updated successfully");
        } else {
          apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
          response = await axios.post(
            `${apiUrl}/admin/teacher/create`,
            newTeacher
          );
          toast.success("Teacher created successfully");
        }

        const responseData = response.data;

        if (isEdit) {
          const updatedTeachers = teachers.map((teacher) =>
            teacher.id === teacherData.id
              ? { ...teacher, ...responseData }
              : teacher
          );
          setTeachers(updatedTeachers);
        } else {
          setTeachers([...teachers, responseData]);
        }

        toggle();
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  useEffect(() => {
    fetchTeachers();
  }, [modal]);

  const fetchTeachers = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
      const response = await axios.get(`${apiUrl}/admin/teacher/all`);
      setTeachers(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggle = () => {
    setModal(!modal);
  };

  const handleTeacherClick = (teacher) => {
    setTeacherData(teacher);
    setIsEdit(true);
    toggle();
  };

  const onClickDelete = (teacher) => {
    setTeacherData(teacher);
    setDeleteModal(true);
  };

  const shortenUrl = (url, maxLength) => {
    if (url.length <= maxLength) {
      return url;
    } else {
      return url.substring(0, maxLength) + "...";
    }
  };

  const handleDeleteTeacher = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
      await axios.delete(`${apiUrl}/admin/teacher/${teacherData.id}`);
      const updatedTeachers = teachers.filter(
        (teacher) => teacher.id !== teacherData.id
      );
      setTeachers(updatedTeachers);
      setDeleteModal(false);
      toast.success("Teacher deleted successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete teacher");
    }
  };

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteTeacher}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboard" breadcrumbItem="Manage Teacher" />
          <Row>
            <Col lg="12">
              <Row className="align-items-center">
                <Col md={6}>
                  <div className="mb-3">
                    <h5 className="card-title">
                      Teacher List{" "}
                      <span className="text-muted fw-normal ms-2">
                        ({teachers.length})
                      </span>
                    </h5>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                    <div>
                      <Link
                        to="#"
                        className="btn btn-light"
                        onClick={() => {
                          setTeacherData({});
                          setIsEdit(false);
                          toggle();
                        }}
                      >
                        <i className="bx bx-plus me-1"></i> Add New Teacher
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
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Phone</th>
                        <th>Country</th>
                        <th>Timezone</th>
                        <th>Offset</th>
                        <th>Qualification</th>
                        <th>DocumentURL</th>
                        <th>Experience</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(teachers) &&
                        teachers.map((teacher, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{teacher.firstName}</td>
                            <td>{teacher.lastName}</td>
                            <td>{teacher.email}</td>
                            <td>{teacher.gender}</td>
                            <td>{teacher.phone}</td>
                            <td>{teacher.country}</td>
                            <td>{teacher.timezone}</td>
                            <td>{teacher.timeOffset}</td>
                            <td>{teacher.qualification}</td>
                           <td>{teacher.docUrl && shortenUrl(teacher.docUrl, 10)}</td>
                            <td>{teacher.experience}</td>
                            <td>
                              <div className="d-flex gap-3">
                                <Link
                                  className="text-success"
                                  to="#"
                                  onClick={() => handleTeacherClick(teacher)}
                                >
                                  <i className="mdi mdi-pencil font-size-18"></i>
                                </Link>
                                <Link
                                  className="text-danger"
                                  to="#"
                                  onClick={() => onClickDelete(teacher)}
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
                      {isEdit ? "Edit Teacher" : "Add New Teacher"}
                    </ModalHeader>
                    <ModalBody>
                      <Form onSubmit={validation.handleSubmit}>
                        <Row>
                          <Col xs={12}>
                            <Row>
                              <Col xs={12} md={6}>
                                <div className="mb-3">
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
                              </Col>
                              <Col xs={12} md={6}>
                                <div className="mb-3">
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
                              </Col>
                            </Row>
                            <div className="mb-3">
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
                            {!isEdit && (
                              <div className="mb-3">
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
                            <Row>
                              <Col xs={12} md={6}>
                                <div className="mb-3">
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
            </Input>
                                  <FormFeedback type="invalid">
                                    {validation.errors.gender}
                                  </FormFeedback>
                                </div>
                              </Col>
                              <Col xs={12} md={6}>
  <div className="mb-3">
    <Input
      name="phone" 
      type="text"
      placeholder="Phone Number"
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
</Col>


                            </Row>
                            <div className="row">
  <div className="col-md-6 mb-3">
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
  <div className="col-md-6 mb-3">
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
      error={validation.touched.timezone && validation.errors.timezone}
    />
  </div>
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

                            <div className="mb-3">
                             
                              <Input
                                name="qualification"
                                type="text"
                                placeholder="Qualification"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.qualification || ""}
                                invalid={
                                  validation.touched.qualification &&
                                  validation.errors.qualification
                                }
                              />
                              <FormFeedback type="invalid">
                                {validation.errors.qualification}
                              </FormFeedback>
                            </div>

                            <div className="mb-3">
                             
                              <Input
                                name="docUrl"
                                type="text"
                                placeholder="Document URL"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.docUrl || ""}
                                invalid={
                                  validation.touched.docUrl &&
                                  validation.errors.docUrl
                                }
                              />
                              <FormFeedback type="invalid">
                                {validation.errors.docUrl}
                              </FormFeedback>
                            </div>

                            <div className="mb-3">
                             
                             <Input
                               name="experience"
                               type="text"
                               placeholder="Work Experience"
                               onChange={validation.handleChange}
                               onBlur={validation.handleBlur}
                               value={validation.values.experience || ""}
                               invalid={
                                 validation.touched.experience &&
                                 validation.errors.experience
                               }
                             />
                             <FormFeedback type="invalid">
                               {validation.errors.experience}
                             </FormFeedback>
                           </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <div className="text-end">
                              {!isEdit ? (
                                <button
                                  type="submit"
                                  className="btn btn-primary save-teacher"
                                >
                                  Create Teacher
                                </button>
                              ) : (
                                <button
                                  type="submit"
                                  className="btn btn-primary save-teacher"
                                >
                                  Update Teacher
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

export default withAuth(ManageTeacher);
