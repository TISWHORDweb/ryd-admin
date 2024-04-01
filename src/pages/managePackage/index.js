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
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import withAuth from "../withAuth";
import { DaysSelect } from "../DaysOfWeekSelect";
import { t } from "i18next";

const ManagePackage = () => {
  document.title = "Manage Package | RYD Admin";

  const [packages, setPackages] = useState([]);
  const [packageData, setPackageData] = useState({});
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: packageData.title || "",
      description: packageData.description || "",
      imageUrl: packageData.imageUrl || "",
      week: packageData.week || "",
      amount: packageData.amount || "",
      minAge: packageData.minAge || "",
      maxAge: packageData.maxAge || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please enter the Title"),
      description: Yup.string().required("Please enter a description"),
      imageUrl: Yup.string().required("Please enter an image URL"),
      week: Yup.number().required("Please enter the program duration number of weeks"),
      amount: Yup.number().required("Please enter the amount"),
      minAge: Yup.number().required("Please enter the minimum age"),
      maxAge: Yup.number().required("Please enter the maximum age"),
    }),
    onSubmit: async (values) => {
      try {
        const newPackage = {
          title: values.title,
          description: values.description,
          imageUrl: values.imageUrl,
          week: values.week,
          amount: values.amount,
          minAge: values.minAge,
          maxAge: values.maxAge,
        };

        let apiUrl;
        let response;
        if (isEdit) {
          apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
          response = await axios.put(
            `${apiUrl}/admin/package/edit/${packageData.id}`,
            newPackage
          );
          toast.success("Package updated successfully");
        } else {
          apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
          response = await axios.post(
            `${apiUrl}/admin/package/create`,
            newPackage
          );
          toast.success("Package created successfully");
        }

        const responseData = response.data;

        if (isEdit) {
          const updatedPackages = packages.map((pkg) =>
            pkg.id === packageData.id ? { ...pkg, ...responseData } : pkg
          );
          setPackages(updatedPackages);
        } else {
          setPackages([...packages, responseData]);
        }

        toggle();
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  useEffect(() => {
    fetchPackages();
  }, [modal]);

  const fetchPackages = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
      const response = await axios.get(`${apiUrl}/admin/package/all`);
      setPackages(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggle = () => {
    setModal(!modal);
  };

  const handlePackageClick = (pkg) => {
    setPackageData(pkg);
    setIsEdit(true);
    toggle();
  };

  const onClickDelete = (pkg) => {
    setPackageData(pkg);
    setDeleteModal(true);
  };

  const shortenUrl = (url, maxLength) => {
    if (url.length <= maxLength) {
      return url;
    } else {
      return url.substring(0, maxLength) + "...";
    }
  };

  const handleDeletePackage = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
      await axios.delete(`${apiUrl}/admin/package/${packageData.id}`);
      const updatedPackages = packages.filter(
        (pkg) => pkg.id !== packageData.id
      );
      setPackages(updatedPackages);
      setDeleteModal(false);
      toast.success("Package deleted successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete package");
    }
  };

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeletePackage}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboard" breadcrumbItem="Manage Package" />
          <Row>
            <Col lg="12">
              <Row className="align-items-center">
                <Col md={6}>
                  <div className="mb-3">
                    <h5 className="card-title">
                      Package List{" "}
                      <span className="text-muted fw-normal ms-2">
                        ({packages.length})
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
                          setPackageData({});
                          setIsEdit(false);
                          toggle();
                        }}
                      >
                        <i className="bx bx-plus me-1"></i> Add New Package
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
                        <th>Image URL</th>
                        <th>Week</th>
                        <th>Amount</th>
                        <th>Min Age</th>
                        <th>Max Age</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(packages) &&
                        packages.map((pkg, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{pkg.title}</td>
                            <td>{pkg.description}</td>
                            <td>
                              {pkg.imageUrl && shortenUrl(pkg.imageUrl, 10)}
                            </td>
                            <td>{pkg.week}</td>
                            <td>{pkg.amount}</td>
                            <td>{pkg.minAge}</td>
                            <td>{pkg.maxAge}</td>
                            <td>
                              <div className="d-flex gap-3">
                                <Link
                                  className="text-success"
                                  to="#"
                                  onClick={() => {
                                    handlePackageClick(pkg);
                                    setIsEdit(true);
                                  }}
                                >
                                  <i className="mdi mdi-pencil font-size-18"></i>
                                </Link>
                                <Link
                                  className="text-danger"
                                  to="#"
                                  onClick={() => onClickDelete(pkg)}
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
                      {isEdit ? "Edit Package" : "Add New Package"}
                    </ModalHeader>
                    <ModalBody>
                      <Form onSubmit={validation.handleSubmit}>
                        <Row>
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label className="form-label">Program Title</Label>
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
                              <Label className="form-label">Program Description</Label>
                              <Input
                                name="description"
                                type="text"
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
                            <div className="mb-3">
                              <Label className="form-label">Image URL</Label>
                              <Input
                                name="imageUrl"
                                type="text"
                                placeholder="Image URL"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.imageUrl || ""}
                                invalid={
                                  validation.touched.imageUrl &&
                                  validation.errors.imageUrl
                                }
                              />
                              <FormFeedback type="invalid">
                                {validation.errors.imageUrl}
                              </FormFeedback>
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Program Duration number of weeks</Label>
                              <Input
                                type="text"
                                name="week"
                                placeholder="Program Duration Number of Weeks"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.week || ""}
                                invalid={
                                  validation.touched.week &&
                                  validation.errors.week
                                }
                             />
                               

                              <FormFeedback type="invalid">
                                {validation.errors.week}
                              </FormFeedback>
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Amount</Label>
                              <Input
                                name="amount"
                                type="number"
                                placeholder="Program Amount"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.amount || ""}
                                invalid={
                                  validation.touched.amount &&
                                  validation.errors.amount
                                }
                              />
                              <FormFeedback type="invalid">
                                {validation.errors.amount}
                              </FormFeedback>
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Min Age</Label>
                              <Input
                                name="minAge"
                                type="number"
                                placeholder="Minimum Age"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.minAge || ""}
                                invalid={
                                  validation.touched.minAge &&
                                  validation.errors.minAge
                                }
                              />
                              <FormFeedback type="invalid">
                                {validation.errors.minAge}
                              </FormFeedback>
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Max Age</Label>
                              <Input
                                name="maxAge"
                                type="number"
                                placeholder="Maximum Age"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.maxAge || ""}
                                invalid={
                                  validation.touched.maxAge &&
                                  validation.errors.maxAge
                                }
                              />
                              <FormFeedback type="invalid">
                                {validation.errors.maxAge}
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
                                {isEdit ? "Update" : "Create"}
                              </button>
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

export default withAuth(ManagePackage);
