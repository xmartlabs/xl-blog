import * as React from "react";
import { Link } from "gatsby";

import { ErrorImage } from "../components/icons/"

import { classnames } from "../helpers/utils";

import * as styles from "./404.module.scss";

const NotFoundPage = () => {
  return (
    <main className={styles.page}>
     <a href="/"><ErrorImage className={styles.img} /></a>
      <div className={styles.subContainer}>
        <title>Not found</title>
        <h1 className={classnames(styles.heading, "text__heading__one__black")}>You've reached the land of lost URLs.</h1>
        <p className="text__paragraph__black">
          While we dust off the treasure map,<br /> why not explore some other hidden gems on our blog? 💎
        </p>
        <a className={classnames("text__paragraph__xlPink", styles.link)} href="/">Show me those golden insights</a>
      </div>
    </main>
  );
};

export default NotFoundPage;
