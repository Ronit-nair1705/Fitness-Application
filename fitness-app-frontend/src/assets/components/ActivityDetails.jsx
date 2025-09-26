import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getActivityDetail } from '../../services/api';
import { Box, Card, CardContent, Typography, Divider, CircularProgress } from '@mui/material';

const ActivityDetails = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        const response = await getActivityDetail(id);
        setActivity(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchActivityDetail();
  }, [id]);

  if (!activity) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Activity Details
          </Typography>
          <Typography>Type: {activity.type}</Typography>
          <Typography>Duration: {activity.duration} minutes</Typography>
          <Typography>Calories Burned: {activity.caloriesBurned}</Typography>
          <Typography>
            Date: {new Date(activity.createdAt).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>

      {activity.recommendation && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              AI Recommendation
            </Typography>
            <Typography paragraph>{activity.recommendation}</Typography>
          </CardContent>
        </Card>
      )}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          {activity.suggestions?.length > 0 && (
            <>
              <Typography variant="h6">Suggestions</Typography>
              {activity.suggestions.map((s, i) => (
                <Typography key={i} paragraph>• {s}</Typography>
              ))}
            </>
          )}

          {activity.improvements?.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Improvements</Typography>
              {activity.improvements.map((imp, i) => (
                <Typography key={i} paragraph>• {imp}</Typography>
              ))}
            </>
          )}

          {activity.safety?.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Safety Guidelines</Typography>
              {activity.safety.map((s, i) => (
                <Typography key={i} paragraph>• {s}</Typography>
              ))}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivityDetails;
