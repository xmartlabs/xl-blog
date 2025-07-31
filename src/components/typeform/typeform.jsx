import React from "react";
import PropTypes from "prop-types";

import { CloseIcon } from "../icons";

const TypeForm = ({ onClick }) => {
  return (
    <div
      className="
        fixed z-10 top-0 left-0 w-full h-full flex flex-col items-end p-[1%_2%] bg-dark-three
        [@media(max-height:_768px)]:p-0"
      >
      <button
        onClick={onClick}
        className="
          w-[0%] h-[2%] mt-0 mr-4 mb-4 ml-4 cursor-pointer
          [@media(max-height:_768px)]:mt-[1%] [@media(max-height:_768px)]:absolute
          [@media(max-height:_768px)]:z-12 [@media(max-height:_768px)]:mr-[2%]
        "
      >
        <CloseIcon className="fill-neutral-100 h-[20px] [@media(max-height:_768px)]:fill-blue-one" />
      </button>
      <iframe
        src={process.env.GATSBY_FORM_URL}
        title="typeform"
        frameborder="0"
        className="
          h-[95%] w-full
          [@media(max-height:_768px)]:h-full
          [@media(max-height:_768px)]:absolute
          [@media(max-height:_768px)]:z-11
        "
      >
      </iframe>
    </div>
  );
}


TypeForm.propTypes = {
  onCkick: PropTypes.func
};

TypeForm.defaultProps = {
  onClick: () => {}

};


export { TypeForm };
