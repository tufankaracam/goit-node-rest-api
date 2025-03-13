import Contact from "../db/models/Contact.js";

export const listContacts = () => {
  return Contact.findAll();
};

export const getContactById = (contactId) => {
  return Contact.findByPk(contactId);
};

export const addContact = (data) => {
  return Contact.create(data);
};

export const removeContact = async (contactId) => {
  const contact = await getContactById(contactId);
  if (!contact) {
    return null;
  }
  await contact.destroy();
  return contact;
};

export const updateContact = async (contactId, data) => {
  const contact = await getContactById(contactId);
  if (!contact) {
    return null;
  }
  return contact.update(data, { returning: true });
};

export const updateStatusContact = async (contactId, body) => {
  const { favorite } = body;
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    return null;
  }
  return await contact.update({ favorite }, { returning: true });
};
