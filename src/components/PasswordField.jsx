import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, IconButton, InputAdornment, LinearProgress, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { analyzePassword } from '../utils/password';

const COLORS = ['#A65D4E', '#A65D4E', '#C4A35A', '#7A9A7E', '#3E5A43'];

export default function PasswordField({
  value,
  onChange,
  label = 'Пароль',
  name = 'password',
  autoComplete = 'current-password',
  showStrength = false,
  context,
  helperText,
  required = true,
  id,
  ...rest
}) {
  const [visible, setVisible] = useState(false);
  const [caps, setCaps] = useState(false);
  const analysis = useMemo(
    () => (showStrength ? analyzePassword(value, context) : null),
    [showStrength, value, context],
  );

  return (
    <Box sx={{ my: 1 }}>
      <TextField
        id={id}
        fullWidth
        required={required}
        label={label}
        name={name}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        spellCheck={false}
        inputProps={{
          autoCapitalize: 'off',
          autoCorrect: 'off',
          maxLength: 128,
        }}
        onKeyUp={(e) => setCaps(Boolean(e.getModifierState?.('CapsLock')))}
        onKeyDown={(e) => setCaps(Boolean(e.getModifierState?.('CapsLock')))}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={visible ? 'Сховати пароль' : 'Показати пароль'}
                onClick={() => setVisible((v) => !v)}
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
              >
                {visible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        helperText={helperText}
        {...rest}
      />
      {caps && (
        <Typography variant="caption" color="warning.main">
          Увімкнено Caps Lock
        </Typography>
      )}
      {analysis && value && (
        <>
          <LinearProgress
            variant="determinate"
            value={analysis.score * 25}
            sx={{
              mt: 1,
              height: 8,
              borderRadius: 99,
              bgcolor: 'rgba(74,44,26,0.12)',
              '& .MuiLinearProgress-bar': { bgcolor: COLORS[analysis.score], borderRadius: 99 },
            }}
          />
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
            Складність: {analysis.label}
          </Typography>
          {analysis.issues.length > 0 && (
            <Typography variant="caption" color="text.secondary" component="ul" sx={{ m: 0, pl: 2 }}>
              {analysis.issues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
