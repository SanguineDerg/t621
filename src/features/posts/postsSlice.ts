import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { doFavoritePost, doUnfavoritePost, fetchPosts } from './postAPI';
import { PostType } from './postsType';

type Status = 'idle' | 'loading' | 'failed';

export interface PostsState {
  posts: {[postId: number]: PostType};
  postStatuses: {[postId: number]: Status};
  order: number[];
  overlay: number | null;
  status: Status;
}

const initialState: PostsState = {
  posts: {},
  postStatuses: {},
  order: [],
  overlay: null,
  status: 'idle',
};

export const loadPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (query: URLSearchParams, thunkAPI) => {
    query.get("tags")
    return await fetchPosts({
      tags: query.get("tags") || "",
    });
  }
);

export const favoritePost = createAsyncThunk(
  'posts/favoritePost',
  async (postId: number, thunkAPI) => {
    return await doFavoritePost(postId);
  }
);

export const unfavoritePost = createAsyncThunk(
  'posts/unfavoritePost',
  async (postId: number, thunkAPI) => {
    await doUnfavoritePost(postId)
  }
);

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setOverlayPost: (state, action: PayloadAction<number | null>) => {
      state.overlay = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadPosts.fulfilled, (state, action) => {
        state.status = 'idle';
        state.order = [];
        action.payload.forEach((post) => {
          if (post.file.url !== null) {
            state.order.push(post.id);
            state.posts[post.id] = post;
            state.postStatuses[post.id] = 'idle';
          }
        });
      })
      .addCase(loadPosts.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(favoritePost.pending, (state, action) => {
        state.postStatuses[action.meta.arg] = 'loading';
      })
      .addCase(favoritePost.fulfilled, (state, action) => {
        state.posts[action.payload.id] = action.payload;
        state.postStatuses[action.payload.id] = 'idle';
      })
      .addCase(favoritePost.rejected, (state, action) => {
        state.postStatuses[action.meta.arg] = 'failed';
      })
      .addCase(unfavoritePost.pending, (state, action) => {
        state.postStatuses[action.meta.arg] = 'loading';
      })
      .addCase(unfavoritePost.fulfilled, (state, action) => {
        // We dont get an update post, interpret the result
        state.posts[action.meta.arg].fav_count -= 1;
        state.posts[action.meta.arg].is_favorited = false;
        state.postStatuses[action.meta.arg] = 'idle';
      })
      .addCase(unfavoritePost.rejected, (state, action) => {
        state.postStatuses[action.meta.arg] = 'failed';
      });
  },
});

export const { setOverlayPost } = postsSlice.actions;

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const selectPostOrder = (state: RootState) => state.posts.order;
export const selectOverlayPostId = (state: RootState) => state.posts.overlay;

export const selectAllPostsInOrder = createSelector([selectAllPosts, selectPostOrder], (posts, order) => order.map((postId) => posts[postId]));
export const selectOverlayPost = createSelector([selectAllPosts, selectOverlayPostId], (posts, overlayId) => overlayId !== null ? posts[overlayId] : null);

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());
//     if (currentValue % 2 === 1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };

export default postsSlice.reducer;
