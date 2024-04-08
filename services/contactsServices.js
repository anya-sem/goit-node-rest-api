// import { promises as fs } from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";
// import { nanoid } from "nanoid";
// import { Contact } from "../models/contactModel.js";

// const __dirname = dirname(fileURLToPath(import.meta.url));
// const contactsPath = path.join(__dirname, "..", "db", "contacts.json");

// async function listContacts() {
//   try {
//     return await Contact.find();
//   } catch (error) {
//     return error;
//   }
// }

// async function getContactById(contactId) {
//   try {
//     const data = await fs.readFile(contactsPath);
//     const contacts = JSON.parse(data);
//     return contacts.find((contact) => contact.id === contactId) || null;
//   } catch (error) {
//     return error;
//   }
// }

// async function removeContact(contactId) {
//   try {
//     const data = await fs.readFile(contactsPath);
//     const contacts = JSON.parse(data);

//     const removedContact = contacts.find((contact) => contact.id === contactId);
//     if (!removedContact) return null;

//     const updatedContacts = contacts.filter(
//       (contact) => contact.id !== contactId
//     );

//     await fs.writeFile(contactsPath, JSON.stringify(updatedContacts));
//     return removedContact;
//   } catch (error) {
//     return error;
//   }
// }

// async function addContact(name, email, phone) {
//   try {
//     const data = await fs.readFile(contactsPath);
//     const contacts = JSON.parse(data);

//     const newContact = { id: nanoid(), name, email, phone };
//     contacts.push(newContact);

//     await fs.writeFile(contactsPath, JSON.stringify(contacts));
//     return newContact;
//   } catch (error) {
//     return error;
//   }
// }

// async function updateContactById(contactId, newData) {
//   try {
//     const data = await fs.readFile(contactsPath);
//     let contacts = JSON.parse(data);

//     const index = contacts.findIndex((contact) => contact.id === contactId);

//     if (index === -1) {
//       return null;
//     }

//     contacts[index] = {
//       ...contacts[index],
//       ...newData,
//     };

//     await fs.writeFile(contactsPath, JSON.stringify(contacts));
//     return contacts[index];
//   } catch (error) {
//     throw error;
//   }
// }

// async function updateStatusContact(contactId, newData) {
//   try {
//     const data = await fs.readFile(contactsPath);
//     let contacts = JSON.parse(data);

//     const index = contacts.findIndex((contact) => contact.id === contactId);

//     if (index === -1) {
//       return null;
//     }

//     contacts[index].favorite = newData.favorite;

//     await fs.writeFile(contactsPath, JSON.stringify(contacts));
//     return contacts[index];
//   } catch (error) {
//     throw error;
//   }
// }

// export {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContactById,
//   updateStatusContact,
// };
