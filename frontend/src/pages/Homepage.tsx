import React, { useState } from 'react';
import { Container } from '@mui/material';
import ShiftList from '../components/ShiftList';
import ShiftDrawer from '../components/CreateEditShiftDrawer';

const HomePage: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState<string | null>(null)
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <ShiftList setOpenDrawer={setOpenDrawer} />
       <ShiftDrawer open={openDrawer} onClose={() => setOpenDrawer(null)} />
    </Container>
  );
};

export default HomePage;