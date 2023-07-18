import { ObjectId } from "bson";

export const isValidObjectId = (id: string) => {
  try {
    const objectId = new ObjectId(id);
    return true;
  } catch (error) {
    return false;
  }
};
