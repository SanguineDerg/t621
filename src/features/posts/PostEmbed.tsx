import React, { useCallback } from 'react'
import { ImagePostType, PostType, VideoPostType } from './postsType';
import styles from './PostEmbed.module.css';
import { useAppDispatch } from '../../app/hooks';
import { setOverlayPost } from './postsSlice';

const MAX_RATIO = 1.5;
const MIN_RATIO = 0.5;

export const PostEmbedImage: React.FC<{post: ImagePostType<string>}> = ({post}) => {
  const ratio = Math.min(Math.max(post.sample.height / post.sample.width, MIN_RATIO), MAX_RATIO) * 100
  
  const dispatch = useAppDispatch();

  const onClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    dispatch(setOverlayPost(post.id));
  }, [dispatch, post])

  return (
    <div className={styles.postEmbedContainer}>
      <a href={post.file.url} onClick={onClick}>
        <div className={styles.postEmbedContentContainer}>
          <div style={{
            paddingBottom: `${ratio}%`,
            zIndex: -1,
          }} />
          <div className={styles.postEmbedContent} >
            <div style={{
              zIndex: -1,
              backgroundImage: `url(${post.sample.url})`,
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
              src={post.sample.url}
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
      </a>
    </div>
  );
}

export const PostEmbedVideo: React.FC<{post: VideoPostType<string>}> = ({post}) => {
  let ratio = Math.min(Math.max(post.file.height / post.file.width, MIN_RATIO), MAX_RATIO) * 100;
  let sources: [string, string][] = [[post.file.url, "video/webm"]];
  if (post.sample.alternates["720p"]) {
    ratio = Math.min(Math.max(post.sample.alternates["720p"].height / post.sample.alternates["720p"].width, MIN_RATIO), MAX_RATIO) * 100;
    sources = [
      [post.sample.alternates["720p"].urls[0], "video/webm"],
      [post.sample.alternates["720p"].urls[1], "video/mp4"],
    ]
  } else if (post.sample.alternates.original) {
    ratio = Math.min(Math.max(post.sample.alternates.original.height / post.sample.alternates.original.width, MIN_RATIO), MAX_RATIO) * 100;
    sources.push([post.sample.alternates.original.urls[1], "video/mp4"])
  }
  return (
    <div className={styles.postEmbedContainer}>
      <div className={styles.postEmbedContentContainer}>
        <div style={{paddingBottom: `${ratio}%`}} />
        <video className={styles.postEmbedContent} preload="none" playsInline={true} loop={true} controls={true} poster={post.sample.url}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              backgroundColor: "black",
              top: "0%",
              left: "0%",
              transform: "rotate(0deg) scale(1.00)"}}>
          {sources.map(([url, type], index) => (
            <source src={url} type={type} key={index} />
          ))}
        </video>
      </div>
    </div>
  );
}

export const PostEmbed: React.FC<{post: PostType}> = ({post}) => {
  if (!post.file.url || !post.sample.url) {
    return (
      <div className={styles.postEmbedContainer}>
        <div className={styles.postEmbedContentContainer}>
          You can not view this image.
        </div>
      </div>
    );
  }
  
  // elif post.is_flash?
  if (post.file.ext === "swf") {
    return (
      <div className={styles.postEmbedContainer}>
        <div className={styles.postEmbedContentContainer}>
          Flash:
          <a href={post.file.url}>
            Save this flash (right click and save)
          </a>
        </div>
      </div>
    );
  }

  // elif post.is_video?
  if (post.file.ext === "webm" || post.file.ext === "mp4") {
    return (
      <PostEmbedVideo post={post as VideoPostType<string>} />
    );
  }

  // elif post.is_image?
  if (post.file.ext === "gif" || post.file.ext === "jpg" || post.file.ext === "png") {
    return (
      <PostEmbedImage post={post as ImagePostType<string>} />
    )
  }

  // elif !post.is_image?
  return (
    <div className={styles.postEmbedContainer}>
      <div className={styles.postEmbedContentContainer}>
        Unknown file type: {post.file.ext}.
        <a href={post.file.url}>
          Save this file (right click and save)
        </a>
      </div>
    </div>
  )
}