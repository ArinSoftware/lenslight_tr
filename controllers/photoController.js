import Photo from '../models/photoModel.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const createPhoto = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: 'lenslight_tr',
    }
  );

  console.log('RESULT::', result);

  try {
    await Photo.create({
      name: req.body.name,
      description: req.body.description,
      user: res.locals.user._id,
      url: result.secure_url,
      image_id: result.public_id,
    });

    fs.unlinkSync(req.files.image.tempFilePath);

    res.status(201).redirect('/users/dashboard');
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

const getAllPhotos = async (req, res) => {
  try {
    const photos = res.locals.user
      ? await Photo.find({ user: { $ne: res.locals.user._id } })
      : await Photo.find({});
    res.status(200).render('photos', {
      photos,
      link: 'photos',
    });
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

const getAPhoto = async (req, res) => {
  try {
    const photo = await Photo.findById({ _id: req.params.id }).populate('user');
    res.status(200).render('photo', {
      photo,
      link: 'photos',
    });
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    const photoId = photo.image_id;

    await cloudinary.uploader.destroy(photoId);
    await Photo.findOneAndRemove({ _id: req.params.id });

    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

export { createPhoto, getAllPhotos, getAPhoto, deletePhoto };
