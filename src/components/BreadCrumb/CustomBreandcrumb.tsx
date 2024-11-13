import React from "react";

const CustomBreandcrumb = ({ titles = [] }) => {
  return (
    <div className="dashboard-heading mb-3 d-flex aling-items-center">
      {titles.map((item, index) => (
        <>
          {index > 0 && (
            <h3 className="fw-bold" style={{ alignContent: "center" }}>
              {">"}
            </h3>
          )}
          <h3
            className="fs-22 font-weight-semi-bold mx-2"
            style={{
              alignContent: "center",
              color:
                index === titles.length - 1
                  ? "var(--Azul-petroleo)"
                  : "var(--Gris-oscuro)",
            }}
          >
            {item}
          </h3>
        </>
      ))}
    </div>
  );
};

export default CustomBreandcrumb;
