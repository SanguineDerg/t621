export type PostFileExtType = "jpg" | "png" | "gif" | "swf" | "webm" | "mp4";

export type PostFileType<urlType extends string | null, ext extends PostFileExtType> = {
    width: number,
    height: number,
    ext: PostFileExtType,
    size: number,
    md5: string,
    url: urlType,
}

export type PostPreviewType<urlType extends string | null> = {
    width: number,
    height: number,
    url: urlType,
}

export type PostAlternateType<urlType1 extends string | null, urlType2 extends string | null> = {
    type: "video",
    height: number,
    width: number,
    urls: [urlType1, urlType2],
}

export type PostImageAltsType = {}

export type PostVideoAltsType<urlType extends string | null> = {
    "720p"?: PostAlternateType<urlType, urlType>,
    "480p"?: PostAlternateType<urlType, urlType>,
    original?: PostAlternateType<null, urlType>,
}

export type PostSampleType<urlType extends string | null, altsType extends PostImageAltsType | PostVideoAltsType<urlType>> = {
    has: boolean,
    width: number,
    height: number,
    url: urlType,
    alternates: altsType,
}

export type PostScoreType = {
    up: number,
    down: number,
    total: number,
}

export type PostTagsType = {
    general: string[],
    species: string[],
    character: string[],
    copyright: string[],
    artist: string[],
    invalid: string[],
    lore: string[],
    meta: string[],
}

export type PostFlagsType = {
    pending: boolean,
    flagged: boolean,
    note_locked: boolean,
    status_locked: boolean,
    rating_locked: boolean,
    comment_disabled: boolean,
    deleted: boolean,
}

export type PostRatingType = "s" | "q" | "e";

export type PostRelationshipsType = {
    parent_id: number | null,
    has_children: boolean,
    has_active_children: boolean,
    children: number[],
}

export type ImagePostType<urlType extends string | null> = {
    id: number,
    created_at: string,
    updated_at: string,
    file: PostFileType<urlType, "jpg" | "png" | "gif" | "swf">,
    preview: PostPreviewType<urlType>,
    sample: PostSampleType<urlType, PostImageAltsType>,
    score: PostScoreType,
    tags: PostTagsType,
    locked_tags: string[],
    change_seq: number,
    flags: PostFlagsType,
    rating: PostRatingType,
    fav_count: number,
    sources: string[],
    pools: number[],
    relationships: PostRelationshipsType,
    approver_id: number | null,
    uploader_id: number,
    description: string,
    comment_count: number,
    is_favorited: boolean,
    has_notes: false,
    duration: number,
    _site: string,
}

export type VideoPostType<urlType extends string | null> = {
    id: number,
    created_at: string,
    updated_at: string,
    file: PostFileType<urlType, "webm" | "mp4">,
    preview: PostPreviewType<urlType>,
    sample: PostSampleType<urlType, PostVideoAltsType<urlType>>,
    score: PostScoreType,
    tags: PostTagsType,
    locked_tags: string[],
    change_seq: number,
    flags: PostFlagsType,
    rating: PostRatingType,
    fav_count: number,
    sources: string[],
    pools: number[],
    relationships: PostRelationshipsType,
    approver_id: number | null,
    uploader_id: number,
    description: string,
    comment_count: number,
    is_favorited: boolean,
    has_notes: false,
    duration: number,
    _site: string,
}

export type PostType<urlType extends string | null = string | null> = ImagePostType<urlType> | VideoPostType<urlType>;
