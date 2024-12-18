import { useContext, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import CatItem from "@/components/cat";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';

import Layout from '@/components/layout';
import { CatsContext } from '@/components/contexts/cat.context';

import type Cat from '@/types/Cat';

const Cats = ({ serverData }: { serverData: Array<Cat> }) => {
  const { loading, error, cats, fetchCats, deleteCat } =
    useContext(CatsContext);
  console.log('context cats', cats);

  let data: Cat[] = cats;
  // add a bit for SSR (will cause hydration error)
  if (typeof window === 'undefined') {
    console.log('SSR cats', serverData);
    data = serverData;
  }

  console.log('final cats', data);

  // Rehydrate on Client-side
  useEffect(() => {
    fetchCats();
  }, [fetchCats]);

  let component = null;

  if (loading) {
    component = <Typography>Loading...</Typography>;
  } else if (error) {
    component = <Typography>{error.message}</Typography>;
  } else if (!Array.isArray(data)) {
    // @ts-ignore
    console.error(
      `'data' must be an array. Instead received ${
        JSON.stringify(data)
      } of type ${data}`,
    );
    component = (
      <Typography>Wrong data format. Please check console</Typography>
    );
  } else if (data.length === 0) {
    component = <Typography>You have no cats</Typography>;
  } else {
    component = (
      <List>
        {data.map(({ name, age, avatar_url, _id }) => (
          <ListItem key={_id}>
            <ListItemAvatar>
              <Avatar>
                <Image
                  alt=""
                  src={avatar_url!}
                  width={2250}
                  height={1390}
                  layout="responsive"
                />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              {name} (age: {age})
            </ListItemText>
            <IconButton
              aria-label="view"
              href={`/${_id}`}
              component={Link}
              passHref
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              aria-label="update"
              href={`/update/${_id}`}
              component={Link}
              passHref
            >
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => deleteCat(_id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    );
  }

  return (
    <Layout>
      <Typography component="h1" variant="h3">
        List
      </Typography>
      {component}
    </Layout>
  );
};

export default Cats;

/****************************************************************
 * Static Site Generation
 ****************************************************************/
import { getCatsQuery as getCats } from '@/lib/cats/queries';

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
// export async function getStaticProps() {
//   const cats = await getCats();
//   return {
//     props: {
//       serverData: JSON.parse(JSON.stringify(cats)),
//     },
//   };
// }

export async function getServerSideProps() {
  const cats = await getCats();
  return {
    props: {
      serverData: JSON.parse(JSON.stringify(cats)),
    },
  };
}
