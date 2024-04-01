import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const data = await listContacts();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getContactById(id);
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
    const data = await removeContact(id);
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
    const { name, email, phone } = req.body;

    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const data = await addContact(name, email, phone);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    const { error } = updateContactSchema.validate(newData);
    if (error) {
      throw HttpError(400, error.message);
    }

    if (Object.keys(newData).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }

    const data = await updateContactById(id, newData);
    if (!data) {
      throw HttpError(404);
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
