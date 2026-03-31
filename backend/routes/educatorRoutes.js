import express from 'express'
import { 
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator 
} from '../controllers/educatorController.js'

import { requireAuth } from '@clerk/express';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';

const educatorRouter = express.Router()

// Add Educator Role 
educatorRouter.get('/update-role', requireAuth(), updateRoleToEducator)

// Add Course
educatorRouter.post(
  '/add-course',
  requireAuth(),            // 🔥 MUST BE FIRST
  upload.single('image'),
  protectEducator,
  addCourse
)

// Get Educator Courses
educatorRouter.get(
  '/courses',
  requireAuth(),            // 🔥 MUST BE FIRST
  protectEducator,
  getEducatorCourses
)

// Dashboard Data
educatorRouter.get(
  '/dashboard',
  requireAuth(),            // 🔥 MUST BE FIRST
  protectEducator,
  educatorDashboardData
)

// Enrolled Students
educatorRouter.get(
  '/enrolled-students',
  requireAuth(),            // 🔥 MUST BE FIRST
  protectEducator,
  getEnrolledStudentsData
)

export default educatorRouter;
