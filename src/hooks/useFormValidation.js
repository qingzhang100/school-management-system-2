import { useState, useEffect } from "react";

// 验证规则对象
const validationRules = {
  UserName: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    messages: {
      required: "Username is required",
      minLength: "Username must be at least 3 characters",
      maxLength: "Username must be less than 20 characters",
      pattern: "Username can only contain letters, numbers and underscore",
    },
  },
  PasswordHash: {
    required: true,
    minLength: 8,
    patterns: [
      {
        pattern: /(?=.*[a-z])/,
        message: "Password must contain at least one lowercase letter",
      },
      {
        pattern: /(?=.*[A-Z])/,
        message: "Password must contain at least one uppercase letter",
      },
      {
        pattern: /(?=.*\d)/,
        message: "Password must contain at least one number",
      },
      {
        pattern: /(?=.*[@$!%*?&])/,
        message: "Password must contain at least one special character",
      },
    ],
    messages: {
      required: "Password is required",
      minLength: "Password must be at least 8 characters",
    },
  },
  FirstName: {
    required: true,
    pattern: /^[a-zA-Z\s]+$/,
    messages: {
      required: "First name is required",
      pattern: "First name can only contain letters and spaces",
    },
  },
  LastName: {
    required: true,
    pattern: /^[a-zA-Z\s]+$/,
    messages: {
      required: "Last name is required",
      pattern: "Last name can only contain letters and spaces",
    },
  },
  DateOfBirth: {
    required: true,
    validate: (value) => {
      const dob = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 16) return "Must be at least 16 years old";
      if (age > 100) return "Invalid date of birth";
      return "";
    },
    messages: {
      required: "Date of birth is required",
    },
  },
  PhoneNumber: {
    required: true,
    pattern: /^\+?[\d\s-]{10,}$/,
    messages: {
      required: "Phone number is required",
      pattern: "Invalid phone number format",
    },
  },
  HomeAddress: {
    required: true,
    minLength: 10,
    messages: {
      required: "Address is required",
      minLength: "Please enter a complete address",
    },
  },
  Email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    messages: {
      required: "Email is required",
      pattern: "Invalid email format",
    },
  },
  SecurityQuestion: {
    required: true,
    minLength: 10,
    messages: {
      required: "Security question is required",
      minLength: "Security question must be at least 10 characters",
    },
  },
  SecurityAnswer: {
    required: true,
    minLength: 3,
    messages: {
      required: "Security answer is required",
      minLength: "Security answer must be at least 3 characters",
    },
  },
  RoleName: {
    required: true,
    validate: (value) => {
      if (!value || value === "Select a role") return "Please select a role";
      return "";
    },
  },
  IsAdmin: {
    required: true,
    validate: (value) => {
      if (value === null) return "Please select admin status";
      return "";
    },
  },
};

// 验证单个字段的函数
const validateField = (name, value) => {
  const rules = validationRules[name];
  if (!rules) return "";

  // 检查必填
  if (rules.required && !value) {
    return rules.messages.required;
  }

  // 检查最小长度
  if (rules.minLength && value.length < rules.minLength) {
    return rules.messages.minLength;
  }

  // 检查最大长度
  if (rules.maxLength && value.length > rules.maxLength) {
    return rules.messages.maxLength;
  }

  // 检查单个正则表达式模式
  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.messages.pattern;
  }

  // 检查多个正则表达式模式
  if (rules.patterns) {
    for (const { pattern, message } of rules.patterns) {
      if (!pattern.test(value)) {
        return message;
      }
    }
  }

  // 运行自定义验证函数
  if (rules.validate) {
    const error = rules.validate(value);
    if (error) return error;
  }

  return "";
};

const useFormValidation = (initialData) => {
  const [inputData, setInputData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({ ...prevData, [name]: value }));
    validateSingleField(name, value);
  };

  // 验证整个表单
  const validateForm = (data = inputData) => {
    const newErrors = {};
    Object.keys(data).forEach((field) => {
      const error = validateField(field, data[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setIsValid(valid);
    return valid;
  };

  // 验证单个字段
  const validateSingleField = (name, value) => {
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
    return !error;
  };

  // 重置错误状态
  const resetErrors = () => {
    setErrors({});
    setIsValid(false);
  };

  // 获取特定字段的错误信息
  const getFieldError = (fieldName) => {
    return errors[fieldName] || "";
  };

  // 提交表单时验证
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      // 处理提交逻辑
    }
  };

  return {
    inputData,
    setInputData,
    errors,
    isValid,
    handleChange,
    validateForm,
    validateSingleField,
    resetErrors,
    getFieldError,
    handleSubmit,
  };
};

export default useFormValidation;
