import React, { FormEvent, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useQuery } from '../../helpers';
import styles from './Search.module.css';

export const Search = () => {
  const query = useQuery();
  const navigate = useNavigate();

  const [tags, setTags] = useState<string>(query.get("tags") || "");

  const submit = useCallback((e: FormEvent) => {
    e.preventDefault();
    query.set("tags", tags);
    navigate({search: `?${query.toString()}`});
  }, [navigate, query, tags]);

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={submit} className={styles.searchForm}>
        <div className={styles.searchBoxContainer}>
          <input
            className={styles.searchBox}
            value={tags}
            onChange={e => setTags(e.target.value)}
            type="text"
            placeholder="Search"
          />
        </div>
      </form>
    </div>
  );
}