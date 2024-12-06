import React, { createContext, useState, useCallback } from 'react';
import type Cat from '@/types/Cat';
// import { useToasts } from "react-toast-notifications";
// import cloneDeep from 'lodash.cloneDeep' <-- use if your objects get complex

interface updateFormData {
  name?: string;
  bhp?: number;
  avatar_url?: string;
}

interface addFormData {
  name: string;
  bhp: number;
  avatar_url?: string;
}

interface CatsContextInterface {
  fetchCats: () => void;
  addCat: (formData: addFormData) => Promise<void>;
  updateCat: (id: string, formData: updateFormData) => Promise<void>;
  deleteCat: (id: string) => Promise<void>;
  loaded: boolean;
  loading: boolean;
  // isInitialLoad: boolean;
  error: null | Error;
  cats: Cat[];
}

const defaultValues: CatsContextInterface = {
  fetchCats: () => [],
  addCat: () => new Promise(() => {}),
  updateCat: () => new Promise(() => {}),
  deleteCat: () => new Promise(() => {}),
  loaded: false,
  loading: false,
  // isInitialLoad: true,
  error: null,
  cats: [],
};

let CATS_ENDPOINT = `/api/v1/cats`;

if (typeof window === 'undefined') {
  CATS_ENDPOINT = process.env.NEXT_PUBLIC_CATS_ENDPOINT!;
} else {
  CATS_ENDPOINT = `${window.location.origin}/api/v1/cats`;
}

// https://nextjs-fullstack-rest-demo.vercel.app
export const CatsContext = createContext<CatsContextInterface>(defaultValues);

type CatsProviderProps = {
  children?: React.ReactNode;
  startingData: Cat[];
};

export const CatsProvider = ({
  children,
  startingData = [],
}: CatsProviderProps) => {
  // console.log('rendered provider');
  const [cats, setCats] = useState<Cat[]>(
    Array.isArray(startingData) ? startingData : [startingData],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  // const [isInitialLoad, setisInitialLoad] = useState<boolean>(true);
  // const [search, setSearch] = useState("");
  // const { addToast } = useToasts();

  const fetchCats = useCallback(async () => {
    // console.log('loading', loading);
    // console.log('error', error);
    if (loading || loaded || error) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(CATS_ENDPOINT);
      if (response.status !== 200) {
        throw response;
      }
      const data = await response.json();
      // if (typeof window !== "undefined") {
      //   localStorage.setItem("cats", JSON.stringify(data));
      // }
      // console.log('data', data);
      setCats(data);
    } catch (err: any) {
      setError(err.message || err.statusText);
    } finally {
      setLoaded(true);
      setLoading(false);
    }
  }, [error, loaded, loading]);

  const addCat = useCallback(
    async (formData: addFormData) => {
      console.log('about to add', formData);
      try {
        const response = await fetch(CATS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(formData),
        });
        if (response.status !== 201) {
          throw response;
        }
        const savedCat = await response.json();
        console.log('got data', savedCat);
        const newCats = [...cats, savedCat];
        if (typeof window !== 'undefined') {
          localStorage.setItem('cats', JSON.stringify(newCats));
        }
        setCats(newCats);
        // addToast(`Saved ${savedCat.name}`, {
        //   appearance: "success",
        // });
      } catch (err) {
        console.log('🚀 ~ file: cat.context.tsx ~ line 121 ~ err', err);

        // addToast(`Error ${err.message || err.statusText}`, {
        //   appearance: "error",
        // });
      }
    },
    [cats],
  );

  const updateCat = useCallback(
    async (id: string, formData: updateFormData) => {
      console.log('updating', id, formData);
      let updatedCat = null;
      // Get index
      const index = cats.findIndex((cat) => cat._id === id);
      console.log('index', index);
      if (index === -1) throw new Error(`Cat with index ${id} not found`);
      // Get actual cat
      const oldCat: Cat = cats[index];
      console.log('oldCat', oldCat);

      // Send the differences, not the whole update
      const updates = {};

      for (const key of Object.keys(oldCat)) {
        if (key === '_id') continue;
        //@ts-ignore
        if (oldCat[key] !== formData[key]) {
          //@ts-ignore
          updates[key] = formData[key];
        }
      }

      try {
        const response = await fetch(`${CATS_ENDPOINT}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(updates),
        });

        if (response.status !== 200) {
          throw response;
        }

        // Merge with formData
        updatedCat = {
          ...oldCat,
          ...formData, // order here is important for the override!!
        };
        console.log('updatedCat', updatedCat);
        // recreate the cats array
        const updatedCats = [
          ...cats.slice(0, index),
          updatedCat,
          ...cats.slice(index + 1),
        ];
        if (typeof window !== 'undefined') {
          localStorage.setItem('cats', JSON.stringify(updatedCats));
        }
        // addToast(`Updated ${updatedCat.name}`, {
        //   appearance: "success",
        // });
        setCats(updatedCats);
      } catch (err) {
        console.log('🚀 ~ file: cat.context.tsx ~ line 187 ~ err', err);
      }
    },
    [cats],
  );

  const deleteCat = useCallback(
    async (id: string) => {
      let deletedCat = null;
      try {
        const response = await fetch(`${CATS_ENDPOINT}/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        if (response.status !== 204) {
          throw response;
        }
        // Get index
        const index = cats.findIndex((cat) => cat._id === id);
        deletedCat = cats[index];
        // recreate the cats array without that cat
        const updatedCats = [...cats.slice(0, index), ...cats.slice(index + 1)];
        if (typeof window !== 'undefined') {
          localStorage.setItem('cats', JSON.stringify(updatedCats));
        }
        setCats(updatedCats);
        console.log(`Deleted ${deletedCat.name}`);
        // addToast(`Deleted ${deletedCat.name}`, {
        //   appearance: "success",
        // });
      } catch (err) {
        console.log('🚀 ~ file: cat.context.tsx ~ line 222 ~ err', err);
      }
    },
    [cats],
  );

  return (
    <CatsContext.Provider
      value={{
        cats,
        loading,
        error,
        loaded,
        fetchCats,
        addCat,
        updateCat,
        deleteCat,
      }}
    >
      {children}
    </CatsContext.Provider>
  );
};

// export const useCats = useContext(CatsContext);
