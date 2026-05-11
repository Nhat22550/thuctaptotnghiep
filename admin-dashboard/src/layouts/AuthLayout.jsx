import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="w-full max-w-lg px-6">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
