import app from './app';

const PORT = process.env.PORT || 5000;

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}
