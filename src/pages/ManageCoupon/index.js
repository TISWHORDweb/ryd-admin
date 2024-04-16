// Import necessary modules/components
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteModal from "../../components/Common/DeleteModal";
import * as Yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import withAuth from "../withAuth";
import CountrySelect from "../CountrySelect";

import {
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Tooltip,
  Form,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Your ManageCoupon component
const ManageCoupon = () => {
  // State variables
  const [coupons, setCoupons] = useState([]);
  const [coupon, setCoupon] = useState({});
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editTooltipOpen, setEditTooltipOpen] = useState(false);
  const [deleteTooltipOpen, setDeleteTooltipOpen] = useState(false);
  const [statusTooltipOpen, setStatusTooltipOpen] = useState(false);

  // Form validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      code: coupon.code || "",
      discount: coupon.value || "",
      isPercentage: coupon.isPercentage || false,
      byLevel: coupon.byLevel || "",
      byCountry: coupon.byCountry || "",
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .required("Please Enter Coupon Code")
        .max(6, "Code cannot be more than 6 characters"),
      discount: Yup.number().required("Please Enter Discount"),
      isPercentage: Yup.boolean().required("Please Choose Discount Type"),
      byLevel: Yup.number().required("Please Choose level"),
      byCountry: Yup.string().required("Please Choose Country"),
    }),

    onSubmit: async (values) => {
      try {
        const newCoupon = {
          code: values.code,
          value: values.discount,
          isPercentage: values.isPercentage,
          byLevel: values.byLevel,
          byCountry: values.byCountry,
          isActive: true, // Default to active
        };

        let apiUrl;
        let response;
        if (isEdit) {
          apiUrl = process.env.REACT_APP_API_URL || "https://api-pro.rydlearning.com";
          response = await axios.put(
            `${apiUrl}/admin/coupon/edit/${coupon.id}`,
            newCoupon
          );
          toast.success("Coupon updated successfully");
        } else {
          apiUrl = process.env.REACT_APP_API_URL || "https://api-pro.rydlearning.com";
          response = await axios.post(
            `${apiUrl}/admin/coupon/create`,
            newCoupon
          );
          toast.success("Coupon created successfully");
        }

        const responseData = response.data;

        if (isEdit) {
          const updatedCoupons = coupons.map((c) =>
            c.id === coupon.id ? { ...c, ...responseData } : c
          );
          setCoupons(updatedCoupons);
        } else {
          setCoupons([...coupons, responseData]);
        }

        toggle();
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  // Fetch coupons on initial render and whenever modal is toggled
  useEffect(() => {
    fetchCoupons();
  }, [modal]);

  // Function to fetch coupons
  const fetchCoupons = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://api-pro.rydlearning.com";
      const response = await axios.get(`${apiUrl}/admin/coupon/all`);
      setCoupons(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to toggle modal
  const toggle = () => {
    setModal(!modal);
  };

  // Function to handle coupon click for editing
  const handleCouponClick = (couponData) => {
    setCoupon(couponData);
    setIsEdit(true);
    toggle();
  };

  // Function to handle delete coupon click
  const onClickDelete = (couponData) => {
    setCoupon(couponData);
    setDeleteModal(true);
  };

  // Function to handle deleting coupon
  const handleDeleteCoupon = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://api-pro.rydlearning.com";
      await axios.delete(`${apiUrl}/admin/coupon/${coupon.id}`);
      const updatedCoupons = coupons.filter((c) => c.id !== coupon.id);
      setCoupons(updatedCoupons);
      setDeleteModal(false);
      toast.success("Coupon deleted successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete coupon");
    }
  };

  // Function to handle search query change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to toggle coupon status (activate/deactivate)
  const toggleCouponStatus = async (couponId, isActive) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://api-pro.rydlearning.com";
      await axios.put(`${apiUrl}/admin/coupon/edit/${couponId}`, { isActive: !isActive });
      const updatedCoupons = coupons.map((c) =>
        c.id === couponId ? { ...c, isActive: !isActive } : c
      );
      setCoupons(updatedCoupons);
      toast.success(`Coupon ${!isActive ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to toggle coupon status");
    }
  };
  
  return (
    <React.Fragment>
      {/* Your DeleteModal component */}
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteCoupon}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboard" breadcrumbItem="Manage Coupons" />
          <Row>
            <Col lg="12">
              <Row className="align-items-center">
                <Col md={6}>
                  <div className="mb-3">
                    <h5 className="card-title">
                      Coupon List{" "}
                      <span className="text-muted fw-normal ms-2">
                        ({coupons.length})
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
                          setCoupon({});
                          setIsEdit(false);
                          toggle();
                        }}
                      >
                        <i className="bx bx-plus me-1"></i> Add New Coupon
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
                        <th>Code</th>
                        <th>Discount</th>
                        <th>Country</th>
                        <th>Level</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(coupons) && coupons.length > 0 ? (
                        coupons.map((c, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{c.code}</td>
                            <td>
                              {c.isPercentage
                                ? `${c.value}%`
                                : `${c.value}%`}
                            </td>
                            <td>
                              {c.byCountry}
                            </td>
                            <td>
                              {c.byLevel}
                            </td>
                            <td>{c.isActive ? "Active" : "Inactive"}</td>
                            <td>
                              <div className="d-flex gap-3">
                                <Tooltip isOpen={editTooltipOpen} target="edit" toggle={() => setEditTooltipOpen(!editTooltipOpen)} placement="top" delay={{ show: 100, hide: 100 }}>
                                  Edit
                                </Tooltip>
                                <Link
                                  className="text-success"
                                  to="#"
                                  id="edit"
                                  onMouseEnter={() => setEditTooltipOpen(true)}
                                  onMouseLeave={() => setEditTooltipOpen(false)}
                                  onClick={() => {
                                    handleCouponClick(c);
                                    setIsEdit(true);
                                  }}
                                >
                                  <i className="mdi mdi-pencil font-size-18"></i>
                                </Link>

                                <Tooltip isOpen={deleteTooltipOpen} target="delete" toggle={() => setDeleteTooltipOpen(!deleteTooltipOpen)} placement="top" delay={{ show: 100, hide: 100 }}>
                                  Delete
                                </Tooltip>
                                <Link
                                  className="text-danger"
                                  to="#"
                                  id="delete"
                                  onMouseEnter={() => setDeleteTooltipOpen(true)}
                                  onMouseLeave={() => setDeleteTooltipOpen(false)}
                                  onClick={() => onClickDelete(c)}
                                >
                                  <i className="mdi mdi-delete font-size-18"></i>
                                </Link>

                                <Tooltip isOpen={statusTooltipOpen} target="status" toggle={() => setStatusTooltipOpen(!statusTooltipOpen)} placement="top" delay={{ show: 100, hide: 100 }}>
                                  {c.isActive ? 'Deactivate' : 'Activate'}
                                </Tooltip>
                                <Link
                                  className="text-secondary"
                                  onClick={() => toggleCouponStatus(c.id, c.isActive)}
                                  id="status"
                                  onMouseEnter={() => setStatusTooltipOpen(true)}
                                  onMouseLeave={() => setStatusTooltipOpen(false)}
                                >
                                  {c.isActive ? (
                                    <i className="mdi mdi-sync font-size-18"></i>
                                  ) : (
                                    <i className="mdi mdi-sync-off font-size-18"></i>
                                  )}
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <div className="text-center mt-5">
                        <h3>No data available</h3>
                      </div>
                      )}
                    </tbody>
                  </table>

                  {/* Your modal for adding/editing coupons */}
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>
                      {isEdit ? "Edit Coupon" : "Add New Coupon"}
                    </ModalHeader>
                    <ModalBody>
                      <Form onSubmit={validation.handleSubmit}>
                        <Row>
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label className="form-label">Code</Label>
                              <Input
                                name="code"
                                type="text"
                                placeholder="Code"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.code || ""}
                                invalid={
                                  validation.touched.code &&
                                  validation.errors.code
                                }
                              />
                              <FormFeedback type="invalid">
                                {validation.errors.code}
                              </FormFeedback>
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Discount</Label>
                              <Input
                                name="discount"
                                type="number"
                                placeholder="Discount"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.discount || ""}
                                invalid={
                                  validation.touched.discount &&
                                  validation.errors.discount
                                }
                              />
                              <FormFeedback type="invalid">
                                {validation.errors.discount}
                              </FormFeedback>
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Discount Type</Label>
                              <Input
                                type="select"
                                name="isPercentage"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.isPercentage || ""}
                                invalid={
                                  validation.touched.isPercentage &&
                                  validation.errors.isPercentage
                                }
                              >
                                <option value="">Select Discount Type</option>
                                <option value={false}>Direct Discount</option>
                                <option value={true}>Percentage</option>
                              </Input>
                              <FormFeedback type="invalid">
                                {validation.errors.isPercentage}
                              </FormFeedback>
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Country</Label>
                              {/* Render your CountrySelect component here */}
                              <CountrySelect
                                type="text"
                                name="byCountry"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.byCountry || ""}
                                invalid={
                                  validation.touched.byCountry &&
                                  validation.errors.byCountry
                                }
                               
                              />

                   <FormFeedback type="invalid">
                                {validation.errors.byCountry}
                              </FormFeedback>
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Level</Label>
                              <Input
                                type="select"
                                name="byLevel"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.byLevel || ""}
                                invalid={
                                  validation.touched.byLevel &&
                                  validation.errors.byLevel
                                }
                              >
                                <option value="">Select Level</option>
                                <option value="0">All Level</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                              </Input>
                              <FormFeedback type="invalid">
                                {validation.errors.byLevel}
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
                                  Create Coupon
                                </button>
                              ) : (
                                <button
                                  type="submit"
                                  className="btn btn-primary save-user"
                                >
                                  Update Coupon
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

export default withAuth(ManageCoupon);
