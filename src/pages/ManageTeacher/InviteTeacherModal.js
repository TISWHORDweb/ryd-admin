import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Label,
  Table,
} from "reactstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

const InviteTeacherModal = ({ isOpen, toggle }) => {
  const [email, setEmail] = useState("");
  const [invitedTeachers, setInvitedTeachers] = useState(null);

  useEffect(() => {
    fetchInvitedTeachers();
  }, []);

  const fetchInvitedTeachers = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://api-pro.rydlearning.com";
      const response = await axios.get(`${apiUrl}/admin/teacher/invites`);
      console.log("Fetched invited teachers:", response.data); // Log fetched data
      setInvitedTeachers(response.data.data); // Update state with invited teachers
    } catch (error) {
      console.error("Failed to fetch invited teachers", error);
    }
  };

  const inviteTeacher = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://api-pro.rydlearning.com";
      const response = await axios.post(`${apiUrl}/admin/teacher/invite`, {
        email,
      });
      if (response.data.status) {
        toast.success("Teacher invited successfully");
        fetchInvitedTeachers(); // Refresh the list of invited teachers
      } else {
        toast.error(response.data.message || "Failed to invite teacher");
      }
    } catch (error) {
      toast.error("Failed to invite teacher");
      console.error("Failed to invite teacher", error);
    }
  };

  const removeInviteTeacher = async (id) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://api-pro.rydlearning.com";
      const response = await axios.delete(
        `${apiUrl}/admin/teacher/invite/remove/${id}`
      );
      if (response.data.status) {
        toast.success("Teacher invite removed successfully");
        fetchInvitedTeachers(); // Refresh the list of invited teachers
      } else {
        toast.error(response.data.message || "Failed to remove teacher invite");
      }
    } catch (error) {
      toast.error("Failed to remove teacher invite");
      console.error("Failed to remove teacher invite", error);
    }
  };

  const handleInvite = () => {
    inviteTeacher();
    toggle();
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Invite Teacher</ModalHeader>
        <ModalBody>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={handleInputChange}
            placeholder="Enter email"
          />
          <Button color="primary" className="mt-3" onClick={handleInvite}>
            Invite
          </Button>

          <Table className="mt-4">
            <thead>
              <tr>
                <th>Email</th>
                <th>Link Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invitedTeachers !== null && invitedTeachers.length > 0 ? (
                invitedTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>{teacher.email}</td>
                    <td>{teacher.isUsed ? "Used" : "Not Used"}</td>
                    <td>
                      <Link
                        className="text-danger"
                        to="#"
                        onClick={() => removeInviteTeacher(teacher.id)}
                      >
                        <i className="mdi mdi-delete font-size-18"></i>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No invited email</td>
                </tr>
              )}
            </tbody>
          </Table>
        </ModalBody>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default InviteTeacherModal;