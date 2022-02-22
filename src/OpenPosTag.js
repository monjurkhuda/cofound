import React from "react";
import "./OpenPosTag.css";

function OpenPosTag(props) {
  const openPos = props.openPos;

  return <div className="open__pos__tag">{openPos}</div>;
}

export default OpenPosTag;
