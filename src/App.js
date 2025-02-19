import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppBar, Toolbar, Button, Drawer, List, ListItem, ListItemText, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import { Edit, Delete, Menu } from "@mui/icons-material";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Students");

  useEffect(() => {
    axios.get("https://reqres.in/api/users").then((response) => {
      setStudents(response.data.data);
    });
  }, []);

  const handleAddStudent = () => {
    if (firstName.trim() === "" || lastName.trim() === "" || email.trim() === "") return;
    axios.post("https://reqres.in/api/users", { first_name: firstName, last_name: lastName, email })
      .then((response) => {
        setStudents([...students, { id: response.data.id, first_name: firstName, last_name: lastName, email }]);
        setFirstName("");
        setLastName("");
        setEmail("");
      });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const confirmDeleteStudent = () => {
    axios.delete(`https://reqres.in/api/users/${deleteId}`)
      .then(() => {
        setStudents(students.filter((student) => student.id !== deleteId));
        setOpen(false);
        setDeleteId(null);
      });
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
            <Menu />
          </IconButton>
          <h3 style={{ flexGrow: 1 }}>Student Management System</h3>
          <Button color="inherit">Sign Out</Button>
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List>
          <ListItem button onClick={() => setSelectedTab("Students")}>
            <ListItemText primary="Students" />
          </ListItem>
        </List>
      </Drawer>

      {selectedTab === "Students" && (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h2>Students</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px", width: "300px" }}>
            <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
            <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <Button variant="contained" color="primary" onClick={handleAddStudent}>Add Student</Button>
          </div>
          <TableContainer component={Paper} style={{ width: "80%" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.first_name}</TableCell>
                    <TableCell>{student.last_name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteClick(student.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this student?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
          <Button onClick={confirmDeleteStudent} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
