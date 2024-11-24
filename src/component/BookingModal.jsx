import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { IoMdClose } from "react-icons/io";
import { updateBooking } from "../api/bookingService";

const BookingModal = ({
  newBooking,
  setNewBooking,
  onSubmit,
  onCancel,
  isBookingUpdate,
  travelPackages = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation function
  const handleValidation = () => {
    const newErrors = {};

    if (!newBooking.customerName?.trim()) {
      newErrors.customerName = "Customer name is required.";
    }

    if (!newBooking.contactInfo?.trim()) {
      newErrors.contactInfo = "Contact information is required.";
    }

    if (!newBooking.selectedPackage) {
      newErrors.selectedPackage = "Please select a travel package.";
    }

    if (!newBooking.numberOfTravelers || newBooking.numberOfTravelers <= 0) {
      newErrors.numberOfTravelers =
        "Number of travelers must be greater than 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form field changes
  const handleChange = ({ target: { name, value } }) => {
    setNewBooking((curr) => ({ ...curr, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };

  // Function to update a booking
  const handleUpdateBooking = async () => {
    if (!handleValidation()) return;

    setLoading(true);
    const { _id, ...restData } = newBooking;
    const response = await updateBooking(_id, restData);
    setLoading(false);

    if (response.status === 200) {
      onSubmit("updated", response.data.updatedBooking);
    } else {
      onSubmit();
    }
  };

  const formFields = [
    {
      title: "Customer Name",
      name: "customerName",
      type: "text",
      required: true,
    },
    {
      title: "Contact Information",
      name: "contactInfo",
      type: "text",
      required: true,
    },
    {
      title: "Travel Package",
      name: "selectedPackage",
      type: "select",
      required: true,
      options: (travelPackages) =>
        travelPackages.map((pkg) => ({
          value: pkg._id,
          label: `${pkg.title} - ${pkg.destination}`,
        })),
    },
    {
      title: "Number of Travelers",
      name: "numberOfTravelers",
      type: "number",
      required: true,
    },
    {
      title: "Booking Status",
      name: "bookingStatus",
      type: "select",
      required: false,
      showWhen: (isBookingUpdate) => isBookingUpdate, // Only show for updates
      options: () => [
        { value: "Pending", label: "Pending" },
        { value: "Confirmed", label: "Confirmed" },
        { value: "Cancelled", label: "Cancelled" },
      ],
    },
  ];

  return (
    <div className="d-flex w-100 flex-column align-items-center">
      <div className="fs-4 w-100 fw-semibold border-bottom p-3 d-flex flex-row justify-content-between">
        <div></div>
        <p>Update Booking</p>
        <div style={{ cursor: "pointer" }} onClick={onCancel}>
          <IoMdClose />
        </div>
      </div>
      <div className="w-75 mx-auto py-2">
        <Form>
          {formFields.map((field) => {
            if (field.showWhen && !field.showWhen(isBookingUpdate)) {
              return null;
            }

            return (
              <div className="mb-3" key={field.name}>
                <Form.Label htmlFor={field.name}>{field.title}</Form.Label>
                {field.type === "select" ? (
                  <Form.Select
                    name={field.name}
                    value={newBooking[field.name]._id || ""}
                    onChange={handleChange}
                    isInvalid={!!errors[field.name]}
                  >
                    <option hidden value="">
                      Select an option
                    </option>
                    {field.options(travelPackages || []).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control
                    type={field.type}
                    name={field.name}
                    value={newBooking[field.name] || ""}
                    onChange={handleChange}
                    isInvalid={!!errors[field.name]}
                  />
                )}
                <Form.Control.Feedback type="invalid">
                  {errors[field.name]}
                </Form.Control.Feedback>
              </div>
            );
          })}

          <div className="d-flex flex-row justify-content-end p-2 column-gap-2">
            <Button disabled={loading} onClick={onCancel} variant="secondary">
              Cancel
            </Button>
            <Button
              type="button"
              disabled={loading}
              variant="primary"
              onClick={handleUpdateBooking}
            >
              {loading ? (
                <Spinner animation="border" variant="light" />
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default BookingModal;
