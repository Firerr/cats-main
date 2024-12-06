import { useContext } from 'react';
import Layout from '@/components/layout';
import { useRouter } from 'next/router';
// import { fetchCats } from "@/lib/cats";
import CatForm from '@/components/forms/cat_form';
import type Cat from '@/types/Cat';

import { CatsContext } from '@/components/contexts/cat.context';

const UpdateCat = ({ serverData }: { serverData: Cat }) => {
  const router = useRouter();
  const { id } = router.query;
  const { updateCat, cats } = useContext(CatsContext);
  let cat = null;
  if (typeof window === 'undefined') {
    cat = serverData;
  } else {
    cat = cats.find(({ _id }) => _id === id);
  }
  console.log('🚀 ~ file: [id].tsx ~ line 23 ~ UpdateCat ~ cat', cat);
  if (!cat) return <p>Error: Cat not found!</p>;
  return (
    <Layout>
      <h1>Update Cat</h1>
      <CatForm updateCat={updateCat} cat={cat} />
    </Layout>
  );
};

export default UpdateCat;

/****************************************************************
 * Static Site Generation
 ****************************************************************/
// import { getCatQuery as getCat } from "@/lib/cats/queries";

// This function gets called at build time
// export async function getServerSideProps({ params }:{ params: { id: string } }) {
//   const cat = await getCat(params.id);
//   return {
//     props: {
//       serverData: JSON.parse(JSON.stringify(cat)),
//     },
//   };
// }
