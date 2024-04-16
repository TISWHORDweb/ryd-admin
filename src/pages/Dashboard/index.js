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

    useEffect(() => {
    const fetchData = async () => {
    try {
        const apiUrl = "https://api-pro.rydlearning.com/admin/program/all";
        const response = await axios.get(apiUrl);
        const responseData = response.data;

        console.log("Response data:", responseData);

        if (!Array.isArray(responseData.data)) {
            console.error("Response data is not an array:", responseData.data);
            return;
        }

        // Get counts
        const childCount = responseData.data.reduce((count, item) => count + (item.child ? 1 : 0), 0);
        const programCount = responseData.data.length;
        const teacherCount = responseData.data.reduce((count, item) => count + (item.teacher ? 1 : 0), 0);
        const packageCount = responseData.data.reduce((count, item) => count + (item.packageId ? 1 : 0), 0);

        console.log("Child Count:", childCount);
        console.log("Program Count:", programCount);
        console.log("Teacher Count:", teacherCount);
        console.log("Package Count:", packageCount);

        // Update state with program data
        setProgramData([
            { title: "Total Programs", count: programCount, statusColor: "primary" },
            { title: "Teacher Assigned", count: teacherCount, statusColor: "success" },
            { title: "Child Enrolled", count: childCount, statusColor: "danger" },
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
