import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Post } from '../posts/Post';
import { selectAllPostsInOrder, loadPosts } from '../posts/postsSlice'
import styles from './Feed.module.css';
import { useQuery } from '../../helpers';
import { Search } from '../search/Search';
// import { AccountButton } from '../accounts/AccountButton';
import { selectSelectedAccountId } from '../accounts/accountsSlice';
import { PostOverlay } from '../posts/PostOverlay';

export const Feed = () => {
  const query = useQuery();
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectAllPostsInOrder);
  const currentUid = useAppSelector(selectSelectedAccountId);

  useEffect(() => {
    dispatch(loadPosts(query));
  }, [dispatch, query, currentUid]);

  return (
    <div className={styles.feedContainer} >
      <div className={styles.feedOverlay}>
        <PostOverlay />
      </div>
      <div className={styles.feedNavbarContainer}>
        <div className={styles.feedNavbarPosition}>
          <div className={styles.feedNavbar}>
            {/* <AccountButton /> */}
          </div>
        </div>
      </div>
      <main className={styles.feedPostsContainer} >
        <div className={styles.feedPosts}>
          <div className={styles.searchContainer}>
            <Search />
          </div>
          {posts.map((post) => (
            <Post post={post} key={post.id} />
          ))}
        </div>
      </main>
    </div>
  );
}