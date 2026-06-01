const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
      {message}
    </p>
  );
};

export default ErrorMessage;