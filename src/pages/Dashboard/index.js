import React, { useEffect, useState } from 'react';
import withAuth from '../withAuth';
import ReactApexChart from "react-apexcharts"
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row
} from "reactstrap";
import CountUp from "react-countup";

const options = {
    chart: {
        height: 50,
        type: "line",
        toolbar: { show: false },
        sparkline: {
            enabled: true
        }
    },
    colors: ["#5156be"],
    stroke: {
        curve: "smooth",
        width: 2,
    },
    xaxis: {
        labels: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
        axisBorder: {
            show: false,
        },
    },
    yaxis: {
        labels: {
            show: false,
        },
    },
    tooltip: {
        fixed: {
            enabled: false,
        },
        x: {
            show: false,
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return "";
                },
            },
        },
        marker: {
            show: false,
        },
    },
};

const Dashboard = () => {
    const [widgetsData, setWidgetsData] = useState([]);

    useEffect(() => {
        // Set widgets data from the provided data
        setWidgetsData([
            {
                id: 1,
                title: "Total Students",
                price: 3,
                rank: "",
                isDoller: false,
                postFix: "",
                statusColor: "success",
                series: [2, 10, 18, 22, 36, 15, 47, 75, 65, 19, 14, 2, 47, 42, 15],
            },
            {
                id: 2,
                title: "Total Teachers",
                price: 2,
                rank: "",
                isDoller: false,
                statusColor: "danger",
                series: [15, 42, 47, 2, 14, 19, 65, 75, 47, 15, 42, 47, 2, 14, 12,]
            },
            {
                id: 3,
                title: "Total Programs",
                price: 2,
                rank: "",
                isDoller: false,
                postFix: "",
                statusColor: "success",
                series: [47, 15, 2, 67, 22, 20, 36, 60, 60, 30, 50, 11, 12, 3, 8,]
            },
            {
                id: 5,
                title: "Enrolled",
                price: 3,
                rank: "",
                isDoller: false,
                postFix: "",
                statusColor: "success",
                series: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14, 2, 47, 42, 15,]
            },
        ]);
    }, []);

    // Meta title
    useEffect(() => {
        document.title = "Dashboard | RYD Admin";
    }, []);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Dashboard" breadcrumbItem="Dashboard" />

                    <Row>
                        {widgetsData.map((widget, key) => (
                            <Col xl={3} md={6} key={key}>
                                <Card className="card-h-100">
                                    <CardBody>
                                        <Row className="align-items-center">
                                            <Col xs={6}>
                                                <span className="text-muted mb-3 lh-1 d-block text-truncate">
                                                    {widget.title}
                                                </span>
                                                <h4 className="mb-3">
                                                    {widget.isDoller === true ? "$" : ""}
                                                    <span className="counter-value">
                                                        <CountUp
                                                            start={0}
                                                            end={widget.price}
                                                            duration={2}
                                                        />
                                                        {widget.postFix}
                                                    </span>
                                                </h4>
                                            </Col>
                                            <Col xs={6}>
                                                <ReactApexChart
                                                    options={options}
                                                    series={[{ data: [...widget.series] }]}
                                                    type="line"
                                                    className="apex-charts mb-2"
                                                    dir="ltr"
                                                    height={50}
                                                />
                                            </Col>
                                        </Row>
                                        <div className="text-nowrap">
                                            <span
                                                className={"badge bg-" + widget.statusColor + "-subtle text-" + widget.statusColor}
                                            >
                                                {widget.rank}
                                            </span>
                                            <span className="ms-1 text-muted font-size-13"> Since last week </span>
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
