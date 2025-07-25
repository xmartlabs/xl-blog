import React from 'react';
import PropTypes from 'prop-types';

import { CloseIcon } from '../icons';

import * as styles from './typeform.module.scss';

const TypeForm = ({ onClick }) => {
  return (
    <div className={styles.formContainer}>
      <button onClick={onClick} className={styles.closeForm}>
        <CloseIcon className={styles.closeFormIcon} />
      </button>
      <iframe
        src={process.env.GATSBY_FORM_URL}
        title="typeform"
        frameborder="0"
        className={styles.typeForm}
      ></iframe>
    </div>
  );
};

TypeForm.propTypes = {
  onCkick: PropTypes.func,
};

TypeForm.defaultProps = {
  onClick: () => {},
};

export { TypeForm };
