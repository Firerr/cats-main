import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CatsContext } from '@/components/contexts/cat.context';
import CatItem from '@/components/cat';
import Layout from '@/components/layout';
import type Cat from '@/types/Cat';

/* 
  /            index.tsx
  /add         add.tsx
  /1           [id].tsx
  /1?          [[id]].tsx
                _app   (NOT COUNTED)
  /update/:id
  /update/1     update/[id].tsx   --> id (1)
  /update/2?q=hello     update/[id].tsx   --> id (2)
*/

function SingleCat({ serverData }: { serverData: Cat }) {
  const router = useRouter();
  const { id } = router.query;
  const { loading, error, cats, fetchCats } = useContext(CatsContext);
  let cat = null;
  if (typeof window === 'undefined') {
    cat = serverData;
  } else {
    cat = cats.find(({ _id }) => _id === id);
  }

  console.log({ loading, error, cat });

  useEffect(() => {
    fetchCats();
  }, [fetchCats]);

  return (
    <Layout>
      <Typography component="h1" variant="h3">
        Cat
      </Typography>
      {loading && <Typography>Loading...</Typography>}
      {!loading && error && <Typography>{error.message}</Typography>}
      {!loading && !error && cat && <CatItem cat={cat} />}
      {!loading && !error && !cat && (
        <Typography>Cat with id {id} not found</Typography>
      )}
    </Layout>
  );
}

export default SingleCat;

/****************************************************************
 * Static Site Generation
 ****************************************************************/
import {
  getCatQuery as getCat,
  // getCatsQuery as getCats,
} from '@/lib/cats/queries';
import Typography from '@mui/material/Typography';

export async function getServerSideProps({
  params,
}: {
  params: { id: string };
}) {
  const cat = await getCat(params.id);
  return {
    props: {
      serverData: JSON.parse(JSON.stringify(cat)),
    },
  };
}

// This function gets called at build time
// export async function getStaticProps({ params }:{ params:{ id: string } }) {
//   const cat = await getCat(params.id);
//   return {
//     props: {
//       serverData: JSON.parse(JSON.stringify(cat)),
//     },
//   };
// }

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
// export async function getStaticPaths() {
//   const cats = await getCats();
//   // Get the paths we want to pre-render based on cats
//   const paths = cats.map((cat: Cat) => ({
//     params: { id: cat._id.toString() },
//   }));
//   console.log("paths", paths);

//   return { paths, fallback: "blocking" };
// }
