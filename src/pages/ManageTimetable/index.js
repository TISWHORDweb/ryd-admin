import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteModal from "../../components/Common/DeleteModal";
import * as Yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios"; // Import Axios
import withAuth from '../withAuth';
import { DaysSelect, TimeSelect } from "../DaysOfWeekSelect";
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

const ManageTimetable = () => {
  document.title = "Manage Timetable | RYD Admin";

  const [users, setUsers] = useState([]);
  const [contact, setContact] = useState({});
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: contact.name || "",
      date: contact.date || "",
      startTime: contact.startTime || "",
      endTime: contact.endTime || "",
      // Add more fields as needed
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Name"),
      date: Yup.string().required("Please Enter Date"),
      startTime: Yup.string().required("Please Enter Start Time"),
      endTime: Yup.string().required("Please Enter End Time"),
      // Add more validation rules as needed
    }),

    onSubmit: async (values) => {
      try {
        const newTimetable = {
          name: values.name,
          date: values.date,
          startTime: values.startTime,
          endTime: values.endTime,
          // Add more fields as needed
        };

        // Determine the API endpoint based on whether it's an edit or a new creation
        let apiUrl;
        let response;
        if (isEdit) {
          apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
          response = await axios.put(`${apiUrl}/admin/timetable/edit/${contact.id}`, newTimetable);
          toast.success('Timetable updated successfully');
        } else {
          apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
          response = await axios.post(`${apiUrl}/admin/timetable/create`, newTimetable);
          toast.success('Timetable created successfully');
        }

        // Handle the response accordingly
        const responseData = response.data;

        if (isEdit) {
          // Update the timetable in the users state array
          const updatedTimetables = users.map((timetable) =>
            timetable.id === contact.id ? { ...timetable, ...responseData } : timetable
          );
          setUsers(updatedTimetables);
        } else {
          // Add the newly created timetable to the users state array
          setUsers([...users, responseData]);
        }

        toggle(); // Close the modal after submission
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  useEffect(() => {
    fetchTimetables();
    // setIsEdit();
  }, [modal]);

  const fetchTimetables = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const response = await axios.get(`${apiUrl}/admin/timetable/all`);
      setUsers(response.data.data);
      console.log(response.data.data)
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggle = () => {
    setModal(!modal);
  };

  const handleTimetableClick = (timetableData) => {
    setContact(timetableData);
    setIsEdit(true);
    toggle();
  };

  const onClickDelete = (timetableData) => {
    setContact(timetableData);
    setDeleteModal(true);
  };

  const shortenUrl = (url, maxLength) => {
    if (url.length <= maxLength) {
      return url;
    } else {
      return url.substring(0, maxLength) + "...";
    }
  };

  const handleDeleteTimetable = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000'; 
      await axios.delete(`${apiUrl}/admin/timetable/${contact.id}`);
      const updatedTimetables = users.filter((timetable) => timetable.id !== contact.id);
      setUsers(updatedTimetables);
      setDeleteModal(false);
      toast.success('Timetable deleted successfully');
    } catch (error) {
      console.error("Error:", error);
      toast.error('Failed to delete timetable');
    }
  };


  

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteTimetable}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboard" breadcrumbItem="Manage Timetable" />
          <Row>
            <Col lg="12">
              <Row className="align-items-center">
                <Col md={6}>
                  <div className="mb-3">
                    <h5 className="card-title">
                      Timetable List{" "}
                      <span className="text-muted fw-normal ms-2">
                      ({users.length})
                      </span>
                    </h5>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                 
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xl="12">
                <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>P.Name</th>
                        <th>C.Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>T.Name</th>
                        <th>Package Title</th>
                        <th>Ass. Rec</th>
                        <th>Status</th>
                        <th>Level</th>
                        <th>Time</th>
                        <th>Day</th>
                        <th>Offset</th>
                      </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(users) && users.map((timetable, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{timetable?.child?.firstName}</td>{" "}
                          {/* Access parent's first name from child object */}
                          <td>{`${timetable.child.lastName}`}</td>{" "}
                          {/* Concatenate child's first name and last name */}
                          <td>{timetable.child.age}</td>{" "}
                          {/* Display child's age */}
                          <td>{timetable.child.gender}</td>{" "}
                          {/* Display child's gender */}
                          <td>{timetable?.teacher?.firstName}</td>{" "}
                          {/* Display teacher's first name */}
                          <td>{timetable?.package?.title}</td>{" "}
                          {/* Access package title */}
                          <td>{shortenUrl(timetable.assessmentUrl, 20)}</td>{" "}
                          {/* Display assessment URL */}
                          <td>
                            {timetable?.package?.status ? "Active" : "Inactive"}
                          </td>{" "}
                          {/* Display package status */}
                          <td>{timetable.level}</td> {/* Display level */}
                          <td>{timetable.time}</td> {/* Display time */}
                          <td>{timetable.day}</td> {/* Display day */}
                          <td>{timetable.timeOffset}</td>{" "}
                          {/* Display time offset */}
                          <td>
                            <div className="d-flex gap-3">
                              <Link
                                className="text-success"
                                to="#"
                                onClick={() => handleTimetableClick(timetable)}
                              >
                                <i className="mdi mdi-user font-size-18"></i>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>
                      {isEdit ? "Edit Program" : "Add New Program"}
                    </ModalHeader>
                    <ModalBody>
                    <Form onSubmit={validation.handleSubmit}>
  <Row>
    <Col xs={12}>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <Input
              name="Level"
              type="select"
              placeholder="Level"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.Level || ""}
              invalid={
                validation.touched.Level &&
                validation.errors.Level
              }
            />
            <FormFeedback type="invalid">
              {validation.errors.Level}
            </FormFeedback>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <Input
              name="Package"
              type="select"
              placeholder="Package"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.Package || ""}
              invalid={
                validation.touched.Package &&
                validation.errors.Package
              }
            />
            <FormFeedback type="invalid">
              {validation.errors.Package}
            </FormFeedback>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <Input
          name="AssignedRecommendation"
          type="select"
          placeholder="Assigned Recommendation"
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={validation.values.AssignedRecommendation || ""}
          invalid={
            validation.touched.AssignedRecommendation &&
            validation.errors.AssignedRecommendation
          }
        />
        <FormFeedback type="invalid">
          {validation.errors.AssignedRecommendation}
        </FormFeedback>

      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <TimeSelect
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.Time || ""}
              invalid={
                validation.touched.Time &&
                validation.errors.Time
              }
            />
            <FormFeedback type="invalid">
              {validation.errors.Time}
            </FormFeedback>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <DaysSelect
              name="Day"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.Day || ""}
              invalid={
                validation.touched.Day &&
                validation.errors.Day
              }
            />
            <FormFeedback type="invalid">
              {validation.errors.Day}
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
      <ToastContainer />
    </React.Fragment>
  );
};

export default withAuth(ManageTimetable);
