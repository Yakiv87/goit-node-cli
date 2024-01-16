const fs = require("fs/promises");
const path = require("path");
const { uid } = require("uid");

const contactsPath = path.join(__dirname, "./db/contact.json");
const updateContacts = async (contacts) =>
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

async function listContacts() {
  const contacts = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(contacts);
}

async function getContactById(id) {
  const contactId = String(id);
  const contacts = await listContacts();
  const result = contacts.find((contact) => contact.id === contactId);
  return result || null;
}

async function removeContact(id) {
  const contactId = String(id);
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }

  const [result] = contacts.splice(index, 1);
  await updateContacts(contacts);
  return result;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();

  const newContact = {
    id: uid(),
    name,
    email,
    phone,
  };

  if (!newContact.name || !newContact.email || !newContact.phone) {
    console.log("Not all fields are filled...");
    return;
  }
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};