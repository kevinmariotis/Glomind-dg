/* eslint-disable react/prop-types */
import { useContext } from "react";
import SpamError from "../SpamError";
import { AuthContext } from "../../AuthContext";

const Fields = ({ fieldsList, handleChange, values, errors = [] }) => {
  const { temaActual } = useContext(AuthContext);

  const inputs = ["date_time"];
  const selects = ["array_values", "array"];
  console.log(fieldsList);
  return (
    <>
      {Object.keys(fieldsList)?.map((key, index) => (
        <>
          {inputs.includes(fieldsList[key]?.tipo) ? (
            <div className="form-group" key={index}>
              <label className="label-text">
                {fieldsList[key]?.nombre ?? ""}
              </label>
              <input
                onChange={handleChange}
                value={values[key] ?? ""}
                className="form-control form--control pl-3"
                type={
                  fieldsList[key]?.tipo === "date_time"
                    ? "datetime-local"
                    : "text"
                }
                name={key}
                maxLength="64"
                placeholder=""
              />
              {errors[key]?.length > 0 && <SpamError mensaje={errors[key]} />}
            </div>
          ) : selects.includes(fieldsList[key]?.tipo) ? (
            <div className="form-group">
              <label className="label-text">
                {" "}
                {fieldsList[key]?.nombre ?? ""}
              </label>
              <select
                onChange={handleChange}
                value={values[key] ?? ""}
                name={key}
                className={`form-control ${
                  temaActual == 1 ? "" : "select-dark"
                }`}
              >
                <option value="">-- Seleccione --</option>
                {fieldsList[key]?.valores?.map((item, index) => (
                  <option value={item.valor ?? item} key={index}>
                    {item.nombre ?? item}
                  </option>
                ))}
              </select>
              {errors[key]?.length > 0 && <SpamError mensaje={errors[key]} />}
            </div>
          ) : (
            <></>
          )}
        </>
      ))}
    </>
  );
};

export default Fields;
