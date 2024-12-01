import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import { Col, Container, Form, Input, Label, Modal, ModalBody, ModalHeader, Row, } from "reactstrap";
import withAuth from "../withAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from '../../Network';
import Moment from 'react-moment';
import moment from 'moment-timezone';
import 'moment-timezone';
import { convertLessonTimes, convertTimeGroup, convertTimegroupToParentTimezone, formatData } from "../../utils";

const TIMES_ = [
    "12:00AM",
    "1:00AM",
    "2:00AM",
    "3:00AM",
    "4:00AM",
    "5:00AM",
    "6:00AM",
    "7:00AM",
    "8:00AM",
    "9:00AM",
    "10:00AM",
    "11:00AM",
    "12:00PM",
    "1:00PM",
    "2:00PM",
    "3:00PM",
    "4:00PM",
    "5:00PM",
    "6:00PM",
    "7:00PM",
    "8:00PM",
    "9:00PM",
    "10:00PM",
    "11:00PM",
]

const formatTime = (time) => {
    // const hour = Math.floor(time);
    // const minute = (time - hour) * 60;
    // const meridian = hour >= 12 ? "PM" : "AM";
    // const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12-hour format
    // return `${formattedHour}:${minute < 10 ? "0" : ""}${Math.floor(minute)} ${meridian}`;
    return TIMES_[time]
};

const formatTimeZone = (tz, day, time) => {
    const pTime = moment().utc(false).utcOffset(tz)
    pTime.day(day)
    pTime.hour(time)
    pTime.second(0)
    pTime.minute(0)
    return pTime
};

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const formatDay = (day) => {
    // Adjust day to be within the range of 0 to 6
    //const adjustedDay = (((day - 1) % 7) + 7) % 7;
    return days[day];
};

