export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  let errorMsg = err.message;
  let status = statusCode;

  // Custom Mongoose validation/cast error handling
  if (err.name === 'CastError') {
    status = 404;
    errorMsg = `Resource not found with id: ${err.value}`;
  } else if (err.name === 'ValidationError') {
    status = 400;
    errorMsg = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  res.status(status).json({
    success: false,
    message: errorMsg,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
