import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
          <Link to="/terms" className="hover:text-gray-900 transition-colors text-center sm:text-left">
            Terms of Service
          </Link>
          <Link to="/privacy" className="hover:text-gray-900 transition-colors text-center sm:text-left">
            Privacy Policy
          </Link>
          <Link to="/help" className="hover:text-gray-900 transition-colors text-center sm:text-left">
            Help & FAQ
          </Link>
          <Link to="/support" className="hover:text-gray-900 transition-colors text-center sm:text-left">
            Contact Support
          </Link>
        </nav>
        <p className="mt-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} WorkerMatch. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
