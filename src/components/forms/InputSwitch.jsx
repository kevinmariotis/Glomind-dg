/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./InputSwitch.scss";

const InputSwitch = ({ onChange, checked = false }) => {
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    if (onChange) {
      onChange(toggle);
    }
  }, [toggle]);

  useEffect(() => {
    setToggle(checked);
  }, [checked]);

  return (
    <div className="switch" onClick={handleToggle}>
      {/* <input type="checkbox" /> */}
      <span className={`slider ${toggle && "slider-active"}`}></span>
    </div>
  );
};

export default InputSwitch;
