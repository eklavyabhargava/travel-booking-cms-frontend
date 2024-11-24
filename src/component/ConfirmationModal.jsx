import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/Spinner";

const ConfirmationModal = ({ title, onConfirm, onCancel, isLoading }) => {
  return (
    <div className="d-flex text-center flex-column">
      <p className="py-3 fw-semibold fs-5 border-bottom">{title}</p>
      <p className="fw-medium">Are you sure?</p>
      <div className="d-flex flex-row justify-content-end p-2 column-gap-2">
        <Button
          variant="secondary"
          disabled={isLoading}
          onClick={() => onCancel()}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          disabled={isLoading}
          onClick={() => onConfirm()}
        >
          {isLoading ? (
            <Spinner animation="border" variant="light" />
          ) : (
            "Confirm"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
