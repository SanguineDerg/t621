import React, { /* useCallback */ } from 'react'
import { PostType } from './postsType';
import styles from './PostActions.module.css';
import { /* useAppDispatch, */ useAppSelector } from '../../app/hooks';
import { selectCurrentSite } from '../accounts/accountsSlice';
// import { favoritePost, unfavoritePost } from './postsSlice';

export const PostActions: React.FC<{post: PostType}> = ({post}) => {
  // const dispatch = useAppDispatch();
  const site = useAppSelector(selectCurrentSite);

  // const toggleFav = useCallback(() => {
  //   if (!post.is_favorited) {
  //     dispatch(favoritePost(post.id));
  //   } else {
  //     dispatch(unfavoritePost(post.id));
  //   }
  // }, [dispatch, post])

  return (
    <div className={styles.postActionsContainer}>
      <div className={styles.postActionGroup}>
        <div className={styles.postActionButton}>🔼</div>
        <div className={styles.postActionText}>{post.score.total}</div>
        <div className={styles.postActionButton}>🔽</div>
      </div>
      <div className={styles.postActionGroup}
        // onClick={toggleFav}  // Favorites cannot be removed atm
      >
        <div className={styles.postActionButton}>🤍</div>
        <div className={styles.postActionText}>{post.fav_count}</div>
      </div>
      <div className={styles.postActionGroup}>
        <div className={styles.postActionButton}>💬</div>
        <div className={styles.postActionText}>{post.comment_count}</div>
      </div>
      <div className={styles.postActionGroup}>
        <a className={styles.postActionButton}
          href={`${site}/posts/${post.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >🔗</a>
      </div>
    </div>
  );
}