import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';


export default function Profile({Dogname, DogImage,Dogdescription, onBook}) {
  const Location = useLocation();
  const imageUrl = DogImage || "";

  return (

    <Card className='card-container' sx={{ width: 345, bgcolor: 'black', borderRadius: '25px', margin: '10px' }}>
    <CardMedia
      component="img"
      image={imageUrl} // Use the URL directly
      alt="Profile picture"
      sx={{ objectFit: 'fill', height: '200px' }} // Fixed height for image
    />
    <CardContent sx={{ height: '100px' }}> {/* Fixed height for the content */}
      <Typography gutterBottom variant="h5" component="div" sx={{ color: 'white' }}>
        {Dogname}
      </Typography>
      <Box sx={{ overflow: 'auto', color: 'white' }}>
        <Typography variant="body2">
          {Dogdescription}
        </Typography>
      </Box>
    </CardContent>
    <CardActions>
      {Location.pathname === '/booking' ? (<Button size="small" color="primary" onClick={onBook}>Book</Button>) : null}
    </CardActions>
  </Card>
  );
}