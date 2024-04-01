



import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteModal from "../../components/Common/DeleteModal";
import * as Yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import {
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  FormFeedback,
  Button,
} from "reactstrap";
import withAuth from "../withAuth";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast

import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const ManageProgram = () => {
  document.title = "Manage Program | RYD Admin";

  const [programs, setPrograms] = useState([]);
  const [contact, setContact] = useState({});
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, [modal]);

  const fetchPrograms = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
      const response = await axios.get(`${apiUrl}/admin/program/all`);
      setPrograms(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggle = (programData) => {
    if (programData) {
      // If programData is provided, set it to contact for editing
      setContact(programData);
      setIsEdit(true);
    } else {
      // If programData is not provided, reset contact for adding new program
      setContact({
        Level: "",
        Time: "",
      });
      setIsEdit(false);
    }
    setModal(!modal);
  };

  // Function to display success notification
  const showSuccessNotification = (message) => {
    toast.success(message);
  };

  // Function to display error notification
  const showErrorNotification = (message) => {
    toast.error(message);
  };

  const handleProgramClick = (programData) => {
    toggle(programData); // Pass program data to toggle for editing
  };

  const onClickDelete = (programData) => {
    setContact(programData);
    setDeleteModal(true);
  };

  const handleDeleteProgram = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
      await axios.delete(`${apiUrl}/admin/program/${contact.id}`);
      const updatedPrograms = programs.filter(
        (program) => program.id !== contact.id
      );
      setPrograms(updatedPrograms);
      setDeleteModal(false);
      showSuccessNotification("Program deleted successfully."); // Notify user about successful deletion
    } catch (error) {
      console.error("Error:", error);
      showErrorNotification("Failed to delete program."); // Notify user about deletion failure
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      level: contact.level || "",
      time: contact.time || "",
    },
    validationSchema: Yup.object({
      level: Yup.string().required("Please Enter Level"),
      time: Yup.string().required("Please Enter Time"),
    }),
    onSubmit: async (values) => {
      try {
        const newProgram = {
          level: values.level,
          time: values.time,
          isPaid: values.isPaid
        };

        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

        let response;
        if (isEdit) {
          response = await axios.put(
            `${apiUrl}/admin/program/edit/${contact.id}`,
            newProgram
          );
          const responseData = response.data;

          const updatedPrograms = programs.map((program) =>
            program.id === contact.id ? { ...program, ...responseData } : program
          );
          setPrograms(updatedPrograms);
          showSuccessNotification("Program updated successfully."); // Notify user about successful update
        } else {
          // Handle adding new program here if needed
        }

        toggle();
      } catch (error) {
        console.error("Error:", error);
        showErrorNotification("Failed to update program."); // Notify user about update failure
      }
    },
  });
  const handleToggleIsPaid = async (programData) => {
    try {
      // Ensure that programData has the necessary properties
      if (!programData || !programData.id) {
        console.error("Invalid program data.");
        return;
      }
  
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
      const updatedProgram = { ...programData, isPaid: true }; // Spread programData to avoid overwriting it
      await axios.put(
        `${apiUrl}/admin/program/edit/${programData.id}`,
        updatedProgram
      );
      // Assuming you want to update the UI with the updated program data
      const updatedPrograms = programs.map((program) =>
        program.id === programData.id ? updatedProgram : program
      );
      setPrograms(updatedPrograms);
      showSuccessNotification("Program marked as paid.");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  


  // Your existing functions

  return (
    <React.Fragment>
      <ToastContainer /> {/* ToastContainer to render notifications */}
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProgram}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboard" breadcrumbItem="Manage Program" />
          <Row>
            <Col lg="12">
              <Row className="align-items-center">
                <Col md={6}>
                  <div className="mb-3">
                    <h5 className="card-title">
                      Manage Program{" "}
                      <span className="text-muted fw-normal ms-2">
                        ({programs.length})
                      </span>
                    </h5>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3"></div>
                </Col>
              </Row>
              <Row>
                <Col xl="12">
                  {programs.length === 0 ? (
                    <div className="text-center mt-5">
                      <h3>No programs available</h3>
                    </div>
                  ) : (
                   

<table className="table align-middle">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>P.Name</th>
                        <th>C.Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>T.Name</th>
                        <th>P.Title</th>
                        <th>Ass. Rec</th>
                        <th>Status</th>
                        <th>Level</th>
                        <th>Time</th>
                        <th>Day</th>
                        <th>Offset</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    {programs.map((program, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{program?.child?.firstName}</td>{" "}
                          {/* Access parent's first name from child object */}
                          <td>{`${program.child.lastName}`}</td>{" "}
                          {/* Concatenate child's first name and last name */}
                          <td>{program.child.age}</td>{" "}
                          {/* Display child's age */}
                          <td>{program.child.gender}</td>{" "}
                          {/* Display child's gender */}
                          <td>{program?.teacher?.firstName}</td>{" "}
                          {/* Display teacher's first name */}
                          <td>{program?.package?.title}</td>{" "}
                          {/* Access package title */}
                          <td>{program.assessmentUrl}</td>{" "}
                          {/* Display assessment URL */}
                          <td>
                            {program?.package?.status ? "Active" : "Inactive"}
                          </td>{" "}
                          {/* Display package status */}
                          <td>{program.level}</td> {/* Display level */}
                          <td>{program.time}</td> {/* Display time */}
                          <td>{program.day}</td> {/* Display day */}
                          <td>{program.timeOffset}</td>{" "}
                          {/* Display time offset */}
                          <td>
                          <div className="d-flex gap-3">
                                <span>
                                  {program.isPaid ? "Paid" : "Unpaid"}
                                  {!program.isPaid && (
                                    <Button
                                      color="primary"
                                      size="sm"
                                      onClick={() =>
                                        handleToggleIsPaid(program)
                                      }
                                    >
                                      Mark as Paid
                                    </Button>
                                  )}
                                </span>
                                <span>
                                  <Link
                                    className="text-success"
                                    to="#"
                                    onClick={() => handleProgramClick(program)}
                                  >
                                    <i className="mdi mdi-pencil font-size-18"></i>
                                  </Link>
                                </span>
                                <span>
                                  <Link
                                    className="text-danger"
                                    to="#"
                                    onClick={() => onClickDelete(program)}
                                  >
                                    <i className="mdi mdi-delete font-size-18"></i>
                                  </Link>
                                </span>
                              </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  )}
                    <Modal isOpen={modal} toggle={() => toggle()}>
                    <ModalHeader toggle={() => toggle()}>
                      {isEdit ? "Edit Program" : "Add New Program"}
                    </ModalHeader>
                    <ModalBody>
                      <Form onSubmit={validation.handleSubmit}>
                        {/* Form inputs */}
                        <Row>
                          <Col xs={12}>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <Input
                                    type="select"
                                    name="level"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.level || ""}
                                    invalid={
                                      validation.touched.level &&
                                      validation.errors.level
                                    }
                                  >
                                    <option value="">Select Level</option>
                                    <option value="4">4</option>
                                    <option value="3">3</option>
                                    <option value="2">2</option>
                                    <option value="1">1</option>
                                  </Input>
                                  <FormFeedback type="invalid">
                                    {validation.errors.level}
                                  </FormFeedback>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <Input
                                    type="text"
                                    name="time"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.time || ""}
                                    invalid={
                                      validation.touched.time &&
                                      validation.errors.time
                                    }
                                  />
                                  <FormFeedback type="invalid">
                                    {validation.errors.time}
                                  </FormFeedback>
                                </div>
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
                                  Create Program
                                </button>
                              ) : (
                                <button
                                  type="submit"
                                  className="btn btn-primary save-user"
                                >
                                  Update Program
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
    </React.Fragment>
  );
};

export default withAuth(ManageProgram);
