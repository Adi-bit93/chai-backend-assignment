import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!videoId){
        throw new ApiError(400, "Video ID is required")
    }

    const skip = (page - 1) * limit 

    const comment = await Comment.find({video: videoId })
    .sort({createdAt: -1})
    .skip(skip)
    .limit(parseInt(limit))
    .populate("owner", "username avatar")
    .exec()

    const totalComments = await Comment.countDocuments({video: videoId})

    return res
    .status(200)
    .json(
        new ApiResponse(200, {
            comment,
            currentPage: page,
            totalPages: Math.ceil(totalComments / limit),
            totalComments
        }, "Comments fetched successfully")
    );
    

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    const {videoId, content} = req.body 

    if(!videoId || !content){
        throw new ApiError(400, "Video ID and content are required")
    }

    const comment = await Comment.create(
        {
            content,
            video: videoId,
            owner: req.user?._id
        }
    )

    const populatedComment = await comment.populate("owner", "username avatar")


    return res 
    .status(201)
    .json(
        new ApiResponse(201, populatedComment, "Comment added successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
