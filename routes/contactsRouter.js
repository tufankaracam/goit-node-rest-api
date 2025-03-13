import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateContactStatus,
} from "../controllers/contactsControllers.js";

import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteContactSchema,
} from "../schemas/contactsSchemas.js";
import controllerWrapper from "../decorators/controllerWrapper.js";
import authenticate from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/",authenticate, controllerWrapper(getAllContacts));

contactsRouter.get("/:id",authenticate, controllerWrapper(getOneContact));

contactsRouter.delete("/:id",authenticate, controllerWrapper(deleteContact));

contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  controllerWrapper(createContact)
);

contactsRouter.put(
  "/:id",
  authenticate,
  validateBody(updateContactSchema),
  controllerWrapper(updateContact)
);
contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  validateBody(updateFavoriteContactSchema),
  controllerWrapper(updateContactStatus)
);

export default contactsRouter;
