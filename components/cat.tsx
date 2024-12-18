import { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type Cat from '@/types/Cat';

type CatProps = {
  cat: Cat;
};

import { CatsContext } from '@/components/contexts/cat.context';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const CatItem = ({ cat: { _id, name, age, avatar_url } }: CatProps) => {
  const { deleteCat } = useContext(CatsContext);
  const router = useRouter();
  return (
    <>
      {/* <img src={avatar_url} alt="" width="200" /> */}
      <Image
        alt=""
        src={avatar_url!}
        width={200}
        height={200}
        // layout="responsive"
      />

      <Box component="dl">
        <Box sx={{ display: 'flex' }}>
          <Box component="dt">Name</Box>
          <Box component="dd">{name}</Box>
        </Box>

        <Box sx={{ display: 'flex' }}>
          <Box component="dt">age</Box>
          <Box component="dd">{age}</Box>
        </Box>
      </Box>
      {/* <Link href={`/${_id}`}>View Cat</Link> */}
      <Link href={`/update/${_id}`}>Update</Link>

      <Button
        onClick={async () => {
          await deleteCat(_id);
          router.push('/');
        }}
      >
        delete
      </Button>
    </>
  );
};

export default CatItem;
