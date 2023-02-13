import React from "react"

import { StarIcon } from "../icons/star-icon";
import { PolygonIcon } from "../icons/polygon-icon";
import { classnames } from "../../helpers";

import PropTypes from "prop-types";

import * as styles from "./home-banner.module.scss";

const HomeBanner = ({ openMenu }) => (
  <div className={styles.containerTitleHome}>
    <h1 className="text__heading__one__big__black">Xmartlabs Blog</h1>
    <div className={styles.textContainer}>
      <h2 className="text__heading__two__big__black">
        <StarIcon className={styles.iconStar} />
        Design. Engineering. Lessons learned on our journey
      </h2>
      <div className={classnames(styles.polygonContainer, { [styles.openMenu]: openMenu })}>
        <PolygonIcon className={styles.iconPolygonOne} />
        <PolygonIcon className={styles.iconPolygonTwo} />
      </div>
    </div>
  </div>
);

export { HomeBanner }; 

HomeBanner.propTypes = {
  openMenu: PropTypes.bool,
};

HomeBanner.defaultProps = {
  openMenu: false,
};
