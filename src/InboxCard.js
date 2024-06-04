import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';

export default function InboxCard({CardType,Description,VerificationURL,Details,onApprove,onDeny}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>

      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}  sx={{backgroundColor: 'rgb(27, 27, 27)',color: 'white',borderBottom: 'solid 1px white'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }}/>}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
          {CardType}
          </Typography>
          <Typography sx={{ }}>
          {Description}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {CardType === "Verification Request" && (
            <Typography>
              <a href={VerificationURL} target="_blank" rel="noopener noreferrer">
                View Verification Document
              </a>
            </Typography>
          )}
          {CardType === "Report" && 
          (<Typography>
            {Details}
          </Typography>)}
        </AccordionDetails>
        {CardType === "Report" ? 
          <Button onClick={onApprove}>Close</Button> 
          : CardType === "Job" ? 
          <div>
          <Button onClick={onApprove}>Accept</Button>
          <Button onClick={onApprove}>Decline</Button>
          </div> // Additional button setup for "Job"
          : 
          <div>
            <Button onClick={onApprove}>Approve</Button>
            <Button onClick={onDeny}>Deny</Button>
          </div>
}
      </Accordion>

      
    </div>
  );
}