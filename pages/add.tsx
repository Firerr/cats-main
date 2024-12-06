import { useContext } from 'react';
import Typography from '@mui/material/Typography';
import Layout from '@/components/layout';
import CatForm from '@/components/forms/cat_form';

import { CatsContext } from '@/components/contexts/cat.context';

const Cats = () => {
  const { addCat } = useContext(CatsContext);
  return (
    <Layout>
      <Typography component="h1">Add a Cat</Typography>
      <CatForm addCat={addCat} />
    </Layout>
  );
};

export default Cats;
