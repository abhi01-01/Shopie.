import React from "react";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from "react-icons/fa";
import "./AlertTemplate.css";

const iconByType = {
  success: <FaCheckCircle />,
  error: <FaExclamationTriangle />,
  info: <FaInfoCircle />,
};

const AlertTemplate = ({ message, options, close }) => {
  const type = options.type || "info";

  return (
    <div className={`appAlert appAlert--${type}`}>
      <div className="appAlert__icon">{iconByType[type] || iconByType.info}</div>
      <div className="appAlert__body">
        <div className="appAlert__title">{type}</div>
        <div className="appAlert__message">{message}</div>
      </div>
      <button
        type="button"
        className="appAlert__close"
        onClick={close}
        aria-label="Dismiss notification"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default AlertTemplate;
