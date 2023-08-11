import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { ITenant } from '../repositories/memory-repository';

interface TenantSelectionProps {
  tenants: ITenant[];
  selectedTenantId: number | null;
  setSelectedTenantId: (id: number | null) => void;
  newTenantName: string;
  setNewTenantName: (name: string) => void;
  isAccordionOpen: boolean;
  setAccordionOpen: (isOpen: boolean) => void;
  handleDeleteTenant: (tenantId: number | null) => void;
  completedURLs: number;
  totalURLs: number;
}

const TenantSelection: React.FC<TenantSelectionProps> = ({
  tenants,
  selectedTenantId,
  setSelectedTenantId,
  newTenantName,
  setNewTenantName,
  isAccordionOpen,
  setAccordionOpen,
  handleDeleteTenant,
}) => {
  return (
    <Accordion
      expanded={isAccordionOpen}
      onChange={() => setAccordionOpen(!isAccordionOpen)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          {selectedTenantId
            ? tenants.find((t) => t.id === selectedTenantId)?.name
            : 'Please select a tenant'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List dense={true}>
          {tenants.map((tenant) => (
            <ListItem
              key={tenant.id}
              onClick={() => setSelectedTenantId(tenant.id ?? null)}
            >
              <ListItemText primary={tenant.name} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteTenant(tenant.id ?? null)}
                >
                  <CloseIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          <ListItem
            style={{
              paddingTop: '13px',
              alignItems: 'flex-start',
            }}
            onClick={() => setSelectedTenantId(-1)}
          >
            <ListItemText
              primary="+Add"
              primaryTypographyProps={{
                style: { fontSize: '1em', marginBottom: '8px' },
              }}
            />
            {selectedTenantId === -1 && (
              <TextField
                variant="outlined"
                margin="dense"
                id="newTenantName"
                label="New Tenant Name"
                value={newTenantName}
                onChange={(e) => setNewTenantName(e.target.value)}
                size="small"
                InputProps={{ style: { fontSize: 12 } }}
                InputLabelProps={{ style: { fontSize: 12 } }}
                style={{
                  marginTop: '-6px',
                  marginBottom: '-6px',
                  width: '80%',
                }}
              />
            )}
          </ListItem>
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default TenantSelection;
