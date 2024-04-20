import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contactModel.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const data = await Contact.find({ owner }, "-createdAt -updatedAt", {
      skip,
      limit,
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Contact.findOne({ _id: id });
    if (!data) {
      throw HttpError(404);
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Contact.findByIdAndDelete({ _id: id });
    if (!data) {
      throw HttpError(404);
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { name, email, phone } = req.body;

    const data = await Contact.create({ name, email, phone, owner });
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    const data = await Contact.findByIdAndUpdate({ _id: id }, newData, {
      new: true,
    });
    if (!data) {
      throw HttpError(404);
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateFavoriteStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;

    const data = await Contact.findByIdAndUpdate(
      { _id: id },
      { favorite },
      { new: true }
    );
    if (!data) {
      throw HttpError(404);
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
