"use client"; // This is a client component 👈🏽
import Container from '@mui/material/Container';
import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';

import $axios from '../../utils/axios';
import { useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import { v4 as uuidv4 } from 'uuid';
import format from 'date-fns/format';
import CircularProgress from '@mui/material/CircularProgress';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignee: {
    userId: string;
    displayName: string;
  };
  priorityLevel: 'high' | 'medium' | 'low';
  notes: string;
  status: 'pending' | 'in progress' | 'completed' | 'canceled ';
}

function createTask(
  id: string,
  title: string,
  description: string,
  dueDate: string,
  assignee: { userId: string; displayName: string },
  priorityLevel: 'high' | 'medium' | 'low',
  notes: string,
  status: 'pending' | 'in progress' | 'completed'
): Task {
  return {
    id,
    title,
    description,
    dueDate,
    assignee,
    priorityLevel,
    notes,
    status,
  };
}

interface Data {
  id: number;
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

function createData(
  id: number,
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
): Data {
  return {
    id,
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}




interface HeadCell {
  disablePadding: boolean;
  id: keyof Task;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: 'Id',
  },
  {
    id: 'title',
    numeric: false,
    disablePadding: false,
    label: 'Title',
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Description',
  },
  {
    id: 'dueDate',
    numeric: false,
    disablePadding: false,
    label: 'Due Date',
  },
  {
    id: 'priorityLevel',
    numeric: false,
    disablePadding: false,
    label: 'Priority Level',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'status',
  },
  {
    id: 'edit',
    numeric: false,
    disablePadding: false,
    label: 'Edit',
  },
  {
    id: 'delete',
    numeric: false,
    disablePadding: false,
    label: 'Delete',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onDeleteClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {  order, orderBy, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Task) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  title: string
  table_event: string
  onClick: () => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, title, table_event , onClick} = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {title == 'Task List'? (
        <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
        >
        Task List
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {table_event == 'add' ? 'Add Task List' : ''}
          {table_event == 'edit' ? 'Edit Task List' : ''}
        </Typography>
      )}
    
      {table_event == 'view' ? ( <Button variant="contained" onClick={onClick} ><AddIcon /> Create Task</Button> 
      ) : <div></div>}
    </Toolbar>
  );
}
export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Task>('title');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [table_event, setEvent] = React.useState('loading');
  const [task, setTask] = React.useState<Task>();
  const [default_date, setDefault_date] =  React.useState<Date>();
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(0);
  useEffect(() => {
    const fetchTasks = async () => {
      try {


          const response = await $axios.get('/api'); 
          

        setTasks(response.data);
        setEvent('view')
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [], );
 
  const handleUpdate = async(data) => {
    try{

    const response_update = await $axios.put('/api/update',data); 
    const response_data = await $axios.get('/api'); 
          
    console.log(response_update.data);
    setTasks(response_data.data);
    }catch(e){
      console.log('there was an error updating tasklist');
    }

  };
  const handleDateChange = (date) => {

    // Update the specific property of the task object
    setTask((prevTask) => ({
      ...prevTask,
      dueDate:format(date.$d, 'yyyy-MM-dd'),
    }));


  };

  const handleAddClick = () => {

    setEvent('add');
    setTask(createTask('', '', '', '', { userId: '', displayName: '' }, 'low', '', 'pending'));


  };
  const handleSaveClick = () => {
   
    setEvent('loading')
    let uid =  uuidv4();
    task.id = uid;
    check_if_id_already_exist(task.id);
    let TaskList = tasks;
    TaskList.push(task);
    // setTasks((prevTasks) => [...prevTasks, task]);
    setTasks(TaskList);
    setTask(createTask('', '', '', '', { userId: '', displayName: '' }, 'low', '', 'pending'));
    setEvent('view');
    handleUpdate(TaskList);

  };

  const edit_items = (data)=> {

   
   let task = data;
   setTask(task);
   setEvent('edit');
  
  }
  const delete_item = (data)=> {

    let tasksList = tasks.filter(task => task.id !== data.id);
    setTasks(tasksList);
    handleUpdate(tasksList);
   }

  const check_if_id_already_exist = (id:string): boolean => {
  
   if(tasks.length == 0 ){
    return false;
   }

   let task_id = tasks.find((task) => task.id === id);

    if(!task_id){
      return false;
    }else {
     let uid = uuidv4();
     task.id = uid;

      return check_if_id_already_exist(uid);

    }




  }
  const handleUpdateClick = () => {

    
    setEvent('loading')
    let tasksList = tasks.map(t => {
     
      if (t.id === task.id) {
        return task ;
      }

      return t;
    });

    setTasks(tasksList);
    handleUpdate(tasksList);
    setTask(createTask('', '', '', '', { userId: '', displayName: '' }, 'low', '', 'pending'));
    setEvent('view');
   
  
  };
  const handleCancelClick = () => {
  
    setEvent('view');
    setTask(createTask('', '', '', '', { userId: '', displayName: '' }, 'low', '', 'pending'));

  };
  const handleFieldChange = (field: keyof Task, value: string) => {
    setTask((prevTask) => ({
      ...prevTask,
      [field]: value,
    }));
  
   
  };
  const handleAssigneeChange = (field: keyof Assignee, value: string) => {
    setTask((prevTask) => ({
      ...prevTask,
      assignee: {
        ...prevTask.assignee,
        [field]: value,
      },
    }));
  };


  const isSelected = (id: number) => selected.indexOf(id) !== -1;

 
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Task,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    sortByProperty(orderBy,order);

  };

  const sortByProperty = (property, order = 'asc') => {
    const sortOrder = order === 'desc' ? -1 : 1;
  
    return tasks.sort((a, b) => {
      const aValue = a[property];
      const bValue = b[property];
  
      if (aValue < bValue) {
        return -1 * sortOrder;
      }
      if (aValue > bValue) {
        return 1 * sortOrder;
      }
      return 0;
    });
  };


  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >

        <br />
        <Typography variant="h6" component="div"> Your Task  Here </Typography>
        <br />
        
        {table_event == 'loading' ? (   <Box  sx={{
          my: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        
      <CircularProgress />
    </Box>
     ) : <div></div>}
        {table_event == 'view' ? (
          <Paper sx={{ width: '100%', mb: 10 }}>
            <EnhancedTableToolbar table_event={table_event} onClick={handleAddClick}  title='Task List' numSelected={selected.length} />
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
              >
                <EnhancedTableHead
                  
                  order={order}
                  orderBy={orderBy}
                 
                  onRequestSort={handleRequestSort}
                  rowCount={tasks.length}
                />
                <TableBody>
                  {tasks.map((row, index) => {
                    const isItemSelected = isSelected(index + 1);
                    const labelId = `enhanced-table-checkbox-${index + 1}`;

                    return (
                      <TableRow
                        hover
                  
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer'}}
                      >
                
                         
        
                      
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                       
                        >
                          {row.id}
                        </TableCell>
                        <TableCell align="left">{row.title}</TableCell>
                        <TableCell align="left">{row.description}</TableCell>
                        <TableCell align="left">{row.dueDate}</TableCell>
                        <TableCell align="left">{row.priorityLevel}</TableCell>
                      
                        <TableCell align="left">{row.status}</TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton  onClick={() => edit_items(row)}>
                              <EditIcon   />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                        <Tooltip title="Delete">
            <IconButton  onClick={() => delete_item(row)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
                          </TableCell>

                    
                      </TableRow>
                    );
                  })}
                 
                </TableBody>
              </Table>
            </TableContainer>

         
          </Paper>
        ) : <div></div>}
        {table_event == 'add' || table_event == 'edit' ? (
          <Paper sx={{ width: '100%', mb: 10, padding: 10 }}>

            <EnhancedTableToolbar table_event={table_event} title='Add Task List' numSelected={selected.length} />
            <hr />
            <div>
              <TextField

                id="outlined-required"
                label="title"
                fullWidth
                value={task.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}

              />
              <br />
              <br />
              <TextField

                id="outlined-required"
                label="description"
                fullWidth
                value={task.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}

              />
              <br />
              <br />
              <LocalizationProvider dateAdapter={AdapterDayjs} >
              <div style={{ width: '100%' }}>
                <DatePicker label="Due Date"   inputFormat="yyyy-MM-dd"   value={dayjs(default_date)}  style={{ width: '100%' }} onChange={handleDateChange}  slotProps={{ textField: { variant: 'outlined' } }} />
              </div>
              </LocalizationProvider>
              <br />
              <br />
             
                     <InputLabel >Priority Level</InputLabel>
        <Select
         
          
         value={task.priorityLevel}
          input={<OutlinedInput label="Priority Level" />}
          style={{ width: '100%' }}
          onChange={(e) => handleFieldChange('priorityLevel', e.target.value)}


        >
        <MenuItem value="" disabled>Select Priority Level</MenuItem>
        <MenuItem value="high">high</MenuItem>
        <MenuItem value="medium">medium</MenuItem>
        <MenuItem value="low">low</MenuItem>
       

        </Select>

              <br />
              <br />


              <TextareaAutosize
                minRows={3}
                label="Notes"
                placeholder ="Notes"
                value={task.notes}
                style={{ width: '100%' }}
                onChange={(e) => handleFieldChange('notes', e.target.value)}

              />
              <br />
              <br />   
              

        <InputLabel id="demo-multiple-name-label">Status</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          
          value={task.status}
          input={<OutlinedInput label="Status" />}
          style={{ width: '100%' }}
          onChange={(e) => handleFieldChange('status', e.target.value)}

        >
        <MenuItem value="" disabled>Select status</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
        <MenuItem value="in progress">In Progress</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
        <MenuItem value="canceled">Canceled</MenuItem>

        </Select>


              <Box sx={{ padding: 1 }}>
                <div  >
                  <h4>Assignee<hr /></h4>

                  <TextField

                    id="outlined-required"
                    label="userid"
                    fullWidth
                    value={task.assignee.userId}
                    onChange={(e) => handleAssigneeChange('userId', e.target.value)}
                  />
                  <br />
                  <br />
                  <TextField

                    id="outlined-required"
                    label="displayName"
                    fullWidth
                    value={task.assignee.displayName}
                    onChange={(e) => handleAssigneeChange('displayName', e.target.value)}
                  />
                </div>
              </Box>
              <br />
              <br />
              <br />
              <br />


            </div>
            {table_event == 'edit' ? ( <Button variant="contained" onClick={handleUpdateClick} color="primary">Update </Button>):<div></div>}

            {table_event == 'add' ? (<Button variant="contained" onClick={handleSaveClick} color="primary">Save </Button>):<div></div>}
          
            <Button variant="contained"  onClick={handleCancelClick} color="primary">Cancel</Button>
          </Paper>
        ) : <div></div>}
      </Box>
    </Container>
  );
}
