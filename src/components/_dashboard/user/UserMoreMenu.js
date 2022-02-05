import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

// ----------------------------------------------------------------------

export default function UserMoreMenu({
  currentProject,
  toggleDelOpen,
  toggleEditOpen,
  setSelected,
  viewTask,
  viewLink,
  isProject = false,
}) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    setSelected(currentProject._id);
    setIsOpen(false);
    toggleDelOpen();
  };

  const handleEdit = () => {
    setSelected(currentProject);
    setIsOpen(false);
    toggleEditOpen();
  };

  const handleAddTo = () => {
    setIsOpen(false);
    // toggleAddToOpen();
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {/* <MenuItem sx={{ color: 'text.secondary' }} onClick={handleEdit}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary='View'
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem> */}
        {
          <MenuItem sx={{ color: 'text.secondary' }} onClick={handleDelete}>
            <ListItemIcon>
              <Icon icon={trash2Outline} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary='Delete'
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </MenuItem>
        }
        <MenuItem
          sx={{ color: 'text.secondary' }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(viewLink, { replace: true });
          }}
        >
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary='Edit'
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
