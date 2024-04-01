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

const ManageCoupon = () => {
  document.title = "Manage Coupons | RYD Admin";

  const [coupons, setCoupons] = useState([]);
  const [coupon, setCoupon] = useState({});
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      code: coupon.code || "",
      discount: coupon.value || "",
      isPercentage: coupon.isPercentage || false,
    },
    validationSchema: Yup.object({
      code: Yup.string().required("Please Enter Coupon Code"),
      discount: Yup.number().required("Please Enter Discount"),
      isPercentage: Yup.boolean().required("Please Choose Discount Type"),
    }),

    onSubmit: async (values) => {
      try {
        const newCoupon = {
          code: values.code,
          value: values.discount,
          isPercentage: values.isPercentage,
          isActive: true, // Default to active
        };

        let apiUrl;
        let response;
        if (isEdit) {
          apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
          response = await axios.put(
            `${apiUrl}/admin/coupon/edit/${coupon.id}`,
            newCoupon
          );
          toast.success("Coupon updated successfully");
        } else {
          apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
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

  useEffect(() => {
    fetchCoupons();
  }, [modal]);

  const fetchCoupons = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
      const response = await axios.get(`${apiUrl}/admin/coupon/all`);
      setCoupons(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggle = () => {
    setModal(!modal);
  };

  const handleCouponClick = (couponData) => {
    setCoupon(couponData);
    setIsEdit(true);
    toggle();
  };

  const onClickDelete = (couponData) => {
    setCoupon(couponData);
    setDeleteModal(true);
  };

  const handleDeleteCoupon = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <React.Fragment>
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
                                ? `${c.isPercentage}`
                                : `${c.value}`}
                            </td>
                            <td>
                              <div className="d-flex gap-3">
                                <Link
                                  className="text-success"
                                  to="#"
                                  onClick={() => {
                                    handleCouponClick(c);
                                    setIsEdit(true);
                                  }}
                                >
                                  <i className="mdi mdi-pencil font-size-18"></i>
                                </Link>
                                <Link
                                  className="text-danger"
                                  to="#"
                                  onClick={() => onClickDelete(c)}
                                >
                                  <i className="mdi mdi-delete font-size-18"></i>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">No coupons yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

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
