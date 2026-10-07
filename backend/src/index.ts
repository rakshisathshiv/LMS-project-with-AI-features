import app from './app';

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}