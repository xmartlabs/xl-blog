import React, { useState } from "react";

import { CloseIcon } from "../icons";

import * as styles from "./typeform.module.scss";

const TypeForm = ({ onClick }) => {
  return (
    <div className={styles.formContainer}>
      <button onClick={onClick} className={styles.closeForm}><CloseIcon className={styles.closeFormIcon} /></button>
      <iframe
        src="https://form.typeform.com/to/c7G2RUWm?typeform-embed=popup-blank&typeform-source=blog.xmartlabs.com&typeform-medium=embed-sdk&embed-hide-footer=true&typeform-embed-id=rclfl" 
        frameborder="0"
        className={styles.typeForm}
      >
      </iframe>
    </div>
  );
}

export { TypeForm };
