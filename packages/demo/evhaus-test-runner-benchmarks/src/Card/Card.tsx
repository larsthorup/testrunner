import clsx from "clsx";
import React from "react";
import styles from "./Card.module.css.js";

type PropsType = {
  className?: string | null;
  children?: React.ReactNode;
};

const Card = ({ className, children }: PropsType) => (
  <div className={clsx(styles.main, className)}>{children}</div>
);

export default Card;
