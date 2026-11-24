import {
  Box, Button, Card, CardContent, Checkbox, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import PageHeader from '../../components/PageHeader';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDeleteAnalysisMutation, useDeleteHistoryMutation, useGetHistoryQuery, useGetModelsQuery, useReanalyzeMutation } from '../../services/apiEndpoints';
import { downloadAuth, labelUa, pct } from '../../utils/labels';

export default function HistoryPage() {
  const token = useSelector((s) => s.auth.token);
  const confirmBulk = useSelector((s) => s.settings.confirmBulkDelete);
  const [q, setQ] = useState('');
  const [label, setLabel] = useState('');
  const [language, setLanguage] = useState('');
  const [model, setModel] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minC, setMinC] = useState('');
  const [sort, setSort] = useState('created_at');
  const [page, setPage] = useState(0);
  const [sel, setSel] = useState([]);
  const { data: models = [] } = useGetModelsQuery();
  const { data = [], isLoading, refetch } = useGetHistoryQuery({
    q: q || undefined,
    label: label || undefined,
    language: language || undefined,
    model_version_id: model || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    min_confidence: minC || undefined,
    sort,
    order: 'desc',
    skip: page * 20,
    limit: 20,
  });
  const [delOne] = useDeleteAnalysisMutation();
  const [delMany] = useDeleteHistoryMutation();
  const [reanalyze] = useReanalyzeMutation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));

  const bulk = async () => {
    if (confirmBulk && !window.confirm('Видалити вибрані записи?')) return;
    await delMany(sel);
    setSel([]);
  };

  return (
    <Box>
      <PageHeader title="Історія аналізів" />
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <TextField size="small" label="Пошук" value={q} onChange={(e) => setQ(e.target.value)} />
        <TextField size="small" select label="Клас" value={label} onChange={(e) => setLabel(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="">Усі</MenuItem>
          <MenuItem value="SARCASM">Сарказм</MenuItem>
          <MenuItem value="NOT_SARCASM">Без</MenuItem>
          <MenuItem value="UNCERTAIN">Невизн.</MenuItem>
        </TextField>
        <TextField size="small" select label="Мова" value={language} onChange={(e) => setLanguage(e.target.value)} sx={{ minWidth: 120 }}>
          <MenuItem value="">Усі</MenuItem>
          <MenuItem value="uk">uk</MenuItem>
          <MenuItem value="en">en</MenuItem>
        </TextField>
        <TextField size="small" select label="Модель" value={model} onChange={(e) => setModel(e.target.value)} sx={{ minWidth: 160 }}>
          <MenuItem value="">Усі</MenuItem>
          {models.map((m) => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
        </TextField>
        <TextField size="small" type="date" label="Від" InputLabelProps={{ shrink: true }} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <TextField size="small" type="date" label="До" InputLabelProps={{ shrink: true }} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        <TextField size="small" label="Мін. впевненість" value={minC} onChange={(e) => setMinC(e.target.value)} />
        <TextField size="small" select label="Сортування" value={sort} onChange={(e) => setSort(e.target.value)}>
          <MenuItem value="created_at">Дата</MenuItem>
          <MenuItem value="sarcasm_probability">Ймовірність</MenuItem>
        </TextField>
        <Button onClick={() => downloadAuth('/history/export-file/csv', 'history.csv', token)}>Експорт</Button>
        <Button color="error" disabled={!sel.length} onClick={bulk}>Масове видалення</Button>
      </Box>
      {isLoading ? 'Завантаження...' : mobile ? (
        <Stack spacing={1.5}>
          {data.map((row) => (
            <Card key={row.id}>
              <CardContent>
                <Stack direction="row" alignItems="flex-start" spacing={1}>
                  <Checkbox checked={sel.includes(row.id)} onChange={(e) => setSel(e.target.checked ? [...sel, row.id] : sel.filter((x) => x !== row.id))} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography>{row.original_text}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {labelUa(row.label)} · {pct(row.sarcasm_probability)} · {row.language}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                      <Button size="small" component={Link} to={`/analysis/${row.id}`}>Перегляд</Button>
                      <Button size="small" onClick={() => reanalyze(row.id)}>Повтор</Button>
                      <Button size="small" color="error" onClick={() => delOne(row.id)}>Видалити</Button>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <Box className="table-wrap">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Заголовок</TableCell>
                <TableCell>Клас</TableCell>
                <TableCell>Ймовірність</TableCell>
                <TableCell>Мова</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell><Checkbox checked={sel.includes(row.id)} onChange={(e) => setSel(e.target.checked ? [...sel, row.id] : sel.filter((x) => x !== row.id))} /></TableCell>
                  <TableCell>{row.original_text?.slice(0, 80)}</TableCell>
                  <TableCell>{labelUa(row.label)}</TableCell>
                  <TableCell>{pct(row.sarcasm_probability)}</TableCell>
                  <TableCell>{row.language}</TableCell>
                  <TableCell>{row.created_at?.slice(0, 19)}</TableCell>
                  <TableCell>
                    <Button size="small" component={Link} to={`/analysis/${row.id}`}>Перегляд</Button>
                    <Button size="small" onClick={() => reanalyze(row.id)}>Повтор</Button>
                    <Button size="small" color="error" onClick={() => delOne(row.id)}>Видалити</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
      <Box sx={{ mt: 2 }}>
        <Button disabled={page === 0} onClick={() => setPage(page - 1)}>Назад</Button>
        <Button disabled={data.length < 20} onClick={() => setPage(page + 1)}>Далі</Button>
        <Button onClick={() => refetch()}>Оновити</Button>
      </Box>
    </Box>
  );
}
