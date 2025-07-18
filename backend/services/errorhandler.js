const errorHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next))
        .catch((err) => {
            console.error('Error:', err);
            
            // Handle different types of errors
            if (err.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    error: 'Validation Error',
                    message: err.message
                });
            }
            
            if (err.name === 'CastError') {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid ID format',
                    message: 'Resource not found'
                });
            }
            
            if (err.code === 11000) {
                return res.status(400).json({
                    success: false,
                    error: 'Duplicate field value',
                    message: 'Resource already exists'
                });
            }
            
            // Default server error
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                message: err.message || 'Something went wrong'
            });
        });
    }
}

export default errorHandler;