const ManageProgram = () => {
    document.title = "Manage Promo Program | RYD Admin";

    const [programs, setPrograms] = useState([]);
    const [programsList, setProgramsList] = useState([]);
    const [modal, setModal] = useState(false);
    const [assignModal, setAssignModal] = useState(false);
    const [timeModal, setTimeModal] = useState(false);
    const [assignActionModal, setAssignActionModal] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [multiIDs, setMultiIDs] = useState([]);
    const [multiTargetIDs, setMultiTargetIDs] = useState({});
    const [programMData, setProgramMData] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [coupons, setCoupons] = useState([]);
    const [timeGroup, setTimeGroup] = useState([]);
    const [cohorts, setCohorts] = useState([]);
    const [packages, setPackages] = useState([]);
    const [filteredProgramList0, setFilteredProgramList0] = useState([]);
    const [filteredProgramList2, setFilteredProgramList2] = useState([]);
    const [displayProgramList, setDisplayProgramList] = useState([]);
    const { id } = useParams()
    const [selectedTimeGroup, setSelectedTimeGroup] = useState('');
    const [selectedTimeGroupId, setSelectedTimeGroupId] = useState();
    const [selectedDates, setSelectedDates] = useState({});


    const splitTimeSlots = (timeString) => {
        if (!timeString) return [];
        return timeString.includes(',') ?
            timeString.split(',').map(time => time.trim()) :
            [timeString.trim()];
    };

    const handleTimeGroupSelection = (timeValue) => {
        const data = formatData(timeValue)
        setSelectedTimeGroupId(data.value)
        setSelectedTimeGroup(data.name);
        setSelectedDates({});
    };

    const handleDateSelection = (timeSlot, date) => {
        setSelectedDates(prev => ({
            ...prev,
            [timeSlot]: date
        }));
    };

    const getFormattedData = () => {
        return Object.entries(selectedDates).map(([timeSlot, date], index) => ({
            id: index,
            name: timeSlot,
            value: new Date(date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric'
            })
        }));
    };

    const formattedData = getFormattedData();
    useEffect(() => {
        fetchPrograms().then(r => null);
    }, [modal]);

    useEffect(() => {
        fetchTimeGroup(id)
    }, [id]);


    const handleAssignClick = (programData) => {
        setSelectedProgram(programData);
        setAssignModal(true)
    };
    const handleTimeClick = (programData) => {
        setMultiTargetIDs({})
        setTimeModal(true)
        setSelectedTimeGroup('')
    };

    const handleActionAssignClick = (programData) => {
        setMultiTargetIDs({})
        setAssignActionModal(true)
    };

    const handleTeacherChange = (e) => {
        setSelectedTeacher(e.target.value);
    };


    useEffect(() => {
        fetchPrograms().then(r => null)
    }, [modal]);

    useEffect(() => {
        fetchTeachers().then(r => null)
        //fetch coupon
        fetchCoupons().then(r => null)
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await axios.get(`${baseUrl}/admin/coupon/all`);
            setCoupons(response.data.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    function compareFn(a, b) {
        if (a.time < b.time && a.day < b.day) {
            return -1;
        } else if (a.time > b.time && a.day > b.day) {
            return 1;
        }
        // a must be equal to b
        return 0;
    }

    const fetchPrograms = async () => {
        try {
            const packages = await axios.get(`${baseUrl}/admin/package/all`);
            const cohorts = await axios.get(`${baseUrl}/admin/cohort/all`);
            const response = await axios.get(`${baseUrl}/admin/promo/program/all/${id}`);
            setPrograms(response?.data?.data);
            setCohorts(cohorts?.data?.data);
            setPackages(packages?.data?.data)
            setLoading(false);
            setTimeout(() => {
                //filter to it
                const xdata = response?.data?.data;
                //setProgramsList(xdata.sort(compareFn))
                const __xdata = xdata.sort(compareFn)
                setProgramsList(__xdata)
                setDisplayProgramList(__xdata)
                setFilteredProgramList0(__xdata)
                setFilteredProgramList2(__xdata)
                setLoading(false); // Update loading state after data fetch
            }, 100)
        } catch (error) {
            setLoading(false);
            //console.error("Error:", error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await axios.get(`${baseUrl}/admin/teacher/all`);
            setTeachers(response.data.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const fetchTimeGroup = async (id) => {
        try {
            const response = await axios.get(`${baseUrl}/admin/promo/timegroup/${id}`);
            setTimeGroup(response.data.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleTeacherAssignClick = async () => {
        try {
            await axios.post(`${baseUrl}/admin/promo/program/assign/teacher`, {
                programIds: selectedProgram.id,
                teacherId: selectedTeacher
            });
            // Fetch the updated programs after successful assignment
            await fetchPrograms(); // Assuming fetchPrograms function updates the programs state

            toast.success("Teacher assigned successfully.");
            setAssignModal(false);
            setMultiTargetIDs({})
            setSelectedTimeGroup('')
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to assign teacher.");
        }
    };

    const handleProgramClickSubmit = async () => {
        if (!selectedProgram || !selectedProgram?.id) {
            //console.error("Invalid program data.");
            toast.warn("Reload this page and try again")
            return;
        }
        //check and push to server
        await axios.put(`${baseUrl}/admin/promo/program/edit/${selectedProgram.id}`, {day: formattedData, timeGroupIndex: selectedTimeGroupId});
        toast.success("Program data altered changes");
        setSelectedTimeGroup('')
        setSelectedTimeGroupId(null)
        setModal(false)
        await fetchPrograms()
    }

    const handleToggleIsPaid = async (programData) => {
        try {
            if (!programData || !programData.id) {
                //console.error("Invalid program data.");
                return;
            }
            const updatedProgram = { ...programData, isPaid: !programData.isPaid };
            await axios.put(
                `${baseUrl}/admin/promo/program/edit/${programData.id}`,
                updatedProgram
            );

            const confirmMarkAsPaid = window.confirm(
                "Are you sure you want to toggle this program payment status ?"
            );
            if (confirmMarkAsPaid) {
                const updatedPrograms = programs.map((program) =>
                    program.id === programData.id ? updatedProgram : program
                );
                setPrograms(updatedPrograms);
                toast.success("Program marked as paid.");
                await fetchPrograms();
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleProgramClick = (programData) => {
        setSelectedProgram(programData)
        const time = convertTimeGroup(timeGroup)
        const select = time[programData.timeGroupIndex].name
        const selectID = time[programData.timeGroupIndex].value
        setSelectedTimeGroup(select)
        setSelectedTimeGroupId(selectID)
        setModal(true)
    };

    const processBatchOperations = async (status) => {
        //performing group actions
        try {
            if (multiIDs.length > 0 ) {
                const data = status ? { ids: multiIDs, day: formattedData, timeGroupIndex: selectedTimeGroupId } : { ids: multiIDs, ...multiTargetIDs }
                await axios.post(`${baseUrl}/admin/promo/program/batch-update`, data);
                toast.success("Program data altered changes");
                await fetchPrograms()
                setMultiTargetIDs({})
                setAssignActionModal(false)
                setTimeModal(false)
                setSelectedTimeGroup('')
                setSelectedTimeGroupId(null)
            } else {
                toast.error("Please, select at least 1 child/program to perform action")
            }
        } catch (e) {
            toast.error("Reload this page and try again")
        }
    }

    const processReminder = async () => {
        //performing group actions
        try {
            if (multiIDs.length > 0) {
                await axios.post(`${baseUrl}/admin/promo/parent/send/reminder`, { ids: multiIDs });
                toast.success("Class reminder sent successfully");
                await fetchPrograms()
            } else {
                toast.error("Please, select at least 1 child/program to perform action")
            }
        } catch (e) {
            toast.error("Reload this page and try again")
        }
    }

    const FormatDate = (data, i) => {
        const parsedTimeSlots = formatData(data);
        if (parsedTimeSlots[i]) {
            return parsedTimeSlots[i].map(({ dayText, timeText }) => `${dayText} ${timeText}`).join(' - ');
        }
        return '';
    };

    const parentTimeZone = (times, index, timezone) => {
        const parsedTimes = formatData(times)
        const timeGroup = parsedTimes[index];
        const time = convertLessonTimes(timeGroup, timezone)
        return time
    }

    function renderDate(data) {
        const parsedData = formatData(data);
        const formattedDates = parsedData.map(item => `${item.value}, ${item.name}`);
        return formattedDates.join(' / ');
    }

    return (
        <React.Fragment>
            <ToastContainer />
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Dashboard" breadcrumbItem="Manage Program" />
                    <Row>
                        <Col lg="12">
                            <Row className="align-items-center me-2">
                                <Col md={4}>
                                    <div className="mb-3">
                                        <h5 className="card-title">
                                            Manage Promo Program List {" "}
                                            <span className="text-muted fw-normal ms-2">({displayProgramList.length})</span>
                                        </h5>
                                    </div>
                                </Col>
                                <Col md={8}>
                                    <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                                        <div>
                                            <Input
                                                type="text"
                                                placeholder="Search"
                                                value={searchQuery}
                                                onChange={(e) => {
                                                    setSearchQuery(e.target.value)
                                                    // Function to filter package list based on search query
                                                    const searchProgrammed = programs.filter((program) => `${program?.child?.firstName} ${program?.child?.lastName} ${program?.child?.parent?.firstName} ${program?.child?.parent?.lastName}`.toLowerCase().includes(e.target.value.toLowerCase()));
                                                    setDisplayProgramList(searchProgrammed)
                                                }}
                                            />
                                        </div>
                                        {/* <div>
                                            <select className={'form-control'} onChange={(e) => {
                                                //filter based on cohorts
                                                if (Number(e.target.value) === 0) {
                                                    window.location.reload()
                                                } else {
                                                    const __cohortFilter = programs.filter(r => Number(r.cohortId) === Number(e.target.value));
                                                    setDisplayProgramList(__cohortFilter)
                                                    setFilteredProgramList0(__cohortFilter)
                                                    setFilteredProgramList2(__cohortFilter)
                                                }
                                            }}>
                                                <option value={0}>All Cohorts</option>
                                                {cohorts && cohorts.map((d, i) => <option key={i}
                                                    value={d.id}>{d.title}</option>)}
                                            </select>
                                        </div> */}
                                        <div>
                                            <select className={'form-control'} onChange={(e) => {
                                                //filter based on status
                                                if (Number(e.target.value) === 1) {
                                                    const __activeProgramFilter = filteredProgramList0.filter(r => r.isPaid === true && r.isCompleted === false)
                                                    setDisplayProgramList(__activeProgramFilter)
                                                    setFilteredProgramList2(__activeProgramFilter)
                                                } else if (Number(e.target.value) === 2) {
                                                    setDisplayProgramList(filteredProgramList0.filter(r => r.isPaid === false && r.isCompleted === false))
                                                } else {
                                                    window.location.reload()
                                                }
                                            }}>
                                                <option value={0}>All Programs</option>
                                                <option value={1}>Active Enrolment</option>
                                                <option value={2}>Awaiting Checkout</option>
                                            </select>
                                        </div>
                                        <div>
                                            <select style={{ width: 150 }} className={'form-control'} onChange={(e) => {
                                                //filter based on coupon
                                                const packageID = Number(e.target.value)
                                                if (Number(packageID) === 0) {
                                                    //reload to fetch new data
                                                    window.location.reload()
                                                } else {
                                                    //filter with coupon code
                                                    setDisplayProgramList(filteredProgramList2.filter((p) => p?.package?.id === packageID))
                                                }
                                            }}>
                                                <option value={0}>All Packages</option>
                                                {packages.map((p, i) => <option key={i}
                                                    value={p.id}>{p.title}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <select style={{ width: 150 }} className={'form-control'} onChange={(e) => {
                                                //filter based on coupon
                                                const couponID = Number(e.target.value)
                                                if (Number(couponID) === 0) {
                                                    //reload to fetch new data
                                                    window.location.reload()
                                                } else {
                                                    //filter with coupon code
                                                    setDisplayProgramList(filteredProgramList2.filter((p) => p?.coupon?.id === couponID))
                                                }
                                            }}>
                                                <option value={0}>All Coupon</option>
                                                {coupons.map((c, i) => <option key={i}
                                                    value={c.id}>{c.code} [{c.value}]</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <select className={'form-control'} onChange={(e) => {
                                                //filter based on status
                                                if (Number(e.target.value) === 1) {
                                                    const __activeProgramFilter = filteredProgramList2.filter(r => r.teacherId !== null)
                                                    setDisplayProgramList(__activeProgramFilter)

                                                } else if (Number(e.target.value) === 2) {
                                                    const __activeProgramFilter = filteredProgramList2.filter(r => r.teacherId === null)
                                                    setDisplayProgramList(__activeProgramFilter)
                                                } else {
                                                    window.location.reload()
                                                }
                                            }}>
                                                <option value={0}>All Filter(s)</option>
                                                <option value={1}>With Teacher</option>
                                                <option value={2}>With No Teacher</option>
                                            </select>
                                        </div>
                                        <div style={{ marginRight: 10 }}>
                                            <button onClick={handleActionAssignClick}>
                                                <i className="mdi mdi-clipboard-account font-size-20"></i>
                                            </button>
                                        </div>
                                        <div style={{ marginRight: 10 }}>
                                            <button onClick={handleTimeClick}>
                                                <i className="mdi mdi-clock font-size-20"></i>
                                            </button>
                                        </div>
                                        <div style={{ marginRight: 10 }}>
                                            <button onClick={() => {
                                                if (confirm("You're about to send a class reminder to parent, will you like to proceed ?")) {
                                                    processReminder();
                                                }
                                            }}>
                                                <i className="mdi mdi-bell font-size-20"></i>
                                            </button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="12" style={{ overflow: 'scroll', width: '98%' }}>
                                    {loading ? (
                                        <div className="text-center mt-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : displayProgramList.length === 0 ? (
                                        <div className="text-center mt-5">
                                            <h3>No data available</h3>
                                        </div>
                                    ) : (
                                        <table className="table align-middle table-hover">
                                            <thead>
                                                <tr>
                                                    <th>#{multiIDs.length || ""}</th>
                                                    <th>P.Name</th>
                                                    <th>C.Name</th>
                                                    <th>Phone</th>
                                                    <th>Email</th>
                                                    <th>Age</th>
                                                    <th>Gender</th>
                                                    <th>T.Name</th>
                                                    <th>T.Group</th>
                                                    <th>P.Time</th>
                                                    <th>Time(WAT)</th>
                                                    <th>Day</th>
                                                    <th>Status</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {displayProgramList.map((program, index) => (
                                                    <tr key={index}
                                                        style={{ backgroundColor: (program.isPaid) ? '#f1fdf4' : '#fff' }}>
                                                        <td>
                                                            <div style={{ width: 50 }} className={'align-middle'}>
                                                                <input style={{ marginRight: 5 }} type={'checkbox'}
                                                                    onChange={(d) => {
                                                                        //multiple selection push to array
                                                                        if (multiIDs.includes(program.id)) {
                                                                            //remove from array
                                                                            setMultiIDs(multiIDs.filter(i => i !== program.id))
                                                                            toast.error(program?.child?.firstName + " removed is been from the action list.")
                                                                        } else {
                                                                            setMultiIDs([...multiIDs, program.id])
                                                                            toast.warn(program?.child?.firstName + " has been added to action list.")
                                                                        }
                                                                    }} />
                                                                {index + 1}
                                                            </div>
                                                        </td>
                                                        <td>{program?.child?.parent?.firstName + " " + program?.child?.parent?.lastName}</td>
                                                        <td>{program?.child?.firstName + " " + program?.child?.lastName}
                                                            <br />
                                                            [{program?.child?.parent?.country}]
                                                        </td>
                                                        <td>{program?.child?.parent?.phone}</td>
                                                        <td>{program?.child?.parent?.email}</td>
                                                        <td>{program?.child?.age}</td>
                                                        <td>{program?.child?.gender}</td>
                                                        <td>{program?.promo_teacher?.firstName}</td>
                                                        <td>{program.timeGroup.title}</td>
                                                        <td>{parentTimeZone(program.timeGroup.times, program?.timeGroupIndex, program?.child?.parent?.timezone)}</td>
                                                        <td>{FormatDate(program.timeGroup.times, program.timeGroupIndex)}</td>
                                                        <td>{program?.day ? convertTimegroupToParentTimezone(renderDate(program?.day), program?.child?.parent?.timezone) : ""}</td>
                                                        <td>
                                                            <div style={{ width: 50 }}>
                                                                {program.isPaid ? (
                                                                    <a rel={'noreferrer'}
                                                                        href={'#' + program.trxId}
                                                                        onClick={(e) => {
                                                                            e.preventDefault()
                                                                            handleToggleIsPaid(program).then(r => null)
                                                                        }}
                                                                    >Paid</a>
                                                                ) : (
                                                                    <a rel={'noreferrer'} href={'#'} onClick={(e) => {
                                                                        e.preventDefault()
                                                                        handleToggleIsPaid(program).then(r => null)
                                                                    }}
                                                                        disabled={program.isPaid}>
                                                                        Unpaid
                                                                    </a>
                                                                )}
                                                                {!program.isPaid && (
                                                                    <Link
                                                                        className="ms-1 text-primary"
                                                                        to="#"
                                                                        onClick={(e) => e.preventDefault()}
                                                                    ></Link>
                                                                )}
                                                                <br />
                                                                <small style={{ fontSize: 10, backgroundColor: "#e3e3e3", padding: 2, display: program?.promo_coupon?.code ? "block" : "none" }}>{program?.promo_coupon?.code}</small>
                                                                <small style={{ fontSize: 10 }}><Moment format={'DD-MM-YY'} date={program?.createdAt} /></small>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <Link
                                                                className="text-danger"
                                                                to="#"
                                                                id="edit"
                                                                onClick={() => handleProgramClick(program)}>
                                                                <i className="mdi mdi-clock-outline font-size-12"></i>
                                                            </Link>

                                                            <Link
                                                                className="text-primary"
                                                                to="#"
                                                                id="assign"
                                                                onClick={() => handleAssignClick(program)}>
                                                                <i className="mdi mdi-clipboard-account font-size-12"></i>
                                                            </Link>

                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                    <Modal isOpen={modal} toggle={() => setModal(!modal)}>
                                        <ModalHeader toggle={() => setModal(!modal)}>
                                            {"Time Group"}
                                        </ModalHeader>
                                        <ModalBody>
                                            <Row>
                                                <small className={'text-danger mb-3'}>Warning: This action will
                                                    alter {multiIDs.length} children. confirm again !</small>
                                                <Col xs={12}>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="mb-6">
                                                                <select
                                                                    className={'form-control'}
                                                                    value={selectedTimeGroup}
                                                                    onChange={(e) => handleTimeGroupSelection(e.target.value)}
                                                                >
                                                                    <option value="">{selectedTimeGroup ? selectedTimeGroup : "Select Time Group"}</option>
                                                                    {convertTimeGroup(timeGroup)?.length > 0 &&
                                                                        convertTimeGroup(timeGroup)?.map((time) => (
                                                                            <option key={time?.value}
                                                                                value={JSON.stringify(time)}>
                                                                                {time.name}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        {selectedTimeGroup && (
                                                            <div className="row">
                                                                {splitTimeSlots(selectedTimeGroup).map((timeSlot, index) => (
                                                                    <div key={timeSlot} className="col-md-6 mt-3">
                                                                        <div className="font-medium min-w-[120px]">{timeSlot}</div>
                                                                        <input
                                                                            type="date"
                                                                            className="form-control"
                                                                            value={selectedDates[timeSlot] || ''}
                                                                            onChange={(e) => handleDateSelection(timeSlot, e.target.value)}
                                                                        />
                                                                        {selectedDates[timeSlot] && (
                                                                            <div className="text-sm text-gray-600">
                                                                                {new Date(selectedDates[timeSlot]).toLocaleDateString('en-US', {
                                                                                    month: 'long',
                                                                                    day: 'numeric'
                                                                                })}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <div className="text-end mt-4">
                                                        <button
                                                            onClick={handleProgramClickSubmit}
                                                            className="btn btn-primary save-user">
                                                            Update Program Data
                                                        </button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </ModalBody>
                                    </Modal>

                                    <Modal isOpen={assignModal} toggle={() => setAssignModal(!assignModal)}>
                                        <ModalHeader toggle={() => setAssignModal(!assignModal)}>Assign
                                            Teacher</ModalHeader>
                                        <ModalBody>
                                            <Form onSubmit={(e) => {
                                                e.preventDefault();
                                                handleTeacherAssignClick().then(r => null);
                                            }}>
                                                <Row>
                                                    <Col xs={12}>
                                                        <div className="row">
                                                            <div className="col-md-12 mb-3">
                                                                <div className="mb-6">
                                                                    <Input
                                                                        name="teacherId"
                                                                        type="select"
                                                                        onChange={handleTeacherChange}>
                                                                        <option value="">Select teacher</option>
                                                                        {teachers?.length > 0 &&
                                                                            teachers?.map((teacher) => (
                                                                                <option key={teacher?.id}
                                                                                    value={teacher?.id}>
                                                                                    {teacher.firstName} {teacher.lastName}
                                                                                </option>
                                                                            ))}
                                                                    </Input>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <br />
                                                        <div className="text-end">
                                                            <button
                                                                type="submit"
                                                                className="btn btn-primary save-user">
                                                                Assign New Teacher
                                                            </button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </ModalBody>
                                    </Modal>

                                    <Modal isOpen={timeModal} toggle={() => setTimeModal(!timeModal)}>
                                        <ModalHeader toggle={() => setTimeModal(!timeModal)}> Time Group (Group Action)
                                        </ModalHeader>
                                        <ModalBody>
                                            <Row>
                                                <small className={'text-danger mb-3'}>Warning: This action will
                                                    alter {multiIDs.length} children. confirm again !</small>
                                                <Col xs={12}>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="mb-6">
                                                                <select
                                                                    className={'form-control'}
                                                                    value={selectedTimeGroup}
                                                                    onChange={(e) => handleTimeGroupSelection(e.target.value)}
                                                                >
                                                                    <option value="">{selectedTimeGroup ? selectedTimeGroup : "Select Time Group"}</option>
                                                                    {convertTimeGroup(timeGroup)?.length > 0 &&
                                                                        convertTimeGroup(timeGroup)?.map((time) => (
                                                                            <option key={time?.value}
                                                                                value={JSON.stringify(time)}>
                                                                                {time.name}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        {selectedTimeGroup && (
                                                            <div className="row">
                                                                {splitTimeSlots(selectedTimeGroup).map((timeSlot, index) => (
                                                                    <div key={timeSlot} className="col-md-6 mt-3">
                                                                        <div className="font-medium min-w-[120px]">{timeSlot}</div>
                                                                        <input
                                                                            type="date"
                                                                            className="form-control"
                                                                            value={selectedDates[timeSlot] || ''}
                                                                            onChange={(e) => handleDateSelection(timeSlot, e.target.value)}
                                                                        />
                                                                        {selectedDates[timeSlot] && (
                                                                            <div className="text-sm text-gray-600">
                                                                                {new Date(selectedDates[timeSlot]).toLocaleDateString('en-US', {
                                                                                    month: 'long',
                                                                                    day: 'numeric'
                                                                                })}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <br />
                                                    <div className="text-end">
                                                        <button
                                                             onClick={()=>processBatchOperations(true)}
                                                            className="btn btn-primary save-user">
                                                            Update
                                                        </button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </ModalBody>
                                    </Modal>

                                    <Modal isOpen={assignActionModal}
                                        toggle={() => setAssignActionModal(!assignActionModal)}>
                                        <ModalHeader toggle={() => setAssignActionModal(!assignActionModal)}>
                                            Assign Teacher (Group Action)</ModalHeader>
                                        <ModalBody>
                                            <Row>
                                                <small className={'text-danger mb-3'}>Warning: This action will
                                                    alter {multiIDs.length} children. confirm again !</small>
                                                <Col xs={12}>
                                                    <div className="row">
                                                        <div className="col-md-12 mb-3">
                                                            <div className="mb-6">
                                                                <select
                                                                    className={'form-control'}
                                                                    onChange={e => setMultiTargetIDs({
                                                                        ...multiTargetIDs,
                                                                        teacherId: e.target.value
                                                                    })}>
                                                                    <option value="">Select Teacher</option>
                                                                    {teachers?.length > 0 &&
                                                                        teachers?.map((teacher) => (
                                                                            <option key={teacher?.id}
                                                                                value={teacher?.id}>
                                                                                {teacher.firstName} {teacher.lastName}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <br />
                                                    <div className="text-end">
                                                        <button
                                                            onClick={() => processBatchOperations(false)}
                                                            type="submit"
                                                            className="btn btn-primary save-user">
                                                            Process Batch Data
                                                        </button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </ModalBody>
                                    </Modal>

                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withAuth(ManageProgram);
