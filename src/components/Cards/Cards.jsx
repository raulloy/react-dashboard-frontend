import './Cards.css';
import { cardsData } from '../../data';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Cards = () => {
  return (
    <div className="Cards">
      {cardsData.map((card, id) => {
        return (
          <div className="parentContainer" key={id}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {card.title}
                </Typography>
                {/* <Typography variant="h5" component="div">benevolent</Typography> */}
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {card.value}
                </Typography>
                {/* <Typography variant="body2">well meaning and kindly.<br /></Typography> */}
              </CardContent>
              <CardActions>
                <Button size="small">Details</Button>
              </CardActions>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default Cards;
