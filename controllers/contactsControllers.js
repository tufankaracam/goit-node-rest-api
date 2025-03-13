import {
  listContacts,
  getContactById as getContact,
  addContact as add,
  removeContact,
  updateContact as update,
  updateStatusContact
} from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
};

export const getOneContact = async (req, res) => {
  const contact = await getContact(req.params.id);
  if (!contact) throw HttpError(404, "Not found");
  res.status(200).json(contact);
};

export const deleteContact = async (req, res) => {
  const removedContact = await removeContact(req.params.id);
  if (!removedContact) throw HttpError(404, "Not found");
  res.status(200).json(removedContact);
};

export const createContact = async (req, res) => {
  const newContact = await add(req.body);
  res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
  const updatedContact = await update(req.params.id, req.body);
  if (!updatedContact) throw HttpError(404, "Not found");
  res.status(200).json(updatedContact);
};

export const updateContactStatus = async (req,res)=>{
  const updatedContact = await updateStatusContact(req.params.id, req.body);
  if (!updatedContact) throw HttpError(404, "Not found");
  res.status(200).json(updatedContact);
}