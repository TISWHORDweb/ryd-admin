import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteModal from "../../components/Common/DeleteModal";
import * as Yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios"; // Import Axios

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
  Button, // Import Button component
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageSwap = () => {
  document.title = "Manage Swap | RYD Admin";

  const [swaps, setSwaps] = useState([]);
  const [swap, setSwap] = useState({});
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: swap.title || "",
      description: swap.description || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Swap Title"),
      description: Yup.string().required("Please Enter Swap Description"),
    }),

    onSubmit: async (values) => {
      try {
        let apiUrl;
        let response;
        if (isEdit) {
          apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
          response = await axios.put(
            `${apiUrl}/admin/swap/edit/${swap.id}`,
            values
          );
          toast.success("Swap updated successfully");
        } else {
          apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
          response = await axios.post(`${apiUrl}/admin/swap/create`, values);
          toast.success("Swap created successfully");
        }

        const responseData = response.data;

        setSwaps([...swaps, responseData]);

        toggle();
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  useEffect(() => {
    fetchSwaps();
  }, [modal]);

  const fetchSwaps = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
      const response = await axios.get(`${apiUrl}/admin/swap/all`);
      setSwaps(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggle = () => {
    setModal(!modal);
  };

  const handleSwapClick = (swapData) => {
    setSwap(swapData);
    setIsEdit(true);
    toggle();
  };

  const onClickDelete = (swapData) => {
    setSwap(swapData);
    setDeleteModal(true);
  };

  const handleDeleteSwap = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
      await axios.delete(`${apiUrl}/admin/swap/${swap.id}`);
      const updatedSwaps = swaps.filter((s) => s.id !== swap.id);
      setSwaps(updatedSwaps);
      setDeleteModal(false);
      toast.success("Swap deleted successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete swap");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const acceptSwap = async (id) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
      await axios.put(`${apiUrl}/admin/swap/accept/${id}`);
      const updatedSwaps = swaps.map((s) =>
        s.id === id ? { ...s, status: true } : s
      );
      setSwaps(updatedSwaps);
      toast.success("Swap accepted successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to accept swap");
    }
  };

  const rejectSwap = async (id) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
      await axios.put(`${apiUrl}/admin/swap/reject/${id}`);
      const updatedSwaps = swaps.map((s) =>
        s.id === id ? { ...s, status: false } : s
      );
      setSwaps(updatedSwaps);
      toast.success("Swap rejected successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to reject swap");
    }
  };

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteSwap}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboard" breadcrumbItem="Manage Swap" />
          <Row>
            <Col lg="12">
              <Row className="align-items-center">
                <Col md={6}>
                  <div className="mb-3">
                    <h5 className="card-title">
                      Swap List{" "}
                      <span className="text-muted fw-normal ms-2">
                        ({swaps.length})
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
                      {Array.isArray(swaps) && swaps.length > 0 ? (
                        swaps.map((swap, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{swap.title}</td>
                            <td>{swap.description}</td>
                            <td>
                              <div className="d-flex gap-3">
                                <Link
                                  className="text-success"
                                  to="#"
                                  onClick={() => {
                                    handleSwapClick(swap);
                                    setIsEdit(true);
                                  }}
                                >
                                  <i className="mdi mdi-pencil font-size-18"></i>
                                </Link>
                                <Link
                                  className="text-danger"
                                  to="#"
                                  onClick={() => onClickDelete(swap)}
                                >
                                  <i className="mdi mdi-delete font-size-18"></i>
                                </Link>
                                {!swap.status && (
                                  <>
                                    <Button
                                      color="success"
                                      onClick={() => acceptSwap(swap.id)}
                                    >
                                      Accept
                                    </Button>
                                    <Button
                                      color="danger"
                                      onClick={() => rejectSwap(swap.id)}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No swap requests yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>
                      {isEdit ? "Edit Swap" : "Add New Swap"}
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
                                name="description"
                                type="textarea"
                                placeholder="Description"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.description || ""}
                                invalid={
                                  validation.touched.description &&
                                  validation.errors.description
                                }
                              />
                              <FormFeedback type="invalid">
                                {validation.errors.description}
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
                                  Create Swap
                                </button>
                              ) : (
                                <button
                                  type="submit"
                                  className="btn btn-primary save-user"
                                >
                                  Update Swap
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

export default withAuth(ManageSwap);