/* eslint-disable react/prop-types */
const CustomBreandcrumb = ({ titles = [] }) => {
  return (
    <nav style={{ alignItems: "center" }} aria-label="breadcrumb">
      <ol
        className="breadcrumb m-0 p-0"
        style={{ backgroundColor: "transparent" }}
      >
        {titles.map((item, index) => (
          <li className="breadcrumb-item" key={index}>
            <span
              className="font-weight-semi-bold"
              style={{
                fontSize: "25px",
                alignContent: "center",
                color:
                  index === titles.length - 1
                    ? "var(--Azul-petroleo)"
                    : "var(--Gris-oscuro)",
              }}
            >
              {item}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default CustomBreandcrumb;
