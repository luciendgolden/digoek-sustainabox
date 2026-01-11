import { Box, CircularProgress } from "@mui/joy";

const Loading = () => {
    return (
        <Box
        sx={{
          display: 'flex',
          justifyContent: 'center', // Center horizontally
          alignItems: 'center',     // Center vertically
          minHeight: '100vh',       // Take full viewport height
        }}
      >
        <CircularProgress />
      </Box>
    )
}

export default Loading;