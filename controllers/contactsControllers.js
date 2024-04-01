import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} from "../services/contactsServices.js";
// import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  try {
    const data = await listContacts();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getOneContact = async (req, res) => {};

export const deleteContact = async (req, res) => {};

export const createContact = async (req, res) => {};

export const updateContact = async (req, res) => {};
