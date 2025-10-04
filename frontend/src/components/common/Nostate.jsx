import React from "react";

const Nostate = ({ text = "Записей не найдено" }) => {
  return <div className="text-center py-5 text-lg">{text}</div>;
};

export default Nostate;
