import React from "react";
import { CloseIcon } from "../close-icon";

const NewsLetter = () => {
  const [close, setClose] = useState(false);

  return (
    <div>
      <CloseIcon />
      <div>
        <div>
          <img src="../../static/images/logo.svg" />
        </div>
        <div>
          <h3>Xmartlabs´ Newsletter</h3>
          <p>Subscribe to our newsletter and get updates on AI, Computer Vision as well as mobile and web development.</p>
        </div>
      </div>

    </div>
  )
  


}

export { NewsLetter }; 
