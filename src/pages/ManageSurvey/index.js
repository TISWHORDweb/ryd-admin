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

const ManageSurvey = () => {
  document.title = "Manage Survey | RYD Admin";

  const [surveys, setSurveys] = useState([]);
  const [survey, setSurvey] = useState({});
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: survey.title || "",
      body: survey.description || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Survey Title"),
      body: Yup.string().required("Please Enter Survey Description"),
    }),

    onSubmit: async (values) => {
      try {
        const newSurvey = {
          title: values.title,
          body: values.body,
        };

        let apiUrl;
        let response;
        if (isEdit) {
          apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
          response = await axios.put(
            `${apiUrl}/admin/survey/edit/${survey.id}`,
            newSurvey
          );
          toast.success("Survey updated successfully");
        } else {
          apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
          response = await axios.post(`${apiUrl}/admin/survey/create`, newSurvey);
          toast.success("Survey created successfully");
        }

        const responseData = response.data;

        if (isEdit) {
          const updatedSurveys = surveys.map((s) =>
            s.id === survey.id ? { ...s, ...responseData } : s
          );
          setSurveys(updatedSurveys);
        } else {
          setSurveys([...surveys, responseData]);
        }

        toggle();
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  useEffect(() => {
    fetchSurveys();
  }, [modal]);

  const fetchSurveys = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
      const response = await axios.get(`${apiUrl}/admin/survey/all`);
      setSurveys(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggle = () => {
    setModal(!modal);
  };

  const handleSurveyClick = (surveyData) => {
    setSurvey(surveyData);
    setIsEdit(true);
    toggle();
  };

  const onClickDelete = (surveyData) => {
    setSurvey(surveyData);
    setDeleteModal(true);
  };

  const handleDeleteSurvey = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
      await axios.delete(`${apiUrl}/admin/survey/${survey.id}`);
      const updatedSurveys = surveys.filter((s) => s.id !== survey.id);
      setSurveys(updatedSurveys);
      setDeleteModal(false);
      toast.success("Survey deleted successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete survey");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteSurvey}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboard" breadcrumbItem="Manage Survey" />
          <Row>
            <Col lg="12">
              <Row className="align-items-center">
                <Col md={6}>
                  <div className="mb-3">
                    <h5 className="card-title">
                      Survey List{" "}
                      <span className="text-muted fw-normal ms-2">
                        ({surveys.length})
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
                          setSurvey({});
                          setIsEdit(false);
                          toggle();
                        }}
                      >
                        <i className="bx bx-plus me-1"></i> Add New Survey
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
                        <th>Title</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(surveys) && surveys.length > 0 ? (
                        surveys.map((s, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{s.title}</td>
                            <td>{s.body}</td>
                            <td>
                              <div className="d-flex gap-3">
                                <Link
                                  className="text-success"
                                  to="#"
                                  onClick={() => {
                                    handleSurveyClick(s);
                                    setIsEdit(true);
                                  }}
                                >
                                  <i className="mdi mdi-pencil font-size-18"></i>
                                </Link>
                                <Link
                                  className="text-danger"
                                  to="#"
                                  onClick={() => onClickDelete(s)}
                                >
                                  <i className="mdi mdi-delete font-size-18"></i>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">No surveys yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>
                      {isEdit ? "Edit Survey" : "Add New Survey"}
                    </ModalHeader>
                    <ModalBody>
                      <Form onSubmit={validation.handleSubmit}>
                        <Row>
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label className="form-label">Title</Label>
                              <Input
                                name="title"
                                type="text"
                                placeholder="Title"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.title || ""}
                                invalid={
                                  validation.touched.title &&
                                  validation.errors.title
                                }
                              />
                              <FormFeedback type="invalid">
                                {validation.errors.title}
                              </FormFeedback>
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Description</Label>
                              <Input
                                name="body"
                                type="textarea"
                                placeholder="Description"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.body || ""}
                                invalid={
                                  validation.touched.body &&
                                  validation.errors.body
                                }
                              />
                              <FormFeedback type="invalid">
                                {validation.errors.body}
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
                                  className="btn btn-primary save-user"
                                >
                                  Create Survey
                                </button>
                              ) : (
                                <button
                                  type="submit"
                                  className="btn btn-primary save-user"
                                >
                                  Update Survey
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

export default withAuth(ManageSurvey);
