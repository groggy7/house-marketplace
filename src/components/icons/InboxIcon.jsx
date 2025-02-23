import PropTypes from "prop-types";

export const InboxIcon = ({ isActive }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{
      width: "32px",
      height: "32px",
      overflow: "visible",
      fill: isActive ? "#009a88" : "#c1c1c1",
    }}
    viewBox="0 0 24 24"
  >
    <path d="M0 0h24v24H0V0z" fill="none"></path>
    <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"></path>
  </svg>
);

InboxIcon.propTypes = {
  isActive: PropTypes.bool,
};

InboxIcon.defaultProps = {
  isActive: false,
};
