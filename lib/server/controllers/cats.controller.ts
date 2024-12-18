// import Cat from "../breeds/cat.breed";
import { NextApiRequest, NextApiResponse } from 'next';
import {
  getCatQuery,
  getCatsQuery,
  addCatQuery,
  updateCatQuery,
  removeCatQuery,
} from '@/lib/cats/queries';

export const getCats = async (req: NextApiRequest, res: NextApiResponse) => {
  // Does not work locally but will on Vercel
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');
  console.log('get cats ran')
  const { catId: id } = req.query;

  try {
    const cats = id ? await getCatQuery(id as string) : await getCatsQuery();
    return res.status(200).send(cats);
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const addCat = async (req: NextApiRequest, res: NextApiResponse) => {
  const catData = req.body;

  if (catData.avatar_url && catData.avatar_url.startsWith('data:image')) {
    return res.status(400).send('NO_DATA_URIS_FOR_AVATAR');
  }

  if (!catData.name) {
    return res.status(400).send('NO_NAME_PROVIDED');
  }

  if (!catData.bhp) {
    return res.status(400).send('NO_BHP_PROVIDED');
  }

  if (catData.avatar_url === '') {
    delete catData.avatar_url;
  }

  try {
    const newCat = await addCatQuery(catData);
    return res.status(201).send(newCat);
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const updateCat = async (req: NextApiRequest, res: NextApiResponse) => {
  const updateData = req.body;
  console.log(`Updating ${req.query.id}`, updateData);

  if (updateData.avatar_url && updateData.avatar_url.startsWith('data:image')) {
    return res.status(400).send('NO_DATA_URIS_FOR_AVATAR');
  }

  const isEmpty =
    req.body && // 👈 null and undefined check
    Object.keys(req.body).length === 0 &&
    Object.getPrototypeOf(req.body) === Object.prototype;

  if (isEmpty) {
    return res.status(400).send('No update data provided');
  }

  const { catId: id } = req.query;

  try {
    const result = await updateCatQuery(id as string, updateData);
    console.log('result', result);
    if (result.matchedCount === 0) return res.status(404).send('NOT FOUND');
    res.status(200).send('OK');
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const removeCat = async (req: NextApiRequest, res: NextApiResponse) => {
  const { catId: id } = req.query;
  console.log('catToBeDeleted', id);
  try {
    const result = await removeCatQuery(id as string);
    if (result.deletedCount === 0) return res.status(404).send('NOT FOUND');
    console.log('🚀 ~ file: cats.controller.js ~ line 84 ~ result', result);
    res.status(204).send('NO CONTENT');
  } catch (err) {
    return res.status(500).send(err);
  }
};
