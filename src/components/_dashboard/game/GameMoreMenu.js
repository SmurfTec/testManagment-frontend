import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Beenhere, Cancel } from '@mui/icons-material';

// ----------------------------------------------------------------------

export default function GameMoreMenu({ game, handleDelete, handleApprove }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            {' '}
            <Cancel />
          </ListItemIcon>

          <ListItemText
            primary='Reject'
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>

        <MenuItem onClick={handleApprove} sx={{ color: 'success.main' }}>
          <ListItemIcon>
            <Beenhere />
          </ListItemIcon>
          <ListItemText
            primary='Approve'
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
