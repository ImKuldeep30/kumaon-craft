export const validateRegisterInput = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Name is required and must be a valid string');
  }

  if (!email) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please provide a valid email address');
    }
  }

  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!role) {
    errors.push('Role is required');
  } else if (role !== 'artisan' && role !== 'buyer') {
    errors.push('Role must be either artisan or buyer');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', '),
      errors: errors,
    });
  }

  next();
};

export const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please provide a valid email address');
    }
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', '),
      errors: errors,
    });
  }

  next();
};
