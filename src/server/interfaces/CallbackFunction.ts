type CallbackFunction = (response: {
  success: boolean;
  message?: string;
  [key: string]: any;
}) => void;

export default CallbackFunction;
