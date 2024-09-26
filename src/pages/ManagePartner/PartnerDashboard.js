import React, { useEffect, useState } from 'react';
import withAuth from '../withAuth';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  CardBody,
  Tooltip,
  Card,
  Form,
  Label,
  Input,
  FormFeedback,
  Button,
} from "reactstrap";
import axios from 'axios';
import { baseUrl } from '../../Network';
import { Link, useParams } from 'react-router-dom';
import { newFormatDate, totalCohortChild, totalCohortParent } from '../../utils';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [cohorts, setCohorts] = useState([]);
  const [partner, setPartner] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [programData, setProgramData] = useState([
    { title: "Total Programs", count: 0, statusColor: "primary" },
    { title: "Teacher Assigned", count: 0, statusColor: "success" },
    { title: "Enrolled", count: 0, statusColor: "danger" },
    { title: "Total Package", count: 0, statusColor: "secondary" }
  ]);

  const { id } = useParams()

  useEffect(() => {
    document.title = "Partner Dashboard | RYD Admin";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch parent count
      const partnerDashboardResponse = await axios.get(`${baseUrl}/admin/partner/dashboard/${id}`);
      if (partnerDashboardResponse) {
        setLoading(false)
        const parentCount = partnerDashboardResponse.data.data.parents?.length;
        const debtCount = partnerDashboardResponse.data.data.debt;
        const programCount = partnerDashboardResponse.data.data.programs?.length;
        const childCount = partnerDashboardResponse.data.data.totalStudent;
        setCohorts(partnerDashboardResponse.data.data.cohort)
        setPartner(partnerDashboardResponse.data.data.partner)
        setProgramData([
          { title: "Total Programs", count: programCount, statusColor: "primary" },
          { title: "Teacher Child", count: childCount, statusColor: "success" },
          { title: "Total Parents", count: parentCount, statusColor: "danger" },
          { title: "Total Debt", count: "$"+debtCount, statusColor: "secondary" }
        ]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filteredCohort = cohorts.filter(cohort =>
    cohort.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Breadcrumbs title="Manage Partner" breadcrumbItem={`${partner ? partner.organizationName : ""} Dashboard`} />
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
          <Row className="align-items-center">
                <Col md={6}>
                  <div className="mb-3">
                    <h5 className="card-title">
                      Cohort List{" "}
                      <span className="text-muted fw-normal ms-2">
                        ({cohorts.length})
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
              ) : filteredCohort.length === 0 ? (
                <div className="text-center mt-5">
                  <h3>No data available</h3>
                </div>
              ) : (
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Cohort Name</th>
                      <th>Start Date	</th>
                      <th>End Date</th>
                      <th>Enrolled Students</th>
                      <th>No of parents	</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCohort.map((p, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{p?.title}</td>
                        <td>{newFormatDate(p?.startDate)}</td>
                        <td>{newFormatDate(p?.startDate)}</td>
                        <td>{totalCohortChild(p.partner_programs)}</td>
                        <td>{totalCohortParent(p.partner_programs)}</td>
                        <td>{p.status ? (
                          <p className=" bg-custom-yellow  font-normal text-yellow-600 text-center p-1 rounded-2xl" style={{background:"rgba(255, 255, 0, 0.147)",color:"blavk"}}>
                            Ongoing
                          </p>
                        ) : (
                          <p className=" bg-[#E7F6EC] font-normal text-[#0F973D] text-center p-1 rounded-2xl" style={{background:"#E7F6EC",color:"#0F973D"}}>
                            Completed
                          </p>
                        )}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>


              )}
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default withAuth(Dashboard);
