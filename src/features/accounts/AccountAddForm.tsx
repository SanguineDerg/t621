import React, { FormEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../app/hooks";
import { addAccount } from "./accountsSlice";
import styles from "./AccountAddForm.module.css";

const DEFAULT_SITE = "https://e621.net";

export const AccountAddForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [site, setSite] = useState("");
    const [username, setUsername] = useState("");
    const [apiKey, setApiKey] = useState("");
  
    const submit = useCallback((e: FormEvent) => {
      e.preventDefault();
      dispatch(addAccount({
        site: site === "" ? DEFAULT_SITE : site,
        username: username,
        apiKey: apiKey,
      }));
      navigate("../../posts");
    }, [dispatch, navigate, site, username, apiKey]);
  
    return (
      <div className={styles.accountAddFormContainer}>
        <form onSubmit={submit} className={styles.addAccountForm}>
          <input
            className={styles.addAccountFormField}
            value={site}
            onChange={e => setSite(e.target.value)}
            type="text"
            placeholder={DEFAULT_SITE}
            onSubmit={submit}
          />
          <input
            className={styles.addAccountFormField}
            value={username}
            onChange={e => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            onSubmit={submit}
          />
          <input
            className={styles.addAccountFormField}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            type="password"
            placeholder="API Key"
            onSubmit={submit}
          />
          <button type="submit">Add account</button>
        </form>
      </div>
    );
  }