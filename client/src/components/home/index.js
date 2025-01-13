import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckIcon from "@mui/icons-material/Check";
import {
  Typography,
  Toolbar,
  Grid,
  Select,
  MenuItem,
  Container,
  TextField,
  Stack,
  Table,
  TableRow,
  TableCell,
  Button,
  Box,
  Modal,
  AppBar,
  IconButton,
  InputLabel,
} from "@mui/material";
import axiosServices from "../../utils/api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};

const Main = () => {
  const [tasks, setTasks] = useState([]);
  const [taskModal, setTaskModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    priority: "",
    status: false,
    deadline: "",
  });
  const [task, setTask] = useState(data);
  useEffect(() => {
    const tasks = async () => {
      await fetchTasks();
    };
    tasks();
  }, []);
  const JWT = localStorage.getItem("token");

  const handleInput = (e) => {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleEditInput = (e) => {
    e.preventDefault();
    setTask({ ...task, [e.target.name]: e.target.value });
  };
  const fetchTasks = async () => {
    try {
      const res = await axiosServices.get("/api/tasks", {
        headers: {
          Authorization: `Bearer ${JWT}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) setTasks(res.data);
      else console.log("Error :", res.status);
    } catch (error) {
      console.error(error);
    }
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosServices.post("/api/tasks", data, {
        headers: {
          Authorization: `Bearer ${JWT}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (res.status === 201) {
        setTaskModal(false);
        alert("Task created successfully");

        await fetchTasks();
      } else {
        alert("Failed to create task. Please check your input.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const navigate = useNavigate();

  const handleDelete = async (task_data) => {
    try {
      const res = await axiosServices.delete(`/api/tasks/${task_data._id}`, {
        headers: {
          Authorization: `Bearer ${JWT}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        await fetchTasks();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (task_data) => {
    setEditModal(true);
    setTask({
      ...task,
      id: task_data.id,
      owner: task_data.owner,
      name: task_data.name,
      description: task_data.description,
      deadline: task_data.deadline,
      status: task_data.status,
      priority: task_data.priority,
    });
  };
  const handleUpdate = async (task_data) => {
    try {
      const res = await axiosServices.put(
        `/api/tasks/${task_data.id}`,
        {
          id: task_data.id,
          owner: task_data.owner,
          name: task_data.name,
          description: task_data.description,
          deadline: task_data.deadline,
          status: task_data.status,
          priority: task_data.priority,
        },
        {
          headers: {
            Authorization: `Bearer ${JWT}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ background: "teal" }}>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Task Management App
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Container sx={{ mt: 5 }}>
        <Button
          variant="outlined"
          onClick={() => setTaskModal(true)}
          sx={{
            "&:hover": {
              backgroundColor: "#0069d9",
              borderColor: "#0062cc",
              color: "#ffff",
              boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
            },
          }}
        >
          Create Task
        </Button>
        <Modal
          open={taskModal}
          onClose={() => setTaskModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h2>Task Details</h2>
            <form>
              <InputLabel>Task Title</InputLabel>
              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Task Title"
                name="name"
                onChange={(e) => handleInput(e)}
                value={data.name}
                fullWidth
                required
                sx={{ mb: 4 }}
              />
              <InputLabel>Task Details</InputLabel>
              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Task Details"
                name="description"
                multiline
                rows={2}
                maxRows={4}
                onChange={(e) => handleInput(e)}
                value={data.description}
                fullWidth
                required
                sx={{ mb: 4 }}
              />
              <Stack direction={"row"} spacing={2} sx={{ mb: 4 }}>
                <Stack direction={"column"} width={"50%"}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    onChange={(e) => handleInput(e)}
                    name="priority"
                    value={data.priority}
                    label="Priority"
                    defaultValue="High"
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </Stack>

                <Stack>
                  <InputLabel>Deadline</InputLabel>
                  <TextField
                    type="date"
                    variant="outlined"
                    color="secondary"
                    label="Task Deadline"
                    name="deadline"
                    onChange={(e) => handleInput(e)}
                    value={data.deadline}
                    fullWidth
                    required
                  />
                </Stack>
              </Stack>
              <Stack container spacing={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  type="submit"
                  onClick={handleCreate}
                >
                  Create Task
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setTaskModal(false)}
                >
                  Cancel
                </Button>
              </Stack>
            </form>
          </Box>
        </Modal>
        <Modal
          open={editModal}
          onClose={() => setEditModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h2>Edit Details</h2>
            <form>
              <InputLabel>Task Title</InputLabel>
              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                name="name"
                onChange={(e) => handleEditInput(e)}
                value={task.name}
                fullWidth
                required
                sx={{ mb: 4 }}
              />
              <InputLabel>Task Details</InputLabel>
              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                name="description"
                multiline
                rows={2}
                maxRows={4}
                onChange={(e) => handleEditInput(e)}
                value={task.description}
                fullWidth
                required
                sx={{ mb: 4 }}
              />

              <Stack
                direction={"row"}
                spacing={2}
                sx={{ marginBottom: "2rem" }}
              >
                <Stack direction={"column"} width={"50%"}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    onChange={(e) => handleInput(e)}
                    name="priority"
                    value={data.priority}
                    defaultValue="High"
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </Stack>
                <Stack direction={"column"} width={"50%"}>
                  <InputLabel>Deadline</InputLabel>
                  <TextField
                    type="date"
                    variant="outlined"
                    color="secondary"
                    name="deadline"
                    onChange={(e) => handleInput(e)}
                    value={data.deadline}
                    fullWidth
                    required
                  />
                </Stack>
              </Stack>
              <Stack container spacing={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  type="submit"
                  onClick={() => handleUpdate(task)}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setEditModal(false)}
                >
                  Cancel
                </Button>
              </Stack>
            </form>
          </Box>
        </Modal>

        <h1>Tasks :</h1>
        <Grid container spacing={2}>
          {tasks && tasks !== undefined && tasks?.length > 0 ? (
            <Table>
              <TableRow>
                <TableCell>Task Title</TableCell>
                <TableCell>Task Details</TableCell>
                <TableCell>Task Priority</TableCell>
                <TableCell>Task Deadline</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
              {tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.deadline}</TableCell>
                  <TableCell>{task.status ? "Completed" : "Ongoing"}</TableCell>
                  <TableCell>
                    <IconButton
                      variant="outlined"
                      onClick={() => handleEdit(task)}
                    >
                      <CheckIcon>Edit</CheckIcon>
                    </IconButton>
                    <IconButton
                      variant="outlined"
                      onClick={() => handleEdit(task)}
                    >
                      <EditIcon>Edit</EditIcon>
                    </IconButton>
                    <IconButton
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(task)}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          ) : (
            <Container sx={{ marginTop: 2 }}>No task found...</Container>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default Main;
