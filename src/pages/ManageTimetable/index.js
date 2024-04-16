import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteModal from "../../components/Common/DeleteModal";
import * as Yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../components/Common/Breadcrumb";
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


// Define arrays for days and times
export const Days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
export const Times = [
  "00:00AM", "1:00AM", "2:00AM", "3:00AM", "4:00AM", "5:00AM", "6:00AM", "7:00AM",
  "8:00AM", "9:00AM", "10:00AM", "11:00AM", "12:00PM", "13:00PM", "14:00PM", "15:00PM",
  "16:00PM", "17:00PM", "18:00PM", "19:00PM", "20:00PM", "21:00PM", "22:00PM", "23:00PM"
];


const ManageTimeTable = () => {
  document.title = "Manage Time Table | RYD Admin";

  const [timetables, setTimetables] = useState([]);
  const [timetable, setTimetable] = useState({});
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    fetchTimetables();
  }, []); // Fetch timetables once on component mount

  const fetchTimetables = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const response = await axios.get(`${apiUrl}/admin/timetable/all`);
      setTimetables(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      dayOfWeek: timetable.dayOfWeek || "",
      startTime: timetable.startTime || "",
      endTime: timetable.endTime || "",
      timezone: timetable.timezone || "",
      country: timetable.country || "",
      region: timetable.region || "",
    },
    validationSchema: Yup.object({
      dayOfWeek: Yup.string().required("Please select Day of Week"),
      startTime: Yup.string().required("Please select Start Time"),
      endTime: Yup.string().required("Please select End Time"),
      timezone: Yup.string().required("Please select Timezone"),
      country: Yup.string().required("Please select Country"),
      region: Yup.string().required("Please select Region"),
    }),

    onSubmit: async (values) => {
      try {
        const newTimetable = {
          dayOfWeek: values.dayOfWeek,
          startTime: values.startTime,
          endTime: values.endTime,
          timezone: values.timezone,
          country: values.country,
          region: values.region,
        };

        let apiUrl;
        let response;
        if (isEdit) {
          apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
          response = await axios.put(`${apiUrl}/admin/timetable/edit/${timetable.id}`, newTimetable);
          toast.success('Timetable updated successfully');
        } else {
          apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
          response = await axios.post(`${apiUrl}/admin/timetable/create`, newTimetable);
          toast.success('Timetable created successfully');
        }

        fetchTimetables(); // Fetch timetables again to update the list

        toggle();
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  const toggle = () => {
    setModal(!modal);
  };

  const handleTimetableClick = (data) => {
    setTimetable(data);
    setIsEdit(true);
    toggle();
  };

  const onClickDelete = (data) => {
    setTimetable(data);
    setDeleteModal(true);
  };

  const handleDeleteTimetable = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000'; 
      await axios.delete(`${apiUrl}/admin/timetable/${timetable.id}`);
      fetchTimetables(); // Fetch timetables again to update the list
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
                        ({timetables.length})
                      </span>
                    </h5>
                  </div>
                </Col>
               {/* <Col md={6}>
                  <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                    <div>
                      <Link
                        to="#"
                        className="btn btn-light"
                        onClick={() => {
                          setTimetable({});
                          setIsEdit(false);
                          toggle();
                        }}
                      >
                        <i className="bx bx-plus me-1"></i> Add New Time Table
                      </Link>
                    </div>
                  </div>
                </Col>
                      */}
              </Row>
              <Row>
                <Col xl="12">
                  {timetables.length === 0 ? (
                    <p className="text-center">No timetable yet</p>
                  ) : (
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Day of Week</th>
                          <th>Start Time</th>
                          <th>Timezone</th>
                          <th>Country</th>
                          <th>Region</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timetables.map((data, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data.dayOfWeek}</td>
                            <td>{data.startTime}</td>
                            <td>{data.endTime}</td>
                            <td>{data.timezone}</td>
                            <td>{data.country}</td>
                            <td>{data.region}</td>
                            <td>
                              <div className="d-flex gap-3">
                                <Link
                                  className="text-success"
                                  to="#"
                                  onClick={() => {
                                    handleTimetableClick(data)
                                    setIsEdit(true);
                                  }}
                                >
                                  <i className="mdi mdi-pencil font-size-18"></i>
                                </Link>
                                <Link
                                  className="text-danger"
                                  to="#"
                                  onClick={() => onClickDelete(data)}
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
                      {isEdit ? "Edit Time Table" : "Add New Time Table"}
                    </ModalHeader>
                    <ModalBody>
                      <Form onSubmit={validation.handleSubmit}>
                        <Row>
                          <Col xs={12}>
                          <div className="mb-3">
  <Label className="form-label">Day of Week</Label>
  <Input
    type="select"
    name="dayOfWeek"
    onChange={validation.handleChange}
    onBlur={validation.handleBlur}
    value={validation.values.dayOfWeek || ""}
    invalid={
      validation.touched.dayOfWeek &&
      validation.errors.dayOfWeek
    }
  >
    <option value="">Select Day of Week</option>
    {Days.map((day, index) => (
      <option key={index} value={day}>{day}</option>
    ))}
  </Input>
  <FormFeedback type="invalid">
    {validation.errors.dayOfWeek}
  </FormFeedback>
</div>
<div className="mb-3">
  <Label className="form-label">Start Time</Label>
  <Input
    type="select"
    name="startTime"
    onChange={validation.handleChange}
    onBlur={validation.handleBlur}
    value={validation.values.startTime || ""}
    invalid={
      validation.touched.startTime &&
      validation.errors.startTime
    }
  >
    <option value="">Select Start Time</option>
    {Times.map((time, index) => (
      <option key={index} value={time}>{time}</option>
    ))}
  </Input>
  <FormFeedback type="invalid">
    {validation.errors.startTime}
  </FormFeedback>
</div>
                            {/* Add more form fields here */}
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
                                  Create Time Table
                                </button>
                              ) : (
                                <button
                                  type="submit"
                                  className="btn btn-primary save-user"
                                >
                                  Update Time Table
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

export default withAuth(ManageTimeTable);
