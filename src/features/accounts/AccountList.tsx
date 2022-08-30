import React, { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import styles from './AccountList.module.css';
import { selectAllAccounts, selectSelectedAccountId, setAccount, UserAccount } from './accountsSlice';

const Account: React.FC<{uid: string | null, account: UserAccount, selected: boolean}> = ({uid, account, selected}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSelect = useCallback(() => {
    dispatch(setAccount(uid));
    navigate("/posts")
  }, [dispatch, navigate, uid]);

  return (
    <div
      className={selected ? styles.account + " " + styles.selectedAccount : styles.account}
      onClick={onSelect}
    >
      <div className={styles.accountProfilePicture}>
        <img src={process.env.PUBLIC_URL + "/missing-pfp.png"} alt="" />
      </div>
      <div className={styles.accountText}>
        <div className={styles.accountName}>
          {account.username}
        </div>
        <div className={styles.accountSite}>
          {account.site}
        </div>
      </div>
    </div>
  );
}

export const AccountList = () => {
  const accounts = useAppSelector(selectAllAccounts);
  const displayAccounts: [string | null, UserAccount][] = [
    [null, {
      site: "https://e621.net",
      username: "<logged out>",
      apiKey: "",
    }],
    ...Object.entries(accounts)
  ]
  const selectedUid = useAppSelector(selectSelectedAccountId);

  return (
    <div className={styles.accountListContainer}>
      <div className={styles.accountList}>
        {displayAccounts.map(([uid, account], index) => (
          <Account key={index} uid={uid} account={account} selected={uid === selectedUid} />
        ))}
        <Link className={styles.account} to="/accounts/add">
          Add account
        </Link>
      </div>
    </div>
  );
}