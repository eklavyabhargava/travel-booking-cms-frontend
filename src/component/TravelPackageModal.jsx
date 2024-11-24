import { useState } from "react";
import { createPackage, updatePackage } from "../api/packageService";
import { IoMdClose } from "react-icons/io";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/esm/Spinner";
import { formatDate } from "../pages/Dashboard";

const TravelPackageModal = ({
  newPackage,
  setNewPackage,
  onSubmit,
  onCancel,
  isPackageUpdate = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle form validation
  const handleValidation = () => {
    const newErrors = {};

    if (!newPackage.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!newPackage.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (!newPackage.destination.trim()) {
      newErrors.destination = "Destination is required.";
    }

    if (!newPackage.price || newPackage.price <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    if (!newPackage.maxTravelers || newPackage.maxTravelers <= 0) {
      newErrors.maxTravelers = "Maximum travelers must be greater than 0.";
    }

    if (!newPackage.availableDates || newPackage.availableDates.length === 0) {
      newErrors.availableDates = "At least one available date is required.";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Function to add travel package
  const addTravelPackage = async () => {
    if (!handleValidation()) return; // Stop submission if validation fails

    setLoading(true);
    const response = await createPackage(newPackage);
    setLoading(false);

    if (response.status === 201) {
      onSubmit("added", response.data.savedPackage);
    } else {
      onSubmit(null);
    }
    setNewPackage({});
  };

  const updateTravelPackage = async () => {
    if (!handleValidation()) return; // Stop submission if validation fails

    setLoading(true);
    const { _id, ...restData } = newPackage;
    const response = await updatePackage(_id, restData);
    setLoading(false);

    if (response.status === 200) {
      onSubmit("updated", response.data.updatedPackage);
    } else {
      onSubmit();
    }
    setNewPackage({});
  };

  // handle form value change
  const handleChange = ({ target: { name, value } }) => {
    if (name === "availableDates") {
      setNewPackage((curr) => {
        const currentDates = curr.availableDates || [];
        return {
          ...curr,
          availableDates: currentDates.includes(value)
            ? currentDates.filter((date) => date !== value)
            : [...currentDates, value],
        };
      });
    } else {
      setNewPackage((curr) => ({ ...curr, [name]: value }));
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };

  return (
    <div className="d-flex w-100 flex-column align-items-center">
      <div className="fs-4 w-100 fw-semibold border-bottom p-3 d-flex flex-row justify-content-between">
        <div></div>
        <p>{isPackageUpdate ? "Update" : "Add"} Travel Package</p>
        <div style={{ cursor: "pointer" }} onClick={() => onCancel()}>
          <IoMdClose />
        </div>
      </div>
      <div className="w-75 mx-auto py-2">
        <Form onSubmit={(e) => e.preventDefault()}>
          {formFields.map((field) => (
            <div className="mb-3" key={field.name}>
              <Form.Label htmlFor={field.name}>{field.title}</Form.Label>
              {field.name === "availableDates" && field.isMulti ? (
                <>
                  <Form.Control
                    type="date"
                    name={field.name}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Select multiple dates by adding one at a time.
                  </Form.Text>
                  {errors.availableDates && (
                    <Form.Text className="text-danger">
                      {errors.availableDates}
                    </Form.Text>
                  )}
                  {newPackage.availableDates && (
                    <div className="mt-2">
                      <p>Selected Dates:</p>
                      <ul>
                        {newPackage.availableDates.map((date, index) => (
                          <li key={index}>
                            {formatDate(date)}{" "}
                            <span
                              style={{
                                cursor: "pointer",
                                color: "red",
                                marginLeft: "5px",
                              }}
                              onClick={() =>
                                setNewPackage((curr) => ({
                                  ...curr,
                                  availableDates: curr.availableDates.filter(
                                    (d) => d !== date
                                  ),
                                }))
                              }
                            >
                              [Remove]
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <Form.Control
                  type={field.type}
                  as={field.type === "textarea" ? "textarea" : "input"}
                  name={field.name}
                  value={newPackage[field.name] || ""}
                  onChange={handleChange}
                  isInvalid={!!errors[field.name]}
                />
              )}
              <Form.Control.Feedback type="invalid">
                {errors[field.name]}
              </Form.Control.Feedback>
            </div>
          ))}
          <div className="d-flex flex-row justify-content-end p-2 column-gap-2">
            <Button
              disabled={loading}
              onClick={() => onCancel()}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={loading}
              variant="primary"
              onClick={isPackageUpdate ? updateTravelPackage : addTravelPackage}
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

const formFields = [
  {
    title: "Title",
    name: "title",
    type: "text",
  },
  {
    title: "Description",
    name: "description",
    type: "textarea",
  },
  {
    title: "Destination",
    name: "destination",
    type: "text",
  },
  {
    title: "Price",
    name: "price",
    type: "number",
  },
  {
    title: "Maximum Travelers",
    name: "maxTravelers",
    type: "number",
  },
  {
    title: "Available Dates",
    name: "availableDates",
    type: "date",
    isMulti: true,
  },
];

export default TravelPackageModal;
