import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  CardBody,
  Label,
  Input,
  FormFeedback,
  Form,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import Breadcrumb from "../../components/Common/Breadcrumb";
import avatar from "../../assets/images/users/avatar-1.jpg";
import axios from "axios";

const UserProfile = () => {
  document.title = "Dashboard | RYD Admin";

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [idx, setIdx] = useState(1);
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState(0); // Default role set to 0 (normal admin)
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Simulate fetching user data from mock API
    const fetchData = async () => {
      try {
        // Mock API endpoint
        const apiUrl = "https://jsonplaceholder.typicode.com/users/1";
        const response = await axios.get(apiUrl);
        const userData = response.data;
        setName(userData.username);
        setEmail(userData.email);
        setIdx(userData.id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: name || "",
      idx: idx || "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your UserName"),
    }),
    onSubmit: async (values) => {
      try {
        // Simulate API call to update user data
        // In a real application, replace this with your actual API endpoint
        const apiUrl = "http://localhost:3000/admin/auth/:id";
        await axios.put(apiUrl, values);
        setSuccess("Username updated successfully");
        setError("");
      } catch (error) {
        console.error("Error updating username:", error);
        setError("Failed to update username");
        setSuccess("");
      }
    },
  });

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    toggleDropdown();
  };

  const handleViewDetails = () => {
    // Show user's display name and role
    setDisplayName(name); // Assuming display name is the same as the username
    const roleName = role === 1 ? "Super Admin" : "Normal Admin";
    alert(`Display Name: ${displayName}\nRole: ${roleName}`);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Dashboard" breadcrumbItem="Settings" />

         


          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                }}
              >
                <div className="form-group">
                  <Label className="form-label">ADMIN SETTINGS</Label>
                 </div>

                <div className="text-center mt-4">
                  <Button type="submit" color="primary">
                    Add new Admin
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>

        
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
