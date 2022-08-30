import React from 'react'
import { PostType } from './postsType';
import { PostEmbed } from './PostEmbed';
import { PostActions } from './PostActions';
import styles from './Post.module.css';

export const Post: React.FC<{post: PostType}> = ({post}) => {
  return (
    <div className={styles.postContainer}>
      <PostEmbed post={post} />
      <PostActions post={post} />
    </div>
  )
}