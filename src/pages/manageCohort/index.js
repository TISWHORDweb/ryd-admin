import React, {useEffect, useState} from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import {
    Button,
    Col,
    Container,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
} from "reactstrap";
import withAuth from "../withAuth";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {baseUrl} from '../../Network';
import Moment from "react-moment";


const ManageProgram = () => {
    const [cohort, setCohort] = useState([]);
    const [modal, setModal] = useState(false);
    const [newCohort, setNewCohort] = useState({title: "", description: "", startDate: "", endDate: ""});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");


    useEffect(() => {
        document.title = "Manage Cohort | RYD Admin";
        //toast.success("Email sent to all parents successfully");
        fetchCohort().then(r => null);
    }, []);


    const fetchCohort = async () => {
        try {
            const response = await axios.get(`${baseUrl}/admin/cohort/all`);
            setCohort(response?.data?.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error:", error);
        }
    };

    //add new cohort
    const addNewCohort = async () => {
        try {
            if (newCohort.description.length > 0 || newCohort.startDate.length > 0 || newCohort.endDate.length > 0 || newCohort.title.length > 0) {
                const d = await axios.post(`${baseUrl}/admin/cohort/create`, newCohort);
                toast.success("New cohort base altered, check table for new data");
                setModal(false)
                if (d.data.status) {
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000)
                }
            } else {
                toast.error("Please complete cohort form and try again...")
            }
        } catch (ex) {
            toast.error("Reload page and try again !")
        }
    }

    return (
        <React.Fragment>
            <ToastContainer/>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Dashboard" breadcrumbItem="Manage Cohort"/>
                    <Row>
                        <Col lg="12">
                            <Row className="align-items-center">
                                <Col md={6}>
                                    <div className="mb-3">
                                        <h5 className="card-title">
                                            Manage & Create Cohorts
                                            <span className="text-muted fw-normal ms-2"></span>
                                        </h5>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                                        {/*<div>*/}
                                        {/*    <Input*/}
                                        {/*        type="text"*/}
                                        {/*        placeholder="Search"*/}
                                        {/*        value={searchQuery}*/}
                                        {/*        onChange={(e) => setSearchQuery(e.target.value)}*/}
                                        {/*    />*/}
                                        {/*</div>*/}
                                        <div>
                                            <Button onClick={() => setModal(true)} className={'btn btn-danger'}
                                                    type="text">Create New Cohort</Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>

                            </Row>
                            <Row>
                                <Col xl="12" style={{overflow: 'scroll', width: '98%'}}>
                                    <table className="table align-middle">
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>Descriptions</th>
                                            <th>Enrolled</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>When</th>
                                            <th>Running</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {(cohort && cohort.length > 0) ?
                                            cohort.map((d,i)=> {
                                                    return <tr key={i}>
                                                        <td>{i+1}</td>
                                                        <td>{d.title}</td>
                                                        <td style={{width: 200}}>{d.description}</td>
                                                        <td>{d?.programs.length}</td>
                                                        <td><Moment date={d.startDate} format={"ddd, MMM Do YYYY"}/></td>
                                                        <td><Moment date={d.endDate} format={"ddd, MMM Do YYYY"}/></td>
                                                        <td><Moment date={d.startDate} fromNow={true}/></td>
                                                        <td>{d.isStarted?"Current":"Ended"}</td>
                                                        <td>{d.status?"Open": "Closed"}</td>
                                                        <td>
                                                            <a href={'#'} onClick={(e) => {
                                                                //prevent it
                                                                e.preventDefault()

                                                            }}><i className="mdi mdi-human-child font-size-18"></i></a>
                                                            <span style={{margin: 5}}/>
                                                            <a href={'#'} onClick={(e) => {
                                                                //prevent it
                                                                e.preventDefault()

                                                            }}><i style={{color: '#000000'}}
                                                                  className="mdi mdi-exit-run font-size-18"></i></a>
                                                            <span style={{margin: 5}}/>
                                                            <a href={'#'} onClick={(e) => {
                                                                //prevent it
                                                                e.preventDefault()

                                                            }}><i style={{color: '#fd0000'}}
                                                                  className="mdi mdi-delete-forever font-size-18"></i></a>
                                                        </td>
                                                    </tr>
                                            })
                                            : null
                                        }
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Modal isOpen={modal} toggle={() => setModal(false)}>
                <ModalHeader toggle={() => setModal(false)}>Create New Cohort</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col xs={12}>
                            <div className="row">
                                <div className="col-12">
                                    <div className="mb-3">
                                        <Label>Cohort Title</Label>
                                        <Input
                                            value={newCohort.title}
                                            onChange={e => setNewCohort({...newCohort, title: e.target.value})}
                                            type="text"
                                            name="time" placeholder={"Title"}>
                                        </Input>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="mb-3">
                                        <Label>Description</Label>
                                        <Input
                                            value={newCohort.description}
                                            onChange={e => setNewCohort({...newCohort, description: e.target.value})}
                                            type="text" placeholder={"Describe your next cohort..."}>
                                        </Input>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <Label>Start Date</Label>
                                        <Input
                                            onChange={e => setNewCohort({...newCohort, startDate: e.target.value})}
                                            type="date" placeholder={"Choose date"}>
                                        </Input>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <Label>End Date</Label>
                                        <Input
                                            onChange={e => setNewCohort({...newCohort, endDate: e.target.value})}
                                            type="date" placeholder={"Choose date"}>
                                        </Input>
                                    </div>
                                </div>

                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="text-end">
                                <button
                                    onClick={addNewCohort}
                                    type="submit"
                                    className="btn btn-primary save-user">
                                    Create Cohort
                                </button>
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>

        </React.Fragment>
    );
};

export default withAuth(ManageProgram);
