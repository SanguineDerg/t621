import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ImagePostType } from './postsType';
import styles from './PostOverlay.module.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectOverlayPost, selectOverlayPostId, setOverlayPost } from './postsSlice';

export const PostOverlayImage: React.FC<{post: ImagePostType<string>}> = ({post}) => {
  const dispatch = useAppDispatch();
  const [contentContainerHeight, setHeight] = useState(0);
  const [contentContainerWidth, setWidth] = useState(0);
  const contentContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentContainerRef.current === null) return undefined;
    const observer = new ResizeObserver(entries => {
      setHeight(entries[0].contentRect.height);
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(contentContainerRef.current);
    const current = contentContainerRef.current;
    return () => { current && observer.unobserve(current) }
  }, [contentContainerRef]);

  const closeOverlay = useCallback(() => {
    dispatch(setOverlayPost(null));
  }, [dispatch])

  // Calculate the content size given the content container size
  let contentHeight = 0;
  let contentWidth = 0;
  if (contentContainerHeight !== 0 && contentContainerWidth !== 0) {
    // Image is smaller than container, use full res
    if (contentContainerHeight >= post.file.height && contentContainerWidth >= post.file.width) {
      contentHeight = post.file.height;
      contentWidth = post.file.width;
    } else {
      const contentContainerRatio = contentContainerHeight / contentContainerWidth;
      const contentRatio = post.file.height / post.file.width;
      // Extra height, use 100% width
      if (contentContainerRatio > contentRatio) {
        const downsizeRatio = contentContainerWidth / post.file.width;
        contentHeight = downsizeRatio * post.file.height;
        contentWidth = contentContainerWidth;
      // Extra width, use 100% height
      } else {
        const downsizeRatio = contentContainerHeight / post.file.height;
        contentHeight = contentContainerHeight;
        contentWidth = downsizeRatio * post.file.width;
      }
    }
  }

  return (
    <div className={styles.postOverlayContainer}>
      <div className={styles.postOverlayContentContainer} ref={contentContainerRef}>
        <div 
          className={styles.postOverlayContent}
          style={{
            height: `${contentHeight}px`,
            width: `${contentWidth}px`,
          }}
        >
          <div style={{
            backgroundImage: `url(${post.file.url})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundColor: "rgba(0, 0, 0, 0)",
            height: "100%",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }} />
          <img 
            src={post.file.url}
            alt={`#${post.id}`}
            draggable={true}
            style={{
              opacity: 0,
              height: "100%",
              width: "100%",
              position: "absolute",
            }}
          />
        </div>
      </div>
      <div className={styles.postOverlayCloseContainer}>
        <div
          className={styles.postOverlayClose}
          onClick={closeOverlay}
        >
          ❌
        </div>
      </div>
    </div>
  );
}

export const PostOverlay = () => {
  const dispatch = useAppDispatch();

  const postId = useAppSelector(selectOverlayPostId);

  const post = useAppSelector(selectOverlayPost);

  if (postId === null) {
    return null;
  }

  if (post === null || !post.file.url || !post.sample.url) {
    dispatch(setOverlayPost(null));
    return null;
  }

  // elif post.is_image?
  if (post.file.ext === "gif" || post.file.ext === "jpg" || post.file.ext === "png") {
    return (
      <PostOverlayImage post={post as ImagePostType<string>} />
    )
  }

  // elif !post.is_image?
  dispatch(setOverlayPost(null));
  return null;
}