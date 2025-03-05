import express from 'express'
import { auth, isAdmin } from '../middleware/auth'
import { createPost, getPosts } from '../controllers/post.controller'

const router = express.Router()

router.get("/", auth, getPosts)
router.post("/", auth, isAdmin, createPost)

export default router;