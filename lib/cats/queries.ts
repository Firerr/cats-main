import type { CatData, CatUpdateData } from "@/components/forms/cat_form";
import "@/lib/db";
import CatBreed from "@/lib/server/breeds/cat.breed";

export const getCatsQuery = async () => {
  return await CatBreed.find({}).exec();
};

export const getCatQuery = async (id: string) => {
  return await CatBreed.findById(id);
};

export const addCatQuery = async (data: CatData) => {
  const cat = new CatBreed(data);
  const newCat = await cat.save();
  return newCat;
};

export const updateCatQuery = async (id: string, data: CatUpdateData) => {
  return await CatBreed.updateOne({ _id: id }, data);
};

export const removeCatQuery = async (id: string) => {
  return await CatBreed.deleteOne({ _id: id });
};
