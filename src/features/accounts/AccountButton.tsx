import React from 'react'
import { Link } from 'react-router-dom';
import styles from './AccountButton.module.css';

export const AccountButton = () => {
  return (
    <Link to="/accounts"
      className={styles.accountContainer}
    >
      <div className={styles.accountProfilePicture}>
        <img src={process.env.PUBLIC_URL + "/missing-pfp.png"} alt="" />
      </div>
    </Link>
  );
}