import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Paper,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Person as PersonIcon } from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoDescription, setNewRepoDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user data and repositories
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const userResponse = await axios.get('http://localhost:8000/api/v1/users/me',
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );
        setUser(userResponse.data.data);
        const reposResponse = await axios.get('http://localhost:8000/api/v1/repos/repo/get',
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );
        console.log('API Response:', reposResponse.data);
        const reposData = reposResponse.data.data || [];
        setRepos(reposData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
        setRepos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateRepo = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/repos/repo',
        {
          name: newRepoName,
          description: newRepoDescription,
          isPublic: isPublic
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.statusCode === 200) {
        setOpenDialog(false);
        setNewRepoName('');
        setNewRepoDescription('');
        setIsPublic(true);
        // Refresh repositories list
        const reposResponse = await axios.get('http://localhost:8000/api/v1/repos/repo/get', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        const reposData = reposResponse.data.data || [];
        setRepos(reposData);
      }
    } catch (error) {
      console.error('Error creating repository:', error);
      setError(error.response?.data?.message || 'Failed to create repository. Please try again.');
    }
  };

  // Function to get the avatar URL
  const getAvatarUrl = () => {
    if (!user?.avatar) return null;
    // If avatar is a full URL, return it directly
    if (user.avatar.startsWith('http')) return user.avatar;
    // If avatar is a path, prepend the API base URL
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${apiUrl}${user.avatar}`;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* User Profile Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={getAvatarUrl()}
              alt={user?.username || 'User'} 
              sx={{ width: 100, height: 100 }}
            >
              {!getAvatarUrl() && <PersonIcon sx={{ fontSize: 50 }} />}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1">
                {user?.username || 'Loading...'}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {user?.email || ''}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Repositories Section */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              Your Repositories
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              New Repository
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ p: 2 }}>
              {error}
            </Typography>
          ) : repos.length === 0 ? (
            <Typography sx={{ p: 2, color: 'text.secondary' }}>
              No repositories found. Create your first repository!
            </Typography>
          ) : (
            <List>
              {repos.map((repo) => (
                <ListItem 
                  key={repo._id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      cursor: 'pointer'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {repo.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={repo.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {repo.description || 'No description'}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          {repo.isPublic ? 'Public' : 'Private'} • Last updated: {new Date(repo.updatedAt).toLocaleDateString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* Create Repository Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create New Repository</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                label="Repository Name"
                fullWidth
                value={newRepoName}
                onChange={(e) => setNewRepoName(e.target.value)}
                required
              />
              <TextField
                margin="dense"
                label="Description (Optional)"
                fullWidth
                multiline
                rows={3}
                value={newRepoDescription}
                onChange={(e) => setNewRepoDescription(e.target.value)}
              />
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Visibility:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    id="public"
                    name="visibility"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                  />
                  <label htmlFor="public" style={{ marginLeft: '8px', marginRight: '16px' }}>
                    Public
                  </label>
                  <input
                    type="radio"
                    id="private"
                    name="visibility"
                    checked={!isPublic}
                    onChange={() => setIsPublic(false)}
                  />
                  <label htmlFor="private" style={{ marginLeft: '8px' }}>
                    Private
                  </label>
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateRepo} 
              variant="contained"
              disabled={!newRepoName}
            >
              Create Repository
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Dashboard;
