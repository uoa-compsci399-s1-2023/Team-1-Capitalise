import { Category, DateRange, EmojiEvents } from "@mui/icons-material";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";

interface Props {
  categoryCount: number;
  semesterCount: number;
  awardCount: number;
}

const DashboardOverview = ({
  categoryCount,
  semesterCount,
  awardCount,
}: Props) => {
  return (
    <Stack height="100%">
      <Box padding="15px 24px 10px 24px" minHeight="10%" width="100%">
        <Typography paddingTop={2} variant="h6">
          Summary
        </Typography>

        <Grid container spacing={3} paddingTop={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4">Categories</Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Category
                  color="primary"
                  sx={{ height: 100, width: 100, opacity: 0.8, mr: 1 }}
                />
                <Typography variant="h4">{categoryCount}</Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4">Semesters</Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DateRange
                  color="primary"
                  sx={{ height: 100, width: 100, opacity: 0.8, mr: 1 }}
                />
                <Typography variant="h4">{semesterCount}</Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4">Awards</Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <EmojiEvents
                  color="primary"
                  sx={{ height: 100, width: 100, opacity: 0.8, mr: 1 }}
                />
                <Typography variant="h4">{awardCount}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Typography paddingTop={10} variant="h6">
          {/* Show newly created projects over a timeframe (maybe for the week??) */}
          Recently created projects
        </Typography>
      </Box>
    </Stack>
  );
};

export default DashboardOverview;
