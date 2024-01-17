import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Checkbox,
  TextField
} from "@mui/material";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import * as React from 'react';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from "axios";

const MyEvents = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const [formData, setFormData] = useState({
    ticketType: '',
    blockedType: [],
    quantity: '',
    section: '',
    priceLevel: '',
  })

  useEffect(() => {
    setFormData({
      ticketType: '',
      blockedType: [],
      quantity: '',
      section: '',
      priceLevel: '',
    })
  }, [selectedEvent?._id])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const { token } = useAuth()
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState({
    status: false,
    event: null
  });

  const [events, setEvents] = useState([])
  const deleteForm = useForm();

  const columns = [
    {
      field: "name",
      headerName: "Event Name",
      width: 150,
      type: "string",
    },
    {
      field: "date",
      headerName: "Event Date",
      width: 200,
      type: "string",
    },

    {
      field: "place",
      headerName: "Event Place",
      width: 200,
      type: "string",
    },

    {
      field: "url",
      headerName: "Url",
      width: 150,
      type: "string",
    }
  ];

  const handleCloseDeleteDialog = () => {
    setOpenDialog({ event: null, status: false });
  };

  const handleCreateWatch = async () => {
    setIsSubmitting(true)
    try {

      const res = await axios.post(`${process.env.REACT_APP_BACKEND_SERVER}/add-watch`, { ...formData, _id: openDialog?.event?._id }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.data

      if (!data.status) return alert(data.message)

      setOpenDialog({ status: false, event: null })

      setEvents(prev => {
        return prev.map(ev => {
          if (ev._id === selectedEvent._id) {
            return {
              ...data.event
            }
          } else {
            return ev
          }
        })
      })
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false)
    }
  };

  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/events`, {
          headers: {
            'authorization': `Bearer ${token}`
          }
        })
        const data = await res.json()
        console.log(data)
        setEvents(data)
      } catch (err) {
      }
    }
    getEvents()
  }, [])

  const handleDeleteWatch = async (id, row) => {
    try {
      console.log("selected", row)
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_SERVER}/delete-watch`, { eventId: row._id, watchId: id }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await res.data
      if (!data.status) return
      setEvents(prev => {
        return prev.map(ev => {
          if (ev?._id === selectedEvent?._id) {
            return {
              ...ev,
              watches: ev.watches.filter(watch => watch?._id !== id)
            }
          }
          else {
            return ev
          }
        })
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <Box>
      <Dialog open={openDialog.status} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '2em' }}>
          <Typography>
            Event Name: {openDialog.event?.name}
          </Typography>
          <Typography>
            Event Place: {openDialog.event?.place}
          </Typography>
          <Typography>
            Event Date: {openDialog.event?.date}
          </Typography>
          <Typography>
            Specify Criteria for this watch:
          </Typography>

          <Box>

            <FormControl fullWidth style={{ display: 'flex', flexDirection: 'column' }}>
              <InputLabel id="demo-simple-select-label">Ticket Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Ticket Type"
                name='ticketType'
                value={formData.ticketType}
                onChange={(e) => handleChange(e)}
              >

                {
                  openDialog.event?.ticketTypeArr.map(nbr => {
                    return (

                      <MenuItem value={nbr} key={nbr}>{nbr}</MenuItem>
                    )
                  })
                }

              </Select>
            </FormControl>
          </Box>


          <Box className={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1em' }}>
            <Typography>
              Blocked Ticket Types
            </Typography>
            <FormControl

              className={{}}>
              {
                openDialog.event?.blockedTypeArr.map(type => (
                  <Box style={{ display: 'flex', alignItems: 'center' }}>

                    <Checkbox
                      value={type}
                      id={type}
                      onChange={(e) => {
                        e.target.checked ? setFormData(prev => ({ ...prev, blockedType: [...prev.blockedType, type] })) : setFormData(prev => ({ ...prev, blockedType: prev.blockedType.filter(e => e === type) }))
                      }}

                    />
                    <label for={type}>{type}</label>
                  </Box>
                ))
              }
            </FormControl>
          </Box>

          <Box>

            <FormControl fullWidth style={{ display: 'flex', alignItemsflexDirection: 'column' }}>
              <InputLabel id="demo-simple-select-label">Quantity</InputLabel>
              <Select
                name='quantity'
                onChange={(e) => handleChange(e)}
                value={formData.quantity}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Quantity"
              >

                {
                  [1, 2, 3, 4, 5, 6, 7, 8].map(nbr => {
                    return (

                      <MenuItem value={nbr} key={nbr}>{nbr}</MenuItem>
                    )
                  })
                }

              </Select>
            </FormControl>
          </Box>

          <Box>
            <FormControl fullWidth style={{ display: 'flex', alignItemsflexDirection: 'column' }}>
              <InputLabel id="Section">Section</InputLabel>
              <Select
                name='section'
                onChange={(e) => handleChange(e)}
                value={formData.section}
                labelId="Section"
                id="sectionid"
                label="Section"
              >

                {
                  openDialog.event?.sectionArr.map(nbr => {
                    return (

                      <MenuItem value={nbr} key={nbr}>{nbr}</MenuItem>
                    )
                  })
                }

              </Select>
            </FormControl>
          </Box>       

          <Box>
            <FormControl fullWidth style={{ display: 'flex', alignItemsflexDirection: 'column' }}>
              <InputLabel id="priceLevel">Price Level:</InputLabel>
              <Select
                name='priceLevel'
                onChange={(e) => handleChange(e)}
                value={formData.priceLevel}
                labelId="priceLevel"
                id="price_Level"
                label="priceLevel"
              >

                {
                  openDialog.event?.priceArr.map(nbr => {
                    return (

                      <MenuItem value={nbr} key={nbr}>{nbr}</MenuItem>
                    )
                  })
                }

              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            component="form"
            onSubmit={deleteForm.handleSubmit(handleCreateWatch)}
          >
            <Button variant="text" onClick={handleCloseDeleteDialog}>
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              color="error"
              type="submit"
              loading={isSubmitting}
            >
              Add Watch
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              gap: 1,
            }}
          >
            <Box gap={1} display="flex">
              <Button
                variant="contained"
                onClick={() => navigate("/myevents/new")}
              >
                Create
              </Button>
            </Box>
          </Box>


          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Event Name</TableCell>
                  <TableCell align="left">Event Date</TableCell>
                  <TableCell align="left">Event Place</TableCell>
                  <TableCell align="left">Url</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events?.map((row) => (
                  <Row handleDeleteWatch={handleDeleteWatch} setSelectedEvent={setSelectedEvent} setOpenDialog={setOpenDialog} key={row.name} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};


function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="left">{row.date}</TableCell>
        <TableCell align="left">{row.place}</TableCell>
        <TableCell align="left">
          <Link to={row.url}>
            {row.url}
          </Link>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Box style={{ display: 'flex', flexDirection: 'column' }}>
                {
                  row.watches?.length ? row.watches?.map(watch => (
                    <Box style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', justifyContent: 'normal', gap: '2px' }}>
                      <Typography>
                        {`${watch.ticketType} /`}
                      </Typography>
                      <Typography>

                        {`${watch.priceLevel} /`}
                      </Typography>
                      <Typography>
                        {`${watch.section} /`}
                      </Typography>
                      <Typography>
                        {`${watch.quantity} ticket(s)`}
                      </Typography>

                      <Typography>
                        <Link onClick={() => {
                          props.setSelectedEvent(row)
                          props.handleDeleteWatch(watch._id, row)
                        }} style={{ color: 'lightblue' }}>
                          delete
                        </Link>
                      </Typography>
                    </Box>

                  )) : null
                }
              </Box>
              <Link onClick={() => {
                props.setOpenDialog({ status: true, event: row })
                props.setSelectedEvent(row)
              }}>
                Add New Watch for this event

              </Link>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}


export default MyEvents;
