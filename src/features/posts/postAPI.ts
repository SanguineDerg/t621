import { apiFetch } from '../../helpers';
import { PostType } from './postsType';

type GetPostParams = {
  limit?: number,
  tags?: string,
  page?: number | string,
}
export function fetchPosts(params: GetPostParams = {}) {
  return apiFetch<{posts: PostType[]}>(
    "posts",
    {
      params: {
        limit: params.limit?.toString() || "100",
        tags: params.tags,
        page: params.page?.toString(),
      }
    },
  ).then((data) => {
    return data.posts;
  })
}

export function doFavoritePost(postId: number) {
  const formData = new FormData();
  formData.append('post_id', postId.toString());
  return apiFetch<{post: PostType}>(
    "favorites",
    {
      method: "post",
      data: formData,
    },
  ).then((data) => {
    return data.post;
  })
}

export function doUnfavoritePost(postId: number) {
  return apiFetch(
    `favorites/${postId}`,
    {
      method: "delete",
    },
  )
}
