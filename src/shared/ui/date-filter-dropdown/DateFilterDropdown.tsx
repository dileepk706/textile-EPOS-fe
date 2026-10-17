import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

export type DateFilterOption =
  | 'any'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'before_date';

export interface DateFilterValue {
  option: DateFilterOption;
  /** Only set when option === 'before_date' */
  date?: string;
}

interface DateFilterDropdownProps {
  label?: string;
  value: DateFilterValue;
  onChange: (value: DateFilterValue) => void;
}

const OPTIONS: { label: string; value: DateFilterOption }[] = [
  { label: 'Any time', value: 'any' },
  { label: 'Older than 7 days', value: 'last_7_days' },
  { label: 'Older than 30 days', value: 'last_30_days' },
  { label: 'Older than 90 days', value: 'last_90_days' },
  { label: 'Before date…', value: 'before_date' },
];

/**
 * Reusable date-filter dropdown.
 * Matches the UI shown in the reference screenshot (any-time / older-than / before-date).
 */
export default function DateFilterDropdown({
  label = 'Updated',
  value,
  onChange,
}: DateFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const selectedLabel = OPTIONS.find((o) => o.value === value.option)?.label ?? 'Any time';

  const handleToggle = () => setOpen((prev) => !prev);

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) return;
    setOpen(false);
  };

  const handleSelect = (option: DateFilterOption) => {
    if (option !== 'before_date') {
      onChange({ option });
      setOpen(false);
    } else {
      // Keep open so user can pick a date
      onChange({ option, date: value.date });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ option: 'before_date', date: e.target.value });
  };

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        {label}
      </Typography>

      <Button
        ref={anchorRef}
        variant="outlined"
        size="small"
        endIcon={<KeyboardArrowDownIcon />}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        sx={{
          minWidth: 160,
          justifyContent: 'space-between',
          color: 'text.primary',
          borderColor: 'gray',
          fontWeight: 400,
          textTransform: 'none',
        }}
      >
        {selectedLabel}
      </Button>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        transition
        sx={{ zIndex: 1300, minWidth: 200 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'top left' }}>
            <Paper elevation={4} sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList dense disablePadding sx={{ py: 0.5 }}>
                  {OPTIONS.map((opt, idx) => {
                    const isSelected = value.option === opt.value;

                    if (opt.value === 'before_date') {
                      return (
                        <Box key={opt.value}>
                          {idx > 0 && <Divider sx={{ my: 0.5 }} />}
                          <MenuItem onClick={() => handleSelect(opt.value)} sx={{ gap: 1, pr: 2 }}>
                            <Box sx={{ width: 20, display: 'flex', alignItems: 'center' }}>
                              {isSelected && <CheckIcon fontSize="small" color="warning" />}
                            </Box>
                            {opt.label}
                          </MenuItem>
                          {value.option === 'before_date' && (
                            <Box sx={{ px: 2, pb: 1 }}>
                              <TextField
                                type="date"
                                size="small"
                                value={value.date ?? ''}
                                onChange={handleDateChange}
                                onClick={(e) => e.stopPropagation()}
                                fullWidth
                              />
                            </Box>
                          )}
                        </Box>
                      );
                    }

                    return (
                      <MenuItem
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        sx={{ gap: 1, pr: 2 }}
                      >
                        <Box sx={{ width: 20, display: 'flex', alignItems: 'center' }}>
                          {isSelected && <CheckIcon fontSize="small" color="warning" />}
                        </Box>
                        {opt.label}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}
