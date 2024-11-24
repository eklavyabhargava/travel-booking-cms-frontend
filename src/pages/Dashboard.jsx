import { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import { deletePackage, fetchAllPackages } from "../api/packageService";
import { fetchAllBookings } from "../api/bookingService";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { FaUsers } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";
import { FaTrashCan } from "react-icons/fa6";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/Modal";
import ConfirmationModal from "../component/ConfirmationModal";
import TravelPackageModal from "../component/TravelPackageModal";
import BookingModal from "../component/BookingModal";

export const formatDate = (isoDate) => {
  const date = new Date(isoDate);

  // Options for formatting the date
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const Dashboard = () => {
  const [currTab, setCurrTab] = useState("package");
  const [loading, setLoading] = useState(false);
  const [travelPackages, setTravelPackages] = useState([]);
  const [Bookings, setBookings] = useState([]);
  const [newTravelPackage, setNewPackage] = useState({
    id: "",
    title: "",
    description: "",
    destination: "",
    price: 0,
    availableDates: [Date.now()],
    maxTravelers: 0,
  });
  const [updatedBooking, setUpdatedBooking] = useState({});
  const [showModal, setShowModal] = useState({
    modalName: "",
    packageId: "",
    bookingId: "",
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    showModal: false,
    packageId: "",
    isLoading: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    destination: "",
    priceRange: "",
    date: "",
  });

  // handle search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // handle filteration
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((curr) => ({ ...curr, [name]: value }));
  };

  const filteredPackages = travelPackages.filter((pkg) => {
    // Search query filter
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchQuery.toLowerCase());

    // Destination filter
    const matchesDestination =
      !filters.destination || pkg.destination === filters.destination;

    // Price range filter
    const matchesPrice =
      !filters.priceRange ||
      (filters.priceRange === "low" && pkg.price < 10000) ||
      (filters.priceRange === "medium" &&
        pkg.price >= 10000 &&
        pkg.price <= 50000) ||
      (filters.priceRange === "high" && pkg.price > 50000);

    // Date filter
    const matchesDate =
      !filters.date ||
      pkg.availableDates.some(
        (date) => formatDate(date) === formatDate(filters.date)
      );

    return matchesSearch && matchesDestination && matchesPrice && matchesDate;
  });

  // fetch all travel packages
  const getTravelPackages = async () => {
    setLoading(true);
    const response = await fetchAllPackages();
    if (response.status === 200) {
      setTravelPackages(response.data.packages);
    }
    setLoading(false);
  };

  // fetch all bookings
  const getBookings = async () => {
    setLoading(true);
    const response = await fetchAllBookings();
    if (response.status === 200) {
      setBookings(response.data.bookings);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (currTab === "package" && travelPackages.length === 0) {
      getTravelPackages();
    } else if (currTab === "booking" && Bookings.length === 0) {
      getBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currTab]);

  // Function to delete package
  const handleDeletePackage = async () => {
    setDeleteConfirmation((curr) => ({ ...curr, isLoading: true }));
    const response = await deletePackage(deleteConfirmation.packageId);
    if (response.status === 200) {
      setTravelPackages((curr) => {
        const updatedPackage = curr.filter(
          (travel) => travel._id !== deleteConfirmation.packageId
        );
        return updatedPackage;
      });
    }
    setDeleteConfirmation((curr) => ({
      ...curr,
      showModal: false,
      isLoading: false,
    }));
  };

  // Handle on cancel delete confirmation
  const handlePackageDeletion = (event) => {
    if (event === "cancel") {
      setDeleteConfirmation({ showModal: false, packageId: "" });
      return;
    }

    if (event === "confirmed") {
      handleDeletePackage();
      setDeleteConfirmation({ showModal: false, packageId: "" });
    }
  };

  // handle pencil icon click
  const handlePencilClick = ({
    modalName = "",
    packageId = "",
    bookingId = "",
  }) => {
    if (packageId.length) {
      setNewPackage(
        travelPackages.find((travelPkg) => travelPkg._id === packageId)
      );
    } else {
      setNewPackage({});
    }
    if (bookingId.length) {
      const selectedBooking = Bookings.find(
        (booking) => booking._id === bookingId
      );
      if (selectedBooking) {
        setUpdatedBooking({
          ...selectedBooking,
          selectedPackage: selectedBooking.selectedPackage._id || "",
        });
      }
    }
    setShowModal({ modalName, packageId, bookingId });
  };

  // save new package
  const addNewPackage = (action, newPackage) => {
    if (newPackage) {
      if (action === "added") {
        setTravelPackages((curr) => {
          return [...curr, newPackage];
        });
      } else if (action === "updated") {
        setTravelPackages((curr) => {
          const updatedData = curr.map((pkg) => {
            if (pkg._id === newPackage._id) {
              pkg = newPackage;
            }
            return pkg;
          });
          return updatedData;
        });
      }
    }
    handlePencilClick({});
  };

  // Update booking data
  const updateBookings = (action, newBooking) => {
    if (action === "updated") {
      setBookings((curr) => {
        const updatedData = curr.map((booking) => {
          if (booking._id === newBooking._id) {
            booking = newBooking;
          }
          return booking;
        });
        return updatedData;
      });
    }
    handlePencilClick({});
  };

  return (
    <div>
      <Nav justify variant="tabs" defaultActiveKey="link-0">
        <Nav.Item onClick={() => setCurrTab("package")}>
          <Nav.Link eventKey="link-0">Travel Packages</Nav.Link>
        </Nav.Item>
        <Nav.Item onClick={() => setCurrTab("booking")}>
          <Nav.Link eventKey="link-1">Bookings</Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="px-3 d-flex flex-column row-gap-2 py-2">
        <div className="d-flex justify-content-end">
          {currTab === "package" && (
            <Button
              variant="dark"
              onClick={() => handlePencilClick({ modalName: "packageModal" })}
            >
              Add Travel Package
            </Button>
          )}
        </div>
        {currTab === "package" && (
          <div className="d-flex justify-content-between align-items-center mb-3">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by title or destination"
              value={searchQuery}
              onChange={handleSearchChange}
              className="form-control w-50"
            />

            <div className="d-flex gap-3">
              {/* Destination Filter */}
              <select
                name="destination"
                value={filters.destination}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">All Destinations</option>
                {Array.from(
                  new Set(travelPackages.map((pkg) => pkg.destination))
                ).map((destination) => (
                  <option key={destination} value={destination}>
                    {destination}
                  </option>
                ))}
              </select>

              {/* Price Range Filter */}
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">All Prices</option>
                <option value="low">Below ₹10,000</option>
                <option value="medium">₹10,000 - ₹50,000</option>
                <option value="high">Above ₹50,000</option>
              </select>

              {/* Date Filter */}
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>
          </div>
        )}

        {currTab === "package" ? (
          <Table className="mt-2">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Description</Th>
                <Th>Destination</Th>
                <Th>Price</Th>
                <Th>Available Dates</Th>
                <Th>Max Travelers</Th>
                <Th>Action Buttons</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!loading &&
                filteredPackages.map((travel) => (
                  <Tr key={travel._id}>
                    <Td>{travel.title}</Td>
                    <Td>{travel.description}</Td>
                    <Td>{travel.destination}</Td>
                    <Td>&#x20B9; {travel.price}</Td>
                    <Td>
                      <ul>
                        {travel.availableDates.map((date) => (
                          <li key={date}>{formatDate(date)}</li>
                        ))}
                      </ul>
                    </Td>
                    <Td className="d-flex align-items-center ">
                      <FaUsers /> {travel.maxTravelers}
                    </Td>
                    <Td>
                      <button
                        style={{
                          border: "none",
                          background: "transparent",
                          padding: "4px",
                        }}
                        onClick={() =>
                          handlePencilClick({
                            modalName: "packageModal",
                            packageId: travel._id,
                          })
                        }
                      >
                        <RiPencilFill />
                      </button>
                      <button
                        style={{
                          border: "none",
                          background: "transparent",
                          padding: "4px",
                        }}
                        onClick={() =>
                          setDeleteConfirmation({
                            showModal: true,
                            packageId: travel._id,
                          })
                        }
                      >
                        <FaTrashCan />
                      </button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        ) : (
          <Table className="mt-2">
            <Thead>
              <Tr>
                <Th>Customer Name</Th>
                <Th>Contact Info</Th>
                <Th>Selected Package</Th>
                <Th>No. of Travellers</Th>
                <Th>Booking Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!loading &&
                Bookings.map((booking) => (
                  <Tr key={booking._id}>
                    <Td>{booking.customerName}</Td>
                    <Td>{booking.contactInfo}</Td>
                    <Td>
                      <span className="fw-medium">Title:</span>{" "}
                      {booking.selectedPackage?.title}
                      <br />
                      <span className="fw-medium">Location:</span>{" "}
                      {booking.selectedPackage?.destination}
                    </Td>
                    <Td className="d-flex align-items-center ">
                      <FaUsers /> {booking.numberOfTravelers}
                    </Td>
                    <Td>{booking.bookingStatus}</Td>
                    <Td>
                      <button
                        style={{
                          border: "none",
                          background: "transparent",
                          padding: "4px",
                        }}
                        onClick={() =>
                          handlePencilClick({
                            modalName: "bookingModal",
                            bookingId: booking._id,
                          })
                        }
                      >
                        <RiPencilFill />
                      </button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        )}
      </div>
      <Modal
        size="md"
        show={deleteConfirmation.showModal}
        onHide={() => handlePackageDeletion("cancel")}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <ConfirmationModal
          title="Delete Package"
          onCancel={() => handlePackageDeletion("cancel")}
          onConfirm={() => handleDeletePackage("confirmed")}
          isLoading={deleteConfirmation.isLoading}
        />
      </Modal>
      <Modal
        size="md"
        show={showModal.modalName === "packageModal"}
        onHide={() => handlePencilClick({})}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
      >
        <TravelPackageModal
          newPackage={newTravelPackage}
          setNewPackage={setNewPackage}
          onSubmit={addNewPackage}
          onCancel={() => handlePencilClick({})}
          isPackageUpdate={showModal.packageId.length ? true : false}
        />
      </Modal>
      <Modal
        size="md"
        show={showModal.modalName === "bookingModal"}
        onHide={() => handlePencilClick({})}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
      >
        <BookingModal
          newBooking={updatedBooking}
          setNewBooking={setUpdatedBooking}
          onCancel={() => handlePencilClick({})}
          onSubmit={updateBookings}
          travelPackages={travelPackages}
          isBookingUpdate={showModal.bookingId.length ? true : false}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
