/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./Grafics.scss";

const GraficCircle = ({ value = "0.00", maxValue = 100 }) => {
  const [percentaje, setPercentaje] = useState("0");

  useEffect(() => {
    if (Number(value) > 0) {
      const _percentaje = (Number(value) * 100) / maxValue;
      setPercentaje(String(_percentaje));
    }
  }, [value]);

  return (
    <div className="circleGrafic">
      <div
        className="line"
        style={{
          background: `conic-gradient(var(--Lavander) ${percentaje}%, var(--Lavander) ${percentaje}%, var(--Lavander-100) ${percentaje}%)`,
        }}
      >
        <div className="external-section">
          <div className="internal-section">
            <div className="text">{value}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraficCircle;
