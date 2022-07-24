import express from 'express';
import * as pageController from '../controllers/pageController.js';

const router = express.Router();

router.route('/').get(pageController.getIndexPage);
router.route('/about').get(pageController.getAboutPage);
router.route('/register').get(pageController.getRegisterPage);

export default router;
