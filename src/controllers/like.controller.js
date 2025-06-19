import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    if(!videoId){
        throw new ApiError(400, "Video ID is required")
    }

    const existingLiked = await Like.findOne({
        video : videoId,
        likedBy : req.user?._id
    })

    if(existingLiked){
        await Like.findByIdAndDelete(existingLiked._id)

        return res
        .status(200)
        .json(new ApiResponse(200, {}, "Like remove successfully"));
    }else{
        const newLike = await Like.create({
            video : videoId,
            likedBy : req.user?._id
        })

        if(!newLike){
            throw new ApiError(500, "Failed to like the video")
        }

        return res 
        .status(201)
        .json (new ApiResponse(201, newLike, "Video liked successfully"))
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if (!commentId){
        throw new ApiError(400, "Comment ID is not found")
    }

    const existingLikedComment = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    })

    if(existingLikedComment){
        await Like.findByIdAndDelete(existingLikedComment._id)
        return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment Like is removed successfully "))
    }

    const newLike = await Like.create({
        comment : commentId,
        likedBy : req.user?._id
    })

    if(!newLike){
        throw new ApiError(500, "Failed to like the comment")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, newLike, "comment Liked successfully"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const likedByUser = await Like.find(
        {
            likedBy : req.user?._id,
            video: {$exists: true}
        }
    )
    .populate("video", "title thumbnail")
    .sort({createdAt: -1})

    if(!likedByUser || likedByUser.length === 0){
        throw new ApiError(404, "No liked videos found")
    }

    const likedVideos = likedByUser.map(like => like.video)

    return res 
    .status(200)
    .json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    )

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}