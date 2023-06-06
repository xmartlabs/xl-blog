import * as React from "react";
import { Link } from "gatsby";

import { classnames } from "../helpers/utils";

import * as styles from "./404.module.scss";

const NotFoundPage = () => {
  return (
    <main className={styles.page}>
      <title>Not found</title>
      <h1 className={classnames(styles.heading, "text__heading__one__black")}>Page not found</h1>
      <p className="text__paragraph__black">
        Sorry{" "}
        <span role="img" aria-label="Pensive emoji">
          😔
        </span>{" "}
        we couldn’t find what you were looking for.
        <br />
        {process.env.NODE_ENV === "development" ? (
          <>
            <br />
            Try creating a page in <code>src/pages/</code>.
            <br />
          </>
        ) : null}
        <br />
        <Link to="/">Go home</Link>.
      </p>
    </main>
  );
};

export default NotFoundPage;
