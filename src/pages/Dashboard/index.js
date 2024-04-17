import React, { useEffect, useState } from 'react';
import withAuth from '../withAuth';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row
} from "reactstrap";
import axios from 'axios';

const Dashboard = () => {
    const [programData, setProgramData] = useState([]);
    const [parentCount, setParentCount] = useState(0);
    const [childCount, setChildCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

                // Fetch parent count
                const parentResponse = await axios.get(`${apiUrl}/admin/parent/all`);
                setParentCount(parentResponse.data.data.length);

                // Fetch child count
                const childResponse = await axios.get(`${apiUrl}/admin/child/all`);
                setChildCount(childResponse.data.data.length);

                // Fetch program data
                const programResponse = await axios.get(`${apiUrl}/admin/program/all`);
                const responseData = programResponse.data;

                const teacherAssignedCount = responseData.data.reduce((count, item) => count + (item.teacher ? 1 : 0), 0);
                const enrolledCount = responseData.data.reduce((count, item) => count + (item.child ? 1 : 0), 0);
                const programCount = responseData.data.length;
                const packageCount = responseData.data.reduce((count, item) => count + (item.packageId ? 1 : 0), 0);

                setProgramData([
                    { title: "Total Programs", count: programCount, statusColor: "primary" },
                    { title: "Teacher Assigned", count: teacherAssignedCount, statusColor: "success" },
                    { title: "Enrolled", count: enrolledCount, statusColor: "danger" },
                    { title: "Total Package", count: packageCount, statusColor: "secondary" }
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

        document.title = "Dashboard | RYD Admin";
    }, []);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Dashboard" breadcrumbItem="Dashboard" />

                    <Row>
                        <Col xl={3} md={6}>
                            <Card className="card-h-100">
                                <CardBody>
                                    <h4 className="mb-3">Total Parents</h4>
                                    <div className="badge bg-info-subtle text-info mb-3" style={{ fontSize: "15px", padding: "10px" }}>
                                        {parentCount}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={3} md={6}>
                            <Card className="card-h-100">
                                <CardBody>
                                    <h4 className="mb-3">Total Child</h4>
                                    <div className="badge bg-warning-subtle text-warning mb-3" style={{ fontSize: "15px", padding: "10px" }}>
                                        {childCount}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        {programData.map((card, index) => (
                            <Col key={index} xl={3} md={6}>
                                <Card className="card-h-100">
                                    <CardBody>
                                        <h4 className="mb-3">{card.title}</h4>
                                        <div className={"badge bg-" + card.statusColor + "-subtle text-" + card.statusColor + " mb-3"} style={{ fontSize: "15px", padding: "10px" }}>
                                            {card.count}
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default withAuth(Dashboard);
