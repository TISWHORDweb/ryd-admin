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
import { baseUrl } from '../../Network';

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
  Button,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { calculateDebt } from "../../utils";

const ManagePromo = () => {
  const [promos, setPromos] = useState([]);
  const [promo, setPromo] = useState({});
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isApprove, setIsApprove] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [discount, setDiscount] = useState("");
  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editTooltipOpen, setEditTooltipOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  const getCountries = async () => {
    try {
      const response = await axios.get(
        "https://countriesnow.space/api/v0.1/countries/states"
      );
      setCountryList(response.data.data);
    } catch (error) {
      console.error("Error fetching countries", error);
    }
  };

  useEffect(() => {
    getCountries()
  }, [])


  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: promo.title || "",
      firstName: promo.firstName || "",
      lastName: promo.lastName || "",
      email: promo.email || "",
      address: promo.address || "",
      country: promo.country || "",
      phone: promo.phone || "",
      password: promo.value || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Promo Tile"),
      address: Yup.string(),
      country: Yup.string().required("Country is required"),
      firstName: Yup.string(),
      lastName: Yup.string(),
      email: Yup.string().email("Invalid email address"),
      phone: Yup.number(),
     password: Yup.string().min(8, "Password must be at least 8 characters")
      .max(20, "Password must not exceed 20 characters")
      .required("Password is required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one letter and one number"
      )
    }),

    onSubmit: async (values) => {
      let response;
        response = await axios.post(
          `${baseUrl}/admin/promo/create`,
          values
        );
        toast.success("Promo created successfully");
      

      const responseData = response.data;
        setPromos([...promos, responseData]);

      toggle();
    },
  });


  useEffect(() => {
    //Title
    window.document.title = "Promo - RYD Admin"
    fetchPromos();
  }, [modal]);

  const fetchPromos = async () => {
    try {
      const response = await axios.get(`${baseUrl}/admin/promo/all`);
      setPromos(response.data.data);
      setLoading(false); // Update loading state after data fetch
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggle = () => {
    setModal(!modal);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleActionChange = (action) => {
    validation.setFieldValue('action', action);
  };


  const filteredPromos = promos.filter(promo =>
    promo.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDisablePromo = async (id) => {
    setLoading(true)
    try {
      const response = await axios.put(`${baseUrl}/admin/promo/disable/${id}`);
      if (!response.status) {
        toast.error(response.message);
        return;
      }
      toast.success("Promo disabled successfully");
      const responseData = response.data;
      const updatedPromos = promos.map((p) =>
        p.id === promo.id ? { ...p, ...responseData } : p
      );
      setPromos(updatedPromos);
      fetchPromos()
    } catch (error) {
      toast.error("Failed to disable promo");
    }
  };

  const handleEnablePromo = async (id) => {
    setLoading(true)
    try {
      const response = await axios.put(`${baseUrl}/admin/promo/enable/${id}`);
      if (!response.status) {
        toast.error(response.message);
        return;
      }
      toast.success("Promo enabled successfully");
      const responseData = response.data;
      const updatedPromos = promos.map((p) =>
        p.id === promo.id ? { ...p, ...responseData } : p
      );
      setPromos(updatedPromos);
      fetchPromos()
    } catch (error) {
      toast.error("Failed to enable promo");
    }
  };


  // const handleCountryChange = (e) => {
  //   const countryName = e.target.value;
  //   setFieldValue("country", countryName)
  // };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboard" breadcrumbItem="Manage Promos" />
          <Row>
            <Col lg="12">
              <Row className="align-items-center">
                <Col md={6}>
                  <div className="mb-3">
                    <h5 className="card-title">
                      Promo List{" "}
                      <span className="text-muted fw-normal ms-2">
                        ({promos.length})
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
                      <button
                        className="btn btn-light"
                        onClick={() => {
                          setPromo({});
                          setIsEdit(false);
                          handleActionChange('add')
                          toggle();
                        }}>
                        <i className="bx bx-plus me-1"></i> Add New Promo
                      </button>
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
                  ) : filteredPromos.length === 0 ? (
                    <div className="text-center mt-5">
                      <h3>No data available</h3>
                    </div>
                  ) : (
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Promo Title</th>
                          <th>Head of Promo</th>
                          <th>Address</th>
                          <th>email</th>
                          <th>Phone</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPromos.map((p, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{p?.title}</td>
                            <td>{p?.firstName + " " + p?.lastName}</td>
                            <td>{p?.address}</td>
                            <td>{p?.email}</td>
                            <td>{p.phone}</td>
                            <td>{p.status ? "Active" : "InActive"}</td>
                            <td>
                              <div className="d-flex gap-3">
                                <>
                                  {/* <Tooltip
                                    isOpen={editTooltipOpen}
                                    target="edit"
                                    toggle={() => setEditTooltipOpen(!editTooltipOpen)}
                                    placement="top"
                                    delay={{ show: 100, hide: 100 }}
                                  >
                                    Edit
                                  </Tooltip>
                                  <Link
                                    className="text-success"
                                    to="#"
                                    id="edit"
                                    onMouseEnter={() => setEditTooltipOpen(true)}
                                    onMouseLeave={() => setEditTooltipOpen(false)}
                                    onClick={() => {
                                      handleUpdateClick(p);
                                    }}
                                  >
                                    <i className="mdi mdi-pencil font-size-18"></i>
                                  </Link> */}
                                  {p.status ?
                                    <Link
                                      className="text-danger"
                                      onClick={() => {
                                        if (confirm("Do you really want to DISABLE " + p?.title + " ?")) {
                                          handleDisablePromo(p.id)
                                        }
                                      }}
                                      id="manage"
                                    >
                                      <span className="">Disable</span>
                                    </Link> : <a href="#"
                                      className="text-success"
                                      onClick={() => {
                                        if (confirm("Do you really want to ENABLE " + p?.title + " ?")) {
                                          handleEnablePromo(p.id)
                                        }
                                      }}>
                                      Enable</a>}
                                  <Link
                                    className="text-[#1671D9]"
                                    to={`/promo/dashboard/${p.id}`}
                                    id="manage"
                                  >
                                    <span className="">Manage Promo</span>
                                  </Link>
                                </>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>


                  )}
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>
                      Add New Promo
                    </ModalHeader>
                    <ModalBody>
                      <Form onSubmit={validation.handleSubmit}>
                        <Row>
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label className="form-label">Promo title</Label>
                              <Input
                                name="title"
                                type="text"
                                placeholder="Enter promo title"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.title || title}
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
                              <Label className="form-label">Address</Label>
                              <Input
                                name="address"
                                type="text"
                                placeholder="Enter address"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.address || address}
                                invalid={
                                  validation.touched.address &&
                                  validation.errors.address
                                }
                              />
                              <FormFeedback type="invalid">
                                {validation.errors.address}
                              </FormFeedback>
                            </div>
                              <div className="mb-3">
                                <Label className="form-label">Country Or Registration</Label>
                                <Input
                                  type="select"
                                  name="country"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.country || country}
                                  invalid={
                                    validation.touched.country &&
                                    validation.errors.country
                                  }
                                >
                                  <option value="" label="Select country" />
                                  {countryList.map((country, i) => {
                                    return (
                                      <option key={i} value={country?.name}>
                                        {country?.name}
                                      </option>
                                    );
                                  })}
                                </Input>
                                <FormFeedback type="invalid">
                                  {validation.errors.country}
                                </FormFeedback>
                              </div>
                            <h5 className="my-4">Head of Promo Info </h5>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <Label className="form-label">First Name*</Label>
                                  <Input
                                    name="firstName"
                                    type="text"
                                    placeholder="Enter first name"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.firstName || firstName}
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
                                  <Label className="form-label">Last Name*</Label>
                                  <Input
                                    name="lastName"
                                    type="text"
                                    placeholder="lastName"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.lastName || lastName}
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
                                <Label className="form-label">Email Address</Label>
                                <Input
                                  name="email"
                                  type="email"
                                  disabled={isEdit? true:false}
                                  placeholder="Enter email address"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.email || email}
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
                              <Label className="form-label">Phone Number</Label>
                              <Input
                                name="phone"
                                type="text"
                                placeholder="Enter phone number"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.phone || phone}
                                invalid={
                                  validation.touched.phone &&
                                  validation.errors.phone
                                }
                              />
                              <FormFeedback type="invalid">
                                {validation.errors.phone}
                              </FormFeedback>
                            </div>
                              <div className="mb-3">
                                <Label className="form-label">Password</Label>
                                <Input
                                  name="password"
                                  type="password"
                                  placeholder="**********"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.password || password}
                                  invalid={
                                    validation.touched.password &&
                                    validation.errors.password
                                  }
                                />
                                <FormFeedback type="invalid">
                                  {validation.errors.password}
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
                               Add Promo
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
      </div >
      <ToastContainer />
    </React.Fragment >
  );
};

export default withAuth(ManagePromo);
